---
title: "Re:从零开始的博客生涯 #5 Github Action"
subTitle: "Github Action 的基本用法"
date: 2021-05-14T19:23:27+08:00
tags: ["Blog", "Hugo", "Github Action"]
series: ["ews.ink"]
related: true
---

## 简介
使用 Git 中，你可以写一个脚本 `.yml`（就是 `.yaml`，跟 `jpg` = `jepg` 是同样的道理）放在本地 Repo 里（必须放在 `.github/workflows/` 目录下）一起 push 到远程仓库。  
Github 收到活动会自动进行判断，当脚本里写的触发条件达成时，就会临时分配一个虚拟机给你，在这个虚拟机上继续运行完整脚本。  
这就是「Github Action」服务。  

## 模拟环境
如果要练习，当然是新建一个仓库专门用来练习最好。  
但仍然很麻烦，于是可以使用模拟工具「[act](https://github.com/nektos/act)」在本地模拟测试脚本。  

Linux 运行：  
```shell
$ curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

Windows 使用 [Chocolatey](https://chocolatey.org/) 安装：  
```Powershell
$ choco install act-cli -confirm
```

然后在仓库路径下直接执行 `act` 命令即可调试 Github Action 脚本。  

## 入门
具体细节自行查阅资料，详见 [Github 官方文档](https://docs.github.com/cn/actions/quickstart) 或 [阮一峰的博客](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)。  