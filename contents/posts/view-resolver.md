---
title: ViewResolver
date: 2023-09-19 11:57:44 +0900
updated: 2023-09-25 00:16:58 +0900
tags:
  - spring
---

## ViewResolver 란?

클라이언트의 HTTP 요청을 어떤 View 에 매핑할 것인지 결정하는 컴포넌트이다.  
주로 MVC 아키텍처에서 사용되며, 컨트롤러에서 리턴된 뷰 이름을 실제로 렌더링할 수 있는 뷰로 매핑하는 작업을 담당한다.  

## 필요성

1. 어떤 뷰 기술을 사용할 것인지 추상화할 수 있다. JSP 를 사용하다가, Json 을 쓸 수도 있는 것이다. 다른 뷰 기술로 전환이 용이하다.
2. 컨트롤러가 뷰를 처리하는 부분을 추상화하여 더 간결하고 가독성 있는 코드를 작성할 수 있다. 
3. 단순히 뷰의 이름만 리턴해도 뷰를 찾을 수 있기 때문에 개발이 편리하다. 

## 구현

```java
package org.springframework.web.servlet;  
  
import java.util.Locale;  
  
import org.springframework.lang.Nullable;  
  
public interface ViewResolver {  

	@Nullable  
    View resolveViewName(String viewName, Locale locale) throws Exception;  
  
}
```

구현은 굉장히 간단하다.  

컨트롤러에서 리턴된 뷰 이름인 `viewName` 을 입력받아 실제 뷰 객체를 찾아 반환한다.  
다국어 지원이 필요한 경우, `Locale` 정보를 사용하여 적절한 지역에 맞는 뷰를 선택할 수 있다.  

`resolveViewName` 는 뷰 이름을 해석할 때 문제가 발생하며 `Exception` 을 던질 수 있다.  

## `InternalResourceViewResolver`

JSP 를 렌더링하는 `ViewResolver` 구현체이다.  
`UrlBasedViewResolver` 를 상속 받은 클래스이다.  

```java
package org.springframework.web.servlet.view;  
  
import org.springframework.lang.Nullable;  
import org.springframework.util.ClassUtils;  
  
public class InternalResourceViewResolver extends UrlBasedViewResolver {  
  
    private static final boolean jstlPresent = ClassUtils.isPresent(  
          "jakarta.servlet.jsp.jstl.core.Config", InternalResourceViewResolver.class.getClassLoader());  
  
    @Nullable  
    private Boolean alwaysInclude;  
  
  
	public InternalResourceViewResolver() {  
       Class<?> viewClass = requiredViewClass();  
       if (InternalResourceView.class == viewClass && jstlPresent) {  
          viewClass = JstlView.class;  
       }  
       setViewClass(viewClass);  
    }  
  
    public InternalResourceViewResolver(String prefix, String suffix) {  
       this();  
       setPrefix(prefix);  
       setSuffix(suffix);  
    }  
  
    public void setAlwaysInclude(boolean alwaysInclude) {  
       this.alwaysInclude = alwaysInclude;  
    }  
  
  
    @Override  
    protected Class<?> requiredViewClass() {  
       return InternalResourceView.class;  
    }  
  
    @Override  
    protected AbstractUrlBasedView instantiateView() {  
       return (getViewClass() == InternalResourceView.class ? new InternalResourceView() :  
             (getViewClass() == JstlView.class ? new JstlView() : super.instantiateView()));  
    }  
  
    @Override  
    protected AbstractUrlBasedView buildView(String viewName) throws Exception {  
       InternalResourceView view = (InternalResourceView) super.buildView(viewName);  
       if (this.alwaysInclude != null) {  
          view.setAlwaysInclude(this.alwaysInclude);  
       }  
       view.setPreventDispatchLoop(true);  
       return view;  
    }  
  
}
```

