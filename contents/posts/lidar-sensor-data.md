---
title: LiDAR Sensor Data
date: 2024-01-16 14:26:03 +0900
updated: 2024-01-16 14:54:40 +0900
tags:
  - lidar
---

## Coordinate Frames and XYZ Calculation

Lidar Coordinate Frame 은 오른손 법칙을 따르며, point clouds 를 계산하고 조작할 수 있는 가장 간단한 frame 의 point cloud-centric frame 이다.  

X 좌표는 외부 커넥터를 향해 뒤쪽을 향하고 있는데, 이는 직관적이지 않은 방향이며 다음 기준을 충족하기 위해 의도적으로 선택된 것이다.  

- 데이터 프레임은 센서의 뒤에서 나누어진다. 
- 데이터 프레임은 방위각이 0도인 상태에서 시작한다.  

방위각 window 설정 및 위상 locking 을 포함한 모든 point cloud feature 들은 Lidar Coordinate Frame 에서 정의된다. 

### Lidar Coordinate Frame

Lidar Coordinate Frame 은 lidar 회전축과 lidar 광학 중간면의 교차점에 정의된다. 

Lidar Coordinate Frame 축은 다음과 같이 배열된다. 
- 인코더 각도 0도를 가리키는 양의 X축 및 외부 커넥터
- 인코더 각도 90도를 가리키는 양의 Y축
- 양의 Z축은 센서 상단을 향한다. 

### Lidar Range to XYZ

범위 데이터는 Lidar Coordinate Frame의 3D cartesian XYZ 좌표로 변환될 수 있다.  

#### From a measurement block from the UDP Packet

- `Measurement ID` 값은 lidar data packet 에서 찾을 수 있다. 
- `scan_width` 값은 수평 해상도의 스캔 폭 값이다. 
- `r` 또는 `range_mm` 값은 i 번째 채널의 data block 이다.

#### From the GET /api/v1/sensor/metadata/beam_intrinsics HTTP Command

- `beam_to_lidar_transform` 값
- `beam_altitude_angles` 배열
- `beam_azimuth_angles` 배열

상응하는 3D 좌표는 다음과 같이 계산될 수 있다. 

![[lidar-3d-point-computed-by.png]]

![side-view-of-lidar-coordinate-frame](https://static.ouster.dev/sensor-docs/_images/lidar-frame-side.svg)

### Sensor Coordinate Frame

Sensor Coordinate Frame 은 하단의 센서 하우징 중앙에 정의되며, X축은 앞쪽, Y축은 왼쪽, Z축은 센서 상단을 향한다. 외부 커넥터는 음의 X 방향에 위치한다.  

![side-view-of-sensor-coordinate-frame](https://static.ouster.dev/sensor-docs/_images/sensor-frame-side.svg)

### Combining Lidar and Sensor Coordinate Frame

Lidar Coordinate Frame 의 양의 X축 (0 인코더 값) 은 Sensor Coordinate Frame 의 양의 X축 반대편에 위치하여 Sensor Coordinate Frame 의 양의 X축에 대한 Lidar 데이터의 중심을 맞춘다. 단일 측정 프레임은 Lidar 좌표 프레임의 0도 위치에서 시작하여 360도 위치에서 끝난다. 이는 Ouster Sensor 측정 값의 “range image” 를 볼 때 편리하며, “range image” 가 대부분의 로봇 시스템에서 일반적으로 정면을 향하는 센서 좌표 프레임의 양의 X축 중앙에 위치할 수 있도록 한다. 

Ouster 센서는 위에서 봤을 때 시계 방향으로 스캔하며, 이는 Z축에 대한 음의 회전 속도이다. 따라서 인코더 tik 이 0에서 90,111로 증가하면 Lidar 좌표 프레임에서 Z축에 대한 실제 각도는 감소한다.  

### Lidar Intrinsic Beam Angles

각 빔의 고유 빔 각도는 각 빔에 방위각 및 고도 조정 오프셋을 제공하기 위해 HTTP 명령 `GET /api/v1/sensor/metadata/beam_intrinsics` 로 쿼리할 수 있다. 방위각 조정은 현재 인코더 각도에서 참조되고 고도 조정은 센서 및 라이다 좌표 프레임의 XY 평면에서 참조된다.  

## Lidar Range Data To Sensor XYZ Coordinate Frame

정밀 마운트에 대한 보정이 필요하거나 Lidar 데이터와 함께 IMU 데이터 (관성 측정 장치) 를 사용해야 하는 애플리케이션의 경우 XYZ 포인터를 센서 좌표 프레임에 맞게 조정해야 한다. 이를 위해서는 Z 이동과 Z 축을 중심으로 한 X, Y, Z 포인트의 회전이 필요하다. Z 이동은 센서 원점 위의 라이더 조리개 정지 높이로, 사용 중인 센서에 따라 다르며, 데이터는 Z 축을 중심으로 180도 회전해야 한다. 이 정보는 행 대소 순서에 따른 homogeneous transformation matrix의 형태로 TCP를 통해 쿼리할 수 있다. 

`GET /api/v1/sensor/metadata/lidar_intrinsics` 에서 `lidar_to_sensor_transform` 으로 가져올 수 있다.  

### IMU Data To Sensor XYZ Coordinate Frame

IMU 는 실용적인 이유로 센서 좌표 프레임에서 약간 offset 되어 있다. 센서 좌표 프레임의 IMU 원점은 행 대소 순서에 따른 Homogeneous transformation matrix 의 형태로 HTTP 명령을 통해 쿼리할 수 있다. 

`GET /api/v1/sensor/metadata/imu_intrinsics` 에서 `imu_to_sensor_transform` 으로 가져올 수 있다.  

## Lidar Data Packet Format

[[lidar-data-format]]