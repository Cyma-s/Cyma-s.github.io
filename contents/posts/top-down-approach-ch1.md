---
title: 1. 컴퓨터 네트워크와 인터넷
date: 2023-11-20 22:36:55 +0900
updated: 2024-03-19 15:24:51 +0900
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
가정은 케이블 TV 서비스를 제공하는 같은 회사로부터 인터넷 접속 서비스를 받는다. 광케이블은 케이블 헤드엔드를 이웃 레벨 정션(junction) 에 연결하며 이로부터 개별 가정과 아파트에 도달하는 데 전통적인 동축케이블이 사용된다. 광케이블과 동축케이블 모두 이 시스템에서 채택하고 있기 때문에 흔히 **HFC** 라고 부른다.

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
	비트를 나타내는 빛의 파동을 전하는 가늘고 유연한 매체. 단일 광섬유는 초당 10~100기가 비트에 이르는 놀라운 비트율을 지원할 수 있다. 전자기성 간섭에 영향을 받지 않으며 100 km 까지는 신호 감쇠 현상이 매우 적고 태핑하기 어렵다. 이런 특성 때문에 광역 유도 전송 매체로 널리 이용하는데, 특히 해저 링크에 광섬유를 사용한다. 그러나 송신기, 수신기, 스위치 등의 광 장비는 고가이므로 LAN 이나 가정처럼 근거리 전송에는 이용하기 어렵다. 
- 지상 라디오 채널
	전자기 스펙트럼으로 신호를 전달한다. 라디오 채널은 물리 선로를 설치할 필요가 없고, 벽을 관통할 수 있고, 이동 사용자에게 연결성을 제공하고 먼 거리까지 신호를 전달할 수 있다는 가능성 때문에 매력적이다. 전파 환경과 신호가 전달되는 거리에 많은 영향을 받는다. 주변 환경은 경로 손실과 섀도 페이딩 (shadow fading, 신호가 먼 거리를 지나감에 따라 혹은 방해 물질을 돌아가거나 통과함에 따라 신호 강도가 약해지는 현상), 다중 경로 페이딩, 간섭을 결정한다. 
- 위성 라디오 채널
	통신 채널은 지상 스테이션이라는 둘 이상의 지상 기반 마이크로파 송신기/수신기를 연결한다. 위성은 한 주파수 대역으로 전송 신호를 수신하고, 리피터를 이용하여 그 신호를 재생하며 해당 신호를 다른 주파수 대역으로 전송한다. 위성은 초당 기가비트의 전송률을 제공할 수 있다. 통신에는 정지 위성 / 저궤도 위성이 이용된다.

## 네트워크 코어

### 패킷 교환

네트워크 애플리케이션에서 종단 시스템들은 서로 메시지를 교환한다. 메시지에는 애플리케이션 설계자가 원하는 무엇인가가 포함될 수 있다.

출발지 종단 시스템에서 목적지 종단 시스템으로 메시지를 보내기 위해 송신 시스템은 긴 메시지를 **패킷(packet)** 이라고 하는 작은 데이터 덩어리로 분할한다. 송신 측과 수신 측 사이에서 각 패킷은 통신 링크와 패킷 스위치 (packet switch - 라우터와 링크 계층 스위치의 두 가지 유형이 있음)를 거치게 된다. 

패킷은 링크의 최대 전송률과 같은 속도로 각각의 통신 링크에서 전송된다.  
즉 출발지 종단 시스템 혹은 패킷 스위치가 $R비트/초$의 속도로 링크에서 L비트의 패킷을 송신한다면 그 패킷을 전송하는데 걸리는 시간은 $L/R$초다.

#### 저장-후-전달

대부분의 패킷 스위치는 저장-후-전달 전송 (store-and-forward transmission) 방식을 이용한다. 저장-후-전달은 스위치가 출력 링크로 패킷의 첫 비트를 전송하기 전에 전체 패킷을 받아야 함을 의미한다.

라우터는 보통 여러 개의 링크를 갖는다. 라우터의 기능이 입력되는 패킷을 출력 링크로 교환하는 것이기 때문이다.  
라우터는 저장-후-전달 전송을 채택하고 있기 때문에 라우터가 패킷의 모든 비트를 수신한 후에만 출력 링크로 그 패킷을 전송하기 시작한다.

출발지부터 목적지 노드까지 N개의 링크로 구성되고 각각은 전송률이 R인 경로를 통해 하나의 패킷을 전송하는 일반적인 경우, 종단 간 지연은 다음과 같다.

$$
d_{종단간지연 }= N * \frac{L}{R}
$$

#### 큐잉 지연과 패킷 손실

