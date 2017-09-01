---
layout: post
title: NodeJS 에서 서버-서버 간의 요청을 쉽게 하는 방법
date: 2017-09-01 00:00:00
categories: [javascript]
tags: [node, request]
description: request 모듈을 wrapping 한 custom requester 생성
comments: true
---

# Server to Server request in NodeJS

개발을 하다보면 서버-서버 간의 요청이 필요할 때가 있다. (외부 솔루션을 쓰는 경우 등)
이 때 request 라는 npm module 을 이용하여 특정 서버와의 통신을 수행하는 코드를 작성 해보았다.

gist [link](https://gist.github.com/kanziw/81030712748af2f313525053b235973e)

```js
import request from 'request'

const requester = request.defaults({
  headers: { 'Content-Type': 'application/json, charset=utf8', 'Api-Token': 'sample-api-token' },
  baseUrl: 'https://sample.kanziw.github.io/v3',
  json: true,
})

/**
 * @param options {object}
 * @config method {'GET'|'POST'|'DELETE'|'PUT'}
 * @param [errHandler] {function}
 * @returns {Promise}
 */
const requestHandler = (options, errHandler) => {
  return new Promise((resolve, reject) => requester(options, (err, res, body) => {
    err ? reject(err) : (body.error ? reject(body) : resolve(body))
  })).catch(ex => {
    if (errHandler) {
      errHandler(ex)
    } else {
      throw new Error(`[${ex.err_code}] ${ex.message}`)
    }
  })
}

const requestToServer = {
  get: (uri, errHandler) => requestHandler({ method: 'GET', uri }, errHandler),
  post: (uri, body, errHandler) => requestHandler({ method: 'POST', uri, body }, errHandler),
  del: (uri, errHandler) => requestHandler({ method: 'DELETE', uri }, errHandler),
  put: (uri, body, errHandler) => requestHandler({ method: 'PUT', uri, body }, errHandler),
}

// Sample requset Examples
async sampleRequests () {
  await requestToServer.get('/child-uri')
  await requestToServer.post('/child-uri', {a: 1})
  await requestToServer.del('/child-uri', () => null)  // ignore error sample
  await requestToServer.put('/child-uri', {b: 2})
}
```
