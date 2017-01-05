---
layout: post  
title: Jekyll 시작하기 (Max OS)  
date: 2017-01-05 00:00:00  
categories: blog  
tags: [jekyll, dbyll]  
description: Jekyll 으로 개발자스러운 블로그 운영하기  
---

### 들어가며...
요즘 개발자들은 아래의 특징들이 있다고 생각한다.
* Markdown 문법을 이용한 글쓰기
* Github 을 이용한 문서 정리
* 지식 공유
* 공유한 지식에 대한 피드백

많은 방법들을 찾아보았지만 나를 가장 만족시킨 방법은 바로 Jekyll + Github 을 이용한 블로깅 이다.  
그 중 Jekyll 의 dbyll theme 을 사용하기로 했는데, 이는 아래의 이유 때문이다.
* 깔끔한 디자인 (디자인은 [링크](http://jekyllthemes.org/)에서 골라 적용하였다.)
* Category / Tag 별로 글을 볼 수 있다.

<br />
Jekyll + Github 를 이용한 블로그 생성의 순서는 대충 아래와 같다.
1. ID.github.io 생성
  * github.com 페이지에서 ID.github.io Repository 를 추가

1. Ruby & RubyGems Install
```
$ curl -sSL https://get.rvm.io | bash -s stable --ruby
$ . ~/.rvm/scripts/rvm
```

1. jekyll & bundle Install
```
$ gem install jekyll bundle
```

1. Clone your Repository
```
# 내 경우엔 ~/dev 에 생성하였다.
($ mkdir ~/dev)
$ cd ~/dev
$ git clone https://github.com/kanziw/kanziw.github.io.git
$ cd kanziw.github.io
```

1. Unpacking Theme file
  * [링크](http://jekyllthemes.org/)에서 고른 테마 압축파일을 다운 받아 Clone 한 Repository 디렉터리에 압축을 푼다.
  * **숨김파일로 되어 있는 `.gitignore` 의 내용도 알아서 활용할 것**

1. Install Theme
```
$ cd ~/dev/kanziw.github.io
$ bundle insatll
```

1. 설치 된 블로그를 `http://localhost:4000` 에서 확인하기
```
$ bundle exec jekyll serve --watch
```

다음 포스트에선 글을 작성하는 방법에 대해 공유하고자 한다.
