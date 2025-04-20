---
title: Point Cloud Library
date: 2024-02-20 15:55:26 +0900
updated: 2024-02-20 17:09:19 +0900
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

## PCD 파일 실행하기

[해당 링크](https://pcl.readthedocs.io/projects/tutorials/en/latest/using_pcl_pcl_config.html#using-pcl-pcl-config) 를 참고하여 작성되었다. 

`~/pcd-test` 디렉터리에 `pcd_read.cpp` 라는 파일이 존재한다고 가정하자.  

`CMakeLists.txt` 라는 파일을 만들어야 한다. 내용은 다음과 같다.  

```cmake
cmake_minimum_required(VERSION 3.5 FATAL_ERROR)
project(pcd-read)
find_package(PCL 1.3 REQUIRED)
include_directories(${PCL_INCLUDE_DIRS})
link_directories(${PCL_LIBRARY_DIRS})
add_definitions(${PCL_DEFINITIONS})
add_executable(pcd_read pcd_read.cpp)
target_link_libraries(pcd_read ${PCL_LIBRARIES})
```

### 설명

```cmake
cmake_minimum_required(VERSION 3.5 FATAL_ERROR)
```

cmake 의 필수 기능이다.

```cmake
project(pcd-read)
```

프로젝트의 이름을 지정하고, 소스 디렉터리 (MY_GRAND_PROJECT_SOURCE_DIR) 과 cmake 를 호출하는 디렉터리 (MY_GRAND_PROJECT_BINARY_DIR) 를 참조하는 변수와 같은 몇 가지 유용한 cmake 변수를 설정한다. 

```cmake
find_package(PCL 1.3 REQUIRED)
```

최소 버전 1.3에서 PCL 패키지를 찾도록 요청하고 있다. 

- 단 하나의 컴포넌트: `find_package(PCL 1.3 REQUIRED COMPONENTS io)`
- 여러 개: `find_package(PCL 1.3 REQUIRED COMPONENTS io common)`
- 기존 모든 구성 요소: `find_package(PCL 1.3 REQUIRED)`

```cmake
include_directories(${PCL_INCLUDE_DIRS})
link_directories(${PCL_LIBRARY_DIRS})
add_definitions(${PCL_DEFINITIONS})
```

PCL 이 발견되면 몇 가지 관련 변수가 설정된다. 프로젝트에 포함하는 외부 헤더를 cmake 에 알려주려면 `include_directoreis` 매크로를 사용해야 한다. 

```cmake
add_executable(pcd_read pcd_read.cpp)
```

하나의 소스 파일 `pcd_read.cpp` 와 `pcd_read` 라는 실행 파일을 만들려고 한다고 cmake 에 알려준다. 

```cmake
target_link_libraries(pcd_read ${PCL_LIBRARIES})
```

빌드하는 실행 파일은 PCL 함수를 호출한다. 지금까지는 컴파일러가 우리가 호출하는 메서드에 대해 알 수 있도록 PCL 헤더만 포함했다. 또한 링커가 우리가 링크하려는 라이브러리에 대해 알 수 있도록 해야 한다. PCL 에서 찾은 라이브러리는 `PCL_LIBRARIES` 변수를 사용하여 참조된다. 

## PCD 파일 읽기

다음과 같이 작성하면, pcd 파일에 있는 모든 point 를 출력할 수 있다.

```cpp
#include <iostream>
 #include <pcl/io/pcd_io.h>
 #include <pcl/point_types.h>
 
 int
 main ()
 {
   pcl::PointCloud<pcl::PointXYZ>::Ptr cloud (new pcl::PointCloud<pcl::PointXYZ>);
 
  if (pcl::io::loadPCDFile<pcl::PointXYZ> ("test_pcd.pcd", *cloud) == -1) //* load the file
  {
    PCL_ERROR ("Couldn't read file test_pcd.pcd \n");
    return (-1);
  }
  std::cout << "Loaded "
            << cloud->width * cloud->height
            << " data points from test_pcd.pcd with the following fields: "
            << std::endl;
  for (const auto& point: *cloud)
    std::cout << "    " << point.x
              << " "    << point.y
              << " "    << point.z << std::endl;

  return (0);
}
```