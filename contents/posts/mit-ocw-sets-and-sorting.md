---
title: MIT 4. sets and sorting
date: 2023-11-14 10:04:05 +0900
updated: 2023-11-15 16:11:36 +0900
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

## Set

Input: Array of n numbers/keys A 
Output: sorted array B

One is if your sort is destructive, what that means is that rather than reserving some new memory for my sorted array B and then putting a sorted version of A into B, a destructive algorithm is one that just overwrites A with a sorted version of A.

Some sorts are in place, meaning that not only are they destructive, but they also don't use extra memory in the process of sorting. (Uses $O(1)$ extra space)

Any time I just make a temporary variable like a loop counter, that's going to count toward that order 1. But the important thing is that the number of variables I need doesn't scale in the length of the list.

## Permutation Sort

```python
def permutation_sort(A):
	# Sort A
	for B in permutations(A):
		if is_sorted(B):
			return B
```

I know that if I have an input that's a list of numbers, there exists a permutation of that list of numbers that is sorted by definition because a sort is a permutation of your original list.

list every possible permutation, and then just double check which one's in the right order.

There's two key pieces to this particular technique, one is that we have to enumerate the permutations.

1. Enumerate permutations
	- If I have a list of n numbers, how many different permutations of n number are there? -> $n!$
	- It might be that like actually listing permutations takes a lot of time for some reason, like every permutation.
	- at the very least, each one of these things looks like n factorial. $\Omega(n!)$
2. check if that particular permutation is sorted
	- for i equals 1 to n minus 1, B[i] less than or equal to B[i + 1]
	- how long does this algorithm take? -> this step incurs order n time because theta of n time ($\theta(n)$), 

=> our algorithm takes at least n! times n time ($\Omega(n! *n)$)
omega means lower bound.

## Selection sort

It is that everything to the right of this little red line that I've drawn here is in sorted order.

- what does selection sort do?
	- it just kept choosing the element which was the biggest and swapping it into the back and then iterating.

### recursive

we're going to divide it into two chunks.
One of them is find me the biggest thing in the first i elements of my array.  
And the next one is to swap it into place and then sort everything to the left.

1. Found the biggest with index less than or equal to i
2. Swap
3. Sort 1, ... i-1

```python
def prefix_max(A, i):
	# Return index of maximum in A[:i+1]
	if i > 0:
		j = prefix_max(A, i-1)
		if A[i] < A[j]:
			return j
	return i
```

Base case: i = 0

if my runtime is a function s, well, for one thing, if my array has one element in it, it returns i.
So in other words, it's $\theta(1)$ 
S of n ($S(n)$) is equal to S of n minus 1 ($S(n-1)$) plus theta of 1 ($\theta(1)$)
S of n maybe look something like $cn$ for some constant c that doesn't depend on n.

I've guessed that s of n is theta of n.
$cn = c(n-1) + \theta(1)$ (I can subtract cn from both sides)
=> $c = \theta(1)$ 

```python
def selection_sort(A, i = None):
	if i is None: i = len(A) - 1
	if i > 0:
		j = perfix_max(A, i)
		A[i], A[j] = A[j], A[i]
		selection_sort(A, i - 1)
```

the first thing I'm going to do find is find the max element between 0 and i. And then I'm going to swap it into place. Then step3 is I still have to sort everything to the left of index i and that's that recursive call.

let's call that t for time. 

$T(n) = T(n-1) + \theta(n)$ => $\theta(n^2)$
$T(n)^{2}= cn^2$
$cn^{2} = c(n-1)^{2}+ \theta(n) = cn^{2}- 2cn + c + \theta(n)$
$\theta(n) = 2cn - c$

by the way, notice that this order n swallowed up the order 1 computations that I had to do to swap and so on.

## merge sort

I'm going to make a new sorted list, which is twice as long.

```python
def merge_sort(A, a = 0, b = None):
	if b is None: b = len(A)
	if 1 < b - a:
		c = (a + b + 1) // 2
		merge_sort(A, a, c)
		merge_sort(A, c, b)
		L, R = A[a:c], A[c:b]
		merge(L, R, A, len(L), len(R), a, b)
```

```python
def merge(L, R, A, i, j, a, b):
	if a < b:
		if (j <=0 ) or (i > 0 and L[i-1] > R[j-1]):
			A[b-1] = L[i-1]
			i = i-1
		else:
			A[b-1] = R[j-1]
			j = j-1
		merge(L, R, A, i, j, a, b-1)
```

First of all, how long does it take to sort an array of length 1? $T(1)$ => $\theta(1)$
$T(n) = 2T(n/2)+ \theta(n)$  => $T(n) = \theta(nlogn)$
$cnlogn = 2c\frac{n}{2}log\frac{n}{2}+ \theta(n) = cn(logn - log2) + \theta(n)$
=> $\theta(n) = cnlog2$

## 질문

- What is the time complexity of implementing set with a sorted array?
	- When I build a set using sorted array, It takes order N log N. And If I want to get element in a set, It takes order log N because of the binary search to find the element. If I insert or delete an element in the set, it takes order n time because the time that copy the original array exists. If I want to find the minimum or the maximum value in the array, It takes O of 1 
- Can you explain destructive in sorting?
	- The destructive sort is to sort original array. So the original array is not preserved. That's the destructive sorting.
- Can you explain the process of merge sort?
	- Merge sort is to sort the array using divide and conquer method. First, I'm going to split the range of the array into half. And then do it again and again until the splitted range size is one. Next, I can sort the size 1 array easily. And next, I'm going to merge two arrays into one array until the merged array size equals the original array. That's the process of the merge sort.
	- Can you describe the process of the merge function?
		- First, I have two pointers to point the ends of two arrays. I call two arrays A and B, and call two pointers p1 and p2. If p1 of a is bigger than p2 of b, I'm going to put it into the end of another array, C. Next, I'll subtract one from p1 and the pointer of C. If p2 of b is bigger than p1 of a, I'm going to put it into the left on the end of C. Then I'll call the method recursively, terminating the recursion when the pointer to C arrives at the beginning of C.
- Can you explain the process of selection sort?
	- First, I'm going to divide it into two chunks. Next, I'll find the biggest thing in the first i elements of my array. And the next, I will swap it into place and then sort everything to the left.
	- What is the time complexity of the selection sort?
		- let's call that t for time. T of one is theta of one. And T of n is t of n minus one plus theta n.

## 단어

- intuition: 직관
- amortize: 알고리즘이 딱 한 번만 아주 나쁜 시간 복잡도를 가지지만 보통은 다른 시간 복잡도를 가질 때 쓰인다. 
- destructive: 원본 배열이 변경되는 정렬
- incur: (좋지 않은 결과를) 초래하다.
- at the end of the day: 결국 가장 중요한 것은
- in a funny fashion
- defer: 미루다
- recitation: 구답
- tautology: 동어 반복
- put together: 합치다.

delete 는 insert 와 같이 취급함.
is equal to
replace to
