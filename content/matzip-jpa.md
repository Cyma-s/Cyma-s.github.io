---
title   : matzip JPA
date    : 2023-05-30 19:43:07 +0900
updated : 2023-05-30 19:43:22 +0900
tags     : 
- matzip
- jpa
---

## Spring Data JPA

```java
// 그냥 JPA만 쓸 경우
public class MemberRepository {
    @PersistenceContext
    private final EntityManager em;

    // 생성자
    ...

    public Member save(Member member) {
        em.persist(member);
    }
}

// Spring Data Jpa
public interface MemberRepository extends JpaRepository<Member, Long> {
    Member save(Member member);
}
```

## Entity 생성하기

보통은 도메인과 엔티티를 일치시키는 편이다.

`@Entity` 어노테이션을 사용하여 도메인 객체를 엔티티로 만든다.


## 영속성 컨텍스트

엔티티를 영구히 저장할 수 있는 환경.
`EntityManager` 를 통해 관리되는데, 우리는 Spring Data JPA 를 사용하므로 `EntityManager`를 직접 사용할 필요는 없고, `JpaRepository` 구현체 내부에서 자동으로 사용된다.

### 1차 캐시
`JpaRepository` 를 통해 엔티티를 `save` 하면 영속성 컨텍스트에 엔티티가 담기게 된다.
엔티티를 조회할 때 영속성 컨텍스트를 통해 꺼내오게 되는데, 이때 객체의 `동일성` 을 보장해줄 수 있다.

```java
Long id = memberRepository.save(오찌).getId();

Member 오찌1 = memberRepository.findById(id).get();
Member 오찌2 = memberRepository.findById(id).get();

오찌1 == 오찌2
```

영속성 컨텍스트는 조회 시 영속성 컨텍스트에 있는 데이터를 반환해주기 때문에 다른 변수에 담겨있지만 '주소값' 까지 동일한 객체이다.

영속성 컨텍스트는 기본적으로 트랜잭션 범위에서 작동한다. 즉, 다른 트랜잭션에서 조회하게 되면 다른 객체가 된다.

## JpaRepository

save, findById, findAll, delete, deleteById 메서드들을 기본으로 제공한다.