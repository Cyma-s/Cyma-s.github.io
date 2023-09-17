---
title: 어댑터 패턴
date: 2023-09-17 15:41:22 +0900
updated: 2023-09-17 16:33:02 +0900
tags:
  - design-pattern
  - 디자인패턴
---

## 개요

레벨4의 mvc 미션에서 `AnnotationHandlerMapping` 과 `ManualHandlerMapping` 이 동시에 호환되게 만들어야 한다.  
두 가지 `HandlerMapping` 이 하는 일은 동일하다. 그러나 내부 구현이 다르기 때문에 단순히 구현을 하려면 다음과 같이 만들 수 밖에 없다.  

```java
private void process(final HttpServletRequest request, final HttpServletResponse response)  
    throws ServletException {  
    try {  
        processAnnotationHandlerMapping(request, response);  
    } catch (NoSuchElementException e) {  
        processManualHandlerMapping(request, response);  
    } catch (Throwable e) {  
        log.error("Exception : {}", e.getMessage(), e);  
        throw new ServletException(e.getMessage());  
    }  
}  
  
private void processAnnotationHandlerMapping(final HttpServletRequest request, final HttpServletResponse response)  
    throws Exception {  
    final var controller = (HandlerExecution) annotationHandlerMapping.getHandler(request);  
    final var modelAndView = controller.handle(request, response);  
    move(modelAndView, request, response);  
}  
  
private void processManualHandlerMapping(final HttpServletRequest request, final HttpServletResponse response)  
    throws ServletException {  
    try {  
        final String requestURI = request.getRequestURI();  
        final var controller = manualHandlerMapping.getHandler(requestURI);  
        final var viewName = controller.execute(request, response);  
        move(viewName, request, response);  
    } catch (Throwable e) {  
        throw new ServletException(e.getMessage());  
    }  
}
```

사실상 controller 를 찾고, 실행하고, view 를 찾아서 넘기는 것까지 동일한 행동인데, 내부 구현이 다르다는 이유만으로 코드가 이만큼이나 길어졌다. 

이런 문제를 해결할 수 있는 방법은 없을까? 바로 어댑터 패턴을 이용하면 가능하다.  

## 어떻게 해결할 수 있을까?

위에 있는 코드들을 살펴보면, 각각 다음과 같은 부분들이 다르다. 

1. `getHandler` 의 매개변수
	1. requestURI, request 두 가지로 나뉘어 있다.
2. `controller` 를 실행하는 메서드
	1. `execute` , `handle` 두 가지로 나뉘어 있다.

그 외에는 모두 동일한 로직을 수행한다. 

그러니 해당 메서드들을 '동일하게' 호출해줄 수 있는 어댑터 클래스를 만들 수 있다. 

## 어댑터 패턴이란?

특정 클래스 인터페이스를 클라이언트에서 요구하는 다른 인터페이스로 변환한다. 인터페이스가 호환되지 않아 같이 쓸 수 없었던 클래스를 사용할 수 있게 도와준다.  

클라이언트와 구현된 인터페이스를 분리할 수 있으며, 변경 내역이 어댑터로 캡슐화 되기 때문에 나중에 인터페이스가 변경되더라도 클라이언트를 변경할 필요가 없다.  

## 어댑터 동작 과정

1. 클라이언트에서 타깃 인터페이스로 메서드를 호출하고, 어댑터에 요청을 보낸다.
2. 어댑터는 어댑'티' 인터페이스로 그 요청을 어댑티에 관한 하나 이상의 메서드 호출로 변환한다.
3. 클라이언트는 호출 결과는 받을 수 있으나, 중간에 어댑터가 있다는 사실을 알지 못한다.  

## 변경된 코드

그렇다면 코드는 어떻게 변경할 수 있을까?

먼저 `HandlerAdapter` 인터페이스를 생성하자. 해당 `HandlerAdapter` 가 요청을 처리할 수 있는지 확인할 수 있는 `support` 추상 메서드와, 실제로 요청을 처리하기 위한 `handle` 추상 메서드를 생성한다.  

```java
package webmvc.org.springframework.web.servlet.mvc.tobe;  
  
import jakarta.servlet.http.HttpServletRequest;  
import jakarta.servlet.http.HttpServletResponse;  
import webmvc.org.springframework.web.servlet.ModelAndView;  
  
public interface HandlerAdapter {  
  
    boolean supports(Object handler);  
  
    ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;  
}
```

## 스프링의 `HandlerAdapter` 

스프링에서도 마찬가지로 어댑터 패턴을 사용하고 있다. `HandlerAdapter` 에 대해 더 자세학 ㅔ알아보려면 [[handler-adapter]] 를 참고하자.

## 참고

- 헤드퍼스트 디자인 패턴