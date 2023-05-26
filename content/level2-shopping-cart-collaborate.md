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

<deploy.sh>
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

<deploy_custom.sh>
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

<deploy_pull.sh>
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

80 포트를 쓸 때는 관련 코드에 nohup에 sudo 써야 한다.

# 2단계

## 필수 구현 사항

- 추가될 테이블
	- order table : id, member_id, (used_point), total_price, created_at
	- order_product table : id, order_id, product_id, product_quantity
- 상품 주문하기 API
	- url: POST /orders
	- 아마 장바구니에서만 호출되지 않을까
	- request: Credential, `List<cartId>`, totalPrice(포인트 적용 전 상품 금액), point(적용한 포인트)
	- reponse: created(order_id)
	- 예외: point가 적을 경우, 존재하지 않는 cartId, 
- 주문 상세 정보 API -> O
	- 주문 번호: auto-increment된 id
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
- 한 번에 정보를 다 주는 것이 나은가 vs 각각 쿼리를 날리도록 하는 것이 나은가
	- /orders
	- /orders/{orderId}
	- orders 페이지를 안 거치고 갈 가능성 있음.

### 백엔드에서 구현해야 하는 사항
- 기존 애플리케이션에 포인트를 추가한다.
	- member가 가지고 있기
- 계산 시에 포인트를 차감해서 할인을 받도록 한다.
- 포인트는 현금과 1:1 매칭
- 포인트는 어떻게 제공되나? -> 최종 결제 금액에서 10% 포인트 적립

###  기존 코드 수정 필요
- 검증 로직 추가
- delete cascade 제외했으므로 product 삭제 시 cart_item도 삭제하는 로직 필요
- DB 주소 application.properties
	- 서브 모듈: 
	- application external properties
	- clone 받아올 때 서버에 존재하는 application properties를 프로젝트 안에 포함시킨다.