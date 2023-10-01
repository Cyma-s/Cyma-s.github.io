---
title   : 여러 개의 Bean 후보
date    : 2023-05-22 18:57:17 +0900
updated : 2023-05-22 18:57:24 +0900
tags     : 
- 스터디
- 학습로그
- spring
---

## Bean의 후보가 여러 개라면?

의존성 주입을 수행할 때 bean이 여러 개라면 오류가 발생한다.
이를 해결하기 위해 3가지 방법을 사용할 수 있다.

- `@Autowired` 의 필드 이름 매칭
- `@Qualifier`
- `@Primary`

가장 잘 일치하는 하나의 bean을 찾을 수 없는 경우에는 `NoUniqueBeanDefinitionException` 이 발생한다.

## 사용할 클래스 정리

```java
public interface ExtraFarePolicy {  
    Fare calculateExtraFare(final Path path);  
}
```

```java
@Component  
public class DistanceBasedExtraFarePolicy implements ExtraFarePolicy {  
	public DistanceBasedExtraFarePolicy() {  
	    System.out.println(getClass());  
	}
	
	@Override  
	public Fare calculateExtraFare(final Path path) {  
		return null;
	}
}
```

```java
@Component  
public class DummyPolicy implements ExtraFarePolicy{  
    public DummyPolicy() {  
        System.out.println(getClass());  
    }  
  
    @Override  
    public Fare calculateExtraFare(final Path path) {  
        return null;  
    }  
}
```

```java
@Component  
public class Dummy {  
    public ExtraFarePolicy policy;  
}
```

## `@Autowired` 필드 이름 매칭

필드 이름으로 주입하는 방법이다.

먼저 필드 주입이 가능하다.

```java
@Component  
public class Dummy {  
    @Autowired  
    private ExtraFarePolicy dummyPolicy;  
}
```

위와 같은 코드를 작성하면, `ExtraFarePolicy` 에 들어가는 구현체는 놀랍게도 `DummyPolicy` 클래스가 된다.

생성자로 주입을 받으면 매개변수 이름이 주입받는 클래스 이름이 된다. 
`distanceBasedExtraFarePolicy` 라는 이름으로 주입 받기 때문에 `DistanceBasedExtraFarePolicy` 가 `ExtraFarePolicy` 에 대입된다.

```java
@Component  
public class Dummy {  
    private final ExtraFarePolicy dummyPolicy;  
  
    public Dummy(final ExtraFarePolicy distanceBasedExtraFarePolicy) {  
        this.dummyPolicy = distanceBasedExtraFarePolicy;  
        System.out.println(a.getClass());  
    }  
}
```

아예 구현체의 이름으로 존재하지 않는 다른 이름을 적으면 컴파일 에러가 발생한다.
이 경우에는 Spring이 Bean을 주입할 때 여러 구현체 중에 어떤 구현체를 선택해야 할 지 모르기 때문에 컴파일 에러가 발생하게 된다. 

```java
@Component  
public class Dummy {  
    @Autowired  
    private ExtraFarePolicy extraFarePolicy;  
}
```

그러나 이렇게 주입하는 방식은 추천하지 않는다.
Spring이 컴파일러에게 높은 우선순위를 부여하는 구현체 기반의 주입 매커니즘과는 관련이 없는 일반적인 빈 이름 기반의 주입 매커니즘이기 때문에, 규칙을 따르는 것이 더 명확하고 안전하다.

## `@Qualifier`

Spring 컨테이너가 동일한 유형의 bean을 여러 개 찾았을 때, 모호함을 해결하기 위해 추가적으로 판단할 수 있는 정보를 제공한다. 주의할 점은 등록되는 bean의 이름을 바꾸는 것이 아닌, 구분자를 추가하는 형식이라는 점이다.

**특징**
- 메서드, 필드, 생성자 매개변수에 사용할 수 있다.
- `@Autowired` 와 함께 사용해야 한다.

`@Qualifier` 를 생성자 매개변수에 달아줄 수 있다.
이런 경우에는 생성자 매개변수 이름이 다른 구현체 이름이더라도 정확하게 해당 bean을 등록하게 된다.

```java
@Component  
public class Dummy {  
    private ExtraFarePolicy dummyPolicy;  
  
    public Dummy(@Qualifier("distanceBasedExtraFarePolicy") final ExtraFarePolicy dummyPolicy) {  
        this.dummyPolicy = dummyPolicy;  
        System.out.println("dummy" + dummyPolicy.getClass());  // dummyclass subway.domain.fare.DistanceBasedExtraFarePolicy

    }  
}
```

필드 주입을 사용하려면 다음과 같이 사용하면 된다.

```java
@Component  
public class Dummy {  
    @Autowired  
    @Qualifier("distanceBasedExtraFarePolicy")  
    public ExtraFarePolicy dummyPolicy;  
}
```

존재하지 않는 `@Qualifier` 를 사용하면 `NoSuchBeanDefinitionException` 이 발생한다.

```java
@Component  
public class Dummy {  
    @Autowired  
    @Qualifier("strangePolicy")  
    public ExtraFarePolicy dummyPolicy;  
}
```

```
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'subway.domain.fare.ExtraFarePolicy' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {@org.springframework.beans.factory.annotation.Autowired(required=true), @org.springframework.beans.factory.annotation.Qualifier(value="strangePolicy")}
```

## `@Primary`

```java
@Primary  
@Component  
public class DummyPolicy implements ExtraFarePolicy {  
    public DummyPolicy() {  
        System.out.println(getClass());  
    }  
  
    @Override  
    public Fare calculateExtraFare(final Path path) {  
        return null;  
    }  
}
```

우선순위를 주고 싶은 bean의 클래스 상단에 적어주면 된다.

`@Primary` 어노테이션이 여러 개 존재하는 경우에는 `NoUniqueBeanDefinitionException` 이 발생한다.

```
Caused by: org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'subway.domain.fare.ExtraFarePolicy' available: more than one 'primary' bean found among candidates: [distanceBasedExtraFarePolicy, dummyPolicy]
```

## `@Resource` ?

`@Resource` 어노테이션은 필드 타입으로 bean을 찾는 `@Autowired`와 달리 bean의 이름으로 bean을 주입한다.

```java
@Component  
public class Dummy {  
    @Resource  
    public ExtraFarePolicy dummyPolicy;  
}
```

해당 코드에서는 `DummyPolicy` 를 주입받게 된다.

## 우선 순위

`@Qualifier` 와 `@Primary` 어노테이션이 모두 존재하는 경우, `@Qualifier` 가 우선된다.

```java
@Qualifier("dummyPolicy")  
@Component  
public class DummyPolicy implements ExtraFarePolicy{  
    
}
```

```java
@Primary  
@Component  
public class DistanceBasedExtraFarePolicy implements ExtraFarePolicy {
}
```

```java
@Component  
public class Dummy {  
    @Autowired  
    @Qualifier("dummyPolicy")  
    public ExtraFarePolicy dummyPolicy;  
}
```

이런 경우에는 `Dummy` 의 `ExtraFarePolicy` 에는 `DummyPolicy` 가 주입되게 된다.