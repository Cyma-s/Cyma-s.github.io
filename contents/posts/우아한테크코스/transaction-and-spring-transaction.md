---
title: Transaction과 Spring Transaction 강의
date: 2023-10-04 10:50:05 +0900
updated: 2023-10-04 11:24:17 +0900
tags:
  - 우테코
  - 레벨4
  - 강의
---

[[transactional]]

## 트랜잭션이란?

여러 SQL 문을 한 번에 커밋 혹은 롤백 할 수 있는 작업 단위

## 언제 트랜잭션을 사용하는가?

- 3단계 미션
	- 회원 정보의 변경 이력 남기기
		- 저는 비밀번호 바꾼적이 없어요....
		- 누가 바꿨는지 확인해주세요...
	- 비밀번호 변경 && 변경 이력
		- 둘 중 하나라도 실패하면 되돌려야 한다.

## SQL 문이 단건이면 트랜잭션을 안 써도 될까?

- DB 내부에서는 여러 작업이 수행될 수도 있다.
	- 수천 개 레코드 조회
	- 컬럼에 따라 인덱스도 갱신
- 단건 조회라도 트랜잭션을 붙이고 readonly 옵션을 사용하자.

## Java 의 트랜잭션

```java
try (final Connection connection = dataSource.getConnection();) {
	connection.setAutoCommit(false);
	
	...
	
	connection.commit();
} catch (SQLException e) {
	connection.rollback();
	throw new DataAccessException(e);
}
```

트랜잭션을 커밋 + 롤백하는 단위를 `트랜잭션 경계` 라고 한다.

## `Connection` 이 제공하는 기능

- 트랜잭션 경계 설정
- 트랜잭션의 격리 레벨 설정
	- 격리 레벨은 ACID 모델 중 I 에 해당한다.
- readonly 옵션
- 그 외 데이터베이스 연결 관련 기능

## 데이터베이스 설계 원칙 - ACID 모델

- 어떤 상황에서도 데이터 손실이 없을 거라 신뢰할 수 있다. 

| 개념 (ACID) | DBMS      | 기술 (MySQL InnoDB)               |
| ----------- | --------- | --------------------------------- |
| Atomic      | 회복      | Transaction                       |
| Consistency | 병행 제어 | DoublewriteBuffer, Crash Recovery |
| Isolation   | 병행 제어 | Transaction Isolation Level       |
| Durability  | 회복      | DoublewriteBuffer, Backup, etc.   |

- [2] Doublewrite Buffer 란?

MySQL 의 InnoDB 스토리지 엔진에서 사용된다. 시스템 장애나 갑작스러운 종료가 발생했을 때 데이터베이스 페이지의 부분적인 쓰기나 깨진 페이지들을 회복시켜준다.
데이터베이스 페이지가 디스크에 기록되기 전에, 먼저 doublewrite buffer 에 두 번 쓰여지고 실제 데이터 파일 위치에 안전하게 쓰여진다. 즉, 원래 위치에 쓰기 중 문제가 발생하면 doublewrite buffer 에 있는 복사본을 사용하여 데이터를 복구할 수 있다.
하드웨어 장애나 기타 예기치 않은 문제로 인한 데이터의 손상 또는 손실을 방지할 수 있다.

- [1] Doublewrite buffer 와 crash recovery 의 차이점은 뭘까?

둘 다 데이터베이스의 내구성, 무결성을 보장하기 위한 메커니즘이다.  

- Doublewrite buffer
	- 목적: 디스크에 데이터를 쓸 때 부분적인 쓰기나 전원 중단 같은 예기치 않은 장애로 인한 데이터 페이지의 손상을 방지하거나 복구하는 것이다.
	- 즉, 디스크 쓰기 중의 데이터 손상을 방지하거나 복구하는 데 초점을 두고 있다.
- Crash Recovery
	- 목적: 데이터베이스가 예기치 않은 중단 후 재시작될 때 트랜잭션의 일관성을 복원하고, 완료되지 않은 트랜잭션을 되돌리거나 완료하는 것이다.
	- 작동 방식: 데이터베이스는 변경 사항을 쓰기 전에 로그 (Redo Log) 에 기록한다. 데이터베이스가 갑작스럽게 중단된 후 재시작될 때, 해당 로그는 `crash recovery` 과정에서 사용되어 데이터베이스의 일관성을 복원한다. 완료되지 않은 트랜잭션은 이 로그를 사용하여 되돌리거나 완료된다.
	- 즉, 예기치 않은 데이터베이스 중단 후 트랜잭션의 일관성을 복원하는 데 초점을 두고 있다.

## 스프링으로 트랜잭션 사용하기

- JDBC API 로 트랜잭션을 적용하기 복잡하다.
- 예기치 못한 상황이 발생할 수 있으니 timeout 설정은 해주는 것이 좋다.
- isolation level, readonly을 설정할 수 있다.
- 애플리케이션의 수준에서 propagation 을 설정할 수 있다.

> 데이터베이스에서도 propagation 을 적용할 수 있을까?
> 
> RDBMS 자체에서는 고수준의 트랜잭션 전파 설정을 직접 지원하지 않는다. 보통 고수준 프레임워크에서 제공되는 기능이다. 
