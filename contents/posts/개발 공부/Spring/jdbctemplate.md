---
title: JdbcTemplate
date: 2023-09-27 17:44:41 +0900
updated: 2023-09-27 22:32:53 +0900
tags:
  - java
  - spring
  - database
---

## JDBC 란?

자바에서 데이터베이스에서 접근하기 위한 API 이다.  
JDBC 는 관계형 데이터베이스로의 저수준 연결과 SQL 쿼리 실행을 지원하고, Java 애플리케이션과 데이터베이스 사이의 중간다리 역할을 한다.  

`JdbcTemplate` 의 인스턴스는 한 번 설정되면 Thread-safe 하다. `Datasource` 참조로 직접 인스턴스화해서 서비스 구현에서 사용하거나, `ApplicationContext` 안에서 준비되고 bean 참조를 통해 사용할 수도 있다.

`ApplicationContext` 에서 `DataSource` 는 언제나 빈으로 설정되어야 하고, 첫 번째 경우 (`DataSource` 참조) 에는 서비스에 직접 제공되고, 두 번째 경우에는 준비된 템플릿으로 제공되어야 한다.

### 특징

- `JdbcTemplate` 은 thread-safe 하다.
`JdbcTemplate` 의 주요 설정인 `DataSource`, `SQLExceptionTranslator` 등은 생성 시점 또는 초기 설정 후에 변경되지 않는다.  
또한 `JdbcTemplate` 은 SQL 과 관련된 로직을 처리하기 위해 콜백 패턴을 사용한다. 사용자는 특정 작업을 위한 콜백 인터페이스를 제공하는데, 콜백들은 각 스레드별로 독립적으로 동작한다.  
- 

### 구성 요소

#### `Connection`

데이터베이스 연결을 대표하는 객체이다.  
해당 객체를 통해 SQL 명령을 실행하거나, 다른 데이터베이스 작업을 수행한다.  

#### `Statement`, `PreparedStatement`

SQL 문을 데이터베이스에 보내기 위한 객체. `PreparedStatement` 는 파라미터를 동적으로 바인딩해야 하는 SQL 문을 실행하는 데 사용된다.  

#### `ResultSet`

SQL 쿼리의 결과를 나타내는 객체. 데이터베이스로부터 반환된 데이터를 순차적으로 접근할 수 있다.  

#### `SQLException`

데이터베이스 작업 중 발생하는 예욀르 처리하는 데 사용되는 예외 클래스이다.  

## JdbcTemplate 이란?

Spring Framework 에서 제공하는 클래스로, Java 의 JDBC API 를 더 쉽게 효율적으로 사용할 수 있도록 도와준다.  

JDBC 의 코드 중복, 오류 처리, 연결 관리 등의 공통 작업들을 단순화 시키며, 개발자는 SQL 쿼리 실행과 관련된 핵심 비즈니스 로직에만 집중할 수 있게 된다.  

## `JdbcAccessor`

`DataSource` 나 exception translator 같은 공통 속성을 정의하는 `JdbcTemplate` 및 기타 JDBC-accessing DAO helper 들을 위한 base class 이다.  

코드는 다음과 같다.  

