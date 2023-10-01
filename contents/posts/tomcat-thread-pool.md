---
title   : Tomcat Thread Pool
date    : 2023-09-10 15:01:55 +0900
updated : 2023-09-10 15:02:11 +0900
tags     : 
- 레벨4
- 우테코
- tomcat
---

## Thread Pool

프로그램 실행에 필요한 Thread 들을 미리 생성해놓다.  
Tomcat 3.2 이전에서는 요청이 들어올 때마다 Servlet 을 실행할 Thread 를 생성하고, 요청이 끝나면 destroy 했다. 이는 다음과 같은 문제가 발생하게 한다.  

1. 모든 요청에 대해 스레드 생성 / 소멸을 수행하는 것이 OS, JVM 에 큰 부담이 된다.
2. 동시에 일정 수준 이상의 다수 요청이 들어오는 경우 리소스 소모에 대한 억제가 어렵다. 순간적으로 서버가 다운되거나, 동시 요청을 처리하지 못해 발생하는 문제가 생길 수 있다.  

### Thread?

실행 중인 프로그램을 프로세스라고 하고, 프로세스의 실행단위가 스레드이다.  
프로그램이 돌아가면서 여러 가지 작업들을 동시에 할 수 있다.  

Java 는 One-to-One Threading-Model 로 Thread 를 생성한다.  

User Thread (Process의 스레드) 생성 시, OS Trhead (OS 레벨의 스레드) 와 연결해야 한다.  
즉, 새로운 Thread 를 생성할 때마다 OS Kernel 의 작업이 필요해서 생성 비용이 많이 든다.  

### One-to-One Threading Model 이란?

Java 애플리케이션에서 스레드를 생성하면 운영체제에서도 해당 스레드에 대응하는 네이티브 스레드가 생성되는 것이다. Java 스레드가 실제 운영체제 스레드의 모든 기능을 활용할 수 있다 (ㄷㄷ)

이런 특성 때문에 I/O 바운드 작업에서는 비효율적일 수 있다.

#### 장점

- 성능: Java 스레드가 네이티브 스레드에 직접 매핑되어 성능이 좋다.
- 병렬처리: 현대의 멀티 코어 프로세서 환경에서 Java 스레드는 실제 CPU 코어를 활용하여 병렬 처리가 가능하다.  

#### 단점

- 자원 사용: 각 스레드마다 운영체제 자원이 필요하므로 과도한 스레드 생성은 성능 저하를 초래할 수 있다.  
- 관리 비용: 너무 많은 스레드를 생성하면 스레드 간의 컨텍스트 스위칭 비용이 증가하고, 스레드 관리에 필요한 추가적인 오버헤드가 발생한다. 

### Thread Pool 이 왜 필요할까?

Thread 는 생성 비용이 커서 너무 많이 만들면 위험하다.  
이를 해결하기 위해 pool 이 고안되었다. 미리 Thread 를 만들어 두어 재사용할 수 있게 한다.  

또한 사용할 Thread 개수를 제한하여 무제한으로 스레드가 생성되지 않아 방지할 수 있다.  

스프링 부트는 내장 서블릿 컨테이너 Tomcat 을 지원한다.  
따라서 `application.yml` 을 변경해주어서 Tomcat 설정을 변경할 수 있다. 

### application.yml

```yml
# application.yml (적어놓은 값은 default)
server:
  tomcat:
    threads:
      max: 200 # 생성할 수 있는 thread의 총 개수
      min-spare: 10 # 항상 활성화 되어있는(idle) thread의 개수
    max-connections: 8192 # 수립가능한 connection의 총 개수
    accept-count: 100 # 작업 큐의 사이즈
    connection-timeout: 20000 # timeout 판단 기준 시간, 20초 (기본 값 없음)
  port: 8080 # 서버를 띄울 포트번호
```

- max-connections
톰캣이 동시에 처리할 수 있는 Connection 의 최대 개수이다.  
Web 요청이 들어올 때, Tomcat 의 Connector 가 Connection 을 생성하면서 요청된 작업을 Thread Pool 의 Thread 에 연결한다.  
해당 값이 크면 많은 수의 동시 사용자 요청을 처리할 수 있으나, 너무 큰 값은 서버 자원을 과도하게 사용하게 할 수 있어 서버의 전반적인 성능과 안정성에 영향을 줄 수 있다.  

- accept-count (백로그라고 하기도 한다.)
max-connections 이상의 요청이 들어왔을 때 사용하는 대기열 Queue 의 크기이다.  
accept-count 이상의 요청이 들어오면 추가적으로 들어오는 요청은 거절될 수 있다.  
해당 값이 너무 크면 과도한 요청이 대기 상태로 유지될 수 있어 사용자가 시스템이 느려진 것처럼 느낄 수 있다. 값이 너무 작으면 초과된 요청들이 거부될 수 있다.  
accept-count 를 통해 서버가 일시적인 트래픽 증가에 유연하게 대응할 수 있게 된다.  

