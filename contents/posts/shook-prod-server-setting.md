---
title   : S-HOOK 운영 서버 설정 실록
date    : 2023-08-11 18:17:25 +0900
updated : 2023-08-11 18:17:54 +0900
tags     : 
- aws
- shook
- 레벨3
- 우테코
---

## 운영 서버 설정

커스텀 로그 저장을 위해 `/etc/log` 내부에 app, warn, error 디렉터리를 추가했다. (`/etc/log` 는 새로 만든 디렉터리)
### nginx 설정

먼저 nginx 를 설치한다.

```bash
sudo apt-get install nginx
```

```bash
cd /etc/nginx
```

### Certbot 설정

SSL 인증서 발급을 위해 Certbot 을 설치한다. 

```bash
sudo apt-get install certbot python3-certbot-nginx
```

여러 개의 도메인 인증서 발급을 위해 다음과 같이 작성한다.

```bash
sudo certbot --nginx -d s-hook.com -d www.s-hook.com
```

팀 이메일을 입력하고 생성했더니 에러가 발생했다.    

문제는... 가비아 서브 도메인이 잘못 설정되어 있었다.     

기존에는 CNAME 으로 호스트 이름에 dev, 값에 `s-hook.com` 으로 해두었는데, 기존 `s-hook.com` 개발 서버로 연결되었다. CNAME 을 사용하면 기존 도메인으로 리다이렉트 해주는 듯 하다.      

해결 방법은 쉽다!     
A 레코드로 호스트 이름에 새로운 서브도메인으로 사용할 prefix를 작성하고 (ex. dev) 값에 새로운 운영 서버 ip 를 작성한다.      

![[gabia-cname-a-record.png]]

기존 개발 서버가 사용하는 도메인을 운영 서버에서 등록하려고 했는데, 등록할 수 없다는 에러가 발생했다.     

원인은 이미 도메인이 연결되어서 그렇다! 

### 개발 서버 도메인 인증서 삭제

기존에 개발 서버에서 `s-hook.com` 을 사용하고 있었기 때문에 `s-hook.com` 을 사용하기 위해서는 개발 서버의 인증서를 삭제해야 한다.     

`certbot delete --cert-name s-hook.com` 로 기존 도메인을 삭제했다.     
또한 nginx default 파일 (`/etc/nginx/sites-enabled`)에서 certbot 이 작성한 코드를 삭제한다.

개발 서버에는 개발 서브 도메인을 새롭게 연결해주었다.     

프론트엔드 .env.production 파일의 도메인 이름을 변경해준 뒤, frontend 파일들을 재빌드했다.

```bash
sudo npm ci
sudo npm run build
```

이렇게 하면 `dev.s-hook.com` 은 개발서버로 연결되어 새롭게 접속할 수 있다.

### 다시 운영 서버 인증서 발급

운영 서버에서 해당 도메인에 대해 새롭게 인증서를 발급받는다.      

```bash
sudo certbot --nginx -d s-hook.com www.s-hook.com
```

여기까지 진행하면 certbot 이 nginx 파일을 바꿔준다.    

```bash
nginx -t
sudo service nginx restart
```

### 서브 모듈 설정

S-HOOK 은 민감한 정보를 보호하기 위해 서브 모듈을 사용한다.     

그러나 서버에 아무 설정도 하지 않으면 운영 서버에서 서브 모듈을 pull 받아올 수 없다. private 레포이기 때문에 권한이 없기 때문이다.     
따라서 운영 서버에도 서브 모듈을 사용하려면 SSH 설정을 해주어야 한다!     

```bash
ssh-keygen -t rsa
```

다음과 같이 ssh 키를 생성한다.      
생성된 ssh key를 서브모듈 레포지토리 owner 의 SSH Key 에 넣어주면 된다.     

![[ssh-key-register.png]]

새롭게 서브모듈을 설정하므로 init 을 해주어야 한다.    

```bash
git submodule init
git submodule update
```

여기까지 했는데 갑자기 Username 을 적으라고 한다.

![[submodule-exception.png]]

아무리 Username 과 Password 를 쳐도 소용 없다.    
서브모듈을 등록하기 위해 서브 모듈을 삭제하고, 캐시도 지웠다.    

```bash
rm -rf shook-security/
git rm -r --cached shook-security
```

EC2에서 발급한 Key 를 등록하고, Git Submodule add 를 다시 진행한다.    
SSH 주소는 서브모듈의 ssh git 링크를 가져와야 한다.     

![[submodule-ssh-address.png]]

중간에 npm 이 없어서 `sudo apt-get install npm` 을 해주었다.    

순탄하게 설치될 줄 알았으나.... npm 설치하는데 서버가 죽을뻔했다.    
아예 서버 접속이 안 됐다.     
한 10분 기다려서 접속됐는데 free -m 해보니 메모리를 다 쓰고 있었다.     

`npm --version` 하는데 10분째다.     

![[dying-shook-prod-server.png]]

그래서 일단 타자라도 치기 위해 npm 을 죽였다...ㅋㅋㅋ    

```bash
sudo kill -9 3897
```

### 스왑 메모리 설정

이런 일이 발생하지 않게 하기 위해 스왑 메모리를 설정했다.    

