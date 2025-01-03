import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

const LAST_WORKING_DATA_FILE = path.resolve(process.cwd(), 'utils', 'last_working_data.json');

async function main() {
    try {
        let postPath;
        let postFile;
        let category;

        // Check if last working file exists
        if (fs.existsSync(LAST_WORKING_DATA_FILE)) {
            const lastWorkingData = await fs.readJson(LAST_WORKING_DATA_FILE);
            const { runLastFile } = await inquirer.prompt([
                {
                    name: 'runLastFile',
                    type: 'confirm',
                    message: `Do you want to run for the last working file (${lastWorkingData.lastWorkingFile})?`,
                },
            ]);

            if (runLastFile) {
                postPath = lastWorkingData.lastWorkingFile;
                postFile = path.basename(postPath);
                category = path.basename(path.dirname(postPath));
            }
        }

        if (!postPath) {
            const postsDir = path.resolve(process.cwd(), '_posts');
            // 1) Get categories from subfolders
            const categories = fs.readdirSync(postsDir, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);

            const categoryPrompt = await inquirer.prompt([
                {
                    name: 'category',
                    type: 'list',
                    message: 'Select a category:',
                    choices: categories
                },
            ]);

            category = categoryPrompt.category;
            const categoryPath = path.join(postsDir, category);
            // 2) Sort markdown files by last modified time
            const mdFiles = fs.readdirSync(categoryPath)
                .filter((file) => file.endsWith('.md'))
                .map((file) => ({
                    name: file,
                    time: fs.statSync(path.join(categoryPath, file)).mtime.getTime(),
                }))
                .sort((a, b) => b.time - a.time)
                .map((f) => f.name);

            if (!mdFiles.length) {
                console.error('❌ No posts in this category.');
                return;
            }

            const postFilePrompt = await inquirer.prompt([
                {
                    name: 'postFile',
                    type: 'list',
                    message: 'Select a post:',
                    choices: mdFiles,
                },
            ]);

            postFile = postFilePrompt.postFile;
            postPath = path.join(categoryPath, postFile);
        }

        const postName = path.basename(postFile, '.md'); // e.g. "2023-06-22-hello_world"
        // 3) Move images
        const currentDir = path.dirname(postPath);
        const destDir = path.resolve(process.cwd(), 'assets', 'images', category, postName);
        await fs.ensureDir(destDir);

        const images = fs.readdirSync(currentDir).filter((file) =>
            file.match(/\.(png|jpg|jpeg|gif|svg)$/i)
        );
        for (const img of images) {
            await fs.move(path.join(currentDir, img), path.join(destDir, img), { overwrite: true });
        }

        // 4) Replace references
        let content = await fs.readFile(postPath, 'utf8');
        const newPath = `/assets/images/${category}/${postName}`;
        content = content.replace(
            /(<img\s+[^>]*src\s*=\s*["'])(?!\/assets|http)([^"']+)(["'])/g,
            `$1${newPath}/$2$3`
        );
        content = content.replace(
            /(\!\[.*?\]\()(?!\/assets|http)([^\)]+)(\))/g,
            `$1${newPath}/$2$3`
        );

        await fs.writeFile(postPath, content);

        console.log(`✅ Images moved and references updated for: ${postFile}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
