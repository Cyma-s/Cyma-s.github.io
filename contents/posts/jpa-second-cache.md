---
title: JPA 2차 캐시
date: 2023-10-24 13:50:06 +0900
updated: 2023-10-24 14:02:31 +0900
tags:
  - jpa
  - hibernate
  - spring
---

## JPA 2차 캐시

`SessionFactory` 범위로 지정되어, 동일한 `SessionFactory` 로 생성된 모든 세션에서 공유된다. 엔티티 인스턴스가 ID 로 조회되고, 해당 엔티티에 대해 2차 캐싱이 활성화되면 다음과 같이 작동한다. 

1. 인스턴스가 이미 1차 캐시에 있는 경우, 1차 캐시에서 인스턴스가 반환된다.
2. 인스턴스가 1차 캐시에서 발견되지 않고 해당 인스턴스 상태가 2차 캐시에 캐싱되어 있는 경우에는 해당 캐시에서 데이터를 가져와 인스턴스를 반환한다.
3. 필요한 데이터가 데이터베이스에서 로드된 뒤, 인스턴스가 반환된다.

인스턴스가 1차 캐시에 저장되면 세션이 닫히거나, 인스턴스가 수동으로 영속성 컨텍스트에서 제거될 때까지 동일한 세션 내의 모든 호출에서 해당 인스턴스가 반환된다. 로드된 인스턴스는 L2 캐시에도 저장된다.

## 2차 캐시 설정

```yml
spring:
	jpa:  
	  properties:  
	    hibernate:  
	      format_sql: true  
	      show-sql: true  
	    cache:  
		    use_second_level_cache: true  
			query_cache_factory: org.hibernate.cache.ehcache.EhCacheRegionFactory  
		javax:  
			persistence:  
			sharedCache:  
			    mode: ENABLE_SELECTIVE
```

## Hibernate 캐시 동시성 전략

`@Cache` 의 속성인 usage 값으로 `CacheConcurrentStrategy` 를 설정해서 캐시의 동시성 전략을 설정할 수 있다. 

- `READ_ONLY` : 읽기 전용. 변하지 않는 데이터를 대상으로 사용하는 것이 좋다.
- `NONSTRICT_READ_WRITE`: 객체 동시 수정 등에 대한 고려를 전혀 하지 않고 캐싱한다. 하나의 객체가 동시에 수정될 가능성이 거의 없는 경우 사용한다.
- `READ_WRITE`: 엄격한 읽기 / 쓰기로 두 개 이상의 스레드에서 동시 수정할 가능성에 대해 고려하고 만들어야 한다.

## `@Cacheable`



## 참고

- https://www.baeldung.com/hibernate-second-level-cache