---
title: "Re:从零开始的博客生涯 #3 Theme MemE"
subTitle: "使用 Hugo 主题 MemE"
date: 2021-05-14T15:56:51+08:00
tags: ["Blog", "Hugo"]
series: ["ews.ink"]
related: true
---

<a href="https://github.com/gohugoio/hugo/releases"><img src="https://img.shields.io/badge/hugo_version-v0.83.1%2fextended-blue.svg?logo=hugo&logoColor=fff" alt="Hugo Verion" data-sticker /></a> <a href="https://github.com/reuixiy/hugo-theme-meme"><img src="https://img.shields.io/badge/MemE-v4.5.0-blue.svg" alt="MemE Verion" data-sticker /></a>

## 安装 MemE 主题
```Powershell
$ git submodule add --depth 1 https://github.com/reuixiy/hugo-theme-meme.git themes/meme
```

## 升级 MemE 主题
```Powershell
$ git submodule update --rebase --remote
```

## 使用主题
```Powershell
$ rm config.toml && cp themes/meme/config-examples/zh-cn/config.toml config.toml
# 进行写作
$ hugo server -D
```