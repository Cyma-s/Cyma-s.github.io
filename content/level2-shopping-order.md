---
title   : 레벨2 장바구니 협업 with 다즐 헙크
date    : 2023-05-23 14:13:31 +0900
updated : 2023-05-23 14:13:41 +0900
tags    : 
- 우테코
- 레벨2
---

## 페어 규칙
- 시간은 재지 않고 진행한다.
- 궁금한 점이나 의견은 언제든지 자유롭게 말한다. 분위기에 끌려가지 말기. 
- 둘 다 좋다고 하지 않기 -> 진짜 둘 다 좋은 경우에는 각각 좋은 이유를 말할 것.
	- 마음 속에 뭔가 정답이 있는 경우에는 그냥 말하기.
- 경청 잘하기.

### 유저 받아서 변경하기

```shell
#!/bin/sh

# kill process
fuser -k 8080/tcp

# remove original code
rm -rf jwp-shopping-order

- [ ] # clone git main branch
git clone https://github.com/$1/jwp-shopping-order.git

# build
cd jwp-shopping-order
./gradlew bootJar

# execute
cd build/libs
nohup java -jar jwp-shopping-order.jar &
```

### pull 로 바꾸기

- 기존에 디렉토리가 존재하면 pull, 없으면 clone

```shell
#!/bin/sh

# kill process
sudo fuser -k 80/tcp

# clone git main branch
if [ -d ~/jwp-shopping-order ]
then
	cd jwp-shopping-order
	git pull origin $2
else
	git clone https://github.com/$1/jwp-shopping-order.git
	cd jwp-shopping-order
fi

# build
./gradlew bootJar

# execute
cd build/libs
sudo nohup java -jar jwp-shopping-order.jar &
```

### https 설정하기
- **도메인 사서 설정 -> cloudfare** 
	- 서브 도메인 사용

## 2단계

### 필수 구현 사항

- 추가될 테이블
	- ![[table_schema.png]]
- 상품 주문하기 API
- 주문 상세 정보 API
- 사용자 별 주문 목록 확인
- 특정 주문의 상세 정보 확인

## 선택 구현 사항

### 프론트가 추가 할 것 같은 부분?
- 주문하기 버튼
- 차감되는 포인트 (항상 전체 사용이냐 아니면 선택할 수 있게 하느냐)
	- 사용되는 포인트 프론트로부터 받는다. -> 값을 수정해야 한다.
	- 언제나 제공된 포인트까지만 입력할 수 있도록 넣어야 한다. (프론트에서 처리 필요)
- 최종 결제 금액 (계산 로직 - 프론트에서 처리)
- 백엔드로 전달되어야 하는 것
	- 사용한 포인트
	- 최종 결제 금액 -> 사용자의 포인트 계산 (백엔드에서 처리)

### 프론트에게 질문
- `/orders` 요청 한 번에 정보를 다 주는데 굳이 상세 정보 API가 필요할까? (클라이언트 단에서 캐싱하면 되는데)
	- `/orders` (모든 주문 정보)
	- `/orders/{orderId}` (주문 상세)
	- orders 페이지를 안 거치고 갈 가능성 있으므로 (주문 상세 페이지로 바로 들어가게 되는 경우도 존재할 것이다.) 따라서 필요하다.
- 모든 정보를 다 주는 것 vs 현재 필요한 정보만 주는 것
	- 어차피 필요한 것은 프론트에서 선별하기 때문에 다 내려줘도 괜찮다 by 도밥
	- 뷰는 변화에 민감하므로 계속해서 변경될 수 있지만, 뷰의 변화에 따라 API가 변화하는 것은 바람직하지 않다. url에 맞는 정보를 최대한 제공해서 뷰가 변화할 때마다 필요한 정보를 선별하는 것이 낫다. by 포이

### 백엔드에서 구현해야 하는 사항
- 기존 애플리케이션에 포인트를 추가한다.
- 계산 시에 포인트를 차감해서 할인을 받도록 한다.
- 포인트는 현금과 1:1 매칭
- 포인트는 어떻게 제공되나? -> 최종 결제 금액에서 10% 포인트 적립

###  기존 코드 수정 필요
- 도메인 검증 로직 추가
- `delete cascade` 제외했으므로 product 삭제 시 `cart_item`도 삭제하는 로직 필요
- DB 주소 `application.properties`
	- 서브 모듈은 기각 -> 각각의 데이터베이스가 다르므로 `application.yml`에 들어가야 할 DB 링크도 달라지게 된다. 그렇다면 파일을 여러 개를 만들어야 하는데 (헙크, 나, 다즐 용으로) 그러면 굳이 하나의 레포에서 관리할 이유가 없다. 여러 개의 레포를 사용하는 것이 오히려 나을 수 있다. 근데 그런 경우에는 굳이 서브 모듈을 사용할 필요가 있을까?
	- `application external properties`를 사용하자.

