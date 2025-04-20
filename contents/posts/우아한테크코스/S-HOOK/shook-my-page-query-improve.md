---
title: 마이페이지 쿼리 개선
date: 2023-11-01 16:03:15 +0900
updated: 2023-11-02 10:58:42 +0900
tags:
  - shook
---

## 테스트 환경

- 각 API 를 100번씩 호출한 시간의 평균값을 기준으로 측정
- 노래 10000개
- 멤버 1000명
- 내 파트 10000개
	- 기준 멤버의 내 파트 100개

## 기존 API 성능

기존 쿼리는 DTO Projection 을 사용하여 Song 객체를 FETCH JOIN 한다.

```java
@Query("SELECT s as song, mp as memberPart "  
    + "FROM MemberPart mp "  
    + "LEFT JOIN FETCH Song s ON mp.song = s "  
    + "WHERE mp.member.id = :memberId")  
List<SongMemberPartCreatedAtDto> findByMemberId(  
    @Param("memberId") final Long memberId  
);
```

```java
public interface SongMemberPartCreatedAtDto {  
  
    Song getSong();  
  
    MemberPart getMemberPart();  
}
```

쿼리로 데이터를 가져온 후, 가장 최근에 생성된 MemberPart 로 정렬을 수행한다.

```java
public List<MyPartsResponse> findMyPartByMemberId(final Long memberId) {  
    final List<SongMemberPartCreatedAtDto> memberPartAndSongByMemberId = memberPartRepository.findByMemberId(  
        memberId);  
  
    return memberPartAndSongByMemberId.stream()  
        .sorted(Comparator.comparing(songMemberPartCreatedAtDto ->  
                                         songMemberPartCreatedAtDto.getMemberPart().getCreatedAt(),  
                                     Comparator.reverseOrder()  
        ))        .map(memberPart -> MyPartsResponse.of(  
            memberPart.getSong(),  
            memberPart.getMemberPart()  
        ))        .toList();  
}
```

API 는 평균 23ms 의 속도로 응답을 반환한다.

![[my-page-my-part-find.png]]

그러나 Song 의 artist 정보를 가져오는 과정에서 N+1 문제가 발생한다.

![[my-page-my-part-n-plus-one.png]]

### DTO Projection 제거 및 Artist Fetch Join 수행

DTO Projection 을 제거하고, Song 과 Artist 를 Fetch Join 하는 쿼리로 변경하였다. 

```java
@Query("SELECT mp "  
    + "FROM MemberPart mp "  
    + "LEFT JOIN FETCH Song s ON mp.song = s "  
    + "LEFT JOIN FETCH Artist a ON s.artist = a "  
    + "WHERE mp.member.id = :memberId")  
List<MemberPart> findByMemberId(  
    @Param("memberId") final Long memberId  
);
```

오히려 성능이 악화되었다. FETCH JOIN 을 하는 overhead 가 Lazy 로딩을 하는 overhead 보다 큰 것을 확인할 수 있었다.

![[my-page-my-part-artist-fetch-join.png]]

### 인덱스 적용

실행 계획을 확인해보면 member_part 를 찾을 때 Table All Scan 이 발생하고 있다. 

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | member\_part | null | ALL | null | null | null | null | 9679 | 10 | Using where |
| 1 | SIMPLE | s | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.member\_part.song\_id | 1 | 100 | null |
| 1 | SIMPLE | a | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.s.artist\_id | 1 | 100 | null |

```bash
-> Nested loop left join  (cost=1670 rows=968) (actual time=0.301..7.45 rows=100 loops=1)  
    -> Nested loop left join  (cost=1331 rows=968) (actual time=0.261..7.37 rows=100 loops=1)  
        -> Filter: (member_part.member_id = 1)  (cost=992 rows=968) (actual time=0.173..6.29 rows=100 loops=1)  
            -> Table scan on member_part  (cost=992 rows=9679) (actual time=0.172..5.67 rows=10000 loops=1)  
        -> Single-row index lookup on s using PRIMARY (id=member_part.song_id)  (cost=0.25 rows=1) (actual time=0.0105..0.0106 rows=1 loops=100)  
    -> Single-row index lookup on a using PRIMARY (id=s.artist_id)  (cost=0.25 rows=1) (actual time=588e-6..627e-6 rows=1 loops=100)
```

이를 방지하기 위해 member_part 의 member_id 에 인덱스를 걸어주었다.

쿼리 실행 계획에서 member_id 인덱스를 가지고 쿼리를 실행하는 것을 확인할 수 있다. 

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | member\_part | null | ref | member\_part\_member\_id | member\_part\_member\_id | 8 | const | 100 | 100 | null |
| 1 | SIMPLE | s | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.member\_part.song\_id | 1 | 100 | null |
| 1 | SIMPLE | a | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.s.artist\_id | 1 | 100 | null |

분석에서도 Table Scan 항목이 사라졌다.

```bash
-> Nested loop left join  (cost=105 rows=100) (actual time=0.267..0.532 rows=100 loops=1)  
    -> Nested loop left join  (cost=70 rows=100) (actual time=0.261..0.49 rows=100 loops=1)  
        -> Index lookup on member_part using member_part_member_id (member_id=1)  (cost=35 rows=100) (actual time=0.251..0.272 rows=100 loops=1)  
        -> Single-row index lookup on s using PRIMARY (id=member_part.song_id)  (cost=0.251 rows=1) (actual time=0.00194..0.00197 rows=1 loops=100)  
    -> Single-row index lookup on a using PRIMARY (id=s.artist_id)  (cost=0.251 rows=1) (actual time=200e-6..237e-6 rows=1 loops=100)
```

응답 속도도 평균 13ms 로 성능이 약 43% 개선된 것을 확인할 수 있다.

![[member-id-indexing.png]]