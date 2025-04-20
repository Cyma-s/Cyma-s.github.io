---
title   : DispatcherServlet
date    : 2023-04-28 11:46:10 +0900
updated : 2023-04-28 11:46:35 +0900
tags     : 
- spring
- 스터디
- 개발
---

**베포후헤말 스터디 면접 공부를 위한 글입니다.**

## Dispatcher Servlet 이란?

프론트 컨트롤러 디자인 패턴에서 하나의 Controller가 들어오는 HttpRequest를 애플리케이션의 다른 모든 Controller와 Handler에 전달하는 역할을 담당한다. 

즉, Spring의 DispatcherServlet 가 Front Controller 역할을 맡고 있다.

## Dispatcher Servlet은 무엇을 하는가?

들어오는 URI를 받아 해당 위치에서 찾아서 하는 페이지나 리소스를 형성하기 위해 결합되는 handler와 view의 올바른 조합을 찾는 역할을 한다.

들어오는 HttpRequest를 처리하고, Request를 위임하고, handler, controller endpoint 와 reponse 객체를 지정하는 어노테이션과 함께 Spring 애플리케이션 내에 구현된 `HandlerAdapter` 인터페이스에 따라 해당 요청을 처리한다.

## 순서

DispatcherServlet은 `getHandler()` 를 사용하여 Dispatcher에 대해 구성한 HandlerAdapter 인터페이스의 모든 구현을 찾는다. 

DispatcherServlet은 대상 컨트롤러를 결정하기 위해 다음 mapper 중 하나를 참조하여 대상 컨트롤러를 결정한다.

`BeanNameUrlHandlerMapping`, 
`ControllerBeanNameHandlerMapping`, 
`ControllerClassNameHandlerMapping`, 
`DefaultAnotationHandlerMapping`, 
`SimpleUrlHandlerMapping`

configuration을 수행하지 않으면 DispatcherServlet은 기본적으로 `BeanNameUrlHandlerMapping`, `DefaultAnnotationHandlerMapping` 을 사용한다. 대상 컨트롤러가 식별되면 DispatcherServlet이 해당 컨트롤러로 요청을 보낸다. 컨트롤러는 요청에 따라서 몇 가지 작업을 수행한 후, Model과 View의 이름과 함께 DispatcherServlet으로 다시 반환한다.

1. Request를 DispatcherServlet이 받는다.
2. Request에 맞는 적절한 Controller를 찾는다.
3. Request를 Controller로 건네줄 HandlerAdapter를 찾아서 전달한다.
4. HandlerAdapter가 Controller로 Request를 전달한다.
5. 비즈니스 로직을 처리한다.
6. 처리된 반환값을 HandlerAdapter한테 전달한다.
7. HandlerAdapter는 반환값을 DispatcherServlet에게 전달한다.
8. Response를 응답한다.

## DispatcherServlet 의 동작

### DispatchServlet

`getHandler()` : Request에 맞는 HandlerMapping을 선택하여 HandlerExecutionChain을 가져온다.
`getHandlerAdapter()` : HandlerExecutionChain에 맞는 HandlerAdapter를 가져온다. 
`handle()` : HandlerAdapter를 실행한다. (컨트롤러 메서드 실행)

### HandlerMapping

`getHandlerAdapter()` : `HandlerExecutionChain` 에는 요청에 맞는 핸들러가 저장되어 있다. `HandlerAdapter` 를 가져오기 위해 `HandlerExecutionChain` 에 있는 핸들러로 판단한다. 

## 참고 자료
- [헤나의 Dispatcher Servlet 둘러보기 블로그 글](https://programming-hyena.tistory.com/38)
- https://www.baeldung.com/spring-dispatcherservlet
