---
title   : maniaDB 정리 문서
date    : 2023-07-26 16:05:36 +0900
updated : 2023-07-26 16:05:57 +0900
tags     : 
- shook
- 레벨3
- 우테코
---

## Search API v0.5

### Request 

- url: `http://www.maniadb.com/api/search/[keyword]/?sr=[artist|album|song]&display=[1~100]&key=[apikey]&v=[version]`

- 노래 이름 검색: `http://www.maniadb.com/api/search/노래이름검색어/?sr=song&display=데이터개수&key=example&v=0.5`
	- 노래 이름 검색은 검색어가 포함된 노래를 전부 리턴하는 듯
	- 가수 이름으로도 노래를 검색할 수 있다. 다만 가수 이름에 검색어만 포함되어 있으면 전부 리턴하는 것 같음.

- 데이터 개수는 1부터 100까지 가능하다. 페이지네이션은 존재하지 않고, 최대 100개의 데이터만 가져올 수 있다.

api key 는 추후 변경 가능하다. 기존에는 이메일 validation check를 했었으나, 현재는 하고 있지 않다고 한다.

### Response

XML 로 이루어져 있다.

#### 노래 검색
- item: 검색된 결과 
	- title: 노래 이름
	- runningtime: 곡 길이 (없는 값도 존재한다)
	- maniadb:album
		- title: 앨범 이름
		- image: 앨범 이미지
	- maniadb:trackartists
		- maniadb:artist
			- name: 가수 이름
