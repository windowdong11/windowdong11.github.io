import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { format } from 'date-fns';

// 현재 실행 위치에서 Jekyll `_posts` 디렉터리 경로 설정
const POSTS_DIR = path.resolve(process.cwd(), '_posts');

// 소문자 변환 및 공백을 언더바로 치환하는 함수
const sanitize = (str) => str.toLowerCase().replace(/\s+/g, '_');

async function main() {
    try {
        // Step 1: 포스트 제목 요청
        const { title } = await inquirer.prompt([
            { name: 'title', type: 'input', message: 'Post title:' },
        ]);

        if (!title.trim()) {
            console.error('❌ Title is required.');
            return;
        }

        // Step 2: 카테고리 요청
        // `_posts` 폴더 하위의 폴더명을 가져오기
        const categories = fs.readdirSync(POSTS_DIR, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        const { category } = await inquirer.prompt([
            {
                name: 'category',
                type: 'list',
                message: 'Choose a category or create a new one:',
                choices: [...categories, 'Create new category'],
            },
        ]);

        let selectedCategory = category;

        // 새로운 카테고리 생성
        if (category === 'Create new category') {
            const { newCategory } = await inquirer.prompt([
                { name: 'newCategory', type: 'input', message: 'Enter new category name:' },
            ]);

            if (!newCategory.trim()) {
                console.error('❌ Category name is required.');
                return;
            }

            selectedCategory = newCategory;
        }

        // Step 3: 파일 경로 및 내용 생성
        const sanitizedCategory = sanitize(selectedCategory);
        const sanitizedTitle = sanitize(title);
        const date = new Date();
        const datePrefix = format(date, 'yyyy-MM-dd');
        const time = format(date, 'yyyy-MM-dd HH:mm:ss');
        const filePath = path.join(POSTS_DIR, sanitizedCategory, `${datePrefix}-${sanitizedTitle}.md`);

        // 카테고리 디렉터리가 없는 경우 생성
        await fs.ensureDir(path.dirname(filePath));

        // Markdown 파일 내용
        const content = `---
title: "${title}"
date: ${time} +0900
categories: ${selectedCategory}
toc : true
---
# ${title}
`;

        // 파일 생성
        await fs.writeFile(filePath, content);

        console.log(`✅ Post created at: ${filePath}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
