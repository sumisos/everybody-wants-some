---
title: "手写一个日麻游戏"
subTitle: "已使用 Godot 重构"
date: 2022-04-02T22:47:45+08:00
tags: ["Godot", "Mahjong"]
series: ["游戏开发"]
related: true
mahjong: true
mermaid: true
katex: true
---

## Prototype 原型

<span class="sticker">
    <a href="https://github.com/time2beat/mahjong-game/tree/prototype" target="_blank"><img src="https://img.shields.io/badge/time2beat%2Fmahjong--game-prototype-informational?logo=github" /></a>
    <img src="https://img.shields.io/github/pipenv/locked/python-version/time2beat/mahjong-game/prototype?label=Python&logo=python&logoColor=fff" />
    <a href="https://github.com/time2beat/mahjong-game/releases/tag/v0.0.1-alpha-3c" target="_blank"><img src="https://img.shields.io/badge/version-v0.0.1--alpha--3c-informational" /></a>
</span>

## Godot 重置版

<span class="sticker">
    <a href="https://github.com/time2beat/mahjong-game/actions?query=workflow%3Agodot-ci-export" target="_blank"><img src="https://img.shields.io/github/workflow/status/time2beat/mahjong-game/godot-ci-export/main?label=Godot%20Export" /></a>
    <a href="https://github.com/time2beat/mahjong-game" target="_blank"><img src="https://img.shields.io/badge/time2beat-mahjong--game-informational?logo=github" /></a>
    <a href="https://godotengine.org/" target="_blank"><img src="https://img.shields.io/github/languages/top/time2beat/mahjong-game?label=GDScript" /></a><br/>
    <a href="https://github.com/time2beat/mahjong-game/tags" target="_blank"><img src="https://img.shields.io/github/v/tag/time2beat/mahjong-game?label=latest%20version" /></a>
    <a href="https://time2beat.github.io/mahjong-game/" target="_blank"><img src="https://img.shields.io/badge/Play-Online-success" /></a>
    <a href="https://discord.gg/X5jdmuXfgq" target="_blank"><img src="https://img.shields.io/discord/482578656229720084?label=Discord&logo=discord&logoColor=fff" /></a>
</span>

## Roadmap 路线图

> 稍微回头看了下，写得太随意了，根本没有任何组织性，想到哪里写到哪里。\
> Roadmap 既没有提纲挈领，也基本没有前瞻性，完全就是流水帐。重写重写。

重新设计项目架构：

- 麻将基础类 `MahjongBase`：麻将相关基础功能
  1. [x] 生成 `new_tile_walls()` 使用公平洗牌算法（打乱顺序）洗好的牌堆
  2. [x] 解析字符串牌面 序列化与反序列化 `serialize()` / `deserialize()` 以便 md5 验证
  3. [x] 根据牌序按人数和游戏方式发放手牌 `deal_tiles()` 并在此基础上计算出山牌
  4. [x] 根据牌序和开杠数量 `get_dora()` 计算对应的宝牌指示器 / 里宝牌 / 岭上牌 / 海底牌
  5. [ ] 判断一副手牌 `can_win()` 是否能和
  6. [ ] 判断一副手牌 `is_ready()` 是否已经听牌
  7. [ ] 计算一副手牌 `get_shanten()` 的向听数
  8. [ ] 评估一副手牌 `estimate_hand_value()` 的得分（符数、翻数、役种、基本点数）
- 麻将游戏类 `MahjongGame`：麻将游戏所需功能
  1. [ ] 生成（记录）牌谱
- 麻将游戏 Server 服务端 `BoardHost`：游戏主持人，负责裁定（联机则把这部分放到云端）
  1. [ ] {{< ruby "读写牌谱" "Play Log" >}}：手牌、山牌、宝牌、余牌、荒牌流局、摸切记录、鸣牌记录
  2. [ ] 记录{{< ruby "对局信息" "Round Info" >}}：场风、本场数、点棒（立直）数、座位（自风）、点数
