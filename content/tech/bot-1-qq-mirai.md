---
title: "Bot 重建计划 #1 QQ 机器人 Mirai"
subTitle: "利用 Mirai 重新复活 QQ 机器人"
date: 2020-08-19T15:31:45+08:00
tags: ["Bot", "QQ", "Mirai"]
series: ["Bot"]
related: true
toc: false
---

截至 8 月 2 日凌晨，各大 QQ 机器人框架纷纷关闭。  
晨风直接去世（腾讯发了律师函，作者已进局子），酷 Q 停运[^1]。  

各大框架停运的口径有如下原因：  
* 一些犯罪团伙滥用聊天机器人
* 一些人冒充官方进行非法活动
* 腾讯对于借此盈利的开发者报警进行跨省抓捕（晨风作者 R.I.P.）

网上有阴谋论表示「腾讯对民间机器人下死手，是为了回收权益并推广自己的机器人平台」（比如企业微信就有 API 接口，当然了，也有付费服务）。  
也有乐观人士表示这就是现在特殊时期[^2]，敲打一下民间开发者，过了风头还是能回归如常的。  
个人不做评论，我只是一个安分守己的守法公民。  

由于酷 Q 在不久的将来会永久停运，我是不会抱着木板淹死的。作为酷 Q 的（或者可以说「唯一的」，别家基本全都跑路了）替代品，我选择将 QQ 机器人框架换成 [marai](https://github.com/mamoe/mirai)。  
Mirai 作者老怂了，虽然项目曾一度归档，但做了详细的许可证声明还是恢复了。  

> ![MIRAI](https://i.loli.net/2020/08/19/3R4pw91moTLsCJF.png)
> <cite>—— <a href="https://github.com/mamoe/mirai#%E5%A3%B0%E6%98%8E">官方仓库 README 文档</a></cite>

背景交代完毕，戏肉来了。  

## 项目架构

从[文档](https://github.com/mamoe/mirai/blob/master/docs/mirai.md#%E9%A1%B9%E7%9B%AE%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84)可以得知 mirai 的项目整体架构：

* [`mirai-core`](https://github.com/mamoe/mirai/blob/master/mirai-core) 核心服务支持库
* [`mirai-console`](https://github.com/mamoe/mirai-console) 控制台框架

而 `mirai-core` 已经被包含在 `mirai-console` 中了，因此我们要的机器人框架就是 `mirai-console`。

> 经过这次事件，我深切的意识到，你插件写得再好，终究依赖于别人的支持。  
> **真正健壮的项目应该是耦合性拉到最低的。**  
> 如无意外，我以后应该不会再写插件了，而是把业务逻辑写在自己的服务器上。框架老实当框架就好了，消息上报给我，我处理完直接发结果给你。  

所以我们自己的机器人要做的不是给 `mirai-console` 写插件，而是利用 HTTP API 将消息取出来进行处理。  

由于 [`mirai-api-http`](https://github.com/project-mirai/mirai-api-http) 已归档，我选用了另一个社区方案（不得不说开源项目还是生态天下第一）[`cqhttp-mirai`](https://github.com/yyuueexxiinngg/cqhttp-mirai)，与前身 [`CQHTTP`](https://github.com/richardchien/coolq-http-api) 相似的标准也减少了不必要的迁移工作[^3]。  

首先使用社区方案 [`miraiOK`](https://github.com/LXY1226/miraiOK) 自动配置运行环境。  

待生成 `plugins` 文件夹后选择 [cqhttp-mirai 生成的 jar](https://github.com/yyuueexxiinngg/cqhttp-mirai/releases) 下载需要的版本放入其中，并编辑配置文件 `mirai/plugins/CQHTTPMirai/setting.yml`：  
```yml
# Debug日志输出选项
debug: false
# 要进行配置的QQ号 (Mirai支持多帐号登录, 故需要对每个帐号进行单独设置)
'1234567890':
  # 是否缓存所有收到的图片, 默认为否 (仅包含图片信息, 不包含图片本身,  < 0.5KB)
  cacheImage: false
  # 心跳包相关配置
  heartbeat:
    # 是否发送心跳包, 默认为否
    enable: false
    # 心跳包发送间隔, 默认为 15000毫秒
    interval: 15000
  # HTTP 相关配置
  http:
    # 可选，是否启用HTTP API服务器, 默认为不启用, 此项开始与否跟postUrl无关
    enable: true
    # 可选，HTTP API服务器监听地址, 默认为0.0.0.0
    host: 0.0.0.0
    # 可选，HTTP API服务器监听端口, 5700
    port: 5700
    # 可选，访问口令, 默认为空, 即不设置Token
    accessToken: ""
    # 可选，事件及数据上报URL, 默认为空, 即不上报
    postUrl: ""
    # 可选，上报消息格式，string 为字符串格式，array 为数组格式, 默认为string
    postMessageFormat: string
    # 可选，上报数据签名密钥, 默认为空
    secret: ""
  # 可选，反向客户端服务
  ws_reverse:
    # 可选，是否启用反向客户端，默认不启用
    - enable: true
      # 上报消息格式，string 为字符串格式，array 为数组格式
      postMessageFormat: string
      # 反向Websocket主机
      reverseHost: 127.0.0.1
      # 反向Websocket端口
      reversePort: 8080
      # 访问口令, 默认为空, 即不设置Token
      accessToken: ""
      # 反向Websocket路径
      reversePath: /ws
      # 可选, 反向Websocket Api路径, 默认为reversePath
      reverseApiPath: /api
      # 可选, 反向Websocket Event路径, 默认为reversePath
      reverseEventPath: /event
      # 是否使用Universal客户端 默认为true
      useUniversal: true
      # 反向 WebSocket 客户端断线重连间隔，单位毫秒
      reconnectInterval: 3000
    - enable: true # 这里是第二个连接, 相当于CQHTTP分身版
      postMessageFormat: string
      reverseHost: 127.0.0.1
      reversePort: 9222
      reversePath: /ws
      useUniversal: false
      reconnectInterval: 3000
  # 正向Websocket服务器
  ws:
    # 可选，是否启用正向Websocket服务器，默认不启用
    enable: true
    # 可选，上报消息格式，string 为字符串格式，array 为数组格式, 默认为string
    postMessageFormat: string
    # 可选，访问口令, 默认为空, 即不设置Token
    accessToken: ""
    # 监听主机
    wsHost: "0.0.0.0"
    # 监听端口
    wsPort: 8080

'0987654321': # 这里是第二个QQ Bot的配置
  ws_reverse:
    - enable: true
      postMessageFormat: string
      reverseHost: 
      reversePort: 
      reversePath: /ws
      reconnectInterval: 3000
```

按需修改配置文件后，再次（利用 miraiOK）启动 mirai。  

什么叫「按需」，简单示例：  
```yml
debug: false
'机器人QQ号':
  cacheImage: false
  heartbeat:
    enable: false
    interval: 15000
  http:
    enable: true
    host: 127.0.0.1
    port: 5700
    accessToken: "鉴权token"
    postUrl: ""
    postMessageFormat: string
    secret: "数据签名密钥"
  ws_reverse:
    - enable: true
      postMessageFormat: string
      reverseHost: 127.0.0.1
      reversePort: 5701
      reversePath: /ws
      reconnectInterval: 3000
```

接下来写自己的业务逻辑就好了。  

[^1]: 酷 Q 停运：由于用户有非法违规行为，虽然目前框架暂且能正常使用，但酷 Q 网站已经关闭（包括主站 `cqp.cc` 和用户站 `cqp.me`）。  
Air（免费版）重启后不再正常运行，Pro（付费版）可以用到授权时间结束为止（另外还送一个月缓冲期，谈不上跑路，也算善始善终了），但最晚也将于 2021 年 3 月停止所有服务。  
P.S. 其实腾讯并没有动酷 Q，酷 Q 因为 Pro 版不管怎么算都是「借此盈利」，自己怂了。  
[^2]: 特殊时期：美国当局（指特朗普政府）的对中态度从去年贸易战就可见一斑，最近（2020.7）更是对字节跳动和华为痛下杀手（我认为都是下的死手，甚至对华为的打击力度还更大，华为顶住了是因为有先见之明以及对不合理的强权的战斗意志，「以斗争求团结则团结存，以退让求团结则团结亡」），预示了中美之间**信息战**的可能性，甚至可以说已经到了开战前夕的试探阶段了。8 月初也开始了护网行动（或者说「重大安全保障活动」），简单说就是咱们内部的模拟攻防演习。  
[^3]: 不必要的迁移工作：其实 mirai 是可以通过一个叫 [`mirai-native`](https://github.com/iTXTech/mirai-native) 的项目**直接加载酷 Q 的插件**的，这是几乎无需额外编码的迁移方案。不过需要在 win 平台上运行 mirai，而且这种方案实现怎么说都算不上优雅，仅做权宜之计。  