각 패킷 스위치는 접속된 여러 개의 링크를 갖고 있다. 각 링크에 대해 패킷 스위치는 출력 버퍼 (output buffer, 출력 큐 (output queue) 라고도 한다.)를 갖고 있으며 그 링크로 송신하려고 하는 패킷을 저장하고 있다.  

출력 버퍼는 패킷 교환에서 중요한 역할을 한다.  
도착하는 패킷이 한 링크로 전송되어야 하는데 그 링크가 다른 패킷을 전송하고 있다면 도착하는 패킷은 출력 버퍼에서 대기해야 한다. 따라서 저장-후-전달 지연뿐 아니라 패킷은 출력 버퍼에서 큐잉 지연을 겪게 된다.  
버퍼 공간의 크기가 유한하기 때문에 도착하는 패킷은 버퍼가 전송을 위해 대기 중인 다른 패킷들로 꽉 차 있는 경우를 당할 수 있는데, 이 경우 패킷 손실이 발생한다. 

#### 포워딩 테이블과 라우팅 프로토콜

인터넷에서 모든 종단 시스템은 IP 주소라고 하는 주소를 갖는다. 출발지 종단 시스템이 패킷을 목적지 종단 시스템으로 보내고자 할 때 출발지는 패킷의 헤더에 목적지의 IP 주소를 포함한다.  

각 라우터는 목적지 주소(혹은 목적지 주소의 일부)를 라우터의 출력 링크로 매핑하는 포워딩 테이블을 갖고 있다. 패킷이 라우터에 도착하면 라우터는 올바른 출력 링크를 찾기 위해 주소를 조사하고, 이 목적지 주소를 이용하여 포워딩 테이블을 검색한다. 그 다음 라우터가 그 패킷을 출력 링크로 보낸다. 

인터넷은 자동으로 포워딩 테이블을 설정하는데 이용하는 여러 특별한 라우팅 프로토콜을 가지고 있다. 

### 회선 교환

링크와 스위치의 네트워크를 통해 데이터를 이동시키는 방식에는 회선 교환과 패킷 교환이라는 두 가지 기본 방식이 있다. 

회선 교환 네트워크에서 종단 시스템 간에 통신을 제공하기 위해 경로상에 필요한 자원 (버퍼, 링크 전송률) 은 통신 세션 동안에 확보 또는 예약된다. 패킷 교환 네트워크에서는 이런 자원을 예약하지 않는다.

회선 교환 네트워크의 예시로 전통적인 전화망이 있다. 송신자가 정보를 보내기 전에 네트워크는 송신자와 수신자 간의 연결을 설정해야 하고, 이는 송신자와 수신자 간의 경로에 있는 스위치들이 해당 연결 상태를 유지해야 하는 연결이다. 이 연결을 **회선**이라고 한다.  
네트워크가 회선을 설정할 때, 그 연결이 이루어지는 동안 네트워크 링크에 일정한 전송률을 예약한다. 주어진 전송률이 송신자-수신자 연결을 위해 예약되므로 송신자는 수신자에게 보장된 일정 전송률로 데이터를 전송할 수 있다. 

#### 회선 교환 네트워크에서의 다중화

링크 내 한 회선은 **주파수 분할 다중화 (frequency-division multiplexing, FDM)** 혹은 시 분할 다중화 (time-division multiplexing, TDM) 로 구현된다. 

FDM 에서 링크를 통해 설정된 연결은 그 링크의 주파수 스펙트럼을 공유한다. 또한 그 링크는 연결되는 동안 각 연결에 대해 주파수 대역을 고정 제공한다. 일반적으로 4kHz 폭을 갖는다. 이런 대역의 폭을 **대역폭**이라고 한다. 

TDM 링크의 경우는 시간을 일정 주기의 프레임으로 구분하고 각 프레임은 고정된 수의 시간 슬롯으로 나뉜다. 네트워크가 링크를 통해 하나의 연결을 설정할 때, 이들 슬롯은 이 연결을 위해 사용되도록 할당되고 그 연결의 데이터를 전송하기 위해 모든 프레임에 하나의 시간 슬롯을 갖게 된다. 

TDM 회선의 전송률은 한 슬롯 안의 비트 수에 프레임 전송률을 곱한 것과 같다. 

#### 패킷 교환 대 회선 교환

패킷 교환은 왜 효율적인가? 회선 교환의 경우, 사용자들의 비활동 시간이 긴 경우에도 항상 일정 전송률이 사용자에게 예약된다. 그러나 패킷은 동시 사용자가 많지 않은 경우 (혹은 동시 사용자가 있는 확률이 매우 작은 경우에) 패킷 교환은 거의 항상 회선 교환과 대등한 지연 성능을 가지면서도 높은 사용자 수를 허용할 수 있다. 

