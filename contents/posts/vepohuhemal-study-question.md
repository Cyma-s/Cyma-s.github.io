---
title: 베포후헤말 스터디 면접 질문 준비
date: 2023-03-24 10:51:37 +0900
updated: 2024-07-17 17:42:41 +0900
tags:
  - 스터디
  - 우테코
---

# 3/24 면접

## 동등성과 동일성

- **동일성과 동등성의 차이는 무엇인가요?: 후추**
- **꼬리질문- 해쉬값의 무결성이란? hashcode를 제대로 정의했다면 equals에서 문제가 발생하지 않는다는 뜻인가? : 후추**
- == 연산자와 equals 연산자는 어떤 차이가 있는가?
- **각 인스턴스가 본질적으로 고유한 경우에도 `equals` 를 재정의하는 것이 좋을까요?: 헤나**
- **enum 같은 경우에는 `equals`를 정의하지 않나요?: 헤나**
- 언제 `equals` 를 재정의하지 않아도 되나요?
- 언제 재정의하면 안 되나요?
- **`equals`를 사용자 정의한다고 했을 때, `equals` 메서드에 들어가야 할 구현은 뭐가 있을까요?: 포이**

## 불변 클래스

- **프로그래밍 할 때 모든 클래스는 불변 클래스로 만드는 쪽으로 설계하는 것이 좋다고 생각하시나요?: 헤나**
- 불변성이 뭔가요?
- **불변 객체도 리플렉션을 사용해서 불변성을 깰 수 있는데 그래도 불변 객체가 맞을까요?: 헤나**
- **클래스 확장을 막는 경우 어떤 장단점이 있나요?: 후추**
- 불변 클래스를 왜 써야 하나요?
- **불변 클래스의 내부에 리스트 필드를 갖는 클래스는 불변 클래스가 될 수 있을까요? 어떻게 불변 클래스로 만들 수 있을까요?: 포이**

## 접근 제어자

- **`private`의 접근 범위는 어디까지일까요?: 헤나**
- `protected`, `package-private` 이 어떻게 구분되어 사용되면 좋을까요?
- **하위 클래스가 같은 패키지에 있을 때에도 `package-private`이 아닌 `protected` 를 쓸 필요가 있다고 생각하시나요?: 포이**
- **생성자를 `private`으로 만들 때 예외를 던지시는 편인가요?: 후추**

## 디폴트 메서드

- **디폴트 메서드는 어떨 때 사용하면 좋나요?: 후추** -> 기존의 인터페이스를 수정할 일이 있을 때 사용하면 좋다. 기존에 있던 코드를 재사용할 때
- 추상 클래스의 구현 메서드와 인터페이스의 디폴트 메서드는 어떤 점이 다른가요?
- **디폴트 메서드의 단점은 어떤 것이 있을까요?: 헤나**  -> 남용할 가능성이 높다.
- 디폴트 메서드를 사용하지 않는 다른 언어에서는 어떻게 해결하고 있나요? -> 
- 디폴트 메서드 사용하기 이전에는 어떤 식으로 문제를 해결했을까요?
- 디폴트 메서드를 사용해서 실제로 발생했던 문제는 어떤 것이 있나요?
- **거의 대부분이 같은 기능을 하고, 일부만 다른 기능을 구현할 때 `abstract`를 쓰는 것이 좋나요, 아니면 디폴트 메서드를 쓰는 게 좋나요?: 포이** -> abstract가 더 낫다. 오버라이딩에 경고가 뜨지 않는다. 하위 클래스가 이렇게 구현했다고 알 수 없기 때문에.

## 피드백

### 헤나

- 칭찬: 쫄지 않고 잘 말했다. 대답할 때 적절한 시선 처리.
- 성장점: 모르면 모른다고 말하자. 질문이 이해가 안 된다면 다시 물어보자. 답변에 대한 이유가 있는 게 좋을 거 같다.

### 후추

- 자세가 좋았다. 대답할 때 질문한 사람을 쳐다보는 게 좋았다. 겁없이 안정적인 느낌.
- 질문이 이해가 안 된다면 다시 물어보자.

### 베로

- 빠르게 동의하는 게 좋았다. 이전 의견에 대한 근거 말해준 것도 좋았다. 리액션이 좋았다. 대답의 당참. 질문 이해가 안 간다고 말한 것. 자세, 말하는 톤, 행동 좋았다.
- 성장점: 기술에 대한 부적절한 대답. 어떤 의견을 물어볼 땐 트레이드오프를 말해주는 게 좋을 거 같다.

### 포이

