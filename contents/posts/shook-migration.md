---
title: S-HOOK EC2 마이그레이션하기
date: 2023-11-22 16:50:48 +0900
updated: 2023-11-28 14:49:43 +0900
tags:
  - shook
  - 우테코
---

## 이관 과정

1. DB dump 및 마이그레이션
2. 레포지토리 이관
3. 운영 서버 설정

## self-hosted-runner 설정

기존 레포지토리에 러너를 추가한다.  
Linux, ARM 으로 설정해준다. 

self-hosted-runner 에 명시되어 있는 대로 진행한다.  
runner 그룹 이름은 엔터로 하고, 러너 이름을 설정해준다.

라벨은 shook-production 만 추가하면 기본 라벨들은 추가된다. 

## Github Action 변경

일단 젠킨스 배포 전까지는 무중단 배포를 중단하기로 했다.  

### 배포 스크립트 설정

먼저 `~/application-jar` 디렉토리를 만든 후, 기존 배포 스크립트를 설정했다.

```shell
echo "> 현재 구동중인 애플리케이션 pid 를 조회합니다."
CURRENT_PID=$(pgrep -f shook)

if [ -z "$CURRENT_PID" ]; then
        echo "> 구동중인 애플리케이션이 없습니다."
else
        while [ -n "$CURRENT_PID" ]
        do
			    echo "> 현재 구동중인 애플리케이션 pid: $CURRENT_PID"
                echo "> kill -15 $CURRENT_PID"
                sudo kill -15 $CURRENT_PID
                sleep 5
                CURRENT_PID=$(pgrep -f shook)
        done
fi

echo "> 구동중인 애플리케이션 종료가 완료되었습니다."

# 애플리케이션 배포
echo "> 애플리케이션 배포를 시작합니다."
JAR_NAME=$(ls -t ~/application-jar/ | grep jar | head -n 1)

echo ">> $JAR_NAME 를 통한 배포 실행"
sudo nohup java -jar ~/application-jar/$JAR_NAME --spring.profiles.active=prod1 2>&1 &

sleep 20
CURRENT_PID=$(pgrep -f shook)
echo ">> 실행된 애플리케이션 pid: $CURRENT_PID"

echo "> 애플리케이션 배포가 완료되었습니다."
```

security 서브모듈 설정을 위해 서브모듈이 있는 계정에 Authentication Key 를 추가했다.

### 로깅용 디렉터리 추가

`/var/log` 에 `app` 디렉터리를 생성한다.  

app 디렉터리 내부에 warn, error, info 디렉터리를 생성한다.

### 자바 설치

똑같이 자바를 설치하는 걸 까먹은 우리 팀
또 다시 설치해준다. 

### npm 설치

`sudo apt-get install npm` 으로 npm 을 설치해준다.

### nginx 권한을 root 로 변경

이렇게 실행하면 nginx 에서 index.html 을 못 찾는다는 문제가 발생한다.  
nginx 의 권한이 root 가 아니기 때문에 발생하는 문제다.

`/etc/nginx` 의 nginx.conf 파일에서 user 를 root 로 변경해준다. 

### certbot 설정하기

기존 운영 서버에서 인증서를 삭제한다.  

### 서버 시간 설정하기

`timedatectl list-timezones` 로 변경 가능한 Time Zone 들을 리스트업 할 수 있다.

`Asia/Seoul` 로 TZ 을 변경한다. 

```bash
sudo timedatectl set-timezone Asia/Seoul
```

`timedatectl` 로 변경된 TZ 를 볼 수 있다.

```bash
               Local time: Tue 2023-11-28 14:11:46 KST
           Universal time: Tue 2023-11-28 05:11:46 UTC
                 RTC time: Tue 2023-11-28 05:11:47
                Time zone: Asia/Seoul (KST, +0900)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

### MySQL 서버 시간 설정하기