`InternalResourceViewResolver(String prefix, String suffix)` 로 접두사, 접미사를 인자로 받아 생성할 수 있다. 다음과 같은 `ViewResolver` 가 있고, "home" 이라는 뷰 이름을 반환하면 `InternalResourceViewResolver` 가 `/WEB-INF/views/home.jsp` 같은 실제 경로로 자동으로 변환해준다. 이를 통해 뷰 경로에 대한 하드 코딩을 줄이고, 뷰 이름만으로도 뷰를 유연하게 지정할 수 있다.  

```java
InternalResourceViewResolver resolver = new InternalResourceViewResolver("/WEB-INF/views/", ".jsp");
```



`requiredViewClass()` : `ViewResolver` 가 요구하는 뷰 클래스의 타입을 반환한다. `InternalResourceView.class` 를 반환한다.  

`buildView(String viewName)` : 주어진 뷰 이름으로 뷰 객체를 생성하고, 설정을 적용한 뒤 반환한다.  

다음과 같은 코드로 

```java
public UrlBasedViewResolverRegistration jsp(String prefix, String suffix) {  
    InternalResourceViewResolver resolver = new InternalResourceViewResolver();  
    resolver.setPrefix(prefix);  
    resolver.setSuffix(suffix);  
    this.viewResolvers.add(resolver);  
    return new UrlBasedViewResolverRegistration(resolver);  
}
```

## `ContentNegotiatingViewResolver`

`content-type` 이 주어진 경우 사용하는 `ViewResolver` 이다.  