즉, 회선 교환이 요구에 관계 없이 미리 전송 링크의 사용을 할당하는 반면, 패킷 교환은 요구할 때만 링크의 사용을 할당한다.

### 네트워크의 네트워크

종단 시스템은 접속 ISP 를 통해 인터넷에 연결된다. 접속 ISP 는 다양한 접속 기술을 이용하여 유선, 무선 연결을 제공한다.  
그러나 종단 사용자들과 콘텐츠 제공자들을 접속 ISP 로 연결하는 것은 인터넷을 구성하는 수십억 개의 종단 시스템을 연결하는 퍼즐의 해결 방법 중 극히 일부에 해당한다. 이를 위해서는 접속 ISP 들이 서로 연결되어야 한다. 이를 위해 **네트워크의 네트워크**가 탄생하게 되었다. 

점진적으로 네트워크 구조를 만들어보자. 

1. 네트워크 구조1
	모든 접속 ISP 를 하나의 *글로벌 통과(transit) ISP* 와 연결한다. 글로벌 ISP 는 라우터와 전 세계에 이르고 적어도 수십만 개의 접속 ISP 와 가까운 곳에 있는 라우터를 갖는 통신 링크의 네트워크다. 이런 확장된 네트워크를 구축하는 데는 매우 많은 비용이 들기 때문에 글로벌 ISP는 접속 ISP 에게 요금을 부과할 것이다. 즉, 접속 ISP 는 고객이고 글로벌 ISP 는 제공자가 된다. 

어느 회사가 수익을 내는 글로벌 ISP 를 구축하고 운영한다면, 다른 회사가 자신만의 글로벌 ISP 를 구축하고 또 다른 글로벌 ISP 와 경쟁할 수 있을 것이다.

2. 네트워크 구조 2
	수십만 개의 접속 ISP 와 다중의 글로벌 ISP 로 구성되는 *2계층 구조*이다. 접속 ISP 는 가격과 서비스를 비교하며 경쟁하는 여러 글로벌 통과 서비스 제공자들 중에서 선택할 수 있기 때문에 네트워크 구조 2를 선호할 것이다. 그러나 글로벌 ISP 들은 하나의 글로벌 ISP 와 연결된 접속 ISP 가 다른 글로벌 통과 서비스 제공자에게 연결된 접속 ISP 와 연결하기 위해 서로 연결되어야 한다.

그러나 현실적으로 전 세계의 모든 도시에 존재하는 ISP 는 없다. 대신 어느 주어진 지역에서 그 지역에 있는 접속 ISP 들이 연결하는 지역 ISP 가 있다. 각 지역 ISP 들은 1계층 ISP 들과 연결된다. 1계층 ISP 들은 글로벌 ISP 와 유사하지만, 전 세계적으로 모든 도시에 존재하지는 않는다는 점에서 차이를 갖는다. (대략적으로 12개 정도의 1계층 ISP 가 있다.)

3. 네트워크 구조 3
	여러 경쟁적인 1계층 ISP 가 존재할 뿐만 아니라 한 지역에 여러 경쟁적인 지역 ISP 들이 있는 *다중계층구조*이다. 각각의 접속 ISP 는 자신이 연결하는 지역 ISP 에게 요금을 지불하고, 각 지역 ISP 는 자신이 연결하는 1계층 ISP 에 요금을 지불한다. (더 복잡한 경우 지역 ISP -> 지방 ISP -> 국가 ISP -> 1계층 ISP 로 연결되는 구조를 가질 수도 있다.)

인터넷과 좀 더 유사한 네트워크를 구축하기 위해서는 PoP, 멀티홈, 피어링, IXP 를 계층적인 네트워크 구조 3에 포함해야 한다.

4. 네트워크 구조 4: 접속 ISP, 지역 ISP, 1계층 ISP, PoP, 멀티홈, 피어링, IXP 로 구성한 구조
**PoP (points of presence)** : 제공자의 네트워크 내에 있는 하나 혹은 그 이상의 라우터 그룹. 여기서 고객 ISP 가 제공자 ISP 에 연결될 수 있다. 고객은 자신의 라우터 중 하나를 PoP에 있는 라우터에 직접 연결하도록 고속 링크를 제 3자 통신 서비스로부터 임대할 수 있다. 
**멀티홈**: 둘 혹은 그 이상의 제공자 ISP 에 연결하도록 선택하는 것이다. 한 ISP 가 멀티홈을 하면 서비스 제공자 중 하나가 연결되지 않더라도 인터넷으로 패킷을 계속해서 송수신할 수 있다.
**피어링**: 고객 ISP 가 서비스 제공 ISP 에게 지불하는 요금은 서비스 제공자와 교환하는 트래픽의 양을 반영하기 때문에, 이 비용을 줄이기 위해 같은 계층에 있는 가까운 ISP 들은 "이들 간에 송수신되는 모든 트래픽을 상위 계층 ISP 를 통하지 않고 직접 송수신할 수 있도록 자신들의 네트워크를 직접 연결할 수 있다"
**IXP (Internet Exchange Point)**: 일반적으로 교환기를 갖춘 독자적인 빌딩에 존재한다. 제 3의 회사가 IXP 를 구축할 수 있으며, 이는 다중의 ISP 들이 서로 피어링을 할 수 있는 만남의 장소라고 할 수 있다.

