---
title: "开源输入法 Rime 用法"
subTitle: "打字可以很快乐"
date: 2021-07-01T18:35:57+08:00
tags: ["开源", "Rime", "输入法"]
series: ["Software"]
related: true
---

## 背景
此前我一直使用的「手心输入法@Windows」和「Gboard@Android」。  
还算能用，但不满的地方也是日积月累。  

### 手心
手心十年没更新过了，我就问一句「有时候自定义短语设置在 5 号位凭什么不显示？」  

### 谷歌
Gboard 很强，强在对多语言的支持，真的有那么丝滑，但真的谈不上有多好用。  

> 如果实在有需求，同时安装「谷歌拼音输入法」和「Google 日语输入法」，去设置中开启「显示语言切换键」和「切换到其他输入法」，一样的效果，体验实在好太多。  

### 搜狗
搜狗？搜什么狗？我真的不想刚吹完牛批，一回头全世界都在给我推送聊到的东西。  

### QQ
至于 QQ，我直说吧，我对鹅厂产品就是有偏见，流氓公司流氓软件。  

陈芝麻烂谷子都不说了。  
今年年初（2021 年 1 月），TIM / QQ 的 PC 版辅助程序 QQProtect.exe 被曝侵犯隐私，大量用户提出质疑「你一个聊天软件天天扫我浏览记录是几个意思？老子上什么网站关你球事？」  

