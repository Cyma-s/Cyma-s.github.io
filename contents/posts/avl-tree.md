---
title: AVL Tree
date: 2023-11-05 16:17:35 +0900
updated: 2023-11-06 16:01:27 +0900
tags:
  - algorithms
---

## AVL Tree 란

트리의 높이가 h 일 때 이진탐색트리의 시간복잡도는 O(h) 이기 때문에 균형된 트리를 만들어 h 를 줄이고자 하는 발상에서 시작했다. 

### 특성

- AVL 트리는 이진 탐색 트리의 속성을 갖는다.
- 왼쪽, 오른쪽 서브 트리의 높이 차이가 최대 1이다.
- 어떤 시점에서 높이 차이가 1보다 커지면 회전을 통해 균형을 잡아 높이 차이를 줄인다.
- AVL 트리는 높이를 logN 으로 유지하기 때문에 삽입, 검색, 삭제의 시간 복잡도는 O(logN) 이다.

## Balance Factor

> The difference between the heights of the left subtree and the right subtree for any node is known as the **balance factor** of the node

왼쪽 서브트리의 높이에서 오른쪽 서브트리의 높이를 뺀 것을 의미한다.  
두 서브트리의 높이가 같거나 리프 노드라면 BF 는 0이다. 

즉, BF 가 클수록 불균형 트리라고 할 수 있다.

## 시간 복잡도

| Operation | Average   | Worst     |
| --------- | --------- | --------- |
| Access    | $O(logN)$ | $O(logN)$ |
| Search    | $O(logN)$ | $O(logN)$ |
| Insert    | $O(logN)$ | $O(logN)$ |
| Delete    | $O(logN)$ | $O(logN)$ |

AVL 트리는 높이를 logN 으로 유지하기 때문에 삽입, 검색, 삭제의 시간 복잡도는 $O(logN)$ 이다.

## 회전

검색, 순회 연산은 BF 를 변경하지 않지만, 삽입 삭제에서는 BF 가 변경될 수 있다.  
삽입, 삭제 시 불균형 상태가 되면 AVL 트리는 불균형 노드를 기준으로 서브트리의 위치를 변경하는 rotation 작업을 수행하여 트리의 균형을 맞추게 된다. 

### LL (Left Left) case

> When a node is added into the right subtree of the right subtree, if the tree gets out of balance, we do a single left rotation.

y 는 z 의 왼쪽 자식 노드이고, x는 y 의 왼쪽 자식 노드인 경우 right rotation 을 수행하여 균형을 맞춘다.

right-rotation 수행 과정은 다음과 같다.

1. y 노드의 오른쪽 자식 노드를 z 노드로 변경한다.
2. z 노드의 왼쪽 자식 노드를 y 노드 오른쪽 서브트리 T2 로 변경한다.

![[left-left-left-rotation.png]]


### RR (Right Right) case

> If a node is added to the left subtree of the left subtree, the AVL tree may get out of balance, we do a single right rotation.

y 는 z 의 오른쪽 자식 노드이고, x는 y의 오른쪽 자식 노드인 경우 left rotation 을 수행하여 균형을 맞춘다. 

left rotation 수행 과정
1. y 노드의 왼쪽 자식 노드를 z노드로 변경
2. z 노드 오른쪽 자식 노드를 y 노드 왼쪽 서브트리로 변경

![[right-right-left-rotation.png]]

### LR (Left Right) case

> A left-right rotation is a combination in which first left rotation takes place after that right rotation executes. 

y 는 z 의 왼쪽 자식 노드이고, x는 y 의 오른쪽 자식 노드인 경우 left, right 순으로 총 두 번의 rotation 을 수행하여 균형을 맞춘다.

![[left-right-left-right.png]]

### RL (Right Left) case

> A right-left rotation is a combination in which first right rotation takes place after that left rotation executes.

y 는 z의 오른쪽 자식 노드이고, x는 y의 왼쪽 자식 노드인 경우, right, left 순으로 총 두 번의 rotation 을 수행하여 균형을 맞춘다. 

![[right-left-right-left.png]]

## 적용

1. 데이터베이스의 방대한 레코드를 인덱싱하고 효율적으로 검색할 떄
2. 집합과 dictionary 를 포함한 모든 유형의 인메모리 컬렉션
3. 삽입 삭제는 흔하지 않지만, 빈번한 데이터 조회가 필요한 데이터베이스 애플리케이션
4. 최적화된 검색이 필요한 소프트웨어

## 장점

1. 치우치지 않는다.