5. 네트워크 구조 5: 네트워크 구조 4 위에 **콘텐츠 제공자 네트워크 (content-provider network)** 를 추가하여 구축한 것이다. 
	
오늘날의 인터넷은 복잡하며 12개 정도의 1계층 ISP 들과 수십만 개의 하위 계층 ISP 들로 구성되어 있다. ISP는 그 서비스 영역이 다양하며 여러 대륙과 대양에 걸쳐 서비스하는 것도 있고, 지리적으로 매우 좁은 지역만을 대상으로 하는 것도 있다.  
사용자와 콘텐츠 제공자는 하위 계층 ISP의 고객이고, 하위 계층 ISP들은 상위 계층 ISP들의 고객이다. 최근에 주요 콘텐츠 제공자도 자신의 네트워크를 구축했고, 가능한 곳에서 하위 계층 ISP들과 직접 연결한다.

## 패킷 교환 네트워크에서의 지연, 손실과 처리율

### 패킷 교환 네트워크에서의 지연 개요

패킷이 경로를 따라 한 노드 (호스트 혹은 라우터)에서 다음 노드(호스트 혹은 라우터)로 전달되므로 그 패킷은 경로상의 각 노드에서 다양한 지연을 겪는다.
노드 처리 지연, 큐잉 지연, 전송 지연, 전파 지연이 있고, 이러한 지연들이 쌓여서 전체 노드 지연을 일으킨다.

#### 지연 유형

라우터 A가 라우터 B에 이르는 하나의 출력 링크를 갖는다. 
패킷이 업스트림 노드로부터 라우터 A에 도착하면, 라우터 A는 그 패킷에 대한 적당한 출력 링크를 결정하기 위해 패킷 헤더를 조사하고, 선택된 링크로 패킷을 보낸다.  
패킷은 링크에 현재 전송되는 다른 패킷이 없고, 큐에 자신보다 앞선 다른 패킷들이 없으면 링크로 전송될 수 있다. 만약 링크가 이미 이용되고 있거나 그 링크를 이용하기 위해 큐에서 대기하고 있는 패킷이 있다면 새로 도착하는 패킷은 큐에 들어간다. 

#### 처리 지연

패킷 헤더를 조사하고 그 패킷을 어디로 보낼지 결정하는 시간은 처리 지연에 속한다.  
처리 지연은 업스트림 노드에서 라우터 A로 패킷의 비트를 전송하면서 발생하는 패킷의 비트 레벨 오류를 조사하는 데 필요한 시간과 같은 요소를 포함할 수도 있다.

고속 라우터에서의 처리 지연은 **수 마이크로초**이다.  
노드 처리 후에 라우터는 그 패킷을 라우터 B에 이르는 링크에 앞선 큐에 보낸다.

#### 큐잉 지연

패킷은 큐에서 링크로 전송되기를 기다리면서 큐잉 지연을 겪는다.  
특정 패킷의 큐잉 지연 길이는 큐에 저장되어 링크에 전송되기를 기다리는 다른 앞서 도착한 패킷의 수에 의해 결정된다.  

현실에서 큐잉 지연은 **수 마이크로초에서 수 밀리초**에 이른다.

#### 전송 지연

일반적으로 패킷은 앞서 도착한 다른 모든 패킷이 전송된 다음에 전송된다.  

패킷의 길이를 L비트로, 라우터 A에서 라우터 B까지 링크의 전송률은 R bps 로 나타내보자.  
R은 라우터 B로 가는 링크의 전송률에 의해 결정된다.  

전송 지연은 $L/R$ 으로, 패킷의 모든 비트를 링크로 밀어내는 데 필요한 시간이다.  
전송 지연은 **수 마이크로초에서 수 밀리초**에 이른다.

#### 전파 지연

링크의 처음부터 라우터 B까지의 전파에 필요한 시간이 전파 지연이다.  
비트는 링크의 전파 속도로 전파된다. 전파 속도의 범위는 다음과 같다. 

$2  * 10^8미터/초$ ~ $3 * 10^8미터 /초$

