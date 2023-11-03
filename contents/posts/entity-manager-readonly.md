---
title: EntityManager 의 readonly
date: 2023-11-03 13:58:59 +0900
updated: 2023-11-03 14:02:12 +0900
tags: 
---

## 주의

entitymanager 의 flush mode 는 `COMMIT` 으로 설정되지만, 실제로 insert, update, delete 가 발생하는 경우 예외를 던진다.