---
title: 최소 공통 조상 (Lowest Common Ancestor)
date: 2023-12-06 20:44:30 +0900
updated: 2023-12-07 14:48:05 +0900
tags:
  - algorithms
---

## LCA 알고리즘이란?

두 정점 u, v 에서 가장 가까운 공통 조상을 찾는 알고리즘을 말한다.  

## 일반적인 LCA 풀이

1. 루트 노드를 기준으로, DFS 탐색을 하며 각 노드의 트리의 depth 와 부모 노드를 저장한다. 
2. LCA 를 구하기 위한 a, b번 노드가 주어지면, 해당 두 노드의 상위 노드를 조회하며 노드의 h 를 같은 높이로 맞춘다. 
3. 각 부모 노드가 일치할 때까지 비교하며 구한다. (최상위 LCA는 루트노드인 1)

이러한 풀이를 매우 편향된 트리에 적용하게 되면, 엄청나게 많은 반복 횟수로 값을 구해야 한다는 단점이 있다.

```python
import sys  
  
sys.setrecursionlimit(10 ** 5)  
input = sys.stdin.readline  
  
  
class Node:  
    def __init__(self, key):  
        self.key = key  
        self.parent = None  
  
  
def get_depth(node):  
    depth = 0  
    while node is not None:  
        node = node.parent  
        depth += 1  
    return depth  
  
  
def find_lca(node1, node2):  
    # 두 노드의 깊이를 맞춥니다.  
    depth1 = get_depth(node1)  
    depth2 = get_depth(node2)  
    while depth1 > depth2:  
        node1 = node1.parent  
        depth1 -= 1  
    while depth2 > depth1:  
        node2 = node2.parent  
        depth2 -= 1  
  
    # 두 노드가 만날 때까지 부모를 따라 올라갑니다.  
    while node1 != node2:  
        node1 = node1.parent  
        node2 = node2.parent  
  
    return node1  
  
  
t = int(input().strip())  
for _ in range(t):  
    n = int(input().strip())  
    graph = [Node(i) for i in range(n + 1)]  
    for _ in range(n - 1):  
        a, b = map(int, input().strip().split())  
        graph[b].parent = graph[a]  
    one, two = map(int, input().strip().split())  
    node = find_lca(graph[one], graph[two])  
    print(node.key)
```

노드 객체를 생성하는 데 $O(N)$, 트리를 구성하기 위해 n-1 개의 간선에 대해 루프를 돌며 부모 노드를 설정하는 데 $O(N)$ 이 걸린다. 

`get_depth` 함수는 한 노드의 루트 깊이를 찾는 데 $O(h)$ 의 시간이 걸린다. 두 노드에 대해 이를 수행하기 때문에, 최악의 경우 $O(2h)$ 가 된다.  

트리가 균형적으로 구성되어 있으면 h 는 $logN$ 에 가깝지만, 최악의 경우 h 는 n에 가까워진다. 따라서 전체 시간 복잡도는 $O(n + 2h)$ 가 되며, 최악의 경우 $O(2n)$ 이 걸릴 수 있다.  

## 비트마스킹과 DP 로 LCA 구하기

LCA 의 시간 복잡도를 결정하는 것은 각 노드의 깊이를 구하는 과정과 LCA 를 구하는 과정이다.  
DP 를 사용하면 각 노드의 깊이를 구하는 과정의 시간 복잡도는 증가하지만, LCA 를 구하는 쿼리의 시간 복잡도를 효과적으로 줄일 수 있다.  

### 구현

```python
import math  
  
  
class Node:  
    def __init__(self, value, children=None):  
        self.value = value  
        self.children = children if children is not None else []  
  
  
class LCAFinder:  
    def __init__(self, root, n):  
        self.max_depth = math.ceil(math.log2(n))  
        self.ancestor = [[-1 for _ in range(self.max_depth)] for _ in range(n)]  
        self.depth = [0] * n  
        self.dfs(root, -1, 0)  
  
    def dfs(self, node, parent, depth):  
        if node is None:  
            return  
        self.ancestor[node.value][0] = parent  
        self.depth[node.value] = depth  
        for child in node.children:  
            self.dfs(child, node.value, depth + 1)  
        for i in range(1, self.max_depth):  
            if self.ancestor[node.value][i - 1] != -1:  
                self.ancestor[node.value][i] = self.ancestor[self.ancestor[node.value][i - 1]][i - 1]  
  
    def find_lca(self, u, v):  
        if self.depth[u] < self.depth[v]:  
            u, v = v, u  
        for i in range(self.max_depth - 1, -1, -1):  
            if self.depth[u] - (1 << i) >= self.depth[v]:  
                u = self.ancestor[u][i]  
        if u == v:  
            return u  
        for i in range(self.max_depth - 1, -1, -1):  
            if self.ancestor[u][i] != self.ancestor[v][i]:  
                u = self.ancestor[u][i]  
                v = self.ancestor[v][i]  
  
        return self.ancestor[u][0]
```

### 설명

- 왜 $2^i$ 번째 조상을 찾기 위해 $2^{i-1}$ 번째 조상의 $2^{i-1}$ 번째 조상이 필요할까?

트리가 다음과 같이 구성되어 있다고 가정하자.  

```markdown
         1
       /   \
      2     3
     / \   / \
    4   5 6   7
```

각 노드의 $2^0$ 번째 조상은 자기 자신의 부모 노드이므로, `self.ancestor[node.value][0]` 은 `parent` 이다.  
노드 4의 $2^1$ 번째 조상을 찾기 위해, 먼저 노드 4의 $2^0$ 번째 조상인 노드 2를 찾는다. 그러고 나서, 노드 2의 $2^0$ 번째 조상인 노드 1을 찾는다. 즉, 노드 4의 $2^1$번째 조상은 노드 1이다. 결국 찾고자 하는 노드의 $2^{i-1}$ 번째 조상의 다시 $2^{i-1}$ 조상을 찾게 되면 $2^{i-1} + 2^{i-1} = 2^i$ 로 찾고자 하는 노드의 $2^i$ 번째 조상을 찾을 수 있다. 

그렇다면 $2^i$ 번째 조상이 존재하지 않을 때는 어떻게 될까?

노드 4의 $2^2$번째 조상을 찾기 위해, 먼저 노드 4의 $2^1$ 번째 조상인 노드 1을 찾는다. 그리고 나서, 노드 1의 $2^1$번째 조상을 찾는다. 하지만 노드 1은 루트 노드이므로 더 이상 조상이 없기 때문에, 노드 4의 $2^2$ 번째 조상은 존재하지 않는다. 

- `find_lca` 에서 첫 번째 반복문을 지났을 때 u, v 의 깊이는 언제나 같은가?

`find_lca` 에서 첫 번째 for 문을 지나고 나면, 반드시 u와 v의 깊이는 같아진다.  
`depth[u]` 에서 `1 << i` 값을 뺀 값이 여전히 `depth[v]` 보다 깊다면 조상 노드로 거슬러 올라가는 과정을 계속해서 진행하는데, 이때 모든 정수는 2의 거듭제곱으로 표현 가능하기 때문에 해당 반복문을 지나고 나면 반드시 u, v는 같아지게 된다. u의 깊이가 v보다 깊은 경우에는 이미 조상 노드로 거슬러 올라가기 때문이다.  

### 시간 복잡도

