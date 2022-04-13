---
title: "Hugo 魔改 shortcode 显示麻将牌"
date: 2022-03-20T21:26:42+08:00
tags: ["Mahjong", "Hugo", "shortcode"]
series: ["Mahjong"]
related: true
mahjong: true
---

## 改造主题

一开始我就决定要 **可视化** 显示各种麻将牌面，但当时还没想好如何设计。\
接着我想起 emoji 是有麻将牌的 [^emoji]，于是 _最开始的时候_ 就用了笨办法——手写 emoji。

[^emoji]:
    全套麻将牌的 emoji 出现在 emoji 版本 11.0 以及 Unicode 版本 5.1。\
    （红中的 emoji 🀄 是出现在 emoji 版本 1.0，作为「麻将」这个概念的代表。）

由于我的重度强迫症，「分门别类地列出所有役种」对我来说是一件能带来快感的事。\
于是我居然写完了《[日麻役种一览]({{< ref "/game/mahjong-all" >}})》一文，50 副牌面每一个 emoji 都是我手写的。\
当时不觉得，写完才惊到。

后来由于日麻实在太杀时间了，渐渐就打得少了，这事儿也被遗忘了。\
直到 2022.3.15（刚好一年）有读者发邮件来问牌面，我才想起原来这里还有个坑没填。

## 麻将图片素材

直到那时我仍然视 emoji 为一种妥协方案，因为 emoji 在不同系统不同平台上的显示风格……不能说各有千秋，也可以说是五花八门了，严重缺乏我想要的一致性。

然后本来想用 SVG 矢量图，没什么好说的，SVG 天下第一。\
转念一想，麻将有 9 × 3 + 4 + 3 = 34 种花色，当然要用 CSS Sprite 优化，那不如就用图片。

<details class="collapse"> 
  <summary>麻将图片素材预览</summary>

