---
title: "开源密码管理软件 KeePass 用法"
date: 2021-07-06T13:12:21+08:00
tags: ["开源", "KeePass", "密码", "TOTP"]
series: ["Software"]
related: true
---

## 为什么一定要指定开源

不可能的，这辈子都不可能把密码交给收费软件的。  
倒不是不甘心出那个钱，问题是你都不开源，我凭什么把全身家当交给你。  
凭你想用「付费软件服务」赚我一笔的、目的「单纯」、朴素的资本家良心吗？  

IDE、设计类、笔记类，别的生产力工具就算窃取用户的劳动成果也没有一条通用的变现方法，所以他犯不着冒着毁灭自己商誉的风险，去赌你难以判断价值几何的神秘项目是否值得他们铤而走险。因为风险远高于期望收益，但凡有脑子都算得清这笔帐。  

那密码呢？不说支付密码这种直接挂钩个人财产安全的秘密（这些东西不要相信任何信息介质，记在脑子里比较好），就说简简单单随便拿到三个不同社交网站的帐号，交叉数据做个画像，岂不是能把一个人扒个底掉？  

我没有什么不可见人乃至违法乱纪的阴谋。那我身正怕什么影子斜？  
我的私生活难道不是我宝贵的隐私吗？给你扒成全裸丢到广场上你乐意？  

> 乐意也不要跟我说，我对你的性癖不感兴趣。BTW，日常生活请遵守当地法律法规。  

总而言之，且不说万一我的隐私权受到侵犯你们公司赔不赔得起。  

你甚至都没有任何赔偿承诺。  
「我只能保证我这边安全拉满，万一出事的话，我也没办法。  
「我也不想的啊，我也是受害者，我们以后生意都不好做了，这损失还不惨重吗？」  

### 1Password

比如大名鼎鼎的 1Password：  

