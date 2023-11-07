---
title: 11/7 인터뷰 질문 준비
date: 2023-11-06 22:30:43 +0900
updated: 2023-11-07 00:36:46 +0900
tags: 
---

## Problems

1. Given two strings s1 and s2, write a function that returns if the two strings are equal in a case-insensitive way.
2. Expand the first function such that it returns True if the edit distance between s1 and s2 is 1 or lower.
	- edit distance is a way of quantifying how dissimilar two strings are to one another, that is measured by counting the minimum number of opertaion required to transform one string into the other. You can insert, delete, or modify a single character in a string. For example, the abc and the abcd have an edit distance of 1 because the character d was inserted.
3. Expand the function to take a third parameter designating the comparison tolerance between s1 and s3 to be 'n' edit distances or lower. 

유니코드의 경우에도 동일하게 동작할까요?
-> Would it behave the same when comparing Unicode?

시간 복잡도, 공간 복잡도가 어느 정도인가?
-> So what is the time and space complexity of this algorithm as you have implemented it?

파이썬의 upper 함수의 시간 복잡도는 어느 정도인가요?
-> What is the time complexity of the Python upper function?

what is the best and worst case runtime and space complexity of this one?

파이썬의 문자열은 불변이기 떄문에 upper 를 호출하면 새 문자열을 반환해야 한다. 아까 말한 게 best case, worstcase, always-case 인가요?
-> Was that best-case, worst-case, or always-case?

가장 좋은 경우에 O(N) 시간이 걸리지 않도록 최적화할 수 있을까요?
-> Can we optimize it so that it takes O(N) time in the best case?