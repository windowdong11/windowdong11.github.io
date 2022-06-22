---
title: "유튜브 클론코딩(6)"
date: 2022-06-22 13:53:00 +0900
categories: clone-youtube
toc : true
---

## 요약

1. 참조관계, CASCADE 확인
2. init.sql 작성

## CASCADING 확인

[stack overflow](https://stackoverflow.com/a/37977656/16503773)에서 찾은 코드  
ON UPDATE, ON DELETE 에 설정된 제약조건을 확인할 수 있다.

```sql
select 
    pg_describe_object(classid, objid, objsubid), 
    pg_get_constraintdef(objid)
  from pg_depend 
  where refobjid = 'website_user'::regclass
    or refobjid = 'video_type'::regclass
    or refobjid = 'channel'::regclass
    or refobjid = 'video'::regclass
    or refobjid = 'post'::regclass
    or refobjid = 'comment'::regclass
    or refobjid = 'image'::regclass
    and deptype = 'n';
select 
    pg_describe_object(classid, objid, objsubid), 
    pg_get_constraintdef(objid)
  from pg_depend 
  where refobjid = 'website_user'::regclass
    and deptype = 'n';
-- 또는 \d {테이블 명}
```

테이블 `channel`의 `user_id`와, 테이블`channel_subscriber`의 `subscribed_channel_id`, `subscriber_channel_id`에 대해서 `ON UPDATE, ON DELETE CASCADE` 제약조건이 걸려있지 않다.  
테이블 `video`의 `video_type_id`는 참조하고 있는 비디오 유형이 삭제되지 않도록 그대로 둘 것. (비디오를 모두 삭제한 후 비디오 유형을 삭제하도록 유도)  
```sql
ALTER TABLE channel_subscriber
  DROP CONSTRAINT channel_subscriber_subscribed_channel_id_fkey,
  ADD CONSTRAINT channel_subscriber_subscribed_channel_id_fkey
    FOREIGN KEY (subscribed_channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE channel_subscriber
  DROP CONSTRAINT channel_subscriber_subscriber_channel_id_fkey,
  ADD CONSTRAINT channel_subscriber_subscriber_channel_id_fkey
    FOREIGN KEY (subscriber_channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE channel 
  DROP CONSTRAINT channel_user_id_fkey,
  ADD CONSTRAINT channel_user_id_fkey FOREIGN KEY (user_id) REFERENCES website_user(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
mydb=# \d channel
                                             Table "public.channel"
    Column    |            Type             | Collation | Nullable |                   Default                   
--------------+-----------------------------+-----------+----------+---------------------------------------------
 channel_id   | integer                     |           | not null | nextval('channel_channel_id_seq'::regclass)
 user_id      | integer                     |           | not null | 
 channel_name | character varying(50)       |           | not null | 
 updated_at   | timestamp without time zone |           | not null | now()
Indexes:
    "channel_pkey" PRIMARY KEY, btree (channel_id)
Foreign-key constraints:
    "channel_user_id_fkey" FOREIGN KEY (user_id) REFERENCES website_user(user_id) ON UPDATE CASCADE ON DELETE CASCADE
Referenced by:
    TABLE "channel_subscriber" CONSTRAINT "channel_subscriber_subscribed_channel_id_fkey" FOREIGN KEY (subscribed_channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "channel_subscriber" CONSTRAINT "channel_subscriber_subscriber_channel_id_fkey" FOREIGN KEY (subscriber_channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "comment" CONSTRAINT "comment_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "comment_dislikes" CONSTRAINT "comment_dislikes_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "comment_likes" CONSTRAINT "comment_likes_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "post" CONSTRAINT "post_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "post_dislikes" CONSTRAINT "post_dislikes_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "post_likes" CONSTRAINT "post_likes_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "video" CONSTRAINT "video_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "video_dislikes" CONSTRAINT "video_dislikes_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
    TABLE "video_likes" CONSTRAINT "video_likes_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE
Triggers:
    update_updated_at_trigger BEFORE UPDATE ON channel FOR EACH ROW EXECUTE FUNCTION update_updated_at()
```

정상적으로 수정이 되었다!

## 마지막
___

### 앞으로 할 것들 (진행 과정 중)
() 괄호 안 숫자는 우선순위  

- init.sql 작성
- 드디어 node.js + express + typescript 백엔드 출발

### 앞으로 할 것들 (진행 과정 이후)

- Polymorphic Associations 디자인 사용해서 이쁘게 구조 변경