---
title: 로컬 캐싱 개선 진행 과정
date: 2023-10-30 17:06:48 +0900
updated: 2023-10-31 13:35:01 +0900
tags:
  - shook
  - 개발
---

## 발단

S-HOOK 의 서비스는 사용자의 좋아요가 큰 의미를 갖는 서비스이다.  
메인에 보여지는 노래들은 노래의 총 좋아요 개수로 내림차순 정렬된 리스트이고, 보여지는 킬링파트들의 순위도 킬링파트마다의 좋아요 개수로 정해진다.  

하지만 좋아요 개수로 내림차순 정렬을 계속해서 수행하는 것은 DB 에 큰 오버헤드를 발생시킨다. 이를 해결하기 위해 노래 정보들과 노래의 킬링파트 데이터들을 서버 메모리에 정렬된 상태로 캐싱해서 오버헤드를 크게 줄일 수 있었다.

그렇지만 그 과정에서 좋아요 개수가 캐시에 반영되지 않아 실시간으로 좋아요가 증가되고 감소되지 않는 문제가 발생했다. 이를 해결하기 위해 로컬 캐시를 개선하고자 한다.

## 좋아요 로직

좋아요 실시간을 반영하기 위해서는 S-HOOK 의 좋아요 등록 / 취소 과정을 알아야 한다. 대표로 좋아요 등록에 대해 알아보자.  

좋아요를 누르는 요청인 경우, `KillingPart` 의 `like`  메서드를 호출한다. 그런 다음 `KillingPartLikes` 에 `KillingPartLike` 가 추가되었는지 확인하고, `KillingPart` 의 필드인 `likeCount` 를 1 증가시킨다. 즉, Dirty Checking 을 사용하여 값을 업데이트한다.

```java
public void like(final KillingPartLike likeToAdd) {  
    validateLikeUpdate(likeToAdd);  
    final boolean isLikeCreated = killingPartLikes.addLike(likeToAdd);  
    if (isLikeCreated) {  
        this.likeCount++;  
    }  
}
```

그러나 현재 로컬 캐시에 있는 데이터들은 Dirty Checking 으로 값이 변경되지 않아야 하므로, `EntityManager` 를 사용하여 `detach` 를 수행했다.

```java
public void recreate(final List<Song> songs) {  
    songsSortedInLikeCountById = getSortedSong(songs);  
    songLikeCountById = songs.stream()  
        .collect(Collectors.toMap(Song::getId, song -> new AtomicInteger(song.getTotalLikeCount())));  
  
    songsSortedInLikeCountById.values().stream()  
    .peek(entityManager::detach)  
    .flatMap(song -> song.getKillingParts().stream())  
    .peek(entityManager::detach)  
    .flatMap(killingPart -> killingPart.getKillingPartLikes().stream())  
    .forEach(entityManager::detach); 
}
```

`addLike` 에서는 `KillingPartLikes` 라는 일급 컬렉션 객체 내부의 리스트에 `KillingPartLike` 를 추가하게 된다. 

```java
public class KillingPartLikes {  
  
    @OneToMany(mappedBy = "killingPart")  
    @Where(clause = "is_deleted = false")  
    private List<KillingPartLike> likes = new ArrayList<>();  
  
    public boolean addLike(final KillingPartLike like) {  
        if (like.isDeleted()) {  
            like.updateDeletion();  
            likes.add(like);  
  
            return true;  
        }  
  
        return false;  
    }
    ...
}
```

여기서 문제가 발생한다. 현재 로컬 캐시에 있는 데이터는 다음과 같은 쿼리로 생성된다. 

```java
@Query("SELECT s AS song "  
    + "FROM Song s "  
    + "LEFT JOIN FETCH s.killingParts.killingParts kp "  
    + "GROUP BY s.id, kp.id")  
List<Song> findAllWithKillingParts();
```

`KillilngPart` 는 `KillingPartLikes` 데이터를 `LAZY` 하게 로딩한다. 즉, 데이터에 접근할 때만 로딩이 되는데, `recreate` 에서 좋아요 데이터를 조회하는 일이 없기 때문에 로딩이 되지 않는다. 
결론적으로는 `KillingPartLikes` 가 FETCH 되지 않았기 때문에 `Lazy Initialization` 예외가 발생하게 된다. 이를 해결할 수 있는 방법은 여러 가지가 있다. 

1. EAGER 로딩으로 변경한다.
	- EAGER 로딩으로 변경하면 문제는 해결되지만, 모든 킬링파트 데이터를 로드할 때마다 EAGER 로딩이 발생할 것이다.
	- 추후 로직이 추가될 때 성능 문제가 발생할 위험이 있다.
