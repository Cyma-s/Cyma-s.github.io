---
title: monitor lock과 synchronized
date: 2023-08-21 16:31:47 +0900
updated: 2023-10-11 16:21:52 +0900
tags:
  - java
  - os
  - cs
---

## Lock

### 왜 사용할까?

1. critical section 에 대해 상호 배제 (mutual exclusion) 을 제공한다. 공유 데이터를 한 스레드만 접근할 수 있도록 제한하는 것을 의미한다.
2. 스레드 간의 협업 또는 동기화의 역할을 수행한다. 어떤 작업을 완료하거나 특정 상태에 도달하는 경우 다른 스레드에 알려주어 해당 스레드가 동작할 수 있도록 한다.

## 생산자 소비자 문제 3.5, 6.1

생산자 프로세스는 정보를 생산하고, 소비자 프로세스는 정보를 소비한다.  

사과 10개를 담을 수 있는 바구니가 있다고 하자.  
생산자는 바구니에 사과를 1개 넣고, 소비자는 바구니에서 사과를 1개씩 먹는다. 바구니의 크기는 10으로 고정되어 있고, 더 많은 양을 넣을 수 없다. 

해당 상황을 코드로 표현하면 다음과 같다.  

생산자는 다음과 같이 행동할 것이다.  

```java
while (true) {
	while (count == BASKET_SIZE) {
		// 아무것도 하지 않는다.
	}

	buffer[in] = apple;
	in = (in + 1) % BASKET_SIZE;  // 마지막 버퍼 포인터 위치 변경
	count++;
}
```

소비자는 다음과 같이 행동할 것이다. 

```java
while (true) {
	while (count == 0) {
		// 아무것도 하지 않는다.
	}

	out = (out + 1) % BASKET_SIZE;
	count--;
}
```

각 코드를 개별적으로 수행하면 올바르게 동작하지 않을 것이다.  count 가 5일 때 생산자와 소비자가 동시에 count++, count-- 를 수행하면 count 는 4, 5, 6 의 값을 가질 수 있다. 동시성이 보장되지 않는 것이다.  

## 세마포어의 한계 6.7

잘못 사용하면 발견하기 어려운 타이밍 오류를 야기할 수 있다. 해당 타이밍 오류들은 특정 실행 순서로 실행되었을 때만 발생하고, 이런 순서가 항상 발생하는 것은 아니기 때문에 찾기 굉장히 어렵다.

반드시 wait -> signal 의 순서로 사용해야 하는데, 개발자의 실수로 다음과 같은 코드가 작성되면 다양한 유형의 오류들이 너무나도 쉽게 발생할 수 있다. 

```java
/* 1 */
signal(semaphore);
// critical section
wait(semaphore);

/* 2 */
wait(semaphore);
// critical section
wait(semaphore);
```

이를 해결하기 위해 동기화 도구를 통합하여 고급 언어 구조물을 제공하면, 개발자의 오류를 최대한 막을 수 있을 것이다.

## Monitors 6.7

모니터 타입은 모니터 내부에서 상호 배제가 보장되는 프로그래머가 정의한 일련의 연산자 집합을 포함하는 ADT 이다.  
또한 모니터 내에 정의된 함수만이 오직 모니터 내에 지역적으로 선언된 변수들과 형식 매개변수들에만 접근할 수 있다. 마찬가지로 모니터 내의 지역 변수는 오직 지역 함수만이 접근할 수 있다.  

모니터 구조를 사용하면 모니터 안에 항상 하나의 프로세스만이 활성화되도록 보장해준다. 그러므로 프로그래머가 이와 같은 동기화 제약 조건을 명시적으로 코딩할 필요가 없다. 

### 부가적인 동기화 기법

동기화 기법들은 `condition` 이라는 구조물로 제공될 수 있다. 자신의 On-Demand 동기화 기법을 작성할 필요가 있는 프로그래머는 `condition` 형의 변수를 정의할 수 있다.  

```java
condition x, y;
```

`condition` 형 변수에 호출될 수 있는 연산은 `wait()` 과 `signal()` 만이 가능하다.  
`x.wait()` 은 해당 연산을 호출한 프로세스는 다른 프로세스가 `x.signal()` 을 호출할 때까지 일시 중지되어야 한다는 것을 의미한다.  

`x.signal()` 연산은 정확히 하나의 일시 중지 프로세스를 재개한다. 일시 중지된 프로세스가 없으면 `signal` 연산은 아무런 효과가 없다. 즉, x의 상태는 마치 연산이 전혀 실행되지 않는 것과 같다. 

`x.signal()` 연산이 프로세스 P 에 의해 호출될 때, 조건 x와 연관된 suspend 된 프로세스 Q 가 있다고 가정하자. 당연하게도 일시 중지된 스레드 Q 가 실행을 재개한다면, signal 을 보낸 스레드 P는 반드시 대기해야 한다. 그렇지 않으면 P와 Q가 모니터 안에서 동시에 활성화된다.  

그러나 두 프로세스는 개념적으로 실행을 계속할 수 있다는 사실을 유의해야 한다. 다음과 같은 두 가지 가능성이 있을 수 있다. 

