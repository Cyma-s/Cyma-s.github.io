---
title   : IoC Container와 DI
date    : 2023-05-07 16:04:48 +0900
updated : 2023-05-07 16:05:06 +0900
tags     : 
- spring
- 개발
---

## IoC Container란?

각각의 용어를 풀어보자.

**IoC** 란 Inversion of Control 의 약자로서, 제어의 역전을 뜻한다. 의존성 주입이라고 하기도 한다.
**컨테이너**는 객체의 생명주기를 관리하고, 생성된 인스턴스들에게 추가적인 기능을 제공한다.

즉, IoC Container는 객체의 생성과 라이프사이클을 관리하고, 의존성을 클래스에 주입하기도 한다.

주로 다음과 같은 기능을 제공한다.

- IoC 컨테이너는 객체의 생성을 책임지고, 의존성을 관리한다.
- POJO의 생성, 초기화, 서비스, 소멸에 대한 권한을 가진다.
- 개발자들이 직접 POJO를 생성할 수 있지만 컨테이너에게 맡긴다.
- 개발자는 비즈니스 로직에 집중할 수 있다.
- 객체 생성 코드가 없으므로 TDD가 용이하다.

Spring Framework의 IoC 컨테이너 구현은 org.springframework.beans, org.springframework.context 패키지의 기반이 된다.

그 중에서도 `BeanFactory` 인터페이스는 모든 유형의 객체를 관리할 수 있는 고급 Configuration 메커니즘을 제공한다.
`BeanFactory` 와 `ApplicationContext` 인터페이스는 Spring IoC 컨테이너를 가리킨다.

Spring IoC 컨테이너가 관리하는 객체를 **빈(bean)** 이라고 하고, 이 빈(bean)들을 관리한다는 의미로 컨테이너를 **빈 팩토리(BeanFactory)** 라고 부른다.
- 객체의 생성과 객체 사이의 런타임(run-time) 관계를 DI 관점에서 볼 때는 컨테이너를 **BeanFactory**라고 한다.
- BeanFactory에 여러 가지 컨테이너 기능을 추가하여 **애플리케이션 컨텍스트(ApplicationContext)** 라고 부른다.

### BeanFactory와 ApplicationContext

- **BeanFactory**
**Bean Factory**는 Bean을 등록, 생성, 조회, 반환을 관리한다. 보통은 BeanFactory를 바로 사용하지 않고, 이를 확장한 ApplicationContext를 사용한다. `getBean()` 메서드가 정의되어 있다.

- **ApplicationContext**
Bean을 등록,생성,조회,반환을 관리하는 기능은 **BeanFactory**와 같다. Spring의 각종 부가 서비스를 추가로 제공한다. 

## DI (Dependency Injection) 이란?

외부에서 클라이언트에게 서비스를 제공하는 것이다. 
즉, 객체가 필요로 하는 어떤 것을 외부에서 전달해주는 것이다.

### 장점
- 코드의 재사용성과 유연성이 높다.
- 객체간 결합도가 낮아 한 클래스를 수정했을 때 다른 클래스를 수정해야 하는 상황을 막아준다.
- 유지보수가 쉬우며 테스트가 용이하다. 어떤 클래스가 의존하는 객체가 변경되었을 때 코드의 변경을 최소화하며 유지보수할 수 있다. 또한 의존성 주입을 사용하면 클래스가 의존하는 객체를 외부에서 주입받아 사용하게 된다. 테스트 시에 클래스의 의존성을 변경하며 테스트할 수 있어 테스트가 용이하다.
- stub, mock 객체를 사용하여 단위 테스트 시에 이점을 갖는다.

### 단점
- 주입된 객체들에 대해 코드 추적이 어렵고, 가독성이 떨어진다.
- 간단한 프로그램을 만들 때는 오히려 번거롭다.

## 의존관계 주입 방식

### 생성자 주입
생성자를 통해 의존 관계를 주입 받는다.

스프링에서는 생성자 주입을 권장하고 있다. 
객체 생성 이후 의존 관계가 변경되지 않는 경우 생성자 주입을 사용하는 것이 좋다.

#### 특징
- 생성자 호출 시점에 한 번만 호출하는 것이 보장된다.
- 생성자가 1개만 존재하는 경우에는 `@Autowired` 를 생략해도 자동으로 주입된다. 2개 이상일 때는 컴파일 예외가 발생한다.
- 필드가 존재하지 않는 NPE를 방지할 수 있다.
- 주입 받을 필드가 final이 될 수 있다.
- 순환 참조를 방지한다. 필드 주입과 setter 주입은 빈이 생성된 이후에 참조하기 때문에 애플리케이션이 예외, 경고 없이 실행되어 실제 코드가 호출될 때까지 문제를 알 수 없다. 생성자를 통해 의존관계를 주입하면 `BeanCurrentlyInCreationException` 이 발생하여 문제를 알 수 있다.

```shell
2023-06-06 17:01:38.453  WARN 49905 --- [           main] ConfigServletWebServerApplicationContext : Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'circularReferenceBean' defined in file [/Users/cyma/IdeaProjects/sample-project/build/classes/java/main/hello/practice/CircularReferenceBean.class]: Unsatisfied dependency expressed through constructor parameter 0; nested exception is org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'practiceBean' defined in file [/Users/cyma/IdeaProjects/sample-project/build/classes/java/main/hello/practice/PracticeBean.class]: Unsatisfied dependency expressed through constructor parameter 0; nested exception is org.springframework.beans.factory.BeanCurrentlyInCreationException: Error creating bean with name 'circularReferenceBean': Requested bean is currently in creation: Is there an unresolvable circular reference?
```

### Setter 주입

필드 값을 변경하는 setter로 의존 관계를 주입하는 방법이다.
`@Autowired` 가 있는 setter로 자동으로 의존관계를 주입한다.

#### 특징
- 객체 생성 이후 변경 가능성이 있는 의존 관계에서 사용한다.
- `@Autowired` 를 입력하지 않으면 실행이 되지 않는다.
- `set필드명` 메서드로 의존 관계를 주입한다.

### 필드 주입

필드에 `@Autowired`를 붙여서 주입하는 방식이다.

```java
public class A {
	@Autowired
	private B b;
}
```

#### 특징
- 필드 주입을 하게 되면 DI 컨테이너 안에서만 정상 작동한다. 즉, POJO가 아니다.
- final 키워드를 사용할 수 없기 때문에 불변이 아닌 필드를 갖게 되고, setter로 가변 속성도 아닌 애매한 포지션이다.

### 일반 메서드 주입

```java
public class A {
	private B b;
	private C c;

	@Autowired
	public void method(B b, C c) {
		this.b = b;
		this.c = c;
	}
}
```

#### 특징
- 여러 필드를 주입받을 수 있다. -> 근데 이럴거면 생성자 주입 씀