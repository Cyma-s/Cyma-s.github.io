---
title   : Github Self-hosted Runner 설정
date    : 2023-08-01 21:50:39 +0900
updated : 2023-08-01 21:51:06 +0900
tags     : 
- github
- shook
- 레벨3
- 우테코
- trouble-shooting
---

CI에서도 Jenkins 를 사용하지 않았던 만큼, Github Action workflow와 동일한 문법을 사용하는 Github self-hosted runner를 사용하기로 했다.     

그런데 생각보다 힘든 작업이었다... 설정하는 데 시간도 오래 걸렸다.

## CD file

개발 서버에서 QA 용으로 사용할 CD 파일이다.     
특정 트리거를 달아두지 않고, 수동으로 실행시킬 수 있도록 설정해두었다.    

```yml
name: Backend Develop Deploy (CD)

on:
  workflow_dispatch:
    inputs:
      branch:
        description: 'Branch Name'
        required: true

jobs:
  build:
    name: Backend Deploy
    runs-on: shook-runner

    steps:
      - name: Log pwd
        shell: bash
        run: pwd
      - name: Log Branch Name
        shell: bash
        run: echo "${{ github.event.inputs.branch }}"
      - name: Deploy
        shell: bash
        run: bash /home/ubuntu/deploy.sh ${{ github.event.inputs.branch }}
```

```yml
on:
  workflow_dispatch:
```

위 설정을 추가하면, github 내부에서 브랜치를 지정해서 workflow를 실행할 수 있는 버튼이 생긴다.     

![[workflow-dispatch-button.png]]

`github.event.inputs.branch` 를 하게 되면 다음과 같이 workflow 실행할 때 같이 입력할 수 있는 값 입력 창이 생긴다.    

![[cd-workflow-input.png]]

## 발생한 Issues

### Server가 끝까지 실행되지 않는 문제

![[self-hosted-runner-error.png]]

Starting ShookApplication 이라는 문구가 나오지 않고, Application 이 종료되었다.  

그렇지만 이 부분은 우리 잘못이었다.    
ddl-auto를 사용하지 않고, 테이블 스키마를 바꾸었는데 테이블을 적용해주지 않으니 connection과 관련한 예외가 발생한 것이다.    

데이터베이스에 추가한 컬럼을 넣어주니 해결되었다.    

### Github Runner 실행 종료 후, Server가 종료되는 현상

Github Runner 내부에서 Server process 가 실행되었기 때문에, Github Runner 가 실행 종료 되면서 Server process 를 함께 종료하는 문제가 발생했다.    

이 경우, Github Runner 같은 일반 프로그램이 Server Application 을 종료할 수 없도록 `sudo nohup java -jar ...` 처럼 서버를 실행할 때 `sudo` 권한으로 실행하여 문제를 해결했다.    

### nohup.out 이 없어지는 현상

self-hosted runner를 사용하면, runner 에서 서버 애플리케이션을 실행해서 그런지 nohup.out 파일이 어디에도 나타나지 않는다.    

이런 경우에는 배포 스크립트에 다음과 같이 적어주면 해결 된다.    

`sudo nohup java -jar /home/ubuntu/shook.jar > /home/ubuntu/2023-shook/backend/build/libs 2>&1 &` 

애플리케이션에서 발생하는 로그들을 어디에 저장할 지 명시해주게 되면, github self-hosted runner 화면에서는 더 이상 서버 실행 로그가 표시되지 않는다.    

![[unexisted-nohup-log.png]]

대신 위에서 명시한 경로에 nohup.out 에 로그가 쌓이게 된다.    

## 단점이라고 생각되는 것들

생각보다 로그가 빈약하다. 어떤 부분에서 예외가 발생하고, 어디에서 발생한 문제인지 알 수가 없다.     

runner 에서 예외가 발생했는지 아닌지도 알 수 없다. runner 는 성공적으로 수행됐지만, 우리 서버에서는 예외가 발생했을 수도 있다. 

디버깅이 너무 어렵다. 로그가 빈약하다보니 우리가 결국 EC2 내부에 들어가서 어디가 잘못됐을 지 무한 추측을 해야만 한다...

Jenkins 는 겪어보지 못해 모르겠지만, 생각보다 러닝커브가 있다.     
yml 파일을 쓰는 것이 오래 걸리는 게 아니라, Runner가 어떤 동작을 하는지 모르니 예외 처리하기가 힘들다.     

