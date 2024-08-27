---
title: 코틀린 싱글톤
date: 2024-08-24 17:19:35 +0200
updated: 2024-08-24 17:34:39 +0200
tags:
  - kotlin
---

## 코틀린의 싱글톤이란?

코틀린에서는 `object` 키워드를 사용하여 다른 객체가 해당 객체의 복사본을 인스턴스화할 수 없도록 하는 싱글톤 객체를 만들 수 있다. 아래와 같이 선언된 `Singleton` 객체는 전역적으로 접근할 수 있다.

```kotlin
object Singleton {  
    fun print() {  
        println("Singleton")  
    }  
}
```

그런데 해당 클래스를 컴파일 하면 다음과 같은 class 파일을 얻을 수 있다.

```
// IntelliJ API Decompiler stub source generated from a class file  
// Implementation of methods is not available  
  
public object Singleton {  
    public final fun print(): kotlin.Unit { /* compiled code */ }  
}
```

`print` 함수는 `final` 로 선언되었고, 