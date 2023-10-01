---
title   : Interceptor 나 Argument Resolver 에서 member를 조회해서 컨트롤러로 전달해주면 안 되나?
date    : 2023-08-16 10:01:48 +0900
updated : 2023-08-16 10:01:54 +0900
tags     : 
- spring
- interceptor
- argument-resolver
- shook
- 레벨3
- 우테코
---

## 상황 설명

S-HOOK 은 로그인 된 회원만 투표, 좋아요, 댓글 활동을 할 수 있습니다.     
그러려면 인증/인가 로직이 필수적으로 필요합니다. 해당 사용자가 우리 회원인지 확인하고, 회원인 경우에만 투표 / 좋아요 / 댓글 기능을 쓸 수 있게 만들어야 하기 때문이죠.      

이를 위해 OAuth + JWT 인증 로직을 도입했는데요, JWT 를 통해 클라이언트로 전달되는 값은 회원의 id 값입니다.      

현재 s-hook 의 코드에서는 interceptor 단에서 따로 id를 통해 member 가 존재하는지 조회하지 않습니다. 토큰이 유효하기만 한다면 그대로 파싱된 id 를 argument resolver 로 전달하는 로직입니다.     

이런 인증 과정에 대해 들었던 개인적인 의문과 이에 답할 수 있는 여러 의견들을 정리해보았습니다.

## 의문이 들었던 부분들

### 회원의 id 를 interceptor 에서 검증하지 않아도 될까?

가장 먼저 의문이 들었던 부분은 `JWT 내부에 들어있는 회원의 id 값을 검증하지 않아도 될까?`  라는 것입니다.     

토큰 내부에 있는 id 가 데이터베이스에 존재하지 않는 member 라면 문제가 발생할 수도 있지 않을까요? 
#### JWT

결론만 말하자면, 저희 서비스에서 사용하는 JWT 에서는 토큰 내부에 있는 값을 검증할 '필요가 없습니다'

그 이유는 JWT 의 목적에 있습니다.     

JWT 는 데이터를 암호화하기 위함이 아닌, 데이터의 무결성을 보장하기 위한 목적으로 설계 되었습니다. 즉, 데이터가 변조되지 않았다는 것만을 확인하기 위한 것입니다.     

또한 JWT 는 사용자 인증 후에 '서버' 로부터 발급받는 것이므로, 토큰이 발급되는 시점에서 사용자는 이미 검증되었다고 간주합니다.    

따라서 토큰이 유효하고, 변조되지 않았고, 토큰이 만료되지 않았다면 토큰 내부의 데이터는 신뢰할 수 있다고 볼 수 있습니다. 물론 JWT 를 생성할 때 필요한 secret key 는 반드시 외부에 노출되지 않았어야 하겠지요.

#### JWT 인증 과정

JWT 의 인증을 위해서는 다음과 같은 과정을 수행해야 합니다.     

1. 토큰의 서명 확인
2. 유효 기간 확인
3. 토큰 발급자 확인
4. 토큰 수신자 확인
5. 토큰 고유 식별자 확인

이런 인증 과정을 모두 통과한 JWT 는 우리 서버에서 발급한 토큰이라고 간주되어, 내부의 데이터를 신뢰할 수 있습니다.     

무엇보다 JWT 를 사용하는 주된 이유는 인증 후에 사용자의 상태나 세션 정보를 저장하지 않고, 서버에서 stateless 하게 시스템을 운영하기 위해서입니다. 

즉, 매 요청마다 사용자의 ID 와 비밀번호를 검증하는 것을 피하기 위해 JWT 를 사용하는 것이죠.

### 사용자의 ID 는 민감한 정보가 아닐까?

JWT 를 생성할 때 중요하게 고려해야 하는 사항이 있습니다. JWT 는 암호화를 하는 것이 아니기 때문에 내부의 데이터가 민감한 정보인 경우, 불특정 다수에게 정보가 노출될 수 있습니다.    

그러므로 S-HOOK 서버에서 발행한 JWT 내부에 들어가는 사용자의 ID 는 민감한 정보가 아니어야 합니다.     

그렇다면 사용자 ID 는 민감한 정보가 아닐까요?
마찬가지로 '저희 서비스에서는' YES 입니다.    

