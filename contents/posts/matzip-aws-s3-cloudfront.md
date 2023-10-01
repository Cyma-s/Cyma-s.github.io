---
title   : S3와 CloudFront 연동하기
date    : 2023-06-17 14:46:24 +0900
updated : 2023-06-17 14:46:53 +0900
tags     : 
- aws
- matzip
---

## S3 버킷 생성

### 설정

- 모든 퍼블릭 액세스 차단

버킷 정책은 다음과 같이 설정했다.

```json
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::{버킷 이름}/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::{숫자로 된 계정 id}:distribution/{cloudfront id}"
                }
            }
        }
    ]
}
```

- 버전 관리 설정 X

## CloudFront 생성

원본 도메인에 연결하고자 하는 S3를 선택한다.

원본 액세스는 원본 액세스 제어 설정을 선택한다. (OAC)     
많이 소개하는 OAI는 레거시가 되어 사용하지 않는 것을 권장한다고 한다.    
제어 설정을 생성하여 `서명 요청 (권장)` 을 선택하고, 원본 유형은 S3를 선택한다.     
이 설정 후에는 S3의 버킷 정책을 업데이트해야 한다. 복사할 수 있는 버튼이 생기니 복사해서 그대로 갖다 붙이면 된다. 

웹 애플리케이션 방화벽은 비활성화했다.
설정에서는 `모든 엣지 로케이션에서 사용` 을 선택한다.    

만약 커스텀 도메인이 존재한다면 Route53에 등록된 도메인을 등록하면 된다.