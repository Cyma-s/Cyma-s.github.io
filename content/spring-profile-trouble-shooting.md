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

## Profile에 대한 짧은 지식

- profile 파일 이름으로 `application-{profile-name}.yml` 을 적으면, 굳이 `spring.config.activate.on-profile` 에 이름을 명시하지 않아도 잘 동작한다.    

- `spring.config.import` 는 대부분의 경우 없어도 잘 동작한다고 한다. 즉, yml 파일이 다른 경로에 있어도 알아서 prod를 읽어온다... 그렇지만 명시적으로 적어주는 게 좋다고 한다.    