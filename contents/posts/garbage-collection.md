---
title: Garbage Collection in Java
date: 2024-08-30 12:50:21 +0200
updated: 2024-08-30 13:42:02 +0200
tags:
  - java
---

## Garbage COllection 이란?

어떤 객체들이 사용되고, 어떤 객체들이 사용되지 않는지를 확인하고, 사용되지 않는 객체들을 제거하는 힙 메모리 탐색 과정이다. 사용중인 객체란 프로그램이 해당 객체로의 포인트를 관리하고 있음을 의미하고, 사용되지 않는 객체란 프로그램에서 더 이상 참조되지 않는 객체를 의미한다.

### Marking

첫 번째 과정은 ‘marking’ 이다. GC 가 어떤 메모리 조각이 사용 중이고 어떤 조각이 사용 중이지 않은지를 확인하는 것이다. 

![[gc-marking.png]]

시스템의 모든 객체를 스캔해야 하는 경우, 시간이 많이 소요될 수 있다.

### Normal Deletion

참조되지 않은 객체들을 제거하는 과정이다.

![[gc-normal-deletion.png]]

#### Deletion with Compacting

추가적으로 성능을 향상하기 위해, 참조되지 않은 객체들을 제거할 때 남아있는 참조 객체들의 메모리를 압축할 수 있다. 이로써 새로운 메모리 할당이 더욱 쉽고 빨라진다.

![[gc-deletion-with-compacting.png]]

#### Why Generational Garbage Collection?

모든 객체를 한 번에 mark 하고 압축하는 것은 비효율적이다. 그러나 경험적 분석에 따르면 대부분의 객체는 수명이 짧은 것으로 조사되었다. 시간이 지남에 따라 점점 적은 객체들이 할당된 채로 남겨진다. 사실상 대부분의 객체들은 매우 짧은 life time 을 갖는다.

###

## Garbage Collector 는 어디에 위치해 있는가?


## Serial Garbage Collector

기본적으로 단일 스레드로 작동하는 가장 간단한 GC 구현이다. 이 GC 는 실행할 때 모든 애플리케이션 스레드를 정지시키므로, 서버 환경과 같은 멀티스레드 애플리케이션에서는 사용하지 않는 것이 좋다.

Serial Garbage Collector 는 일시 정지 시간이 짧고, 클라이언트형 시스템에서 실행되는 대부분의 애플리케이션에서 선택하는 Garbage Collector 이다.

### Mark-Sweep-Compact 알고리즘

- [i] 힙의 가장 앞 부분이란 **메모리 주소의 시작 부분**을 의미한다. Java 의 힙 메모리는 일반적으로 낮은 메모리 주소에서 높은 메모리 주소로 성장하기 때문이다.
- [!] 객체 할당 시점과는 무관하게 힙 메모리의 물리적인 주소 순서에 따라 객체를 조사하고 처리한다. 실제 객체 할당은 힙 메모리 내에서 어떤 위치에서든 이루어질 수 있고, 메모리 allocator 에 의해 특정 메모리 블록이 할당된다. 

## Parallel Garbage Collector

Java 5 부터 Java 8 까지 JVM 의 기본 GC 로, Throughput Collectors 라고도 불린다. 여러 스레드를 사용하여 힙 공간을 관리하지만, GC 를 수행하는 동안 다른 애플리케이션 스레드를 정지시킨다. 

## G1 Garbage Collector

Garbage First Garbage Collector 는 메모리 공간이 큰 멀티프로세서 시스템에서 실행되는 애플리케이션을 위해 설계되었다. JDK7 Update 4 이후 release 에서 사용할 수 있다. 

G1 수집기는 힙을 동일한 크기의 힙 영역 집합으로 분할하여 각각 인접한 범위의 가상 메모리로 분할한다. GC 를 수행할 때 G1 은 힙 전체에서 객체의 활성도를 결정하기 위해 동시 글로벌 마킹 단계를 표시한다. 마킹 단계가 완료된 후 G1 은 어느 영역이 대부분 비어 있는지 파악하고, 상당한 양의 여유 공간을 확보한다. (swiping)

## Z Garbage Collector

ZGC 는 확장 가능한 저지연 GC 로, Java 11 에서 처음 도입되었다. JDK 14 에서는 Windows 및 MacOS 운영체제에서 ZGC 를 도입하였다. Java 15 이후로부터 정식 버전으로 채택되었다.

