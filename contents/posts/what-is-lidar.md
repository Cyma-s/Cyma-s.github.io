---
title: LiDAR 강의 준비
date: 2024-02-12 21:56:51 +0900
updated: 2024-02-23 16:39:07 +0900
tags:
  - lidar
  - lab
---

우리 연구실에 있는 LiDAR 센서를 예시로 들어서 설명하면 좋을 듯.

## LiDAR 센서 기초

- LiDAR 구조
- LiDAR 가 포인트 클라우드를 어떻게 만드는가?
- 패킷이 어떻게 구성되어 있는가?

### LiDAR 란?

Lidar 는 **li**ght **d**etection **a**nd **r**anging 의 줄임말이다. 눈에 안전한 레이저를 사용하여 3D로 세상을 보고, 기계와 컴퓨터가 조사된 환경을 정확하게 표현한다. [출처](https://velodynelidar.com/what-is-lidar/)

Velodyne lidar sensors meet the FDA eye-safety standards under [IEC 60825](https://www.fda.gov/downloads/MedicalDevices/DeviceRegulationandGuidance/GuidanceDocuments/UCM592775.pdf).

### LiDAR 는 어떻게 작동하는가?

일반적인 LiDAR 센서는 펄스 광파를 주변 환경으로 방출한다. 이 펄스는 주변 물체에서 반사되어 센서로 돌아온다. 센서는 각 펄스가 센서로 돌아오는 데 걸린 시간을 사용하여 이동한 거리를 계산한다. 이 과정을 초당 수백만 번 반복하면 환경의 실시간 3D 지도가 생성된다. 

레이더는 마이크로파를 사용하고, 소나는 음파를 사용하는 반면, LiDAR는 반사광을 사용하기 때문에 레이더나 소나보다 더 정밀하고 높은 해상도로 더 빠르게 거리를 측정할 수 있다. 

## LiDAR 포인트 클라우드 처리

- 포인트 클라우드 처리를 하는 이유 → 무엇을 하기 위해서?
	- Object Detection → 패킷 압축 완료하고 합류
	- **패킷 압축 → 논문 찾아보기**
	- 잡음 제거
	- 여러 포인트 클라우드를 결합하여 하나의 3차원 장면을 복원할 수도 있다.
	- SLAM
- Wireshark 에 있는 실제 패킷 보여주기
- LiDAR 포인트 클라우드 패킷 전달 방식

### 방법/기법

주요 과제 중 하나는 포인트 클라우드의 희소성과 불규칙성으로 인해, 기존의 컨볼루션 신경망 (convolution neural network)을 적용하기 어려움입니다. 또 다른 문제는 포인트 클라우드의 노이즈와 불완전성으로, 처리 시 오류와 아티팩트가 발생할 수 있는 점입니다.

- LiDAR 포인트 클라우드 패킷 압축
- ROS
- Python 으로 처리하는 방법 알아보기
	- https://pointclouds.org/
- Open3D

#### 참고

- https://gaussian37.github.io/autodrive-lidar-intro/
- [LiDAR 를 소개하는 한글 자료](https://www.kibme.org/resources/journal/20220617110654606.pdf)_

---

## LiDAR 포인트 클라우드 프로세싱 응용 시스템

### Application

### SW

### API

### Platform

## LiDAR 포인트 클라우드 프로세싱 실습 소개

### OS 설치

### 프로그램 설치

### SW 개발 방법

## 포인트 클라우드 프로세싱 프로그래밍 기초 실습/데모

## 포인트 클라우드 응용 프로그래밍 실습/데모