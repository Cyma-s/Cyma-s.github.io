---
title: Swagger 3.0 설정하기
date: 2024-01-07 14:57:11 +0900
updated: 2024-01-07 15:18:31 +0900
tags:
  - spring
---

## 의존성 추가

swagger 의존성을 추가해준다. 

```groovy
//swagger  
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2'
```

## config 파일

Config 파일은 간단하게 구성했다. 

```java
@OpenAPIDefinition(  
    info = @Info(  
        title = "neupinion API 명세서",  
        version = "v1"  
    )  
)  
public class OpenApiConfig {  
  
}
```

## 프로덕션 코드와 API 문서 코드 분리하기

Swagger 의 최대 단점인 프로덕션 코드에 API 문서 코드가 생긴다는 단점을 보완하기 위해 Interface 를 사용하여 API 문서 코드를 프로덕션 코드와 분리해보자.  

```java
package shook.shook.member.ui.openapi;  
  
import io.swagger.v3.oas.annotations.Operation;  
import io.swagger.v3.oas.annotations.Parameter;  
import io.swagger.v3.oas.annotations.responses.ApiResponse;  
import io.swagger.v3.oas.annotations.tags.Tag;  
import org.springframework.http.ResponseEntity;  
import org.springframework.web.bind.annotation.DeleteMapping;  
import org.springframework.web.bind.annotation.PathVariable;  
import shook.shook.auth.ui.argumentresolver.Authenticated;  
import shook.shook.auth.ui.argumentresolver.MemberInfo;  
  
@Tag(name = "Member", description = "회원 관리 API")  
public interface MemberApi {  
  
    @Operation(  
        summary = "회원 탈퇴",  
        description = "회원 탈퇴로 회원을 삭제한다."  
    )  
    @ApiResponse(  
        responseCode = "204",  
        description = "회원 탈퇴, 삭제 성공"  
    )  
    @Parameter(  
        name = "member_id",  
        description = "삭제할 회원 id",  
        required = true  
        hidden = false
    )  
    @DeleteMapping  
    ResponseEntity<Void> deleteMember(  
        @PathVariable(name = "member_id") final Long memberId,  
        @Authenticated final MemberInfo memberInfo  
    );  
}
```

hidden 속성을 `true` 로 하면 parameter 를 감출 수 있다. 

```java
@RequiredArgsConstructor  
@RequestMapping("/members/{member_id}")  
@RestController  
public class MemberController implements MemberApi {  
  
    private final MemberService memberService;  
  
    @DeleteMapping  
    public ResponseEntity<Void> deleteMember(  
        @PathVariable(name = "member_id") final Long memberId,  
        @Authenticated final MemberInfo memberInfo  
    ) {  
        memberService.deleteById(memberId, memberInfo);  
  
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  
    }  
}
```

`implements` 로 방금 설정해둔 API interface 를 설정해주면 프로덕션 코드에 최소한으로 영향을 주는 코드를 작성할 수 있다. 

물론 이렇게 설정하더라도 Controller 메서드 이름, 매개 변수가 변경될 때마다 수정해주어야 한다는 단점이 있다. 