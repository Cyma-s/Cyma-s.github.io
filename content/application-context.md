---
title   : ApplicationContext 찍먹하기
date    : 2023-06-06 16:24:15 +0900
updated : 2023-06-06 16:24:41 +0900
tags     : 
- spring
- 개발
- 스터디
- 학습로그
---

## ApplicationContext

### 언제 실행되나?

```java
@SpringBootApplication  
public class JwpCartApplication {  
    public static void main(String[] args) {  
        SpringApplication.run(JwpCartApplication.class, args);  
    }   
}
```

장바구니 미션의 `SpringApplication.run` 을 실행해보자.

![[spring-application-context-run.png]]

`SpringApplication` 의 `run` 이 실행된다.

계속 타고 들어가면 `SpringApplication` 의 `run` 메서드가 실행된다.

```java
public ConfigurableApplicationContext run(String... args) {  

   long startTime = System.nanoTime();

// BootStrapContext 생성
   DefaultBootstrapContext bootstrapContext = createBootstrapContext();  
   ConfigurableApplicationContext context = null;  

// Java AWT Headless Property 설정
   configureHeadlessProperty();  

// 스프링 애플리케이션 리스너 조회 및 starting 처리
   SpringApplicationRunListeners listeners = getRunListeners(args);  
   listeners.starting(bootstrapContext, this.mainApplicationClass);  
   
   try {  

	// Arguments 래핑 및 Environment 준비
      ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);  
      ConfigurableEnvironment environment = prepareEnvironment(listeners, bootstrapContext, applicationArguments);  

	// IgnoreBeanInfo 설정
      configureIgnoreBeanInfo(environment);  

	// 배너 출력
      Banner printedBanner = printBanner(environment);  

	// **애플리케이션 컨텍스트 생성**
      context = createApplicationContext();  
      context.setApplicationStartup(this.applicationStartup);  

	// **Context 준비 단계**
      prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);  

	// Context Refresh 단계
      refreshContext(context);  

	// Context Refresh 후처리 단계
      afterRefresh(context, applicationArguments);  

	// 실행 시간 출력 및 리스너 started 처리
      Duration timeTakenToStartup = Duration.ofNanos(System.nanoTime() - startTime);  
      if (this.logStartupInfo) {  
         new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), timeTakenToStartup);  
      }  
      listeners.started(context, timeTakenToStartup);  

	// Runners 실행
      callRunners(context, applicationArguments);  
   }  
   catch (Throwable ex) {  
      handleRunFailure(context, ex, listeners);  
      throw new IllegalStateException(ex);  
   }  
   ...
   return context;  
}
```

## 곧 지울 내용
---

### BootStrapContext 생성

`createBootstrapContext()` 내부로 들어가보자.

`createBootstrapContext()`는 `ApplicationContext`를 생성하기 전에 `BootstrapContext`를 생성하는 메서드이다. `BootstrapContext` 란 애플리케이션 컨텍스트가 준비될 때까지 환경 변수를 관리하는 Spring의 Environment 객체를 후처리하기 위한 임시 컨텍스트이다. 

Spring Boot는 다양한 환경에서 애플리케이션을 실행할 수 있으므로, `createBootstrapContext()` 는 애플리케이션을 실행할 환경과 관련된 `BootstrapContext`를 생성한다. 

```java
private DefaultBootstrapContext createBootstrapContext() {  
   DefaultBootstrapContext bootstrapContext = new DefaultBootstrapContext();  
   this.bootstrapRegistryInitializers.forEach((initializer) -> initializer.initialize(bootstrapContext));  
   return bootstrapContext;  
}
```

`initializers` 리스트를 초기화하고, 해당 리스트의 요소들에 대해 `initialize()` 메서드를 호출하여 `BootstrapContext`를 초기화한다.

### Java AWT Headless Property 설정

Java AWT Headless Property란 디스플레이 장치가 없는 서버 환경에서 UI 클래스를 사용할 수 있도록 하는 옵션이다.
`java.awt.headless` 를 true로 설정하거나, 서버 시작 스크립트의 `JAVA_OPTS` 환경 변수에 `-D java.awt.headless=true` 를 설정하는 방법 등이 있다.

