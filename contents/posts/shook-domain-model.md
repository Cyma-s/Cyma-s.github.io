---
title: S-HOOK 도메인 모델 파악하기
date: 2023-12-08 20:26:43 +0900
updated: 2024-01-15 23:09:39 +0900
tags:
  - 도메인-주도-개발-시작하기
---

## Song

생성과 동시에 `SongTitle`, `SongVideoId`, `AlbumCoverUrl`, `Artist`, `SongLength`, `KillingParts`, `Genre` 가 정해진다.  

### KillingParts

현재 `Song` 을 `@OneToMany` 로 갖고 있음.  

### KillingPart

`Song` 을 `@ManyToOne` 으로 갖고 있음. `KillingPart` 생성 시에 `Song` 정보가 입력됨. 

- `KillingPartComments` 는 `KillingPart` 와 생명주기를 같이 하지는 않지만, `KillingPart` 가 삭제될 때는 함께 제거됨. 
- `KillingPartLikes` 는 `KillingPart` 와 동시에 생성되지는 않지만, `KillingPart` 가 삭제될 때는 함께 제거됨. 

## Member

- shook 에 memberId 를 붙여서 닉네임을 생성한다.

