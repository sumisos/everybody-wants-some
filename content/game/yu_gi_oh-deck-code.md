---
title: "《游戏王》卡组构筑 ydk 格式代码处理"
subTitle: "开发中"
date: 2022-03-16T12:17:08+08:00
tags: ["Yu-Gi-Oh", "JavaScript", "Hugo", "shortcode"]
series: ["Yu-Gi-Oh"]
related: true
---

## 参考资料 & 测试

- 前端渲染及 SSR：card.js「[GitHub Repo](https://github.com/ymssx/ygo-card)」「[Demo](https://ymssx.github.io/ygo/)」「[卡图](https://gitee.com/ymssx/pics/)」
- 鼠标悬浮提示框参考：Steam Info「[出处：其乐论坛](https://keylol.com/t85959-1-1)」「[Greasy Fork](https://greasyfork.org/zh-CN/scripts/956-steam-info/code)」「[源码](https://steamdb.keylol.com/steam_info.js)」
- Hugo：自定义 shortcode「[Shortcode 文档](https://gohugo.io/templates/shortcode-templates/#custom-shortcode-examples)」「[基本语法](https://gohugo.io/templates/introduction/)」「[函数](https://gohugo.io/functions/)」

<details>
  <summary>一个小 bug</summary>

<pre>
这是一个 bug：`&lt;div class="ygo-card" /&gt;` **首次**出现的时候 _前面的文本_ 会被视为一个段落 `&lt;p/&gt;` 进而导致自动换行，考虑使用双层 `&lt;span/&gt;` 嵌套尝试修复{{&lt; ygo-card 禁忌的一滴 24299458 spell sg &gt;}}测试文本测试文本测试文本测试文本{{&lt; ygo-card name="青眼白龙" id="89631139" type="light" &gt;}}测试文本测试文本测试文本测试文本测试文本测试文本测试文本{{&lt; ygo-card name="红色重启" id="23002292" type="trap" icon="fj" &gt;}}测试文本测试文本测试文本测试文本测试文本{{&lt; ygo-card &gt;}}测试文本测试文本测试文本测试测试文本
</pre>

这是一个 bug：`<div class="ygo-card" />` **首次**出现的时候 _前面的文本_ 会被视为一个段落 `<p/>` 进而导致自动换行，考虑使用双层 `<span/>` 嵌套尝试修复{{< ygo-card 禁忌的一滴 24299458 spell sg >}}测试文本测试文本测试文本测试文本{{< ygo-card name="青眼白龙" id="89631139" type="light" >}}测试文本测试文本测试文本测试文本测试文本测试文本测试文本{{< ygo-card name="红色重启" id="23002292" type="trap" icon="fj" >}}测试文本测试文本测试文本测试文本测试文本{{< ygo-card >}}测试文本测试文本测试文本测试测试文本

</details>

## 需求

> 考虑做成一个前端网站。这里临时用 JS 做可行性验证，到时候还是用 TS 写。

<details>
  <summary>Todo List</summary>

- [x] 卡组格式转换 ydk ygm 等，类似「[YGO-Engine 的 ydk 和 ygm 转换](https://www.ygo-sem.cn/yrp/deck.aspx)」
- [ ] 从录像文件 `.yrp` 中提取卡组信息，类似「[OURYGO 的](http://deck.ourygo.top/yrp/parse.html)」和「[YGO-Engine 的](https://www.ygo-sem.cn/yrp/)」
- [x] 展现卡图，类似「[OURYGO 的](http://deck.ourygo.top/ydk/show.html?ygotype=deck&v=1&d=FNhefVLXC2RMpY_w-43iOvy2SnXARcGDa4Gf-WWVKlHxmGQN9gbi5Y-FDdvkNIpufUXGkPmlV3n70HzV3OV58le_LRnThgSJlIImmKZAMuPJSqBUEax8yF1rIQy7GidRET65azdhGIVy2w4rI9b5cwTxrZ5JsWGN-uRnxrXZ0jdujdvkOJ9zVDCtMtezkT-6CuKtQso-yA)」和「[Koishi 的](https://srv.koishi.pro/deck.html?name=%E7%94%B5%E5%AD%90%E9%BE%99.ydk&deck=4w1Sq5PWsaO2O23c11pO517NvTO7O71qd0TOAOA05HU0OD4KwknOFOF1oVbeOIOI2uCys0GwcjOM1sVqyOP17GijOS1P08S1s97AOV6hJdr4wGPtOYOY4gZM6ObOb1mVXY6LcrE0mWPaO06jJ8o66oC26V9WtOk5oYx16ykXJ5iRno0oL5x4UqN4Oq3l2Sc3cJ2M4fAu57GNDt5RmycOh25wlBOy6LPxTOS1clPwQ125Npbp7FrNhQ15Q152eeqLQ18Q180T5IH)」
- [x] 点击卡组中的单卡跳转卡查页面
- [ ] ~~不用 jq（我不想）实现鼠标浮（hover）在单卡上弹出悬浮对话框显示卡片详情~~
- [ ] ~~在线编辑卡组，类似 YGOPro 编辑卡组功能（或许可以用 godot 写成桌面端？）~~
- [x] 原来做 [DLM](https://www.duellinksmeta.com/) 的现在做 MD 了（MDM）：「[Master Duel Meta - Deck Builder](https://www.masterduelmeta.com/deck-tester)」\
       完美实现我想要的所有需求（从录像提取卡组除外，待实现）
- [ ] ~~获取 MDM 的卡组，当然可以做爬虫，但有现成的可以抄，试着抄现成~~：
  1. 逆向目标：[拓王神 组卡器 2.2 - 对应 MD 1.02](https://www.bilibili.com/read/cv15370306) 里的 `masterduelmeta导出卡组.exe`
  2. [pyinstxtractor](https://github.com/extremecoders-re/pyinstxtractor) 把 `.exe` 反编译成 `.pyc`
  3. 由于每个 `.pyc` 文件都有 magic head，pyinstaller 生成 exe 的时候会把 pyc 的 magic 部分去掉，所以在反编译的时候需要自己补齐
  4. 通过 `struct` 文件获取前 4 个字节（Python 编译的版本），加上 `00 00 00 00` 4 个字节（本来应该是时间戳，不重要）组成 magic head
  5. 通过 [WinHex](http://www.x-ways.net/winhex/) 或者 [hexed.it](https://hexed.it/) 等工具把 magic head 重新写入 `.pyc` 文件开头
  6. 发现 pyinstxtractor 生成 `.pyc` 的已经是还原了 magic head 后的版本了，~~我就是过期资料的受害者~~
  7. [在线反编译 pyc](https://tool.lu/pyc/) 或者 [uncompyle6](https://github.com/rocky/python-uncompyle6)（不支持 Python 3.9 及以上，之前重装过电脑上只有 3.10，我还专门去装了个 3.8.6）把 `.pyc` / `.pyo` 反编译成 `.py` 源文件
  8. 失败，原因不明。到目前为止沉没的时间成本已经够多了，该及时止损了，打住打住
- [x] 自己写爬虫
  1. 本来应该用异步请求库 [aiohttp](https://docs.aiohttp.org/en/stable/)，但没有大规模用途，临时用 [requests](https://docs.python-requests.org/zh_CN/latest/) 就够了
  2. DLM 的反爬做得可以啊，赞叹（你以前不是爬过吗~~什么记忆只有 7 秒的弱智金鱼~~），静态网页只有 `<a class="image-wrapper svelte-152ds40 card-image-loading" /a>` 的占位符，具体内容后续动态加载，进一步使用 [Selenium](https://www.selenium.dev/documentation/) + [PhantomJS](https://phantomjs.org/download.html) 模拟浏览器加载 JS
  3. 获得的 HTML 用 [Beautiful Soup 4](https://beautifulsoup.readthedocs.io/zh_CN/v4.4.0/)（以及 [lxml](https://lxml.de/) 提高效率）解析
  4. 还原卡名，`from urllib.parse import unquote` 解码 url 编码
  5. 卡片数据以前我是去 YGOPro 偷的根目录下的 `card.cdb`（sqlite3），现在正好手上一堆 MD 相关工具，基本人手一个转换好的 `cards.json`，直接用现成的了
  6. 妈的优化做多了有点入脑了，老是满脑子效率，魔怔了属于是。随便写个脚本难道还能有百万吞吐？真的怪。直接 `json.loads(file.read())` 读成字典暴力遍历就完事了
  7. 搞定，输入 MDM 网址，输出 ydk 格式卡组代码
- [x] 顺手把批量转换卡名写了，支持将整个卡组切换为中文名、日文名、英文名\
       ~~可部分选中，也提供一键复制按钮~~ 用脚本写的不考虑人机交互
- [x] 爽到，从现在开始可以一行命令把 `masterduelmeta.com` 的卡组抄到博客来了\
       最后还是重复造轮子了？\
       没有哦，`masterduelmeta导出卡组.exe` 这个工具只能导出卡组，对其他格式毫无办法\
       而我有导出任何卡组的需求，比如《<a href="/game/yu_gi_oh-n-and-r-deck/" target="_blank">「NR 杯」卡组构筑</a>》里用到的 [NR 杯禁限卡表](https://www.masterduelmeta.com/articles/news/march-2022/nr-festival-banlist)

</details>

## ydk 卡组代码

众所周知，广为流传的 `.ydk` 格式简单易懂：

- `#main` 后面 - 主卡组
- `#extra` 后面 - 额外卡组
- `!side` 后面 - 副卡组

每行一个卡密，每个卡密代表一张卡。

```
#备注 随便写什么
#main
71039903
71039903
71039903
45467446
89631139
89631139
89631139
38517737
22804410
55410871
24094653
21082832
#extra
2129638
56532353
59822133
59822133
40908371
40908371
!side
20654247
43228023
```

> 感谢 Hugo 强大的 [shortcode 功能](https://gohugo.io/templates/shortcode-templates/#custom-shortcode-examples) 支持高度客制化玩法，允许我轻松实现下面的呈现效果。\
> 卡查用的 [百鸽](https://www.ygocdb.com/)；卡图来自 `momobako.com` 这个域名的 CDN（由知乎用户 [Nanahira](https://www.zhihu.com/people/nanahira) 提供）。

{{< ygo-deck "白龙卡组" >}}
#main
71039903
71039903
71039903
45467446
89631139
89631139
89631139
38517737
22804410
55410871
24094653
21082832
#extra
2129638
56532353
59822133
59822133
40908371
40908371
!side
20654247
43228023
{{< /ygo-deck >}}

### 处理 ydk

这个格式真的蛮好，{{< ruby "处理" "input" >}}和{{< ruby "生成" "output" >}}都很方便，对人类友好的可读性也很棒。

```JavaScript
/**
 * reduceDuplicate() 去重 & 计数 生成新的二维数组
 * @param {array} duplicate
 * @returns
 */
const reduceDuplicate = (duplicate) => {
  let de_weight = [];
  for (let i = 0; i < duplicate.length; ) {
    let count = 0;
    for (let j = i; j < duplicate.length; j++) {
      if (duplicate[i] == duplicate[j]) {
        count++;
      }
    }
    de_weight.push([duplicate[i], count]);
    i += count;
  }
  return de_weight;
};

/**
 * 将 ydk 格式的卡组信息代码转换为 JS 可操作的对象
 * @param {string} ydk
 * @returns
 */
const ydk2deck = (ydk) => {
  const ydk_array = ydk.split("\n");
  let deck = { main: [], extra: [], side: [] };
  let step = 0;
  for (let i = 0; i < ydk_array.length; i++) {
    switch (step) {
      case 1:
        if (ydk_array[i].trim().toLowerCase() === "#extra") {
          step = 2;
        } else {
          deck.main.push(ydk_array[i]);
        }
        break;
      case 2:
        if (ydk_array[i].trim().toLowerCase() === "!side") {
          step = 3;
        } else {
          deck.extra.push(ydk_array[i]);
        }
        break;
      case 3:
        deck.side.push(ydk_array[i]);
        break;
      default:
        if (ydk_array[i].trim().toLowerCase() === "#main") step = 1;
    }
  }
  return {
    main: reduceDuplicate(deck.main),
    extra: reduceDuplicate(deck.extra),
    side: reduceDuplicate(deck.side),
  };
};

const example_ydk_code =
  "#备注 随便写什么#main\n71039903\n71039903\n71039903\n45467446\n89631139\n89631139\n89631139\n38517737\n22804410\n55410871\n21082832\n#extra\n2129638\n56532353\n59822133\n59822133\n40908371\n40908371\n!side\n20654247\n43228023";
console.info(ydk2deck(example_ydk_code));
```

### ygm 格式 卡组分享码

解析成功之后像「[ygo-sem.cn 的 ydk / ygm 分享码互相转换](https://www.ygo-sem.cn/yrp/deck.aspx)」这样的工具做起来也很简单了。

```JavaScript
/**
 * deck2ygm() 将卡组对象转换为 ygm 格式的卡组分享码文本
 * @param {object} deck 卡组对象
 * @returns
 */
const deck2ygm = (deck) => {
  const card2ygm = (cards) =>
    cards
      .map((card) => (card[1] > 1 ? `${card[0]}*${card[1]}` : `${card[0]}`))
      .join("_");
  const ygm = `ygo://deck?main=${card2ygm(deck.main)}_&extra=${card2ygm(
    deck.extra
  )}_&side=${card2ygm(deck.side)}_`;
  return ygm;
};
```

> 所谓 ygm 就是早年间安卓端 [YGOMobile](https://www.pgyer.com/ygomobilecn) 的卡组分享码格式，现在已经被淘汰了。\
> （最新版的 YGOMobile 用的是下面提到的 DA 协议。）\
> 而 ydk 被包括 YGOPro 在内的各种桌面端广泛支持和使用，并允许以 `.ydk` 格式的文件保存。

## DA 协议分析

闭门造车不可取，有现成的可用没必要标新立异非要自己重新设计。\
参考现有的《[YGO 决斗助手协议](https://www.zybuluo.com/feihuaduo/note/1824534)》（简称 DA 协议）的设计完成长度压缩算法。\
~~这兄弟文档写得有点乱，费了点劲才看明白。~~

> base64 编码「文本」是 3 字节 → 4 字节，平白多出 33% 的冗余，显然跟**压缩**沾不上边。\
> 但这里记录的是「纯数值」，用 base64 旨在压缩**长度**——把一长串卡组信息压成一行字符。\
> 不要挑我字眼。

### 单卡

每一**种类**不同的卡，为一个「29 位的二进制数」，具体组成为「{{< ruby "单卡数量" "前 2 位" >}}」+「{{< ruby "单卡密码" "后 27 位" >}}」。

```JavaScript
const pwd2bit = (pwd, count) => {
  const prefix_bit = ("0" + parseInt(count).toString(2)).slice(-2);
  let suffix_bit = parseInt(pwd).toString(2);
  //console.debug(prefix_bit, suffix_bit, "\n" + prefix_bit + suffix_bit);
  suffix_bit =
    suffix_bit.length === 27
      ? suffix_bit
      : "0".repeat(27 - suffix_bit.length) + suffix_bit;
  return prefix_bit + suffix_bit;
};

const card_index =
  typeof process !== "undefined" && process.argv.length > 2
    ? process.argv[2]
    : 0;
let test_deck = [
  [89631139, 3],
  [22804410, 1],
];
let single_card = pwd2bit(...test_deck[card_index]);
console.info(single_card, single_card.length);
```

### 卡组

按照 `主卡组` + `额外卡组` + `副卡组` 的顺序把单卡依次拼接起来即可。\
还要注意记录各个卡组的单卡**种类**数量，并将数量也转换为固定长度的二进制数放在开头。

| 主卡组种类数量 | 额外卡组种类数量 | 副卡组种类数量 |  主卡组构成  | 额外卡组构成 |  副卡组构成  |
| :------------: | :--------------: | :------------: | :----------: | :----------: | :----------: |
|      8 位      |       4 位       |      4 位      | 29 位 × n 种 | 29 位 × m 种 | 29 位 × p 种 |

```JavaScript
/******************************** 通用工具函数 ********************************/

/**
 * int2bin() 将十进制转换为二进制 并自动补充前导零到指定位数
 * @param {int} num 输入的十进制数
 * @param {int} bit 指定输出二进制数的位数
 * @returns
 */
const int2bin = (num, bit) => {
  const num_bin = parseInt(num).toString(2);
  return num_bin.length === bit
    ? num_bin
    : "0".repeat(bit - num_bin.length) + num_bin;
};

/**
 * bin2base64() 将二进制数转换为 base64 编码
 * @param {string} binary 字符串类型的二进制数
 * @returns
 */
const bin2base64 = (binary) => {
  // 补零 由于是二进制数直接转成 base64 编码 不存在进一步的冗余 所以不会出现 = 等号
  if (binary.length % 12 !== 0) binary += "0".repeat(12 - (binary.length % 6));
  const base64 = [
    // 懒得写 [A-Za-z0-9] 了 临时用自动生成顶顶
    // TODO 生产环境应该写死 以免每次运行都要遍历一遍(重新生成)
    ...[...new Array(26).keys()].map((i) =>
      String.fromCharCode("A".charCodeAt(0) + i)
    ),
    ...[...new Array(26).keys()].map((i) =>
      String.fromCharCode("a".charCodeAt(0) + i)
    ),
    ...[...new Array(10).keys()].map((i) =>
      String.fromCharCode("0".charCodeAt(0) + i)
    ),
    "-",
    "_",
  ];
  let base64_code = "";
  for (let i = 0; i < binary.length; i += 6) {
    base64_code += base64[parseInt(binary.slice(i, i + 6), 2)];
  }
  return base64_code;
};

/******************************** YGO 相关 ********************************/

/**
 * card2bin() 将卡片信息转换为二进制数
 * @param {int} pwd 卡片密码
 * @param {int} count 该卡片数量
 * @returns
 */
const card2bin = (pwd, count) => int2bin(count, 2) + int2bin(pwd, 27);

/**
 * deck2code() 将卡组信息转换为 base64 代码
 * @param {object} deck
 * @returns
 */
const deck2code = (deck) => {
  const countDeck = (cards) => [
    cards.reduce((sum, card) => (sum += parseInt(card[1])), 0),
  ];
  const deck_count = [
    countDeck(deck.main),
    countDeck(deck.extra),
    countDeck(deck.side),
  ];
  console.log(
    `[Tips] Got deck {main=${deck_count[0]} extra=${deck_count[1]} side=${deck_count[2]}}, processing...`
  );
  const array2bin = (cards) => cards.map((card) => card2bin(...card)).join("");
  const deck_binary =
    int2bin(deck.main.length, 8) +
    int2bin(deck.extra.length, 4) +
    int2bin(deck.side.length, 4) +
    array2bin(deck.main) +
    array2bin(deck.extra) +
    array2bin(deck.side);
  return bin2base64(deck_binary);
};

/******************************** 单元测试 ********************************/

const example_deck = {
  main: [
    [71039903, 3],
    [45467446, 1],
    [89631139, 3],
    [38517737, 1],
    [22804410, 1],
    [55410871, 1],
    [21082832, 1],
  ],
  extra: [
    [2129638, 1],
    [56532353, 1],
    [59822133, 2],
    [40908371, 2],
  ],
  side: [
    [43228023, 1],
    [20654247, 1],
  ],
};

console.info(
  "http://deck.ourygo.top?ygotype=deck&v=1&d=" + deck2code(example_deck)
);
```

得到下面生成的链接：

```
http://deck.ourygo.top/ydk/show.html?ygotype=deck&v=1&d=B0Lh39z6rXHNuq9TRqS7vpSt-90tNgLdKDZaCCB-5lr07AzkNA1k4Gymk7KKdUnNu4A
```

[打开链接](http://deck.ourygo.top/ydk/show.html?ygotype=deck&v=1&d=B0Lh39z6rXHNuq9TRqS7vpSt-90tNgLdKDZaCCB-5lr07AzkNA1k4Gymk7KKdUnNu4A) 验证效果，完美。
