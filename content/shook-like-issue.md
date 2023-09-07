---
title: S-HOOK 좋아요 정합성 이슈
date: 2023-09-06 14:04:11 +0900
updated: 2023-09-06 14:04:27 +0900
tags:
  - shook
  - 레벨4
  - 우테코
  - 임시
---

## S-HOOK의 좋아요 기능?

좋아요 순으로 노래 순위가 달라진다.  

1. 실시간으로 노래 순위가 달라질 것인가

요청마다 순위가 바뀌어야 할 것 같다.

2. 특정 시간마다 노래 순위를 업데이트할 것인가

KillingPart의 likeCount 업데이트 X. Like만 추가. `@Schedule` like 들 읽어서 likeCount 한 번에 업데이트. 
schedule 동안 발생한 likeCount 는 집계가 안 되고, 다음 schedule 때 반영된다.

- 문제점: 킬링파트들의 좋아요 개수가 reload 시 업데이트가 안 된다는 것

## 동시성 이슈 해결 방법

### `synchronized`

하나의 프로세스 내의 스레드 단위에서만 동시성을 보장한다.  

### Update Execute 로 직접 update 쿼리 날려서 해결

그나마 우리 상황에 맞을 지도...  
객체지향적이지 않을 수 있다.

### 비관적 락 사용하기

우리 상황에는 안 맞음

### 좋아요 수 쿼리를 비동기를 사용해서 성능 개선하기

### 낙관적 락 `@Version` 사용하기

우리 상황에는 안 맞음

### Redis 사용

#### Redission
#### Lettuce

## 참고

- https://golf-dev.tistory.com/73
- https://dev-alxndr.tistory.com/45