---
layout: post
title: Kubernetes와 GCP의 CloudSQL 연결
date: 2018-03-07 00:00:00
categories: [cloud, GCP]
tags: [cloud, GCP, CloudSQL, Kubernetes]
description: Kubernetes에서 GCP CloudSQL 로의 연결 방법 및 유의사항
comments: true
---

내가 개발 중인 서비스는 kubernetes 위에서 운영 중이며, DB 연결은 개발 시엔 Docker 로 MySQL을 띄워 연결하고 실 서비스는 Google Cloud Platform(이하 GCP)의 Cloud SQL에 연결하여 사용중이다.
이 때 kubernetes 에서 Cloud SQL 에 연결하는 방법은 크게 3가지가 있다.

1. CloudSQL에 외부 고정IP를 설정하여 연결
2. CloudSQL과 kubernetes 간에 VPC를 연결하여 내부 IP로 연결
3. [링크](https://cloud.google.com/sql/docs/mysql/connect-kubernetes-engine)를 이용한 연결

하지만 1번의 경우 GCP의 로드밸런서 대역만 방화벽을 오픈한다 해도 GCP 위에 공격을 위한 서버를 띄우면 공격자의 공격에 당할 수 있다.
2번의 경우엔 다른 Region/Zone에 있는 서버들에서 접속하게 하려면 Shared VPC 를 추가로 설정해줘야 한다. (뒤에서 이야기 하겠지만 현재는 같은 Region/Zone 에서만 접속하기 때문에 2번으로 할껄... 하는 후회 아닌 후회도 있다.)
위의 이유 + GCP문서를 보고 나는 3번 방법으로 kubernetes - Cloud SQL 의 연결을 설정하였다. (솔직히 말하면.. kubernetes에서 CloudSQL에 연결하는 방법에 대한 공식 문서가 있기에 3번으로 진행했다.)


## Proxy docker를 이용한 CloudSQL 연결

모든 내용은 [링크](https://cloud.google.com/sql/docs/mysql/connect-kubernetes-engine)와 별 다를게 없을 것이라 문서 링크로 대체한다.


## 연결, 그 이후

설정을 완료한 이후 그동안 발생하지 않았던 문제가 표면으로 발생하였다. Rolling update 도중 들어오는 API request들에 대해 이상한 response를 주고 있는 것이다.
이 문제가 왜 일어나는지에 대해 확인해본 결과 아래의 결과로 원인을 분석할 수 있었다.

1. Rolling update 시 기존의 pod 은 Terminating 단계에 들어간다.
2. Terminating 단계에 들어간 pod 에도 여전히 API request가 들어간다.
3. Terminating 단계에 들어가자마자 내가 Docker로 띄운 API 서버는 `terminationGracePeriodSeconds` 옵션에 의해 Terminating 상태가 끝날 때 까지 살아있다.
4. 하지만 proxy 용도로 띄운 도커 이미지는 Terminating 단계에 들어가자 마자 종료된다.
5. 이로 인해 Terminating 내의 API 서버에서 수행하는 DB query가 실패한다.
6. 결론적으로 Client는 Unexpected error를 만나게 된다.

이 사건을 통해 이미 기존에도 Terminating 단계에 있는 pod 에 API request가 들어가고 있었고, request에 대한 response가 반환되지 않는 버그가 있었음을 발견했다.
헌데 이제서야 이 문제를 발견할 수 있었던 건 response 를 미처 주지 못한것에 대한 로그는 [morgan](https://github.com/expressjs/morgan) 로그를 통해 확인할 수 없었고 찰나의 순간이기 때문에 알지 못했던 것이다.
DB 커넥션이 끊겨 API request에 대한 response 가 제대로 오지 않은 이 상황이 되어서야 문제를 발견하게 되었다.

이 문제를 해결하기 위해 [링크](https://pracucci.com/graceful-shutdown-of-kubernetes-pods.html)를 참조하여 proxy docker 설정에 아래 내용을 추가하여 API 서버가 죽기 전에 DB 커넥션이 끊기는 문제를 수정하였다.

```yaml
lifecycle:
  preStop:
    exec:
      command:
      - sleep
      - "40"
```

또한 CronTask 류의 작업을 중지시키기 위해 Redis Pub/Sub 을 이용하여 배포 전 롤링업데이트 대상의 서버들의 CronTask 동작을 멈추게 하는 기능을 추가하였다.