1. Signal and wait: P는 Q가 모니터를 떠날 때까지 기다리거나 다른 조건을 기다린다.
2. Signal and continue: Q는 P가 모니터를 떠날 때까지 기다리거나 또는 다른 조건을 기다린다. 

P가 이미 모니터 안에서 실행되고 있었기 때문에, signal-and-continue 옵션을 선택하는 것이 더 합리적인 것처럼 보인다. 그러나 만약 스레드 P 를 계속하도록 허용한다면, Q가 재개될 때까지 Q가 기다리고 있는 논리적 조건이 이미 참이 아닐 수도 있다. 

두 가지 방법을 절충한 방법도 있다. 스레드 P 가 `signal()` 연산을 실행하면 즉시 모니터를 떠나고 Q 를 즉시 재개한다. 

### 세마포어로 모니터 구현

각 모니터마다 `mutex` 라는 이진 세마포가 정의되고 그 초기 값은 1이다. 프로세스는 모니터로 들어가기 전에 `wait(mutex)` 를 실행하고, 모니터를 나온 후에 `signal(mutex)` 를 실행한다.

모니터 구현 시 signal-and-wait 기법을 사용한다. (왜지?) Signaling 프로세스는 실행 재개되는 프로세스가 모니터를 떠나든지, 아니면 `wait()` 할 때까지 그 자신이 다시 기다려야 하므로 `next` 라는 이진 세마포어가 추가로 필요하게 되고, 0으로 초기화한다. Signaling 프로세스는 자신을 중단시키기 위해 `next` 를 사용한다. 정수형 변수 `next_count` 도 `next` 에서 일시 중지 되는 프로세스 개수를 세기 위해 사용한다.  

```java
wait(mutex);
...
body of F
...

if(next_count > 0) {   // 일시 중지된 프로세스 수가 있는 경우
	signal(next);
}
else {
	signal(mutex);
}
```

조건 변수를 세마포어로 구현하는 방법은 다음과 같다.  

```java
x_count++;
if(next_count > 0) {
	signal(next);
}
else {
	signal(mutex);
}
wait(x_sem);
x_count--;
```

`x.signal()` 연산은 다음과 같이 구현할 수 있다. 

```java
if(x_count > 0) {
	next_count++;
	signal(x_sem);
	wait(next);
	next_count--;
}
```

위와 같은 코드로 모니터를 구현하는데 사용될 수 있다. 

### 모니터 내에서 프로세스 수행 재개

조건 변수 x에 여러 프로세스가 일시 중지 되어 있고, 어떤 프로세스가 `x.signal()` 연산을 수행했다면 일시 중지된 프로세스 중 어느 프로세스가 수행 재개될 것인가를 어떻게 결정할까?

가장 간단한 방법은 FCFS 순이다. 즉, 가장 오래 기다렸던 프로세스가 가장 먼저 깨어난다. 그러나 많은 경우 이런 간단한 스케줄링 기법은 충분하지 않다.  

이때 conditional-wait 구조를 사용할 수 있다. 

```java
x.wait(c);
```

c는 정수 expression 이고, 수식은 `wait()` 연산이 호출될 때 값이 계산된다.  
c의 값은 우선순위 번호라고 불리고, 일시 중지되는 프로세스의 이름과 함께 저장된다.  
`x.signal()` 이 수행되면 가장 작은 우선순위 번호를 가진 프로세스가 다음번에 수행 재개 된다.  

`ResourceAllocator` 는 한 개의 자원을 여러 프로세스 사이에 할당해 준다. 각 프로세스는 자원을 할당받기 원하면 그 자원을 사용할 최대 시간을 지정한다. 모니터는 이 중 가장 적은 시간을 희망한 프로세스에 자원을 할당해준다. 

```java
monitor ResourceAllocator {
	boolean busy;
	condition x;

	void acquire(int time) {
		if(busy) {
			x.wait(time);
		}
		busy = true;
	}

	void release() {
		busy = false;
		x.signal();
	}

	initialization_code() {
		busy = false;
	}
}
```

모니터의 개념은 위에서 예시한 순서가 그대로 지켜지는 것을 보장해주지는 않는다. 다음과 같은 문제가 발생할 수 있다. 

- 프로세스가 자원에 대한 허락을 받지 않고 자원을 액세스할 경우
- 프로세스가 자원에 대한 허락을 받은 다음 그 자원을 방출하지 않을 경우
- 프로세스가 자원에 대한 허락을 받지 않았는데도 그 자원을 방출할 경우
- 프로세스가 자원에 대한 허락을 받은 다음 방출하지 않은 상태에서 또 그 자원을 요청하는 경우

위 문제는 세마포어를 사용할 때도 동일한 문제가 발생한다.  
모니터처럼 프로그래머가 정의한 고급 연산의 올바른 사용법에서도 문제가 발생할 수 있는 것이다.  

이 문제를 해결하기 위한 방법은 자원 액세스 연산 자체를 `ResourceAllocator` 내부에 두는 것이다. 그러나 이렇게 하면 스케줄링을 우리가 코딩한 스케줄링 방식이 아닌 모니터 자체의 스케줄러에 맡기는 것과 다름 없다.  

