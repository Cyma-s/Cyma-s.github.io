---
title   : Spring Bean Scope
date    : 2023-06-06 15:10:08 +0900
updated : 2023-06-06 15:10:24 +0900
tags     : 
- Spring
- 개발
---

## Prototype Bean과 Singleton Bean을 섞어서 사용하는 경우

### Prototype Bean 내부에서 Singleton Bean을 참조하는 경우 

프로토타입 빈에서 싱글톤 빈을 사용하는 경우는 아무런 문제가 발생하지 않는다.
프로토타입 빈 인스턴스는 계속해서 생성되지만, 주입받는 싱글톤 빈은 계속 동일한 하나의 인스턴스이다. 

### Singleton Bean 내부에서 Prototype Bean을 참조하는 경우

싱글톤 빈 내부의 프로토타입 빈은 주입되고 나서 인스턴스가 새로 생성되지 않는다. (프로토타입 빈임에도 불구하고)

#### 해결 방법

1. ProxyMode 설정

객체의 해시코드를 확인하기 위한 코드를 작성한다.

```java
@SpringBootApplication  
public class DemoApplication implements CommandLineRunner {  
  
    public static void main(String args[]) {  
        SpringApplication.run(DemoApplication.class, args);  
    }  
  
    @Autowired  
    ApplicationContext applicationContext;  
  
    @Override  
    public void run(String... strings) throws Exception {  
        System.out.println(applicationContext.getBean(Single.class));  
        System.out.println(applicationContext.getBean(Single.class));  
        System.out.println(applicationContext.getBean(Single.class));  
  
        System.out.println();  
  
        System.out.println(applicationContext.getBean(Proto.class));  
        System.out.println(applicationContext.getBean(Proto.class));  
        System.out.println(applicationContext.getBean(Proto.class));  
        System.out.println(applicationContext.getBean(Proto.class));  
  
        System.out.println();  
  
        System.out.println(applicationContext.getBean(Single.class).getProto());  
        System.out.println(applicationContext.getBean(Single.class).getProto());  
        System.out.println(applicationContext.getBean(Single.class).getProto());  
        System.out.println(applicationContext.getBean(Single.class).getProto());  
        System.out.println(applicationContext.getBean(Single.class).getProto());  
    }  
}
```

프로토타입 빈에 proxymode를 설정한다.

```java
@Component  
@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)  
public class Proto {  
}
```

```java
@Component  
public class Single {  
    private final Proto proto;  
  
    public Single(final Proto proto) {  
        this.proto = proto;  
    }  
  
    public Proto getProto() {  
        return proto;  
    }  
}
```

결과는 다음과 같다. 싱글톤 빈에서도 프로토타입 빈이 계속해서 생성되는 것을 볼 수 있다.

```shell
hello.Single@7a9ceddf
hello.Single@7a9ceddf
hello.Single@7a9ceddf

hello.Proto@4c6a4ffd
hello.Proto@3aed69dd
hello.Proto@3f1a9a53
hello.Proto@1ca3d25b

hello.Proto@2287395
hello.Proto@535a518c
hello.Proto@38f981b6
hello.Proto@3a4aadf8
hello.Proto@7bbfc5ff
```

2. `ObjectProvider` 사용하기

싱글톤 빈의 필드로  `ObjectProvider` 를 추가한다.

```java
@Component  
public class Single {  
    @Autowired  
    private ObjectProvider<Proto> objectProvider;  
  
    public Proto getProto() {  
        return objectProvider.getIfAvailable();  
    }  
}
```

```shell
hello.Single@1d98daa0
hello.Single@1d98daa0
hello.Single@1d98daa0

hello.Proto@54336976
hello.Proto@f25f48a
hello.Proto@3b7c80c6
hello.Proto@3b2e5c0d

hello.Proto@79eeff87
hello.Proto@8bd076a
hello.Proto@1378eea2
hello.Proto@66522ead
hello.Proto@e91b4f4
```

동일한 동작을 하지만, 자바 객체가 POJO 스타일에서 벗어나게 된다.

