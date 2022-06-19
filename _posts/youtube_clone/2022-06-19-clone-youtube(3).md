---
title: "유튜브 클론코딩(3)"
date: 2022-06-19 13:15:00 +0900
categories: clone-youtube
toc : true
---

## 요약
___

- ERD 3차 변화
- ERD 변경으로 인한 테이블 수정, 컬럼 추가 [Postgres Adding a Column](https://www.postgresql.org/docs/current/ddl-alter.html#DDL-ALTER-ADDING-A-COLUMN)  
- 관계를 나타내는 테이블 작성

## Foreign Key와 삭제, 변경 옵션
___

[공식문서 참고](https://www.postgresql.org/docs/14/sql-createtable.html)
primary key가 참조하는 값이 삭제되거나, 수정될 때, 현재 테이블을 삭제하는 등의 옵션을 설정할 수 있도록 `ON DELETE`와 `ON UPDATE`가 제공되고 있다.  

옵션은 5가지가 제공되고 있다.  
여기서 사용할 것은 `CASCADE` 옵션이다.  
- NO ACTION (기본 옵션)  
  삭제 또는 수정이 외래키 제약 조건을 위반을 발생시키는 경우, 에러를 나타냄.  
  제약 조건이 deferred인 경우, 참조 행이 존재하고, 제약 조건을 검사할 때, 에러를 나타냄.  
- RESTRICT  
  삭제 또는 수정이 외래키 제약 조건을 위반을 발생시키는 경우, 에러를 나타냄.  
  검사가 deferrable한 경우를 제외하고 기본적으로는 NO ACTION과는 동일하다.  
  (restrict하게 defer가 설정되더라도, 즉시 검사하는 것으로 판단됨)  
- CASCADE  
  삭제된 행을 참조하는 모든 행을 삭제, 또는 참조하는 열의 값을 참조 행의 새로운 값으로 변경한다.  
  (원본 삭제 시 참조 삭제, 원본 변경 시 참조 변경)  
- SET NULL  
  참조 열을 null으로 변경한다.  
- SET DEFAULT  
  참조 열의 값을 그 열의 기본값으로 변경한다. (참조 테이블에 기본값과 매칭되는 열이 존재해야 한다. 존재하지 않는 경우, 해당 명령은 실패할 것이다.)

## SQL 테이블 작성 (관계 정의)  
___

마지막 포스트에서 데이터가 담기는 테이블들을 작성했고, 이번 포스트에서는 해당 테이블 간 관계를 설정하기 위한 테이블을 작성한다.

`Likes`, `Content_Type`테이블을 만들고,  
`Content_Type`테이블에는 `content_type_id`, `content_type_str`으로 컬럼을 구성하고,  
`Likes`테이블에 `channel_id`, `content_id`, `content_type_id`로 컬럼을 구성할까 했는데,  
이와 관련된 [Polymorphic Associations](https://stackoverflow.com/questions/15547276/is-it-possible-to-referenceS-one-column-as-multiple-foreign-keys) 디자인에 대한 주제가 있었다.  
![polymorphic associations](/assets/images/youtube_clone/polymorphic-associations.svg)  
객체지향에서 최상단(super)클래스와 유사한 디자인이다.  
이 디자인을 통해 변경하자면, 최상단에 `Likeable`을 두고, `likeable_id`를 `Video`, `Post`, `Comment`, `Likes`에서 참조하는 형태로 구성하면 된다.  
기존에 작성한 erd를 바탕으로 완성하고 나서, `Likes`와 `Comments`에 대해서 **다형성 연관** 디자인을 적용시켜 수정해 봐야겠다.  

## 3번째 ERD

가장 큰 변화는 `channel_id`들을 `Video`, `Comment`, `Image`, `Post`에 담기로 했다.  
결국 채널이 소유하는 것들이라 확장하는데에 문제도 없고, 이렇게 하면 트리거 없이 `cascade`를 통해서 채널이 삭제되면 같이 삭제할 수 있다.  

![ERD](/assets/images/youtube_clone/youtube-erd-3.svg)

## Channel 관계 테이블 작성

### Channel - Channel
___

자기 참조 패턴 사용 (self referenceS)  
subscribed : 구독된(당한) 채널, leader  
subscriber : 구독자(한) 채널, follower  

```sql
CREATE TABLE Channel_Subscriber (
  subscribed_channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  subscriber_channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

### Channel - Video
___

```sql
CREATE TABLE video_likes (
  channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  video_id serial REFERENCES video(video_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE video_dislikes (
  channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  video_id serial REFERENCES video(video_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

### Channel - Post
___

```sql
CREATE TABLE post_likes (
  channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id serial REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE post_dislikes (
  channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id serial REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

### Channel - Comment
___

```sql
CREATE TABLE comment_likes (
  channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id serial REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE comment_dislikes (
  channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id serial REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

## Video 테이블 수정 및 관계 테이블 작성

`Video`테이블 수정 : `channel_id` 추가  
```sql
ALTER TABLE video ADD COLUMN channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE;
```

### Video - Comment
___

```sql
CREATE TABLE Video_Comment (
  video_id serial REFERENCES video(video_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id serial REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

## Post 테이블 수정 및 관계 테이블 작성

`Post`테이블 수정 : `channel_id` 추가  
```sql
ALTER TABLE post ADD COLUMN channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE;
```

### Post - Comment
___

```sql
CREATE TABLE post_comment (
  post_id serial REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id serial REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

### Post - Image
___

post가 삭제되어도 image는 삭제되지 않는다. (트리거를 통해서 삭제하도록 추가)  
```sql
CREATE TABLE post_image (
  post_id serial REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  image_id serial REFERENCES image(image_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

## Comment 테이블 수정

`Comment`테이블 수정 : `channel_id` 추가  
```sql
ALTER TABLE comment ADD COLUMN channel_id serial REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE;
```
`parent_comment_id`가 참조하는 열이 삭제되는 경우, 해당 열을 참조하던 `parent_child_comment`테이블의 열은 삭제되겠지만, `child_comment_id`가 참조하는 열들은 삭제되지 않는다.  
이 문제를 해결하기 위해서 트리거를 작성해줄 수도 있다.  
n:m관계라면 이렇게 했겠지만, 1:n관계이기에, `Comment`테이블에 `parent_comment_id`를 추가하고, `NULLABLE`과 `CASCADE`하도록 작성하는 것이 구조가 깔끔하고 변경하기 좋겠다고 판단했다.  

MATCH SIMPLE 옵션을 주면 null이 허용된다고 했는데, DEFAULT NULL이 안들어간다..?  
일단 ALTER와 DROP을 통해서 NOT NULL을 없앴다.
```sql
ALTER TABLE comment ADD COLUMN parent_comment_id serial REFERENCES comment(comment_id) MATCH SIMPLE ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE comment ALTER COLUMN parent_comment_id DROP NOT NULL;
ALTER TABLE comment ALTER COLUMN parent_comment_id SET DEFAULT NULL;

SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'comment';

    column_name    | is_nullable 
-------------------+-------------
 comment_id        | NO
 created_at        | NO
 updated_at        | NO
 channel_id        | NO
 parent_comment_id | YES
 content_text      | NO
(6 rows)
```

(primary key는 null이면 절대 안되지만, foreign key는 그렇게 해도 된다는데, 이렇게 반강제로 nullable하게 만들어도 되는건지 조금 더 찾아봐야겠다.)


## 마지막
___

나름 견고하게 짠다고 3일동안 erd만 붙잡고 그렸는데, 문서를 읽고 검색하다 보면 새로운 용어를 알고, 그걸 또 검색하다보면, 새로운 이쁜 구조가 나와서 자꾸 변경하고 싶다.  

### 앞으로 할 것들 (진행 과정 중)
() 괄호 안 숫자는 우선순위

- (1)`created_at`와 `updated_at`를 자동으로 변경되고, 생성일이 유지될 수 있도록 함수와 트리거를 작성
- (1) channel 삭제 -> channel_video 삭제
- (1) channel 삭제 -> channel_post 삭제
- (1) channel 삭제 -> channel_comment 삭제
- (1) post 삭제 -> post_comment 삭제
- (1) post 삭제 -> post

### 앞으로 할 것들 (진행 과정 이후)

- Polymorphic Associations 디자인 사용해서 이쁘게 구조 변경