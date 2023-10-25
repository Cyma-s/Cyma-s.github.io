---
date: 2023-10-25 12:02:13 +0900
updated: 2023-10-25 15:17:12 +0900
title: JPA 2차 캐시 적용하기
tags:
  - shook
  - jpa
  - spring
---

구글에 Spring Boot 3.x.x 버전의 JPA 2차 캐시 설정 방법이 없어서 하루를 삽질해서, 다른 분들은 쉽게 설정하셨으면 하는 마음에 정리하는 글입니다.

## 의존성 설정하기

S-HOOK 의 gradle 은 다음과 같습니다.

```groovy
plugins {  
    id 'java'  
    id 'org.springframework.boot' version '3.1.1'  
    id 'io.spring.dependency-management' version '1.1.0'  
}  
  
group = 'shook'  
version = '0.0.1-SNAPSHOT'  
  
java {  
    sourceCompatibility = '17'  
}  
  
configurations {  
    compileOnly {  
        extendsFrom annotationProcessor  
    }  
}  
  
repositories {  
    mavenCentral()  
}  
  
  
dependencies {  
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'  
    implementation 'org.springframework.boot:spring-boot-starter-web'  
    implementation 'org.springframework.boot:spring-boot-starter-validation'  
    // JWT Dependency  
	...
  
    //swagger  
    ...
  
    compileOnly 'org.projectlombok:lombok'  
  
    runtimeOnly 'com.h2database:h2'  
    runtimeOnly 'com.mysql:mysql-connector-j'  
  
    annotationProcessor 'org.projectlombok:lombok'  
  
    testImplementation 'org.springframework.boot:spring-boot-starter-test'  
    testImplementation 'io.rest-assured:rest-assured:5.3.1'  
    testImplementation 'org.awaitility:awaitility:4.2.0'  
  
    //log to slack  
    ...
  
    //xlsx reader  
    ...
  
    //actuator  
    ...
  
    // aop  
    ...
  
    // cache  
    implementation 'org.hibernate.orm:hibernate-ehcache:6.0.0.Alpha7'  
    implementation 'org.hibernate.orm:hibernate-jcache:6.2.0.CR2'  
    implementation 'org.ehcache:ehcache:3.10.8'  
}  
  
tasks.named('test') {  
    useJUnitPlatform()  
}
```

여기서 아래의 의존성을 추가해주어야 합니다.

```groovy
// cache  
implementation 'org.hibernate.orm:hibernate-ehcache:6.0.0.Alpha7'  
implementation 'org.hibernate.orm:hibernate-jcache:6.3.1.Final'  
implementation 'org.ehcache:ehcache:3.10.8'
```

## `application.yml` 설정

이전 버전에서는 `region.factory_class` 를 `org.hibernate.cache.ehcache.EhCacheRegionFactory` 라고 적으라는 글이 많은데, Spring Boot 3.x.x 버전에서는 다음과 같이 작성해야 합니다.

```yml
spring:
	jpa:  
	  properties:  
	    javax:  
	      cache:  
	        provide: org.ehcache.jsr107.EhcacheCachingProvider  
	      persistence:  
	        sharedCache:  
	          mode: ENABLE_SELECTIVE  
	    hibernate:  
	      format_sql: true  
	      show-sql: true  
	      cache:  
	        use_second_level_cache: true  
	        region:  
	          factory_class: jcache  
```

`factory_class` 와 `provide` 가 추가되었습니다.

### `ehcache.xml` 적용하기

```xml
<config  
  xmlns='http://www.ehcache.org/v3'  
  xmlns:jsr107='http://www.ehcache.org/v3/jsr107'>  
  
  <service>    
	  <jsr107:defaults enable-statistics="true"/>  
  </service>  
  <cache alias="songCache">  
	  <key-type>java.lang.Long</key-type>  
	  <value-type>shook.shook.song.domain.Song</value-type>  
	  <expiry>      
		  <ttl unit="seconds">10000</ttl>  
	  </expiry>    
	  <resources>      
		  <offheap unit="MB">100</offheap>  
	  </resources>  
    </cache>
</config>
```

EhCache 3.x 버전을 위한 캐시 설정 파일입니다.  

- `enable-statistics`: 캐시 통계 수집을 활성화 / 비활성화할 수 있습니다. true 면 캐시 동작에 대한 통계를 수집합니다.
- `alias`: 캐시의 이름(별칭)을 지정합니다. 
- `value-type`: 캐싱하려는 클래스의 상대 경로를 적어줍니다. 
- `key-type`: 캐시 키의 자료형을 지정합니다.
- `expiry`: 캐시 항목의 만료 시간을 설정합니다. (초 단위)
- `resources`: 캐시가 사용하는 리소스를 지정합니다.
	- `<offheap>`: 캐시 데이터를 JVM 힙 외부에 저장하도록 설정합니다. JVM 가비지 컬렉션에 영향을 받지 않아, 성능 향상을 기대할 수 있습니다. 현재는 100MB 의 오프힙 메모리를 사용하도록 설정되어 있습니다.

캐싱 적용을 위해서는 `Application.java` 에 다음과 같은 코드를 추가하면 됩니다.

```java
@EnableCaching    // 이 부분!
@SpringBootApplication  
public class ShookApplication {  
  
    public static void main(String[] args) {  
        SpringApplication.run(ShookApplication.class, args);  
    }  
}
```

