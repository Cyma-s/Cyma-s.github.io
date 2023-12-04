---
title: 11/30 영어 문장 구조 연습
date: 2023-11-30 18:31:18 +0900
updated: 2023-12-04 17:18:32 +0900
tags:
  - english
---

## 면접 준비

- 잘 모르는 부분인데, 설명을 부탁드려도 될까요?
	- I'm not familiar with this, could you explain it to me?
- 내 생각에는 이 부분을 바꾸면 동작할 것 같습니다.
	- I think changing this part should make it work. 
- 시간 복잡도는 O log N 입니다.
	- The time complexity is O log N
- 내 풀이에 잘못된 부분이 있을까요?
	- Is there anything wrong with my solution?
- 만약 내가 이분 탐색을 사용한다면 시간 복잡도를 줄일 수 있습니다.
	- If I use binary search, I can reduce the time complexity.
- 만약 값이 커진다면 문제가 발생할 수도 있습니다.
	- If the size of the array increseas, it could lead to problems.
- Java 의 ArrayList 의 삽입은 O(1) 의 시간 복잡도를 갖습니다.
	- The insertion in Java’s ArrayList has a time complexity of O of one.
- 간단한 자기소개를 해주세요.
	- 저는 지난 주에 우아한형제들에서 진행하는 Tech Academy 인 우아한테크코스를 수료했습니다. 현재 백엔드 개발과 Java 에 관심을 가지고 있습니다.
	- Last week, I completed the woowa tech course, a tech academy program conducted by woowa bros. Currently, I’m interested in backend development and Java.

## 기술

- 백엔드에 관심을 갖게 되신 이유는 무엇인가요?
	- 저는 화면에 보이는 것보다는 뒤에서 데이터를 가공하고 조작하는 것이 더 흥미로웠습니다. 그러다보니 자연스럽게 백엔드에 관심을 갖게 되었습니다.
	- I found myself more interested in processing and manipulating data behind the scenes than what appears on the screen. As a result, I naturally became interested in backend development.
- Java 를 사용하신 이유는 무엇인가요?
	- Java 는 다양한 환경에서 호환된다는 것이 장점이고, 객체지향 프로그래밍을 채택하여 코드 재사용성, 유지보수성, 확장성에서 이점이 있습니다. 또한 방대한 레퍼런스로 디버깅이 용이합니다. 그래서 자바를 사용하게 되었습니다. 
	- A key advantage of Java is its compatibility across various environments, and its adoption of object-oriented programming provides benefits in terms of code reusability, maintainability, and scalability. Additionally, its extensive references make debugging more easy. That’s why we chose to use Java.
- Spring 을 사용하신 이유는 무엇인가요?
	- Spring 은 IoC나 DI 같은 개발자가 기능을 편하게 개발할 수 있는 기능들을 제공해줍니다. 그리고 무엇보다 팀원들이 스프링에 가장 익숙하다는 점이 선택하게 된 가장 큰 이유입니다.
	- Spring provides us the funcionalities that the developers can develop functions like IoC or DI. And most of all, my teammates are more familiar with Spring framework than other things. That’s the biggest reason why I chose Spring Framework.
- DBMS 란 무엇인가요?
	- 데이터베이스를 운영하고 관리하는 소프트웨어이다. 
- 트랜잭션이란 무엇인가요?
	- 하나의 논리적인 작업 단위를 의미한다. 트랜잭션을 통해 데이터의 정확성과 신뢰성을 보장할 수 있다.
	- It represents a single logical unit of work. Through transactions, the accuracy and reliability of data can be ensured. 
- ACID 속성에 대해 이야기 해보세요.
	- 먼저 트랜잭션은 원자적이어야 한다. 트랜잭션은 전부 완료되거나 전혀 실행되지 않는 둘 중의 하나의 상태만을 가진다. 두 번째로 일관적이어야 한다. 트랜잭션이 실행되기 전과 후의 데이터베이스의 일관성이 유지되어야 한다. 세 번째로 독립적이어야 한다. 동시에 실행되는 여러 트랜잭션이 서로에게 영향을 주면 안 된다. 마지막으로 지속적이어야 한다. 트랜잭션이 성공적으로 완료되면, 그 결과는 영구적으로 데이터베이스에 반영되어야 한다. 
	- Firstly, a transaction must be atomic. It should either be fully completed or not executed at all. Secondly, it should be consistent. The consistency of the database should be maintained before and after the transacion. Thirdly, it should be isolated. Multiple transactions running concurrently should not affect each other. Lastly, it needs to be durable. If a transaction successfully completed, the result must be permanently reflected in the database. 
