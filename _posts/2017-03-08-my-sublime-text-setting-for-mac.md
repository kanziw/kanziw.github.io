---
layout: post
title: 나의 SublimeText3 설정 (Mac)
date: 2017-03-08 00:00:00
categories: [tools, sublimetext]
tags: [sublimetext, vim]
description: my-sublime-text-setting-for-mac
comments: true
---

# 나의 SublimeText3 설정 (Mac)

내가 사용하는 기본적인 SublimeText3 설정이다.


## User Preferences

Command + , 를 눌러 나오는 Preferences 창의 오른쪽, User 부분에 아래 항목들의 설정을 추가한다.

```text
{
	// Basic setting
	"font_size": 15,
	"tab_size": 2,

	// Using vim shortcut
	"ignored_packages": [],
}
```

**Vim shortcut 설정 이후엔 SublimeText3 을 재시작해야 한다.**


## Key bindings
```text
[
	{"keys": ["command+alt+l"], "command": "reindent", "args": {"single_line": false}}
]
```