```java
package org.springframework.web.servlet.view;  
  
import java.util.ArrayList;  
import java.util.Collection;  
import java.util.Collections;  
import java.util.LinkedHashSet;  
import java.util.List;  
import java.util.Locale;  
import java.util.Map;  
import java.util.Set;  
  
import jakarta.servlet.ServletContext;  
import jakarta.servlet.http.HttpServletRequest;  
import jakarta.servlet.http.HttpServletResponse;  
  
import org.springframework.beans.factory.BeanFactoryUtils;  
import org.springframework.beans.factory.InitializingBean;  
import org.springframework.core.Ordered;  
import org.springframework.core.annotation.AnnotationAwareOrderComparator;  
import org.springframework.http.MediaType;  
import org.springframework.lang.Nullable;  
import org.springframework.util.Assert;  
import org.springframework.util.CollectionUtils;  
import org.springframework.util.MimeTypeUtils;  
import org.springframework.util.StringUtils;  
import org.springframework.web.HttpMediaTypeNotAcceptableException;  
import org.springframework.web.accept.ContentNegotiationManager;  
import org.springframework.web.accept.ContentNegotiationManagerFactoryBean;  
import org.springframework.web.context.request.RequestAttributes;  
import org.springframework.web.context.request.RequestContextHolder;  
import org.springframework.web.context.request.ServletRequestAttributes;  
import org.springframework.web.context.request.ServletWebRequest;  
import org.springframework.web.context.support.WebApplicationObjectSupport;  
import org.springframework.web.servlet.HandlerMapping;  
import org.springframework.web.servlet.SmartView;  
import org.springframework.web.servlet.View;  
import org.springframework.web.servlet.ViewResolver;  
  
public class ContentNegotiatingViewResolver extends WebApplicationObjectSupport  
       implements ViewResolver, Ordered, InitializingBean {  
  
    @Nullable  
    private ContentNegotiationManager contentNegotiationManager;  
  
    private final ContentNegotiationManagerFactoryBean cnmFactoryBean = new ContentNegotiationManagerFactoryBean();  
  
    private boolean useNotAcceptableStatusCode = false;  
  
    @Nullable  
    private List<View> defaultViews;  
  
    @Nullable  
    private List<ViewResolver> viewResolvers;  
  
    private int order = Ordered.HIGHEST_PRECEDENCE;  
  
  
    public void setContentNegotiationManager(@Nullable ContentNegotiationManager contentNegotiationManager) {  
       this.contentNegotiationManager = contentNegotiationManager;  
    }  
  
    @Nullable  
    public ContentNegotiationManager getContentNegotiationManager() {  
       return this.contentNegotiationManager;  
    }  
  
    public void setUseNotAcceptableStatusCode(boolean useNotAcceptableStatusCode) {  
       this.useNotAcceptableStatusCode = useNotAcceptableStatusCode;  
    }  
  
    public boolean isUseNotAcceptableStatusCode() {  
       return this.useNotAcceptableStatusCode;  
    }  
  
    public void setDefaultViews(List<View> defaultViews) {  
       this.defaultViews = defaultViews;  
    }  
  
    public List<View> getDefaultViews() {  
       return (this.defaultViews != null ? Collections.unmodifiableList(this.defaultViews) :  
             Collections.emptyList());  
    }  
  
    public void setViewResolvers(List<ViewResolver> viewResolvers) {  
       this.viewResolvers = viewResolvers;  
    }  
  
    public List<ViewResolver> getViewResolvers() {  
       return (this.viewResolvers != null ? Collections.unmodifiableList(this.viewResolvers) :  
             Collections.emptyList());  
    }  
  
    public void setOrder(int order) {  
       this.order = order;  
    }  
  
    @Override  
    public int getOrder() {  
       return this.order;  
    }  
  
  
    @Override  
    protected void initServletContext(ServletContext servletContext) {  
       Collection<ViewResolver> matchingBeans =  
             BeanFactoryUtils.beansOfTypeIncludingAncestors(obtainApplicationContext(), ViewResolver.class).values();  
       if (this.viewResolvers == null) {  
          this.viewResolvers = new ArrayList<>(matchingBeans.size());  
          for (ViewResolver viewResolver : matchingBeans) {  
             if (this != viewResolver) {  
                this.viewResolvers.add(viewResolver);  
             }  
          }       }       else {  
          for (int i = 0; i < this.viewResolvers.size(); i++) {  
             ViewResolver vr = this.viewResolvers.get(i);  
             if (matchingBeans.contains(vr)) {  
                continue;  
             }  
             String name = vr.getClass().getName() + i;  
             obtainApplicationContext().getAutowireCapableBeanFactory().initializeBean(vr, name);  
          }  
  
       }       AnnotationAwareOrderComparator.sort(this.viewResolvers);  
       this.cnmFactoryBean.setServletContext(servletContext);  
    }  
  
    @Override  
    public void afterPropertiesSet() {  
       if (this.contentNegotiationManager == null) {  
          this.contentNegotiationManager = this.cnmFactoryBean.build();  
       }  
       if (this.viewResolvers == null || this.viewResolvers.isEmpty()) {  
          logger.warn("No ViewResolvers configured");  
       }  
    }  
  
    @Override  
    @Nullable    
    public View resolveViewName(String viewName, Locale locale) throws Exception {  
       RequestAttributes attrs = RequestContextHolder.getRequestAttributes();  
       Assert.state(attrs instanceof ServletRequestAttributes, "No current ServletRequestAttributes");  
       List<MediaType> requestedMediaTypes = getMediaTypes(((ServletRequestAttributes) attrs).getRequest());  
       if (requestedMediaTypes != null) {  
          List<View> candidateViews = getCandidateViews(viewName, locale, requestedMediaTypes);  
          View bestView = getBestView(candidateViews, requestedMediaTypes, attrs);  
          if (bestView != null) {  
             return bestView;  
          }  
       }  
       String mediaTypeInfo = logger.isDebugEnabled() && requestedMediaTypes != null ?  
             " given " + requestedMediaTypes.toString() : "";  
  
       if (this.useNotAcceptableStatusCode) {  
          if (logger.isDebugEnabled()) {  
             logger.debug("Using 406 NOT_ACCEPTABLE" + mediaTypeInfo);  
          }  
          return NOT_ACCEPTABLE_VIEW;  
       }  
       else {  
          logger.debug("View remains unresolved" + mediaTypeInfo);  
          return null;  
       }  
    }  
    
	@Nullable  
    protected List<MediaType> getMediaTypes(HttpServletRequest request) {  
       Assert.state(this.contentNegotiationManager != null, "No ContentNegotiationManager set");  
       try {  
          ServletWebRequest webRequest = new ServletWebRequest(request);  
          List<MediaType> acceptableMediaTypes = this.contentNegotiationManager.resolveMediaTypes(webRequest);  
          List<MediaType> producibleMediaTypes = getProducibleMediaTypes(request);  
          Set<MediaType> compatibleMediaTypes = new LinkedHashSet<>();  
          for (MediaType acceptable : acceptableMediaTypes) {  
             for (MediaType producible : producibleMediaTypes) {  
                if (acceptable.isCompatibleWith(producible)) {  
                   compatibleMediaTypes.add(getMostSpecificMediaType(acceptable, producible));  
                }  
             }          }          List<MediaType> selectedMediaTypes = new ArrayList<>(compatibleMediaTypes);  
          MimeTypeUtils.sortBySpecificity(selectedMediaTypes);  
          return selectedMediaTypes;  
       }  
       catch (HttpMediaTypeNotAcceptableException ex) {  
          if (logger.isDebugEnabled()) {  
             logger.debug(ex.getMessage());  
          }  
          return null;  
       }  
    }  
    
    @SuppressWarnings("unchecked")  
    private List<MediaType> getProducibleMediaTypes(HttpServletRequest request) {  
       Set<MediaType> mediaTypes = (Set<MediaType>)  
             request.getAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);  
       if (!CollectionUtils.isEmpty(mediaTypes)) {  
          return new ArrayList<>(mediaTypes);  
       }  
       else {  
          return Collections.singletonList(MediaType.ALL);  
       }  
    }  
    
	private MediaType getMostSpecificMediaType(MediaType acceptType, MediaType produceType) {  
       produceType = produceType.copyQualityValue(acceptType);  
       if (acceptType.isLessSpecific(produceType)) {  
          return produceType;  
       }  
       else {  
          return acceptType;  
       }  
    }  
    
    private List<View> getCandidateViews(String viewName, Locale locale, List<MediaType> requestedMediaTypes)  
          throws Exception {  
  
       List<View> candidateViews = new ArrayList<>();  
       if (this.viewResolvers != null) {  
          Assert.state(this.contentNegotiationManager != null, "No ContentNegotiationManager set");  
          for (ViewResolver viewResolver : this.viewResolvers) {  
             View view = viewResolver.resolveViewName(viewName, locale);  
             if (view != null) {  
                candidateViews.add(view);  
             }  
             for (MediaType requestedMediaType : requestedMediaTypes) {  
                List<String> extensions = this.contentNegotiationManager.resolveFileExtensions(requestedMediaType);  
                for (String extension : extensions) {  
                   String viewNameWithExtension = viewName + '.' + extension;  
                   view = viewResolver.resolveViewName(viewNameWithExtension, locale);  
                   if (view != null) {  
                      candidateViews.add(view);  
                   }  
                }             }          }       }       if (!CollectionUtils.isEmpty(this.defaultViews)) {  
          candidateViews.addAll(this.defaultViews);  
       }  
       return candidateViews;  
    }  
  
    @Nullable  
    private View getBestView(List<View> candidateViews, List<MediaType> requestedMediaTypes, RequestAttributes attrs) {  
       for (View candidateView : candidateViews) {  
          if (candidateView instanceof SmartView smartView) {  
             if (smartView.isRedirectView()) {  
                return candidateView;  
             }  
          }       }       for (MediaType mediaType : requestedMediaTypes) {  
          for (View candidateView : candidateViews) {  
             if (StringUtils.hasText(candidateView.getContentType())) {  
                MediaType candidateContentType = MediaType.parseMediaType(candidateView.getContentType());  
                if (mediaType.isCompatibleWith(candidateContentType)) {  
                   mediaType = mediaType.removeQualityValue();  
                   if (logger.isDebugEnabled()) {  
                      logger.debug("Selected '" + mediaType + "' given " + requestedMediaTypes);  
                   }  
                   attrs.setAttribute(View.SELECTED_CONTENT_TYPE, mediaType, RequestAttributes.SCOPE_REQUEST);  
                   return candidateView;  
                }  
             }          }       }       return null;  
    }  
  
  
    private static final View NOT_ACCEPTABLE_VIEW = new View() {  
  
       @Override  
       @Nullable       
       public String getContentType() {  
          return null;  
       }  
  
       @Override  
       public void render(@Nullable Map<String, ?> model, HttpServletRequest request, HttpServletResponse response) {  
          response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);  
       }  
    };  
}
```

