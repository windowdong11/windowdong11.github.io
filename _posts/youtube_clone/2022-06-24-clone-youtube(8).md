---
title: "유튜브 클론코딩(8)"
date: 2022-06-24 23:45:00 +0900
categories: clone-youtube
toc : true
---

## 요약

1. api 설계
2. 백엔드 환경 구축

## api 설계

사용자
| 기능     | method | url    | request      | response  | header                               |
| -------- | ------ | ------ | ------------ | --------- | ------------------------------------ |
| 로그인   | post   | login  | id, password | jwt-token |                                      |
| 로그아웃 | post   | logout |              |           | Authorization : 'Bearer {jwt-token}' |

채널
| 기능                      | method | url                             | request        | response | header |
| ------------------------- | ------ | ------------------------------- | -------------- | -------- | ------ |
| 업로드한 동영상 목록      | get    | /channel/{channel_id}/videos    | last_video_id? | videos[] |        |
| 업로드한 커뮤니티 글 목록 | get    | /channel/{channel_id}/community | last_post_id?  | post[]   |        |



유튜브의 경우 upload url이 https://upload.youtube.com/upload로 되어 있다.  
우리가 흔히 쓰는 유튜브는 https://youtube.com/, 스튜디오에서 사용하는 주소는 https://studio.youtube.com/  
하지만, 여기서는 하나의 도메인으로 진행할 것이다.  
유튜브는 영상을 새로운 영상으로 업로드 하는 것을 지원하지 않음.  
영상
| 기능          | method | url             | request        | response     | header                              |
| ------------- | ------ | --------------- | -------------- | ------------ | ----------------------------------- |
| 업로드        | post   | video(formData) | video          | video_id     | content-type: 'multipart/form-data' |
| 최근 영상목록 | get    | videolist       | last_video_id? | video_data[] |                                     |
| 시청          | get    | video           | video_id       | 파일         |                                     |
| 삭제          | delete | video           | video_id       |              |                                     |

유튜브는 댓글과 덧글 작성을 분리해놨다. 하나의 기능만 넣는다는 생각으로 분리한건가 싶다.  
댓글
| 기능      | method | url     | request                         | response  | header |
| --------- | ------ | ------- | ------------------------------- | --------- | ------ |
| 댓글 작성 | post   | comment | comment_text                    |           |        |
| 댓글 삭제 | delete | comment | comment_id                      |           |        |
| 댓글 수정 | put    | comment | comment_id, comment_text        |           |        |
| 덧글 작성 | post   | reply   | comment_text, parent_comment_id |           |        |
| 덧글 삭제 | delete | reply   | comment_id, comment_text        |           |        |
| 덧글 수정 | put    | reply   | comment_id                      |           |        |
| 댓글 조회 | get    | comment | content_type, content_id        | comment[] |        |


커뮤니티 글
| 기능    | method | url  | request                            | response | header                              |
| ------- | ------ | ---- | ---------------------------------- | -------- | ----------------------------------- |
| 글 조회 | get    | post | content_id                         | post     |                                     |
| 글 작성 | post   | post | post_content(formData)             |          | content-type: 'multipart/form-data' |
| 글 수정 | put    | post | content_id, post_content(formData) |          | content-type: 'multipart/form-data' |
| 글 삭제 | delete | post | content_id                         |          |                                     |




## 백엔드 환경 구축

이미 nodejs, nvm이 설치 된 상태라, nvm을 이용해서 현재 최신 버전인 18.4.0을 설치해서 사용해 볼 예정이다.  
([test 모듈 자체 탑재](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V18.md#test-runner-module-experimental))

```shell
nvm install 18.4.0
nvm use 18.4.0
nvm current
v18.4.0
cd youtube-clone-back
npm init
npm install -D typescript ts-node tsc-watch @types/node @types/express
npm install express
``` 
(tsc-watch는 개발하면서 코드의 변경이 감지되면 다시 실행시켜주는 것, nodemon과 동일)  

`package.json` 내용
```json
{
  "scripts": {
    "start": "tsc-watch --noClear -p ./tsconfig.json --onSuccess \"node ./dist/index.js\"",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "windowdong11",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.13",
    "@types/node": "^18.0.0",
    "ts-node": "^10.8.1",
    "tsc-watch": "^5.0.3",
    "typescript": "^4.7.4"
  },
  "dependencies": {
    "express": "^4.18.1"
  }
}
```

`tsconfig.json` 내용
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022", 
    "lib": ["ES2022"], 
    "module": "commonjs", 
    "moduleResolution": "node", 
    "esModuleInterop": true, 
    "forceConsistentCasingInFileNames": true, 
    "strict": true, 
    "skipLibCheck": true,
    "outDir": "dist"
  }
}
```
```ts
// src/index.ts
import express from 'express'
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

```shell
npm start
> youtube-clone-back@1.0.0 start
> tsc-watch --noClear -p ./tsconfig.json --onSuccess "node ./dist/index.js"
----------------------
오후 11:44:49 - Starting compilation in watch mode...
오후 11:44:49 - Found 0 errors. Watching for file changes.
Example app listening on port 8000
```

그리고 이제 `http://localhost:8000`으로 접속하면 된다.

## 마지막
___

### 앞으로 할 것들 (진행 과정 중)
() 괄호 안 숫자는 우선순위  

- 백엔드 API 작성

### 앞으로 할 것들 (진행 과정 이후)

- Polymorphic Associations 디자인 사용해서 이쁘게 구조 변경
- https 추가 (ssl은 [let's encrypt](https://letsencrypt.org/ko/))
- Docker 추가