#### 왜 accept-count 가 상대적으로 작은 값을 갖게 될까?

일반적으로 대기열이 너무 커지면 좋지 않다.  
대기열이 너무 커지면 연결 요청이 길게 대기하게 되고, 사용자가 응답 지연을 경험하게 된다.  
이는 시스템의 불안정성을 나타내며, 사용자에게 좋지 않은 경험을 제공한다.

#### 디폴트 옵션

tomcat 9.0 의 디폴트 옵션은 max-connections 200개, min-spare 25개이다. 스프링부트에서는 200개, 10 개를 디폴트 값으로 잡았다.

**왜 Spring Boot 에서는 디폴트 값을 10개로 줄였을까?**

GPT 에게 물어본 결과

1. Spring Boot 는 제한적인 환경 (작은 크기의 클라우드 인스턴스, 개발자의 로컬 환경 등) 에서도 원활하게 동작할 수 있도록 보수적인 디폴트 환경을 제공할 수 있다.  
2. 작은 환경에서는 너무 많은 동시 연결이나 대기 연결을 허용하면 메모리 부족 문제나 다른 리소스 부족 문제가 발생할 수 있다. 이런 문제의 발생 가능성을 줄이기 위해 낮췄을 것이다.

## Thread Pool 의 Flow

1. 첫 작업이 들어오면 core size 만큼의 스레드를 생성한다. 
2. 유저 요청이 들어올 때마다 작업 큐에 담아둔다. 
3. core size 의 스레드 중, 유휴상태(idle) 인 스레드가 있다면 작업 큐에서 작업을 꺼내서 스레드에 작업을 할당하여 처리한다. 
	1. 유휴 상태인 스레드가 없다면 작업 큐에서 대기한다.
	2. 작업 큐가 꽉 찬다면 스레드를 새로 생성한다.
	3. 스레드 최대 사이즈에 도달하고 작업 큐도 꽉 차게 되면 추가 요청에 대해 connection-refused 오류를 반환한다.
4. 태스크가 완료되면 스레드가 다시 유휴 상태로 돌아간다. 
	1. 작업 큐가 비어있고, core size 이상의 스레드가 생성되어 있다면 스레드를 destroy 한다.

## Executor

`Executor` 인터페이스는 Runnable 객체를 받는 `execute` 메서드를 갖는다. 

```java
Executor executor = Executors.newSingleThreadExecutor();
executor.execute(() -> System.out.println("Hello World"));
```

## ExecutorService

작업의 진행 상황을 제어하고 서비스 종료를 관리하는 많은 메서드가 포함되어 있다.  
리턴된 `Future` 객체를 사용해서 실행을 제어할 수도 있다.  

```java
ExecutorService executorService = Executors.newFixedThreadPool(10);
Future<String> future = executorService.submit(() -> "Hello World");
// some operations
String result = future.get();
```

실제로는 일반적으로 `future.get()` 을 바로 호출하지 않고, 실제로 계산 값이 필요할 때까지 호출을 미루는 것이 좋다.  

`Runnable` 또는 `Callable` 을 받을 수 있다. 함수형 인터페이스나 람다로 전달 가능하다.  

## ThreadPoolExecutor

`corePoolSize` , `maximumPoolSize`, `keepAliveTime` 을 설정 매개변수로 갖는다.  

`corePoolSize` 는 객체화 되어 스레드 풀에 유지될 코어 스레드의 수이다. 새 작업이 들어올 때 모든 코어 스레드가 사용 중이고, 작업 큐가 다 차면 poolSize 까지 `maximumPoolSize` 까지 커지는 것을 허용한다.  

`keepAliveTime` 은 `corePoolSize` 를 초과해서 객체화된 초과된 스레드들이 idle 상태로 존재할 수 있는 시간 간격을 의미한다.  
기본적으로 `ThreadPoolExecutor` 는 non-core 코어 스레드만을 삭제 대상으로 고려한다.  
코어 스레드에도 같은 삭제 정책을 적용하려면 `allowCoreThreadTimeOut(true)` 메서드를 사용할 수 있다.  

### newFixedThreadPool

`corePoolSize` 와 `maximumPoolSize` 매개변수 값이 같고, `keepAliveTime` 이 0인 ThreadPoolExecutor 를 생성한다.  
즉, 스레드 풀의 스레드 수는 항상 동일하다.  