## `@ResponseBody`

`@ResponseBody` 어노테이션을 사용하면 메서드 반환값이 뷰를 통해 렌더링 되는 것이 아니라, HTTP Response Body 에 직접 작성된다.  

- `HttpMessageConverter` 메커니즘: `HttpMessageConverter` 구현체들을 사용하여 Java 객체를 HTTP 요청과 응답 메시지로 변환한다.  
- JSON 변환: `MappingJackson2HttpMessageConverter` 가 Jackson 라이브러리를 사용하여 `HttpMessageConverter` 를 구현한다.  

다음과 같은 과정으로 변환된다.  

1. Controller 메서드가 호출되고 `@ResponseBody` 어노테이션이 있는 메서드의 반환값을 변환해야 할 때, 적절한 `HttpMessageConverter` 를 찾기 위해 등록된 리스트를 순회한다. (JSON 뿐만 아니라 XML, RSS 등 여러 가지 형태가 있을 수 있기 때문이다.)
2. JSON 변환을 위해 `MappingJackson2HttpMessageConverter` 를 찾아 사용한다.  
3. `MappingJackson2HttpMessageConverter` 가 Java 객체를 JSON 문자열로 변환한다.  
4. HTTP Response Body 에 쓰여진다.  

구체적인 코드는 아래에 있다. 