전파 지연은 두 라우터 사이의 거리를 전파 속도로 나눈 것으로, 즉, 전파 지연은 $d/s$ 이다. (d: 라우터 A와 B 사이의 거리, s: 링크의 전파 속도)

광역 네트워크에서 전파 지연은 일반적으로 **수 밀리초**에 이른다. 

#### 전송 지연과 전파 지연 비교

전송 지연은 라우터가 패킷을 내보내는 데 필요한 시간이다.  
반면, 전파 지연은 비트가 한 라우터에서 다음 라우터로 전파되는 데 걸리는 시간이다. 

전체 노드 지연은 다음과 같다.

$$d_{처리지연 } = d_{큐잉지연}+ d_{전송 지연} + d_{전파지연}$$

전파 지연, 전송 지연은 무시할 수 있는 정도에서 상당한 지연에까지 이를 수 있다.  
처리 지연은 보통 무시될 수 있다. 그러나 라우터의 최대 처리율, 즉 라우터가 패킷을 전달할 수 있는 최대율에는 상당한 영향을 준다. 

### 큐잉 지연과 패킷 손실

다른 지연들과 다르게 큐잉 지연은 패킷마다 다를 수 있다. (전송된 첫 패킷은 큐잉 지연을 겪지 않지만, 마지막으로 전송되는 패킷은 상당히 많은 큐잉 지연을 겪을 것이다.)

언제 큐잉 지연이 클까? 트래픽이 큐에 도착하는 비율, 링크의 전송률, 도착하는 트래픽의 특성, 즉 그 트래픽이 주기에 맞춰서 또는 버스트하게 도착하느냐에 의해 주로 결정된다.  

$a$: 패킷이 큐에 도착하는 평균율 (a의 단위는 패킷 / 초)
$R$: 전송률, 즉 비트가 큐에서 밀려나는 비율 (비트 / 초)
$L$: 모든 패킷의 크기 (편의상 가정, 비트)
$La비트/초$: 비트가 큐에 도착하는 평균율
큐가 매우 커서 무한대 비트를 저장할 수 있다고 가정한다.   

트래픽 강도, 즉 $La / R$ 은 큐잉 지연의 정도를 측정하는 데 매우 중요하다. $La/R$ > 1이면 비트가 큐에 도착하는 평균율이 비트가 큐에서 전송되는 비율을 초과한다. 이 경우 큐는 트래픽으로 증가하고 큐잉 지연은 무한대에 도달한다. 그러므로 트래픽 강도가 1보다 크지 않게 시스템을 설계해야 한다.  

$\frac{La}{R} <= 1$ 인 경우를 생각해보자. 이 때 도착 트래픽의 특성이 큐잉 지연에 영향을 미친다.  
모든 패킷이 주기적으로 도착하면, 하나의 패킷이 $L/R$ 초마다 도착한다면 모든 패킷은 빈 큐에 도착할 것이고 큐잉 지연은 없을 것이다.  
반면 패킷이 몰려서 도착한다면 상당한 평균 큐잉 지연이 생길 것이다.  

트래픽 강도가 1에 접근할수록 평균 큐잉 지연이 급속히 증가한다는 사실이다. 강도에 있어서 작은 비율의 증가는 지연에서 훨씬 큰 비율의 증가를 일으킬 것이다.   

#### 패킷 손실

현실에서 큐의 용량은 스위치 설계와 비용에 크게 의존하며 일반적으로 유한 용량을 갖는다. 큐 용량이 유한하므로 트래픽 강도가 1에 접근함에 따라 패킷 지연이 실제로 무한대가 되지는 않는다.   

패킷을 저장할 수 없는 경우 라우터는 그 패킷을 **버린다**.  
종단 시스템 입장에서 패킷 손실은 패킷이 네트워크 코어로 전송되었으나 네트워크로부터 목적지에 나타나지 않는 것으로 보일 것이다. 손실 패킷의 비율은 트래픽 강도가 클 수록 증가한다.  
그러므로 노드에서의 성능은 흔히 지연뿐만 아니라 패킷 손실 확률로도 측정한다. 

### 종단 간 지연

출발지 호스트와 목적지 호스트 사이에 N - 1 개의 라우터가 있다고 하자. 그리고 네트워크가 혼잡하지 않으며, 각 라우터와 출발지 호스트의 처리 지연은 $d_{proc}$ 이고, 각 호스트와 출발지 호스트에서의 전송률은 $R비트/초$다. 그리고 각 링크에서의 전파 지연은 $d_{prop}$라고 하자. 

$d_{end-end}= N*(d_{proc}+ d_{trans}+ d_{prop})$ 

