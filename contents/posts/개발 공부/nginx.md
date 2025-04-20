---
title: NGINX
date: 2023-10-17 10:23:23 +0900
updated: 2023-12-12 01:57:30 +0900
tags:
  - infra
---

## `X-Forwarded-Prefix`

리버스 프록시나 API 게이트웨이 같은 중간자 서버가 원래 요청의 컨텍스트나 경로 접두사 정보를 애플리케이션에 전달할 때 사용하는 HTTP 헤더이다.

해당 설정이 되어 있지 않으면 swagger 를 사용할 때 다음과 같이 swagger 문서 위치를 찾지 못할 수도 있다. 

![[swagger-fail-load.png]]

필요한 경우는 다음과 같다.

1. Base Path Routing: 중간자 서버가 특정 경로 접두사를 기반으로 요청을 다른 다운스트림 서비스로 라우팅하는 경우
2. Application Context Awareness: 중간 서버에서 리버스 프록시된 요청의 원래 경로 접두사를 알아야 하는 애플리케이션 (올바른 상대 URL 생성을 위해)
	- swagger UI 가 API 문서에서 각 엔드포인트에 대한 상대적인 URL 을 생성한다. 만약 애플리케이션이 리버스 프록시 뒤의 특정 base path 에서 동작한다면, 상대 URL 은 올바른 base path 를 포함해야 하므로 `X-Forwarded-Prefix` 로 base-path 를 알아내야 한다.
3. Security and Logging: 로깅이나 보안 감사를 위해 원래 요청의 접두사를 알고 싶을 때
	- Swagger 는 `ForwardedHeaderFilter` 를 사용하여 `X-Forwarded-*` 헤더를 처리하고, 해당 정보를 사용해서 요청 URL 을 재구성한다. Swagger 는 이렇게 재구성된 URL 을 사용해서, 올바른 API 엔드포인트 URL 을 생성한다.

```nginx
location /app {
    proxy_set_header X-Forwarded-Prefix /app;
    proxy_pass http://backend_server;
}
```

이렇게 설정하면 백엔드 서비스가 `X-Forwarded-Prefix` 헤더를 사용해서 원래 요청의 접두사를 알 수 있다.

[[forwarded-header-filter]] 참고

## health-checking

```
http {
    upstream backend_servers {
        server backend1.example.com; # 특정 포트1
        server backend2.example.com; # 특정 포트2

        # 헬스 체킹 설정
        health_check interval=30s fails=3 passes=2 uri=/healthcheck;  # 특정 url 로 요청
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```