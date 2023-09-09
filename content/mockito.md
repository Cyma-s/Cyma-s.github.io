---
title: Mockito
date: 2023-09-09 14:42:39 +0900
updated: 2023-09-09 14:42:44 +0900
tags:
  - test
  - 테스트
  - Java
---

## 생성자 mock

`LoginController` 에서 다음과 같이 private 메서드로 세션을 생성한다.

```java
private Session createSession(final User user) {  
    final Session session = new Session();  
    SessionManager.getInstance().add(session);  
    session.setAttribute("user", user);  
    return session;  
}
```

이때 세션은 생성될 때 랜덤값을 생성하기 때문에 테스트하기 매우 곤란하다.  
특히 UUID 가 겹칠 일은 지나가다 운석 맞을 확률이라고 한다 (ㅋㅋ)

```java
public Session() {  
    this.id = UUID.randomUUID().toString();  
}
```

이럴 때 `mockConstruct` 를 사용한다.  
이렇게 해주면 모든 `Session` 이 `getId` 로 1234 를 리턴하기 때문에 테스트할 수 있게 된다!

```java
final LoginController loginController = new LoginController();  
try (final MockedConstruction<Session> sessionMockedConstruction = mockConstruction(Session.class,  
    (mock, context) -> {  
        when(mock.getId()).thenReturn("1234");  
    })  
) {  
    final ResponseEntity responseEntity = loginController.service(httpRequest);  
  
    // then  
    assertThat(responseEntity.getHeaders()  
            .containsHeaderNameAndValue(HttpHeaderName.SET_COOKIE, "JSESSIONID=1234")).isTrue();   
}
```

try-with-resources 를 사용하여 테스트가 끝나면 닫아준다.  

## mockStatic

static 메서드를 모킹하고 싶을 때가 있다.  
나는 싱글톤 패턴을 사용했는데, 싱글톤의 경우 mocking 을 해주기 곤란하다.  
`SessionManager.getInstance` 에서 내가 mock 해둔 `SessionManager` 를 리턴해주도록 변경해야 했다.  

이럴 때 mockStatic 을 사용한다.

```java
final SessionManager sessionManager = mock(SessionManager.class);  
doNothing().when(sessionManager).validateSession(any());  
  
try (final MockedStatic<SessionManager> mockSessionManger = mockStatic(SessionManager.class)) {  
    mockSessionManger.when(SessionManager::getInstance)  
        .thenReturn(sessionManager);  
  
    // when  
    final boolean result = loginInterceptor.preHandle(loginHttpRequest, basicResponse);  
  
    // then  
    assertAll(  
        () -> assertThat(result).isFalse(),  
        () -> assertThat(basicResponse.getHeaders().getHeaderValue(HttpHeaderName.LOCATION))  
            .contains("/index.html")  
    );  
}
```

클래스의 static 메서드가 어떤 값을 리턴할 지 지정해줄 수 있다.  
try-with-resources 로 테스트가 끝나면 닫아준다.