---
title: "typescript 기본 타입 추출(ts-morph)"
date: 2022-06-16 03:00:00 +0900
categories: typescript typescript-api ts-morph
toc : true
---

```ts
import { Project, SourceFile, InterfaceDeclaration } from "ts-morph";

const interfaceNames = ['InterfaceName']
console.log(generateInitialInterfaces(interfaceNames, "./tsconfig.json"))

function generateInitialInterfaces(interfaceNames: string[], tsconfigSrc: string) {
  const project = new Project({
    tsConfigFilePath: tsconfigSrc
  });
  
  const sourceFiles = project.getSourceFiles();
  return sourceFiles.reduce((prev, sourceFile) => {
    return {
      ...prev,
      ...getInterface(sourceFile, interfaceNames)
    }
  }, {})
}

function getInterface(sourceFile: SourceFile, interfaceNames: string[]) {
  return sourceFile.getInterfaces().reduce((prev : any, i) => {
    if (interfaceNames.some(name => name === i.getName()))
      prev[i.getName()] = generateInterface(i)
    return prev;
  }, {})
}

function generateInterface(i : InterfaceDeclaration ) {
  return i.getProperties().reduce((prev: any, p) => {
    const prop = p.getName()
    const type = p.getType().getText()
    if (type === 'number') {
      prev[prop] = Number();
    }
    else if (type === 'string') {
      prev[prop] = String()
    }
    else if (type === 'boolean') {
      prev[prop] = Boolean()
    }
    return prev
  },
    {}
  )
}
```