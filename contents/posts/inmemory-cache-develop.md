---
title: 로컬 캐시 개선기
date: 2023-10-24 13:29:21 +0900
updated: 2023-11-01 15:18:39 +0900
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

자세한 내용은 [[inmemory-cache-develop-reason|로컬 캐시의 좋아요 데이터 갱신하기]]를 확인하자.

## 테스트

### 환경

- 로컬에서 실행
	- Apple M1 Pro 기준 메모리 16GB, CPU 8코어
- 노래 데이터 10000개
- 킬링파트 데이터 30000개
- 조회 시 사용하는 멤버는 모든 킬링파트에 좋아요를 누른 상태 (좋아요 데이터 30000개)

S-HOOK 에서 가장 시간이 오래걸리는 쿼리인 "노래를 스와이프할 때 현재 노래, 현재 노래보다 좋아요가 많거나 같은 노래 10개 (좋아요 내림차순 정렬, 좋아요가 같을 경우 id 내림차순 정렬), 현재 노래보다 좋아요가 적거나 같은 노래 10개 (좋아요 내림차순 정렬, 좋아요가 같을 경우 id 내림차순 정렬) 를 조회하는 API" 를 기준으로 테스트하였다. 지금부터는 스와이프 API 라고 짧게 부르도록 하겠다.

테스트 시 호출된 API 순서이다.

1. 10번 노래에서 스와이프 API 호출
2. 18번 노래의 좋아요 증가
3. 10번 노래에서 스와이프 API 호출
4. 18번 노래 좋아요 취소

즉, 18번의 순위가 계속해서 변경될 때를 테스트한다.

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

노래 Id 를 정렬된 상태로 유지하고, 노래를 저장한다.  
좋아요가 변경되면 전체 `LinkedHashMap` 을 정렬한다.  

```java
public void recreate(final List<Song> songs) {  
    sortedIds = new ArrayList<>(songsSortedInLikeCountById.keySet().stream()  
.sorted(Comparator.comparing(songsSortedInLikeCountById::get, COMPARATOR))  
                                    .toList());  
    ...
}

private void sortSongIds() {  
    sortedIds.sort(Comparator.comparing(songsSortedInLikeCountById::get, COMPARATOR));  
}
```

DB 에서 조회했을 때보다 10배의 성능 개선이 된 것을 볼 수 있다.

![[linked-hash-map-all-sort.png]]

### `TreeMap` 으로 좋아요 실시간 반영

삽입, 삭제에 $log(N)$ 의 시간복잡도를 갖는 `TreeMap` 을 사용하면 성능이 개선될 것이라고 생각했다. 

그러나 `TreeMap` 의 특성 상 `LinkedHashMap` 보다 조회 속도가 느렸다. 또한 `TreeMap` 은 삽입, 삭제에서 정렬이 발생하기 때문에 기존에 있는 Map 의 키를 삭제해야만 했는데, 삭제 후 삽입하는 속도가 `LinkedHashMap` 에 비해 크게 개선되지 않았다. 

따라서 `LinkedHashMap` 을 사용하는 것이 더 좋은 성능을 보여준다는 결론을 내렸다.

아래 테스트 결과에서도 `LinkedHashMap` 에 비해 성능이 20% 정도 악화된 것을 볼 수 있다.  

![[tree-map-develop.png]]

### 삽입 정렬로 거의 정렬된 데이터 순서 바꾸기

데이터가 거의 정렬된 데이터이고, 단 하나의 노래 데이터의 순서만 바뀌기 때문에 삽입 정렬이 더 효율적이라고 생각했다.

`List.sort` 대신 좋아요가 증가한 경우 앞 쪽으로 swap 하고, 좋아요가 감소한 경우 뒷 쪽으로 swap 을 진행했다.

```java
public void pressLike(final KillingPart killingPart, final KillingPartLike likeOnKillingPart) {  
    final Song song = songsSortedInLikeCountById.get(killingPart.getSong().getId());  
    final KillingPart killingPartById = findKillingPart(killingPart, song);  
    final boolean updated = killingPartById.like(likeOnKillingPart);  
    if (updated) {  
        adjustSongPosition(song);  
    }  
}  
  
public void adjustSongPosition(Song changedSong) {  
    int currentIndex = sortedIds.indexOf(changedSong.getId());  
  
    if (currentIndex == -1) {  
        return; // 노래를 찾지 못했을 경우  
    }  
  
    // 좋아요가 증가한 경우 (높은 좋아요 순으로 앞으로 이동)  
    if (shouldMoveForward(changedSong, currentIndex)) {  
        while (currentIndex > 0 &&  
            shouldSwapWithPrevious(changedSong, songsSortedInLikeCountById.get(sortedIds.get(currentIndex - 1)))) {  
            // 이전 노래와 위치 교환  
            swap(sortedIds, currentIndex, currentIndex - 1);  
            currentIndex--;  
        }  
    }    // 좋아요가 감소한 경우 (낮은 좋아요 순으로 뒤로 이동)  
    else {  
        while (currentIndex < sortedIds.size() - 1  
            && shouldSwapWithNext(changedSong, songsSortedInLikeCountById.get(sortedIds.get(currentIndex - 1)))) {  
            // 다음 노래와 위치 교환  
            swap(sortedIds, currentIndex, currentIndex + 1);  
            currentIndex++;  
        }  
    }}  
  
private boolean shouldMoveForward(Song song, int index) {  
    return index > 0 && shouldSwapWithPrevious(song, songsSortedInLikeCountById.get(sortedIds.get(index - 1)));  
}  
  
private boolean shouldSwapWithPrevious(Song song, Song previousSong) {  
    return song.getTotalLikeCount() > previousSong.getTotalLikeCount() ||  
        (song.getTotalLikeCount() == previousSong.getTotalLikeCount() && song.getId() > previousSong.getId());  
}  
  
private boolean shouldSwapWithNext(Song song, Song nextSong) {  
    return song.getTotalLikeCount() < nextSong.getTotalLikeCount() ||  
        (song.getTotalLikeCount() == nextSong.getTotalLikeCount() && song.getId() < nextSong.getId());  
}  
  
private void swap(List<Long> list, int i, int j) {  
    Long temp = list.get(i);  
    list.set(i, list.get(j));  
    list.set(j, temp);  
}
```

그 결과 좋아요를 수행하는 연산의 성능이 약 17% 개선되었다.  
비교해야 하는 데이터가 많을수록 시간 복잡도가 증가하기 때문에, 비교해야 하는 데이터가 많은 좋아요 true 의 연산 속도보다 좋아요 false 의 연산 속도가 더 빠른 것을 볼 수 있다. 

![[insertions-sort-like-sort.png]]