- 麻将游戏 Client 客户端 `PlaySpace`：用户接口（UI）提供交互
  1. [ ] 读取已知牌谱，并进行渲染
  2. [ ] 接受用户输入（玩家操作）
  3. [ ] 排序手牌
  4. [ ] 听牌提示

<h3>版本目标</h3>

- `v0.1.0-alpha.1` **雏形**\
   能动：可以输入，处理完输入后有反馈，像个游戏的样子
- `v0.1.0-alpha.2` **完善基础设施**\
   能打麻将：可以正常游玩（指获得一局完整的游戏体验）
- `v0.1.0-alpha.3` **完成人机 AI**
  1. [ ] 思考 AI 如何介入游戏：com 玩家数据拥有 AI？还是 AI 拥有 com 玩家数据？
  2. [ ] 会打牌
  3. [ ] 会鸣牌
  4. [ ] 会做牌（保留面子打出散牌，鸣牌根据置信度确定）
- `v0.1.0-alpha.4` **完成整局单人游戏**
  1. [ ] 完成听牌提示功能
  2. [ ] 完善主要 UI
  3. [ ] 自由设置思考倒计时
- `v0.1.0-alpha.5` **完善日麻规则判定**
  1. [ ] 完成立直功能
  2. [ ] 完成振听判定
  3. [ ] 完成流局判定
  4. [ ] 完成役种判定 是否允许和牌（自风 / 场风）
  5. [ ] 完成<a href="/game/mahjong-new/#%E7%82%B9%E6%95%B0%E8%AE%A1%E7%AE%97" target="_blank">点数计算</a>
  6. [ ] 完成连续多局游戏（半庄 / 东南）
- `v0.1.0-alpha.6` **完善人机进阶 AI 策略**
  1. [ ] 不同流派：役牌 / 立直 / 平和 / 断么九
  2. [ ] 优先打闲风（不考虑大牌）
  3. [ ] 优先打绝张（绝张换听）
  4. [ ] 优先留刻子（保碰争杠）
  5. [ ] 优先打边张
  6. [ ] 优先留宝牌

