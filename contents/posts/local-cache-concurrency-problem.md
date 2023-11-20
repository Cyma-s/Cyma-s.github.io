---
title: 로컬 캐싱 동시성 문제 해결기
date: 2023-11-20 18:16:11 +0900
updated: 2023-11-20 18:31:15 +0900
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