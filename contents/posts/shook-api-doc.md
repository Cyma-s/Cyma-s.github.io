---
title   : S-HOOK API docs
date    : 2023-08-01 21:45:20 +0900
updated : 2023-08-01 21:45:29 +0900
tags     : 
- shook
---

모든 API 는 `/api` prefix 와 함께 사용합니다.

## 노래 API

### 노래 ID로 노래 조회

**URL**
`/api/songs/{song_id}`

**Response**

- id: 노래 id
- title: 노래 제목
- singer: 가수 이름
- videoLength: 영상 길이
- songVideoUrl: 노래 영상 url
- killingParts

```json
{
	"id" : 1,   
	"title" : "Super Shy",    
	"singer" : "NewJeans",
	"videoLength" :200,
	"songVideoUrl" : "https://youtu.be/ArmDp-zijuc",
	"killingParts" : []
}
```
