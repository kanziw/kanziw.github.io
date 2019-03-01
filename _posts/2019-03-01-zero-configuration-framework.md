---
layout: post
title: Zero framework 사용기
date: 2019-03-01 00:00:00
categories: [javascript]
tags: [node, react, express, zero]
description: Zero configuration web framework.
comments: true
---

> 실습한 [링크](https://github.com/kanziw/learn-js/tree/master/zero-configuration)

## Zero?

[공식 사이트](https://zeroserver.io/)에는 아래처럼 소개되어 있다.
> Zero configuration web framework.


## 사용 방법

기본적인 사용 방법은 워낙 간단하여 [공식 사이트](https://zeroserver.io/) 링크로 대체한다.


## 사용 후기

### 장점

1. express & React 를 가볍게 사용하는 프로젝트에 사용하기 간편하다.

2. server & client 코드를 Flat 하게 관리하여 공통으로 리소스를 사용하기 편하다.

3. `md` & `mdx` 를 지원한다.

### 단점

1. 개발용 빌드 속도가 느리다. 빌드가 끝난 뒤 각 API endpoint 나 페이지를 접속하려고 할 때에도 최초엔 느리다. (동적으로 빌드하는 듯) 그리고 hot-reload 가 되는 것 처럼 보이는데 제대로 reload 가 되지 않는다.

2. api method 별로 핸들러를 분리할 수 없다. (단, 아래의 방법으로 극복은 가능해보임, 그리고 express handler 에 next 가 없음)  
https://github.com/kanziw/learn-js/blob/31ab78199812d42e60a34f8ecdcb6bdedde9b3b5/zero-configuration/method.js

3. express 의 일반적인 에러핸들링 기법을 사용할 수 없다. 다만 어차피 2번처럼 wrapping 하여 사용할거면 wrapping 하는 곳에서 공통 에러 핸들링 로직을 추가하면 될듯

4. (3번과 연결하여) express 의 강점 중 하나인 middleware 패턴을 사용하는데 제약이 있다. 각 핸들러마다 middleware 를 import 해야한다.

5. api 의 params 처리가 상대적으로 지저분하다. 가장 가까운 부모 handler 에 배열 형태로 params 가 들어간다.  
https://github.com/kanziw/learn-js/commit/5fa69fca61612163e17fae53c7a3cbf13f0876f2?diff=unified

### And,

* `_hidden` directory 에 있는 리소스는 서빙되지 않는다.

* image, txt 류의 static 파일도 서빙된다.

* API handler 로 사용할 수 없는 `js` 파일은 서빙되지 않는다.
