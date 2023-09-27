---
title   : Interceptor
date    : 2023-06-06 11:16:20 +0900
updated : 2023-06-06 11:16:28 +0900
tags     : 
---

## Interceptor란?

Controller의 Handler를 호출하기 전과 후에 요청과 응답을 참조하거나 가공할 수 있는 일종의 필터

컨트롤러에 들어오는 요청 `HttpRequest` 와 응답하는 `HttpResponse` 를 가로채는 역할을 한다.
`DispatcherServlet` 은 핸들러 매핑을 통해 적절한 컨트롤러를 찾도록 요청하고, `HandlerExecutionChain` 을 돌려준다.

## 왜 써야 할까?

기존 컨트롤러의 로직을 수정하지 않고 사전, 사후에 제어가 가능하다.

Ex. 세션 인증
요청을 받아들이기 전에 세션에 로그인한 사용자가 있는지 확인해보고, 없다면 로그인 페이지로 리다이렉트할 수 있다. 인터셉터가 없다면 모든 컨트롤러마다 해당 로직이 필요하다.

## Interceptor 메서드

```java
public interface HandlerInterceptor { 
	default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception { 
		return true; 
	} 
	
	default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception 
	{ } 
	
	default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception { } 
}
```

- `preHandle` : 컨트롤러가 호출되기 전에 실행된다. 컨트롤러 이전에 처리해야 하는 전처리 작업이나 요청 정보를 가공하거나 추가할 때 사용한다. 반환값이 true이면 다음 단계로 진행되고, false 라면 작업을 중단하여 이후의 인터셉터나 컨트롤러로 진행되지 않는다.
- `postHandle` : 컨트롤러 호출 후에 실행된다. 컨트롤러 작업 이후에 처리해야 하는 후처리 작업이 있을 때 사용한다. 컨트롤러 하위 계층에서 작업을 진행하다가 중간에 예외 발생 시 호출되지 않는다.
- `afterCompletion` : 모든 뷰에서 최종 결과를 생성하는 일을 포함해 모든 작업이 완료된 후에 실행된다. 요청 처리 중에 사용한 리소스를 반환할 때 사용하기 좋다. 컨트롤러 하위 계층에서 작업을 진행하다가 예외가 발생하더라도 반드시 호출된다.

## Filter와의 비교

더 자세한 내용은 [[filter]] 확인

### 공통점

특정 URI에 접근할 때 제어하는 용도로 사용된다.

### 차이점

**영역의 차이**
Filter는 동일한 웹 애플리케이션의 영역 내에서 필요한 자원들을 활용한다. 웹 애플리케이션 내에서 동작하므로 스프링에 Context를 접근하기 어렵다고 하나, 요즘에는 필터에서도 스프링 설정 정보에 접근할 수 있다.

Interceptor는 스프링에서 관리되어 스프링의 모든 객체에 접근이 가능하다.

**스프링의 예외 처리 차이**
Filter에서 예외가 던져지면 에러가 처리되지 않고 서블릿까지 전달된다. 
Filter는 주로 `doFilter()` 주변을 try-catch 로 감싸서 그 시점에서 발생한 예외를 바로 핸들링한다.

Interceptor는 `@ControllerAdvice` 와 `@ExceptionHandler` 를 사용하여 예외 처리가 가능하다.

**호출 시점의 차이**
Filter는 `DispatcherServlet` 이 실행되기 전, Interceptor는 `DispatcherServlet` 이 실행되며 호출된다.

**Request/Response 객체 조작 가능 여부**
Filter가 다음 필터를 호출하기 위해서는 필터 체이닝을 해주어야 하는데, 이때 Request/Response 객체를 넘겨주므로 원하는 Request, Response 객체를 넘겨줄 수 있다.

Interceptor는 boolean만 반환할 수 있으므로 다음 Interceptor로 Request/Response 객체를 넘겨줄 수 없다.

## ArgumentResolver와의 비교

### ArgumentResolver란?

어떤 요청이 컨트롤러에 들어왔을 때, 요청에 들어온 값으로부터 원하는 객체를 생성하는 일을 `ArgumentResolver` 가 간접적으로 수행해줄 수 있다.

Ex. 사용자가 로그인되어 있을 때, 올바른 사용자인지 검증하는 경우
유효한 인증 정보를 갖고 있는지 확인하고, Member로 만들어주는 작업이 필요한 경우를 생각해보자.
검증 코드가 Controller 에 존재할 때는 모든 메서드에 같은 코드가 중복되고, Controller의 책임이 증가한다.

### ArgumentResolver 사용

`HandlerMethodArgumentResolver` 를 구현하여 사용할 수 있다.

다음과 같은 메서드를 구현해야 한다.

```java
boolean supportsParameter(MethodParameter parameter);

@Nullable
Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer, NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;
```

- `supportsParameter` : 핸들러의 특정 파라미터를 지원하는지 여부를 판단하기 위한 메서드. 어떤 파라미터에 대해 작업을 수행할 것인지를 정의하는 곳
- `resolveArgument` : 해당 파라미터에 대한 실질적인 로직을 처리하는 곳. parameter에 전달할 객체에 대한 조작을 진행한 후, 해당 객체를 리턴한다.

구현한 `HandlerMethodArgumentResolver` 는 `WebMvcConfigurer` 를 구현한 `@Configuration` 클래스에 `addArgumentResolvers` 를 통해 등록해주어야 한다.

### Interceptor와 차이점

ArgumentResolver는 Interceptor 이후에 동작하고, 어떤 요청이 컨트롤러에 들어왔을 때, 요청에 들어온 값으로부터 원하는 객체를 반환한다.

그러나 인터셉터는 실제 컨트롤러가 실행되기 전에 요청을 가로채고, 특정 객체를 반환할 수 없다.

## 용도
클라이언트 요청과 관련된 전역적으로 처리해야 하는 작업을 처리할 수 있다.
`HttpServletResponse`, `HttpServletRequest` 객체 자체를 바꿔치기 할 수는 없지만, 내부 값은 조작 가능하다.

다음과 같은 경우에 사용하는 것을 권장한다.

- 인증/인가와 같은 공통 작업 : 클라이언트 요청과 관련된 작업들을 컨트롤러로 넘어가기 전에 검사할 수 있다.
- Controller로 넘겨주는 정보 가공: 전달받는 Request, Response 객체를 가공하여 컨트롤러에 전달할 수 있다. 
- API 호출에 대한 로깅: 클라이언트의 정보를 기록한다.