ZGC 는 애플리케이션 스레드 실행을 10ms 이상 중단하지 않고 모든 고비용 작업을 동시에 수행하므로 짧은 지연 시간이 필요한 애플리케이션에 적합하다. 스레드가 실행중일 때, 컬러 포인터가 있는 로드 배리어를 사용하여 동시 작업을 수행하며, 힙 사용량을 추적하는데 사용된다.

Reference coloring (color pointer) 는 ZGC 의 핵심 개념으로, 참조의 일부 비트(메타데이터 비트)를 사용하여 객체의 상태를 표시한다. 8MB 에서 16TB 크기의 힙도 처리할 수 있다. 또한 일시 중지 시간이 힙, live set, root set 크기에 따라 증가하지 않는다. 

### Multi-Mapping

Multi-Mapping 이란 가상 메모리에 물리적 메모리의 동일한 주소를 가리키는 특정 주소가 있다는 것을 의미한다. 애플리케이션은 가상 메모리를 통해 데이터에 액세스하게 된다.

### Relocation

동적 메모리 할당을 사용할 때, 일반적인 애플리케이션의 메모리는 시간이 지남에 따라 조각화된다. 메모리 중간에 있는 객체를 해제하면 그 자리에 여유 공간이 남기 때문이다.  

이제 중간의 틈을 새로운 객체로 채우려면 메모리에 객체를 저장할 수 있을 만큼 큰 여유 공간이 있는지 스캔해야 한다. 이 작업은 메모리를 할당할 때마다 수행해야 하는 경우 비용이 많이 드는 작업이다. 다른 방법으로는 조각난 메모리 영역에서 빈 공간으로 객체를 자주 재배치하여 더 압축된 형식으로 관리하는 것이다. 보다 효과적인 방법을 위해 메모리 공간을 블록으로 분할하고, 한 블록에 있는 모든 객체를 재배치하거나 전혀 재배치하지 않는다. 이런 방식을 사용하면 메모리에 전체 빈 블록이 있다는 것을 알기 때문에 메모리 할당이 더욱 빨라질 수 있다.

### ZGC Concepts

ZGC 는 가능한 한 짧은 stop-the-world 단계를 제공하기 위해, 이러한 일시 중지의 지속 시간이 힙 크기에 따라 증가하지 않는 방식을 사용한다. 따라서 ZGC 는 대용량 힙이 일반적이고 빠른 애플리케이션 응답 시간이 요구되는 서버 애플리케이션에 적합하다.

ZGC 는 도달 가능한 객체를 찾는 Marking 을 통해 참조 상태를 참조 비트로 저장하는 ‘Reference coloring’ 을 사용한다. 이때, 객체에 대한 메타데이터를 저장하기 위해 참조 비트를 설정하면 상태 비트가 객체의 위치에 대한 정보를 보유하지 않기 때문에 여러 참조가 동일한 객체를 가리킬 수 있다. ZGC 는 이를 ‘Multi-Mapping’ 으로 해결한다.

ZGC 는 메모리 단편화를 줄이기 위해 Relocation 을 사용한다. 힙이 크면 재배치 속도가 느려지는데, 이를 해결하기 위해 대부분의 Relocation 을 애플리케이션과 병렬로 수행한다. 이때, 애플리케이션과 병렬로 GC 를 실행하는 경우에 애플리케이션이 이전 주소를 통해 해당 객체에 접근하려 시도할 수 있다. ZGC 는 이 문제를 ‘Load Barrier’ 를 통해 해결한다. 

Load barrier 는 스레드가 힙에서 참조를 로드할 때 실행된다. 참조의 메타데이터 비트를 확인하여, ZGC 참조를 가져오기 전에 일부 처리를 수행할 수 있다. 즉, 완전히 다른 참조가 생성될 수 있는 것이다. 이를 ‘Remapping’ 이라고 한다.

### Marking

1. stop-the-world: 루트 참조(힙의 객체에 도달하기 위한 시작점)를 찾아서 표시한다. 일반적으로 루트 참조의 수는 적기 때문에, 해당 단계는 짧은 시간 동안 이루어질 수 있다.
2. concurrent: 루트 참조에서 시작하여 객체 그래프를 횡단하며 도달하는 모든 객체에 marking 을 수행한다. 또한 load barrier 가 표시되지 않은 참조를 감지하면 해당 참조도 표시한다.
3. 엣지 케이스 처리를 위한 stop-the-world