- OOP 의 장점은 무엇인가요?
	- 어떤 지점의 변화가 다른 지점에 영향을 끼치는 것을 줄일 수 있다. 
	- It can reduce the impact of changes at one point affecting other points. 
- OOP 의 단점은 무엇인가요?

## 프로젝트

### 답변

- 어떤 서비스를 개발하셨나요?
	- 저는 노래의 좋은 부분을 사람들과 공유하고, 그 과정에서 노래를 빠르게 찾을 수 있는 서비스를 개발했습니다.
	- I have developed a service that allows people to share the best parts of songs and quickly find the good song in the process.
- 서비스의 구조를 설명해보세요.
	- 먼저 서비스는 2개의 인스턴스로 구성되어 있습니다. 2개는  production 서버 하나와 데이터베이스 서버 하나입니다. production 서버는 nginx 와 스프링 서버, self hosted runner 로 구성되어 있습니다. 데이터베이스는 MySQL 을 사용했습니다.
	- First, our service consists of two instances. First is the production server, second is a database server. The production server consists of nginx, spring application, github self hosted runner. And we used MySQL as DBMS.
- 서비스에서 발생한 문제는 무엇이었고, 어떻게 해결했나요?
	- 데이터베이스에서 정렬이 필요한 쿼리가 있었는데, 이 쿼리의 실행 시간이 너무 오래걸리는 문제가 있었다. 해당 쿼리에서 자주 사용하는 데이터를 로컬에 캐싱하여 실행 시간을 줄일 수 있었다.
	- There was a query that required sorting whole datas in database. In that case, the problem was that the query took too long to execute. We were able to. reduce the execution time by caching the frequently used data from that query locally. 
- 그 쿼리의 속도는 얼마 정도였나요?
	- 1만 개의 항목 중 21개 항목을 가져오려고 시도하는 데 약 310밀리초가 걸렸습니다. 캐싱을 적용하고 나서 31ms 로 개선되었습니다. / 캐싱을 적용하고 나서 10배의 성능 개선을 할 수 있었습니다.
	- When attempting to retrieve twenty-one items out of ten thousand, it took approximately three-hundred ten milliseconds. After applying the caching, it improved to thirty-one milliseconds. / After applying the caching, we can achieve  a tenfold improvement in performance.
- 어떻게 캐싱을 적용했나요?
	- 단순하게 서버에 id 와 데이터로 이루어진 Map 을 생성해서 데이터를 저장하는 방식을 선택했다.
	-  I selected straightforward method involving the establishment of Map on the server. It consists of identifiers and corresponding data.
- 동시성 문제가 있을 것 같은데 어떻게 해결했나?
	- 그 부분은 아직 해결 중이다. synchronized 키워드를 사용하거나 ReentrantLock 을 사용하여 동시성을 해결해볼 예정이다. 
	- We are still solving the problem. We plan to address the concurrency issue by using the syncrhonized keyword or by employing ReentrantLock.
- 정확한 원리는 모르지만 아는 대로 설명하겠습니다.
	- I don’t know the exact principle, but I will explain as much as I know.
- 물어보고 싶은 게 있습니다. I have something I would like to ask.

## etc

- I want to work for a company with passionate coworkers and with whom I can actively communicate.
- I’m looking forward to this interview.

## 질문

- 딜리버리 히어로에서 어떤 일을 하시나요?
	- What do you do at Delivery Hero?
- 어떤 문제들을 주로 해결하시나요?
	- What kinds of problems do you mainly solve?
- 인터뷰 결과는 언제 안내 되나요?
	- When will the results of the interview be announced?