---
title: "유튜브 클론코딩(4)"
date: 2022-06-20 23:27:00 +0900
categories: clone-youtube
toc : true
---

## 요약

1. 모든 테이블의 `updated_at` 컬럼의 기본값 `now()`으로 되도록 추가  
2. `created_at`, `updated_at`에 관련된 `UPDATE` 할 때 사용되는 트리거 작성
3. `serial`타입으로 설정했던 Foreign Key 기본값 모두 삭제

## updated_at 컬럼 기본값 수정

[Changing a Column's Default Value](https://www.postgresql.org/docs/current/ddl-alter.html#id-1.5.4.8.9)  
링크를 따라가보면, 첫 줄에 컬럼의 기본값을 추가하는 내용이 있다.  

```sql
ALTER TABLE website_user ALTER updated_at SET DEFAULT now();
ALTER TABLE channel ALTER updated_at SET DEFAULT now();
ALTER TABLE video ALTER updated_at SET DEFAULT now();
ALTER TABLE comment ALTER updated_at SET DEFAULT now();
ALTER TABLE image ALTER updated_at SET DEFAULT now();
ALTER TABLE post ALTER updated_at SET DEFAULT now();

SELECT column_name, column_default, is_nullable from information_schema.columns where table_name='website_user';
  column_name  |                column_default                 | is_nullable 
---------------+-----------------------------------------------+-------------
 is_authorized |                                               | NO
 created_at    | now()                                         | NO
 updated_at    | now()                                         | NO
 user_id       | nextval('website_user_user_id_seq'::regclass) | NO
 password_hash |                                               | NO
 user_name     |                                               | NO
 email         |                                               | NO
```

## 트리거에 사용할 함수 작성

[plgpsql 문법 튜토리얼](https://www.postgresqltutorial.com/postgresql-plpgsql/)  
[Trigger Functions](https://www.postgresql.org/docs/current/plpgsql-trigger.html)  

```sql
CREATE FUNCTION update_created_at() RETURNS TRIGGER AS $$
  BEGIN
    IF (TG_OP = 'INSERT') THEN
      NEW.created_at := now();
    ELSE
      NEW.created_at := OLD.created_at;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at := now();
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;
```

## 트리거 작성

[Create Trigger](https://www.postgresql.org/docs/current/sql-createtrigger.html)  

```sql
CREATE TRIGGER update_created_at_trigger
  BEFORE INSERT OR UPDATE ON website_user FOR EACH ROW EXECUTE PROCEDURE update_created_at();
CREATE TRIGGER update_created_at_trigger
  BEFORE INSERT OR UPDATE ON video FOR EACH ROW EXECUTE PROCEDURE update_created_at();
CREATE TRIGGER update_created_at_trigger
  BEFORE INSERT OR UPDATE ON post FOR EACH ROW EXECUTE PROCEDURE update_created_at();
CREATE TRIGGER update_created_at_trigger
  BEFORE INSERT OR UPDATE ON comment FOR EACH ROW EXECUTE PROCEDURE update_created_at();
CREATE TRIGGER update_created_at_trigger
  BEFORE INSERT OR UPDATE ON image FOR EACH ROW EXECUTE PROCEDURE update_created_at();

CREATE TRIGGER update_updated_at_trigger
  BEFORE UPDATE ON website_user FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_updated_at_trigger
  BEFORE UPDATE ON channel FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_updated_at_trigger
  BEFORE UPDATE ON video FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_updated_at_trigger
  BEFORE UPDATE ON post FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_updated_at_trigger
  BEFORE UPDATE ON comment FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER update_updated_at_trigger
  BEFORE UPDATE ON image FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
```

## Foreign Key 타입 변경

[Changing a Column's Data Type](https://www.postgresql.org/docs/current/ddl-alter.html#id-1.5.4.8.10)  

```sql
mydb=# SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='video';
  column_name  |          data_type          | is_nullable 
---------------+-----------------------------+-------------
 channel_id    | integer                     | NO
 video_type_id | integer                     | NO
 video_id      | integer                     | NO
 views         | integer                     | NO
 created_at    | timestamp without time zone | NO
 updated_at    | timestamp without time zone | NO
 source        | text                        | NO
 description   | text                        | NO
```

분명 `serial` 타입으로 작성했는데, `integer`타입이다.(???)  
`serial`타입은 `interger`타입의 일종이라 그런 것인데, auto increment 기능과 not null 제약조건까지 추가된 것이다.  
auto increment는 기본값 설정과 관련이 있다.  
설마 `serial`타입의 FK인 모든 컬럼에게 `nextval()`이 적용된 것은 아닐까..?  
```sql
mydb=# SELECT table_name, column_name, is_nullable, column_default from information_schema.columns where table_schema='public' and column_name like '%\_id';
     table_name     |      column_name      | is_nullable |                          column_default                           
--------------------+-----------------------+-------------+-------------------------------------------------------------------
 website_user       | user_id               | NO          | nextval('website_user_user_id_seq'::regclass)
 channel            | channel_id            | NO          | nextval('channel_channel_id_seq'::regclass)
 channel            | user_id               | NO          | nextval('channel_user_id_seq'::regclass)
 image              | image_id              | NO          | nextval('image_image_id_seq'::regclass)
 video_type         | video_type_id         | NO          | nextval('video_type_video_type_id_seq'::regclass)
 post               | post_id               | NO          | nextval('post_post_id_seq'::regclass)
 post               | channel_id            | NO          | 
 channel_subscriber | subscribed_channel_id | NO          | nextval('channel_subscriber_subscribed_channel_id_seq'::regclass)
 channel_subscriber | subscriber_channel_id | NO          | nextval('channel_subscriber_subscriber_channel_id_seq'::regclass)
 video              | video_id              | NO          | nextval('video_video_id_seq'::regclass)
 video              | video_type_id         | NO          | nextval('video_video_type_id_seq'::regclass)
 video              | channel_id            | NO          | nextval('video_channel_id_seq'::regclass)
 comment            | comment_id            | NO          | nextval('comment_comment_id_seq'::regclass)
 comment            | channel_id            | NO          | nextval('comment_channel_id_seq'::regclass)
 comment            | parent_comment_id     | YES         | 
 video_likes        | channel_id            | NO          | nextval('video_likes_channel_id_seq'::regclass)
 video_likes        | video_id              | NO          | nextval('video_likes_video_id_seq'::regclass)
 video_dislikes     | channel_id            | NO          | nextval('video_dislikes_channel_id_seq'::regclass)
 video_dislikes     | video_id              | NO          | nextval('video_dislikes_video_id_seq'::regclass)
 comment_likes      | channel_id            | NO          | nextval('comment_likes_channel_id_seq'::regclass)
 comment_likes      | comment_id            | NO          | nextval('comment_likes_comment_id_seq'::regclass)
 comment_dislikes   | channel_id            | NO          | nextval('comment_dislikes_channel_id_seq'::regclass)
 comment_dislikes   | comment_id            | NO          | nextval('comment_dislikes_comment_id_seq'::regclass)
 post_likes         | channel_id            | NO          | nextval('post_likes_channel_id_seq'::regclass)
 post_likes         | post_id               | NO          | nextval('post_likes_post_id_seq'::regclass)
 post_dislikes      | channel_id            | NO          | nextval('post_dislikes_channel_id_seq'::regclass)
 post_dislikes      | post_id               | NO          | nextval('post_dislikes_post_id_seq'::regclass)
 video_comment      | video_id              | NO          | nextval('video_comment_video_id_seq'::regclass)
```  
고쳐보자...  
[Information Schema](https://www.postgresql.org/docs/current/information-schema.html) 여기서 참 많이 해멨다.   
 
```sql
do $$
declare
t record;
begin
    for t IN SELECT c.table_name, c.column_name
      FROM information_schema.table_constraints tc 
        JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name) 
        JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
          AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
      WHERE constraint_type = 'FOREIGN KEY' and c.table_schema='public'
    loop
      if t.table_name='website_user' or t.column_name <> concat(t.table_name, '_id') then
        execute 'alter table ' || t.table_name || ' alter ' || t.column_name || ' DROP DEFAULT';
      end if;
    end loop;
end$$;
-- 위 코드로 다 지워지지 않아 남은 것들만 해결
ALTER TABLE channel_subscriber ALTER subscribed_channel_id DROP DEFAULT;
ALTER TABLE channel_subscriber ALTER subscriber_channel_id DROP DEFAULT;
```

## 마지막
___

다시는 Foreign Key에 `serial`같은 간편한 타입 설정하지 않을 것이다.  
진짜 너무너무너무너무 힘들었지만 정말 여러가지를 배웠다. do ~~랑, information_schema에 담긴 정보들  

웹(js)에서 이벤트 핸들러를 많이 등록하면 그 수만큼 오버헤드가 발생하기에, 최대한 적게 등록하려는 것처럼  
created_at의 변경을 막는 부분은 트리거 대신 권한으로 하는 경우가 많은 것 같다.  
MySQL에서는 테이블을 생성할 때, ON UPDATE now()처럼 사용하던데, 그런 부분이 좋아보였다.  

다음 포스트는 테이블이 잘 만들어졌는지 확인해보고, init.sql을 작성할 계획이다.

### 앞으로 할 것들 (진행 과정 중)
() 괄호 안 숫자는 우선순위  

- 테이블 구조 점검
- 불필요한 테이블이 존재하는 경우, 삭제
- init.sql 작성

### 앞으로 할 것들 (진행 과정 이후)

- Polymorphic Associations 디자인 사용해서 이쁘게 구조 변경