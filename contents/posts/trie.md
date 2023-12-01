---
title: 트라이 알고리즘
date: 2023-12-01 20:20:28 +0900
updated: 2023-12-01 22:06:23 +0900
tags:
  - algorithms
---

## 트라이란?

문자열을 저장하고 효율적으로 탐색하기 위한 트리 형태의 자료구조. 
문자열을 탐색할 때 전부 비교하며 탐색하는 것보다 시간 복잡도 측면에서 훨씬 더 효율적이다.  

그러나 각 노드에서 자식에 대한 포인터들을 배열로 모두 저장하고 있기 때문에 저장 공간의 크기가 커서 메모리 측면에서는 비효율적일 수 있다. 

## 구현

```python
class Node:
    def __init__(self, key):
        self.key = key
        self.children = dict()
        self.is_end = False

class Trie:
    def __init__(self):
        self.head = Node(None)

    def insert(self, string):
        current_node = self.head
        for char in string:
            if char not in current_node.children:
                current_node.children[char] = Node(char)
            current_node = current_node.children[char]
        current_node.is_end = True
```

## 시간 복잡도

제일 긴 문자열의 길이가 $L$, 총 문자열의 수를 $M$ 이라고 할 때 시간복잡도는 다음과 같다.  

- 생성 시 시간복잡도: $O(M*L)$, 모든 문자열을 넣어야 하니 $M$개에 대해 트라이에 넣는 것은 가장 긴 문자열 길이만큼 걸리니 $O(M*L)$ 이다. 삽입 자체는 $O(L)$
- 탐색 시 시간 복잡도: $O(L)$. 트리를 타고 들어가봤자 가장 긴 문자열의 길이만큼만 탐색한다. 