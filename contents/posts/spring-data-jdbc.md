---
title: Spring Data JDBC
date: 2023-10-21 16:51:20 +0900
updated: 2023-10-23 13:55:36 +0900
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

다음과 같은 레포지터리가 있다고 가정한다.

```java
interface PersonRepository extends Repository<Person, Long> { … }
```

```java
interface PersonRepository extends Repository<Person, Long> {
  List<Person> findByLastname(String lastname);
}
```

`JavaConfig` 나 `XML Configuration` 으로 해당 인터페이스에 대한 프록시 인스턴스를 스프링에 설정한다.

```java
import org.springframework.data.….repository.config.EnableJpaRepositories;

@EnableJpaRepositories
class Config { … }
```

그 뒤, 레포지터리를 주입 받아 사용한다.

```java
class SomeClient {

  private final PersonRepository repository;

  SomeClient(PersonRepository repository) {
    this.repository = repository;
  }

  void doSomething() {
    List<Person> persons = repository.findByLastname("Matthews");
  }
}
```

### 쿼리 생성하기

```java
interface PersonRepository extends Repository<Person, Long> {

  List<Person> findByEmailAddressAndLastname(EmailAddress emailAddress, String lastname);

  // Enables the distinct flag for the query
  List<Person> findDistinctPeopleByLastnameOrFirstname(String lastname, String firstname);
  List<Person> findPeopleDistinctByLastnameOrFirstname(String lastname, String firstname);

  // Enabling ignoring case for an individual property
  List<Person> findByLastnameIgnoreCase(String lastname);
  // Enabling ignoring case for all suitable properties
  List<Person> findByLastnameAndFirstnameAllIgnoreCase(String lastname, String firstname);

  // Enabling static ORDER BY for a query
  List<Person> findByLastnameOrderByFirstnameAsc(String lastname);
  List<Person> findByLastnameOrderByFirstnameDesc(String lastname);
}
```

JPA 와 유사하다.

`distinct`, `ignoreCase`, `order by` 를 설정할 수 있다.

#### 주의할 점

- 표현식은 일반적으로 연결될 수 있는 (concatenated) operator 로 결합된 property 순회 (traversal) 이다.
	- property expression 에 대해 `Between`, `LessThan`, `GreaterThan`, `Like` 와 같은 연산자도 지원된다. datastore 마다 다를 수 있다.
