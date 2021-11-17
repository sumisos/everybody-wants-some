---
title: "《饥荒联机版》服务器 Lordran"
subTitle: "有空一起挨饿 Let's Starve Together"
date: 2020-10-31T18:00:54+08:00
tags: ["饥荒", "Klei"]
series: ["生存游戏"]
related: true
toc: false
---

Sumi 和小伙伴们的饥荒服务器  

<span class="sticker">
<a href="https://forums.kleientertainment.com/game-updates/dst/" target="_blank"><img src="https://img.shields.io/endpoint?url=https://shields.osrp.run/dst/server" /></a>
<img src="https://img.shields.io/endpoint?url=https://shields.osrp.run/dst/status" />
<a href="https://store.steampowered.com/app/322330/Dont_Starve_Together/" target="_blank"><img src="https://img.shields.io/endpoint?url=https://shields.osrp.run/dst/steam?&logo=steam" /></a>
<img src="https://img.shields.io/endpoint?url=https://shields.osrp.run/dst/connect" />
</span>

## 服务器模组

服务器使用的 mod 列表：  

<span class="sticker">
<a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2048193561" target="_blank"><img src="https://img.shields.io/badge/[DST]_Server_Mods_for_Lordran-服务器_Mods_合集-orange?logo=steam&logoColor=white" data-sticker /></a>
</span>

详见《<a href="/game/dont_starve_together-mods/#server-mods-for-lordran-%E8%87%AA%E7%94%A8%E7%9A%84%E6%9C%8D%E5%8A%A1%E5%99%A8-mods" target="_blank">〈饥荒联机版〉Mods 推荐</a>》「自用的服务器 Mods」部分。  

## 游玩方法

### 控制台直连服务器

按 <kbd>`</kbd>（反引号，<kbd>Tab</kbd> 上面那个键）打开调试控制台，运行：  
```Lua
c_connect("dst.ngnl.run", 11000, "密码")
```

### 打开游戏自动进入服务器

右键 Steam 库存中的「Don't Starve Together」，选择「属性」。  
默认的「通用」选项卡最下面有一个设置 `启动选项` 的文本框，输入：  

```Bash
+connect dst.ngnl.run:11000 +password "密码"
```

输入完成后关掉窗口即可自动保存。  

![图示](https://i.loli.net/2021/11/12/xAlg2tGVRewYJMZ.png)

从此以后只要正常启动游戏，进入游戏后即可自动连接服务器。  
