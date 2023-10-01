---
title   : Spring MVC
date    : 2023-04-11 19:34:49 +0900
updated : 2023-04-11 19:36:08 +0900
tags     : 
- 레벨2
- 우테코
- 개발
- spring
---

**내용을 주관적으로 덜어냈습니다. 자세한 내용은 참고 링크를 확인해주세요 👍**

## Mapping

### Request Mapping

Request Mapping은 Controller의 메서드에 Request를 매핑하기 위해 사용한다.
class level에서 사용하면 shared mapping을 표현할 수 있다. method level에서 사용하면 특정 endpoint mapping 으로 좁혀서 표현할 수 있다.

HTTP 메서드 별로 `@RequestMapping` 의 변형은 다음과 같다.

-   `@GetMapping`
-   `@PostMapping`
-   `@PutMapping`
-   `@DeleteMapping`
-   `@PatchMapping`

```java
@RestController
@RequestMappping("/customers")
class CustomerController {

	@GetMapping("/{id}")
	public Customer getCustomer(@PathVariable Long id) {
		// ...
	}
}
```

`@RequestMapping` 어노테이션을 Controller 상단에 적어주면, Controller 내부의 모든 메서드가 같은 URL을 공유하게 된다.

`@GetMapping` 같은 specific annotation은 메서드 상단에 적는다. 
해당 메서드가 어떤 URL에서 불려야할 지를 범위를 좁혀 특정지을 수 있다.

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestmapping)

### URI Patterns

`@RequestMapping` 은 URL 패턴을 이용해서 mapping 될 수 있다.

- `PathPattern` : URL 경로와 매칭되는 사전 구문 분석된 패턴을 `PathContainer` 로 사전 구문 분석한다. 
	- `AntPathMatcher` 와 달리 `**` 가 패턴 끝에서만 지원된다. `/pages/{**}` 는 가능하지만, `/pages/{**}/details` 는 안 된다.
	- 참고: [공식문서](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/web/util/pattern/PathPattern.html)
- `AntPathMatcher` : 문자열 패턴을 문자열 경로와 일치시킨다. 덜 효율적이고, 문자열 경로 입력은 URL과 관련된 인코딩, 기타 문제를 효과적으로 처리하는데 어려움이 있다.
	- 참고: [공식문서](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/util/AntPathMatcher.html)

`PathPattern` 을 사용하는 것을 권장한다.

### Media Types - produces

Request Header와 Controller Method가 생성하는 콘텐츠 유형 목록을 기반으로 Request Mapping의 범위를 좁힐 수 있다.

```java
@GetMapping(path = "/pages/{id}", produces = "application/json")
```

위 예제에서 `/pages/{id}` 로 들어오는 요청 중 "application/json" 속성을 갖는 요청만 해당 메서드로 mapping 된다.

`!text/plain` 같은 부정 표현도 지원된다.

class level에서 `produces` 을 사용하면 class level에서 `produces` 가 공유된다.
그러나 method level에서 `produces` 를 사용하면 class level에서 설정이 확장되는 것이 아니라 method level의 `produces` 로 설정이 덮어 씌워진다.

> `MediaType` 중에 빈번하게 사용되는 media type을 상수로 제공한다.
> Ex. `APPLICATION_JSON_VALUE`, `APPLICATION_XML_VALUE` 

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestmapping-produces)

### Media Types - consumes

Request Header와 Controller Method가 생성하는 콘텐츠 유형 목록을 기반으로 Request Mapping의 범위를 좁힐 수 있다.

```java
@PostMapping(path = "/page", consumes = "application/json")
```

위 예제에서 `/pages/{id}` 로 들어오는 요청 중 "application/json" 속성을 갖는 요청만 해당 메서드로 mapping 된다.

`!text/plain` 같은 부정 표현도 지원된다.

