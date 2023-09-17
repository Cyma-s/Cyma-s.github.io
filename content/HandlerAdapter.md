---
title: HandlerAdapter
date: 2023-09-17 15:07:08 +0900
updated: 2023-09-17 15:13:56 +0900
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

### `supports()`

> Given a handler instance, return whether this HandlerAdapter can support it. Typical HandlerAdapters will base the decision on the handler type. HandlerAdapters will usually only support one handler type each.

`HandlerAdapter` 가 지원할 수 있는지 여부를 반환한다. 일반적으로 `HandlerAdapter` 들은 오직 하나의 핸들러 타입만 지원한다.  

### `handle()`

> Use the given handler to handle this request. The workflow that is required may vary widely.

실제로 요청을 처리하는 메서드이다.  

## `DispatcherServlet` 의 

