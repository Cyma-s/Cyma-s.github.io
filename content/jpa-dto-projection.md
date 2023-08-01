---
title   : JPA의 DTO Projection
date    : 2023-07-31 21:24:59 +0900
updated : 2023-07-31 21:26:49 +0900
tags     : 
- jpa
- database
---

## interface projection 은 언제 써야 할까?

interface projection 은 다음과 같은 부분에서 이점을 갖습니다. 보통 가독성 측면의 장점이 많은 것 같아요.

단순합니다. (개인적으로 가장 장점이라 생각합니다) 원하는 필드에 해당하는 getter 메서드로 인터페이스를 선언하기만 하면 Spring Data 가 알아서 처리해줍니다.    

생성자가 필요없습니다. 그렇지만 이 부분은 lombok 을 쓰면 되니 class projection 에 비해 큰 장점이라고 하기는 어렵겠네요.    

현재 dto projection으로 가져오는 데이터가 단순한 평면 구조의 데이터이고, 클래스 내부에서 추가 가공이 이루어지지 않기 때문에 굳이 class projection 을 사용하지 않아도 될 듯 합니다.    
중첩된 DTO가 있는 복잡한 데이터 구조가 필요하거나, DTO 생성자에서 계산을 수행하는 경우에는 class projection이 좋은 선택이 될 수도 있다고 하네요.

## Class Projection 사용 시 주의 점

Class projection을 사용할 때, query 앞에 패키지 경로를 적지 않으면 작동을 하지 않습니다.    

```java
@Query("SELECT NEW shook.shook.song.domain.SongTotalVoteCountDto(s, COUNT(v)) ... ")
```

이런 식으로 query 내부에 패키지를 적어줘야 합니다.    