#### 实锤
via v2ex《[QQ 正在尝试读取你的浏览记录](https://www.v2ex.com/t/745030)》  

##### 影响范围
* [QQ Windows 9.0.4](https://dldir1.qq.com/qqfile/qq/QQ9.0.4/23777/QQ9.0.4.exe) (发布于2018/06/15) 之后的版本
* [TIM Windows 3.1.0](https://dldir1.qq.com/qqfile/qq/TIM3.1.0/TIM3.1.0.21781.exe) (发布于2020/07/29) 之后的版本

##### 具体行为
1. 登录 10 分钟之后，读取浏览器浏览历史  
    * 读取 %LocalAppData% 目录下所有基于 Chromium 的浏览器历史记录，详见看雪论坛《[[原创]关于QQ读取Chrome历史记录的澄清](https://bbs.pediy.com/thread-265359.htm)》  
    * 读取 IE 浏览器历史记录(FindFirstUrlCacheEntryW) via [@raion #229](https://www.v2ex.com/t/745030?p=3#r_10077384)  
2. 对读取到的 URL 进行 md5，并在本地进行比较 via [@swchzq #157](https://www.v2ex.com/t/745030?p=2#r_10076901)  
3. md5 匹配的情况下，上传相应分组 ID（主要为电商、股票等关键词），如下所示：  

```Python
# via @raion https://www.v2ex.com/t/745030?p=3#r_10077384
tasks = {
# URL 匹配
# (23, 0x1C6389BA, 0xF2FA5666, 0xF2A2E0D3, 0xC892E7BA): b'', # ://S.TAOBAO.COM/SEARCH?
# (34, 0xB829484C, 0x520F7CC3, 0x94EC8A73, 0xD808E79): b'', # LIST.TMALL.COM/SEARCH_PRODUCT.HTM?
# (30, 0xDDA1029, 0x9E67F3BB, 0xB18ACC45, 0x597CF438): b'', # uland.taobao.com/sem/tbsearch? (来自知乎用户 @Harrion)
# (21, 0x2564591C, 0x5B11347B, 0x846A0F72, 0xEF704A8): b'', # SEARCH.JD.COM/SEARCH?

# 搜索关键词匹配
# group 1
# (18, 0x8C2F8C3B, 0x9CA6DB69, 0x663C9537, 0xA0B64B58): b'', # 古着
(7, 0x966DC59E, 0x592F2331, 0x6D2BF021, 0xA1D96C3C): b'', # VINTAGE

# group 2
# (18, 0x7FACF63C, 0xBEC2FCB0, 0xBE8836F6, 0x167CC273): b'', # 融券
# (18, 0x46B6D8D7, 0x8AA82723, 0xBE19FA24, 0x670E160C): b'', # 融资

# group 3
# (18, 0xE235F85E, 0x5C924D20, 0xA61B84AC, 0x4BC792DD): b'', # 炒股
# (18, 0x79088BEC, 0xF29CC9E8, 0xBF920D9, 0x455AE9ED): b'', # 股票
}
```

##### 事件进展
* QQ 9.4.2 (发布于2021/01/17 20:32) 移除了相应代码，暂停了侵害行为  
    via [@weifan #368](https://www.v2ex.com/t/745030?p=4#r_10079411)  
* TIM 3.3.0 (发布于2021/01/17 21:39) 移除了相应代码，暂停了侵害行为  

#### 总结
当初全网闹得沸沸扬扬现在不会都忘了吧？互联网真就没有记忆？    

TIM 和微信是我的社交圈绑架了我，不会真的有人觉得微信好用吧？  
网上想要对张小龙他妈致以亲切问候的队伍可以从深圳南山排到南极洲。  

LOL 是人家拳头做得好跟你鹅厂有什么关系？只要玩过外服就知道马服什么水品。  

不扯别的，光是 DNF 的运营我能黑一辈子。  
透明天空点击就送？你不送，我这种穷鬼可能一辈子买不起；你送了，你以为我很开心？  
我打心眼里看不起你。  
给你游大量充值让你们赚得盆满钵满的氪金玩家都被你们当成狗，我算什么东西？  
我不配玩你们游戏。  

### 结论
综上所述，我决定全面转向 Rime。  
~~拥抱开源，B 事没有。~~  

> 而且实际上手之后发现配置起来也没有想象中那么复杂。  

## 下载安装
* [中州韵](https://github.com/rime/ibus-rime)（Linux）<a href="https://github.com/rime/ibus-rime/"><img src="https://img.shields.io/github/v/tag/rime/ibus-rime?label=中州韵&logo=github" data-sticker/></a>
* [小狼毫](https://github.com/rime/weasel)（Windows）<a href="https://github.com/rime/weasel/"><img src="https://img.shields.io/github/v/release/rime/weasel?label=小狼毫&logo=github" data-sticker/></a>
* [鼠须管](https://github.com/rime/squirrel)（macOS）<a href="https://github.com/rime/squirrel/"><img src="https://img.shields.io/github/v/release/rime/squirrel?label=鼠须管&logo=github" data-sticker/></a>
* [同文](https://github.com/osfans/trime)（Android）<a href="https://github.com/osfans/trime/"><img src="https://img.shields.io/github/v/release/osfans/trime?label=同文&logo=github" data-sticker/></a>

## 自定义

### 配置文件
https://segmentfault.com/a/1190000005754706

<img src="https://i.loli.net/2021/11/11/jFbUQz6hypDP2Lv.png" title="TODO" data-sticker />

### 进行版本管理
编辑 `.gitignore`：  
```
.*
*
!.gitignore

## 安装信息
!installation.yaml

## 用户状态信息
!user.yaml

## 输入习惯
# 词典
#!*.userdb
!*.userdb.kct
# 词典快照
!*.userdb.txt
!*.userdb.kct.snapshot

## 自定义配置
# 全局设定
!default.custom.yaml
# 方案设定
!*.custom.yaml

## 其他方案
# 小鹤双拼
!double_pinyin_flypy.schema.yaml
```

### 加入双拼
```bash
$ git clone https://github.com/rime/rime-double-pinyin.git other/rime-double-pinyin
$ cp other/rime-double-pinyin/double_pinyin_flypy.schema.yaml double_pinyin_flypy.schema.yaml
```

### 参考别人的配置
```bash
$ git clone https://github.com/halfmoonvic/Rime.git other/custom-halfmoonvic -b config-2018/11/03
$ git clone https://github.com/scomper/Rime.git other/custom-scomper
```

### 自定义皮肤

<img src="https://i.loli.net/2021/11/11/jFbUQz6hypDP2Lv.png" title="TODO" data-sticker />

### 可以输入emoji 但不能遍地都是emoji

<img src="https://i.loli.net/2021/11/11/jFbUQz6hypDP2Lv.png" title="TODO" data-sticker />

### 模糊拼音

**不要**使用模糊拼音，妈的模糊拼音正常来说真的是一个蠢到上天的功能。  

#### 原罪一、严重影响输入效率
「啊允许模糊输入不是方便很多吗？！」  
方便个几把啊，比方说比较典型的相邻字符互换：`i <=> o` / `n <=> m` / `b <=> n` 等等。  
你确认自己清清楚楚地打出了正确的字符编码，结果：  
* `hao` 候选第一个是 <ruby><rb>还</rb><rp>（</rp><rt>hai</rt><rp>）</rp></ruby>
* `ma` 候选第一个是 <ruby><rb>哪</rb><rp>（</rp><rt>na</rt><rp>）</rp></ruby>  
* `ni'zhi'dao` 候选第一个是 <ruby><rb>不知道</rb><rp>（</rp><rt>bu zhi dao</rt><rp>）</rp></ruby>  
* 甚至于 `wo` 候选第一个是 <ruby><rb>期</rb><rp>（</rp><rt>qi</rt><rp>）</rp></ruby>  
* 诸如此类数不胜数  

你知道这是多恶心的一件事吗？  

想象每个字都是一个牌子，上面绑好了一根线，这根线就是字符编码（拼音 / 五笔），本来每个<ruby><rb>牌子</rb><rp>（</rp><rt>字</rt><rp>）</rp></ruby>和<ruby><rb>线</rb><rp>（</rp><rt>拼音</rt><rp>）</rp></ruby>是（近似视为）一一对应好的。  
你想挑出一个牌子，但经常手欠拉到别的线，于是你灵机一动，把你想要的牌子绑上了平时经常认错的线，这样就算拉到错的线也可以再找出对应的牌子。  
想想还挺美的是吧，但你付出的代价是什么呢？
你本来确定一定以及肯定自己选择的是正确的线，然后一拉，出来一大堆乱七八糟的牌子掉在面前，您自己慢慢找吧。  

模糊拼音的出发点是「节省修正错误输入的成本」，但这个成本真的是就这么凭空消失的吗，你确定它没有转移到其他地方，或者说**付出了另外的心智成本作为代价**吗？  
你输入一个字音，出现了明明不是这个字音的字，然后你要在其中进行**原本不需要**的挑选。  

光说我自己，高产的时候一天随便上万字，我还不是专业的文字工作者，我大部分时候还是关掉输入法直接敲代码来着，就这样我都无法忍受。  
如果允许模糊拼音，那么做一份文案需要额外多付出多少心智成本？  
对青少年的坏影响，不可估量.jpg  

#### 原罪二、由俭入奢易，由奢入俭难

假如养成了可怕的输入习惯，比如说最典型的 `[aeio]gn => [aeio]ng`，这个确实，手速快的话就是会经常打错。  
但这个问题应该**自行纠正**，而不是依赖模糊拼音得过且过。  

一旦你习惯了，形成了这类错误的肌肉记忆（比如 `uang` 打成 `augn` 也能出正确的字~~就你妈离谱~~，诸如此类），换一台电脑，没有了被你调教得明明白白的输入法，人直接傻掉。  

打一篇文章，如果不一直停下来改正错别字，最后的成文根本不能看。  
如果每个错字都要停下来一一纠正，打字速度至少砍掉一半以上。  

纵容自己习惯模糊拼音就是自断一臂，除非你能保证自己永远用的都是已经调教好的电脑。  

#### 总结

「解耦」「低耦合」「增强鲁棒性」不是什么高大上的玩意儿，作为内容生产者的你──  
「**拒绝模糊拼音**」就是身体力行地应用。  

当然了，如果你是法庭书记或者别的什么速记员，模糊输入是刚需，当我以上都是放屁好了。  
