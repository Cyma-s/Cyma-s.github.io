---
title   : WebMvcTest
date    : 2023-04-24 13:48:48 +0900
updated : 2023-04-24 13:50:45 +0900
tags     : 
- spring
- 레벨2
- 학습로그
- 스터디
---

## WebMvcTest 어노테이션

WebMvcTest 는 Spring MVC controller를 테스트하기 위해 사용되는 Spring Boot의 어노테이션이다.
이 어노테이션은 전체 auto-configuration을 비활성화하고 대신 MVC 테스트와 관련된 구성만 적용한다.
즉, Application Context 를 완전하게 Start 하지 않고 Web Layer를 테스트 하고 싶을 때 `@WebMvcTest` 를 사용하는 것을 고려해볼 수 있다.

단위 테스트를 위해 Spring MVC 인프라를 자동으로 구성하지만, 스캔되는 Bean을 `@Controller`, `@ControllerAdvice`, `@RestController`, `@JsonComponent`, `Filter`, `WebMvcConfigurer`, `HandlerMethodArgumentResolver` 로 제한한다.    
만약 Service나 Repository의 Dependency가 필요한 경우에는 `@MockBean` 으로 주입 받아 테스트를 진행한다.    

`@WebMvcTest`를 사용할 때, 일반 `@Component`, `@Service`, `@Repository` bean은 스캔되지 않는다.   
따라서 `@MockBean` 또는 `@SpyBean` 을 사용하여 가짜 객체를 bean으로 등록해주어야 한다.    

## @SpringBootTest

프로젝트 안의 모든 bean을 등록하여 테스트를 한다. 단위 테스트처럼 기능을 테스트할 때보다는 통합 테스트를 할 때 사용한다.

서버를 띄우고 모든 bean을 등록하기 때문에 다양한 테스트 중에서 가장 운영환경과 유사한 테스트이다.

그러나 모든 bean을 로드하기 때문에 테스트 구동 시간이 오래 걸리고, 테스트 단위가 크기 때문에 디버깅이 어려울 수 있다.

Controller 레이어만 테스트하고 싶을 때에는 `@WebMvcTest` 를 쓰는 것이 유용하다.

## WebMvcTest 사용하기

기본적으로 `@WebMvcTest` 로 주석을 단 테스트는 Spring Security 및 MockMvc도 자동으로 구성한다.

테스트 클래스에 `@WebMvcTest` 어노테이션을 달고 테스트할 컨트롤러를 지정한다.

```java
@WebMvcTest(RacingCarController.class)  
class RacingCarControllerTest
```

이렇게 테스트할 컨트롤러를 지정하게 되면 전체 애플리케이션 컨텍스트가 아닌 `RacingCarController` 만 구성하게 된다.

해당 테스트에 적용해서는 안 되는 auto-configuration 클래스를 제외하도록 `excludeAutoConfiguration` 옵션을 지정할 수도 있다.

```java
@WebMvcTest(
    controllers = RacingCarController.class,
    excludeAutoConfiguration = SecurityAutoConfiguration.class,
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class)}
)
```

`excludeAutoConfiguration`: 해당 테스트에 적용되는 자동 설정들에서 제외할 빈을 등록할 수 있다.   
`excludeFilters` : 추가되는 bean들 중에 제외하고 싶은 Bean의 필터를 등록한다. 즉, `classes`에 들어갈 Bean을 제외하기 위한 필터를 정의하는 것이다. `ASSIANABLE_TYPE` 속성은 제외할 기준을 클래스로 지정한다.    

```java
@WebMvcTest(RacingCarController.class)   
class RacingCarControllerTest {  
  
    @Autowired  
    private MockMvc mockMvc;  // 주입 O  

	...
}
```

`@WebMvcTest` 만 선언해주어도, MockMvc 객체가 주입되게 된다.   
또한 `@MockBean` 을 사용해서 필요한 의존성에 대해 mock 구현을 제공할 수도 있다.

Web Layer 관련 빈들만 등록하기 때문에, 컨트롤러는 주입이 정상적으로 되지만, `@Component` 로 등록된 Repository와 Service는 주입이 되지 않는다.  

```java
@WebMvcTest(RacingCarController.class)  
class RacingCarControllerTest {  
  
    @Autowired  
    private MockMvc mockMvc;  // 주입 가능하다.
  
    @Autowired  
    private RacingCarService racingCarService;  // 주입이 되지 않는다.  
	...
}
```

