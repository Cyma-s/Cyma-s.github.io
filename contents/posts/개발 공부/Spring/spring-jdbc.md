---
title   : Spring JDBC
date    : 2023-04-11 19:35:33 +0900
updated : 2023-04-11 19:37:19 +0900
tags     : 
- 레벨2
- 우테코
- 개발
- spring
---

**내용을 주관적으로 덜어냈습니다. 자세한 내용은 참고 링크를 확인해주세요!** 👍

## JDBCTemplate

### Querying Dao

- 하나의 객체를 query할 때 사용한다.
	- 첫 번째 인자: sql, 두 번째 인자: 리턴 타입

```java
int rowCount = this.jdbcTemplate.queryForObject("select count(*) from t_actor", Integer.class);
```

- 하나의 객체를 query할 때 with placeholder (`?`가 placeholder임)
	- 첫 번째 인자: sql, 두 번째 인자: 리턴 타입, 세 번째 인자: ?에 들어갈 값

```java
int countOfActorsNamedJoe = this.jdbcTemplate.queryForObject(
        "select count(*) from t_actor where first_name = ?", Integer.class, "Joe");
```

- query 결과가 필드 여러 개일 때
	- sql, mapper, ?에 들어갈 값

```java
Actor actor = jdbcTemplate.queryForObject(
        "select first_name, last_name from t_actor where id = ?",
        (resultSet, rowNum) -> {
            Actor newActor = new Actor();
            newActor.setFirstName(resultSet.getString("first_name"));
            newActor.setLastName(resultSet.getString("last_name"));
            return newActor;
        },
        1212L);
```

- query 결과 행이 여러 개일 때
	- sql, mapper, (?에 들어갈 값)

```java
List<Actor> actors = this.jdbcTemplate.query(
        "select first_name, last_name from t_actor",
        (resultSet, rowNum) -> {
            Actor actor = new Actor();
            actor.setFirstName(resultSet.getString("first_name"));
            actor.setLastName(resultSet.getString("last_name"));
            return actor;
        });
```

- RowMapper를 분리해서 사용할 때
	- sql, mapper, (?에 들어갈 값)

```java
private final RowMapper<Actor> actorRowMapper = (resultSet, rowNum) -> {
    Actor actor = new Actor();
    actor.setFirstName(resultSet.getString("first_name"));
    actor.setLastName(resultSet.getString("last_name"));
    return actor;
};

public List<Actor> findAllActors() {
    return this.jdbcTemplate.query("select first_name, last_name from t_actor", actorRowMapper);
}
```

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc-JdbcTemplate-examples-query)

### Updating Dao

- insert, update, delete query를 하나의 메서드로 사용 가능
	- sql, ? 값 가변인자

```java
this.jdbcTemplate.update(
        "insert into t_actor (first_name, last_name) values (?, ?)",
        "Leonor", "Watling");
```

```java
this.jdbcTemplate.update(
        "update t_actor set last_name = ? where id = ?",
        "Banjo", 5276L);
```

```java
this.jdbcTemplate.update(
        "delete from t_actor where id = ?",
        Long.valueOf(actorId));
```

- 참고 자료: [공식 문서](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc-JdbcTemplate-examples-update)

### Named Parameter

NamedParameterJdbcTemplate 클래스는 `?` 인수만 사용하여 JDBC 문을 프로그래밍하는 것과 달리 이름이 있는 매개변수를 사용하여 JDBC 문을 프로그래밍할 수 있게 한다.

`MapSqlParameterSource` 를 사용하면 다음과 같이 쓸 수 있다.

```java
// some JDBC-backed DAO class...
private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

public void setDataSource(DataSource dataSource) {
    this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
}

public int countOfActorsByFirstName(String firstName) {

    String sql = "select count(*) from T_ACTOR where first_name = :first_name";

    SqlParameterSource namedParameters = new MapSqlParameterSource("first_name", firstName);

    return this.namedParameterJdbcTemplate.queryForObject(sql, namedParameters, Integer.class);
}
```

만약 SQL에 값을 여러 개 넣어야 하는 경우는 `addValue()` 로 값을 추가해줄 수 있다.

```java
String sql = "SELECT :a + :b";

SqlParameterSource param = new MapSqlParameterSource()
								.addValue("a", 100)
								.addValue("b", 200);
```

Map을 사용하여 `String` 형의 매개변수 이름과 값을 `NamedParameterJdbcTemplate` 에 전달할 수 있다.

Map을 사용하는 방법의 예제이다.

```java
// some JDBC-backed DAO class...
private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

public void setDataSource(DataSource dataSource) {
    this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
}

public int countOfActorsByFirstName(String firstName) {

    String sql = "select count(*) from T_ACTOR where first_name = :first_name";

    Map<String, String> namedParameters = Collections.singletonMap("first_name", firstName);

    return this.namedParameterJdbcTemplate.queryForObject(sql, namedParameters,  Integer.class);
}
```

** `Collections.singletonMap` 은 단 하나의 키를 갖는 맵을 나타낼 때 사용한다.

### `BeanPropertySqlParameterSource` 클래스

아래와 같은 Actor 클래스가 있다고 가정하자.
getter는 필수적으로 필요하고, Actor의 필드 이름들은 자동으로 카멜 케이스에서 스네이크 케이스로 변환된다.

```java
public class Actor {

    private Long id;
    private String firstName;
    private String lastName;

    public String getFirstName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Long getId() {
        return this.id;
    }

    // setters omitted...

}
```

`:` 의 뒤에는 Actor 클래스의 필드 이름을 넣는다. (카멜 케이스 그대로)
`BeanPropertySqlParameterSource` 의 인자로 필드 이름과 같은 값을 갖는 객체를 넣어주면 자동으로 JdbcTemplate이 인식하여 쿼리가 수행된다.

