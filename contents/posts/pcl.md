---
title: Point Cloud Library
date: 2024-02-20 15:55:26 +0900
updated: 2024-02-20 16:01:26 +0900
tags:
  - lidar
  - pcl
  - lab
---

## 설치

Ubuntu 20.04 버전에서 진행했다.

### tar 파일 다운로드 받기

[github 링크](https://github.com/PointCloudLibrary/pcl/releases) 에서 필요한 버전의 파일을 다운로드 받는다. 나는 PCL 1.14.0 버전으로 진행했고, source.tar.gz 를 다운로드 받는다. 

```shell
tar xvfz source.tar.gz
```

파일의 압축을 풀어준다. 

### CMake

압축이 풀리면 `pcl` 이라는 폴더가 생성된다. 
해당 폴더로 이동하고, build 폴더를 만든 뒤 이동한다. 

```shell
cd pcl && mkdir build && cd build
```

build 내부에서 CMake 를 수행한다.  

```shell
cmake ..
```

### 설치하기

파일을 설치한다. 설치하는 데는 시간이 꽤 오래 걸렸다. 

```shell
sudo make -j2 install
```

잘 설치되었는지 확인하기 위해 PCL 버전을 확인해보자.  

```shell
dpkg -s libpcl-dev | grep 'Version'
```

잘 나온다면 설치가 완료된 것이다. 

PCD 파일도 출력해보자.  

```shell
/usr/local/bin/pcl_viewer pcd파일이름
```

viewer 창이 떠서 pcd 파일이 시각화되어 잘 보인다면 설치가 잘 된 것이다. 