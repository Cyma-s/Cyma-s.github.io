---
title   : 레벨2 2주차
date    : 2023-04-25 10:52:38 +0900
updated : 2023-04-25 10:52:52 +0900
tags     : 
- 레벨2
- 우테코
---
# 4/25

## 2주차 목표

- 템플릿 엔진을 이용해 페이지 응답을 경험한다.
- 웹 애플리케이션에서의 테스트와 전구간 기능 테스트 구현을 경험한다.
- 인증 방법에 대해 학습하고 직접 구현해본다.
- Spring MVC Configuration 설정을 경험한다.
- Spring MVC 에서 MVC는 무엇을 의미하고 활용하는 이유를 궁금해 해보자.

## 목표와 계획을 제출한 이유

내가 잘 알고 있는 것이 맞는가? 어떻게 하면 더 잘 알 수 있을까? 에 대해 스스로에게 계속해서 질문을 던지자.

## 한 번 세운 목표와 계획은 끝까지 가야 하나?

목표: 레벨2 로드맵에 있는 것들을 제대로 알고 쓰고 싶다.
방법: 학습 로그 스터디를 하고, 공부하면서 모르는 내용을 계속해서 마인드맵처럼 공부하자.

다음의 질문을 계속하자.
- 레벨2가 끝날 때 내가 세운 목표를 달성했을 때의 내 모습이 만족스러울 것 같은가?: 만족스러울 것이다. 그러나 더 알았어야 했나라는 생각은 들 것 같다.
- 목표를 달성하는 것이 진정 내가 원하는 모습인가? 내가 원하는 모습에 도달하기 위한 목표는 아닌가? : 원하는 모습은 내가 쓰는 기술들을 알고 쓰는 것이다. 시간은 많으니 지금은 도달하지 못하더라도 계속해서 목표에 가까워지는 사람이 될 수 있을 것이다.
- 계획을 달성하면 목표에 도달할 수 있는가?: 도달할 수는 있지만, 완전히 도달할 수 있는지는 알 수 없다.
- 실행하는 데 어려움은 없었는가? 그 어려움은 해결할 수 없는 어려움은 아닌가?: 아직은 무엇을 모르는지, 어떤 것을 알아야 하는지 알지 못한다. 무언가를 판단하기에 지금은 너무 이른듯하다.

## Spring MVC 어디까지 왔나?

Spring MVC Annotation + Exception -> 오늘
Dispatcher Servlet이 추구하는 패턴 -> 두 번째 피드백 강의
HTTP & REST, API 설계 -> 금요일 강의
인증 + Spring MVC Configuration -> 다음 주 화요일 강의

Spring MVC Configuration이나 Spring MVC Annotation 등에서 삽질을 많이 해봐야 Dispatcher Servlet을 이해하기 수월할 것이다.

## Template Engine
(오늘 토리랑 허브랑 이야기한 내용인데 나와서 신기하다 ㅋㅋ)

![[request-structure.png]]

view는 Dispatcher Servlet에 의해 변환된다.
템플릿을 가지고 view가 결과물을 만들어서 Web browser에 전달한다.

```java
@Controller
public class SampleController{

	@RequestMapping(value = ~~)
	public String SampleMethod(Model model) {
		model.addAttribute("~~~~");
		return "sample";  // sample 이라는 template를 찾는다.
	}
}
```

템플릿의 기본 경로는 src/main/resources/templates이다.

Spring MVC는 thymeleaf view를 찾고, thymeleaf는 template으로 렌더링을 한다. 렌더링한 것을 web browser한테 전달한다.

## SpringBootTest

@SpringBootTest

-   ﻿﻿테스트 환경을 손쉽게 설정하도록 도와줌
-   ﻿﻿ApplicationContext를 자동으로 생성하여 테스트에서 사용할 수 있게 함
-   ﻿﻿기존 @ ContextConfiguration의 발전된 기능

### webEnvironment

@SpringBootTest의 webEnvironment 속성을 사용하여 테스트 서버의 실행 방법을 설정

-   ﻿﻿MOCK: Mocking된 웹 환경을 제공, MockMvC를 사용한 테스트를 진행 할 수 있음. 가짜 웹 환경을 구성한다.
-   ﻿﻿RANDOM_PORT: 실제 웹 환경을 구성
-   ﻿﻿DEFINED_PORT: 실제 웹 환경을 구성, 지정한 포트를 listen
-   ﻿﻿NONE: 아무런 웹 환경을 구성하지 않음

![[mockmvc.png]]

## RestAssured

![[rest-assured-test.png]]
RANDOM_PORT를 쓰면 포트 번호를 모르니까 주입을 받아야 한다. 

주입 받을 때 `@LocalServerPort` 로 주입을 받아야 한다.

```java
@LocalServerPort
int port;

@BeforeEach
public void setUp() {
	RestAssured.port = port;
}
```

RestAssured와 SpringBootTest로 전체 테스트를 경험해보자.

왜 부분이 아닌 전체를 검증할까?   
부분과 전체 중에 어떤 것이 더 중요할까?  

# 4/28

## 좋은 API 설계란?

### API 설계를 꼭 잘해야 하는가?

그냥 서버와 클라이언트 간의 약속만 잘하면 되는 거 아닌가?

