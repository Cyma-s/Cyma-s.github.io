---
title: 데이터베이스시스템
date: 2024-04-21 17:20:22 +0900
updated: 2024-04-22 15:08:15 +0900
tags: 
---

## Physical Storage Systems

### Magnetic Disks

- platter 의 표면은 동심원으로 나누어진다.
- 각 track 은 sector 로 나뉜다.
	- sector 는 데이터 읽기, 쓰기의 기본 단위이다.
- Cylinder: Platter 들의 집합인 가상의 원통
	- Seek time 1회만 필요함

### Performance Measures of Disks

- Access time: 기계를 움직이는데 필요한 시간
	- Seek time(탐색 시간): arm 을 정확한 track 으로 올려놓는 데 걸리는 시간
	- Rotational latency(회전지연시간): 접근해야 하는 sector 로 이동하는데 걸리는 시간
		- 평균적으로 반 바퀴 정도 돌아야 함
- Data-transfer rate: 디스크에서 데이터를 가져오거나 저장하는 데 걸리는 속도

### Performance Measures

- Disk block
	- Disk I/O 를 진행하는 논리적인 단위, 데이터 이동이 이루어지는 단위
	- 4~16KB 정도로 설정됨
		- 더 작은 블록: I/O 횟수가 늘어날 수 있다.
		- 더 큰 블록: 불필요한 데이터를 I/O 하는 낭비가 발생할 수 있다.
- Sequential access pattern
- Random access pattern
- I/O operations per second (IOPS)
- Blocking Factor = block size / record size

## Data Storage Structures

### File Organization

- 데이터베이스는 파일의 모음으로 저장된다. 각 파일은 레코드의 나열이다.

### Fixed-Length Records

- 레코드 크기가 고정되어 있다.
- 각 파일들의 레코드 타입은 모두 같다.
- 각 테이블마다 독립된 파일을 할당해준다.

#### Deletion of record

i 번째 레코드를 삭제한다고 가정한다.

1. i + 1 ~ n까지의 레코드를 i ~ n-1 로 위치를 이동한다. => 많은 횟수의 I/O 를 유발한다.
2. n번째의 레코드를 i 번째로 이동한다. => 2번의 I/O 필요
3. 레코드들을 이동하지 않고, 모든 비어 있는 공간을 free list 로 관리한다.

### Variable-Length Records

- 가변길이 레코드는 데이터베이스 시스템에서 다양한 방식으로 사용된다.
	- 한 파일 안에 복수 개의 레코드를 저장하는 방식
	- 필드의 값 자체가 가변길이인 경우가 많다.
	- 레코드마다 반복되는 필드가 존재한다. (최신 RDB에서는 잘 안 쓰인다.)
- 필드들을 정해진 순서대로 저장한다.
- 고정 길이 속성을 저장한 뒤에 가변 길이 데이터를 저장한다.
	- 고정 길이 속성 값 + Null bitmap + 가변 길이 데이터

#### Variable-Length Records: Slotted Page Structure

- Slotted page 헤더가 포함하는 것
	- 블록 내의 레코드 개수
	- 빈 공간의 끝 위치
	- 각 레코드의 위치 (포인터), 길이
- Record 와 Slot 은 1:1 매칭되지만, 레코드 순서와 slot 순서가 동일하지는 않다.
- 레코드 삽입을 하기 위해서는 빈 공간의 크기가 Slot 길이 + 레코드 길이보다 같거나 커야 한다. 
- 레코드가 갱신된 경우 레코드의 길이를 변경하고, 인접 레코드를 이동한 뒤, Slot 의 레코드 길이와 포인터를 갱신한다.
- 레코드가 삭제된 경우 레코드 공간을 free space 로 회수하고, 인접 레코드를 이동시킨 뒤, slot 의 레코드 포인터를 갱신한다. 이는 Record fragmentation 을 방지한다.
	- 레코드가 삭제될 때 레코드 공간은 회수하지만, slot 은 회수하지 않는다. (레코드 길이를 -1로 설정하는 등의 방식으로 삭제되었음을 표현한다.)
	- 항상 slot 수 == 레코드 수인 것은 아니다.
