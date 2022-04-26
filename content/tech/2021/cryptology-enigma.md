---
title: "一种基于 JS 的恩格玛机的软件仿真实现"
subTitle: "Enigma Machine via JavaScript"
date: 2021-11-01T21:58:06+08:00
tags: ["Cryptology", "enigma"]
series: ["Cryptology"]
related: true
---

## 背景

> Enigma 源自希腊文，英语解释为「谜，费解之物」。  

<ruby><rb>恩格玛</rb><rp>（</rp><rt>Enigma</rt><rp>）</rp></ruby>机是一种基于<ruby><rb>字母替换加密</rb><rp>（</rp><rt>Substitution Cipher</rt><rp>）</rp></ruby>原理的加密 & 解密一体机。  
它的电路极度简单，但精妙绝伦的机械设计让它获得了极强的加密性能，更难能可贵的是还保持了相当高程度的易用性。  

### 发明

<ruby><rb>恩格玛加/解密机</rb><rp>（</rp><rt>Enigma Machine</rt><rp>）</rp></ruby>由德国人<ruby><rb>亚瑟·谢尔比乌斯</rb><rp>（</rp><rt>Arthur Scherbius</rt><rp>）</rp></ruby>于 1918 年发明。  
Enigma 最底层的部分其实还是凯撒密码（字母替换），但进行了翻天覆地的改良。  

在英语里，一篇正常的文章中：  
* 字母 `e` / `t` / `a` 出现的概率远远高于其他字母。  
* 而字母 `j` / `q` / `x` / `z` 出现的概率远远低于其他字母。  

顺便一提，目前在全世界范围内广泛使用的键盘布局——  
柯蒂组合式键盘（QWERTY）的设计也考虑到了这一点。  
~~考虑了但没有完全考虑。~~ 比如 e / t 在中间没问题，但 a 却在边缘需要左手小指来按；q / z / x 在边上没问题，但 j 又在右手食指自然垂下这个可以说最关键的位置；这显然很不合理。  
实际上柯蒂键盘设计之初**最优先**的目的并不是打字速度，而是「不卡键」。  
局限于当时的工业水平，打字机的卡键问题几乎无法解决。因此柯蒂键盘的设计是「在不卡键的前提下尽量提高打字速度」。换言之，它是故意牺牲了部分打字效率来防止发生卡键的。  
大多数人惯用右手，柯蒂键盘却让左手负担了 57% 的工作量。小指和无名指是力量最弱的指头，却不得不频繁使用。三行键盘中间一行使用率仅 30%，正常行文需要大量上下移动指头。  
柯蒂键盘（QWERTY）已经不是最不最优解的问题了，比起其他以效率为先精心设计的键盘排列（比如 DVORAK、Colemak 甚至 Malt 这种异形），它完全就是负效率。  
只不过打字机之父<ruby><rb>克里斯托夫·拉森·肖尔斯</rb><rp>（</rp><rt>Christopher Latham Sholes</rt><rp>）</rp></ruby>作为开创者建立了这个规范，并一直沿袭至今，甚至生产其他键位排列更高效更科学的键盘的公司纷纷破产，QWERTY 反而靠着大众的习惯成为了一股巨大的力量裹挟着所有人笑到了最后。  
这个现象真的非常非常典型：「路径依赖」「赢家通吃」「劣币驱逐良币」。  

扯远了，话说回来，所以凯撒密码（单字母替换密码）在统计学与语言学的剖析下不堪一击。  
除了简单统计出现概率之外，语言学家利用统计工具还有种种方法来帮助破解单字母替换。  
比如一个字母如果出现在其他字母的左右两侧，说明它很可能是一个元音字母；反过来说，如果一个字母从来不出现在某些特定字母的两侧，那么它很可能是一个辅音字母。  
在大量数据的支撑下，统计频率将收敛于概率。  
样本量足够大的情况下，单字母替换就跟没替换一样。  

那该怎么办呢，一个非常简单粗暴的想法自然产生：替换**一次不行**，就**多来几次**。  
第一次出现该字母时，使用第一张表替换；第二次出现，换成第二张表替换。  
如此一来，同一个字母，就**有可能**被替换为两个不同的字母。有几张表，就有几种可能。  
那我搞 25 张表，岂不是有 25 种（除开它自己）替换可能？换句话说，抹平了统计特征。  
是的，你不是第一个想到的，这玩意被命名为<ruby><rb>维热纳尔方阵</rb><rp>（</rp><rt>Vigenère square</rt><rp>）</rp></ruby>。  
**同时使用多张替换表，一定程度上可以破坏字母的统计特征。**  

