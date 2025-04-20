---
title   : Spring Bean
date    : 2023-05-29 18:52:32 +0900
updated : 2023-05-29 18:52:54 +0900
tags     : 
- spring
- 개발
---

## Java Bean?

스윙에서 독립적인 GUI 컴포넌트의 개발을 용이하게 하기 위해 고안되었다.
특정 형태의 클래스를 가리키는 뜻으로 사용된다.

다음의 조건을 만족해야 한다.
- `Serializable` 을 구현하여 직렬화가 가능해야 한다.
- public 기본 생성자를 가져야 한다.
- getter, setter를 가져야 한다.
- 모든 필드는 private으로 getter, setter를 통해 접근 가능해야 한다.

## Spring Bean?

Spring Container가 관리하는 객체이다. 
Spring Application의 기본 구성 요소이자, 다른 bean과 함께 연결하여 애플리케이션의 기능을 생성할 수 있는 재사용 가능한 구성 요소이다.

XML, Java 어노테이션, `@Configuration` 같은 설정 클래스를 통해 정의된다.

## 관련 문서

- [[bean-scope]]
- [[bean-candidate]]
- [[mock-vs-mockbean]]

### Spring Container에게 객체 생성과 관리를 위임하는 것의 장단점

#### 장점
- 의존성 주입을 사용하여 객체 사이의 결합도를 낮춘다. (클래스 내부에서 클래스 의존 관계를 설정하는 것이 아니라 스프링 프레임워크에서 자동으로 주입해주므로)
- 객체의 생성, 초기화, 소멸 작업을 스프링 컨테이너가 담당하여 개발자는 비즈니스 로직에 좀 더 집중할 수 있다. 
- 다양한 bean 스코프에 따라 객체의 생명 주기, 스코프를 관리할 수 있다.
- 애플리케이션의 객체 생성과 관리에 필요한 정보를 별도의 설정 파일 또는 클래스로 분리할 수 있다. 이를 통해 코드의 유연성과 재사용성을 높일 수 있다.
	- XML 설정 방식, Java 어노테이션, `@Configuration` 설정 클래스

#### 단점
- 객체 생성과 관리, 의존성 주입 등을 컨테이너가 담당하여 런타임에 약간의 오버헤드가 발생할 수 있다. (그러나 보통 이런 오버헤드는 성능에 큰 영향을 주지 않는다.)

## Spring Bean Definition

### 그게 뭔데
Spring bean을 생성하고 구성하기 위한 설정 정보이다. 
어떤 클래스를 bean으로 사용할 것인지, 어떤 의존성을 주입할 것인지, bean의 scope 등을 정의한다.

`@Component`, `@Service`, `@Repository`, `@Controller` 어노테이션을 사용해서 bean을 등록할 수 있다. 위와 같은 어노테이션을 달게 되면 해당 클래스를 컴포넌트 스캔 대상으로 지정하여 스프링 컨테이너가 자동으로 bean으로 등록한다.

Java 설정 클래스를 사용하는 방식에서는 `@Configuration` 어노테이션이 지정된 클래스를 생성하고, `@Bean` 어노테이션을 사용하여 bean을 생성한다. 
`@Bean` 어노테이션을 붙인 메서드는 해당 메서드가 생성한 객체를 Spring Bean으로 등록한다. 
기본적으로 `@Bean` 어노테이션을 붙이게 되면 bean이 싱글톤으로 생성된다. 

### 언제, 어디서 초기화 될까?
Spring Bean은 스프링 컨테이너가 시작될 때 초기화된다. 

`ApplicationContext`의 `refresh()` 메서드가 호출되면, 스프링 컨테이너의 초기화 과정이 시작된다. 스프링 컨테이너의 구성 요소들을 설정하고, bean definition을 로드하며, bean 객체를 생성한다.
`refresh()` 내부에서 bean 생성 및 의존성 주입이 이루어진다. `DefaultListableBeanFactory` 가 bean definition을 관리하고, bean의 생성, 의존성 주입을 담당한다.

`DefaultListableBeanFactory` 는 `refresh()` 메서드에서 `preInstantiateSingletons()` 메서드를 호출하여 모든 싱글톤 bean들을 생성하고 의존성 주입을 수행한다.

