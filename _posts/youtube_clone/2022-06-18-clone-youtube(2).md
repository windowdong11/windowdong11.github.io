---
title: "유튜브 클론코딩(2)"
date: 2022-06-18 11:51:00 +0900
categories: clone-youtube
toc : true
---

## 개발 환경

1. db : postgreSQL  
   NoSQL인 mongoDB를 사용할까 생각했는데, 너무 편한 것만 쫓는 것 같아서 SQL로 가기로 했다.  
2. 백엔드 : node.js + typescript  
3. 웹 프론트 : react + typescript  

일단 이번에는 구현이 목적이니 최대한 간단하게 하려는 목적 +(sql사용해보기)

## PostgreSQL 설치 (14.4, current)
___
```
$ brew install postgres
$ postgres -V
postgres (PostgreSQL) 14.4
$ psql postgres
postgres-# \du
                                    List of roles
  Role name  |                         Attributes                         | Member of 
-------------+------------------------------------------------------------+-----------
  {사용자 이름} | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
postgres-# \password {사용자 이름}
Enter new password for user "{사용자 이름}": 
Enter it again: 
postgres-# \q
```

## SQL 테이블 작성 (User, Channel, Video, Post, Comment, Image만)

일단은 모든 id를 `varchar(30)`이 아닌 `serial`(정수형)타입으로 작성하는 것이 구현하기 편할 것 같다.  
![ERD](/assets/images/youtube_clone/youtube-erd.svg)
### User
___
변경사항  
1. 구글 계정의 이름과 채널의 이름을 다르게 할 수 있는 부분이 확인되어서, user_name을 추가하기로 했다. 
2. integer에서 serial로 변경하기로 했다. serial은 기본적으로 auto increment 속성을 가지기 때문이다. [numeric types](https://www.postgresql.org/docs/14/datatype-numeric.html)
3. email은 text타입이 적합할 것이다.  
수많은 형태의 이메일이 존재하기에 인증 메일을 통한 인증 전까지 맞는 이메일인지 확인할 수 없어서, 이메일을 평문으로 저장하기로 했다.
4. password도 text타입으로 결정했는데, [pgcrypto](https://www.postgresql.org/docs/current/pgcrypto.html)에 관한 문서를 참고해서 결정했다.  
5. user테이블은 이름 때문인지 생성이 불가능해서 website_user으로 변경했다.

[Primary key](https://www.postgresql.org/docs/11/ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS)를 사용해서 고유 id를 나타내도록 했다.  
이것은 다른 관계를 표현하기 위해 사용할 것이다.  

이후 `created_at`와 `updated_at`를 생성할 때와 수정할 때, 자동으로 변경되고, 생성일이 유지될 수 있도록 함수와 트리거를 작성할 것이다. (다른 모든 테이블에도 적용할 것)

```sql
CREATE TABLE website_user (
  user_id serial PRIMARY KEY,
  user_name varchar(50) NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  is_authorized boolean NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL
);
```

### Channel
___

[Foreign Key](https://www.postgresql.org/docs/11/ddl-constraints.html#DDL-CONSTRAINTS-FK)를 통해서 user과 channel의 1:1 관계를 나타냈다.  


```sql
CREATE TABLE channel (
  channel_id serial PRIMARY KEY,
  user_id serial REFERENCES website_user (user_id),
  channel_name varchar(50) NOT NULL,
  updated_at timestamp NOT NULL
);
```

### Video

원래는 enum으로 하려고 했는데, enum은 나중에 수정이(값 추가/삭제) 번거로울 것 같아서, video_type을 나타내는 테이블을 따로 생성했다.  
original과 shorts를 추가하고, `SELECT * FROM video_type`를 통해서 값이 잘 들어갔는지 확인했다.  
항상 0 이상인 값인지 확인하는 `positive_bigint`를 도메인으로 만들어주고, 조회수(`views`)의 타입을 설정해줬다.

```sql
CREATE TABLE video_type (
  video_type_id smallserial PRIMARY KEY,
  video_type_text varchar(10)
);
INSERT INTO video_type (video_type_text) VALUES ('original');
INSERT INTO video_type (video_type_text) VALUES ('shorts');
SELECT * FROM video_type; 

CREATE DOMAIN positive_bigint AS biginteger CHECK (VALUE >= 0);
CREATE TABLE video (
  video_id serial PRIMARY KEY,
  source text NOT NULL,
  views positive_bigint NOT NULL DEFAULT 0,
  description text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL,
  --[2022-06-21 수정]
  -- 타입을 잘못 적었다. 4번째 포스트에서 수정
  -- video_type_id serial REFERENCES video_type(video_type_id)
  video_type_id smallserial REFERENCES video_type(video_type_id)
);
```

### Post
___

```sql
CREATE TABLE post (
  post_id serial PRIMARY KEY,
  content_text text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL
);
```

### Comment
___

```sql
CREATE TABLE comment (
  comment_id serial PRIMARY KEY,
  content_text text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL
);
```

### Image

```sql
CREATE TABLE image (
  image_id serial PRIMARY KEY,
  source text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL
);
```

## 마무리
___

이제 관계만 정의해주고, 함수, 트리거 작성하고 백엔드로 넘어가면 되겠다!