> 在实际运用过程中，并不会有人使用过于离谱的替换表数量，因为太复杂了会影响加密及解密的效率，还会降低容错率。  

假如一个人决定用 7 张表，每个字母都会随机替换为其他 7 个不同的字母，这样的统计特征并不明显，加密 / 解密的工作量也不会太大。  
那么这种加密方式是否安全呢？很遗憾，并不。  

还是用英语举例，一篇文章里 the / and 之类的词一定会大量重复出现，这是语法本身决定的。  
虽然这些单词有 6/7 的几率被替换为其他形式，但 7 次之后一定会循环回 1/7 的特定形式。  
当获得足够多的样本后，可以对重复出现的段落进行分析，分析它们之间的距离。  
如果段落重复出现的距离都是 7 的倍数，就能确定这份密文用了 7 张替换表加密。  

> 如果是 11 的倍数就说明用了 11 张表，同理代入即可。  

那么就可以把第 <ruby><rb>7n+1</rb><rp>（</rp><rt>n=0,1,2…</rt><rp>）</rp></ruby> 个字母提取出来组成第一个集合、<ruby><rb>7n+2</rb><rp>（</rp><rt>n=0,1,2…</rt><rp>）</rp></ruby> 组成第二个集合……<ruby><rb>7n+7</rb><rp>（</rp><rt>n=0,1,2…</rt><rp>）</rp></ruby> 组成第七个集合；最后只要对这七个集合依次进行 7 次字频统计分析，就可以破解这种加密方式。  

到这里结论已经很明显了，除非  
「**每加密一个字母就更换一次替换表，而且使用的替换表永不重复**」  
否则无论如何都会被破解。  

> 其实「每加密一个字母就更换一次替换表，而且使用的替换表永不重复」这件事在理论上是可以做到的，如果忽略人力成本、而且保证运算过程永不出错的话。  
> 那么加密一个一万个字母的明文，需要一万张替换表。如果每行一张替换表，这个密码本将长达一万行（密码本比密文本身还长）。加密花了多久，解密也需要同样久，这都不说了。  
> 除了加解密费时费力之外，长期坚持在行军中分发这么厚的密码本也几乎不可能。  
> 总而言之，人力有时而穷。  

但人类做不到不代表机器也做不到。  
恩格玛机就是这样一台机器。  

### 破解

> 即传记电影《模仿游戏》剧情。  

二战之初，英法对德国整的新活不屑一顾，认为不需要破解也能打赢德国。  
~~虽然爷破不了，爷也不怕你，爷傲灬耐我何。~~  
但波兰人怕得一比啊，于是一个机智的波兰数学家<ruby><rb>雷耶夫斯基</rb><rp>（</rp><rt>Marian Rejewski</rt><rp>）</rp></ruby>从商业版反推了军用版结构。  
然而夹在苏德中间的波兰并没有扑腾出什么水花，波兰灭亡后这些资料辗转到了英国人手里。  
由于接线板的存在给军用版上了最后一道保险，本来是没事的。  
但问题出在德军喜欢每天早上发<ruby><rb>天气预报</rb><rp>（</rp><rt>Wetterbericht</rt><rp>）</rp></ruby>。  

> 当然了，不是天气预报的错，就算没有天气预报也会有「Heil Hitler」之类的固定用语。  

<ruby><rb>艾伦·图灵</rb><rp>（</rp><rt>Alan Turing</rt><rp>）</rp></ruby>（图灵奖的图灵）和<ruby><rb>戈尔登·韦尔什曼</rb><rp>（</rp><rt>Grodon Welchman</rt><rp>）</rp></ruby>利用恩格玛机的自反性（对应的字母可以互相转化）和排己性（一个字母永远不可能被加密为它自己）以及~~内华达大学数学系的~~ 暴力穷举法设计了 Bombe Machine。  

> 名字来自波兰的解密机器 Bomba，但与 Bomba 的原理大相径庭，只是化用了名字。  

图灵通过 Bombe Machine 以及固定格式的密文破解了当天的接线板的接法（我记得是转子 5 选 3，密钥和接线板每天变），最后可以做到 20 分钟内破解加密方式（密码和接线板）。  

