---
title   : S-HOOK 테스트 격리
date    : 2023-08-13 01:27:38 +0900
updated : 2023-08-13 01:27:45 +0900
tags     : 
- shook
- 테스트
- 레벨3
- 우테코
- spring
- trouble-shooting
---

## 테스트 격리가 되지 않으면 발생하는 문제

인수 테스트 메서드를 추가했는데, 이전에는 잘 동작하던 테스트가 깨지는 상황이 발생했다.    

![[acceptance-test-failed.png]]

문제는 테스트 격리가 되어 있지 않기 때문이다.    

조회를 하기 위해 repository 로 값을 저장해둔 상태였는데, 다른 테스트 메서드에서 조회할 때 다른 테스트 메서드에서 저장해둔 값이 함께 조회된 것이었다.     

```java
@DisplayName("특정 노래를 조회할 때, 이전 노래와 다음 노래의 정보를 담은 응답을 반환한다.")  
@Test  
void findById() {  
    // given  
    final VotingSong beforeSong = votingSongRepository.save(  
        new VotingSong("제목1", "비디오URL", "이미지URL", "가수", 20));  
    final VotingSong standardSong = votingSongRepository.save(  
        new VotingSong("제목2", "비디오URL", "이미지URL", "가수", 20));  
  
    // when  
    final VotingSongSwipeResponse response = RestAssured.given().log().all()  
        .when().log().all()  
        .get("/voting-songs/{voting_song_id}", standardSong.getId())  
        .then().log().all()  
        .statusCode(HttpStatus.OK.value())  
        .extract()  
        .body().as(VotingSongSwipeResponse.class);  
  
    // then  
    final List<VotingSongResponse> expectedBefore = Stream.of(beforeSong)  
        .map(VotingSongResponse::from)  
        .toList();  
  
    assertAll(  
        () -> assertThat(response.getBeforeSongs()).usingRecursiveComparison()  
            .isEqualTo(expectedBefore),  
        () -> assertThat(response.getCurrentSong()).usingRecursiveComparison()  
            .isEqualTo(VotingSongResponse.from(standardSong)),  
        () -> assertThat(response.getAfterSongs()).isEmpty()  
    );  
}
```

`getBeforeSongs` 에 이전에 등록했던 값들이 마구 추가되어 있었다.

인수테스트에서 테스트 사이에 영향을 줄 수 없도록, 인수테스트 격리를 해보자!

## 테이블 TRUNCATE 하기

```java
package shook.shook.support;  
  
import jakarta.annotation.PostConstruct;  
import jakarta.persistence.Entity;  
import jakarta.persistence.EntityManager;  
import jakarta.persistence.PersistenceContext;  
import jakarta.persistence.metamodel.EntityType;  
import java.util.List;  
import org.springframework.context.annotation.Profile;  
import org.springframework.stereotype.Component;  
import org.springframework.transaction.annotation.Transactional;  
  
@Component  
@Profile("test")  
public class DataCleaner {  
  
    private static final String TRUNCATE_FORMAT = "TRUNCATE TABLE %s";  
    private static final String ALTER_TABLE_FORMAT = "ALTER TABLE %s ALTER COLUMN ID RESTART WITH 1";  
    private static final String CAMEL_CASE_REGEX = "([a-z])([A-Z]+)";  
    private static final String SNAKE_CASE_REGEX = "$1_$2";  
  
    private List<String> tableNames;  
  
    @PersistenceContext  
    private EntityManager entityManager;  
  
    @PostConstruct  
    public void findDatabaseTableNames() {  
        tableNames = entityManager.getMetamodel().getEntities().stream()  
            .filter(DataCleaner::isEntityClass)  
            .map(DataCleaner::convertCamelCaseToSnakeCase)  
            .toList();  
    }  
  
    private static boolean isEntityClass(final EntityType<?> e) {  
        return e.getJavaType().getAnnotation(Entity.class) != null;  
    }  
  
    private static String convertCamelCaseToSnakeCase(final EntityType<?> e) {  
        return e.getName().replaceAll(CAMEL_CASE_REGEX, SNAKE_CASE_REGEX).toLowerCase();  
    }  
  
    @Transactional  
    public void clear() {  
        entityManager.flush();  
        entityManager.clear();  
        truncate();  
    }  
  
    private void truncate() {  
        for (String tableName : tableNames) {  
            entityManager.createNativeQuery(String.format(TRUNCATE_FORMAT, tableName))  
                .executeUpdate();  
            entityManager.createNativeQuery(String.format(ALTER_TABLE_FORMAT, tableName))  
                .executeUpdate();  
        }  
    }}
```

### 설명

test 프로필에서만 bean 이 주입되도록 `@Profile("test")` 를 달아주었다.     

**`findDatabaseTableNames()`**

해당 bean이 생성된 이후에 entity 클래스들을 가져와서 클래스 이름을 Camelcase 에서 snake_case 로 변경해준다.     
DB 테이블 이름은 snake_case 이기 때문이다!

**`clear()`**

쓰기 지연 저장소에 남아있는 쿼리들을 모두 수행한다.     
영속성 컨텍스트에 남아있는 데이터들을 모두 삭제한 후, 테이블을 `TRUNCATE` 한다.

**`truncate()`**

테이블을 `TRUNCATE` 하고, auto-increment 된 PK 값을 1로 돌려 놓는다.

## `AcceptanceTest` 클래스 생성

S-HOOK 에서 인수테스트는 공통적으로 `@SpringBootTest` 를 사용한다.     
따라서 모든 인수테스트에서 동일하게 테스트 격리를 수행하기 위해 + `DataCleaner` 를 언제나 `@Autowired` 하는 귀찮음을 덜기 위해 공통 부분을 `AcceptanceTest` 클래스로 분리했다.    

```java
package shook.shook.support;  
  
import io.restassured.RestAssured;  
import org.junit.jupiter.api.BeforeEach;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.boot.test.context.SpringBootTest;  
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;  
import org.springframework.boot.test.web.server.LocalServerPort;  
  
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)  
public class AcceptanceTest {  
  
    @Autowired  
    private DataCleaner dataCleaner;  
  
    @LocalServerPort  
    private int port;  
  
    @BeforeEach  
    void setUp() {  
        RestAssured.port = port;  
        dataCleaner.clear();  
    }  
}
```

이제 인수테스트를 작성할 때 `AcceptanceTest` 를 상속 받아 사용하면 된다.    

```java
class VotingSongControllerTest extends AcceptanceTest {
	// ...
}
```

![[acceptance-test-success.png]]

테스트 격리가 완료되어 모든 테스트가 통과하는 것을 볼 수 있다!