---
title: "解决 Cloudflare 代理 HTTPS 出错"
date: 2021-06-02T21:53:52+08:00
tags: ["运维", "Internet", "Cloudflare"]
series: ["运维"]
related: true
mermaid: true
---

## 现象
访问自己的网站报错 `ERR_TOO_MANY_REDIRECTS` 并无限 301 重定向。  

## 背景
1. 服务器开启了**强制 HTTPS** 访问  
2. 解析 DNS 时使用了 Cloudflare 的**代理**  
3. Cloudflare 的「SSL/TLS 加密模式」设置为「**完全**」  

## 排查
查阅 [Cloudflare 文档](https://support.cloudflare.com/hc/zh-cn/articles/115000219871) 得知当 SSL 加密模式设置为完全时：  

<div class="mermaid" align="center">
graph LR
    client[浏览器] --> |HTTPS| proxy>"Cloudflare 完全代理"] --> |HTTPS| server[(源 Web 服务器)]
</div>

如上图所示，Cloudflare 将**一律**通过 HTTPS 访问源服务器，如果有什么神奇的设置**可能**导致 HTTPS 重定向到 HTTP，那么就会引发无限重定向循环问题。  
此时将 SSL 设置从「完全」或「完全（严格）」改成「灵活」也许可以解决重定向循环问题。  

<div class="mermaid" align="center">
graph LR
    client[浏览器] --> |HTTPS| proxy>"Cloudflare 灵活代理"] --> |HTTP| server[(源 Web 服务器)]
</div>

但此时 Cloudflare 到源服务器的请求**一定**是 HTTP，所以源服务器**不能开启**强制 HTTPS，否则还是会导致重定向循环。  

总而言之，Cloudflare 代理出现重定向问题，如果是灵活就改成完全，反之亦然。  
能解决大部分问题。  

## 进阶
1. 决定是否要使用 Cloudflare 的 DNS 解析**代理**，不用的话 B 事没有\*。  
  如果不用，自行在源服务器上设置强制 HTTPS 即可。  
  缺点也就是会暴露源服务器 IP 而已，没人 D 你 B 事没有。  
  退回去五年谁 TM 用得起全站 CDN 啊。  
  如果确实有用到 Cloudflare 代理的需求，爷就要白嫖，啊，转到第二步。  
2. 尝试将「SSL/TLS 加密模式」设置为「**完全**」，如果这样正常使用没有问题的话。  
  很棒，这基本就是个人和小公司网站上 HTTPS（SSL）的最佳实践了。  
  如果出现无限重定向问题，转到第三步。  
3. 如果访问时出现重定向问题，将加密模式的「完全」修改为「**灵活**」。  
  同时关掉服务器上设置的「强制 HTTPS 访问」。  
  原则上不推荐这样做，但这不是没办法嘛。  
  把安全问题完全交给 Cloudflare，要嫖就嫖全套，也不是不行。  

> \* 不用代理：不是「不用 DNS 解析」，解析是没问题的，代理是解析之外的**可选项**。  

## 其他注意事项
### 域名解析缓存
修改设置之后并**不是即时**生效的，尝试清理 cookies 或者打开新的无痕 / 隐私窗口浏览。  

### 二级子域
其他所有网站都是正常的，就它「此网站无法提供安全连接」「使用了不受支持的协议」，报错 `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`，起初我是百思不得其解。  
后来翻 [Cloudflare 文档](https://support.cloudflare.com/hc/zh-cn/articles/200170566#h_55e4d315-c60d-4798-9c4c-c75d9baed1b7) 的时候偶然发现是「二级子域」的问题。  

什么是二级子域（注意是**子域**）呢？  
因为我们一般称 `.com` 这级为「顶级域名（即 TLD，Top Level Domain）」，而 `example.com` 应该叫做「一级域名\*」。  

> \* 一级域名：也有叫「根级域」的，请区别「一级域名/根级域 ≠ 真正的**根域名**」。  
> 根域名又是什么呢？不知道你见过 `www.example.com.` 这种形式的域名没有。  
> 注意有**三个**<ruby><rb>点</rb><rp>（</rp><rt>dot</rt><rp>）</rp></ruby>，最后这个 `.` 才是真正的「根·域·名」。  
> 根域名由 `根域名服务器` 管理，详情搜索「ICANN」~~有真相~~。  
> 我记得我写过一篇关于这个的博文，回炉结果放弃的废稿太多找不到了。  

形如 `www.example.com` 应该是「二级域名」，但我们也可以把它叫做「一级**子域**」。  
以此类推，`dev.www.example.com` 就是「三级**域名**」或者「二级**子域**」了。  

问题就出在这里。  
Cloudflare **代理「浏览器到 Cloudflare 的 HTTPS」的证书只能覆盖** ~~一级子域~~ 管它几级子不子域，就是 `example.com` 和  `www.example.com` 这两种域名。那老子的二级子域怎么办？  

Cloudflare 文档给出三种解决方案：  
1. 买他家的会员（Business 以上），上传二级子域的自定义 SSL 证书。  
2. 在 Cloudflare 为这个二级子域单独购买专用证书，每月 10 刀。  
3. 放弃白嫖 Cloudflare 的代理，自己强上 HTTPS。  

### HSTS
[这篇文章](https://support.cloudflare.com/hc/zh-cn/articles/204183088) 讲了什么是 HTTP Strict Transport Security，此处不再赘述。  
总结就是一旦开启 HSTS 就没有后悔药吃了，如果不一直开启 HTTPS 直到 `max-age` 结束，网站就无法访问。  

### 混合内容
<ruby><rb>混合内容</rb><rp>（</rp><rt>Mixed Content</rt><rp>）</rp></ruby>就是同时混用 HTTP 和 HTTPS 资源。  
几年前我玩前端的时候还想方设法解决过这个问题，我上了全站 HTTPS，但我有个业务要用到一个直播源，他家推流没有 RMTP 只有 HLS，最骚的是没上 HTTPS，我要~~盗播~~引用就只有降级到 HTTP（我降级攻击我自己）。  
至今印象很深的就是我甚至考虑过上古时期丑陋的 \<iframe /\>。（当然也是不行的）  
最后的解决方案是单独为它开了一个同时支持 HTTP 和 HTTPS 的域名，当用到这个功能的时候前端强制跳转到 HTTP 版本。  

几个关于混合内容的小 Tips：  

* 如果是到本站的超链接，尽量使用类似 `/api/v1/test/` 的相对路径。  
  这个大家应该都知道了吧，但我猜大部分是因为懒而不是有意优化。  
* 如果是到外链，尽量使用 `//www.example.com/api/v1/test/` 形式的绝对路径。  
  如果没有特殊需求，不要写死 `http://` 或者 `https://`，把判断交给对方的服务器。  
* 如果没有在链接中直接带上参数 `?arg1=aaa&arg2=bbb` 的话，尽量在链接末尾加上 `/`。  
  即 `/api/v1/test/` 比 `/api/v1/test` 要好，有两个原因：  
  * 开发过程中复制粘贴链接的时候减轻「判断选中文本是否完整」的心智负担。  
  * 此外，如果你访问的是静态目录，Nginx 会自动给你末尾不带 `/` 的请求加上 `/`。  
    听起来很美是吧，但这个自动加 `/` 是 Nginx 用 301 跳转实现的……  
    多一次重定向会不会出现问题，究竟会出现什么问题大家都不知道。  
    闲着没事儿可以去打游戏，不要无事生非霍霍生产环境总是对的……  
