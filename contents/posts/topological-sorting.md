---
title: 위상 정렬
date: 2023-12-03 17:47:18 +0900
updated: 2023-12-03 19:04:14 +0900
tags:
  - algorithms
---

## 위상 정렬이란?

방향 그래프에서 간선으로 주어진 정점 간 선후관계를 위배하지 않도록 정렬하는 것이다. 

## 특징

Directed Acyclic Graph 에만 적용이 가능하다. 즉, 사이클이 발생하지 않는 방향 그래프에서만 사용할 수 있다.

그래프에 사이클이 있으면서 두 정점 u, v 가 사이클 속에 위치한 정점일 경우, 정점 u가 정점 v보다 먼저 오거나, v가 u보다 먼저 올 수 있기 때문이다. (주어진 정점 간 선후관계의 모순이 발생한다.)

## 구현

1. in-degree 가 0인 노드를 큐에 넣는다.  
2. 큐가 빌 때까지 다음의 과정을 반복한다.  
	1. 큐에서 원소를 꺼내 해당 노드에서 나가는 간선을 그래프에서 제거한다. 
	2. 새롭게 진입차수가 0이 된 노드를 큐에 삽입한다. 

즉, 각 노드가 큐에 들어온 순서가 위상 정렬을 수행한 결과가 된다. 

2252 번 줄 세우기 문제의 답과 동일하다.

```python
from collections import defaultdict, deque  
  
n, m = map(int, input().split())  
graph = defaultdict(list)  
in_degree = [0] * (n + 1)  
for _ in range(m):  
    a, b = map(int, input().split())  
    graph[a].append(b)  
    in_degree[b] += 1  
queue = deque()  
result = []  
for i in range(1, n + 1):  
    if in_degree[i] == 0:  
        queue.append(i)  
        result.append(i)  
  
while queue:  
    prev = queue.popleft()  
    for node in graph[prev]:  
        in_degree[node] -= 1  
        if in_degree[node] == 0:  
            queue.append(node)  
            result.append(node)  
  
print(*result)
```