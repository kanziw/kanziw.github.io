---
layout: post
title: 함수형 자바스크립트 CHAPTER 1
date: 2017-01-09 00:00:00
categories: [javascript]
tags: [node, functional, javascript]
description: 함수형 자바스크립트 소개
comments: true
---

# 1. 함수형 자바스크립트 소개

## 1.1 자바스크립트 활용사례

> splat : args -> number

```javascript
function splat(func) {
  return array => func.apply(null, array);
}

const addArrayElements = splat((x, y) => x + y);
addArrayElements([1, 2]);   // 3
```

> unsplat : array -> string

```javascript
function unsplat(func) {
  return (...args) => func.call(null, args);
}

const joinElements = unsplat(array => array.join(' '));
joinElements(1, 2); // '1 2'
joinElements('-', '$', '/', '!', ':');  // - $ / ! :
```

### 1.1.1 자바스크립트의 몇 가지 한계

## 1.2 함수형 프로그래밍 시작하기

### 1.2.1 함수형 프로그래밍이 중요한 이유

### 1.2.2 함수 - 추상화 단위

> parseAge

```javascript
function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(['WARNING:', thing].join(' '));
}

function note(thing) {
  console.log(['NOTE:', thing].join(' '));
}

function parseAge(age) {
  if (!_.isString(age)) fail('Expecting a string');

  let a;
  note('Attempting to parse an age');
  a = parseInt(age, 10);

  if (Number.isNaN(a)) {
    warn(['Could not parse age:', age].join(' '));
  }
  return a;
}
```

### 1.2.3 캡슐화와 은닉

### 1.2.4 함수 - 동작 단위

* 하나의 function `parseAge` 안에 logging 및 throw 를 구현할 수도 있지만 각 목적에 맞게 함수를 구현했다. 이렇게 되면 에러, 경고 정보 출력 기능을 내가 원하는 대로 쉽게 바꿀 수 있다.

> nth

```javascript
function isIndexes(data) {
  return Array.isArray(data) || _.isString(data);
}

function nth(a, index) {
  if (!_.isNumber(index)) fail('Expected a number as the index.');
  if (!isIndexes(a)) fail('Not supported on non-indexed type.');
  if (index < 0 || index > a.length - 1) fail('Index value is out of bounds.');

  return a[index];
}

nth(['a', 'b', 'c'], 1);    // 'b'
nth('abc', 0);              // 'a'

function second(a) {
  return nth(a, 1);
}

second(['a', 'b', 'c']);    // 'b'
second('kanziw');           // 'a'
```

### 1.2.5 데이터 추상화

> parse CSV

```javascript
function lameCSV(str) {
  return str.split('\n').reduce((table, row) => {
    table.push(row.split(',').map(c => c.trim()));
    return table;
  }, []);
}

const peopleTable = lameCSV('name,age,hair\nMerble,35,red\nBob,64,blonde');
/*
[ [ 'name', 'age', 'hair' ],
  [ 'Merble', '35', 'red' ],
  [ 'Bob', '64', 'blonde' ] ]
*/

function selectName(table) {
  return _.rest(_.map(table, _.first));
}

function selectAges(table) {
  return _.rest(_.map(table, second));
}

function selectHairColor(table) {
  return _.rest(_.map(table, row => nth(row, 2)));
}

selectName(peopleTable);        // [ 'Merble', 'Bob' ]
selectAges(peopleTable);        // [ '35', '64' ]
selectHairColor(peopleTable);   // [ 'red', 'blonde' ]
```

## KeyWord : **간단한 데이터를 조작하는 함수**

### 1.2.6 함수형 자바스크립트 맛보기

> doWhen

```javascript
function existy(x) {
  return x != null;
}

function truthy(x) {
  return x !== false && existy(x);
}


function doWhen(cond, action) {
  return truthy(cond) ? action() : undefined;
}

function executeIfHasField(target, name) {
  return doWhen(existy(target[name]), function () {
    const result = _.result(target, name);
    console.log(['The result is', result].join(' '));
    return result;
  });
}

executeIfHasField([1, 2, 3], 'reverse');    // The result is 3,2,1
executeIfHasField({foo: 42}, 'foo');        // The result is 42
executeIfHasField([1, 2, 3], 'notHere');    // undefined
```

## 함수형 프로그래밍이란

* 함수 형태로 '존재'의 추상화를 정의한다.
* 기존 함수를 이용해서 '참거짓'의 추상화를 정의한다.
* 위 함수를 다른 함수의 파라미터로 제공해서 어떤 동작을 하도록 한다.

### 1.2.7 속도에 대해

* 자바스크립트 벤치마킹 사이트 [링크](http://www.jsperf.com)

## 1.3 언더스코어와 관련한 잡담

## 1.4 요약

* 추상화를 식별해서 함수로 만든다.
* 기존 함수를 이용해서 더 복잡한 추상화를 만든다.
* 기존 함수를 다른 함수에 제공해서 더 복잡한 추상화를 만든다.
