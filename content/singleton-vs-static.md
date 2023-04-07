---
title   : singleton vs static class
date    : 2023-03-12 22:38:47 +0900
updated : 2023-03-12 22:45:18 +0900
tags     : 
- 우테코
- 레벨1
- 학습로그
---

## 글을 쓰게 된 배경

망고가 1단계 블랙잭 미션을 리팩터링하다 나에게 질문했다.

> InputView를 static method를 갖는 util 클래스로 구현하는 것과 싱글턴으로 구현하는 것의 차이는 뭘까?

나는 그 질문에 명쾌하게 답하지 못했다.
내 1단계 블랙잭 미션은 ```InputView``` 가 util 클래스로 구현되어 있었다. 딱히 이유가 있냐고 하면... 막연히 싱글턴 패턴이 안티 패턴이라고 해서 안 썼던 것 뿐이었다. 

나중에 비슷한 구현을 하게 될 때 둘 중에 어떤 걸 쓸 지 결정하기 위해 이 글을 썼다.

## Singleton(싱글턴) 패턴

위키 백과에서는 다음과 같이 정의한다.

> [소프트웨어 디자인 패턴](https://ko.wikipedia.org/wiki/%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4_%EB%94%94%EC%9E%90%EC%9D%B8_%ED%8C%A8%ED%84%B4)에서 **싱글턴 패턴**(Singleton pattern)을 따르는 클래스는, 생성자가 여러 차례 호출되더라도 실제로 생성되는 객체는 하나이고 최초 생성 이후에 호출된 생성자는 최초의 생성자가 생성한 객체를 리턴한다. 이와 같은 디자인 유형을 **싱글턴 패턴**이라고 한다.

즉, 싱글턴 패턴이란 단 하나의 인스턴스만 생성하여 사용하는 디자인 패턴이다.

가장 간단한 싱글턴 예제는 다음과 같다. 

```
public class Singleton() {
	// Singleton 객체를 static으로 선언한다.
	private static Singleton instance;

	// 생성자를 private으로 선언한다.
	private Singleton() {}

	public static Singleton getInstance() {
		if(instance == null) {
			this.instance = new Singelton();
		}
		return instance;
	}
}
```

생성자를 private으로 선언하여 외부에서 객체를 생성하지 못하도록 막는다.
객체를 생성할 수 없지만, 정적 팩토리 메서드를 통해 인스턴스를 전달받을 수 있다.

그렇지만 문제가 일어날 수 있는 부분은 너무나도 잘 보인다. 바로 동시성 문제다!

멀티스레드 환경에서는 두 개 이상의 스레드가 ```getInstance()```를 수행하는 경우 두 개 이상의 인스턴스가 생성되는 문제가 생길 수 있다.

```
public class Main {  
    public static void main(String[] args) {  
        Runnable runnable = () -> {  
            Singleton singleton = Singleton.getInstance();
            System.out.println(singleton.hashCode());  // hashcode 출력
        };  
  
        for(int i = 0; i<10; i++) {  
            Thread thread = new Thread(runnable);  
            thread.start();  
        }  
    }
}
```

```
결과
1448770673
1784999009
1784999009
1784999009
1784999009
1784999009
1784999009
1784999009
1784999009
1784999009
```

분명 싱글턴이라고 했는데 hashcode가 다르다. 왜일까?

이유는 모든 스레드가 동시에 도착하여 객체가 생성되지 않은 null 임을 확인하게 되기 때문이다. 스레드가 도착했을 때 instance가 null 이므로 스레드들이 계속해서 객체를 생성하게 되는 것이다.

동시성을 보장할 때 가장 자주 사용되는 방법은 Holder initialization 방법이다.

```
public class Singleton {  
    private Singleton() {}  
  
    public static Singleton getInstance() {  
        return LazyHolder.INSTANCE;  
    }  
  
    private static class LazyHolder {  
        private static final Singleton INSTANCE = new Singleton();  
    }  
}
```

holder 안에 선언된 instance가 static 이기 때문에 클래스 로딩 시점에 한 번만 호출된다는 것을 이용한다. 클래스 로딩 시에는 thread-safe가 보장되기 때문에 객체가 단 한 번만 생성된다.

## 정적 메서드 (static method)

정적 메서드는 클래스의 인스턴스 없이 호출이 가능한 메서드이다.

```
public static void printValue(final String value) {
	System.out.println(value);
}
```

클래스의 인스턴스가 아닌 클래스와 연결되므로 힙의 Permanent Generation 영역에 저장된다.


## 싱글턴 vs 정적 메서드

드디어 본론이다. 그래서 뭘 쓰는 게 좋다는 걸까?

### 싱글턴 장점

- 런타임 다형성을 활용할 수 있다.
- 인터페이스를 구현할 수 있다.
- 객체로 존재하므로 싱글턴을 매개변수로 다른 메서드에 전달할 수 있다.

### 싱글턴 단점

- 너무 많은 일을 위임하거나 공유하는 경우 coupling이 많아지고 결합도가 높아진다. 결합도가 높아짐에 따라 수정이 어려워지고 테스트하기 어려워진다.
- 아무 객체나 자유롭게 접근하고 수정하고 공유할 수 있는 전역 상태를 갖게 되어 안정성이 떨어진다.

### 정적 메서드의 장점

- 매번 인스턴스를 생성하기 위해 생성자를 호출하지 않아도 되므로 낭비되는 메모리를 줄일 수 있다.
- 객체를 생성하지 않고 사용 가능하기 때문에 속도가 빠르다.

### 정적 메서드의 단점

- static을 사용하게 되면 프로그램 시작부터 끝까지 메모리에 할당된 채로 남아있다. static 영역은 Garbage Collector의 관리를 받지 않기 때문에 프로그램이 종료될 때까지 메모리에 존재하게 된다.
- 오버라이드가 불가능하며, 객체와 관련이 없기 때문에 절차지향적 성향이 강하다고 볼 수 있다. 무분별한 사용이 객체 지향을 해칠 수 있다.

## 결론

**주관적인 결론**

싱글턴은 단 하나의 클래스 인스턴스만 필요하고, 모든 곳에서 동일한 상태를 유지하고 싶은 경우 사용한다. 이후 클래스 확장을 통한 메서드 재정의가 필요한 경우에 사용한다.

정적 클래스는 mocking 하기 어렵기 때문에 테스트가 어렵지만, 싱글톤은 mocking 하는 것이 쉽기 때문에 테스트 작성이 용이하다.

그러나 정적 메서드는 내부 상태를 변경할 필요가 없고, 매개 변수에 대해서만 작동한다면 정적 메서드를 사용할 수 있다. 또한 다형성이 필요 없고 앞으로 객체 지향을 적용할 필요가 없을 때도 사용 가능하다.
메서드에 대한 전역 접근만 제공하는 경우, 정적 클래스를 사용하는 것을 고려해볼 수 있다.

지금까지의 미션들은 이후 view가 콘솔이 아닌 다른 것으로 변경될 수 있으므로 변경이 용이해야 한다. 얼마든지 추가적인 확장이 생길 수 있으므로 미션에서는 싱글턴을 사용하는 것이 좋을 듯 하다.

## 참고 자료

- https://tecoble.techcourse.co.kr/post/2020-11-07-singleton/
- https://tecoble.techcourse.co.kr/post/2020-07-16-static-method/
- https://javarevisited.blogspot.com/2013/03/difference-between-singleton-pattern-vs-static-class-java.html#axzz7vkYkDfOH