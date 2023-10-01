---
title   : matzip에서 발생한 issue 정리
date    : 2023-05-15 16:08:15 +0900
updated : 2023-05-15 16:08:37 +0900
tags     : 
- 우테코
- matzip
- issue
---

## cloudfront의 image 링크를 열면 이미지 열기가 아니라 파일을 다운로드하는 문제

MIME 유형을 지정해 주지 않아 발생한 문제였다. -> [[mime]]

## 로컬 환경에서 로컬 프로필이 적용되지 않는 문제

여러 개의 active가 설정되어 있어 발생한 문제였다. -> [[spring-multi-profile-issue|Spring Profile 적용 순서]]