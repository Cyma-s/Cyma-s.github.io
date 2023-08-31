---
title   : CORS
date    : 2023-07-20 15:36:59 +0900
updated : 2023-07-20 15:37:27 +0900
tags     : 
- 네트워크
- 개발
---

## CORS

Cross-Origin Resource Sharing. 어떤 출처에서 실행중인 웹 애플리케이션이 다른 출처의 리소스에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제

### Origin

URL 은 protocol, Host, Path, Query String, Fragment, 포트 번호로 구성되어 있다.

`https://vero.wiki:443/til/2023-08?page=1#오늘` 을 예시로 들어보자.

- Protocol: `https://`
- Host: `vero.wiki`
- Port: `443` (생략 가능)
- Path: `/til/2023-08`
- Query String: `?page=1`
- Fragment: `오늘`

이 중, Protocol, Host, Port 3가지가 같으면 동일 출처 (origin) 이라고 한다.

### SOP

Same-Origin Policy. 같은 출처에서만 리소스를 공유할 수 있다는 정책이다.    
다른 출처로부터 조회한 자원들의 읽기 접근을 막아 다른 출처의 공격을 예방한다.    

그러나 웹에서 다른 출처의 리소스를 가져와서 사용하는 일은 흔하다. 이런 예외 상황을 위해 CORS 정책을 지킨 리소스 요청은 출처가 다르더라도 허용하기로 했다.

### 왜 SOP 가 생겨났을까?

웹 초기 단계에서 웹 보안의 기본 원칙으로 도입되었다. 다양한 웹 사이트와 서비스가 정보와 리소스를 공유하는 환경에서 동작할 때, 다른 출처의 리소스에 자유롭게 액세스하는 것은 큰 보안 위험을 야기할 수 있다.

SOP 는 정보의 무분별한 액세스를 제한한다. 웹사이트 A 의 스크립트가 웹사이트 B 의 데이터와 리소스에 접근할 수 있다면, 웹사이트 A 가 B의 사용자 데이터를 쉽게 읽어올 수 있을 것이다. 이는 CSRF 나 XSS 공격이 발생했을 때 사용자의 민감한 정보가 노출되는 결과가 발생할 수 있다.

(`Cross-Site Scripting` , 즉 XSS 공격이란 공격자가 악의적인 스크립트를 웹 페이지에 삽입하여 다른 사용자가 스크립트를 실행하게 하는 공격이다.)

### 출처를 비교하는 로직의 주체

출처를 비교하는 로직은 브라우저에 구현되어 있다. CORS 정책을 위반하는 리소스 요청을 서버로 보내더라도 해당 서버가 같은 출처에서 보낸 요청만 받겠다고 설정된 경우가 아니면 서버는 정상적으로 응답한다.     

즉, 서버간 통신을 할 때에는 이 정책이 적용되지 않는다.

## Preflight Request

본 요청을 보내기 전에 보내는 예비 요청이다. OPTION 메서드가 사용된다.    

Origin 헤더에 현재 요청하는 origin을 담고, Access-Control-Request-Method 헤더에는 요청하는 HTTP 메서드, Access-Control-Request-Headers 에는 요청 시 사용할 헤더를 담아 서버로 요청을 전송한다.

브라우저가 서버에게 예비 요청을 먼저 보내고, 서버는 이 요청에 대한 응답으로 현재 자신이 어떤 것들을 허용하고 금지하는지에 대한 정보를 응답 헤더에 담아 브라우저에 돌려준다.

브라우저가 자신이 보낸 예비 요청과 서버가 응답에 담아준 허용 정책을 비교한 후, 요청을 보내도 안전하다고 판단되면 본 요청을 보낸다. 

## Simple Request

CORS Preflight 를 발생시키지 않는 요청이다.    
예비 요청 없이 본 요청만으로 CORS 정책 위반 여부를 검사하기도 한다.

예비 요청없이 바로 서버에게 본 요청을 보낸 후, 응답 헤더에 `Access-Control-Allow-Origin` 과 같은 값을 보내주면 그때 브라우저가 CORS 정책 위반 여부를 검사하는 방식이다. 

다음과 같은 조건들을 모두 만족해야만 예비 요청을 생략할 수 있다.

1. 요청의 메서드는 GET, HEAD, POST 중 하나여야 한다.
2. Accept, Accept-Language, Content-Language, Content-Type, DPR, Downlink, Save-Data, Viewport-Width, Width 를 제외한 헤더를 사용하면 안 된다. 
3. 만약 Content-Type 을 사용하는 경우 application/x-www-form-urlencoded, multipart/form-data, text/plain 만 허용된다.

위 조건을 보면 알겠지만, 조건이 굉장히 까다롭기 때문에 대부분 만족시키기 어렵다.

## Credentialed Request

다른 출처간 통신에서 보안을 강화하고 싶을 때 사용하는 방법이다. 

요청에 인증과 관련된 정보를 담을 수 있게 해주는 옵션은 credentials 옵션으로, 다음과 같은 값을 사용할 수 있다.

1. same-origin (기본값) : 같은 출처 간 요청에만 인증 정보를 담는다.
2. include: 모든 요청에 인증 정보를 담는다.
3. omit: 모든 요청에 인증 정보를 담지 않는다.

same-origin 이나 include 를 사용하여 리소스 요청에 인증 정보가 포함되면, 브라우저는 다음과 같은 규칙을 추가하여 좀 더 엄격하게 검사한다.    

1. Access-Control-Allow-Origin 에는 와일드 카드를 사용할 수 없으며, 명시적인 URL 을 제공해야 한다.
2. 응답 헤더에는 반드시 Access-Control-Allow-Credentials: true 가 존재해야 한다.

## 참고
- https://velog.io/@prayme/CORS-%EC%A0%95%EB%B3%B5%EA%B8%B0
