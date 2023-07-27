---
title   : Spring에서 외부 API XML Response 파싱하기
date    : 2023-07-26 23:27:52 +0900
updated : 2023-07-26 23:28:16 +0900
tags     : 
- spring
- shook
- 레벨3
- 우테코
---

## 발단

S-HOOK의 검색 기능을 구현하면서, 많은 노래를 검색할 수 있어야 하는 기능이 필요해졌다.    
그래서 maniaDB의 API 를 사용해서 가수 이름, 노래 이름으로 조회하는 검색 API 를 추가하기로 했다. 

그런데 maniaDB의 search API 는 리턴되는 Response가 XML이다... 그렇기 때문에 기존에 우리가 사용하던 JSON DTO의 방식을 그대로 사용할 수가 없다. 

Spring 에서 XML 을 파싱하는 방법에 대해 알아보자.

## 

## 참고

- [GPT와 나눈 대화](https://chat.openai.com/share/7a487192-168b-4d19-b8d8-5689a40f177e)