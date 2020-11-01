---
title: "React 한권 끝내기 (2)"
date: 2020-10-31 14:05:00 +0400
categories: Tutorial-React
toc : true
---

## JSX문법 적용(babel)

```js
function LikeButton() {
  const [liked, setLiked] = useState(false)
  const text = liked? "싫어요" : "좋아요"
  const props = {
    onClick: () => setLiked(!liked),
    style: {
      backgroundColor: liked ? "gray" : "red"
    }
  }
//   return React.createElement(
//     'button',
//     props,
//     text
//   )
  return <button {...props}>{text}</button>
}
```

JSX문법으로 변경한 부분 커밋 : [Commit 0d78137](https://github.com/windowdong11/ReactTutorial/commit/0d78137af2a55171a4abb3c28f600152399aee1f)

## Create-React-App(CRA)

리액트 진입장벽 때문에 페이스북? 맞나 (암튼 여기서 만듬)

```npx create-react-app appname```을 통해서 생성되는데 ```appname```폴더에 들어가서 App.js안에 파일들을 만지작 만지작 하면 된다.

App.js안에 위에서 작성한 ```LikeButton```을 작성하고 이런형태로 작성하면 된다.  
원래대로면 파일 분리해서 컴포넌트는 따로 작성하겠지만, 지금은 여기에 다 작성하겠음!

```js
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LikeButton></LikeButton>
      </header>
    </div>
  );
}
```

## npm script

```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
```

package.json에 가면 이런 부분이 있는데 npm script들이 적혀있다.  

+ start : 개발모드로 실행
+ build : 빌드
+ test : 테스트 코드 실행
+ eject : 설정파일 추출  

## npm start

개발모드로 실행되며 https 환경이 필요하다면, 아래 명령어에 따라 실행 가능하다.

맥 : ```HTTPS=true npm start```  
윈도우 : ```set HTTPS=true && npm start```

## npm run build

```npm run build``` 배포 환경에서 사용할 파일을 만듬  
```npx serve -s build```를 통해서 서버를 띄울 수 있다.  

## npm test

```npm test``` 테스트 코드 실행  

아래 파일들은 테스트 파일로 인식된다.  

+ \_\_tests__폴더 아래에 있는 모든 js파일
+ .test.js로 끝나는 파일
+ .spec.js로 끝나는 파일

## npm eject

```npm run eject```는 내부 설정 파일이 밖으로 노출되어서 바벨이나 웹팩의 설정을 추출한다.

## 코드 분할

대부분 컴포넌트별로 분할한다.

위에서의 경우에는 App.js에 작성한 LikeButton을 분리한다.

코드 분할 커밋 : [b616947](https://github.com/windowdong11/ReactTutorial/commit/b6169477a64c3413fd602cbceebc1198805ccc34)

## 환경변수

환경변수는 ```process.env.{환경변수 이름}```의 형태로 환경변수를 사용할 수 있다.  
개발, 테스트, 배포에 따라서 다른 환경변수를 사용할 수 있다.  

```npm start```등으로 시작할때 환경변수를 입력할 수 있지만, 파일로 하는게 편해서 파일로 하는 방법만 써놔야지^_^

파일명

+ .env.development : 개발모드에서 사용되는 환경변수들
+ .env.test : 테스트모드에서 사용되는 환경변수들
+ .env.production : 배포모드에서 사용되는 환경변수들

환경변수 이름은 ```REACT_APP_```으로 시작해야한다.

개발모드에서 사용되는 환경변수 파일 예시

```js
// .env.production 파일
REACT_APP_SERVER = localhost:5000/graphql/
```

환경변수 추가 커밋 : [5da4a1c](https://github.com/windowdong11/ReactTutorial/commit/5da4a1c139e3be5934cce6d64603c98631297f74)