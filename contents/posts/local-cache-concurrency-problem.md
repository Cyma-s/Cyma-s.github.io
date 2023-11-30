---
title: 로컬 캐싱 동시성 문제 해결기
date: 2023-11-20 18:16:11 +0900
updated: 2023-11-30 17:02:01 +0900
tags:
  - shook
  - trouble-shooting
---

## 개요

S-HOOK 의 모든 노래 정보는 로컬에 캐싱되어 있다. 노래를 DB 에서 매번 정렬하는 쿼리 비용이 컸기 때문에 로컬 캐싱을 도입하게 되었다.

그러나 로컬 캐싱을 도입하면서 문제가 발생했다.  
유저가 좋아요를 누르는 순간 노래 데이터는 좋아요 순에 맞춰 재정렬된다. 

이때 다음과 같은 상황이 발생할 수 있다.

![[inmemory-songs-concurrency-sort.png]]

노래를 정렬하는 중에 다른 좋아요 요청이 들어와서 동일한 리스트를 다시 정렬하는 상황이다. 이 경우 어느 스레드의 작업이 먼저 적용될 지 예측할 수 없고, 결과적으로 데이터의 무결성이 손상될 수 있다.

여러 스레드가 동일한 노래를 업데이트하려고 시도할 때도 문제가 발생할 수 있다. 
좋아요 요청은 InMemorySongs 를 


![[inmemory-concurrency.png]]


전체 로직은 다음과 같다.

```java
@RequiredArgsConstructor  
@Repository  
public class InMemorySongs {  
  
    private static final Comparator<Song> COMPARATOR =  
        Comparator.comparing(Song::getTotalLikeCount, Comparator.reverseOrder())  
            .thenComparing(Song::getId, Comparator.reverseOrder());  
  
    private Map<Long, Song> songs = new HashMap<>();  
    private List<Long> sortedSongIds = new ArrayList<>();  
  
    public void refreshSongs(final List<Song> songs) {  
        this.songs = songs.stream()  
            .collect(Collectors.toMap(Song::getId, song -> song, (prev, update) -> update, HashMap::new));  
        this.sortedSongIds = new ArrayList<>(this.songs.keySet().stream()  
                                                 .sorted(Comparator.comparing(this.songs::get, COMPARATOR))  
                                                 .toList());  
    }  
  
    private List<Song> getSortedSongsByGenre(final Genre genre) {  
        return sortedSongIds.stream()  
            .map(songs::get)  
            .filter(song -> song.getGenre() == genre)  
            .toList();  
    }  
  
    public List<Song> getSortedSongsByGenre(final Genre genre, final int limit) {  
        final List<Song> songsByGenre = getSortedSongsByGenre(genre);  
  
        return songsByGenre.subList(0, Math.min(limit, songsByGenre.size()));  
    }  
    public void like(final KillingPart killingPart, final KillingPartLike likeOnKillingPart) {  
        final Song song = songs.get(killingPart.getSong().getId());  
        final KillingPart killingPartById = findKillingPart(killingPart, song);  
        final boolean updated = killingPartById.like(likeOnKillingPart);  
        if (updated) {  
            reorder(song);  
        }  
    }  
    private static KillingPart findKillingPart(final KillingPart killingPart, final Song song) {  
        return song.getKillingParts().stream()  
            .filter(kp -> kp.equals(killingPart))  
            .findAny()  
            .orElseThrow(  
                () -> new KillingPartException.PartNotExistException(  
                    Map.of("killing part id", String.valueOf(killingPart.getId()))));  
    }  
  
    private void reorder(final Song updatedSong) {  
        int currentSongIndex = sortedSongIds.indexOf(updatedSong.getId());  
  
        if (currentSongIndex == -1) {  
            return;  
        }  
  
        moveForward(updatedSong, currentSongIndex);  
        moveBackward(updatedSong, currentSongIndex);  
    }  
  
    private void moveForward(final Song changedSong, final int songIndex) {  
        int currentSongIndex = songIndex;  
  
        while (canSwapWithPreviousSong(changedSong, currentSongIndex)) {  
            swap(currentSongIndex, currentSongIndex - 1);  
            currentSongIndex--;  
        }  
    }  
    private boolean canSwapWithPreviousSong(final Song changedSong, final int currentSongIndex) {  
        return currentSongIndex > 0 && currentSongIndex < sortedSongIds.size() &&  
            shouldSwapWithPrevious(changedSong,  
                                   songs.get(sortedSongIds.get(currentSongIndex - 1)));  
    }  
  
    private boolean shouldSwapWithPrevious(final Song song, final Song prevSong) {  
        final boolean hasSameTotalLikeCountAndLargerIdThanPrevSong =  
            song.getTotalLikeCount() == prevSong.getTotalLikeCount() && song.getId() > prevSong.getId();  
        final boolean hasLargerTotalLikeCountThanPrevSong = song.getTotalLikeCount() > prevSong.getTotalLikeCount();  
  
        return hasLargerTotalLikeCountThanPrevSong || hasSameTotalLikeCountAndLargerIdThanPrevSong;  
    }  
  
    private void swap(final int currentIndex, final int otherIndex) {  
        final Long prevIndex = sortedSongIds.get(currentIndex);  
        sortedSongIds.set(currentIndex, sortedSongIds.get(otherIndex));  
        sortedSongIds.set(otherIndex, prevIndex);  
    }  
  
    private void moveBackward(final Song changedSong, final int songIndex) {  
        int currentSongIndex = songIndex;  
  
        while (canSwapWithNextSong(changedSong, currentSongIndex)) {  
            swap(currentSongIndex, currentSongIndex + 1);  
            currentSongIndex++;  
        }  
    }  
    private boolean canSwapWithNextSong(final Song changedSong, final int currentSongIndex) {  
        return currentSongIndex < sortedSongIds.size() - 1 && currentSongIndex > 0  
            && shouldSwapWithNext(changedSong, songs.get(sortedSongIds.get(currentSongIndex - 1)));  
    }  
  
    private boolean shouldSwapWithNext(final Song song, final Song nextSong) {  
        final boolean hasSameTotalLikeCountAndSmallerIdThanNextSong =  
            song.getTotalLikeCount() == nextSong.getTotalLikeCount() && song.getId() < nextSong.getId();  
        final boolean hasSmallerTotalLikeCountThanNextSong = song.getTotalLikeCount() < nextSong.getTotalLikeCount();  
  
        return hasSmallerTotalLikeCountThanNextSong || hasSameTotalLikeCountAndSmallerIdThanNextSong;  
    }  
  
    public void unlike(final KillingPart killingPart, final KillingPartLike unlikeOnKillingPart) {  
        final Song song = songs.get(killingPart.getSong().getId());  
        final KillingPart killingPartById = findKillingPart(killingPart, song);  
        final boolean updated = killingPartById.unlike(unlikeOnKillingPart);  
        if (updated) {  
            reorder(song);  
        }  
    }}
```

