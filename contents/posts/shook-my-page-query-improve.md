---
title: 마이페이지 쿼리 개선
date: 2023-11-01 16:03:15 +0900
updated: 2023-11-02 00:00:12 +0900
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

### DB 정렬 

### DTO Projection 제거

확인해본 결과, MemberPart 는 Song 을 LAZY 로딩으로 가져올 수 있다. 

즉, FETCH JOIN 을 사용하면 Song 을 직접 가져올 수 있을 것이라고 생각해서 DTO Projection 을 제거하고 LEFT JOIN FETCH 를 수행해보았다.

```java
@Query("SELECT mp "  
    + "FROM MemberPart mp "  
    + "LEFT JOIN FETCH mp.song s "  
    + "WHERE mp.member.id = :memberId")  
List<MemberPart> findByMemberId(  
    @Param("memberId") final Long memberId  
);
```

DTO Projection 만 제거했는데도 성능이 약 35% 개선되었다.

![[remove-dto-projection-memberpart-find.png]]

### N + 1 문제 해결

확인해보니 MyPartsResponse 에서 Song 내부에서 LAZY 하게 로딩되는 Artist 객체를 가져오기 위해 N + 1 문제가 발생하고 있었다.

```java
public static MyPartsResponse of(final Song song, final MemberPart memberPart) {  
    return new MyPartsResponse(  
        song.getId(),  
        song.getTitle(),  
        song.getVideoId(),  
        song.getArtistName(),  // here!
        song.getAlbumCoverUrl(),  
        memberPart.getId(),  
        memberPart.getStartSecond(),  
        memberPart.getEndSecond()  
    );  
}
```

이를 해결하기 위해 `Artist` 의 정보를 LEFT JOIN FETCH 로 가져왔다.  

```java
@Query("SELECT mp "  
    + "FROM MemberPart mp "  
    + "LEFT JOIN FETCH mp.song s "  
    + "LEFT JOIN FETCH s.artist a "  
    + "WHERE mp.member.id = :memberId")  
List<MemberPart> findByMemberId(  
    @Param("memberId") final Long memberId  
);
```

N + 1 문제가 해결되어 7% 의 성능 개선이 된 것을 확인할 수 있다.

![[Pasted image 20231101222556.png]]

### 인덱스 적용

실행 계획을 확인한 결과, 어떤 column 에도 인덱스가 걸려있지 않아 제일row 수가 적은 artist 가 hash table 을 만들 때 선택되었다.  
Nested loop left join 으로 member 테이블을 full scan 한 뒤, member 를 찾아온다. 그 다음 member_part 별로 song 의 row 를 primary key 로 비교하며 찾는다. 이렇게 song 을 가져오고  artist hash table 에 통과시켜 결과를 반환하고 있다. 

```bash
| -> Left hash join (a.id = s.artist_id)  (cost=102 rows=1000) (actual time=0.365..27.4 rows=10000 loops=1)
    -> Nested loop left join  (cost=1374 rows=1000) (actual time=0.231..25 rows=10000 loops=1)
        -> Filter: (member_part.member_id = 1)  (cost=1024 rows=1000) (actual time=0.15..4.62 rows=10000 loops=1)
            -> Table scan on member_part  (cost=1024 rows=9999) (actual time=0.149..3.83 rows=10000 loops=1)
        -> Single-row index lookup on s using PRIMARY (id=member_part.song_id)  (cost=0.25 rows=1) (actual time=0.00184..0.00187 rows=1 loops=10000)
    -> Hash
        -> Table scan on a  (cost=0.00205 rows=1) (actual time=0.102..0.106 rows=1 loops=1)
 |
```

hash join 을 방지하기 위해 artist_id 에 인덱스를 걸어주었다. 

```sql
create index member_part_member_id on member_part(member_id);  
```

측정 결과, 쿼리 속도는 113ms 이고, 실행 계획도 인덱스를 사용하여 조인을 수행한 것을 볼 수 있다.

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | member\_part | null | ref | member\_part\_member\_id | member\_part\_member\_id | 8 | const | 4999 | 100 | null |
| 1 | SIMPLE | s | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.member\_part.song\_id | 1 | 100 | null |

그렇지만 성능이 향상되지는 않았다. 

![[Pasted image 20231101162946.png]]



그러나 오히려 성능이 악화되었다.  

![[all-property-dto-projection.png]]

실행 계획을 확인해본 결과, Artist 테이블에 대한 전체 테이블 스캔이 발생하고 있었다.  

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | member\_part | null | ref | member\_part\_member\_id | member\_part\_member\_id | 8 | const | 4999 | 100 | null |
| 1 | SIMPLE | s | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.member\_part.song\_id | 1 | 100 | null |
| 1 | SIMPLE | a | null | ALL | PRIMARY | null | null | null | 1 | 100 | Using where; Using join buffer \(hash join\) |

### Artist song_id 컬럼 인덱싱



### 데이터베이스에서 정렬된 데이터를 쿼리하도록 변경