2. `KillingPartLikes` 를 FETCH 한다.
	- 특정 쿼리에서만 `KillingPartLikes` 를 FETCH 해올 수 있다. 2번 방법을 채택하였다. 

### MultiBagFetchException 발생

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

### 노래 데이터 재정렬

좋아요 개수가 늘었기 때문에, 기존에 저장하고 있던 노래 데이터를 다시 정렬해야 한다.  
그렇지만 일일이 좋아요 개수를 매번 다시 계산하는 것은 불필요한 반복 로직이므로, 각 노래의 총 좋아요 개수를 저장하는 `songLikeCountById` `Map` 을 생성한다.

```java
private Map<Long, AtomicInteger> songLikeCountById = new LinkedHashMap<>();
```

좋아요가 눌릴 때마다 총 좋아요 개수와 킬링파트의 좋아요 개수를 증가시킨다. 증가가 완료된 뒤에는 좋아요된 노래의 정렬을 다시 수행한다.

```java
public void pressLike(final KillingPart killingPart, final KillingPartLike likeOnKillingPart) {  
    final Song song = songsSortedInLikeCountById.get(killingPart.getSong().getId());  
    final KillingPart killingPartById = findKillingPart(killingPart, song);  
    killingPartById.like(likeOnKillingPart);  
    songLikeCountById.get(song.getId()).incrementAndGet();  
  
    // 좋아요가 증가되었으므로 노래 정렬 다시 수행  
    sortSongsByLikeCount();  
}

private void sortSongsByLikeCount() {  
    // 좋아요 데이터로 노래 아이디를 정렬 => 아이디로 노래를 가져온다.  
    songsSortedInLikeCountById = songLikeCountById.entrySet().stream().sorted((o1, o2) -> {  
        if (o1.getValue().get() == o2.getValue().get()) {  // 좋아요 개수가 같은 경우
            return o2.getKey().compareTo(o1.getKey());  // id 내림차순으로 정렬한다.
        }  
        return o2.getValue().get() - o1.getValue().get();  // 좋아요 내림차순으로 정렬
    }).collect(Collectors.toMap(Map.Entry::getKey, entry -> songsSortedInLikeCountById.get(entry.getKey()),  
                                (prev, update) -> update, LinkedHashMap::new));  
}
```

### `Map` 을 생성하는 오버헤드 줄이기

노래 데이터가 바뀔 때마다 정렬이 수행되어야 한다. 전체 노래에 대한 정보가 있어야 하므로 `Song` 엔티티를 `Map` 으로 갖고 있어야 한다.  

이때 `Map` 을 정렬하기 위해서는 새로운 `Map` 을 만들 수 밖에 없다. 이 부분을 효율적으로 변경할 수 없을까?

결론적으로 노래는 id 로 찾을 수 있는 `Map` 을 따로 두고, 노래의 좋아요와 id 내림차순으로 정렬된 상태인 노래 id `List` 를 두어 새롭게 정렬된 `Map` 을 생성하지 않도록 했다.

이렇게 하면 노래 id 만 정렬된 상태로 유지하면 되고, `List` 로 저장하기 때문에 `List.sort` 메서드를 사용할 수 있게 된다. 즉, 새롭게 `List` 를 생성하는 오버헤드를 줄일 수 있다. 

변경된 구조는 다음과 같이 구성된다.

```java
private static final Comparator<Song> COMPARATOR = Comparator.comparing(Song::getTotalLikeCount,  
                                                                        Comparator.reverseOrder())  
    .thenComparing(Song::getId, Comparator.reverseOrder());  
private Map<Long, Song> songsSortedInLikeCountById;  
private List<Long> sortedIds;
```

### 삽입 정렬로 좋아요 정렬 로직 개선

좋아요를 누르거나 취소했을 때 리스트에서 변경되는 값은 노래 하나이다. 즉, 다른 값들은 모두 정렬이 되어 있는데, 노래 하나의 데이터의 위치가 변경되어야 한다는 뜻이다. 대부분이 정렬되어 있는 리스트에서는 삽입 정렬을 사용했을 때 성능이 좋다.

좋아요 개수가 변경되었을 때 노래 아이디를 갖는 리스트를 정렬한다. 

```java
public void pressLike(final KillingPart killingPart, final KillingPartLike likeOnKillingPart) {  
    final Song song = songsSortedInLikeCountById.get(killingPart.getSong().getId());  
    final KillingPart killingPartById = findKillingPart(killingPart, song);  
    final boolean updated = killingPartById.like(likeOnKillingPart);  
    if (updated) {  
        adjustSongPosition(song);  
    }  
}
```

```java
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

## 참고

실제 성능 개선이 된 부분은 [[inmemory-cache-develop]] 에서 확인할 수 있다.