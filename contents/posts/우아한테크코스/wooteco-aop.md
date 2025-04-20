---
title: AOP 강의
date: 2023-10-06 10:55:59 +0900
updated: 2023-10-06 11:22:34 +0900
tags:
  - 우테코
  - spring
  - 레벨4
---

## JDK Proxy 사용 시 문제점

## ProxyFactoryBean 도입하기

- Proxy로 생성한 객체를 스프링 빈에 등록할 수 있다.
- 매번 인터페이스를 만들지 않아도 되고, 메서드 외에 클래스도 지정할 수 있다.
- 프록시 생성 방법을 정할 수 있다. -> jdk proxy 또는 CGLib
- BeanPostProcessor 인터페이스를 활용하면 자동 생성 가능하다.

## AOP 핵심 개념

| 용어      | 개념                               | 인터페이스  |
| --------- | ---------------------------------- | ----------- |
| Aspect    | Point + Advice                     | Advisor    |
| Pointcut  | Advice 를 적용할 JoinPoint 를 선별 | Pointcut    |
| Advice    | 특정 JoinPoint 에 실행되는 코드    | Interceptor |
| JoinPoint | Advice 를 적용할 위치              | Invocation  |
| Target    | 부가기능 (advice) 를 적용할 대상   |             |

## AOP 란?

- 부가 기능을 모듈화 하는 것
	- OOP 개념으로 코드 중복을 제거할 수 없을 때 사용
		- 트랜잭션처럼 메서드 전후로 실행되어야 하는 코드
	- 미들웨어, 인프라와 관련된 코드를 모듈화
		- 트랜잭션, 보안, 로깅, 캐시 등
- OOP 와 대척되는 개념이 아니다.
	- AOP 는 OOP 를 보완하는 개념이다.
	- AOP 만으로 애플리케이션을 개발할 수 없다.
- 스프링은 프록시 기술로 AOP 개념을 구현했다.
- Servlet Filter 도 AOP 개념이 적용되어 있다.
- Servlet Filter 는 부가기능 적용이 HTTP 요청, 응답으로 제한된다.
- 스프링 AOP 는 클래스, 메서드 등등 원하는 위치에 Advice 설정 가능

## AOP 의 종류

- 위빙 (Weaving) 이란 코드의 적절한 위치에 aspect 를 추가하는 과정
- 실습 미션처럼 자바 코드가 실행되는 런타임에 aspect 를 추가한다면?
	- 동적 AOP
	- 스프링 AOP
		- JDK Dynamic Proxy (Interface based)
		- CGLiB Proxy (subclass based)
- 컴파일 시점 바이트코드에 aspect 를 추가한다면?
	- 정적 AOP
	- AspectJ
