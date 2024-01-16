---
title: ForwardedHeaderFilter
date: 2023-08-17 13:33:44 +0900
updated: 2024-01-16 13:33:26 +0900
tags:
  - spring
---

## `ForwardedHeaderFilter`

Spring Framework 에서 제공하는 서블릿 필터이다. `OncePerRequestFilter` 를 상속하고 있다.
리버스 프록시나 로드 밸런서 같은 중개자 서버에 의해 설정된 `X-Forwarded-*` 헤더를 처리하는 역할을 수행한다.

removeOnly 로 구성할 수도 있는데, 이 경우 헤더를 제거하지만 사용하지는 않는다.

### 메서드

- `doFilterInternal` 는 단일 요청 스레드 내에서 요청당 한 번만 호출되도록 보장한다.
- `setRemoveOnly`: `Forwarded`, `X-Forwarded-*` 헤더만 제거되고 그 안의 정보는 무시되는 모드를 활성화한다.

## 역할

1. URL Reconstruction
원본 요청의 스키마 `X-Forwarded-Proto` , 호스트 `X-Forwarded-Host`, 포트 `X-Forwarded-Port` 및 경로 접두사 `X-Forwarded-Prefix` 에 관한 정보를 이용하여 요청 URL 을 재구성한다.
애플리케이션 내에서 `HttpServletRequest` 를 사용해서 URL 정보를 조회할 때, 리버스 프록시나 로드 밸런서 뒤에서의 원래 요청 정보를 바탕으로 한 올바른 URL 정보를 얻을 수 있다.

2. Scheme & Remote Address
`X-Forwarded-Proto` 헤더를 기반으로 요청 스키마 (http, https) 를 업데이트한다.
`X-Forwarded-For` 헤더를 사용하여 원래 클라이언트의 IP 주소를 알아낸다. 이렇게 하면 `HttpServletRequest.getRemoteAddr()` 호출 시 원래 클라이언트의 IP 를 반환할 수 있다.

3. Clearing Forwarded Headers
필터는 처리 후 `X-Forwarded-*` 헤더를 요청에서 제거할 수 있다. 보안 목적으로 유용하다.

## Spring 에 설정하기

`ForwardedHeaderFilter` 는 자동으로 활성화되지 않는다.

```yml
server:
	forward-headers-strategy: framework
```

이렇게 `application.yml` 을 설정해주면 `ForwardedHeaderFilter` 가 자동으로 등록되어 사용될 수 있다.

## 알아보기

지원하는 헤더들은 다음과 같다.  

```java
static {  
    FORWARDED_HEADER_NAMES.add("Forwarded");  
    FORWARDED_HEADER_NAMES.add("X-Forwarded-Host");  
    FORWARDED_HEADER_NAMES.add("X-Forwarded-Port");  
    FORWARDED_HEADER_NAMES.add("X-Forwarded-Proto");  
    FORWARDED_HEADER_NAMES.add("X-Forwarded-Prefix");  
    FORWARDED_HEADER_NAMES.add("X-Forwarded-Ssl");  
    FORWARDED_HEADER_NAMES.add("X-Forwarded-For");  
}
```

### `doFilterInternal`

```java
@Override  
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,  
       FilterChain filterChain) throws ServletException, IOException {  
  
    if (this.removeOnly) {  
       ForwardedHeaderRemovingRequest wrappedRequest = new ForwardedHeaderRemovingRequest(request);  
       filterChain.doFilter(wrappedRequest, response);  
    }  
    else {  
       HttpServletRequest wrappedRequest =  
             new ForwardedHeaderExtractingRequest(request);  
  
       HttpServletResponse wrappedResponse = this.relativeRedirects ?  
             RelativeRedirectResponseWrapper.wrapIfNecessary(response, HttpStatus.SEE_OTHER) :  
             new ForwardedHeaderExtractingResponse(response, wrappedRequest);  
  
       filterChain.doFilter(wrappedRequest, wrappedResponse);  
    }  
}
```

`ForwardedHeaderExtractingRequest` 로 래핑한 뒤, filterChain 으로 전달한다.

#### `ForwardedHeaderRemovingRequest` 

`removeOnly` 가 설정되어 있을 때 변환되는 Request 이다.

