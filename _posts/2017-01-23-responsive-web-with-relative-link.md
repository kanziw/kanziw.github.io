---
layout: post
title: 반응형 웹 이미지 위에 이미지 링크 걸기
date: 2017-01-23 00:00:00
categories: [html, responsive]
tags: [responsive]
comments: true
description: 이미지의 크기 변화에도 특정 영역 링크가 유지되도록
---

> 반응형 이미지 표시 참고 [링크](http://nanati.me/responsive-image/)  
> Image Map 의 좌표를 유동적으로 변경하는 방법에 대한 참고 [링크](http://blog.grotesq.com/post/519)

이번 포스트에선 아래의 Needs가 복합적으로 요구되어질 때의 해결 방법에 대해 기술한다.

1. 이미지가 가로 사이즈로 100% 로 채워져서 표시되어야 한다.
2. 화면의 크기가 특정 수치 이상이 되면 다른 이미지가 표시되어야 한다.
3. 이미지의 특정 버튼에 링크가 달려야 한다.

### 1번 Needs

#### css

```css
img {
  max-width: 100%; /* 이미지의 최대사이즈 */
  width /***/: auto; /* IE8 */
  height: auto;
  vertical-align: bottom;
}
```

### 2번 Needs

#### html

```html
<div class="pcImg">
  <img src="img/pcImg.png" />
</div>
<div class="mImg">
  <img src="img/mImg.png" />
</div>
```

#### css

```css
@media screen and (max-width: 640px) {
  .pcImg {
    position: relative;
    display: none;
  }
}
@media screen and (min-width: 640px) {
  .mImg {
    position: relative;
    display: none;
  }
}
```

### 3번 Needs

* JQuery 및 [jQuery-rwdImageMaps](https://github.com/stowball/jQuery-rwdImageMaps) 사용

#### html

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery-rwdImageMaps/1.6/jquery.rwdImageMaps.min.js"></script>
<script>
  $(document).ready(function(e) {
    $('img[usemap]').rwdImageMaps();
  });
</script>
<body>
  <div class="pcImg">
   <img src="img/pcImg.png" usemap="#full" />
   <map name="full">
    <area shape="rect" coords="-50, 1500, 9999, 9999" href="https://kanziw.github.io" />
  </map>
 </div>
 <div class="mImg">
   <img src="img/mImg.png" usemap="#mini" />
   <map name="mini">
    <area shape="rect" coords="-50, 300, 9999, 9999" href="https://kanziw.github.io" />
  </map>
</div>
</body>
```

* usemap : 이미지의 특정 부분에 링크를 걸 수 있도록 해줌
* shape
  * rect : 사각형 모양으로 영역을 설정
  * coords : (x1, y1, x2, y2) 좌표 