따라서 프로세스들이 올바른 순서를 지키도록 보장하기 위해서는 `ResourceAllocator` 모니터와 모니터가 관리하는 자원을 사용하는 모든 프로그램을 검사해야 한다.  

이 시스템이 제대로 작동하는지를 알려면 두 가지를 검사해야 한다.  

1. 프로세스들이 모니터를 정확한 순서에 맞춰 호출해야 하는지 검사해야 한다.
2. 비협조적인 프로세스가 액세스 제어 프로토콜을 사용하지 않아서 모니터가 정한 상호 배제 규칙 경로를 무시하여 공유 자원을 직접 액세스하지 않는다는 것을 보장해야 한다. 

이 조건들이 보장됐을 때만 시간 종속적인 오류가 일어나지 않고, 따라서 원하는 스케줄링이 지켜진다는 것을 보장할 수 있다.  

## Java Monitors

Java 는 스레드 동기화를 위한 모니터와 같은 병생성 기법을 제공한다.  
`BoundedBuffer` 클래스는 생산자와 소비자 문제의 해결안을 구현한다.

Java 의 모든 객체는 하나의 락과 연결되어 있다. 메서드가 `synchronized` 로 선언된 경우 메서드를 호출하려면 객체와 연결된 락을 획득해야 한다.  
`BoundedBuffer` 클래스의 `insert()` 나 `remove()` 메서드와 같은 메서드를 정의할 때 `synchronized` 를 선언하면 `synchronized` 메서드가 된다. 

`synchronized` 메서드를 호출하려면 `BoundedBuffer` 의 객체 인스턴스와 연결된 락을 소유해야 한다.  
다른 스레드가 이미 락은 소유한 경우, `synchronized` 메서드를 호출한 스레드는 BLOCKED 되어 객체의 락에 설정된 `entry set` (진입 집합) 에 추가된다.  

### 진입 집합

진입 집합이란 락이 가용한 경우 호출 스레드가 객체 락의 소유자가 되어 메서드로 진입하고, 스레드가 메서드를 종료하면 락이 해제된다.  

락이 해제될 때 락에 대한 진입 집합이 비어있지 않으면 JVM 은 해당 집합에서 락 소유자가 될 스레드를 임의로 선택한다.  
('임의로' 라는 뜻은 java 명세가 해당 집합의 스레드를 특정 순서로 구성해야 한다는 것을 요구하지 않는다는 뜻이다. 그러나 실제로 대부분의 가상 머신은 FIFO 정책에 따라 진입 집합의 스레드를 정렬한다.)

### 대기 집합

락을 갖는 것 외에도 모든 객체는 스레드 집합으로 구성된 대기 집합과 연결된다.  
대기 집합은 처음에는 비어 있다가, 스레드가 `synchronized` 메서드에 들어가면 객체 락을 소유한다.  
그러나 해당 스레드는 특정 조건이 충족되지 않아 계속할 수 없다고 결정할 수 있다.  

ex. 생산자가 `insert()` 를 호출했는데 버퍼가 가득찬 경우, 스레드는 락을 해제하고 계속할 수 있는 조건이 충족될 때까지 기다린다.  

- [I] 블록 동기화
락이 획득된 시점과 해제된 시점 사이의 시간은 락 범위 (lock scope) 로 정의된다.  
공유 데이터를 조작하는 코드의 비율이 적은 `synchronized` 메서드는 너무 큰 락 범위를 생성할 수 있다.  
이런 경우 전체 메서드를 동기화하는 것보다 공유 데이터를 조작하는 코드 블럭만 동기화 하는 것이 좋다.  
이런 설계로 인해 락 범위가 더 작아진다.  

```java
public someMethod() {
	/* non-critical section */
	synchronized(this) {
		/*critical section*/
	}

	/* remainder section */
}
```

## Intrinsic Lock (고유 락)

Java 의 동기화는 Intrinsic Lock 또는 Monitor lock 으로 알려진 내부 엔티티를 중심으로 만들어졌다.  

고유 락은 동기화의 두 가지 측면, 객체의 상태에 대한 독점적 접근을 강제하고, 가시성에 필수적인 발생 전 관계를 설정하는 데 중요한 역할을 한다. 

객체의 필드에 대한 배타적이고 일관적인 접근이 필요한 스레드는 객체에 접근하기 전에 객체의 고유 락을 얻어야 하고, 접근이 완료되면 고유 락을 release(해제)해야 한다. 

스레드가 락을 획득한 시점부터 락을 해제한 때까지 '락을 소유했다' 라고 한다. 한 스레드가 고유 락을 소유하고 있는 경우, 다른 스레드는 동일한 락을 얻을 수 없다. 다른 스레드가 락을 얻으려고 시도하면 block 된다.

스레드가 고유 락을 해제하면 해당 작업과 다음에 동일한 락을 얻는 작업 간에 선후 관계가 설정된다.  

### synchronized 메서드의 락

