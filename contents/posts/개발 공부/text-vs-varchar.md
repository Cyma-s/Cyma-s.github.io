---
title   : TEXT와 VARCHAR의 차이점은 무엇일까?
date    : 2023-04-14 20:12:19 +0900
updated : 2023-04-14 20:12:39 +0900
tags     : 
- 개발
---

포이가 TEXT와 VARCHAR의 차이점이 무엇인 것 같냐고 물어봐서 알아보게 되었다.

## TEXT

- 긴 문자열을 저장할 수 있는 가변 길이 데이터 유형이다.
- 고정된 최대 크기 문자 개수는 2^16 - 1 이다.
- TEXT(M) 은 M <= 255 에서 2 + c 바이트의 디스크 공간을 차지한다. (c는 저장된 문자열의 길이)
- index의 완전한 일부가 될 수 없고, prefix length를 지정해야 한다.

## VARCHAR

- 최대 크기 M에 대해 2^16-1 의 가변 크기를 갖는다.
- TEXT보다 더 적은 공간을 차지한다.
- VARCHAR(M) 은 1 + c 바이트 (M <= 255 인 경우) 또는 2 + c 바이트 (256 <= M <= 65535) 의 디스크 공간을 차지한다.
- index의 일부가 될 수 있다.
- 8비트 code page로 제한되는 non-Unicode character data type이다.
- NVARCHAR 보다 디스크 공간을 덜 차지한다.

## NVARCHAR
- 모든 Unicode data를 저장할 수 있는 Unicode character data type이다.
- VARCHAR 대신 NVARCHAR를 사용하면 데이터베이스에서 읽거나 쓸 때마다 인코딩 변환을 수행하지 않아도 된다. 변환에는 시간이 걸리고 오류가 발생하기 쉽다. 발생한 변환 오류로부터 값을 복구하는 것은 어렵다.

## Index

테이블에 효율적으로 접근하기 위한 데이터 구조이다.
필수는 아니지만 인덱스가 없으면 쿼리 응답 시간이 느려질 수 있다.

인덱스는 테이블과 연관되어 있고, 하나 이상의 테이블 column으로 구성된 키를 갖는다.
데이터베이스에서 검색 속도를 높이는 데 사용할 수 있다.

## 예제

테이블에 몇 단어에서 몇 단락에 이르는 사용자의 자기소개가 저장된다고 하자.
이 경우에는 TEXT를 사용하는 것이 좋다. 자기소개는 길이가 매우 다양할 수 있고, index화 하거나 외래 키 제약 조건에 사용될 필요가 없기 때문이다. 
또한 사용자 테이블에 다른 열이 있을 가능성이 높기 때문에 bio 열에 VARCHAR를 사용하여 최대 행 크기인 65535 바이트를 초과하지 않으려는 것이다. TEXT를 사용하면 bio를 행 외부에 저장하고 행에 해당 bio에 대한 포인터만 가질 수 있으므로 행의 크기가 줄어든다.

```sql
CREATE TABLE user (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  bio TEXT
);
```

전자 상거래 웹사이트용 테이블이 있다고 가정하자.
하나의 column에는 몇 단어에서 몇 문장에 이르는 제품 설명이 저장된다. 이 경우에 description column에는 VARCHAR를 사용한다. 설명이 비교적 짧고, column을 index화하여 외래키 제약 조건에서 사용할 수 있기를 바라기 때문이다. 또한 product 테이블에 다른 column이 있을 가능성이 높으므로 설명 열에 TEXT를 사용하여 최대 행 크기인 65535 바이트를 초과하지 않기 위해서이다. 

```sql
CREATE TABLE product (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10,2) NOT NULL
);
```

즉, 많은 양의 텍스트를 저장해야 하는 경우 TEXT를 사용하고, 비교적 짧은 텍스트를 저장해야 하는 경우에는 VARCHAR를 사용한다. (라는 말 밖에 안 나온다...)

## 그럼 왜 TEXT를 쓸까?

베로 피셜: 엄청 큰 문자열을 저장할 거 아니면 TEXT를 딱히 쓸 이유가 없는 거 같다.

## 결론

몇 단어 또는 문장을 저장하고, (전체) column을 index로 만들거나 외래 키 제약 조건이 있는 column을 사용하려는 경우 VARCHAR를 사용해야 한다.

단락 이상의 텍스트를 저장하려는 경우, column을 index로 만들 필요가 없거나 테이블 column 크기 제한에 도달한 경우 TEXT를 사용해야 한다.

단, VARCHAR 또는 TEXT 필드에 필요한 실제 바이트 수는 column (또는 콘텐츠의 인코딩)에 따라 달라진다는 것을 유의해야 한다.
