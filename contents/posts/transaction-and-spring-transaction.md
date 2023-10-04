---
title: Transaction과 Spring Transaction 강의
date: 2023-10-04 10:50:05 +0900
updated: 2023-10-04 11:08:23 +0900
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

- [?] Doublewrite Buffer 란?
MySQL 의 InnoDB 스토리지 엔진에서 사용된다.

시스템 장애나 갑작스러운 종료가 발생했을 때 데이터베이스 페이지의 부분적인 쓰기나 깨진 페이지들을 회복하는 것이다.
데이터베이스 페이지가 디스크에 기록되기 전에, 먼저 doublewrite buffer 에 두 번 쓰여지고 실제 데이터 파일 위치에 안전하게 쓰여진다. 즉, 원래 위치에 쓰기 중 문제가 발생하면 doublewrite buffer 에 있는 복사본을 사용하여 데이터를 복구할 수 있다.
하드웨어 장애나 기타 예기치 않은 문제로 인한 데이터의 손상 또는 손실을 ㅂ