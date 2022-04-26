---
title: "《饥荒联机版》订阅的 Mod 加载失败问题"
date: 2021-11-05T20:54:23+08:00
tags: ["饥荒", "Klei", "mod"]
series: ["生存游戏"]
related: true
---

## 客户端 mod 无法加载

碰到一个非常恼人的问题。  

### 现象

**部分 Mod 订阅之后并不能在游戏中正确加载**。  
明明是「本地模组」，却显示在「服务器模组」菜单中，而且无法识别 mod 名字和简介。  

![焯](https://i.loli.net/2021/11/05/EVZ1A5CLGPetYJr.png)

### 搜索

尝试搜索解决方案：  
* 2016.10.2 百度贴吧《[【求助】为何饥荒联机自动删除我的mod。。。。](https://tieba.baidu.com/p/4805154164)》  
* 2017.7.10 百度贴吧《[求帮助，MOD都变成了workshop怎么办](https://tieba.baidu.com/p/5215665716)》  
* 2018.1.9 百度知道《[饥荒mod出现个STEAM WORKSHOP没法用，怎么办？](https://zhidao.baidu.com/question/750719575991407092.html)》  
* 2020.10.1 百度贴吧《[20-10-01 饥荒联机版steam，mod出现workshop该怎们办](https://tieba.baidu.com/p/6992551283)》  
* 2021.8.17 知乎《[饥荒联机版mod变成workshop怎么办？](https://www.zhihu.com/question/449893467)》  
    * 指路 B 站专栏 2021.4.23  
        《[饥荒联机版神话书说模组，专属服务器无法正常启用的解决办法](https://www.bilibili.com/read/cv10991579/)》  
    * 指路 B 站视频 2021.4.23《[神话书说等模组无法正常启用？来看看解决方法吧](https://www.bilibili.com/video/BV1cK411c7Me)》  
* 2021.9.1 B 站专栏《[模组自动被删除的解决办法参考（待验证）/饥荒联机版专服](https://www.bilibili.com/read/cv12981771/)》  

无果，不过可以得知这个问题挺多人都碰到过（卑鄙地感到了欣慰）。  

### 挣扎

我尝试过以下方式：  
1. 确认网络没有问题，可以打开 Steam <ruby><rb>创意工坊</rb><rp>（</rp><rt>Workshop</rt><rp>）</rp></ruby>和 Klei 官网。  
2. 使用过游戏中模组界面左下角的「全部清除」功能（重下所有 mod 并初始化配置），问题依旧存在。  
    ![清除全部mod](https://i.loli.net/2021/11/05/jyEps6R9FdXDSnv.png)
3. 重启游戏、重启 Steam、重启电脑，问题依旧存在。  
4. 取消全部订阅、重新订阅、重新下载 mod，问题依旧存在。  
5. Steam 验证游戏文件完整性、删除游戏重新下载，问题依旧存在。  

重新订阅无法加载的 mod 尝试排查原因。  
打开游戏正式的 mod 目录 `~\Steam\steamapps\common\Don't Starve Together\mods`，这里有：  

1. 若干个 `workshop-mod_id` 格式的 mod 目录，这些是可以正确加载的 mod 们。  
2. `dedicated_server_mods_setup.lua`，开服的 mod 配置。  
3. `INSTALLING_MODS.txt` 安装 mod 的说明书。  
    他说「下载并解压 mod 到此处，进游戏启用就 OK」，彳亍，我记住了。  
4. `MAKING_MODS.txt` 开发 mod 的说明书。  
5. `modsettings.lua` 顾名思义应该是 mod 配置，里面没有任何实际内容（有数行注释）。  

已经订阅且检测到了但就是无法识别无法加载的 mod 们呢？  
在这里：打开创意工坊对应的目录 `~\Steam\steamapps\workshop\content\322330`（`322330` 是饥荒的 steam app id），可以看到这里面是「<ruby><rb>有</rb><rp>（</rp><rt>存在</rt><rp>）</rp></ruby>」名为 `mod_id` 的文件夹（这些就是 mod）的，而其中内容有 `modmain.lua`、`modinfo.lua` 以及其他脚本和资源等 mod 文件，这就是一个标准的 mod， 非常正常。  

> 已经加载成功的 mod 在 workshop 目录下的文件夹内**有且只有**一个 `一串数字_legacy.bin` 的文件，未加载成功的则是完整的 mod 文件。  

彳亍，那我按照 `INSTALLING_MODS.txt` 说的把这些「正常」的 mod 从「创意工坊文件夹」**手动**移动到<ruby><rb>饥荒联机版（DST）</rb><rp>（</rp><rt>Don't Starve Together</rt><rp>）</rp></ruby>游戏目录的「mod 文件夹」，这样总可以吧。  
将 mod 从 `~\Steam\steamapps\workshop\content\322330` 移动到 `~\Steam\steamapps\common\Don't Starve Together\mods` 目录下，并将文件夹名字从 `mod_id` 重命名为 `workshop-mod_id` 格式。  
进入游戏，令人震惊的事情发生了，我眼睁睁看着我亲手放进 `~\Steam\steamapps\common\Don't Starve Together\mods` 的 mod 文件夹被「..删掉了..」。  

真有你的啊，Klei。会写 bug 就多写点。  
实话说，Steam 创意工坊可能有锅，但加了创意工坊的游戏不止你一个，别的游戏为什么没有出现这种情况，自己反思一下。  
隔壁缺氧虽然天天更 bug（星群征服者什么时候能同步到 Steam 啊，我肝了三个档最后发现它就是游戏内可以完成但 Steam 不跳成就，全麻），但人家好歹没有这么恶性的 bug 啊，不再支持的 mod 就明说「不支持」了。  

前略，好不容易心动一次，后略，输得这么彻底。焯！  

### 解决

后续测试中我意识到其实不是删除，而是游戏主动把这些 mod 从「游戏的 mods 目录」移动到「创意工坊目录」了。  

然后我重新尝试了一次，这次**进游戏之前我移动完 mod 直接改成「只读」**。  
奇迹发生了，进游戏之后正确识别到了之前无法加载的 mod，勾选加载并重启游戏后成功启用了该 mod，进游戏实际测试该 mod 也生效了。  
妈的你这不是能用吗？整蛊我是吧。  

推测就是进游戏时加载 mod 的验证环节出了问题，验证时没有识别出来，就给移走了。  
不清楚具体是饥荒的锅还是创意工坊的锅，创意工坊确实坑蛮多的（开发方面）。  

## 提示服务器正在运行旧版本模组

### 服务端下载 mods

成功部署纯净服务端后可以正常游戏，测试完毕之后开始添加 mod。  
修改 `[饥荒服务端安装目录]/mods/dedicated_server_mods_setup.lua`，在文本末尾新增一行：  
```Lua
ServerModCollectionSetup("2048193561")
```

保存后重启服务端就会自动下载 [2048193561](https://steamcommunity.com/sharedfiles/filedetails/?id=2048193561) 这个合集里的所有 mod。  

> 当然你不嫌麻烦愿意手动 `ServerModSetup("mod_id")` 这样一行一行加也行。  

### 服务端启用 mods

修改 `~/.klei/DoNotStarveTogether/[集群名]/Master/modoverrides.lua`：  
（没有就新建 `touch` 一个）  
```Lua
return {
  -- 两根短横线是 lua 的注释
  ["workshop-2577742416"] = { enabled = true }, --全球定位
  ["workshop-2287303119"] = { enabled = true }, --显示更多信息
  ["workshop-1185229307"] = { enabled = true }, --BOSS 血条
  ["workshop-1898292532"] = { enabled = true }, --袭击时间
  ["workshop-1595631294"] = { enabled = true }  --箱子木牌
  --["workshop-2270316636"] = { enabled = true }  --表情轮盘
  -- 最后一行注释之后 第 7 行就成了最后一行 注意第 7 行末尾没有逗号
}
```

`Caves` 也要重复一遍（下洞穴才有 mod），但我懒得重复了，决定一劳永逸。  
使用「软链接」实现，视为 Windows 的快捷方式就行。  
```Bash
$ pwd # 查看当前位于哪个目录下
[用户目录]/.klei/DoNotStarveTogether/[集群名]

$ ls -l # 列出当前目录下有哪些内容
total 16
drwxr-xr-x 4 gm steam 4096 Nov 13 04:26 Caves
-rw-r--r-- 1 gm steam  481 Nov 13 01:38 cluster.ini
-rw-r--r-- 1 gm steam   64 Nov 12 23:52 cluster_token.txt
drwxr-xr-x 4 gm steam 4096 Nov 13 04:26 Master

# 确认以上没问题 建立软链接
$ ln -s ~/.klei/DoNotStarveTogether/[集群名]/Master/modoverrides.lua Caves/modoverrides.lua
# 注意自行替换 [集群名] 一般默认为 MyDediServer

# 没有回显 还是那句话 没有消息就是最好的消息
# linux 报忧不报喜 大部分时候都是报错才有回显
# 验证软链接
$ ls -l Caves
total 64
drwxr-xr-x 4 gm steam  4096 Nov 13 00:00 backup
lrwxrwxrwx 1 gm steam    68 Nov 13 01:33 modoverrides.lua -> /home/gm/.klei/DoNotStarveTogether/[集群名]/Master/modoverrides.lua
drwxr-xr-x 8 gm steam  4096 Nov 13 00:01 save
-rw-r--r-- 1 gm steam     0 Nov 13 04:26 server_chat_log.txt
-rw-r--r-- 1 gm steam   187 Nov 13 04:26 server.ini
-rw-r--r-- 1 gm steam 38532 Nov 13 19:11 server_log.txt
-rw-r--r-- 1 gm steam   128 Nov 13 04:25 worldgenoverride.lua

$ cat Caves/modoverrides.lua
# 显示的应该和 Master/modoverrides.lua 一样 成功
```

重启服务端，mod 加载成功。  
而且以后配置完 Master 的 mod 也不必再到 Caves 重复配置一次了。  

### 事情经过

启动 Steam，打开客户端游戏，连接到服务器。  
提示「服务器正在运行旧版本模组」，无法加入服务器。  

<span class="sticker">？</span>  

碰到这种情况首先应该按照提示确认服务器 mod 是否过期。  
但我确定服务器 mod 是最新的。（刚刚才下好的啊，你逗我呢。）  

那么我就碰到别的情况了。  

一阵折腾后（包括 SteamCMD 验证文件确定服务端为最新版本，清理 `mods` 与 `ugc_mods` 目录并重新下载 mod，重新配置 mod 等等，折腾完问题依旧），我发现原来服务端没有任何问题。  
有问题的是我，是我本地客户端。  

由于服务端用到的一些 mod 我本地起初是没有的。  
当我尝试连接服务器后，服务端会告诉客户端「我这里用了哪些 mod，你本地也要下才行」。  
本地：「收到，马上就下」。  

这里用 Minecraft 来打比方。  
有些服务器的特色功能是「模组实现」的，此时就需要客户端也有对应的模组，也就是某些服务器要求必须用他们的整合包才连得进服务器的原因。  
但有些原版服的特色功能是「纯插件实现」的（俗称原版插件服），所以你客户端尽管用你喜欢的*本地模组* / *光影* / *材质包*，只要不涉及到修改服务器（这种行为已经属于开挂了）随便你。你就是用 Mojang 官方下载的纯净版客户端都能连接进来。  

饥荒的服务端 mod 加载方式也属于第一种，但自由度没有那么高（没有魔改得那么厉害）。  
区区几个服务端 mod 而已，等你第一次连接的时候立刻下载也来得及，而不需要你专门提前下好定制版的魔改客户端再进服务器。  

我碰到的问题就出现在「服务端通知本地客户端下载 mod」这一步。  

我刚开始百思不得其解，因为之前都能进游戏，服务端加了 mod 就进不了了，依据直觉，显然是你服务端出了问题（此时我还没有意识到上面说的饥荒服务端 mod 的加载方式）。  

直到我打开游戏（本地客户端）「让我康康是哪些模组在捣乱」，心想实在不行关掉所有本地 mod 再试（经典控制变量法），此时我都还完全不相信是本地客户端的问题。  
主要是之前我开着所有（本地）mod 进了（还没有加服务端 mod 的）服务器，这件事给我带来的误导性太强了。  

然后我定睛一看，「服务器模组」页面为什么多出来一个名为 `workshop-mod_id` 没加载出来的 mod，WTF，哪来的妖孽？  

然后我根据 `mod_id` 按图索骥找到创意工坊，发现是之前没用过的「全球定位」，恍然大悟。  

> 之前用的 [这个 mod](https://steamcommunity.com/sharedfiles/filedetails/?id=1860955902)，没有标记功能，调用游戏原版的指南针功能实现。  
> 相当于只是强制让所有人都带了一个指南针，没有多余行为，因此比全球定位节省资源。  

### 解决方法

同本文第一部分，在本地电脑上：  
1. 手动迁移「加载失败的 mod 文件」（位于 workshop）到客户端 mod 目录。  
2. 文件夹勾选「只读」，防止傻狗客户端又验证失败移回 workshop。  
3. 重命名文件夹，加上 `workshop-` 前缀，让客户端能够识别出来。  

重进游戏，该 mod 终于加载出来了。  

与第一部分的区别就在于，之前加载不出来的是「本地模组」，这次加载不出来的是「服务端模组」，解决方法是一样的，就这么简单。  

再次连接服务器，果然成功。  

所以提示「服务器正在运行旧版本模组」未必是服务器的问题。  
也可能是你客户端的 mod 太「新」了，新到你自己的客户端都认不出来，更别说服务端了。  

所以联机版正常订阅的 mod 加载不出来这个弱智 bug 什么时候修啊？  
从 mod 改成加入 Steam 独立的 workshop 目录而不是放在游戏本体目录里，就开始了。  
敲碗等 Klei 更新。  
