---
layout: post
title: Jenkins 시작하기 (on Ubuntu)
date: 2017-01-16 00:00:00
categories: [tools, jenkins]
tags: [jenkins, install]
comments: false
description: Ubuntu 에 Jenkins 설치하기
---

> ubuntu-14.04 & 본 홈페이지 기준, [출처 링크](https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Ubuntu)

본 문서는 kanziw.github.io 사이트의 소스코드를 git 에서 다운 받아 설치하는 예제를 통해 설명한다. 즉 기본 골격만 설명할 뿐 각자의 프로젝트에 맞게 설정해야 한다.

## [Jenkins?](https://jenkins.io/)
* 테스트, 빌드 및 배포 자동화 툴
* Java 로 만들어짐

## PreInstallation
* JDK and JRE 7 이상

## Installation

```
wget -q -O - https://pkg.jenkins.io/debian/jenkins-ci.org.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install -y jenkins
```

## 기본 설정
* 데몬 설정 파일 위치 : `/etc/default/jenkins`
* 데몬 실행 파일 위치 : `/etc/init.d/jenkins`

## 실행

```
sudo service jenkins start
# 처음 Jenkins 사이트에 접속하면 아래 명령을 통해 나오는 Password 를 입력해야 한다.
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
585b2b713a8448a98d1cd80eba52ad9e
```

127.0.0.1:8080 으로 접속하면 Jenkins 가 실행되어 있으며, 실행이 완료 되면 위의 스크립트에서 출력 된 초기 비밀번호를 입력한다. (예: 585b2b713a8448a98d1cd80eba52ad9e)

추천되는 Plugin 설치를 진행하고 기본 관리자를 생성한다.

## 새 프로젝트 설정

* path : URL/newJob
* item name : kanziw.github.io
* Freestyle project

### General
* GitHub Project Url : https://github.com/kanziw/kanziw.github.io.git

### 소스 코드 관리
* Git
  * Repositories
    * URL : https://github.com/kanziw/kanziw.github.io.git
    * Credentials : None (공개된 프로젝트이기 때문)
  * Branches to build : `*/master`

### 빌드 유발
* None check

### 빌드 환경
*[x] Delete workspace before build starts

### Build
* 서버에 Node 가 설치되어 있지 않다면 Node 를 먼저 설치해야 한다.

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* 서버에 Ruby 관련 패키지가 설치되어 있지 않다면 필요 패키지를 설치해야 한다.

```
# 소스코드 컴파일만 하면 이상하게 gem install 이 안된다.
sudo apt-get install -y ruby-full

# 소스코드 컴파일 설치
cd
wget http://ftp.ruby-lang.org/pub/ruby/2.4/ruby-2.4.0.tar.gz
tar -xzvf ruby-2.4.0.tar.gz
cd ruby-2.4.0/
./configure
make
sudo make install
sudo gem install jekyll bundle
```

* 서버에 Jenkins 가 sudo 권한이 없으면 안된다.

```
sudo -s
echo "jenkins ALL = NOPASSWD: ALL" >> /etc/sudoers
logout
```

* Execute shell

```
sudo bundle install
npm install
...
```

### 빌드 후 조치
* None check
