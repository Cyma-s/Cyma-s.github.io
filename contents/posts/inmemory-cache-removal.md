---
title: 로컬 캐시 개선기
date: 2023-10-24 13:29:21 +0900
updated: 2023-10-28 16:51:35 +0900
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

특정 시간마다 `SongRepository` 에서 한 번에 노래와 노래의 킬링파트를 조회해서 로컬 캐시를 생성한다. 해당 노래를 Map 으로 저장한 뒤 데이터베이스가 아닌 로컬 캐시에서 노래를 조회하는 방식이다.

이때 문제점은 특정 노래만 저장하는 것이 아닌 **전체 노래**를 저장한다는 것이다.  
즉, 노래 개수가 늘어날수록 저장해야 하는 메모리가 많아지는 비효율적인 구조가 될 수 있다. 

따라서 전체 노래를 저장하지 않고 사용자가 가장 많이 쓸 것으로 예상되는 첫 스와이프 화면에서 불리는 API 에서 사용될 데이터를 미리 캐싱해놓기로 했다.

첫 스와이프 화면에서 위 또는 아래로 스와이프를 수행하면 실제로 데이터베이스에 쿼리를 보내는 API 가 호출될 것이다. 그러나 프론트엔드에서 사용자가 위, 아래에서 5번째 노래에 도달했을 때 백그라운드에서 호출하기 때문에, 오래 걸려도 상대적으로 사용자 경험에 영향을 덜 줄 것으로 예상했다.

또한 서비스 특성 상 사용자의 좋아요 실시간성이 중요한 만큼, 사용자가 좋아요를 눌렀을 때 기존 캐시와 대조하여 순위를 변경해주는 기능을 추가했다.

## 영향을 받는 API

전체 노래를 캐싱하고 있기 때문에, 노래 정보를 가져오는 모든 API 는 캐싱의 영향을 받고 있다.

## 개선 방법

## 테스트

### 환경

- 로컬에서 실행
- 노래 데이터 10000개
- 킬링파트 데이터 30000개

먼저 로컬 캐싱되지 않은 데이터를 조회할 때의 속도를 측정하기 위해 전체 노래를 조회해서 정렬한 뒤, 상위 10개의 노래를 반환하는 API 를 기준으로 테스트를 진행했다. 

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

### JPA 2차 캐시 적용 (Spring Cache)

적용하는 방법은 [[ehcache-apply|JPA 2차 캐시 적용하기]]에서 확인할 수 있다.

```xml
<config  
  xmlns='http://www.ehcache.org/v3'  
  xmlns:jsr107='http://www.ehcache.org/v3/jsr107'>  
  
  <service>    
	  <jsr107:defaults enable-statistics="true"/>  
  </service>  
  <cache alias="shook.shook.song.domain.Song">  
    <key-type>java.lang.Long</key-type>  
    <value-type>shook.shook.song.domain.Song</value-type>  
    <expiry>      
	    <ttl unit="seconds">10000</ttl>  
    </expiry>    
    <resources>      
	    <offheap unit="MB">100</offheap>  
    </resources>  
  </cache>  
  <cache alias="shook.shook.song.domain.killingpart.KillingPart">  
    <key-type>java.lang.Long</key-type>  
    <value-type>shook.shook.song.domain.killingpart.KillingPart</value-type>  
    <expiry>      
	    <ttl unit="seconds">10000</ttl>  
    </expiry>    
    <resources>      
	    <offheap unit="MB">100</offheap>  
    </resources>  
    </cache>
</config>
```

동일 조건에서 테스트를 진행했다.

![[jpa-level-2-cache.png]]

첫 요청은 2000ms 가량 걸렸으나, 그 뒤는 캐싱이 적용되어 평균 26ms 의 성능을 보여주는 것을 볼 수 있다. 

![[jpa-level-2-cache-last-request.png]]

캐싱된 데이터를 조회하는 평균 시간을 계산하기 위해 다시 100번 테스트를 수행했을 때, 평균 응답 시간이 16ms 로 최적화되지 않은 쿼리 기준 106배 정도 빠른 성능으로 개선된 것을 볼 수 있다.

## 스와이프 API & 좋아요 API 동시 요청 테스트

다음과 같은 순서로 테스트를 100번 수행했다.

1. 스와이프 요청
2. 하나의 킬링파트에 좋아요 등록
3. 동일한 노래 아이디로 스와이프 요청
4. 하나의 킬링파트에 좋아요 취소

실행되는 코드는 다음과 같다.

```java
public SongSwipeResponse findSongByIdForFirstSwipe(  
	final Long songId,  
	final MemberInfo memberInfo  
) {  
	final Song currentSong = songRepository.findById(songId)  
		.orElseThrow(  
			() -> new MemberNotExistException(  
				Map.of("SongId", String.valueOf(songId))  
			)            );  

	final List<Song> beforeSongs = songRepository.findSongsWithMoreLikeCountThanSongWithId(songId,  
																						   PageRequest.of(0, 10));  
	final List<Song> afterSongs = songRepository.findSongsWithLessLikeCountThanSongWithId(songId,  
																						  PageRequest.of(0, 10));  
	return convertToSongSwipeResponse(memberInfo, currentSong, beforeSongs, afterSongs);  
}
```

사용한 쿼리는 다음과 같다. 집계 쿼리가 포함되어 있어 성능 저하가 발생한다.

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

### 로컬 캐시



### JPA 2차 캐시

캐싱은 다음과 같이 선언해 주었다. 킬링파트는 좋아요가 계속해서 업데이트 되기 때문에 `READ_WRITE` 로 선언했다.

```java
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)  
@Getter  
@Embeddable  
public class KillingParts {
...
}

@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)  
@Getter  
@Entity  
public class KillingPart {
...
}

@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)  
@Getter  
@Entity  
public class Song {
...
}
```

좋아요가 업데이트되는 시점에 캐시를 업데이트 해주기 위해 Listener 를 추가했다.  
`killingPartCache` 가 업데이트되면 새롭게 업데이트된 `KillingPart` 로 캐시를 업데이트하는 로직이다.  

```java
@Component  
public class LikeUpdateListener {  
  
    private CacheManager cacheManager;  
  
    public LikeUpdateListener() {  
    }  
    public LikeUpdateListener(final CacheManager cacheManager) {  
        this.cacheManager = cacheManager;  
    }  
  
    @PostUpdate  
    public void onEntityChange(final KillingPart killingPart) {  
        Cache entityCache = cacheManager.getCache("killingPartCache");  
        if (entityCache != null) {  
            entityCache.put(killingPart.getId(), killingPart);  
        }  
    }}
```

첫 캐시 로드 시에는 5s 정도의 오랜 시간이 걸린다.

![[jpa-level-2-swipe.png]]

## 참고

- https://www.baeldung.com/hibernate-second-level-cache