S-HOOK 은 사용자 ID 만으로 수행할 수 있는 요청은 존재하지 않습니다. ID 를 가지고 서버 시스템 내부를 조작하거나 특정 행동을 수행할 수는 없습니다.     

또한 대개의 경우, 사용자 ID 는 민감한 정보로 간주되지 않는다고 합니다. 사용자 ID 를 JWT 페이로드에 포함하는 것이 관행일 만큼 말이죠.     

### 컨트롤러 메서드 파라미터에 Member 객체를 넘겨주면 안 될까?

JWT 내부의 ID 를 검증하지 않아도 되는 건 이제 알겠습니다.     

그렇다면 컨트롤러 메서드 파라미터로 Member id 를 전달하는 대신, Member 를 만들어서 보내주면 안 되는 걸까요?     

현재 인증 로직에서는 Member 가 필요한 각 서비스마다 `MemberService` 를 주입 받아 id 로 Member 를 조회하는 중복 코드가 존재합니다. Interceptor 나 Argument Resolver 가 대신 `MemberService` 를 주입 받아서 Member 를 만들어준다면 중복 코드도 없어지고 좋지 않을까요?

#### 계층적 관점으로 보았을 때 괜찮을까?

먼저 계층적 관점에서 살펴보겠습니다.     
Interceptor 와 Argument Resolver 에서 Member 를 조회해도 '괜찮은 걸까요'?

S-HOOK 의 코드는 Layered Architecture 를 기반으로 설계되었습니다.     

계층적 구조를 따르면 각 계층마다 명확한 책임을 가지고 있어서, 기능과 역할을 더 쉽게 관리할 수 있습니다.    
또한 각 계층을 독립적으로 개발 / 테스트할 수 있어 단위 테스트가 용이합니다.    
특히 특정 계층의 구현이 변경되어도 다른 계층에 비교적 적은 영향을 미칩니다. 이를 통해 유지보수와 확장성을 향상시킬 수 있습니다.     

그렇다면 Argument Resolver / Interceptor 에서 Member 를 조회하면 계층적 구조를 위반해서 문제가 발생할까요?     

엄밀히 말하면 계층적 구조를 위반한다고도 볼 수 있습니다. Interceptor 와 Argument Resolver 는 Web Layer 에 속한다고 생각한다면, Application Layer 에 속하는 `MemberService` 에 접근하는 것은 Presentation Layer 를 거치지 않아 규칙을 위반한 것이기 때문이죠.

그러나 실용적으로 생각했을 때, 횡단 관심사인 `Member` 의 조회를 Interceptor 나 Argument Resolver 에서 수행하는 것은 효율적이고 편리한 접근 방식입니다.      

다만 아래와 같은 문제점이 발생할 수 있다는 것은 인지해야 합니다.     

1. 테스트가 복잡하다.
도메인 객체가 Argument Resolver / Interceptor 를 통해 전달되는 경우, 컨트롤러의 단위 테스트를 작성할 때 코드가 복잡해질 수 있습니다.     

2. 코드의 유연성이 떨어질 수 있다.
도메인 객체의 조회 로직이나 생성 방식이 변경되는 경우 Argument Resolver / Interceptor 로 영향이 전파될 수 있습니다.

문제점을 충분히 이해했고 감안할 수 있는 부분이라고 생각된다면, 다음으로 넘어가 봅시다!

#### 도메인 객체가 Presentation 계층에 노출되었을 때 문제점은 없을까?

Argument Resolver 나 Interceptor 에서 Member 를 조회한다면, 컨트롤러 메서드 파라미터로 Member 객체가 전달됩니다.     
이로써 비즈니스 로직이 포함된 도메인 객체가 Presentation 계층에 노출되었다고 볼 수 있습니다. 이럴 때 발생할 수 있는 문제점은 없을까요?

**문제점**

1. 도메인과 컨트롤러의 결합도가 증가합니다.
도메인 객체에 변경이 발생한 경우, Presentation Layer 에도 영향을 줄 수 있으므로 시스템의 결합도가 높아진다고 볼 수 있습니다.     

2. 비즈니스 로직의 흐름을 파악하기 어려울 수 있습니다.
서비스가 직접적으로 인증 / 인가 로직을 포함하지 않기 때문에, 프로젝트 팀원이 아닌 사람이 비즈니스 로직의 전체 흐름을 파악하기 어려울 수 있습니다.     

