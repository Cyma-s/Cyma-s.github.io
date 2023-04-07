---
title   : 왜 ArrayList의 add는 boolean을 리턴할까?
date    : 2023-02-21 14:56:13 +0900
updated : 2023-02-27 15:28:47 +0900
tags     : 
- 개발
---
**틀린 내용이 있을 수 있습니다. 모든 지적을 환영합니다.**

## ArrayList의 add

- 리스트 미니 미션을 수행하다가 들었던 궁금증이었다. ```void add(int index, String value)```와 ```boolean add(String value)```는 뭐가 다르길래 리턴 타입이 다를까? 궁금하지 않는가?
- 강의에서 ArrayList의 boolean add는 항상 true를 리턴해서 왜 그렇게 구현했는지 모르겠다는 이야기를 들었다. 나도 그때 당시 그 말에 공감했다. 그런데 index로 값을 추가하는 메서드의 리턴 타입은 'void'라는 것이 뭔가 이상했다.

## Collection

정답은 Collection 인터페이스에 존재한다.
Collection에 ```boolean add(E e)``` 의 docs를 확인해보자.

```
Returns {@code true} if this collection changed as a result of the call.  
Returns {@code false} if this collection does not permit duplicates and already contains the specified element.
```
```호출의 결과로 이 컬렉션이 변경된 경우 true를 반환한다. 이 컬렉션에서 중복을 허용하지 않고 지정된 요소가 이미 포함되어 있으면 false를 반환한다.```

즉, Collection의 boolean add(E e)는 중복을 허용하지 않는 하위 컬렉션의 경우를 고려해서 만든 것이다!

```
add를 지원하는 컬렉션은 이 컬렉션에 추가할 수 있는 요소에 제한을 둘 수 있다. 특히 일부 컬렉션에서는 null 요소의 추가를 거부하고 다른 컬렉션에서는 추가할 수 있는 요소의 유형에 제한을 가한다.
Collection 클래스는 문서에 추가할 수 있는 요소에 대한 제한 사항을 명확하게 명시해야 한다.

Collection이 이미 요소를 포함하고 있다는 이유 이외의 이유로 특정 요소 추가를 거부하는 경우 false를 반환하지 않고 예외를 발생시켜야 한다. 이렇게 하면 이 호출이 반환된 후 컬렉션에 항상 지정된 요소가 포함된다는 불변성이 유지된다.
```

## ArrayList의 add 함수

```
public boolean add(E e) {
         modCount++;
         add(e, elementData, size);
         return true;
     }
```
     
```
public void add(int index, E element) {
        rangeCheckForAdd(index);
	modCount++;
	final int s;
	Object[] elementData;
	if ((s = size) == (elementData = this.elementData).length)
		elementData = grow();
	System.arraycopy(elementData, index, elementData, index + 1, s - index);			      elementData[index] = element;						              
	size = s + 1;
}
```
이제 이 부분을 이해할 수 있다. ArrayList는 중복을 허용하므로 false가 리턴되는 경우가 없어 항상 true를 리턴하는 것이다.

## 왜 리턴 타입이 다를까?

- 아래 참고 링크를 통해 답을 유추할 수 있었다. 우리가 add 메서드를 생각할 때, 리턴 타입이 void일 것이라고 예상하는 게 당연하다. 그런데 add 메서드는 Collection 인터페이스에 포함되어 있는 함수로, ArrayList, HashSet 등 Collection 클래스들은 모두 동일한 메서드 시그니처를 오버라이딩하여 구현한다.
- HashSet의 add 함수는 ArrayList와 달랐다. HashSet의 add는 다음과 같다.

```
public boolean add(E e) {
        return map.put(e, PRESENT)==null;
	    }
```
(HashSet은 HashMap을 사용해서 구현된다)

ArrayList와는 다르게 항상 true를 리턴하는 것이 아닌, 값의 존재 여부를 판단하고 true/false를 리턴한다. 즉, HashSet에서의 boolean add는 필요하다는 것이다. add 자체에서 값의 존재 여부를 판단한 후, 값의 삽입 여부를 호출부로 알려줘야 하기 때문이다.

## contains로 확인한 다음에 add를 하면 void로 구현할 수 있지 않을까?

(여기서부터는 약간의 뇌피셜이 있습니다.)
- 싱글 스레드 환경에서는 괜찮을 수 있지만, 멀티 스레드 환경에서는 critical할 수 있다. 예를 들어 다른 스레드가 값을 추가하는 동시에 내 스레드에서 contains를 수행하여 값이 포함되었는지 여부를 확인할 수 있다. 이때 동시성이 제대로 체크되지 않을 가능성이 있다. (이 부분은 커널 코드를 보지 않았기 때문에 확실하지 않음)
- 즉, 방금 값 추가를 시도해서 값이 존재할 수 있지만 동일한 자료구조에 동시에 접근하게 되어 내 스레드의 contains에서는 존재하지 않는다는 리턴값을 받을 수도 있다는 것이다. 따라서 이 경우에 set.contains와 set.add는 single/atomic한 행동이어야 한다. 그러므로 add에서 boolean을 리턴하는 것이 contains와 add를 동시에 실행하는 atomic operation 이어야 한다고 볼 수 있다.
- HashSet과 같은 Collection의 구현체에서 boolean add의 필요성이 존재하므로, Collection의 add 함수의 리턴 타입은 boolean이 되어야 할 것이다. void를 리턴하게 되면 중복을 허용하지 않는 하위 컬렉션의 경우 위험성이 커지게 된다. ArrayList의 경우 그런 경우를 체크할 필요가 없으므로 항상 true를 리턴하는 코드를 작성한 것이다.

## 그렇다면 ArrayList의 add(int index ...)의 리턴 타입은 왜 void 인가?

- 해당 메서드는 index 위치에 값을 삽입하라는 메서드이다. index가 존재하는 Collection에서만 필요하므로 Collection의 메서드에는 빠져있는 것을 볼 수 있었다.
- index를 다루는 Collection에서는 값을 넣지 못하는 경우가 존재하지 않으므로 굳이 boolean type을 쓸 이유가 없다. 따라서 리턴 타입을 void로 설정한 것으로 보인다.

## 참고 링크
- [stackoverflow 참고 자료](https://stackoverflow.com/questions/24173117/why-does-list-adde-return-boolean-while-list-addint-e-returns-void)