### Reference Coloring

참조는 가상 메모리의 바이트 위치를 나타낸다. 그러나 이를 위해 참조의 모든 비트를 사용할 필요는 없고, 일부 비트가 참조의 속성을 나타낼 수 있는데 이를 ‘Reference Coloring’ 이라고 한다.

32 bit 로는 4GB 밖에 처리할 수 없기 때문에, ZGC 는 64 bit refrence 를 사용한다. 즉, 64 bit 플랫폼에서만 ZGC 를 사용할 수 있다.

ZGC 참조는 주소 자체를 표현하기 위해서는 42 bit 를 사용하는데, 이를 통해 4TB 의 메모리 공간을 주소로 지정할 수 있게 된다. 

참조 상태 저장을 위한 비트는 총 4개가 존재한다.

- finalizable bit: 객체가 finalizer 를 통해서만 도달 가능하다.
- remap bit: 참조는 최신 상태이며, 객체의 현재 위치를 가리킨다.
- marked0 또는 marke1: 도달 가능한 객체를 표시하는 데 사용한다.

이러한 비트들을 메타데이터 비트라고 한다.

### Relocation

ZGC 에서 relocation 은 다음과 같은 과정을 따른다.

1. concurrent phase 에서 이전해야 하는 블록을 찾은 뒤 relocation set 에 넣는다.
2. stop-the-world phase 는 모든 루트 참조를 relocation set 으로 이전하고, 그들의 참조를 업데이트한다.
3. relocation set 에 존재하는 객체들을 모두 이전하고, 이전 주소와 새 주소 간의 매핑을 forwarding table 에 저장한다.
4. 남아있는 참조들의 rewriting 은 다음 marking 단계에서 이루어진다. 이렇게 하면 Object tree 를 두 번 순회할 필요가 없다. 또는 load barrier 를 통해서도 가능하다.

### Remapping and Load Barriers

load barrier 는 remapping 으로 재배치된 객체를 가리키는 참조를 수정한다. 애플리케이션이 참조를 로드하면 load barrier 가 트리거 되고, 다음 단계에 따라 올바른 참조를 반환한다. 

1. Remapping bit 가 1로 설정되어 있는지 확인한다. 
	1. 만약 그렇다면 참조가 최신 상태이므로 안전하게 반환할 수 있다.
2. 참조된 객체가 relocation set 에 있는지를 확인한다.
	1. 만약 그렇지 않다면 remapping 을 원하지 않는다는 뜻이다. 다음에 이 참조를 로드할 때 해당 검사를 피하기 위해 remapping 비트를 1로 설정하고 업데이트된 참조를 반환한다.
3. 액세스하려는 객체가 재배치 대상임을 알게 되었으니, 재배치 여부를 확인한다.
	1. 객체가 재배치되었다면 다음 단계로 건너뛴다.
	2. 그렇지 않다면 지금 재배치하고, forwarding 테이블에 항목을 생성하여 재배치된 각 객체의 새 주소를 저장한다.
4. 이제 오브젝트가 재배치되었음을 알 수 있다. 전달 테이블에서 조회하여 해당 참조를 객체의 새 위치로 업데이트하고, remapping bit 를 설정한 다음 참조를 반환한다.

이런 단계를 거쳐 객체에 액세스하려고 할 때마다 가장 최근의 참조를 가져올 수 있도록 한다. 참조를 로드할 때마다 load barrier 가 트리거되기 때문에, 애플리케이션 성능이 저하될 수 있다. (특히 재배치된 객체에 처음 접근할 때 더욱 저하될 수 있다.) 이것이 짧은 일시 중지 시간을 위한 trade-off 이다. (이런 단계는 비교적 빠르게 처리되므로 애플리케이션 성능에는 큰 영향을 미치지 않을 수 있다.)

## 출처

- https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html
- https://www.baeldung.com/jvm-garbage-collectors
- https://www.oracle.com/java/technologies/javase/gc-tuning-6.html
- [ZGC OpenJDK wiki](https://wiki.openjdk.org/display/zgc/Main#Main-QuickStart)
- 