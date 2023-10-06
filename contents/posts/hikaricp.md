---
title: HikariCP
date: 2023-10-03 14:45:52 +0900
updated: 2023-10-05 21:54:51 +0900
tags:
  - spring
  - 레벨4
  - 우테코
---

## 데이터 커넥션 풀이란?

> In [software engineering](https://en.wikipedia.org/wiki/Software_engineering "Software engineering"), a **connection pool** is a [cache](https://en.wikipedia.org/wiki/Database_cache "Database cache") of [database connections](https://en.wikipedia.org/wiki/Database_connection "Database connection") maintained so that the connections can be reused when future requests to the database are required.

데이터베이스에 대한 요청이 필요할 때 커넥션을 재사용할 수 있도록 유지 / 관리되는 데이터베이스 커넥션 캐시이다. 데이터베이스에서 명령을 실행하는 성능을 향상시키기 위해 사용된다.  

각 유저마다 데이터베이스 커넥션을 열고 유지하는 것은 리소스가 많이 든다.  
커넥션 풀에서는 커넥션이 생성된 후 풀에 재배치되어 다시 사용되므로, 새롭게 연결을 설정할 필요가 없다.  

## hikariCP 란?

Java 에서 사용하는 130KB 의 매우 가벼운 고성능 JDBC 커넥션 풀 라이브러리이다.  

### hikariCP 를 사용할 때의 이점

#### 다른 커넥션 풀과 비교

hikariCP 의 깃허브에는 다음과 같은 사진이 있다.  

hikariCP 가 빠른 이유는 다음과 같다.  

1. 바이트코드 수준의 엔지니어링: 어셈블리 수준의 네이티브 코딩을 포함한 극한의 바이트코드 수준 엔지니어링이 수행되었다.
2. 마이크로 최적화: 측정하기는 어렵지만, 최적화가 결합되어 전반적인 성능을 향상시켰다.
3. `Collections` 프레임워크의 똑똑한 사용: range chacking 을 제거하고, head to tail 제거 스캔을 수행하는 사용자 정의 클래스인 `FastList` 로 `ArrayList<Statement>` 를 대체했다.  

## `HikariConfig`

데이터 소스를 초기화하는 데 사용되는 configuration 클래스이다.  
해당 클래스는 username, password, jdbcUrl, dataSourceClassName 같은 반드시 필요한 4가지 매개 변수가 포함되어 있다.  

`jdbcUrl` 및 `dataSourceClassName` 중 일반적으로 한 번에 하나씩 사용한다.

다른 풀링 프레임워크에서는 제공하지 않는 다음과 같은 기능들을 제공한다.  

- _autoCommit_
- _connectionTimeout_
- _idleTimeout_
- _maxLifetime_
- _connectionTestQuery_
- _connectionInitSql_
- _validationTimeout_
- _maximumPoolSize_
- _poolName_
- _allowPoolSuspension_
- _readOnly_
- _transactionIsolation_
- _leakDetectionThreshold_

## 사용하기

```java
private static HikariConfig config = new HikariConfig(
    "datasource.properties" );
```

`resources` 디렉터리에 있는 properties 파일로 초기화할 수 있다.  

다음과 같은 특성들이 필요하다.  

```properties
dataSourceClassName=org.postgresql.ds.PGSimpleDataSource
dataSource.user=test
dataSource.password=test
dataSource.databaseName=mydb
dataSource.portNumber=5432
dataSource.serverName=localhost
```

## 자주 사용되는 property

- `autoCommit`
풀에서 반환된 커넥션의 auto-commit 을 제어한다.  
**기본값은 true 이다.**  

- `connectionTimeout`
클라이언트 (사용자) 가 풀에서 커넥션을 기다리는 최대 시간을 제어한다.  
연결을 사용할 수 없는 상태에서 해당 시간을 초과하면 `SQLException` 이 발생한다.  
최소 연결 시간 제한은 250ms 이다.  
**기본값은 30000(30초)**

- `idleTimeout`
풀에서 커넥션이 유휴 상태로 유지될 수 있는 최대 시간을 제어한다.  
`minimumIdle` 이 `maximumPoolSize` 보다 작도록 정의된 경우에만 적용된다.  
풀이 `minimumIdle` 커넥션 개수에 도달하면 유휴 커넥션은 삭제되지 않는다. 커넥션이 유휴 상태로 종료되었는지는 평균 15초, 최대 30초의 차이가 있을 수 있다.  
값이 0이면 유휴 연결이 풀에서 제거되지 않는다. 허용되는 최솟값은 10000ms이다.  
**기본값은 600000ms(10분)**

- `keepaliveTime`
데이터베이스 또는 네트워크 인프라에 의해 커넥션이 time out 되는 것을 방지하기 위해 HikariCP 가 커넥션을 유지하려고 시도하는 빈도를 제어한다. `maxLifeTime` 값보다 작아야 한다!
커넥션 유지는 '유휴 연결' 에서만 발생한다. 특정 커넥션에 대해 `keepaliveTime` 이 되면 해당 연결이 풀에서 제거되고, `ping` 이 수행된 후 다시 풀에 반환된다.  
일반적으로 풀에서의 지속 시간은 단일 자릿수 밀리초 혹은 그보다 더 짧아야 한다. 즉, 성능에 거의 / 전혀 영향을 미치지 않아야 한다. 허용되는 최솟값은 30000ms (30초) 이지만, 몇 분 정도의 값이 가장 바람직하다.  
**기본값은 0 (비활성화)**

> 🤔 여기서 말하는 `ping` 이란?
> 
> 데이터베이스 연결이 여전히 활성화되어 있고, 정상적으로 작동하는지 확인하기 위한 간단한 테스트나 확인 작업.  
> 
> `JDBC4` 의 `isValid()` 메서드로 데이터베이스 연결이 여전히 유효한지 확인하거나, `connectionTestQuery` 같은 사용자가 제공하는 간단한 SQL 쿼리를 데이터베이스에 실행하여 연결의 유효성을 검사하는 방식으로 ping 을 수행할 수 있다.  

- `maxLifetime`
풀에 있는 커넥션의 최대 수명을 제어한다.  
사용 중인 커넥션은 절대로 종료되지 않고, 커넥션이 종료될 때만 제거된다. 풀에서의 대량 소멸을 방지하기 위해 커넥션별로 약간의 음의 감쇠가 적용된다.  
**해당 값을 설정하는 것이 좋고**, 데이터베이스나 인프라에 설정된 connection time limit 보다 몇 초 더 짧게 설정하는 것이 좋다.  

0 값은 최대 수명이 없음을 나타내고, (물론 `idleTimeout` 에 따라 달라질 수 있다.) 허용되는 최소값은 30000ms (30초) 이다.  
**기본값은 1800000ms (30분)**

- `connectionTestQuery`
드라이버가 `JDBC4` 를 지원하는 경우에는 이 속성을 설정하지 않는 것이 좋다.  
`JDBC4 Connection.isValid()` API 를 지원하지 않는 레거시 드라이버를 위한 속성이다.  

- `minimumIdle`
HikariCP 가 풀에서 유지하려고 시도하는 최소 유휴 커넥션 수를 제어한다.  
유휴 커넥션이 이 값 아래로 떨어지고, 풀의 총 커넥션 수가 최대 풀 크기보다 작아지면 커넥션을 추가한다.  
성능과 급증하는 요청에 대한 응답성을 극대화하기 위해서는 해당 값을 설정하지 않고, HikariCP가 고정 크기 연결 풀로 작동하도록 하는 것이 좋다.  
**기본값은 `maximumPoolSize` 와 동일**

- `maximumPoolSize`
유휴 커넥션과 사용 중인 커넥션을 모두 포함해서 풀이 가질 수 있는 최대 크기를 제어한다.  
기본적으로 해당 값에 따라 데이터베이스 백엔드의 실제 최대 커넥션 수가 결정된다.  
풀이 이 크기에 도달하고, 사용 가능한 유휴 커넥션이 없는 경우, `getConnection()` 호출은 time out 전까지 최대 `connectionTimeout` 밀리초 동안 block 된다.  
**기본값은 10**

### 주의할 것

지나치게 많은 값을 `maximumPoolSize` 로 잡지 않도록 주의해야 한다.  
자세한 내용은 [[about-pool-sizing]] 에서 확인하자. 

## 튜닝이 필요한 이유

- 불필요하게 많은 커넥션을 유지하게 되면 메모리, 시스템 리소스가 낭비된다.  
- 데이터베이스 커넥션을 생성 / 종료하는 것은 리소스를 많이 소모한다. 적절한 수의 커넥션을 유지하여 애플리케이션이 데이터베이스에 더 빠르게 액세스할 수 있다.  
- 특정 상황에서 너무 많은 커넥션 요청이 있을 때 데드락이 발생할 수 있는데, 커넥션 풀 튜닝으로 이런 문제들을 예방할 수 있다.

## MySQL 권장 설정

- `prepStmtCacheSize`
MySQL 드라이버가 커넥션 당 캐시할 `PreparedStatement` 수를 설정한다. 250-500 사이로 설정하는 것이 좋다.  
**기본값은 25**

- `prepStmtCacheSqlLimit`
드라이버가 캐시할 `PreparedStatement` SQL 문의 최대 길이이다. MySQL 기본값은 256이다. Hibernate 와 같은 ORM 프레임워크의 경우 기본값은 생성되는 statement 의 길이보다 작은 편이다. **권장 설정 값은 2048이다.**

- `cachePrepStmts`
캐시가 기본적으로 비활성화되어 있는 경우, 위의 매개변수 중 어느 것도 영향을 미치지 않으므로 해당 매개변수를 true 로 설정해야 한다.  

- `useServerPrepStmts`
최신 버전의 MySQL 은 server-side `PreparedStatement` 를 지원하므로, 성능이 크게 향상될 수 있다. 해당 속서을 true 로 설정한다.  

HikariCP 의 일반적인 MySQL 설정은 다음과 같다.  

```properties
jdbcUrl=jdbc:mysql://localhost:3306/simpsons
username=test
password=test
dataSource.cachePrepStmts=true
dataSource.prepStmtCacheSize=250
dataSource.prepStmtCacheSqlLimit=2048
dataSource.useServerPrepStmts=true
dataSource.useLocalSessionState=true
dataSource.rewriteBatchedStatements=true
dataSource.cacheResultSetMetadata=true
dataSource.cacheServerConfiguration=true
dataSource.elideSetAutoCommits=true
dataSource.maintainTimeStats=false
```

## 참고

- https://en.wikipedia.org/wiki/Connection_pool
- https://www.baeldung.com/hikaricp
- [hikariCP 공식 Github](https://github.com/brettwooldridge/HikariCP)
- https://github.com/brettwooldridge/HikariCP/wiki/MySQL-Configuration