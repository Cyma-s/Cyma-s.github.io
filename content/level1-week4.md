---
title   : 레벨1 4주차 
date    : 2023-02-28 11:02:31 +0900
updated : 2023-02-28 12:16:35 +0900
tags     : 
- 레벨1
- 우테코
---
# 2/28
## 문자열
- 자바는 문자열을 위한 클래스를 제공한다.
### String 생성 방법
```
String a = "a";
String b = new String("a");
String c = new String("a").intern();
```
- intern()을 사용하면 
  
### JVM의 최적화
```
String a = "a";
String b = "b";
String c = "c";

System.out.println(a+b+c);
```

StringConcatFactory.makeConcatWithconstants 로 연결해준다.
- StringBuilder와 StringBuffer는 생성자로 별도 설정해주지 않으면 초기 capacity가 16 characters로 세팅된다. 작은 용량이기 때문에 재할당으로 인한 추가 비용이 발생하기 쉽다. 또한 loop와 같은 상황에서 StringBuilder 객체가 계속해서 생성되는 일이 발생하게 된다.
- 최적화하는 방법을 알아야 하는 이유는 다른 JVM으로 내 코드가 실행될 수도 있기 때문이다. 원리를 알아야 그 때 다르게 동작할 때 이유를 알아낼 수 있다.
- String의 + 연산은 JDK 8버전과 11버전에서 각각 다르게 처리한다.


