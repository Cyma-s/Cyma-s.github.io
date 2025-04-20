---
title: S-HOOK 도메인 모델 파악하기
date: 2023-12-08 20:26:43 +0900
updated: 2024-02-01 13:39:08 +0900
tags:
  - 도메인-주도-개발-시작하기
---

## 애그리거트

- Song
    - Artist
        - ArtistName
        - ArtistSynonym
        - ProfileImageUrl
    - AlbumCoverUrl
    - Genre
    - SongLength
    - SongTitle
    - SongVideoId
- Part
    - song_id
    - PartLength
    - StartLength
    - count
- KillingPart
    - part_id
- MemberPart
    - part_id
    - member_id
- Member
    - Email
    - Nickname
- KillingPartLike
    - part_id
- KillingPartComment
- Synonym
    - type
        - Song, Artist
    - value
    - target_id (Long)

## 주요 기능

### Song

- id
- SongTitle title
- SongVideoId video_id
- AlbumCoverUrl albumCoverUrl
- Artist artist
    
    ### Artist
    - id 아티스트 아이디
    - ProfileImageUrl 프로필 이미지 링크
    - ArtistName 아티스트 이름
    - createdAt
    - 기능
        - 아티스트를 통해 노래를 조회한다.
- SongLength length
- Genre genre
- createdAt
- **score ← 전체 PartCount 를 합한 값**
- 기능
    - 생성
        - 생성 정보: title, video_id, image_url, artist_id, length, genre
        - artist_id 로 Artist가 존재하는지 확인
        - Song 생성 후 저장
    - 좋아요 많은 순 정렬된 노래 조회
        - score 순으로 10 개
    - 스와이프 노래 조회

### Part

- **PartLength** length 파트 길이
    - 5~15초 사이여야 한다.
- Long song_id 노래 아이디
    - null check
    - 노래의 킬링파트 개수 제한은 제거한다.
- StartSecond startSecond 시작 초
    - int startSecondValue, int songLength, int partLength 받아서 비교하는 생성자 필요
        - 시작 초에 파트 길이를 더했을 때 노래 길이를 넘는지 확인한다.
- count 파트 등록 횟수. 기본값은 0
- 노래 아이디 + 파트 길이 + 시작 초의 조합은 유니크해야 함.

### Member

**한 멤버가 한 노래당 하나의 MemberPart 만 등록할 수 있다.**

- Identifier
- Nickname
- 기능
    - 닉네임 변경 API
    - 소셜 로그인 시 회원 가입이 필요한 회원의 경우 닉네임을 받아야 할까? 논의 해보기
    - **Member 가 삭제될 때 (NEW)**
        - PartLog, PartComment, PartLike 를 삭제하는 이벤트 발행 (비동기)

해당 part_id를 갖는 MemberPart 가 0개이면 Part 는 삭제된다.

MemberPart 가 생성되었을 때, Part 가 없으면 Part 를 생성한다.
                          있으면 Part 의 count 를 1 증가시킨다.

MemberPart 가 삭제될 때, Part 의 count 를 1 감소시킨다.
Part 의 count 가 0이 되면, Part 는 삭제된다.

### PartLog (MemberPart)

- Long song_id
- Long part_id
- Long member_id
- 기능
    - 생성
        - 이 노래에 MemberPart 를 등록한 적이 있는지 확인
        - Part 의 count 증가 (이벤트)
    - 조회

**MemberPart 와 Part 가 같은 애그리거트일 때 → 이게 맞는 거 같긴 함**

- MemberPart 가 등록될 때
    - 등록 정보 : member_id, song_id, startSecond, PartLength
    - member_id, song_id 로 이미 이 노래에 MemberPart 를 등록했는지 검사
    - startSecond, song_id, PartLength 해당 정보를 갖는 Part 가 있는지 확인한다.
        - Part 가 없으면 Part 를 생성하고, MemberPart 를 생성한다. Part 의 count 를 증가한다.
        - Part 가 있으면 해당 part_id 로 MemberPart 를 생성하고, 이벤트를 통해 Part 의 count 를 증가시킨다.

**다른 애그리거트일 때**

- MemberPart 가 등록될 때
    - 등록 정보 : member_id, song_id, startSecond, PartLength
    - member_id, song_id 로 이미 이 노래에 MemberPart 를 등록했는지 검사
    - startSecond, song_id, PartLength 해당 정보를 갖는 Part 가 있는지 확인한다.
        - Part 가 있으면 해당 part_id 로 MemberPart 를 생성하고, 이벤트를 통해 Part 의 count 를 증가시킨다.
        - Part 가 없으면, Part 를 생성하고, MemberPart 를 생성하고, 이벤트를 통해 Part 의 count 를 증가시킨다.

### PartLike

