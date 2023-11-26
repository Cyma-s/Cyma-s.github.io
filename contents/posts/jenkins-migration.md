---
title: 젠킨스 마이그레이션
date: 2023-11-26 17:50:19 +0900
updated: 2023-11-26 18:25:38 +0900
tags:
  - shook
---

## 서론

현재 S-HOOK 의 배포는 github self hosted runner 로 자동화되어 있다.  
그러나 self-hosted runner 는 롤백을 수행하기 불편하다. 이전의 jar 파일을 우리가 버전 별로 관리해야 해서 관리 지점이 늘어난다.

또한 로그를 자세히 제공해주지 않는다는 점도 불편하다. 종종 배포가 실패하더라도 어떤 부분에서 에러가 발생했는지에 대한 자세한 로그는 확인하기 어렵다. 

shell 스크립트로 배포가 이루어지기 때문에 버전관리가 필요한데, 현재는 버전관리가 되고 있지 않아 이번 서버를 이전할 때 이전 기록을 보며 기억을 되짚으면서 (...) 재배포했다. 

이런 부분에서 애로 사항을 느껴 자동 배포 툴을 self-hosted runner 에서 젠킨스로 마이그레이션하려고 한다.

## Jenkins 란?

젠킨스는 소프트웨어 개발 시 지속적 통합 서비스를 사용하는 툴이다. 모든 언어의 조합과 소스 코드 레포지토리에 대한 지속적인 통합과 지속적 배포 환경을 구축하기 위한 도구이다. 

우리는 별도의 EC2에 jenkins 를 설치하려고 한다.  
**EC2 사양은 t4g.small 인스턴스에 우분투 22.04 ARM 64 이다.**

## 설치 환경 설정

### Java 설치

젠킨스 설치를 위해서는 Java 설치가 필요하다.  
먼저 Java 를 설치해주자. 

```bash
wget -O- https://apt.corretto.aws/corretto.key | sudo apt-key add - 
sudo add-apt-repository 'deb https://apt.corretto.aws stable main' 
sudo apt-get update; 
sudo apt-get install -y java-17-amazon-corretto-jdk
```

### 도커 설치

도커를 사용하지 않고 젠킨스를 우분투에 직접 설치하면 해주어야 하는 환경 설정이 많다.  
이를 간소화하기 위해 도커를 사용해보자.  

[도커 공식 문서](https://docs.docker.com/engine/install/ubuntu/) 를 참고하였다.

#### Docker `apt` repository 설정

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

#### Latest ver ) Docker Package 설치

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

도커 엔진이 잘 설치되었는지 확인하기 위해 `hello-world` 이미지를 실행해본다. 

```bash
sudo docker run hello-world
```

### 젠킨스 컨테이너 실행

#### 젠킨스 이미지 다운로드

Jenkins LTS 버전 이미지를 다운로드한다. 

```bash
docker pull jenkins/jenkins:lts
```

#### docker-compose 로 젠킨스 실행하기

docker-compose 를 설치한다. 

```bash
sudo apt install docker-compose
```

도커 실행 경로에 `docker-compose.yml` 파일을 만들고, 내용을 작성해준다. 

```yaml
version: "3"
services:
  jenkins: # 컨테이너 이름
    image: jenkins/jenkins:lts
    user: root  # root 로 실행
    volumes:
      - ./jenkins:/var/jenkins_home
    ports:
      - 8080:8080
```

- `volumes`: 도커 컨테이너의 데이터를 보존하기 위해 `/var/jenkins_home` 디렉토리를 호스트의 `/jenkins` 와 마운트한다.
- `ports`: 컨테이너 외부 / 내부의 포트를 포워딩한다. 

이제 다음과 같은 명령어로 jenkins 컨테이너를 실행할 수 있다.

```bash
sudo docker-compose up -d
```

## Jenkins 설정

이제 Jenkins 컨테이너에 퍼블릭 IP 로 외부에서 접속할 수 있게 되었다.  

아래 명령을 사용하여 Jenkins 컨테이너에 출력된 로그에 적힌 initial admin password 를 확인할 수 있다. 

```bash
sudo docker logs jenkins
```

