---
title   : matzip vpc setting
date    : 2023-06-11 17:18:30 +0900
updated : 2023-06-11 17:19:21 +0900
tags     : 
- matzip
- 인프라
- aws
- 네트워크
---

관련 글: [[ori-06-08]]

## 공부한 내용
- [[vpc|VPC]]
- [[cidr|CIDR]]
- [[nat|NAT]]

## 진행 사항

- private 서브넷 2개, public 서브넷 2개
- NAT 설정 X
- 가용성을 위해 가용영역 A, C에 저장

![[vpc-setting.png]]

### NAT 게이트 웨이 설정

public subnet에 NAT 게이트웨이 설정을 해줬다.     

private subnet의 라우팅 테이블에 `0.0.0.0/0` 을 nat에 연결해주었다.     
실험해보지는 않았지만 아마도 이렇게 하면 외부 인터넷 연결이 NAT으로 연결되지 않을까 싶다.    
NAT에 연결되면 라우터를 통해 사설 IP 주소로 값이 변경되어서 내부 사설망으로 연결 된다.

-> 근데 NAT 게이트 웨이는 너무 값이 비싸서 쓸 수 없다... 그래서 EC2로 NAT 게이트 웨이를 직접 만들게 되었다. 

### EC2 게이트 웨이 설정

[이 글](https://cloudest.oopy.io/posting/007) 을 참고했다.

`matzip-nat-gateway-c-prod` 으로 이름을 설정했다.

NAT 이미지는 다음의 이미지를 사용했다. 꽤 최신이라.. 잘 찾아보니 6월 것도 있었다.

![[nat-image.png]]

인스턴스 유형은 t2.micro로 설정했다. 

키 페어는 새로 생성했다. `nat-gatewat-keypair.pem`

네트워크 설정에서 vpc는 새롭게 만든 vpc를 설정해주고, 서브넷은 해당 가용 영역(여기서는 c)의 public subnet을 적용해주었다.   
보안 그룹 설정에서 새로운 보안 그룹을 만들어 주었다.   
ssh 연결은 기본 설정대로 두고, 모든 트래픽으로 private subnet 의 ip를 설정해주었다.    
퍼블릭 IP 자동 할당도 필요하다.    

스토리지 볼륨에서 볼륨 유형을 `gp2` 로, 암호화됨으로 변경해주었다.    
KMS 키는 기본값을 사용했다.

고급 세부 정보에서는 최대 절전 중지 방식을 `활성화` 로 설정했다.    
추가로 종료 방지는 `활성화` 해주었다.    
용량 예약은 `열기` 로 변경했다.      

다 설정해주고 나서 `네트워킹 -> 소스 / 대상 확인 변경` 을 중지한다.    

![[source-object-check-change.png]]

생성된 NAT 모두에 탄력적 IP를 설정해 주었다.    

NAT을 설정한 후에는 private subnet으로 가서 라우팅 테이블을 수정해주어야 한다.    
`0.0.0.0/0` 에서 만든 NAT 인스턴스로 연결되게 해주면 완료.    

### Bastion 설정
일반 EC2처럼 만들되, 아까 만들어 둔 VPC와 public subnet (가용영역 A) 에서 생성한다.
퍼블릭 아이피는 할당한다. 외부에서 접근할 수 있어야 하기 때문에? (SSH 연결 가능하게)

> 가용 영역 별로 Bastion을 만드는 방식이 맞을까요?

굳이 가용 영역 별로 Bastion을 만들 필요는 없다.    
가용성은 서비스가 동작할 때의 안정성을 뜻하는 것이고, 접속과는 관련 없다.

private subnet 보안 그룹에서 bastion 보안 그룹을 SSH 22로 열어두면 private subnet의 인스턴스에 bastion으로 접근 가능하다.

- 참고: https://err-bzz.oopy.io/f5616e26-79ca-4167-b2eb-140de69b9b54