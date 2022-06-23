---
title: "유튜브 클론코딩(7)"
date: 2022-06-23 22:53:00 +0900
categories: clone-youtube
toc : true
---

## 요약

1. init.sql 작성

## init.sql (테이블 초기화, 트리거 설정 등)

기존에 ALTER로 처리한 내용들을 CREATE TABLE에 모두 수정했다.  
[깃허브에 올린 파일](https://github.com/windowdong11/youtube-clone/blob/master/db/init.sql)

```sql
CREATE TABLE website_user (
  user_id serial PRIMARY KEY,
  user_name varchar(50) NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  is_authorized boolean NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE channel (
  channel_id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES website_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  channel_name varchar(50) NOT NULL,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE video_type (
  video_type_id smallserial PRIMARY KEY,
  video_type_text varchar(10) NOT NULL
);
INSERT INTO video_type (video_type_text) VALUES ('original');
INSERT INTO video_type (video_type_text) VALUES ('shorts');

CREATE DOMAIN positive_bigint AS bigint CHECK (VALUE >= 0);
CREATE TABLE video (
  video_id serial PRIMARY KEY,
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  source text NOT NULL,
  views positive_bigint NOT NULL DEFAULT 0,
  description text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  video_type_id smallint NOT NULL REFERENCES video_type(video_type_id)
);

CREATE TABLE post (
  post_id serial PRIMARY KEY,
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE,
  content_text text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE comment (
  comment_id serial PRIMARY KEY,
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  parent_comment_id integer REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE,
  content_text text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE image (
  image_id serial PRIMARY KEY,
  source text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE Channel_Subscriber (
  subscribed_channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  subscriber_channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE video_likes (
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  video_id integer NOT NULL REFERENCES video(video_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE video_dislikes (
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  video_id integer NOT NULL REFERENCES video(video_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE post_likes (
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id integer NOT NULL REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE post_dislikes (
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id integer NOT NULL REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE comment_likes (
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id integer NOT NULL REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE comment_dislikes (
  channel_id integer NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id integer NOT NULL REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Video_Comment (
  video_id integer NOT NULL REFERENCES video(video_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id integer NOT NULL REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE post_comment (
  post_id integer NOT NULL REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id integer NOT NULL REFERENCES comment(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE post_image (
  post_id integer NOT NULL REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  image_id integer NOT NULL REFERENCES image(image_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Functions

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

-- Triggers

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

## 마지막
___

### 앞으로 할 것들 (진행 과정 중)
() 괄호 안 숫자는 우선순위  

- init.sql 작성
- 드디어 node.js + express + typescript 백엔드 출발

### 앞으로 할 것들 (진행 과정 이후)

- Polymorphic Associations 디자인 사용해서 이쁘게 구조 변경