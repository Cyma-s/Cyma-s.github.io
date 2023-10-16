---
title: 세그먼트 트리
date: 2023-10-16 08:19:20 +0900
updated: 2023-10-16 08:39:56 +0900
tags:
  - algorithm
---

## 세그먼트 트리란?

배열 간격에 대한 정보를 이진 트리에 저장하는 자료 구조.

세그먼트 트리를 사용하면 범위의 최소, 최대 및 합계 Query, 범위 Query 를 O(logN) 시간에 해결할 수 있다.

## 구현

### 세그먼트 트리의 크기

세그먼트 트리의 크기는 배열 arr 의 개수가 N개일 때, N보다 큰 가장 가까운 N의 제곱수를 구한 뒤에 그것의 2배를 하여 미리 세그먼트 트리의 크기를 만들어 두어야 한다.
실제로는 데이터 개수 N에 4를 곱한 만큼 미리 세그먼트 트리의 크기를 할당한다.

### 세그먼트 트리 초기화

index 는 자식 노드를 계산하기 쉽게 (좌측 노드: 부모 노드 index * 2, 우측 노드: 부모 노드 index * 2 + 1) 1 부터 시작한다.

```python
def init(start, end, index):
	if start == end: # leaf node 
		tree[index] = arr[start]
		return tree[index]
	mid = (start + end) // 2
	tree[index] = init(start, mid, index * 2) + init(mid + 1, end, index * 2 + 1)   # 좌측 노드, 우측 노드를 채운다.
	return tree[index]
```

세그먼트 트리의 인덱스와 구간 합은 별개의 값이다.

## 세그먼트 트리로 구간 합 구하기

구간의 합은 범위 안에 있는 경우만 더해주면 된다.

```python
def interval_sum(start, end, index, left, right):
	if left > end or right < start:
		return 0
	if left <= start and end <= right:  # 범위 안에 있는 경우
		return tree[index]
	mid = (start + end) // 2
	return interval_sum(start, mid, index * 2, left, right) + interval_sum(mid + 1, end, index*2 + 1, left, right)
```

## 특정 원소의 값을 수정하기

```python
def update(start, end, index, what, value):  # what: 구간 합을 수정할 노드 인덱스  
    if what < start or what > end:  
        return  
    tree[index] += value  
    if start == end:  
        return  
    mid = (start + end) // 2  
    update(start, mid, index * 2, what, value)  
    update(mid + 1, end, index * 2 + 1, what, value)
```

