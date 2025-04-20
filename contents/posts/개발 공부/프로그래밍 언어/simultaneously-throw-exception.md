---
title   : try, finally에 모두 예외가 발생하는 경우에는 어떻게 될까?
date    : 2023-04-07 09:53:38 +0900
updated : 2023-04-07 09:54:34 +0900
tags     :
- Java
- 개발
---

## 예외가 동시에 발생하는 경우

- 새로운 예외가 `catch`, `finally` 블록에서 발생하는 경우, 현재 예외가 이전 예외를 무시하고 외부로 전파된다. (메서드는 단 하나의 예외만 던질 수 있으므로)
- 새로운 예외는 다른 예외와 동일하게 스택을 풀기 시작한다. (stack unwinding)
- `catch` 블록에서 새 예외가 발생하는 경우, 해당 예외는 `catch`의 `finally` 블록의 영향을 받는다.
- 즉 `try/catch` 에 `finally` 가 존재하는 경우, `finally` 는 예외를 catch한 후에 실행된다. 그러나  예외를 던지기 전에 `finally` 까지 실행한 후에 가장 마지막 예외가 던져진다. 
- [[stack-unwinding|스택 풀기]]

## 참고 자료
- [stack-overflow-참고자료](https://stackoverflow.com/questions/3779285/exception-thrown-in-catch-and-finally-clause)
