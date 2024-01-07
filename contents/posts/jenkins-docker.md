---
title: Jenkins 로 docker image 빌드 후 배포하기
date: 2024-01-07 15:24:31 +0900
updated: 2024-01-07 15:51:33 +0900
tags:
  - jenkins
  - docker
  - spring
---

너무 많이 삽질을 해서 나중에도 기억하기 위해 기록으로 남겨둔다.  

## 하려고 하는 것

1. Github 에 새로운 커밋이 푸시된다.
2. Jenkins 가 있는 EC2 인스턴스에서 `gradlew clean bootJar` 를 수행한다. 
3. jar 파일이 만들어지면 Docker image 를 빌드하여 Docker Hub 에 push 한다. 
4. Image push 가 완료되면 production 서버에서 Docker 컨테이너를 실행한다. 

## Github Push 이벤트 수신하기

`jenkins EC2의 ip/github-webhook/` 으로 Github Webhook 을 등록한다. 

![[github-jenkins-webhook.png]]

당연하게도 Github, Docker hub Credentials 는 있어야 한다. Github 는 비밀번호를 토큰으로, Docker Hub 는 회원가입 때 만들었던 아이디와 비밀번호를 넣어서 Credentials 를 생성해준다. 

## Docker image 빌드 Pipeline

Github 프로젝트를 체크하고 트래킹할 레포지토리를 적어준다. 

![[jenkins-docker-github-project.png]]

push event 를 수신할 것이기 때문에 Github hook trigger 를 설정해준다. 

![[jenkins-push-event.png]]

Pipeline script from SCM 으로 설정해주고, 똑같이 Repository URL 을 적어준다. 

![[jenkins-github-repository-setting.png]]

나는 Submodule 을 사용했기 때문에 `Advanced sub-modules behaviours` 를 추가해주었다.  

![[jenkins-github-submodules.png]]

그리고 아래에는 Script Path 가 있는데, Jenkinsfile 이라고 적어준다.  

그런 다음 Spring Project 의 최상단에 Jenkinsfile 을 생성해준다. 내부는 다음과 같다. 

```text
pipeline {  
    agent any  
  
    environment {  
        // Define Docker image tag and credentials ID  
        DOCKER_IMAGE = 'neupinion/neupinion:1.0'  
        DOCKER_CREDS = 'docker_hub'  
    }  
  
    stages {  
        stage('Prepare Environment') {  
            steps {  
                // Make the Gradle wrapper script executable  
                sh 'chmod +x gradlew'  
            }  
        }  
  
        stage('Build with Gradle') {  
            steps {  
                // Clean and build the project using Gradle wrapper  
                sh './gradlew clean bootJar'  
            }  
        }  
  
        stage('Build Docker Image') {  
            steps {  
                // Build the Docker image  
                sh "docker build -t ${DOCKER_IMAGE} ."            }  
        }  
  
        stage('Push to Docker Hub') {  
            steps {  
                // Log in to Docker Hub with --password-stdin  
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDS, usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {  
                    sh "echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USERNAME} --password-stdin"                }  
                // Push the image to Docker Hub  
                sh "docker push ${DOCKER_IMAGE}"  
            }  
        }  
    }  
  
    post {  
        always {  
            // Post actions like cleaning up, notifications, etc.  
            echo 'Build process completed.'  
        }  
    }  
}
```