class level에서 `consumes` 을 사용하면 class level에서 `consumes` 가 공유된다.
그러나 method level에서 `consumes` 를 사용하면 class level에서 설정이 확장되는 것이 아니라 method level의 `consumes` 로 설정이 덮어 씌워진다.

> `MediaType` 중에 빈번하게 사용되는 media type을 상수로 제공한다.
> Ex. `APPLICATION_JSON_VALUE`, `APPLICATION_XML_VALUE` 

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestmapping-consumes)

### Parameters, headers

Request Parameter 조건에 따라 Request Mapping의 범위를 좁힐 수 있다.
Request Parameter가 존재하는지, 아닌지, 특정 값을 갖는지 테스트할 수 있다.

```java
@GetMapping(path = "/pages/{pageId}", params = "myParam=myValue")
```

`myValue` 값을 갖는 `myParam` 인 경우에만 해당 메서드가 실행된다.

Content-Type, Accept를 체크할 수도 있지만, consumes나 produces를 사용하는 것이 더 낫다.

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestmapping-params-and-headers)

## Handler

### Method Arguments

종류가 너무 많으므로, 학습 테스트에서 다룬 `@RequestBody` , `@RequestParam` 만 살펴보겠다.

#### `@RequestParam`
`@RequestParam` 은 Multipart file을 포함해서 Request Parameter에 접근할 수 있게 한다. Parameter 값은 선언된 메서드 매개변수로 바인딩 된다.

기본적으로는 `@RequestParam` 을 사용하는 메서드의 매개변수가 필수이지만, `required` 를 `false` 로 선언하면 메서드 매개변수가 선택 사항이라는 것을 지정할 수 있다.

```java
@GetMapping
public String setupForm(@RequestParam("petId") int petId, Model model) {
	// ...
}
```

Parameter 타입이 String이 아닌 경우에는 타입 변환이 자동으로 일어난다.

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestparam)

#### `@RequestBody` 

```java
@PostMapping("/accounts") 
public void handle(@RequestBody Account account) { // ... }
```

`@Valid` annotation과 같이 조합되어 사용될 수 있다.

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestbody)

### Return Values

### `@ResponseBody`

자바 객체를 HTTP Request body로 전송할 수 있다.
class level을 지원한다. class level에서 사용하면 모든 controller method에서 사용할 수 있다.

```java
@GetMapping("/account/{id}")
@ResponseBody
public Actor handle() {
	// ...
}
```

`@ResponseBody` 어노테이션이 적용된 메서드는 `HttpMessageConverter` 를 사용해서 변환을 처리한다.

- 참고 자료: [공식문서](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-return-types)

### `ResponseEntity<B>`

`@ResponseBody` 와 비슷하지만 HttpStatus와 HttpHeaders, HttpBody가 있다.

```java
@GetMapping("/something")
public ResponseEntity<String> handle() {
	String body = ... ;
	String etag = ... ;
	return ResponseEntity.ok().eTag(etag).body(body);
}
```

`ResponseEntity` 가 제네릭 타입

## Exception

`@ExceptionHandler` 로 Controller 메서드의 예외를 처리하는 메서드를 가질 수 있다.

```java
@ExceptionHandler 
public ResponseEntity<String> handle(IOException ex) { // ... }
```

일치시킬 예외 유형을 좁힐 수도 있다.

```java
@ExceptionHandler({FileSystemException.class, RemoteException.class}) public ResponseEntity<String> handle(IOException ex) { 
	// ...
}
```

`IOException` 중에 `FileSystemException`, `RemoteExceptoin` 을 처리한다.

주어진 예외 인스턴스를 원래 형식으로 다시 throw 하여 처리하지 않도록 선택할 수도 있다. 특정 context의 일치에만 관심있는 때에 유용하다. 

`@ExceptionHandler`는 `@Controller` 클래스에서만 적용된다. 

그러나 `@ControllerAdvice`가 적용되면 `@ControllerAdvice` 내부에 있는 모든 ExceptionHandler는 모든 컨트롤러에 적용될 수 있다.