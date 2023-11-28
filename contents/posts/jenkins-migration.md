---
title: 젠킨스 마이그레이션
date: 2023-11-26 17:50:19 +0900
updated: 2023-11-28 20:13:09 +0900
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
sudo docker pull jenkins/jenkins:lts
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

추천하는 플러그인들을 설치했다. 

### Project 생성하기

Freestyle project 로 생성했다.
item 이름은 경로에도 포함되므로 영어로 적는 것이 좋다.

![[jenkins-freestyle-project.png]]

우리는 Github Project 로 생성할 것이기 때문에 Github project 를 체크해준다. 

project url 에는 팀 깃허브 주소를 넣어준다.

![[jenkins-project-url.png]]

소스 코드 관리는 Git 으로 하게 되는데, Repositories 에 Github .git 주소를 넣어주고, Username 과 password 로 Credentials 를 설정해준다. password 에는 token 을 넣어주면 된다. 

어떤 브랜치를 빌드할 때 사용할 것인지 정해준다.

![[jenkins-repositories-branches.png]]

### submodule 설정

S-HOOK 에서는 submodule 을 사용하기 때문에 Additional Behaviours 에 submodule 관련 설정을 추가해주었다. 

![[jenkins-submodule-settings.png]]

### 빌드 유발

현재 S-HOOK 은 main 에 머지된 커밋들이 바로 빌드되어도 되는 변경 사항들이 아니기 때문에 설정해주지 않았다. 

### Build Steps

Invoke Gradle script 를 생성해서, gradlew 을 사용하도록 설정해준다.  
어떤 명령어로 실행할 것인지도 아래에 적어준다. 

![[jenkins-gradle-script.png]]

그리고 아래 고급 설정에서 Build file 이 어디에 있는지 명시해준다. 

![[jenkins-build-gradle-file.png]]

### Send files or execute commands over SSH 설정

젠킨스 서버에서 빌드한 jar 파일을 prod 서버로 보내야 하기 때문에 아래의 설정이 반드시 필요하다. 

먼저 Publish Over SSH 라는 플러그인을 설치해야 한다. 

![[jenkins-publish-over-ssh.png]]

그다음 Jenkins 관리 > System 의 맨 아래에 있는 Publish over SSH 설정을 적어준다. 

Key 에는 SSH 접속 시 필요한 pem 키를 적어주면 되고, SSH Servers 에 설정을 적어주면 된다. 
- Hostname: 보낼 서버 IP 주소
- Username: 연결할 username (우리는 ubuntu 를 적어주었다.)
- Remote Directory: 연결 될 디렉터리 위치. 반드시 존재해야 되고 생성되지 않는다. 기본 디렉터리라고 생각하면 된다. 우리는 /home/ubuntu 로 설정해주었다.

이제 다시 구성으로 돌아와서 아까 설정해둔 Server Name 으로 연결할 서버를 찾는다.

![[jenkins-ssh-server.png]]

그런 다음 transfers 에 다음과 같이 적는다.

![[jenkins-ssh-transfers.png]]

- Source files: 보낼 파일의 경로를 적어준다.
- Remove prefix: 파일의 경로를 삭제하고 실제 파일 이름만 남게 한다.
- Remote directory: 어떤 폴더에 파일을 저장할 지 지정한다. 기본 링크는 /home/ubuntu 로 지정되어 있다. (즉, /application-jar 는 ~/application-jar 에 저장될 것이다.)
- Exec command: 파일을 옮긴 뒤 어떤 것을 실행할 지 정한다. 우리는 bash 파일을 실행하고, bash 를 실행하며 발생한 로그를 파일에 기록한 뒤 띄우는 방식을 선택했다. 이러면 배포가 완료되면 Jenkins 에 로그 파일 내용이 출력된다.

전체 스크립트는 다음과 같다.

```shell
# 로그 파일 경로 설정
LOG_FILE="/home/ubuntu/application-jar/deployment.log"

# 배포 로그 저장
bash /home/ubuntu/backend-deploy.sh > $LOG_FILE

# 배포 완료 후 로그 파일 내용을 출력하고 삭제
cat $LOG_FILE
rm $LOG_FILE
```

### bash로 파일을 실행하지 않은 이유

그렇다면 `bash ./deploy.sh` 처럼 바로 파일을 실행하면 되는 거 아닐까? 나도 그렇게 생각했다.  
그러나 이렇게 하면 bash 명령이 끝나지 않아서 배포가 종료되지 않는 문제가 있었다.  

따라서 로그를 다른 파일에 저장해두고, 배포가 끝나면 파일을 출력한 다음 로그 파일을 삭제하는 방식으로 실행했다. 