---
title   : WebClient를 도입하게 된 이유
date    : 2023-08-03 16:48:11 +0900
updated : 2023-08-03 16:48:32 +0900
tags     : 
- shook
- 레벨3
- 우테코
---



현재 S-HOOK 의 서비스 DB에 들어있는 노래 외에, ManiaDB 에 있는 노래를 조회하기 위해 외부 API 에 요청을 보내야 합니다.     

그 중에서 S-HOOK은 `WebCient` 를 채택하게 되었는데, 이유는 다음과 같습니다.      

## WebClient 란?

## RestTemplate을 사용하지 않는 이유

### Maintenance Mode의 RestTemplate

> NOTE: As of 5.0 this class is in maintenance mode, with only minor requests for changes and bugs to be accepted going forward. Please, consider using the org.springframework.web.reactive.client.WebClient which has a more modern API and supports sync, async, and streaming scenarios.

> 5.0 버전부터 `RestTemplate` 은 maintenance mode 에 있으며, 앞으로는 사소한 변경과 버그 요청만 받아들여질 예정입니다. 동기, 비동기, streraming 서비스를 지원하는 최신 API 가 포함된 `WebClient` 를 고려해 보세요.

Spring 의 공식 문서에서도 Spring 5.0 부터는 해당 모듈에 기능을 추가하지 않을 것이라고 명시되어 있습니다. 즉, `RestTemplate` 은 버전 업그레이드가 수행되면 Deprecated 될 수도 있습니다.    

따라서 향후 대응을 위해 `WebClient` 로 작성하는 것이 좋을 것이라 생각합니다.     

### 

`RestTemplate` 의 경우는 `synchronous`, `blocking call` 만 가능하지만, `WebClient` 는 `async`, `nonblocking` 을 지원합니다.     

이후 외부 API 에 요청을 보낼 때 `async`, `nonblocking` 요청이 필요하게 될 경우에 