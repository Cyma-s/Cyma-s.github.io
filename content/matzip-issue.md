---
title   : matzip issue 정리
date    : 2023-05-15 16:08:15 +0900
updated : 2023-05-15 16:08:37 +0900
tags     : 
- 우테코
- matzip
- issue
---

## 동기 , 비동기 스레드에 대해 graceful shutdown을 적용한다

- graceful shutdown이 왜 적용돼야 할까?
- graceful shutdown을 적용하기 위해 gradle을 추가해야 할 것 같은데 어디 gradle에 추가해야 하는가?
- 모든 모듈을 shutdown 해야 하는걸까?
- 지금은 shutdown을 어떻게 하고 있나?

[Issue 링크](https://github.com/The-Fellowship-of-the-matzip/mat.zip-back/issues/139)

## Submodule을 적용한다.