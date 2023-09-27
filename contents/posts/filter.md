---
title   : Filter
date    : 2023-06-06 11:15:55 +0900
updated : 2023-06-06 11:16:11 +0900
tags     : 
---

## Filter란?

`DispatcherServlet` 처리 전 후에 동작하여 사용자의 요청이나 응답의 최전방에 존재한다. Java Servlet에서 제공된다.
요청이 전달되기 전/후에 url 패턴에 맞는 모든 요청에 부가 작업을 처리할 수 있는 기능을 제공한다.

스프링 빈으로 등록될 수 있다.

## Filter의 메서드

Filter 인터페이스를 구현해야 필터를 추가할 수 있다.

```java
 public interface Filter {  
  
    public default void init(FilterConfig filterConfig) throws ServletException {}  
  
    public void doFilter(ServletRequest request, ServletResponse response,  
            FilterChain chain) throws IOException, ServletException;  
  
    public default void destroy() {}  
}
```

`init()` : 필터가 웹 컨테이너에 생성될 때 실행된다.
`doFilter()` : Request, Response가 필터를 거칠 때 수행되는 메서드로, 체인을 따라 다음에 존재하는 필터로 이동한다. url 패턴에 맞는 모든 HTTP 요청이 `DispatcherServlet` 으로 전달되기 전에 웹 컨테이너에 의해 실행된다.
`destroy()` : 필터가 소멸될 때 실행된다.

## 용도
요청 파라미터 자체의 검증 및 처리를 담당한다.

- 보안 관련 공통 작업: 필터는 웹 컨테이너에서 동작하므로 보안 검사를 통해 올바른 요청이 아닌 경우 차단할 수 있다. 스프링 컨테이너까지 요청이 전달되지 않고 차단되므로 안정성을 높일 수 있다.
- 모든 요청에 대한 로깅
- 이미지 / 데이터 압축 및 문자열 인코딩: 웹 애플리케이션에서 전반적으로 사용되는 기능을 구현한다.

## 참고
- https://mangkyu.tistory.com/173
- https://steady-coding.tistory.com/601