`synchronized` 메서드를 호출하면 해당 메서드의 객체에 대한 고유 락을 자동으로 획득하고, 메서드가 리턴될 때 락을 해제한다.

정적 메서드의 경우 정적 `synchronized` 메서드가 호출되는 경우는 스레드가 클래스와 연관된 클래스 객체에 대한 고유 락을 획득하게 된다. (기반 되는 객체가 없으므로)  
따라서 클래스의 정적 필드에 대한 접근은 클래스의 모든 인스턴스에 대한 락과 구별되는 락으로 제어된다.  

- [?] 생성자에도 `synchronized` 가 가능한가?
➡️ 불가능하다. 대신 생성자의 바디 부분에 `synchronized` 를 넣어서 필요한 경우 동기화를 할 수는 있다.

### synchronized 코드

`synchronized` statement 를 사용하여 `synchronized` 코드를 만들 수 있다.  
`synchronized` statement 는 고유 락을 제공하는 객체를 지정해야 한다.  

```java
public void addName(String name) {
	synchronized(this) {
		lastName = name;
		nameCount++;
	}
	nameList.add(name);
}
```

위 예제에서 `addName` 메서드는 `lastName`, `nameCount` 의 변경 사항을 동기화해야 하지만, 다르나 객체의 메서드 호출은 동기화하지 않아야 한다. (synchronized statment 에서 다른 객체의 메서드를 호출하면 Liveness 문제가 발생할 수 있다. )

synchronized statement 가 없으면 `nameList.add` 를 호출하기 위한 목적으로만 동기화되지 않은 별도의 메서드가 있어야 한다.

synchronized statement 는 세분화된 동기화를 통해 동시성을 개선하는 데 도움이 된다.  

```java
public class MsLunch {
    private long c1 = 0;
    private long c2 = 0;
    private Object lock1 = new Object();
    private Object lock2 = new Object();

    public void inc1() {
        synchronized(lock1) {
            c1++;
        }
    }

    public void inc2() {
        synchronized(lock2) {
            c2++;
        }
    }
}
```

## Java의 고유 락 재진입 (Reentrancy)

스레드는 다른 스레드가 갖고 있는 락을 획득할 수는 없지만, 이미 소유하고 있는 락은 얻을 수 있다.  

```java
public class Reentrancy {
	public synchronized void a() {
		System.out.println("a");
	}

	public synchronized void b() {
		System.out.println("b");
	}

	public static void main(String[] args) {
		new Reentrancy().a();
	}
}
```

자바의 Intrinsic Lock 은 재진입 가능하다. (락의 획득이 호출 단위가 아닌 스레드 단위로 일어나기 때문에) 즉, 이미 락을 획득한 스레드는 같은 락을 얻기 위해 대기할 필요가 없다. 

만약 자바의 고유 락이 재진입 가능하지 않다면, 해당 코드는 a 메서드 내부의 b 를 호출하는 지점에서 self deadlock 이 발생할 것이다.  

### structured lock

고유 락을 이용한 동기화는 `structured lock` (구조적인 락) 이라고 한다. `synchronized` 블록 단위로 락의 획득 / 해제가 일어나므로 구조적이라고 한다. `synchronized` 블록을 진입할 때 락 획득이 일어나고, 블록을 벗어날 때 락의 해제가 일어난다. 따라서 구조적인 락 A, B가 있을 때 A 획득 -> B 획득 -> B 해제 -> A 해제는 가능하지만, A 획득 -> B 획득 -> A 해제 -> B 해제 는 불가능하다. 

이런 순서로 락을 사용해야 하는 경우 `ReentrantLock` 과 같은 명시적인 락을 사용해야 한다.  

### 가시성

락을 사용하면 가시성의 문제가 사라진다.  
Java 의 `synchronized` 키워드는 한 스레드가 수정한 내용이 다른 스레드에서 보이게 한다.  
즉, 스레드가 락을 획득하는 경우 그 이전에 쓰인 값들의 가시성을 보장한다.  

`synchronized` 블록에 들어갈 때와 나갈 때, 변수의 변경 사항은 모든 스레드에게 보여진다. 즉, 한 스레드가 `synchronized` 블록에서 변수를 수정하고 블록을 빠져나오면, 해당 변경 사항이 모든 스레드에 보여진다.

#### (안 넣을 내용) Java 의 `synchronized` 는 어떻게 가시성을 제공하는가?

**Java Memory Model (JMM)**
Java 프로그램의 동시성 동작을 정의한다. 여러 스레드가 어떻게, 언제 메모리를 볼 수 있는지에 대한 규칙을 제공한다. `synchronized` 는 JMM 규칙에 따라 동작한다.

가시성을 제공하는 메커니즘은 다음과 같다.
1. 스레드가 관련된 객체의 monitor lock 을 획득한다.
2. 스레드가 monitor lock 을 해제할 때, 해당 스레드의 로컬 메모리에 있던 변경 사항들이 주 메모리로 플러시 된다. 이로 인해 다른 스레드가 이후에 동일한 lock 을 획득하여 `synchronized` 블록에 들어갈 때, 해당 스레드가 가장 최근의 변경 사항들을 볼 수 있게 된다. 
3. JMM에는 happens-before 관계라는 개념이 존재한다. `synchronized` 의 happens-before 규칙은 이렇다. 
	- 스레드 A 가 monitor lock 을 해제하기 전에 수행한 모든 동작들은 스레드 B 가 동일한 모니터 락을 획득한 후에 수행하는 모든 동작들보다 먼저 일어난 것으로 간주된다.