- 블록 외부의 포인터는 레코드를 직접 가리키지 않고, 헤더의 slot 을 포인팅해야 한다.

### Organization of Records in Files

- Heap
	- 가장 기본적인 파일 구조
	- 공간이 있다면 레코드는 어디든지 놓일 수 있다.
- Sequential
	- 레코드에 순서를 부여한다.
	- 각 레코드의 search key 의 값을 기준으로 레코드를 정렬된 상태로 저장한다.
- B+-tree file organization
	- 가장 많이 사용되는 구조
	- 삽입/삭제가 진행되어도 정렬된 상태를 유지한다.
- Hashing

### Heap File Organization

- 빈 공간이 있다면 파일 어디든지 위치할 수 있다.
- 한 번 할당이 되면 잘 움직이지 않는다. (Block 들 사이에서)
- 어떤 블록에 빈 공간이 있는지를 알아내는 것이 중요하다.
- Free-space map
	- 각 블록 간의 상태 정보를 저장한다.
	- 블록마다 1개의 entry 를 갖는다.
	- 각 entry 는 몇 개의 bit 나 byte 로 구성이 되는데, 현재 얼마나 빈 공간이 존재하는지에 대한 값을 저장한다.
	- Second-level free-space map 을 갖기도 한다.

### Sequential File Organization

- search-key 값으로 파일의 레코드들이 정렬된다.
- 파일의 모든 레코드를 순차적으로 접근하는 연산이 많이 발생하는 경우 유리하다. 소수의 레코드를 찾는데 사용하는 것은 비효율적이다.
- 레코드 삭제
	- pointer chain 을 사용한다.
- 레코드 삽입
	- 빈 공간이 있으면 그 부분에 삽입하고 포인터를 업데이트한다.
	- 빈 공간이 없으면, 임시 저장 블록에 record 를 삽입하고 포인터를 업데이트한다.
- 점점 레코드 link 가 복잡해지게 되고, 이는 검색 성능에 영향을 준다. (Overflow block 이 다른 block 에 존재하면 Disk I/O가 필요하기 때문에 성능이 저하된다.) 따라서 주기적으로 reorganize 를 수행하여 논리적 순서와 물리적 순서를 동일하게 만들어주는 것이 좋다.

### Multitable Clustering File Organization

- 논리적으로 다른 테이블의 레코드를 같은 파일에 저장하는 것이다.
- 해당 구조를 효율적으로 사용할 수 있는 질의들에는 자연 조인이 있다.
- 한 파일 내에서 하나의 테이블만 조회하면 성능이 저하될 수 있다. (데이터가 뒤섞여 있기 때문에 골라내는 추가적인 과정이 필요함)
- 레코드 포맷이 다르기 떄문에 레코드 크기가 다양하다.
- 특정 테이블의 레코드들은 그들만의 링크로 연결하는 방식을 사용할 수도 있다.

### Data Dictionary Storage

- system catalog 라고 하기도 한다.
- metadata 를 저장한다.
- 메타데이터의 종류
	- 관계 테이블의 정보
		- 관계 테이블의 이름
		- 각 속성들의 이름, 타입, 길이
		- view (가상 테이블) 의 이름과 정의
		- 무결성 제약
	- 유저, 계정 정보
	- 통계 정보
		- 각 관계 테이블의 튜플의 개수
	- 물리적 파일 구성 정보
		- 관계 테이블이 어떤 방식으로 저장이 되었는가 (sequential / hash / …)
		- 관계 테이블의 물리적인 위치
	- 인덱스 정보
- 메타데이터는 테이블에 저장될 수 있고, 인메모리 자료구조로 메타데이터를 적재하기도 한다.

### Storage Access

- Buffer: Disk 블록들의 복사본을 저장하기 위해 이용 가능한 메인 메모리의 일부
- Buffer manager: 메인 메모리의 버퍼 공간을 할당하는 책임을 갖는 서브 시스템

#### Buffer Manager

