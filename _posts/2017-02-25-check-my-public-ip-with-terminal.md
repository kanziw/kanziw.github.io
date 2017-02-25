---
layout: post
title: Terminal 에서 내 외부 ip 주소 확인하기
date: 2017-02-25 00:00:00
categories: [tip, terminal]
tags: [terminal, tip]
description: curl ipinfo.io
comments: true
---

# Terminal 에서 내 외부 ip 주소 확인하기

간혹 내 외부 ip 가 몇인지 확인하고 싶을 때가 있다.
그 때마다 [https://whatismyip.com](https://whatismyip.com) 를 애용하곤 했지만, 간편하게 터미널에서 확인할 수 있는 방법을 발견했다.
바로 curl 명령어를 이용하는 것.

```bash
$ curl ipinfo.io/ip
211.189.222.xxx
```

참고로 ipinfo.io 로 curl 을 날리면 아래의 테이터가 json 형식으로 반환되는 것을 확인할 수 있다.

```bash
$ curl ipinfo.io
{
  "ip": "211.189.222.xxx",
  "hostname": "No Hostname",
  "city": "Jinhae-gu",
  "region": "Gyeongsangnam-do",
  "country": "KR",
  "loc": "35.1494,xxx.xxxx",
  "org": "AS18313 CJ-HELLOVISION"
}
```

제한 없이 무료인지 궁금해서 사이트를 확인 해보니 아래와 같이 써있다.

## Free for small projects. Pay as you grow.
Our API is free for up to 1,000 requests per day. See our pricing details if you need more.

