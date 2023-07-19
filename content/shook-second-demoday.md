---
title   : 2차 데모데이 자료 준비
date    : 2023-07-19 16:49:11 +0900
updated : 2023-07-19 16:49:31 +0900
tags     : 
- shook
- 데모데이
- 레벨3
- 우테코
---

## Git Branch 전략 재확립

- Git Flow 에서 Github Flow로 변경하였다.
- 이전 Branch 전략
```mermaid
---
title : S-HOOK Git diagram
---
%%{init: { 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel': false } } }%%
gitGraph
commit
branch feature
checkout feature
commit
commit
commit
checkout main
merge feature
branch hotfix
commit
commit
checkout main
merge hotfix
```

![[current-shook-git-branch-strategy.png]]

- 현재 Branch 전략

```mermaid
---
title : S-HOOK Git diagram
---
%%{init: { 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel': false } } }%%
gitGraph
commit
branch develop order: 2
commit
commit
checkout main
merge develop
branch hotfix order: 1
commit
checkout main
merge hotfix
checkout develop
merge hotfix
branch feature order: 3
commit
commit
commit
checkout develop
merge feature
checkout main
checkout develop
branch fix order: 4
commit
checkout develop
merge fix
checkout main
merge develop
```

![[prev-shook-git-branch-strategy.png]]

- 전략 재확립 이유
	- 현재 프로젝트 상황에서는 단순한 Github Flow가 관리가 더 용이하다.
	- 모든 개발 내용이 main으로 중심으로 이루어져서, develop, main의 싱크를 신경쓰지 않아도 된다.
	- 웹 서비스이므로 버전을 관리할 필요가 없다고 판단했다.
	- 브랜치가 파생될 수 있는 곳이 main 밖에 없어 충돌 가능성이 적다.