---
title   : 레벨2 3주차
date    : 2023-05-02 10:47:00 +0900
updated : 2023-05-02 10:47:14 +0900
tags     : 
- 우테코
- 레벨2
---
# 5/2

## 인증

일단 인증을 붙이고 생각하는 게 아니라 구현할 기능에 따라서 인증을 붙일지 말지 고민한다. 

**인증: 누구인가?
인가: 권한이 있는가?**

기능이 어떤 요구사항을 가지는지에 따라 인증/인가 구현이 달라진다 => 테코톡 보고 학습하자

## ?

### 권한이 없는 사용자의 요청

인증 & 인가는 내가 특정 자원을 요청할 때 응답을 받을 수 있는지 없는지 확인하는 것.

클라이언트는 서버에 사용자가 누구인지 식별할 수 있는 정보를 보내고, 서버에서 접근 가능한 사용자인지 판단한다.

서버에는 사용자의 정보를 저장하지 않는다. (무상태성)
모든 서버가 그런 것은 아니다. 앞서 보낸 정보가 누구의 정보인지 알고 있는 서버가 있기도 하다.
그러나 보편적으로 사용하는 서버에서는 상태가 없다고 생각하면 된다.

### Basic Auth

`Authorization` 헤더에 구분자와 키 값을 넣어서 전송한다.
인증을 할 수 있는 값을 넣어서 전송하는 것. 
아이디와 패스워드를 계속해서 입력 받아야 한다.

### 인증 정보

인증 정보를 다른 형태의 정보로 저장한다. (쿠키/세션, 토큰 등)
인증 정보를 매 요청 때마다 보내는 것은 똑같지만, 1차원적으로 아이디/패스워드를 인코딩한 값을 보내는 것과 서버와 약속한 정보를 보내느냐의 차이가 있다.

### Session

1. 사용자 로그인
2. 서버에서 DB를 통해 사용자 확인
3. 서버가 회원 정보 세션을 생성하여 세션 저장소에 저장한다.
4. 세션 저장소에서 서버에게 Session ID를 발급해준다.
5. 사용자에게 Session ID를 포함한 응답을 전송한다.
6. 사용자는 다음 요청부터 쿠키에 Session ID를 함께 전송한다. 특정 헤더 값에 포함해서 보내면 된다.
7. 서버가 쿠키를 검증한다.
8. 세션 저장소에서 유저 정보(세션)을 획득한다.
9. 요청 데이터를 응답한다.

## 학습 테스트

- `preemitive()` : 최초에 어떤 인증을 하는지 확인하는 과정을 생략하면 효율적으로 진행할 수 있다.

```java
@Test  
void basicLogin() {  
    MemberResponse member = RestAssured  
            .given().log().all()  
            .auth().preemptive().basic(EMAIL, PASSWORD)  
            .accept(MediaType.APPLICATION_JSON_VALUE)  
            .when().get("/members/my")  
            .then().log().all()  
            .statusCode(HttpStatus.OK.value()).extract().as(MemberResponse.class);  
  
    assertThat(member.getEmail()).isEqualTo(EMAIL);  
}
```

`preemitive()` 를 생략하면 `authorization` 헤더가 없어지게 된다.

```java
// PreemptiveBasicAuthScheme.java
public String generateAuthToken() {  
  ("Basic " + "$userName:$password".getBytes(AUTH_ENCODING).encodeBase64()).toString()  
}
```

Basic의 경우 :로 구분하는 것을 볼 수 있다.

- Basic을 꼭 붙여야 할까? : https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization#directives
- `validateToken` 은 토큰이 만료되었는지 아닌지를 판단하기 위해 사용한다.

## Spring Mvc with 다른 구성 요소

- `MethodArgumentResolver`: 특정 요청들을 분리해서 매개변수로 전달하는 것
