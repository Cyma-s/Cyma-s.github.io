---
title: Transaction
date: 2023-10-04 10:53:51 +0900
updated: 2023-11-03 15:19:52 +0900
tags:
  - database
---

## 트랜잭션이란

DBMS에서 수행되는 논리적인 작업의 단위를 말한다. 
하나 이상의 데이터베이스 조작 (INSERT, UPDATE, DELETE 등)을 묶어 하나의 작업으로 처리한다.

### 트랜잭션의 특성 (ACID)

1. 원자성: 트랜잭션의 모든 연산은 하나의 원자적 작업 단위로 간주된다. 모든 연산이 성공적으로 수행되면 트랜잭션은 커밋되어 영구적으로 적용되고, 하나라도 실패하면 트랜잭션은 롤백되어 이전 상태로 복원된다. -> 트랜잭션의 연산은 전부 수행되거나 전혀 수행되지 않아야 한다.
2. 일관성: 트랜잭션이 수행되기 전, 후의 데이터베이스 상태는 일관된 상태를 유지해야 한다. 즉, 데이터베이스에 저장된 데이터의 제약 조건, 규칙, 관계 등이 모두 만족되어야 한다. 트랜잭션이 실행되기 전의 데이터베이스 내용이 잘못되어 있지 않다면 트랜잭션이 실행된 이후에도 데이터베이스의 내용에 잘못이 있으면 안 된다.
3. 격리성: 트랜잭션이 실행되는 도중에 다른 트랜잭션의 영향을 받아 잘못된 결과를 만들어서는 안 된다. 각 트랜잭션은 시스템 내에서 독립적으로 실행되는 것처럼 보여야 한다.
4. 지속성: 트랜잭션이 커밋된 후에는 해당 트랜잭션이 갱신한 데이터베이스의 내용은 영구적으로 저장되어야 한다. 시스템 장애나 복구 작업 같은 예외 상황이 발생하더라도 트랜잭션이 커밋되었으면 결과는 영구적으로 보존되어야 한다.

### 트랜잭션의 과정

1. 트랜잭션 시작: 트랜잭션을 시작할 수 있는 레벨을 설정하고, 해당 레벨에서 동작하는 새로운 트랜잭션을 시작한다.
2. 데이터베이스 조작: 새로 생성된 트랜잭션 내에서 데이터 조회, 입력, 수정, 삭제 등의 조작을 수행한다.
3. 데이터 검증: 데이터 조작이 모두 성공적으로 처리되었다면, COMMIT을 수행한다. 그러나 데이터 조작 오류가 발생하면 ROLLBACK 명령을 실행하여 이전 상태로 되돌린다.
4. 트랜잭션 종료: 트랜잭션을 완료하고, 해당 레벨의 트랜잭션을 종료한다. 

### 트랜잭션 레벨

동시에 실행중인 여러 트랜잭션 간의 데이터 일관성과 격리 수준을 조절하는데 사용된다.

### 트랜잭션 격리 수준

#### Read Uncommitted (레벨 0)
- 트랜잭션에서 처리 중인, 아직 커밋되지 않은 데이터를 다른 트랜잭션이 읽는 것을 허용한다.
- SELECT 문장이 수행되는 동안 해당 데이터에 shared lock이 걸리지 않는다.
- 데이터 부정합 문제가 발생할 확률이 높으나, 성능은 가장 빠르다.
- DirtyRead, Non-Repeatable Read, Phantom Read 현상이 발생한다.
- RDBMS 표준에서는 트랜잭션의 격리 수준으로 인정하지 않을 정도로 정합성에 문제가 많다. MySQL을 사용한다면 Read Committed 이상의 격리 수준을 사용하자.

#### Read Committed (레벨 1)
- 트랜잭션이 커밋되어 확정된 데이터만 읽는 것을 허용한다. 
- SELECT 문장이 수행되는 동안 해당 데이터에 shared lock이 걸린다. 따라서 트랜잭션이 수행되는 동안 다른 트랜잭션이 접근할 수 없고, 대기한다. 즉, data 10을 50으로 변경하는 동안 다른 사용자는 바뀐 데이터에 접근할 수 없다. (data 50에 접근할 수 없다.)
- 실제 테이블 값을 가져오는 것이 아닌, Undo 영역에 백업된 레코드에서 값을 가져온다. Undo 영역은 트랜잭션의 롤백 대비를 위해, 트랜잭션의 격리 수준을 유지하며 높은 동시성을 제공하기 위해 사용된다.
![[transacion-read-committed.png]]
- Non-Repeatable Read, Phantom Read 문제가 발생한다.
- 일반적인 웹 애플리케이션에서는 크게 문제가 되지 않지만, 입출금 같은 금전과 관련이 된다면 문제가 될 수 있다. 

