---
title   : Spring profile Trouble shooting
date    : 2023-07-31 22:19:11 +0900
updated : 2023-07-31 22:19:33 +0900
tags     : 
- spring
- 개발
- trouble-shooting
---

## Local Profile 실행이 안 되는 문제

```bash
22:18:51.159 [main] ERROR org.springframework.boot.SpringApplication -- Application run failed
org.springframework.boot.context.config.InactiveConfigDataAccessException: Inactive property source 'Config resource 'class path resource [shook-security/application.yml]' via location 'classpath:shook-security/application.yml'' imported from location 'class path resource [shook-security/application.yml]' cannot contain property 'spring.profiles.group.prod' [origin: class path resource [shook-security/application.yml] - 4:13]
```

현재 default profile을 실행시키고 있으므로, 서브 모듈에 존재하는 prod profile은 실행되지 않아야 한다.     
그런데 애플리케이션을 실행시키니, 이런 예외가 발생했다.     

```yml
# 기존 prod
spring:  
  profiles:  
    group:  
      prod: oauth, jwt  
  config:  
	import: classpath:shook-security/application-jwt.yml, classpath:shook-security/application-oauth.yml
...
```

`spring.profiles.group` 옵션은 '활성화 되는' 프로필에 있어야 한다.    
마찬가지로 `spring.profiles.include` 옵션도 그렇다.    

local 환경에서는 'prod' 가 활성 프로필이 아니기 때문에, 예외가 발생하는 것이다.    

그러므로 다음과 같이 변경하면 된다.    

```yml
# 기존 prod 에서는 group 설정을 삭제한다.
...
```

```yml
# 기본 application.yml 에 group 설정을 해준다.

spring:  
  profiles:  
    group:  
      prod: oauth, jwt  
  config:  
    import: classpath:shook-security/application.yml
```

## local 프로필이 prod 프로필을 덮어 씌우는 문제

github self-hosted runner 를 설정하면서, 로그를 확인했다.    
분명 개발 서버에서는 prod 프로필으로 설정되어야 하는데, 이상하게도 데이터베이스 username은 prod 유저 이름인데, 데이터베이스 url이 local 프로필의 url 이었다.     

왜 이런 상황이 발생했을까?

```yml
# main/resources 내부의 기본 application.yml
spring:  
  config:  
    import: classpath:shook-security/application.yml  
  profiles:  
    group:  
      prod: oauth, jwt  
  
---  
spring:  
  datasource:  
    driver-class-name: org.h2.Driver  
    url: jdbc:h2:mem:shook  
  
  sql:  
    init:  
      mode: always  
      schema-locations: classpath:schema.sql  
      data-locations: classpath:data.sql  
  
  jpa:  
    properties:  
      hibernate:  
        format_sql: true  
        show-sql: true  
    hibernate:  
      ddl-auto: validate
```

이때, 불러와지는 prod 프로필은 파일 하단이 아닌, local 프로필 위에 작성된다.     
다음과 같이 말이다. 

```yml
# main/resources 내부의 기본 application.yml
spring:  
  config:  
    import: classpath:shook-security/application.yml  
  profiles:  
    group:  
      prod: oauth, jwt  

---
prod profile....
  
---  
spring:  
  datasource:  
    driver-class-name: org.h2.Driver  
    url: jdbc:h2:mem:shook  
...
```

따라서 prod 프로필에만 존재하는 username, password 는 제대로 설정된 반면, 중복되게 정의된 `spring.datasource.url` 은 local 프로필의 내용으로 덮어씌워진 것이다.     

그렇다면 어떻게 해결할 수 있을까?      

답은 간단하다. local profile 의 이름을 정해주면 된다.     

```yml
spring:  
  config:  
    import: classpath:shook-security/application.yml  
  profiles:  
    group:  
      prod: oauth, jwt  
    active: local  
  
---  
spring:  
  config:  
    activate:  
      on-profile: local
...
```

local 에서는 실행했을 때 local 프로필로 실행될 수 있도록 `active` 설정을 해주고, `on-profile` 로 이름을 명시해준다.     

이전 파일에서는 local profile 이라는 명시가 없었기 때문에, 그냥 해당 application.yml 파일이 실행될 때 같이 실행되는 설정으로 인식한 듯 하다.    

이렇게 하면 정상적으로 각 프로필을 지정하는 것을 볼 수 있을 것이다.    

## Profile에 대한 짧은 지식

- profile 파일 이름으로 `application-{profile-name}.yml` 을 적으면, 굳이 `spring.config.activate.on-profile` 에 이름을 명시하지 않아도 잘 동작한다.    

- `spring.config.import` 는 대부분의 경우 없어도 잘 동작한다고 한다. 즉, yml 파일이 다른 경로에 있어도 알아서 prod를 읽어온다... 그렇지만 명시적으로 적어주는 게 좋다고 한다.    