```java
protected void finishBeanFactoryInitialization(ConfigurableListableBeanFactory beanFactory) {  
   // Initialize conversion service for this context.  
   if (beanFactory.containsBean(CONVERSION_SERVICE_BEAN_NAME) &&  
         beanFactory.isTypeMatch(CONVERSION_SERVICE_BEAN_NAME, ConversionService.class)) {  
      beanFactory.setConversionService(  
            beanFactory.getBean(CONVERSION_SERVICE_BEAN_NAME, ConversionService.class));  
   }  
  
   // Register a default embedded value resolver if no BeanFactoryPostProcessor  
   // (such as a PropertySourcesPlaceholderConfigurer bean) registered any before:   // at this point, primarily for resolution in annotation attribute values.   if (!beanFactory.hasEmbeddedValueResolver()) {  
      beanFactory.addEmbeddedValueResolver(strVal -> getEnvironment().resolvePlaceholders(strVal));  
   }  
  
   // Initialize LoadTimeWeaverAware beans early to allow for registering their transformers early.  
   String[] weaverAwareNames = beanFactory.getBeanNamesForType(LoadTimeWeaverAware.class, false, false);  
   for (String weaverAwareName : weaverAwareNames) {  
      getBean(weaverAwareName);  
   }  
  
   // Stop using the temporary ClassLoader for type matching.  
   beanFactory.setTempClassLoader(null);  
  
   // Allow for caching all bean definition metadata, not expecting further changes.  
   beanFactory.freezeConfiguration();  
  
   // Instantiate all remaining (non-lazy-init) singletons.  
   beanFactory.preInstantiateSingletons();  
}
```

bean 객체의 의존성 주입이 완료되면 초기화 메서드가 호출된다. 
`InitializingBean` 인터페이스를 구현한 빈은 `afterPropertiesSet()` 메서드가 호출되며, `@PostConstruct` 어노테이션이 지정된 메서드는 자동으로 호출된다.

## Bean LifeCycle

Bean으로 등록된 객체들을 초기화하고 싶은 경우, 의존관계 주입이 완료된 후에 초기화 작업을 수행해야 한다.
스프링은 의존관계 주입이 완료되면 스프링 빈에게 콜백 메서드를 통해 초기화 시점을 알려준다. 
스프링 컨테이너가 종료되기 직전에는 소멸 콜백을 제공한다.

### 과정

1. 스프링 컨테이너 생성
2. 스프링 빈 생성
3. 의존 관계 주입
4. 초기화 콜백 실행
5. 사용
6. 소멸 전 콜백 실행
7. 스프링 종료

### 생명주기 콜백

#### `InitializingBean`, `DisposableBean`

```java
@Component  
public class Bean implements InitializingBean, DisposableBean {  
    @Override  
    public void destroy() throws Exception {  
        System.out.println("소멸 콜백");  
    }  
  
    @Override  
    public void afterPropertiesSet() throws Exception {  
        System.out.println("초기화 콜백");  
    }  
}
```

```shell
2023-06-06 15:46:26.932  INFO 49436 --- [           main] hello.DemoApplication                    : No active profile set, falling back to 1 default profile: "default"
2023-06-06 15:46:27.289  INFO 49436 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2023-06-06 15:46:27.298  INFO 49436 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2023-06-06 15:46:27.298  INFO 49436 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.65]
2023-06-06 15:46:27.335  INFO 49436 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2023-06-06 15:46:27.336  INFO 49436 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 385 ms
2023-06-06 15:46:27.348  INFO 49436 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2023-06-06 15:46:27.391  INFO 49436 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2023-06-06 15:46:27.396  INFO 49436 --- [           main] o.s.b.a.h2.H2ConsoleAutoConfiguration    : H2 console available at '/h2-console'. Database available at 'jdbc:h2:mem:testdb'
초기화 콜백
2023-06-06 15:46:27.553  INFO 49436 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2023-06-06 15:46:27.559  INFO 49436 --- [           main] hello.DemoApplication                    : Started DemoApplication in 0.757 seconds (JVM running for 0.999)
소멸 콜백
2023-06-06 15:46:34.602  INFO 49436 --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown initiated...
2023-06-06 15:46:34.604  INFO 49436 --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown completed.
```

**단점만 있네**
스프링 전용 인터페이스에 의존하게 되어, POJO 객체가 아니게 된다.
초기화, 소멸 메서드의 이름을 변경할 수 없다.
코드를 고칠 수 없는 외부 라이브러리에 적용할 수 없다.
스프링 초창기에 나온 방식으로 지금은 거의 사용하지 않는다.

#### `@PostConstruct`, `@PreDestroy` 어노테이션

스프링에서 가장 권장하는 방식. 
`javax.annotation.PostConstruct` 를 사용하여 스프링이 아닌 다른 컨테이너에서도 동작한다.

```java
@Component  
public class AnnotationBean {  
    @PostConstruct  
    public void initializeCallBack() {  
        System.out.println("어노테이션 초기화 콜백");  
    }  
  
    @PreDestroy  
    public void destroyCallBack() {  
        System.out.println("어노테이션 소멸 콜백");  
    }  
}
```

단, 외부 라이브러리에는 적용하지 못한다.

#### `@Bean`의 `initMethod`, `destroyMethod`

외부 라이브러리에도 적용할 수 있는 콜백 메서드 지정 방식이다.
`@Bean`의 `initMethod`, `destroyMethod` 에 각각 문자열로 메서드 이름을 지정해주면 된다.

