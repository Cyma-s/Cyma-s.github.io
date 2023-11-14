---
title: 
date: 2023-11-14 10:04:05 +0900
updated: 2023-11-14 11:21:52 +0900
tags:
  - mit
  - algorithms
---

## Set Interface

- `build(A), len()` : given an iterable A, build sequence from items in A return the number of stored items
- `find(k)`: return the stored item with key k
- `insert(x)`: add x to set(replace item with key x.key if one already exists)
- `delete(k)`: remove and return the stored item with key k
- `iter_ord()`: return the stored items one-by-one in key order
- `find_min()`: return the stored item with smallest key
- `find_max()`: return the stored item with largest key
- `find_next(k)`: return the stored item with smallest key larger than k
- `find_prev(k)`: return the stored item with largest key smaller than k

if the only thing I care about is building up my entire set and searching it once, there's actually a faster algorithm. This is going to be needlessly confusing because we're going to see that this is really not the right way to implement it in about 38 seconds.

## How do I implement it if a set is unordered?

1. Just iterate from beginning to this array and say, is this guy erik? .... and return it.
	- in the worst case of really bad luck, your instructor is all the way at the end of the list.
	- That means that I have to walk along the entire array before I find him, So that algorithm takes order n time.
	- an unordered array is a perfectly reasonable way to implement this set interface. and then searching that array it will take linear time every single time I search

| Data Structure | Container | Static  | dynamic              | Order                  | Order                      |
| -------------- | --------- | ------- | -------------------- | ---------------------- | -------------------------- |
|                | build(A)  | find(k) | insert(x), delete(k) | find_min(), find_max() | find_prev(k), find_next(k) |
| Array          | n         | n       | n                    | n                      | n                          |
| Sorted Array               | $nlogn$           | $log n$         | n                      | 1                        | $logn$                            |

if I use the binary search, I can find the element which I want to find in $log n$ time

## 

Input: Array of n numbers/keys A 
Output: sorted array B

One is if your sort is destructive, d


## 단어

- intuition: 직관
- amortize: 알고리즘이 딱 한 번만 아주 나쁜 시간 복잡도를 가지지만 보통은 다른 시간 복잡도를 가질 때 쓰인다. 
- destructive