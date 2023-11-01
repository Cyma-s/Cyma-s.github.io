---
title: 마이페이지 쿼리 개선
date: 2023-11-01 16:03:15 +0900
updated: 2023-11-01 16:52:30 +0900
tags:
  - shook
---

## 테스트 환경

- 각 API 를 100번씩 호출한 시간의 평균값을 기준으로 측정
- 노래 10000개
- 기준 멤버의 내 파트 10000개

## 기존 API 성능

기존 쿼리는 DTO Projection 을 사용하여 `Song` 객체를 FETCH JOIN 한다.

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

내 파트가 총 10000개일 때, 10000개 모두를 조회할 때 평균 409 ms 가 소요되었다.

![[previous-my-part-find.png]]

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

### 인덱스 적용

MemberPart 의 member_id 속성은 Member 의 PK 이기 때문에 변경되지 않을 값이다. MemberPart 의 song_id 또한 Song 의 PK 이므로 변경되지 않을 값이다.  

두 컬럼에 인덱스를 걸면 조회 성능이 개선될 것으로 예측하였다. 

기존 쿼리 실행 계획에서는 Table All Scan 이 발생하는 것을 볼 수 있다. 쿼리 속도는 333ms 로 측정되었다.

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | member\_part | null | ALL | null | null | null | null | 9999 | 10 | Using where |
| 1 | SIMPLE | s | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.member\_part.song\_id | 1 | 100 | null |

인덱스를 걸고 동일한 쿼리를 다시 실행해보았다.  

```sql
create index member_part_member_id on member_part(member_id);  
create index member_part_song_id on member_part(song_id);
```

측정 결과, 쿼리 속도는 113ms 이고, 실행 계획도 인덱스를 사용하여 조인을 수행한 것을 볼 수 있다.

| id | select\_type | table | partitions | type | possible\_keys | key | key\_len | ref | rows | filtered | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | member\_part | null | ref | member\_part\_member\_id | member\_part\_member\_id | 8 | const | 4999 | 100 | null |
| 1 | SIMPLE | s | null | eq\_ref | PRIMARY | PRIMARY | 8 | shook.member\_part.song\_id | 1 | 100 | null |

그렇지만 성능이 향상되지는 않았다. 

![[Pasted image 20231101162946.png]]

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

여기에서는 Song 의 artist name 만 사용된다. 필요한 데이터만 가져오기 위해 필요한 정보만 DTO Projection 을 사용했다.




### 데이터베이스에서 정렬된 데이터를 쿼리하도록 변경

