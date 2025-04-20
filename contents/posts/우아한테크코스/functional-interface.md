---
title   : 함수형 인터페이스는 무엇이고, 람다와 어떤 관계가 있나요?
date    : 2023-03-28 09:31:18 +0900
updated : 2023-03-28 09:36:48 +0900
tags     : 
- 우테코
- 레벨1
- 학습로그
---

## 함수형 인터페이스란?

함수형 인터페이스는 1개의 추상 메소드를 갖는 인터페이스를 말한다.
SAM(Single Abstract Method) 인터페이스라고도 한다.

default method, static method는 포함되어도 상관 없다.

### 함수형 인터페이스 생성하기

```java
@FunctionalInterface
public interface Calculator {
	int sum(int x, int y);
	public default void defaultMethod();
	public static void staticMethod();
}
```

이렇게 추상 메서드를 하나만 갖도록 만들면 된다.

`@FunctionalInterface` 어노테이션은 없어도 되지만, 인터페이스 검증과 유지보수를 위해 붙여주는 게 좋다. 어노테이션을 사용하면 해당 인터페이스가 1개의 함수만을 갖도록 제한하게 된다. 여러 개의 함수를 선언하면 컴파일 에러가 발생한다.

## 함수형 인터페이스와 람다의 관계

### 람다란?

함수를 하나의 식으로 표현한 것이다. 메소드의 이름이 필요 없어 익명 함수의 한 종류로 볼 수 있다.

```java
public void printHello() {
	System.out.println("Hello");
}
```

위의 함수를 람다식으로 변환하면 다음과 같다. 

```java
() -> System.out.println("Hello");
```

함수형 인터페이스의 인스턴스를 만드는 방법으로 사용될 수 있고, 코드를 줄일 수 있다.

### 함수형 인터페이스 구현

함수형 인터페이스를 구현하는 방법에는 클래스를 이용하는 방법과 람다를 이용한 방법이 있다.

인터페이스는 구현 클래스를 만들고 만든 클래스의 인스턴스를 생성해서 사용하는 과정을 거칠 수 있다.

```java
class NormalCalculator implements Calculator {
	@Override
	int sum(int x, int y) {
		return x + y;
	}
}

class Main {
	public static void main(String[] args) {
		NormalCalculator normal = new NormalCalculator();
		int value = normal.sum(2, 3);
	}
}
```

다만 이 방법은 구현 클래스가 한 번만 사용되고, 다른 곳에서는 사용되지 않는 경우 클래스 파일이 계속해서 생성되는 문제가 있다.

클래스를 생성하지 않고 익명 클래스를 생성하여 구현하는 방법도 있다.

```java
class Main {
	public static void main(String[] args) {
		Calculator anonymousCalculator = new Calculator() {
			@Override
			int sum(int x, int y) {
				return x + y;
			}
		};
		int value = anonymousCalculator.sum(2, 3);
	}
}
```

익명 클래스를 생성하면 클래스를 명시적으로 정의하지 않고 바로 구현체를 정의할 수 있다. 클래스 선언 비용을 줄이고 코드 간결화를 위해 익명 클래스를 사용한다.

### 람다를 사용한 함수형 인터페이스 선언

람다를 사용하면 더욱 간결하게 선언할 수 있다.

인터페이스에 추상 메서드가 하나이므로 인터페이스 구현 자체가 하나의 메서드 구현만을 의미한다. 즉, 함수와 같은 개념으로 이해할 수 있다. 
따라서 람다 표현식을 이용하여 함수를 구현할 수 있다.

```java
class Main {
	public static void main(String[] args) {
		Calculator lambdaCalculator = (x, y) -> x + y;
		int value = lambdaCalculator.sum(2, 3);
	}
}
```

위의 코드들과 비교했을 때 코드의 직관성과 코드 길이가 차이가 나는 것을 볼 수 있다.
람다식은 담길 변수의 타입에 해당하는 인터페이스를 사용하도록 만들어졌다.
해당 인터페이스의 매개변수와 리턴타입만 맞춰주면 나머지는 알아서 처리한다.

## 함수형 인터페이스를 사용하는 이유

행위(함수)도 하나의 값으로 취급하기 위함이다. 
함수를 하나의 값으로 취급해서, 함수들을 조립하고 배치하면서 개발하기 위해 함수형 인터페이스를 사용한다.

1. 동시성 side effect를 없앨 수 있다 : 기능을 하는 함수를 이용해 Side-effect가 없도록 선언형으로 개발한다.
2. 구조적으로 유연하고 간결해진다 : 코드 재사용 단위가 클래스였던 것이 함수 단위로 가능하게 해주어 유연한 개발이 가능하다. 클래스 사이의 복잡한 연계를 줄일 수 있어 구조적으로 간결해진다.

### 이번 주 스터디 피드백

<베로오>
이해가 잘 됐다. cooool 하다.
기본 제공하는 함수형 인터페이스를 왜 패키지로 제공하는지에 대한 내용도 있었으면 좋았겠다.

<헤에나>
화면을 좀 자주 왔다갔다 해서 집중이 잘 안 됐다.
추상 클래스 쪽 예시가 맞는 예시였는지 모르겠다. (베로 생각)
페이지에 숫자라도 있었으면 좋았겠다.

<훛추>
예외의 발생 비용이 뭘까? -> 예외가 발생하면 어디서부터 발생했는지 찾는 스택 추적 비용이 발생하는데 비용이 크다.

꼼꼼한 사용 방법 좋았다.
메서드 구현체 내부 보여준 거 좋았다.
예시가 있었다면 어땠을까?

<포오이>
굉장히 꼼꼼하게 준비했다. 굉꼼. 잘 보았다. 고생했다.
내용이 알차다.