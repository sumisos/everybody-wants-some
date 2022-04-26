---
title: "Re:从零开始的博客生涯 #1 Hugo"
subTitle: "Hugo 的基本用法"
date: 2021-05-14T15:56:49+08:00
tags: ["Blog", "Hugo"]
series: ["ews.ink"]
related: true
---

<a href="https://git-scm.com/downloads"><img src="https://img.shields.io/badge/git_version-v2.31.1-blue.svg?logo=git&logoColor=fff" alt="Git Verion" data-sticker /></a> <a href="https://github.com/gohugoio/hugo/releases"><img src="https://img.shields.io/badge/hugo_version-v0.83.1%2fextended-blue.svg?logo=hugo&logoColor=fff" alt="Hugo Verion" data-sticker /></a>

## 全新安装
### 自行编译
下载 [源码](https://github.com/gohugoio/hugo) 自行编译二进制文件即可。  
注意 Go 需要 1.3+ 版本，Windows 上编译的话 Go 要 1.4+ 版本。  

**所有平台**都可以**直接使用**编译好的**二进制文件**，下载对应的版本就好。  
不过这时需要确保二进制文件所在的目录，比如 `.\workspace\lib\hugo.exe version`；  
如果用软件包管理器就能像 `hugo version` 这样直接用。

### Windows 包管理器
用**管理员权限**在 `Powershell` 运行 `Chocolatey`：  
```bash
$ choco install hugo-extended -confirm
```

或者用**管理员权限**在 `Powershell` 运行 `Scoop`：  
```bash
$ scoop install hugo-extended
```

> 如何安装 `Chocolatey` / `Scoop` 自行搜索文档，此处不再赘述。  

### Mac 包管理器
在 `Homebrew` 运行：  
```bash
$ brew install hugo
```

### Linux 直接下载
我是直接下载（`wget`）官方仓库编译好的 [releases](https://github.com/gohugoio/hugo/releases) 的。  
**不推荐**用 hugo 直接跑 web 服务（尽管它可以做到而且很方便），主要是不方便运维管理。  
我自己用也就在 wsl 的 localhost 上运行（作为动态重载的本地文档，修改文件立即呈现的效果真的很方便）。  
有~~生之年~~ 空扩展一下写成自动化程度比较高的管理脚本吧。  

## 升级
### Windows
用**管理员权限**在 `Powershell` 运行 `Chocolatey`：  
```bash
$ choco upgrade hugo-extended -confirm
```

或者用**管理员权限**在 `Powershell` 运行 `Scoop`：  
```bash
$ scoop update hugo-extended
```

### Mac
在 `Homebrew` 运行：  
```bash
$ brew upgrade hugo
```

### Linux
直接下载最新的二进制文件覆盖旧版本即可。  

## 使用
### 生成新项目
```bash
$ hugo new site hugo-demo
$ cd hugo-demo
```
生成名为 `hugo-demo` 的 hugo 项目。  
并切换当前工作目录到刚刚建好的项目路径下。  

> 请**确保**当前工作目录位于 `...\你命名的 hugo 项目\` 路径下。  

该目录下有：  
```
archetypes/ 模版
content/    正文内容
data/       数据
layouts/    框架/样式
static/     静态资源
themes/     主题
config.toml 配置文件
```

### 生成新文章
```bash
$ hugo new posts/hello-world.md
```
以预设格式（`hugo-demo\archetypes\default.md`）在正文目录（`hugo-demo\content\posts\`）生成名为 `hello-world.md` 的新文章。  

### 生成静态文件
```bash
$ hugo
```
然后将 `public` 文件夹直接放到任意 web 服务器（`nginx`/`Apache`/`Caddy` 等）即可成功运行。  

### 在本地运行 web 服务
```bash
$ hugo server -p 9527
```

> 加上 `-p 9527` 是指定端口。  
> 如果直接运行 `hugo server` 就是**不含草稿**并运行在**默认端口**（1313）的 web 服务。  

然后用浏览器打开 [http://localhost:9527](http://localhost:9527) 或者 [http://127.0.0.1:9527](http://127.0.0.1:9527) （「本地」= `localhost` = `127.0.0.1`）就能看到本地运行的网站了。  

### 加载所有文章
* `hugo` 生成静态文件，默认 `environment` 为 `production`（生产环境）  
* `hugo server` 运行网站服务，默认 `environment` 为 `development`（开发环境）  

简单地 `hugo server` 只会加载生产环境（`production`）会展示的文章。  

加载 `.\content\` 目录下**所有** Markdown 文件（`*.md`）：  
```bash
$ hugo server -D -E -F
```

> 每篇文章都有 `meta header`（官方称之为 [`Front Matter`](https://gohugo.io/content-management/front-matter/)），可以定义该篇文章的元数据：  
> 标题 / 标签 / 分类 / 是否为草稿 / 发表时间 / 过期时间 等各种信息。  

* `-D` / `--buildDrafts` 加载草稿  
* `-E` / `--buildExpired` 加载过期的文章  
* `-F` / `--buildFuture` 加载未来的文章  
  即文章的发表时间（你想写成什么时候都行）比**此时此刻**晚  

### LiveReload
Hugo 自带 [LiveReload](https://github.com/livereload/livereload-js)，加上**默认开启**的 `--watch` 监视文件变动，一旦文件被修改就会自动热重载。  
但如果在本地绑定了域名（比如 `http://local.hugo`），访问这个域名时 `livereload.js` 可能会（错误地）尝试连接 `ws://local.hugo:[PORT]`。  

> `[PORT]` 是 `hugo server -p` 指定的端口，不指定则默认为 `1313`。  

这时可以用 `--liveReloadPort` 指定 `livereload.js` 连接 WebSocket 的端口：  
```bash
$ hugo server -p 9527 --liveReloadPort 80
```

如果本地绑定的域名和我一样是反代端口出来的，那么再访问 `http://local.hugo` 就能正确地根据文件变动实时重载了。  

### 更多玩法
更多命令用法详见 [官方文档](https://gohugo.io/commands)。  
