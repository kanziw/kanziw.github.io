---
layout: post
title: Google Cloud Functions 시작하기
date: 2017-05-30 00:00:00
categories: [GoogleCloudPlatform, GoogleCloudFunctions]
tags: [GCP, GCF, lambda, aws-lambda]
description: google-cloud-functions-start 
comments: true
---

# Google Cloud Functions 시작하기

## Google Cloud Functions[^1] (GCF) 이란?

1. GCP에서 사용 가능한 Beta[^2] service
2. Serverless Applications
3. Firebase와의 연동이 좋다.[^3]



## GCF를 사용하면 좋은 점

1. 일부 서버코드의 변경 때문에 전체 서버코드를 변경하지 않아도 된다.
   * 어떤 구조로 설계했는지에 따라 다르지만, 배포 과정에서 변경된 부분만 배포하도록 추가 작업을 해야할 수도 있다.



## GCF를 사용할 때 걱정되는 점

1. 서버의 로깅을 Stackdriver 로만 모아서 봐야 함
   * 실시간으로 서버의 in/output 로깅을 확인하는 방법은 없는가?
   * `$ gcloud beta functions logs read helloWorld` 형태의 명령어 활용 가능?![^4]
2. 최신 node 문법을 적용할 수 있는가?
   * async/await, Object.values 등
3. DB / Storage 등과의 커넥션은 어떻게 연결하고 사용 및 관리하는가?
   * 현재는 1 server - 1 connection 인데 GCF를 사용하면 1 GCF - 1 connection 이 되어야 할듯
   * 각각의 GCF가 DB / Storage 등과의 커넥션이 필요한지를 체크해야 함



## 코드에서 고려해야 할 점

1. Micro architecture 적용 가능한 구조로 서버 코드 분리
   * 각 API 들을 하나의 npm package 로 관리해야 하는가?
   * 뒤에서 테스트 해봐야 하겠지만.. exports.GCF_NAME 으로 작성하면 안그래도 될듯?!
2. 테스트케이스 setup
3. 공통으로 사용하는 함수 및 의존성 library 관리



## GCF 사용법

1. Bucket 에 코드를 올린다.
2. cli 명령 시 --triger-[TYPES] 으로 어떤 종류의 코드인지 선언하여 deploy 한다.[^5]
   1. HTTP Triggers : --triger-http, (req, res)를 인자로 받는 함수를 export
      1. GET example : https://cloud.google.com/functions/docs/tutorials/http
      2. POST example : https://cloud.google.com/functions/docs/calling/http
      3. 하나의 functions 마다 하나의 고유한 URL이 나온다. 각 API가 어떤 URL을 갖게 되는지 APIdoc 에 추가하면 되겠다.
   2. Cloud Pub/Sub Triggers : --triger-topic
   3. Cloud Storage Triggers : --trigger-bucket
   4. Direct Triggers : (no options)



## GCF 디버깅

알파이긴 하지만 Local emulator[^6] 라는 것이 있다. 로컬에 deploy 하여 테스팅할 수 있는 도구.



## 코드를 통한 테스팅

[링크](https://github.com/kanziw/google-cloud-functions-start) 참조!



[^1]: https://cloud.google.com/functions/
[^2]: https://cloud.google.com/functions/docs/ 2017.05.29 기준
[^3]: https://firebase.google.com/products/functions/
[^4]: https://cloud.google.com/functions/docs/quickstart#unix
[^5]: https://cloud.google.com/functions/docs/calling/
[^6]: https://cloud.google.com/functions/docs/emulator