매우 복잡한 로직이다. 좋아요 요청의 대략적인 플로우만 설명하면 다음과 같다.

좋아요 요청인 경우
1. 좋아요를 누른 킬링파트로 캐싱된 노래를 찾는다.
2. 캐싱된 노래의 좋아요를 누를 킬링파트를 찾는다.
3. 만약 킬링파트 좋아요가 업데이트된 경우, 전체 노래를 재정렬한다.

## 테스트 환경

동시 유저는 총 유저 수보다 조금 적은 100명으로 가정하였다.  

지금까지 애널리틱스로 분석한 결과 노래 조회 요청은 약 2800회 요청되었고, 좋아요 요청은 90회 요청되었다.   

이는 약 30:1의 비율이므로, locust 의 task 가중치를 30과 1로 설정하였다. 


## 해결 방법

이를 해결하기 위해서는 동시성을 보장하기 위한 락을 사용해야 한다.  

어떤 락이 우리의 상황에 가장 적합할 지 알아보도록 하자.

### synchronized

로직은 정말 간단하게 변경될 수 있다.

```java
private void reorder(final Song updatedSong) {  
    synchronized (sortedSongIds) {  
        int currentSongIndex = sortedSongIds.indexOf(updatedSong.getId());  
  
        if (currentSongIndex == -1) {  
            return;  
        }  
  
        moveForward(updatedSong, currentSongIndex);  
        moveBackward(updatedSong, currentSongIndex);  
    }  
}
```

#### 장점

synchronized 의 장점은 무엇보다 간단하다는 것이다. 또한 lock 관리를 Java 가 해주기 때문에 복잡성이 줄어든다. 

#### 단점

그러나 `sortedSongIds` 라는 데이터에 단 하나의 스레드만 접근할 수 있기 때문에, 읽기 요청이 많은 우리 서비스에서 성능 저하가 일어날 가능성이 매우 높다. 