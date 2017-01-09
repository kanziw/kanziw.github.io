/**
 * Created by kanziw on 2017. 1. 9..
 */

import _ from 'underscore';


export default (function (di) {
  //===
  function splat(func) {
    return array => func.apply(null, array);
  }

  const addArrayElements = splat((x, y) => x + y);
  console.log(addArrayElements([1, 2]));


  //===
  function unsplat(func) {
    return (...args) => func.call(null, args);
  }

  const joinElements = unsplat(array => array.join(' '));
  console.log(joinElements(1, 2));
  console.log(joinElements('-', '$', '/', '!', ':'));


  //===
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

  parseAge('kanziw');


  //===
  function isIndexes(data) {
    return Array.isArray(data) || _.isString(data);
  }

  function nth(a, index) {
    if (!_.isNumber(index)) fail('Expected a number as the index.');
    if (!isIndexes(a)) fail('Not supported on non-indexed type.');
    if (index < 0 || index > a.length - 1) fail('Index value is out of bounds.');

    return a[index];
  }

  console.log(nth(['a', 'b', 'c'], 1));
  console.log(nth('abc', 0));

  function second(a) {
    return nth(a, 1);
  }

  console.log(second(['a', 'b', 'c']));
  console.log(second('kanziw'));


  //===
  function lameCSV(str) {
    return str.split('\n').reduce((table, row) => {
      table.push(row.split(',').map(c => c.trim()));
      return table;
    }, []);
  }

  const peopleTable = lameCSV('name,age,hair\nMerble,35,red\nBob,64,blonde');
  console.log(peopleTable);

  function selectName(table) {
    return _.rest(_.map(table, _.first));
  }

  function selectAges(table) {
    return _.rest(_.map(table, second));
  }

  function selectHairColor(table) {
    return _.rest(_.map(table, row => nth(row, 2)));
  }

  console.log(selectName(peopleTable));
  console.log(selectAges(peopleTable));
  console.log(selectHairColor(peopleTable));


  //===

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

  executeIfHasField([1, 2, 3], 'reverse');
  executeIfHasField({foo: 42}, 'foo');
  executeIfHasField([1, 2, 3], 'notHere');

  di.existy = existy;
  di.truthy = truthy;
});