> Your private information is yours, and we don’t sell it or give it away. Wherever **possible**, we don’t even collect it.  
> ── [About 1Password and your privacy](https://support.1password.com/1password-privacy/)
>
> ~~虽然我们没有办法自证，~~ 我们单方面承诺不泄漏你的隐私。  
> 如果不是**必要**的话，我们甚至尽量不收集你的信息。  

怎么样，是不是业界良心？  

标准嘛一堆：「[OPVault design](https://support.1password.com/opvault-design/)」「[Agile Keychain design](https://support.1password.com/cs/agile-keychain-design/)」「[安全设计白皮书](https://1password.com/files/1Password-White-Paper.pdf)」。  
吹肯定是往天花乱坠吹的。证据嘛没有。  

> It must not require a single line of encryption code to be written. Encryption code is tricky and is best left to **experts**.  
> ── [Agile Keychain design](https://support.1password.com/cs/agile-keychain-design/)

啧啧。

> 加密这一块花样很多，~~你~~ 一般人把握不住。听叔一句劝，专业的部分留给「专家」拿捏。  
> ~~你们啥都不懂就不要指手划脚了好吗~~  

哪些专家？当然是保密的啦，你问这个干嘛，是不是想买通我们请的专家盗取我们~~公司~~ 用户的数据？律师函警告。  

我们这样说了，我们就一定会这样做。别问为什么，问就是良心企业，社会责任感懂吗。  
监管？我们良心企业用不着监管。哎，就是玩。  

## KeePass 官方下载

<span class="sticker">[![](https://img.shields.io/badge/KeePass-官网-blue)](https://keepass.info/)
[![](https://img.shields.io/badge/KeePass-源码-infomational)](https://sourceforge.net/projects/keepass/files/KeePass%202.x/)
[![](https://img.shields.io/badge/截至_2021--07--06-v2.48.1-blue)](https://keepass.info/news/n210507_2.48.html)
[![](https://img.shields.io/badge/KeePass-下载链接-infomational)](https://keepass.info/download.html)
</span>

其实官方原版客户端很丑，而且易用性真的一言难尽。  
实在用不惯可以尝试第三方**开源**魔改版本。  

<span class="sticker">[![](https://img.shields.io/badge/KeePassXC-Linux/Win-blue?logo=github)](https://github.com/keepassxreboot/keepassxc/)
[![](https://img.shields.io/badge/Kee_Web-Web/Linux/Mac/Win-blue?logo=github)](https://github.com/keeweb/keeweb/)
</span>

<span class="sticker">[![](https://img.shields.io/badge/Keepass2Android-Android-blue?logo=github)](https://github.com/PhilippC/keepass2android/)
[![](https://img.shields.io/badge/KeePassDX-Android-blue?logo=github)](https://github.com/Kunzisoft/KeePassDX/)
</span>

第三方客户端功能 / 界面各有千秋，有兴趣请自行探索。  
本文主要还是讲原版。  

## KeePass 汉化

<span class="sticker">[![](https://img.shields.io/badge/KeePass-Translations-blue)](https://keepass.info/translations.html)
[![](https://img.shields.io/badge/简体中文语言文件-下载-infomational)](https://downloads.sourceforge.net/keepass/KeePass-2.46-Chinese_Simplified.zip)
</span>

解压 `.zip` 压缩包后拿到 `Chinese_Simplified.lngx`，把该文件放到安装路径下的 `Languages` 文件夹中。  
然后点击菜单栏的 <kbd><u>V</u>iew</kbd> -> <kbd>Change <u>L</u>anguage...</kbd> 选择简中即可。  

## KeePass 插件

[![](https://img.shields.io/badge/KeePass-Plugins_and_Extensions-blue)](https://keepass.info/plugins.html)

KeePass 支持使用各种插件为其原版客户端扩展功能。  

### KeePass 支持二步验证
注意系统的日期时间必须正确，否则服务可能会拒绝生成 TOTP 验证码。  

#### 原生实现
1. 新建一个记录，起好标题 / 用户名，密码填 `{TIMEOTP}` 占位符。  
2. 切换到「高级」标签，添加「字串字段」，设置该 TOTP 的密钥（也有叫序列号的）。  
3. 保存记录，双击密码栏，自动复制到剪切板的就是即时生成的 TOTP 验证码了。  

##### 详细设置
必选字段，密钥（也有叫序列号的），支持以下四种格式：  
* `TimeOtp-Secret` UTF-8 格式  
* `TimeOtp-Secret-Hex` Hex 格式  
* `TimeOtp-Secret-Base32` Base32 格式  
* `TimeOtp-Secret-Base64` Base64 格式  

可选字段：  
* `TimeOtp-Length` 指定生成的一次性密码的长度。默认为 `6`，最大为 `8`  
* `TimeOtp-Period` 指定生成的时间步长（更新周期）。默认为 `30`，单位为秒  
* `TimeOtp-Algorithm` 指定生成使用的加密算法。默认为 `HMAC-SHA-1`，三选一：  
    * `HMAC-SHA-1`  
    * `HMAC-SHA-256`  
    * `HMAC-SHA-512`  

#### 插件实现
KeePass 有好几个 TOTP 插件，我个人比较喜欢 <a href="https://github.com/KeeTrayTOTP/KeeTrayTOTP/"><img src="https://img.shields.io/badge/KeeTrayTOTP-源码-blue?logo=github" data-sticker/></a> 。  

下载插件 `KeeTrayTOTP.plgx` 后，把该文件放到安装路径下的 `Plugins` 文件夹中，重启客户端会自动编译。  

其实光看数据的话，就是多加了 `TOTP Seed` 和 `TOTP Settings` 两条字段。  

原理仍是根据 seed（密钥 / 序列号）通过标准的 TOTP 算法即时计算出对应的一次性验证码。  

##### Steam 手机令牌
别的插件我不清楚，KeeTrayTOTP 是支持 Steam 手机令牌的。  
具体怎么用参考《<a href="/game/steam-2fa/#keepass" target="_blank">Steam 模拟手机令牌二步验证</a>》的 KeePass 一节。  

## KeePass 浏览器支持扩展 KeeForm
> 警告：KeeForm 基于 AutoIt v3 开发，受 AutoIt 的 [软件许可证](https://www.autoitscript.com/autoit3/docs/license.htm) 管理。  
> 但截至目前（2021.7.6）还没有将源码托管至 Github，不过安装程序里有带有源码。  
> 目前源码以 GNU General Public License 协议开源，并计划未来将代码托管到 Github。  
> 据称，他们当下有比将代码开源至 Github 更重要的开发任务，更多详情参考 [FAQ](https://keeform.org/keepass2/keeform-faq)。  
> **无法信任请放弃使用该扩展。**  

> 从个人角度来说，我是理解的。  
> 因为我也有一堆想开源但实现实在过于丑陋，不好意思贻笑大方的烂尾楼。  
> 人家至少有勇气把源码放出来。  

[![](https://img.shields.io/badge/KeeForm-A_Simple_Form_Filler_for_Keepass-blue)](https://keeform.org/)

使用方法官网的视频演示讲得很清楚了。  

### Chrome 自带的密码管理不香吗
香，可太香了。开袋即食，无需任何配置，用起来那叫一个舒服流畅。  

想起这个，特意写了一篇《<a href="/tech/cryptology-chrome-password/" target="_blank">Python 提取 Chrome 本地保存的密码</a>》。  

想要偷走你的~~xi~~ 密码也很流畅呢。  

## KeePass 移动端

<span class="sticker">[![](https://img.shields.io/github/v/release/PhilippC/keepass2android?label=Keepass2Android&logo=github)](https://github.com/PhilippC/keepass2android/)
[![](https://img.shields.io/github/v/release/Kunzisoft/KeePassDX?label=KeePassDX&logo=github)](https://github.com/Kunzisoft/KeePassDX/)
</span>

我是卑微的安卓用户，iPhone 用户有需要自行研究。  

时至今日我仍使用的 Keepass2Android，但我很看好 KeePassDX。  
KeePassDX 无论是 UI 设计语言还是实际使用体验都更合我心意。  

等 KeePassDX 支持 模板\*、标签\* 和 WebDAV\*，我直接进行 Keepass2Android 一个载的卸，不带一丝犹豫的好吧。  

> \* 模板：[3.0.0 开发计划](https://github.com/Kunzisoft/KeePassDX/projects/40) -> [Add templates #191](https://github.com/Kunzisoft/KeePassDX/issues/191)。  
> \* 标签：[3.1.0 开发计划](https://github.com/Kunzisoft/KeePassDX/projects/50) -> [Tags #633](https://github.com/Kunzisoft/KeePassDX/issues/633)。  
> \* WebDAV：[3.1.0 开发计划](https://github.com/Kunzisoft/KeePassDX/projects/50) -> [Merge data #840](https://github.com/Kunzisoft/KeePassDX/issues/840) -> [Support URL / webdav #118](https://github.com/Kunzisoft/KeePassDX/issues/118)。  

## KeePass 详细用法
### 添加记录 / 编辑记录
[官方文档](https://keepass.info/help/v2/entry.html)  

#### 常规 General
##### 网址 URL
双击网址一栏可以使用默认浏览器打开（默认行为，可在设置里修改）。  

##### 过期 Expires
可指定该记录过期的时间。（可在设置里修改是否显示已过期记录）  
原则上说，重要密码都应该每隔三个月至少修改一次。  

#### 高级 Advanced
##### 字串字段 Custom string fields
|字段名|字段值|说明|
|:-:|:-:|:-:|
|`_etm_template`|`1`|值为 `1` 时此记录视为模板|
|`_etm_position_[TEMPLATE_NAME]`|`0`|模板字段位置，从 `0` 开始计数|
|`_etm_title_[TEMPLATE_NAME]`|`模板字段标题`|模板字段标题|
|`_etm_type_[TEMPLATE_NAME]`|`Inline`|模板字段值类型|

如果对模板有强需求，建议不要为难自己，直接上插件。  

[![](https://img.shields.io/github/v/release/mitchcapper/KPEntryTemplates?label=KPEntryTemplates&logo=github)](https://github.com/mitchcapper/KPEntryTemplates/)

![](https://keepass.info/screenshots/extensions/kpentrytemplates_big.png)

##### 附件 File attachments
可以将文件上传到数据库中，**附件会被加密保存**。  
请勿滥用此功能，这个功能初衷是旨在保存 注册信息 / 证书 / 公钥 / 私钥 等小文本文件。  
滥用会导致加密后的数据库文件巨大，严重影响传输（同步）和读取效率。  
大文件请使用专业的文件加密工具。  

#### 属性 Properties
##### 标记 Tags
翻译有点问题，就是「标签」，善用有助于索引。  

#### 历史 History
这里记录了从创建开始的所有修改并保存过的历史版本（但默认只保留最新的 10 条）。  
每一个记录下的历史版本都可以直接查看详情，并允许恢复到任何一个历史版本。  

点击菜单栏的「文件」->「数据库设置」，切换到「高级」标签，「自动记录历史维护」一栏可以设置历史记录的上限条数和占用大小。  
