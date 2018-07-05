---
layout: post
title: gcloud docker -- push 대신 docker push 사용하기
date: 2018-07-05 00:00:00
categories: [cloud, GCP]
tags: [cloud, GCP, docker]
description: 잘 동작하던 gcloud docker -- push 실패 해결 방법
comments: true
---

## 문제의 시작

현재 Jenkins 를 통해 node.js 소스가 배포되고 있고, 아래의 순서를 통해 배포가 진행된다.

* Github 에서 최신 소스 pull
* 소스 babelify
* Docker image build
* Docker image push (to GCP)
* Kubernetes (GKE) 에서 사용할 이미지 교체
  * Kubernetes 에서 자체적으로 rolling update 수행



헌데 Docker Image push 단계에서 아래와 같은 에러메시지로 실패하였다.

```bash
$ gcloud docker -- push us.gcr.io/PROJECT_NAME/IMAGE_NAME:TAG
ERROR: Docker CLI operation failed:

WARNING! Using --password via the CLI is insecure. Use --password-stdin.
error getting credentials - err: exit status 1, out: `User interaction is not allowed.`

ERROR: (gcloud.docker) Docker login failed.
```



## 문제의 해결

gcloud sdk 를 업데이트 한 뒤 다시 수행해보았다.

```bash
$ gcloud components update
$ gcloud docker --authorize-only
WARNING: `gcloud docker` will not be supported for Docker client versions above 18.03.

As an alternative, use `gcloud auth configure-docker` to configure `docker` to
use `gcloud` as a credential helper, then use `docker` as you would for non-GCR
registries, e.g. `docker pull gcr.io/project-id/my-image`. Add
`--verbosity=error` to silence this warning: `gcloud docker
--verbosity=error -- pull gcr.io/project-id/my-image`.

See: https://cloud.google.com/container-registry/docs/support/deprecation-notices#gcloud-docker

ERROR: Docker CLI operation failed:

WARNING! Using --password via the CLI is insecure. Use --password-stdin.
error getting credentials - err: exit status 1, out: `User interaction is not allowed.`

ERROR: (gcloud.docker) Docker login failed.
```

보이지 않던 WARNING 이 보인다.

확인해보니 Docker client version 이 18.03 이 넘으면 gcloud docker 를 사용할 수 없다는 것이다.

Jenkins 머신의 docker version 은 아래와 같다. (iOS 빌드를 위해 iMac 에서 Jenkins 를 돌리고 있다.)

```bash
$ docker version
Client:
 Version:      18.03.1-ce
 API version:  1.37
 Go version:   go1.9.5
 Git commit:   9ee9f40
 Built:        Thu Apr 26 07:13:02 2018
 OS/Arch:      darwin/amd64
 Experimental: false
 Orchestrator: swarm

Server:
 Engine:
  Version:      18.03.1-ce
  API version:  1.37 (minimum version 1.12)
  Go version:   go1.9.5
  Git commit:   9ee9f40
  Built:        Thu Apr 26 07:22:38 2018
  OS/Arch:      linux/amd64
  Experimental: true
```



WARNING 의 메시지를 참고하여 `gcloud` 를 docker 의 `credential helper` 로 셋팅한다.

```bash
$ gcloud auth configure-docker
The following settings will be added to your Docker config file
located at [/Users/USERNAME/.docker/config.json]:
 {
  "credHelpers": {
    "gcr.io": "gcloud",
    "us.gcr.io": "gcloud",
    "eu.gcr.io": "gcloud",
    "asia.gcr.io": "gcloud",
    "staging-k8s.gcr.io": "gcloud"
  }
}

Do you want to continue (Y/n)?

Docker configuration file updated.
```



또한 WARNING 에 있는 [링크](https://cloud.google.com/container-registry/docs/support/deprecation-notices#gcloud-docker)를 참고하여 Docker push 시 사용하는 명령어를 바꾸었다.

* 기존 : `$ gcloud docker -- push us.gcr.io/PROJECT_NAME/IMAGE_NAME:TAG`
* 변경 : `$ docker push us.gcr.io/PROJECT_NAME/IMAGE_NAME:TAG`



## 요약

* `$ gcloud auth configure-docker` 를 통해 docker 의 credential helper 로 gcloud 를 등록
* 기존의 `$ gcloud docker -- push BLARBLAR` 명령을 `$ docker push BLARBLAR` 로 변경