```java
private static class ForwardedHeaderRemovingRequest extends HttpServletRequestWrapper {  
  
    private final Set<String> headerNames;  
  
    public ForwardedHeaderRemovingRequest(HttpServletRequest request) {  
       super(request);  
       this.headerNames = headerNames(request);  
    }  
  
    private static Set<String> headerNames(HttpServletRequest request) {  
       Set<String> headerNames = Collections.newSetFromMap(new LinkedCaseInsensitiveMap<>(Locale.ENGLISH));  
       Enumeration<String> names = request.getHeaderNames();  
       while (names.hasMoreElements()) {  
          String name = names.nextElement();  
          if (!FORWARDED_HEADER_NAMES.contains(name)) {  
             headerNames.add(name);  
          }  
       }       return Collections.unmodifiableSet(headerNames);  
    }  
  
    // Override header accessors to not expose forwarded headers  
  
    @Override  
    @Nullable    
    public String getHeader(String name) {  
       if (FORWARDED_HEADER_NAMES.contains(name)) {  
          return null;  
       }  
       return super.getHeader(name);  
    }  
  
    @Override  
    public Enumeration<String> getHeaders(String name) {  
       if (FORWARDED_HEADER_NAMES.contains(name)) {  
          return Collections.emptyEnumeration();  
       }  
       return super.getHeaders(name);  
    }  
  
    @Override  
    public Enumeration<String> getHeaderNames() {  
       return Collections.enumeration(this.headerNames);  
    }  
}
```

`FORWARDED_HEADER_NAMES` 를 요청할 때, 빈 Enumeration list 를 반환하거나, null 을 리턴한다.

### `ForwardedHeaderExtractingRequest`

```java
private static class ForwardedHeaderExtractingRequest extends ForwardedHeaderRemovingRequest {  
  
    @Nullable  
    private final String scheme;  
  
    private final boolean secure;  
  
    @Nullable  
    private final String host;  
  
    private final int port;  
  
    @Nullable  
    private final InetSocketAddress remoteAddress;  
  
    private final ForwardedPrefixExtractor forwardedPrefixExtractor;  
  
  
    ForwardedHeaderExtractingRequest(HttpServletRequest servletRequest) {  
       super(servletRequest);  
  
       ServerHttpRequest request = new ServletServerHttpRequest(servletRequest);  
       UriComponents uriComponents = UriComponentsBuilder.fromHttpRequest(request).build();  
       int port = uriComponents.getPort();  
  
       this.scheme = uriComponents.getScheme();  
       this.secure = "https".equals(this.scheme) || "wss".equals(this.scheme);  
       this.host = uriComponents.getHost();  
       this.port = (port == -1 ? (this.secure ? 443 : 80) : port);  
  
       this.remoteAddress = UriComponentsBuilder.parseForwardedFor(request, request.getRemoteAddress());  
  
       String baseUrl = this.scheme + "://" + this.host + (port == -1 ? "" : ":" + port);  
       Supplier<HttpServletRequest> delegateRequest = () -> (HttpServletRequest) getRequest();  
       this.forwardedPrefixExtractor = new ForwardedPrefixExtractor(delegateRequest, baseUrl);  
    }  
  
  
    @Override  
    @Nullable    
    public String getScheme() {  
       return this.scheme;  
    }  
  
    @Override  
    @Nullable    
    public String getServerName() {  
       return this.host;  
    }  
  
    @Override  
    public int getServerPort() {  
       return this.port;  
    }  
  
    @Override  
    public boolean isSecure() {  
       return this.secure;  
    }  
  
    @Override  
    public String getContextPath() {  
       return this.forwardedPrefixExtractor.getContextPath();  
    }  
  
    @Override  
    public String getRequestURI() {  
       return this.forwardedPrefixExtractor.getRequestUri();  
    }  
  
    @Override  
    public StringBuffer getRequestURL() {  
       return this.forwardedPrefixExtractor.getRequestUrl();  
    }  
  
    @Override  
    @Nullable    
    public String getRemoteHost() {  
       return (this.remoteAddress != null ? this.remoteAddress.getHostString() : super.getRemoteHost());  
    }  
  
    @Override  
    @Nullable    
    public String getRemoteAddr() {  
       return (this.remoteAddress != null ? this.remoteAddress.getHostString() : super.getRemoteAddr());  
    }  
  
    @Override  
    public int getRemotePort() {  
       return (this.remoteAddress != null ? this.remoteAddress.getPort() : super.getRemotePort());  
    }  
}
```

HEADER 에서 `X-Forwarded` 정보를 뽑아내어 baseUrl 을 복원한다.