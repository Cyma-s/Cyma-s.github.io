---
title: Cache vs Cacheable
date: 2023-10-27 18:05:45 +0900
updated: 2023-10-27 18:25:01 +0900
tags:
  - spring
  - jpa
---

`@Cache`, `@Cachable` 은 어떤 차이점이 있을까?

## `@Cacheable`

메서드 (또는 클래스의 모든 메서드) 를 호출한 결과를 캐시할 수 있음을 나타내는 어노테이션이다.  
메서드가 호출될 때마다 캐싱 동작이 적용되어 주어진 인자에 대해 메서드가 이미 호출되었는지 여부를 확인한다. 단순히 메서드 매개변수를 사용하여 키를 계산하는 것이지만, `key()` 속성을 사용하여 SpEL 표현식을 제공하거나, 사용자 정의 `KeyGenerator` 구현으로 기본값을 대체할 수 있다. 

계산된 값이 캐시에서 발견되지 않으면, 대상 메서드가 호출되고, 반환된 값이 연결된 캐시에 저장된다. `Optional` 값이 없는 경우에는 null 이 캐시에 저장된다.

## `@Cache`

```java
@Target({TYPE, METHOD, FIELD})
@Retention(RUNTIME)
public @interface Cache
```

2차 캐싱을 위한 Root 엔티티나 컬렉션을 표시하고 저장한다.  
엔티티 또는 컬렉션의 인스턴스 상태를 저장할 `region`, 엔티티 또는 컬렉션에 영향을 미칠 것으로 예상되는 데이터 액세스 패턴을 고려한 적절한 캐시 동시성 정책 (`usage`) 을 지정한다. 

JPA 정의된 어노테이션인 `Cacheable` 보다 우선적으로 사용해야 한다. JPA 는 cache 의 semantics 를 정의할 수 있는 수단을 제공하지 않기 때문이다. `Cacheable` 어노테이션과 함께 사용될 수 있지만, 중복된다.

2차 캐시가 있는 루트 엔티티의 엔티티 서브 클래스는 루트 엔티티에 속한 캐시를 상속한다 . 

다음과 같이 캐싱을 사용할 수 있다.

```java
 @Entity
 @Cache(usage = NONSTRICT_READ_WRITE)
 public static class Person { ... }
```

다음과 같이 컬렉션을 캐싱할 수도 있다.

```java
 @OneToMany(mappedBy = "person")
 @Cache(usage = NONSTRICT_READ_WRITE)
 private List<Phone> phones = new ArrayList<>();
```

2차 캐시는 `hibernate.cache.region.factory_class` 를 명시적으로 지정하지 않는 한 비활성화되므로, 기본적으로 해당 어노테이션은 아무런 영향을 미치지 않는다.

## 쿼리 캐싱

동일한 매개 변수를 사용하여 반복적으로 실행되는 쿼리가 있는 경우, 쿼리 캐싱을 통해 성능 향상을 얻을 수 있다.  

캐싱은 트랜잭션 처리 영역에 오버헤드를 발생시킨다. 예를 들어 엔티티에 대한 쿼리 결과를 캐싱하는 경우 hibernate 에서는 엔티티에 대한 변경 사항이 커밋되었는지 여부를 추적하고, 그에 따라 캐시를 무효화해야 한다.  
또한 쿼리 결과 캐싱의 이점은 제한적이고, 애플리케이션의 사용 패턴에 따라 크게 달라진다. 

### Query Cache enable

1. `hibernate.cache.use_query_cache` 를 true 로 설정한다.
	- `org.hibernate.cache.internal.StandardQueryCache` 는 캐싱된 쿼리 결과를 보유한다.
	- `org.hibernate.cache.spi.UpdateTimestampsCache` 는 쿼리 가능한 테이블에 대한 가장 최근 업데이트의 타임 스탬프를 보유한다. 해당 타임스탬프는 쿼리 캐시에서 제공되는 결과의 유효성을 검사한다. 
2. 기존 캐시 영역의 캐시 타임아웃 조정하기
	- 만료 또는 시간 초과를 사용하도록 기본 캐시 구현을 구성하는 경우, `UpdateTimestampsCache` 에 대한 기본 캐시 영역의 캐시 시간 초과를 쿼리 캐시의 시간 초과보다 높은 값으로 설정한다. `UpdateTimestampsCache` 영역이 만료되지 않도록 설정할 수 있으며, 이를 권장한다. 구체적으로 말하자면 LRU 캐시 만료 정책은 절대 적절하지 않다.
3. 특정 쿼리에 대한 결과 캐싱 사용 설정
	- 대부분의 쿼리는 결과 캐싱의 이점을 누리지 못하므로, 전체적으로 쿼리 캐싱을 사용하도록 설정한 후에도 개별 쿼리에 대해 캐싱을 사용하도록 설정해야 한다. 특정 쿼리에 대해 결과 캐싱을 사용하도록 설정하려면 `org.hibernate.Query.setCacheable(true)` 를 호출한다. 

## 참고

- https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html
- https://docs.jboss.org/hibernate/orm/6.2/javadocs/org/hibernate/annotations/Cache.html