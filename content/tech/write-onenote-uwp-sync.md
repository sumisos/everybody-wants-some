---
title: "解决 OneNote UWP 无法同步笔记本"
date: 2021-05-19T13:56:00+08:00
tags: ["笔记", "OneNote", "Fiddler"]
series: ["笔记"]
related: true
toc: false
---

![](https://pic1.zhimg.com/v2-d38e14f396e7cc7eb61a44af56c234c7_1440w.jpg?source=172ae18b)

> 本文参考自《[Onenote 无法同步/同步失败的原因（附解决方案）](https://zhuanlan.zhihu.com/p/128926805)》。  

在我出现这个问题之前，我有一个已经同步好的旧笔记本（存放在 OneDrive 里），Windows 和手机上都能互相同步，没毛病。  
不用什么特别的上网姿势，只要有网，直接就是同步的。  
至于这个笔记本我怎么弄好的已经忘掉了。  

于是我在手机上新建了另一个笔记本，接着就出现问题了：  
手机上显示同步成功，但电脑上无法添加笔记本，提示 `Sync failed`，错误代码 `0xE4010641`。  
魔法上网没用，全局魔法也不行。  

## 解决方法

[知乎原文章](https://zhuanlan.zhihu.com/p/128926805) 提到的 [MSDN 文章](https://docs.microsoft.com/zh-cn/archive/blogs/fiddler/revisiting-fiddler-and-win8-immersive-applications) 已经失效了，但其实已经说得清楚了：  

> 很多 UWP 应用（包括 OneNote UWP）属于 `Immersive applications`，这种应用不是直接跑在本地上的，而是被放到一个 `AppContainer` 里跑。  

又根据这篇 [Stack Overflow 回答](https://stackoverflow.com/questions/28608754/unable-to-access-localhost-from-x-ms-webview?answertab=active#tab-top) 可知：  

> Immersive applications (and IE11 on the Desktop) run inside isolated processes known as “AppContainers.” By default, AppContainers are forbidden from sending network traffic to the local computer (loopback).  

大意就是 <ruby><rb>AppContainers</rb><rp>（</rp><rt>Immersive applications</rt><rp>）</rp></ruby> 发送网络数据 <ruby><rb>环回</rb><rp>（</rp><rt>loopback</rt><rp>）</rp></ruby> 到本地的时候会 <ruby><rb>受限</rb><rp>（</rp><rt>forbidden</rt><rp>）</rp></ruby>。  

微软为这类问题提出了 [解决方案](https://docs.microsoft.com/en-us/previous-versions/windows/apps/hh780593(v=win.10))，简单说来就是通过工具指定 AppContainers 的 `name` 或 `app ID` <ruby><rb>放通</rb><rp>（</rp><rt>exempt</rt><rp>）</rp></ruby> 对应的应用。  

提供这类功能的工具并不少，我们选用 [Fiddler](https://www.telerik.com/fiddler)。

[![](https://img.shields.io/badge/Fiddler-点击下载-info)](http://fiddler2.com/r/?GetFiddler4Beta)

1. 安装 `Fiddler`。这个软件过于自觉，安装完成不会自动创建桌面快捷方式，注意记住安到什么位置了。  
2. 启动 `Fiddler`，点击左上角的 <kbd>WinConfig</kbd> 按钮。  
3. 勾选 `Onenote for Windows 10`（即 OneNote UWP），点击 <kbd>Save Changes</kbd> 保存配置，然后正常使用就行了。  

