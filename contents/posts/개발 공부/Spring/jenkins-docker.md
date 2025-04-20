---
title: Jenkins 로 docker image 빌드 후 배포하기
date: 2024-01-07 15:24:31 +0900
updated: 2024-01-22 23:02:03 +0900
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

## Docker Hub 에서 이미지 받아서 배포하기

이제 새로운 파이프라인을 만든다.  

build 파이프라인이 stable 할 때만 해당 프로젝트가 실행되도록 한다.  

![[jenkins-build-trigger.png]]

다음으로, Send files or execute commands over SSH 를 선택한다.  
Exec command 에는 다음과 같이 적어주었다.  

```shell
sudo docker stop neupinion 
sudo docker rm -f $(sudo docker ps -qa)
sudo docker image prune -a -f
sudo docker pull neupinion/neupinion:latest && \
sudo docker run -d -p 8080:8080 \
    -p 8090:8090 \
    -e "SPRING_PROFILE=prod" \
    --name neupinion \
    neupinion/neupinion:latest
sudo docker-compose up -d
```

Build 가 완료되면 Slack Notification 으로 Success, Failure 를 결과로 알려주도록 설정한다.  

이로써 모든 설정이 완료되었다.  
Github main 브랜치에 코드가 push 되면, Jenkins 서버에서 코드를 pull 받아서 build 한 뒤 Docker hub 로 이미지를 만들고, Docker hub 에 업로드 된 이미지를 프로덕션 서버에서 pull 받아 배포하는 과정을 자동화할 수 있었다.  

굉장히 많은 삽질을 했지만, 결국은 해냈다.