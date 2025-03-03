---
title: 정렬 알고리즘
date: 2023-11-07 13:49:20 +0900
updated: 2023-12-01 00:55:31 +0900
tags:
  - algorithms
---

## 버블 정렬

서로 인접한 두 원소를 검사하여 정렬한다. 인접한 2개의 레코드를 서로 비교해서 크기가 순서대로 되어 있지 않으면 서로 교환한다.

### 구현

```java
void bubble_sort(int[] list, int n) {
	for(int i = n - 1; i > 0; i--) {
		for(int j = 0; j < i; j++) {
			temp = list[j];
			list[j] = list[i];
			list[i] = temp;
		}
	}
}
```

### 장점

구현이 매우 간단하다.
제자리 정렬이다.
안정 정렬로, 중복된 값을 입력 순서와 동일하게 정렬한다.

### 단점

최악, 최선, 평균 모두 $O(N^2)$ 로, 굉장히 비효율적이다.  
순서에 맞지 않은 요소를 인접한 요소와 교환한다.  
하나의 요소가 가장 왼쪽에서 가장 오른쪽으로 이동하기 위해서는 배열에서 모든 다른 요소들과 교환되어야 한다.  
특히 특정 요소가 최종 정렬 위치에 이미 있는 경우라도 교환되는 일이 일어난다.  

### 시간 복잡도

- 비교 횟수
	- 비교 횟수는 최상, 평균, 최악 모두 일정하다. 
	- 시간 복잡도는 $O(n(n-1) / 2)$, 즉 $O(N^2)$
- swap 횟수
	- 입력 자료가 역순으로 정렬되어 있는 최악의 경우, 한 번 교환하기 위해 3번의 이동이 필요하므로 $O(3n(n-1) / 2)$
	- 입력 자료가 이미 정렬되어 있는 최상의 경우 자료의 이동이 발생하지 않는다.

### 공간 복잡도

$O(N)$

정렬하고자 하는 배열 안에서 교환하는 방식이므로 입력 배열 외에 다른 추가 메모리를 요구하지 않는 정렬 방법이다. 

## 삽입 정렬

현재 비교하고자 하는 target 과 그 이전의 원소들과 비교하며 자리를 교환하는 정렬 방법이다.

정렬의 대상이 되는 데이터 외에 추가적인 공간이 필요하지 않기 때문에 제자리 정렬이다. 

### 구현

```java
for(int i = 1; i<size; i++) {
	int target = a[i];
	int prev = i - 1;
	while(prev >= 0 && target < a[prev]) {
		a[j + 1] = a[j];
		j--;
	}
	a[j + 1] = target;
}
```

### 장점

1. 추가적인 메모리 소비가 적다.
2. 거의 정렬된 경우 매우 효율적이다. 최선의 경우 $O(N)$ 의 시간복잡도를 갖는다.
3. 안정 정렬이 가능하다.

### 단점

1. 역순에 가까울수록 비효율적이다. 최악의 경우 $O(N^2)$ 의 시간 복잡도를 갖는다.
2. 데이터의 상태에 따라 성능 편차가 매우 크다.

### 시간 복잡도

타겟 숫자가 이전 숫자보다 크기 전까지 반복하기 때문에 이미 정렬이 되어 있는 경우 항상 타겟 숫자가 이전 숫자보다 크다. 즉, 최선의 경우 $O(N)$ 의 복잡도를 갖는다.

최악의 경우는 타겟 숫자가 이전 숫자보다 항상 작기 때문에 결국 N 번째 숫자에 대해 N-1 번을 비교해야 한다. 즉, 최악의 경우 $O(N^2)$ 의 시간 복잡도를 보인다.

## 계수 정렬



### 구현

```java
public void radix_sort(int[] arr, int[] counting, int[] result) { // counting 배열은 0으로 초기화되어 있다.
	for(int i = 0; i<arr.length; i++) {
		counting[arr[i]]++;
	}
	for(int i = 1; i<counting.length; i++) {
		counting[i] += counting[i-1];
	}

	for(int i = arr.length - 1; i >= 0; i--) {
		int value = arr[i];
		counting[value]--;
		result[counting[value]] = value;
	}
}
```

### 단점

- counting 배열이라는 새로운 배열을 선언해야 하기 때문에, max 값의 범위에 따라 counting 배열의 길이가 달라진다. 
	- 수열의 길이보다 수의 범위가 극단적으로 크면 메모리가 낭비될 수 있다.

### 시간 복잡도

$O(N)$

## Merge Sort

분할 정복 알고리즘이다. 

1. 분할: 배열을 반으로 나누어 두 부분으로 분할한다. 하나의 요소가 남을 때까지 계속한다.
2. 정복: 각 부분을 재귀적으로 정렬한다. 단일 요소 배열은 정렬된 것으로 간주한다. 
3. 결합: 정렬된 부분 배열들을 하나의 배열로 합친다. 이 과정에서 두 배열의 가장 작은 요소들을 비교하면서, 작은 순서대로 새 배열에 복사하여 전체 배열이 정렬된다. 

### 구현

```java
public class MergeSort {

    // 배열을 정렬하는 메인 메서드
    public static void sort(int[] array) {
        if (array.length < 2) {
            return; // 배열의 크기가 1이하면 정렬할 필요가 없음
        }

        // 배열을 두 부분으로 나눔
        int mid = array.length / 2;
        int[] leftHalf = new int[mid];
        int[] rightHalf = new int[array.length - mid];

        // 데이터를 두 부분으로 복사
        System.arraycopy(array, 0, leftHalf, 0, mid);
        System.arraycopy(array, mid, rightHalf, 0, array.length - mid);

        // 각 부분을 재귀적으로 정렬
        sort(leftHalf);
        sort(rightHalf);

        // 정렬된 부분을 합침
        merge(array, leftHalf, rightHalf);
    }

    // 두 부분 배열을 합치는 메서드
    public static void merge(int[] array, int[] leftHalf, int[] rightHalf) {
        int i = 0, j = 0, k = 0;

        // 왼쪽과 오른쪽 배열을 비교하며 정렬하여 병합
        while (i < leftHalf.length && j < rightHalf.length) {
            if (leftHalf[i] <= rightHalf[j]) {
                array[k++] = leftHalf[i++];
            } else {
                array[k++] = rightHalf[j++];
            }
        }

        // 남은 요소들을 복사
        while (i < leftHalf.length) {
            array[k++] = leftHalf[i++];
        }

        while (j < rightHalf.length) {
            array[k++] = rightHalf[j++];
        }
    }
}

```

### 장점

- 안정 정렬이 가능하다. 
- 최악, 평균, 최선의 경우 모두 $O(nlogn)$ 의 시간 복잡도를 갖는다. 대규모 데이터 정렬에 효율적인 알고리즘이다.

### 단점

- 추가적인 배열이 필요하므로, 제자리 정렬 알고리즘보다 더 많은 메모리를 요구한다. 
- 작은 배열에 대해서는 다른 정렬 알고리즘이 더 빠를 수 있다.