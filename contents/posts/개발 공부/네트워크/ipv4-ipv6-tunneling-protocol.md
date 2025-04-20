---
title: IPv6 트래픽을 IPv4 네트워크를 통해 전송하기 위한 터널링 프로토콜
date: 2024-05-24 16:29:29 +0900
updated: 2024-05-24 16:37:19 +0900
tags:
  - network
---

## 6in4

IPv6 패킷을 IPv4 패킷으로 캡슐화하여 IPv4 네트워크를 통해 IPv6 트래픽을 전달하는 프로토콜. 정적 터널링 방식으로, 터널의 끝점을 미리 정의하여 사용한다. 터널 소스와 목적지 IP 주소를 수동으로 설정해야 한다. 

- 장점
	- 간단하고 효율적이며, 설정이 쉽다.
- 단점
	- 터널 끝점이 고정되어 있어 유연하지 않다.

```bash
interface Tunnel0
  ipv6 address 2001:db8::1/64
  tunnel source 192.0.2.1
  tunnel destination 198.51.100.1
  tunnel mode ipv6ip
```

## Teredo

NAT 환경에서 IPv6 연결을 제공하는 터널링 프로토콜. 공용 IPv4 인터넷을 통해 IPv6 패킷을 터널링한다. IPv6 패킷을 UDP로 캡슐화하여 IPv4 네트워크를 통해 전송한다. NAT 뒤에 있는 호스트가 IPv6 인터넷에 연결해야 할 때 사용할 수 있다. 클라이언트는 Teredo 서버에 연결하여 IPv6 주소를 할당받고, 터널을 설정한다.

클라이언트가 Teredo 서버와 연결하여 공용 IPv4 주소와 포트를 획득하고, Teredo 릴레이를 통해 IPv6 인터넷에 연결한다.

- 장점
	- NAT 환경에서 자동으로 작동하여 설정이 간편하다.
- 단점
	- 성능이 낮을 수 있고, 보안 이슈가 있을 수 있다.

## ISATAP (Intra-Site Automatic Tunnel Addressing Protocol)

IPv4 네트워크 내에서 IPv6 트래픽을 자동으로 터널링하는 프로토콜. 내부 네트워크에서 IPv6 호스트 간의 연결을 용이하게 한다. IPv6 패킷을 IPv4 헤더로 감싸서 전송한다. 내부 IPv4 네트워크에서 IPv6 통신을 자동으로 설정할 때 사용할 수 있다. 

- 장점
	- 자동 구성으로 관리가 용이하다.
- 단점
	- 외부 네트워크로의 연결에는 적합하지 않다.

```bash
interface Tunnel0
  no ip address
  tunnel source 192.0.2.1
  tunnel mode ipv6ip isatap
  ipv6 address 2001:db8::1/64
```

## GRE (Generic Routing Encapsulation)

다양한 네트워크 계층 프로토콜을 캡슐화할 수 있는 범용 터널링 프로토콜. 멀티 프로토콜 환경에서 사용될 수 있다. 다양한 네트워크 계층 프로토콜을 캡슐화하여 전송한다. 여러 프로토콜을 캡슐화해야 하는 경우, IPv6-over-IPv4 뿐 아니라 다른 프로토콜도 포함한다. 터널 소스와 목적지 IP 주소를 설정해야 한다.

- 장점
	- 다목적 사용이 가능하고, 다양한 프로토콜을 지원한다.
- 단점
	- 추가적인 오버헤드가 발생할 수 있다.

```bash
interface Tunnel0
  ip address 10.0.0.1 255.255.255.0
  tunnel source 192.0.2.1
  tunnel destination 198.51.100.1
  tunnel mode gre ip
  ipv6 address 2001:db8::1/64
```