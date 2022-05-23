---
title: "React 한권 끝내기 (1)"
date: 2020-10-20 14:05:00 +0900
categories: Tutorial-React
toc : true
---

## 시작 전 준비

저는 visual studio code를 사용했고, 확장으로는 여러가지가 있겠지만 초반에는 live server를 사용하겠습니다.  
(live server : 처음에만 사용할거에요우)

## 다른 도움 없이 React 시작하기

1. ```index.html```을 생성  

```html  
<html>
    <body>
    <h2>My React Tutorial 1</h2>
    <div id="react-root"></div>
    <script src="https://unpkg.com/browse/react@16.14.0/umd/react.development.js"></script>
    <script src="https://unpkg.com/browse/react@16.14.0/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/browse/react-dom@16.14.0/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/browse/react-dom@16.14.0/umd/react-dom.production.min.js"></script>
    <script src="./index.js"></script>
    </body>
</html>
```

2. ```index.js```를 생성

```js
function LikeButton(){
    const [liked, setLiked] = React.useState(false)
    const text = liked ? "싫어요" : "좋아요"
    const props = {
        onClick : () => {setLiked(!liked)},
        style : {  
        backgroundColor: liked? "gray" : "red"
        }
    }
    return React.createElement(
        'button',
        props,
        text
    )
}
const domContainer = document.querySelector('#react-root')
ReactDOM.render(React.createElement(LikeButton), domContainer)
```

3. index.html을 웹브라우저로 열어보기 (또는 vsc에서 liveserver로 열어보기)  
좋아요 버튼 페이지가 나온다!  
버튼 클릭 전 : ![클릭전](/assets/images/ReactTutorial/day1/좋아요클릭전.PNG)  
버튼 클릭 후 : ![클릭후](/assets/images/ReactTutorial/day1/좋아요클릭후.PNG)

## 지금까지 작성한 코드 (짧게)

1. React를 사용하기 위한 4가지의 스크립트를 포함시켰다.
2. react-root라는 id를 가진 div를 만들어주었다.
3. LikeButton이라는 함수형 컴포넌트를 만들어주었다.
4. react-root라는 id를 가진 element를 찾아서 LikeButton을 렌더링했다.

## 지금까지 작성한 코드

> react-root : React에서 렌더링할 때 사용될 DOM 요소, React는 이 안에 DOM요소를 추가함  
> LikeButton : 좋아요 버튼 컴포넌트  
> createElement : React 요소를 생성  
> createElement(component, props, ...children)
> useState : React Hook

### 컴포넌트(LikeButton)

(컴포넌트 : 독립적인 기능을 가진 모듈, "어디에서든 다시 쓸 수 있는 재사용성이 중요")  
컴포넌트에는 두가지 종류가 있는데 클래스형(class) 컴포넌트와 함수형(function) 컴포넌트가 존재한다.  
LikeButton은 당연히 함수형!  

### React Hook(useState)

함수형 컴포넌트에서만 쓸 수 있다.  
클래스형 컴포넌트에는 이미 같은 기능이 존재해서 필요가 없다.
클래스형 컴포넌트를 사용하다가 복잡해서 만들었다고 한다.  
https://ko.reactjs.org/docs/hooks-intro.html < 여기에 만들게 된 이유가 적혀있다

### LikeButton을 class형 컴포넌트로 바꿔보면?

```
liked => this.state.liked
setLiked(value) => this.setState({liked : value})
```

```js
class LikeButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            liked: false
        }
    }
    render() {
        const text = this.state.liked ? "싫어요" : "좋아요"
        const props = {
            onClick: () => this.setState({ liked: !this.state.liked }),
            style: {
                backgroundColor: this.state.liked ? "gray" : "red"
            }
    }
    return React.createElement(
        'button',
        props,
        text
    )
  }
}
```

## 마지막. 의문점? React는 편의를 위한게 아니였나? 불편한데?
1. React.createElement도 그렇고 불편하지 않은가? (맞지..)  
React는 분명 편하라고 만들었을텐데..?  
그래서 JSX문법이라고 html비스무리한게 있는데 JSX로 작성하면 엄청 편하다.  
2. 리액트 스크립트를 추가하고 이것저것 만드는게 진입장벽이 있지 않나? (이것도 맞지)  
그래서 페북에서 create-react-app(CRA)라고 만들어서 진입장벽을 없앴다.

오늘 포스트는 약간의 불편함을 느끼기 위한 포스트였고,  
다음 포스트는 그 약간의 불편함 조차 해소하는 포스트가 되겠다.

## 다음 포스트

+ React.createElement? 너무 길고, 불편하다! 간단한 JSX문법을 써보자(with Babel)
+ React가 편한게 아니였나? 맞다! (with CRA)
+ CRA와 npm 스크립트
+ 더 있을까?