```java
private void configureHeadlessProperty() {  
   System.setProperty(SYSTEM_PROPERTY_JAVA_AWT_HEADLESS,  
         System.getProperty(SYSTEM_PROPERTY_JAVA_AWT_HEADLESS, Boolean.toString(this.headless)));  
}
```

이 부분은 (잘 모르겠으니) 자세히 다루지 않고 넘어가겠다.

---

### 애플리케이션 컨텍스트 생성

`createApplicationContext` 는 내부적으로 `ApplicationContextInitializer` 객체들의 `initialize()` 메서드를 호출하여 `ApplicationContext` 의 초기화 작업을 수행한다. 

```java
protected ConfigurableApplicationContext createApplicationContext() {  
   return this.applicationContextFactory.create(this.webApplicationType);  
}
```

코드를 보면 `ApplicationContextFactory` 팩토리 클래스에게 생성을 위임하는 것을 볼 수 있다.
애플리케이션 컨텍스트 생성 시에는 `webApplicationType` 이 사용된다.

우리의 애플리케이션은 SERVLET 기반으로 실행되기 때문에, 환경 또한 `ApplicationServletEnvironment` 로 설정되어 있다.

내부는 다음과 같다.

![[spring-application-context-getFactories.png]]

디버깅을 해보면 `create()`로 부터 생성되는 `ConfigurableApplicationContext`는 `AnnotationConfigServletWebServerApplicationContext`인 것을 확인할 수 있다.

Spring이 제공하는 ApplicationContext 구현 클래스에는 여러 가지 종류가 있다.
Spring Application은 사용자 대신 `ApplicationContext` 의 적절한 타입을 생성하게 된다.

`WebApplicationType` 은 다음과 같이 정해진다.

- Spring MVC가 존재 -> `AnnotaionConfigServletWebServerApplicationContext` 사용
- Spring MVC가 존재하지 않고, Spring WebFlux가 존재하면 `AnnotationConfigReactiveWebServerApplicationContext` 사용
- 그 외에는 `AnnotationConfigApplicationContext` 사용

### 잠깐, AnnotationConfigServletWebServerApplicationContext는 뭘까

> ServletWebServerApplicationContext that accepts annotated classes as input - in particular @Configuration -annotated classes, but also plain @Component classes and JSR-330 compliant classes using javax.inject annotations. Allows for registering classes one by one (specifying class names as config location) as well as for classpath scanning (specifying base packages as config location). 
> 
> Note: In case of multiple @Configuration classes, later @Bean definitions will override ones defined in earlier loaded files. This can be leveraged to deliberately override certain bean definitions through an extra Configuration class.

`AnnotationConfigServletWebServerApplicationContext` 는 우리가 Spring 애플리케이션을 사용할 때 실행되는 웹 `ApplicationContext` 중의 하나이다. 
Java Config를 사용하여 웹 애플리케이션을 설정하기 위해 사용된다.

입력으로 `@Configuration` 어노테이션, `@Component` 어노테이션, javax.inject 어노테이션을 사용하는 JSR-330 compilant 클래스들을 받는다. 클래스 이름을 설정 위치로 특정하여 클래스들을 등록하고, base 패키지들을 설정 위치로 특정하여 classpath scanning을 한다.

`@Configuration` 클래스들이 여러 개 있는 경우, 이후의 `@Bean` 정의들은 더 먼저 로드된 파일에서 정의된 bean을 오버라이딩 한다. 이는 특정 bean 정의를 추가 configuration 클래스를 통해 일부러 오버라이딩하기 위해 사용될 수 있다.

`GenericWebApplicationContext` 의 서브 클래스이며, 서브 클래스 자체는 `GenericApplicationContext` 의 서브 클래스이다. 
웹 애플리케이션 중에서도 특히 서블릿 컨테이너 내부에서 실행되는 애플리케이션에 사용할 수 있는 Spring ApplicationContext를 생성하는데 사용된다.

### Context 준비 단계

