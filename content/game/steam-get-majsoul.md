---
title: "Steam 国区入库《雀魂》&《决斗链接》"
date: 2021-02-16T19:34:52+08:00
tags: ["Steam","雀魂", "决斗链接"]
series: ["攻略"]
related: true
---

## 准备工作
* 安装好油猴脚本 [AuTo Redeem Steamkey 3.0](https://greasyfork.org/zh-CN/scripts/36666-auto-redeem-steamkey)：这是一个网页端快速激活 Steam Key 的脚本，它还提供快速换区（购物车换区大法）和激活 sub 的功能，这里主要是用到「快速换区」。  
* 科学上网

## 第一步 换区必要的前置条件
正确使用科学上网的姿势（指挺胸抬头）。  

> 我寻思日厂游戏（雀魂是猫粮工作室做的没错，但决斗链接确实是科乐美做的）直接用日本 IP 应该可以吧。  
> 当然你想按照[决斗链接中文网](https://ygodl.com/)提供的[入库攻略](https://ygodl.com/10375.html)使用土耳其区 / 巴西区什么的也没有问题。  

## 第二步 开始换区
就是购物车换区大法，懂的自然懂，不懂的话分两种情况：  
* 愿意折腾的，既然你愿意折腾，[请自便](https://www.baidu.com/s?wd=steam%20%E8%B4%AD%E7%89%A9%E8%BD%A6%20%E6%8D%A2%E5%8C%BA)。  
* 不想折腾的，如果把「准备工作」提到的[脚本](https://greasyfork.org/zh-CN/scripts/36666-auto-redeem-steamkey)安好，[Steam 激活 CD-Key 页面](https://store.steampowered.com/account/registerkey) 和 [Steam 账户许可页面](https://store.steampowered.com/account/licenses/) 会多出一个「更改国家/地区」的按钮，是不是很简单呢？  
挂好科学上网会自动识别当前 IP 地区，然后点击切换即可。  

## 第三步 激活入库
根据 SteamDB 的数据我们得知：  
[决斗链接](https://steamdb.info/app/601510/subs/)的 sub 为 `158055`，唯一指定 ID 直接用就行。  
[雀魂](https://steamdb.info/app/1329410/subs/)就很怪，有两个 `Free on Demand` 的 sub：`483900` 和 `464328`。  

![雀魂入库](https://i.loli.net/2021/02/16/vmUwZa1jfQBDOJI.png)

如图所示，经测试（@2021.2.16）`464328` 这个 subid 可用。  

我是**成功换区后**用 ASF 激活的，如果你安装了 [AuTo Redeem Steamkey 3.0](https://greasyfork.org/zh-CN/scripts/36666-auto-redeem-steamkey)，那么你的 [Steam 激活 CD-Key 页面](https://store.steampowered.com/account/registerkey) 和 [Steam 账户许可页面](https://store.steampowered.com/account/licenses/) 都会有「激活 sub」的按钮，直接使用即可，效果一样。  

如果**没有安装脚本**，F12 打开浏览器控制台，复制粘贴以下代码并 <kbd>Enter</kbd> 运行：  
```JavaScript
jQuery.post('//store.steampowered.com/checkout/addfreelicense',{
  action: 'add_to_cart',
  sessionid: g_sessionID,
  subid: 158055
})
```
> 注意：激活雀魂要把 `subid` 换成 `464328`。  

## 安装游戏
![入库后账户许可](https://i.loli.net/2021/02/16/PVAxkUtY78INyfu.png)

> 后续更新  
> 热知识：Steam 商店网站的导航栏，「社区」和「聊天」中间的 tag 就是大写的 Steam 昵称哦。~~你会打锤子码~~  

现在游戏已经在你的库里了，在游戏库页面搜索（`雀魂`/`yugioh`） / 下载 / 安装，然后就能愉快地游玩了。  

> 当然，K 社封了大陆 IP（国服是由网易独家代理的），因此游玩决斗链接需要全程科学上网。  

全文完，Enjoy it。  