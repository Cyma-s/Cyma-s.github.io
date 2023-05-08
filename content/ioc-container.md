---
title   : 스프링 컨테이너의 라이프사이클은 어떻게 되는가?
date    : 2023-05-07 16:04:48 +0900
updated : 2023-05-07 16:05:06 +0900
tags     : 
- 스터디
- 학습로그
- Spring
---

## IoC Container 란?

**IoC** 란 Inversion of Control 의 약자로서, 제어의 역전을 뜻한다. 의존성 주입이라고 하기도 한다.

컨테이너: 객체의 생명주기를 관리, 생성된 인스턴스들에게 추가적인 기능을 제공하도록 하는 것

org.springframework.beans, org.springframework.context 패키지는 Spring Framework의 IoC 컨테이너 기반이다.
`BeanFactory` 인터페이스는 모든 유형의 객체를 관리할 수 있는 고급 Configuration 메커니즘을 제공한다.

스프링 프레임워크도 **객체에 대한 생성 및 생명주기를 관리**할 수 있는 기능을 제공하고 있음. 즉, IoC 컨테이너 기능을 제공한다.
- IoC 컨테이너는 객체의 생성을 책임지고, 의존성을 관리한다.
- POJO의 생성, 초기화, 서비스, 소멸에 대한 권한을 가진다.
- 개발자들이 직접 POJO를 생성할 수 있지만 컨테이너에게 맡긴다.
- 개발자는 비즈니스 로직에 집중할 수 있다.
- 객체 생성 코드가 없으므로 TDD가 용이하다.

Spring IoC 컨테이너는 애플리케이션의 객체 관리를 담당한다. 컨테이너는 DI를 사용하여 제어의 역전을 이룰 수 있다.
`BeanFactory` 와 `ApplicationContext` 인터페이스는 Spring IoC 컨테이너를 가리킨다. `BeanFactory` 는 Spring 컨테이너에 접근하기 위한 Root Interface이다.
`ApplicationContext`는 `BeanFactory` 의 하위 인터페이스이다. `BeanFactory`의 모든 기능을 제공한다.

ApplicationContext의 주요 임무는 빈을 관리하는 것이다.
  
애플리케이션은 `ApplicationContext` 컨테이너에 Bean Configuration을 제공해야 합니다. Spring Bean Configuration은 하나 이상의 Bean 정의로 구성됩니다. 또한 Spring은 Bean을 구성하는 다양한 방법을 지원합니다.

-> DefaultApplicationContextFactory

![[Pasted image 20230507173401.png]]

## ApplicationContext 인터페이스

Spring IoC 컨테이너를 나타내며, 앞서 언급한 빈을 인스턴스화하고 구성하며, 모으는 역할을 수행한다.
컨테이너는 Configuration metadata를 읽어 어떤 객체를 인스턴스화하고 구성하며 모아야할 지를 알 수 있다.

## Spring DI 컨테이너

**3-1 Spring DI 컨테이너의 개념**

Spring DI 컨테이너가 관리하는 객체를 **빈(bean)**이라고 하고, 이 빈(bean)들을 관리한다는 의미로 컨테이너를    **빈 팩토리(BeanFactory)** 라고 부른다.
- 객체의 생성과 객체 사이의 런타임(run-time) 관계를 DI 관점에서 볼 때는 컨테이너를 **BeanFactory**라고 한다.
- BeanFactory에 여러 가지 컨테이너 기능을 추가하여 **애플리케이션 컨텍스(ApplicationContext)**라고 부름

**3-2 BeanFactory와 ApplicationContext**
**- BeanFactory**
- Bean을 등록,생성,조회,반환 관리함.
- 보통은 BeanFactory를 바로 사용하지 않고, 이를 확장한 ApplicationContext를 사용함.
- getBean() 메서드가 정의되어 있음

**- ApplicationContext**
- Bean을 등록,생성,조회,반환 관리하는 기능은 BeanFactory와 같음
- Spring의 각종 부가 서비스를 추가로 제공함
- Spring이 제공하는 ApplicationContext 구현 클래스가 여러 가지 종류가 있음

Spring Application은 사용자 대신 `ApplicatoinContext` 의 적절한 타입을 생성하게 된다.

`WebApplicationType` 은 다음과 같이 정해진다.

- Spring MVC가 존재 -> `AnnotaionConfigServletWebServerApplicationContext` 사용
- Spring MVC가 존재하지 않고, Spring WebFlux가 존재하면 `AnnotationConfigReactiveWebServerApplicationContext` 사용
- 그 외에는 `AnnotationConfigApplicationContext` 사용

## AnnotaionConfigServletWebServerApplicationContext

> ServletWebServerApplicationContext that accepts annotated classes as input - in particular @Configuration -annotated classes, but also plain @Component classes and JSR-330 compliant classes using javax.inject annotations. Allows for registering classes one by one (specifying class names as config location) as well as for classpath scanning (specifying base packages as config location). 
> 
> Note: In case of multiple @Configuration classes, later @Bean definitions will override ones defined in earlier loaded files. This can be leveraged to deliberately override certain bean definitions through an extra Configuration class.

입력으로 `@Configuration` 어노테이션, `@Component` 어노테이션, javax.inject 어노테이션을 사용하는 JSR-330 compilant 클래스들을 받는다. 클래스 이름을 설정 위치로 특정하여 클래스들을 등록하고, base 패키지들을 설정 위치로 특정하여 classpath scanning을 한다.

`@Configuration` 클래스들이 여러 개 있는 경우, 이후의 `@Bean` 정의들은 더 먼저 로드된 파일에서 정의된 bean을 오버라이딩 한다. 이는 특정 bean 정의를 추가 configuration 클래스를 통해 일부러 오버라이딩하기 위해 사용될 수 있다.

`GenericWebApplicationContext` 의 서브 클래스이며, 서브 클래스 자체는 `GenericApplicationContext` 의 서브 클래스이다. 웹 애플리케이션 중에서도 특히 서블릿 컨테이너 내부에서 실행되는 애플리케이션에 사용할 수 있는 Spring ApplicationContext를 생성하는데 사용된다.

스프링 컨테이너에서 Bean을 관리하고, 의존성 주입