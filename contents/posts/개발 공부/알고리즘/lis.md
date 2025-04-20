---
title   : LIS - 가장 긴 증가하는 부분 수열
date    : 2023-07-05 22:25:18 +0900
updated : 2023-07-05 22:25:47 +0900
tags     : 
- 알고리즘
- 이분탐색
- DP
---

## LIS 길이 구하기

### 이분탐색

#### C++

```cpp
#include <iostream> 
#include <vector>  
#include <algorithm>

int main() {
	int N = 6;   // 입력되는 수열의 길이
	int arr[6] = {1, 2, 4, 3, 5, 6}    // 입력되는 수열
	int dp[6];

	int max_length = 0;   // arr[i]가 들어갈 위치

	for(int i = 0; i<N; i++) {
		int index = lower_bound(arr, arr + max_length, arr[i]) - arr;    // arr[i]를 넣을 수 있는 첫 번째로 나오는 크거나 같은 값의 인덱스
		dp[index] = arr[i];

		if(max_length == index) {  // LIS의 최대 길이가 업데이트되면 (최장 수열의 길이를 구하기 위한 배열인 dp에 값이 1개 있었는데 2개가 된 경우)
			max_length++;   // 이제 다음 위치에 값이 들어가야 하므로 증가시킨다.
		}
 	}
 	
	cout << max_length;
}
```

#### Python

```python
import bisect

x = int(input())
arr = list(map(int, input().split()))

dp = [arr[0]]

for i in range(x):
	if arr[i] > dp[-1]:
		dp.append(arr[i])
		continue
	index = bisect.bisect_left(dp, arr[i])
	dp[index] = arr[i]

print(len(dp))
```

## LIS의 원소 구하기

### 이분탐색

```cpp
#include <iostream> 
#include <vector>  
#include <algorithm>

int N = 6;   // 입력되는 수열의 길이
int arr[6] = {1, 2, 4, 3, 5, 6}    // 입력되는 수열
int dp[6];  // LIS의 후보가 될 값들을 저장해두는 배열
int dp_idx[6];   // dp_idx[i]: arr[i] 가 dp의 어디에 저장이 되었는지 저장한다.

// dp_index: dp의 인덱스 값
// dp_idx_index: 초기값은 길이의 최댓값, 
void print(int lis_index, int index) {
	if(lis_index < 0 || index < 0) return;
	if(dp_idx[index] == lis_index) { // dp에 담긴 값의 인덱스 값이 index와 같으면 출력
		print(lis_index - 1, index - 1);
		cout << arr[index] << " ";
	}
	else print(lis_index - 1, index);
}

int main() {

	int max_length = 0;   // arr[i]가 들어갈 위치

	for(int i = 0; i<N; i++) {
		int index = lower_bound(arr, arr + max_length, arr[i]) - arr;    // arr[i]를 넣을 수 있는 첫 번째로 나오는 크거나 같은 값의 인덱스
		dp[index] = arr[i];
		dp_idx[i] = index;  // arr[i] 가 저장된 dp의 인덱스를 dp_idx[i]에 저장한다. 

		if(max_length == index) {  // LIS의 최대 길이가 업데이트되면 (최장 수열의 길이를 구하기 위한 배열인 dp에 값이 1개 있었는데 2개가 된 경우)
			max_length++;   // 이제 다음 위치에 값이 들어가야 하므로 증가시킨다.
		}
 	}
 	
	cout << max_length;

	// 출력은 여러 가지 방법이 있다.
	print(N-1, max_length - 1);  // (1)

	// (2) -> 메모리를 많이 쓰고 시간도 더 들지만 인지 비용이 덜 든다.
	vector<int> result;  
  
	for (int i = N; i >= 1; i--) {  
	    if (dp_idx[i] == max_length - 1) {  
	        result.push_back(arr[i]);  
	        max_length--;  
	    }  
	}  
	  
	for (int i = result.size() - 1; i >= 0; i--) {  
	    cout << result[i] << ' ';  
	}

}
```

## 참고

- https://maramarathon.tistory.com/57