- 모르면 모른다고 말했음. 이해 안 됐을 때 말한 거, 차분하게 생각해 달라고 말한 거 좋았다. 
- 트레이드 오프 말하기. 근거는 뭔지 말하면 좋을 거 같다. 답변에 대한 이유가 있는 게 좋을 거 같다.

# 4/7 면접

## 면접 정리

### 리소스 자동 반납

- 예외가 `try`, `finally` 모두에서 발생할 수 있기 때문에 `finally` 로 자원 회수 코드를 명시해줘도 문제가 발생할 수 있다.
- 예외가 두 곳에서 발생하는 경우 두 번째로 발생한 예외가 첫 번째 예외를 삼키게 되어 디버깅이 어려워진다.

#### 추가로 알게 된 내용
- Garbage Collector는 메모리 용량에 따라 소멸 여부를 결정한다. 데이터 제거 순서는 무작위이다.

#### finalize() 는 언제 쓸까?
- 명시적 종료 메서드 패턴에서 호출되지 않을 것을 대비하기 위한 방어 역할을 위해 `finalize()` 를 재정의한다.
	- `FileInputStream` 에서 명시적으로 종료 메서드를 호출하지 않았을 경우를 대비해 `finalize()` 메서드에 메모리 해제를 하도록 재정의되어 있다.
