---
title   : JPA DynamicUpdate
date    : 2023-09-06 13:34:14 +0900
updated : 2023-09-06 13:34:37 +0900
tags     : 
- jpa
- spring
---

## `@DynamicUpdate` 란?

실제 값이 변경된 컬럼으로만 update 쿼리를 만드는 기능이다.  
JPA 가 아닌 하이버네이트 기능이라고 한다.  

1. 변경된 컬럼을 찾는다.
2. 변경되는 컬럼에 따라 쿼리가 변경된다. 

### JDBC 와 JPA

JDBC 에서는 `PreparedStatement` 클래스를 사용할 수 있다. `PreparedStatement` 는 SQL 구문을 캐시하고, ?로 작성된 파라미터 부분만 변경하며 재사용한다.   

JPA 도 내부적으로는 JDBC와 `PreparedStatement` 를 사용하게 되는데, 변경된 컬럼에 대해서만 update 쿼리를 날리면 SQL 캐시 히트율이 떨어지게 될 것이다.  

또한 JPA 입장에서도 추가적인 연산이 필요하다. 모든 컬럼을 수정할 때는 엔티티 객체 변경만 추적하면 됐지만, 특정 컬럼의 변화를 감지하기 위해서는 필드 수준의 추적이 필요하게 된다.   

## 쓰면 좋은 경우

1. 컬럼이 많은 경우  
많은 수의 컬럼이 있는데, 몇 개의 컬럼만 자주 업데이트 하는 경우에 사용하면 좋다. 많다는 말은 모호하기 때문에 기준을 확실하게 정해야 할 듯.

2. 테이블에 인덱스가 많은 경우  
인덱스가 걸려있는 컬럼은 변경이 발생하는 인덱스를 재정렬하게 되는데, 인덱스가 많으면 많을수록 update 쿼리에 영향을 주게 된다.  
값이 변경되지 않았다면 굳이 update 하지 않는 것이 update 쿼리 성능에 도움을 줄 수 있다.

3. 데이터베이스가 컬럼 락을 지원하는 경우  
MySQL 은 컬럼 락을 지원하지 않는다. 컬럼 락을 지원하는 DBMS (yugabyte 같은 데이터베이스) 에서 사용하기 적절하다고 한다.

4. `@Version` 을 사용하지 않는 Optimistic Locking 의 경우에 사용하라고 되어 있다.  

## 참고

- https://multifrontgarden.tistory.com/299
- https://recordsoflife.tistory.com/1241