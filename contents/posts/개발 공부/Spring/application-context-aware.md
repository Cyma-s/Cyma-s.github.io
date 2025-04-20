---
title: ApplicationContextAware
date: 2023-09-19 11:57:44 +0900
updated: 2023-10-02 23:17:51 +0900
tags:
  - spring
---

## ApplicationContextAware 란?

정말 간단한 구조를 가지고 있는 인터페이스이다.  

```java
package org.springframework.context;  
  
import org.springframework.beans.BeansException;  
import org.springframework.beans.factory.Aware;  
  
public interface ApplicationContextAware extends Aware {  
  
    void setApplicationContext(ApplicationContext applicationContext) throws BeansException;  
  
}
```

> Interface to be implemented by any object that wishes to be notified of the ApplicationContext that it runs in.

실행중인 `ApplicationContext` 에 대한 알림(?) 을 받고자 하는 객체가 구현할 인터페이스라고 한다.  

번역이 이상하지만 아무튼 런타임에 `ApplicationContext` 가 필요한 객체가 구현하면 된다.  
`HandlerMapping`, `ViewResolver`, `DispatcherServlet` 과 같이 런타임에 동적으로 빈들의 의존관계가 필요한 클래스가 구현한다.  

> Implementing this interface makes sense for example when an object requires access to a set of collaborating beans. Note that configuration via bean references is preferable to implementing this interface just for bean lookup purposes.

공식 docs 에서도 빈 조회 목적으로만 구현하는 것보다, 빈 참조를 통해 구성하기 위한 용도로 사용하는 것이 더 바람직하다고 적혀있다.  

## 어떻게 주입되나?

예시로 `AbstractHandlerMapping` 이라는 클래스를 보자.  
`initApplicationContext` 에서 `initInterceptor` 로 초기화를 하는 것을 확인할 수 있다.  

여기서 `obtainApplicationContext()` 를 수행하게 되는데, 

```java
public abstract class AbstractHandlerMapping extends WebApplicationObjectSupport  
       implements HandlerMapping, Ordered, BeanNameAware {  
  
    /** Dedicated "hidden" logger for request mappings. */  
    protected final Log mappingsLogger =  
          LogDelegateFactory.getHiddenLog(HandlerMapping.class.getName() + ".Mappings");  
  
  
    @Nullable  
    private Object defaultHandler;
    ...

	@Override  
protected void initApplicationContext() throws BeansException {  
    extendInterceptors(this.interceptors);  
    detectMappedInterceptors(this.adaptedInterceptors);  
    initInterceptors();  
}  
  
protected void extendInterceptors(List<Object> interceptors) {  
}  
  
protected void detectMappedInterceptors(List<HandlerInterceptor> mappedInterceptors) {  
    mappedInterceptors.addAll(BeanFactoryUtils.beansOfTypeIncludingAncestors(  
          obtainApplicationContext(), MappedInterceptor.class, true, false).values());  // ApplicationContext 를 받아온다.  
}  
   
protected void initInterceptors() {  
    if (!this.interceptors.isEmpty()) {  
       for (int i = 0; i < this.interceptors.size(); i++) {  
          Object interceptor = this.interceptors.get(i);  
          if (interceptor == null) {  
             throw new IllegalArgumentException("Entry number " + i + " in interceptors array is null");  
          }  
          this.adaptedInterceptors.add(adaptInterceptor(interceptor));  
       }  
    }}
}
```

`WebApplicationObjectSupport` 는 다시 `ApplicationObjectSupport` 를 상속한다.  
위에서 언급되었던 `obtainApplicationContext()` 를 수행하는 것을 볼 수 있다.  

```java
public abstract class WebApplicationObjectSupport extends ApplicationObjectSupport implements ServletContextAware {  
  
    @Nullable  
    private ServletContext servletContext;  
  
  
    @Override  
    public final void setServletContext(ServletContext servletContext) {  
       if (servletContext != this.servletContext) {  
          this.servletContext = servletContext;  
          initServletContext(servletContext);  
       }  
    }

	...

	protected final ApplicationContext obtainApplicationContext() {  
	    ApplicationContext applicationContext = getApplicationContext();  
	    Assert.state(applicationContext != null, "No ApplicationContext");  
	    return applicationContext;  
	}
}
```

`getApplicationContext()` 메서드는 `ApplicationObjectSupport` 에 구체적으로 구현되어있다. 

```java
public abstract class ApplicationObjectSupport implements ApplicationContextAware {  
  
    /** Logger that is available to subclasses. */  
    protected final Log logger = LogFactory.getLog(getClass());  
  
    /** ApplicationContext this object runs in. */  
    @Nullable  
    private ApplicationContext applicationContext;  
  
    /** MessageSourceAccessor for easy message access. */  
    @Nullable  
    private MessageSourceAccessor messageSourceAccessor;

	...
    
	@Override  
	public final void setApplicationContext(@Nullable ApplicationContext context) throws BeansException {  
	    if (context == null && !isContextRequired()) {  
	       // Reset internal context state.  
	       this.applicationContext = null;  
	       this.messageSourceAccessor = null;  
	    }  
	    else if (this.applicationContext == null) {  
	       // Initialize with passed-in context.  
	       if (!requiredContextClass().isInstance(context)) {  
	          throw new ApplicationContextException(  
	                "Invalid application context: needs to be of type [" + requiredContextClass().getName() + "]");  
	       }  
	       this.applicationContext = context;  
	       this.messageSourceAccessor = new MessageSourceAccessor(context);  
	       initApplicationContext(context);  
	    }  
	    else {  
	       // Ignore reinitialization if same context passed in.  
	       if (this.applicationContext != context) {  
	          throw new ApplicationContextException(  
	                "Cannot reinitialize with different application context: current one is [" +  
	                this.applicationContext + "], passed-in one is [" + context + "]");  
	       }  
	    }}
}
```

