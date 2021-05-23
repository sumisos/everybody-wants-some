---
title: "Windows Subsystem for Linux GUI 尝鲜"
subTitle: "WSLg 使用体验真的绝了"
date: 2021-05-08T01:37:49+08:00
tags: ["WSL"]
series: ["WSL"]
related: true
---

## 准备 WSL
### 开启虚拟化
`设置` - 搜索 `启用或关闭 Windows 功能`，勾上：  
* `Hyper-V`  
* `Windows Subsystem for Linux`  
* `虚拟机平台`  

确定，重启。  

### 全新安装 WSL 2
以**管理员权限**运行命令
```Powershell
$ wsl --set-default-version 2
$ wsl --install -d Ubuntu
```

### 升级到 WSL 2
如果已经安装了 WSL 1，需要升级到 WSL 2。

运行命令
```Powershell
$ wsl --list -v
```

查看版本，如果是 1，运行命令
```Powershell
$ wsl --set-version [distro_name] 2 # 注意自行替换 distro_name 成上一条命令对应发行版的 NAME
```

## 升级到 WSLg
```Powershell
$ wsl --update
```

> **注意**：只有 WSL 2 支持，WSL 1 不行。  
> 系统版本好像要 build 21362+（<kbd>Win</kbd> + <kbd>R</kbd>，`winver`），反正我是把 Insider Preview 切到 dev 渠道升级系统，然后直接 `wsl --update` 就好了。  

## 实际体验
本来我就是 WSL 重度用户，升级 GUI 简直挠到痒处。从此告别 VMware / VirtualBox。  

显卡透传？硬盘挂载？网卡桥接？不知道哇没听说过，我是小白不懂这些，我安好就能用了啊。
没别的，就是玩，哎。  

无缝的 90% 原生体验，切进去就是接近生产环境的开发环境，切出来该打游戏打游戏该写文档写文档。  

谁不知道真想舒服多搞几台工作站 + 万兆内网 + 旁路由 + 兼职服务器的 NAS，比这高到哪里去了。我也想上，问题是穷啊。  
零（经济）成本把日常机升级到这个体验，我已经爽到了，还要啥 M1。  

目前开发没有在 Ubuntu 上装 IDE，我还是配合 VSCode 插件食用的，玩够了再说。  

另外，Linux 版 QQ 还能更拉垮一点吗？  
至于我为什么想在 Linux 上用 QQ 腾讯心里没点逼数吗？TIM 就是什么好东西吗？  
鹅厂的产品论良心程度，真的只比百度云毫不掩饰的丑恶吃相强得有限。  
尤其那个 WeGame，什么不可燃垃圾。  
起初全班只有我不用，毕业后据我所知只有可怜的 DNF 玩家还在用了。  

## 其他问题
### Windows 预览体验计划 一片空白
修改注册表，将 Telemetry 等级拉满即可修复。

#### 举例
使用 Powershell 方法（[来源](https://blog.csdn.net/weixin_49192027/article/details/114701895)）：
新建文本文档 `修复空白预览体验计划.ps1`，输入

```Powershell
$regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection"
$level = "3" # Telemetry level: 1 - basic, 3 - full
New-ItemProperty -Path $regPath -Name AllowTelemetry -Value $level -Type Dword -Force
New-ItemProperty -Path $regPath -Name MaxTelemetryAllowed -Value $level -Type Dword -Force
```

以**管理员权限**运行该脚本并重启系统即可。  