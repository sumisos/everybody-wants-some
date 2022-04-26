---
title: "小徽章 shields.io Badges 进阶用法"
subTitle: "业界良心 Cloudflare Workers"
date: 2021-11-15T16:26:04+08:00
tags: ["shields.io", "Badges", "Cloudflare", "Workers"]
series: ["Badges"]
related: true
---

<a href="/tech/write-badges" target="_blank">前文</a>已经介绍过了 shields.io 的 badges 基础用法。  
里面可玩性最高的显然是 endpoint 和 dynamic 两个功能。  
加上最近研究了下 Cloudflare 的 Workers，这次就尝试配合 Cloudflare Workers 来实现一个极为舒适的自动更新 badges 的效果。  

## Cloudflare 针不戳

我老白嫖怪了，其实当初是冲着免费 CDN 的羊毛入的坑（一直薅到现在），是真没想到~~这肥羊~~ Cloudflare 能长成现在这样。看来是我亏了。  

> 以下功能都是要在 DNS 页面开启 Cloudflare 的代理功能（显示为橙色云朵）的。  
> 刚解析完 DNS 还没刷新的，设置了「仅 DNS 未代理」的，甚至 DNS 根本就不在 CF 的；不要问「你说的这些功能为啥没生效 / 报错 503，你有什么头猪吗」？我怎么知道。  

先简单介绍一下 Cloudflare 常用的特色功能吧。  

首先是广为人知的「Pages」，对标的是 Github 的 Pages，但比只支持纯静态的 Github 更好用。因为 CF 的 Pages 是可以直接拉取源码进行编译的，相当于 Github Action + Github Pages 加起来的一个效果。  

其次是「Page Rules（页面规则）」，如果你的域名是停泊到 CF 家的 DNS 的话，点进管理页面可以找到「页面规则」这么一个设置。  
~~白嫖党~~ 免费用户，每个站——你有多个域名的话是分开算的，每个站都有——3 个免费名额。  
可以玩很多黑科技，当然最简单最实用的还是 301 / 302 重定向（转发）。
`*` 和 `$1`/`$2` 之类的通配符用法不说了，具体的官方有中文文档。  

最后就是这次重点要用的「Workers」了，CF 家的边缘计算，使用的语言为 JavaScript。  
（官方称还支持 Rust、C 和 C++，但实际上是编译成 WASM。）  
其实这玩意各个云平台都做了，更多的是叫「serverless」吧，腾讯的好像叫云函数，不过用下来我个人体感还是 CF 的最舒服。  
而且从 20 年年底开始还可以白嫖 KV 了（CF 家的键值对数据库，当成丐版 redis 就行）。  

突然发现我是倒着开发回去的（就是为了这碟醋才蒸的螃蟹），按这个思路写下去感觉有点怪。  
还是按顺序讲吧。  

## 实现思路

我有一台服务器，上面跑了一个游戏的服务端，我想监控这个服务端的运行状态和版本号。  
那么我可以开发一个接口，每次访问这个接口都响应最新的服务端状态。  
然而这台服务器上是没有 web 服务器的，我也不想装，虽然也不是多麻烦的事，但在这个 vps 上我不想跑网站，就让它当一个纯粹的提供各种服务端的服务器。  
所以我可以把接口做在别的已经跑了网站的服务器上，然后让这个服务器定时轮询那边的接口。  
最后效果差别不大，但其实不用别的服务器也可以。毕竟你的下一个接口，何必是接口。  

