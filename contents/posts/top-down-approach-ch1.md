---
title: 1. 컴퓨터 네트워크와 인터넷
date: 2023-11-20 22:36:55 +0900
updated: 2023-11-21 11:33:32 +0900
tags:
  - 컴퓨터-네트워킹-하향식-접근
---

## 인터넷이란 무엇인가

1. 인터넷의 구성요소를 기술하는 것
2. 분산 애플리케이션에 서비스를 제공하는 네트워킹 인프라스트럭처 관점에서의 인터넷

### 구성요소로 본 인터넷

인터넷은 전 세계적으로 수십억 개의 컴퓨팅 장치를 연결하는 컴퓨터 네트워크이다.  

데스크톱 PC, 리눅스 워크스테이션, TV, 게임 콘솔, 가전제품, 안경, 자동차 ... 같은 사물들이 인터넷에 연결되고 있다. 이러한 모든 장치를 인터넷 용어로 **호스트(host)** 혹은 종단 시스템 (end system) 이라고 부른다. 

종단 시스템은 통신 링크와 패킷 스위치의 네트워크로 연결된다.  
링크들은 동축 케이블, 구리선, 광케이블, 라디오 스펙트럼을 포함한 다양한 물리 매체로 구성된다.  

각각의 링크들은 다양한 전송률(링크 대역폭, transmission rate) 을 이용하여 데이터를 전송하며, 전송률은 초당 비트 수를 의미하는 bps (bit per second) 단위를 사용한다.

한 종단 시스템이 다른 종단 시스템으로 보낼 데이터를 갖고 있을 때, 송신 종단 시스템은 그 데이터를 **세그먼트**로 나누고, 각 세그먼트에 **헤더**를 붙인다.  
이렇게 만들어진 정보 패키지는 컴퓨터 네트워크에서 **패킷(packet)** 이라고 한다.

패킷 교환기(스위치)는 입력 통신 링크의 하나로, 도착하는 패킷을 받아 출력 통신 링크의 하나로 패킷을 전달한다.  
패킷 스위치는 많은 형태와 특징이 있는데, 오늘날 가장 널리 사용되는 라우터와 링크 계층 스위치가 있다. 링크 계층 스위치는 보통 접속 네트워크에서 사용되고 라우터는 네트워크 코어에서 사용된다.

패킷이 송신 종단 시스템에서 수신 종단 시스템에 도달하는 동안 거쳐온 일련의 통신 링크와 패킷 스위치를 네트워크상의 **경로(route 혹은 path)** 라고 한다.

종단 시스템은 **ISP(Internet Service Provider)** 를 통해 인터넷에 접속한다.  
ISP 는 다음과 같은 종류가 있다.  
- 가정 ISP, 법인 ISP, 대학 ISP
- 와이파이 접속을 제공하는 ISP
- 이동 접속을 제공하는 셀룰러 데이터 ISP

각 ISP 는 패킷 스위치와 통신 링크로 이루어진 네트워크이다.  
ISP 는 종단 시스템에게 다양한 네트워크 접속을 제공한다. 또한 웹사이트와 비디오 서버를 인터넷에 직접 연결하도록 CP(content provider) 에게 인터넷 접속을 제공한다.  
종단 시스템에 접속을 제공하는 ISP 들도 서로 연결되어야 하고, 하위 계층 ISP 는 국가, 국제 상위 계층 ISP 를 통해 서로 연결하고, 상위 계층 ISP 들은 서로 직접 연결된다.  
상위 계층 ISP 는 광 링크로 연결된 고속 라우터로 구성된다. 각 ISP 네트워크들은 따로 관리되고, IP 프로토콜을 수행하며, 네이밍과 주소배정 방식을 따른다.

종단 시스템, 패킷 스위치를 비롯한 인터넷의 다른 구성요소는 인터넷에서 정보 송수신을 제어하는 여러 **프로토콜**을 수행한다. TCP 와 IP 가 인터넷에서 가장 중요한 프로토콜이다. 

인터넷 표준은 IETF(Internet Engineering Task Force) 에서 개발하며, IETF 표준 문서를 RFC(requests for comment) 라고 한다. 이들은 TCP, IP, HTTP, SMTP 같은 프로토콜을 정의한다. 

### 서비스 측면에서 본 인터넷