- 프로그램은 Disk 에서 블록이 필요하면 buffer manager 를 호출한다.
	- 블록이 이미 버퍼에 존재하면, buffer manager 는 메인 메모리의 블록 주소를 반환한다.
	- 블록이 버퍼에 없는 경우
		- 블록을 버퍼로 가져온다.
			- 필요하다면 새 블록을 위한 공간을 만들기 위해 다른 블록을 대체할 수 있다.
			- 대체되는 블록이 가장 최근에 disk 에 쓰이거나 / fetch 되었던 시간 이후에 변경되었다면, disk 에 변경 사항을 반영한다.
		- 블록을 읽고, 프로그램에게 메인 메모리의 블록 주소를 반환한다.
- Buffer replacement strategy
	- Pinned Block
		- Pin: 버퍼 내에 내용을 고정시켜, 페이지 교체 대상에서 면제한다.
		- Unpin: 버퍼 교체 대상이 될 수 있다.
	- Shared and exclusive locks on buffer

#### Buffer-Replacement Policies

- 대부분의 OS 는 블록을 Least Recently Used 방식으로 교체한다.
	- 그러나 LRU 는 DB 의 경우 좋지 않은 경우가 존재한다. 예를 들어 2개의 관계 테이블을 join 할 때, 가장 최근에 사용된 데이터를 삭제하는 것이 더 좋을 것이다. (왜냐하면 가장 최근에 사용된 데이터는 조인 과정 내에서 앞으로 더 이상 사용되지 않을 가능성이 높기 때문이다.)
- **Toss-immediate strategy**
	- 블록에 들어 있는 마지막 튜플의 접근이 끝나자마자 버퍼에서 지운다.
- **Most recently used (MRU) strategy**
	- 가장 최근에 접근한 블록을 제거한다. (중첩 루프 조인 알고리즘)

## Indexing

### Basic Concepts

- 데이터에 접근하는 속도를 높이기 위해 사용된다.
- Search Key
	- 인덱스를 만드는 컬럼 속성
	- 한 개일 수도 있고, 합성을 할 수도 있다.
- Index file
	- search-key 와 pointer 로 구성되어 있는 index entry 의 집합
- 인덱스 파일의 크기는 원본 파일보다 더 작기 때문에 검색 성능이 향상된다.
- 인덱스의 종류
	- Ordered indices: B+ 트리
	- Hash indices: 해시 함수를 사용하여 인덱스를 여러 버킷에 분산하는 방식

### Index Evaluation Metrics

접근 방식은 두 가지가 존재한다. 
- 특정 값을 갖는 레코드 찾기
- 컬럼 값의 범위를 주고, 해당하는 범위의 레코드 찾기

- Access time
- 삽입 시간
- 삭제 시간
- 공간 오버헤드

### Ordered Indices

- 인덱스가 Search Key 값으로 정렬된 것을 말한다.
- **Clustering Index**
	- 순차적으로 정렬된 파일에서, 데이터 파일 레코드 자체가 정렬되어 있는 것
	- primary index 라고 부르기도 한다.
	- 보통은 primary key 로 만들어지지만, 필수적으로 그런 것은 아니다.
- **Secondary Index**
	- 데이터의 정렬 순서와 인덱스 정렬 순서가 동일하지 않은 상태
	- **nonclustering index** 라고 부르기도 한다.
	- have to be dense.
- **Index-sequential file**
	- Clustering index 가 search key 에 대해 정렬되어 있는 상태

### Dense Index Files

- 데이터 파일 대비 인덱스 파일 용량이 더 작기 때문에 접근하는 시간이 더 작다.
- Dense Index는 모든 search-key value 에 대해 인덱스 레코드가 존재하는 것을 말한다.
	- ID 값은 유니크하기 때문에 모든 search key value 에 대해 인덱스 레코드가 존재한다.
- 데이터들이 모여있기 때문에 디스크 I/O 를 덜 해도 된다는 장점이 있다.

### Sparse Index Files

- 몇 개의 search-key 값에 대한 index record 만 포함하는 인덱스
	- 레코드가 순차적으로 search-key 로 정렬되어 있는 경우 주로 사용 (순차 파일 구조여야 함)
- K 값을 가진 레코드를 찾을 때, K보다 작은 값들 중에 최댓값의 search-key 값을 갖는 인덱스 레코드를 찾는다. 그 후 해당 인덱스 레코드가 가리키는 레코드부터 시작해서 순차적으로 탐색한다.
- Dense Index File 과 비교했을 때
	- 공간을 더 적게 사용하고, 삽입 삭제시 관리 오버헤드가 더 적다.
	- 부분적인 순차 접근을 요구하기 때문에 dense index 에 비해 일반적으로 더 느리다. 
