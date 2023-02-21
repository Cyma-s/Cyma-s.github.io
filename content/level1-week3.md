---
title   : 레벨1 3주차
date    : 2023-02-21 10:44:54 +0900
updated : 2023-02-21 12:02:46 +0900
tags     : 
- 우테코
- 레벨1
---
# 2/21
## Checked Exception, Unchecked Exception
### Checked Exception
- Checked Exception : Exception을 상속. compiled time에 catch 가능함. try catch를 사용하지 않으면 컴파일 에러가 발생한다.
- exception이 발생하는 메서드가 throws 예약어로 Exception을 호출 메서드에 전달해야 한다.
### Unchecked exception 
- Run Time Exception이라고 한다.
- 컴파일 시점에 Exception을 catch하는지 확인하지 않는다. 컴파일 시점에 Exception이 발생할 것인지의 여부를 판단할 수 없다.
- Exception이 발생하는 메서드에서 throws 예약어를 활용해 Exception을 처리할 필요가 없지만 처리해도 무방하다.
### Checked Exception, Unchecked Exception 선택 방법
- (코틀린은 checked exception이 없다고 한다)
- 호출하는 메서드가 Exception을 활용해 뭔가 의미있는 작업을 할 수 있다면 Checked Exception을 사용하라.
- 호출하는 메서드가 Exception을 catch해서 예외 상황을 해결하거나 문제를 해결할 수 없다면 Unchecked Exception을 사용하라.
- 명확하지 않다면 Unchecked Exception을 사용하라.
- 내 생각: checked Exception을 사용하지 않아도 될 것 같다. 낮은 수준에서 checked exception을 사용한 경우 그 함수를 사용하는 모든 함수에서 throws를 사용하게 되어 함수를 사용하기 어렵다. (후추의 추가 의견 : checked exception이 안정성을 완벽히 보장하는 것이 아니다. 사용하는 쪽에서 예외처리를 어떻게 하느냐에 달려있기 때문이다.)
### Exception 처리
- 메소드에서 여러 개의 Exception을 throw 하는 경우 쉼표로 구분할 수 있다.
- 메서드에서 여러 개의 Exception을 throw할 때 부모 클래스로 예외를 전달하는 방법도 있다. (ObjectStreamException, UnknownHostException을 Exception으로 통합해서 던지는 것)
- 메서드를 호출할 때 예외를 처리한 후, 예외를 재전달(rethrow)하는 것도 가능하다.
### 복구
- 예외가 발생한 문제를 정상 상태로 돌려놓는다. (파일 등에 저장을 해두는 등)
- 재처리 또한 복구에 해당된다.
```
int readTryCount() {
  try {
      return Integer.parseInt(InputView.read());
        } catch (final NumberFormatException e) {
	    return readTryCount();
      }
  }
```
### 회피
- 직접 예외를 처리하지 않고 호출한 쪽으로 회피할 수 있다.
- 고민없는 회피는 외면하는 것과 같다. 회피를 할 때는 많은 고민 후 결정한다.
### 무시
- catch에 아무런 로직도 없는 경우
- 진짜 외면하는 경우도 있다. 무시를 하는 경우는 더 많은 고민이 필요하다.
### 전환
- Checked Exception을 Unchecked Exception으로 전환할 수 있다.
- DbException 같은 경우 도메인 계층까지 전달되기 전에 추상화 계층에 맞는 예외로 변경 하거나 적절한 시점에 예외를 처리할 수도 있다.
## List
- 데이터 저장 방식: ArrayList와 LinkedList
- ArrayList: 데이터의 추가, 삭제를 위해 아래와 같이 임시 배열을 생성해서 데이터를 복사하는 방법을 사용
- LinkedList: 데이터를 저장하는 각 노드가 이전 노드와 다음 노드의 상태만 알고 있다.