- 메서드 구문 분석기는 개별 속성 또는 대/소문자 ignore 를 지원하는 모든 속성에 대한 `ignoreCase` 플래그 설정이 지원된다. 대/소문자 ignore 지원 여부는 store 마다 다를 수 있다.
- 속성을 참조하는 쿼리 메서드에 `OrderBy` 절을 추가하고 정렬 방향 (`Asc`, `Desc`)를 지정하여 순서를 적용할 수 있다. 자세한 내용은 [Paging, Iterating Large Results, Sorting](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#repositories.special-parameters) 을 참고하자.

### 속성 표현식

관리되는 엔티티의 직접 속성만 참조할 수 있다. 쿼리 생성 시 구문 분석된 property 가 관리되는 도메인 클래스의 property 인지 확인하게 된다. 그러나 중첩된 속성을 traverse 하여 제약 조건을 정의할 수도 있다. 

다음과 같은 예시를 보자.

```java
List<Person> findByAddressZipCode(ZipCode zipCode);
```

`Person` 클래스에 `ZipCode` 를 갖는 `Address` 가 있다고 가정한다. 이 경우, 메서드는 `x.address.zipCode` 속성 traverse 를 생성한다. resolution algorithm 이 `AddressZipCode` 를 property 로 해석하는 것부터 시작해서, 도메인 클래스에서 해당 이름의 property 가 존재하는지 부터 확인한다. 알고리즘이 성공하면 (해당 property 이름이 도메인 클래스에 존재하면) 해당 property 를 사용한다.

그렇지 않은 경우에는 알고리즘이 오른쪽에서 camel-case 부분의 소스를 head, tail 로 분할하여 해당 속성을 찾으려고 시도한다. (`addressZip`, `Code` 로 분리) head 부분의 property 를 찾으면 동일 알고리즘을 다시 실행한다. 해당 분할이 일치하지 않는 경우, 분할 지점을 `address`, `ZipCode` 로 이동하여 계속 진행한다.

대부분의 경우 해당 방법이 작동하지만, 알고리즘이 잘못된 속성을 선택할 수 있다. `Person` 클래스에 `addressZip` 속성도 있다고 가정하면, 아마도 알고리즘은 첫 번째 분할 라운드에서 잘못된 속성을 선택한 뒤 실패할 것이다.

이런 모호함을 해결하려면, 다음과 같이 메서드 이름 안에 `_` 를 사용하여 traverse point 를 수동으로 정의할 수 있다. 

```java
List<Person> findByAddress_ZipCode(ZipCode zipCode);
```

### Paging, Iterating Large Results, Sorting

쿼리에서 매개변수를 처리하려면, 앞의 예제에서 이미 본 것처럼 메서드 매개변수를 정의하면 된다. 그 외에도 `Pageable`, `Sort` 와 같은 특정 유형을 인식하여 쿼리에 페이지네이션, 정렬을 동적으로 적용할 수 있다.

```java
Page<User> findByLastname(String lastname, Pageable pageable);

Slice<User> findByLastname(String lastname, Pageable pageable);

List<User> findByLastname(String lastname, Sort sort);

List<User> findByLastname(String lastname, Pageable pageable);
```

```ad-important
Sort, Pageable 을 사용하는 API 는 메서드에 null 이 아닌 값을 전달할 것으로 예상한다. 만약 Sort, Pageable 을 사용하지 않으려면, Sort.unsorted() 나 Pageable.unpaged() 를 사용해야 한다.
```

자세한 설명은 [어떤 메서드가 적합할까?](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#repositories.scrolling.guidance) 를 확인하는 것이 좋다.

### Aggregate Roots 에서 이벤트 발행하기

[Publishing Events from Aggregate Roots](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#core.domain-events) 참고

레포지터리에서 관리하는 엔티티는 Aggregate Root 이다. 도메인 중심 디자인 애플리케이션에서 이런 Aggregate Root 는 일반적으로 도메인 이벤트를 발행한다. Spring Data 는 `@DomainEvents` 라는 어노테이션을 제공한다. 

```java
class AnAggregateRoot {

    @DomainEvents (1)
    Collection<Object> domainEvents() {
        // … return events you want to get published here
    }

    @AfterDomainEventPublication (2)
    void callbackMethod() {
       // … potentially clean up domain events list
    }
}
```

`@DomainsEvents` 를 사용하는 메서드는 단일 이벤트 인스턴스 또는 이벤트 컬렉션을 반환할 수 있다. 인수를 받지 않아야 한다.

모든 이벤트가 발행된 후에는 `@AfterDomainEventPublication` 으로 어노테이션이 달린 메서드를 사용할 수 있다. 이 메서드로 발행할 이벤트 목록들을 잠재적으로(potentially) 정리(clean)할 수 있다.

---
이 메서드들은 다음 중 하나의 Spring Data Repository 메서드가 호출될 때마다 호출된다. 

- save, saveAll
- delete, deleteAll, deleteAllInBatch, deleteInBatch

해당 메서드들은 Aggregate Root 인스턴스들을 인자로 받는다. 
deleteById 는 인스턴스를 삭제하는 쿼리를 실행하도록 선택할 수 있기 때문에 애초에 Aggregate 인스턴스에 접근할 수 없어 제외되었다.

## 특성

### Core concepts

Spring Data Repository abstraction 의 중심 인터페이스는 `Repository` 이다.

`CrudRepository` 나 `ListCrudRepository` 인터페이스는 관리 중인 엔티티 클래스에 대한 정교한 CRUD 기능을 제공한다. 

## 시작하기

### 의존성 추가

```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-jdbc' 
implementation 'org.springframework.boot:spring-boot-starter-jdbc'
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