---
title   : Github merge 전략
date    : 2023-07-15 13:52:24 +0900
updated : 2023-07-15 13:52:44 +0900
tags     : 
- shook
- 레벨3
- github
- 우테코
---

브랜치에서 작업한 내용을 다른 브랜치에 병합할 수 있는 방법은 다양하다.    
그 중 Merge commit, Squash and Merge, Rebase and Merge 에 대해 알아보자. 

## Merge commit

Github의 기본 merge 전략이다.   
코드가 변경된 시기와 위치를 포함하여 코드의 전체 기록을 유지하려는 경우에 유용하다.    
비파괴 작업으로, 모든 커밋의 기록을 그대로 유지한다. merge 작업을 포함한 모든 변경 사항에 대한 기록을 남긴다.    

Commit log는 커밋을 행한 순서대로 기록되고, Merge log는 merge가 된 순서대로 기록된다.    
즉, commit log의 순서가 merge 순서와 다를 수 있다. 

### 예시

commit 시간 순서: A - B - AC - BD      
A 브랜치 commit 순서: A - AC     
B 브랜치 commit 순서: B - BD      

B 브랜치가 A 브랜치보다 main에 merge가 먼저 된 경우, main의 commit log는 다음과 같다.

A - B - AC - BD - B merge commit - A merge commit

### 단점

여러 분기가 자주 병합되는 경우, Git history 가 복잡해질 수 있다.    

## Squash and Merge

합쳐지는 브랜치의 모든 커밋이 merge 대상 브랜치 (main) 의 하나의 커밋으로 결합된다.    
스쿼시된 커밋의 커밋 메시지는 기본적으로 스쿼시된 모든 커밋의 커밋 메시지 조합이 되지만, 수동으로 변경할 수 있다.    

기능 당 하나의 커밋으로 main 의 commit log를 선형적이고 깨끗하게 유지하려는 경우 (히스토리 관리가 쉽다), feature 브랜치의 개별 커밋의 세부 정보가 유지 관리에 중요하지 않은 경우에 사용하면 좋다.    

### 예시

commit 시간 순서: A - B - AC - BD   
A 브랜치 commit 순서: A - AC   
B 브랜치 commit 순서: B - BD    

B 브랜치가 A 브랜치보다 main에 merge가 먼저 된 경우, main의 commit log는 다음과 같다.

`<main>` 
B squashed commit(B-BD 커밋 메시지) - A squashed commit(A-AC 커밋 메시지)

### 단점

자세한 커밋 기록이 사라지게 된다.    
개별 커밋을 보존하는 것이 프로젝트 기록에 중요한 경우 Squash and Merge가 올바른 선택이 아닐 수 있다.    

또한 여러 작성자가 기능에 기여한 경우, 모든 커밋을 하나로 스쿼시하면 해당 정보가 손실된다.    

atomic commit level로 rollback 이 불가능하다.    

## Rebase and Merge

commit 순서가 아닌, merge 순서대로 기록되므로 하나의 PR에 담긴 commit message 가 다른 PR의 commit message 와 섞이지 않는다.    

rebase 를 사용하므로 merge 된 이후의 로그를 보았을 때, main에서 연속적으로 작업한 것과 같은 로그를 확인할 수 있다. 따라서 언제든지 atomic commit level 로 rollback 을 수행할 수 있다.    

### 예시

commit 시간 순서: A - B - AC - BD      
A 브랜치 commit 순서: A - AC     
B 브랜치 commit 순서: B - BD     

B 브랜치가 A 브랜치보다 main에 merge가 먼저 된 경우, main의 commit log는 다음과 같다.

`<main>` 
B - BD - A - AC

### 단점

rebase 를 사용하면 특정 커밋의 부모 커밋을 바꿔서 커밋이 새로운 시점에서 시작된 것처럼 보이게 만든다.     

feature 브랜치에서 작업 중인 다른 개발자가 작업하는 경우에도 문제가 될 수 있다. feature의 로컬 복사본이 리베이스 후 원격 레포지토리와 동기화되지 않기 때문이다.    
로컬 브랜치와 원격 브랜치가 동일한 시점에서 시작하지 않기 때문에, Git이 local의 push를 거부하게 된다. push를 위해서는 로컬 브랜치를 원격 브랜치와 동기화하거나, force push를 수행해야 할 수도 있다.    

