---
title: 레벨2 레벨로그
date: 2023-06-04 14:02:09 +0900
updated: 2023-10-15 22:46:40 +0900
tags:
  - 우테코
  - 레벨2
  - 레벨로그
---
## 공부한 것 목록

- [[transactional]]
- [[bean]]
- [[bean-scope]]
- [[bean-candidate]]
- [[interceptor]]
- [[ioc-container-and-di]]
- [[filter]]

## 질문 목록

- **이번 미션에서 사용자 인증을 ArgumentResolver에서 수행했는지, Interceptor를 사용했는지**: 미션에서는 ArgumentResolver에서 수행했다. 그러나 나중에는 Interceptor에서 인증 로직을 수행할 것 같습니다.
	- **이유?** 
	- ArgumentResolver의 경우: **ArgumentResolver는 단순하게 값을 받아서 객체로 만드는 역할만 수행해야 한다는 의견도 있는데, 이런 경우는 어떻게 생각하시나요?**
	- Interceptor의 경우: **Interceptor에서는 true, false만 리턴할 수 있고 Request 조작만 가능하기 때문에 한 번에 객체를 만들어 주기 위해서는 ArgumentResolver가 더 낫다는 의견도 있었는데 어떻게 생각하시나요?**
- **DI의 장점과 단점에 대해 설명해주세요.**
	- 장점: 클래스 사이의 결합도를 낮추어서 테스트하기 용이하고 리팩토링이 쉽다. 구현체가 변경되는 상황에서 객체 변경의 유연성을 가져갈 수 있다.
	- 단점: 의존성 주입이 여기저기에 흩어져 있으면 연관 관계를 파악하기 어려울 수 있다는 단점. 따라서 작은 프로젝트에서는 의존성 주입을 사용하지 않아도 될 것 같다.
- **`@Transactional(readOnly = true)` 를 사용해 보신 적 있나요?**
	- **왜 쓰셨죠?** : 동료 개발자의 가독성 측면, CUD에 사용하는 경우에 예외 처리를 위해 사용했다.
	- **아예 안 쓰는 것과 어떤 차이가 있나요? 가독성 제외하고** : DB가 Read lock을 지원하는 경우에는 데이터 스냅샷으로만 조회를 해오기 때문에 데이터 일관성이 유지되고, mysql의 경우 transaction id를 부여하지 않기 때문에 오버헤드가 사라진다는 장점이 있습니다.
- **bean scope에 대해 설명해주세요.**
	- **singleton bean 내부에서 prototype bean을 참조하는 경우 발생하는 문제와 해결 방법**
- **java bean에 대해 설명해주세요.**
	- 특정 형태를 만족하는 클래스를 의미한다. 디폴트 생성자가 있고, 모든 필드는 private으로 getter, setter가 있어야 한다.
- **bean 등록 시에 `@Configuration` 과 `@Component` 설정 방식을 정하는 기준이 있는지?**
	- 외부 라이브러리를 사용하거나 특정 의존성을 주입해주어야 할 때는 `@Configuration` 을 사용하고, 그 외의 일반 bean 설정은 `@Component` 를 사용한다.
- **bean lifecycle이란?** : bean이 생성되고 소멸되는 주기를 의미한다. 스프링 컨테이너가 생성되고, bean이 생성된 후, 의존관계가 주입된다. 그 후 초기화 콜백이 실행되고, bean이 사용된다. 이후 bean의 소멸 콜백이 호출되고, 스프링 컨테이너가 종료되는 방식의 라이프 사이클을 갖는다.
- **의존 관계 주입 방법 세 가지와 어떤 것이 왜 좋은지?**
- **컨트롤러 단위 테스트와 서비스 단위 테스트 작성 하시는지? 그 이유?** : 컨트롤러 단위 테스트는 진행하지 않고, 서비스 단위 테스트는 진행하는 편입니다. 
	- **컨트롤러 단위 테스트 / 서비스 단위 테스트에서는 어떤 어노테이션을 사용하시는지?**
	- **컨트롤러 단위 테스트를 했는데 통합 테스트도 써야 할까요?**
