---
title: "유튜브 클론코딩(10)"
date: 2022-07-01 23:01:00 +0900
categories: clone-youtube
toc : true
---

## 요약

1일 1포스트를 작성하려고 하다 보니, 지금까지 작성한 글이 깔끔하게 정리되지 않아서, 앞으로는 늦더라도 깔끔하게 작성할 예정이다.  
오늘은 어느정도 정리가 된 로그인 예제 구현을 가져왔다 :)

1. auth0 react 로그인
2. auth0 node.js(express) 로그인 확인

마주쳤던 문제  
- 프론트에서 로그인을 하고 어떻게 백엔드에서 인증 여부를 파악하지?  
  jwt는 그 자체로 인증정보를 담고 있기에 서버에서 상태를 가지고 있을 필요가 없다.  
  즉, http 통신에서 jwt를 전달하고, 이 jwt가 올바른 jwt인지 백엔드에서 확인하면 된다.  

## React 로그인

[auth0-react](https://github.com/auth0/auth0-react)를 활용하여 auth0과 연동된 React 로그인 예제를 작성할 것이다.  

먼저 auth0에서 Application을 만들고 설정한다.
 - Create Application 클릭
 - Quick start에서 React 선택
 - Allowed Callback URLs 설정
 - Allowed Logout URLs 설정
 - Allowed Web Origins 설정
일단 URL, Origins 설정란에 `http://localhost:3000`로 작성해두었다.  

```shell
npm install @auth0/auth0-react
```
domain과 clientId는 공개되도 상관없지만, 그래도 파일로 따로 나누어 gitignore에 추가하기로 했다.  
(Client Secret은 절대 공개되어서는 안된다. jwt를 생성할 때 사용됨)  
`auth0-config.secret.json`  
```json
{
  "domain": "{Application의 Domain}",
  "clientId": "{Application의 Client ID}",
  "audience": "{API의 Identifier}"
}
```

Auth0Provider를 통해서 auth0을 사용하는 컴포넌트를 감싸준다.  
`index.ts`
```ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import authconfig from './auth0-config.secret.json';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Auth0Provider
    domain={authconfig.domain}
    clientId={authconfig.clientId}
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>
);
```
`LoginButton, LogoutButton, Profile`컴포넌트는 예제에서 가져왔다.  
추가한 부분은 `App`컴포넌트에서 accessToken을 가져와서 나타내는 부분이다.  
이 토큰과 insomnia를 통해서 백엔드 api에 대해 로컬에서 인증이 필요한 api에 대해 테스트를 할 수 있었다.  
```tsx
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import authConfig from './auth0-config.secret.json';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading || user === undefined) return <div>Loading ...</div>;

  if(!isAuthenticated) return <div>Auth required</div>
  
  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
};

const App = () => {
  const { isLoading, error, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string>();
  useEffect(() => {
    async function getAccessToken() {
      setAccessToken(await getAccessTokenSilently());
    }
    getAccessToken()
  }, [isAuthenticated])

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  if (!isAuthenticated) {
    return <div>
      Authenticated : {accessToken}
      <LoginButton/>
      </div>
  }

  return (
    <div>
      Authenticated
      <Profile/>
      <LogoutButton/>
    </div>
  );
};

export default App;
```

`/api/public`과 `/api/private` 엔드포인트에 대해서는 아래 node.js파트에서 작성한다.  

```tsx
const Public = () => {
  const [result, setResult] = useState<string>();
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:8000/api/public', {
          method: 'GET',
        });
        setResult((await response.json()).message);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  console.log(result)

  if(!result) return <div>Public : Loading...</div>;

  return <div>Public : {result}</div>
}

const Private = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: authConfig.audience,
        });
        console.log(`Bearer ${token}`);
        const response = await fetch('http://localhost:8000/api/private', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
        });
        setPosts((await response.json()).message);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div>{posts}</div>
  );
};
```


## Node.js(Express) 로그인 확인

auth0 예제에 있는 [express-oauth2-jwt-bearer](https://github.com/auth0/node-oauth2-jwt-bearer/tree/main/packages/express-oauth2-jwt-bearer)를 사용하기로 했다.  

이 미들웨어를 통해서 인증되지 않은 사용자의 경우, private api에 접근하는 것을 막는 부분을 쉽게 방지할 수 있었다.  

req.auth?.payload.sub은 user ID가 담겨있는 정보라 DB와 연동할 때 사용하게 되는 정보로,  
`google-oauth2|123456789`, `auth0|987654321` 이런 형태로 구성되어 있다.  
이 값으로 DB에서 User과 연동시켜야겠다.  
```ts
import express from 'express'
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
import authconfig from './auth0-config.secret.json';

const app = express()
const port = 8000

// CORS, cors패키지 사용해도 됨
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow CORS, React App URL
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'authorization');
  next();
});

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: authconfig.audience,
  issuerBaseURL: `https://${authconfig.domain}`,
});

app.head('/api', (req, res) => {
  res.sendStatus(200);
})

// 인증이 필요 없는 route
app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// 인증이 필요한 route
app.get('/api/private', checkJwt, function(req, res) {
  console.log(req.auth?.payload.sub)
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

const checkScopes = requiredScopes('read:messages');
app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

app.listen(port, () => {
  console.log(`Server open at ${port}`)
})
```

## 마지막
___

jwt를 직접 구현해볼 생각이였는데, 생각도 못한 auth0 회원가입으로 가시밭길에 냅다 앉아버렸다..  
무료기간 지나기 전에 빨리 구현해서 사용해봐야지ㅠㅠ  

### 앞으로 할 것들 (진행 과정 중)
() 괄호 안 숫자는 우선순위  

- (1)DB-Auth0 사용자 연동
- (1)백엔드 API 작성

### 앞으로 할 것들 (진행 과정 이후)

- Polymorphic Associations 디자인 사용해서 이쁘게 구조 변경
- https 추가 (ssl은 [let's encrypt](https://letsencrypt.org/ko/))
- Docker 추가
- auth0 만료되기 전 -> jwt구현 or 다른 라이브러리 적용