- [?] happens-before 규칙?
다중 스레드 환경에서 메모리 동작의 순서와 가시성을 보장하기 위한 관계를 설명한다. 이 관계는 **메모리 쓰기가 특정 동작 후에 언제 메모리 읽기에 보이게 될 것인지를 정의하는 데**에 사용된다. 

happens-before 규칙의 일부는 다음과 같다.
1. **프로그램 순서 규칙**: 한 스레드 내에서, 한 문장이 다음 문장보다 앞서 있다면, 첫 번째 문장의 동작은 두 번째 문장의 동작보다 `happens-before` 관계에 있다.
2. **모니터(lock) 규칙**: `synchronized` 블록의 잠금 해제는 같은 락에 대한 후속 잠금 획득보다 `happens-before` 관계에 있다.
3. **volatile 변수 규칙**: `volatile` 변수에 대한 쓰기는 같은 변수에 대한 후속 읽기보다 `happens-before` 관계에 있다.
4. **스레드 시작 규칙**: 스레드 A에서 `Thread B.start()`를 호출하는 것은 스레드 B의 모든 동작보다 `happens-before` 관계에 있다.
5. **스레드 종료 규칙**: 스레드 A의 모든 동작은 다른 스레드 B에서 `A.join()`이 성공적으로 반환되기 전보다 `happens-before` 관계에 있다.
### Java Object 의 `wait()`, `notify()`

```java
package java.lang;  
  
public class Object {  
	...
    public final native void notify();  
  
    public final native void notifyAll();  
  
	public final void wait() throws InterruptedException {  
		wait(0L);  
	}  
	  
	public final native void wait(long timeoutMillis) throws InterruptedException;  
	  
	public final void wait(long timeoutMillis, int nanos) throws InterruptedException {  
	        if (timeoutMillis < 0) {  
	            throw new IllegalArgumentException("timeoutMillis value is negative");  
	        }  
	  
	        if (nanos < 0 || nanos > 999999) {  
	            throw new IllegalArgumentException(  
	                                "nanosecond timeout value out of range");  
	        }  
	  
	        if (nanos > 0 && timeoutMillis < Long.MAX_VALUE) {  
	            timeoutMillis++;  
	        }  
	  
	        wait(timeoutMillis);  
	    }  
	    
	    ...
	}
}
```

모든 자바 객체는 `Object` 를 상속받으므로, 모든 자바 객체가 `wait()`, `notify()` 를 갖게 된다.  
스레드가 어떤 객체의 `wait()` 를 호출하면 해당 객체의 intrinsic lock 을 얻기 위해 BLOCKED 상태로 진입한다.  

스레드가 어떤 객체의 `notify()` 를 호출하면 해당 객체 intrinsic lock 을 얻기 위해 해당 객체 intrinsic lock에 대기중인 스레드 하나를 깨운다.  

### `wait()` 메서드 호출 시

스레드가 `wait()` 메서드를 호출하면 다음과 같은 현상이 발생한다.  

1. 스레드가 객체의 락을 해제한다.
2. 스레드 상태가 BLOCKED 로 설정된다.  
3. 스레드는 해당 객체의 대기 집합으로 넣어진다.  

생산자가 `insert()` 메서드를 호출하고, 버퍼가 가득 찬 걸 확인하면 `wait()` 메서드를 호출한다.  
해당 호출은 락을 해제하고 생산자를 BLOCKED 하여 생산자를 개체의 대기 집합에 둔다. 생산자가 락을 해제했기 때문에 소비자는 궁극적으로 `remove()` 메서드로 진입하여 생산자를 위한 버퍼의 공간을 비운다.  

![[monitor-wait-set.png]]

소비자 스레드는 생산자가 진행할 수 있다는 것을 어떻게 알릴까?  
보통 스레드가 `synchronized` 메서드를 종료하면 이탈 스레드는 객체와 연결된 락만 해제하여 진입 집합에서 스레드를 제거하고 락 소유권을 넘겨준다. 
그러나 `insert()` 및 `remove()` 메서드 끝에서 `notify()` 메서드를 호출한다. 

```java
public synchronized void insert(E item) {
	while(count == BUFFER_SIZE) {
		try {
			wait();
		}
		catch (InterruptedException ie) { }
	}

	buffer[in] = item;
	in = (in + 1) % BUFFER_SIZE;
	count++;

	notify();   // notify 호출
}

/* Consumers call this method */
public synchronized E remove() {
	E item;

	while(count == 0) {
		try {
			wait();
		}
		catch (InterruptedException ie) { }
	}

	item = buffer[out];
	out = (out + 1) % BUFFER_SIZE;
	count--;

	notify();

	return item;
}
```