## 함께 자라기 🌱

### url 길이 조정
- image_url이 255는 너무 작은 것 같다. -> internet explorer의 url 최대 길이인 2048로 변경

### 엔티티와 도메인은 분리되어야 하는가?
- 최대한 분리하는 것이 좋다.

### dao, repository, service, controller 테스트?
- dao: `@JdbcTest`
- repository: `@JdbcTest`
- service: `@SpringBootTest`
- controller: 안 함

### DB를 믿을 것인가? (선택)
- FK가 걸려 있음에도 findById를 수행해야 하는가? vs 굳이 할 필요 없다.
	- 다즐: DB의 예외가 서비스 계층으로 올라오는 것이 좀 별로다.
	- 헙크: 좀 믿자ㅋㅋ

- equals -> id로 정의

### 도메인 동등성?

### 어디까지 확장성을 고려해야 할까?

## 논의할 내용
- [x] 뭔가를 찾을 수 없으면 NOT_FOUND로 한다.
- [x] orders에 delivery_fee 추가 
	- 프론트가 배송비를 알려줘야 하나?
		- 알려줄 때: deliver_fee가 유연하다. 이 값을 믿을 수 있는지? 서버 단에서 다시 검증해야 될 수도.
		- 안 알려줄 때: 추가 검증 과정 필요 X, 프론트 로직 수정 X, API 수정. deliver_fee가 서버 값으로 무조건 고정된다. (배송비를 바꾸려면 서버를 바꿔야 한다.)
	- 확장되는 순간: 5만원 이하면은 3000원, 3만원 이하면 5000원.
-> 클라이언트 쪽에서 배송비 받는 것으로 변경. 배송비 받고 나서 추가 검증 수행하기 + 주문 내려줄 때도 배송비 포함하기로.
만약 배송비 값이 달라지게 되었을 때, 클라이언트와 서버가 각각 배송비 계산을 하게 된다면 값이 변경되는 경우에 정합성 문제가 발생할 수 있다. (서버의 값은 바뀌었는데, 클라이언트는 안 바뀌는 문제)
- [x] mysql 서버 타임 시간 설정
- [x] 장바구니 상품 삭제하는 거 batch delete (step2 끝날 무렵쯤 반영)
	-  /cart-items DELETE 요청 -> batch delete는 주로 어떻게 Url 구성할까?
	- Request: 
```json
{
	cartItemIds: [1, 3, 5, 7]
}
```
 	     - Respose: 204 No Content
- [x] 총 가격에서만 포인트 계산을 해줘야 한다. (배송비 제외)
- [x] `OrderProductResponse` 내부 값을 `ProductResponse` 로 변경하기

## 시나리오

### 주문 저장 (POST)
1. 입력된 멤버가 해당 장바구니의 상품의 owner와 동일한지 확인한다. (검증)
2. 사용된 포인트가 멤버가 갖는 포인트보다 작거나 같은지 확인한다. (검증)
3. 멤버가 사용할 포인트가 전체 상품 가격 + 배송비보다 작거나 같은지 확인한다. (검증)
4. 멤버의 포인트를 사용한다.
5. 멤버의 포인트를 적립한다.
6. 선택된 장바구니 상품을 삭제한다.
7. 주문을 저장한다.

## 2단계 리뷰 도둑질

- `createdAt`을 현재는 Java에서 생성해주고 있는데요.
1. 이 부분을 Java에서 생성하는 것과, DB에서 생성하는 것은 어떠한 장/단점이 있을까요?
2. Java에서 생성하는 방식을 선택한 이유는 무엇인가요?
- 메서드의 이름을 지어줄 때, 각각 어떠한 기준으로 정의했는지, 그에 일관성이 있는지 궁금하네요!
1. 어떠한 도메인의 Controller/Service/Repository일 때, 접미사로 그 어떠한 도메인을 붙여줄 것인가?
    - ex. `orderApiController.createOrder()` vs `orderApiController.create()`
2. 무언가를 등록할 때, 용어를 선정하는 기준은 무엇인가?
    - ex. `create` vs `register` vs `save`
    - ex. `get` vs `find`
3. 조건에 대해서도 접미사로 붙여줄 것인가?
    - ex. `get` vs `getById` / `find` vs `findById`