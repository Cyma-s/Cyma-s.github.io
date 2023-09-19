---
title: EXPLAIN
date: 2023-09-14 21:34:46 +0900
updated: 2023-09-19 13:28:44 +0900
tags: 
---
## EXPLAIN

### Extra 컬럼

- Using index
	- Covering Index Scan. 필요한 모든 데이터가 인덱스에서 직접 가져올 수 있으므로 데이터 파일을 읽을 필요가 없다.  
- Using where
	- 쿼리에서 WHERE 절이 사용되었고, MySQL 이 결과를 필터링 하기 위해 where 를 사용했다.  
- Using filesort
	- MySQL 이 결과를 정렬하기 위해 디스크 기반의 정렬 기법을 사용했다. 인덱스를 사용하여 자동으로 정렬할 수 없는 경우에 발생하며, 성능에 부정적인 영향을 줄 수 있다.
- Range checked for each record (index map: x)
	- JOIN 연산을 수행할 때, 가장 좋은 인덱스를 결정하기 위해 각각의 행에 대해 범위를 확인했다는 것을 나타낸다.  
- Impossible WHERE noticed after reading const tables
	- WHERE 절의 조건에 따라 쿼리가 결과를 반환할 수 없음을 MySQL 이 인식했다.  
- Using join buffer
	- 조인 버퍼를 사용하여 조인 연산을 수행했다.
	- 특정 조인 유형에서 사용되며, 성능에 영향을 줄 수 있다.
- Select tables optimized away
	- 쿼리 최적화 과정에서 테이블 액세스가 필요하지 않다고 판단되어 제외되었다. 
- Distinct
	- 중복된 결과를 제거하기 위해 `DISTINCT` 키워드를 사용했다.
- Using temporary
	- MySQL 이 쿼리의 결과를 만들기 위해 임시 테이블을 생성했다. 대개 이는 `GROUP BY`, `ORDER BY` 또는 둘 다 포함하는 쿼리에서 발생한다. `ORDER BY` 절과 `GROUP BY` 절이 서로 다른 컬럼을 참조할 때, 혹은 조인된 결과를 정렬해야 할 때 이런 상황이 발생한다.
	- 임시 테이블을 사용하면 디스크에 기록될 수 있기 때문에 성능 저하를 유발할 수 있다.

#### Using join buffer

조인 연산을 수행하기 위해 특별한 메모리 버퍼인 "조인 버퍼" 를 사용했다는 것이다.  
주로 Block Nested-Loop join 에 해당하는 연산이 발생할 때 나타난다.  

**Block Nested-Loop join**

1. Outer 테이블의 각 레코드에 대해
2. Inner 테이블 전체를 스캔하면서
3. 조인 조건에 맞는 레코드를 찾는 방법

**장점**

조인 버퍼를 사용하면 Inner 테이블의 읽기 연산 횟수를 획기적으로 줄일 수 있다. 조인 버퍼에는 Outer 테이블에서 읽은 여러 레코드의 정보가 저장된다. 한 번의 스캔으로 여러 조인 연산을 동시에 수행할 수 있다.

조인 버퍼의 크기는 `join_buffer_size` 시스템 변수로 설정할 수 있다.  
이 값이 충분히 크면, 더 많은 Outer 테이블 레코드를 한 번에 조인 버퍼에 저장하고, 더 적은 수의 스캔으로 Inner 테이블과의 조인 연산을 완료할 수 있다.   

**단점**

조인 버퍼는 메모리를 사용하기 때문에, 동시에 실행되는 많은 쿼리가 조인 버퍼를 사용해야 하거나, `join_buffer_size` 가 너무 큰 경우에는 메모리 부족 문제가 발생할 수 있다.
