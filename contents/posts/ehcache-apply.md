---
date: 2023-10-25 12:02:13 +0900
updated: 2023-10-25 12:05:13 +0900
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

여기서 중요한 부분은 이 부분입니다.

```groovy
    // cache  
    implementation 'org.hibernate.orm:hibernate-ehcache:6.0.0.Alpha7'  
    implementation 'org.hibernate.orm:hibernate-jcache:6.2.0.CR2'  
    implementation 'org.ehcache:ehcache:3.10.8'  
```

