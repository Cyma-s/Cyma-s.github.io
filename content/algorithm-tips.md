---
title   : 알고리즘 Tips
date    : 2023-08-30 17:18:33 +0900
updated : 2023-08-30 17:18:41 +0900
tags     : 
- algorithm
---

## 그래프

- [[floyd-warshall-algorithm]]
- [[bellman-ford-algorithm]]

### 이진 트리 순회 문제

- 후위 순회의 끝은 root 이다.
- 중위 순회와 후위 순회 입력 받아 전위 순회 구하기

```python
import sys

sys.setrecursionlimit(int(1e5))


def find_tree(in_start, in_end, post_start, post_end):
    if in_start > in_end or post_start > post_end:
        return
    root = post_order[post_end]
    print(root, end=' ')
    root_index = in_order_index[root]
    left_size = in_order_index[root] - in_start
    find_tree(in_start, root_index - 1, post_start, post_start + left_size - 1)
    find_tree(root_index + 1, in_end, post_start + left_size, post_end - 1)


n = int(input())
in_order = list(map(int, input().split()))
post_order = list(map(int, input().split()))
in_order_index = [0] * (n + 1)
for i in range(n):
    in_order_index[in_order[i]] = i
find_tree(0, n - 1, 0, n - 1)
```

## 분리 집합

- 사이클 찾기
	- x와 y 를 union 하려고 하는데, 이미 x와 y 의 부모가 같은 경우 사이클이 존재한다고 할 수 있다.

```python
def is_cycle(x, y):
	return find(x) == find(y)

for i in range(m):  
	a, b = map(int, input().split()) 
	if is_cycle(a, b): 
		# 사이클이 존재한다.
```