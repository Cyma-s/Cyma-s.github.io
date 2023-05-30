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

# clone git main branch
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

## 통일하기
- 뭔가를 찾을 수 없으면 NOT_FOUND로 한다.