---
title: performance_schema로 Query 성능 체크하기
date: 2023-09-14 22:00:23 +0900
updated: 2023-09-14 22:00:44 +0900
tags:
  - mysql
  - database
  - 레벨4
  - 우테코
  - shook
---

## performance_schema

MySQL 서버 실행에 대한 세부적인 통계와 모니터링 정보를 제공하는 스토리지 엔진이다.  

### 특정 쿼리의 성능 알아보기

주로 `events_statements_summary_by_digest` 테이블을 참조한다. 이 테이블은 실행된 SQL 문의 통계를 제공하고, 다양한 정보를 통해 성능 분석을 할 수 있다. 

- DIGEST
	- 쿼리를 구분하는데 사용되는 값이다.
- DIGEST_TEXT
	- 다이제스트에 해당하는 실제 SQL 텍스트
- COUNT_STAR
	- 쿼리가 몇 번 실행되었는지
- SUM_TIMER_WAIT
	- 쿼리를 실행하는 데 걸린 전체 시간
- MIN_TIMER_WAIT, AVG_TIMER_WAIT, MAX_TIMER_WAIT
	- 최소, 평균, 최대 실행 시간
- SUM_ROWS_SENT, SUM_ROWS_EXAMINED
	- 쿼리 실행 시 반환 및 조사된 행 수
