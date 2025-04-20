---
title   : Controller vs RestController
date    : 2023-04-15 11:57:08 +0900
updated : 2023-04-15 12:33:33 +0900
tags     : 
- 개발
- spring
---

## `@Controller`

`@Controller` 는 `@Component` 클래스가 특화된 것으로, classpath scanning 을 통해 구현 클래스들을 자동으로 감지하도록 해준다.

보통 `@Controller` 와 `@RequestMapping` 어노테이션이 함께 쓰인다.

```java
@Controller
@RequestMapping("books")
public class SimpleBookController {

    @GetMapping("/{id}", produces = "application/json")
    public @ResponseBody Book getBook(@PathVariable int id) {
        return findBookById(id);
    }

    private Book findBookById(int id) {
        // ...
    }
}
```

`@ResponseBody` 어노테이션은 리턴되는 객체를 `HttpResponse` 로 자동 직렬화하도록 한다.

## `@RestController`

Spring 4.0 에서 RESTful 웹서비스 생성을 단순화 하기 위한 `@RestController` 가 소개되었다.
`@RestController` 는 `@Controller` 와 `@ResponseBody` 를 합친 어노테이션이다. 
`@RestController` 가 존재하는 클래스의 모든 메서드에는 `@ResponseBody` 어노테이션이 존재하는 것과 같다. 

`@RestController` 는 controller의 특화 버전이다.

```java
@RestController
@RequestMapping("books-rest")
public class SimpleBookRestController {
    
    @GetMapping("/{id}", produces = "application/json")
    public Book getBook(@PathVariable int id) {
        return findBookById(id);
    }

    private Book findBookById(int id) {
        // ...
    }
}
```

`@RestController` 어노테이션이 붙은 클래스들은 `@ResponseBody` 가 필요하지 않다.
모든 Controller의 Request Handling method는 리턴되는 객체들을 `HttpResponse` 로 자동적으로 직렬화한다.

## 두 어노테이션의 차이점

`@Controller` 는 reponse가 주로 HTML 페이지인 UI 기반의 애플리케이션에서 사용된다. 
메서드가 view name을 리턴하면 view resolver 가 해당하는 view를 찾아 응답한다.

`@RestController` 는 데이터를 HTML로 변경하는 server-side rendering을 수행하지 않고, HTTP response를 JSON 또는 XML로 전달한다.

## 참고 자료

- https://www.baeldung.com/spring-controller-vs-restcontroller