```java
public class NormalBean {  
    public void initMethod() {  
        System.out.println("빈 설정 초기화 콜백");  
    }  
  
    public void destroyMethod() {  
        System.out.println("빈 설정 소멸 콜백");  
    }  
}
```

```java
@Configuration  
public class Config {  
    @Bean(initMethod = "initMethod", destroyMethod = "destroyMethod")  
    public NormalBean getNormalBean() {  
        return new NormalBean();  
    }  
}
```

#### 동시에 사용하면

```shell
2023-06-06 15:54:38.077  INFO 49507 --- [           main] hello.DemoApplication                    : No active profile set, falling back to 1 default profile: "default"
2023-06-06 15:54:38.429  INFO 49507 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2023-06-06 15:54:38.432  INFO 49507 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2023-06-06 15:54:38.432  INFO 49507 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.65]
2023-06-06 15:54:38.473  INFO 49507 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2023-06-06 15:54:38.473  INFO 49507 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 379 ms
2023-06-06 15:54:38.484  INFO 49507 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2023-06-06 15:54:38.528  INFO 49507 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2023-06-06 15:54:38.533  INFO 49507 --- [           main] o.s.b.a.h2.H2ConsoleAutoConfiguration    : H2 console available at '/h2-console'. Database available at 'jdbc:h2:mem:testdb'
어노테이션 초기화 콜백
초기화 콜백
빈 설정 초기화 콜백
2023-06-06 15:54:38.692  INFO 49507 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2023-06-06 15:54:38.699  INFO 49507 --- [           main] hello.DemoApplication                    : Started DemoApplication in 0.761 seconds (JVM running for 1.003)
빈 설정 소멸 콜백
소멸 콜백
어노테이션 소멸 콜백
2023-06-06 15:54:40.466  INFO 49507 --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown initiated...
2023-06-06 15:54:40.469  INFO 49507 --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown completed.
```

신기하게도 언제나 어노테이션 초기화 콜백이 가장 먼저 불리고, 그다음은 `InitializingBean` 초기화 콜백, 마지막은 `@Configuration`에 설정해둔 초기화 콜백이 마지막으로 불린다.
소멸은 반대 순서로 이루어진다. 신기하네

## Bean Injection

## Bean 등록 방법

xml 방식도 있지만 자주 사용되지 않는 방식이니 제외했다.

### `@Configuration`

`@Configuration` 에서 수동으로 Bean을 등록해줄 수 있다. 
```java
@Configuration  
public class Config {  
    @Bean  
    public NormalBean getNormalBean() {  
        return new NormalBean();  
    }  
}
```

메서드 이름으로 bean 이름이 결정되니, 중복된 빈 이름이 존재하지 않도록 주의해야 한다.
스프링 빈으로 등록된 다른 클래스 안에서 `@Bean` 으로 직접 빈을 등록해주는 것도 동작은 하지만, `@Configuration` 내부에서 `@Bean` 을 사용해야 싱글톤을 보장받을 수 있다. 

```java
@Component  
public class CustomBean {  
    @Bean  
    @Scope(value = "singleton")  
    public OtherBean getOtherBean() {  
        return new OtherBean();  
    }  
}
```

bean을 싱글톤으로 생성하도록 설정해도 `getOtherBean` 을 호출할 때마다 계속해서 여러 객체가 생성된다.

**어떤 때에 `@Bean` 을 쓰면 좋을까** 

다음과 같은 경우에 `@Bean` 으로 직접 빈을 등록해준다. 
1. 개발자가 직접 제어가 불가능한 라이브러리를 활용할 때 (외부 라이브러리 사용)
2. 애플리케이션 전범위적으로 사용되는 클래스를 등록할 때
3. 다형성을 활용하여 여러 구현체를 등록해주어야 할 때

애플리케이션 전범위적으로 사용하는 클래스와 다형성을 활용하여 여러 구현체를 등록할 때 `@Bean` 을 사용하면 좋은 이유는 유지보수하기 좋기 때문이다. 
여러 구현체를 빈으로 등록할 때 어떤 구현체가 빈으로 등록되는지 파악하려면 `@Configuration` 만 확인하면 되어 유지보수가 용이하다.

### `@Component`

컴포넌트 스캔을 사용해서 `@Component` 어노테이션이 있는 클래스들을 찾아서 자동으로 빈 등록을 해준다.
`@Service`, `@Controller`, `@Repository` 등은 `@Component` 어노테이션을 갖는다.

원래 `@Component` 를 이용할 때 Main이나 App 클래스에서 `@ComponentScan` 으로 컴포넌트를 찾는 탐색 범위를 지정해주어야 하지만, SpringBoot 에서는 `@SpringBootConfiguration` 하위에 기본적으로 포함되어 있어 별도 설정이 필요 없다.

**참고**
- https://mangkyu.tistory.com/75