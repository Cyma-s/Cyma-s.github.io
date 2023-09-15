---
title: Index로 성능 개선하기
date: 2023-09-14 17:18:28 +0900
updated: 2023-09-15 15:09:17 +0900
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

song 만 개, 킬링파트 3만 개로 테스트했다.

| type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |  
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |  
| ALL | PRIMARY | null | null | null | 9910 | 100 | Using temporary |  
| ALL | null | null | null | null | 29478 | 100 | Using where; Using join buffer \(hash join\) |

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

member 가 1명이었음  
comment 4만개 기준으로 테스트


|table | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| comment | ALL | null | null | null | null | 40051 | 10 | Using where |
| m | eq\_ref | PRIMARY | PRIMARY | 8 | shook.comment.member\_id | 1 | 100 | null |

마찬가지로 ALL 로 나오는 모습이다.  

### 기존 성능 체크

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- | 
| 2 | 41795000000 | 19135000000 | 20897500000 | 22660000000 | 15000000 |
### 개선사항

- `member_id`, `killing_part_id` 에 인덱스 걸기

| table | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| comment | ref | idx\_killing\_part\_comment\_killing\_part\_id | idx\_killing\_part\_comment\_killing\_part\_id | 8 | const | 18564 | 100 | null |
| m | eq\_ref | PRIMARY | PRIMARY | 8 | shook.comment.member\_id | 1 | 100 | null |

확인하는 row 수가 2분의 1로 감소했다.  

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 6 | 50175000000 | 797000000 | 8362500000 | 22660000000 | 30000000 |

성능도 최소 시간 기준 100분의 1로 크게 향상되었다.  

## 스와이프하는 노래를 조회하는 쿼리 (비로그인)

```sql
select * from song s where s.id=? // 기준 song 조회 

// 기준 노래보다 좋아요가 많은 노래 10개 조회
select * from song s1_0 
left join killing_part k1_0 on s1_0.id=k1_0.song_id 
group by s1_0.id 
having ( 
// 좋아요 개수 값이 클 때 sum(coalesce(k1_0.like_count,0))> ( 
		select sum(coalesce(k2_0.like_count,0)) 
		from killing_part k2_0 where k2_0.song_id=? 
	) 
	or 
// 좋아요 개수 같으면 id 가 큰 순으로 정렬 
	( 
		sum(coalesce(k1_0.like_count,0))= ( 
			select sum(coalesce(k3_0.like_count,0)) 
			from killing_part k3_0  
			where k3_0.song_id=? 
		) and s1_0.id>? 
	) 
) 
order by sum(coalesce(k1_0.like_count,0)), s1_0.id // 좋아요 순 → id 작은 순 
offset ? rows fetch first ? rows only 

// 아래쪽 조회하는 쿼리  
select * 
from song s1_0 
left join killing_part k1_0 on s1_0.id=k1_0.song_id 
group by s1_0.id 
having 
sum(coalesce(k1_0.like_count,0))< 
	( 
	select sum(coalesce(k2_0.like_count,0)) 
	from killing_part k2_0 
	where k2_0.song_id=? 
	) 
or 
( sum(coalesce(k1_0.like_count,0))= 
	( 
		select sum(coalesce(k3_0.like_count,0)) 
		from killing_part k3_0 
		where k3_0.song_id=? 
	) 
	and s1_0.id<? 
) 
order by sum(coalesce(k1_0.like_count,0)) desc, s1_0.id desc 
offset ? rows fetch first ? rows only 

// 기준 노래의 킬링파트 조회하는 로직 
select * from killing_part k1_0 where k1_0.song_id=?
```

## Explain

- 기준 노래보다 좋아요가 많은 데이터 조회 및 정렬

| select\_type | table | type | possible\_keys | key | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PRIMARY | s1\_0 | ALL | PRIMARY | null | null | 9910 | Using temporary; Using filesort |
| PRIMARY | k1\_0 | ALL | null | null | null | 29478 | Using where; Using join buffer \(hash join\) |
| SUBQUERY | k3\_0 | ALL | null | null | null | 29478 | Using where |
| SUBQUERY | k2\_0 | ALL | null | null | null | 29478 | Using where |

모두 ALL Search 를 수행하고 있으며, filesort 또한 수행되고 있는 것을 볼 수 있다. (성능에 안 좋다는 건 다 들어간 인스턴스 쿼리;;)

- 기준 노래보다 좋아요가 적은 데이터 조회 및 정렬

| select\_type | table | type | possible\_keys | key | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PRIMARY | s1\_0 | ALL | PRIMARY | null | null | 9910 | Using temporary; Using filesort |
| PRIMARY | k1\_0 | ALL | null | null | null | 29478 | Using where; Using join buffer \(hash join\) |
| SUBQUERY | k3\_0 | ALL | null | null | null | 29478 | Using where |
| SUBQUERY | k2\_0 | ALL | null | null | null | 29478 | Using where |

마찬가지로 ALL search 수행 중이다.

- song_id 로 킬링파트 조회

| select\_type | table | type | key | ref | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| SIMPLE | k1\_0 | ALL | null | null | 29478 | Using where |

ALL Search 진행 중이다.

### 성능 측정

- 좋아요 많은 거 쿼리 (캐시 안 타도록)

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 4 | 432433000000 | 102933000000 | 108108250000 | 114617000000 | 119000000 |

- 좋아요 적은 거 쿼리 (캐시 안 타도록)

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 5 | 510016000000 | 91359000000 | 102003200000 | 111161000000 | 31000000 |

- 킬링파트 조회 쿼리 (캐시 안 타도록)

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 4 | 99311000000 | 23335000000 | 24827750000 | 26468000000 | 14000000 |

### 개선 방법

- `killing_part` 의 `song_id` 인덱싱

### 이후 성능 측정

- 좋아요 많은 거 조회

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 20 | 1597450000000 | 65837000000 | 79872500000 | 114617000000 | 185000000 |

MIN_TIMER_WAIT 성능 30% 개선

- 좋아요 아래 조회

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 20 | 1406030000000 | 53473000000 | 70301500000 | 111161000000 | 97000000 |

MIN_TIMER_WAIT 성능 250% 악화

- 킬링파트 조회

| COUNT\_STAR | SUM\_TIMER\_WAIT | MIN\_TIMER\_WAIT | AVG\_TIMER\_WAIT | MAX\_TIMER\_WAIT | SUM\_LOCK\_TIME |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 10 | 101400000000 | 288000000 | 10140000000 | 26468000000 | 34000000 |

1/5 