## `BeanFactoryUtils` 란?

위 코드를 자세하게 보면 이런 코드가 있다.  

```java
    mappedInterceptors.addAll(BeanFactoryUtils.beansOfTypeIncludingAncestors(  
          obtainApplicationContext(), MappedInterceptor.class, true, false).values());  
```

이러면 `BeanFactoryUtils` 가 빈을 가지고 있는 것 아닐까? 좀 더 알아보자.  

`BeanFactoryUtils` 는 `ApplicationContext` 를 파라미터로 받고 있다.  
`ApplicationContext` 는 굉장히 여러 가지를 상속 받고 있는데, 그 중에 하나가 `ListableBeanFactory` 이다.  

`ListableBeanFactory` 는 다음과 같은 클래스이다.  
딱 봐도 복잡한 빈 관련 기능들을 수행하는 것을 볼 수 있다.  

```java
package org.springframework.beans.factory;  
  
import java.lang.annotation.Annotation;  
import java.util.Map;  
import java.util.Set;  
  
import org.springframework.beans.BeansException;  
import org.springframework.core.ResolvableType;  
import org.springframework.lang.Nullable;  
  
public interface ListableBeanFactory extends BeanFactory {  
  
    boolean containsBeanDefinition(String beanName);  
  
    int getBeanDefinitionCount();  
  
    String[] getBeanDefinitionNames();  
  
    <T> ObjectProvider<T> getBeanProvider(Class<T> requiredType, boolean allowEagerInit);  
  
    <T> ObjectProvider<T> getBeanProvider(ResolvableType requiredType, boolean allowEagerInit);  
  
    String[] getBeanNamesForType(ResolvableType type);  
  
    String[] getBeanNamesForType(ResolvableType type, boolean includeNonSingletons, boolean allowEagerInit);  
  
    String[] getBeanNamesForType(@Nullable Class<?> type);  
  
    String[] getBeanNamesForType(@Nullable Class<?> type, boolean includeNonSingletons, boolean allowEagerInit);  
  
    <T> Map<String, T> getBeansOfType(@Nullable Class<T> type) throws BeansException;  
  
    <T> Map<String, T> getBeansOfType(@Nullable Class<T> type, boolean includeNonSingletons, boolean allowEagerInit)  
          throws BeansException;  
  
    String[] getBeanNamesForAnnotation(Class<? extends Annotation> annotationType);  
  
    Map<String, Object> getBeansWithAnnotation(Class<? extends Annotation> annotationType) throws BeansException;  
  
    <A extends Annotation> A findAnnotationOnBean(String beanName, Class<A> annotationType)  
          throws NoSuchBeanDefinitionException;  
  
    <A extends Annotation> A findAnnotationOnBean(  
          String beanName, Class<A> annotationType, boolean allowFactoryBeanInit)  
          throws NoSuchBeanDefinitionException;  
  
    <A extends Annotation> Set<A> findAllAnnotationsOnBean(  
          String beanName, Class<A> annotationType, boolean allowFactoryBeanInit)  
          throws NoSuchBeanDefinitionException;  
  
}
```

`BeanFactoryUtils.beansOfTypeIncludingAncestors` 를 좀 더 자세히 알아보자. 해당 메서드를 호출하면 다음과 같은 코드가 실행된다.  

아래는 `BeanFactoryUtils.beansOfTypeIncludingAncestors` 코드이다.  

```java
public static <T> Map<String, T> beansOfTypeIncludingAncestors(  
       ListableBeanFactory lbf, Class<T> type, boolean includeNonSingletons, boolean allowEagerInit)  
       throws BeansException {  
  
    Assert.notNull(lbf, "ListableBeanFactory must not be null");  
    Map<String, T> result = new LinkedHashMap<>(4);  
    result.putAll(lbf.getBeansOfType(type, includeNonSingletons, allowEagerInit));  
    if (lbf instanceof HierarchicalBeanFactory hbf) {  
       if (hbf.getParentBeanFactory() instanceof ListableBeanFactory pbf) {  
          Map<String, T> parentResult = beansOfTypeIncludingAncestors(pbf, type, includeNonSingletons, allowEagerInit);  
          parentResult.forEach((beanName, beanInstance) -> {  
             if (!result.containsKey(beanName) && !hbf.containsLocalBean(beanName)) {  
                result.put(beanName, beanInstance);  
             }  
          });  
       }  
    }    return result;  
}
```

주어진 타입의 모든 빈 인스턴스를 `ListableBeanFactory` 와 해당 팩토리의 부모 계층에서 찾는 데 사용되는 메서드이다. 특히 계층적인 `BeanFactory` 에서 유용하다.  

즉, `ApplicationContext` 는 `ListableBeanFactory` 를 상속하고, `refresh` 에서 빈을 초기화하는 과정이 일어난다. `BeanFactoryUtils` 는 이런 빈들을 찾아오는 과정들을 용이하게 해주는 클래스라고 생각하면 된다.    

`refresh` 함수에 대한 자세한 부분은 `AbstractApplicationContext` 의 `refresh` 메서드를 참고하면 된다.  
약간의 설명은 [[application-context]] 에 적어두었다.  
