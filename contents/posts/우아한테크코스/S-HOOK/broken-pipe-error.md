---
title: Broken Pipe Error
date: 2023-09-16 22:15:09 +0900
updated: 2023-09-16 22:44:43 +0900
tags:
  - spring
  - shook
  - trouble-shooting
---

S-HOOK 개발 서버에서 인덱스 조회 성능 개선을 위해 성능 테스트를 진행하다 마주한 에러이다. 스와이프를 하기 위해 노래를 클릭했을 때 현재 노래, 현재 노래보다 좋아요가 적은 노래들, 현재 노래보다 좋아요가 많은 노래들을 불러오는 API 의 성능 테스트를 진행했다.  

그런데 개발 서버의 페이지를 연속으로 새로고침할 때마다 `Broken Pipe Error` 가 발생했다.  

과연 무슨 에러일까? 왜 발생한 걸까?

## 발생한 에러

```shell
org.apache.catalina.connector.ClientAbortException: java.io.IOException: Broken pipe
```

발생한 에러의 전문이다. 간결하게 `Broken pipe` 라고 적혀 있다.  

### java.io.IOException

먼저 `IOException` 란 무엇인지 docs 를 살펴보자.  

> Signals that an I/O exception of some sort has occurred. This class is the general class of exceptions produced by failed or interrupted I/O operations.

일종의 I/O 예외가 발생했으며, 실패하거나 중단된 I/O 작업으로 인해 발생하는 예외라고 한다.  
테스트할 때 I/O 과정에서 문제가 생겼다는 것을 알 수 있다.

### ClientAbortException

> Extend IOException to identify it as being caused by an abort of a request by a remote client.

`IOException` 을 확장한 예외로, 원격 클라이언트에 의한 요청 중단으로 인해 발생한 것이라고 쓰여 있다.  

## Broken Pipe Error 란?

두 소켓 Receiver, Sender 상의 통신을 가정할 때, 한 소켓 (대체로 Receiver) 가 갑작스러운 이상으로 종료된 상황에서 다른 하나의 소켓 (Sender) 가 이를 알지 못하고 데이터를 계속 전송하려고 할 때 발생한다.  

즉, 서버인 Receiver 가 작업 결과를 전달할 곳이 없어 발생하는 에러이다.  

다음과 같은 상황에서 발생할 수 있다.  

> 1. 클라이언트에서 요청을 한다.
> 2. 서버에서 작업을 완료한 후, 클라이언트로 결과를 전송하려 한다.
> 3. 결과가 클라이언트로 넘겨지기 전에 네트워크가 끊기거나, 클라이언트가 정지 버튼을 누르거나, 브라우저를 종료하거나, 다른 화면으로 이동한다.
> 4. 최초로 요청한 정보가 사라지므로 서버 측에서 작업 결과를 전달할 곳이 없어진다.

페이지를 새로 고침하면 이전 connection 이 반환되지 않고, connection 을 닫았다가 새로운 연결을 다시 열기 때문에 이전 서버 요청에서 해당 오류가 발생하게 되는 것이다.  

## Socket 문제일까?

새 페이지가 로드되거나 현재 페이지가 새로 고침되면 이전 페이지의 모든 리소스가 닫히고, 브라우저에서 `socket.io/webSocket` 연결을 포함해서 해제된다.  

즉, 서버는 새로 로드된 페이지에서 새로운 `socket.io` 연결을 받게 된다. 쿠키나 세션을 이용해서 이전 클라이언트의 연결인지 식별하고, 이전 클라이언트가 현재 새 페이지에서 재연결하는 것임을 인식한 뒤 조치를 취할 수 있다. (세션이 같으면 캐싱된 값을 내려준다든지...)  

## 해결 방법

구글에 여러 가지 방법들이 나와있지만, 사실 그렇게 크게 와닿지 않았다.  
일반적인 네트워크 문제로 발생할 수 있는 예외이고, 서버의 오류가 아니기 때문에 클라이언트 단에서 막는 게 맞는 것 같다.  

우리 상황에서는 클라이언트의 리프레쉬를 일정 시간 간격으로 제한하면 해결될 문제일 것 같다.  
또한 서버에서 특정 IP, 세션에 대한 요청 빈도를 제한할 수 있을 것이다. 

## 참고

- https://stackoverflow.com/questions/71587838/when-refreshing-the-web-page-if-keep-the-socket-unchanged