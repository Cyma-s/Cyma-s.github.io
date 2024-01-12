---
title: 1월 12일 연구실 회의
date: 2024-01-12 13:03:46 +0900
updated: 2024-01-12 15:30:34 +0900
tags: 
---

## Vehicular Ad-hoc Networks

autonomous driving, traffic managements

문제 발생 시 빠르게 전파해야 한다. 

1. Unicast
	- src → dst
2. Broadcast
	- src ←→ obj

→ 빠른 특성 때문에 broadcast 채택

### Various Methods

- Probability-based
	- 시간 오래 걸림
- Distance-based
	- 가장 가까운 거 위주로 dynamic mobility
- Cluster-based
	- Cluster overhead

### Trickle algorithm

wireless sensor network’s dissemination algorithm
trickle time : exponentially increased interval

trickle timer 시작 → transmission period 동안 범위 내의 다른 자동차에게 전달

### Vehicle-aware adaptive Trickle (VaaT)

- adjust transmission period
- As far distance as possible
	- Distance: relative distance between cars
	- Not always select by distance

### Simulation

- ns-3 Simulation
	- IEEE 802.11p, OFDM , 6Mbps, 10Mhz

## 해야 할 일

LiDAR 로 차를 찍음
1대로 찍을 때보다 2개로 찍을 때 더 많이 나온다는 걸 보여줘야 함. 
1. point count 를 찍다보면 데이터 양이 다름 시간 흐름에 따라 그래프를 그린다. (몇 메가 인지) 이걸 네트워크로 전송하려면 속도가 얼마나 나와야 하는지 1초에 10번씩 전송할 수 있는지. 
2. 확대된 것에서 object detection 이미지 (1개로 했을 때 / 2개로 했을 때)

LiDAR 프로그램 돌리기 위해서 OS 설치하고 프로그램 설치
그걸로 다음 주에 실험  
필요한 network throughput 측정하기

### LiDAR

LiDAR는 Light Detection and Ranging의 약자이다. LiDAR에서 레이저는 광원(송신기)에서 보내지고 물체에서 반사됩니다. 반사광은 시스템 수신기에 의해 감지되고 비행시간 (TOF)은 물체의 거리 지도를 개발하는 데 사용된다.  
레이저의 직진성을 이용하여 먼 거리의 물체를 정확하고 빠르게 감지가 가능하다는 장점이 있다.

#### 유형

- 회전형
	- 전기 모터를 사용하여 360도 회전 가능
	- 전방향으로 사물의 유무와 거리 및 방향 정보 획득 가능
	- 수직으로 동시에 송신하는 레이저 빔의 개수에 따라 4/16/32/64/128 채널 등이 있음.
	- 채널 수가 높을수록 해상도가 높아지고 가격 올라감
- 고정형
	- 구성이 단순. 회전형에 비해 가격이 상대적으로 저렴함
	- 화각 한계 때문에 화격을 넘으면 물체 탐지가 불가능함
	- 동작 원리에 따라 MEMS 라이다, 플래시 라이다, 광학 위상 라이다, FMCW 라이다 등으로 구분 가능

#### 종류

1. 전동 기계식 라이다
가장 일반적인 유형. 모터를 통해 360도 회전시켜 전방향을 센싱. 수직 해상도는 채널 수에 의해 결정되며 가격이 비쌈.

2. MEMS 라이다
전압으로 기울기가 달라지는 마이크로 미러를 사용. 다차원으로 레이저 빔을 전달하기 위해 다수의 거울을 계단식으로 배열하는 구조. MEMS 라이다는 온도와 진동에 취약하나 크기가 작고 가격이 저렴함. 

3. 플래시 라이다
레이저를 전방에 비추고 레이저 가까이 위치한 수신기에서 반사된 산란광을 포착하여 하나의 이미지로 전체 물제를 감지한다. 이미지 포착 속도가 빠르지만, 역반사체로 인해 물체를 감지 못하는 경우가 발생할 수 있다. 

4. 광학 위상 배열 (OPA: Optical Phased Arrays)
광학 위상 배열이 렌즈를 통과하는 빛의 속도를 제어하여 빛의 파면 현상을 제어하고 빔을 여러 방향으로 쏘아 물체를 인식한다. 가격이 저렴하고 소형이지만, 시야가 좁다는 단점이 있다. 

5. FMCW 라이다
짧은 chirp 주파수 변조 레이저를 생성하여 수신한 chirp 신호의 위상, 주파수를 통해 대상물의 거리와 속도를 측정할 수 있다. FMCW 라이다는 주변 환경에 대해 강건하다는 장점이 있는 반면, 가격이 높고 아직 선행 단계로 상용화까지는 아직 해결해야 할 부분이 많다. 

#### 원리

물체와의 거리 측정에 있어 TOF 원리를 사용한다.  
거리는 다음과 같은 수식으로 계산한다. 

$$d = \frac{c\Delta t}{2}$$



#### 문제점

- 악천후에서 성능 약화
- 개체의 반사율에 의해 성능이 결정되기도 함
- 방출된 빔으로부터의 신호 격리 및 거부
- 송신기와 의도된 타겟 사이의 대기에 있는 먼지로 인한 superious 리턴
- 사용 가능한 광 전력의 제한: 더 많은 전력이 있는 시스템은 더 높은 정확도를 제공하지만 작동 비용이 더 높음. 
- 스캐닝 속도: 레이저 소스가 사람 눈에 위험한 주파수에서 작동할 때 안전에 문제가 있을 수 있다. 

### 디지털트윈

디지털 트윈(Digital Twin)이란 **현실 세계의 기계나 장비, 사물 등을 컴퓨터 속 가상세계에 구현하는 것을 의미**

