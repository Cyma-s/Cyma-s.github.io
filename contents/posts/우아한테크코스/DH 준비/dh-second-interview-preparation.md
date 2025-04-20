---
title: DH 인터뷰 준비
date: 2023-12-09 21:30:43 +0900
updated: 2023-12-14 17:39:42 +0900
tags:
  - dh
---

## Project

- Spring Framework 를 사용한 이유
- RDBMS 과 NoSQL 의 차이점
	- RDBMS and NoSQL databases differ primarily in their data structure, scalability, and query language. RDBMS uses a structured table format with rows and columns, making it ideal for complex queries and data integrity in relational data. On the other hand, NoSQL databases are designed for unstructured and semi-strucutured data with flexible schemas. They are highly scalable and suitable for handling large volumes of data and high user loads. 
- MySQL 을 사용한 이유
- 가장 challenging 했던 문제는 무엇인가?
	- 기술적으로 challenging 했던 문제
		- 최근에 만든 서비스에 전체 노래를 좋아요, id 순으로 정렬해야 하는 쿼리가 있었다. 데이터베이스에서 정렬하고 데이터를 가져올 때 오랜 시간이 걸리는 것이 문제였다. 이를 해결하기 위해 데이터를 로컬에 캐싱하여 성능을 10배 가량 개선할 수 있었다. 그 과정에서 다양한 어려움이 있었던 거 같다.
		- In a recent project, we faced a significant challenge with a database query that required sorting songs by likes and ID. The issue was the substantial time it took to sort and retrieve data from the database, impacting our application's performance. To address this, we implemented a strategy to cache the data locally. This solution dramatically improved our performance, with a tenfold increase in data retrieval speed. However, The implementation process did present various challenges, concurrency and data consistency. 
		- 동기화 문제는 어떻게 해결했나?
			- Given that our current setup involves only one server, using the synchronized keyword for data synchronization seemed like an effective strategy. However, in a scenario with multiple servers, a more scalable solution like a dedicated cache server would be preferable to synchronize data across different instances. 
	- 전체적으로 challenging 했던 문제
		- 유저의 페인 포인트를 파악한 뒤에 우리 서비스에서 어떻게 적용해야 하는지 고민하는 것이 전체 개발 과정에서 가장 어려웠다. 최근에 사람들이 노래의 좋은 파트들부터 듣고 좋은 노래인지 판단할 수 있게 하는 서비스를 만들었다. 이때 사람들이 우리 서비스에 원하는 것이 무엇일지, 서비스를 통해 어떤 것을 제공해줄 수 있을지 많은 고민을 했다. 이를 위해 많은 기획 회의를 거쳤고, 처음 서비스의 컨셉을 잡기까지 2달이라는 시간이 소요되었다. 페르소나와 사용자 스토리를 만들며 유저 입장에서 좋은 서비스를 만들기 위해 노력했다. 
		- One of the most challenging aspects of my recent development process was translating user pain points into actionable features within our service. I developed a service that enables users to determine the preference of a song by previewing its bests parts. To ensure this service truly resonated with user needs, we invested significant effort in understanding what users sought from our service and what we could feasibly deliver. This involved extensive planning and numerous meetings over two months to finalize our initial service concept. By creating detailed personas and user stories, our focus was to design the service from a user-centric perspective, ensuring it was both engaging and valuable to our target audience.
- 인덱스란 무엇인가?
	- an index is a pointer to data in a table. An index in a database is very similar to an index in the back of a book. 
	- 인덱스를 사용하는 이유
		- Indexes are used to quickly locate data without having to search every row in a database table every time a database table is accessed.
	- 인덱스를 사용했을 때의 장단점
		- Using indexes in databases primarily enhances query performances. They allow the database to find and retrieve specific rows much faster than without an index. But indexes can lead to increased storage usage, as they require additional space beyond the data itself. Also, while they speed up read operations, they can slow down write operations like insertions, updates, and deletions. 
	- 인덱스를 적용했던 적이 있는지?
		- Because we didn’t use Foreign Key, we were able to improve performance by using indexes when writing simple look up queries. 
	- 외래 키를 사용하지 않은 이유가 무엇인가?
		- In our project, the decision not to use foreign keys was driven by the need for performance optimization and scalability. Foreign keys are excellent for maintaining referential integrity, but they can add overhead to write operations such as insertions and updates. 
