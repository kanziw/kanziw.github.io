---
layout: default
title:  "Jekyll 에 tag 달기"
date:   2017-01-04 00:00:01
categories: blog
tags: [jekyll]
---

# Jekyll 에 tag 달기
> [http://tech.kakao.com/2016/07/07/tech-blog-story/](http://tech.kakao.com/2016/07/07/tech-blog-story/)

## _config.yml 파일 수정
아래의 내용을 추가한다.

```
collections:
  tags:
    output: true
    permalink: /tags/:path/

defaults:
  - scope:
      path: ''
      type: tags
    values:
      layout: tag
```

## 파일 추가
* _tags 디렉터리 생성 후 태그로 사용 할 키워드.md 파일을 아래와 같이 생성한다.

```
---
name: 키워드
title: 키워드를 표시할 때 사용 할 값
---
```

## 태깅된 post 보기
* localhost:4000/tags/jekyll 으로 접속하면 볼 수 있다. (원래대로라면...)
* 하지만 _include/ 에 share.html, item.html 등이 없어 되질 않는다. kakao 가 나와 다른 theme 을 쓰거나 버전이 달라서 일 것이다.
