---
title: 디폴트 메서드(Default method)
date: 2023-03-19 22:46:45 +0900
updated: 2023-09-17 19:16:33 +0900
tags:
  - 레벨1
  - 우테코
  - 학습로그
  - Java
---

## 디폴트 메서드를 사용하는 이유

디폴트 메서드가 없던 때를 예로 들어보자.

```
public interface Vehicle {
	int getWheelCount();	
}
```

우리가 라이브러리 설계자이고, 바퀴의 개수를 가져오는 기능을 구현해야 하는 인기 있는 ```Vehicle``` 인터페이스가 있다고 가정하자.
생각해보니 해당 탈 것이 사륜구동인지 확인하는 ```isFourWheel``` 이라는 메서드가 있으면 좋을 거 같다.  

그래서 기존에 서비스되던 ```Vehicle``` 에 ```isFourWheel``` 을 추가했다. 

```
public interface Vehicle {
	int getWheelCount();
	boolean isFourWheel();
}
```

그런데 이전에 우리의 ```Vehicle```을 구현한 사용자에게는 문제가 생긴다.
이전에 해당 인터페이스를 구현했던 모든 클래스의 구현을 고쳐야 한다는 것이다! 

이렇게 공개된 API를 수정하면 기존 버전과의 호환성 문제가 발생한다.

이를 해결하기 위해 자바 8 부터는 디폴트 메서드를 지원한다.

## 디폴트 메서드란?

디폴트 메서드는 인터페이스에 있는 구현 메서드이다.

```default``` 키워드로 시작하며, method body를 포함한다.

```
public interface Vehicle {
	int getWheelCount();
	default boolean isFourWheel() {
		return getWheelCount() == 4;
	}
}
```

이렇게 Default 메서드를 정의할 수 있다. 
위의 예제에서 앞으로 ```Vehicle``` 인터페이스를 구현하는 모든 클래스는 ```isFourWheel```을 상속받는다.
```isFourWheel``` 을 따로 구현하지 않아도 메서드를 쓸 수 있게 된다.

### 디폴트 메서드 오버라이딩

디폴트 메서드는 기본 구현을 제공한다. 
인터페이스를 구현한 클래스가 디폴트 메서드의 기능을 다르게 구현하고 싶다면 오버라이딩을 사용할 수 있다.

## 디폴트 메서드 활용

### 선택형 메서드

기존 인터페이스에서 잘 사용하지 않던 메서드를 디폴트 메서드로 작성하여 인터페이스를 구현하는 클래스에서 빈 메서드 구현을 하지 않도록 한다.

```
interface Iterator<T> {
	boolean hasNext();
	T next();
	void remove();
}
```

```Iterator```의 remove는 잘 쓰이지 않는다.
그래서 Iterator를 구현하는 많은 클래스가 remove에 빈 구현을 제공했다.

```
public class ListIterator<E> implement Iterator<E> {
	List<E> list; 
	int cursor; 
	
	public ListIterator(List<E> list) { 
		this.list = list; 
	} 
	
	@Override 
	public boolean hasNext() { 
		return cursor < list.size(); 
	} 
	
	@Override 
	public E next() { 
		if (cursor == list.size()) throw new NoSuchElementException();
		return list.get(cursor++); 
	}

	@Override
	public void remove() {}
}
```

잘 사용하지 않는 remove를 디폴트 메서드로 만들면 다음과 같다.

```
interface Iterator<T> {
	boolean hasNext();
	T next();
	
	default void remove() {
		throw new UnsupportedOperationException();
	}
}
```

이렇게 구현하면 ```Iterator```를 구현하는 하위 클래스에서는 ```remove```를 따로 구현할 필요가 없다.

### 동작 다중 상속

자바에서 클래스는 한 개만 상속할 수 있지만 인터페이스는 여러 개 구현할 수 있다.

```
public interface Rotatable {
	void setRotationAngle(int angleInDegrees);
	int getRotationAngle();
	default void rotateBy(int angleIndegrees) {
		setRotationAngle((getRotationAngle() + angleInDegrees) % 360);
	}
}
```

```
public interface Moveable {
	int getX();
	int getY();
	void setX(int x);
	void setY(int y);
	
	default void moveHorizontally(int distance) {
		setX(getX() + distance);
	}
	
	default void moveVertically(int distance) {
		setY(getY() + distance);
	}
}
```

```
public interface Resizable {
	int getWidth();
	int getHeight();
	void setWidth(int width);
	void setHeight(int height);
	void setAbsoluteSize(int width, int height);

	default void setRelativeSize(int wFactor, int hFactor) {
		setAbsoluteSize(getWidth() / wFactor, getHeight() / hFactor);
	}
}
```

인터페이스를 조합해서 다양한 클래스를 만들 수 있다.

```
public Monster implements Moveable, Rotatable, Resizable {
	...
}
```

또한 디폴트 메서드의 구현을 더 효율적으로 고치는 경우, 해당 인터페이스를 구현하는 모든 클래스도 자동으로 변경한 코드를 상속받게 된다.

즉, 인터페이스의 디폴트 메서드를 수정하는 경우 인터페이스를 구현한 클래스들의 코드를 일일이 바꿔줄 필요가 없다. (메서드가 하위 클래스에서 재정의 되지 않은 경우에 한정된다)

## 디폴트 메서드를 왜 쓸까?

디폴트 메서드는 기존의 구현을 고치지 않고도 이미 공개된 인터페이스를 변경하기 위해 고안되었다.
기존의 코드를 최대한 수정하지 않으면서, 설계된 인터페이스에 새로운 확장을 가능하게 만든다.

## 참고 자료

- 모던 자바 인 액션 Ch 13