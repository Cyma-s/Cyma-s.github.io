---
title: DH 인터뷰 준비
date: 2023-12-09 21:30:43 +0900
updated: 2023-12-10 21:57:02 +0900
tags:
  - dh
---

## Project

- Spring Framework 를 사용한 이유
- SQL 과 NoSQL 의 차이점
- MySQL 을 사용한 이유
- 가장 challenging 했던 문제는 무엇인가?
	- 기술적으로 challenging 했던 문제
		- 최근에 만든 서비스에 전체 노래를 좋아요, id 순으로 정렬해야 하는 쿼리가 있었다. 데이터베이스에서 정렬하고 데이터를 가져올 때 
	- 전체적으로 challenging 했던 문제
		- 유저의 페인 포인트를 파악한 뒤에 우리 서비스에서 어떻게 적용해야 하는지 고민하는 것이 전체 개발 과정에서 가장 어려웠다. 최근에 사람들이 노래의 좋은 파트들부터 듣고 좋은 노래인지 판단할 수 있게 하는 서비스를 만들었다. 이때 사람들이 우리 서비스에 원하는 것이 무엇일지, 서비스를 통해 어떤 것을 제공해줄 수 있을지 많은 고민을 했다. 이를 위해 많은 기획 회의를 거쳤고, 처음 서비스의 컨셉을 잡기까지 2달이라는 시간이 소요되었다. 페르소나와 사용자 스토리를 만들며 유저 입장에서 좋은 서비스를 만들기 위해 노력했다. 
		- One of the most challenging aspects of my recent development process was translating user pain points into actionable features within our service. I developed a service that enables users to determine the preference of a song by previewing its bests parts. To ensure this service truly resonated with user needs, we invested significant effort in understanding what users sought from our service and what we could feasibly deliver. This involved extensive planning and numerous meetings over two months to finalize our initial service concept. By creating detailed personas and user stories, our focus was to design the service from a user-centric perspective, ensuring it was both engaging and valuable to our target audience.
- 인덱스란 무엇인가?
	- 인덱스를 사용하는 이유
	- 인덱스를 사용했을 때의 장단점
- 인덱스 실행 계획이란?
- 트랜잭션이란 무엇인가?
- RDBMS 란 무엇인가?
	- A Relational Database Management System, is a type of DBMS that stores data in a structured format, using rows and tables. This structure enables a clear definition of data types and relationships among different data entities 
- VCS 란? 장점은?
- 클라우드 컴퓨팅이란?
- CI/CD 란 무엇인가?
	- 프로젝트에서 CI/CD 를 적용한 경험이 있는가?
	- GitHub Flow 란?
- 서비스 구조는 어떻게 구성되어 있는가?
	- 
- RESTful 한 API 란 무엇인가? 
- REST란 무엇인가?
- DBMS 란?
	- A Database Management System is software that provides an efficient, secure, and convenient way to store, retrieve and manage data in databases. It serves as an interface between the database and its users or the application programs, ensuring that the data is consistently organized and remain easily accessible. 


## Software Engineering

- OOP 란 무엇인가?
- Clean Code 란 무엇이라고 생각하는가?
- SOLID 란 무엇인가?
	- SOLID is a set of five design principles in object-oriented programming that guide developers in creating more maintainable, understandable, and scalable code. First, Single Responsibility Principle states that a class should have on and only one reason to change, meaning it should have a single responsibility. Second, Open-Closed Principle suggests that software entities like classes modules, and functions should be open for extension but closed for modification.Third, Liskov substitution implies that objects of a superclass should be replaceable with objects of its subclasses without altering the correctness of the program. It ensures that a subclass can stand in for its parent class. Fourth, Interface Segregation Principle means it’s better to have many specific interfaces than a single, general-purpose interface. Fifth, Dependency Inversion Principle advocates for high-level modules not to depend on low-level modules, but both should depend on abstractions. It encourages decoupling in the code, which increases modularity and flexibility. 
	- extension 과 modification 의 차이점은 무엇인가?
		- 
	- Scalability 란 무엇인가?
		- Scalability in software engineering refers to a system’s ability to handle an increasing amount of work or to be readily expanded to accommodate that growth. There are two main types of scalability. Vertical scalability involves adding more resources to the existing infrastructure. Horizontal Scalability involves adding more machines or nodes to handle increased load. Scalability ensures that the application can continue to function efficiently as its user base grows, data volumes increase, or operational demands rise. 
- 테스트의 종류에는 무엇이 있는가?
	- In my project, we adopted three testing techniques, acceptance test, unit test, integration test. First, Acceptance test focused on ensuring that the software meets the end users’ needs and compiles with the business requirements. Thorough integration testing has helped us to identify and resolve any issues arising from the interaction of individual components. 
	- 어떤 테스트를 채택했고 이유는 무엇인가?
		- 
	- 테스트 커버리지는 어느 정도인가?
		- Our team has rigorously performed both acceptance testing and integration testing on the project, leading to an improssive test coverage of 96%. 
- 리팩토링이란 무엇인가?
	- 프로그램이 동일한 동작을 하지만, 내부의 코드의 가독성을 높이고 구조를 개선하는 것을 말한다. 리팩토링을 하게 되면 이후 유지보수를 할 때 큰 도움이 된다.
	- Refactoring is a disciplined technique for restructing an existing body of code, altering its internal structure without changing its external behavior. Its main purpose is to make the code more efficient, readable, and maintainable, while also improving its overall design. 
- 언제 리팩토링을 해야 하는가?
	- 코드를 이해하거나 유지 관리하기 어려워지는 경우 리팩토링이 필요하다고 생각합니다. 복잡한 로직에서 변수와 함수의 이름을 개선하고, 길이가 긴 메서드를 더 작고 관리하기 쉬운 메서드로 분할하는 과정으로 리팩토링할 수 있습니다. 또한 성능 병목 현상이 일어날 때 리팩토링이 필요하다고 생각합니다. 실제로 프로젝트에서 성능 병목 현상이 일어나서 성능 최적화를 위한 코드 리팩토링을 진행해보았습니다.
	- In my view, refactoring becomes essential when code is challenging to understand or maintain. For instance, tackling complex logic can be managed by enhancing the clarity of variable and function names, and by dividing lengthy methods into shorter, more manageable methods. This approach not only improves readability but also eases maintenance. Additionally refactoring is crucial in addressing performance issues. For example, in a recent project, we analyzed codes contributing to the performance bottleneck and proceeded optimization. As a result of these refinements, we successfully enhanced the performance by refactoring the codes. 
- 리팩토링에서 중요한 것은 무엇인가?
	- 리팩토링 과정에서도 코드의 동작이 그대로 작동해야 한다. 기존의 코드에서 유지보수가 쉬운 코드로 

## Team

- 코드 리뷰를 할 때 어떤 부분을 중점적으로 보는가?

## 그 외 답변

- 