애플리케이션에 서비스를 제공하는 인프라스트럭처로서 인터넷을 기술할 수 있다.  
인터넷 애플리케이션은 인터넷 메시징, 지도 서비스, 게임, 위치기반 추천 시스템을 포함하는 모바일 스마트폰과 태블릿 애플리케이션을 포함한다. 이런 애플리케이션은 서로 데이터를 교환하는 많은 종단 시스템을 포함하고 있기 떄문에 **분산 애플리케이션**(distributed application) 이라고 부른다.  
인터넷 애플리케이션은 종단 시스템에서 수행된다. 

인터넷에 접속된 종단 시스템들은 한 종단 시스템에서 수행되는 프로그램이 어떻게 인터넷 인프라 스트럭처에 다른 종단 시스템에서 수행되는 특정 목적지 프로그램으로 데이터를 전달하도록 요구하는지를 명시하는 **소켓 인터페이스**를 제공한다.  
인터넷 소켓 인터페이스는 송신 프로그램이 따라야 하는 규칙의 집합이며, 인터넷은 이 규칙에 따라 데이터를 목적지 프로그램으로 전달하게 된다. 

인터넷 송신 프로그램은 데이터를 목적지 프로그램으로 전달할 수 있도록 따라야 하는 소켓 인터페이스를 갖고 있다. 또한 인터넷은 여러 서비스를 애플리케이션에 제공한다. 

### 프로토콜이란 무엇인가?

> 프로토콜은 둘 이상의 통신 개체 간에 교환되는 메시지 포맷과 순서뿐만 아니라, 메시지의 송수신과 다른 이벤트에 따른 행동들을 정의한다.

네트워크 프로토콜은 메시지를 교환하고 행동을 취하는 개체가 장치들의 하드웨어나 소프트웨어 구성요소이다. 통신하는 둘 이상의 원격 개체가 포함된 인터넷에서의 모든 활동은 프로토콜이 제어한다.  

물리적으로 연결된 두 컴퓨터의 네트워크 접속 카드에서 하드웨어로 구현된 하드웨어로 구현된 프로토콜은 컴퓨터로 사이에 연결된 선로상의 비트 흐름을 제어한다.  
라우터에서 프로토콜은 출발지에서 목적지까지 패킷 경로로 설정한다. 

## 네트워크의 가장자리

종단 시스템은 웹 브라우저 프로그램, 웹 서버 프로그램, 전자메일 서버 프로그램 같은 애플리케이션을 수행하므로 **호스트**라고 부른다. 즉, 호스트는 종단 시스템이다. 

호스트는 클라이언트와 서버로 구분된다. 비공식적으로 클라이언트는 데스크톱, 이동 PC, 스마트폰들을 의미한다. 서버는 웹 페이지를 저장하고 분배하고 비디오를 스트림하며 전자메일을 릴레이하는 더 강력한 기능을 갖춘 컴퓨터다. 

### 접속 네트워크

> 접속 네트워크란 종단 시스템을 그 종단 시스템으로부터 먼 거리에 있는 다른 종단 시스템까지의 경로상에 있는 첫 번째 라우터(edge router 라고도 한다.) 에 연결하는 네트워크이다. 

#### 가정 접속: DSL, 케이블, FTTH, 5G 고정 무선

가장 널리 보급된 광대역 가정 접속 유형은 **DSL(digital subscriber line)** 과 케이블이다. 일반적으로 가정은 유선 로컬 전화 서비스를 제공하는 같은 지역 전화 회사 (telco)로부터 DSL 인터넷 접속 서비스를 받는다. 따라서 DSL 을 사용할 때 고객의 telco 가 ISP 도 된다.  

각 DSL 모뎀은 텔코의 지역 중앙국 (central office, CO)에 위치한 DSLAM (digital subscriber line access multiplexer) 과 데이터를 교환하기 위해 기존 전화 회선을 이용한다. 가정의 DSL 모뎀은 디지털 데이터를 받아서 전화선을 통해 CO 로 전달하기 위해 고주파 신호로 변환한다. 여러 가정으로부터의 아날로그 신호는 DSLAM 에서 디지털 포맷으로 다시 변환된다.

가정 전화 회선은 데이터와 전통적인 전화 신호를 동시에 전달하며 이들은 다른 주파수 대역에서 인코딩된다. 

- 고속 다운스트림 채널: 50kHz ~ 1 MHz 대역
- 중간 속도의 업스트림 채널: 4~50 kHz 대역
- 일반적인 양방향 전화 채널: 0~4 kHz 대역