- 네이티브 피어 리소스(다른 언어로 작성된 프로그램을 자바에서 다루기 위해 만들어 놓은 객체)를 해제할 때 사용한다. 일반 객체가 아니어서 GC가 관리하지 않기 때문이다.
- [참고 자료](https://camel-context.tistory.com/43)

### Optional
- [참고자료](https://mangkyu.tistory.com/70)

## Enum

- **enum을 사용해서 singleton을 만들라는 말이 있는데, 그렇게 하면 어떤 이점이 있을까요?** : 헤나
- enum을 사용해야 하는 이유가 있을까요?
- **enum을 언제 사용하셨나요? 어떨 때 enum을 사용해야 한다는 기준이 있으신가요?** : 포이
- **enum 대신 클래스를 사용하는 것이 좋은 경우는 언제인가요?** : 포이
- enum의 컴파일 타임 안전성에 대해 알고 계시나요?
- **enum의 ordinal 메서드를 사용해보신 적 있나요? ordinal 메서드를 사용하는 것에 대해 어떻게 생각하시나요?** : 후추
- **ordinal 메서드는 왜 만들어졌을까요?** : 후추
- **enum의 `name()`, `toString()` 은 어떻게 나눠서 써야할까요?** : 헤나
- **enum의 `toString()` 을 사용자 필요에 의해 재정의하는 것에 대해 어떻게 생각하시나요?** : 헤나
- **enum의 단점은 뭐가 있을까요?** : 헤나, 후추
- **enum의 생성자가 private 인데, 그 이유가 뭐라고 생각하시나요?** : 후추

## 함수형 인터페이스

### 기본 질문
- 함수형 인터페이스의 동시성 이슈를 없앨 수 있다는 것이 무슨 의미인가요?
- 함수형 인터페이스의 종류에는 어떤 것이 있나요?
- Object 객체의 메서드만 인터페이스에 선언되어 있는 경우에는 함수형 인터페이스가 맞을까요?
- **자바의 표준 함수형 인터페이스 중에 써 본 거 말해주세요.** : 헤나
- **람다란 무엇인가요?** : 후추

### 의견 질문
- **함수형 인터페이스에서 static method, default method를 사용하는 게 적절하다고 생각하시나요?** : 헤나
- **익명 클래스를 썼을 때보다, 람다를 이용한 방법의 장점이 어떤 것이 있다고 생각하시나요?** : 포이
- **클래스를 선언하는 것은 문서화 과정 중의 하나라고 생각하는데, 람다식을 쓰는 것보다 클래스를 선언하는 게 낫지 않을까요?** : 후추
- **함수형 인터페이스 구현 시에 익명 클래스를 쓰는 것이 더 좋은 경우가 있나요?**: 포이
- 불필요한 함수형 인터페이스를 만들지 말고 표준 함수형 인터페이스를 사용하라는 말이 있는데 왜라고 생각하시나요?
- **함수형 인터페이스를 쓰면서 좋았던 점이 있나요?** : 헤나

## try-with-resources

### 기본 질문
- try-with-resources가 garbage collector가 관리하는 방식보다 나은 점이 무엇인가요?
- **`try/catch/finally` 문에서 메모리 누수가 일어날 가능성이 있는 이유는 무엇인가요?** : 헤나
- `finalize()` 함수는 어디에 정의되어 있는 함수인가요?
- **garbage collector의 수집 대상이 되는 객체는 어떤 객체인가요?** : 포이
- `finalize()` 함수의 단점은 무엇인가요?
- 그럼 `finalize()` 함수는 언제 사용해야 하나요?
- **try-with-resources의 장점은 무엇인가요?** : 후추
- **garbage collector가 자원을 해제해 줄 것인데 왜 자원 해제를 해줘야 할까요?** : 후추

### 의견 질문
- **자바에서 개발자가 garbage collector 한테 지금 당장 객체를 파괴하도록 강제할 수 없게 만든 이유가 뭐라고 생각하시나요?** : 후추

## Optional

### 기본 질문
- **Java에서 Optional이 왜 등장했다고 생각하시나요?** : 후추
- Optional의 `ofNullable()`, `of()` 의 차이점은 무엇인가요?
- **Optional의 `orElse()` 와 `orElseGet()` 의 차이점은 무엇인가요?** : 베로
- Optional은 어떻게 사용했을 때 가장 좋을까요?
- **Optional을 반환타입으로만 사용해야 하는 이유가 뭘까요?** : 헤나

### 의견 질문
- null을 반환하는 것의 단점은 무엇일까요?
- **`orElse()` 는 언제 써야 할까요?** : 후추
- Optional을 사용하신 적이 있나요? 어떤 경우에 사용하셨었나요? 언제 사용하면 좋을까요?
- Optional을 사용할 때 단점이 있을까요?
- **Optional이 아닌 null을 반환해야하는 경우도 있을까요?** : 포이
- **필드의 일부 혹은 전체가 null일 수 있는 상황에서도 Optional을 필드로 사용해서는 안 될까요?** : 헤나
- **Optional은 언제 사용하는 것이 좋을까요?** : 헤나
- 반환 인자가 generic으로 선언되어 있을 때, 함수형 인터페이스가 들어갈 수 있을까요?

## 피드백

### 헤나
- 좋은 점: 아는 부분에 대해 예시를 들어가면서 자세하게 답변하는 모습이 좋았다. 단점 말할 때 장점도 같이 말해주는 게 좋았다. 질문을 제대로 이해했는지 다시 물어보는 부분이 좋았다.
- 성장점: 답변하는 문장의 호흡이 길다. 문장을 마무리하는 부분을 고치면 좋을 것 같다.

### 후추
- 좋은 점: 굉장히 차분하게 잘 말한다. 잘 모르는 부분도 잘 말해서 대단하다. 어... 같은 말을 안 써서 말을 듣기 편하다. 빠른 인정 좋다. 어떻게 방금 본 내용을 그렇게 잘 말할까. 목소리 톤이 안정적이다. (감기임) 
- 성장점: 

### 베로
- 좋은 점: 생각하는 부분, 아는 부분에 대해서는 잘 말했다. 질문을 잘 알아들어서 좋았다.
- 성장점: 생각할 때 음, 어라는 말이 많았다. 답변이 길어지니 질문에서 벗어난 답변을 하는 것 같다.

### 포이
- 좋은 점: 자신감 있게 말하는 부분이 좋았다. 예시를 요구하는 부분 좋았다. GC 설명하는 거 잘했다.
- 성장점: 짧은 답변이 많아서 좀 더 자세하게 말해줬으면 좋겠다. 덧붙여서 말해주는 게 있으면 좋겠다. 

# 4/20 면접

## JDBC

SQLException은 catch 블록으로 반드시 처리해야 하는 checked 예외이다.
대부분의 데이터베이스 연결 생성 실패나, 작성 오류가 있는 쿼리같은 오류들은 대부분 catch로 해결할 수 없어서 상위 코드로 예외 처리를 넘겨야 한다.

명령문이나 데이터베이스 연결 객체를 생성하는 코드, 객체들을 cleanup 하는 코드가 없어서 가독성이 좋다. 비즈니스 로직에 좀 더 집중할 수 있다.

## GRASP

- **GRASP 원칙 중에서 가장 중요하게 지켜져야 하는 규칙은 무엇이라고 생각하시나요? 그 이유는?** : 후추
- **결합도가 극단적으로 낮으면 항상 좋은 걸까요?** : 후추
- **낮은 결합도를 위해서는 어떠한 것들을 할 수 있을까요?** : 후추
- **응집도가 극단적으로 높은 것은 언제나 좋은 것일까요?** : 말랑 
- **왜 응집도를 높이면 결합도가 높아질까요?** : 말랑
- **Pure Fabrication(순수 조립)의 단점은 어떤 것이 있나요?** : 말랑
- (정보 전문가 패턴) **책임을 할당할 객체를 정할 때 주로 어떻게 정하는 편이신가요?** : 포이
- 결합도가 높을 때의 장점은 없을까요? / 응집도가 낮을 때의 장점은 없을까요?
- **클래스 분리는 어떤 기준으로 하시나요?** : 포이 / 클래스 분리는 어떤 때에 수행되어야 할까요?
- **간접 참조를 사용하게 되면 중간 객체가 생겨 오히려 복잡한 설계가 되지 않을까요? 어떤 때에 간접 참조를 사용하면 좋을까요?** : 포이

## GRASP

- GRASP 원칙 중에서 가장 중요하게 지켜져야 하는 규칙은 무엇이라고 생각하시나요? 그 이유는? : 후추
- 결합도가 극단적으로 낮으면 항상 좋은 걸까요? : 후추
- 낮은 결합도를 위해서는 어떠한 것들을 할 수 있을까요? : 후추
- 응집도가 극단적으로 높은 것은 언제나 좋은 것일까요? : 말랑 
- 왜 응집도를 높이면 결합도가 높아질까요? : 말랑
- Pure Fabrication(순수 조립)의 단점은 어떤 것이 있나요? : 말랑
- (정보 전문가 패턴) 책임을 할당할 객체를 정할 때 주로 어떻게 정하는 편이신가요? : 포이

## ArgumentResolver

- ArgumentResolver 는 무엇인가요?
- ArgumentResolver는 언제 호출이 될까요?
- 인자가 전달되면 메서드에서 어떤 과정이 진행되는지 말해주세요
- ArgumentResolver를 사용한 적이 있으신가요?
- 왜 인터셉터에서 파라미터가 있는지 없는지 확인해야 할까요?
- ArgumentResolver에서 Jwt를 변환해줄 수 있는데, 다른 위치에서 변환을 해보신 적도 있나요?

## DI, Spring의 의존성 주입 방식

- 양방향 의존 관계에 대해서는 어떻게 생각하시나요? : 헤나
- 양방향 의존이 필요한 경우가 있을 수 있다고 하셨는데, 어떤 경우에 양방향 의존이 필요할까요? : 헤나
- 의존 관계에 대해 설명해주세요 : 헤나
- Spring한테 의존성 주입을 맡기는 것에 대한 이점이 있을까요? - scope를 자유자재로 바꿀 수 있다. 설정해야 하는 코드가 사라진다.

## JDBC

- 자바에서 데이터베이스에 접근하는 코드를 작성할 때 필요한 객체가 어떤 게 있었나요?: 헤나
- 사용자가 JdbcTemplate을 사용할 때 정의해야 하는 일이 무엇이 있을까요? : 헤나

# 4/28 면접

## Auto-Configuration

추가된 jar 의존성을 바탕으로 Spring 애플리케이션을 자동으로 구성한다. Auto-configuration은 custom configuration으로 대체될 수 있다.

auto-configuration을 구현하는 클래스에 `@AutoConfiguration` 어노테이션을 달아야 한다.

일반적으로 auto-configuration 클래스는 `@ConditionalOnClass` 나 `@ConditionalOnMissingBean` 어노테이션을 사용한다.

Spring Boot는 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 파일이 있는지 확인한다. 해당 파일은 configuration 클래스가 한 줄에 하나의 클래스 이름으로 나열되어 있어야 한다.

configuration을 특정 순서로 사용해야 하는 경우, `@AutoConfiguration` 어노테이션 또는 `@AutoConfigureBefore`, `@AutoConfigureAfter` 어노테이션을 사용할 수 있다.

user configuration, condition evaluation 등 다양한 요소의 영향을 받을 수 있다.

## 질문

- `AutoConfiguration` 을 사용해보신적 있으신가요?
- `AutoConfiguration` 이 무엇인가요?
- `WebMvcTest` 가 꼭 필요하다고 생각하시나요? : 포이
- 기본 에러 페이지에서 url만 알면 마음대로 error 페이지에 접근할 수 있다는 단점이 있다고 하셨는데, 왜 이게 단점이라고 생각하시나요? : 포이
- 커스텀 예외를 사용하시나요? 사용하신다면 왜 사용하시는지 궁금합니다.
- WebMvcTest의 `excludeFilters` 에 대해 설명해주세요.
- `@Order` 어노테이션을 사용하는 것에 대해 어떻게 생각하시나요?
- `@ControllerAdvice` 에서 json을 리턴하는 것에 대해 어떻게 생각하시나요? : 포이
- `@ControllerAdvice` 에서 커스텀 예외를 지정할 수도 있고, validation 어노테이션의 message를 사용하는 방법도 있는데 어떤 방법이 더 낫다고 생각하시나요? : 헤나
- `HandlerAdapter` 의 매개변수가 왜 `HandlerMethod`가 아니라 `Object` 일까요? -> 컨트롤러로 요청을 넘겨주기 전에 처리해야 하는 인터셉터 등을 포함하기 위해서 : 헤나
- `DispatcherServlet`이 맡는 공통 작업은 무엇인가요? : 헤나
- `WebMvcTest` 가 `SpringBootTest` 와 비교했을 때 어떤 부분이 다른가요?
- 통합 테스트가 어려운 상황에는 어떤 것이 있을까요? : 헤나
- controller 테스트가 필요하다고 생각하시나요? : 말랑
- controller 테스트에서 체크해야 하는 건 뭐가 있을까요? : 말랑
- qualifier 랑 primary 어노테이션의 우선순위가 뭘까요? : 말랑
- DispatcherServlet이 있을 때와 없을 때의 차이에 대해 말해주세요. : 말랑
- DispatcherServlet에서 어떤 과정을 거쳐서 적절하게 요청을 처리하는지 설명해주세요. : 포이
- `HandlerExecutionChain` 을 직접 실행하지 않고, `HandlerAdapter` 를 통해 실행하는 이유가 무엇일까요? -> 컨트롤러는 다양하게 구현되어 있으므로, 구현 방식에 상관 없이 요청을 위임하도록 어댑터 패턴을 사용한다. : 헤나
- DispatcherServlet을 한 문장으로 설명해주세요. : 헤나

## 알려주고 싶은 내용

- DispatcherServlet의 patch 메서드 처리만 다르다. doPatch만 없음.

# 5/15 면접

## 쿠키와 세션, 토큰을 이용한 인증
- 인증: 유저가 서비스에 등록된 유저인지 확인하는 것
- 인가: 유저가 해당 요청에 대한 권한을 갖는지 확인하는 것

### HTTP의 Connectionless
클라이언트와 서버가 요청과 응답을 한 번 주고받으면 연결을 끊어버리기 때문에 항상 새로운 연결을 맺어야 한다. 이런 요청들에 대한 정보의 상태는 저장하지 않는다. 
따라서 여러 서버가 존재하는 환경에서 클라이언트 요청에 대해 어떤 서버가 응답하더라도 상관 없다. 
이런 경우 인증 정보도 유지되지 않아 계속해서 인증 정보를 보내야 한다는 문제가 있다. 

### 쿠키
key-value 형태로 저장되는 작은 데이터. 웹 서버에 요청할 때 헤더에 쿠키를 담아 전송한다.
만료 날짜까지 유지되는 영속 쿠키, 브라우저가 종료되기 전까지 유지되는 세션 쿠키가 있다.
쿠키는 사용자가 임의로 변경할 수 있다. 

세션 하이재킹: 인증이 완료된 사용자의 브라우저에서 인증 정보가 담긴 세션 쿠키를 탈취하여 로그인 없이 서버와 통신하는 것

### XSS & HTTP Only 쿠키
XSS는 공격자가 악의적인 스크립트 코드를 삽입하여 의도치 않은 명령을 실행시키거나 세션을 탈취하는 공격
HTTP Only 쿠키는 개발자가 간단한 접미사를 쿠키 생성 코드에 추가함으로써 활성화할 수 있다.

```java
Set-Cookie: 쿠키명=쿠키값; path=/; HttpOnly
```

브라우저에서 해당 쿠키로 접근할 수 없게 되지만, 쿠키에 포함된 정보의 대부분이 브라우저에서 접근할 필요가 없어 HTTP Only Cookie는 기본적으로 적용하는 것이 좋다.

그러나 여전히 네트워크를 직접 감청하는 등의 방식으로 쿠키 탈취가 가능하다. 
이를 위해 HTTPS 프로토콜을 사용하여 쿠키에 대한 정보를 암호화해서 전송할 수 있다.

그럼에도 쿠키는 기본적으로 모든 요청에 포함되기 때문에 쿠키의 정보는 전달되게 된다.
Secure 쿠키: HTTPS 프로토콜을 사용할 때만 쿠키를 전달하는 방법이 있다.

### 세션
민감한 정보들을 서버에 저장하고, 연결을 유지하는 방법이다.
인증된 사용자의 식별자에 대응하는 임의의 문자열 session id를 생성한다.

쿠키는 클라이언트에 저장되며, 세션은 서버에 저장되므로 쿠키에 비해 비교적 안전하다.
세션은 쿠키에 비해 느리다. 서버에 동시 접속하는 사용자가 많아지면 메모리 공간이 부족해져서 서버에 부하가 걸린다.
여러 기기에서의 로그인을 제한하기 위해 필요한 때에 로그인 되어 있는 사용자를 강제로 로그아웃을 시킬 때 사용하기도 한다. 

스케일 아웃으로 서버를 확장하게 되면, 서버 별로 세션을 따로 관리하기 때문에 세션 불일치 문제가 발생한다. 

#### Sticky Session
동일한 클라이언트의 요청을 처음 요청이 처리된 서버로만 보내는 것. 로드밸런서 설정으로 변경할 수 있다. 

그러나 트래픽이 한 곳으로 몰릴 수 있고, 서버의 가용성을 최대한 활용하지 못한다는 단점도 존재한다.
또한 하나의 서버에 장애가 발생하면 해당 서버를 사용하는 사용자는 세션 정보를 잃어버리게 된다. 

#### Session Clustering
특정 서버에서 세션이 생성되는 경우, 다른 서버로 전파해서 세션을 복제하는 방식으로 세션 불일치를 해결한다.
Tomcat 에서는 All-to-all 세션 복제를 사용한다. 변경 요소가 발생하면 변경 사항이 모든 세션에 복제된다.

유저가 어떤 서버에 접속하더라도 로그인 정보가 세션에 복제되어 있어 정합성 이슈가 해결된다.
그러나 모든 서버가 동일한 세션 객체를 가져야 하므로 많은 메모리가 필요하다. 또한 서버 수에 비례하여 네트워크 트래픽이 증가한다. -> 소규모 클러스터에서 좋은 효율을 보여준다.

#### Session Server 분리
세션을 저장하는 세션 서버를 외부 서버로 분리하여 사용한다.
세션 서버로는 입출력이 잦은 세션의 특성 상, In-Memory DB인 Redis를 사용하는 것이 일반적이다.

새로운 서버를 띄우더라도 기존 서버의 수정이 발생하지 않는다.
그러나 외부 서버를 거쳐야 하므로 성능이 조금 느려지며, 분리된 세션 서버가 죽는 순간 모든 세션이 사라지기 때문에 해당 세션 서버의 다중화와 데이터베이스의 Reflecation도 고려해야 한다. (가용성을 확보하기 위해 동일한 세션 저장소 하나를 더 구성하여 복제한다.)

### 토큰
토큰 기반 인증은 쿠키와 비슷하게 인증 정보를 클라이언트에 저장한다. 쿠키나 로컬 스토리지에 저장되게 된다.
`Authorization` 헤더에 실어 보내고, 토큰의 위변조, 만료 시간을 확인하고 인증 정보를 확인하여 사용자를 인가한다. 
JWT 는 쉽게 복호화 가능하므로, 중요한 개인 정보를 넣어서는 안 된다.

세션 방식에 비해 scale out 관점에서 별도로 처리해주어야 할 것들이 없어진다.
세션에 비해 서버에 전송되는 데이터의 양이 훨씬 많다. 또한 바로 데이터를 확인 가능하기 때문에 민감한 데이터를 담으면 안 된다는 단점이 있다. 한 번 발행한 토큰은 유효기간이 끝나기 전까지 따로 통제할 수 없기 때문에 세션에 비해 토큰 정보를 탈취 당할 가능성이 높다.

## Interceptor와 Filter의 역할과 차이점

DispatcherServler에 들어가기 전과 후로 Filter와 Interceptor가 작업을 처리하는 것을 볼 수 있다.

### Filter
서블릿 컨테이너가 관리한다.
공통 인증/인가, 로깅, 이미지/데이터 압축 및 문자열 인코딩을 수행한다. 
주로 필터는 스프링 시큐리티에서 사용한다.

`doFilter`, `init`, `destroy` 메서드가 있다. 필터 체인을 사용해서 다음 필터에게 request 객체를 넘겨줄 수도 있다. 다음 필터가 존재하지 않으면 디스패처 서블릿으로 전달된다.

`GenericFilterBean` 은 기존 필터에서 얻어올 수 없는 정보인 Spring의 설정 정보를 가져올 수 있게 된 추상 클래스이다. 

`OncePerRequestFilter` 는 모든 서블릿에 일관된 요청을 처리하기 위해 만들어진 필터이다.

## Bean의 Scope 활용하기
`Bean`은 스프링이 생성/관리하는 클래스의 인스턴스(객체) 이다.

### Bean이 갖는 메타데이터
- 실제 빈 구현이 정의된 패키지 정보와 클래스 이름
- 빈의 컨테이너 안에서 동작을 정의한 정보
- 다른 빈에 대한 의존 정보

### Bean Scope
특정 Bean이 어느 범위에서 존재할 것인가
기본적으로 6개의 Scope 설정을 지원한다.

#### Singleton
IoC 컨테이너 안에서 단 하나의 Bean만 존재하게 된다.
별도의 캐시에 저장하여 해당 bean에 대한 다음 요청부터 캐시의 빈을 제공해준다.

#### Prototype
빈 요청이 있을 때마다 새로운 빈을 만들어내는 scope이다.
새로운 bean의 생성, 의존 관계 주입까지만 관여한 후, 더 이상 관리하지 않는다. 
gc에 의해 bean이 제거된다.

#### Request
어떤 요청 안에서 빈의 상태가 변경되어도 다른 요청에 영향이 가지 않는다.
요청에 대한 응답이 끝나면 bean이 소멸한다.

#### Session
HTTP 세션 한 번에 하나의 빈을 만드는 scope이다.

#### Application 
ServletContext와 동일한 생명주기를 갖는 빈을 만든다. 

#### Websocket


### 싱글톤 적합 vs 비싱글톤 적합
#### 싱글톤으로 적합한 객체
- 상태가 없는 공유 객체: 상태를 가지고 있지 않은 객체는 동기화 비용이 없다. 따라서 매번 이 객체를 참조하는 곳에서 새로운 객체를 생성할 이유가 없다.
- 읽기용으로만 상태를 가진 공유 객체: 1번과 유사하게 상태를 가지고 있으나 읽기 전용이므로 여전히 동기화 비용이 들지 않는다. 매 요청마다 새로운 객체 생성할 필요가 없다.
- 공유가 필요한 상태를 지닌 공유 객체: 객체 간의 반드시 공유해야 할 상태를 지닌 객체가 하나 있다면, 이 경우에는 해당 상태의 쓰기를 가능한 동기화 할 경우 싱글톤도 적합하다.
- 쓰기가 가능한 상태를 지니면서도 사용빈도가 매우 높은 객체: 애플리케이션 안에서 정말로 사용빈도가 높다면, 쓰기 접근에 대한 동기화 비용을 감안하고서라도 싱글톤을 고려할만하다. 이 방법은 1. 장시간에 걸쳐 매우 많은 객체가 생성될 때, 2. 해당 객체가 매우 작은 양의 쓰기상태를 가지고 있을 때, 3. 객체 생성비용이 매우 클 때에 유용한 선택이 될 수 있다.
#### 비싱글톤으로 적합한 객체
- 쓰기가 가능한 상태를 지닌 객체: 쓰기가 가능한 상태가 많아서 동기화 비용이 객체 생성 비용보다 크다면 싱글톤으로 적합하지 않다.
- 상태가 노출되지 않은 객체: 일부 제한적인 경우, 내부 상태를 외부에 노출하지 않는 빈을 참조하여 다른 의존객체와는 독립적으로 작업을 수행하는 의존 객체가 있다면 싱글톤보다 비싱글톤 객체를 사용하는 것이 더 나을 수 있다.
출처: https://gmlwjd9405.github.io/2018/11/10/spring-beans.html

## ApplicationContext

## 질문
- JWT 방식의 단점은 무엇일까요? (로그인 상태를 여러 기기에서 유지할 수 없음. stateless 하지 않다.)
- Session Clustering의 장점 / 단점은 무엇인가요? : 포이
- JWT는 쉽게 복호화할 수 있기 때문에 중요한 정보를 넣어서는 안 된다고 했는데, JWT 에 넣어야 되는 정보에는 무엇이 있나요? : 말랑
	- 식별자를 넣으면 좋지 않을까요? ID 값이나 UUID 같은 거
- stateful한 클래스를 singleton으로 사용하면 안 되는 이유는 무엇인가요? : 헤나
- stateful한 클래스는 무슨 scope로 빈을 생성하면 좋을까요?
- prototype scope는 언제 사용하나요? : 포이
- prototype의 bean은 어떻게 제거되는지 아시나요? : 포이
- singleton scope를 사용하기 좋은 객체가 뭐라고 생각하시나요? / 비싱글톤으로 적합한 객체는 뭐라고 생각하시나요? : 말랑
- 필터의 로깅 작업이 필요한 이유는 무엇인가요? -> HTTP 요청과 응답에 대한 정보를 수집할 수 있다. 보안상의 이유와 디버깅을 위해 : 포이
- Filter에서 발생한 예외처리는 어떻게 할 수 있나요? : 포이
- ControllerAdvice로 예외처리를 할 수 있나요? : 포이
- Singleton scope와 Prototype scope를 동시에 사용했을 때 일어날 수 있는 문제점이 있을까요? : 포이
	- Singleton bean 내부에서 prototype bean을 사용할 수 있는 방법? -> object provider를 사용하면 된다고 하네요
- Session Clustering 설명해주세요 : 말랑
	- WAS 끼리의 통신은 어떻게 하나요?
	- Session의 동기화 시점?
- Scale up vs Scale out을 비교해주세요 : 말랑
- refresh token을 추가한 JWT의 장단점을 알려주세요 : 말랑
- interceptor의 handler를 활용할 수 있는 방법? : 말랑
	- 모르겠네요...
- ApplicationContext가 뭔가요? : 말랑
- Spring Security에서 interceptor 대신 filter를 사용하는 이유? : 말랑
- bean이 갖는 메타 데이터에 대해 설명해주세요 : 헤나
- Singleton, Prototype 외의 다른 스코프의 경우 어떤 설정을 해주어야 하나요? : 헤나
	- WebApplication에서만 사용할 수 있습니다. (MVC, WebFlux)
- Proxy 모드란? : 헤나
- HTTP Only 쿠키를 사용하면, 브라우저에서 쿠키에 접근할 수 없는데도 사용해도 되나요? : 헤나

# 6/5

## 헤나

### 질문
- Spring Container에게 객체 생성과 관리를 위임하는 것의 장단점?
- MVC에 대해 설명해주세요.
- 레이어를 어떻게 구분해서 작성하시는지?
- IoC Container 란? 역할?
- Spring Container의 생명 주기, bean 스코프 (소멸 전 콜백 메서드)
- 의존 관계 주입은 언제 일어나나? => 의존 관계 주입이 초기화 콜백 메서드 이후에 생성되는 거면 생성될 때에는 필드가 null인데 의존 관계 주입이 가능한가요?

스프링 IoC 컨테이너 생성 → 스프링 빈 생성 → 의존관계 주입 → **초기화 콜백 메소드 호출** → 사용 → **소멸 전 콜백 메소드 호출** → 스프링 종료

### 피드백
- 중간에 질문과 관련 없는 내용이 답변으로 나올 때가 있었다.

## 포이

### 질문
- dao의 단위 테스트란? 
- dao의 단위 테스트가 아니라 통합 테스트로 봐야 하는 거 아닌가?
- 실제 db와 연동하는 테스트인 dao의 단위 테스트라고 한 이유?
- vpc에 대해 설명해주세요
- vpc 내에 서브넷의 개념이 있는데, 서브넷 개념에 대해 말해주세요. 
- vpc의 보안그룹과 서브넷의 NACL에 대해 알고 계신가요?
- classist와 mockist에 대해 설명해주세요.
- 본인은 주로 어떤 테스트 더블을 사용하시는지 말씀해주세요.
- mocking과 stubing의 차이점?
- 레이어드 아키텍처 각 계층의 역할에 대해 설명해주세요.
- argument resolver와 interceptor를 어떻게 사용하셨나요?
- interceptor를 사용해서 접근해보신 적 있나요? 왜 접근하셨나요?
- spring bean scope에 대해 설명해주세요. 
- prototype 스코프는 어떤 경우에 사용하면 좋을까?
- request 스코프와 session 스코프의 차이점이 있나요?
- interceptor는 항상 작동할까?

### 피드백
- 한 문장의 호흡이 좀 긴 것 같습니다.

## 베로

### 피드백
- 끝까지 말하긴 했지만 내용이 좀 틀린 부분이 있었다.

## 말랑

### 질문
- connection이란?
- datasource에 대해 설명해주세요. 
- connection pool은 누가 관리하나요?
- 서브넷을 뭐라고 할 수 있을까요?
- VPC가 없는 경우에서도 서브넷은 사용할 수 있다고 알고 있는데...
- CIDR에 대해 설명해주세요.
- spring event에 대해 설명해주세요.
- 어떤 경우에 spring event를 쓰는 게 좋을까요?
- propagation 레벨 NEVER를 사용하는 경우는 언제일까요?

### 피드백
- 설명하기 어려운 게 나왔을 때 당황했다.
- TCP/UDP 답변은 생각을 해도 못 했다...