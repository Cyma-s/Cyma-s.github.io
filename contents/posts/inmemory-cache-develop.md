---
title: 로컬 캐시 개선기
date: 2023-10-24 13:29:21 +0900
updated: 2023-10-30 14:55:38 +0900
tags:
  - shook
---

## 개요

S-HOOK 은 메인 화면에서 전체 노래를 '좋아요 순으로' 정렬해서 10개의 노래만 보여주고 있다. 장르별 노래도 마찬가지로 좋아요 순으로 정렬 후, 10개의 노래만 클라이언트로 전달한다.

![[shook-main-page.png]]

전체 노래를 좋아요 순으로 정렬할 때 DB에서 정렬을 수행하게 되면 쿼리 속도가 굉장히 느려지게 된다. 그렇다고 애플리케이션 단에서 정렬을 수행하면, 전체 데이터를 조회한 뒤에 정렬을 수행해야 하기 때문에 마찬가지로 좋은 방법은 아니다. 

따라서 S-HOOK 은 메인 화면이니만큼 가장 많이 조회되는 API 이고, 자주 동일한 데이터를 전달하고 있어 로컬 캐싱을 적용했다. 
또한 사용자가 누른 좋아요가 반영되지 않는다는 문제점이 존재한다.

## 왜 지금의 로컬 캐싱을 제거해야 할까?

현재 로컬 캐싱은 `Map` 으로 구현되어 있다. Map 에 저장하는 정보는 songId 를 키로 해서, Song 을 value 로 갖는 구조이다.

```java
@RequiredArgsConstructor  
@Transactional(readOnly = true)  
@Slf4j  
@Component  
public class InMemorySongsScheduler {  
  
    private final SongRepository songRepository;  
    private final InMemorySongs inMemorySongs;  
  
    @PostConstruct  
    public void initialize() {  
        recreateCachedSong();  
    }  
  
    @Scheduled(cron = "${schedules.in-memory-song.cron}")  
    public void recreateCachedSong() {  
        log.info("InMemorySongsScheduler worked");  
        inMemorySongs.recreate(songRepository.findAllWithKillingParts());  
    }  
}
```

특정 시간마다 `SongRepository` 에서 한 번에 노래와 노래의 킬링파트를 조회해서 로컬 캐시를 생성한다. 해당 노래를 Map 으로 저장한 뒤 데이터베이스가 아닌 로컬 캐시에서 노래를 조회하는 방식이다. 로컬 캐시는 하루에 한 번 데이터베이스에서 데이터를 조회하고, 기존 로컬 캐시 데이터를 모두 삭제하는 방식으로 갱신된다.

이때 문제점은 저장한 캐시 데이터의 좋아요 데이터가 갱신되지 않는다는 점이다. S-HOOK은 사용자의 좋아요 데이터가 차트에 사용되기 때문에 실시간성이 중요한데, 기존 캐싱 방법에서는 좋아요 데이터에 따라 데이터가 변화하지 않기 때문에 서비스가 추구하는 방향성과 맞지 않다.

따라서 실시간으로 좋아요 데이터를 반영하기 위해 로컬 캐싱을 개선하기로 했다.

## 개선 방법

1. 로컬 캐싱에 좋아요를 실시간으로 반영하고, 좋아요로 인해 순위 변동이 생긴 경우 변경된 순위를 반영하는 코드를 작성한다.
2. 구현체를 LinkedHashMap 으로 구현했을 때 성능 테스트
3. 구현체를 TreeMap 으로 변경했을 때 성능 테스트
4. DTO 프로젝션을 사용했을 때 성능 테스트


### 좋아요 데이터를 실시간으로 순위에 반영하기

두 가지 컬렉션을 FETCH 해올 때, 처음에는 `KillingPartLikes` 가 `List` 였기 때문에 다음과 같은 에러가 발생했다. 

```java
@Query("SELECT s AS song "  
    + "FROM Song s "  
    + "LEFT JOIN FETCH s.killingParts.killingParts kp "  
    + "LEFT JOIN FETCH kp.killingPartLikes.likes kpl "  
    + "GROUP BY s.id, kp.id, kpl.id")  
List<Song> findAllWithKillingPartsAndLikes();
```

