---
title: Obsidian Plugin 추천
date: 2023-09-19 12:44:41 +0900
updated: 2023-09-19 13:26:21 +0900
tags:
  - obsidian
---

옵시디언 플러그인 팔러 왔습니다.  
혹시 옵시디언을 사용하시는 분들은 유용하게 사용하실 수 있는 플러그인들을 엄선해서 글을 작성했으니, 유용한 플러그인 얻어가시길 바랍니다.  
옵시디언을 아직 안 써보신 분들은 이렇게 다양한 플러그인들이 있으니... 옵시디언에 관심 주시면 감사하겠습니다 ㅋㅅㅋ

## 간단하게 커뮤니티 플러그인 사용하는 법

설정 - 커뮤니티 플러그인으로 들어가서 커뮤니티 플러그인 사용을 누른다.  


![[obsidian-how-to-plugin.png]]

그럼 다음과 같이 커뮤니티 플러그인을 탐색할 수 있는 버튼이 생긴다.  
이 글에서 소개하는 커뮤니티 플러그인들은 모두 탐색에서 이름으로 검색할 수 있다.  


![[obsidian-community-plugin.png]]

## 사실상 필수 플러그인

## Omnisearch

노션과 옵시디언 같은 플러그인의 고질적인 문제점인 **내용 검색** 을 해결해주는 플러그인이다.  

단축키를 등록해서 검색하면 내용과 제목을 포함해서 빠르게 검색 가능하다!! 삶의 질을 올려주는 정말 훌륭한 플러그인이다.

![[omnisearch.png]]

## Style Settings

테마를 사용하다보면 테마를 커스텀하는 기능을 제공하는 테마들이 존재한다.  
테마 커스텀을 위해서는 반드시 설치해야 하는 플러그인이다.  

사용하는 테마를 선택해서 내부 상세 설정들을 변경해줄 수 있다. 이 부분은 테마마다 굉장히 상이한 부분이므로 넘어가도록 하겠다.  

![[obsidian-style-settings.png]]

## Templater

매일 비슷한 포맷으로 글을 쓰거나, TIL 을 쓰는데 매번 템플릿 복사하는 게 너무 귀찮은 분들을 위한 플러그인.

![[obsidian-templater-location.png]]

`Automatic jump to cursor` 를 사용하면 템플릿 삽입 후 파일의 마지막 커서 위치로 이동할 수 있게 해준다. 필수로 체크해주면 좋다.  

특히 단축키 cmd + N 을 templater create new note 에 연결해두면 정말 편하게 사용할 수 있다.  

![[obsidian-templater-shortcut.png]]

![[obsidian-templater-template-choose.png]]

create new note from template 을 실행하면 템플릿을 선택할 수 있다.  
선택하면 해당 템플릿으로 자동으로 파일을 만들어 준다.

![[obsidian-templater-new-file.png]]

개인적으로 TIL 의 frontmatter, template 의 frontmatter 를 자동으로 설정해주기 위해 사용한다.  

## 추천하는 플러그인

## Obsidian Git

깃허브 블로그를 운영하고 있는 분이시라면 매번 바뀐 파일들을 커밋하기 너무 귀찮으셨을 것이다.  
Obsidian Git 은 시간 주기마다 주기적으로 커밋해주는 플러그인이다. 

개인적으로 커밋은 3시간 단위로 커밋하고, 푸시는 혹시 모르니 수동으로 할 수 있도록 변경해두었다.  

![[obsidian-git-commit-message.png]]
커밋 메시지를 지정해서 변경된 파일과 날짜, 파일 개수 등을 표시해줄 수도 있다.

## Icon Folder

밋밋한 파일들이 보기 싫으셨다면? Icon Folder 로 폴더 / 파일 아이콘을 추가할 수 있다.  
상위 폴더에 icon inherit 을 설정해서 하위 폴더 / 파일에 icon 이 상속되도록 설정해줄 수도 있다.  

![[obsidian-icon-folder.png]]

## Update time on edit

frontmatter 의 문서 생성 시각, 문서 업데이트 시각을 매번 업데이트 해주는 것은 너무너무너무너무너무 귀찮은 작업이다.  
이것도 자동화 할 수 있다. 

![[obsidian-date-format.png]]

date format 은 업데이트되는 시간의 형식을 정해줄 수 있다. 사진의 `date-fns documentation` 링크를 확인하면 어떻게 설정할 수 있는지 자세하게 확인할 수 있다.  

updated at 에는 frontmatter 에 저장되는 업데이트 시간 속성 이름을 입력해주면 된다. 나는 속성 이름이 updated 이기 때문에 위와 같이 작성했다.
created at 에는 frontmatter 에 저장되는 생성 시간 속성 이름을 입력한다.  

이렇게 설정하고 나서는 문서가 업데이트 될 때마다 분 단위로 updated 속성이 변경되며, 문서가 생성될 때 date 속성의 값이 초기화될 것이다.  

## Calender

TIL 을 작성했지만 노션처럼 캘린더 뷰가 없어서 아쉬우셨던 분들을 위한 플러그인.
오른쪽 탭에 달력이 나오고, 날짜를 누르면 해당 TIL 로 이동할 수 있게 해주는 플러그인이다.  

![[obsidian-calendar.png]]

세부 설정은 위처럼 할 수 있다. 플러그인 **Natural Language Dates** 와 사용하면 좋다.  

아래처럼 Date format 을 사용하면, TIL 파일의 이름을 가지고 캘린더가 인식하게 바꿀 수 있다.  

![[obsidian-natural-language-dates.png]]

이런 식으로 TIL 을 작성한 날짜들을 볼 수 있다. (군데군데 비어있는 건 넘어가주세요)

![[obsidian-calendar-view.png]]

## Outliner

IntelliJ 단축키 opt + 화살표 로 코드를 이동하는 데 익숙하셨던 분들에게 추천하는 플러그인이다.  
이 플러그인을 사용하면 리스트나 체크박스에 커서를 두고 shift + cmd + 위/아래 화살표 로 리스트와 체크박스를 위 아래로 이동할 수 있다!! 의외로 편한 기능이다.

Stick 설정은 한 번에 줄을 지울 때 체크박스나 리스트를 지울 것인지 선택하는 것이다. 개인적으로 한 번에 줄 지우는 것을 좋아해서 Never 로 설정해두었다.  

![[obsidian-outliner-setting.png]]
## Admonition

옵시디언의 밋밋한 콜아웃, 인용이 아쉬우셨다면 Admonition 을 추천한다.  

코드 블럭에 `ad-` prefix 를 붙이면 어떤 것들을 지원하는지 알려주는 자동완성이 나타난다. 

![[obsidian-admonition-prefix.png]]

예시로 몇 가지를 사용해보았다. 이전보다 훨씬 깔끔하다!

![[obsidian-callout.png]]

추가적인 세팅은 플러그인 세팅에서 세부적으로 정할 수 있다.

## 마무리

옵시디언 플러그인 문의가 너무 많아... 글을 작성해보았습니다.  
이 글이 옵시디언 플러그인을 찾아 헤메는 사람들에게 도움이 되기를 바랍니다 :)
주기적으로 추가될 수도 있습니다 ㅋㅋ