단일 DSL 링크가 3개의 분리된 링크인 것처럼 보이게 하여 하나의 전화 회선과 인터넷 연결이 동시에 DSL 링크를 공유할 수 있게 한다.  

DSL 표준은 24 Mbps 와 52 Mbps 속도의 다운스트림과 3.5 Mbps 와 16 Mbps 속도의 업스트림을 포함하는 여러 전송률을 정의한다. 최신 표준은 업스트림과 다운스트림을 결합한 1 Gbps 속도의 정의하고 있다. 다운스트림과 업스트림 속도가 다르기 때문에 이 접속 방식을 비대칭(asymmetric) 이라고 한다. 실제 다운스트림과 업스트림 속도는 위의 속도와 비교했을 때 작을 수 있다. 

DSL 이 텔코의 기존 로컬 전화 인프라스트럭처를 이용하는 반면, 케이블 인터넷 접속은 케이블 TV 회사의 기존 케이블 TV 인프라스트럭처를 이용한다.  
가정은 케이블 TV 서비스를 제공하는 같은 회사로부터 인터넷 접속 서비스를 받는다. 광케이블은 케이블 헤드엔드를 이웃 레벨 정션(junction) 에 연결하며 이로부터 개별 가정과 아파트에 도달하는 데 전통적인 동축케이블이 사용된다. 광케이블과 동축케이블 모두 이 시스템에서 채택하고 있기 때문에 흔히 HFC 라고 부른다.

케이블 인터넷 접속은 케이블 모뎀이라고 하는 특별한 모뎀이 필요하다. 케이블 모뎀은 보통 외장형 장치이고, 이더넷 포트를 통해 가정 PC 에 연결된다. 케이블 모뎀은 HFC 네트워크를 2개의 채널, 다운스트림과 업스트림 채널로 나눈다. DSL 에서와 마찬가지로 접속은 비대칭이며, 보통 다운스트림 채널이 업스트림 채널보다 빠른 전송률이 할당된다. 낮은 전송 속도 계약 혹은 미디어 손실로 인해 최대 가능 속도가 실현되지 않을 수도 있다.  
케이블 인터넷의 한 가지 중요한 특성은 공유 방송 매체라는 것이다. 헤드엔드가 보낸 모든 패킷이 모든 링크의 다운스트림 채널을 통해 모든 가정으로 전달된다. 그리고 가정에서 보낸 모든 패킷은 업스트림 채널을 통해 헤드엔드로 전달한다. 이러한 이유로, 여러 사용자가 다운스트림 채널에서 다른 비디오 파일을 동시에 수신하고 있다면 각 사용자가 비디오 파일을 수신하는 실제 수신율은 다운스트림 전송률보다 상당히 작아진다. 업스트림 채널도 공유되므로 분산 다중 접속 프로토콜은 전송을 조정하고 충돌을 피하기 위해 필요하다. 

DSL 과 케이블 네트워크가 미국의 가정 광대역 접속 주류를 이루고 있으나 좀 더 빠른 속도를 제공하는 미래 기술은 FTTH (fiber to the home) 이다. FTTH 는 CO 로부터 가정까지 직접 광섬유 경로를 제공하고, 잠재적으로 Gbps 의 인터넷 접속 속도를 제공할 수 있다. 

CO 로부터 가정까지 광신호를 분배하는 여러 경쟁적인 기술이 있다.  
가장 간단한 광신호 분배 네트워크는 각 가정으로 CO 에서 하나의 광섬유를 제공하는데, 다이렉트 광섬유라고 한다. 좀 더 일반적으로, CO에서 시작되는 각 광섬유는 실질적으로 여러 가정이 공유한다. 가정에 가까운 곳까지 하나의 광섬유로 와서 이곳에서 고객별 광섬유로 분리된다. 이러한 스플리팅을 수행하는 두 가지 경쟁적인 광신호 분배 네트워크 구조가 AON(active optical network) 과 PON(passive optical network) 이다. 

