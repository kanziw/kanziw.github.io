/**
 * Created by kanziw on 2017. 1. 17..
 */

import _ from 'underscore';

export default (function (di) {
  //===
  _.each(['whiskey', 'tango', 'foxtrot'], word => {
    console.log(word.charAt(0).toUpperCase() + word.substr(1));
  });


  //===
  const lyrics = [];

  for (let bottles = 99; bottles > 0; bottles--) {
    lyrics.push(`${bottles} bottles of beer on the wall`);
    lyrics.push(`${bottles} bottles of beer`);
    lyrics.push(`Take one down, pass it around`);

    if (bottles > 1) {
      lyrics.push(`${bottles - 1} bottles of beer on the wall`);
    } else {
      lyrics.push(`No more bottles of beer on the wall!`);
    }
  }


  //===
  function lyricSegment(n) {
    return _.chain([])
      .push(`${n} bottles of beer on the wall`)
      .push(`${n} bottles of beer`)
      .push(`Take one down, pass it around`)
      .tap(function (lyrics) {
        if (n > 1) {
          lyrics.push(`${n - 1} bottles of beer on the wall.`);
        } else {
          lyrics.push(`No more bottles of beer on the wall!`);
        }
      }).value();
  }

  function song(start, end, lyricGen) {
    return _.reduce(_.range(start, end - 1, -1), (acc, n) => acc.concat(lyricGen(n)), []);
  }

  console.log(song(99, 0, lyricSegment));


  //===
  const a = {
    name: 'a',
    fun: function () {
      return this;
    },
  };
  console.log(a.fun());

  const bFunc = function () {
    return this;
  };
  const b = {name: 'b', fun: bFunc};
  console.log(b.fun()); // 책과 다르게 Windows 같은 전역 객체가 아니라 의도한 대로 나온다.?


  //===
  // function P

});
