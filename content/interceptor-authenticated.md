---
title   : member 를 interceptor 에서 조회할 수 있을까?
date    : 2023-08-16 10:01:48 +0900
updated : 2023-08-16 10:01:54 +0900
tags     : 
- spring
- interceptor
- shook
- 레벨3
- 우테코
---

## 상황 설명

현재 저희 팀에서는 interceptor 에서 

`interceptor` 에서 읽기 전용 트랜잭션으로 멤버를 조회한 후, 컨트롤러에 전달한다. 그러나 읽기 전용 트랜잭션이 종료되면서, 멤버는 준영속 상태가 된다. 준영속 상태인 엔티티를 다시 영속성 컨텍스트에 포함하려면 다시 조회해야 한다.

즉, 컨트롤러, 서비스의 entityManager 에서 interceptor 에서 조회한 멤버를 동일하게 조회했을 때, 영속성 컨텍스트에는 해당 멤버가 존재하지 않는다.