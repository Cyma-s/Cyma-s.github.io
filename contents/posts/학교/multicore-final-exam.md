---
title: 멀티코어 기말고사 문제 풀이
date: 2024-06-17 17:17:42 +0900
updated: 2024-06-17 19:24:04 +0900
tags:
  - multicore
  - school
---

## 2023년

### 1번

- NVCC
- Thrust
- `omp_get_thread_num`
- block, shared
- guided
- loop variables

### 2번

1. `omp_set_thread_num(NUM)`
2. 12
3. `private(x)`

### 3번

#### A

`#pragma omp parallel sections`

The individual code blocks are distributed over the threads

#### B

parallel 블록 내부에서만 접근 가능하다.

#### C

`firstprivate` variables are initialized to their value before the parallel section

### 4번

### 5번

-  (i) The serious problem:
	- **Too many threads**

-  (ii) Why?:
	- **Excessive parallelism overwhelms resources**

## 2013

### 1번

1. Synchronization
2. Conditional Variables
3. be blocked / wait
4. independent
5. divide
6. merge
7. data parallel
8. pthread_join
9. pthread_exit

### 2번

There are several ways in which a pthread may be terminated
- The thread returns from its starting routine (the main routine for the initial thread)
- The thread is canceled is terminated due to making a call to either the `exec()` or `exit()`
- The thread makes a call to the `pthread_exit` subroutine
- If main() finishes first, without calling `pthread_exit` explicitly itself

### 5번

`#pragma omp parallel for reduction(+:sum) private(x)`

## 2018

### 1번

1. warp
2. `__global__`
3. void
4. `__host__`
5. `__device`
6. shared memory
7. block
8. private
9. Mutual Exclusion
10. block
11. return
12. `pthread_join`  `pthread_exit`

### 2번

- `parallel for shared(m, n, a, b, c) private(i, j, sum)`
```cpp
for (i = 0; i<m; i++) {
	int temp = 0;
	for(j = 0; j<n; j++) {
		temp = temp + b[i*N+j] * c[j];
	}
	 a[i] = temp;
}
```

### 3번

- blockIdx
- threadIdx
- blockDim
- threadDim

### 4번

- chunk size n 인 round-robin
- n 개씩 동적으로 
- chunk size 가 최소 n까지 줄어든다

### 5번

```
왼쪽 q1 찾기
오른쪽 q2 binary search
q3 위치 계산
A[q3] = T[q1]
spawn Par-Merge()
spawn Par-Merge()
sync
```

### 6번

- a
- b: cudaMalloc
- c: stencil1D

## 2017

### 1번

- General Purpose GPU
- device
- host
- execution configuration (block, thread)
- SIMD
- shared
- loop
- private

### 2번

- A: thread_id
- B: pthread status code

### 3번

`reduction(+:sum)`

### 4번

- if n ≤ appropriate 숫자 일 때 sorting

### 5번

- prefix

### 6번

CUDA!

## 2016

### 1번

- block
- shared
- sections
- shared
- loop
- private

### 2번

### 3번

### 4번

- floor (p1 + r1 / 2)
```
if n >= 30
	sorting other algorithm
else
	
```

### 5번

```
double start = omp_get_wtime()
double end = omp_get_wtime()
```

## 2015

### 1번

- loop
- undefined
- SMID
- execution configuration
	- call by host
	- execute in device
	- return status void
- block
- pthread_join
- pthread_exit

### 2번

`#pragma parallel for reduction(+:sum)`

### 3번

### 4번

- shared
- destination, source, size, device memory

### 5번

## 2014

### 1번

- shared memory
- warp
- Scalability
- load balancing
- a power of two
- loop variable

### 2번

- 

### 3번