利用 Cloudflare Workers 以及 Workers KV，可以做到不用 web 服务器和数据库，也能提供简单的 CRUD 功能。  
我只要把游戏服务端的信息上传到 KV，然后构造出 shields.io 的 [endpoint](https://shields.io/endpoint/) 所需要的 JSON 结构（如下所示），就能 get 一个能够自动动态更新的 badge 了。  
```JSON
{
  "schemaVersion": 1,
  "label": "hello",
  "message": "sweet world",
  "color": "orange"
}
```

## 服务端

首先，我要拿到要监控的游戏服务端的版本号和运行状态。  
```Bash
#!/bin/bash

VERSION=$(cat [服务端安装目录]/version.txt)
PID=$(ps -aux | grep -v grep | grep [服务端进程名] | awk '{print $2}')
if [ -n "$PID" ]; then
  STATUS="running"
else
  STATUS="stop"
fi

resp=`curl "https://[接口地址]" -s -H "Content-Type: application/json" -X POST \
-d "{\"token\":\"[自定义的密钥]\",\"version\":\"$VERSION\",\"status\":\"$STATUS\"}"`

update_result=`echo $resp | grep -Po 'success[" :]+\K[^",]+'`
upgradable=`echo $resp | grep -Po 'upgradable[" :]+\K[^",]+'`

if [ $update_result == "true" ]; then
  if [ $upgradable == "true" ]; then
    echo "checkout newer version"
    # ~/upgrade_server.sh
  else
    echo "update server info success"
  fi
else
  echo "update server info failed"
fi
```

假设命名为 `update_server_status.sh`，再加入 cron 表里定时执行。  
```Bash
$ crontab -e
# 注意 crontab 和网上说的 cron 不太一样
# crontab 默认是 分钟 时钟 日期 月份 星期
# 数字直接就是间隔周期 而不是"0/5"代表"0开始间隔5"

5 * * * * ~/update_server_status.sh # 每 5 分钟执行一次
```

保存后每隔 5 分钟就会自动把当前状态推送到接口了。  

## 监控端

然后写接口，新建 Worker，详细注释的脚本：  
```JavaScript
const stringToJSON = (str) => {
  if (typeof str == 'string') {
    try {
      let obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return obj;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

async function handleRequest(request) {
  let [code, data] = [-1, {}];

  // 伪 RESTful 通过方法判断行为: POST 写入 / GET 读取
  if (request.method === "POST") {
    const body = await request.text()
    const param = stringToJSON(body) // 这个函数是容错非 JSON 格式的字符串
    if (param) {
      const { token, status, version } = param // 拿到请求携带的参数
      // 同时验证自定义的 token 以及来源 IP 确保只有来自服务器的的请求可以通过
      const rightToken = await PWD_CHECK_DB.get("[server_id].token")
      const allowedIP = await PWD_CHECK_DB.get("[server_id].ip")
      const clientIP = request.headers.get("CF-Connecting-IP")
      if (token === rightToken && clientIP === allowedIP) {
        // 将对应信息更新到 KV 数据库
        // SERVER_INFO_DB 服务器信息表
        // SHIELDS_DB     为 shields.io/endpoint 准备
        // 字段都是提前设计好的 搭配之前 shell 脚本构造请求一起使用
        await SHIELDS_DB.put("[version_shield_info].message", `v${version}`)
        await SERVER_INFO_DB.put("[server_id].version", version)
        await SERVER_INFO_DB.put("[server_id].status", status)
        if (status === "running") {
          await SHIELDS_DB.put("[shield_info].message", "online")
          await SHIELDS_DB.put("[shield_info].color", "success")
        } else {
          await SHIELDS_DB.put("[shield_info].message", "offline")
          await SHIELDS_DB.put("[shield_info].color", "inactive")
        }
        // 数据更新完成 返回响应 顺便判断是否需要更新
        // 如果 最新版本 > 服务端版本 则说明服务端可升级并该升级了
        // 至于如何拿到最新版本 我写了个爬虫去爬官方论坛上的更新日志 那是另一个故事了
        let latestVersion = await SHIELDS_DB.get("dst:steam.message")
        latestVersion = latestVersion.indexOf("v") === 0 ? latestVersion.substr(1) : latestVersion
        const upgradable = parseInt(latestVersion) > parseInt(version) ? true : false
        // 构造响应
        code = 0
        data = {
          success: true,
          upgradable: upgradable,
          message: `server status updated`
        }
      } else {
        code = 31 // 鉴权未通过
        data = {
          success: false,
          message: await RESP_MSG_DB.get(code)
        }
      }
    } else {
      code = 51 // 解析请求携带的参数失败
      data = {
        success: false,
        message: await RESP_MSG_DB.get(code)
      }
    }
  } else {
    // 不是 POST 的更新 一律视为 GET 的查询 直接返回 KV 数据库里的信息
    // 不考虑 PUT / PATCH 是我故意的 讲真 正经接口也没多少人用这俩方法吧
    code = 0
    data = {
      status: await SERVER_INFO_DB.get("[server_id].status"),
      version: await SERVER_INFO_DB.get("[server_id].version"),
      timestamp: new Date().getTime()
    }
  }

  // 发送响应
  return new Response(JSON.stringify({
    code: code,
    data: data
  }, null, 2), {
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  })
}

addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})
```

这样一个简洁但功能绝对够用的 RESTful 接口就完成了：  
- 同一个地址，服务端定时更新状态的脚本使用 POST 请求是更新数据。  
- 正常访问（GET）该地址则返回最新的服务端信息。  

并且利用好响应可以当成 webhook 用，比如服务端查询到新版本会配合脚本主动进行自更新。  
基本上可以视为双向通信（5 分钟延迟\*），可扩展性非常强，玩法完全取决于想象力。  

> \* 当然可以降到更低，但更新太频繁并不是什么好事，也根本不需要那么高的时效性。  
> 而且我记得免费版的 KV 貌似是限制 I/O 每秒一次的。  
> 还有，写入是有延迟的，响应正常但数据库没有秒刷新不要怀疑人生，让子弹飞一会。  

## 配合 shield.io 呈现

差点忘了，本文是讲 badges 来着……  
所以说我真的是为了这盘醋才包的饺子。  

再建一个 Worker，绑定一个新的解析地址。  
用来专门构造 shields.io/endpoint 所需的 JSON，脚本很简单，一看就明白：  
```JavaScript
async function handleRequest(request) {
  const url = new URL(request.url)
  const { pathname } = url

  let LABEL, MESSAGE, COLOR

  const args = pathname.toLowerCase().split("/")
  // 唯一值得讲下的一点 可以看出请求地址格式形如 https://[HOSTNAME]/[参数1]/[参数2]
  // 只有当参数有两个以上时 才会尝试搜索 KV 数据库返回对应信息
  // 并且 [参数3] 以及之后的多余参数直接忽略掉 简单的容错机制
  // 然后由于 KV 不支持 hashmap 因此键名格式设计为 [参数1:参数2] 纯属个人喜好 可以根据需求改动
  if (args.length > 2) {
    const query = `${args[1]}:${args[2]}`
    LABEL = await DB.get(`${query}.label`)
    MESSAGE = await DB.get(`${query}.message`)
    COLOR = await DB.get(`${query}.color`)
  }
  LABEL = LABEL ? LABEL : "error";
  MESSAGE = MESSAGE ? MESSAGE : "target not found";
  COLOR = COLOR ? COLOR : "critical";
  const data = {
    schemaVersion: 1,
    label: LABEL,
    message: MESSAGE,
    color: COLOR
  }

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  })
}

addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})
```

> 对了，~~现在才讲会不会有点晚了~~ 用到的 KV 需要去 Worker 设置页面「KV 命名空间绑定」。  

大功告成，最后效果如下所示：  

<span class="sticker">
<a href="https://shields.osrp.run/" target="_blank"><img src="https://img.shields.io/endpoint?url=https://shields.osrp.run/" /></a>（←点击链接查看原 JSON）
</span>

> 「你这 badge 有问题啊，这不是报错了吗。」  
> 你是来找茬的吧，就应该是 `target not found`，参数都没加，你想拿回什么东西。  

<span class="sticker">
<img src="https://img.shields.io/endpoint?url=https://shields.osrp.run/dst/server" />
<img src="https://img.shields.io/endpoint?url=https://shields.osrp.run/dst/status" />
<img src="https://img.shields.io/endpoint?url=https://shields.osrp.run/dst/steam?&logo=steam" />
</span>

> 以上的三个 badges 都是根据实际的服务端运行情况动态更新的，爽到。  
