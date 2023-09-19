---
title: Reflection (리플렉션)
date: 2023-09-13 12:18:02 +0900
updated: 2023-09-18 22:34:56 +0900
tags:
  - java
  - 레벨4
  - 우테코
---

## Reflection

Runtime에 동적으로 특정 Class 의 정보를 추출할 수 있는 프로그래밍 기법이다.  
리플렉션으로 형은 알고 있지만 형변환을 할 수 없는 상태에서 객체의 메서드를 호출할 수 있다.  

힙 영역에 로드된 Class 타입의 객체를 통해 원하는 클래스의 인스턴스를 생성할 수 있도록 

정적 바인딩보다는 성능상 오버헤드가 있지만 동적 바인딩을 통해 상속과 다형성 등 다양한 기능을 사용할 수 있는 장점이 있다.  

### 동적 바인딩 특징

- Runtime 에 결정
- Late Binding 이라고도 부른다.
- Overriding
- Java 에서의 다형성, 상속을 가능하게 해준다.

## Reflection 활용처

- 동적으로 Class 를 사용해야 하는 경우
	- 코드 작성 시점에서는 어떠한 Class 를 사용해야할지 모르지만 Runtime 에 Class 를 가져와서 실행해야 하는 경우
- Test Code 작성
	- private 변수를 변경하고 싶거나 private method 를 테스트할 경우
- 자동 Mapping 기능 구현
	- IDE 사용 시 특정 단어를 입력하면 이와 관련된 Class 나 메서드들을 IDE 가 먼저 확인하고 사용자에게 제공한다.
- Jackson, GSON 등의 JSON Serialization Library
	- Reflection 을 사용하여 객체 필드의 변수명 / 어노테이션명을 json key 와 mapping 해주고 있다.
- 정적 분석 tool

### 주의점

- 성능 이슈
- 보안 이슈
- `setAccessible(true)` 를 사용하여 private 필드나 메서드에 접근할 경우 보안 취약점을 초래할 수 있다.

## 사용법

### 클래스 객체 얻기

- `getSimpleName()`
	- 클래스의 단순한 이름 반환. 패키지나 외부 클래스 없이 클래스 이름만을 반환한다.
	- `java.util.Map.Entry` 의 경우 `Entry` 만을 반환한다.
- `getName()`
	- 클래스의 완전히 정규화된 이름을 반환한다. 패키지 이름을 포함한다.
	- `java.util.Map.Entry` 의 경우 `java.util.Map.Entry` 를 반환한다.
	- 내부 클래스의 경우 `OuterClass$InnerClass` 를 반환한다.  
```java
public class OuterClass {
    public class InnerClass {
    }
}

Class<?> innerClass = OuterClass.InnerClass.class;
System.out.println(innerClass.getName()); // 출력: OuterClass$InnerClass

```
- `getCanonicalName()`
	- 클래스의 캐노니컬 이름 (코드에서 사용되는 형식의 이름) 을 반환한다.
	- 대부분의 클래스에 대해 `getName()` 과 동일한 이름을 반환하지만, 내부 클래스의 경우 `$` 대신 `.` 을 사용해서 이름을 반환한다.
	- `java.util.Map.Entry` 의 경우 `java.util.Map.Entry` 를 반환한다.

### 필드 얻어오기

- `getField(String name)` : 특정 이름의 필드를 가져오고 싶은 경우에 사용한다. `public` 필드에만 접근할 수 있다.  
```java
Class<?> clazz = SomeClass.class;
Field field = clazz.getField("fieldName");
```
- `getFields()` : 해당 클래스와 상속받은 부모 클래스의 모든 `public` 필드를 가져올 수 있다.  
```java
Class<?> clazz = SomeClass.class;
Field[] fields = clazz.getFields();
```
- `getDeclaredField(String name)` : 해당 클래스의 모든 접근 제한자를 가진 필드를 이름으로 가져올 수 있다.  
```java
Class<?> clazz = SomeClass.class;
Field field = clazz.getDeclaredField("privateFieldName");
```
- `getDeclaredFields()` : 해당 클래스의 `private` 필드를 포함한 모든 필드를 가져온다.  
```java
Class<?> clazz = SomeClass.class;
Field[] fields = clazz.getDeclaredFields();
```
- `Field` 객체로 객체 필드 값에 접근할 수 있다. `setAccessible(true)` 를 사용해서 `private` 필드에도 접근 가능하다.
```java
SomeClass instance = new SomeClass();
Field field = SomeClass.class.getDeclaredField("someField");
field.setAccessible(true);
Object value = field.get(instance);
```

### 생성자 가져오기

- `getConstructors()` : 해당 클래스의 모든 `public` 생성자를 가져온다.
```java
Class<?> clazz = SomeClass.class;
Constructor<?>[] constructors = clazz.getConstructors();
```
- `getConstructor(Class<?>... parameterTypes)` : 특정 파라미터 타입들을 가진 public 생성자를 가져온다.
```java
Class<?> clazz = SomeClass.class;
Constructor<?> constructor = clazz.getConstructor(String.class, int.class);
```
- `getDeclaredConstructors()` : private 포함한 모든 생성자 가져오기
```java
Class<?> clazz = SomeClass.class;
Constructor<?>[] constructors = clazz.getDeclaredConstructors();
```
- `getDeclaredConstructor(Class<?>... parameterTypes)` : 특정 파라미터 타입들을 가진 모든 접근 제한자에 대한 생성자를 가져올 수 있다. 
```java
Class<?> clazz = SomeClass.class;
Constructor<?> constructor = clazz.getDeclaredConstructor(String.class);
```
- `getEnclosingConstructor()` : 특정클래스나 인터페이스가 다른 생성자 내부에서 정의된 경우 해당 생성자를 나타내는 `Constructor` 객체를 반환한다.
```java
public class OuterClass {

    public OuterClass() {
        class InnerClass {
        }
    }

    public static void main(String[] args) {
        Class<?> innerClazz = null;

        // 이렇게 하면 OuterClass의 모든 선언된 클래스들을 가져옵니다.
        for (Class<?> declaredClass : OuterClass.class.getDeclaredClasses()) {
            if (declaredClass.getSimpleName().equals("InnerClass")) {
                innerClazz = declaredClass;
                break;
            }
        }

        if (innerClazz != null) {
            Constructor<?> enclosingConstructor = innerClazz.getEnclosingConstructor();
            System.out.println(enclosingConstructor);
        }
    }
}
```
- 객체 생성하기
```java
Class<?> clazz = SomeClass.class;
Constructor<?> constructor = clazz.getDeclaredConstructor(String.class);
constructor.setAccessible(true);
SomeClass instance = (SomeClass) constructor.newInstance("parameterValue");
```

## 어노테이션 유무

### 어노테이션이 있는가?

- `isAnnotationPresent`  
클래스에 어노테이션이 존재하는지 확인해주는 메서드이다.  

```java
public class AnnotationChecker {
    public static void main(String[] args) {
        Class<MyClass> clazz = MyClass.class;

        if (clazz.isAnnotationPresent(MyAnnotation.class)) {
            System.out.println("MyAnnotation is present on MyClass.");
        } else {
            System.out.println("MyAnnotation is not present on MyClass.");
        }
    }
}
```

만약 객체의 클래스에 어노테이션이 붙어있는지 확인하려면 `getClass().isAnnotationPresent()` 를 해주면 된다.  

## 참고

- GPT 와 대화하기