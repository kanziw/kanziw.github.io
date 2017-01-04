---
layout: default
title:  "Jekyll 시작하기 (Max OS)"
categories: blog
---

# Jekyll 시작하기 (Max OS)
> jekyll-cayman-theme 사용

## 주요 특징
* github 에서 제공하는 ID.github.io 사용 가능
* MarkDown 을 이용한 글 작성 기능

## ID.github.io 생성
* github.com 페이지에서 ID.github.io Repository 를 추가

## PreInstall
```
# Ruby & RubyGems
$ curl -sSL https://get.rvm.io | bash -s stable --ruby
$ . ~/.rvm/scripts/rvm

# jekyll & bundle
$ gem install jekyll bundle
```

## Clone your Repositary
```
# 내 경우엔 ~/dev 에 생성하였다.
($ mkdir ~/dev)
$ cd ~/dev
$ git clone https://github.com/kanziw/kanziw.github.io.git
$ cd kanziw.github.io
```


## Install Cayman Theme
> https://github.com/jasonlong/cayman-theme

* [파일](http://github.com/pietromenna/jekyll-cayman-theme/archive/master.zip) 다운로드 후 Clone 한 Repositary 디렉터리에 압축을 푼다.
  * 숨김파일로 되어 있는 `.gitignore` 도 함께 옮길 것
* 서버 실행 with watch
```
$ cd ~/dev/kanziw.github.io
$ jekyll serve --watch
```
