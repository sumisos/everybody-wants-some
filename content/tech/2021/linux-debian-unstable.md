---
title: "Debian 单独安装某个 unstable 的包"
subTitle: "Advanced Package Tool Pinning"
date: 2021-05-24T16:41:43+08:00
tags: ["Linux", "运维", "Debian", "apt"]
series: ["运维"]
related: true
---

## 修改稳定版软件源
访问 [清华大学开源软件镜像站](https://mirror.tuna.tsinghua.edu.cn/help/debian)，选择 Debian 的 `buster`，拿到国内镜像源。  
`vim /etc/apt/sources.list` 编辑软件源：  
```bash
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
```

```bash
$ apt update           # 更新软件源
$ apt install -y hugo  # 安装 Hugo
$ hugo version         # 查看 Hugo 版本

Hugo Static Site Generator v0.54.0/extended linux/arm64 BuildDate: 2019-06-04T19:16:36Z
```

`0.54.0` / `2019-06-04`，你在逗我吗，快整整两年了。  

## 查看软件包版本
访问官方仓库 [Debian Hugo](https://packages.debian.org/search?keywords=hugo)，得知：  
* `buster` (stable) 的 Hugo 是 0.55.6 版本  
* `sid` (unstable) 的 Hugo 是 0.80.0-6+b2 版本  

## 设置最新版镜像源
继续从 [清华镜像源](https://mirror.tuna.tsinghua.edu.cn/help/debian) 拿到 Debian 的 `sid`，`apt edit-sources unstable`：  
```bash
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ sid main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ sid main contrib non-free
```

这样就添加了 `sid`(unstable) 仓库（里面是最新版 / 开发版 / 尝鲜版）。  

## APT Pinning
`vim /etc/apt/preferences` 确保主体仍为 `stable`：  
```bash
Explanation: Uninstall or do not install any Debian-originated
Explanation: package versions other than those in the stable distro
Package: *
Pin: release a=stable
Pin-Priority: 900

Package: *
Pin: release o=Debian
Pin-Priority: -10
```


`vim /etc/apt/preferences.d/90debian-unstable` 确保从 unstable 仓库单独拉取 hugo 包：  
```bash
Package: hugo
Pin: release a=unstable
Pin-Priority: 900
```

## 万事俱备
```bash
$ apt update

Hit:1 https://mirrors.tuna.tsinghua.edu.cn/debian buster InRelease
Hit:2 https://mirrors.tuna.tsinghua.edu.cn/debian buster-updates InRelease
Hit:3 https://mirrors.tuna.tsinghua.edu.cn/debian buster-backports InRelease
Hit:4 https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates InRelease
Hit:5 https://mirrors.tuna.tsinghua.edu.cn/debian sid InRelease
Reading package lists... Done
Building dependency tree
Reading state information... Done
1 package can be upgraded. Run 'apt list --upgradable' to see it.
```
更新软件源后发现有一个包可以升级，我猜是 Hugo。  

```bash
$ apt list -a --upgradable

Listing... Done
hugo/unstable 0.80.0-6+b2 arm64 [upgradable from: 0.55.6+really0.54.0-1]
hugo/buster-backports 0.80.0-6~bpo10+1 arm64
hugo/stable,now 0.55.6+really0.54.0-1 arm64 [installed,upgradable to: 0.80.0-6+b2]
```

果然，那升级吧。  

```bash
$ apt upgrade hugo

Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
Some packages could not be installed. This may mean that you have
requested an impossible situation or if you are using the unstable
distribution that some required packages have not yet been created
or been moved out of Incoming.
The following information may help to resolve the situation:

The following packages have unmet dependencies:
 hugo : Depends: libsass1 (>= 3.6.3) but 3.5.5-4 is to be installed
E: Broken packages
```

还得先升依赖，`vim /etc/apt/preferences.d/90debian-unstable` 继续添加 unstable 的包：  
```bash
Package: hugo
Pin: release a=unstable
Pin-Priority: 900

Package: libsass1 libc6 libgcc-s1 libstdc++6
Pin: release a=unstable
Pin-Priority: 900
```

```bash
$ apt upgrade libsass1 libc6 libgcc-s1 libstdc++6 hugo -y
```

然后发现依赖是顺藤摸瓜越摸越多了。那你牛批。  
我输了，我本来想从仓库拉是因为懒，不是要整景，就是图以后 `apt upgrade` 方便。  

## 光太暗地太滑鞋太紧框太歪网太烂球太差天太热吃太饱手感太差观众太少我太菜
那还能咋办，老实下[二进制文件](https://github.com/gohugoio/hugo/releases/)吧。  
```bash
$ tar -xzvf hugo_0.83.1_Linux-ARM64.tar.gz
$ chmod +x hugo
$ ./hugo version
```

齐活。  

但这都不重要，本文重点是 **APT Pinning** 的用法。  
用法是没问题的，只是 Hugo 的依赖树给我整麻了。  

## 总结
通过观察可以得知：  
控制软件包到底是 stable 还是 unstable 实际上是通过自定义 Pin-Priority 不同优先级实现的。  

`man 5 apt_preferences` 可以查看具体说明：  
```
P >= 1000
    causes a version to be installed even if this constitutes a downgrade of the package

990 <= P < 1000
    causes a version to be installed even if it does not come from the target release, unless the installed version is more recent

500 <= P < 990
    causes a version to be installed unless there is a version available belonging to the target release or the installed version is more recent

100 <= P < 500
    causes a version to be installed unless there is a version available belonging to some other distribution or the installed version is more recent

0 < P < 100
    causes a version to be installed only if there is no installed version of the package

P < 0
    prevents the version from being installed

P = 0
    has undefined behaviour, do not use it.
```

一堆定语翻得我头皮发麻，搁这考英语申论呢：  
```
P < 0
    永远不安装新版本

0 < P < 100
    只安装没有装过的船新版本

100 <= P < 500
    只要新版本不是属于别的发行版的
    同时比本地的版本更高（如果本地已经装过的话）
    就安装新版本

500 <= P < 990
    只要没有特别指定 target release（我不知道指什么）
    同时比本地的版本更高（如果本地已经装过的话）
    就安装新版本

990 <= P < 1000
    除非比本地的版本更高（如果本地已经装过的话）
    否则即使特别指定 target release 也要安装新版本

1000 <= P
    安 TMD
    安就完了 即使安完会降级（版本号降低）
    无论如何也要安装新找到那个版本
```