Context가 생성된 후에 해주어야 하는 후처리 작업들과 bean을 등록하는 refresh 단계를 위한 전처리 작업을 수행한다.

```java
private void prepareContext(DefaultBootstrapContext bootstrapContext, ConfigurableApplicationContext context,  
      ConfigurableEnvironment environment, SpringApplicationRunListeners listeners,  
      ApplicationArguments applicationArguments, Banner printedBanner) {  
	
   // Environment를 애플리케이션 컨텍스트에 설정한다. 
   context.setEnvironment(environment);  
   postProcessApplicationContext(context);  

   // Initializer initialize 해주기
   applyInitializers(context);  
   listeners.contextPrepared(context);  
   
   // BootstrapContext 종료
   bootstrapContext.close(context);  
   if (this.logStartupInfo) {  
      logStartupInfo(context.getParent() == null);  
      logStartupProfileInfo(context);  
   }  
   
   // Add boot specific singleton beans  
   ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();  
   beanFactory.registerSingleton("springApplicationArguments", applicationArguments);  
   if (printedBanner != null) {  
      beanFactory.registerSingleton("springBootBanner", printedBanner);  
   }  
   if (beanFactory instanceof AbstractAutowireCapableBeanFactory) {  
      ((AbstractAutowireCapableBeanFactory) beanFactory).setAllowCircularReferences(this.allowCircularReferences);  
      if (beanFactory instanceof DefaultListableBeanFactory) {  
         ((DefaultListableBeanFactory) beanFactory)  
            .setAllowBeanDefinitionOverriding(this.allowBeanDefinitionOverriding);  
      }  
   }   if (this.lazyInitialization) {  
      context.addBeanFactoryPostProcessor(new LazyInitializationBeanFactoryPostProcessor());  
   }  
   context.addBeanFactoryPostProcessor(new PropertySourceOrderingBeanFactoryPostProcessor(context));  
   
   // Load the sources  
   Set<Object> sources = getAllSources();  
   Assert.notEmpty(sources, "Sources must not be empty");  
   load(context, sources.toArray(new Object[0]));  
   listeners.contextLoaded(context);  
}
```

`applyInitializer` 에서는 SpringApplication에 등록된 `ApplicationContextInitializer` 를 가져온다. 가져온 `ApplicationContextInitializer` 리스트를 반복하여 각각의 `ApplicationContextInitializer` 의 `initialize()` 를 호출한다.

사용자가 추가한 설정을 적용하여, `ApplicationContext` 가 정상적으로 구동될 수 있도록 한다.

![[initializer.png]]

애플리케이션 컨텍스트가 생성되고, initializer들의 initialize까지 진행되면 `BootstrapContext`가 불필요하므로 `BootstrapContext` 를 종료해준다.

- `DefaultSingletonoBeanRegistry` 의  `registerSingleton()`

```java
@Override  
public void registerSingleton(String beanName, Object singletonObject) throws IllegalStateException {  
   Assert.notNull(beanName, "Bean name must not be null");  
   Assert.notNull(singletonObject, "Singleton object must not be null");  
   synchronized (this.singletonObjects) {  
      Object oldObject = this.singletonObjects.get(beanName);  
      if (oldObject != null) {  
         throw new IllegalStateException("Could not register object [" + singletonObject +  
               "] under bean name '" + beanName + "': there is already object [" + oldObject + "] bound");  
      }  
      addSingleton(beanName, singletonObject);  
   }  
}
```

bean의 이름과 인스턴스를 인자로 받아 bean의 이름으로 싱글톤 레지스트리에 bean의 인스턴스를 등록한다. 

동일한 이름의 bean이 이미 등록되어 있으면, 덮어쓰지 않고 예외를 발생시켜 bean의 중복 등록을 방지한다. 
(`SpringApplicationBuilder` 나 `properties` 를 통해 해당 옵션을 변경할 수는 있지만 가급적 기본값을 사용하는 것이 좋다. 중복된 bean이 등록되는 경우 IoC 컨테이너에서 어떤 bean을 사용해야 할 지 결정할 수 없어 예기치 못한 동작을 일으킬 수 있다.)

### Context Refresh 단계

