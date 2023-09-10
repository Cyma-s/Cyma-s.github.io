---
title   : JPA의 DTO Projection
date    : 2023-07-31 21:24:59 +0900
updated : 2023-07-31 21:26:49 +0900
tags     : 
- jpa
- database
---

## DTO Projection 이란

엔티티 대신에 DTO 를 편리하게 조회할 때 사용한다.     
엔티티의 일부 속성만 가져오고 싶을 때 사용할 수 있다.      
프로젝트에서 Join 한 모든 내용 대신, 노래 정보와 전체 좋아요만 가져오려고 사용했다.

## 인터페이스 기반 Projection

구현 객체는 JPA 가 프록시로 만들어 준다.

projection 된 결과 객체는 영속성이 유지되지 않는다.

### interface projection 은 언제 써야 할까?

interface projection 은 다음과 같은 부분에서 이점을 갖는다. 보통 가독성 측면의 장점이 많은 것 같다.

단순하다. (개인적으로 가장 장점이라 생각한다) 원하는 필드에 해당하는 getter 메서드로 인터페이스를 선언하기만 하면 Spring Data 가 알아서 처리해준다.    

생성자가 필요없다. 그렇지만 이 부분은 lombok 을 쓰면 되니 class projection 에 비해 큰 장점이라고 하기는 어려울 수도 있다.    

현재 dto projection으로 가져오는 데이터가 단순한 평면 구조의 데이터이고, 클래스 내부에서 추가 가공이 이루어지지 않기 때문에 굳이 class projection 을 사용하지 않아도 될 듯 하다.    
중첩된 DTO가 있는 복잡한 데이터 구조가 필요하거나, DTO 생성자에서 계산을 수행하는 경우에는 class projection이 좋은 선택이 될 수도 있다고 한다.

## 클래스 기반 Projection

생성자의 파라미터 이름으로 Projection 이 동작한다.
쿼리에 패키지 이름까지 다 써줘야 한다.

## Class Projection 사용 시 주의 점

Class projection을 사용할 때, query 앞에 패키지 경로를 적지 않으면 작동을 하지 않습니다.    

```java
@Query("SELECT NEW shook.shook.song.domain.SongTotalVoteCountDto(s, COUNT(v)) ... ")
```

이런 식으로 query 내부에 패키지를 적어줘야 합니다.    

## Open Projection

인터페이스에 정의된 메서드에 대한 구체적인 구현을 제공할 수 있다.    
개발자가 원하는 로직에 따라 값을 반환하게 된다.

## Closed Projection

인터페이스에 정의된 메서드만 사용되며, 엔티티의 특정 속성에 직접 매핑된다.

## 주의

DTO projection 을 사용하면 기존 설정을 무시하고 eager loading 을 하는 듯하다.