> 以下图片素材来自「[麻雀王国](https://mj-king.net/sozai/)」

<span class="sticker">
  <img src="https://mj-king.net/sozai/paiga/images/p_ms1_1.gif" WIDTH="19" HEIGHT="26" ALT="一萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms2_1.gif" WIDTH="19" HEIGHT="26" ALT="二萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms3_1.gif" WIDTH="19" HEIGHT="26" ALT="三萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms4_1.gif" WIDTH="19" HEIGHT="26" ALT="四萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms5_1.gif" WIDTH="19" HEIGHT="26" ALT="五萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms6_1.gif" WIDTH="19" HEIGHT="26" ALT="六萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms7_1.gif" WIDTH="19" HEIGHT="26" ALT="七萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms8_1.gif" WIDTH="19" HEIGHT="26" ALT="八萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms9_1.gif" WIDTH="19" HEIGHT="26" ALT="九萬：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ms5_1_red.gif" WIDTH="19" HEIGHT="26" ALT="五萬赤：麻雀王国">
</span>
<span class="sticker">
  <img src="https://mj-king.net/sozai/paiga/images/p_ps1_1.gif" WIDTH="19" HEIGHT="26" ALT="一筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps2_1.gif" WIDTH="19" HEIGHT="26" ALT="二筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps3_1.gif" WIDTH="19" HEIGHT="26" ALT="三筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps4_1.gif" WIDTH="19" HEIGHT="26" ALT="四筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps5_1.gif" WIDTH="19" HEIGHT="26" ALT="五筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps6_1.gif" WIDTH="19" HEIGHT="26" ALT="六筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps7_1.gif" WIDTH="19" HEIGHT="26" ALT="七筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps8_1.gif" WIDTH="19" HEIGHT="26" ALT="八筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps9_1.gif" WIDTH="19" HEIGHT="26" ALT="九筒：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ps5_1_red.gif" WIDTH="19" HEIGHT="26" ALT="五筒赤：麻雀王国">
</span>
<span class="sticker">
  <img src="https://mj-king.net/sozai/paiga/images/p_ss1_1.gif" WIDTH="19" HEIGHT="26" ALT="一索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss2_1.gif" WIDTH="19" HEIGHT="26" ALT="二索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss3_1.gif" WIDTH="19" HEIGHT="26" ALT="三索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss4_1.gif" WIDTH="19" HEIGHT="26" ALT="四索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss5_1.gif" WIDTH="19" HEIGHT="26" ALT="五索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss6_1.gif" WIDTH="19" HEIGHT="26" ALT="六索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss7_1.gif" WIDTH="19" HEIGHT="26" ALT="七索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss8_1.gif" WIDTH="19" HEIGHT="26" ALT="八索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss9_1.gif" WIDTH="19" HEIGHT="26" ALT="九索：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ss5_1_red.gif" WIDTH="19" HEIGHT="26" ALT="五索赤：麻雀王国">
</span>
<span class="sticker">
  <img src="https://mj-king.net/sozai/paiga/images/p_ji_e_1.gif" WIDTH="19" HEIGHT="26" ALT="東：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ji_s_1.gif" WIDTH="19" HEIGHT="26" ALT="南：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ji_w_1.gif" WIDTH="19" HEIGHT="26" ALT="西：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ji_n_1.gif" WIDTH="19" HEIGHT="26" ALT="北：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_no_1.gif" WIDTH="19" HEIGHT="26" ALT="白：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ji_h_1.gif" WIDTH="19" HEIGHT="26" ALT="發：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_ji_c_1.gif" WIDTH="19" HEIGHT="26" ALT="中：麻雀王国"><img src="https://mj-king.net/sozai/paiga/images/p_bk_1.gif" WIDTH="19" HEIGHT="26" ALT="裏：麻雀王国">
</span>

<span class="sticker">
  <img src="https://mj-king.net/sozai/img/pai2/p_ms1_1.gif" WIDTH="47" HEIGHT="63" ALT="一萬：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ms2_1.gif" WIDTH="47" HEIGHT="63" ALT="二萬：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ms3_1.gif" WIDTH="47" HEIGHT="63" ALT="三萬：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ms4_1.gif" WIDTH="47" HEIGHT="63" ALT="四萬：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ms5_1.gif" WIDTH="47" HEIGHT="63" ALT="五萬：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ms6_1.gif" WIDTH="47" HEIGHT="63" ALT="六萬：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ms7_1.gif" WIDTH="47" HEIGHT="63" ALT="七萬：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ms8_1.gif" WIDTH="47" HEIGHT="63" ALT="八萬：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ms9_1.gif" WIDTH="47" HEIGHT="63" ALT="九萬：麻雀王国">
</span>
<span class="sticker">
  <img src="https://mj-king.net/sozai/img/pai2/p_ps1_1.gif" WIDTH="47" HEIGHT="63" ALT="一筒：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ps2_1.gif" WIDTH="47" HEIGHT="63" ALT="二筒：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ps3_1.gif" WIDTH="47" HEIGHT="63" ALT="三筒：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ps4_1.gif" WIDTH="47" HEIGHT="63" ALT="四筒：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ps5_1.gif" WIDTH="47" HEIGHT="63" ALT="五筒：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ps6_1.gif" WIDTH="47" HEIGHT="63" ALT="六筒：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ps7_1.gif" WIDTH="47" HEIGHT="63" ALT="七筒：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ps8_1.gif" WIDTH="47" HEIGHT="63" ALT="八筒：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ps9_1.gif" WIDTH="47" HEIGHT="63" ALT="九筒：麻雀王国">
</span>
<span class="sticker">
  <img src="https://mj-king.net/sozai/img/pai2/p_ss1_1.gif" WIDTH="47" HEIGHT="63" ALT="一索：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ss2_1.gif" WIDTH="47" HEIGHT="63" ALT="二索：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ss3_1.gif" WIDTH="47" HEIGHT="63" ALT="三索：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ss4_1.gif" WIDTH="47" HEIGHT="63" ALT="四索：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ss5_1.gif" WIDTH="47" HEIGHT="63" ALT="五索：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ss6_1.gif" WIDTH="47" HEIGHT="63" ALT="六索：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ss7_1.gif" WIDTH="47" HEIGHT="63" ALT="七索：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ss8_1.gif" WIDTH="47" HEIGHT="63" ALT="八索：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ss9_1.gif" WIDTH="47" HEIGHT="63" ALT="九索：麻雀王国">
</span>
<span class="sticker">
  <img src="https://mj-king.net/sozai/img/pai2/p_ji_e_1.gif" WIDTH="47" HEIGHT="63" ALT="東：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ji_s_1.gif" WIDTH="47" HEIGHT="63" ALT="南：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ji_w_1.gif" WIDTH="47" HEIGHT="63" ALT="西：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ji_n_1.gif" WIDTH="47" HEIGHT="63" ALT="北：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_no_1.gif" WIDTH="47" HEIGHT="63" ALT="白：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ji_h_1.gif" WIDTH="47" HEIGHT="63" ALT="發：麻雀王国"><img src="https://mj-king.net/sozai/img/pai2/p_ji_c_1.gif" WIDTH="47" HEIGHT="63" ALT="中：麻雀王国">
</span>

</details>

素材有了，开始实现。

> 相关 Hugo 文档：「[图片资源处理](https://gohugo.io/content-management/image-processing/#the-image-resource)」「[images.Filter](https://gohugo.io/functions/images/)」

## Hugo 的 shortcode

具体实现还是用 Hugo 的 [shortcode](https://gohugo.io/templates/shortcode-templates/#custom-shortcode-examples) 自动转换快捷缩写，最后显示统一格式。

|          万子           |          饼子           |          索子           |        东风        |        南风        |        西风        |        北风        |        白板        |        发财        |        红中        |
| :---------------------: | :---------------------: | :---------------------: | :----------------: | :----------------: | :----------------: | :----------------: | :----------------: | :----------------: | :----------------: |
|        _Man zu_         |        _Pin zu_         |         _So zu_         |       _East_       |      _South_       |       _West_       |      _North_       |     _Pai pan_      |        _Fa_        |     _hon Chi_      |
|           `m`           |           `p`           |           `s`           |        `E`         |        `S`         |        `W`         |        `N`         |        `P`         |        `F`         |        `C`         |
| `1m` \~ `9m`<br/>+ `0m` | `1p` \~ `9p`<br/>+ `0p` | `1s` \~ `9s`<br/>+ `0s` |        `1z`        |        `2z`        |        `3z`        |        `4z`        |        `5z`        |        `6z`        |        `7z`        |
|   {{< mahjong 1m >}}    |   {{< mahjong 1p >}}    |   {{< mahjong 1s >}}    | {{< mahjong 1z >}} | {{< mahjong 2z >}} | {{< mahjong 3z >}} | {{< mahjong 4z >}} | {{< mahjong 5z >}} | {{< mahjong 6z >}} | {{< mahjong 7z >}} |

> 实际使用时是不区分大小写的，**字牌** 此处大写是为了对人类阅读友好（便于肉眼辨识）。\
> 没错，`234ssss` 或者 `sss234s` 都可以正确解析为「🀑🀒🀓🀁🀁🀁」。\
> 同理，`777PPPP` 或者 `PPP777P` 也可以正确解析为「🀟🀟🀟🀆🀆🀆」。

### 兼容各种输入方式

同类型的牌连在一起可以省略相同的后缀字母：

<pre>
{{&lt; mahjong 1m2m3m4m0m5m6m7m8m9m &gt;}}
{{&lt; mahjong 1234056789m &gt;}}  # 显示效果同上
</pre>

{{< mahjong 1234056789m >}}

<pre>
{{&lt; mahjong 1z2z3z4z5z6z7z &gt;}}
{{&lt; mahjong 1234567z &gt;}}  # 显示效果同上
</pre>

{{< mahjong 1234567z >}}

字牌既可以用「`1z` \~ `7z`」的标准描述方式，也可以用表意更明确的特定字符形式表示：

<pre>
{{&lt; mahjong 1z2z3z4z5z6z7z &gt;}}
{{&lt; mahjong ESWNPFC &gt;}}  # 显示效果同上
</pre>

{{< mahjong ESWNPFC >}}

### 兼容赤宝牌的自动排序

如果没有特别指定「不排序」的参数，最后显示会按这个顺序自动排序：\
「万子」，「饼子」，「索子」，「东风、南风、西风、北风、白板、发财、红中」。

<pre>
{{&lt; mahjong main="2716453z91m91s91p" sort="off" &gt;}}
{{&lt; mahjong main="2716453z91m91s91p" sort="on" &gt;}}
</pre>

{{< mahjong main="2716453z91m91s91p" sort="off" >}}
{{< mahjong main="2716453z91m91s91p" sort="on" >}}

> 至于万、饼、索、字的「种类」顺序永远是自动排序的，这也没必要故意不排序吧。

兼容赤宝牌：

<pre>
{{&lt; mahjong 0123456789p &gt;}}
{{&lt; mahjong 1234567890p &gt;}}  # 显示效果同上
</pre>

{{< mahjong 1234567890p >}}

### 兼容大小写混用

<pre>
{{&lt; mahjong 234m567p34678sff 25s &gt;}}  # 全小写
{{&lt; mahjong 234M567P34678SFF 25S &gt;}}  # 全大写
{{&lt; mahjong 234m567p34678sFF 25s &gt;}}  # 都是一样的
</pre>

{{< mahjong 234m567p34678sFF 25s >}}

---

至于同一个字母只要格式正确，即便不区分大小写也并不会混淆，均可以正确解析。

饼子（`1p ~ 9p`）& 白板（`P`）：

<pre>
{{&lt; mahjong 678pppp &gt;}}
{{&lt; mahjong 678PPPP &gt;}}  # 显示效果同上
</pre>

{{< mahjong 678pppp >}}

索子（`1s ~ 9s`）& 南风（`S`）：

<pre>
{{&lt; mahjong 234ssss &gt;}}
{{&lt; mahjong 234SSSS &gt;}}  # 显示效果同上
</pre>

{{< mahjong 234SSSS >}}

当然也不会影响自动排序：

<pre>
{{&lt; mahjong 12z3s4p5z6z777pp88ss &gt;}}  # 正常使用基本上也碰不到这种反人类写法 这里只是为了展示兼容性
# 自动排序后等效于 ↓
{{&lt; mahjong "4777p 388s 12z S 5z P 6z" &gt;}}  # 兼容空格 会自动忽略
</pre>

{{< mahjong 12z3s4p5z6z777pp88ss >}}

### 听牌自动去重

<pre>
{{&lt; mahjong 567m55567p234sCC 58pC &gt;}}
{{&lt; mahjong 567m55567p234s77z 8888p77z5555555555555555p &gt;}}  # 显示效果同上
</pre>

{{< mahjong 567m55567p234s77z 8888p77z5555555555555555p >}}

**区分听牌和和牌**

想了一下最后附加的可能是和牌也可能是听牌，于是单独做了处理：

- 如果附加的牌只有 1 张，自动视为和牌。
- 如果有 2 张及以上，则视为听牌。（重复的牌作为听牌显示时会自动去重）

这样就轻易区分开了单听与和牌。

<pre>
{{&lt; mahjong 1334455699pEEE 22p &gt;}}
{{&lt; mahjong 1334455699pEEE 2p &gt;}}
</pre>

{{< mahjong 1334455699pEEE 22p >}}
{{< mahjong 1334455699pEEE 2p >}}

~~最后只要把 emoji 替换成图片素材就行了。~~（已替换为 SVG 素材，详见下一节）

不过就在此时，我发现 emoji 呈现的效果已经够好了。\
而且 emoji 作为文本，可以直接选中整行复制粘贴，这也是图片没法实现的优势。

## 麻将 SVG 素材

后来我发现原来 SVG 也有类似的技术，就叫「SVG Sprite」，是我孤陋寡闻了。\
不过网上资料挺少的，好像用的人也不多。

参考资料：

- 《[SVG Sprites 技术介绍](https://www.zhangxinxu.com/wordpress/2014/07/introduce-svg-sprite-technology/)》
- CSS-Tricks《[Icon System with SVG Sprites](https://css-tricks.com/svg-sprites-use-better-icon-fonts/)》
- Treehouse Blog《[Create an SVG Sprite Sheet](https://blog.teamtreehouse.com/create-svg-sprite-sheet)》

以及相关工具：

- 「[icomoon.io](https://icomoon.io/)」在线打包 icon（支持 font 和 SVG）
- 「[SVG 在线压缩合并工具](https://www.zhangxinxu.com/sp/svgo/)」
- 「[Adobe Illustrator 生成 SVG 转换成 web 可用 SVG Sprite 工具](https://www.zhangxinxu.com/sp/svg.html)」

另外还查到一些别的 SVG 知识，挺有趣的：

- {{< github "alexk111/SVG-Morpheus" >}} SVG 图标液化变形动画
- 「[SVG 图标动画](https://tympanus.net/Development/AnimatedSVGIcons/)」

可操作性有了，需要的 <a href="/pages/mahjong-svg.html" target="_blank">麻将 SVG 素材</a> 也找到了。

<details class="collapse">
  <summary>麻将 SVG 素材预览</summary>

> 以下 SVG 素材来自 {{< github "WarL0ckNet/tile-art" >}}

<span class="sticker">
  <svg class="tile"><use class="face" xlink:href="#mj-1m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-2m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-3m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-4m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-5m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-6m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-7m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-8m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-9m" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-0m" /></svg>
</span>
<span class="sticker">
  <svg class="tile"><use class="face" xlink:href="#mj-1p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-2p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-3p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-4p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-5p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-6p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-7p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-8p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-9p" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-0p" /></svg>
</span>
<span class="sticker">
  <svg class="tile"><use class="face" xlink:href="#mj-1s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-2s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-3s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-4s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-5s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-6s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-7s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-8s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-9s" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-0s" /></svg>
</span>
<span class="sticker">
  <svg class="tile"><use class="face" xlink:href="#mj-1z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-2z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-3z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-4z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-5z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-6z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-7z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-0z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#0" /></svg>
  <svg class="tile"><use class="face" xlink:href="#0" /></svg>
</span>

</details>

最后只要把 emoji 替换成 SVG 图片就行了。

- [ ] ~~参考《[让 emoji 固定风格](https://blog.yami.love/2020/12/18/emoji/)》的思路统一不同平台显示的麻将牌 emoji 风格~~\
       这条是当年（2021）写下的备忘，参考的博客 [`blog.yami.love`](https://blog.yami.love/) 竟然被我熬死了，感叹。

<pre>
{{&lt; mahjong main="222678m234s3444p" wait="235p" style="emoji" &gt;}}  # emoji 字符
{{&lt; mahjong main="222678m234s3444p" wait="235p" style="svg" &gt;}}    # SVG 矢量图
{{&lt; mahjong main="222678m234s3444p" wait="235p" style="img" &gt;}}    # PNG 图片
</pre>

{{< mahjong main="222678m234s3444p" wait="235p" style="emoji" >}}
{{< mahjong main="222678m234s3444p" wait="235p" style="svg" >}}
{{< mahjong main="222678m234s3444p" wait="235p" style="img" >}}

大功告成。

其实想想没有什么卵用，不知道什么时候才有空写新的日麻相关博文。\
不过无所谓了，有多大用其实没太重要，{{< ruby "轮子" "shortcode" >}} 写得很开心就是。

## Shortcode 源码

```HTML
{{- if .Params -}}
  {{- $InputText := slice -}}
  {{- $Side := "" -}}
  {{- $DefaultStyle := "emoji" -}}
  {{- if $.Page.Params.mahjong -}}{{- $DefaultStyle = "svg" -}}{{- end -}}
  {{- $Style := $DefaultStyle -}}
  {{- $Sort := "on" -}}
  {{- if .IsNamedParams -}}
    {{- $InputText = slice (.Get "main") -}}
    {{- $InputText = $InputText | append (.Get "wait") -}}
    {{- $Side = .Get "side" -}}
    {{- $Style = .Get "style" | default $DefaultStyle -}}
    {{- $Sort = .Get "sort" | default "on" -}}
  {{- else -}}
    {{- $InputText = first 2 .Params -}}
    {{- $Side = .Get 3 -}}
  {{- end -}}

  {{- $EMOJI := dict "MAN" "🀇🀈🀉🀊🀋🀌🀍🀎🀏" "PIN" "🀙🀚🀛🀜🀝🀞🀟🀠🀡" "SO" "🀐🀑🀒🀓🀔🀕🀖🀗🀘" "ZI" "🀀🀁🀂🀃🀆🀅🀄" -}}
  {{- $RedExist := dict "man" false "pin" false "so" false -}}
  {{- $Output := slice -}}

  {{- range $InputText -}}

    {{- $input := lower (replace (trim (chomp .) "\n-_") " " "") -}}
    {{- $groups := dict "man" slice "pin" slice "so" slice "zi" slice -}}

    {{- range $suit := slice "m" "p" "s" "z" -}}

      {{- /* 解析并铺平(为一维)牌型数组(单种: 万子 饼子 索子 字牌) $array_1 */ -}}
      {{- $array_1 := slice -}}
      {{- $pattern := add "\\d+" $suit -}}
      {{- if gt (len (findRE $pattern $input)) 0 -}}
        {{- range $slice := findRE $pattern $input -}}
          {{- $temp := split (strings.TrimSuffix $suit (index (findRE $pattern $slice) 0)) "" -}}
          {{- $array_1 = $array_1 | append $temp -}}
        {{- end -}}
        {{- $input = replaceRE $pattern "" $input -}}
      {{- end -}}

      {{- $array_2 := slice -}}
      {{- if len $array_1 -}}
        {{- range $item := $array_1 -}}
          {{- /* 数字牌后处理 标记赤宝牌 */ -}}
          {{- if eq $item "0" -}}
            {{- $item = "5" -}}
            {{- if eq $suit "m" -}}
              {{- $RedExist = merge $RedExist (dict "man" true) -}}
            {{- else if eq $suit "p" -}}
              {{- $RedExist = merge $RedExist (dict "pin" true) -}}
            {{- else if eq $suit "s" -}}
              {{- $RedExist = merge $RedExist (dict "so" true) -}}
            {{- end -}}
          {{- end -}}
          {{- /* 处理为标准数字形式(1-9m/p/s,1-7z)的牌面 */ -}}
          {{- $array_2 = $array_2 | append (add $item $suit) -}}
        {{- end -}}
      {{- end -}}

      {{- /* 字牌后处理 处理剩余的字符形式牌面(字牌: E S W N P F C) */ -}}
      {{- if eq $suit "z" -}}
        {{- with $input -}}
          {{- $temp := slice -}}
          {{- range $char := split . "" -}}
            {{- if eq $char "e" -}}
              {{- $temp = $temp | append "1z" -}}
            {{- else if eq $char "s" -}}
              {{- $temp = $temp | append "2z" -}}
            {{- else if eq $char "w" -}}
              {{- $temp = $temp | append "3z" -}}
            {{- else if eq $char "n" -}}
              {{- $temp = $temp | append "4z" -}}
            {{- else if or (eq $char "p") (eq $char "b") -}}
              {{- $temp = $temp | append "5z" -}}
            {{- else if eq $char "f" -}}
              {{- $temp = $temp | append "6z" -}}
            {{- else if eq $char "c" -}}
              {{- $temp = $temp | append "7z" -}}
            {{ end }}
          {{- end -}}
          {{- $array_2 = $array_2 | append $temp -}}
        {{- end -}}
      {{- end -}}

      {{- /* 排序并写入字典 */ -}}
      {{- $temp := $array_2 -}}
      {{- if eq $Sort "on" -}}{{- $temp = sort $array_2 -}}{{- end -}}
      {{- if eq $suit "m" -}}
        {{- $groups = merge $groups (dict "man" $temp) -}}
      {{- else if eq $suit "p" -}}
        {{- $groups = merge $groups (dict "pin" $temp) -}}
      {{- else if eq $suit "s" -}}
        {{- $groups = merge $groups (dict "so" $temp) -}}
      {{- else if eq $suit "z" -}}
        {{- $groups = merge $groups (dict "zi" $temp) -}}
      {{- end -}}

    {{- end -}}

    {{- $Output = $Output | append $groups -}}

  {{- end -}}

  {{- $count := slice -}}
  {{- range $group := $Output -}}
    {{- $temp := 0 -}}
    {{- range $group -}}
      {{- $temp = add $temp (len .) -}}
    {{- end -}}
    {{- $count = $count | append $temp -}}
  {{- end -}}

  {{- if or (gt (index $count 0) 1) (gt (index $count 1) 0) -}}<div class="mahjong center" style="margin: 1rem 0; font-size: 2.5rem;">{{- end -}}

    {{- /* 展示副露区 */ -}}
    {{- with $Side -}}
      {{- $input := split . " " -}}
      {{- range $index, $item := $input -}}
        <span style="margin: 0 0.5rem;">
          {{- $type := slicestr $item 0 1 -}}
          {{- $pai := slicestr $item 1 3 -}}
          {{- $need := "" -}}
          {{- if eq (len $item) 5 -}}{{- $need = slicestr $item 4 -}}{{- end -}}

          {{- if eq $type "#" -}}
            {{- /* 处理吃 TODO 改进显示顺序 */ -}}
            {{- range $index := slice "0" "1" "2" -}}
              {{- $new_pai := add (htmlEscape (add (int (slicestr $pai 0 1)) (int $index))) (slicestr $pai 1) -}}
              {{- if eq $Style "img" -}}
                <img class="sticker" src="https://sdfsdf.dev/36x52.png,beige,beige" title="{{- $new_pai -}}" style="width: 36px; height: 52px; margin: 0 1px; border: 2px dashed red;" />
              {{- else if eq $Style "emoji" -}}
                {{- $i := int (slicestr $new_pai 0 1) -}}
                {{- $charset := "" -}}
                {{- if eq (slicestr $new_pai 1) "m" -}}
                  {{- $charset = $EMOJI.MAN -}}
                {{- else if eq (slicestr $new_pai 1) "p" -}}
                  {{- $charset = $EMOJI.PIN -}}
                {{- else if eq (slicestr $new_pai 1) "s" -}}
                  {{- $charset = $EMOJI.SO -}}
                {{- else if eq (slicestr $new_pai 1) "z" -}}
                  {{- $charset = $EMOJI.ZI -}}
                {{- end -}}
                {{- print (slicestr $charset (sub $i 1) $i) -}}
              {{- else -}}
                <svg class="{{- if eq $index $need -}}rotate{{- else -}}tile{{- end -}}"><use class="face" xlink:href="#mj-{{- $new_pai -}}" /></svg>
              {{- end -}}
            {{- end -}}
          {{- else if eq $type "." -}}
            {{- /* 处理碰 */ -}}
            {{- range $index := slice "0" "1" "2" -}}
              {{- if eq $Style "img" -}}
                <img class="sticker" src="https://sdfsdf.dev/36x52.png,beige,beige" title="{{- $pai -}}" style="width: 36px; height: 52px; margin: 0 1px; border: 2px dashed red;" />
              {{- else if eq $Style "emoji" -}}
                {{- $i := int (slicestr $pai 0 1) -}}
                {{- $charset := "" -}}
                {{- if eq (slicestr $pai 1) "m" -}}
                  {{- $charset = $EMOJI.MAN -}}
                {{- else if eq (slicestr $pai 1) "p" -}}
                  {{- $charset = $EMOJI.PIN -}}
                {{- else if eq (slicestr $pai 1) "s" -}}
                  {{- $charset = $EMOJI.SO -}}
                {{- else if eq (slicestr $pai 1) "z" -}}
                  {{- $charset = $EMOJI.ZI -}}
                {{- end -}}
                {{- print (slicestr $charset (sub $i 1) $i) -}}
              {{- else -}}
                <svg class="{{- if eq $index $need -}}rotate{{- else -}}tile{{- end -}}"><use class="face" xlink:href="#mj-{{- $pai -}}" /></svg>
              {{- end -}}
            {{- end -}}
          {{- else if eq $type "-" -}}
            {{- /* 处理大明杠 */ -}}
            {{- range $index := slice "0" "1" "x" "2" -}}
              {{- if eq $Style "img" -}}
                <img class="sticker" src="https://sdfsdf.dev/36x52.png,beige,beige" title="{{- $pai -}}" style="width: 36px; height: 52px; margin: 0 1px; border: 2px dashed red;" />
              {{- else if eq $Style "emoji" -}}
                {{- $i := int (slicestr $pai 0 1) -}}
                {{- $charset := "" -}}
                {{- if eq (slicestr $pai 1) "m" -}}
                  {{- $charset = $EMOJI.MAN -}}
                {{- else if eq (slicestr $pai 1) "p" -}}
                  {{- $charset = $EMOJI.PIN -}}
                {{- else if eq (slicestr $pai 1) "s" -}}
                  {{- $charset = $EMOJI.SO -}}
                {{- else if eq (slicestr $pai 1) "z" -}}
                  {{- $charset = $EMOJI.ZI -}}
                {{- end -}}
                {{- print (slicestr $charset (sub $i 1) $i) -}}
              {{- else -}}
                <svg class="{{- if eq $index $need -}}rotate{{- else -}}tile{{- end -}}"><use class="face" xlink:href="#mj-{{- $pai -}}" /></svg>
              {{- end -}}
            {{- end -}}
          {{- else if eq $type "+" -}}
            {{- /* 处理加杠 TODO 复杂判断 */ -}}
            {{- range $index := slice "0" "1" "x" "2" -}}
              {{- if eq $Style "img" -}}
                <img class="sticker" src="https://sdfsdf.dev/36x52.png,beige,beige" title="{{- $pai -}}" style="width: 36px; height: 52px; margin: 0 1px; border: 2px dashed red;" />
              {{- else if eq $Style "emoji" -}}
                {{- $i := int (slicestr $pai 0 1) -}}
                {{- $charset := "" -}}
                {{- if eq (slicestr $pai 1) "m" -}}
                  {{- $charset = $EMOJI.MAN -}}
                {{- else if eq (slicestr $pai 1) "p" -}}
                  {{- $charset = $EMOJI.PIN -}}
                {{- else if eq (slicestr $pai 1) "s" -}}
                  {{- $charset = $EMOJI.SO -}}
                {{- else if eq (slicestr $pai 1) "z" -}}
                  {{- $charset = $EMOJI.ZI -}}
                {{- end -}}
                {{- print (slicestr $charset (sub $i 1) $i) -}}
              {{- else -}}
                <svg class="{{- if eq $index $need -}}rotate{{- else -}}tile{{- end -}}"><use class="face" xlink:href="#mj-{{- $pai -}}" /></svg>
              {{- end -}}
            {{- end -}}
          {{- else if eq $type "_" -}}
            {{- /* 处理暗杠 */ -}}
            {{- if eq $Style "img" -}}
              {{- range slice 1 2 3 4 -}}
              <img class="sticker" src="https://sdfsdf.dev/36x52.png,beige,beige" title="{{- $pai -}}" style="width: 36px; height: 52px; margin: 0 1px; border: 2px dashed red;" />
              {{- end -}}
            {{- else if eq $Style "emoji" -}}
              {{- $i := int (slicestr $pai 0 1) -}}
              {{- $charset := "" -}}
              {{- if eq (slicestr $pai 1) "m" -}}
                {{- $charset = $EMOJI.MAN -}}
              {{- else if eq (slicestr $pai 1) "p" -}}
                {{- $charset = $EMOJI.PIN -}}
              {{- else if eq (slicestr $pai 1) "s" -}}
                {{- $charset = $EMOJI.SO -}}
              {{- else if eq (slicestr $pai 1) "z" -}}
                {{- $charset = $EMOJI.ZI -}}
              {{- end -}}
              {{- range slice 1 2 3 4 -}}
                {{- print (slicestr $charset (sub $i 1) $i) -}}
              {{- end -}}
            {{- else -}}
              <svg class="tile"><use class="face" xlink:href="#mj-0z" /></svg><svg class="tile"><use class="face" xlink:href="#mj-{{- $pai -}}" /></svg><svg class="tile"><use class="face" xlink:href="#mj-{{- $pai -}}" /></svg><svg class="tile"><use class="face" xlink:href="#mj-0z" /></svg>
            {{- end -}}
          {{- end -}}
          {{- if and (eq (len $input) 4) (eq $index 1) -}}<br/>{{- end -}}
        </span>
      {{- end -}}
      <br/>
    {{- end -}}

    {{- /* 展示手牌 */ -}}
    {{- range $key, $value := index $Output 0 -}}
      {{- range $code := $value -}}
        {{- if eq $Style "img" -}}
          <img class="sticker" src="https://sdfsdf.dev/36x52.png,beige,beige" title="{{- $code -}}" style="width: 36px; height: 52px; margin: 0 1px; border: 2px dashed red;" />
        {{- else if eq $Style "emoji" -}}
          {{- $i := int (slicestr $code 0 1) -}}
          {{- $charset := "" -}}
          {{- if eq $key "man" -}}
            {{- $charset = $EMOJI.MAN -}}
          {{- else if eq $key "pin" -}}
            {{- $charset = $EMOJI.PIN -}}
          {{- else if eq $key "so" -}}
            {{- $charset = $EMOJI.SO -}}
          {{- else if eq $key "zi" -}}
            {{- $charset = $EMOJI.ZI -}}
          {{- end -}}
          {{- print (slicestr $charset (sub $i 1) $i) -}}
        {{- else -}}
          {{- if eq $code "5m" -}}
            {{- if $RedExist.man -}}{{- $code = "0m" -}}{{- $RedExist = merge $RedExist (dict "man" false) -}}{{- end -}}
          {{- else if eq $code "5p" -}}
            {{- if $RedExist.pin -}}{{- $code = "0p" -}}{{- $RedExist = merge $RedExist (dict "pin" false) -}}{{- end -}}
          {{- else if eq $code "5s" -}}
            {{- if $RedExist.so -}}{{- $code = "0s" -}}{{- $RedExist = merge $RedExist (dict "so" false) -}}{{- end -}}
          {{- end -}}
          <svg class="tile"><use class="face" xlink:href="#mj-{{- $code -}}" /></svg>
        {{- end -}}
      {{- end -}}
    {{- end -}}

    {{- /* 展示听牌 */ -}}
    {{- if index $count 1 -}}
      {{- $side := index $Output 1 -}}
      <span class="handwriting" style="margin: 0 0.25rem;">
        {{- if eq (index $count 1) 1 -}}和{{- else -}}<br/>听{{- end -}}
      </span>
      {{- range $key, $value := $side -}}
        {{- range $ting_pai := (uniq $value) -}}
          {{- if eq $Style "img" -}}
            <img class="sticker" src="https://sdfsdf.dev/36x52.png,beige,beige" title="{{- $ting_pai -}}" style="width: 36px; height: 52px; margin: 0 1px; border: 2px dashed red;" />
          {{- else if and (eq $Style "emoji") (len $ting_pai) -}}
            {{- $i := int (slicestr $ting_pai 0 1) -}}
            {{- $charset := "" -}}
            {{- if eq $key "man" -}}
              {{- $charset = $EMOJI.MAN -}}
            {{- else if eq $key "pin" -}}
              {{- $charset = $EMOJI.PIN -}}
            {{- else if eq $key "so" -}}
              {{- $charset = $EMOJI.SO -}}
            {{- else if eq $key "zi" -}}
              {{- $charset = $EMOJI.ZI -}}
            {{- end -}}
            {{- print (slicestr $charset (sub $i 1) $i) -}}
          {{- else -}}
            <svg class="tile"><use class="face" xlink:href="#mj-{{- $ting_pai -}}" /></svg>
          {{- end -}}
        {{- end -}}
      {{- end -}}
    {{- end -}}
  {{- if or (gt (index $count 0) 1) (gt (index $count 1) 0) -}}</div>{{- end -}}

{{- end -}}
```

## Todo List

### 思考是否需要判定数量

- [x] ~~做了数量检测，如果不是 13 张直接无视第二个参数（附加的牌）~~\
       感觉有点多余，这样只有门前清能显示听和\
       改成大于 13 也不行，杠了手牌就不止 13 张了\
       ~~而且吃碰等鸣牌暂时也没办法体现~~（已实现）
- [x] 实际测试完全是画蛇添足，改回来了
- [ ] 分离出副露区之后可以了，判定手牌数量是否合法 `len(main) % 3 == 1`\
       据我所知 shortcode 没有取余操作：循环 `-3` 到 `<= 0`，判断 `if remain == -2` 即可

### 展示副露区

- [x] 展示副露区体现鸣牌：吃、碰、大明杠、暗杠、加杠

|        吃        |        碰        |       大明杠        |       加杠       |    暗杠    |
| :--------------: | :--------------: | :-----------------: | :--------------: | :--------: |
| `#7m%0` r7 t9 t8 | `.6p%0` r6 t6 t6 | `-5s%0` r5 t5 t5 t5 | `+4z%0` d4 t4 t4 | `_7z` X77X |
| `#7m%1` r8 t9 t7 | `.6p%1` t6 r6 t6 | `-5s%1` t5 r5 t5 t5 | `+4z%1` t4 d4 t4 |            |
| `#7m%2` r9 t8 t7 | `.6p%2` t6 t6 r6 | `-5s%2` t5 t5 t5 r5 | `+4z%2` t4 t4 d4 |            |

#### 吃

<span class="center">
  <span style="margin: 0 0.5rem;">
    <svg class="rotate"><use class="face" xlink:href="#mj-7m" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-9m" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-8m" /></svg>
  </span>
  <span style="margin: 0 0.5rem;">
    <svg class="rotate"><use class="face" xlink:href="#mj-8m" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-9m" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-7m" /></svg>
  </span>
  <span style="margin: 0 0.5rem;">
    <svg class="rotate"><use class="face" xlink:href="#mj-9m" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-8m" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-7m" /></svg>
  </span>
</span>

<pre>
{{&lt; mahjong main="7788s" wait="7s" side="#7m%0 #6p%1 #5s%2" &gt;}}
</pre>

{{< mahjong main="7788s" wait="7s" side="#7m%0 #6p%1 #5s%2" >}}

> 只可能吃上家，吃哪张的区别。

#### 碰

<span class="center">
  <span style="margin: 0 0.5rem;">
    <svg class="rotate"><use class="face" xlink:href="#mj-6p" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-6p" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-6p" /></svg>
  </span>
  <span style="margin: 0 0.5rem;">
    <svg class="tile"><use class="face" xlink:href="#mj-6p" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-6p" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-6p" /></svg>
  </span>
  <span style="margin: 0 0.5rem;">
    <svg class="tile"><use class="face" xlink:href="#mj-6p" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-6p" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-6p" /></svg>
  </span>
</span>

<pre>
{{&lt; mahjong main="7788s" wait="8s" side=".7m%0 .6p%1 .5s%2" &gt;}}
</pre>

{{< mahjong main="7788s" wait="8s" side=".7m%0 .6p%1 .5s%2" >}}

> 只可能碰一种牌，碰哪家的区别。

#### 大明杠

- [ ] 目前杠没有对赤宝牌做额外处理

<span class="center">
  <span style="margin: 0 0.5rem;">
    <svg class="rotate"><use class="face" xlink:href="#mj-5s" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-5s" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-0s" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-5s" /></svg>
  </span>
  <span style="margin: 0 0.5rem;">
    <svg class="tile"><use class="face" xlink:href="#mj-5s" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-5s" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-0s" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-5s" /></svg>
  </span>
  <span style="margin: 0 0.5rem;">
    <svg class="tile"><use class="face" xlink:href="#mj-5s" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-5s" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-0s" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-5s" /></svg>
  </span>
</span>

<pre>
{{&lt; mahjong main="7788s" wait="7s" side="-7m%0 -6p%1 -5s%2" &gt;}}
</pre>

{{< mahjong main="7788s" wait="7s" side="-7m%0 -6p%1 -5s%2" >}}

> 类似碰，只可能杠一种牌，杠哪家的区别。\
> 另外鸣牌含赤宝牌的时候到底是怎么摆的？

#### 加杠

- [ ] 加杠需要额外处理（目前和大明杠一样）
- [ ] 「加杠」纵向排列显示使用「[SVG 图案填充 - Pattern](https://www.cnblogs.com/lhweb15/p/5489699.html)」：`fill="url(#id)"`

```XML
<svg width="1000" height="1000">
  <defs>
    <pattern id="grid" x="100" y="100" width="0.2" height="0.2" patternUnits="objextBoundingBox">
      <circle cx="10" cy="10" r="5" fill="red"></circle>
      <polygon points="30 10 60 50 0 50" fill="green"></polygon>
    </pattern>
  </defs>
  <rect x="100" y="100" width="400" height="300" fill="url(#grid)" stroke="blue"></rect>
</svg>
```

<div class="center">
  <span style="margin: 0 0.5rem;">
    <svg class="rotate double"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-4z" /></svg>
  </span>
  <span style="margin: 0 0.5rem;">
    <svg class="tile"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-4z" /></svg>
  </span>
  <span style="margin: 0 0.5rem;">
    <svg class="tile"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="tile"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-4z" /></svg>
    <svg class="rotate"><use class="face" xlink:href="#mj-4z" /></svg>
  </span>
</div>

<pre>
{{&lt; mahjong main="7788s" wait="8s" side="+7m%0 +6p%1 +5s%2" &gt;}}
</pre>

{{< mahjong main="7788s" wait="8s" side="+7m%0 +6p%1 +5s%2" >}}

> 和碰一个原理。

#### 暗杠

<span class="center">
  <svg class="tile"><use class="face" xlink:href="#mj-0z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-7z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-7z" /></svg>
  <svg class="tile"><use class="face" xlink:href="#mj-0z" /></svg>
</span>

<pre>
{{&lt; mahjong main="7788s" wait="7s" side="_7m _6p _5s" &gt;}}
</pre>

{{< mahjong main="7788s" wait="7s" side="_7m _6p _5s" >}}

> 最省心的判定，甚至连赤宝牌都不用额外判定。

<img src="https://i.loli.net/2021/11/11/jFbUQz6hypDP2Lv.png" title="TODO" data-sticker />
