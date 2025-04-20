---
title: Github CODEOWNERS로 PR 리뷰어 자동 할당하기
date: 2023-07-15 13:09:51 +0900
updated: 2023-09-19 11:56:38 +0900
tags:
  - shook
  - github
  - 우테코
  - 레벨3
---

## CODEOWNERS?

매번 PR을 올릴 때마다 리뷰어를 넣어주는 게 귀찮다.    
그러니 리뷰어를 자동으로 등록해주는 `CODEOWNERS` 를 사용해보자!

### 등록하기

`docs/`, `.github/` 중 한 곳에 `CODEOWNER` 파일을 생성한 후, 리뷰어를 지정한다.    
우리는 `.github/` 하위에 생성했다.    

파일은 다음과 같다.

```text
# Frontend  
/frontend/ @Creative-Lee @ukkodeveloper @cruelladevil  
  
# Backend  
/backend/ @Cyma-s @splitCoding @somsom13 @seokhwan-an
```

shook 레포지토리는 frontend와 backend가 레포지토리를 공유하는 형태이다.    
우리는 소속된 파트의 모두의 approve를 받아야 PR을 머지할 수 있다는 규칙을 정했다.     
따라서 `/frontend/` 하위의 모든 파일들에 대해서는 프론트엔드 크루들을 지정하고, `/backend/` 하위의 모든 파일들에 대해서는 백엔드 크루들을 지정했다.    

### 사용해 본 결과 ...

각 파일 하위에 변경 사항이 추가되면 자동으로 코드 리뷰어가 추가 되어 훨씬 편하게 개발할 수 있었다. 추천합니다 👍