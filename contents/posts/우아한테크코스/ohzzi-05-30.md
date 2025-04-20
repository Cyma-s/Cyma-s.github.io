---
title   : 5월 30일 오찌와 페어
date    : 2023-05-30 20:15:10 +0900
updated : 2023-05-30 20:15:33 +0900
tags     : 
- matzip
- 페어
---

## `@Query`

```java
@Query(
	value = "select count(r) from Review r where (r.member = :member)"
)
Long countByMember(Member member) {
	
}
```

## registerEvent()

이벤트를 발행한다 -> eventListener가 이벤트를 받아서 동작을 수행한다.

왜 이벤트를 썼는가? 락 관련해서 문제가 생길 수 있다.

## 관계 설명

`@ManyToOne` 은 다대일 관계를 나타낸다.
즉, 리뷰가 N개고 멤버가 1개이다. 

양방향으로 작성해줄 수도 있다. -> 양방향으로 작성하는 것이 필요한가? (상황에 따라 다르다. by 오찌)

양방향은 설정을 안 하면 기본적으로 LAZY로 설정된다 -> 쿼리가 엄청나게 많이 터진다.
ex. 10개의 리뷰 조회할 때 LAZY로 설정해두면 나중에 member를 get할 때 멤버 조회 쿼리가 10번 더 나간다. -> N+1 문제 발생 -> fetch join을 쓰거나 EntityGraph를 쓰자.

확실하게 연관 관계를 사용하는 경우에는 FETCH를 사용하면 좋다.

## Fetch

`fetch = FetchType.LAZY` 로 작성하면 실제로 해당 객체를 가져올 때에는 연관관계를 갖는 객체가 들어있지 않고 가짜객체 (proxy) 가 존재한다. 

```java
@JoinColumn(name = "member_id", nullable = false)
@ManyToOne(fetch = FetchType.LAZY)
private Member member;  // 가짜 객체가 존재.
```

```sql
select * from review r where id = 1;
select * from member m where m.id = r.member_id;
```

member에 대한 접근이 생길 때만 실제로 쿼리를 가져온다.

만약 review가 필요한데, member는 필요하지 않은 경우에는 낭비가 될 수 있다.
또한 member 테이블 자체가 크면 조인할 때 비용이 많이 든다.

> **LAZY를 기본으로 두고, 필요한 경우만 EAGER로 쓰는 것 추천**