but...
- 한 번 정해진 API는 바꾸기 쉽지 않다. API의 변경에 클라이언트가 영향을 받기 떄문이다.
- 새로운 데이터 요소와 비즈니스 규칙이 계속 추가/변경될 수 있다. 확장성 있는 API를 만들게 되면 앞으로의 시간을 아낄 수 있다.
- 잘 설계된 API는 커뮤니케이션 비용을 아껴준다.

### API 설계 표준화 시도

- 한 곳에 모아서 비교할 수 있는 서비스가 있었지만 없어졌다.
- 표준을 만드는 시도들이 있었지만 거의 사용되지 않고 있다.
- 각 서비스들마다 요구사항이 다르고 환경이 다르다.
- 자신들만의 설계를 원하는 경향이 있다.

### 좋은 API 특징

- 배우기 쉬울 것
- 문서가 없어도 사용하기 쉬울 것
- ﻿﻿잘못 사용하기 어려울 것
- ﻿﻿읽기 쉽고, API를 사용하는 코드를 유지보수하기 쉬울 것
- ﻿﻿요구사항을 만족시키기에 충분히 강할 것
- ﻿﻿확장하기 쉬울 것
- ﻿﻿사용하는 사람들의 수준에 맞을 것

## REST

미션 권장사항은 아님.

### REST 란?

- ﻿﻿WWW(web)과 같은 분산 하이퍼미디어 시스템을 위한 소프트웨어 아키텍 처의 한 형식, 로이 필딩의 2000년 논문을 통해서 공개
- 당시 웹은 큰 성공을 거두었지만 발전이 너무 빨라 관련 내용에 대한 표준이나 문서가 부족한 시기
- ﻿﻿웹과 같은 시스템이 어떻게 동작해야 하는지에 대한 구조적 모델을 만들어내고 표준 역할을 하기 위해 몇 가지 제약 조건을 만들어 냄
- ﻿﻿웹 기반으로 동작하는 대부분의 서비스도 글 뿐이 아닌 다양한 형태로 제공되기 때문에 분산 하이퍼미디어 시스템으로 볼 수 있음

### 요즘 REST 용어의 사용

- 최초 소개되었던 목적 보다 다소 과하게 쓰이기도 함
- 잘못 사용되는 경우도 많음
- 역사적인 관점에서 SOAP API와 경쟁관계인 시점에 마케팅 버즈워드로 많 이 사용되면서 SOAP 계열의 반대 슬로건으로 사용됨
- 그럼에도 리소스와 URI의 개념 등 API 설계 시 중요한 요소로 잘 스며들었다고 평가됨
- RESTful API 규칙이라고 불리는 것은 참고만 하고, 추상적인 제약 조건을 이해하고 일부 조건의 구체적인 세부 규칙을 직접 정해보자.
- 이게 어렵다면 굳이 REST를 시도하지 말고 HTTP 프로토콜 사용법에 맞는 정도로만 API를 설계하자.

## 용어 설명

### 리소스

자원과 내부적인 클래스 설계는 다를 수 있다. 
또한 클래스 설계는 데이터베이스와 다를 수 있다.

주소창으로 요청을 보내면 웹 페이지를 응답받을 수 있다.
페이지나 json 형태의 문자열을 응답으로 받을 수 있다.
서버로부터 얻을 수 있는 자원이 리소스다.

즉, 리소스란
- 네트워크 데이터 개체
- 클라이언트가 얻길 원하는 것
- URI로 식별할 수 있는 대상

## URI - path와 query

- path: 계층적 형태로 구성된 데이터
- query: 비계층적 형태로 구성된 데이터

### 리소스의 표현

서버로부터 응답 받는 것은 리소스인가? -> 아니다.

`RacingCar` 를 받는다고 했을 때 실제로 `RacingCar` 를 응답 받는 것이 아니라 표현을 전달받는 것이다.

서버는 리소스의 표현만 내려주는 것이 아니라 해석하는 방법을 알려줘야 한다.
=> 클라이언트가 리소스에 GET 요청을 보내면 서버는 그 리소스를 나타내는 방법을 제공해야 한다.

```http
Content-Type: application/json;charset=UTF-8
```

### 만약 여러 개의 표현이 있는 리소스라면?

- /racingcars/1이라는 리소스를 요청할 때 html 표현과 json 표현이 있다면 어떻게 해야할까?
	- html: 1번 레이싱카를 소개하는 페이지
	- json: 1번 레이싱카의 정보를 응답하는 JSON

## 많이 사용하는 API 설계

### 리소스 네이밍 가이드

- https://restfulapi.net

```java
@RestController
public class CartApiController {
	@PostMapping("/cart/add/{productId}")
	public ResponseEntity addCart(@PathVariable String productId) {
		cartService.addCart(autoService.toCart(Long.parseLong(productId)));
		return new ResponseEntity(HttpStatus.OK);
	}
}
```

Cart의 add는 계층이라고 보기 어렵다. 
add를 빼고, POST로 표현하는 것이 더 좋지 않을까.

```java
@RestController
public class HttpMethodController {
	@GetMapping("/items")
	public ResponseEntity<Void> addItem(@RequestBody Item item) {
		Item item = itemService.addItem(item);
		return ResponseEntity.ok().build();
	}
}
```

GET이 아닌 POST가 되면 좋을 것 같다.
ok 대신 201 (CREATED) 를 사용하면 좋겠다.