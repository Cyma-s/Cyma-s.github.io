---
title   : Spring 에서 외부 API를 호출하는 방법 비교
date    : 2023-07-26 17:48:29 +0900
updated : 2023-07-26 17:48:59 +0900
tags     : 
- spring
- shook
- 레벨3
---

## RestTemplate

간단하고 사용하기 쉽다. sync-blocking 으로 작동한다.    
모든 주요 HTTP 메서드에 대해 메서드를 제공하여 모든 종류의 HTTP 요청을 쉽게 수행할 수 있다.    

그러나 Spring 5부터 `RestTemplate` 에 대한 업데이트는 없다. 따라서 새 프로젝트에서는 `WebClient` 를 사용하는 것을 추천한다고 한다.    
또한 blocking I/O 모델을 사용하므로 `WebClient` 와 같은 non-blocking 방식에 비해 리소스 사용 측면에서 효율성이 떨어질 수 있다.    

## WebClient

Spring MVC 에서도 `WebClient` 를 사용할 수 있다.     
Non-blocking 으로 동작하여 많은 수의 동시 요청을 효율적으로 처리하는 데 적합하여 확장성을 향상시킬 수 있다.    

그러나 Spring MVC 에서 사용되는 경우, non-blocking 특성이 각 request-response 주기에 대해서 스레드가 block 되는 서블릿 기반 애플리케이션에서는 이점이 없을 수도 있다.     
또한 Spring MVC 애플리케이션의 동기식 메서드에서 `WebClient` 호출 결과를 사용해야 하는 경우, 다음과 같이 `block()` 을 호출하여 결과를 기다려야 할 수도 있다.     

```java
Mono<String> result = webClient.get()
   .uri("/api/resource")
   .retrieve()
   .bodyToMono(String.class);

// To get the result synchronously
String response = result.block();
```

일반적으로 reactive programming 에서는 권장되지 않는다고 한다.

## Feign

Netflix 에서 개발 후, 나중에 Spring Cloud 생태계에 통합되었다.    
Spring Cloud 애플리케이션으로 작업 중이고, 로드 밸런싱과 같은 다른 Spring Cloud 기능과 쉽게 통합하려는 경우, 좋은 선택이 될 수 있다.    

그러나 Spring Cloud context 에 있지 않은 경우, 과한 구현이 될 수 있다.     

## 결론...

아무래도 이미 deprecated 된 `RestTemplate` 을 쓰는 것보다는 `WebClient` 를 사용해봐야겠다.    

추후 다른 글을 작성해보겠다.