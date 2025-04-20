---
title   : DAO vs Repository
date    : 2023-04-15 23:10:27 +0900
updated : 2023-04-15 23:10:40 +0900
tags     : 
- 개발
- spring
---

## DAO

Data Access Object의 약자이다. 

DAO는 data persistence (애플리케이션과 데이터베이스 사이를 추상화한 계층을 제공하는 것) 를 추상화한 것이다.
DAO는 data mapping과 접근을 관리하고, 애플리케이션으로부터 쿼리의 복잡함을 숨겨준다.
주로 table 중심적이고, 데이터베이스에 더 가까우며 low level 개념으로 간주된다.
많은 경우, database 테이블과 일치하게 된다.

## Repository

객체들의 집합을 추상화한 것이다. 
domain 객체에 더 가까운 개념으로 Aggregate Roots만 다루는 상위 개념이다.

도메인 객체에 접근하기 위한 collection 과 유사한 interface를 사용하여 domain 객체와 
data mapping layer 사이를 중재한다. 
즉, Repository는 객체의 Collection을 다루듯이 캡슐화(인터페이스)를 제공한다는 점에서 테이블보다는 객체 중심의 layer라고 할 수 있다.

객체 중심으로 데이터를 다루기 위해 하나 이상의 DAO를 사용할 수 있어 DAO보다 상위 layer라고 할 수 있다.

## DAO vs Repository

프로젝트 요구 사항에 따라 구현은 주관적일 수 있다.

DAO는 간단한 CRUD 작업에 더 적합하며 구현하기 쉽다.
Repository는 여러 테이블을 포함하는 복잡한 작업에 더 적합하며 더 높은 수준의 추상화를 제공한다.

## 참고 자료

- https://www.baeldung.com/java-dao-vs-repository