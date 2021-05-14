---
title: "博客从零开始 #2 Git"
subTitle: "引入 Git 版本管理"
date: 2021-05-14T15:56:50+08:00
tags: ["blog", "hugo"]
series: ["ews.ink"]
related: true
---

[![](https://img.shields.io/badge/git_version-v2.31.1-blue.svg?logo=git&logoColor=fff)](https://git-scm.com/downloads) 

## 准备 git
### 配置 git 代理
```powershell
$ git config --global http.proxy 'socks5://127.0.0.1:10808'
```

### 升级 git
```powershell
$ git update-git-for-windows
```

## 关联本地和远程的仓库
> 本地已经准备好一个 Hugo 项目。

Github 新建仓库，本地进入项目目录：

```Powershell
$ git init
$ git add .
$ git commit -m "build: Initialize Hugo project"
$ git branch -M main
$ git remote add origin git@github.com:[username]/[reponame].git
$ git push -u origin main
```

> 注意自行替换 Github 用户名 `username` 及 仓库名 `reponame`。  

## 管理分支
```Powershell
$ git checkout -b writing
# 进行写作
$ git add .
$ git commit -m "..."
$ git push -u origin writing
```