싱글톤 빈으로 등록할 클래스들을 찾아서 생성하고, 후처리하는 단계이다.
`refresh` 를 거치면 모든 객체들이 싱글톤으로 인스턴스화 되는데, 에러가 발생하면 모든 bean을 제거한다.

즉, `refresh()` 를 거쳤을 때 싱글톤으로 모두 인스턴스화 되던지, 아예 인스턴스화 되지 않아야 한다.

- `AbstractApplicationContext`: `refresh()` 

```java
@Override  
public void refresh() throws BeansException, IllegalStateException {  
   synchronized (this.startupShutdownMonitor) {  
      StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");  
  
      // Prepare this context for refreshing.  
      // Refresh를 위해 context 준비하기 
      prepareRefresh();  
  
      // Tell the subclass to refresh the internal bean factory.  
      // 내부 Bean Factory 준비하기
      ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();  
  
      // Prepare the bean factory for use in this context.  
      // 해당 context에서 사용하기 위한 Bean Factory 준비하기
      prepareBeanFactory(beanFactory);  
  
      try {  
         // Allows post-processing of the bean factory in context subclasses.  
         // Bean Factory의 후처리 진행
         postProcessBeanFactory(beanFactory);  
  
         StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");  
         
         // Invoke factory processors registered as beans in the context.  
         // Context에 bean으로 등록되는 Factory processor 실행 (BeanFactoryPostProcessor 실행)
         invokeBeanFactoryPostProcessors(beanFactory);  
  
         // Register bean processors that intercept bean creation.  
         // Bean 생성을 가로채는 Bean Processor 등록 (BeanPostProcessor 등록)
         registerBeanPostProcessors(beanFactory);  
         beanPostProcess.end();  
  
         // Initialize message source for this context.  
         // messageSource 및 Event Multicaster 초기화
         initMessageSource();  
  
         // Initialize event multicaster for this context.  
         initApplicationEventMulticaster();  
  
         // Initialize other special beans in specific context subclasses.  
         // 웹 서버 생성
         onRefresh();  
  
         // Check for listener beans and register them.  
         // listener 빈들을 조회 및 등록
         registerListeners();  
  
         // Instantiate all remaining (non-lazy-init) singletons.  
         // 빈 인스턴스화 및 후처리
         finishBeanFactoryInitialization(beanFactory);  
  
         // Last step: publish corresponding event.  
         finishRefresh();  
      }  
  
      catch (BeansException ex) {  
         if (logger.isWarnEnabled()) {  
            logger.warn("Exception encountered during context initialization - " +  
                  "cancelling refresh attempt: " + ex);  
         }  
  
         // Destroy already created singletons to avoid dangling resources.  
         destroyBeans();  
  
         // Reset 'active' flag.  
         cancelRefresh(ex);  
  
         // Propagate exception to caller.  
         throw ex;  
      }  
  
      finally {  
         // Reset common introspection caches in Spring's core, since we  
         // might not ever need metadata for singleton beans anymore...         resetCommonCaches();  
         contextRefresh.end();  
      }  
   }}
```

`DefaultListableBeanFactory` bean 팩토리를 생성한다.

`prepareBeanFactory()` 에서 의존성 주입을 무시할 인터페이스들을 등록한다.

