---
title: shook hikari
date: 2023-10-16 15:51:13 +0900
updated: 2023-10-17 17:49:18 +0900
tags: 
---

- `connectionTimeout`
	- 사용자 경험을 생각했을 때 5000ms (5초)
	- 보통 사용자들은 안 나오면 새로고침을 한다.
- `idleTimeout`
	- 기본값 => 그렇지만 `minimumIdle` 과 `maximumPoolSize` 가 같아서 아무런 영향을 주지 않는다.
- `keepaliveTime`: 비활성화 0
- `maximumPoolSize`: 기본값 + 변경될 값 차이 => 부하테스트
	- 캐싱을 적용한 상태에서 DB 접근 시간이 있는 쿼리를 부하테스트
- `minimumIdle`: maximumPoolSize 와 동일
- `maxLifetime`: 기본값 30분 (근거 없어서)

==mysql 권장 설정==

```properties
dataSource.cachePrepStmts=true
dataSource.prepStmtCacheSize=250
dataSource.prepStmtCacheSqlLimit=2048
dataSource.useServerPrepStmts=true
dataSource.useLocalSessionState=true
dataSource.rewriteBatchedStatements=true
dataSource.cacheResultSetMetadata=true
dataSource.cacheServerConfiguration=true
dataSource.elideSetAutoCommits=true
dataSource.maintainTimeStats=false
```

## DB 에 쿼리가 가는 요청

- `/members/{member_id}` : 0
- `/reissue`: 0
- `/login/{oauthType}`: 607
- `/my-page`: 753
- `/songs/{song_id}/parts/{killing_part_id}/likes`: 175
- `/songs/{song_id}/parts/{killing_part_id}/comments`: 56 + alpha
- `/voting-songs/{voting_song_id}/parts` : 100

=> 1800
