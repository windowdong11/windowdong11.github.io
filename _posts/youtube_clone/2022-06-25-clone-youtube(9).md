---
title: "유튜브 클론코딩(9)"
date: 2022-06-25 23:25:00 +0900
categories: clone-youtube
toc : true
---

## 요약

1. 백엔드 테스트 환경 구축

## 백엔드 테스트 환경 구축
___

빌드 없이 node v18 test runner 사용하는 방법에 관한 [issue](https://github.com/TypeStrong/ts-node/discussions/1811#discussioncomment-3010783)

node v18에 test runner 내장 기능이 추가되었다. [문서](https://nodejs.org/dist/latest-v18.x/docs/api/test.html)  
그 전에는 jest등 외부 패키지를 사용했지만, 이 기능을 사용해서 테스트 코드를 작성할 수 있다.  
현재는 실험적 기능이다.  

테스트 코드 파일의 이름 생성 규칙을 `*.test.ts`로 정하고, typescript를 javascript로 빌드할 때, 포함되지 않도록 `tsconfig.build.json`를 작성할 것이다.  
> tsconfig.json에 작성하지 않는 이유  
> vscode에서 tsconfig.json기준으로 인식하기에, exclude를 포함시키는 경우, 모듈을 import하는 데에서 오류가 발생한다.  
> 따라서, exclude를 tsconfig.build.json에 포함시키고 extends를 통해서 tsconfig.json에서 설정을 불러올 것이다.  
> 결과적으로 vscode에서는 exclude된 것을 알 수 없고,
> 빌드할 때 tsconfig.build.json의 exclude로 인해 테스트 파일들은 js로 변환되지 않는다.
```json
{
  "compilerOptions": {/*...(생략)*/},
  "exclude": ["src/**.test.ts"]
}
```

`package.json`내용에 test 스크립트를 추가  
```json
{
  //... (생략)
  "scripts": {
    "start": "tsc-watch --noClear -p ./tsconfig.build.json --onSuccess \"node ./dist/src/index.js\"",
    "test": "node --test --require ts-node/register src/**.test.ts"
  },
  //... (생략)
}
```


문서에 작성된 예시를 그대로 가져와서 가장 기본적인 테스트 코드를 작성하고, 실행해보면,   
`src/pass.test.ts`  
```ts
import assert from "node:assert";
import test from "node:test";

test('synchronous passing test', (t) => {
  assert.strictEqual(1, 1);
});
```
`src/fail.test.ts`  
```ts
import assert from "node:assert";
import test from "node:test";

test('synchronous fail test', (t) => {
  assert.strictEqual(1, 2);
});
```

```
~> npm test

> youtube-clone-back@1.0.0 test
> node --test --require ts-node/register ./src/**.test.ts

TAP version 13
not ok 1 - /Users/wondong-gyu/youtube-clone/youtube-clone-back/src/fail.test.ts
  ---
  duration_ms: 0.618648458
  failureType: 'subtestsFailed'
  exitCode: 1
  stdout: |-
    TAP version 13
    not ok 1 - synchronous fail test
      ---
      duration_ms: 0.010590083
      failureType: 'testCodeFailure'
      error: |-
        Expected values to be strictly equal:
        
        1 !== 2
        
      code: 'ERR_ASSERTION'
      stack: |-
        TestContext.<anonymous> (/Users/wondong-gyu/youtube-clone/youtube-clone-back/src/fail.test.ts:5:10)
        Test.runInAsyncScope (node:async_hooks:203:9)
        Test.run (node:internal/test_runner/test:342:20)
        Test.start (node:internal/test_runner/test:294:17)
        Test.test (node:internal/test_runner/harness:126:18)
        Object.<anonymous> (/Users/wondong-gyu/youtube-clone/youtube-clone-back/src/fail.test.ts:4:5)
        Module._compile (node:internal/modules/cjs/loader:1112:14)
        Module.m._compile (/Users/wondong-gyu/youtube-clone/youtube-clone-back/node_modules/ts-node/src/index.ts:1597:23)
        Module._extensions..js (node:internal/modules/cjs/loader:1166:10)
        Object.require.extensions.<computed> [as .ts] (/Users/wondong-gyu/youtube-clone/youtube-clone-back/node_modules/ts-node/src/index.ts:1600:12)
      ...
    1..1
    # tests 1
    # pass 0
    # fail 1
    # skipped 0
    # todo 0
    # duration_ms 0.6007825
    
  stderr: |-
    (node:34276) ExperimentalWarning: The test runner is an experimental feature. This feature could change at any time
    (Use `node --trace-warnings ...` to show where the warning was created)
    
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
ok 2 - /Users/wondong-gyu/youtube-clone/youtube-clone-back/src/pass.test.ts
  ---
  duration_ms: 0.597262333
  ...
1..2
# tests 2
# pass 1
# fail 1
# skipped 0
# todo 0
# duration_ms 0.769272416
```

예상한대로 `fail.test.ts`파일은 실패하고 나머지는 정상적으로 잘 통과했다.  

## 로그인 구현 준비
___

로그인 구현에 대해 알아보면서, cookie, session, jwt, Oauth를 알아보다가 auth0에 가입했는데,  
무료로 여러 기능들을 사용할 수 있는 기간이 22일 주어져서 갑자기 auth0으로 구현해보기로 했다.  
(jwt 라이브러리 써서 하려고 했는데 눈 떠보니 api)  

우선 프론트엔드와 백엔드 모두 포함해서 로그인 부분과 인증이 필요한 API 중 하나만 빠르게 만들어서 테스트 해야겠다.

### Create-React-App(CRA)

CRA를 사용해서 리액트를 만들어보자  
```sh
npx create-react-app youtube-clone-front --template typescript
```


## 마지막
___

포스트가 조금 짧지만, 남은 시간동안 auth0에 대해서 알아보고,  
다음 포스트에서 리액트에서 auth0 사용방법을 다룰 것이다.  

### 앞으로 할 것들 (진행 과정 중)
() 괄호 안 숫자는 우선순위  

- (1)리액트 auth0 연결
- (1)백엔드 auth0 연결
- (2)백엔드 API 작성

### 앞으로 할 것들 (진행 과정 이후)

- Polymorphic Associations 디자인 사용해서 이쁘게 구조 변경
- https 추가 (ssl은 [let's encrypt](https://letsencrypt.org/ko/))
- Docker 추가