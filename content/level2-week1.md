---
title   : 레벨2 1주차
date    : 2023-04-11 10:58:56 +0900
updated : 2023-04-11 14:16:00 +0900
tags     : 
- 우테코
- 레벨2
---
# 4/11

## 레벨2를 슬기롭게 소화하기

- 학습해야하는 내용의 범위가 넓으니, 깊이를 제한한다.
- 얼마까지 해야 할까? -> 프롤로그 참고하기
- 다른 웹 서비스를 유심히 살펴보자. 평소 자주 사용하거나 내가 만드는 것과 비슷한 서비스를 뜯어본다.
- 현재 상태에 따라서 목표를 설정하자. 나는 스프링을 접해본 적이 있지만 얕은 지식을 가지고 있다. 내가 쓰고 있는 기술들을 알고 쓰고 싶다!
- 꾸준함을 잃지 말자.
- 레벨2의 나의 목표는 무엇인가? 내가 쓰는 기술들이 무엇인지, 왜 좋은지, 어떤 점에서는 안 좋을 수 있는지 알고 사용하고 싶다. '알고 쓰자!'가 이번 레벨2의 목표다.
- 왜 스프링을 학습해야할까? 그건 아직 모르겠다... 그냥 자바로 웹 애플리케이션을 만들어보고 싶어서?
- 처음 하는 사람보다는 이미 알고 있는 사람이 동작 원리에 대해서 학습했으면 좋겠다.

# 4/14

## Spring MVC

### `@RestController` vs `@Controller`

- `@RestController` 는 `@ResponseBody`를 포함하는 것으로, 그냥 객체를 리턴해도 `@ResponseBody` 를 한 것과 동일하다.
- `@Controller` 에서 String을 리턴하면 view 파일을 찾는다. `@RestController` 는 String을 리턴하면 `@ResponseBody` 로 감싸진 String 이 리턴된다.

### `@ResponseEntity`

status와 header를 포함한다. status를 설정해줄 수 있다.
컨벤션을 통일하는 것이 좋다.
내 생각: 차라리 모든 응답에 `ResponseEntity`로 감싸는 게 나을 것 같다. (status 설정하고 쓰는 것)

`ResponseEntity` raw type으로 사용하지 말자.

## Spring JDBC

connection을 열고 닫는 과정이 필요 없다.
나는 간단하게 쿼리만 작성하면 되어서, 도메인 로직에만 집중할 수 있다.

`JdbcTemplate`, `NamedParameterJdbcTemplate`, `SimpleJdbcInsert` 를 사용하는 기준을 잡으면 좋겠다. DB에 조회에 그치지 말고, 해당 template 들의 차이점을 알고 썼으면 좋겠다.


