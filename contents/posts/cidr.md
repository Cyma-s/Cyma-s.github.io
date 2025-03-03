---
title: CIDR
date: 2023-06-12 14:53:00 +0900
updated: 2023-10-15 23:01:10 +0900
tags:
  - 네트워크
---

## CIDR란

클래스 없는 도메인 간 라우팅 기법 (Classless Inter-Domain Routing)

각 네트워크 대역을 구분 짓고, 구분된 네트워크간 통신을 위한 주소 체계이다.
서브넷팅 뿐만 아니라 서브넷을 합치는 슈퍼네팅 역시 CIDR의 일환이다.

IPv4 주소는 4개의 옥텟으로 이루어져 있고, 하나의 옥텟은 8비트로 이루어져 있다. 
즉, 사이더는 0~32까지 총 32비트까지 사용가능하다.

`143.7.65.203/16` 인 경우, `143.7.0.0` ~ `143.7.255.255` 를 사용할 수 있게 된다.

### 장점

- IP의 범위를 한 줄로 표기할 수 있다.
- CIDR 숫자를 필요에 따라 더 쓰거나, 적게 사용해서 IP를 적절하게 할당할 수 있다.

## AWS의 서브넷팅

AWS에서는 자체 클라우드에서 설정해서 사용하고 있는 IP가 있기 때문에 총 5개를 제외해야 한다.

`10.0.0.0` : 네트워크 주소
`10.0.0.1` : AWS에서 VPC 라우터 용으로 예약 (Default Gateway)
`10.0.0.2` : DNS 서버 주소
`10.0.0.3` : AWS에서 앞으로 사용하려고 예약한 주소
`10.0.0.255` : 네트워크 브로드캐스트 주소

즉, AWS에 `192.168.0.0/24` 에서 총 사용가능한 호스트 개수는 256 - 5 = 251 이다.