```bash
Caused by: org.hibernate.loader.MultipleBagFetchException: cannot simultaneously fetch multiple bags: [shook.shook.song.domain.killingpart.KillingPart.killingPartLikes.likes, shook.shook.song.domain.Song.killingParts.killingParts]
	at org.hibernate.query.sqm.sql.BaseSqmToSqlAstConverter.createFetch(BaseSqmToSqlAstConverter.java:7971)
	at org.hibernate.query.sqm.sql.BaseSqmToSqlAstConverter.visitFetches(BaseSqmToSqlAstConverter.java:8065)
	at org.hibernate.sql.results.graph.AbstractFetchParent.afterInitialize(AbstractFetchParent.java:32)
	at org.hibernate.sql.results.graph.embeddable.internal.EmbeddableFetchImpl.<init>(EmbeddableFetchImpl.java:75)
	at org.hibernate.metamodel.mapping.internal.EmbeddedAttributeMapping.generateFetch(EmbeddedAttributeMapping.java:269)
	at org.hibernate.sql.results.graph.FetchParent.generateFetchableFetch(FetchParent.java:108)
	at org.hibernate.query.sqm.sql.BaseSqmToSqlAstConverter.buildFetch(BaseSqmToSqlAstConverter.java:8108)
```

`KillingPartLikes` 를 `Set` 으로 변경하면 MultiBagFetchException 을 해결할 수 있다.

```java
@OneToMany(mappedBy = "killingPart")  
@Where(clause = "is_deleted = false")  
private Set<KillingPartLike> likes = new HashSet<>();
```

기존에 노래 id 를 키로 갖고, 노래를 value 로 갖던 Map 외에 노래 Id 를 키로 갖고 좋아요 개수를 키로 갖는 Map 을 추가했다.

```java
private Map<Long, AtomicInteger> songLikeCountById = new LinkedHashMap<>();
```

유저의 좋아요가 갱신될 때마다 노래를 다시 정렬해주는 로직을 추가한다. 

## 테스트

### 환경

- 로컬에서 실행
	- Apple M1 Pro 기준 메모리 16GB, CPU 8코어
- 노래 데이터 10000개
- 킬링파트 데이터 30000개
- 조회 시 사용하는 멤버는 모든 킬링파트에 좋아요를 누른 상태

S-HOOK 에서 가장 시간이 오래걸리는 쿼리인 "노래를 스와이프할 때 현재 노래, 현재 노래보다 좋아요가 많거나 같은 노래 10개 (좋아요 내림차순 정렬, 좋아요가 같을 경우 id 내림차순 정렬), 현재 노래보다 좋아요가 적거나 같은 노래 10개 (좋아요 내림차순 정렬, 좋아요가 같을 경우 id 내림차순 정렬) 를 조회하는 API" 를 기준으로 테스트하였다. 지금부터는 스와이프 API 라고 짧게 부르도록 하겠다.

테스트 시 호출된 API 순서이다.

1. 10번 노래에서 스와이프 API 호출
2. 18번 노래의 좋아요 증가
3. 10번 노래에서 스와이프 API 호출
4. 18번 노래 좋아요 취소

18번의 순위가 계속해서 변경될 때를 테스트한다.

사용되는 쿼리는 다음과 같다.

```java
@Query("SELECT s FROM Song s "  
    + "LEFT JOIN s.killingParts.killingParts kp "  
    + "GROUP BY s.id "  
    + "HAVING SUM(COALESCE(kp.likeCount, 0)) < (SELECT SUM(COALESCE(kp2.likeCount, 0)) FROM KillingPart kp2 WHERE kp2.song.id = :id) "  
    + "OR (SUM(COALESCE(kp.likeCount, 0)) = (SELECT SUM(COALESCE(kp3.likeCount, 0)) FROM KillingPart kp3 WHERE kp3.song.id = :id) AND s.id < :id) "  
    + "ORDER BY SUM(COALESCE(kp.likeCount, 0)) DESC, s.id DESC")  
List<Song> findSongsWithLessLikeCountThanSongWithId(  
    @Param("id") final Long songId,  
    final Pageable pageable  
);  
  
@Query("SELECT s FROM Song s "  
    + "LEFT JOIN s.killingParts.killingParts kp "  
    + "GROUP BY s.id "  
    + "HAVING (SUM(COALESCE(kp.likeCount, 0)) > (SELECT SUM(COALESCE(kp2.likeCount, 0)) FROM KillingPart kp2 WHERE kp2.song.id = :id) "  
    + "OR (SUM(COALESCE(kp.likeCount, 0)) = (SELECT SUM(COALESCE(kp3.likeCount, 0)) FROM KillingPart kp3 WHERE kp3.song.id = :id) AND s.id > :id)) "  
    + "ORDER BY SUM(COALESCE(kp.likeCount, 0)), s.id")  
List<Song> findSongsWithMoreLikeCountThanSongWithId(  
    @Param("id") final Long songId,  
    final Pageable pageable  
);
```

