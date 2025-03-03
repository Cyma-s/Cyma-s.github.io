---
title: 비트마스킹
date: 2023-09-01 21:44:57 +0900
updated: 2023-12-18 16:02:02 +0900
tags:
  - algorithms
---

## 비트마스킹이란

이진 숫자를 이용해서 데이터의 집합을 표현하거나, 그 데이터에 특정 연산을 수행하는 기술이다.   
비트를 사용하여 데이터의 존재, 상태를 나타내기 때문에 매우 효율적인 메모리 사용이 가능하다. 

## 비트마스킹 연산

1. 특정 비트 확인   
	n 번째 비트가 1인지 0인지 확인하기 위해 AND 연산을 사용한다.

```python
(mask & (1 << n)) # n 번째 비트가 1이면 결과는 1, 0이면 0
```

2. 특정 비트 켜기 (설정)
	OR 연산을 사용하여 n 번째 비트를 1로 만든다.

```python
mask |= (1 << n)
```

3. 특정 비트 끄기 (초기화)
	AND, NOT 연산을 사용하여 n 번째 비트를 0으로 만든다.

```python
mask &= ~(1 << n)
```

4. 특정 비트 토글
	XOR 연산을 사용하여 n 번째 비트를 반전시킨다.

```python
mask ^= (1 << n)
```
