---
title: 이분 매칭
date: 2023-10-15 21:00:32 +0900
updated: 2023-10-15 21:57:05 +0900
tags: 
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

### general case

1. suppose no bottlenecks. 

lemma: No bottlenecks with in any set S of girls.

if S a set of girls with |S| = |E(S)|

만약 정의역 집합과 치역 집합의 원소 수가 똑같다면, 