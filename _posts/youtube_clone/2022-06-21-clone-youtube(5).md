---
title: "유튜브 클론코딩(5)"
date: 2022-06-21 21:56:00 +0900
categories: clone-youtube
toc : true
---
## 요약

1. 구조 점검  
2. 불필요한 테이블 삭제  
3. init.sql 작성  

## 명령어 확인

```sql
\help -- SQL 구문에 대한 도움말
\? -- \{명령} 에 대한 도움말
```
`\?`를 통해 도움말을 보면, psql에서 vim스러운 터미널로 변한다.  

> vim에서는 `/{검색할 문자열}`으로 검색할 수 있다.  
> 테이블 관련 정보를 찾기 위해서는 `/table`을 검색해보자 (`n`으로 다음, `N`으로 이전)  
> `\dt[S+] [PATTERN]      list tables`를 찾을 수 있다.

## ERD 확인
___

타입 등 4번째 수정(ERD_진짜_최종.svg)  
![ERD](/assets/images/youtube_clone/youtube-erd-4.svg)  

## 테이블 확인
___

테이블 수는 17개 전부 잘 나온다.

```sql
mydb=# \dt
                 List of relations
 Schema |        Name        | Type  |    Owner    
--------+--------------------+-------+-------------
 public | channel            | table | wondong-gyu
 public | channel_subscriber | table | wondong-gyu
 public | comment            | table | wondong-gyu
 public | comment_dislikes   | table | wondong-gyu
 public | comment_likes      | table | wondong-gyu
 public | image              | table | wondong-gyu
 public | post               | table | wondong-gyu
 public | post_comment       | table | wondong-gyu
 public | post_dislikes      | table | wondong-gyu
 public | post_image         | table | wondong-gyu
 public | post_likes         | table | wondong-gyu
 public | video              | table | wondong-gyu
 public | video_comment      | table | wondong-gyu
 public | video_dislikes     | table | wondong-gyu
 public | video_likes        | table | wondong-gyu
 public | video_type         | table | wondong-gyu
 public | website_user       | table | wondong-gyu
(17 rows)
```

## primary key 확인
___

확인할 것
- 데이터 타입 : video_type_id는 smallint 그 외 integer
- NULLABLE : parent_comment_id를 제외하고는 모두 null이어야 함
- 기본값 : 모두 비워져 있어야 함

```sql
mydb=# SELECT c.table_name, c.column_name, c.data_type, c.is_nullable, c.column_default
  FROM information_schema.key_column_usage AS ccu
  JOIN information_schema.table_constraints AS tc
    ON ccu.constraint_name = tc.constraint_name
  JOIN information_schema.columns AS c
    ON ccu.table_name = c.table_name
    AND ccu.column_name = c.column_name
WHERE tc.constraint_type = 'PRIMARY KEY' AND c.table_schema = 'public';
  table_name  |  column_name  | data_type | is_nullable |                  column_default                   
--------------+---------------+-----------+-------------+---------------------------------------------------
 website_user | user_id       | integer   | NO          | nextval('website_user_user_id_seq'::regclass)
 video_type   | video_type_id | smallint  | NO          | nextval('video_type_video_type_id_seq'::regclass)
 channel      | channel_id    | integer   | NO          | nextval('channel_channel_id_seq'::regclass)
 video        | video_id      | integer   | NO          | nextval('video_video_id_seq'::regclass)
 post         | post_id       | integer   | NO          | nextval('post_post_id_seq'::regclass)
 comment      | comment_id    | integer   | NO          | nextval('comment_comment_id_seq'::regclass)
 image        | image_id      | integer   | NO          | nextval('image_image_id_seq'::regclass)
(7 rows)
```

## foreign key 확인
___

확인할 것 
- 참조 테이블의 이름
- 참조 컬럼의 이름
- 참조자 테이블의 이름
- 참조자 컬럼의 이름
- 데이터 타입 : video_type_id는 smallint 그 외 integer
- NULLABLE : parent_comment_id를 제외하고는 모두 null이어야 함
- 기본값 : 모두 비워져 있어야 함

