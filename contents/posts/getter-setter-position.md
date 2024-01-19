---
title: getter 와 setter 의 위치
date: 2024-01-19 10:34:54 +0900
updated: 2024-01-19 11:11:13 +0900
tags:
  - java
---

## 개요

Java 의 getter 와 setter 의 위치는 Class 의 최하단에 정의하라는 리뷰를 받은 적이 있다.  
우테코 때는 리뷰어 말대로 맨 밑에 두고 쓰다가, 내가 코드 리뷰를 하게 되어서 이유를 찾아보게 되었다.  

## 근거가 있을까?

getter 와 setter 가 클래스의 하단에 있어야 하는 이유가 있을까?  
결론만 말하자면 정해진 컨벤션은 없다.  

[Oracle 컨벤션](https://www.oracle.com/java/technologies/javase/codeconventions-fileorganization.html)에 따르면 다음과 같이 명시하고 있다.  

> These methods should be grouped by functionality rather than by scope or accessibility. For example, a private class method can be in between two public instance methods. The goal is to make reading and understanding the code easier.

즉, 메서드들은 범위나 접근 제한으로 구분하는 것보다 기능 단위로 묶여야 한다는 것이다. getter 나 setter 가 클래스 하단에 내려가야 한다는 규칙 같은 건 공식 문서에는 정해져 있지 않다.  
사람들의 선호로 인해 관례적으로 쓰이고 있는 것 뿐이다. 

## 그렇다면 어떻게 해야 할까?

그렇다면 getter 와 setter 를 클래스 하단에 놓을 필요는 없지 않을까?  

물론 그렇다. 사람의 선호에 따라 getter, setter 의 위치는 달라질 수 있다.  
그러나 보통 getter 와 setter 는 클래스에서 그렇게 큰 의미를 가지고 있지 않은 경우가 많다.  
굳이 중요하지 않은 getter와 setter 들을 중요한 메서드들이 있는 클래스의 중앙 또는 상단으로 올리게 되면 클래스를 읽으며 이해하는 과정을 방해할 수도 있을 것이다. 

이런 이유에서 getter 와 setter 는 클래스의 하단에 두면 좋다는 결론을 내렸다.  