```java
protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {  
   // Tell the internal bean factory to use the context's class loader etc.  
   beanFactory.setBeanClassLoader(getClassLoader());  
   if (!shouldIgnoreSpel) {  
      beanFactory.setBeanExpressionResolver(new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));  
   }  
   beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, getEnvironment()));  
  
   // Configure the bean factory with context callbacks.  
   beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));  
   beanFactory.ignoreDependencyInterface(EnvironmentAware.class);  
   beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);  
   beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);  
   beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);  
   beanFactory.ignoreDependencyInterface(MessageSourceAware.class);  
   beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);  
   beanFactory.ignoreDependencyInterface(ApplicationStartupAware.class);  
  
   // BeanFactory interface not registered as resolvable type in a plain factory.  
   // MessageSource registered (and found for autowiring) as a bean.   beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);  
   beanFactory.registerResolvableDependency(ResourceLoader.class, this);  
   beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);  
   beanFactory.registerResolvableDependency(ApplicationContext.class, this);  
  
   // Register early post-processor for detecting inner beans as ApplicationListeners.  
   beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));  
  
   // Detect a LoadTimeWeaver and prepare for weaving, if found.  
   if (!NativeDetector.inNativeImage() && beanFactory.containsBean(LOAD_TIME_WEAVER_BEAN_NAME)) {  
      beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));  
      // Set a temporary ClassLoader for type matching.  
      beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));  
   }  
  
   // Register default environment beans.  
   if (!beanFactory.containsLocalBean(ENVIRONMENT_BEAN_NAME)) {  
      beanFactory.registerSingleton(ENVIRONMENT_BEAN_NAME, getEnvironment());  
   }  
   if (!beanFactory.containsLocalBean(SYSTEM_PROPERTIES_BEAN_NAME)) {  
      beanFactory.registerSingleton(SYSTEM_PROPERTIES_BEAN_NAME, getEnvironment().getSystemProperties());  
   }  
   if (!beanFactory.containsLocalBean(SYSTEM_ENVIRONMENT_BEAN_NAME)) {  
      beanFactory.registerSingleton(SYSTEM_ENVIRONMENT_BEAN_NAME, getEnvironment().getSystemEnvironment());  
   }  
   if (!beanFactory.containsLocalBean(APPLICATION_STARTUP_BEAN_NAME)) {  
      beanFactory.registerSingleton(APPLICATION_STARTUP_BEAN_NAME, getApplicationStartup());  
   }  
}
```

`postProcessBeanFactory()` 에서 beanPostProcessor를 등록하고, bean 팩토리에 `WebApplicationContext`와 관련된 스코프를 등록한다. 

```java
@Override  
protected void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {  
   beanFactory.addBeanPostProcessor(new WebApplicationContextServletContextAwareProcessor(this));  
   beanFactory.ignoreDependencyInterface(ServletContextAware.class);  
   registerWebApplicationScopes();  
}
```

`invokeBeanFactoryPostProcessors()`는 ConfigClass의 bean 정의와 기타 bean 정의를 로딩한다.

`registerBeanPostProcessors()` 는 bean 생성을 가로채는 bean 프로세서들을 등록한다.

`initMessageSource()`, `initApplicationEventMulticaster()`에서 message source와 multicaster의 bean을 등록한다.

`onRefresh()` 에서는 `WebServerFactory`를 통해 `Tomcat Server` 객체를 만들고 설정 값들을 세팅한다.

`registerListeners()` 는 `EventMultiCaster` 에 리스너를 등록한다.

`finishBeanFactoryInitialization()` 에서는 bean 팩토리의 설정과 정의들을 프리징하고, 남은 싱글톤 빈들을 모두 인스턴스로 등록한다.

마지막으로 `finishRefresh()` 는 마지막 이벤트를 발행하고, 등록되어 있는 이벤트 리스너를 별도 스레드로 실행한다. 이후 Tomcat Server를 시작한다.

refresh의 자세한 동작 과정은 다음 포스팅을 기대해주세요~

## 정리
애플리케이션에 대한 Configuration을 제공하는 인터페이스이다. Bean Factory를 상속받아 확장되었다.
`@Configuration` 이 붙은 클래스들을 설정 정보로 등록해두고, `@Bean` 이 붙은 메서드의 이름으로 bean 목록을 생성한다.
클라이언트가 해당 bean을 요청하면 bean 목록에서 요청한 이름이 있는지 찾고, 있으면 해당 bean 생성 메서드를 호출하여 객체를 생성하고 돌려준다.

## 추가할 내용
- bean 후처리
- BeanDefinition이 어디서 초기화 되는가? -> [[bean]] 에 추가했습니다.
- getBean 알아보기

## 참고 자료
- https://www.baeldung.com/spring-beanfactory-vs-applicationcontext
- [망규형 블로그 - Application Run](https://mangkyu.tistory.com/213)
- [망규형 블로그 - refresh](https://mangkyu.tistory.com/214)
- https://pplenty.tistory.com/6