여기서 $d_{trans} = L/R$ 이고, L은 패킷 크기다.  
이 식은 처리와 전파 지연을 고려하지 않은 식을 일반화한 것이다. 

#### 종단 시스템, 애플리케이션 그리고 그 밖의 지연

공유 매체(예: 와이파이 혹은 케이블 모뎀)로 패킷을 전송하고자 하는 종단 시스템은 다른 종단 시스템과 매체를 공유하기 위해 프로토콜의 일부로 전송을 의도적으로 지연시킬 수 있다.  

또한 **VoIP(Voice-over-IP)** 애플리케이션에 있는 미디어 패킷화 지연이다.  
VoIP에서 송신 측은 먼저 패킷을 인터넷으로 보내기 전에 패킷을 인코딩된 디지털 음성으로 채워야 한다.  
이 패킷ㅇ르 채우는 시간(패킷화 지연)은 심각할 수 있으며 VoIP 콜의 사용자가 느끼는 품질에 영향을 줄 수 있다. 

### 컴퓨터 네트워크에서의 처리율

종단간 처리율(throughput) 이다. 처리율을 정의하기 위해 컴퓨터 네트워크를 통해 호스트 A에서 호스트 B로 커다란 파일을 전송하는 것을 고려해보자. 어느 한 순간에서의 순간적인 처리율은 호스트 B가 파일을 수신하는 비율 (비트/초) 이다.  

만약 파일이 F비트로 구성되고 호스트 B가 모든 $F$비트를 수신하는 데 $T$ 초가 걸린다고 하면 이때 파일 전송의 **평균 처리율 (average throughput)** $F/T$ 비트/초다.  

인터넷 전화 같은 애플리케이션의 경우, 낮은 지연과 순간적인 처리율이 지속적으로 어떤 임곗값을 넘는 것이 바람직하다. 파일 전송을 포함하는 다른 애플리케이션의 경우, 지연은 심각하지 않으나 가능한 한 높은 처리율을 갖는 것이 바람직하다.  

간단한 링크로 구성된 네트워크의 경우, 처리율은 ==병목링크==의 전송률이 처리율이 된다.  
N개의 링크의 전송률이 각각 $R_1$, $R_2$ ... $R_N$ 이라고 할 때, 서버로부터 클라이언트로 파일을 전송하는 경우의 처리율이 $min \{R_1, R_2, ... , R_N\}$ 임을 알 수 있고, 이는 서버와 클라이언트간 경로상에서의 병목 링크의 전송률이다.  

오늘날의 인터넷에 2개의 종단 시스템 (서버, 클라이언트)가 있고, 오늘날의 인터넷의 코어는 작은 혼잡을 경험하는 매우 높은 속도의 링크로 구성되어 있다고 하자. 이때 오늘날의 인터넷에서의 처리율에 대한 제한 요소는 전형적으로 접속 네트워크이다.  

컴퓨터 네트워크의 코어에 연결된 10개의 서버와 10개의 클라이언트가 있고, 10개의 동시 다운로드가 일어난다고 가정하자. 이때 공통 링크의 속도가 서버 링크의 전송률, 클라이언트의 전송률과 같은 수준이고, 10개의 다운로드에 똑같이 전송률을 나누게 되면 각 다운로드에 대한 병목은 코어에서의 공유 링크가 된다. 

## 프로토콜 계층과 서비스 모델

### 계층 구조

계층 구조는 크고 복잡한 시스템의 잘 정의된 특정 부분을 논의할 수 있게 해준다. 시스템이 계층 구조를 가질 때, 그 계층이 제공하는 서비스의 구현을 변경하는 것도 매우 쉽다. 한 계층이 상위 계층에 같은 서비스를 제공하고 하위 계층의 서비스를 이용하는 한, 어떤 한 계층의 구현이 변화하더라도 시스템의 나머지 부분은 변하지 않는다.  

#### 프로토콜 계층화

네트워크 프로토콜의 설계 구조를 제공하기 위해 네트워크 설계자느나 프로토콜을 계층으로 조직한다.  
다시 한 계층이 상위 계층에 제공하는 서비스에 관심을 갖고, 이를 계층의 서비스 모델이라고 한다.  

프로토콜 계층은 소프트웨어, 하드웨어 또는 둘의 통합으로 구현할 수 있다.  
n계층 프로토콜은 네트워크를 구성하는 종단 시스템, 패킷 스위치, 그 외의 요소 사이에 분산되어 있다. 즉, 각 네트워크 구성요소에는 하나의 n계층 프로토콜이 있다는 것이다.  

프로토콜 계층화는 개념과 구조 측면에서 이점이 있다.  
계층화는 시스템 구성요소에 대해 논의하기 위한 구조화된 방법을 제공하며, 모듈화는 시스템 구성요소의 갱신을 더 쉽게 해준다.  