#### Repeatable Read (레벨 2)
- 트랜잭션이 범위 내에서 조회한 데이터의 내용이 항상 같음을 보장한다. Undo 영역에 백업된 이전 데이터를 사용한다.
- 실행되는 트랜잭션 가운데 가장 오래된 트랜잭션 번호보다 트랜잭션 번호가 앞선 undo 영역의 데이터는 삭제할 수 없다.
- 즉, 10번 트랜잭션에서 실행되는 모든 SELECT 쿼리는 10번보다 작은 트랜잭션 번호에서 변경한 내용만 보게 된다. 10번 트랜잭션이 실행되는 도중에 12번 트랜잭션이 UPDATE 쿼리를 수행해도 12번 트랜잭션의 변경 사항은 10번 트랜잭션 SELECT 쿼리에 영향을 줄 수 없다.
- 하나의 레코드에 대해 백업이 하나 이상 존재할 수 있다. 따라서 한 사용자가 트랜잭션을 시작한 후 장기간 트랜잭션을 종료하지 않는 경우에는 Undo 영역이 계속해서 확장되고, 백업 레코드가 많아질수록 MySQL 서버의 처리 성능이 떨어질 수 있다.
- Phantom Read 문제가 발생한다. (그러나 MySQL InnoDB는 MVCC 다중 버전 제어를 통해 Phantom Read 문제를 해결한다. 즉, MySQL 에서는 Phantom Read 문제가 발생하지 않는다.)

#### Serializable (레벨 3)
- 트랜잭션이 완료될 때까지 SELECT 문장이 사용하는 모든 데이터에 접근할 수 없다. 즉, 한 트랜잭션에서 읽고 쓰는 레코드를 다른 트랜잭션에서는 절대 접근할 수 없다.
- 동시 처리 성능이 다른 트랜잭션 격리 수준에 비해 현저히 떨어진다.
- `SERIALIZABLE` 격리 수준에서 

#### MySQL InnoDB가 Phantom Read를 해결하는 방법 - MVCC 다중 버전 제어

MVCC(Multi Version Concurrency Control) -> 잠금을 사용하지 않는 일관된 읽기를 제공한다.
동시성 제어를 위한 기술로, 여러 개의 버전을 생성하여 트랜잭션간 충돌을 방지한다.

각각의 트랜잭션은 일련번호를 할당받고, 트랜잭션의 시작 지점이 빠른 트랜잭션은 숫자가 작다.
데이터베이스의 각 레코드는 변경 이력을 추적하기 위해 여러 버전으로 관리되는데, 이때 해당 레코드를 변경한 트랜잭션의 일련번호가 함께 저장된다.

트랜잭션의 시작 시점에 따라서 해당 시점 이전에 커밋된 트랜잭션들의 변경 내역만을 볼 수 있도록 설정된다. 
즉, 10번 트랜잭션의 경우 10보다 작은 일련 번호를 갖는 트랜잭션이 변경한 내역들만 볼 수 있다. 
다른 트랜잭션이 트랜잭션 실행 중에 데이터를 변경하더라도 실행 중인 트랜잭션은 변경 내용을 알 수 없다.

#### DB_TRX_ID

MVCC 를 구현하기 위해 데이터의 각 행에 관련 정보를 추가로 저장한다. 주로 다음과 같은 숨겨진 컬럼들을 사용한다.

- DB_TRX_ID: 데이터를 마지막으로 수정한 트랜잭션의 ID
- DB_ROLL_PTR: 롤백 세그먼트에 대한 포인터. 이전 버전의 데이터 (undo 로그) 에 대한 링크이다.
- DB_ROW_ID: 데이터베이스 내부에서 사용하는, 명시적인 기본 키가 없는 테이블에 대한 auto_increment id 이다.

#### Undo 로그

변경 전 데이터의 상태를 기록하고, 트랜잭션이 롤백되거나 다른 트랜잭션이 이전 버전의 데이터를 읽어야 할 때 사용된다. Undo 로그 자체는 버퍼 풀에 캐시될 수 있지만, 영구적인 저장을 위해 디스크 상의 undo 로그 세그먼트에 저장된다.

버퍼 풀은 데이터베이스 서버의 메모리 내에서 데이터와 인덱스 페이지를 캐시하는 역할을 하므로, 자주 접근되는 데이터의 최신 버전을 메모리 내에 빠르게 접근할 수 있도록 해준다. 그러나 MVCC 에 필요한 데이터 버전 정보는 원본 레코드에 직접 저장되어 데이터베이스의 일관성과 내구성을 유지한다.

#### 스냅샷

InnoDB 스토리지 엔진을 사용하는 MySQL 에서는 MVCC 모델에 따라 트랜잭션을 시작할 때 특정 시점의 데이터베이스 스냅샷을 가진다. 스냅샷은 데이터의 실제 복사본을 만드는 것이 아닌, 데이터를 조회하거나 변경할 때 해당 트랜잭션의 시점에서 보아야 할 데이터의 버전을 결정하는 논리적인 개념이다.

REPEATABLE READ 격리 수준에서는 트랜잭션이 시작될 때의 스냅샷을 통해 조회를 수행한다. 트랜잭션 도중에 다른 트랜잭션에 의해 데이터가 변경되더라도 변경 되기 전의 

