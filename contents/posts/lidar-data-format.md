---
title: LiDAR Data Format
date: 2024-01-16 14:08:37 +0900
updated: 2024-01-16 14:57:07 +0900
tags:
  - lidar
---

## Configurable Data Packet Format

데이터 패킷은 Packet Header, Measurement Header, Channel Data blocks, Packet Footer 로 구성되어 있다.  
패킷 속도는 lidar mode 에 따라 다르다.  
워드는 32bit, little endian 이다.  

기본적으로 lidar UDP 데이터는 Port `7502` 로 포워딩된다.  

### Packet Header

- Packet type (16 bit unsigned bit): lidar data와 다른 패킷들을 stream 에서 구별하기 위함이다. Lidar 패킷은 Packet Type이 0x1 이다. 
- Frame ID (16 bit unsigned int) : lidar 스캔의 인덱스. 센서가 회전을 완료하는 매 시간마다 증가한다. 
	- Init ID (24 bit unsigned int) : ID 초기화. 매 유저에 의해 트리거되거나 에러가 발생했을 때, reboot 가 발생할 때 일어나는 reinit 마다 변경된다. 이 값은 또한 HTTP command `GET /api/v1/sensor/metadata/sensor_info` 로 얻을 수 있다. 
- Serial No (40 bit unsigned int) : 센서의 serial number. 이 값은 각 센서마다 고유하고, 센서 위에 붙여져 있는 스티커 위에서 찾을 수 있다. 추가로, 이 정보는 Web UI 에서도 볼 수 있고, `get_sensor_info` 의 `prod_sn` 필드에서도 확인할 수 있다. 
- Shot limiting status (4 bit unsigned int) : 센서의 shot 제한 상태를 볼 수 있다. 다른 코드들은 sensor 가 Normal Operation 으로 작동하는지, Shot limiting 으로 작동하는지 알려준다. 
- Shutdown Status (4 bit unsigned int) : thermal shutdown 이 imminent인지 알려준다. 
- Shot limiting countdown (8 bit unsigned int) : 30초에서 shot limiting 에 도달할 때까지 카운트 다운된다. 
- Shutdown Countdown (8 bit unsigned int) : 30 초에서 thermal shutdown 이 발생할 때까지 카운트 다운된다.

### Column Header Block

- Timestamp (64 bit unsigned int) : nanoseconds 단위로 측정되는 Timestamp
- Measurement ID (16 bit unsigned int) : 0 부터 511, 또는 0 부터 1023, 또는 0 부터 2047 와 같이 lidar_mode 에 따라 순차적으로 증가하는 수치이다. 
- Status (1 bit unsigned int) : 수치의 유효성을 알려준다. 유효한 수치인 경우에는 0x01, dropped 이거나 disabled column의 경우에는 0x00 이다. 

### Channel Data Blocks

- channel data block 의 구조와 크기는 유저가 설정할 수 있는 data packet 의 포맷에 기초한다. 

### Packet Footer (256 bits)

![[lidar-packet-footer.png]]

## Channel Data Profiles

구성 가능한 데이터 패킷 형식의 일부로 사용자가 사용할 수 있는 다양한 채널 데이터 프로필 옵션이다.  
`udp_profile_lidar` 를 다음 옵션 중 하나로 설정하여 선택할 수 있다.  

- RNG19_RFL8_SIG16_NIR16 (Single Return Profile)
- RNG15_RFL8_NIR8 (Low Data Rate Profile)
- RNG19_RFL8_SIG16_NIR16_DUAL (Dual Return Profile)

### Single Return Profile

모든 센서의 데이터 패킷 형식은 기본적으로 Single Return Profile 로 설정된다.  