다양한 계층의 프로토콜을 모두 합하여 **프로토콜 스택**이라고 한다.  

#### 애플리케이션 계층

네트워크 애플리케이션과 애플리케이션 계층 프로토콜이 있는 곳이다. HTTP, SMTP, FTP 같은 다양한 프로토콜을 포함한다.  

애플리케이션 계층 프로토콜은 여러 종단 시스템에 분산되어 있어서 한 종단 시스템에 있는 애플리케이션이 다른 종단 시스템에 있는 애플리케이션과 정보 패킷을 교환할 때 이 프로토콜을 사용한다. 애플리케이션 계층에서의 정보 패킷을 ==메시지==라고 한다. 

#### 트랜스포트 계층

클라이언트와 서버 간에 애플리케이션 계층 메시지를 전송하는 서비스를 제공한다.  
인터넷에는 TCP, UDP 라는 두 가지 트랜스포트 프로토콜이 있으며 이들은 애플리케이션 계층 메시지를 전달한다.  

TCP 는 애플리케이션에게 연결지향형 서비스를 제공하고, UDP 프로토콜은 애플리케이션에 비연결형 서비스를 제공한다.  
트랜스포트 계층 패킷을 ==세그먼트==라고 한다. 

#### 네트워크 계층

한 호스트에서 다른 호스트로 ==데이터그램==을 라우팅하는 책임을 진다.  
출발지 호스트에서 인터넷 트랜스포트 계층 프로토콜은 트랜스포트 계층 세그먼트와 목적지 주소를 네트워크 계층으로 전달한다. 그런 다음 네트워크 계층은 목적지 호스트의 트랜스포트 계층으로 세그먼트를 운반하는 서비스를 제공한다.  

인터넷의 네트워크 계층은 IP 데이터그램의 필드를 정의하며 종단 시스템과 라우터가 이 필드에 어떻게 동작하는지를 정의하는 프로토콜을 가지고 있다. 오직 하나의 IP 프로토콜이 있고, 네트워크 계층을 가진 모든 인터넷 요소는 IP 프로토콜을 수행해야 한다.  

또한 인터넷 네트워크 계층은 출발지와 목적지 사이에서 데이터그램이 이동하는 경로를 결정하는 라우팅 프로토콜을 포함한다. 인터넷은 많은 라우팅 프로토콜을 갖고 있다. 

#### 링크 계층

경로상의 한 노드에서 다른 노드로 패킷을 이동하기 위해 네트워크 계층은 링크 계층 서비스에 의존해야 한다. 특히 각 노드에서 네트워크 계층은 데이터그램을 아래 링크 계층으로 보내고 링크 계층은 그 데이터그램을 경로상의 다음 노드에 전달한다.  

링크 계층에서 제공하는 서비스는 그 링크에서 채용된 특정 링크 채용 프로토콜에 의해 결정된다. 링크 계층 프로토콜에는 이더넷, 와이파이, 케이블 접속 네트워크의 DOCSIS 프로토콜을 들 수 있다. 데이터그램이 출발지에서 목적지로 가는 데 여러 링크를 거치기 때문에 데이터그램은 경로상의 각기 다른 링크에서 다른 링크 계층 프로토콜에 의해 처리될 수 있다. 

링크 계층 패킷을 ==프레임==이라고 한다.  

#### 물리 계층

물리 계층은 프레임 내부의 각 ==비트==를 한 노드에서 다음 노드로 이동하는 것이다.  
이 계층의 프로토콜들은 링크에 의존하고 더 나아가 링크의 실제 전송 매체에 의존한다. 예를 들어 이더넷은 여러 가지 물리 계층 프로토콜을 갖고 있다.  

### 캡슐화

송신 호스트는 **애플리케이션 계층 메시지**를 트랜스포트 계층으로 전달한다. 트랜스포트 계층은 트랜스포트 계층 헤더 정보를 추가해서 **트랜스포트 계층 세그먼트**를 구성한다.  
트랜스포트 계층 세그먼트는 애플리케이션 계층 메시지를 캡슐화 하며, 추가된 정보는 수신 측의 트랜스포트 계층이 그 메시지를 적절한 애플리케이션으로 보내게 하는 정보와 메시지들의 비트들이 변경되었는지 아닌지를 수신자가 결정하게 하는 오류 검출 비트를 포함한다. 

트랜스포트 계층은 세그먼트를 네트워크 계층으로 보내고, 네트워크 계층은 출발지와 목적지 종단 시스템 주소와 동일한 헤더 정보를 추가하여 **네트워크 계층 데이터그램**을 만든다.   

