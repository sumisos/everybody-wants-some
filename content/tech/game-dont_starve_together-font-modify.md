---
title: "《饥荒联机版》修改游戏中文字体"
date: 2021-11-06T23:08:07+08:00
tags: ["饥荒", "Klei", "mod"]
series: ["生存游戏"]
related: true
---

## 起因

我是看到《[豪华船2.0！](https://www.bilibili.com/video/BV1bM4y1T7sJ)》这个视频里用的字体挺好康的，有被安利到。  
简单搜了一下应该是 <a href="https://weibo.com/6624339726" target="_blank">@孤鹜先森</a> 用爱发电的「<a href="https://github.com/lxgw/yozai-font" target="_blank"><ruby><rb>悠哉字体 Blod</rb><rp>（</rp><rt>Yozai-Bold</rt><rp>）</rp></ruby></a>」（可免费商用）。  
字体 GET！DAZE☆  

起初我想当然的以为饥荒游戏本体是使用的标准字体文件（`.ttf` / `.otf`），那么直接替换标准格式的字体文件就可以了，就像大部分的网游那样。  
结果定睛一看，发现事情并不简单。  

## 通用游戏汉化流程

先简单介绍一下「原本只有英语」的游戏汉化的过程：  
- 如果文本量很大，或者游戏需要支持「用户输入（中文）[^1]」这个功能，大部分时候会直接引入标准格式的字体文件，因为你没有办法预测~~沙雕玩家~~ 演出脚本会输入什么玩意。  
- 但如果文本量有限，（注意不止是民间汉化，哪怕是官方出的中文版）讲究[^2]的游戏开发者很可能会选择「更为节省性能的方式」引入中文字体。  

这种方式就是：提前绘制游戏内将用到的每一个字，放到同一个材质包（视为一张大图）里，另外建立一个索引文件（纯文本）标注出每个字在什么位置（比如第几行第几列偏移多少）。  
然后游戏里用到的时候根据索引去引入「该材质包指定位置的区域」，即「这个字」。  

> 在前端开发中，类似技巧也很常见。比如某个网站用到大量图标，是 SVG 的话还好；  
> 不是的话可能就要自己把所有图标打包到一张大图里，然后通过指定具体位置来引入了。  

这种方式的好处显而易见——**极度节省资源**。  
开发和使用两方面都节省，首先压缩了程序大小，其次最关键的是**加快了加载速度**。  
（减少文件 I/O 次数和频率，加载自然就快了。）  

当然了，还有些游戏（即便是英语）使用了独特的美术资源（比如 UI 界面 / HUD），此时不仅仅只是为了考虑性能，更可能是为了保证<ruby><rb>用户接口界面</rb><rp>（</rp><rt>User Interface</rt><rp>）</rp></ruby>**美术风格**的表现稳定和一致性。  

> 像这种情况，汉化人员也是先汉化，再重新绘制到这个地方，最后替换原本的图像素材的。  
> 说起来有点类似汉化组汉化漫画的嵌字工作。  

## 饥荒汉化

说回饥荒，这时我才想起一件事：  
1. 在上古时期，饥荒没有中文版的时候是要打汉化补丁\*的；  
2. 后来才做成了汉化 mod；  
3. 再后来才出了官方汉化。  

> \* 那时候左下角提示的 `正在加载...` 是汉化组的私货 `少女祈祷中...`。~~（兔子小姐！干活了！）~~  
> （甚至后来还有人真的改成 `少女折寿中...` 的版本。）  
> ~~老人~~ 车万厨已经是时代的眼泪了。~~什么，我也是啊，那没事了。~~  

而且早期汉化得不好的的地方会出现显示不出来的方块字，这显然意味着饥荒也是前面说的两种汉化方式中的后者——提前绘制汉字资源。  

于是我尝试重走一遍饥荒汉化组走过的老路。  
我先是找到了远古版本的汉化补丁，然后搜到了「[中文高清字体 mod](https://steamcommunity.com/sharedfiles/filedetails/?id=678340265)」的源码（从[另一个 mod](https://steamcommunity.com/sharedfiles/filedetails/?id=1947681600)得知其源码类似[这个仓库](https://github.com/jupitersh/dst-mod-chinese-font-ben-mo-you-yuan)）。  
二者的共同点显然是饥荒字体的结构：一个 `字体.zip` 压缩包文件，里面装了 `font.tex`（材质包文件）和 `font.fnt`（XML 格式的文字位置索引文件）。  
对比官方的字体\*也是这个套路，并没有涉及到什么复杂的编译过程，可行性很高。  

> \* 游戏本体的字体文件：`~\Steam\steamapps\common\Don't Starve Together\data\databundles\fonts.zip`  

最终结论很简单，我只要自行绘制一套 `font.tex` 直接代入字体替换 mod 的源码就可以了。  

## 解决方案

真的吗？  
显然那不是我这种懒狗的第一选择，在工作量未知且暂时无从下手的情况下我终于屈服了。  

### 第一次伸手

于是我私信询问了本文开头提到那个视频的 UP 主「[EYEBROWS\_](https://space.bilibili.com/248933949)」。  
他已经做到了，直接问他怎么做的不就完了，不知道你在倔什么。  

一周后我得到了回复，谢天谢地，我本人就是不看私信的人，大号一堆红点，很怕他也是。  
「EYEBROWS\_」同学告诉我**就是**用的「[辣椒小皇纸](https://steamcommunity.com/profiles/76561198204009267)\*」做的 mod……不是，这也能绕回来。  

> \* 「辣椒小皇纸」就是之前提到的字体替换系列 mod 和相关仓库的作者。  

怎么说呢，喜欢折腾饥荒 mod 的就这几个人是吧。  

### 第二次伸手

> 至于我之前在创意工坊里为什么没有直接搜到视频里的字体 mod；  
> 是因为这个字体 mod 只在他们的服务器上用了，没有发布到创意工坊。  

我联系到「辣椒小皇纸」之后他告诉我有一个软件可以制作，但软件叫什么名字他已经忘了。  

彳亍，知道有这个软件存在就够了。  
关键词「font」「.tex」，简单进行一个 gle 的 goo。  

### 自己动手丰衣足食

先是找到了「[Font Texture Generator Online](https://evanw.github.io/font-texture-generator/)」。  
它可以在线生成默认 Latin 字符集的材质，但无法**批量**支持其他字符集，肯定不是我想要的。  
但好处是获得了一个新的信息：既然 `.tex` 是 `texture`（材质、纹理）的缩写，我为什么一定要搜索缩略名「.tex」而不是关键词「texture」呢？  

然后我找到了「[BitmapFonts](https://github.com/ianhan/BitmapFonts)」这个 Github 仓库，里面是各种现成的 Latin 字符集材质图。  
好东西，虽然我做纯英语游戏的可能性微乎其微吧，但万一什么时候在奇怪的地方用到了呢。  
开发这种事，很难讲的。已收藏，虽然对我当前的目标没什么显著帮助就是了。  
不过好处是我又学到一个新词，原来这种 `XML` 索引的字符集纹理图叫做「bitmap font」。  

于是终于找到了，「[Bitmap Font Generator](http://www.angelcode.com/products/bmfont/)」，也就是江湖人称的 `BMFont`。  

> 下完用 Everything 一搜才发现原来我电脑上有这玩意，看目录是以前玩 Cocos2d 留下的。  
> 前略……百度。蓦然回首，那人却在，灯火阑珊处。[^3]  

简单把玩了一会，学会「如何将特定字符集以特定字体生成 `.fnt` 对应的 `.png` 纹理材质」了。  

现在只剩下两件事：  
1. [ ] 只取需要的字符集（可以抄作业，前面提到的字体 mod 里可以解包出 `.fnt`）。  
2. [ ] 把生成的 `.png` 转换成 `.tex`。  
3. [x] 剩下的就简单了，复制粘贴就是。  

## Do It Yourself

### 根据 `old.fnt` 文件生成对应字库（`new.fnt` 和 `new.png`）

我起初以为「Bitmap Font Generator」的「Edit」菜单中的「Select chars from file」是读取另一个 `.fnt` 文件，心想这也太轻松了吧。  
导入之后发现怎么只导入了 128 个字符，还有 138 个字库缺失的。等等，就算没缺也不对啊。  
用文本编辑器打开字体 mod 的 `font.fnt`（其实就是 XML 格式的文本文档）写得清清楚楚：  
`<chars count="6962">`，老子还有 6000 多个字符呢？  

一搜才知道它这个「导入」是导入一个文本文档，里面写的是「要用到的字」。  
我第一反应人傻掉了，难道只能 OCR？识别率感人啊，难道还要人工校对？什么编辑地狱。  
然后一拍脑门，`font.fnt` 不是 XML 格式吗？里面不是写了字符 ID（ASCII 码）吗？  

考虑到万一以后可能还要做别的字体，而且「Bitmap Font Generator」支持命令行，那就自动化吧。唯一需要注意的一点是「Bitmap Font Generator」的导入功能只认 `UTF-8-BOM`。  
敲黑板，注意了，**必须是带 BOM 的** UTF-8 编码。~~有点反人类啊，你跟微软什么关系。~~  

还有我实在不想写 PowerShell 了，真的折磨，这次用 Python 算了，换换口味。  

```Python
import os
from time import perf_counter
from xml.dom.minidom import parse

ROOT = os.path.split(os.path.realpath(__file__))[0]
WORKSPCAE = os.path.join(ROOT, "workspace")

CONFIG = {
    "PATH": {
        "TEMPLATE_FNT": [os.path.join(ROOT, "material", "normal\\font.fnt"), os.path.join(ROOT, "material", "normal_outline\\font.fnt")],
        "BMFG": os.path.join(ROOT, "tools", "bmfont1.14a\\bmfont64.exe"),
        "CONF": [os.path.join(ROOT, "tools", "bmfont1.14a\\dst_font_mod_normal.bmfc"), os.path.join(ROOT, "tools", "bmfont1.14a\\dst_font_mod_normal_outline.bmfc")],
        "CHARSET": os.path.join(WORKSPCAE, "charset.txt"),
        "OUTPUT": [os.path.join(WORKSPCAE, "normal\\font.fnt"), os.path.join(WORKSPCAE, "normal_outline\\font.fnt")],
        "IMAGE": [os.path.join(WORKSPCAE, "normal\\font_0.png"), os.path.join(WORKSPCAE, "normal_outline\\font_0.png")],
        "MOD": ""
    }
}


def check_file(file_path):
    if os.path.exists(file_path):
        return True
    return False


def delete_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)
        return True
    return False


def read_from_file(file_path):
    try:
        with open(file_path, "r") as f:
            return f.readlines()
    except Exception as e:
        print("文件读取失败: %s" % e)
        return None


def write_to_file(file_path, content):
    delete_file(file_path)
    try:
        with open(file_path, "w", encoding="utf-8-sig") as f:
            f.write(content)
    except Exception as e:
        print("文件写入失败: %s" % e)


def create_copy(file_path):
    try:
        with open(file_path, 'r') as f:
            source = f.read()
        tmp_path = os.path.join(WORKSPCAE, "tmp.xml")
        with open(tmp_path, 'w', encoding='utf-8') as f:
            f.write(source)
        print(f'Converting "{file_path}" to UTF-8.')
        return tmp_path
    except Exception as e:
        print("转换编码失败: %s" % e)
        return None


def popen(cmd, mode="r", buffering=-1):
    if not isinstance(cmd, str):
        raise TypeError("invalid cmd type (%s, expected string)" % type(cmd))
    elif mode not in ("r", "w"):
        raise ValueError("invalid mode %r" % mode)
    elif buffering == 0 or buffering is None:
        raise ValueError("popen() does not support unbuffered streams")
    import subprocess
    import io
    if mode == "r":
        proc = subprocess.Popen(cmd,
                                shell=True,
                                stdout=subprocess.PIPE,
                                bufsize=buffering)
        std_out, std_err = proc.communicate()
        if std_err is None:
            return std_out.decode('ascii')
        return std_err
    else:
        proc = subprocess.Popen(cmd,
                                shell=True,
                                stdin=subprocess.PIPE,
                                bufsize=buffering)
        return (io.BufferedReader(proc.stdin), proc)


def generate_charset(fnt_file=CONFIG["PATH"]["TEMPLATE_FNT"][0]):
    print("Generating charset.")
    if check_file(fnt_file):
        print(f'Reading "{fnt_file}".')
    else:
        print(f'file "{fnt_file}" not found!')
        return False
    tmp_file = create_copy(fnt_file)
    DOMTree = parse(tmp_file)
    delete_file(tmp_file)
    collection = DOMTree.documentElement
    chars = collection.getElementsByTagName("char")
    charset = ""
    for char in chars:
        charset += chr(int(char.getAttribute('id')))
    print(f"Got {len(charset)}(count) chars.\n")
    output_file = CONFIG["PATH"]["CHARSET"]
    write_to_file(output_file, charset)
    return True


def generate_fnt(index=0):
    delete_file(CONFIG["PATH"]["OUTPUT"][index])
    delete_file(CONFIG["PATH"]["IMAGE"][index])
    print(f'Start generate "{CONFIG["PATH"]["OUTPUT"][index]}".')
    cmd = f'{CONFIG["PATH"]["BMFG"]} -c "{CONFIG["PATH"]["CONF"][index]}" -t "{CONFIG["PATH"]["CHARSET"]}" -o "{CONFIG["PATH"]["OUTPUT"][index]}"'
    res = popen(cmd)
    print(res)


def process():
    if generate_charset(CONFIG["PATH"]["TEMPLATE_FNT"][1]):
        generate_fnt(0)
        generate_fnt(1)
        print('View "http://www.angelcode.com/products/bmfont/doc/file_format.html" for more details.')


if __name__ == "__main__":
    start = perf_counter()
    process()
    elapsed = perf_counter() - start
    print(f"Cost {elapsed} s.")
```

拿到**两组** `font.fnt` / `font.tex`（有一组 outline），发现新生成的 `font.fnt` 比原本的字符集少了一部分字，看了下大概是一些基本上用不到的生僻字，常用字都在，无伤大雅，就这样吧。  
配置文件随便写写差不多得了，先跑通最重要。  

跑通了之后可以再慢慢调教，要是根本就无法实现还搁那抠细枝末节，不是抛媚眼给瞎子看吗。  
开发中分清主次很重要，经过无数的毒打之后，连我这种强迫症晚期都学会了这个道理。  

### 将生成的 `new.png` 纹理图转换为 `new.tex` 材质

前往 [Klei 官方论坛 mod 板块](https://forums.kleientertainment.com/files/category/5-modding-tools-tutorials-examples/) 寻找有没有现成的工具，找到了 [ktools](https://forums.kleientertainment.com/files/file/583-ktools-cross-platform-modding-tools-for-dont-starve/)（[源码](https://github.com/nsimplex/ktools)）。  
试过了没问题，加入上面的脚本：  
```Python
def generate_tex(index=0):
    print("Generating texture.")
    if check_file(CONFIG["PATH"]["OUTPUT"][index]) and check_file(CONFIG["PATH"]["IMAGE"][index]):
        cmd = f'{CONFIG["PATH"]["KTOOLS"]} "{CONFIG["PATH"]["IMAGE"][index]}" "{CONFIG["PATH"]["TEXTURE"][index]}"'
        print(popen(cmd))
        return True
    else:
        return False
```

### 将 `new.fnt` 和 `new.tex` 打包成 `new.zip` 替换原 mod（中的 `old.zip`）

将生成的 `font.fnt` 和 `font.tex` 打包成 zip 放到游戏本体的 mod 对应目录  
`~\Steam\steamapps\common\Don't Starve Together\mods\font_modify\fonts` 里。  

> `font_modify` 这个文件夹就是之前提到的 [仓库](https://github.com/jupitersh/dst-mod-chinese-font-ben-mo-you-yuan)，lua 源码（`modmain.lua`）有空再看。  
> 毕竟是从零开始，折腾到能用我就已经很满意了。  

并在 mod 配置文件 `~\Steam\steamapps\common\Don't Starve Together\mods\modsettings.lua` 中启用：  
```Lua
ForceEnableMod("font_modify")
```

启动游戏。  

![登录界面](https://i.loli.net/2021/11/19/p6jGmkntFrw9XgU.png)

![菜单界面](https://i.loli.net/2021/11/19/Enp2HJjfD3OveMk.png)

好耶，成功了！  

背景不透明和部分文字黑块是「Bitmap Font Generator」设置的问题，慢慢调教就是了。  

将「压缩」和「移动材质包到 mod 目录下」加入自动化：  
```Python
def make_zip(index=0, clear=False):
    if index == 0:
        zip_path = 'normal.zip'
    else:
        zip_path = 'normal_outline.zip'
    print(f'Zipping "{zip_path}".')
    try:
        os.chdir(WORKSPCAE[index+1])
        with zipfile.ZipFile(zip_path, mode="a") as f:
            file_list = os.walk('./')
            for i in file_list:
                for item in i[2]:
                    if item != zip_path:
                        f.write(item)
            f.close()
    except Exception as e:
        print(f"打包失败: {e}")
    if clear and check_file(zip_path):
        delete_file(CONFIG["PATH"]["OUTPUT"][index])
        delete_file(CONFIG["PATH"]["TEXTURE"][index])
    shutil.move(
        CONFIG["PATH"]["ZIP"][index],
        f'{CONFIG["PATH"]["MOD"][index]}'
    )


def process():
    if generate_charset(CONFIG["PATH"]["TEMPLATE_FNT"][1]):
        generate_fnt(0)
        generate_fnt(1)
        print('View "http://www.angelcode.com/products/bmfont/doc/file_format.html" for more details.\n')
        if generate_tex(0) and generate_tex(1):
            delete_file(CONFIG["PATH"]["IMAGE"][0])
            delete_file(CONFIG["PATH"]["IMAGE"][1])
            print("Generating texture success.\n")
            print("Packing resource.")
            make_zip(0)
            make_zip(1)
            print("Packing resource success.\n")
```

## 附录：适配饥荒字体的 Bitmap Font Generator 配置

`normal` 配置，透明背景。  
```
# AngelCode Bitmap Font Generator configuration file
fileVersion=1

# font settings
fontName=悠哉字体
fontFile=
charSet=0
fontSize=60
aa=1
scaleH=100
useSmoothing=1
isBold=0
isItalic=0
useUnicode=1
disableBoxChars=1
outputInvalidCharGlyph=0
dontIncludeKerningPairs=0
useHinting=1
renderFromOutline=0
useClearType=1
autoFitNumPages=0
autoFitFontSizeMin=0
autoFitFontSizeMax=0

# character alignment
paddingDown=3
paddingUp=3
paddingRight=3
paddingLeft=3
spacingHoriz=2
spacingVert=2
useFixedHeight=0
forceZero=0
widthPaddingFactor=0.00

# output file
outWidth=4096
outHeight=8192
outBitDepth=32
fontDescFormat=1
fourChnlPacked=0
textureFormat=png
textureCompression=0
alphaChnl=0
redChnl=4
greenChnl=4
blueChnl=4
invA=0
invR=0
invG=0
invB=0

# outline
outlineThickness=0

# selected chars


# imported icon images
```

`normal_outline` 配置，透明背景 + **描边**。  
```
# AngelCode Bitmap Font Generator configuration file
fileVersion=1

# font settings
fontName=悠哉字体
fontFile=
charSet=0
fontSize=60
aa=1
scaleH=100
useSmoothing=1
isBold=0
isItalic=0
useUnicode=1
disableBoxChars=1
outputInvalidCharGlyph=0
dontIncludeKerningPairs=0
useHinting=1
renderFromOutline=0
useClearType=1
autoFitNumPages=0
autoFitFontSizeMin=0
autoFitFontSizeMax=0

# character alignment
paddingDown=3
paddingUp=3
paddingRight=3
paddingLeft=3
spacingHoriz=2
spacingVert=2
useFixedHeight=0
forceZero=0
widthPaddingFactor=0.00

# output file
outWidth=4096
outHeight=8192
outBitDepth=32
fontDescFormat=1
fourChnlPacked=0
textureFormat=png
textureCompression=0
alphaChnl=1
redChnl=0
greenChnl=0
blueChnl=0
invA=0
invR=0
invG=0
invB=0

# outline
outlineThickness=3

# selected chars
chars=0-7,10-12,14-126

# imported icon images
```

![修复后的登录界面](https://i.loli.net/2021/11/19/beDOz5hkY2tjXuU.png)

![修复后的菜单界面](https://i.loli.net/2021/11/19/RWgsUleQJ7S59hA.png)

> 注意右边 banner 的文字显黑是**阴影**（背景透明），之前是**色块**（背景不透明）。  
> 重点在于「Export options（快捷键 <kbd>T</kbd>）」设置「Bit depth」为 32 位，8 位没办法透明。  

Happy ending，从两眼一抹黑开始努力一步一步达成自己的祈愿，这种成就感还是蛮不错的。  

> 优化 Todo List:
> - [ ] 分析 `modmain.lua` 的实现，并重构一遍  
> - [ ] 根据官方的 `font.zip` 重新生成字符集，把字库压缩到最小  
> - [ ] 发布到创意工坊  

<img src="https://i.loli.net/2021/11/11/jFbUQz6hypDP2Lv.png" title="TODO" data-sticker />

[^1]: 早年间，游戏机还大行其道的时候，大部分 GBA 的 RPG 游戏起名环节都是只给出一张表，里面是最多几页字库里已经包含的字，让你从其中选，汉化之后也是这样。  
    这是硬件机能和操作便捷性上双重的限制，像 PSP / NDS / Switch 那样内置输入法？做梦呢。  
    FC 就更不用说了，其实 FC 上的 RPG 少得可怜；而其他需要输入文字的地方，比如通关密码和游戏秘籍，一般都是字母和数字，最多加个五十音表。怎么样，有印象了吗。  
    「GBA 和 FC 是什么？」打扰了。~~妈的我是真的没想到有一天这也能当成科普知识讲。~~  
[^2]: 如果没那么讲究，比方说很多 RPG Maker 开发者（不是开地图炮，确实我用身边统计学发现有这个现象），比如很多 RPG MV 做的~~黄油~~ 小游戏，游戏本体可能就十几 MB 几十 MB，但字体文件就占了几 MB。~~这种情况我见得多了~~  
[^3]: ——〔宋〕辛弃疾《青玉案·元夕》  
