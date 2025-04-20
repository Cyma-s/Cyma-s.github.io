---
title: HandlerMapping
date: 2023-09-17 16:33:14 +0900
updated: 2023-09-17 16:40:14 +0900
tags: 
---

## 개요

`DispatcherServlet` 은 `initialize` 메서드가 있는데 왜 `HandlerMapping` 은 `initialize` 메서드가 인터페이스에 없을까? 그 이유에 대해 간단하게 알아보자.  

## `InitializingBean`

```java
public interface InitializingBean {  
  
    /**  
     * Invoked by the containing {@code BeanFactory} after it has set all bean properties  
     * and satisfied {@link BeanFactoryAware}, {@code ApplicationContextAware} etc.  
     * <p>This method allows the bean instance to perform validation of its overall  
     * configuration and final initialization when all bean properties have been set.     * @throws Exception in the event of misconfiguration (such as failure to set an  
     * essential property) or if initialization fails for any other reason     */    void afterPropertiesSet() throws Exception;  
  
}
```

스프링의 빈 생명 주기에서 초기화 작업을 지원하는 콜백 인터페이스 중 하나이다.  
해당 인터페이스를 구현한 빈은 모든 프로퍼티가 설정된 '후에' `afterPropertiesSet` 메서드가 자동으로 호출된다. 이를 통해 추가적인 초기화 작업, 검증 작업을 수행할 수 있다.  

### `afterPropertiesSet` 메서드

스프링 컨테이너에 의해 빈의 모든 프로퍼티가 설정된 직후에 호출된다.  

보통 빈의 초기화를 위한 로직을 포함하며, 빈의 상태를 검증하거나 필요한 경우 초기 데이터를 로드하는 등의 작업을 수행할 수 있다. 

`InitializingBean` 을 사용하는 경우, `afterPropertiesSet` 메서드가 가장 먼저 호출되고, `init-method` 나 `@PostConstruct` 로 지정된 메서드가 호출된다.  

## 스프링은 왜 굳이 객체 생성 과정과 초기화 과정을 나누었을까?

초기화 과정에서는 다른 빈들과의 의존성을 설정해야 한다. 그런데 객체가 생성되었을 때, 내부의 의존성들이 아직 준비되지 않았을 가능성이 있다. 그러므로 초기화 단계에서 의존성을 주입받거나 연결하게 된다.  

또한 초기화 과정을 별도로 둠으로서 특정 시점에만 초기화 로직을 실행하거나, 다양한 초기화 전략을 사용하는 것이 가능해진다.  

만약 초기화 과정에서 오류가 발생하면, 이를 적절하게 처리하기 위한 로직을 추가해야 한다. 이런 경우 별도의 초기화 단계를 통해서 이런 오류를 구체적으로 파악 / 대응할 수 있다.  
