---
title: "Android 上的 Linux: Termux 的简单使用"
date: 2021-05-17T09:45:48+08:00
tags: ["Linux", "运维", "SSH", "Termux"]
series: ["运维"]
related: true
---

首先下载著名的「linux 终端 upon 安卓 - [Termux](https://play.google.com/store/apps/details?id=com.termux)」。  

## 用电脑 SSH 登录手机 Termux
手边有电脑建议使用电脑操作：
```shell
$ pkg install openssh # 安装SSH服务
$ termux-setup-storage # 挂载手机本地存储
```

[生成 SSH-Key](/tech/linux-ssh-keys)，并把公钥导入到手机里，有两种方法。

一是将公钥文件 `xxx.pub` 保存到手机存储空间，比如照片文件夹 `DCIM`。
放在其他文件夹也行，具体对应关系参考下图。

![Termux 与手机存储空间对应关系](https://i.loli.net/2020/03/25/zNx3LvkYfbVFJem.png)

```shell
$ cat ~/storage/dcim/xxx.pub >> ~/.ssh/authorized_keys # 将公钥内容保存到SSH白名单
$ sshd # 启动SSH服务
```

二是直接把公钥内容以文本形式从电脑发送到手机。  
手机复制后 `vi ~/.ssh/authorized_keys` 输入 `i` 进入编辑模式，长按屏幕，PASTE。  
注意只能是 `vi`，因为 Termux 原生自带的是阉割版的 vim，并且只支持 `vi` 命令。  

```shell
$ ifconfig wlan0 # 查看当前手机IP
$ whoami # 查看当前用户名
```

电脑使用 SSH 软件连接 `[手机IP]:8022`（Termux 默认 SSH 端口为 8022）并用对应的「用户名」和「私钥」登录即可。  

## 安装 ArchLinux
用不惯 Termux 自带的 linux？没关系，经典的 Arch 也是可以装的。  

```shell
$ pkg install wget
$ pkg install proot
$ pkg install bsdtar
$ wget https://sdrausty.github.io/TermuxArch/setupTermuxArch.sh
$ shell setupTermuxArch.sh 运行安装脚本
```

耐心等待下载/解压完成，视网速和手机性能不同，这一步耗费的时间也会有差异。  
安装成功后会自动进入 ArchLinux 环境，可以使用 `exit` 退出。  

> 注意：Android 重启 Termux 进程后默认系统仍是 Termux，需要手动运行 `startarch` 进入 ArchLinux 环境。  

## 奥义·套娃SSH
在 linux 中使用 SSH-Key 登录别的服务器可以运行：  

```shell
$ ssh <username>@<hostname> -i ~/.ssh/<your_id_rsa_file>
```

> `hostname` 可以是 IP，也可以是正确解析的域名。  

用这种方式可以通过 Termux 登录任何一台提供 SSH 服务的服务器。  

首先还是生成密钥对，公钥放在目标服务器的 `authorized_keys`，私钥参考之前说过的方法导入到手机 Termux 里。  

`vi ~/go2server.sh` 新建一个 shell 脚本，输入以下内容并保存：  
```shell
# 假设登录的是 root 用户
# 假设目标机 SSH 端口为 22
# 假设私钥文件名为 target_server_id_rsa
# 假设已经导入到 Termux 的 ~/.ssh/ 目录下
ssh root@<hostname> -p 22 -i ~/.ssh/target_server_id_rsa
```

以后就可以快速便捷地登录服务器了：  
```shell
$ chmod +x ~/go2server.sh # 增加脚本执行权限
$ ~/go2server.sh # 运行脚本
```

当然，这个操作的意义不是简单的套娃。  
而是意味着从此以后只要手机能上网，就能登录任何一台服务器。  
相当于把 Termux 当成手机的 SSH 客户端用。  

Termux 并不是只能做这些，最简单的登录 SSH 只是牛刀小试罢了。  
说到底 Termux 就是一个 linux 系统，大部分 linux 能做的都能在上面实现，更多玩法可以自行开发。  