- id
- is_deleted
- part_id
- member_id
- created_at
- updated_at
- 기능
    - 생성
        - 등록 정보: is_deleted, part_id, member_id
        - part가 존재하는지 확인
        - 좋아요 생성 요청인가?
            - 생성요청임
                - 해당 정보로 Like 가 존재하는지 확인 → 존재하면 가져오고, 없으면 KillingPartLike 생성
                - 기존 KillingPartLike 가 삭제되었으면 true 로 변경
                    - InMemory like → Part 의 count 올리는 이벤트로 대체 가능
                    - likeRepository pressLike
            - 삭제 요청임
                - 해당 정보로 Like 존재하는지 확인
                - 존재하면
                    - InMemory unlike → Part 의 count 내리는 이벤트로 대체 가능
                    - likeRepository cancelLike
    - 특정 멤버가 좋아요한 파트 정보를 조회한다.
        - 조회 정보: member_id
        - 이 멤버가 좋아요한 KillingPartLike, Song, Part 정보를 repository 에서 조회
        - 최신 등록 순 정렬

### PartComment

- id
- PartCommentContent content
- part_id
- member_id
- created_at
- 기능
    - 등록
        - 등록 정보: member_id, part_id, content
        - part_id 로 Part 조회
            - 존재하면 PartComment 생성
    - 조회
        - 조회 정보: part_id
        - part_id 로 PartCommentRepository 에서 최신순으로 쿼리

### Synonym

- id
- target_id
    - song_id
    - artist_id
- Enum type
- value
- 기능
    - **Admin 을 위한 Synonym 생성**
    - 조회
        - 조회 정보: type, keyword
        - type 으로 어떤 Repository 를 선택할 지 결정
            - artist
                1. keyword 로 ArtistRepository 조회 → `List<Artist>`
                2. keyword 로 SynonymRepository type, keyword로 조회 → `List<SynonymArtistDto>`
                    - Artist, Synonym
                3. 중복 결과 제거 후 `List<Artist>` 반환

## 질문들

### Part

- Part 는 얼마나 보여줄 것인가?
    - KillingPart 와 Part 는 무슨 차이가 있는가?
        - KillingPart 를 선정하는 기준이 만약 점수라면, 굳이 업데이트가 잦을 KillingPart 가 존재할 필요가 있는가?
- 좋아요와 중복 Part 등록의 점수를 다르게 할 것인가?
- Part 를 구분하는 기준을 시간 초로 잡는 건 어떤가?
    - 2초 ~ 10초, 2초 ~ 11초, 2초 ~ 8초
    - 이 경우라면 MemberPart 가 PartLength 를 가져야 한다.
    - 시작초: 2초, 파트 길이를 ???
    - **파트 길이를 구하는 방식**
        - 시작초가 같은 모든 파트 길이의 합을 평균낸다.
        - 시작초가 같은 파트 길이 중에 최댓값으로 정한다.
            - startSecond + PartLength
                - startSecond 만 유니크하다.
                - PartLength:PartLength 의 개수를 Map 으로 갖고 있다.
            - Part 가 startSecond 만 갖고, MemberPart 가 PartLength 를 갖는다.
                - Part 는 startSecond 만 유니크하고, MemberPart 는 part_id 를 가짐으로써 나중에 Part 를 조회하게 될 때 Memberpart 를 취합해서 가장 최대 길이인 것을 함께 조회
        - 시작초를 필수로 하고, 파트 길이를 정하는 것을 사용자에게 선택 사항으로 주기 ⇒ 사용자의 의견이 실제로 킬링파트 합산에 기여를 하고 있다는 느낌을 줄 수 있지 않을까
    
    **⇒ 파트를 어떻게 정렬해서 KillingPart 를 보여줄까?**

### Member

- Member 가 부정 행위를 한 경우, 제재를 할 수 있는 수단이 없다.
- Member 생성 시 닉네임을 입력하게 할 것인가?

### MemberPart

- Member 는 곡 하나 당 MemberPart 하나만 만들 수 있는가?
- MemberPart 는 여전히 나한테만 보이는 Part 인가?
- MemberPart 이름 변경 필요 혼란스러움.
- song_id 가지고 있을 것인가?
    - 노래 하나당 한 번만 등록할 수 있다면 어떻게 그것을 DB에서 판별할 것인가?
    - song_id 없으면 조인 해야 함.

### KillingPartLike

- Member 를 ArgumentResolver 에서 파싱해서 주면 어떨까
- LikeRepository 메서드 변경 의견
    - pressLike → like
    - cancelLike → unlike

### Song

- Song 은 Part 없이 만들어질 수 있는가?
- Song 에 score 라는 반정규화 컬럼을 추가할 것인가? (성능 이슈 때문에)
    - **전체 PartCount 를 합한 값을 저장한다.**
    - 어떻게 정렬 기준을 정할 것인가?
- 좋아요 / 파트 등록 / 취소가 될 때마다 Song 에 score 를 증가/감소 시키는 이벤트 발행이 필요
- 좋아요 순 노래 조회 시, Repository 에서 Part 가 포함되는 경우, 양방향 의존을 갖게 되는 문제가 있다.
- Genre 와 Song 은 다대다 아닌가?

### Artist

- Song 과 다대다인가?
- Song 애그리거트와 분리해야 하는가? → 일단 분리 안 하는 것으로 결론
- (같은 애그리거트인 경우) 양방향 관계를 가질 경우 중간 테이블을 두거나 해서 노래 중복 데이터를 없애야 함.

### 기타

- Synonym 추가를 위한 Admin 페이지 개발
- 이벤트 재시도 로직을 어떻게 구현할 것인가
    - 이벤트 큐 - kafka
    - 재시도 로직 직접 구현