- 인덱스 실행 계획이란?
- 트랜잭션이란 무엇인가?
	- a transaction refers to a sequence of operations performed as a single logical unit of work. 
	- ACID 속성에 대해 설명해주세요.
		- First Atomicity ensures that all operations within a transaction are completed or aborted completely. Second, consistency is a property that guarantees a transaction will bring the database from on valid state to another. Third, Isolation is a property that all transactions runs independently of other transactions, maintaining data integrity when multiple transactions occur concurrently. At last, Durability is the results of transaction are permanently stored in the database system. 
- RDBMS 란 무엇인가?
	- A Relational Database Management System, is a type of DBMS that stores data in a structured format, using rows and tables. This structure enables a clear definition of data types and relationships among different data entities 
- VCS 란?
	- Version Control System is a tool that helps manage changes to source code over time. It keeps track of every modification to the code in a special kind of database. 
	- 장점
		- I think the most advantage of VCS is VCS allows you to keep a record of all changes made to the code, including who made the changes, why they were made, and references to issues or bugs. Because we use the VCS, we can remain all changes in code. That’s a great advantages of VCS. 
- 클라우드 컴퓨팅이란?
	- Cloud computing is a technology that allows us to access and use computing resources over the internet. Cloud computing enables us to use computer resources rather than having to build and maintain computing infrastructures in-house. 
	- 장점
		- Cloud computing can be scaled up or down based on demand. And it reduces the need for upfront capital investment in hardware and software. Organizations pay only for the resources they use, often leading to lower operational costs.
- CI/CD 란 무엇인가?
	- 프로젝트에서 CI/CD 를 적용한 경험이 있는가?
		- 최근 프로젝트에서는 GitHub Actions를 사용하여 CI(지속적 통합)를 구성하고 GitHub의 자체 호스팅 실행기를 통해 CD(지속적 배포)를 설정했습니다. 이 설정은 개발 파이프라인을 자동화하고 효율성을 향상하며 코드 품질을 보장하는 데 필수적이었습니다. 그러나 GitHub Flow를 사용하고 동일한 저장소에 프런트엔드 및 백엔드 코드가 모두 있기 때문에 문제에 직면했습니다. 우리의 워크플로는 여러 가지의 변경 사항을 동기화하기 위해 기본 분기에 자주 병합해야 했습니다. 이로 인해 불완전한 프런트 엔드 기능을 병합해야 하는 상황이 발생하여 배포 프로세스를 완전히 자동화하는 능력에 영향을 미치는 경우가 많았습니다. 결과적으로 지속적인 전달을 달성했지만 이 설정에서는 완전히 자동화된 지속적인 배포가 불가능했습니다.
		- In our recent project, we configured continuous integration using github actions and set up CD through github’s self-hosted runners. This setup was integral to automating our development pipeline, enhancing efficiency, and ensuring code quality. However, we encountered a challenge due to our use of GitHub Flow and having both front-end and back-end code in the same repository. Our workflow required frequent merges into the main branch to synchronize changes across different branches. This often led to situations where incomplete front-end features had to be merged, impacting our ability to fully automate the deployment process. As a result, while we achieved Continuous Delivery, fully automated Continuous Deployment wasn’t feasible under this setup.
	- GitHub Flow 란?
		- Github Flow is a streamlined workflow designed for projects that require frequent deployments. It begins with creating a feature branch off the main branch, where all development work occurs. Once a set of changes is ready, a pull request is opened for code review and discussion with the code. After review, the branch can be deployed to a staging or production environment for testing. 
		- In our project, we faced challenges with synchronizing deployment timing because we were developing both the front-end and back-end simultaneouly within a single repository. This complexity led us to consider Git Flow, which could potentially offer a more structured approach to managing parallel development streams and their integration. 
	- Git Flow 와 비교했을 때 장단점은?