### DB 에서 직접 조회하는 경우

18번의 순위가 계속해서 변경될 때, 조회 시 평균적으로 310ms 정도의 성능이 나오는 것을 확인할 수 있었다.

![[query-direct-find.png]]

### `LinkedHashMap` 을 사용하여 좋아요 실시간 반영

![[linked-hash-map-local-cache.png]]

조회 속도가 평균 28~31ms 로 DB 에서 쿼리하여 정렬했을 때보다 10배 가량 성능 개선이 이루어진 것을 볼 수 있다.

### 

### 기존 방식 - 로컬 캐시 사용

![[not-fit-local-cache.png]]

응답 시간은 평균 Avg Time 8ms 이다. 굉장히 빠른 속도지만 모든 노래를 캐싱한다는 점에서 최적화가 필요하다.

### 최적화되지 않은 쿼리 - 전체 조회

노래 좋아요와 노래를 전체 조회한 뒤, 애플리케이션에서 정렬을 수행했다.

```java
@Query("SELECT s AS song, SUM(COALESCE(kp.likeCount, 0)) AS totalLikeCount "  
    + "FROM Song s LEFT JOIN s.killingParts.killingParts kp "  
    + "GROUP BY s.id ")
List<SongTotalLikeCountDto> findAllWithTotalLikeCount();
```

DTO 를 반환하여 LAZY 로딩으로 데이터를 가져오지 않도록 방지했다.

```java
public List<HighLikedSongResponse> showHighLikedSongs() {  
	final List<SongTotalLikeCountDto> songTotalLikeCountDtos = songRepository.findAllWithTotalLikeCount().stream()  
		.sorted((s1, s2) -> {  
			if (Objects.equals(s1.getTotalLikeCount(), s2.getTotalLikeCount())) {  
				return s2.getSong().getId().compareTo(s1.getSong().getId());  
			}  
			return s2.getTotalLikeCount().compareTo(s1.getTotalLikeCount());  
		}).toList();  

	return HighLikedSongResponse.ofSongs(songTotalLikeCountDtos);  
}
```

![[not-fit-query.png]]

평균 응답 시간이 594ms 로, 데이터 개수에 비해 느린 속도를 보여주고 있다.

hibernate statistics 를 확인해보았을 때, 총 2개의 쿼리가 발생한 것을 볼 수 있다.

```shell
2023-10-28T16:37:15.385+09:00  INFO 61413 --- [nio-8080-exec-5] i.StatisticalLoggingSessionEventListener : Session Metrics {
    17250 nanoseconds spent acquiring 1 JDBC connections;
    0 nanoseconds spent releasing 0 JDBC connections;
    114041 nanoseconds spent preparing 2 JDBC statements;
    90312958 nanoseconds spent executing 2 JDBC statements;
    0 nanoseconds spent executing 0 JDBC batches;
    0 nanoseconds spent performing 0 L2C puts;
    0 nanoseconds spent performing 0 L2C hits;
    0 nanoseconds spent performing 0 L2C misses;
    0 nanoseconds spent executing 0 flushes (flushing a total of 0 entities and 0 collections);
    2125 nanoseconds spent executing 1 partial-flushes (flushing a total of 0 entities and 0 collections)
}
```

### 최적화되지 않은 쿼리 - DB 정렬

DB 에서 정렬하는 쿼리이다.

```java
@Query("SELECT s AS song, SUM(COALESCE(kp.likeCount, 0)) AS totalLikeCount "  
    + "FROM Song s LEFT JOIN s.killingParts.killingParts kp "  
    + "GROUP BY s.id "  
    + "ORDER BY totalLikeCount DESC, s.id DESC")  
List<SongTotalLikeCountDto> findAllWithTotalLikeCount();
```

![[not-fit-query-db-sort.png]]

DB 정렬만으로 200% 성능 개선이 된 것을 확인할 수 있다.  
쿼리 개수는 이전과 동일하다.

## 참고

- https://www.baeldung.com/hibernate-second-level-cache