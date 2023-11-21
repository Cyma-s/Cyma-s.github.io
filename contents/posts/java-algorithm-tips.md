---
title: 자바 알고리즘 라이브러리
date: 2023-11-09 15:06:37 +0900
updated: 2023-11-21 11:36:33 +0900
tags:
  - algorithms
---

## 자료구조

- `Queue` -> `PriorityQueue`
	- `add`: 데이터 삽입
	- `peek`: 맨 앞 값 반환
	- `poll`: 맨 앞 값 반환 후 삭제
- `Deque` -> `LinkedList`

## 유용한 메서드

- array to List
	- `Arrays.asList(배열)`
- List to array
	- `리스트.toArray(할당할 배열)`

## 이진 탐색

- `Arrays.binarySearch(배열, 찾으려는 요소, comparator)`
	- 찾는 값이 존재하면 인덱스를 반환한다.
	- 찾는 값이 존재하지 않는다면 어디에 위치해야 하는지를 알려주는 값을 음수로 반환한다. => - (원래 위치했어야 하는 인덱스 값) - 1