반드시 `synchronized` 블록 내에서만 호출이 가능하다. `wait()` 은 락 소유권을 넘겨주어야 하기 때문에, 만약 `wait()` 를 호출하는 스레드가 락을 소유하고 있지 않다면 에러가 발생한다.

- [!] `sleep()` 과의 차이점
`sleep()` 메서드는 현재 스레드를 잠시 멈추게만 할 뿐, 락의 소유권을 넘기지는 않는다. 잠든 스레드는 여전히 락을 가지고 있다. 이 때문에 우선순위가 낮은 스레드가 우선순위가 높은 스레드를 BLOCK 시키는 우선순위 역전 현상이 발생하기도 한다.

락을 소유하던 스레드는 락 소유권을 넘겨주면서 WAITING 또는 TIMED_WAITING 상태로 변하게 된다. WAITING, TIMED_WAITING 상태의 스레드는 `notify` 나 `notifyAll` 메서드를 호출하여 RUNNABLE 상태로 변경 가능하다. (TIMED_WAITING 스레드 경우에는 생성자를 이용하여 특정 시간을 설정하고 대기하고, 특정 시간이 지나면 자동으로 RUNNABLE 상태로 변경된다.)

### `notify()` 메서드 호출 시

1. Wait Set 의 스레드 리스트에서 임의의 스레드 T 를 선택한다. (보통 FIFO 로 선택된다.)
2. 스레드 T 를 Wait Set 에서 Entry Set 으로 이동한다. 
3. T의 상태를 BLOCKED 에서 Runnable 으로 설정한다. 

T는 이제 다른 스레드와 락 경쟁을 할 수 있다.  
T 가 락 제어를 다시 획득하면 `wait()` 호출에서 복귀하여 count 값을 다시 확인할 수 있다.  

### `notifyAll()` 메서도 호출 시

`wait()` 을 건 모든 스레드들을 한 번에 깨운다.

### 가정

`wait()` 및 `notify()` 메서드 

1. 생산자는 `insert()` 메서드를 호출하고, 락이 사용가능한지 확인한 후, 메서드로 진입한다. 메서드에 들어가면 생산자는 버퍼가 가득 찼음을 확인하고 `wait()` 을 호출한다. `wait()` 호출은 객체 락을 해제하고 생산자 상태를 BLOCKED 로 설정하고 생산자를 객체의 대기 집합으로 둔다.
2. 소비자는 이제 객체에 대한 락을 사용할 수 있으므로 `remove()` 메서드를 호출하고 진입한다. 소비자는 버퍼에서 항목을 제거하고 `notify()` 를 호출한다. 소비자가 여전히 객체에 대한 락을 소유하고 있다. 
3. `notify()` 호출은 객체의 Wait Set 에서 생산자를 제거하고 생산자를 Entry Set 으로 이동하고 생산자의 상태를 Runnable 으로 설정한다.  
4. 소비자가 `remove()` 메서드를 종료한다. `remove()` 메서드를 종료하면 객체의 락이 해제된다.  
5. 생산자가 락을 다시 얻으려고 시도하고 성공한다. `wait()` 호출에서 실행을 재개한다. 생산자는 `while` 루프를 검사하고 버퍼에 여유 공간이 있는지 확인한 후 `insert()` 메서드의 남은 부분을 진행한다. 객체의 Entry Set 에 스레드가 없으면 `notify()` 호출은 무시된다. 생산자가 메서드를 종료하면 객체에 대한 락이 해제된다.  

`synchronized wait()` 과 `notify()` 기법은 Java 에서 처음부터 제공되었다. 그러나 `Java API` 이후 버전에서는 훨씬 더 융통성 있고 강력한 락 기법이 도입되었다.  

## Reentrant Lock

API 에서 사용 가능한 가장 간단한 락 기법은 `ReentrantLock` 이다. 여러 가지 면에서 위 메서드처럼 작동한다. `ReentrantLock` 은 단일 스레드가 소유하며 공유 자원에 대한 상호 배타적 액세스를 제공하는 데 사용된다. 그러나 공정성 매개변수 설정과 같은 몇 가지 추가 기능이 제공된다. 

- [?] 공정성이란 오래 기다린 스레드에 락을 줄 수 있는 설정을 말한다. JVM 명세는 객체 락의 대기 집합의 스레드가 특정 방식으로 정렬되어야 한다는 것을 명시하지 않기 때문에 가능하다. 

스레드는 `lock()` 메서드를 호출하여 `ReentrantLock` 을 획득한다. 락을 사용할 수 있거나 `lock()` 을 호출한 스레드가 이미 락을 소유하고 있는 경우, `lock()` 은 호출 스레드는 소유자가 `unlock()` 을 호출하여 락이 배정될 때까지 BLOCKED 된다. 이것이 재진입이라고 명명된 이유이다. 

락을 사용할 수 없는 경우 호출 스레드는 소유자가 `unlock()` 을 호출하여 락이 배정될 때까지 BLOCKED된다. `ReentrantLock` 은 `Lock` 인터페이스를 구현한다. 