- 서비스 구조는 어떻게 구성되어 있는가?
	- In our service, we’ve structured our infrastructure on AWS using two EC2 instances. First instance has nginx, spring application, github self hosted runner. And Second instance has our RDBMS. And our spring application is designed with a layered architecture. 
	- 계층형 아키텍쳐란 무엇인가?
		- layered architecture is a way of organizing code into distinct sections, each with a specific responsibility. Each layer in the architecture focuses on a specific aspect of the application. This separationi makes the application more manageable, as changes in one part of the code have minimal impact on others. There are four layers, presentation layer, business layer, data access layer, database layer. 
- RESTful 한 API 란 무엇인가? 
- REST란 무엇인가?
	- REST is an architectural style for designing networked applications. It relies on a stateless, client-server communication model, and is used primarily in the development of web services. In REST, everything is a resource identified by a unique URI. 
- DBMS 란?
	- A Database Management System is software that provides an efficient, secure, and convenient way to store, retrieve and manage data in databases. It serves as an interface between the database and its users or the application programs, ensuring that the data is consistently organized and remain easily accessible. 

## Software Engineering

- OOP 란 무엇인가?
	- Object Oriented Programming is a programming paradigm based on the concept of objects, which can contain data and code. Data in the form of fields and code in the form of procedures. OOP has some key concepts, encapsulation, abstraction, polymorphism. 
	- Encapsulation means bundling the data and methods that operate on the data with one object. It helps in hiding the internal state of the object from the outside world and only exposing a defined interface. Abstraction allows focusing on what an object does instead of how it does it. It helps in managing complexity by hiding the detailed implementation and showing only the necessary features of an object. Polymorphism enables a single interface to represent different underlying data types, methods or functions. 
- Clean Code 란 무엇이라고 생각하는가?
	- Clean Code refers to a concept in software engineering where the code written is well-organized, easily understandable, and maintainable. First, clean code should be easily readable and understandable. Second, Clean code should be efficient in terms of resource usage. 
- SOLID 란 무엇인가?
	- SOLID is a set of five design principles in object-oriented programming that guide developers in creating more maintainable, understandable, and scalable code. First, Single Responsibility Principle states that a class should have on and only one reason to change, meaning it should have a single responsibility. Second, Open-Closed Principle suggests that software entities like classes modules, and functions should be open for extension but closed for modification.Third, Liskov substitution implies that objects of a superclass should be replaceable with objects of its subclasses without altering the correctness of the program. It ensures that a subclass can stand in for its parent class. Fourth, Interface Segregation Principle means it’s better to have many specific interfaces than a single, general-purpose interface. Fifth, Dependency Inversion Principle advocates for high-level modules not to depend on low-level modules, but both should depend on abstractions. It encourages decoupling in the code, which increases modularity and flexibility. 
	- extension 과 modification 의 차이점은 무엇인가?
	- Scalability 란 무엇인가?
		- Scalability in software engineering refers to a system’s ability to handle an increasing amount of work or to be readily expanded to accommodate that growth. There are two main types of scalability. Vertical scalability involves adding more resources to the existing infrastructure. Horizontal Scalability involves adding more machines or nodes to handle increased load. Scalability ensures that the application can continue to function efficiently as its user base grows, data volumes increase, or operational demands rise. 
- 테스트의 종류에는 무엇이 있는가?
	- In my project, we adopted three testing techniques, acceptance test, unit test, integration test. First, Acceptance test focused on ensuring that the software meets the end users’ needs and compiles with the business requirements. Thorough integration testing has helped us to identify and resolve any issues arising from the interaction of individual components. And Unit Testing is a test focuses on individual units or components of the software to ensure that each part works as intended. 
	- 테스트 커버리지는 어느 정도인가?
		- Our team has rigorously performed both acceptance testing and integration testing on the project, leading to test coverage of 96%. 
- 리팩토링이란 무엇인가?
	- 프로그램이 동일한 동작을 하지만, 내부의 코드의 가독성을 높이고 구조를 개선하는 것을 말한다. 리팩토링을 하게 되면 이후 유지보수를 할 때 큰 도움이 된다.
	- Refactoring is a disciplined technique for restructing an existing body of code, altering its internal structure without changing its external behavior. Its main purpose is to make the code more efficient, readable, and maintainable, while also improving its overall design. 
