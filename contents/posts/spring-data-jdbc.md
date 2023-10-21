---
title: Spring Data JDBC
date: 2023-10-21 16:51:20 +0900
updated: 2023-10-21 17:03:48 +0900
tags:
  - spring
---

## Spring Data JDBC 란?

도메인 중심 설계 원칙에 따라 JDBC 데이터베이스를 사용하는 솔루션 개발에 핵심 Spring 개념을 적용한 것이다.

JDBC Aggregate 의 핵심 기능은 Spring 컨테이너의 IoC 서비스를 호출할 필요 없이 직접 사용할 수 있다. 이는 Spring 컨테이너의 다른 서비스 없이 "독립적으로 사용할 수 있는" `JdbcTemplate` 과 매우 유사하다.

## Requirements

JDK 8.0 이상, Spring Framework 6.0.13 이상이 필요하다.

DB2, H2, HSQLDB, MariaDB, MySQL, Oracle, Postgres, Microsoft SQL Server 를 직접 지원한다.

다음과 같은 기본 기능들을 제공한다.

```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {

  <S extends T> S save(S entity);      (1)

  Optional<T> findById(ID primaryKey); (2)

  Iterable<T> findAll();               (3)

  long count();                        (4)

  void delete(T entity);               (5)

  boolean existsById(ID primaryKey);   (6)

  // … more functionality omitted.
}
```

`ListCrudRepository` 는 이와 동등한 메서드를 제공하지만, `CrudRepository` 메서드가 `Iterable` 을 반환하는 것과 달리 `List` 를 반환한다.

- [i] `JpaRepository` 나 `MongoRepository` 와 같이 persistence 기술 별 추상화도 제공한다. 이런 인터페이스는 `CrudRepository` 와 같은 다소 일반적인 persistence 기술에 구애받지 않는 인터페이스에 더해, `CrudRepository` 를 확장하고 기본 persistence 기술의 기능을 노출한다.

`CrudRepository` 에 더해서, 엔티티에 대한 페이징 접근을 용이하게 하는 메서드를 추가하는 `PagingAndSortingRepository` 도 제공한다.

```java
public interface PagingAndSortingRepository<T, ID>  {

  Iterable<T> findAll(Sort sort);

  Page<T> findAll(Pageable pageable);
}
```

다음과 같이 사용할 수 있다. 

```java
PagingAndSortingRepository<User, Long> repository = // … get access to a bean
Page<User> users = repository.findAll(PageRequest.of(1, 20));
```

이 외에도 count 쿼리, delete 쿼리에 대한 쿼리 파생이 가능하다.

```java
interface UserRepository extends CrudRepository<User, Long> {

  long countByLastname(String lastname);
}
```

```java
interface UserRepository extends CrudRepository<User, Long> {

  long deleteByLastname(String lastname);

  List<User> removeByLastname(String lastname);
}
```

### 쿼리 메서드



## 특성

### Core concepts

Spring Data Repository abstraction 의 중심 인터페이스는 `Repository` 이다.

`CrudRepository` 나 `ListCrudRepository` 인터페이스는 관리 중인 엔티티 클래스에 대한 정교한 CRUD 기능을 제공한다. 



## 시작하기

### 의존성 추가

```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-jdbc' implementation 'org.springframework.boot:spring-boot-starter-jdbc'
```

`build.gradle` 파일에 필요한 의존성을 추가한다. 

### 스키마 설정

Spring Data JDBC 는 자동으로 데이터베이스 스키마를 생성하지 않는다. 따라서 스키마를 수동으로 생성해야 한다. 여기서는 `schema.sql` 을 사용한 방법으로 진행해보겠다.

```sql

```

### Repository 생성

```java
public interface MenuRepository extends CrudRepository<Menu, Long> {

}
```

## 참고

- https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#requirements