```sql
mydb=# SELECT
    ccu.table_name AS parent_table_name,
    ccu.column_name AS parent_column_name,
    c.table_name AS child_table_name,
    c.column_name AS child_column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.columns AS c
      ON c.table_name = tc.table_name
      AND c.column_name = kcu.column_name
WHERE tc.constraint_type = 'FOREIGN KEY' ORDER BY parent_table_name, parent_column_name;
 parent_table_name | parent_column_name |  child_table_name  |   child_column_name   | data_type | is_nullable | column_default 
-------------------+--------------------+--------------------+-----------------------+-----------+-------------+----------------
 channel           | channel_id         | post               | channel_id            | integer   | NO          | 
 channel           | channel_id         | channel_subscriber | subscribed_channel_id | integer   | YES         | 
 channel           | channel_id         | channel_subscriber | subscriber_channel_id | integer   | YES         | 
 channel           | channel_id         | video_likes        | channel_id            | integer   | NO          | 
 channel           | channel_id         | video_dislikes     | channel_id            | integer   | NO          | 
 channel           | channel_id         | comment_likes      | channel_id            | integer   | NO          | 
 channel           | channel_id         | comment_dislikes   | channel_id            | integer   | NO          | 
 channel           | channel_id         | video              | channel_id            | integer   | NO          | 
 channel           | channel_id         | post_likes         | channel_id            | integer   | NO          | 
 channel           | channel_id         | post_dislikes      | channel_id            | integer   | NO          | 
 channel           | channel_id         | comment            | channel_id            | integer   | NO          | 
 comment           | comment_id         | post_comment       | comment_id            | integer   | NO          | 
 comment           | comment_id         | video_comment      | comment_id            | integer   | NO          | 
 comment           | comment_id         | comment_likes      | comment_id            | integer   | NO          | 
 comment           | comment_id         | comment            | parent_comment_id     | integer   | YES         | 
 comment           | comment_id         | comment_dislikes   | comment_id            | integer   | NO          | 
 image             | image_id           | post_image         | image_id              | integer   | NO          | 
 post              | post_id            | post_image         | post_id               | integer   | NO          | 
 post              | post_id            | post_likes         | post_id               | integer   | NO          | 
 post              | post_id            | post_dislikes      | post_id               | integer   | NO          | 
 post              | post_id            | post_comment       | post_id               | integer   | NO          | 
 video             | video_id           | video_dislikes     | video_id              | integer   | NO          | 
 video             | video_id           | video_likes        | video_id              | integer   | NO          | 
 video             | video_id           | video_comment      | video_id              | integer   | NO          | 
 video_type        | video_type_id      | video              | video_type_id         | integer   | NO          |
 (26 rows)
```

잘못된 부분들 고치기  
1. (포스트에는 없지만) 저번에 channel_subscriber의 컬럼들에 대해서 `NOT NULL` 제약조건을 지웠었는데, 다시 돌려놓지 않았다.  
2. video_type_id가 smallint가 아니다.
```sql
ALTER TABLE channel_subscriber ALTER subscribed_channel_id SET NOT NULL;
ALTER TABLE channel_subscriber ALTER subscriber_channel_id SET NOT NULL;
ALTER TABLE video ALTER video_type_id TYPE smallint;
```
다시 실행해보면 `parent_comment_id`를 제외하고 다 `NOT NULL`이 적용되었고, `video_type_id`도 `smallint`로 타입이 변경되었다.

## 그 외(데이터 값)
___

```sql
SELECT
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  tc.constraint_type
  FROM information_schema.key_column_usage AS ccu
  JOIN information_schema.table_constraints AS tc
    ON ccu.constraint_name = tc.constraint_name
  RIGHT JOIN information_schema.columns AS c
    ON ccu.table_name = c.table_name
    AND ccu.column_name = c.column_name
WHERE tc.constraint_type IS NULL AND c.table_schema = 'public';
  table_name  |   column_name   |          data_type          | is_nullable | column_default | constraint_type 
--------------+-----------------+-----------------------------+-------------+----------------+-----------------
 video        | source          | text                        | NO          |                | 
 video        | views           | integer                     | NO          | 0              | 
 video        | description     | text                        | NO          |                | 
 video        | created_at      | timestamp without time zone | NO          | now()          | 
 video        | updated_at      | timestamp without time zone | NO          | now()          | 
 website_user | user_name       | character varying           | NO          |                | 
 website_user | email           | text                        | NO          |                | 
 website_user | password_hash   | text                        | NO          |                | 
 website_user | is_authorized   | boolean                     | NO          |                | 
 website_user | created_at      | timestamp without time zone | NO          | now()          | 
 website_user | updated_at      | timestamp without time zone | NO          | now()          | 
 channel      | channel_name    | character varying           | NO          |                | 
 channel      | updated_at      | timestamp without time zone | NO          | now()          | 
 image        | source          | text                        | NO          |                | 
 image        | created_at      | timestamp without time zone | NO          | now()          | 
 image        | updated_at      | timestamp without time zone | NO          | now()          | 
 video_type   | video_type_text | character varying           | YES         |                | 
 post         | content_text    | text                        | NO          |                | 
 post         | created_at      | timestamp without time zone | NO          | now()          | 
 post         | updated_at      | timestamp without time zone | NO          | now()          | 
 comment      | content_text    | text                        | NO          |                | 
 comment      | created_at      | timestamp without time zone | NO          | now()          | 
 comment      | updated_at      | timestamp without time zone | NO          | now()          | 
(23 rows)
```  

