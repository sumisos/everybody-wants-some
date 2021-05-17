---
title: "同时使用 Github 以及 Gitee 进行版本管理"
date: 2021-05-17T10:06:26+08:00
tags: ["Git", "Github", "SSH"]
series: ["Git"]
related: true
toc: false
---

## 通常用法
```shell
$ ssh-keygen -C "<注释(一般是注册邮箱)>"
$ cat ~/.ssh/id_rsa.pub # 把公钥放到 Github/Gitee 账户的 SSH Key 即可

## 然后可以验证连通性 ##
$ ssh -T git@github.com
# 或者
$ ssh -T git@gitee.com
```

## 同时使用多个账户
首先还是生成 SSH-Key：  
```shell
$ ssh-keygen -b 4096 -C 'apple@mail.com' -f ~/.ssh/github_ssh_key
$ ssh-keygen -b 4096 -C 'apple@mail.com' -f ~/.ssh/gitee_ssh_key
$ ssh-keygen -b 4096 -C 'banana@mail.com' -f ~/.ssh/github_ssh_key_2
```

`vim ~/.ssh/config` 编辑配置文件：  
```
# Default Github User(Github User apple@mail.com)
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/github_ssh_key

# Another Github User(Github User2 banana@mail.com)
Host github.com-2
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/github_ssh_key_2

# Default Gitee User(Gitee User apple@mail.com)
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/gitee_ssh_key
```

默认账户没什么好说的，需要注意**第二个** github 账户应该使用：  
```
git@github.com-2:<USERNAME>/<REPONAME>.git
```

重点是里面的 `github.com-2` 应该对应 `config` 配置文件里的 `Host`，可以自行替换（比如换成 `p**nhub.com`）。  

设置完成后依次测试连通性：  
```shell
$ ssh -T git@github.com
$ ssh -T git@github.com-2
$ ssh -T git@gitee.com
```

## 实际使用
众所周知把本地分支推送到远程应该：  
```shell
$ git remote add origin git@github.com:[username]/[reponame].git
$ git push -u origin [branch]
```

所以同时使用 Gitee 的话：  
```shell
$ git remote add gitee git@gitee.com:[username]/[reponame].git

$ git push -u origin main
$ git push gitee main

# 切换其他分支
$ git checkout -b develop
$ git push -u origin develop
$ git push gitee develop
```
