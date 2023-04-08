---
title   : 스택 풀기 (Stack Unwinding)
date    : 2023-04-07 10:11:28 +0900
updated : 2023-04-07 10:12:05 +0900
tags     : 
- Java
- 개발
---

`try-catch` 문에서 `finally` 와 `catch`가 동시에 예외를 던지는 경우를 조사하다 stack unwinding을 알게 되었다.   

스택 풀기, 스택 되감기 등 여러 가지 이름을 사용한다.

## Stack Unwinding란?

- 예외가 발생한 함수에서 예외 처리가 되지 않았을 때 함수 호출 스택을 풀면서 함수가 호출되었던 부분으로 돌아가 예외 처리를 시도하는 것
- 예외를 catch하지 않은 메서드가 종료되고, 해당 메서드의 모든 로컬 변수들이 scope를 벗어나 원래 해당 메서드를 호출한 문으로 제어가 반환되는 것을 의미한다.
- 호출한 곳에서 `try` 블록이 해당 statement를 감싸고 있다면, 예외를 `catch` 하는 것을 시도한다.
- `try` 블록이 해당 statement를 감싸고 있지 않은 경우, stack unwinding이 다시 일어난다.
- 해당 예외를 처리하는 `catch` 블록이 없고, 예외가 `checked exception` 인 경우, 프로그램 컴파일이 에러를 일으킨다.

## 예제

```java
public class Main {  
    public static void main(String[] args) {  
        function1();  
    }  
  
    private static void function1() {  
        function2();  
    }  
  
    private static void function2() {  
        function3();  
    }  
  
    private static void function3() {  
        throw new IllegalArgumentException("Unchecked exception 발생");  
    }  
}
```

프로그램을 실행하면 다음과 같은 메시지가 뜬다.

```
Exception in thread "main" java.lang.IllegalArgumentException: Unchecked exception 발생
	at Main.function3(Main.java:15)
	at Main.function2(Main.java:11)
	at Main.function1(Main.java:7)
	at Main.main(Main.java:3)
```

예외 메시지 출력 아래에 어떤 함수에서 불렸는지 trace가 함께 출력된다.

## 참고 자료

- [참고자료](https://luckygg.tistory.com/372)
- [참고자료2](http://underpop.online.fr/j/java/help/stack-unwinding-exception-handling.html.gz)