rebase를 시작하기 전에 원격 레포지토리와 제대로 동기화가 되지 않은 경우, 커밋이 손실될 수 있다.    
그러므로 rebase는 개인 local의 브랜치의 정리를 위해 사용하거나, 작업을 main 브랜치 또는 다른 브랜치에 merge 하기 전에 사용하는 것을 권장된다.    

### 결론?

상황에 따라 사용해야 할 듯 하다.    
우리는 Github Flow 로 진행하고 있기 때문에, main 에 커밋이 다 쌓이면 지저분할 것 같아서 Squash merge 전략을 사용하고 있다.     

## Conflict 해결하기

프로젝트를 진행하다보면 같은 파일을 수정하는 경우가 발생할 수 있다.    
가장 베스트는 그런 일이 일어나지 않는 것이지만, 작업 분할이 항상 완벽하게 이루어지지는 않는다.    
그런 경우에는 다른 작업자와의 conflict를 해결해야만 한다.    

어떤 방법이 있을까?

### 상황 가정

(여기서부터는 존댓말로 작성합니다)

**실제로 있었던 일임을 밝힙니다.**

체모 크루, 주모 크루와 함께 작업을 했을 때의 일입니다. 애석하게도 일정의 압박으로 각자 기능을 시작할 수 밖에 없었기에 각자 다른 시점에 개발을 시작했습니다.    

'체'는 A 기능을 만들고 있었고, '주'는 B 기능을 만들고 있었습니다.     
저는 C 기능을 개발하던 중, A와 B의 기능이 필요하다는 것을 알게 되었습니다.    
일단 개발한 기능을 원격에 push 한 후, 체와 주의 기능 merge를 기다렸습니다.    

모든 기능이 merge되고 dev를 pull 하는 순간, 무수한 conflict와 무수한 파일 add 가 생성된 것을 보고 이것은 뭔가 잘못됐다고 느꼈습니다.    

제 작업 브랜치가 원격 브랜치와 동기화되지 않아, pull을 하는 순간 git이 모두 새로운 파일이라 판단한 것입니다.

저는 로컬 C 브랜치에 dev를 rebase 한 후, 원격 C 브랜치에 force push 하는 방식으로 해결했지만 다른 방법도 있습니다.    

### Cherry Pick

A와 B가 반영된 원격 dev 브랜치에서 새로운 new_dev 브랜치를 생성한 후, 체크아웃합니다.    
그 후, C 브랜치에서 제가 작업했던 내용을 cherry pick 합니다. (rebase와 마찬가지로 conflict는 해결해야 합니다. )    

이미 원격 저장소에는 C 브랜치가 존재하지만, new_dev 브랜치를 원격에 push한 후, 'new_dev'를 main에 머지합니다.     

C 브랜치가 아니라는 점이 걸리기는 하지만, force push를 하지 않는다는 점에서 장점을 갖고 있습니다.    

GPT의 답변은 다음과 같았습니다.    

```text
체리 피킹은 일반적으로 한 브랜치에서 다른 브랜치로 적은 수의 커밋을 통합하는 데 사용됩니다. 더 큰 선택성과 제어가 가능하지만 커밋이 많으면 번거로울 수 있습니다.

반면 리베이스는 한 브랜치의 모든 변경 사항을 다른 브랜치로 통합하려는 경우에 자주 사용됩니다. 브랜치에 일련의 커밋이 있고 선형 방식으로 메인 브랜치에 통합하려는 상황에 더 적합합니다.
```

커밋이 적은 경우에만 Cherry Pick을 사용하고, 브랜치의 모든 변경 사항을 다른 브랜치로 통합하는 경우에는 rebase가 더 적합한 듯 합니다.     

역시 상황에 따라 맞게 사용하는 것이 좋아보이네요.     

## 참고
- https://inmoonlight.github.io/2021/07/11/Git-merge-strategy/
- https://chat.openai.com/share/d8d773a5-8ccc-4366-9735-cd8fdbb89b3b