---
title   : 모니터와 synchronized
date    : 2023-08-21 16:31:47 +0900
updated : 2023-08-21 16:31:57 +0900
tags     : 
- java
---

Monitor Lock 과 synchronized

Java 의 synchronized 키워드가 동기화를 제공하는 방법인 Monitor Lock 에 대해 알아본다. 또한 Monitor Lock 이 사용되는 이유와 어떤 경우에 사용되면 좋은지 알아본다.

## Lock

### 왜 사용할까?

1. critical section 에 대해 상호 배제 (mutual exclusion) 을 제공한다. 공유 데이터를 한 스레드만 접근할 수 있도록 제한하는 것을 의미한다.
2. 스레드 간의 협업 또는 동기화의 역할을 수행한다. 어떤 작업을 완료하거나 특정 상태에 도달하는 경우 다른 스레드에 알려주어 해당 스레드가 동작할 수 있도록 한다.



## Intrinsic Locks

Synchronization (동기화) 은 내장 락, 모니터 락이라고 알려진 내부 엔티티를 중심으로 구축된다.

## 동시성

프로그램, 알고리즘, 또는 문제의 여러 부분이나 단위를 결과에 영향을 주지 않고 순서 없이 또는 부분적으로 실행할 수 있는 기능

https://en.wikipedia.org/wiki/Concurrency_(computer_science)

### Read-Modify-Write 패턴

## 참고

- https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html
- https://backtony.github.io/java/2022-05-04-java-50/
- http://happinessoncode.com/2017/10/04/java-intrinsic-lock/
- https://www.baeldung.com/java-synchronized