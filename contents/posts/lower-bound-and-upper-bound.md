---
title: Lower Bound, Upper Bound
date: 2023-07-23 23:20:53 +0900
updated: 2023-11-27 17:26:29 +0900
tags:
  - 알고리즘
---
## upper bound

x 값보다 큰 값이 처음으로 나타나는 위치

### 인덱스로 찾기

```python
def upper_bound(lo, hi, target_index):  
    while lo < hi:  
        mid = (lo + hi) // 2  
        if dp[mid] <= a[target_index]:  
            lo = mid + 1  
        else:  
            hi = mid  
      
    return hi
```

### 값으로 찾기

```python
def upper_bound(lo, hi, value):
	while lo < hi:
		mid = (lo + hi) // 2
		if dp[mid] <= value:
			lo = mid + 1
		else: # dp[mid] > value  => 조건에 맞는 값이지만, 혹시나 dp[mid] 값보다 더 작은 값이 존재할 수도 있다.
			hi = mid
	return hi
```

```ad-warning
lo 는 조건에 맞지 않는 값이므로 이 값보다는 큰 값을 확인해야 한다.
hi 는 조건에 맞는 값이지만 혹시 다른 값이 value 보다 크지는 않은지 확인해야 한다.
```

## lower bound
 
x 값 이상인 값이 처음으로 나타나는 위치

### 인덱스로 찾기

```python
def lower_bound(lo, hi, target_index):  
    while lo < hi:  
        mid = (lo + hi) // 2  
        if dp[mid] >= a[target_index]:  
            hi = mid  
        else:  # dp[mid] < a[target_index] or value
            lo = mid + 1  
  
    return hi
```

### 값으로 찾기

```python
def lower_bound(lo, hi, value):
	while lo < hi:
		mid = (lo + hi) // 2
		if dp[mid] < value: # 조건에는 만족하지만, 더 큰 값이 있을 수도 있다.
			lo = mid + 1
		else: # 조건에 만족하는 값(value 가 존재하는 경우)과 만족하지 않는 값이다.
			hi = mid
	return lo
```

```ad-warning
lo 는 다음 루프에서 실패할 수도 있는 값을 넣어 검증하는 것이다. 
lo 와 hi 가 같아지는 경우는 반드시 조건에 만족하는 값이 되므로 lo 는 mid + 1 이어야 한다.
```

## lower_bound, upper_bound 의 불변식

불변식에 따라 $lo < hi$ 는 반복문 내부에서 불변이다.  
따라서 $lo < (lo + hi) / 2 < hi$ 도 성립한다.  

이때, $lo$ 와 $mid$ 는 모두 정수이기 때문에, $lo < mid < hi$ 가 성립한다는 뜻은 $lo$ 와 $mid$, $mid$ 와 $hi$ 의 차이는 1 이상이라는 뜻과 같다.  

즉, $mid$ 에 1을 더했을 때, 다음과 같은 식이 성립한다는 뜻이다.  

$$mid + 1 \le hi$$

while 루프의 내부가 끝났을 시점에는 언제나 $lo \le hi$ 가 성립한다. 그러므로 while 문이 끝났을 때는 반드시 $lo == hi$ 라는 것이 보장된다.  

결론: lo 를 리턴하나 hi 를 리턴하나 결과는 똑같을 것이다. 

## 주의할 점

- upper bound 에서 hi는 안 되는 값이어야 한다.
