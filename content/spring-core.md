---
title   : Spring Core
date    : 2023-04-18 11:07:46 +0900
updated : 2023-04-18 11:07:59 +0900
tags     : 
- 레벨2
- 우테코
- 개발
- spring
---

## Scan

### `@Component`

`@Repository` 는 repository(DAO로 알려진) 의 역할을 하는 class에 붙인다.
`@Repository` 를 사용하면 예외의 자동변환을 가능하게 해준다. (Exception Translation)

Spring은 추가적인 어노테이션을 제공한다.
`@Component`, `@Service`, `@Controller` 는 일반적으로 Spring에서 관리하는 component이다.
`@Repository`, `@Service`, `@Controller` 는 `@Component` 의 특화 버전으로 더 구체적인 사용 case를 위해 사용된다. 

component 클래스들에 `@Component` 어노테이션을 쓸 수는 있지만, `@Repository`, `@Service`, `@Controller` 를 사용하면 tool로 처리하거나 aspect(비즈니스 로직 외에 다른 기능들이 정의되어 있는 모듈)들과 연결하여 더 적절하게 다뤄질 수 있다.
`@Service` 는 `@Component` 와 다른 바가 없지만, DDD 관점에서의 사용을 위해 추가된 어노테이션이다.
`@Repository`, `@Service`, `@Controller` 는 Spring의 이후 release에서 추가적인 의미를 전달할 수도 있다. 따라서 service layer에 `@Component`, `@Service` 둘 중 하나의 어노테이션을 붙여야 한다면, `@Service` 가 더 좋은 선택이다.

마찬가지로 앞서 설명한 것처럼 `@Repository` 는 persistence layer에서 자동 예외 변환을 위한 marker로서 지원되고 있다.

## DI

### Dependencies

일반적인 엔터프라이즈 애플리케이션은 단일 객체(bean)로 구성되지 않는다. 가장 단순한 애플리케이션 조차도 end-user 에게 서비스를 제공할 때 여러 개의 객체들이 협력해서 기능을 제공하게 된다.

### Dependency Injection

DI(의존성 주입)는 객체들이 자신들의 의존성을 무어

Container는 bean을 만들 때 의존성을 주입해준다. 
이런 과정은 근본적으로 클래스를 직접 생성하여 사용하는 것 또는 Service Locator Pattern을 사용하여 bean 자체가 의존성의 위치와 인스턴스화를 제어하는 IoC(제어의 역전)이다.

DI 원칙을 따르는 코드는 더 깔끔하고, 객체들이 의존성들을 제공받을 때 decoupling(낮은 결합도) 측면에서 더 효과적이다.
주입받는 객체는 의존성을 찾지 않아도 되고, 의존성의 위치나 클래스를 알지 못한다.
결론적으로 의존성이 인터페이스나 추상 클래스에 있는 경우 단위 테스트에서 stub 또는 mock 구현을 사용할 수 있어 테스트하기 더 쉽다.

- 참고 자료: [공식 문서](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-dependencies)

### Constructor-based Dependency Injection

Constructor-based DI(생성자 주입)는 container가 constructor를 호출하여 수행된다. 
정적 팩토리 메서드를 호출해서 bean을 생성하는 것은 거의 동일한 방법이다.

```java
public class SimpleMovieLister {

    // the SimpleMovieLister has a dependency on a MovieFinder
    private final MovieFinder movieFinder;

    // a constructor so that the Spring container can inject a MovieFinder
    public SimpleMovieLister(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // business logic that actually uses the injected MovieFinder is omitted...
}
```

container 특정 인터페이스나 base 클래스, 어노테이션에 대한 종속성이 없는 POJO 이다.

**POJO**
Plain Old Java Object
어떤 특정 framework이나 convention에 종속되지 않거나 property들과 method의 naming convention에 구속되지 않는 Java 객체다.

- 참고 자료: [공식 문서](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-constructor-injection)

### Setter-based Dependency Injection

Setter-based DI(setter 주입)는 container가 bean을 인스턴스화하기 위해 매개변수가 없는 consturctor를 호출하거나 매개변수가 없는 정적 팩토리 메서드를 호출하고 setter 메서드를 호출하는 것이다.

순수 setter 주입을 사용해서 의존성 주입이 가능한 클래스이다. 해당 클래스는 기존 Java 클래스로, 특정 container 인터페이스, base 클래스, 어노테이션에 대한 종속성이 없는 POJO이다.

```java
public class SimpleMovieLister {

    // the SimpleMovieLister has a dependency on the MovieFinder
    private MovieFinder movieFinder;

    // a setter method so that the Spring container can inject a MovieFinder
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // business logic that actually uses the injected MovieFinder is omitted...
}
```

`ApplicationContext` 는 관리할 bean들을 위해 생성자 주입과 setter 주입을 지원한다.
몇몇 의존성이 이미 constructor 을 통해 주입된 후에도 setter 주입이 가능하다.
`BeanDefinition` 의 형태로 의존성을 설정하고, `PropertyEditor` 인스턴스와 함께 사용하여 property들을 하나의 format에서 다른 형태로 변환한다.

그러나 대부분의 Spring 사용자들은 이러한 클래스를 직접 사용하는 것이 아니라 XML의 bean 정의와 `@Component`, `@Controller` 등의 어노테이션이 달린 클래스의 `@Bean` 메서드를 사용하여 작업한다.
내부적으로 `BeanDefinition` 의 인스턴스로 변환되어 전체 Spring IoC container 인스턴스를 로드하는데 사용된다.

- 참고 자료: [공식 문서](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-setter-injection)

### Constructor-based DI vs Setter-based DI

생성자 주입과 setter 주입은 혼합사용이 가능하기 때문에, 필수 의존성에는 생성자 주입을 사용하고 선택적 의존성에는 setter 메서드나 configuration 메서드를 사용하는 것이 좋다. setter 메서드에 `@Autowired` 어노테이션을 사용하면 필드를 필수 의존성으로 만들 수 있지만 프로그래밍 유효성 검사를 통해 생성자 주입을 사용하는 것이 바람직하다.

일반적으로 생성자 주입을 지지한다. 애플리케이션 컴포넌트를 불변 객체로 구현하고 필요한 의존성이 null이 되지 않도록 보장하기 때문이다. 생성자 주입하는 컴포넌트가 항상 완전히 초기화된 상태로 클라이언트에 반환된다. 생성자 매개변수가 많게 되면 code smell 이고, 클래스에 너무 많은 책임이 있을 수 있어서 적절한 분리를 위해 리팩터링해야 한다는 뜻이다.

setter 주입은 주로 클래스 내에서 합리적인 default value를 할당할 수 있는 선택적 의존성에만 사용해야 한다. 그렇지 않으면 의존성을 사용하는 모든 곳에서 null이 아닌지 검사를 수행해야 한다. 

setter 주입의 한 가지 이점은 setter 메서드를 사용하면 해당 클래스의 객체를 나중에 재구성하거나 다시 주입할 수 있다는 것이다. (JMX MBeans를 통한 관리에서 setter 주입을 사용한다.)