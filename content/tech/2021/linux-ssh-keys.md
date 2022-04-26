---
title: "SSH 登录 Linux: SSH-Key 的简单使用"
date: 2021-05-17T09:22:48+08:00
tags: ["Linux", "运维", "SSH"]
series: ["运维"]
related: true
---

SSH-Key 用途有很多，用得最多的主要还是「SSH 登录」和「Github 鉴权」。
背景知识日后有空再补充，直接讲用法。

<!--more-->

```shell
$ ssh-keygen -t <加密算法> -b <指定密钥长度> -C "<注释>" -f <指定文件名>
```

> 其中 `加密算法` 默认为 `rsa`(SSH-2)，`指定密钥长度` 默认为 `2048`。  

```shell
$ ssh-keygen -C "yourmark" -f ~/.ssh/keys_filename
$ cat ~/.ssh/keys_filename.pub >> ~/.ssh/authorized_keys
$ chmod -R 700 ~/.ssh
$ chmod 600 ~/.ssh/authorized_keys
```
接着运行`vim /etc/ssh/sshd_config`编辑ssh配置文件：
```
## 允许使用ssh-key验证并登录 ##
RSAAuthentication yes
PubkeyAuthentication yes

#PermitRootLogin prohibit-password
## 上面这行的意思是允许登录root 但禁止直接登录root 即只能用别的账户登录成功后切换到root ##
## 不用动它 新增下面这行就行 ##
PermitRootLogin yes # 允许root直接登录
```

把`~/.ssh/id_rsa`（私钥文件）下载到本地PC，直接打开复制粘贴也好，用WinSCP下载也罢，总之把私钥保存到本地就行。
保存好私钥之后运行`service sshd restart`或者`/etc/init.d/ssh restart`重启SSH服务。

> 为了提高安全性可以直接禁止密码登录：
> `vim /etc/ssh/sshd_config`打开配置文件，修改为`PasswordAuthentication no`保存后重启SSH即可。
> 此外还可以把默认的22端口修改为其他端口进一步提高安全性。
