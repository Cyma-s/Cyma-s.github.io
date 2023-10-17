---
title: nginx
date: 2023-10-17 10:23:23 +0900
updated: 2023-10-17 10:23:23 +0900
tags:
  - infra
---

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

