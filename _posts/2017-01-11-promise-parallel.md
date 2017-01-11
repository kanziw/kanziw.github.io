---
layout: post
title: 비동기 함수들의 병렬 처리 시 유의할 점
date: 2017-01-11 00:00:00
categories: [javascript]
tags: [node, javascript, promise, testcase]
description: 무분별한 병렬 처리로 인한 버그
comments: true
---

## 테스트케이스의 특성

테스트케이스의 각 테스트는 서로의 테스트에 어떠한 영향을 미치면 안된다.
따라서 `before`, `beforeEach`, `after`, `afterEach` 등의 함수를 통해 상태 변화에 대한 초기화 및 공통적인 전처리 작업을 진행한다.

## 잘못 사용한 비동기 함수들의 병렬 처리

이 때 여러 비동기 함수들을 병렬로 처리하여 `beforeEach` 의 속도를 줄이기 위해 bluebird library 의 `Promise.all()` 을 많이 사용했다.
헌데 순차적으로 수행되어야 할 비동기 함수(유저 삭제 -> 랭킹 정보 초기화)가 동시에 병렬로 처리되어 테스트케이스가 실패하는 일이 발생했다.

## 요약

### 비동기 함수들의 병렬 처리 시 정말 병렬로 해도 되는지 한번 더 확인하라!
