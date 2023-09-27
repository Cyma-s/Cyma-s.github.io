---
title   : MIME Type 알아보기 - 이미지 링크로 들어갔을 때 다운로드가 된다면? 
date    : 2023-06-22 16:10:35 +0900
updated : 2023-06-22 16:11:11 +0900
tags     : 
- matzip
- 개발
- aws
- trouble-shooting
---

## 어떤 이미지 링크는 다운로드가 된다

동일한 S3 버킷으로 연결되는 cloudfront 링크로 이미지를 조회했을 때, 어떤 이미지 링크는 브라우저의 창으로 이미지가 보여지는 반면 어떤 이미지는 이미지 창이 열리지 않고 다운로드가 됐다.

어떤 차이였을까?

## MIME 이란?

> MIME (Multipurpose Internet Mail Extensions) 유형은 인터넷에서 데이터를 전송하고 식별하기 위해 사용되는 표준화된 방법입니다. - GPT 선생

MIME(마임이라고 읽는다)은 일종의 인코딩 방식이다. 이메일 시스템에서 파일 첨부를 위해 개발되었으나, 웹을 통해 여러 형태의 파일을 전달하는데 널리 사용되고 있다.

MIME으로 인코딩한 파일은 'content-type' 정보를 파일의 앞 부분에 담고 있다. 

MIME 유형은 두 부분으로 구성된다.    
첫 번째 부분은 주 유형 (Primary Type) 이다. Ex. `text`, `image`, `application` 등     
두 번째 부분은 부 유형 (Subtype) 이다. Ex. `plain`, `jpeg`, `pdf` 등    
두 부분은 `/` 로 구분된다.

다음은 몇 가지 예시이다.

`text/plain`    
`image/jpeg`     
`application/pdf`     

파이썬으로 MIME 으로 인코딩한 파일의 바이너리 코드를 열어보면 파일의 시작 부분에 확장자가 명시되어 있다.    

```text
b'\x89PNG\r\n\x1a ...
```

이처럼 PNG 이미지 파일의 바이너리 코드에는 파일의 매직 넘버인 PNG가 들어있다.     

```python
with open('image.png', 'rb') as file:  
    byte_code = file.read()  
  
print(byte_code)
```

바이너리 코드는 위의 파이썬 코드로 확인할 수 있다.

## S3의 어떤 설정 때문이었을까?

확인해보니, 업로드된 이미지의 `Content-Type` 이  `application/octet-stream` 으로 설정되어 있었다.

(업로드된 파일의 메타데이터 편집에 들어가면 `Content-Type` 을 확인할 수 있다)

![[octet-mime-type.png]]

`application/octet-stream` 은 이진 파일을 위한 기본값이다.     
8-bit 바이너리 배열을 의미하며, http나 email 상에서 application 이 지정되지 않았거나 형식을 모를 때 사용한다.     
즉, 브라우저는 `octet-stream` 으로 MIME 유형이 지정된 경우, 바이너리 데이터로만 다운로드가 가능하다.   

기존에 잘 열렸던 이미지의 `Content-Type` 을 확인해보자.    

![[image-mime-type.png]]

`Content-Type` 이 `image/png` 로 잘 설정되어 있는 것을 볼 수 있다.    

## 브라우저에서 이미지 열기로 바꿔보자

```java
@Transactional
public ImageUploadResponse uploadImage(final MultipartFile file) {
	String extension = validateExtension(file);
	PutObjectRequest request = createRequest(file, extension);
	try {
		s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
	} catch (IOException e) {
		throw new UploadFailedException();
	}
	return new ImageUploadResponse("aaa");
}

private PutObjectRequest createRequest(final MultipartFile file, final String extension) {
	String uuid = UUID.randomUUID().toString();
	String key = uuid + EXTENSION_DELIMITER + extension;
	return PutObjectRequest.builder()
			.bucket(bucketName)
			.key(key)
			.contentLength(file.getSize())
			.build();
}
```

기존 코드는 다음과 같다. 

`contentType` 을 지정해주지 않았기 때문에 자동으로 `application/octet-stream` 으로 저장되었다.     
따라서 `contentType` 을 설정해주면 된다.

```java
return PutObjectRequest.builder()
			.bucket(bucketName)
			.key(key)
			.contentLength(file.getSize())
			.contentType(file.getContentType())
			.build();
```

이렇게 바꿔주면 `application/octet-stream` 이 아닌 파일의 `Content-Type` 으로 설정되기 때문에 브라우저가 이미지로 인식한다.     

