---
title   : 슉 기획
date    : 2023-06-27 20:26:35 +0900
updated : 2023-06-27 20:27:08 +0900
tags     : 
- shook
- 우테코
- 레벨3
---

## 개발 컨벤션 좋아보이는 거 모음

### Issue 템플릿

- 버그 이슈 템플릿

```markdown
## 🤷 버그 내용

## ⚠ 버그 재현 방법
1.
2.
3.

## 📸 스크린샷

## 👄 참고 사항

by dallog
```

```markdown
## 버그 기능
- 페이지나 기능을 적습니다.

### 버그 상황 재연
- 어떤 상황에서 버그가 발생하는지 적습니다.

### 기대 동작
- 원래 기대하던 정상 동작에 대해 작성합니다.

### 현재 동작
- 기대하던 동작에 반해 지금 문제가 되는 동작을 작성합니다.

by zzimkkong
```

```markdown
### QA 환경 : 

### 현상: 

### 재현 과정 : 

### 예상되는 원인: 

### 스크린샷:

by jujeol-jujeol
```

- 피쳐 이슈 템플릿

```markdown
## 🤷 구현할 기능

## 🔨 상세 작업 내용

- [ ] To-do 1
- [ ] To-do 2
- [ ] To-do 3

## 📄 참고 사항

## ⏰ 예상 소요 기간

by dallog
```

```markdown
[FE | BE] 명사형으로 작성
### 설명

### 진행상황
- [ ] 진행사항1
- [ ] 진행사항2

### 주의사항

by jujeol-jujeol
```

### PR 템플릿

```markdown
## 작업 내용

## 스크린샷

## 주의사항

Closes #{이슈 번호}

by dallog
```

```markdown
## 구현 기능
- 구현한 기능을 적습니다.

## 논의하고 싶은 내용
- 논의할 내용을 적습니다.

## 공유하고 싶은 내용
- 학습한 내용, 공유할 내용 등을 적습니다.
- 위키에 작성했다면 링크 첨부, 없는 경우 삭제

## 기타
- 기타 추가할 내용이 있다면 추가합니다.
- 없는 경우 삭제

Close #이슈번호

by zzimkkong
```

```markdown
## resolve #issue number

### 설명
- 프론트의 경우 화면 작업일 때 캡쳐본 포함하기

### 기타

by jujeol-jujeol
```

- RCA 룰 by 주노
	- 각각의 코멘트의 접두에 R, C, A를 붙이면서 리뷰를 진행하는 방식이다.
	- `R (Request Changes)` : 적극적으로 반영을 고려해주세요
	- `C (Comment)` : 웬만하면 반영해주세요
	- `A (Approve)` : 반영해도 좋고, 넘어가도 좋습니다. 사소한 의견입니다.

- reviewer가 1명 이상 approve 하지 않았을 경우에는 merge block 하기

### 코드 컨벤션

- zzimkkong BE 코드 컨벤션 : https://xrabcde.notion.site/5cd0851364254f1db103607efa414a8d

