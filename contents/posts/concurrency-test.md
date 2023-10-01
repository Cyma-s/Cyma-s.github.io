---
title: 중단점이 있을 때 동시성 이슈가 더 잘 발생하는 이유는?
date: 2023-09-09 17:17:23 +0900
updated: 2023-09-19 22:20:51 +0900
tags: 
---

## 개요

```java
package thread.stage1;  
  
import org.junit.jupiter.api.Test;  
  
import static org.assertj.core.api.Assertions.assertThat;  
  
/**  
 * 스레드를 다룰 때 어떤 상황을 조심해야 할까?  
 * - 상태를 가진 한 객체를 여러 스레드에서 동시에 접근할 경우  
 * - static 변수를 가진 객체를 여러 스레드에서 동시에 접근할 경우  
 *  
 * 위 경우는 동기화(synchronization)를 적용시키거나 객체가 상태를 갖지 않도록 한다.  
 * 객체를 불변 객체로 만드는 방법도 있다.  
 * * 웹서버는 여러 사용자가 동시에 접속을 시도하기 때문에 동시성 이슈가 생길 수 있다.  
 * 어떤 사례가 있는지 아래 테스트 코드를 통해 알아보자.  
 */class ConcurrencyTest {  
  
    @Test  
    void test() throws InterruptedException {  
        final var userServlet = new UserServlet();  
  
        // 웹서버로 동시에 2명의 유저가 gugu라는 이름으로 가입을 시도했다.  
        // UserServlet의 users에 이미 가입된 회원이 있으면 중복 가입할 수 없도록 코드를 작성했다.  
        final var firstThread = new Thread(new HttpProcessor(new User("gugu"), userServlet));  
        final var secondThread = new Thread(new HttpProcessor(new User("gugu"), userServlet));  
  
        // 스레드는 실행 순서가 정해져 있지 않다.  
        // firstThread보다 늦게 시작한 secondThread가 먼저 실행될 수도 있다.  
        firstThread.start();  
        secondThread.start();  
        secondThread.join(); // secondThread가 먼저 gugu로 가입했다.  
        firstThread.join();  
  
        // 이미 gugu로 가입한 사용자가 있어서 UserServlet.join() 메서드의 if절 조건은 false가 되고 크기는 1이다.  
        // 하지만 디버거로 개별 스레드를 일시 중지하면 if절 조건이 true가 되고 크기가 2가 된다. 왜 그럴까?  
        assertThat(userServlet.getUsers()).hasSize(1);  
    }  
}
```

학습 테스트를 하면서 개별 스레드를 일시 중지하면 if 절 조건이 true 가 되고 크기가 2가 된다는 게 무슨 말인지 이해가 안 돼서 `UserServlet` 에 있는 if 문에 중단점을 걸어봤다.  

```java
package thread.stage1;  
  
import java.util.ArrayList;  
import java.util.List;  
  
public class UserServlet {  
  
    private final List<User> users = new ArrayList<>();  
  
    public void service(final User user) {  
        join(user);  
    }  
  
    private void join(final User user) {  
        if (!users.contains(user)) {    // 이 부분  
            users.add(user);  
        }  
    }  
    public int size() {  
        return users.size();  
    }  
  
    public List<User> getUsers() {  
        return users;  
    }  
}
```

그런데 기존의 테스트를 70번 정도 실행했을 때는 성공하던 테스트가, 디버깅 포인트를 찍고 나니 갑자기 (거의) 100% 확률로 실패하기 시작했다.  

즉, 유저가 2명이 추가되게 된 것이다. 왜 그럴까?

## 이유

중단점을 만나는 경우 실행중인 스레드는 일시 중지된다. 이는 스레드 스케줄링에 영향을 줄 수 있다.  

1. 첫 번째 스레드가 중단점에 도달해서 일시 정지된다. 
2. 이 시점에서 두 번째 스레드는 여전히 실행 중일 수 있고, 일시 중지된 동안 자유롭게 실행된다. 즉, 유저가 추가되기 전 users 를 읽었기 때문에 비어있다고 판단했다. 
3. 이후 첫 번째 스레드를 다시 실행하면, 그 시점에는 이미 두 번째 스레드에 의해 user 가 리스트에 추가된 상태임에도 첫 번째 스레드가 조건을 만족하고 리스트에 똑같은 유저를 추가하게 된다.  

이런 연유로 동시성 문제가 발생할 확률이 증가할 수 있다.  

## 자바의 스레드 스케줄링

JVM, 운영 체제에 의해 관리된다. JVM 은 대부분의 경우 호스트 OS 의 스레드 기능을 이용하여 자바 스레드를 구현한다. 즉, 실제 스레드 스케줄링은 대부분 OS 수준에서 이루어진다.  

1. 우선순위  
자바 스레드에는 우선순위가 있다. 높은 우선순위를 가진 스레드는 낮은 우선순위를 가진 스레드보다 스케줄링에서 우선적으로 고려될 가능성이 높다. 그러나 절대적으로 그런 것은 아니다.  

2. 시간 할당
일부 JVM 과 OS 에서는 시간 할당 방식을 사용하여 각 스레드에 동일한 CPU 시간을 할당하려고 한다. 이 방식은 각 스레드가 짧은 시간 동안 실행되고 다른 스레드로 전환되는 방식으로 작동한다. 이를 통해 여러 스레드가 거의 동시에 실행되는 것처럼 보이게 된다.  

## 주의

`@RepeatedTest` 를 할 때는 너무 큰 수로 실행하게 되면 컴퓨터의 실행 속도가 느려져서 오히려 Race Condition 을 만들기 어려울 수 있다. 따라서 적당히 큰 수로 설정하는 것이 중요하다.  
