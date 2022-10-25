---
title: "Scoop"
subTitle: "This is a subtitle."
date: 2022-08-22T02:57:32+08:00
tags: ["tag1", "tag2"]
series: ["A series"]
related: true
draft: true
---

我是一个很讨厌「XXX 天下第一」的人。\
但我真的很想说：Scoop 天下第一！

## 安装

略

## 使用

### 必备

```Bash
$ scoop install 7zip git aria2 sudo
```

- `7zip`：解压压缩包
- `git`：添加 bucket
- `aria2`：下载
- `sudo`：提权

设置 Aria2：

```Bash
# 重试等待时间 5s
$ scoop config aria2-retry-wait 5

# 单任务最大连接数 32
$ scoop config aria2-split 32

# 单服务器最大连接数 16
$ scoop config aria2-max-connection-per-server 16

# 文件最小切片 1M
$ scoop config aria2-min-split-size 1M
```

### 添加 bucket

其实 bucket 就相当于「软件源」：

```Bash
$ scoop bucket add <bucket_name>
```

官方认证过的 bucket：

```
$ scoop bucket known
```

- [`main`](https://github.com/ScoopInstaller/Main)：默认的 bucket（基本上都是可以在命令行运行的应用）
- [`extras`](https://github.com/ScoopInstaller/Extras)：不符合 `main` 标准（比如只有图形化界面）的其他应用
- [`versions`](https://github.com/ScoopInstaller/Versions)：其他 bucket 的应用的替代版本
- [`nirsoft`](https://github.com/kodybrown/scoop-nirsoft)：来自 [Nirsoft](https://nirsoft.net/) 的应用
- [`php`](https://github.com/ScoopInstaller/PHP)：各个版本的 PHP
- [`nerd-fonts`](https://github.com/matthewjberger/scoop-nerd-fonts)：极客向字体
- [`nonportable`](https://github.com/ScoopInstaller/Nonportable)：需要运行「安装程序」的应用（可能需要 UAC 权限）
- [`java`](https://github.com/ScoopInstaller/Java)：JDK / JRE 以及其他一切 Java 相关工具
- [`games`](https://github.com/Calinou/scoop-games)：开源游戏及游戏相关工具

你也可以[自制个性化的 bucket](https://github.com/ScoopInstaller/Scoop/wiki/Buckets#creating-your-own-bucket)，目前已经有很多别人精心准备好的 bucket 可供使用。\
警告：别人想在 bucket 塞什么东西是他们的自由，如果你要使用，请保持警惕。\
这里仅推荐一个 [`jetbrains`](https://github.com/Ash258/Scoop-JetBrains)：JetBrians 家的 IDE。

查看安装好的 bucket：

```Bash
$ scoop bucket list
```

### 安装应用

安装 / 卸载某个应用：

```Bash
$ scoop install <app_name>
$ scoop uninstall <app_name>
```

指定 bucket / 版本：

```Bash
$ scoop install <bucket_name>/<app_name>
$ scoop install <app_name>@<version>
```

#### 开发

生产力：

```Bash
# 快速搜索
$ scoop install which everything

# Draw.io 流程图
$ scoop install draw.io

# 苏门答腊 PDF
$ scoop install sumatrapdf

# RSS 阅读器
$ scoop install fluent-reader

# Windows 自动化脚本
$ scoop install autohotkey2

# Geek Unistaller
$ scoop install geekuninstaller

# 流量监控
$ scoop install trafficmonitor

# 博客程序
$ scoop install hugo-extended
```

图片相关：

```Bash
# 去 TMD 的 ACDSee
$ scoop install imageglass
```

视频相关：

```Bash
# 视频下载
$ scoop install lux

# 视频播放
$ scoop install potplayer

# 唯一指定视频处理工具
$ scoop install ffmpeg
```

运维相关（？）：

```Bash
# Windows 的 top
$ scoop install ntop

# GPG
$ scoop install gpg win-gpg-agent

# AWS S3 Cli
$ scoop install aws
```

语言环境：

```Bash
# Android
$ scoop install adb android-studio

# PHP
$ scoop install php composer

# Golang
$ scoop install go goland

# Node.js
$ scoop install nodejs yarn

# Python
$ scoop install python310
```

游戏开发：

```Bash
$ scoop install godot
```

逆向：

```Bash
# 流量分析
$ scoop install wireshark

# 密码破解
$ scoop install hashcat
```

TODO [个人在 Windows 上常用软件清单](https://www.dejavu.moe/posts/windows-apps/)

```
# 强大的串流、录屏工具
$ scoop install obs-studio

# Linux 常用工具
$ scoop install curl wget grep touch vim gcc cmake sed less

# 管理 WSL 的全功能实用程序
$ scoop install lxrunoffline

# 终端增强
$ scoop install starship

# PowerShell 7
$ scoop install powershell-preview

# ISO 写录工具
$ scoop install rufus

# DeepL 翻译工具
$ scoop install deepl

# 傲梅分区软件
$ scoop install AoMeiPartition

# 安装 cpu-z gpu-z
$ scoop install cpu-z gpu-z

# 钉钉
$ scoop install dingtalk

# DiskGenius 分区精灵
$ scoop install DiskGenius

# Chrome 浏览器
$ scoop install googlechrome
$ scoop install gradle

# IDM 下载工具
$ scoop install IDM
$ scoop install innounp
$ scoop install lessmsi

# Motrix 下载工具
$ scoop install motrix

# JAVA maven
$ scoop install maven

# Markdown 码字工具
$ scoop install typora

# Notepad++ 文本编辑器
$ scoop install notepadplusplus

# VScode
$ scoop install vscode-portable

# OpenSSL
$ scoop install openssl

# Pandoc
$ scoop install pandoc

# Postman
$ scoop install postman
$ scoop install privoxy
$ scoop install process-explorer

# Redis 管理器
$ scoop install redis-desktop-manager

# ScreenToGif 录制 Gif 工具
$ scoop install screentogif

# 图形化查看磁盘空间占用
$ scoop install SpaceSniffer

# 切换 hosts 工具
$ scoop install switchhosts

# 强大的小工具集合
$ scoop install utools

# Wox 一款 Windows 上快速启动器
$ scoop install wox
```

#### 补充列表

顺便补充一些 Windows Store 直接可以安装的：

- [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)：Windows 唯一指定终端
- [QuickLook](https://apps.microsoft.com/store/detail/quicklook/9NV4BS3L1H4S)：空格直接预览各种格式文件
- [EarTrumpet](https://apps.microsoft.com/store/detail/eartrumpet/9NBLGGH516XP)：单独控制每个程序音量
- [ShareX](https://apps.microsoft.com/store/detail/sharex/9NBLGGH4Z1SP)：截图相关工作流一网打尽
- [DevToys](https://apps.microsoft.com/store/detail/devtoys/9PGCV4V3BK4W)：开发者工具箱
- [AnLink](https://apps.microsoft.com/store/detail/anlink/9NP036014JTG)：支持无线（局域网）的安卓联通工具（ADB）
- [TranslucentTB](https://apps.microsoft.com/store/detail/translucenttb/9PF4KZ2VN4W9)：任务栏美化
- [Lively Wallpaper](https://apps.microsoft.com/store/detail/lively-wallpaper/9NTM2QC6QWS7)：比 [Wallpaper Engine](https://store.steampowered.com/app/431960/Wallpaper_Engine/) 轻量得多的壁纸
- [AIDA64](https://apps.microsoft.com/store/detail/aida64/9NBLGGH2WNWH)：硬件检测工具

### 更新应用

查看更新信息：

```Bash
$ scoop status
```

检查 Scoop 状态：

```
$ scoop checkup
```

查看某应用信息：

```Bash
$ scoop info <app_name>

# 打开应用官方网站
$ scoop home <app_name>
```

更新 Scoop 本身和 bucket：

```Bash
$ scoop update
```

更新所有可以更新的应用：

```Bash
$ scoop update *
```

禁止 / 解禁更新某个应用：

```Bash
$ scoop hold <app_name>
$ scoop unhold <app_name>
```

## 其他

导出应用列表：

```Bash
$ scoop list > Apps.txt
```

切换应用版本：

```Bash
$ scoop reset python
```