[^md5]:
    这个功能主要是为了证明「游戏内部没有篡改数据」：每局的配牌在一开始就确定了（洗好牌）。\
    使用的 md5 算法理论不可逆，也就防止了根据 hash 后的 md5 码反向破解出配牌顺序。\
    ~~当然你硬要遍历一个彩虹表出来逆向谁也拦不住你是吧。~~\
    彩虹表大小： $ \LARGE{\frac{136!}{4!^{34}}} \approx 4.327 \times 10^{185} $ （[参考](http://www10.plala.or.jp/rascalhp/mjmath.htm#1)）

## Changelog 更新日志

<details class="collapse">
  <summary><code>v0.1.0-alpha.1a</code> feat: basic ui</summary>

- [x] 便于自动排序、且兼容赤宝牌的数据结构设计
- [x] 配牌生成 & 牌序记录
- [x] 序列化（字符串 → 牌序对象）和反序列化（对象 → 牌序字符串）
- [x] md5 验证牌山确保牌序未被篡改（参考[雀姬](https://www.queji.tw/cardsmd5/)）[^md5]
- [x] 基本 UI 交互界面
- [x] 根据牌序计算四家手牌
- [x] 根据牌序计算宝牌指示器（杠宝）、里宝牌（杠里宝）、岭上牌、海底牌
- [x] 发牌 / 打牌 / 摸牌
- [x] 记录摸切历史（进张、舍张记录）
- [x] <kbd>Esc</kbd> 开启 debug 控制台功能（配牌预览 山牌 / 王牌）
- [x] 动态渲染手牌和宝牌指示器
- [x] 鸣牌判定

</details>

<details class="collapse">
  <summary><code>v0.1.0-alpha.1b</code> chore: Auto CI/CD & HANDS/DRAWS enum</summary>

- [x] 部署 SSH-Key `ssh-keygen -b 4096 -C "ACTIONS_DEPLOY_KEY" -f actions_deploy_key`
- [x] 找到合适的 action 脚本 <a href="https://github.com/marketplace/actions/godot-ci" target="_blank"><img class="emoji" src="https://img.shields.io/badge/GitHub_Actions-godot--ci-informational?logo=github" /></a>
- [x] 修改脚本以适配本项目
- [x] 打通自动部署工作流 <a href="https://time2beat.github.io/mahjong-game/" target="_blank"><img class="emoji" src="https://img.shields.io/badge/GitHub_Pages-Mahjong_Fruit-success?logo=github" /></a> 由 GitHub Action 自动编译
- [x] 枚举：役种 / 流局类型

</details>

<details class="collapse">
  <summary><code>v0.1.0-alpha.2a</code> feat: basic game</summary>

- [x] feat: 单元测试 hook
- [x] feat: 优化发牌函数，降低耦合程度：手牌和山牌计算现在最低兼容 2 个玩家\
       （而且不止可以发 13 张，即使发 7 张，各玩家的手牌和山牌也是正确的。）
- [x] feat: 渲染别家手牌信息
- [x] feat: Debug 控制台添加透视功能
- [x] feat: 新增了简单的标题界面和调试界面
- [ ] feat: 完成鸣牌功能（包括加杠 / 暗杠）{{< color-text "doing" "red" bold >}} 已完成按钮功能和渲染副露区
- [ ] feat: 完成和牌判定
- [ ] feat: 完成主游戏循环（轮流 turn 摸切）
- [x] feat: 新增了音效（资源来自 [天鳳用オリジナル SE: アンコロキング blog](http://ancoro.way-nifty.com/blog/se.html)）
- [x] style: 更新了图片素材（资源来自 [麻雀の画像・素材 - 来夢来人](https://www.civillink.net/fsozai/majan.html)）
- [x] fix: 更新了牌背的渲染方式：着色器染色 → 直接更换素材帧\
       现在理论上不可能（作弊）**看穿**牌背（因为它本来就是{{< ruby "一张单独" "不携带数据" >}}的 **背面** 牌）。\
       ~~以前取消着色器就可以直接透视牌面了。~~
- [x] fix: 重绘了 UI 布局，添加了对局信息：东一局 / 本场数 / 点棒数 / 余牌数 / 各家点数
- [x] fix: 现在可以正确渲染赤宝牌了（以前计算是正确的，但显示为普通五万 / 饼 / 索）

</details>

## Reference 参考资料

- 「[麻将 - 维基百科](https://en.wikipedia.org/wiki/Mahjong)」规则参考、变量 / 函数命名参考
- 「[麻将基本术语中英文对照表](https://www.xqbase.com/other/mahjongg_english.htm)」变量 / 函数命名参考
- 「[日麻“王牌”的简单知识——海底、宝牌指示、岭上三者关系](https://bbs.nga.cn/read.php?tid=16056906)」王牌算法参考
- 「[麻雀 和了判定（役の判定） アルゴリズム](http://hp.vector.co.jp/authors/VA046927/mjscore/mjalgorism.html)」和牌判定算法参考
- 「[麻雀の数学](http://www10.plala.or.jp/rascalhp/mjmath.htm)」相关数学概念认知
- 「[麻雀の役一覧（出現確率ランキング順）](http://www2.odn.ne.jp/~cbm15900/html/y99.html)」相关数学概念认知补充
- 「[天鳳 | 最高峰の対戦麻雀サイト](https://tenhou.net/)」流程设计参考
- 「[4chan /mjg/ Repository](https://repo.riichi.moe/)」麻将相关的各种资料 / 资源
- {{< github "yuanfengyun/qipai_algorithm" >}} 各种语言的棋牌相关算法
- {{< github "kobalab/Majiang" >}} [HTML5 在线日麻](https://kobalab.net/majiang/)（交互参考）
- {{< github "MahjongRepository/mahjong" >}} 日麻相关 Python 库
- {{< github "EndlessCheng/mahjong-helper" >}} 日麻助手（计算牌效，支持天凤 / 雀魂，AI 算法参考）
- {{< github "Equim-chan/akochan-reviewer" >}} [天凤 / 雀魂复盘工具](https://akochan.ekyu.moe/) 链接
- {{< github "zyr17/MajsoulPaipuAnalyzer" >}} 雀魂牌谱分析工具
- {{< github "MajsoulPlus/majsoul-plus" >}} 雀魂加强版客户端

## Thinking 思考

### 22.4.23 反思

静下来思考的时候发现两个问题。

其一，这个问题是我在思考更好的 AI 引入方式的时候发现的：\
各家**进张**（摸牌）和**舍张**（打牌）的历史记录，不属于玩家，而是**属于这局游戏**。\
没错，连进张记录也属于游戏；和舍张记录的区别也就只对创造者可见，对其他玩家隐藏罢了。

我本来在想引入 AI 后，是 AI 对象拥有一个完整的玩家数据对象？（`AI` drive `人机玩家`）\
还是玩家数据对象内部嵌入了一个 AI 对象？（`AI` in `人机玩家`）

此时我突然意识到，「每家打了哪些牌」这个信息，并不属于玩家自己，而是整局游戏。\
参与游戏的每个玩家（甚至包括没有参与的旁观者）都能获取这些信息。\
此前我将进张 / 舍张记录放在玩家对象里是非常愚蠢的做法。

其二、我陷入了一个「需要帮助、却下意识拒绝帮助」的思维怪圈。

> 不得不说语言实在是很神奇的东西，有时候微不足道，有时候又雷霆万钧。\
> 甚至不需要说出口（不过说出口的心理增幅作用也很重要），在心里化作成型的语句就够了。

本来我就是随便起了个标题——「**手写**」。我以为自己没有当真，其实潜意识里当真了。\
心里埋下这个种子之后，它在不知不觉中长成了一种执念。\
明明需要进修，却无意中拒绝进修，而是一味钻牛角尖自己闭门造车。

他妈的，动动手指搜索一下解决方案，参考而已，又没让你照抄，真的有那么难吗？\
明明有成熟的算法可以参考，非要自己（宁愿避开）从零开始实现，图个啥呢。

### 数据结构设计

生成配牌
: 最公平的方法自然是当作真的有那 136 张麻将牌，然后用公平洗牌算法打乱顺序。
: 如何实现也很简单，枚举每一张牌就行了。
: 而且还能完美兼容赤宝牌。（因为相当于每一张牌都有了自己的「身份证」）

枚举每一张牌
: 最简单的方法是直接按顺序排列枚举值：从 `0` \~ `135`。
: 问题在于这样做会丢失特征：突然给你一个号，除了拿去查表没有其他办法认出它是谁。
: 现实中的{{< ruby "身份证" "18 位" >}}也没有说单纯递增 +1 的吧？而是 {{< ruby "户口地区" "6" >}} + {{< ruby "出生日期" "8" >}} + {{< ruby "编号" "3" >}} + {{< ruby "校验码" "1" >}}。
: 所以我决定将麻将的「身份证」也设计为 3 位：
: 花色（万、饼、索、字）、序号（`1 ~ 9` / `1 ~ 7`）、编号（`0 ~ 3` 共 4 张）。
: 这样做的好处是一看就知道是哪张牌，代码上也很好处理：花色 `x/100`、序号 `x/10 %10`。
: 为了避免处理前导零问题，花色（百位）从 1 到 4，序号（十位）从 1 到 9(7)。
: 而编号仍然按照代码习惯从 0 到 3 ——共计 4 位，代表四张同种麻将牌。
: 所有枚举值都是 `100 < x < 500` 的 {{< ruby "整型" "int" >}}，也保证了尽量小的运算量。
: 而且有些语言本来就不支持枚举字符串（`9m/9p/9s/7z`），这个设计也保证了通用性。
: 这个设计还有个好处就是排序手牌变得非常简单，直接按值从小到大排就行了。
: 天然兼容赤宝牌，无需任何额外判断。

枚举不同的牌
: 在运算过程中还会经常碰到要遍历 34 种不同麻将牌的需求。
: 但这就没必要过度设计了，直接按顺序排成 `0` \~ `33` 即可。
: 实际两个嵌套 for 循环或者加个判定条件就能区分；这样也能贴合数量映射数组的 `index`。
: 键名最好设置为上一个设计的前两位（花色 + 序号），方便直接获取位置（`x/10`）。
: 如果枚举不支持数字键名就使用字符串组合键名（`KEY_11`），或用常量对象 / 字典 / map。

### 核心算法业务逻辑

本来想过换成 Go 来写，编译成动态链接库 `mahjong.dll` 再给 Godot 游戏加载。\
加载完 `Assembly.LoadFile("mahjong.dll")` 就可以直接调用 `GDNative.call_native()`。\
转念一想，算法都有了，用什么语言又有什么区别呢？

### 配牌生成以及主要游戏流程

<div class="mermaid">
flowchart LR
  suit("日麻花色") ==>|"包括"| num("数字牌")
  suit ==>|"包括"| honor("字牌")
  num ==>|"包括"| man("万子 🀇🀈🀉🀊🀋🀌🀍🀎🀏")
  num ==>|"包括"| suo("索子 / 条子 🀐🀑🀒🀓🀔🀕🀖🀗🀘")
  num ==>|"包括"| ping("饼子 / 筒子 🀙🀚🀛🀜🀝🀞🀟🀠🀡")
  honor ==>|"包括"| wind("风牌 🀀🀁🀂🀃")
  honor ==>|"包括"| dragon("三元牌 🀆🀅🀄")
</div>

那么一局总共有 $ \left( 9 \times 3 + 7 \right) \times 4 = 136 $ 张麻将牌（日麻没有季节牌和花牌）。\
除开 4 家的起手手牌和 7 墩王牌还剩 $ 136 - \left( 13 \times 4 + 1 \right) - \left( 2 \times 7 \right) = 69 $ 张山牌。

1. 标准 136 张，洗牌 shuffle 洗成乱序。
2. 从庄家开始轮流摸 4，三轮后，庄家摸 2，闲家各摸 1。
3. 起手完毕，翻开第 1 张宝牌指示器（倒第 5 张）。
4. 庄家打出第一张牌，正常轮流摸切。

### 序列化与反序列化

反序列化为字符串后会**损失**每一张牌**自己**的具体位置信息，不过牌种位置信息还在。\
比方说 `152, 153, 150, 151` 反序列化后就是 `5m0m5m5m`。\
只有特别处理过的 {{< mahjong 0m >}} 的位置信息还在，别的普通 {{< mahjong 5m >}} 具体 **一对一** 的位置信息都在转换过程中损失了。重新序列化 `5m0m5m5m` 变成 `150, 153, 151, 152`，已经不是原来的序列了。

但实际上对游戏本身 **并没有影响**。\
因为实际游戏过程中是不会关心「一张五万本来是第几张五万」的：\
「我只和上局 **第三张** 打出的 _七饼_，别的 _七饼_ 我不和」这不是有病吗。

洗牌时枚举每一张进行打乱顺序，是为了保证公平，不会出现意外的偏差（比如避免和上一局的牌序发生某些关联）。洗完之后同一种牌具体的排序就不再重要了，损失掉也没关系，只要保证赤宝牌的位置信息没损失就行了。

以字符串序列化的牌序，同一种牌永远是 `0, 1, 2, 3` 这样排序，尾号为 3 的牌永远沉底——\
只有{{< color-text "赤宝牌" "red" bold >}}特殊处理，洗完它在哪里它就一直在那里，序列化和反序列化不会对它产生影响。\
所以起始手牌可能存在赤宝牌，这是符合事实逻辑的。

### 关于鸣牌

同时鸣牌如何判定？

- **和牌** 判定最高，可以抢所有鸣牌。（十三么甚至可以抢暗杠）
- **杠** 和 **碰** 之间不存在冲突。（3 + 2 抢 1 = 6 张同种牌是吧？搁这千王之王呢）
- **杠** 和 **碰** 优先级大于 **吃**。
- **吃** 只能吃上家，因此也不存在 **吃** 抢 **吃**，同一时间只有一个人有可能吃。
- 因此鸣牌优先级为：和 > 杠 / 碰 > 吃。

鸣牌如何标记？（和牌不需要标记，除非是「血战」玩法）

> 吃只可能吃上家，因此只有 `_ 2 3` / `1 _ 3` / `1 2 _` 吃哪组的问题。

```GDScript
var meld: Dictionary = {  # 副露 示例数据结构
  "type": CALL.CHOW,  # 枚举鸣牌类型
  "have": [],  # 拥有的牌
  "pick": [],  # 捡回的牌
  "mark": 0,   # 特殊标记的位置  吃不需要特殊标记 位置信息就足够了
}                              # 比如 123 213 312
                               # 碰 / 杠才需要, 比如 222 需要标记哪张是碰过来的
```

> 其实 `type` 都不需要，保留只是为了提高容错。

|                             吃                             |           碰            |                          加杠                           |                         大明杠                          |                                          暗杠                                           |
| :--------------------------------------------------------: | :---------------------: | :-----------------------------------------------------: | :-----------------------------------------------------: | :-------------------------------------------------------------------------------------: |
|                         吃第 1 张                          |       碰下家 `#1`       |                   碰下家后 `#1` 加杠                    |                       杠下家 `#3`                       |                                         不求人                                          |
|                         吃第 2 张                          |       碰对家 `#2`       |                   碰对家后 `#2` 加杠                    |                       杠对家 `#2`                       |                                                                                         |
|                         吃第 3 张                          |       碰上家 `#3`       |                   碰上家后 `#3` 加杠                    |                       杠上家 `#1`                       |                                                                                         |
| have 2 pick 1<br>{{< color-text "no repeat" "red" bold >}} | have 2 pick 1<br>repeat | have 2 pick {{< color-text "2" "red" bold >}}<br>repeat | have {{< color-text "3" "red" bold >}} pick 1<br>repeat | have {{< color-text "4" "red" bold >}} pick {{< color-text "0" "red" bold >}}<br>repeat |
|                          `m13-2`                           |        `p50-5_2`        |                       `s55-05_3`                        |                       `m550-5_1`                        |                                         `z7777`                                         |

> 本来 `m550=5#1` 这样更具代表性的符号可读性更强，换成 `-_` 是为了保证 URL 编码后的兼容性。

正则也很简单——`/^([mpsz]{1})(\d{2,4})-?(\d{0,4})_?(\d?)$/ig`（[可视化](<https://jex.im/regulex/#!flags=ig&re=%5E(%5Bmpsz%5D%7B1%7D)(%5Cd%7B2%2C4%7D)-%3F(%5Cd%7B0%2C4%7D)_%3F(%5Cd%3F)%24>)）。\
匹配到的四组分别是：花色、拥有的牌（`have`）、捡回的牌（`pick`）、鸣牌目标（`mark`）。

### 和牌判定

详见《<a href="/tech/game-mahjong-algorithm" target="_blank">麻将和牌判定算法及相关实现</a>》一文。

### 听牌判定

**听牌** 时的手牌数量必定是 $ 3 n + 1 $ 形式。

- 暴力：加上任意一张牌（遍历 34 种）构成 14 张再判断是否能 **和牌**。
- 优雅：剪枝归类。（类似《[日麻听牌判断归类算法](https://www.bilibili.com/read/cv4601162)》）

### 听牌提示

所谓「听牌提示」就是摸切时拿到一张「进张」构成 14 张，此时打出某一张就可以 **听牌**。

- 暴力：将任意一张替换成其他牌（遍历 13 张 × 33 种）再判断是否能 **和牌**。
- 优雅：去掉任意一张判断是否能 **听牌**。

### 网络通信

- TCP 判断连接状态
- UDP 收发通信数据
- 局域网 WebRTC

### Todo List

- [ ] 各种玩法：日麻 / 川麻 / 血战……
- [ ] 各种游戏方式：单机 / 联机 / 测试……
- [ ] 考虑移动端：研究《[雀魂](https://www.maj-soul.com/)》《[雀姬](https://www.queji.tw/)》尤其是手机版的输入行为判定逻辑