```java
Lock key = new ReentrantLock();

key.lock();
try {
	/* critical section */
}
finally {
	key.unlock();
}
```

`lock()` 메서드를 통해 락을 획득하고, critical section 이 완료되거나, `try` 블록 내에서 예외가 발생하면 락이 해제되도록 한다.  

단, `lock()` 은 checked 예외를 발생시키지 않으므로 `try` 절에 넣지 않는다.  

이유는 다음과 같다. 
`try` 절 내에 `lock()` 을 배치하고 `lock()` 이 호출될 때 unchecked 예외가 발생하면 (`OutofMemoryError` 등) 문제가 발생할 수 있다.  
`finally` 는 `unlock()` 을 호출하는데, 락이 획득된 상태가 아니면 `unlock()` 이 `IllegalMonitorStaateException` 을 발생시킨다.  

**`ReentrantLock` 은 블록 구조를 가지고 있지 않기 때문에, `finally` 블록 내에서 `unlock()` 메서드를 사용하여 락을 명시적으로 해제해주어야 한다!**

해당 예외가 `lock()` 을 호출할 때 발생한 unchecked 예외를 대신하게 되기 때문에 실패한 원인을 찾기 어렵게 만든다.  

`ReentrantLock` 은 상호 배제를 제공하지만, 여러 스레드가 공유 데이터를 읽기만 하고 쓰지 않을 때는 너무 보수적인 전략일 수 있다.  (7.1.2 에서 설명했다네요)
이를 위해 `ReentrantReadWriteLock` 을 제공한다. Reader 는 여러 개일 수 있지만, writer 는 반드시 하나여야 하는 락이다.

### `synchronized` vs `ReentrantLock`

intrinsic lock 과 `ReentrantLock` 은 동일한 락과 메모리 시멘틱을 제공한다. `ReentrantLock` 의 성능은 Intrinsic Lock 의 성능을 압도하는 것처럼 보인다. 그렇다면 왜 synchronized 를 deprecated 하지 않고, 모든 동시성 코드가 `ReentrantLock` 으로 바꾸지 않는 걸까?

`ReentrantLock` 은 intrinsic lock 이 실용적이지 않은 상황을 위한 도구이다. time out, polling, 중단 가능한 락 획득, 공정한 queueing 또는 not-blocking 구조 락과 같은 고급 기능이 필요한 경우에 사용하고, 그렇지 않다면 `synchronized` 를 선택해라.

Java 5.0 에서는 JVM 이 어떤 스레드가 `ReentrantLock` 을 보유하는지 알 수 없어서 스레딩 문제를 디버깅하는 데에 도움을 줄 수 없었다. 

intrinsic lock 은 명시적 락에 비해 여전히 상당한 이점이 존재한다. 가장 주목할만한 점은 친숙하고, 간단하다는 것이다. 많은 기존 프로그램에서 intrinsic lock 을 사용하고 있는데 이를 혼용하게 되면 혼란을 야기할 수 있다. 락은 동기화보다 훨씬 더 위험한 도구다.

## Intrinsic Lock vs Monitor

Java 의 Intrinsic Lock 과 Monitor 는 사실상 동일한 개념이다.  

- [i] Intrinsic Locks (내장 락)
Java의 모든 객체는 내부적으로 Intrinsic Lock 을 갖는다.  
해당 락은 `synchronized` 메서드나 `synchronized` 블록에 들어갈 때 자동으로 획득된다. 
내장 락이 활성화된 상태에서는 해당 락을 소유하고 있는 스레드만 해당 코드 블록을 실행할 수 있다. 

- [i] Monitor
Monitor 는 상호 배타적인 코드의 실행을 돕는 동기화 메커니즘이다.  
Java 의 모든 객체는 하나의 모니터를 가진다.  
`wait()` , `notify()`, `notifyAll()` 등의 메서드를 통해 조건 변수를 다루고 스레드 간의 통신을 할 수 있다.  

## 질문

- `wait()`, `notify()` 가 어떻게 다른 스레드에게 전달하는 것인가? (OS 단에서)
	- 
- 왜 Java 의 모든 객체는 하나의 모니터를 가지도록 구현되었을까?
	- 모든 객체에 모니터를 내장함으로써 개발자는 추가적인 동기화 메커니즘을 별도로 구현하거나 탐색할 필요 없이 동시성 제어를 할 수 있다.
	- 개발자가 어떤 객체든 동기화를 위해 `synchronized` 를 사용할 수 있다는 일관성이 생긴다.
	- 그러나 메모리 오버헤드가 있다. 실제로 대부분의 객체는 동기화가 필요하지 않을 수 있다. 이런 이유로 JVM 구현자들이 모니터에 대한 오버헤드를 최소화하기 위한 다양한 최적화 전략을 사용하고 있다.
- 그렇다면 왜 멀티 스레드 환경에서 synchronized 는 안 좋을까?
- Monitor lock 은 왜 필요한가?
- 세마포어와 비교했을 때 Monitor Lock 이 이점을 갖는 부분은 무엇인가?
- Monitor Lock 은 어떤 부분에서단점을 갖는가?
- Java 에서 재진입을 허용하게 된 이유는 무엇인가?
- 가시성 문제란 무엇인가?
- happens-before 란 무엇인가?
	- 위에 있음