- **Good tradeoff**
	- clustered index 에서 파일 내에 있는 각 블록의 가장 작은 값만 뽑아 sparse index 로 만들기

### Clustering vs Nonclustering Indices

- clustering: block I/O 를 덜 하면서 레코드에 접근할 수 있다.
- nonclustering: 레코드가 서로 다른 블록에 있어 하나에 접근할 때마다 disk I/O 를 해야 하기 때문에 seek time 등 여러 오버헤드가 존재한다.

### Multilevel Index

- 인덱스에 대한 인덱스
- 인덱스가 메모리에 맞지 않으면, 접근을 더 많이 해야 하기 때문에 비용이 커진다.
- outer index 로 sparse index 를 사용하고, inner index 가 basic index file 이 된다. 
- 계속해서 상위의 multilevel index 를 만들 수 있다.
- 모든 level 의 인덱스들은 삽입이나 삭제가 발생할 때마다 업데이트되어야 한다.

### Indices on Multiple Keys

- Composite search key
	- DBMS 내부적으로 Non-unique index 를 만들 때, unique search key 와 합성해서 non-unique index 를 생성하기도 한다.

### B+-Tree Index Files

- indexed-sequential files 의 단점
	- 많은 overflow 블록이 생성되기 때문에, 파일 크기가 커질 수록 성능이 낮아진다.
	- 주기적으로 파일 전체를 재구성해야 한다.
- B+-tree index file 의 장점
	- 삽입, 삭제가 일어날 때마다 적은 부담으로 재구성을 자동으로 수행할 수 있다.
	- 성능을 관리하기 위한 전체 파일의 재구성이 필요하지 않다.
- B+-tree 의 (사소한) 단점
	- 삽입, 삭제의 오버헤드가 존재하지만, 크지 않다.

#### 특징

다음과 같은 특성을 만족해야 한다.

- Balanced tree 이기 때문에 루트에서 리프노드까지의 거리는 모두 같다. 
- 각 노드의 50% 이상이 데이터로 차있어야 한다. (root 는 제외한다)
- 특별한 경우
	- 루트가 리프가 아니면 자식이 2개 이상이어야 한다.
	- 루트가 리프면, 루트 노드는 0~n-1 개의 데이터로 구성되어야 한다.

#### B+-Tree Node Structure

- $K_i$ : search-key 값
- $P_i$: 자식 노드를 가리키는 포인터 (non-leaf node 의 경우) 이거나, 레코드나 버킷을 가리키는 포인터 (leaf node 의 경우)
- $P_{n-1}$ 은 인접한 형제 노드를 가리킨다.

#### Non-Leaf Nodes in B+-Trees

- Non-Leaf node 는 리프 노드의 multi-level sparse index 이다.

#### Observations about B+-trees

- 논리적으로 근접한 블록들이 물리적으로는 그렇지 않을 수 있다.
- Non-leaf 노드는 sparse index 계층 구조를 구성한다.
- B+-tree 는 높이가 낮은 편이다.
- K 개의 search-key 값이 존재할 때, 트리의 높이는 $ceil(log_{n/2}(K))$ 보다 클 수 없기 때문에, 탐색이 매우 효율적이다.
- 삽입 / 삭제가 발생할 때 시간 복잡도는 Log 시간으로 동작한다.

#### Queries on B+-Trees

- Range query 를 지원한다. 범위의 시작 값으로 검색을 시작하고, 계속해서 옆으로 이동하며 range 검색을 수행할 수 있다.

#### Updates on B+-Trees: Insertion

1. search-key 값으로 리프 노드를 찾는다.
	- 만약 리프 노드에 빈 공간이 있으면, 삽입한다.
	- 공간이 없으면 노드를 분할한다.
2. 부모 노드에 k (키값), p (새로 삽입한 형제 노드 포인터) entry 를 삽입한다.
	- 부모 노드가 꽉 차있다면, 계속해서 상위로 전파한다.
	- 루트도 자리가 없으면 루트가 새롭게 생긴다.
