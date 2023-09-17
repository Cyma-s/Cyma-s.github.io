---
title: HandlerAdapter
date: 2023-09-17 15:07:08 +0900
updated: 2023-09-17 15:36:50 +0900
tags:
  - spring
  - 레벨4
---

## HandlerAdapter

> MVC framework SPI, allowing parameterization of the core MVC workflow. 
> Interface that must be implemented for each handler type to handle a request. This interface is used to allow the DispatcherServlet to be indefinitely extensible. The DispatcherServlet accesses all installed handlers through this interface, meaning that it does not contain code specific to any handler type.
> Note that a handler can be of type Object. This is to enable handlers from other frameworks to be integrated with this framework without custom coding, as well as to allow for annotation-driven handler objects that do not obey any specific Java interface.
> This interface is not intended for application developers. It is available to handlers who want to develop their own web workflow.
> Note: HandlerAdapter implementors may implement the org.springframework.core.Ordered interface to be able to specify a sorting order (and thus a priority) for getting applied by the DispatcherServlet. Non-Ordered instances get treated as the lowest priority.

요청을 처리하기 위해 핸들러 타입별로 구현해야 하는 인터페이스이다.  
핸들러는 Object 유형이 될 수 있다. 이를 통해 다른 프레임워크의 핸들러를 특정 코드 없이 프레임워크와 통합할 수 있고, 특정 Java 인터페이스를 따르지 않은 어노테이션 기반 핸들러 객체를 허용할 수 있다.  

즉, `HandlerMapping` 을 통해 찾은 `Handler` 를 실행할 수 있는 객체이다.  

### `supports()`

> Given a handler instance, return whether this HandlerAdapter can support it. Typical HandlerAdapters will base the decision on the handler type. HandlerAdapters will usually only support one handler type each.

`HandlerAdapter` 가 지원할 수 있는지 여부를 반환한다. 일반적으로 `HandlerAdapter` 들은 오직 하나의 핸들러 타입만 지원한다.  

### `handle()`

> Use the given handler to handle this request. The workflow that is required may vary widely.

실제로 요청을 처리하는 메서드이다.  

## `AbstractHandlerMethodAdapter` 

handler 가 `HandlerMethod` 의 인스턴스인지 확인한다.  

```java
@Override  
public final boolean supports(Object handler) {  
    return (handler instanceof HandlerMethod handlerMethod && supportsInternal(handlerMethod));  
}
```

`supportsInternal()` 메서드는 언제나 true 를 리턴하므로, `HandlerMethod` 인스턴스이기만 하면 true 를 리턴하게 된다.  

## `DispatcherServlet` 의 `getHandlerAdapter`

```java
protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {  
    if (this.handlerAdapters != null) {  
       for (HandlerAdapter adapter : this.handlerAdapters) {  
          if (adapter.supports(handler)) {  
             return adapter;  
          }  
       }    }    throw new ServletException("No adapter for handler [" + handler +  
          "]: The DispatcherServlet configuration needs to include a HandlerAdapter that supports this handler");  
}
```

HandlerAdapter 가 지원할 수 있는 handler 를 찾으면 `adapter` 를 반환한다.  

### `handle()`

```java
@Override  
@Nullable  
public final ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler)  
       throws Exception {  
  
    return handleInternal(request, response, (HandlerMethod) handler);  
}
```

내부적으로 `handleInternal()` 을 호출한다.

## `RequestMappingHandlerAdapter`

### `handleInternal()`

```java
@Override  
protected ModelAndView handleInternal(HttpServletRequest request,  
       HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {  
  
    ModelAndView mav;  
    checkRequest(request);  
  
    // Execute invokeHandlerMethod in synchronized block if required.  
    if (this.synchronizeOnSession) {  
       HttpSession session = request.getSession(false);  
       if (session != null) {  
          Object mutex = WebUtils.getSessionMutex(session);  
          synchronized (mutex) {  
             mav = invokeHandlerMethod(request, response, handlerMethod);  
          }  
       }       else {  
          // No HttpSession available -> no mutex necessary  
          mav = invokeHandlerMethod(request, response, handlerMethod);  
       }  
    }    else {  
       // No synchronization on session demanded at all...  
       mav = invokeHandlerMethod(request, response, handlerMethod);  
    }  
  
    if (!response.containsHeader(HEADER_CACHE_CONTROL)) {  
       if (getSessionAttributesHandler(handlerMethod).hasSessionAttributes()) {  
          applyCacheSeconds(response, this.cacheSecondsForSessionAttributeHandlers);  
       }  
       else {  
          prepareResponse(response);  
       }  
    }  
    return mav;  
}
```

1. `checkRequest()` 로 해당 요청이 지원되는 methods 인지, 세션이 필요한지 확인한다.  