어라? `video_type_text`에 `NOT NULL`을 넣어주지 않았었다.  
```sql
ALTER TABLE video_type ALTER video_type_text SET NOT NULL;
```

## 마지막
___

7 + 26 + 23 = 56 컬럼인데 ERD에는 55컬럼이다.  
확인해보니 foregin key를 쿼리하는 과정에서 `comment_id`에 대해서 PRIMARY KEY, FOREGIN KEY 각 분류마다 하나씩 생성된 것으로 보인다. (쿼리가 완벽하지 못함)  
```
 parent_table_name | parent_column_name |  child_table_name  |   child_column_name   | data_type | is_nullable | column_default 
 channel           | channel_id         | comment            | channel_id            | integer   | NO          | 
```

~~TMI : 다음 포스트는 상당히 짧을 예정~~


### 앞으로 할 것들 (진행 과정 중)
() 괄호 안 숫자는 우선순위  

- init.sql 작성
- cascading 점검

### 앞으로 할 것들 (진행 과정 이후)

- Polymorphic Associations 디자인 사용해서 이쁘게 구조 변경

### 정상적인 출력

```sql
mydb=# SELECT c.table_name, c.column_name, c.data_type, c.is_nullable, c.column_default
  FROM information_schema.key_column_usage AS ccu
  JOIN information_schema.table_constraints AS tc
    ON ccu.constraint_name = tc.constraint_name
  JOIN information_schema.columns AS c
    ON ccu.table_name = c.table_name
    AND ccu.column_name = c.column_name
WHERE tc.constraint_type = 'PRIMARY KEY' AND c.table_schema = 'public';
  table_name  |  column_name  | data_type | is_nullable |                  column_default                   
--------------+---------------+-----------+-------------+---------------------------------------------------
 website_user | user_id       | integer   | NO          | nextval('website_user_user_id_seq'::regclass)
 video_type   | video_type_id | smallint  | NO          | nextval('video_type_video_type_id_seq'::regclass)
 channel      | channel_id    | integer   | NO          | nextval('channel_channel_id_seq'::regclass)
 video        | video_id      | integer   | NO          | nextval('video_video_id_seq'::regclass)
 post         | post_id       | integer   | NO          | nextval('post_post_id_seq'::regclass)
 comment      | comment_id    | integer   | NO          | nextval('comment_comment_id_seq'::regclass)
 image        | image_id      | integer   | NO          | nextval('image_image_id_seq'::regclass)
(7 rows)
  table_name  |  column_name  | data_type | is_nullable |                  column_default                   
--------------+---------------+-----------+-------------+---------------------------------------------------
 website_user | user_id       | integer   | NO          | nextval('website_user_user_id_seq'::regclass)
 video_type   | video_type_id | smallint  | NO          | nextval('video_type_video_type_id_seq'::regclass)
 channel      | channel_id    | integer   | NO          | nextval('channel_channel_id_seq'::regclass)
 video        | video_id      | integer   | NO          | nextval('video_video_id_seq'::regclass)
 post         | post_id       | integer   | NO          | nextval('post_post_id_seq'::regclass)
 comment      | comment_id    | integer   | NO          | nextval('comment_comment_id_seq'::regclass)
 image        | image_id      | integer   | NO          | nextval('image_image_id_seq'::regclass)
(7 rows)

mydb=# SELECT
    ccu.table_name AS parent_table_name,
    ccu.column_name AS parent_column_name,
    c.table_name AS child_table_name,
    c.column_name AS child_column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.columns AS c
      ON c.table_name = tc.table_name
      AND c.column_name = kcu.column_name
WHERE tc.constraint_type = 'FOREIGN KEY' ORDER BY parent_table_name, parent_column_name;
 parent_table_name | parent_column_name |  child_table_name  |   child_column_name   | data_type | is_nullable | column_default 
-------------------+--------------------+--------------------+-----------------------+-----------+-------------+----------------
 channel           | channel_id         | channel_subscriber | subscribed_channel_id | integer   | NO          | 
 channel           | channel_id         | channel_subscriber | subscriber_channel_id | integer   | NO          | 
 channel           | channel_id         | video_likes        | channel_id            | integer   | NO          | 
 channel           | channel_id         | video_dislikes     | channel_id            | integer   | NO          | 
 channel           | channel_id         | comment_likes      | channel_id            | integer   | NO          | 
 channel           | channel_id         | comment_dislikes   | channel_id            | integer   | NO          | 
 channel           | channel_id         | video              | channel_id            | integer   | NO          | 
 channel           | channel_id         | post_likes         | channel_id            | integer   | NO          | 
 channel           | channel_id         | post_dislikes      | channel_id            | integer   | NO          | 
 channel           | channel_id         | comment            | channel_id            | integer   | NO          | 
 channel           | channel_id         | post               | channel_id            | integer   | NO          | 
 comment           | comment_id         | comment_dislikes   | comment_id            | integer   | NO          | 
 comment           | comment_id         | comment_likes      | comment_id            | integer   | NO          | 
 comment           | comment_id         | video_comment      | comment_id            | integer   | NO          | 
 comment           | comment_id         | comment            | parent_comment_id     | integer   | YES         | 
 comment           | comment_id         | post_comment       | comment_id            | integer   | NO          | 
 image             | image_id           | post_image         | image_id              | integer   | NO          | 
 post              | post_id            | post_image         | post_id               | integer   | NO          | 
 post              | post_id            | post_comment       | post_id               | integer   | NO          | 
 post              | post_id            | post_dislikes      | post_id               | integer   | NO          | 
 post              | post_id            | post_likes         | post_id               | integer   | NO          | 
 video             | video_id           | video_likes        | video_id              | integer   | NO          | 
 video             | video_id           | video_comment      | video_id              | integer   | NO          | 
 video             | video_id           | video_dislikes     | video_id              | integer   | NO          | 
 video_type        | video_type_id      | video              | video_type_id         | smallint  | NO          | 
 website_user      | user_id            | channel            | user_id               | integer   | NO          | 
(26 rows)

mydb=# SELECT
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.column_default,
  tc.constraint_type
  FROM information_schema.key_column_usage AS ccu
  JOIN information_schema.table_constraints AS tc
    ON ccu.constraint_name = tc.constraint_name
  RIGHT JOIN information_schema.columns AS c
    ON ccu.table_name = c.table_name
    AND ccu.column_name = c.column_name
WHERE tc.constraint_type IS NULL AND c.table_schema = 'public';
  table_name  |   column_name   |          data_type          | is_nullable | column_default | constraint_type 
--------------+-----------------+-----------------------------+-------------+----------------+-----------------
 video        | source          | text                        | NO          |                | 
 video        | views           | integer                     | NO          | 0              | 
 video        | description     | text                        | NO          |                | 
 video        | created_at      | timestamp without time zone | NO          | now()          | 
 video        | updated_at      | timestamp without time zone | NO          | now()          | 
 website_user | user_name       | character varying           | NO          |                | 
 website_user | email           | text                        | NO          |                | 
 website_user | password_hash   | text                        | NO          |                | 
 website_user | is_authorized   | boolean                     | NO          |                | 
 website_user | created_at      | timestamp without time zone | NO          | now()          | 
 website_user | updated_at      | timestamp without time zone | NO          | now()          | 
 channel      | channel_name    | character varying           | NO          |                | 
 channel      | updated_at      | timestamp without time zone | NO          | now()          | 
 image        | source          | text                        | NO          |                | 
 image        | created_at      | timestamp without time zone | NO          | now()          | 
 image        | updated_at      | timestamp without time zone | NO          | now()          | 
 video_type   | video_type_text | character varying           | NO          |                | 
 post         | content_text    | text                        | NO          |                | 
 post         | created_at      | timestamp without time zone | NO          | now()          | 
 post         | updated_at      | timestamp without time zone | NO          | now()          | 
 comment      | content_text    | text                        | NO          |                | 
 comment      | created_at      | timestamp without time zone | NO          | now()          | 
 comment      | updated_at      | timestamp without time zone | NO          | now()          | 
(23 rows)
```