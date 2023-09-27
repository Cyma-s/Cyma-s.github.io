---
title   : S-HOOK Git Branch 전략
date    : 2023-07-05 11:23:21 +0900
updated : 2023-07-05 11:23:46 +0900
tags     : 
- shook
---

## Git Branch 전략

Git Flow 에서 release를 삭제한 전략을 사용하기로 했다.

![[shook-git-branch-strategy.png]]

- main
	- 배포 브랜치
- develop
	- 개발 총괄 브랜치
	- main 에서 파생되며, 하나의 완성된 기능 개발 후 main에 반영한다.
- feat/issue-number
	- issue 단위의 기능 개발 브랜치
	- develop 에서 파생되며, 단위 기능 개발 후 develop에 반영한다.
- fix/issue-number
	- issue 단위의 버그 수정 브랜치
	- develop 에서 파생되며, 버그 수정 후 develop에 반영한다.
- hotfix
	- main에 반영된 내용 중에 급하게 수정되어야 할 버그 수정 브랜치
	- main 에서 파생되며, 버그 수정 후 main에 반영한다.

### 현재 release를 사용하지 않는 이유

현재 개발 서버가 존재하지 않는 상황에서 유의미한 QA가 불가능하다고 생각했습니다.    
이후 개발 서버가 필요해지고, 세팅이 완료된 후에 release 브랜치를 고려해볼 예정입니다.