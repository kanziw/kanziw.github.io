---
layout: post
title: Jekyll 에 글 쓰기
date: 2017-01-07 00:00:00
categories: [blog, jekyll]
tags: [jekyll, dbyll]
description: dbyll 테마가 적용된 Jekyll 에 글 쓰기
comments: true
---

## 들어가며...
Jekyll 을 통해 글을 쓴 다는 것은 모든 것이 갖춰진 텍스트 에디터를 통해 글을 쓰는 것이 아니다.
그렇기 때문에 온갖 글을 꾸밀 수 있는 기능들이 즐비한 에디터를 상상한다면 이 방식은 버리는 것이 낫다.

### Markdown 으로 글 쓰기
Markdown 이 무엇인지, 어떤 문법이 있는지는 다루지 않는다.
내가 생각하는 Markdown 의 장점은 아래와 같다.

#### 1. 언제 어디서나 어떤 에디터로도 규칙에 맞게 글을 편하게 쓸 수 있다.
Windows 를 쓰던 시절에도 어디서나 자유롭게 쓸 수 있는 메모장을 애용하던 나로써는 Markdown 은 신세계와 같았다.
꾸미기엔 옘병인 내게 특정 규칙에만 맞게 글을 쓰면 알아서 이쁘게 출력해준 다는 것은 Amazing 한 일이다...ㅋㅋ
게다가 특정 규칙이라고 하는 말머리(?)들은 글의 문단을 구분지어 주는 역할도 해주기 때문에 .md 파일만 읽어도 글이 잘 읽힌다.

#### 2. 글을 옮길 때 특정 제약조건에 의존하는 경향이 적다.
집에서 시간 날 때마다 예전 tistory 에 썼던 글들을 옮겨오려고 한다.
만약 Markdown 형식의 글들을 옮긴다고만 하면 글을 복붙만 하면 된다.
어차피 변환되는 HTML 은 똑같을 것이고 블로그에 적용된 css 만 수정하면 전체 글을 통일성 있게 게시할 수 있다.

#### 3. 요즘 Hot 하다.
많은 개발자들이 Markdown 으로 글 쓰기 좋아하는 데에는 이유가 있다.
특히 Github 에 쓰는 모든 글들은 Markdown 형식으로 쓸 수 있다.
즉 한번 배우면 많은 곳에서 잘 활용할 수 있는 것이다.

### dbyll 테마의 블로그에서 포스트 작성하기.

#### 파일은 `_posts` 디렉터리 밑에 `YYYY-MM-DD-POST_TITLE.md` 형식으로!

#### 글쓰기
dbyll 테마는 카테고리/태그 별로 글을 모아서 볼 수 있게 해준다.
그러기 위해선 post의 시작을 아래와 같이 해야한다.

```
---
layout: post
title: Jekyll 에 글 쓰기
date: 2017-01-07 00:00:00
categories: [blog, jekyll]
tags: [jekyll, dbyll]
description: dbyll 테마가 적용된 Jekyll 에 글 쓰기
comments: true
---
```

각 항목들에 대한 설명은 아래와 같다.

* layout
  * 어떠한 html layout 을 적용 할 것인가?
  * dbyll 테마는 _layouts 디렉터리 밑에 있는 post.html 을 사용하여 글을 포스팅한다.
* title : 제목
* date
  * 파일 이름을 YYYY-MM-DD-POST_TITLE.md 로 하면 자동으로 글의 시간을 파싱한다.
  * 하지만 만약 같은 날 2개 이상의 포스트를 올리는 경우엔 내가 원하는 대로 포스팅이 써지지가 않는다.
  * 따라서 `2017-01-07 00:00:00` 처럼 포스트별로 특정 시각을 고정시켜 어떤 포스트가 먼저 쓰여진 것인지 알수 있게 할 수 있다.
* categories
  * 어떤 카테고리를 적용시킬 것인가?
  * `[]` 안에 2개 이상의 카테고리를 `,`로 구분지어 넣으면 2개 이상의 카테고리가 적용된다.
    * 단, 이 경우 포스트의 주소가 ~/category1/category2/YYYY/MM/DD/POST_TITLE 처럼 url 주소가 생긴다.
* tags
  * 글의 태그를 나열할 수 있다.
  * categories 처럼 `[]` 안에 `,`로 구분지어 여러개의 tag 를 설정할 수 있다.
* description : 메인 화면에서 보여 질 미리보기 텍스트
* comments
  * disqus 를 이용한 댓글을 허용 할 것인가?
  * 사용하기 위해선 [링크](https://disqus.com/) 에서 disqus 를 추가해 `_config.yml` 에 `disqus: DISQUS_NAME`을 추가한다.