```java
ThreadPoolExecutor executor = 
  (ThreadPoolExecutor) Executors.newFixedThreadPool(2);
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});

assertEquals(2, executor.getPoolSize());
assertEquals(1, executor.getQueue().size());
```

### Executors.newCachedThreadPool()

미리 구성된 다른 `ThreadPoolExecutor` 를 생성할 수 있다.  
스레드 수를 입력 받지 않으며, 기본적으로 `corePoolSize` 를 0으로 설정하고 `maximumPoolSize` 를 `Integer.MAX_VALUE` 로 설정한다. `keepAliveTime` 은 60초이다.  

```java
ThreadPoolExecutor executor = 
  (ThreadPoolExecutor) Executors.newCachedThreadPool();
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});
executor.submit(() -> {
    Thread.sleep(1000);
    return null;
});

assertEquals(3, executor.getPoolSize());
assertEquals(0, executor.getQueue().size());
```

이는 스레드 풀이 작업 수를 수용하기 위해 무한대로 커질 수 있다. 그러나 스레드가 더 이상 필요하지 않은 경우 60초 이상 사용하지 않으면 폐기 된다.  
일반적으로 애플리케이션에 수명이 짧은 작업이 많은 경우 사용한다.  

내부적으로 `SynchronousQueue` 인스턴스가 사용된다.  
삽입, 제거 작업이 항상 동시에 발생하므로 크기는 항상 0이다.  

```java
AtomicInteger counter = new AtomicInteger();

ExecutorService executor = Executors.newSingleThreadExecutor();
executor.submit(() -> {
    counter.set(1);
});
executor.submit(() -> {
    counter.compareAndSet(1, 2);
});
```

생성 후에는 immutable 하므로, `ThreadPoolExecutor` 로 캐스팅이 불가능하다.  

## ScheduledThreadPoolExecutor

`ThreadPoolExecutor` 를 상속받고, `ScheduledExecutorService` 를 implement 하며, 메서드가 추가된 인터페이스이다.    

- `schedule` 메서드를 사용하면 지정된 딜레이 시간 후에 task 를 실행할 수 있다. 
- `scheduleAtFixedRate` 메서드는 첫 딜레이 시간 이후에 작업을 실행하고, 특정 기간동안 반복적으로 실행한다. `period` 매개변수는 작업들을 시작하는 사이 시간으로 측정되므로 실행률은 고정된다. 
- `scheduleWithFixedDelay` 메서드는 반복적으로 주어진 작업을 실행한다는  `scheduleAtFixedRate` 와 유사하지만, 딜레이 시간이 이전 작업이 끝나는 시간과 다음 작업이 시작된 사이 시간이라는 점에서 다르다. 주어진 작업의 길이만큼 실행률이 달라질 수 있다.  

## ForkJoinPool

Java 7에 도입된 fork, join 프레임워크의 핵심 부분이다. 이를 통해 재귀 알고리즘에서 여러 개의 작업을 생성하는 문제를 해결할 수 있다.   
모든 작업이나 하위 작업을 실행하기 위해 자체 스레드가 필요하다. 즉, 간단한 `ThreadPoolExecutor` 를 사용하면 스레드가 빠르게 소진된다.  

fork/join 프레임워크에서는 모든 작업이 여러 개의 하위 작업을 fork 하고 join 메서드를 사용하여 완료될 때까지 기다릴 수 있다.  

fork/join 프레임워크의 장점은 각 작업이나 하위 작업에 대해 새 스레드를 만들지 않고, work-stealing 알고리즘을 수행한다는 것이다.  (이 부분은 자세하게 안 다루고 여기서 좀 더 자세히 볼 수 있다. https://www.baeldung.com/java-fork-join )

```java
static class TreeNode {

    int value;

    Set<TreeNode> children;

    TreeNode(int value, TreeNode... children) {
        this.value = value;
        this.children = Sets.newHashSet(children);
    }
}

public static class CountingTask extends RecursiveTask<Integer> {

    private final TreeNode node;

    public CountingTask(TreeNode node) {
        this.node = node;
    }

    @Override
    protected Integer compute() {
        return node.value + node.children.stream()
          .map(childNode -> new CountingTask(childNode).fork())
          .collect(Collectors.summingInt(ForkJoinTask::join));
    }
}
```



## 추가로 알아보면 좋은 키워드

- 자바 소켓 프로그래밍
- 스레드풀 전략
- 적정 스레드 개수

## 참고

- https://velog.io/@sihyung92/how-does-springboot-handle-multiple-requests
- https://velog.io/@mooh2jj/Tomcat-Thread-Pool-%EC%A0%95%EB%A6%AC
- https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html -> 여기에서 tomcat 이라고 검색하면 tomcat 관련 설정이 나온다.