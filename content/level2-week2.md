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

![[../attachments/Pasted image 20230425111822.png]]

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

![[../attachments/Pasted image 20230425121052.png]]

## RestAssured

![[../attachments/Pasted image 20230425121235.png]]
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