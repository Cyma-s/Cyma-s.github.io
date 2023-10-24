---
title: 인메모리 캐시 제거하기
date: 2023-10-24 13:29:21 +0900
updated: 2023-10-24 15:59:57 +0900
tags:
  - shook
---

## 개요

S-HOOK 은 메인 화면에서 전체 노래를 '좋아요 순으로' 정렬해서 10개의 노래만 보여주고 있다. 장르별 노래도 마찬가지로 좋아요 순으로 정렬 후, 10개의 노래만 클라이언트로 전달한다.

![[shook-main-page.png]]

전체 노래를 좋아요 순으로 정렬할 때 DB에서 정렬을 수행하게 되면 쿼리 속도가 굉장히 느려지게 된다. 그렇다고 애플리케이션 단에서 정렬을 수행하면, 전체 데이터를 조회한 뒤에 정렬을 수행해야 하기 때문에 마찬가지로 좋은 방법은 아니다. 

따라서 S-HOOK 은 메인 화면이니만큼 가장 많이 조회되는 API 이고, 자주 동일한 데이터를 전달하고 있어 로컬 캐싱을 적용했다. 

그렇지만 로컬에 캐싱을 진행하는만큼, 문제점이 발생할 수 있어 캐싱을 제거하기로 결정했다. 

## 왜 로컬 캐싱을 제거해야 할까?

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

## 개선 방법

## 테스트

### 환경

- 로컬에서 실행
- 노래 데이터 10000개

### 최적화되지 않은 쿼리-전체 조회

노래 좋아요와 노래를 전체 조회한 뒤, 애플리케이션에서 정렬을 수행했다.

```java
@Query("SELECT s AS song, SUM(COALESCE(kp.likeCount, 0)) AS totalLikeCount "  
    + "FROM Song s LEFT JOIN s.killingParts.killingParts kp "  
    + "GROUP BY s.id ")
List<SongTotalLikeCountDto> findAllWithTotalLikeCount();
```

```java
    public List<HighLikedSongResponse> showHighLikedSongs() {  
        final List<Song> songs = songRepository.findAllWithTotalLikeCount().stream()  
            .sorted((s1, s2) -> {  
                if (Objects.equals(s1.getTotalLikeCount(), s2.getTotalLikeCount())) {  
                    return s2.getSong().getId().compareTo(s1.getSong().getId());  
                }  
                return s2.getTotalLikeCount().compareTo(s1.getTotalLikeCount());  
            })  
            .map(SongTotalLikeCountDto::getSong)  
            .collect(Collectors.toList());  
  
        return HighLikedSongResponse.ofSongs(songs);  
    }
```

![[not-fitting-query.png]]

성능이 굉장히 느린 것을 볼 수 있다. 평균 응답 시간이 1.7s 로, 최악의 성능을 보여준다.

### 최적화되지 않은 쿼리 - DB 정렬

DB 에서 정렬하는 쿼리이다.

```java
@Query("SELECT s AS song, SUM(COALESCE(kp.likeCount, 0)) AS totalLikeCount "  
    + "FROM Song s LEFT JOIN s.killingParts.killingParts kp "  
    + "GROUP BY s.id "  
    + "ORDER BY totalLikeCount DESC, s.id DESC")  
List<SongTotalLikeCountDto> findAllWithTotalLikeCount();
```

![[query-application-sort.png]]

약간의 성능 개선이 있었지만, 매우 미미한 수준이다. 

### 로컬 캐시 사용

![[inmemory-performance-time.png]]

응답 시간은 평균 Avg Time 8ms 이다.

### JPA 2차 캐시 적용

### Redis 적용

글로벌 캐시

## 참고

- https://www.baeldung.com/hibernate-second-level-cache