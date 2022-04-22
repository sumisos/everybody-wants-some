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
  10. [x] Esc 开启 debug 控制台功能（配牌预览 山牌 / 王牌）
  11. [x] 动态渲染手牌和宝牌指示器
  12. [x] 鸣牌判定
  13. [x] GitHub Action 自动编译
- `v0.1.0-alpha.2` **建设基础设施以支持正常游玩**
  1. [ ] 优化发牌函数，降低耦合程度（不再与人数绑定，动态人数也可以正确发牌）
  2. [ ] 完成鸣牌功能（包括加杠 / 暗杠）
  3. [ ] 完成和牌判定
  4. [ ] 完成 turn 循环（轮流摸切）
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
- [x] Esc 开启 debug 控制台功能
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

## Reference 参考资料

- 「[麻将 - 维基百科](https://en.wikipedia.org/wiki/Mahjong)」规则参考、变量 / 函数命名参考
- 「[麻将基本术语中英文对照表](https://www.xqbase.com/other/mahjongg_english.htm)」变量 / 函数命名参考
- 「[日麻“王牌”的简单知识——海底、宝牌指示、岭上三者关系](https://bbs.nga.cn/read.php?tid=16056906)」王牌算法参考
- 「[麻雀 和了判定（役の判定） アルゴリズム](http://hp.vector.co.jp/authors/VA046927/mjscore/mjalgorism.html)」和牌判定算法参考
- 「[麻雀の数学](http://www10.plala.or.jp/rascalhp/mjmath.htm)」相关数学概念认知
- 「[麻雀の役一覧（出現確率ランキング順）](http://www2.odn.ne.jp/~cbm15900/html/y99.html)」相关数学概念认知补充
- 「[天鳳 | 最高峰の対戦麻雀サイト](https://tenhou.net/)」流程设计参考
- 「[4chan /mjg/ Repository](https://repo.riichi.moe/)」麻将相关的各种资料 / 资源
- {{< github "Equim-chan/akochan-reviewer" >}} 天凤 / 雀魂复盘工具
- {{< github "zyr17/MajsoulPaipuAnalyzer" >}} 雀魂牌谱分析工具
- {{< github "MajsoulPlus/majsoul-plus" >}} 雀魂加强版客户端

## Thinking 思考

### 配牌生成以及主要游戏流程

<div class="mermaid">
flowchart LR
  suit("日麻花色") ==>|"包括"| num("数字牌")
  suit ==>|"包括"| char("字牌")
  num ==>|"包括"| man_zi("万子 🀇🀈🀉🀊🀋🀌🀍🀎🀏")
  num ==>|"包括"| suo_zi("索子 / 条子 🀐🀑🀒🀓🀔🀕🀖🀗🀘")
  num ==>|"包括"| ping_zi("饼子 / 筒子 🀙🀚🀛🀜🀝🀞🀟🀠🀡")
  char ==>|"包括"| wind("风牌 🀀🀁🀂🀃")
  char ==>|"包括"| tri("三元牌 🀆🀅🀄")
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
  type: CALL.CHOW,  # 枚举鸣牌类型
  data: [],  # 具体牌面
  mark: 0,  # 特殊标记的位置
}
```

### 和牌判定

详见《<a href="/tech/game-mahjong-check-win-algorism" target="_blank">三种麻将和牌判定算法及相关实现</a>》一文。

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
