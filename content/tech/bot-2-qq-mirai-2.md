---
title: "Bot 重建计划 #2 重启 Mirai"
subTitle: "时隔将近一年的更新"
date: 2021-05-18T12:16:19+08:00
tags: ["Bot", "QQ", "Mirai"]
series: ["Bot"]
related: true
---

## 使用 Mirai Console Loader Installer
虽然本鸽断更已久，但经过大半年的发展，[Mirai](https://github.com/mamoe/mirai) 相关生态是越来越繁荣了，甚至有了自己的论坛 [Mirai Forum](https://mirai.mamoe.net)。  

以前那个 ~~mirai-console 的 wraper 的~~ wraper 好像停更了……  
现在用的是 iTXTech 的 [MCL Installer](https://github.com/iTXTech/mcl-installer/releases)，这里用 `v1.0.2` 演示：  

[![](https://img.shields.io/badge/MCL%20Installer-v1.0.2-info)](https://github.com/iTXTech/mcl-installer/releases/tag/v1.0.2)

```bash
$ mkdir -p ~/app/mirai && cd ~/app/mirai
# 自行查找下载对应系统的版本
$ curl -LJo mcl-installer https://github.com/iTXTech/mcl-installer/releases/download/v1.0.2/mcl-installer-1.0.2-linux-amd64
$ chmod +x mcl-installer
$ ./mcl-installer
```

```
Would you like to install Java? (Y/N, default: Y)
是否安装Java，如果上面的检测结果输出的Java版本大于11即可，可输入N跳过安装，否则必须安装Java

Java version (8-15, default: 11): 选择Java版本安装，默认为Java 11
JRE or JDK (1: JRE, 2: JDK, default: JRE): 选择JRE还是JDK安装，默认为JRE
Binary Architecture (default: x64): 选择架构安装，默认x64
如果操作系统为Windows并且需要使用 mirai-native，请选择 x32（而不是i386等其他名字）

The latest stable version of iTXTech MCL is x.x.x 获取最新MCL并询问是否下载
Would you like to download it? (Y/N, default: Y) Y：下载，N：取消
```

如果一直下不动，可以选择手动安装 JRE 11\*：  

> \* 忘了在哪看到的，Mirai 某个组件似乎最低需要 11。  
> （虽然上面的 MCL Installer 说 8 - 15 都可以。）  
> JRE 是 Java 必需的运行环境，JDK 除了运行环境之外还有开发工具。  

```bash
$ apt-get update && apt-get upgrade -y && apt install openjdk-11-jre-headless -y
$ ./mcl-installer  # 再次运行 MCL Installer
# 问 Would you like to install Java? (Y/N, default: Y) 的时候 n 就完了
```

## 使用 Mirai Console Loader
成功安装 [Mirai Console Loader](https://github.com/iTXTech/mirai-console-loader) 之后：  
```bash
$ chmod +x ./mcl
$ ./mcl
```

显示绿色的 log 就成功了：  
```
2021-05-18 16:59:21 I/main: Starting mirai-console...
2021-05-18 16:59:21 I/main: Backend: version 2.6.4, built on 2021-05-05 23:44:19.
2021-05-18 16:59:21 I/main: Frontend Terminal: version 2.6.4, provided by Mamoe Technologies
2021-05-18 16:59:21 I/main: Welcome to visit https://mirai.mamoe.net/
2021-05-18 16:59:21 I/main: Prepared built-in commands: autoLogin, help, login, permission, status, stop
2021-05-18 16:59:21 I/main: 0 plugin(s) enabled.
2021-05-18 16:59:21 I/main: mirai-console started successfully.
```

在 `mcl` 的控制台输入 `?`|`help` 可以查看用法，`stop`|`shutdown`|`exit` 退出。  

再安装登录所需的 [滑块验证](https://github.com/project-mirai/mirai-login-solver-selenium) 和官方推荐的 [http 插件](https://github.com/project-mirai/mirai-api-http) 就可以愉快的玩耍了：  
```bash
$ ./mcl --update-package net.mamoe:mirai-login-solver-selenium --channel nightly --type plugin
$ ./mcl --update-package net.mamoe:mirai-api-http --type plugin --channel stable
```

如果仍然通不过滑块验证的话可以切换默认的登录协议。  
设置 `autoLogin` 后 `vim ./config/Console/AutoLogin.yml`：  
```yaml
accounts:
  - # 账号, 现只支持 QQ 数字账号
    account: 123456
    password:
      # 密码种类, 可选 PLAIN 或 MD5
      kind: PLAIN
      # 密码内容, PLAIN 时为密码文本, MD5 时为 16 进制
      value: pwd
    # 账号配置. 可用配置列表 (注意大小写):
    # "protocol": "ANDROID_PHONE" / "ANDROID_PAD" / "ANDROID_WATCH"
    # "device": "device.json"
    configuration:
      protocol: ANDROID_PHONE
      device: device.json
  -
    account: 你的QQ号
    password:
      kind: PLAIN
      value: 你的QQ密码
    configuration:
      protocol: ANDROID_PAD
```

未设置时默认登陆协议为 `ANDROID_PHONE`，换成 `ANDROID_PAD` 可以通过验证码登录。  

如果 `mirai-login-solver-selenium` 无限报错的话：  
```bash
$ ./mcl --remove-package net.mamoe:mirai-login-solver-selenium
$ rm ./plugins/mirai-login-solver-selenium*
```

## Mirai Console Loader 启动脚本
本节内容来自 [MCL 官方提供的脚本 说明文档](https://github.com/iTXTech/mirai-console-loader/blob/master/scripts/README.md)。  

* `config.js` - 通过命令行传入配置
* `updater.js` - 用于校验和下载`mirai`文件
* `boot.js` - 用于启动`mirai console`
* `repo.js` - 用于获取`mirai repo`仓库中的信息

以下是使用样例。  

### 修改某个包的更新频道

```bash
$ .\mcl --update-package 包名 --channel 频道名
```

### 安装 `Mirai Native`

```bash
$ .\mcl --update-package org.itxtech:mirai-native --type plugin --channel stable
```

### 安装 `Chat Command`

```bash
$ .\mcl --update-package net.mamoe:chat-command --type plugin --channel stable
```

### 指定 `mirai-console` 版本
> 指定的版本必须为该`Channel`中存在的版本  

```bash
$ .\mcl --update-package net.mamoe:mirai-console --channel stable --version 1.0.0
```

### 忽略版本更新

```bash
$ .\mcl -u
```

### 禁用 `updater` 脚本

```bash
$ .\mcl --disable-script updater
```

### 启用 `updater` 脚本

```bash
$ .\mcl --enable-script updater
```

### 更新运行库但不启动

```bash
$ .\mcl --dry-run
```

### 查看帮助

```bash
$ .\mcl -h

usage: mcl
 -a,--update-package <PackageName>   Add or update package
 -b,--show-boot-props                Show Mirai Console boot properties
 -c,--log-level <level>              Set log level
 -d,--disable-script <ScriptName>    Disable script (exclude ".js")
 -e,--enable-script <ScriptName>     Enable script (exclude ".js")
 -f,--set-boot-entry <EntryClass>    Set Mirai Console boot entry
 -g,--set-boot-args <Arguments>      Set Mirai Console boot arguments
 -i,--package-info <PackageName>     Fetch info for specified package
 -j,--list-repo-packages             List available packages in Mirai Repo
 -l,--list-disabled-scripts          List disabled scripts
 -m,--set-mirai-repo <Address>       Set Mirai Repo address
 -n,--channel <Channel>              Set update channel of package
 -o,--show-repos                     Show Mirai Repo and Maven Repo
 -p,--proxy <address>                Set HTTP proxy
 -r,--remove-package <PackageName>   Remove package
 -s,--list-packages                  List configured packages
 -t,--type <Type>                    Set type of package
 -u,--disable-update                 Disable auto update
 -v,--set-maven-repo <Address>       Set Maven Repo address
 -w,--version <Version>              Set version of package
 -x,--force-version                  Force download specified version
 -z,--dry-run                        Skip boot phase
```

## Mirai Console 插件
**Mirai Console 本身是不提供任何功能的。**  
所有功能均由额外的插件实现，那么插件从哪来呢？  

<span class="sticker">[![](https://img.shields.io/badge/官方论坛-插件发布版块-Color)](https://mirai.mamoe.net/category/11/%E6%8F%92%E4%BB%B6%E5%8F%91%E5%B8%83) [![](https://img.shields.io/badge/社区相关项目-旧仓库-Color)](https://github.com/project-mirai/awesome-mirai)</span>

一般的 `.jar` 插件放入 `./plugins/` 目录后启动 `./mcl` 即可。  
如果有特殊用法的请参照插件作者的说明。  
