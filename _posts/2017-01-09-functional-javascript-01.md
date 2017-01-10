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

* Javascript 가 있기 있는 이유?
  * 풍부한 접근성
  * 보편성
  * 이식

* Javascript 는 `함수형 기법`을 직접적으로 지원함!
  * ex : Array.forEach()
  * apply, call, bind

> apply : args -> number

```javascript
function splat(func) {
  return array => func.apply(null, array);
}

const addArrayElements = splat((x, y) => x + y);
addArrayElements([1, 2]);   // 3
```

> call : array -> string

```javascript
function unsplat(func) {
  return (...args) => func.call(null, args);
}

const joinElements = unsplat(array => array.join(' '));
joinElements(1, 2); // '1 2'
joinElements('-', '$', '/', '!', ':');  // - $ / ! :
```

* Javascript 는 지속적으로 진화하고 있는 언어이다.

### 1.1.1 자바스크립트의 몇 가지 한계

* 안전하지 않은 특성
  * 명령형 기법
  * 지역 스코핑 의존

## 1.2 함수형 프로그래밍 시작하기

* 함수형 프로그래밍
  * 함수형 프로그래밍은 값을 추상화의 단위로 바꾸는 기능을 한다.
  * 바뀐 값들로 소프트웨어 시스템이 만들어진다.

### 1.2.1 함수형 프로그래밍이 중요한 이유

* 객체 지향 프로그래밍 (OOP)
  * 문제를 부분으로 잘게 나누는 것 - '명사'나 객체의 집합으로
  * 문제 발생
    * 객체 간의 상호 작용 발생
    * 내부 값이 바뀌며 전체 시스템의 상태가 바뀜
    * 작은 변경으로 큰 상태 변화가 발생할 수 있음

* 함수형 프로그래밍
  * 문제를 (함수라 불리는) 부분으로 나누는 것 - '동사'나 그룹으로
  * 함수형 프로그래밍에서는 여러 함수를 '붙이'거나 '조립'해서 고수준 동작을 만든다.
  * 관찰할 수 있는 상태 변화를 최소화
  * 새로운 함수가 지역화되고 비 파괴적인 데이터 전이과정에서 어떻게 동작할 것인지를 파악하는 것이 핵심.

### 1.2.2 함수 - 추상화 단위

* 함수는 뷰에서 상세 구현을 숨김으로써 추상화를 달성할 수 있다.
* `함수는`
  * 버틀러 램슨 : 실행할 수 있고, 올바로 동작하며, 빨리 실행되도록 만들어라.
  * 켄트 백 : 실행할 수 있게 한 다음, 올바로 동작하게 하고, 그 다음 빠르게 실행되도록 만들어라.

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

* Javascript 의 객체 시스템에서는 데이터 은닉을 직접적으로 제공하지 않으므로 클로저라는 것을 이용해서 데이터를 감춘다.

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

> comparator

```javascript
function comparator(pred) {
  return (x, y) => truthy(pred(x, y)) ? -1 : (truthy(pred(y, x)) ? 1 : 0);
}
```

* comparator 를 위와 같이 정의 하면 `찬반형 세상`을 `비교기 세상`으로 연결할 수 있다.
  * pred : x, y 를 비교하는 함수

> lessOrEqual

```javascript
function lessOrEqual(x, y) {
  return x <= y;
}

[100, 1, 0, 10, -1, 2, -11].sort(comparator(lessOrEqual));  // [ -11, -1, 0, 1, 2, 10, 100 ]
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

const mergeResults = _.zip;

selectName(peopleTable);        // [ 'Merble', 'Bob' ]
selectAges(peopleTable);        // [ '35', '64' ]
selectHairColor(peopleTable);   // [ 'red', 'blonde' ]
mergeResults(selectName(peopleTable), selectAges(peopleTable)); // [ [ 'Merble', '35' ], [ 'Bob', '64' ] ]
```

* lameCSV : `DataX` -> `DataY`

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

* 함수형 프로그래밍이란
  * 함수 형태로 '존재'의 추상화를 정의한다.
  * 기존 함수를 이용해서 '참거짓'의 추상화를 정의한다.
  * 위 함수를 다른 함수의 파라미터로 제공해서 어떤 동작을 하도록 한다.

### 1.2.7 속도에 대해

* nth(array, 0) 이나 _.first(array) 보단 array[0] 가 더 빠르다
* 정적 최적기를 이용하면 _.each -> for 문 -> 함수의 나열 ... 으로 변화된다.
  * 이러한 최정화를 수행하는 프로그램 : 구글의 클로저 컴파일러
* 자바스크립트 벤치마킹 사이트 [링크](http://www.jsperf.com)

## 1.3 언더스코어와 관련한 잡담

* Underscore 는 실용적이고 깔끔한 함수형 스타일의 API 를 제공하는 훌륭한 라이브러리
* Array#map 과 같은 코드도 크로스 브라우저 호환성을 생각한다면 Underscore 를 이용하는 것이 좋다.

## 1.4 요약

* 함수형 프로그래밍
  * 추상화를 식별해서 함수로 만든다.
  * 기존 함수를 이용해서 더 복잡한 추상화를 만든다.
  * 기존 함수를 다른 함수에 제공해서 더 복잡한 추상화를 만든다.
