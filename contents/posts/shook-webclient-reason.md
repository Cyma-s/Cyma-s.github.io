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

웹으로 API 를 호출하기 위해 사용되는 Http Client 모듈 중 하나이다.     
기존의 동기 API 를 제공할 뿐만 아니라, nonblocking 과 async 접근 방식을 지원하며 효율적인 통신이 가능하다.

## RestTemplate을 사용하지 않는 이유

### Maintenance Mode의 RestTemplate

> NOTE: As of 5.0 this class is in maintenance mode, with only minor requests for changes and bugs to be accepted going forward. Please, consider using the org.springframework.web.reactive.client.WebClient which has a more modern API and supports sync, async, and streaming scenarios.

> 5.0 버전부터 `RestTemplate` 은 maintenance mode 에 있으며, 앞으로는 사소한 변경과 버그 요청만 받아들여질 예정입니다. 동기, 비동기, streraming 서비스를 지원하는 최신 API 가 포함된 `WebClient` 를 고려해 보세요.

Spring 의 공식 문서에서도 Spring 5.0 부터는 해당 모듈에 기능을 추가하지 않을 것이라고 명시되어 있습니다. 즉, `RestTemplate` 은 버전 업그레이드가 수행되면 Deprecated 될 수도 있습니다.    

따라서 향후 대응을 위해 `WebClient` 로 작성하는 것이 좋을 것이라 생각합니다. (사실 이게 가장 큰 이유입니다.)     

### non-blocking, async 지원

`RestTemplate` 의 경우는 `synchronous`, `blocking call` 만 가능하지만, `WebClient` 는 `async`, `nonblocking` 을 지원합니다.     

이후 외부 API 에 요청을 보낼 때 `async`, `nonblocking` 요청이 필요하게 될 경우에는 `WebClient` 가 강점을 가진다고 할 수 있겠습니다.     

그러나 현재 `WebClient` 가 사용된 부분은 `blocking` 으로 동작하고 있습니다. 외부 API 에서 받아오는 요청을 가공해서 사용자에게 보내주어야 하기 때문에 요청이 받아질 때까지 기다려야 합니다.     
그러므로 현재로써는 큰 장점은 아니지만, 추후 해당 기능이 필요해지는 경우 `RestTemplate` 보다 강점을 갖게 될 것입니다.     

### 동시 사용자 성능

Spring Boot 2 부터 IO 가 빈번한 경우에 성능이 향상되었습니다.    

동시 사용자의 규모가 별로 없는 경우에는 `RestTemplate` 을 사용하는 것은 별 문제 없지만, 어느 정도의 규모가 있는 경우에는 `WebClient` 를 선택하는 것이 바람직하다고 할 수 있습니다.     

### 구현 상의 이점

`WebClient` 는 예외처리를 람다로 할 수 있습니다. 

다음은 S-HOOK 에서 사용한 코드 중 일부입니다.

```java
private ManiaDBAPISearchResponse getResultFromManiaDB(final String searchUrl) {  
    return webClient.get()  
        .uri(searchUrl)  
        .accept(MediaType.TEXT_XML)  
        .acceptCharset(StandardCharsets.UTF_8)  
        .retrieve()  
        .onStatus(HttpStatusCode::is4xxClientError, (clientResponse) -> {  
            throw new ExternalApiException.ManiaDBClientException();  
        })  
        .onStatus(HttpStatusCode::is5xxServerError, (clientResponse) -> {  
            throw new ExternalApiException.ManiaDBServerException();  
        })  
        .bodyToMono(ManiaDBAPISearchResponse.class)  
        .block();  
}
```

이렇게 status 마다 각 예외를 람다 함수로 따로 처리해줄 수 있습니다.    

그러나 `RestTemplate` 을 사용하는 경우, 반드시 `try-catch` 를 사용해주어야 합니다.    
마찬가지로 S-HOOK 의 코드 중 일부입니다.

```java
public GoogleMemberInfoResponse getMemberInfo(final String accessToken) {  
    try {  
        ...
    } catch (HttpClientErrorException e) {  
        throw new OAuthException.InvalidAccessTokenException();  
    } catch (HttpServerErrorException e) {  
        throw new OAuthException.GoogleServerException();  
    }
```

사람마다 취향차이가 있을 수 있지만, 개인적으로는 람다로 예외처리를 하는 방식이 좀 더 우아해보입니다. 

---
위와 같은 이유로 S-HOOK 에서는 외부 API 를 호출할 때, `WebClient` 를 도입하기로 결정하였습니다.    
