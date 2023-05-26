---
title   : 레벨2 장바구니 협업
date    : 2023-05-23 14:13:31 +0900
updated : 2023-05-23 14:13:41 +0900
tags     : 
---

## 페어 규칙
- 시간은 재지 않고 진행한다.
- 궁금한 점이나 의견은 언제든지 자유롭게 말한다. 분위기에 끌려가지 말기. 
- 둘 다 좋다고 하지 않기.  -> 진짜 둘 다 좋은 경우에는 각각 좋은 이유를 말할 것.
	- 마음 속에 뭔가 정답이 있는 경우에는 그냥 말하기.
- 경청 잘하기.

## 0단계
- 뼈대 코드 사용하기

### 프로세스
1. 프로세스 종료
2. 기존 코드 삭제
3. git에서 clone 받기
4. 새롭게 빌드 : `./gradlew build`
5. `nohup java -jar jwp-shopping-order.jar &`
6. 배포 스크립트 실행

`<deploy.sh>`
```shell
#!/bin/sh

# kill process
fuser -k 8080/tcp

# remove original code
rm -rf jwp-shopping-order

# clone git main branch
git clone https://github.com/Cyma-s/jwp-shopping-order.git

# build
cd jwp-shopping-order
./gradlew bootJar

# execute
cd build/libs
nohup java -jar jwp-shopping-order.jar &
```

- process 있을 때 없을 때 검증
- 폴더 있을 때 없을 때 검증

### 유저 받아서 변경하기

`<deploy_custom.sh>`
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

`<deploy_pull.sh>`
```shell
#!/bin/sh

# kill process
fuser -k 8080/tcp

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
nohup java -jar jwp-shopping-order.jar &
```

## docker 배포

## github action

## https 설정하기 (완료)
- **도메인 사서 설정 -> cloudfare** / 서브 도메인 사용
- 쌩으로 ssl 설정하기

# 2단계

## 필수 구현 사항

- 추가될 테이블
	- order table : id, member_id, (used_point), total_price, created_at
	- order_product table : id, order_id, product_id, product_quantity
- 상품 주문하기 API
	- url: POST /orders
	- request: Credential, `List<cartId>`, totalPrice(포인트 적용 전 상품 금액), point(적용한 포인트)
- 주문 상세 정보 API -> O
- 사용자 별 주문 목록 확인 -> O
- 특정 주문의 상세 정보 확인 -> O

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
- delete cascade 제외했으므로 product 삭제 시 cart_item도 삭제하는 로직 필요
- DB 주소 `application.properties`
	- 서브 모듈은 기각 -> 각각의 데이터베이스가 다르므로 어차피 DB 링크도 달라지게 된다. 그러므로 굳이 하나의 레포에서 관리할 이유가 없다.
	- application external properties를 사용하자.