- **같은 타입의 bean이 여러 개 존재한다면 어떤 문제가 발생하나요?**
	- **해당 문제를 해결하는 방법**
- **repository와 dao 분리하셨는지**
	- 분리했다면 어떤 이유로
	- 분리하지 않았다면 분리한 것에 비해 어떤 장점이 있었는지
- **domain과 entity 분리했는지**
- **repository 는 도메인 레이어인가, 영속성 레이어인가? 그렇게 생각하는 이유는?**
	- 도메인 레이어이다. 도메인을 가지고 레파지터리와 소통하기 때문이다. 해당 도메인을 가지고 영속성 레이어를 호출하는 보다 상위의 클래스라고 생각한다.
- **쿼리를 여러 번 날리는 것과 조인을 여러 번 하는 것 중 어떤 것을 선호하는가? 이유는?**
	- **반대 방법의 장점은 어떤 것이 있을까요?**
- **Spring 컨테이너에게 객체의 라이프 사이클을 맡기는 것의 장단점?**
	- 객체의 생성부터 소멸까지 Spring이 관리하게 함으로써 개발자가 비즈니스 부분에만 집중할 수 있다는 장점이 있다.
	- 상태를 갖는 객체의 경우에는 bean으로 등록하지 않는다고 했을 때: 상태를 가져도 bean으로 만들 수 있다면 bean으로 만드실 건가요? 실제로 prototype 빈은 싱글톤이 아니고 조회할 때마다 새로 생성되는 빈이라 상태를 가질 수 있습니다.
- **mocking과 stubing의 차이점? 왜 쓰는지?**
	- **테스트 더블 중에서 어떤 것을 더 선호하는지? (상황별)**
- **협업 미션에서 프론트엔드로 필요하지 않은 정보도 모두 내려주는 것 vs 필요한 정보만 선별해서 내려주는 것 중 어떤 것이 좋다고 생각하시나요?**
- **숨겨야 하는 애플리케이션 속성은 어떻게 처리하셨나요? 서브 모듈 / external properties 도 있는데 어떤 장점 때문에 그 방법을 선택하셨는지**
- **FK 는 필요할까요? 이유**
	- mysql 에서는 FK 가 걸려 있으면 lock 전파가 발생하기 때문에 FK 를 사용할 때 주의해야 한다. 따라서 FK 는 따로 쓰지 않는 것이 좋다고 생각한다.
- **테이블 사이에 FK 가 걸려있어도 값을 검증해야 할까요?**
	- 해야 한다. 도메인 로직에서 값을 검증하는 부분이 보이지 않는다. 또한 DB의 예외가 위쪽 계층으로 침범한다고 생각해서 값을 미리 Repository 단에서 검증하는 것이 좋다고 생각한다.
	- 할 필요 없다: **FK가 걸려 있으면 존재하지 않는 데이터를 FK로 해서 DB에서 쿼리를 보낼 때 예외가 발생한다. 그래도 해야 하나?**
	- 할 필요가 있다: **계속 동일한 코드가 중복해서 들어가게 되어서 가독성 측면에서는 좋지 않은 것 같은데, 그 부분은 어떻게 생각하시나요?** -> 그 부분이 트레이드 오프라고 생각한다. 계속해서 동일한 로직이 실행되고 있지만, 꼭 필요한 로직이라면 중복해서 들어가 있어도 괜찮다고 생각한다.
- **도메인에 ID가 있어도 될까요?**
	- 있으면 안 된다: 객체 내부의 필드 값을 모두 비교해야 같은 데이터가 될 수 있는 도메인이 있다고 했을 때, 아이디로 식별하게 되면 훨씬 동등성을 비교하기 쉬울 수 있다는 의견에 대해서는 어떻게 생각하시나요?
	- 있어도 된다: 어떤 이점이 있었는가?
