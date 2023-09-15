---
title: Index로 성능 개선하기
date: 2023-09-14 17:18:28 +0900
updated: 2023-09-15 11:00:01 +0900
tags:
  - shook
  - 레벨4
  - 우테코
---
## 좋아요 순 노래 전체 조회 쿼리

```sql
select song.id, song.album_cover_url, song.created_at, song.length, song.singer, song.title, song.video_id, sum(coalesce(kp.like_count,0)) 
from song  
left join killing_part kp on song.id=kp.song_id  
group by song.id  
```

### Explain

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |  
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |  
| 1 | SIMPLE | song | null | ALL | PRIMARY | null | null | null | 9910 | 100 | Using temporary |  
| 1 | SIMPLE | kp | null | ALL | null | null | null | null | 29478 | 100 | Using where; Using join buffer \(hash join\) |

type 이 ALL 로 나오기 때문에, 전체 테이블 스캔이 발생했다.  

### 개선 사항

- `kp.song_id` 에 인덱스 걸기

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |  
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |  
| 1 | SIMPLE | song | null | index | PRIMARY | PRIMARY | 8 | null | 9910 | 100 | null |  
| 1 | SIMPLE | kp | null | ref | idx\_kp\_song\_id | idx\_kp\_song\_id | 8 | shook.song.id | 3 | 100 | null |

살펴보는 row 의 수가 '크게' 줄었다!

- 페이지네이션 적용

## 특정 킬링파트 전체 댓글 쿼리

```sql
select comment.killing_part_id, comment.id, comment.content, comment.created_at, comment.member_id, m.id, m.created_at, m.email, m.nickname  
from killing_part_comment comment  
left join member m on m.id=comment.member_id  
where comment.killing_part_id=? 
```

### Explain

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | comment | null | ALL | null | null | null | null | 40051 | 10 | Using where |
| 1 | SIMPLE | m | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.comment.member\_id | 1 | 100 | null |

마찬가지로 ALL 로 나오는 모습이다.  

### 기존 성능 체크

| SCHEMA\_NAME | DIGEST | DIGEST\_TEXT | COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME | SUM\_ERRORS | SUM\_WARNINGS | SUM\_ROWS\_AFFECTED | SUM\_ROWS\_SENT | SUM\_ROWS\_EXAMINED | SUM\_CREATED\_TMP\_DISK\_TABLES | SUM\_CREATED\_TMP\_TABLES | SUM\_SELECT\_FULL\_JOIN | SUM\_SELECT\_FULL\_RANGE\_JOIN | SUM\_SELECT\_RANGE | SUM\_SELECT\_RANGE\_CHECK | SUM\_SELECT\_SCAN | SUM\_SORT\_MERGE\_PASSES | SUM\_SORT\_RANGE | SUM\_SORT\_ROWS | SUM\_SORT\_SCAN | SUM\_NO\_INDEX\_USED | SUM\_NO\_GOOD\_INDEX\_USED | SUM\_CPU\_TIME | MAX\_CONTROLLED\_MEMORY | MAX\_TOTAL\_MEMORY | COUNT\_SECONDARY | FIRST\_SEEN | LAST\_SEEN | QUANTILE\_95 | QUANTILE\_99 | QUANTILE\_999 | QUERY\_SAMPLE\_TEXT | QUERY\_SAMPLE\_SEEN | QUERY\_SAMPLE\_TIMER\_WAIT |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| shook | 8c7c991592d576adb9e83e8c573e6f4db0a52e1c517c08038ad7be6f97e5c2f5 | SELECT \`comment\` . \`killing\_part\_id\` , \`comment\` . \`id\` , \`comment\` . \`content\` , \`comment\` . \`created\_at\` , \`comment\` . \`member\_id\` , \`m\` . \`id\` , \`m\` . \`created\_at\` , \`m\` . \`email\` , \`m\` . \`nickname\` FROM \`killing\_part\_comment\` COMMENT LEFT JOIN MEMBER \`m\` ON \`m\` . \`id\` = \`comment\` . \`member\_id\` WHERE \`comment\` . \`killing\_part\_id\` = ? | 2 | 41795000000 | 19135000000 | 20897500000 | 22660000000 | 15000000 | 0 | 0 | 0 | 1002 | 62002 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 1178336 | 1834916 | 0 | 2023-09-14 22:05:14.743496 | 2023-09-14 22:05:18.373364 | 22908676527 | 22908676527 | 22908676527 | /\* ApplicationName=IntelliJ IDEA 2023.2.1 \*/ select comment.killing\_part\_id,<br/>       comment.id,<br/>       comment.content,<br/>       comment.created\_at,<br/>       comment.member\_id,<br/>       m.id,<br/>       m.created\_at,<br/>       m.email,<br/>       m.nickname<br/>from killing\_part\_comment comment<br/>         left join member m on m.id = comment.member\_id<br/>where comment.killing\_part\_id = 3 | 2023-09-14 22:05:14.743496 | 22660000000 |

### 개선사항

- `member_id`, `killing_part_id` 에 인덱스 걸기

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |  
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |  
| 1 | SIMPLE | comment | null | ref | idx\_killing\_part\_comment\_killing\_part\_id | idx\_killing\_part\_comment\_killing\_part\_id | 8 | const | 18564 | 100 | null |  
| 1 | SIMPLE | m | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.comment.member\_id | 1 | 100 | null |

확인하는 row 수가 2분의 1로 감소했다.  

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 6 | 50175000000 | 797000000 | 8362500000 | 22660000000 | 30000000 |

성능도 최소 시간 기준 100분의 1로 크게 향상되었다.  

## 