---
title   : 블랙잭 미션
date    : 2023-03-02 00:01:45 +0900
updated : 2023-03-07 12:23:15 +0900
tags     : 
- 레벨1
- 우테코
---
## 페어
- 페어는 헤나였다.
- 헤나와 처음 만나고 나서 약 40분간 아이스 브레이킹 시간을 가졌다.

### 페어와 정한 규칙
- 20분마다 교대했다.
- 모르는 것은 바로바로 물어본다.
- 페어가 멍 때리면 괜찮냐고 물어본다.
- 페어가 마음 상할까 봐 하고 싶은 말을 숨기지 않는다.

### 페어와 프로그래밍 할 때 규칙
- 요구사항 분석 후에 클래스 간의 관계를 그림으로 그리면서 구현했다.
- 테스트 코드 메서드 이름을 카멜 케이스로 작성했다. ```throwExceptionWhenCardDuplicated()```, ```create()```
- 에러 메시지는 매직 스트링을 사용했다.
- 클래스와 클래스 필드 사이에 띄어쓰기 하지 않는다.
- 테스트 코드 클래스 선언 아래에 띄어쓰기 하지 않는다.
- TDD 할 때 실패하는 테스트 -> 테스트 실행 -> 돌아가도록 최소한 구현 -> 테스트 실행 후 성공 확인 -> 성공하는 테스트 -> 테스트 실행 -> 돌아가도록 구현 ... 방식으로 구현한다. 실패하는 테스트가 없는 경우 작성하지 않는다.
- Co-authored 사용했다.
- 도메인을 먼저 구현하기 시작했다.
- 커밋 규칙: test -> feat

## 미션에서 고민한 주제들
### 참가자의 점수를 계산하는 클래스는 어디여야 하는가?
1. ParticipantCards: 참가자의 카드 리스트를 가지고 있고, 점수를 계산할 때 카드 리스트를 갖고 있으면 계산하기 쉽다.
2. CardNumber(최종 채택): 다른 카드들의 합에 따라서 에이스의 값이 변경되어야 하므로, 카드 숫자의 값을 저장하고 있는 enum인 CardNumber에서 값을 계산해야 한다. 대신 계산하는 메서드의 매개변수는 ```List<CardNumber>```로 받는다. (```List<Card>```를 받게 되면 다른 클래스와의 의존성이 커질 것 같다)
3. Optimizer(가칭): 점수를 계산하는 외부 객체를 만든다. ParticipantCards의 계산 메서드에서 Optimizer를 매개변수로 넣어 보낸다.

- 결국 CardNumber를 채택했다. 

### 딜러의 권한은 어디까지인가? (얼마나 현실세계와 가깝게 구현해야 할까?)
- 카드를 나눠주는 것도 딜러의 권한인가?
- 점수를 계산하는 권한을 딜러에게 줄까 고민했지만 헤나가 너무 현실세계와 비슷하게 구현한다고 해서 기각했다.

### 에이스의 값을 어떻게 가변적으로 설정할까?
- 에이스의 값은 1, 11이 될 수 있다. 21이 넘지 않으면서 가깝게 만드는 것이 최선이지만, 21을 넘은 경우 값이 최대한 작아져야 한다.
- CardNumber에서 계산하기로 했는데, 매개변수로 값을 받은 모든 카드 숫자를 더하고, 에이스의 개수만큼 10씩 더해가는 방식을 취했다. 대신 21이 넘지 않도록 더한다. 코드를 보는게 이해가 빠를 듯하다. 
- [코드](https:/github.com/hyena0608/java-blackjack/blob/hyena0608/src/main/java/blackjack/domain/CardNumber.java) stream과 reduce를 사용했다. 헤나 덕분에 reduce도 사용해보고 좋았다.

## 페어 회고

### 스스로에게 좋았던 점
- 궁금하거나 이해가 잘 안 됐던 부분을 바로바로 물어봤다.
- 페어의 의견을 많이 반영하려고 노력했다. 내가 해보지 않은 방법을 최대한 많이 사용해보려고 노력했다.

### 스스로에게 아쉬웠던 점
- 쉬자고 말하면서 했어야 했는데 그냥 내 페이스로 밀어붙인 것 같아서 미안했다.
- 안 그래도 미션 시간이 없는데 내가 늦게까지 남아있지 않아서 더 시간이 없었던 것 같다.
- 결정을 내렸어야 하는 부분에서는 의견을 확실하게 주장했어야 했는데, 내 의견도 좋고 페어 의견도 좋다는 애매한 포지션을 취해서 미션 진행이 느려지는데 기여한 것 같다.

### 페어에게 좋았던 점
- 그림으로 설계하면서 진행했던 게 좋았다. 서로의 의견을 들어보고 진행했던 게 좋았다.
- 이상한 의견을 내도 잘 들어줘서 의견을 낼 때 머뭇거리지 않고 낼 수 있었다.
- 페어 프로그래밍의 규칙을 미리 정해두고 해서 좋았다.

### 페어에게 아쉬웠던 점
- 나와 헤나 모두 의견이 강하지 않아서 여러 번 물어보고 진행하느라 조금 시간이 오래 걸렸던 것 같다.
- 서로의 의견을 너무 존중하느라 ㅋㅋㅋ 사소한 의견 결정도 오래걸렸던 것 같다. 

### 소감 & 앞으로의 다짐
- 뭔가 폭신폭신한 페어 프로그래밍을 했던 것 같다.
- 가장 중요한 로직을 선정하고 중요한 순서대로 구현해야겠다.
- 설계 시간을 정해두고 정해진 시간을 지키면서 미션을 진행해야겠다.
- 부딪히는 부분에서 어떻게 의견을 잘 낼 수 있을지 고민해봐야겠다.

## 다음 미션에서 적용할 것
- 처음에 만났을 때 말을 놓자고 먼저 제안해 본다. 편한 분위기에서 말을 건넬 수 있어 좋은 것 같다.
- 미션 시작 전에 간단하게 30분 정도 아이스 브레이킹을 진행한다.
- 설계는 1시간 정도 한다. 그림을 그리면서 객체간의 관계만 생각해본다. 세부적인 필드나 메서드는 미리 생각하지 않는다.
- 너무 내 의견을 양보하지 않는다. 어떤 게 더 좋은 건지, 왜 좋은지 물어보면서 진행한다. 주장할 때는 확실하게 하자.
- 머릿속에서 말을 정리하고 이야기한다. 말을 하고 싶다는 생각으로 말을 시작하지 말자. 정리되지 않은 말은 오히려 페어를 헷갈리게 한다.
- 질문도 여러 번 했고 이야기를 나눴는데도 결정이 안 나면 일단 내 의견을 밀고 나간다.