```java
package org.springframework.http.converter.json;  
  
import java.io.IOException;  
import java.util.Collections;  
import java.util.List;  
  
import com.fasterxml.jackson.core.JsonGenerator;  
import com.fasterxml.jackson.databind.ObjectMapper;  
  
import org.springframework.http.MediaType;  
import org.springframework.lang.Nullable;  
  
public class MappingJackson2HttpMessageConverter extends AbstractJackson2HttpMessageConverter {  
  
    private static final List<MediaType> problemDetailMediaTypes =  
          Collections.singletonList(MediaType.APPLICATION_PROBLEM_JSON);  
  
  
    @Nullable  
    private String jsonPrefix;  
  
  
    public MappingJackson2HttpMessageConverter() {  
       this(Jackson2ObjectMapperBuilder.json().build());  
    }  
  
    public MappingJackson2HttpMessageConverter(ObjectMapper objectMapper) {  
       super(objectMapper, MediaType.APPLICATION_JSON, new MediaType("application", "*+json"));  
    }  
  
  
    public void setJsonPrefix(String jsonPrefix) {  
       this.jsonPrefix = jsonPrefix;  
    }  
  
    public void setPrefixJson(boolean prefixJson) {  
       this.jsonPrefix = (prefixJson ? ")]}', " : null);  
    }  
  
  
    @Override  
    protected List<MediaType> getMediaTypesForProblemDetail() {  
       return problemDetailMediaTypes;  
    }  
  
    @Override  
    protected void writePrefix(JsonGenerator generator, Object object) throws IOException {  
       if (this.jsonPrefix != null) {  
          generator.writeRaw(this.jsonPrefix);  
       }  
    }  
}
```

`generator.writeRaw()` 는 진짜로 쓰는 코드다.  

```java
@Override  
public void writeRaw(String text) throws IOException  
{  
    // Nothing to check, can just output as is  
    int len = text.length();  
    int room = _outputEnd - _outputTail;  
  
    if (room == 0) {  
        _flushBuffer();  
        room = _outputEnd - _outputTail;  
    }  
    // But would it nicely fit in? If yes, it's easy  
    if (room >= len) {  
        text.getChars(0, len, _outputBuffer, _outputTail);  
        _outputTail += len;  
    } else {  
        writeRawLong(text);  
    }  
}
```

