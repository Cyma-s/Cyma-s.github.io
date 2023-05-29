---
title   : Spring Bean
date    : 2023-05-29 18:52:32 +0900
updated : 2023-05-29 18:52:54 +0900
tags     : 
- Spring
- 개발
---

## Spring Bean이란

Spring Container가 관리하는 객체이다. 
Spring Application의 기본 구성 요소이자, 다른 bean과 함께 연결하여 애플리케이션의 기능을 생성할 수 있는 재사용 가능한 구성 요소이다.

XML, Java 어노테이션, `@Configuration` 같은 설정 클래스를 통해 정의된다.

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