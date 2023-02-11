---
title   : AssertJ 
date    : 2023-02-10 14:28:52 +0900
updated : 2023-02-10 14:42:11 +0900
tags     : 
- assertj
- test
- 개발
---
* AssertJ의 공식 문서를 정리한 문서이다.
* [공식 문서 사이트](https://assertj.github.io/doc/#assertj-core)

## @assertThatCode
- testing that no exception is thrown
- 어떤 exception도 던지지 않는 코드를 테스트할 수 있다.
```
// standard style
assertThatNoException().isThrownBy(() -> System.out.println("OK"));
// BDD style
thenNoException().isThrownBy(() -> System.out.println("OK"));
```

- 비슷하게 사용하기
```
// standard style
assertThatCode(() -> System.out.println("OK")).doesNotThrowAnyException();
// BDD style
thenCode(() -> System.out.println("OK")).doesNotThrowAnyException();
```
나는 주로 아래 방법을 사용한다.
