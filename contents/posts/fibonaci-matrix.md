---
title   : 행렬 곱셈으로 피보나치 수 구하기
date    : 2023-07-22 22:17:28 +0900
updated : 2023-07-22 22:17:41 +0900
tags     : 
- 알고리즘
---

보통 피보나치 수열은 O(N) 으로 구할 수 있다.    
그런데 [피보나치 수 6](https://www.acmicpc.net/problem/11444) 에서는 N이 1,000,000,000,000,000,000 이다..ㅋㅋㅋ N 이 엄두도 안 난다 ㄷㄷ

이런 경우에 사용할 수 있는 행렬 곱셈으로 피보나치 수열을 구하는 방법이 있다.     
미래의 나를 위한 글이기 때문에 증명은 생략한다. 

```python
def solve(n):  
    if n == 1:  
        return BASE  
  
    half = solve(n // 2)  
    value = multiply(half, half)  
    if n % 2 == 1:  
        value = multiply(value, solve(1))  
    return value  
  
  
def multiply(a, b):  
    result = [[0, 0], [0, 0]]  
    for i in range(2):  
        for j in range(2):  
            for k in range(2):  
                result[i][j] += a[i][k] * b[k][j]  
            result[i][j] %= p  
    return result  
  
  
n = int(input())  
BASE = [[1, 1], [1, 0]]  
p = 1000000007  
  
print(solve(n)[0][1])
```

풀이는 행렬 곱셈과 완전히 동일하다.     
단순히 `BASE = [[1, 1], [1, 0]]` 를 N번 곱하면 된다. 이때, 피보나치 수열의 N번째 값은 BASE 를 N번 곱한 값의 `[0][1]` 값이나, `[1][0]` 값이다.