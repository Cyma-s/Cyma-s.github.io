---
title: ForwardedHeaderFilter
date: 2023-08-17 13:33:44 +0900
updated: 2023-10-18 00:16:16 +0900
tags:
  - spring
---

## `ForwardedHeaderFilter`

Spring Framework 에서 제공하는 서블릿 필터이다. `OncePerRequestFilter` 를 상속하고 있다.
리버스 프록시나 로드 밸런서 같은 중개자 서버에 의해 설정된 `X-Forwarded-*` 헤더를 처리하는 역할을 수행한다.

removeOnly 로 구성할 수도 있는데, 이 경우 헤더를 제거하지만 사용하지는 않는다.

### 메서드

- `doFilterInternal` 는 단일 요청 스레드 내에서 요청당 한 번만 호출되도록 보장한다.
- `setRemoveOnly`: `Forwarded`, `X-Forwarded-*` 헤더만 제거되고 그 안의 정보는 무시되는 모드를 활성화한다.

## 역할

1. URL Reconstruction
원본 요청의 스키마 `X-Forwarded-Proto` , 호스트 `X-Forwarded-Host`, 포트 `X-Forwarded-Port` 및 경로 접두사 `X-Forwarded-Prefix` 에 관한 정보를 이용하여 요청 URL 을 재구성한다.
애플리케이션 내에서 `HttpServletRequest` 를 사용해서 URL 정보를 조회할 때, 리버스 프록시나 로드 밸런서 뒤에서의 원래 요청 정보를 바탕으로 한 올바른 URL 정보를 얻을 수 있다.

2. Scheme & Remote Address
`X-Forwarded-Proto` 헤더를 기반으로 요청 스키마 (http, https) 를 업데이트한다.
`X-Forwarded-For` 헤더를 사용하여 원래 클라이언트의 IP 주소를 알아낸다. 이렇게 하면 `HttpServletRequest.getRemoteAddr()` 호출 시 원래 클라이언트의 IP 를 반환할 수 있다.

3. Clearing Forwarded Headers
필터는 처리 후 `X-Forwarded-*` 헤더를 요청에서 제거할 수 있다. 보안 목적으로 유용하다.

## Spring 에 설정하기

`ForwardedHeaderFilter` 는 자동으로 활성화되지 않는다.

```yml
server:
	forward-headers-strategy: framework
```

이렇게 `application.yml` 을 설정해주면 `ForwardedHeaderFilter` 가 자동으로 등록되어 사용될 수 있다.