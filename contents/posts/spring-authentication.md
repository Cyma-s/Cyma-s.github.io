---
title   : Authentication
date    : 2023-05-02 15:51:36 +0900
updated : 2023-05-02 15:51:50 +0900
tags     : 
- 레벨2
- spring
- 개발
---

## 인증과 인가

### 인증
- 식별 가능한 정보로 서비스에 등록된 유저의 신원을 입증하는 과정

### 인가
- 인증된 사용자에 대한 자원 접근 권한 확인 (인증이 선행되어야 한다)

인증과 인가 => 자원을 적절한 / 유효한 사용자에게 전달하거나 공개하기 위한 방법이다.

## Basic Authentication

클라이언트가 사용자 이름과 비밀번호를 통해 인증을 수행하는 것이다. 

Basic 키워드로 시작해서 base64로 인코딩된 `사용자이름:비밀번호` 값으로 이어진다. 이때, `:` 는 구분자로 사용되므로 빼놓지 말고 사용해야 한다.

```java
@Configuration
@EnableWebSecurity
public class CustomWebSecurityConfigurerAdapter {

    @Autowired private MyBasicAuthenticationEntryPoint authenticationEntryPoint;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
          .inMemoryAuthentication()
          .withUser("user1")
          .password(passwordEncoder().encode("user1Pass"))
          .authorities("ROLE_USER");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers("/securityNone")
            .permitAll()
            .anyRequest()
            .authenticated()
            .and()
            .httpBasic()
            .authenticationEntryPoint(authenticationEntryPoint);
        http.addFilterAfter(new CustomFilter(), BasicAuthenticationFilter.class);
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

`httpBasic()` 요소를 사용하여 `SecurityFilterChain` 빈 내에서 basic authentication을 정의할 수 있다.

```http
###### HTTP Request ######
GET /members/my HTTP/1.1
authorization: Basic ZW1haWxAZW1haWwuY29tOjEyMzQ=
accept: application/json
host: localhost:54560
connection: Keep-Alive
user-agent: Apache-HttpClient/4.5.13 (Java/11.0.19)
accept-encoding: gzip,deflate


###### HTTP Response ######
HTTP/1.1 200 OK
Transfer-Encoding: chunked
Keep-Alive: timeout=60
Connection: keep-alive
Date: Tue, 02 May 2023 08:28:03 GMT
Content-Type: application/json
```

`authorization` 헤더에 인코딩된 값을 넣어 Request로 전달한다.

### Base64

Base64는 바이너리 데이터를 내용 자체의 손실이나 수정 없이 전송할 수 있는 ASCII 문자 집합으로 인코딩 하는 방식이다.

컴퓨터 간에 데이터를 전송하려면 데이터를 0과 1로 인코딩하여 전송한 다음 다시 디코딩해야 한다. 
문자당 비트 수를 다르게 사용하는 다양한 인코딩이 만들어졌지만, 결국 문자당 7비트를 사용하는 ASCII가 표준이 되었다.
그러나 대부분의 컴퓨터는 바이너리 데이터를 각각 8비트로 구성된 바이트로 저장하므로, ASCII는 바이너리 데이터 전송에 적합하지 않았다. 이때 Base64 인코딩이 도입되었다. 그러나 Base64를 사용하여 메시지를 인코딩하면 3바이트의 데이터가 4개의 ASCII 문자로 인코딩되기 때문에 전송되는 데이터의 길이가 늘어난다.

또한 Base64 인코딩은 데이터를 인코딩하고 디코딩하는데 추가적인 시간이 필요하다.

결정적으로 Base64 인코딩은 지나치게 간단하다. 따라서 패스워드를 제대로 보호하기 힘들다.
Base64 인코딩은 암호화가 아닌 인코딩이다. 개발할 때 encoding을 사용하는 이유는 암호화가 아니라 가시성과 보관성을 위해서이다. 따라서 암호화를 위해 Base64 인코딩을 사용하면 취약하다고 할 수 있다.

결론! 중요한 보안 정보를 보호하는 데에 Base64 인코딩을 사용해서는 안 된다.

## Token Authentication

Spring에서 token authentication 은 인증, 권한 부여를 위한 프로토콜인 OAuth2.0을 사용하여 구현할 수 있다.

Bearer 토큰은 인증 서버에서 발급하는 보안 토큰으로, OAuth2.0 리소스 서버에 의해 보호되는 리소스에 접근하기 위해 사용된다. 유효한 Bearer 토큰으로 사용자를 인증할 수 있다.

## Session Authentication

## 참고 자료
- [토니의 인증과 인가](https://www.youtube.com/watch?v=y0xMXlOAfss)
- https://www.baeldung.com/java-httpclient-basic-auth