따라서, `@WebMvcTest` 에서 Repository와 Service를 사용하기 위해서는 `@MockBean` 을 사용하여 bean으로 등록해주어야 한다.  

`@MockBean` 이란 가짜 객체로, 호출과 결과를 임의로 조작하여 해당 단위 테스트에만 집중할 수 있도록 도와준다.   

```java
@WebMvcTest(RacingCarController.class)  
class RacingCarControllerTest {  
  
    @Autowired  
    private MockMvc mockMvc;  
  
    @MockBean  
    private RacingCarService racingCarService;  // 주입이 가능하다.   
  
    @Mock  
    RandomMoveStrategy randomMoveStrategy;   // Service 내부에서 사용하는 RandomMoveStrategy Mocking   

	...
}
```

### 테스트 코드 작성해보기

```java
    @Test  
    void play_메서드가_적절한_형식을_반환한다() throws Exception {  
        final PlayRequest playRequest = new PlayRequest("브리,토미,브라운", 1);  
        final String request = objectMapper.writeValueAsString(playRequest);  
        Car bri = new Car("브리");  
        Car tomi = new Car("토미");  
        Car brown = new Car("브라운");  
        List<Car> cars = List.of(bri);  
        final PlayResponse playResponse = PlayResponse.of(  
                RacingCarWinnerDto.of(cars),  
                List.of(  
                        RacingCarStatusDto.from(bri),  
                        RacingCarStatusDto.from(tomi),  
                        RacingCarStatusDto.from(brown)  
                )        );  
  
        // given  
        given(randomMoveStrategy.isMovable()).willReturn(true);  
        given(racingCarService.play(any(PlayRequest.class)))  
                .willReturn(playResponse);  
  
        // then  
        mockMvc.perform(post("/plays")  
                        .content(request)  
                        .contentType(MediaType.APPLICATION_JSON))  
                .andExpect(status().isOk())  
                .andExpect(jsonPath("$.winners[0]").value("브리"))  
                .andExpect(jsonPath("racingCars", hasSize(3)))  
                .andExpect(jsonPath("$.racingCars[0].name").value("브리"))  
                .andExpect(jsonPath("$.racingCars[0].position").value(0));  
    }
}
```

`given()`, `when()`, `willReturn()`, `thenReturn()` 메서드들은 BDDMockito에 정의되어 있다.

`@MockBean` 으로 등록한 Service의 행동을 `given()` 으로 지정해준다.  
`willReturn()` 에서는 해당 행동에서 어떤 값을 리턴해야 하는지 지정한다.

`perform()` 에서 컨트롤러에 요청을 전송한다.  
`andExpect()`에서는 응답을 검증하는 역할을 한다.   
`status()` 은 상태 코드를 검증한다.
`content()` 은 응답에 대한 정보를 검증할 수 있다.

### WebMvcTest의 장단점

`@WebMvcTest`를 사용하면 Spring MVC에 집중한 테스트를 할 수 있다.   
Web Layer에 필요한 bean들만 등록하기 때문에 상대적으로 빠르고 가벼운 테스트를 할 수 있다.   
또한 통합 테스트가 어려운 상황에서 Mock으로 테스트할 수 있다는 장점이 있다.   

그러나 요청부터 응답까지 모든 테스트를 Mock 기반으로 테스트하기 때문에 실제 환경에서는 오류가 발생할 수 있다는 단점이 있다.   

이러한 이유로 `@WebMvcTest` 는 컨트롤러 테스트나 단위 테스트 시에 많이 사용한다.   

### 추가 : @RunWith 은 안 써도 될까?

구글링을 하다보면 많은 코드에서 Test를 작성할 때 `@RunWith(SpringRunner.class)` 를 같이 써준 것을 볼 수 있다.

```java
// 많이 찾아볼 수 있는 코드
@RunWith(SpringRunner.class) 
@WebMvcTest(RacingCarController.class) 
public class Test { 
	... 
}
```

JUnit4를 사용한다면 `@RunWith(SpringRunner.class)` 를 같이 추가해줘야지만 annotation이 무시되지 않는다.   
JUnit5를 사용한다면 `@RunWith`을 추가해 줄 필요가 없다. JUnit5에서는 `@WebMvcTest` 에도 `@RunWith` 어노테이션이 내장되어 있다.   

![[junit-dependency.png]]

이번 jwp-racingcar 미션에서는 JUnit5가 의존성에 포함되어 있기 때문에 테스트 코드마다 매번 `@RunWith` 를 써줄 필요가 없다.

## 참고 자료

- [공식 문서](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/servlet/WebMvcTest.html)
