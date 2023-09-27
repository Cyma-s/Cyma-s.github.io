---
title: tomcat
date: 2023-09-17 19:52:18 +0900
updated: 2023-09-17 20:16:59 +0900
tags:
  - tomcat
---
## Backlog

연결을 처리할 수 있는 스레드를 사용할 수 있을 때까지 연결을 허용하고, `maxConnection` 수에 도달하면 추가 연결 요청은 `acceptCount` 크기를 갖는 큐에 대기하게 된다. 해당 큐를 Backlog, 백로그라고 한다.  

백로그가 가득 차 있을 때, 새로운 연결 요청은 일반적으로 거절되거나 무시된다.  
이미 성립된 연결에 대해서는 백로그와는 별개로 연결의 데이터 전송 상태에 따라 (데이터 전송이 완료되었는가, 아닌가 등) 재전송 메커니즘이 동작한다.  

### maxConnection?

> Each incoming, non-asynchronous request requires a thread for the duration of that request. If more simultaneous requests are received than can be handled by the currently available request processing threads, additional threads will be created up to the configured maximum (the value of the `maxThreads` attribute). If still more simultaneous requests are received, Tomcat will accept new connections until the current number of connections reaches `maxConnections`. Connections are queued inside the server socket created by the **Connector** until a thread becomes available to process the connection. Once `maxConnections` has been reached the operating system will queue further connections. The size of the operating system provided connection queue may be controlled by the `acceptCount` attribute. If the operating system queue fills, further connection requests may be refused or may time out.

톰캣은 현재 연결 수가 maxConnection 에 도달할 때까지 새 요청을 수락하며, `maxConnection` 에 도달하면 OS 가 추가로 연결할 수 있는 요청을 큐에 대기시킨다.  

즉, 톰캣이 연결할 수 있는 최대 연결 수를 의미한다.  

### 백로그에 존재하는 요청들의 재전송

#### 백로그에 있는 요청들은 어떤 상태일까?

아직 완전히 연결 성립 과정을 마치지 않은 (TCP 3-way handshake) 가 완료되기를 기다리는 연결 요청들이다.  
백로그에서 대기 중인 요청들은 TCP handshake 가 완료되면 연결이 성립된 것으로 간주하고, 데이터를 주고받을 준비가 된다. 

#### 백로그에 있는 요청의 3-way handshake 과정

백로그에 요청이 쌓이게 되면, 해당 요청이 처리되지 못하고 대기하게 된다. 그러나 TCP 의 재전송은 이미 성립된 연결에서 데이터 전송 중 패킷의 유실을 감지하게 될 때 주로 발생한다.  

초기 연결 설정 중 (TCP Handshake) 에 문제가 발생하면 재시도할 수 있으나, 연결이 한 번 성립된 이후에는 재전송이 이루어진다.  

톰캣의 백로그에 있는 요청의 handshake 과정은 다음과 같다.

1. **백로그 상태의 연결 요청**: 클라이언트가 SYN 패킷을 보냈을 때, 요청이 백로그에 대기한다. 3-way handshake 첫 단계는 시작되었으나, 완료되지 않은 상태이다.
2. **톰캣의 연결 수락**: 백로그에 대기 중인 요청 중에 톰캣이 처리할 수 있는 요청이 있으면, 서버는 SYN-ACK 패킷을 보내서 응답한다.
3. **연결 완료**: 클라이언트가 ACK 로 응답하여 연결을 확정한다. 3-way handshake 가 완료되고, 톰캣과 클라이언트는 데이터를 주고 받을 준비가 된 것이다.

#### 백로그에 존재하는 요청들의 타임아웃

3-way handshake 에는 특정한 시간 제한이 없지만, TCP 자체의 재전송 메커니즘이나 운영체제 네트워크 스택에 의해 타임아웃이 발생할 수는 있다. 

자세한 재전송 메커니즘은 [[tcp]] 를 확인하자.

## 참고

- [https://tomcat.apache.org/tomcat-8.5-doc/config/http.html](https://tomcat.apache.org/tomcat-8.5-doc/config/http.html)