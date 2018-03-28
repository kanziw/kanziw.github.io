---
layout: post
title: Docker 내부에 있는 node 서버에서 process 옵저빙하는 방법
date: 2018-03-28 00:00:00
categories: [docker]
tags: [node, docker]
description: Docker 내부에 있는 node 서버에서 process 옵저빙하는 방법
comments: true
---

Kubernetes 를 이용하여 node 서버를 운영하는 중, pod 들이 terminating 단계에 진입하는것에 대해 Observing 할 필요가 생겼다. 
인터넷 검색을 하면 `SIGTERM` 신호를 받아 처리를 하면 된다고 하는데 해당 신호가 운영중인 node 서버에선 Observing 이 되지 않았다.  
이유는 Dockerfile 에서 서버를 실행할 때 `CMD node dist/server.js` 형태로 서버를 실행하기 때문이었다. 
이를 `CMD ["node", "dist/server.js"]` 형태로 수정하니 `SIGTERM` 신호를 정상적으로 Observing 할 수 있게 되었다. 


### Before Dockerfile
```
FROM node:6.7.0
MAINTAINER kanziw <kanziwoong@gmail.com>

ENV NODE_ENV production

COPY package.json .
RUN npm i

COPY path/key.json key.json
ADD dist dist

ENV PORT 8080
EXPOSE 8080

CMD node dist/index.js
```


### After Dockerfile
```
FROM node:6.7.0
MAINTAINER kanziw <kanziwoong@gmail.com>

ENV NODE_ENV production

COPY package.json .
RUN npm i

COPY path/key.json key.json
ADD dist dist

ENV PORT 8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
```


### SIGTERM Observing sample code
```javascript
process.on('SIGTERM', () => {
  console.log('SIGTERM message observed!')
})
```