二战最后的结局大家都知道，纳粹德国战败了（所有法西斯邪恶轴心都跪了）。  

英国人后来改进了恩格玛机具有排己性的特点（即一个字母有可能会被加密为它自己；盲猜是在反射板上做文章），改进版被称为 TypeX Machine。  

图灵破解恩格玛机的具体算法（Bombe Machine）直至今日依旧是绝密（TypeX Machine 当然也是），已经过去快一个世纪了，英国佬仍然不打算解密。  

## 原理

恩格玛机的原理参考《[【计算机博物志】战争密码（上集）如何复刻一台恩格玛机](https://www.bilibili.com/video/BV1DS4y1R7hM)》。  

## 实现

用 js 是方便写完直接加入我的工具站全家桶，懒得二次重构了。  
不对，换成 ts 写还不是要重构。  
算了，至少 js 到 ts 跨度总没有别的语言那么大吧。  

### 洗牌算法 Fisher–Yates shuffle

众所周知，大部分官方库的 `sort()` 都是插入排序（length < 10）或者快排。  
而无论使用什么排序方法，大多数排序算法的时间复杂度介于 O(n) ~ O(n<sup>2</sup>) 之间，元素之间的比较次数通常情况下远远小于 n(n-1)/2。  
这意味着部分元素之间根本就没有互相比较的机会（也就没有了公平地随机交换的可能性）。  

所以当样本量上来之后可以轻易得出一个结论「**所有元素都倾向于停留在自己的初始位置**」。  
因此使用公平的洗牌算法以保证随机分布的离散程度。  

```JavaScript
// Fisher–Yates shuffle 洗牌算法
Array.prototype.shuffle = function () {
    let array = this;
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = array[j];
        array[j] = array[i];
        array[i] = t;
    }
    return array;
}
```

### 转子 Rotors 定义转子

一个 3 × 26 大小的二维数组。（当然也不一定非得是 3。~~加，都可以加~~）  

```JavaScript
const Enigma = /** @class */ (function () {

    function Enigma() { // 构造函数
        this.rotors = [];
    }

    Enigma.prototype.newRotor = function () {
        let rotor = [];
        for (let i = 0; i < 26; i++) {
            rotor.push(i);
        }
        rotor.shuffle();
        this.rotors.push(rotor);
        return rotor;
    };

    return Enigma;

}());
```

### 反射器 Reflector 定义反射器

一开始我本来想的是使用长度为 13 的数组。  
这样一来，如果 A\~Z 对应 0\~25 的话，把 13\~25 打乱填进这个数组（0\~12）就自然形成了一一对应的关系，节省空间的同时一看就懂，不管是读起来还是实现起来都很直观。  

后来简单估算概率的时候发现这样做有一个致命的缺点：可能性砍掉太多了。  
如果这样做意味着前面 13 个字母只能对应到后 13 个字母；  
比如 A 只可能对应到 N\~Z，永远不可能对应到 B\~M。  

所以最后还是改成了长度 26（优雅和性能二选一，我选择性能），老老实实按照相邻的一对奇偶位置上的字母这个规则来对应（随机性就交给公平的洗牌算法），保留了全部可能性。  

```JavaScript
const Enigma = /** @class */ (function () {

    function Enigma() { // 构造函数
        this.reflector = [];
    }

    Enigma.prototype.newReflector = function () {
        let r = [];
        for (let i = 0; i < 26; i++) {
            r.push(i);
        }
        r.shuffle();
        this.reflector = r;
        return r;
    };

    return Enigma;

}());
```

### 键盘 Keyboard 输入阶段

1. 输入的字母经过第一个转子时变成<ruby><rb>键</rb><rp>（</rp><rt>key</rt><rp>）</rp></ruby>：`A => 0`，`B => 1`，`C => 2`……`Z => 25`。  
2. 前一个转子存的<ruby><rb>值</rb><rp>（</rp><rt>value</rt><rp>）</rp></ruby>是后一个转子的<ruby><rb>键</rb><rp>（</rp><rt>key</rt><rp>）</rp></ruby>：有 `rotor[n][x]=y`，则 `rotor[n+1][y]=…`。  
3. 重复以上操作，直至到达反射板。  

```JavaScript
let current_key = param.toUpperCase().charCodeAt() - 65; // 接受参数 param 输入的字母
let next_key = Enigma.rotors[rotor_index][current_key];
```

### 反射板 Reflect 反射阶段

需要注意的是入射进来的时候是已经是<ruby><rb>值</rb><rp>（</rp><rt>value</rt><rp>）</rp></ruby>了，反射出去的时候也是<ruby><rb>值</rb><rp>（</rp><rt>value</rt><rp>）</rp></ruby>。  

not
: 因为我们要的又不是反射板的<ruby><rb>键</rb><rp>（</rp><rt>key</rt><rp>）</rp></ruby>，更何况反射板的<ruby><rb>键</rb><rp>（</rp><rt>key</rt><rp>）</rp></ruby>一定是（相邻）两两一组对应的。  

but
: 我们要的是反射板（这个数组）里记录下来（已经<ruby><rb>打乱</rb><rp>（</rp><rt>洗牌</rt><rp>）</rp></ruby>后）的<ruby><rb>值</rb><rp>（</rp><rt>value</rt><rp>）</rp></ruby>。  

```JavaScript
let index = Enigma.reflect.indexOf(input_value);
index % 2 === 0 ? index++ : index--;
return Enigma.reflect[index];
```

### 灯盘 Lampboard（反射回来的）输出阶段

由于反射过来的是<ruby><rb>值</rb><rp>（</rp><rt>value</rt><rp>）</rp></ruby>，所以要以<ruby><rb>值</rb><rp>（</rp><rt>value</rt><rp>）</rp></ruby>搜<ruby><rb>键</rb><rp>（</rp><rt>key</rt><rp>）</rp></ruby>，反射之后的整个输出阶段都是这样。  
一直倒推到第一个转子，最后从<ruby><rb>键</rb><rp>（</rp><rt>key</rt><rp>）</rp></ruby>变换为对应字母输出：`0 => A`，`1 => B`……`25 => Z`。  

```JavaScript
let the_value = param // 接受参数 param 经过反射后的值

// 开始倒推循环
let current_index = Enigma.rotors[rotor_index].indexOf(the_value);
let last_value = current_index; // 对当前的转子而言
the_value = last_value; // 开始计算前一个转子
// 重复以上操作直到抵达第一个转子 结束循环

// 此时 the_value = last_value
// 但 "第一个转子" 已经没有 "前一个转子" 了
// 所以此时 last_value = current_index 直接转换字母输出即可
return String.fromCharCode(current_index + 65); // 当前位于第一个转子
```

到这里所有基本功能都完成了，万事俱备，只欠东风。  

### 密码 Keys 设置转子初始状态

这部分是最关键的保密措施，可以视为恩格玛机的密码 / 密钥。  
所谓<ruby><rb>转子</rb><rp>（</rp><rt>rotor</rt><rp>）</rp></ruby>，顾名思义是可以转动的，密钥就是设置转子的**初始状态**。  

1. 定义 keys 数组，长度为转子数量：  

```JavaScript
Enigma.keys = new Array(this.rotors.length);
Enigma.keys.fill(0);
```

2. 设置偏移量：`let offset = key`  
3. 输入很简单：<code>(index + offset) % <ruby><rb>rotor_size</rb><rp>（</rp><rt>26</rt><rp>）</rp></ruby></code>  
4. 反射后的输出就稍微麻烦一点：  
    1. <code>(index - offset) % <ruby><rb>rotor_size</rb><rp>（</rp><rt>26</rt><rp>）</rp></ruby></code>  
    2. <code>+ <ruby><rb>rotor_size</rb><rp>（</rp><rt>26</rt><rp>）</rp></ruby></code> // 防止出现负数 `[index<0]` 溢出数组  
    3. 再次 <code>% <ruby><rb>rotor_size</rb><rp>（</rp><rt>26</rt><rp>）</rp></ruby></code> // 防止出现 `[index=0+length]` 溢出数组  
    4. 总结：`( (index - offset) % 26 + 26 ) % 26`  

画龙点睛成功，到这里一台最简单的恩格玛机就完成了。  

### 步进器 Stepper 设置转子自动步进

1. 定义 pins 数组，长度为转子数量：  

```JavaScript
Enigma.pins = new Array(this.rotors.length);
Enigma.pins.fill(0);
```

2. 疑难点在上一步已经解决了，直接加入偏移量就行：`let offset = key + pin`。  
3. 不过还要写一个加法器来控制步进。  

每次输入时，不是所有转子都在动，**同一时间只有一个转子动**。  
如果所有转子都动其实就只有 26 种可能，每次只动一个则是 26 \* 26 \* 26 = 17576（实际由于双重步进的原因会少一点）。所以其实是 26 进制的一个加法器，或者说是一个 26 进位的时钟，可以把它想象成一个刻度有且只有 26 刻的表。  

随便写的 for 循环实现：  
（需要注意的是要兼容溢出 `[25,25,25] + 1 = [0,0,0]` 达成无限循环）  

```JavaScript
Enigma.pins = [0, 0, 0];

Enigma.prototype._step = function () {
    for (let i = 0; i < this.pins.length; i++) {
        this.pins[i]++;
        if (this.pins[i] > this.rotorSize - 1) {
            this.pins[i] = 0;
            continue;
        } else {
            break;
        }
    }
}
```

到这里就已经成功复刻了一台完整的恩格玛机了，不过是商用版的。  

### 接线板 Plugboard 互换指定字母

军用版还加了这玩意，其实就是一条导线，插入时顶起了原本的触点，形成新的回路（通过这条导线）。效果很简单，就是交换指定的两个字母。  
算法上没什么神奇之处，但这个机械设计确实很妙。  
软件实现没什么好说的，另一个反射器，输入输出之前套一下就行了。  

## 效果

~~好耶~~，是我又爱又恨的测试环节。  
单元测试不说了，直接 e2e test。  

```JavaScript
/** e2e test */

let enigma = new Enigma();

let e2e_test = (sample = 0, mode = "default", debug = false) => {
    if (debug) enigma.enableDebug = true;
    const plain_text = ["abcdef", "ABCDDD", "aaaaaa", "Hello World", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    enigma.init(1, 2, 3);
    enigma.readOffset();
    console.log("********************************");
    if (mode === "step") {
        enigma.enableDebug = true;
        enigma.enableStepper = false;
        //enigma.init(0, 0, 0);
        let input = "A";
        let tmp = [enigma._input(input)];
        console.log(`[DEBUG] 1. _input()   ${input} => ${tmp[0]}`);
        tmp.push(enigma._reflect(tmp[0]));
        console.log(`[DEBUG] 2. _reflect() ${tmp[0]} => ${tmp[1]}`);
        tmp.push(enigma._output(tmp[1]));
        console.log(`[DEBUG] 3. _output()  ${tmp[1]} => ${tmp[2]}`);
        console.log("********************************");
        tmp.push(enigma._input(tmp[2]));
        console.log(`[DEBUG] 1. _input()   ${tmp[2]} => ${tmp[3]}`);
        tmp.push(enigma._reflect(tmp[3]));
        console.log(`[DEBUG] 2. _reflect() ${tmp[3]} => ${tmp[4]}`);
        tmp.push(enigma._output(tmp[4]));
        console.log(`[DEBUG] 3. _output()  ${tmp[4]} => ${tmp[5]}`);
        console.log("********************************");
        if (tmp.pop() === input.toLowerCase()) {
            console.info("[INFO] Result verified.")
            return true;
        } else {
            console.error("[ERROR] Unknown Error.")
            return false;
        }
    } else if (mode === "plugboard") {
        enigma.enableStepper = false;
        let plugboard = "CHSN";
        let input = plain_text[sample];
        let output = enigma.encode(input, true);
        enigma.setPlugboard(plugboard);
        enigma.readPlugboard();
        let output2 = enigma.encode(input, true);
        let restore = enigma.encode(output2, true);
        console.log("********************************");
        if (restore === input.toLowerCase()) {
            console.info("[INFO] Result verified.")
        } else {
            console.error("[ERROR] Unknown Error.")
            return false;
        }
        console.log("********************************");
        let change = "        "
        for (let i = 0; i < output.length; i++) {
            change += output[i] === output2[i] ? " " : "|";
        }
        console.info(`[INFO] [${input}]\n    => [${output}] no plugboard\n${change}\n    => [${output2}] enable plugboard`);
        return true;
    } else {
        let input = plain_text[sample];
        let output = enigma.encode(input, true);
        enigma.init(1, 2, 3);
        let restore = enigma.encode(output, true);
        console.log("********************************");
        if (restore === input.toLowerCase()) {
            console.info("[INFO] Result verified.")
            return true;
        } else {
            console.error("[ERROR] Unknown Error.")
            return false;
        }
    }
};

e2e_test();
```

### e2e_test()
```
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] Keys=[1,2,3] Pins=[0,0,0]
********************************
[INFO] [abcdef]
    => [yjebzx]
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] [yjebzx]
    => [abcdef]
********************************
[INFO] Result verified.
```

### e2e_test(1)
```
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] Keys=[1,2,3] Pins=[0,0,0]
********************************
[INFO] [ABCDDD]
    => [yjebly]
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] [yjebly]
    => [abcddd]
********************************
[INFO] Result verified.
```


### e2e_test(2)
```
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] Keys=[1,2,3] Pins=[0,0,0]
********************************
[INFO] [aaaaaa]
    => [ysifcj]
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] [ysifcj]
    => [aaaaaa]
********************************
[INFO] Result verified.
```


### e2e_test(3)
```
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] Keys=[1,2,3] Pins=[0,0,0]
********************************
[INFO] [Hello World]
    => [pnpcr ogttl]
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] [pnpcr ogttl]
    => [hello world]
********************************
[INFO] Result verified.
```


### e2e_test(4)
```
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] Keys=[1,2,3] Pins=[0,0,0]
********************************
[INFO] [ABCDEFGHIJKLMNOPQRSTUVWXYZ]
    => [yjebzxoyrmcaolwromkblezpnb]
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] [yjebzxoyrmcaolwromkblezpnb]
    => [abcdefghijklmnopqrstuvwxyz]
********************************
[INFO] Result verified.
```


### e2e_test(4, "step")
```
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] Keys=[1,2,3] Pins=[0,0,0]
********************************
[DEBUG] _input() for{} rotors[0][(0+1+0)%26=1] = 17
[DEBUG] _input() for{} rotors[1][(17+2+0)%26=19] = 17
[DEBUG] _input() for{} rotors[2][(17+3+0)%26=20] = 21
[DEBUG] 1. _input()   A => 21
[DEBUG] _reflect() lastRotor[20]=21 => lastRotor[0]=16
[DEBUG] 2. _reflect() 21 => 16
[DEBUG] _output() for{} rotors[2][(0-3-0)%26=23] = 16
[DEBUG] _output() for{} rotors[1][(11-2-0)%26=9] = 23
[DEBUG] _output() for{} rotors[0][(25-1-0)%26=24] = 9
[DEBUG] 3. _output()  16 => y
********************************
[DEBUG] _input() for{} rotors[0][(24+1+0)%26=25] = 9
[DEBUG] _input() for{} rotors[1][(9+2+0)%26=11] = 23
[DEBUG] _input() for{} rotors[2][(23+3+0)%26=0] = 16
[DEBUG] 1. _input()   y => 16
[DEBUG] _reflect() lastRotor[0]=16 => lastRotor[20]=21
[DEBUG] 2. _reflect() 16 => 21
[DEBUG] _output() for{} rotors[2][(20-3-0)%26=17] = 21
[DEBUG] _output() for{} rotors[1][(19-2-0)%26=17] = 17
[DEBUG] _output() for{} rotors[0][(1-1-0)%26=0] = 17
[DEBUG] 3. _output()  21 => a
********************************
[INFO] Result verified.
```


### e2e_test(4, "plugboard")
```
[INFO] Initialize succeed. Keys = 1,2,3
[INFO] Keys=[1,2,3] Pins=[0,0,0]
********************************
[INFO] [ABCDEFGHIJKLMNOPQRSTUVWXYZ]
    => [ytkigoepdxcwurfhznvbmsljaq]
[INFO] Plugboard = [C<=>H] [S<=>N]
[INFO] [ABCDEFGHIJKLMNOPQRSTUVWXYZ]
    => [ytpigoekdxhwuvfczsrbmnljaq]
[INFO] [ytpigoekdxhwuvfczsrbmnljaq]
    => [abcdefghijklmnopqrstuvwxyz]
********************************
[INFO] Result verified.
********************************
[INFO] [ABCDEFGHIJKLMNOPQRSTUVWXYZ]
    => [ytkigoepdxcwurfhznvbmsljaq] no plugboard
          |    |  |  | | ||  |
    => [ytpigoekdxhwuvfczsrbmnljaq] enable plugboard
```

![e2e_test_plugboard](https://i.loli.net/2021/11/04/cuQVYJhPdsMC2RA.png)

完结撒花。  