그러나 현재 저희 애플리케이션에서는 단순히 ID 로 Member 를 조회하는 로직만 수행하기 때문에, 아직까지 위의 문제점이 크게 문제가 되는 부분은 없을 듯 합니다. (프로젝트를 함께 진행하고 있는 팀이 계층간의 분리를 중시한다면 다른 판단을 내릴 수도 있을 것입니다)

### Interceptor vs Argument Resolver

그렇다면 Interceptor 또는 Argument Resolver 를 사용하는 것이 좋지 않을까? 라고 생각하셨을 겁니다.
그렇다면 둘 중 어디에서 `MemberService` 를 사용하여 Member 를 조회하는 것이 좋을까요?

#### Member 를 interceptor 에서 조회하자

Interceptor 는 요청의 전처리 / 후처리와 요청 / 응답의 변경, 로깅, 인증과 권한 체크 같은 기능을 수행할 때 사용됩니다. 또한 여러 컨트롤러에 대해 동일한 로직을 적용하고 싶을 때 효과적으로 사용할 수 있습니다.     

그러나 Interceptor 에서 id로 부터 Member 를 생성하는 것은 Interceptor 가 수행해야 하는 일을 넘어섰다고도 볼 수 있습니다.    
id 값으로부터 Member 를 조회하여 전달하는 것은 '요청과 응답을 가공' 하는 것과는 거리가 멀기 때문입니다.     

또한 Interceptor 는 요청의 생명 주기 내에서 `preHandle`, `postHandle`, `afterCompletion` 에서 동작하므로, 파라미터를 변환하는 데에 적합한 생명주기를 갖고 있다고 말하기 어려울 수 있습니다. 변환될 Member 는 요청 전체에서 사용되는 것이 아닌, 컨트롤러의 메서드 파라미터로 전달되어 Service 로 넘겨지기 위해서 사용되기 때문입니다. 

그러므로 Interceptor 에서는 JWT 의 유효성 검사나 권한을 체크하는 등, 인증 / 인가와 관련된 로직을 수행하는 것이 더 적합하다고 할 수 있겠습니다.

#### Member 를 Argument Resolver 에서 조회하자

Argument Resolver 는 컨트롤러의 메서드 파라미터를 동적으로 생성하거나 변환하는 로직을 구현할 때 주로 사용됩니다.    

JWT 로부터 얻은 사용자의 ID 를 Member 로 변환하기 위해 Member 를 조회하는 것은 Argument Resolver 가 수행하는 것이 어색하지 않습니다.

#### JPA를 사용할 때 발생할 수 있는 문제점

> 오 그러면 Argument Resolver 에서 Member 조회해서 컨트롤러로 전달해야겠다 😄

그러나 이 글을 읽고 계시는 분이 프로젝트에서 JPA 를 사용하신다면 반드시 고려하셔야 하는 사항이 있습니다.     

**OSIV**

OSIV 는 Open Session In View 의 약자로, JPA 의 Session 이나 Hibernate 의 SessionFactory 가 HTTP 요청의 시작부터 종료까지 열린 상태로 유지되게 하는 패턴입니다.     
Spring 에서는 기본적으로 활성화가 되어 있지만, 하나의 세션 안의 트랜잭션들이 동일한 영속성 컨텍스트를 공유하기 때문에 주의를 요합니다.      

(OSIV 에 대해서는 추후 글을 자세하게 적어보겠습니다.)

Argument Resolver 에서 주의해야 하는 경우는 **OSIV 설정이 꺼져있을 때** 입니다.     

다음과 같이 yaml 파일에서 OSIV 설정을 꺼줄 수 있습니다.

```yaml
spring:
	jpa:
		open-in-view: false
```

Argument Resolver 가 `MemberService` 로 Member 를 조회한다고 해봅시다.

```java
@Component  
public class AuthArgumentResolver implements HandlerMethodArgumentResolver {  
  
    private final AuthContext authContext;  
    private final MemberService memberService;  
  
    public AuthArgumentResolver(final AuthContext authContext, final MemberService memberService) {  
        this.authContext = authContext;  
        this.memberService = memberService;  
    }  
  
    @Override  
    public boolean supportsParameter(final MethodParameter parameter) {  
		return parameter.hasParameterAnnotation(Authenticated.class);  
    }  
  
    @Override  
    public Object resolveArgument(  
        final MethodParameter parameter,  
        final ModelAndViewContainer mavContainer,  
        final NativeWebRequest webRequest,  
        final WebDataBinderFactory binderFactory  
    ) {  
        return memberService.findById(authContext.getMemberId());  
    }  
}
```

