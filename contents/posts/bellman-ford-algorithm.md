---
title   : 벨만-포드 알고리즘 정리
date    : 2023-08-24 16:28:23 +0900
updated : 2023-08-24 16:28:39 +0900
tags     : 
- algorithm
- graph
---

## 벨만-포드 알고리즘

한 노드에서 다른 노드까지의 최단 거리를 구하는 알고리즘이다.    
다익스트라 알고리즘과는 달리, 간선의 가중치가 음수일 때도 최단 거리를 구할 수 있다.     

정점 - 1 번의 매 단계마다 모든 간선을 전부 확인하면서 모든 노드간의 최단 거리를 구한다.     
언제나 다익스트라 알고리즘에서의 최적의 해를 포함하게 된다.

시간복잡도는 O(VE) 로 느리다.    

### 다익스트라 알고리즘

방문하지 않은 노드들 중에서 현재 노드에서 최단 거리가 가장 짧은 노드를 선택하여 한 단계씩 최단 거리를 구한다.    

PQ 를 사용한 개선된 다익스트라 알고리즘을 사용했을 때 시간 복잡도는 O(E log V) 이다.     

## 수행 과정

1. 출발 노드를 설정한다.
2. 출발 노드의 최단 거리 테이블을 초기화한다.
3. 다음의 과정을 (정점의 개수 - 1) 만큼 반복한다.
	1. 모든 간선 E 개를 하나씩 확인한다.
	2. 각 간선을 거쳐 다른 노드로 가는 비용을 계산하여 최단 거리 테이블을 갱신한다.

음수 간선 사이클이 존재하는지 확인하기 위해서는 3번 과정을 한 번 더 수행하여, 최단 거리 테이블이 갱신되는 경우 음수 간선 사이클이 존재한다고 판단할 수 있다.      

> 어떻게 음수 간선 사이클이 존재한다고 판단할 수 있을까?

사이클이 존재하는 경우, 사이클을 계속해서 돌면서 사이클 내부의 노드에서 다른 노드로 가는 비용을 무한히 줄일 수 있다.      
원래는 3번의 과정을 마쳤을 때, 모든 노드를 확인하여 최단 거리가 확정되었기 때문에 더 이상 값이 변경되지 않는다.

## 코드

BOJ 11657 의 정답과 동일하다.

```python
import sys  
  
input = sys.stdin.readline  
INF = float('inf')  
  
n, m = map(int, input().strip().split())  
graph = list()  
  
for _ in range(m):  
    a, b, cost = map(int, input().strip().split())  
    graph.append((a, b, cost))  
  
  
def bellman_ford(start):  
    dist = [INF] * (n + 1)  
    dist[start] = 0  
    for i in range(n):  
        for start, next_node, cost in graph:  
            if dist[start] != INF and dist[next_node] > dist[start] + cost:  
                if i == n - 1:  
                    return -1  
                dist[next_node] = dist[start] + cost  
    return dist  
  
  
result = bellman_ford(1)  
if result == -1:  
    print(-1)  
else:  
    for i in range(2, n + 1):  
        print(result[i] if result[i] != INF else -1)
```

## 주의할 점

벨만-포드 알고리즘은 |V| - 1 만큼 순회하므로 O(V), 매번 O(E) 만큼 탐색하므로 O(|V||E|) 가 된다.    

그런데 밀집 그래프의 경우 E 는 V^2 에 가까워지므로, 최악의 경우 O(V^3) 이 된다. 
(밀집 그래프는 간선의 수가 최대 간선의 수에 가까운 그래프를 말한다.)

다익스트라 알고리즘에 비해 시간 복잡도가 높으므로, 벨만-포드 알고리즘은 간선의 가중치에 음수가 존재할 경우에만 채택하는 것이 좋다.     