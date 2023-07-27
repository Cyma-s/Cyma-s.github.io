---
title   : Lower Bound, Upper Bound
date    : 2023-07-23 23:20:53 +0900
updated : 2023-07-24 22:49:18 +0900
tags     : 
- 알고리즘
---
## upper bound

x 값보다 큰 값이 처음으로 나타나는 위치

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

## lower bound
 
x 값 이상인 값이 처음으로 나타나는 위치

```python
def lower_bound(lo, hi, target_index):  
    while lo < hi:  
        mid = (lo + hi) // 2  
        if dp[mid] >= a[target_index]:  
            hi = mid  
        else:  
            lo = mid + 1  
  
    return hi
```

## 주의할 점
- upper bound 에서 hi는 안 되는 값이어야 한다.
