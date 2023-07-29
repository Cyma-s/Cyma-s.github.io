---
title   : Mock vs MockBean
date    : 2023-04-24 19:28:47 +0900
updated : 2023-04-24 19:29:11 +0900
tags     : 
- 개발
- spring
---

## Mockito.mock()

```java
@Test
public void givenCountMethodMocked_WhenCountInvoked_ThenMockedValueReturned() {
    UserRepository localMockRepository = Mockito.mock(UserRepository.class);
    Mockito.when(localMockRepository.count()).thenReturn(111L);

    long userCount = localMockRepository.count();

    Assert.assertEquals(111L, userCount);
    Mockito.verify(localMockRepository).count();
}
```

`Mockito.mock()` 메서드를 사용하면 클래스나 인터페이스의 mock 객체를 만들 수 있다.
`Mockito.when(메서드).thenReturn(리턴값)` 으로 Mock 객체의 행동을 정의할 수 있다. (stub: mock 객체의 기대행위를 작성하는 것)

mock 클래스 필드나 메서드의 지역 mock 객체를 생성하는데 사용할 수 있다.

## @Mock

`Mockito.mock()` 메서드의 축약어이다. 테스트 클래스에서만 사용해야 한다.
`mock()` 메서드와 달리 `MockitoJUnitRunner` 를 사용하여 테스트를 실행하거나 `MockitoAnnotations.initMocks()` 메서드를 명시적으로 호출하여 실행할 수 있다.

단, `@SpringBootTest` 또는 `@SpringMvcTest` 를 사용하여 mock 객체를 생성하는 `@MockBean` 및 테스트하려는 클래스의 인스턴스를 가져오는 `@Autowired` 와 함께 스프링 컨텍스트를 시작하면 mock bean이 autowired 의존성에 사용된다. 

데이터베이스와 상호 작용하는 코드에 대한 통합 테스트를 작성하거나, REST API를 테스트하고자 할 때 이 방법을 사용한다.

## @MockBean

스프링 컨텍스트에 mock 객체를 등록하고, 스프링 컨텍스트에 의해 `@Autowired` 가 동작할 때 등록된 mock 객체를 사용할 수 있도록 동작한다.

mock 객체를 애플리케이션 컨텍스트에 추가하기 위해 `@MockBean` 을 사용할 수 있다. mock 객체는 애플리케이션 컨텍스트에서 동일한 유형의 기존 bean을 대체한다. 

동일한 유형의 bean이 정의되어 있지 않으면 새로운 bean을 추가한다. 해당 어노테이션은 외부 서비스와 같은 특정 bean을 mocking 해야 하는 통합 테스트에 유용하다.

## 언제 사용하나?

Spring Boot Container가 테스트 시에 필요하고, Bean이 Container에 존재한다면 `@MockBean` 을 사용하고 아닌 경우에는 `@Mock` 을 사용한다.

`@WebMvcTest` 어노테이션을 사용하는 경우, Controller까지는 로드되지만 Controller의 협력 객체인 Service는 로드 되지 않는다. 따라서 Controller에 요청을 보낼 때 Service가 Bean Container에 생성되어 있지 않다면 NPE가 발생하게 된다.

다음 예제로 확인해보자.    
`RacingCarController` 는 `RacingCarService` 에 의존성을 가지고 있는 `@RestController` 이다.   
`RacingCarService` 내부에는 `RandomMoveStrategy` 라는 객체를 갖는다. 랜덤하게 값을 생성하여 움직일 수 있는지 없는지 확인하는 `isMovable()` 이라는 메서드를 제공한다.

`RandomMoveStrategy` 의 값이 랜덤하지 않고 항상 true를 리턴하도록 `@Mock` 어노테이션을 사용하여 행위를 정의했다.

```java
@WebMvcTest(RacingCarController.class)  
class RacingCarControllerTest {  
  
    @Autowired  
    private MockMvc mockMvc;  
  
    @Autowired  
    private ObjectMapper objectMapper;  
  
    @Mock  
    // @MockBean
    private RacingCarService racingCarService;  
  
    @Mock  
    RandomMoveStrategy randomMoveStrategy;  
  
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
                )  
        );  
  
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

`@MockBean` 을 사용해야 하는 `RacingCarService` 를 `@Mock` 으로 선언하게 되면, `RacingCarController` 에서 필요한 `RacingCarService` 를 auto-wiring 할 수 없게 된다.

```
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'racingcar.service.RacingCarService' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {}
```

그러나 `RandomMoveStrategy` 가 `@MockBean` 어노테이션으로 변경되었을 때는 아무런 예외가 발생하지 않는다.
`RandomMoveStrategy` 는 bean이 아니지만, Spring Bean Container가 관리해도 아무런 영향이 없기 때문에 예외가 발생하지 않는다.

즉, `@MockBean` 은 Bean Container에 생성되어야만 하는 mock 객체일 때 사용하면 된다.

## 참고 자료

- https://www.baeldung.com/java-spring-mockito-mock-mockbean
- https://stackoverflow.com/questions/44200720/difference-between-mock-mockbean-and-mockito-mock