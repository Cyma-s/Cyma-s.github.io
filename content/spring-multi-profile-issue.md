---
title   : Spring의 Profile은 어떤 순서로 읽힐까?
date    : 2023-06-26 21:52:20 +0900
updated : 2023-06-26 21:52:54 +0900
tags     : 
- spring
- 개발
- matzip
- trouble-shooting
---

## 로컬 환경에서 로컬 프로필이 적용되지 않는 문제

로컬에서는 로컬 프로필이 적용되어야 하는데 submodule 로 지정해준 prod 프로필이 적용되는 문제가 발생했다.  [PR 링크](https://github.com/The-Fellowship-of-the-matzip/mat.zip-back/pull/158)

기존에는 prod 파일에도 이런 설정이 있었다.

```yaml
# prod/application.yml
spring:  
  profiles:  
    active:  
      - prod  
    group:  
      prod:  
        - web-prod  
        - db-prod
---
...
```

`application.yml` 파일은 다음과 같았다.

```yaml
spring:  
  profiles:  
    active:  
      - local  
    group:  
      local:  
        - web-local  
        - db-local  
      prod:  
        - web-prod  
        - db-prod  
  config:  
    import: classpath:prod/application.yml
---
...
```

이대로 실행하면, 실행되는 프로필은 prod 였다.

```bash
2023-06-22 18:20:00.952  INFO 12487 --- [           main] c.woowacourse.MatzipExternalApplication  : The following 3 profiles are active: "prod", "web-prod", "db-prod"
```

문제의 원인은 **`active` 가 여러 개 존재하기 때문이다.**     
application-prod에도 `active` 설정을 해주었기 때문에 `active` 설정이 덮어 씌워진 것이다.

따라서 문제 해결을 위해서는 prod의 `application.yml` 을 다음처럼 바꾸면 된다.

```yaml
spring:  
  profiles:  
    group:  
      prod:  
        - web-prod  
        - db-prod
---
```

### prod의 application.yml이 local의 application.yml 보다 늦게 읽히는 걸까?

여기까지 문제는 해결됐는데, 왜 prod가 local보다 늦게 실행되는지 궁금했다.     
스프링이 local을 먼저 읽고, prod를 읽기 때문에 덮어 씌워지는 건가? 해서 테스트를 해보았다.     

prod가 나중에 읽혀진다면, 스프링이 실행되고 나서 정해진 설정은 prod의 필드 값이어야 한다.     
그러나 확인해보니 local 의 필드 값이 저장되어 있었다.    
대체 어떻게 된 일일까?

결론적으로는 `spring.config.import` 를 할 때 파일을 가져오는 방식 때문에 그렇다.     
`spring.config.import` 를 하게 되면 해당 경로에 있는 yml 파일을 아래에 추가한다.     
주의해야 하는 것은 맨 위의 디폴트 설정값 이후에 바로 추가된다는 것이다.     
즉, 다음과 같다.

```yaml
spring:  
  profiles:  
    active:  
      - local  
    group:  
      local:  
        - web-local  
        - db-local  
      prod:  
        - web-prod  
        - db-prod  
  config:  
    import: classpath:prod/application.yml
---
spring:  
  profiles:  
    active:  
      - prod  
    group:  
      prod:  
        - web-prod  
        - db-prod
---
...
```

이런 식으로 값이 추가 되기 때문에, 처음의 문제 상황에서는 `active` 만 덮어씌워지고, 나머지 설정들은 local 값이 된 것이다.     
yaml 파일은 위에서부터 아래로 읽기 때문에, 똑같은 설정 값을 갖는 필드는 그냥 값이 덮어 씌워지게 된다.    

### 결론

`spring.config.import` 는 파일 맨 끝에 내용을 추가하는 게 아니라는 것을 알게 되었다.

### 참고
- https://bbbicb.tistory.com/53
- https://jaime-note.tistory.com/371