```java
// some JDBC-backed DAO class...
private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

public void setDataSource(DataSource dataSource) {
    this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
}

public int countOfActors(Actor exampleActor) {

    // notice how the named parameters match the properties of the above 'Actor' class
    String sql = "select count(*) from T_ACTOR where first_name = :firstName and last_name = :lastName";

    SqlParameterSource namedParameters = new BeanPropertySqlParameterSource(exampleActor);

    return this.namedParameterJdbcTemplate.queryForObject(sql, namedParameters, Integer.class);
}
```

`NamedParameterJdbcTemplate` 은 JdbcTemplate을 래핑한 클래스이다.
래핑된 JdbcTemplate 에 접근하기 위해서는 `getJdbcOperations()` 를 사용하여 JdbcTemplate 에 접근할 수 있다.

-  참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc-NamedParameterJdbcTemplate)

## SimpleJdbcInsert

Data access layer의 초기화 메서드에서 `SimpleJdbcInsert` 클래스를 인스턴스화 해야 한다.
`setDataSource()` 메서드에서 dataSource를 초기화하고, 테이블 이름을 설정할 수 있다.

`SimpleJdbcInsert` 의 `execute()` 를 실행하기 위해서는 Map 객체를 만들어서 인자로 넘겨준다.
Map의 key는 테이블의 column 이름과 정확하게 일치해야 한다.

```java
public class JdbcActorDao implements ActorDao {

    private SimpleJdbcInsert insertActor;

    public void setDataSource(DataSource dataSource) {
        this.insertActor = new SimpleJdbcInsert(dataSource).withTableName("t_actor");
    }

    public void add(Actor actor) {
        Map<String, Object> parameters = new HashMap<>(3);
        parameters.put("id", actor.getId());
        parameters.put("first_name", actor.getFirstName());
        parameters.put("last_name", actor.getLastName());
        insertActor.execute(parameters);
    }

    // ... additional methods
}
```

### Auto-generated key 를 얻는 방법

auto-increment 되는 id가 있는 경우, 다음과 같은 방법을 사용해야 한다.

`SimpleJdbcInsert` 선언 시 `usingGeneratedKeyColumns("auto-increment 되는 컬럼 이름")` 을 설정해준다.

```java
public class JdbcActorDao implements ActorDao {

    private SimpleJdbcInsert insertActor;

    public void setDataSource(DataSource dataSource) {
        this.insertActor = new SimpleJdbcInsert(dataSource)
                .withTableName("t_actor")
                .usingGeneratedKeyColumns("id");
    }

    public void add(Actor actor) {
        Map<String, Object> parameters = new HashMap<>(2);
        parameters.put("first_name", actor.getFirstName());
        parameters.put("last_name", actor.getLastName());
        Number newId = insertActor.executeAndReturnKey(parameters);
        actor.setId(newId.longValue());
    }

    // ... additional methods
}
```

`executeAndReturnKey` 메서드로 auto-increment 된 ID의 값을 가져올 수 있다.

### insert에 필요한 column 제한하기

`usingColumns` 메서드를 사용하면 column 이름 목록을 지정해서 insert할 column을 제한할 수 있다.

```java
public class JdbcActorDao implements ActorDao {

    private SimpleJdbcInsert insertActor;

    public void setDataSource(DataSource dataSource) {
        this.insertActor = new SimpleJdbcInsert(dataSource)
                .withTableName("t_actor")
                .usingColumns("first_name", "last_name")
                .usingGeneratedKeyColumns("id");
    }

    public void add(Actor actor) {
        Map<String, Object> parameters = new HashMap<>(2);
        parameters.put("first_name", actor.getFirstName());
        parameters.put("last_name", actor.getLastName());
        Number newId = insertActor.executeAndReturnKey(parameters);
        actor.setId(newId.longValue());
    }

    // ... additional methods
}
```

실제로 코드에서는 이렇게 사용했다.

```sql
// 데이터 구조
CREATE TABLE GAME  
(  
    id          BIGINT   NOT NULL AUTO_INCREMENT,  
    trial_count INT      NOT NULL,  
    time        DATETIME NOT NULL default current_timestamp,  
    PRIMARY KEY (id)  
);  
  
CREATE TABLE PLAYER  
(  
    id        BIGINT      NOT NULL AUTO_INCREMENT,  
    game_id   BIGINT      NOT NULL,  
    name      VARCHAR(10) NOT NULL,  
    position  INT         NOT NULL,  
    is_winner BOOL     NOT NULL,  
    PRIMARY KEY (id),  
    FOREIGN KEY (game_id) references GAME (id) on update cascade  
);
```

내가 웹자동차 미션에서 사용했던 코드는 다음과 같다. 

```java
@Repository  
public class GameRepository {  
  
    private final SimpleJdbcInsert insertGame;  
  
    public GameRepository(final DataSource dataSource) {  
        this.insertGame = new SimpleJdbcInsert(dataSource)  
                .withTableName("game")  
                .usingColumns("trial_count")  
                .usingGeneratedKeyColumns("id");  
    }  
  
    public long save(final int trialCount) {  
        HashMap<String, Object> parameters = new HashMap<>();  
        parameters.put("trial_count", trialCount);  
        return insertGame.executeAndReturnKey(parameters).longValue();  
    }  
}
```

time이 default 값을 가지고 있기 때문에 사용하는 column을 넣어주지 않으면 null이 들어가게 된다.
time은 not null 이므로, `usingColumns` 를 사용하지 않으면 예외가 발생한다.
default 값을 갖는 column의 경우에는 `usingColumns` 를 사용하면 필요한 column만 지정할 수 있어 좋다.

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc-simple-jdbc-insert-1)