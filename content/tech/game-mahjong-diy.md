---
title: "手写一个日麻游戏"
subTitle: "已使用 Godot 重构"
date: 2022-04-02T22:47:45+08:00
tags: ["Godot", "Mahjong"]
series: ["游戏开发"]
related: true
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

- `v0.1.0-alpha.1` **雏形**
  1. [x] 基础 UI 交互界面
  2. [x] 便于自动排序、且兼容赤宝牌的数据结构设计
  3. [x] 配牌生成 & 牌序记录
  4. [x] 序列化（字符串 → 牌序对象）和反序列化（对象 → 牌序字符串）
  5. [x] md5 验证牌山确保牌序未被篡改（参考[雀姬](https://www.queji.tw/cardsmd5/)）[^md5]
  6. [x] 根据牌序计算四家手牌
  7. [x] 根据牌序计算宝牌指示器（杠宝）、里宝牌（杠里宝）、岭上牌、海底牌
  8. [x] 发牌 / 打牌 / 摸牌
  9. [x] 记录摸切历史（进张、舍张记录）
  10. [x] <kbd>Esc</kbd> 开启 debug 控制台功能（配牌预览 山牌 / 王牌）
  11. [x] 动态渲染手牌和宝牌指示器
  12. [x] 鸣牌判定
  13. [x] GitHub Action 自动编译
- `v0.1.0-alpha.2` **建设基础设施以支持正常游玩**
  1. [x] 单元测试类
  2. [x] 优化发牌函数，降低耦合程度（不再与人数绑定，动态人数也可以正确发牌）
  3. [x] 更新图片、音效素材并重新设计 UI 布局
  4. [ ] 完成鸣牌功能（包括加杠 / 暗杠）
  5. [ ] 完成和牌判定
  6. [ ] 完成主游戏循环（轮流 turn 摸切）
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

- [x] 兼容赤宝牌的数据结构设计
- [x] 自动排序手牌
- [x] 配牌生成 md5 验证牌山
- [x] 基本 UI 交互界面
- [x] 手牌 / 宝牌 / 里宝 / 岭上 / 海底计算
- [x] 发牌 / 打牌 / 摸牌
- [x] <kbd>Esc</kbd> 开启 debug 控制台功能
- [x] 配牌预览 山牌 / 王牌
- [x] 鸣牌判定

</details>

<details class="collapse">
  <summary><code>v0.1.0-alpha.1b</code> chore: Auto CI/CD & HANDS/DRAWS enum</summary>

- [x] 部署 SSH-Key `ssh-keygen -b 4096 -C "ACTIONS_DEPLOY_KEY" -f actions_deploy_key`
- [x] 找到合适的 action 脚本 <a href="https://github.com/marketplace/actions/godot-ci" target="_blank"><img class="emoji" src="https://img.shields.io/badge/GitHub_Actions-godot--ci-informational?logo=github" /></a>
- [x] 修改脚本以适配本项目
- [x] 打通自动部署工作流 <a href="https://time2beat.github.io/mahjong-game/" target="_blank"><img class="emoji" src="https://img.shields.io/badge/GitHub_Pages-Mahjong_Fruit-success?logo=github" /></a>
- [x] 枚举：役种 / 流局类型

</details>

<details class="collapse">
  <summary><code>v0.1.0-alpha.2a</code> feat: basic game</summary>

- [x] 单元测试 hook
- [x] 优化发牌函数，降低耦合程度：手牌和山牌计算现在最低兼容 2 个玩家\
       （而且不止可以发 13 张，即使发 7 张，各玩家的手牌和山牌也是正确的。）
- [x] 更新了图片素材（资源来自 [麻雀の画像・素材 - 来夢来人](https://www.civillink.net/fsozai/majan.html)）
- [x] 新增了音效（资源来自 [天鳳用オリジナル SE: アンコロキング blog](http://ancoro.way-nifty.com/blog/se.html)）
- [x] 重绘了 UI 布局，现在的界面更合理了
- [ ] 完成鸣牌功能（包括加杠 / 暗杠）{{< color-text "doing" "red" bold >}}
- [ ] 完成和牌判定
- [ ] 完成主游戏循环（轮流 turn 摸切）

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
- {{< github "kobalab/Majiang" >}} [HTML5 在线麻将](https://kobalab.net/majiang/)（交互参考）
- {{< github "MahjongRepository/mahjong" >}} 日麻相关 Python 库
- {{< github "EndlessCheng/mahjong-helper" >}} 日麻助手（计算牌效，支持天凤 / 雀魂，AI 算法参考）
- {{< github "Equim-chan/akochan-reviewer" >}} 天凤 / 雀魂复盘工具
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

### 关于鸣牌

同时鸣牌如何判定？

- **和牌** 判定最高，可以抢所有鸣牌。（十三么甚至可以抢暗杠）
- **杠** 和 **碰** 之间不存在冲突。（3 + 2 抢 1 = 6 张同种牌是吧？搁这千王之王呢）
- **杠** 和 **碰** 优先级大于 **吃**。
- **吃** 只能吃上家，因此也不存在 **吃** 抢 **吃**，同一时间只有一个人有可能吃。
- 因此鸣牌优先级为：和 > 杠 / 碰 > 吃。

鸣牌如何标记？（和牌不需要标记，除非是「血战」玩法）

|    吃     |   碰   |     加杠     | 大明杠 |  暗杠  |
| :-------: | :----: | :----------: | :----: | :----: |
| 吃第 1 张 | 碰上家 | 碰上家后加杠 | 杠上家 | 不求人 |
| 吃第 2 张 | 碰对家 | 碰对家后加杠 | 杠对家 |        |
| 吃第 3 张 | 碰下家 | 碰下家后加杠 | 杠下家 |        |

吃只可能吃上家，因此只有 `_ 2 3` / `1 _ 3` / `1 2 _` 吃哪组的问题。

```GDScript
var fulu: Dictionary = {  # 副露 示例数据结构
  "type": CALL.CHOW,  # 枚举鸣牌类型
  "data": [],  # 具体牌面
  "mark": -1,  # 特殊标记的位置 吃不需要特殊标记 位置信息就足够了
}                           # 比如 123 213 312
                            # 碰 / 杠才需要, 比如 222 需要标记哪张是碰过来的
```

### 和牌判定

详见《<a href="/tech/game-mahjong-check-win-algorism" target="_blank">麻将和牌判定算法及相关实现</a>》一文。

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