PON 분배 구조를 이용하는 FTTH를 살펴보자.  
각 가정은 ONT (optical network terminator) 를 갖고 있으며, 이는 지정된 광섬유로 이웃 스플리터에 연결된다. 스플리터는 여러 가정을 하나의 공유 광섬유로 결합하고, 이를 텔코의 CO에 있는 OLT (optical line terminator) 에 연결한다. 광신호와 전기신호 간의 변환을 제공하는 OLT는 텔코 라우터를 통해 인터넷에 연결된다. 가정에서 사용자는 홈 라우터(일반적으로 무선 라우터)를 ONT에 연결하고, 이 홈 라우터를 통해 인터넷에 접속한다. PON 구조의 OLT에서 스플리터로 송신된 모든 패킷은 스플리터에서 복제된다. 

DSL, 케이블, FTTH 외에 5G 고정 무선 기술이 구축되고 있다. 5G-FW 는 고속 가정 접속뿐만 아니라 전화회사 중심국에서 가정까지의 비용이 들고 고장이 잘 나는 케이블 포설 작업을 하지 않아도 되게 해줄 것이다. 

#### 기업 (그리고 가정) 접속: 이더넷과 와이파이

LAN (local area network) 는 일반적으로 종단 시스템을 edge router 에 연결하는 데 사용된다. 여러 유형의 LAN 기술이 있지만 이더넷 기술이 가장 널리 사용되는 접속 기술이다. 

이더넷은 이더넷 스위치에 연결하기 위해 꼬임쌍선을 이용한다.  
이더넷 접속에서 사용자는 보통 이더넷 스위치에 100 Mbps 부터 10 Gbps 까지의 속도로 접속하고, 서버는 1 Gbps 부터 10 Gbps 까지의 속도로 접속한다. 

무선 랜 환경에서 무선 사용자들은 기업 네트워크에 연결된 AP (access point) 로 패킷을 송/수신하고 이 AP 는 유선 네트워크에 다시 연결된다. 무선 랜 사용자들은 일반적으로 AP 의 수십 미터 반경 내에 있어야 한다. 와이파이라고 더 잘 알려진 IEEE 802.11 기술에 기반한 무선 랜 접속은 이제 거의 모든 곳에 존재한다. 

#### 광역 무선 접속: 3G와 LTE 4G와 5G

이동 전화망 사업자들이 운영하는 기지국을 통해 패킷을 송수신하는 데 사용하는 것과 같은 무선 인프라스트럭처를 채택하고 있다. 와이파이와 달리, 사용자는 기지국의 수십 킬로미터 반경 내에 있으면 된다. 

### 물리 매체

비트가 출발지에서 목적지로 전달될 때, 일련의 송신기-수신기 쌍을 거친다. 각 송신기-수신기 쌍에 대해 이 비트는 물리 매체 상에 전자파나 광 펄스를 전파하여 전송한다. 물리 매체는 여러 형태이며 경로상의 각 송신기-수신기 쌍에 대해 같은 유형일 필요는 없다. 
ex. 꼬임쌍선, 동축케이블, 다중모드 광섬유 케이블, 지상파와 위성파

1. 유도 매체
광섬유 케이블, 꼬임쌍선 혹은 동축케이블 같은 견고한 매체를 따라 파형을 유도한다. 비유도 매체는 무선 랜 혹은 디지털 위성 채널의 경우처럼 대기와 야외 공간으로 파형을 전파한다. 
- **꼬임쌍선**
	가장 싸고 가장 많이 이용하는 전송 매체이다. 100년 넘게 전화망에 사용되었다. UTP(unshielded twisted pair) 는 빌딩의 컴퓨터 네트워크, 즉 LAN 에 가장 많이 사용하는 매체이다. 꼬임 쌍선을 이용하는 LAN 의 데이터 전송률은 10 Mbps 에서 10 Gbps 에 이른다. 가능한 데이터 전송률은 전송선의 두께와 송신기와 수신기 사이의 거리에 따라 다르다. 
- **동축 케이블**
	2개의 구리선으로 되어 있으나 두 구리선이 평행하지 않고 동심원 형태를 이루고 있다. 꼬임쌍선보다 더 높은 데이터 전송률을 얻을 수 있다. 케이블 TV 와 케이블 인터넷 접속에서 송신기는 디지털 신호를 특정 주파수 대역으로 이동시키고 그 결과 아날로그 신호는 송신기로부터 하나 이상의 수신기로 전송된다. 동축 케이블은 유도 매체로 사용할 수 있고, 여러 종단 시스템은 케이블에 직접 연결할 수 있으며 모든 종단 시스템은 다른 종단 시스템이 전송하는 모든 것을 수신한다. 
- **광섬유**
	