```java
// WebContentGenerator.class
protected final void checkRequest(HttpServletRequest request) throws ServletException {  
    // Check whether we should support the request method.  
    String method = request.getMethod();  
    if (this.supportedMethods != null && !this.supportedMethods.contains(method)) {  
       throw new HttpRequestMethodNotSupportedException(method, this.supportedMethods);  
    }  
  
    // Check whether a session is required.  
    if (this.requireSession && request.getSession(false) == null) {  
       throw new HttpSessionRequiredException("Pre-existing session required but none found");  
    }  
}
```

2. 세션을 사용하는 경우 mutex 를 사용한다. 세션 사용 유무에 따라 성능 차이가 생길 수 있을 것이다.  
3. `invokeHandlerMethod` 를 실행한다.

### `invokeHandlerMethod`

```java
@Nullable  
protected ModelAndView invokeHandlerMethod(HttpServletRequest request,  
       HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {  
  
    ServletWebRequest webRequest = new ServletWebRequest(request, response);  
    WebDataBinderFactory binderFactory = getDataBinderFactory(handlerMethod);  
    ModelFactory modelFactory = getModelFactory(handlerMethod, binderFactory);  
  
    ServletInvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);  
    if (this.argumentResolvers != null) {  
       invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);  
    }  
    if (this.returnValueHandlers != null) {  
       invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);  
    }  
    invocableMethod.setDataBinderFactory(binderFactory);  
    invocableMethod.setParameterNameDiscoverer(this.parameterNameDiscoverer);  
  
    ModelAndViewContainer mavContainer = new ModelAndViewContainer();  
    mavContainer.addAllAttributes(RequestContextUtils.getInputFlashMap(request));  
    modelFactory.initModel(webRequest, mavContainer, invocableMethod);  
    mavContainer.setIgnoreDefaultModelOnRedirect(this.ignoreDefaultModelOnRedirect);  
  
    AsyncWebRequest asyncWebRequest = WebAsyncUtils.createAsyncWebRequest(request, response);  
    asyncWebRequest.setTimeout(this.asyncRequestTimeout);  
  
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);  
    asyncManager.setTaskExecutor(this.taskExecutor);  
    asyncManager.setAsyncWebRequest(asyncWebRequest);  
    asyncManager.registerCallableInterceptors(this.callableInterceptors);  
    asyncManager.registerDeferredResultInterceptors(this.deferredResultInterceptors);  
  
    if (asyncManager.hasConcurrentResult()) {  
       Object result = asyncManager.getConcurrentResult();  
       mavContainer = (ModelAndViewContainer) asyncManager.getConcurrentResultContext()[0];  
       asyncManager.clearConcurrentResult();  
       LogFormatUtils.traceDebug(logger, traceOn -> {  
          String formatted = LogFormatUtils.formatValue(result, !traceOn);  
          return "Resume with async result [" + formatted + "]";  
       });  
       invocableMethod = invocableMethod.wrapConcurrentResult(result);  
    }  
  
    invocableMethod.invokeAndHandle(webRequest, mavContainer);  
    if (asyncManager.isConcurrentHandlingStarted()) {  
       return null;  
    }  
  
    return getModelAndView(mavContainer, modelFactory, webRequest);  
}
```

`RequestMapping` 핸들러 메서드를 호출하는 메서드이다.  

1. `HttpServletRequest` 와 `HttpServletResponse` 를 기반으로 `ServletWebRequest` 를 생성한다.
2. 핸들러 메서드의 입력 파라미터를 처리하기 위해 `DataBinder` 와 Model Factory 를 설정한다.
3. `ServletInvocableHandlerMethod` 객체를 생성한다. 해당 객체는 실제로 주어진 핸들러 메서드를 호출하는 역할을 한다. `ArgumentResolver`, `ReturnValueHandler`, `DataBinderFactory` 등을 갖는다.
4. 뷰와 모델 정보를 포함하고, 응답을 구성하는 `ModelAndViewContainer` 를 초기화한다. 
5. 요청이 비동기로 처리되는 경우, 비동기 웹 요청과 `WebAsyncManager` 설정을 한다. 
	1. 비동기 요청의 타임 아웃, task executor, callable interceptors 나 deferred result interceptor 등이 설정된다.
6. 현재 요청이 비동기 요청의 일부로 시작되었고, 결과가 사용가능한 경우에 핸들링한다.
7. `invocableMethod.invokeAndHandle()` 을 통해 실제 핸들러 메서드가 호출된다.  
8. 요청 처리 후의 뷰 정보를 `ModelAndView` 로 반환한다.

## 참고
- https://velog.io/@jihoson94/Spring-MVC-HandlerAdapter-%EB%B6%84%EC%84%9D%ED%95%98%EA%B8%B0