---
title: 레벨4 MVC 구현하기
date: 2023-09-12 11:17:33 +0900
updated: 2023-09-12 11:17:44 +0900
tags:
  - 레벨4
  - 우테코
  - spring
---

## Reflection

컴파일한 클래스를 동적으로 프로그래밍 가능하도록 자바에서 지원하는 기능.

### 리플렉션으로 가능한 작업?

- Junit 처럼 `@Test` 어노테이션을 표시한 메서드를 찾아서 실행 할 수 있다.
- 런타임 객체의 클래스, 필드, 메서드 정보를 알 수 있다. 
- IDE 가 자동으로 getter, setter 를 생성할 수 있다.
- 자바 객체와 데이터베이스 테이블을 매핑할 때 사용한다.

## 웹 애플리케이션의 발전 과정

### Servlet (1996)

- Web Application Server, WAS
	- Servlet Container - Tomcat
- WAS 를 효율적으로 다루기 위한 Java EE
	- Java Enterprise Edition, 기업 시스템 용 자바
	- 대규모 웹 애플리케이션 개발을 위한 표준
		- Servlet 을 사용하면 Thread 를 사용해서 좀 더 효율적으로 동작할 수 있게 된다.
- Tomcat
	- Servlet 표준을 구현한 Servlet Container
	- 멀티 스레드 지원 및 관리
	- Http 요청 자체 처리

#### 문제점

디자이너들이 서블릿 소스 코드라서 수정을 못한다.  
디자이너들이 작업하는 동안에는 그 부분을 처리 못하게 된다.  

### JSP (1999)

- JSP 0.92 spec 에서 JSP model1, JSP model 2 를 제안
	- JavaBeans: Reusable components
	- Java: Scripting language
	- Java Servlet: Compiled JavaServer Pages object

### MVC (2000) 

- JavaWorld 에 Govind Seshadri 가 model 2를 MVC 아키텍처 패턴으로 공식화 제안
- Apache Struts 프로젝트를 출시하며 model 2 패턴 구현 주장
- 이후 여러 프레임워크에서 MVC 패턴을 도입했다고 주장

### Framework (2003)

- 대규모 웹 애플리케이션의 복잡함
	- Spring 은 초기 J2EE 사양의 복잡성에 대한 대응책으로 2003년에 탄생했다.
- Spring Framework
	- Spring 은 기본적으로 POJO 를 사용하여 애플리케이션을 구축할 수 있도록 지원하는 기술
- POJO
	- 이상적으로 말하자면, POJO 는 Java 언어 사양에 의해 강제되는 것 이외의 다른 제한에 구속되지 않는 Java 객체이다.

### Non-blocking

- Reactive
	- Non-blocking I/O
	- Functional
- Node.js (2009)
- Spring WebFlux (2020)

## Servlet

- 서블릿은 웹 서버 내에서 실행되는 작은 Java 프로그램이다. 
- 자바 공식 표준 기술
	- javax.servlet -> jakarta.servlet

프레임워크를 사용하지 않아도 웹 서비스를 만들 수 있다!

### 서블릿을 알아야 할까? 스프링만으로 충분하지 않을까?

DispatcherServlet 도 Servlet 의 구현체이다.

스프링이 잘 감싸고 있지만, Servlet 의 이해가 있어야 문제가 생겼을 때 잘 해결할 수 있다.

### 서블릿 살펴보기

- 라이프 사이클 메서드
	- init(), service(), destroy()

#### 라이프 사이클이란?

객체 세상에서 객체의 생성부터 처리, 종료되는 전체 사이클을 뜻한다.

- servlet life-cycle method 
	- 서블릿을 초기화하고 요청을 처리하고 종료될 때 처리할 작업을 정의하는 메서드 
- 누가 라이프 사이클 메서드를 실행하는 걸까? 
	- 서블릿 컨테이너 tomcat, jetty 등등

## 서블릿과 서블릿 컨테이너

1. 사용자 요청이 컨테이너에게 전달된다.
2. 컨테이너는 response, request 를 생성한다.
3. 요청에서 찾은 servlet 에게 service 메서드로 요청과 응답을 전달한다. 서블릿의 스레드가 요청을 처리한다.
4. 요청 처리를 하고, response 를 만들어서 전달한다.
5. 컨테이너가 응답을 사용자에게 전달한다.

### 서블릿 하나로 다수 요청을 처리한다

- 주의 사항
	- 서블릿은 서블릿 컨테이너에서 한 개만 존재한다
	- 하나의 서블릿에 여러 스레드가 service() 메서드를 공유한다.
	- service() 메서드가 멤버 변수나 static 변수를 변경하면 안 된다.

