---
title: "《游戏王》「连锁排序」规则浅析"
subTitle: "我无懈你的无懈"
date: 2022-02-02T19:30:10+08:00
tags: ["Yu-Gi-Oh", "连锁"]
series: ["Yu-Gi-Oh"]
related: true
mermaid: true
---

对局中发动效果时，如果有可以发动的其他效果，就可以进行「连锁」。\
同一时间双方都要发动效果，或者某一方需要同时发动多张卡片的效果，如何处理？\
这就是连锁机制的意义所在了。

此时依次将发动的效果加入连锁，当没有新的效果继续加入连锁后，再依次进行处理。\
注意这里的「依次」是指「连锁逆处理」。连锁是典型的<ruby><rb>栈</rb><rp>（</rp><rt>stack</rt><rp>）</rp></ruby>，先入后出，后入先出。\
~~打过羽毛球吗？见过收纳羽毛球的那种长筒吗？懂了吧。~~\
进入连锁时，按照发动的顺序依次加入连锁；处理连锁时，按照发动的顺序 **逆序** 进行处理。

## 举例 连锁三

举个例子，比较典型的连锁三，墓指指灰：

1. 首先发动 [**强欲之壶**](https://www.ygocdb.com/card/55144522)（c1）。
2. 这个<ruby><rb>瞬间</rb><rp>（</rp><rt>1.</rt><rp>）</rp></ruby>！发动 [**灰流丽**](https://www.ygocdb.com/card/14558127) 进行连锁（c2）。
3. 这个<ruby><rb>瞬间</rb><rp>（</rp><rt>2.</rt><rp>）</rp></ruby>！发动 [~~灰流丽杀手~~ **墓穴的指名者**](https://www.ygocdb.com/card/24224830) 进行连锁（c3）。
4. 还有其他的卡要发动效果加入连锁吗？没有是吧。好，开始处理。
5. 依据「连锁逆处理」的原则，首先处理 c3 的 `墓指`，「`墓指` <ruby><rb>指掉</rb><rp>（</rp><rt>无效</rt><rp>）</rp></ruby>了 `灰` 的效果」。\
   c3 处理完毕，下一位。
6. 处理 c2 的 `灰`，「`灰` 本来想要<ruby><rb>灰掉</rb><rp>（</rp><rt>无效</rt><rp>）</rp></ruby> `壶` 的抽卡，**但是**，<ruby><rb>自己</rb><rp>（</rp><rt>灰</rt><rp>）</rp></ruby>的效果被 `墓指` <ruby><rb>指掉</rb><rp>（</rp><rt>无效</rt><rp>）</rp></ruby>了」。\
   c2 处理完毕，下一位。
7. 处理 c1 的 `壶`，「瑟瑟发抖的 `壶` 只想抽卡（不知道大佬们在干啥）」，总之准备<ruby><rb>灰掉</rb><rp>（</rp><rt>无效</rt><rp>）</rp></ruby> `壶` 的那个 `灰` 失效了，那么 `壶` 仍然有效。
8. 全部连锁处理完毕。[**强欲之壶**](https://www.ygocdb.com/card/55144522) 成功发动，进行抽卡。

总结一下，本来如果只有 c2 应该是：<ruby><rb>~~_强欲之壶_~~</rb><rp>（</rp><rt>c1</rt><rp>）</rp></ruby> ← <ruby><rb>**灰流丽**</rb><rp>（</rp><rt>c2</rt><rp>）</rp></ruby>。\
但加入 c3 就变成了：<ruby><rb>**强欲之壶**</rb><rp>（</rp><rt>c1</rt><rp>）</rp></ruby> ← <ruby><rb>~~_灰流丽_~~</rb><rp>（</rp><rt>c2</rt><rp>）</rp></ruby> ← <ruby><rb>**墓穴的指名者**</rb><rp>（</rp><rt>c3</rt><rp>）</rp></ruby>。\
为了严谨才说得这么复杂，以确保规则一致没有争议。

> 我故意没有说卡片的主人，因为「无所谓」。\
> 连锁跟**谁发动的没有关系**，只跟「具体发动的效果」和「进入连锁的顺序」有关系。\
> 以上这三张卡都是我自己发动的，我想抽卡（发动壶），手贱点错了（连锁灰），赶紧弥补一下（连锁墓指）。~~说我菜吧，思路又很清晰。~~ 我就是这样一个清新脱俗的菜比，不行吗？

## 举例 三国杀

其实就是《三国杀》典中典之「我<ruby><rb>无懈</rb><rp>（</rp><rt>c3</rt><rp>）</rp></ruby>你<ruby><rb>无懈</rb><rp>（</rp><rt>c2 vt.</rt><rp>）</rp></ruby>我（时用）的<ruby><rb>无懈</rb><rp>（</rp><rt>c2 n.</rt><rp>）</rp></ruby>」。（vt. 及物动词，n. 名词）

为了进一步讲解，我们再套娃一层好了：\
「你<ruby><rb>无懈</rb><rp>（</rp><rt>c3</rt><rp>）</rp></ruby>我<ruby><rb>无懈</rb><rp>（</rp><rt>c2 vt.</rt><rp>）</rp></ruby>你的<ruby><rb>无懈</rb><rp>（</rp><rt>c2 n.</rt><rp>）</rp></ruby>？我<ruby><rb>无懈</rb><rp>（</rp><rt>c4</rt><rp>）</rp></ruby>你<ruby><rb>无懈</rb><rp>（</rp><rt>c3 vt.</rt><rp>）</rp></ruby>我的<ruby><rb>无懈</rb><rp>（</rp><rt>c3 n.</rt><rp>）</rp></ruby>！」

> 至于我第一个<ruby><rb>无懈</rb><rp>（</rp><rt>c2 n.</rt><rp>）</rp></ruby>是干嘛的？呃，就当是<ruby><rb>无懈</rb><rp>（</rp><rt>c2 vt.</rt><rp>）</rp></ruby>你的<ruby><rb>无中生有</rb><rp>（</rp><rt>c1</rt><rp>）</rp></ruby>好了。

那最后你到底能不能抽这两张卡？咱们来捋一捋。

<div class="mermaid">
sequenceDiagram
   autonumber
   actor DuelistA as 武藤游戏
   actor DuelistB as 海马濑人
   rect rgb(138, 198, 209)
   rect rgb(255, 182, 185)
   rect rgb(187, 222, 214)
   rect rgb(250, 227, 217)
   DuelistB -->>+ DuelistA: c1 无中生有
   Note left of DuelistB: 无中生有怎么说？无中生有。
   end
   DuelistA ->>- DuelistB: c2 无懈可击
   Note right of DuelistA: 住手！不准无中生有！
   end
   DuelistB -->>+ DuelistA: c3 无懈可击
   Note left of DuelistB: 你管我？我就要无中生有！
   end
   DuelistA ->>- DuelistB: c4 无懈可击
   Note right of DuelistA: 我说，不准无，就是不准无！
   end
</div>

结果显而易见：<ruby><rb><span style="color:#b8521c">~~_无中生有_~~</span></rb><rp>（</rp><rt>c1</rt><rp>）</rp></ruby> ← <ruby><rb><span style="color:#1c81b8">**无懈可击**</span></rb><rp>（</rp><rt>c2</rt><rp>）</rp></ruby> ← <ruby><rb><span style="color:#b8521c">~~_无懈可击_~~</span></rb><rp>（</rp><rt>c3</rt><rp>）</rp></ruby> ← <ruby><rb><span style="color:#1c81b8">**无懈可击**</span></rb><rp>（</rp><rt>c4</rt><rp>）</rp></ruby>，抽不了卡。\
总结一下，蓝色两个无懈均生效，<ruby><rb><span style="color:#1c81b8">第一个无懈</span></rb><rp>（</rp><rt>c2</rt><rp>）</rp></ruby>无效了橙色<ruby><rb><span style="color:#b8521c">先发的无中生有</span></rb><rp>（</rp><rt>c1</rt><rp>）</rp></ruby>，<ruby><rb><span style="color:#1c81b8">第二个无懈</span></rb><rp>（</rp><rt>c4</rt><rp>）</rp></ruby>无效了橙色<ruby><rb><span style="color:#b8521c">后发的无懈</span></rb><rp>（</rp><rt>c3</rt><rp>）</rp></ruby>。

这并不是什么难得一见的场景。\
你手里有「`无中生有` × 1 + `无懈可击` × 1」，我手里有「`无懈可击` × 2」，打成这样再正常不过。

## 总结

在 YGO 里，玩家<ruby><rb>打牌</rb><rp>（</rp><rt>DUEL</rt><rp>）</rp></ruby>的日常就更逃不掉连锁了。

甚至衍生出了「连锁保护」之类的进阶技巧：\
我不想让你连锁我的 c1，我就发另一个效果 c2 连锁我自己的 c1，只要成了，就算你能康也只能连锁 c3 康到我的挡箭牌 c2，如果没有其他意外，我想要保护的 c1 效果一定能发出来。

> 1. 回合的主人具有（连锁）优先权。\
>    比如我们都有同一个时点的效果，但这是你的回合，那么必然先询问你是否发动。
> 2. 部分卡片具有固定时点。\
>    比如 c1 在 `战斗阶段` 发动，c2 `全时点` 自排连锁，此时对方的康如果是 `伤害判定前` 发动就只能连锁 c3（只能康到 c2）。此时就是牺牲 c2 保护了 c1 的效果（必定发动成功）。

当然，这已经属于花活了。更常见的还是自我连锁的排序问题。\
我有两个效果，两个效果都可以发，<mark>效果 pink 成功的**前提**</mark>是<mark>效果 blue 的**结果**</mark>，先发哪个？\
不要靠直觉（想当然），思考，用刚刚讲的先入后出思考，<abbr title="c1 先发 pink，c2 连锁 blue，逆序处理，先处理 c2 的 blue（blue 的结果出现），再处理 c1 的 pink（判定 blue 的结果存在，发动成功）">鼠标悬浮查看答案</abbr>。

注意实际决斗进行连锁时不仅要考虑连锁顺序，还要预测连锁会对场面造成什么影响。\
最终目标是每加一个连锁，脑中自动浮现出连锁结算完毕的场面，就算成熟的 YGO 玩家了。

刚开始有点懵也很正常，不用着急，一口也吃不成个胖子。\
总之就是多玩，打牌跟打架是一样的，多输多挨打，久了自然就会了。

连锁，很简单吧？好了，快去玩几把<ruby><rb>试手</rb><rp>（</rp><rt>挨打</rt><rp>）</rp></ruby>吧。