```bash
sudo fallocate -l 4G /swapfile # 스왑 메모리의 크기는 4G 로 설정했다. 
sudo chmod 600 /swapfile # 읽기 / 쓰기 권한을 소유자에게 부여한다.
sudo mkswap /swapfile  # swapfile 설정
sudo swapon /swapfile # swap 메모리 켜기
```

### 다시 npm 설치

잘못된 버전의 npm 을 삭제하고 LTS npm 을 설치한다.

```bash
sudo apt-get remove npm
sudo apt-get install npm
```

도밥 왈, npm install 은 frontend 파일이 있는 곳에서 수행해야 한다고 한다.     

node 버전이 안 맞아서 node 버전 업그레이드도 해줬다.    

```bash
sudo n lts  # 노드 최신 버전 업그레이드
hash -r # 캐시 삭제
```

frontend 에서 `sudo npm install` 을 수행한다.    

### frontend 배포

frontend 가 요청을 보낼 url 을 설정해준다.    

`/frontend/.env` 의 `.env.production` 에 API 를 요청할 도메인 이름을 적어준 후, frontend 파일을 빌드한다.    

```bash
sudo npm ci
sudo npm run build
```

### Java 설치

백엔드 배포를 하다가 Java 가 없는 걸 발견했다.     
즉시 설치해주자. 

```bash
wget -O- [https://apt.corretto.aws/corretto.key](https://apt.corretto.aws/corretto.key) | sudo apt-key add -  
 sudo add-apt-repository ‘deb [https://apt.corretto.aws](https://apt.corretto.aws/) stable main’

sudo apt-get install -y java-17-amazon-corretto-jdk
```

백엔드 배포를 했더니 에러가 발생했다!! build가 잘 됐다는 뜻이다 드디어 ㅠㅠㅠ

![[shook-prod-slack-notification.png]]

운영 DB 를 설정해주지 않았기 때문에 에러가 발생했다.      
그래도 슬랙으로 에러 알림이 잘 오는 것을 확인했다.    

이제 운영 DB를 설정해보자!
## 운영 DB 설정하기

### pem 키 옮기기

DB 서버는 프라이빗 ip 만 존재하기 때문에 운영 서버로만 접근할 수 있다.     
그래서 로컬에 있는 운영 서버 pem 키를 운영 서버로 전송했다.     

```bash
scp -i 2023-shook.pem 2023-shook.pem ubuntu@우리ip:~
```

bad permission 에러를 막기 위해 pem key 에 권한을 부여한다.    

```bash
chmod 400 2023-shook.pem
```

운영 서버에서 DB 서버로 접속한다.     

```bash
ssh -i pemkey이름 ubuntu@DB서버ip
```

### MySQL 설치

MySQL 을 사용할 것이므로 MySQL 을 설치해준다.    

```bash
sudo apt-get update
sudo apt-get install mysql-server
```

MySQL을 실행한다.     

```bash
sudo systemctl start mysql
```

다 했으니 MySQL 에 접속해보자!

```bash
sudo /usr/bin/mysql -u root -p
```

잘 접속된다!

팀 내부에서 root 대신 새로운 사용자를 등록하기로 했기 때문에, MySQL 에 새로운 사용자를 추가하자.

### MySQL 사용자 추가

새로운 사용자를 추가하기 위해서는 다음과 같이 설정해주면 된다.

```mysql
create user 사용자이름@운영서버ip identified by '비밀번호';
```

하다가 잘못된 유저를 만든 경우 (우리의 경우...) 유저를 삭제해준다.    

```mysql
drop user '사용자이름'@'호스트';
```

사용자를 만든 뒤에, 권한을 설정해준다.    
모든 권한을 주려면 아래와 같이 설정한다.    

```mysql
grant all privileges on *.* to '사용자이름'@'호스트';
flush privileges;
```

### 데이터베이스 생성

운영 서버에서 사용할 데이터베이스를 생성해준다.   

```mysql
create database 데이터베이스이름;
```

현재 `sql.init=always` 설정이 되어 있기 때문에 data.sql 을 삭제했다.    

기존에 dev 용으로 사용하던 더미 데이터가 운영 DB에 올라가면 안 되기 때문이다.     
이제 더 이상 `sql.init` 설정은 사용하지 않을 예정이다.    

### bind-address

외부 접속을 허용해주기 위해 `/etc/mysql/mysql.conf.d` 의 `mysqld.cnf` 에 들어가서 bind-address 를 수정해준다.   

설정 파일을 수정하고, mysql 을 재시작한다.

```bash
sudo systemctl restart mysql
```

## 백엔드 배포

### log 디렉터리 권한 에러

배포를 시작하는데 log 에 권한 에러가 발생했다.    
로그와 관련된 모든 디렉터리에 권한을 할당해주었다.     

```bash
sudo chmod 775 etc/
sudo chmod 777 app
sudo chmod 777 error
sudo chmod 777 warn
```

이렇게 했더니 DB Connection Refused 가 발생했다.    
로그 파일을 보다보니까 서버 시간 설정을 까먹었다는 사실을 발견했다.
### 서버 시간 설정하기

서버 시간을 서울 시간대로 변경해주었다.    

```bash
sudo timedatectl set-timezone Asia/Seoul
```

이 과정을 거쳐... 드디어 백엔드 서버를 배포했더니 잘 됐다!!!!!

![[shook-prod-swagger.png]]

swagger 가 열리는 걸 보니 잘 돌아갑니다 ^^

너무 힘드네요 진짜로