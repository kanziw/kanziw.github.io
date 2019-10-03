---
layout: post
title: Github Actions with YAML syntax
date: 2019-10-03 00:00:00
categories: [Infra]
tags: [GithubActions, GCP, GAE]
description: YAML syntax 의 Github Actions 를 이용하여 GAE 에 React App 을 배포한다. 
comments: true
---

## Github Actions

Github Actions 는 우리가 더 게으를 수 있게 도와주는 툴이다.  
코드를 작성하면 코드가 규칙에 맞게 잘 작성 되었는지(lint check, build), 기존의 사용성을 해치진 않는지(test) 를 확인하고 필요한 경우엔 바로 배포까지 진행하는 Workflow 를 수행할 수 있게 해준다.

[공식 사이트](https://github.com/features/actions)에선 아래와 같이 설명하고 있다.  
**Automate your workflow from idea to production**  
GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD. Build, test, and deploy your code right from GitHub. Make code reviews, branch management, and issue triaging work the way you want.

(이어지는 글을 읽기 전 [Core concepts for GitHub Actions](https://help.github.com/en/articles/about-github-actions#core-concepts-for-github-actions)를 먼저 읽으면 도움이 되지만 Skip 하셔도 됩니다.)  


## How I use?

실제 작성한 Workflow 를 가지고 설명해보고자 한다. 2개의 Workflow 를 만들어보았다.  


### Build

작성한 코드가 배포되어도 되는지 확인하는 Workflow. 실제 Full 코드는 [여기](ihttps://github.com/kanziw/tools/blob/7707aa8054/.github/workflows/build.yaml)에 있다.  


```yaml
# build.yaml
name: Build # Workflow 의 이름

on: [push, pull_request] # 모든 브랜치에 대해 push / PR 이 일어나면 수행
```

#### on

Workflow 가 수행되기 위한 Trigger 조건. 자세한 syntax 는 [공식문서](https://help.github.com/en/articles/workflow-syntax-for-github-actions#on)를 참고하면 좋다.  
[특정 path 에 있는 파일이 수정되면 수행하는 trigger](https://help.github.com/en/articles/workflow-syntax-for-github-actions#onpushpull_requestpaths)도 한번 추가로 해봄직 해 보인다.  


```yaml
jobs:
  lint: # jobs.<job_id>
    name: Lint
    runs-on: ubuntu-18.04 # ubuntu-18.04 에서 이 job 을 수행
    steps:
      - name: Checkout
        uses: actions/checkout@v1
        with:
          fetch-depth: 1 # 제일 마지막 커밋내용을 checkout
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: '10' # Node.js 10 버전을 사용할 수 있게 셋팅
      - name: Install Dependencies
        run: npm ci # https://docs.npmjs.com/cli/ci.html
      - name: Check Lint
        run: npm run lint # Lint check 수행
```

#### jobs

실제 수행 될 job 들을 정의되며 정의된 job 들은 병렬로 수행된다. [공식문서](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobs)  
(단, jobs.\<job_id\>.needs 가 정의되어 있으면 해당 job 이 성공하면 수행한다.)  


#### jobs.\<job_id\>.runs-on

job 이 수행 될 가상환경을 선택한다. [공식문서](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idruns-on)  
크게 Windows Server / Ubuntu / macOS 를 선택할 수 있으며 detail 한 버전은 [여기](https://help.github.com/en/articles/virtual-environments-for-github-actions#supported-virtual-environments-and-hardware-resources)서 확인할 수 있다.  
또한 Default 로 사용 가능한 [환경변수](https://help.github.com/en/articles/virtual-environments-for-github-actions#default-environment-variables)도 알아두면 좋다.  


#### jobs.\<job_id\>.steps.uses

job 의 특정 step 에서 사용 할 Action 을 지정한다. [공식문서](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstepsuses)에는 "재사용 가능한 코드의 단위" 라 설명한다.  
Action 은 같은 repository, public repository 혹은 publish 된 Docker container image 등으로 정의 가능하다.  
(Action 을 만드는 방법은 여기에선 다루지 않는다. [공식문서](https://help.github.com/en/articles/about-actions#choosing-a-location-for-your-action))  


```yaml
  # ...
  test-web:
    name: Test - Web
    runs-on: ubuntu-18.04
    steps:
      # ...
      - name: Install Dependencies
        working-directory: web # web directory 에서 수행
        run: npm ci
      - name: Run test
        working-directory: web
        run: npm run test -- --watchAll=false # npm run test 로 정의되어 있는 스크립트에 --watchAll=false 옵션을 전달
```

#### jobs.\<job_id\>.steps.working-directory

[공식문서](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstepsworking-directory)  


### Deploy

코드가 master 에 머지되면 서비스를 GCP(Google Cloud Platform)의 GAE(Google App Engine)에 배포한다.  
실제 Full 코드는 [여기](https://github.com/kanziw/tools/blob/7707aa8054/.github/workflows/deploy.yaml)에 있다.


```yaml
# deploy.yaml
name: Deploy

on:
  push:
    branches:
      - master # master branch 에 push 가 되면 수행

jobs:
  deploy:
    name: Deploy
    runs-on: macOS-10.14
    steps:
      # ...
      - name: Setup Gcloud SDK
        run: brew cask install google-cloud-sdk # brew 를 통해 google-cloud-sdk 를 설치
      # ...
      - name: Deploy to GAE
        env:
          DEPLOY_KEY: ${\{ secrets.DEPLOY_KEY }} # 실제론 `\` 가 없습니다.
        run: |
          echo $DEPLOY_KEY > deploy-key.json
          gcloud auth activate-service-account --key-file=deploy-key.json && \
          gcloud app deploy --project=tools-kanziw-dev
          rm deploy-key.json
```

#### jobs.\<job_id\>.runs-on: macOS-10.14

선택할 수 있는 가상환경마다 기본적으로 사용할 수 있는 Software 가 있으며, [공식문서](https://help.github.com/en/articles/software-in-virtual-environments-for-github-actions)를 통해 사용 가능한 Software 를 확인할 수 있다.  
[Ubuntu 18.04 LTS](https://help.github.com/en/articles/software-in-virtual-environments-for-github-actions#ubuntu-1804-lts) 에는 아래의 Software 가 대표적으로 설치되어 있다. (2019.10.03 기준)
* Ansible (ansible 2.8.5)
* AWS CLI 
* Docker
* Google Cloud SDK (263.0.0)
* Heroku (heroku/7.30.0 linux-x64 node-v11.14.0)
* kubectl (Client Version: v1.15.4)
* helm (Client: v2.14.3+g0e7f3b6)
* MySQL (mysql Ver 14.14 Distrib 5.7.27, for Linux (x86_64) using EditLine wrapper)
* 등

여기선 `npm run build` 시 ubuntu 머신에선 실패하는 이슈가 있어 macOS 를 선택하였고, 그 덕분에(?) Google Cloud SDK 가 없어 `brew` 를 이용, Google cloud SDK 를 설치하였다.  


#### jobs.\<job_id\>.steps.env

해당 step 에서 사용 할 environment 를 설정한다.  
특히 `secrets` (ex $\{\{ secrets.DEPLOY_KEY \}\}) 를 이용하면 노출되지 말아야 할 값을 조금 더 안전하게 사용할 수 있다. [공식문서](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables)  


## And more...

### 사용하면 유용할 것 같은 설정

#### jobs.\<job_id\>.container

[공식문서](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idcontainer)  
사실 정확히 어떤 때 사용하는지 파악하진 못했지만 이 기능의 역할을 제대로 이해하면 강력하게 사용할 수 있을 것 같은 느낌적인 느낌이 든다.(ㅋㅋ)  


#### jobs.\<job_id\>.services

job 을 수행할 때 함께 띄울 서비스들을 정의한다. [공식문서](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idservices)  
`jobs.<job_id>.services.<service_name>` 으로 정의한 이름을 hostname 으로 사용할 수 있어 test case 수행 시 필요한 외부 서비스들을 정의할 때 사용할 수 있다.  


#### Events that trigger workflows

Workflow 의 trigger 로 사용 가능한 Events. [공식문서](https://help.github.com/en/articles/events-that-trigger-workflows)  


---

아래의 링크들에서 도움을 받았습니다.
- https://help.github.com/en/articles/about-github-actions
- http://www.thedreaming.org/2019/09/10/github-ci/
- and my co-workers in [Rainist](https://rainist.com/recruit)