이 데이터그램은 링크 계층으로 전달되고 링크 계층도 자신의 헤더 정보를 추가하여 **링크 계층 프레임**을 만든다. 

이를 통해 각 계층에서 패킷은 헤더 필드와 **페이로드 필드**라는 두 가지 형태의 필드를 갖는다는 것을 알 수 있다. 페이로드는 일반적으로 그 계층 상위로부터의 패킷이다.  

## 공격받는 네트워크

#### 나쁜 친구들은 인터넷을 통해 여러분의 호스트에 멀웨어를 침투시킬 수 있다

인터넷에서 데이터를 송/수신하기 위해 장치를 인터넷에 연결할 때, 멀웨어가 전달 될 수 있다.  

멀웨어는 파일 삭제, 주민번호, 비밀번호 등을 모으는 스파이웨어를 설치하여 해커들에게 다시 보낸다. 면역되지 않은 호스트는 수천의 비슷한 면역되지 않은 장치들로 구성된 네트워크 (botnet) 에 등록될 수 있다. 해커들은 목표로 하는 호스트에 대해 스팸 전자메일 분배 혹은 분산 Dos 공격을 위해 이 봇넷을 제어하고 이용한다.  

오늘날 많은 멀웨어는 자기복제를 수행하여 기하급수적으로 퍼질 수 있다.

#### 나쁜 친구들은 서버와 네트워크 인프라스트럭처를 공격할 수 있다

이는 **Dos (denial-of-service)** 공격으로 알려져 있다.  
Dos 공격은 네트워크, 호스트 혹은 다른 인프라스트럭처의 요소들을 정상적인 사용자가 사용할 수 없게 하는 것이다.  

대부분의 인터넷 Dos 공격은 다음 세 가지 중 하나에 속한다. 
- 취약성 공격: 목표 호스트에서 수행되는 공격받기 쉬운 애플리케이션 혹은 운영체제에 교묘한 메시지를 보내는 것이다. 
- 대역폭 플러딩 (bandwith flooding): 목표 호스트로 수많은 패킷을 보내 목표 호스트의 접속 링크가 동작하지 못하도록 많은 패킷을 보내서 정당한 패킷들이 그 서버에 도달하지 못하도록 한다. 
- 연결 플러딩 (connection flooding): 목표 호스트에 half-open 혹은 fully open 된 TCP 연결을 설정한다. 

만약 서버가 R bps 의 접속 속도를 갖고 있다면 공격자는 피해를 주기 위해 대략 R bps 의 속도로 트래픽을 전송하면 된다. 만약 R 이 매우 크면 서버에 영향을 줄 수 있는 트래픽을 발생시킬 수 없고, 모든 트래픽이 하나의 소스에서 방사되면 업스트림 라우터가 그 공격을 발견하고 그 소스로부터의 모든 트래픽을 차단할 수 있다.  

따라서 **분산 DoS(DDos)** 공격에서 공격자는 다중의 소스를 제어하여 각 소스가 목표에 트래픽을 보내도록 한다. 이러한 방법으로 모든 제어 소스에 걸친 통합 트래픽 속도가 서비스를 무능력하게 하기 위해서는 전송률이 약 R이어야 한다.  

#### 나쁜 친구들은 패킷을 탐지할 수 있다

무선 전송장치의 근처에 수동적인 수신자를 위치시킴으로써 수신자가 전송되고 있는 모든 패킷의 사본을 얻을 수 있다. 지나가는 모든 패킷의 사본을 기록하는 수동적인 수신자를 **패킷 스니퍼**라고 한다. 

유선 환경에서도 배치될 수 있는데, 많은 이더넷 LAN 과 같은 유선 방송 환경에서 패킷 스니퍼는 LAN 상으로 보내는 모든 패킷의 사본을 얻을 수 있다.  

패킷 스티퍼는 수동적이기 때문에 스니퍼를 탐지하기가 어렵다. 그래서 무선 채널로 패킷을 보낼 때, 어떤 해커가 우리 패킷의 사본을 기록하고 있을 수 있다는 가능성을 받아들여야 한다. 패킷 스니핑을 방지하기 위한 가장 좋은 방어는 암호화를 포함하는 것이다. 

#### 나쁜 친구들은 여러분이 신뢰하는 사람인 것처럼 위장할 수 있다

가짜 출발지 주소를 가진 패킷을 인터넷으로 보내는 능력을 **IP 스푸핑**이라고 하며, 한 사용자가 다른 사용자인 것처럼 행동하는 여러 가지 방법 중 하나다. 

이를 해결하기 위해서는 **종단 인증**, 즉 메시지가 실제로 와야 할 곳에서 온 것인지 확신할 수 있는 방법이 필요하다.  