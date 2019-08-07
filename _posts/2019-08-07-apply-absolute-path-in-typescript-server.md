---
layout: post
title: Typescript 서버에 절대경로 적용하기
date: 2019-08-07 00:00:00
categories: [javascript]
tags: [node, typescript, babel]
description: Typescript 서버에서 절대경로로 커스텀 모듈을 import 하는 방법에 대해 알아본다. 
comments: true
---

## Why?

프로젝트가 복잡해지고 Directory depth 가 깊어지다보면 공통으로 사용하는 utils 함수나 entities 들을 import 할 때 상대경로부분이 매우 지저분해진다.  
`tsconfig.json` 설정만으로 적용할 순 없을지 시도 해보았지만 제대로 되지 않았던 경험이 있다.  
그러다 다른 이유로 [링크](https://github.com/developer239/node-type-orm-graphql/blob/58734c19000dc54b0142dccf856b2208d66b0b79/tsconfig.json)를 보게 되었고 절대경로 설정에 힌트를 얻어 시도하게 되었다.


## 설정 방법

#### Remark
* `tsconfig.json` 을 이용하여 typescript 설정은 되어있음을 가정한다.  
* ./src 에 있는 `.ts` 파일을 ./dist 로 transpiling 한다.
* ./src/utils 는 @utils 로, ./src/entities 는 @entities 로 alias 설정을 한다.

설정의 핵심은 `babel` 을 이용하여 typescript 를 javascript 로 transpiling 하는 것이다.  
설정 방법을 간단히 요약하면 아래와 같다.

1. `tsconfig.json` 에 paths 설정
2. `.babelrc` 에 `module-resolver` plugin 을 이용, alias 설정
3. (Option) `jest.config.js` 에 moduleNameMapper 설정


### 1. `tsconfig.json` 설정

절대경로 설정에 필요한 부분만 분리해서 보면 아래와 같다.

```json
{   
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "dist",
    "rootDir": "src",
    "paths": {
      "@utils/*": [
        "src/utils/*"
      ],
      "@entities/*": [
        "src/entities/*"
      ]
    }
  }
}
```


### 2. `babel` 설정

`babel` 을 사용하여 우리의 목적을 달성하기 위해선 아래의 의존성을 추가해야 한다.

```bash
❯ npm i -D @babel/cli @babel/preset-env @babel/preset-typescript babel-plugin-module-resolver
```

그 이후엔 Project root directory 에 아래와 같이 `.babelrc` 파일을 생성한다.

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/typescript"
  ],
  "plugins": [
    [
      "module-resolver",
      {
        "extensions": [
          ".ts"
        ],
        "root": [
          "."
        ],
        "alias": {
          "@utils": "./src/utils",
          "@entities": "./src/entities"
        }
      }
    ]
  ],
  "comments": false,
  "ignore": [
    "./src/__tests__"
  ]
}
```

이제 `package.json` 에 `babel` 을 통해 .ts 파일을 .js 파일로 transpiling 하는 명령어를 추가한다.  

```json
{
  "scripts": {
    "build": "babel src --out-dir dist --extensions '.ts'"
  }
}
```


### 3. Test framework - Jest 설정

`jest.config.js` 를 통해 jest 설정을 관리하고 있다면 해당 파일에 아래의 설정을 추가한다.
```js
module.exports = {
  moduleNameMapper: {
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@entities(.*)$': '<rootDir>/src/entities$1',
  }
}
```


## Bonus
 
### 1. nodemon 을 이용한 watch 설정

nodemon 및 @babel/node 의존성을 추가한다.

```bash
❯ npm i -D nodemon @babel/node
```

`nodemon.json` 을 Project root 에 아래와 같이 추가한다.

```json
{
  "ignore": [
    "node_modules"
  ],
  "watch": [
    "src",
    "package-lock.json"
  ],
  "exec": "babel-node --extensions '.ts' src/index.ts",
  "ext": "ts"
}
```

`package.json` 에는 아래의 script 를 적용한다.

```json
{
  "scripts": {
    "start": "nodemon"
  }
}
```


### 2. `.d.ts` 파일 생성하기

간혹 npm 에 모듈을 만들어 배포 할 일이 생기면 `.d.ts` 파일이 필요할 때가 있다. 이를 위해 해당 파일을 만드는 명령어도 추가 해놓았다.

```json
{
  "scripts": {
    "build:js": "babel src --out-dir dist --extensions '.ts'",
    "build:types": "tsc --emitDeclarationOnly --noEmit false -d",
    "build": "yarn build:js"
  }
}
```