- **클라이언트에서 조회하고 싶은 id를 전송했는데, 서버에서 해당 id에 맞는 데이터가 없다고 가정할 때 어떤 HttpStatus 코드를 내려주시나요? 이유는?**
	- 404 코드를 내려주었다. 404 자체가 리소스가 존재하지 않는다는 의미이기 때문에, 서버에서 해당 자원을 찾을 수 없다는 식으로 해석했다. 
	- 해당 id가 포맷에 맞기 때문에 (id=4인 경우 포맷은 맞으나 서버 내부에서 못 찾는 것) 서버로 전달이 된 것이라고 생각해서 401은 적합하지 않다고 생각했다.
- **interceptor와 argumentresolver의 패키지 위치는 어디가 적합하다고 생각하시는지?**
- **httpstatus 403과 401의 차이점이 뭐라고 생각하시나요?**
	- **403을 사용해보신 적 있으신지, 왜 사용하셨는지?**
- **truncate.sql 사용하시나요?**
	- 사용하신다면: **DROP을 선호하시는지, TRUNCATE를 선호하시는지?**
	- **테스트 격리를 위해 어떤 방법을 사용하시나요?**

### 주디 피드백
- FK를 사용하면 어떤 부분에서 무결성이 보장되는가?
- FK를 사용하지 않는다면 무결성은 어떻게 최대한 지킬 수 있을까요?

#### 학습 측면
- 많이 고민해보신 것 같은 부분이 좋았습니다. 적절한 학습 예시와 함께 말해주신 점이 좋았습니다.

#### 말하기 측면
- 눈을 마주치면서 답변하고, 제스처를 적절하게 사용하여 답변에 좀 더 몰입할 수 있었습니다.
- 말의 속도가 차분하고 목소리도 떨리지 않아서 좋았습니다.
- 경험을 말하다보니 조금 장황해지는 경향이 있는 것 같습니다.
- 결론과 이전의 답변이 조금은 상반된 경우가 있는 것 같습니다.

### 코코닥 피드백

#### 학습 측면
- 주장에 대한 반대 의견도 함께 이야기 해주는 것이 좋았습니다. 깊게 공부해본 것 같은 느낌을 주었습니다.
- 주장에 대한 자기 주관이 드러나는 것이 좋았습니다.
- 주장과 근거가 함께 주어지고, 제공되는 근거가 신뢰도 있었습니다.

#### 말하기 측면
- 안정감을 주는 목소리로 차분하게 말해서 좋았습니다.
- 손을 만지거나 다른 쪽을 바라볼 때가 있어서 그 부분은 신경써주시면 좋을 것 같다.

### 제이미 피드백

#### 학습 측면
- 답변에서 필요한 답변을 하면서도 답변과 연결되는 개념을 함께 말해주어서 제이미가 많이 공부했다는 느낌이 들었습니다.
- 미션에서 느꼈던 점, 왜 그렇게 했는지를 미션과 연관지어 이야기해 주신 부분이 좋았습니다.
- 이전 질문에서 답변이 이어지는 느낌이 좋았습니다.

#### 말하기 측면
- 이해가 안 되는 부분은 다시 한 번 물어보는 부분이 좋았습니다.
- 어떤 질문을 해도 되게 쉽게 답변해 주셔서 대단했습니다.
- 조금 말의 호흡이 길게 느껴지는 부분이 있었습니다. 중간에 말을 끊어주고 말하면 문장의 핵심을 더 잘 파악할 수 있을 것 같습니다.
- 답변에서 비슷한 의미의 말이 반복되는 느낌이 들었습니다.

### 무민 피드백
- DI에 대한 내용
- interceptor, filter?

#### 학습 측면
- 해결 방법에 대한 경험, 경험에서의 고민이 답변에서 드러나서 좋았습니다.
- 주장에 대한 근거가 주관으로 드러나서 좋았습니다. 

#### 말하기 측면
- 답변하기 어려운 질문에도 천천히 잘 답변했습니다.
- 질문에 관한 답변이 아닌 다른 답변을 할 때가 있어서 조금 아쉬웠습니다.
- 생각할 때는 무의식적으로 하늘을 보는 습관이 있는 것 같습니다. 시선 처리를 좀 더 신경 써주시면 답변에 집중하고 있다고 보일 거 같습니다.