```java
package org.springframework.jdbc.support;  
  
import javax.sql.DataSource;  
  
import org.apache.commons.logging.Log;  
import org.apache.commons.logging.LogFactory;  
  
import org.springframework.beans.factory.InitializingBean;  
import org.springframework.lang.Nullable;  
import org.springframework.util.Assert;  
  
public abstract class JdbcAccessor implements InitializingBean {  
  
    /** Logger available to subclasses. */  
    protected final Log logger = LogFactory.getLog(getClass());  
  
    @Nullable  
    private DataSource dataSource;  
  
    @Nullable  
    private volatile SQLExceptionTranslator exceptionTranslator;  
  
    private boolean lazyInit = true;  
  
  
	public void setDataSource(@Nullable DataSource dataSource) {  
       this.dataSource = dataSource;  
    }  
  
    @Nullable  
    public DataSource getDataSource() {  
       return this.dataSource;  
    }  
  
    protected DataSource obtainDataSource() {  
       DataSource dataSource = getDataSource();  
       Assert.state(dataSource != null, "No DataSource set");  
       return dataSource;  
    }  
  
    public void setDatabaseProductName(String dbName) {  
       if (SQLErrorCodeSQLExceptionTranslator.hasUserProvidedErrorCodesFile()) {  
          this.exceptionTranslator = new SQLErrorCodeSQLExceptionTranslator(dbName);  
       }  
       else {  
          this.exceptionTranslator = new SQLExceptionSubclassTranslator();  
       }  
    }  
    
    public void setExceptionTranslator(SQLExceptionTranslator exceptionTranslator) {  
       this.exceptionTranslator = exceptionTranslator;  
    }  
  
    public SQLExceptionTranslator getExceptionTranslator() {  
       SQLExceptionTranslator exceptionTranslator = this.exceptionTranslator;  
       if (exceptionTranslator != null) {  
          return exceptionTranslator;  
       }  
       synchronized (this) {  
          exceptionTranslator = this.exceptionTranslator;  
          if (exceptionTranslator == null) {  
             if (SQLErrorCodeSQLExceptionTranslator.hasUserProvidedErrorCodesFile()) {  
                exceptionTranslator = new SQLErrorCodeSQLExceptionTranslator(obtainDataSource());  
             }  
             else {  
                exceptionTranslator = new SQLExceptionSubclassTranslator();  
             }  
             this.exceptionTranslator = exceptionTranslator;  
          }  
          return exceptionTranslator;  
       }  
    }  
    
	public void setLazyInit(boolean lazyInit) {  
       this.lazyInit = lazyInit;  
    }  
  
    public boolean isLazyInit() {  
       return this.lazyInit;  
    }  
  
    @Override  
    public void afterPropertiesSet() {  
       if (getDataSource() == null) {  
          throw new IllegalArgumentException("Property 'dataSource' is required");  
       }  
       if (!isLazyInit()) {  
          getExceptionTranslator();  
       }  
    }  
}
```

- `setLazyInit` : `SQLException` 를 처음 접했을 때, `SQLExceptionTranslator` 를 lazy 초기화할지 정한다.  

#### 왜 `SQLExceptionTranslator` 를 지연 초기화 가능하게 했을까?

`SQLExceptionTranslator` 는 JDBC의 `SQLException` 을 Spring 의 데이터 접근 계층 예외로 변환하는 역할을 한다.  

1. 모든 사용자가 `SQLExceptionTranslator` 의 기능을 필요로 하지 않는다. 모든 상황에서 불필요하게 초기화하는 것은 리소스 낭비가 될 수도 있다.
2. 사용자가 필요에 따라 다른 `SQLExceptionTranslator` 구현체를 제공할 수 있는 유연성을 제공한다.  

## `JdbcOperations`

JDBC 작업을 위한 주요 메서드들을 정의한다.  
`JdbcTemplate` 은 `JdbcOperations` 의 구현체로, 실제 데이터베이스 작업을 수행한다.  

직접적으로 자주 사용되지는 않으나, 쉽게 mocking 하거나 stubbing 할 수 있어 테스트 가용성을 높일 수 있다.  

```java
public interface JdbcOperations {
	@Nullable  
	<T> T execute(ConnectionCallback<T> action) throws DataAccessException;

	<T> List<T> query(String sql, RowMapper<T> rowMapper) throws DataAccessException;

	@Nullable  
	<T> T queryForObject(String sql, RowMapper<T> rowMapper) throws DataAccessException;

	Map<String, Object> queryForMap(String sql) throws DataAccessException;

	<T> List<T> queryForList(String sql, Class<T> elementType) throws DataAccessException;

	int update(String sql) throws DataAccessException;

...
}
```

`queryForObject` 나 `query` 같은 메서드들은 Spring 의 `JdbcTemplate` 과 관련된 편의 메서드들이다.  

## 참고

- https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/core/JdbcTemplate.html
- https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/core/JdbcOperations.html