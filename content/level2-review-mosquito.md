---
title   : 레벨2 리뷰 훔쳐보기
date    : 2023-05-07 15:34:25 +0900
updated : 2023-05-07 15:34:46 +0900
tags     : 
- 레벨2
- 우테코
---

## 장바구니 미션

- `ViewController` 는 `Configuration` 방식보다는 되도록 Controller를 작성해주는 것이 좋다. 해당 엔드포인트에 대한 컨트롤러가 중복될 수도 있고, 찾지 못할 수도 있기 때문이다.
- admin용 응답과 서비스용 응답은 현재 응답이 같더라도, 다른 service, 다른 responseDto를 활용하는게 좋습니다.  admin용 응답에는 더 디테일한 데이터가 들어갈 수 있고, 서비스용 메서드는 인증 절차와 같은 부수적인 기능이 포함될 수 있기 때문입니다.
- 오류메시지의 정보는 많이 넣어주자. 대신 클라이언트까지 전달되는 값은 보안상 부적절하니, Exception의 메시지 자체에는 오류 내용을 풍부하게 싣고 ExceptionHandler에서 사용자 메시지로 전달되는 부분을 변경하면 좋을 것 같다.
- 인증인가 부분은 특히 메시지에 신경을 써야한다. 오류에서 생성되는 메시지들이 공격자에게 유효한 정보를 주지는 않는지 점검해보자.
- jackson 2.13 릴리즈 패치에서 기본생성자 없이도 직렬화가 가능하도록 변경되었습니다[https://github.com/FasterXML/jackson/wiki/Jackson-Release-2.13#no-constructor-deserializer-module](https://github.dev/woowacourse/jwp-shopping-cart/pull/298/files "https://github.com/FasterXML/jackson/wiki/Jackson-Release-2.13#no-constructor-deserializer-module")

### 의문점
- 인증 로직은 대체 어디에 있어야 할까? ArgumentResolver, Filter, Interceptor, AuthService?
- ArgumentResolver의 패키지 위치는 어딜까? (Controller, 혹은 다른 패키지?)
- audit이 필요한 이유?

### 고칠 부분
- [ ] 404 응답을 5xx 예외로 변경하기