##### 트랜잭션 ID 할당 시점

MySQL 의 InnoDB 스토리지 엔진에서 DB_TRX_ID 는 특정 레코드를 마지막으로 수정한 트랜잭션 ID를 나타낸다.      

**트랜잭션이 시작되는 즉시 트랜잭션 ID 를 부여받는 것은 아니다.** InnoDB 가 경합을 줄이고 동시성을 향상시키기 위해서 lazy 한 방식으로 동작하기 때문이다.     

트랜잭션이 데이터를 수정하려고 시도할 때만 트랜잭션 ID 가 할당된다.       
트랜잭션에 의해 행이 수정되면 해당 행의 DB_TRX_ID 필드에 트랜잭션 ID 가 저장된다. 해당 ID는 InnoDB가 마지막으로 수정한 트랜잭션을 추적하는 데 도움이 된다. 

트랜잭션이 종료되고 트랜잭션이 커밋되면 변경 사항이 디스크에 기록되고 이후 모든 트랜잭션에서 변경 사항을 볼 수 있다. 트랜잭션이 롤백되면 해당 트랜잭션에 의해 변경된 내용은 undo log의 정보를 사용하여 실행 취소된다.     

트랜잭션 ID가 lazy 할당 되기 때문에 읽기 전용 트랜잭션이나 데이터베이스를 수정하지 않는 트랜잭션이 불필요하게 트랜잭션 ID를 사용하지 않도록 한다.     

#### 예시

1. 격리수준 serializable 트랜잭션 A가 먼저 시작된다. 이후 트랜잭션 B가 시작된다. 그 다음 트랜잭션 B가 table1 에 12를 insert 하고 commit 해서 트랜잭션 A보다 먼저 종료되었다. 이 경우, 트랜잭션 B가 트랜잭션 A보다 먼저 처리된 것으로 간주하여 A는 B의 반영사항을 그대로 읽을 수 있다.
2. 격리수준 repeatable read 트랜잭션 A가 먼저 시작된다. 이후 트랜잭션 B가 시작된다. 그 다음 트랜잭션 B가 table1 에 12를 insert 하고 commit 해서 트랜잭션 A보다 먼저 종료되었다. 이 경우, 트랜잭션 A는 B가 반영한 정보(12)를 볼 수 없다. 이유는 undo 영역의 snapshot 을 사용하여 트랜잭션 A가 유지되는 기간 동안 동일한 데이터를 읽어오기 때문이다.

### 트랜잭션 격리 수준에서 발생할 수 있는 문제점

#### Dirty Read
특정 트랜잭션에 의해 데이터가 변경되었으나, 아직 커밋되지 않은 상황에서 다른 트랜잭션이 트랜잭션 내부에서 발생한 변경 사항을 조회할 수 있는 문제이다. 

A 트랜잭션에서 데이터를 변경하고 커밋하지 않은 시점에 B 트랜잭션이 변경된 데이터를 읽은 상황에서 A 트랜잭션이 롤백하게 되면 치명적일 수 있다. B 트랜잭션은 롤백으로 무효가 된 데이터를 가지고 처리를 진행하기 때문에 문제가 발생한다.

#### Non-Repetable Read
같은 트랜잭션 내에서 같은 데이터를 여러 번 조회했을 때 읽어온 데이터가 다른 경우를 의미한다.

#### Phantom Read
Non-Repeatable Read의 한 종류로, 조회해온 결과의 행이 새로 생기거나 없어지는 현상이다.

**참고**
- https://hudi.blog/transaction-isolation-level/
- https://mysqldba.tistory.com/334
- https://nesoy.github.io/articles/2019-05/Database-Transaction-isolation

### Lock

## Redo Log vs Undo Log

### Redo Log

- 목적
데이터베이스 시스템의 장애나 중단 후 복구를 지원한다. 시스템 장애 발생 시 마지막 커밋된 상태로 데이터베이스를 복원할 수 있다.  
- 작동 방식
데이터베이스의 모든 변경 사항(insert, update, delete) 은 먼저 redo log 에 기록된다. 이 변경 사항은 실제 데이터베이스에 비동기적으로 적용될 수 있다. 시스템이 장애로 중단된 경우, redo log 의 내용은 복구 과정에서 사용되어 데이터베이스를 최근 커밋된 상태로 복원한다.

### Undo Log

- 목적
데이터베이스 트랜잭션의 원자성과 일관성을 보장하는 것이다. 트랜잭션이 중간에 실패하거나 롤백되어야 하는 경우, 데이터베이스를 변경 전 상태로 되돌릴 수 있다.
- 작동 방식
트랜잭션이 레코드를 변경할 때, 원래 레코드 값을 undo log 에 기록한다. 트랜잭션이 실패하거나 롤백되는 경우 undo log 의 내용을 사용하여 해당 레코드를 원래 상태로 되돌린다.