실험을 위해 기존에 Argument Resolver 로부터 Member 의 ID 를 전달받던 `KillingPartLikeController` 를 다음과 같이 변경했습니다.     

```java
public class KillingPartLikeController {  
  
    private final KillingPartLikeService killingPartLikeService;  
  
    @PutMapping  
    public ResponseEntity<Void> createLikeOnKillingPart(  
        @PathVariable(name = "killing_part_id") final Long killingPartId,  
        @Valid @RequestBody final KillingPartLikeRequest request,  
        @Authenticated final Member member  
    ) {  
        killingPartLikeService.updateLikeStatus(killingPartId, member, request);  
  
        return ResponseEntity.status(HttpStatus.CREATED).build();  
    }  
}
```

`KillingPartCommentService` 에서는 `EntityManager` 를 가져와서 Member 가 존재하는지 확인해보겠습니다.     

```java
@Transactional(readOnly = true)  
@Service  
public class KillingPartLikeService {  
  
    private final KillingPartRepository killingPartRepository;  
    private final MemberRepository memberRepository;  
    private final KillingPartLikeRepository likeRepository;  
  
    @Autowired  
    private EntityManager entityManager;  
  
    @Transactional  
    public void updateLikeStatus(  
        final Long killingPartId,  
        final Member member,  
        final KillingPartLikeRequest request  
    ) {  
        System.out.println("====================Member 가 존재할까====================");  
        System.out.println(entityManager.contains(member));  
        System.out.println("====================결과 출력 완료====================");  
        
        ...
    }
```

이렇게 설정해두고, 실제 요청을 보내게 되면 `MemberService` 에서 열린 새로운 트랜잭션의 영속성 컨텍스트에는 Argument Resolver 에서 조회한 Member 가 포함되어 있지 않는 것을 볼 수 있습니다.    

![[entity-manager-cannot-find-member.png]]

왜 이런 일이 발생했을까요?     

Argument Resolver 에서 Member 를 조회한 후에 컨트롤러에 전달합니다. 그런데 `MemberService` 의 트랜잭션이 닫히면서 조회한 Member 는 준영속 상태가 됩니다.     
준영속 상태인 엔티티가 영속성 컨텍스트에 포함되기 위해서는 DB 에서 Member 를 다시 조회해야 합니다.      

결국 Service의 메서드 파라미터로 전달된 Member 에 변경이 발생했어도 영속성 컨텍스트는 변경 감지를 할 수 없게 됩니다.     

현재 저희 서비스에서는 Member 가 변경되는 일이 존재하지 않습니다. 그러나 추후 OSIV 설정을 꺼 둔 상태에서 Member 에 변경이 발생하는 경우 문제의 원인을 찾기 힘들 것입니다.      

따라서 JPA 를 사용하고 OSIV 설정을 꺼두었을 경우, Argument Resolver 나 Interceptor 에서 Member 를 조회해서 컨트롤러로 전달할 때 주의해야 합니다.     

## 결론

> 그래서 뭐 어떻게 하면 좋다는 거야 🤷🏻‍♂️

라는 생각이 드실지도 모르겠습니다.      

제 나름의 결론은 다음과 같습니다.

- JWT 를 사용할 때 토큰 내부의 값을 검증할 필요는 없다.
- Argument Resolver 와 Interceptor 중에서는 Argument Resolver 에서 Member 를 조회하는 것이 낫다.
- OSIV 설정이 꺼져 있고, 비즈니스 로직 상에서 Member 의 변경이 발생할 가능성이 있는 경우 오히려 준영속 상태의 Member 를 조회하기 위한 쿼리가 추가로 발생하므로, 중복 코드가 발생하더라도 Service 에서 Member 를 조회하는 것이 좋아보인다.

제 결론이 정답은 아니고 다양한 상황이 있을 수 있으므로 상황에 맞게 사용하시면 좋겠습니다.