---
title: 11/8 DH 인터뷰 스터디
date: 2023-11-08 10:07:11 +0900
updated: 2023-11-08 16:29:09 +0900
tags: 
---

## 질문

1. If it seems easy, just think of it as a warm-up. So given an array of integers, find the most frequent integer.
	- So in other words write a method that takes an array of integers and returns an integer. How you handle the empty array is up to you. You can throw an exception, that 's not too important to me. So for example so if you were given 1 2 3 3, you would want to return 3. If there is no most frequent integer, if they all occur the same number of times, you can return any one.
	- And the array doesn 't have to be sorted.
	- yeah so let 's start with that. Um let 's see, so try to think out loud as much as possible and we 'll go from there.
2. I have another part of the question, so let 's go on to that before we think about optimizing it. 
	- given an array of integers and an integer n, print out all the pairs of integers whose sum is n.
	- your method can return void, it doesn 't have to return a list of pairs or anything, just print them out.
	- So for example if you 're given... the output should be 1 9 if you 're given something like 1 9 1 9 and 10 it should print 1 9 new line 1 9
	- 1 9 1 9 10 => 1 9 1 9
	- I 'm not picky about as long as it 's clear and if you 're given something like 1 9 1 and 10, you would only want to print out 1 9 once, you wouldn 't want to like you know use the 9 more than once, if that makes sense?
	- when you have duplicate numbers, you 're allowed to use it and then it 's sort of off limits to be used again. So I hope you can see the difference between the 2nd and 3rd examples.

### 조건

### 추가 질문

- What is the time complexity and space complexity of Arrays.sort?
- How do we find the max value? 

## 말

- 일단 시도해보고, 더 효율적인 해결책을 생각해보죠 
	- let 's just try that first, and then we can figure out how to write a more efficient solution because it 's good to start from something that works and optimize it.
- 시간 복잡도 / 공간 복잡도 
	- So what 's the time and space complexity of your code?
- 모든 정수는 양수이고, n 은 양수이다.
	- all of the integers are non-negative and you can also assume that n is positive.
- 테스트하고 싶은 다른 엣지 케이스가 있나요?
	- can you think of any other edge cases that we might want to test?
