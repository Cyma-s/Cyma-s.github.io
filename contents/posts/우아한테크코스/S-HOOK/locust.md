---
title   : Locust 사용기
date    : 2023-09-07 12:10:43 +0900
updated : 2023-09-07 12:11:00 +0900
tags     : 
- 테스트
- spring
- shook
- 개발
---

## 개요

Locust 는 성능 테스트를 위한 도구다. 자세한 내용은 [[shook-load-test]] 확인하기.

다른 블로그에서 Locust 가 잘 사용되지 않는 이유가 러닝 커브라고 해서 한 번 써봤다.  
나는 기존에 파이썬을 사용한 적이 있기 때문에 추가로 파이썬에 대해 배울 부분은 없었다.   

## Locust 설치

```shell
pip install locust
```

## 테스트 스크립트 작성

```python
import json  
from locust import HttpUser, task, between  
  
  
class Sample(HttpUser):  
    wait_time = between(1, 2.5)  
  
    def on_start(self):  
        print("start")  
  
    def on_stop(self):  
        print("stop")  
  
    @task  
    def get(self):  
        self.client.get("/api/songs/high-liked")
```

우리 서비스의 좋아요 순으로 정렬해서 조회하는 API 를 반복 호출하도록 했다.  
스크립트를 실행하면 `localhost:8089` 로 접속해서 유저 수, 유저 생성 latency, 테스트할 서버 URL 을 입력할 수 있다.   

## 테스트 실행하기

> RPS 란 서버가 지원하는 초당 요청 수를 말한다. (Request Per Second)

아래와 같이 입력하면 `localhost:8089` 로 접속이 가능하다.

```shell
locust -f 스크립트파일이름
```

### 전체 조회 API

![[locust-test-chart.png]]

테스트를 수행하면 다음과 같은 화면이 보인다.  

이상하게 평균적으로 잘 가져오다가 한 번씩 저렇게 지표가 튀는 부분이 있었는데, 이 부분은 좀 더 알아봐야겠다. 

단순한 GET 요청이라 그런지 실패율은 0%.. 다행이다.

### 단순 swipe API 테스트

![[locust-swipe-api-test-chart.png]]

스와이프 요청을 위한 API 를 테스트 해봤다.  
다행히 생각했던 것 만큼 오래 걸리지 않았다. 왠지 모르겠는데 자꾸 95th percentile 이 감소하는 데 왜일까 ㅋㅋ

### 랜덤한 API 주소로 요청 보내기

테스트 코드는 다음과 같다.  

```python
import json  
from locust import HttpUser, task, between  
import random  
  
  
class Sample(HttpUser):  
    wait_time = between(1, 2.5)  
  
    def on_start(self):  
        print("start")  
  
    def on_stop(self):  
        print("stop")  
  
    @task  
    def get(self):  
        song_number = random.randint(1, 20)  
        self.client.get("/api/songs/" + str(song_number))
```


![[locust-random-swipe-api-test.png]]

이전과는 다르게 유저 수가 800 명이 되었을 때 굉장히 편차가 큰 응답 시간을 보여줬다.  
RPS 가 400 이상일 때부터 응답 시간이 안정적이지 않다는 것을 의미한다.  

이 부분은 확실하게 최적화가 필요하다.  

### 데이터 10000개로 증가 후 테스트

![[locust-many-datas-test.png]]

동시 접속 유저 100명까지 설정, 초마다 1명씩 증가하도록 설정

데이터가 166배 증가할 때 시간은 5배 증가한다.  
이게 어떤 의미를 갖는 거고 무슨 수치인지는 잘 모르겠다.  

## 후기

정말 간단한 코드와 단순한 실행으로 짧은 시간 안에 테스트를 수행할 수 있었다. (코드 치는 데 1분 정도 걸린 듯 ㄷㄷ)

요청 통계, 실패, 예외를 CSV 파일로 다운로드할 수 있고, Report 도 다운로드할 수 있다는 점은 큰 장점이다. Report 가 기록으로 남을 수 있으니까 관리하기 더 쉬울 것이다.  

스크립트 기반이라 다른 데스크탑에서도 실행할 수 있다는 것도 좋다.  
스크립트만 전달하면 팀원들도 쉽게 실행할 수 있으니, 많은 테스트를 수행하기 용이하다.

다만 제공하는 데이터가 조금 제한적이라는 느낌을 받았다.  
좀 더 자세한 데이터를 원한다면 다른 툴을 사용하는 것이 좋을 듯하다.