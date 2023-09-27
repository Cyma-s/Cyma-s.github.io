---
title   : 최소 신장 트리 (MST)
date    : 2023-09-05 22:12:20 +0900
updated : 2023-09-05 22:12:30 +0900
tags     : 
- algorithm
---

## Spanning Tree

그래프 내부의 모든 정점을 포함하는 트리

트리의 특수한 형태이기 때문에, 모든 정점들이 연결되어 있어야 하며 사이클을 포함해서는 안 된다.  
즉, 그래프의 n 개의 정점을 n-1 개의 간선으로 연결해야 한다.

## MST

Spanning Tree 중에서 사용된 간선들의 가중치 합이 최소인 트리를 의미한다.  
모든 정점들을 가장 적은 수의 간선과 비용으로 연결한다.  

Spanning Tree 의 조건을 충족하면서, 간선의 가중치 합이 최소여야 한다.   

## 구현 방법

### Kruskal Algorithm

그리디하게 모든 정점을 최소 비용으로 연결하는 답을 찾는다.  
이전 단계에서 만들어진 Spanning Tree 와는 상관 없이 무조건 최소 간선만을 선택한다.  

#### 순서

1. 그래프의 간선들을 가중치 오름차순으로 정렬한다.
2. 정렬된 간선 리스트에서 간선을 선택한다.
	1. 가장 낮은 가중치를 먼저 선택한다.
	2. 사이클을 형성하는 간선을 제외하고, union 연산을 수행한다.

#### 코드

```python
def find(x):  
    if parent[x] == x:  
        return x  
    parent[x] = find(parent[x])  
    return parent[x]  
  
  
def union(x, y):  
    x_parent = find(x)  
    y_parent = find(y)  
  
    if x_parent == y_parent:  
        return  
    if rank[x_parent] < rank[y_parent]:  
        parent[x_parent] = y_parent  
    else:  
        parent[y_parent] = x_parent  
        if rank[x_parent] == rank[y_parent]:  
            rank[x_parent] += 1  
  
  
def kruskal():  
    global edges, weights, heap, n  
    parent = [i for i in range(n + 1)]  
    result = set()  
    edges.sort()  
  
    for edge in edges:  
        weight, a, b = edge  
        if find(a) != find(b):  
            union(a, b)  
            result.add(a)  
            result.add(b)  
            weights += weight
```

## 참고
- https://gmlwjd9405.github.io/2018/08/28/algorithm-mst.html
- https://ssabi.tistory.com/60