- 생산자-소비자 문제란 무엇인가?
	- 위에 있음
- 생산자-소비자 문제는 왜 해결해야 하는가?
	- 생산자 소비자가 동시에 동작하면 버퍼 오버플로우, 버퍼 언더플로우가 발생할 수 있다. 또한 생산자와 소비자가 동시에 공유 자원에 접근하면 데이터의 무결성이 손상될 수 있다.
	- 무한 대기 상태에 빠진 스레드나 프로세스가 리소스를 계속 점유하게 되어 시스템의 효율성이 저하된다.
- Java 에서 Monitor Lock 을 가지게 됨으로써 얻을 수 있는 이점은 무엇인가?
- notify() 를 수행했을 때 다음 스레드는 어떻게 결정되는가?
	- 무작위로 결정되지만, JVM 의 구현에 따라 다르다. 주로 FIFO 로 결정되는 것으로 알고 있다.
- java 말고 다른 언어에도 Monitor lock 이 적용된 곳이 있는가?
- Monitor Lock 이 적용되지 않은 언어가 있다면 어떻게 구현되어 있는가?
- `ReentrantLock` 은 상호 배제를 제공하지만, 여러 스레드가 공유 데이터를 읽기만 하고 쓰지 않을 때는 너무 보수적인 전략일 수 있다. => 왜일까?
	- 여러 스레드가 동시에 데이터를 읽을 때, 해당 데이터가 변경되지 않는 한 데이터의 일관성이나 무결성에 문제가 생기지 않는다. 그러나 모든 읽기 연산에 `ReentrantLock` 을 사용하면 동시에 수행될 수 있는 여러 읽기 연산이 서로 블로킹될 수 있다. 이는 불필요한 대기 시간으로, 전체 시스템의 처리량 / 성능을 저하시킨다.
	- 읽기 연산만 있는 경우에도 락과 해제를 관리하는 코드를 추가해야 한다. 이는 코드의 복잡성을 높이고, 락을 해제하는 것을 잊어버릴 위험이 있다.
- java 객체는 어떻게 intrinsic lock 을 내장하고 있는가?
- `notify()` 는 `wait()` 중인 스레드에만 알리나?
	- `notify()` 나 `notifyAll` 메서드는 `wait()` 으로 인해 대기 중인 스레드들만 깨운다.
	- WAITING: `wait()`, `join()`, `LockSupport.park()` 등의 메서드 호출로 인해 대기 중인 상태이다. `notify`, `notifyAll` 메서드에 의해 깨어날 수 있다.
	- BLOCKING: 스레드가 내장 락을 획득하기 위해 대기 중인 상태. 다른 스레드가 현재 그 락을 보유하고 있을 때 이 상태로 전환된다. 해당 락이 풀릴 때까지 BLOCKED 상태로 대기한다.
		- 현재 락을 보유하고 있는 스레드가 synchronized 블록을 나오면서 락을 해제하게 되면, JVM 은 BLOCKED 상태의 스레드 중 하나를 선택하여 해당 락을 획득하게 된다. 선택된 스레드는 RUNNABLE 상태로 전환되어 실행을 재개한다.
	- RUNNABLE: 스레드가 실행될 수 있는 상태. 실제로 CPU 시간을 얻어 실행되고 있는 상태나 실행을 위해 준비된 상태를 포함한다.
- JVM 이 fairness 를 보장하지 않는 이유는 무엇일까?
	- 스레드들이 요청한 순서대로 락을 획득하게 해야 하기 때문에, 추가적인 관리 로직이 필요하다. 이 과정에서 락 획득 / 해제 시에 추가 오버헤드가 있을 수 있다.
	- 락을 획득하기 위해 대기하는 스레드들에게 순서대로 락을 할당하면 CPU 캐시 locality 가 저하될 수 있다. 스레드가 락을 획득한 직후에 실행하면 그 스레드의 데이터는 CPU 캐시에 존재할 확률이 높다. fairness 를 보장하면서 락을 실행하면, 다른 스레드가 락을 획득하게 되어 캐시 미스가 더 자주 발생할 수 있다.
	- 자바 intrinsic lock 은 성능 최적화를 우선시하는 경향이 있어서 fairness 를 보장하지 않는다.

## 목차

1. 세마포어의 한계와 Monitor Lock 의 필요성
2. Java 의 Monitor Lock: Intrinsic Lock
3. Java Monitors 코드
4. Reentrant Lock 소개
5. 성능과 가시성
6. 결론: Monitor Lock 의 중요성과 Java 에 적용된 것 요약

## 참고

- https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html
- https://backtony.github.io/java/2022-05-04-java-50/
- http://happinessoncode.com/2017/10/04/java-intrinsic-lock/
- https://www.baeldung.com/java-synchronized
- https://happy-coding-day.tistory.com/entry/JAVA-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80
- https://www.youtube.com/watch?v=yWprp019_n4&t=967s
