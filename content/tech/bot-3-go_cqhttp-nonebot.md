---
title: "Bot 重建计划 #3 重启 NoneBot"
subTitle: "New generation, new bot."
date: 2021-06-01T20:42:33+08:00
tags: ["Bot", "QQ", "Mirai"]
series: ["Bot"]
related: true
---

## 认识生态
简单调研了下现在的 QQ 机器人生态。  

发现出了一个很有之前老版本机器人 feel 的 [先驱机器人](https://www.xianqubot.com/)，熟悉的味道令人唏嘘。  
但生态这么封闭肯定不是我要到的东西。  

继续看发现 [OneBot](https://github.com/botuniverse/onebot) 标准已经更新到 [v11](https://github.com/botuniverse/onebot/tree/master/v11/specs) 不说，连 v12 都有 [草案](https://github.com/botuniverse/onebot/blob/master/v12-draft/specs) 了。  

回想当年酷 Q 刚挂的时候，我还配合 [官方 HTTP API 插件](https://github.com/project-mirai/mirai-api-http) 的消息上报和回调接口，用原生 PHP 硬写过业务。  
后来新功能写着写着，发现不得不现造的轮子实在太多太累了，就换成了 [OneBot Mirai](https://github.com/yyuueexxiinngg/onebot-kotlin)（记得当时还叫 `cqhttp-mirai`）+ [NoneBot](https://github.com/nonebot/nonebot)（一代）。  

## 选定底层
根据 [目前生态](https://github.com/botuniverse/onebot/blob/master/ecosystem.md)（2021.6.1）得知公开的 OneBot 实现共以下六种：  

|OneBot 实现|底层|核心作者|说明|
|:-:|:-:|:-:|:-:|
|[richardchien/coolq-http-api](https://github.com/richardchien/coolq-http-api)|CKYU|richardchien|已死，酷 Q 时代的老前辈|
|[Mrs4s/go-cqhttp](https://github.com/Mrs4s/go-cqhttp)|[MiraiGo](https://github.com/Mrs4s/MiraiGo)|Mrs4s|备选|
|[yyuueexxiinngg/onebot-kotlin](https://github.com/yyuueexxiinngg/onebot-kotlin)|[Mirai](https://github.com/mamoe/mirai)|yyuueexxiinngg|备选|
|[takayama-lily/node-onebot](https://github.com/takayama-lily/node-onebot)|[node-oicq](https://github.com/takayama-lily/oicq)|takayama|排除，不想试错回调地狱|
|[Yiwen-Chan/OneBot-YaYa](https://github.com/Yiwen-Chan/OneBot-YaYa)|[先驱](https://www.xianqubot.com/)|Kanri|排除，底层未开源\*|
|[ProtobufBot/ProtobufBot](https://github.com/ProtobufBot/ProtobufBot)|[Mirai](https://github.com/mamoe/mirai) / [MiraiGo](https://github.com/Mrs4s/MiraiGo)|lz1998|排除，未完全兼容 OneBot|

> \* 未开源：「加群获取更多信息」不叫开源，我说的。  

显然问题变成了在 **OneBot Mirai**（`onebot-kotlin`）和 **go-cqhttp** 之间二选一。  

### 二选一
截至 2021.6.1，**OneBot Mirai** 依然采用 <img src="https://img.shields.io/badge/OneBot-v10-black" data-sticker/> 标准。  
而 **go-cqhttp** 兼容绝大多数 <img src="https://img.shields.io/badge/OneBot-v11-black" data-sticker/> 标准并在其基础上进行了扩展。  

对比文档可知 `go-cqhttp` 多出了以下**标准** API：  

* `/set_group_admin` 群组设置管理员  
* `/get_stranger_info` 获取陌生人信息  
* `/set_restart` 重启 go-cqhttp  
* `/.handle_quick_operation` 对事件执行快速操作  

都还蛮实用的，那就是 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp)，底层敲定了。  

## 选定 SDK
写 bot 用 Python 最大的好处可以无缝接入人工智能，就算暂时没用上，考虑到以后的扩展性也要提前做准备。以前我就是出于这一点选的 NoneBot v1，不说要上多牛逼的 NLP，反正最基本的结巴分词我就用得挺舒服的。  
那就是 [NoneBot v2](https://github.com/nonebot/nonebot2) 了。  

对我来说，用 NoneBot2 还解决了一个痛点，计划扩展到 Telegram。  
我可是曾经考虑过 Telegram Bot API + Go + OneBot 技术栈的，后来发现是伪需求（我对 TG 并没有那种硬性需求）放弃了。  
虽然目前 NoneBot2 的 Telegram 支持……不能说一张白纸吧，这饼就画了个圈。  

## 开工
<span class="sticker">[![](https://img.shields.io/badge/go--cqhttp-v1.0.0--beta4-blueviolet?logo=github)](https://github.com/Mrs4s/go-cqhttp/)
[![](https://img.shields.io/badge/go--cqhttp-文档-brightgreen)](https://docs.go-cqhttp.org/)
[![](https://img.shields.io/badge/NoneBot2-v2.0.0_a13-blue?logo=github)](https://github.com/nonebot/nonebot2/)
[![](https://img.shields.io/badge/NoneBot2-文档-brightgreen)](https://v2.nonebot.dev/)</span>

```bash
# 下载对应版本的 go-cqhttp
$ ./go-cqhttp # 首次运行生成配置文件
$ vim config.yml

# 账号密码不说了
# message.post-format 改成 array
# 放给外网的话设置 default-middlewares.access-token

# 然后是开启反向 ws 以支持 nonebot
# servers.ws-reverse.universal 改成 ws://127.0.0.1:19999/cqhttp/ws
# 端口不一定为 19999 而是 nonebot 配置文件 .env.* 里设置的 PORT

$ ./go-cqhttp faststart # 快速启动

# 建立虚拟环境
$ python -m venv env
# .\env\Scripts\activate.bat # Windows
$ source env/bin/activate

$ pip install nb-cli
$ nb create
$ vim .env.dev
# 设置 PORT 和 ACCESS_TOKEN
```

### 安装插件
#### 本地文档
```bash
$ nb plugin install nonebot_plugin_docs
```

`nb run` 后直接访问 `/docs` 查看离线文档。  

#### 前端测试
https://github.com/nonebot/plugin-test
```bash
$ nb plugin install nonebot_plugin_test
```

`nb run` 后直接访问 `/test` 在浏览器 mock 数据进行测试。  

#### 定时任务
```bash
$ nb plugin install nonebot_plugin_apscheduler
```

```Python
from nonebot import require

# 在加载 nonebot_plugin_apscheduler 插件之后

scheduler = require("nonebot_plugin_apscheduler").scheduler

# 写法 1
@scheduler.scheduled_job("cron", hour="*/2", id="xxx", args=[1], kwargs={arg2: 2})
async def run_every_2_hour(arg1, arg2):
    pass

# 写法 2
scheduler.add_job(run_every_day_from_program_start, "interval", days=1, id="xxx")
```

### 写自己的插件
```bash
$ nb plugin new
```

> 如果新建的插件不是单文件而是文件夹，在 `__init__.py` 里写业务比在 `data_source.py` 里方便。  

### 启动 bot
```bash
$ nb run
```
