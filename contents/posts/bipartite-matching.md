---
title: 이분 매칭
date: 2023-10-15 21:00:32 +0900
updated: 2023-11-07 13:48:56 +0900
tags:
  - algorithms
---

## Hall's Theorem

special condition, 즉 degree-constrained 에서만 동작한다.

### 어떻게 no bottleneck 인지 알까?

degree-constrained => no-bottlenecks
if every girl likes >= d boys and every boy likes <= d girls then no-bottleneck

say set S of girls has e incident edges. (e is cardinality)

$$d * |s| <= e <= d * |E(S)|$$

d: 어떤 상수 (여기서는 어떤 정의역이 치역과 연결된 최대 개수)
S: 정의역 전체 집합
E(S): 치역 전체 집합
e: 정의역과 치역을 연결하는 전체 간선의 개수

$$정의역의 크기 * (정의역과 치역이 연결된 최대 개수) <= 전체 간선 개수 <= 치역의 크기 * (정의역과 치역이 연결된 최대 개수)$$

즉, 정의역의 최대 cardinality 가 치역의 최대 cardinality 보다 크거나 같다면 언제나 bottleneck 이 생기지 않는다. 

## 이분 매칭 알고리즘

### 이분 그래프

두 개의 정점 그룹이 존재할 때 모든 간선(경로)의 용량이 1이면서 양쪽 정점이 서로 다른 그룹에 속하는 그래프를 이분 그래프라고 한다.

이러한 이분 그래프에서 한 쪽 그룹은 X 그룹, 다른 한 쪽 그룹은 Y 그룹이라고 할 때 모든 경로의 방향은 X -> Y 인 그래프의 최대 유량을 구하는 것을 이분 매칭이라고 한다.

**규칙**

- 매칭: 어떤 정점이 그것을 가리키는 위치의 다른 정점을 점유한 상태
- 각 정점은 한 개씩만 점유 가능하다.
- 간선의 용량은 1이다.