- 언제 리팩토링을 해야 하는가?
	- 코드를 이해하거나 유지 관리하기 어려워지는 경우 리팩토링이 필요하다고 생각합니다. 복잡한 로직에서 변수와 함수의 이름을 개선하고, 길이가 긴 메서드를 더 작고 관리하기 쉬운 메서드로 분할하는 과정으로 리팩토링할 수 있습니다. 또한 성능 병목 현상이 일어날 때 리팩토링이 필요하다고 생각합니다. 실제로 프로젝트에서 성능 병목 현상이 일어나서 성능 최적화를 위한 코드 리팩토링을 진행해보았습니다.
	- In my view, refactoring becomes essential when code is challenging to understand or maintain. For instance, tackling complex logic can be managed by enhancing the clarity of variable and function names, and by dividing lengthy methods into shorter, more manageable methods. This approach not only improves readability but also eases maintenance. Additionally refactoring is crucial in addressing performance issues. For example, in a recent project, we analyzed codes contributing to the performance bottleneck and proceeded optimization. As a result of these refinements, we successfully enhanced the performance by refactoring the codes. 

## Team

- 코드 리뷰를 할 때 어떤 부분을 중점적으로 보는가?
- 팀원과 협업하면서 있었던 어려움이 있었는가?
	- We had many long meetings. It made us exhausted. So I suggested reading before the meeting documents that we would need to be discussed at the meeting. By adopting this strategy, we not only saved time but also enhanced the efficiency and effectiveness of our meetings.
- 팀에서 어떤 역할을 수행했고, 어떤 부분에 기여했는가?
	- 나는 백엔드 개발자로서 프론트엔드 개발자와 소통해야 했다. 나는 기술적인 용어를 쓸 때 동료가 이해할 수 있는 말로 풀어서 설명하려고 노력했다. 대부분의 오해는 말을 잘못 이해하는 것으로 시작되기 때문이다. 또한 동료가 요청하는 것이 있으면 빠르게 반영하려고 노력했다. 이렇게 했을 때 동료들과 효과적으로 협업 활동을 할 수 있었다.
	- As a back-end developer, I needed to communicate with front-end developer. When I used technical terms, I tried to break them down into words that my coworkers could understand. Because most misunderstandings starts with a misunderstanding of words. I also tried to be responsive to their requests. By doing this, I was able to collaborate effectively with my coworkers.
- How do you approach learning new technologies or programming languages?
	- First, I try to understand why this technology is needed and in what situation it will be useful. I don’t introduce technology blindly, I try to introduce it when I think the technology is necessary for service. I tend to study technology by reading official document and making some sample projects myself.

## 그 외 답변

- 지원 동기
	- I believe that Delivery Hero will expose me to a variety of problems and allow me to solve them. I applied because I want to work in a new environment with different people. 

## 질문

- Could you say that again, please? 
- Would you mind slowing down a little bit? I'm still adapting to fast-paced English and would appreciate the favor if you can.
- May I correct my previous answer?
- 인터뷰 결과는 언제 안내 되나요?
	- When will the results of the interview be announced?
- 일하시면서 좋은 점과 힘든 점이 있으셨나요? 저에게 소개해주실 수 있나요?
	- Did you have any good or difficult points while working? Can you introduce it to me?

## 질문

- 자기 소개
- Spring 을 사용한 이유
- 간단하게 서비스 소개
	- 서비스 구조는 어떻게 구성되어 있는가?
	- 개발하면서 가장 challenging 했던 문제
	- 동시성은 어떻게 해결할 수 있는가?
	- 사람들이 더 많아지면 모두 캐싱할 수는 없지 않나?
	- scale up 만이 답인가?
- Collection 설명해보라고 함
	- List 와 Set 의 차이점
	- List, Set 과 Map 의 차이점 → Map 은 key 로 값 가져온다 그렇게만 말함..ㅋㅋ
- NAT, VPC 란 무엇인가?
- Java 를 제외한 다른 언어 써볼 생각 있는지

전체적으로 분위기는 좋았고, 긴장하지 않게 많이 애써주셨던 것 같다. 다만 인터뷰를 30분 밖에 하지 않아서 왜 이렇게 빨리 끝났는지 의문이다. 15분 동안은 내가 질문하고 답변하는 시간을 가졌다. 질문도 크게 어렵지 않았고 Java 와 서비스에 대한 basic 한 질문들이 대부분이었다. 