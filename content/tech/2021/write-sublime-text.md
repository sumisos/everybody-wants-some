---
title: "Sublime Text 插件推荐"
date: 2021-08-11T15:08:17+08:00
tags: ["Sublime"]
series: ["Markdown"]
related: true
---

## 数据无价，谨慎操作

重装电脑之前急着要用，自认为数据容灾工作做得还可以，感觉没什么可备份的。  
重装完才发现问题还是挺多的。  

没问题的：  
1. 客户端本质就是个套壳浏览器，因此自带**云端同步**的还好，例如 Notion、Postman 之类。  
2. 配置及数据存储在**安装目录**，而且软件**没有**安在 **C 盘**的\*，包括大部分「解压即用」的（即所谓的「绿色版」）。  

> \* 这里点名表扬 Xshell，各种 SSH-Key 我是（弱智）真的忘了备份，如果丢了就炸了，幸好还在。  

有问题的：  
1. 数据存储在 `%APPDATA%` 的，这个就多了。当然这个是我自己的问题，我的 %APPDATA% 太大 / 小文件太多太碎了，简单瞄了两眼感觉没啥特别重要的，就懒得备份直接放弃了。  
2. 配置及数据存储在**安装目录**，然而软件又安在 **C 盘**的，比如 Sublime Text。  

## 安装
[![](https://img.shields.io/badge/Sublime_Text_4-Build_4113-blue)](http://www.sublimetext.com/download)  

## 安装插件
### Package Control
必首装，插件管理器 [Package Control](https://packagecontrol.io/installation)。  
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 打开命令面板，输入 `Install Package Control` 回车。  

安装其他插件：  
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 打开命令面板，输入 `install` 并选择 `Package Control: Install Package` 回车，继续输入插件名回车即可自动安装。  

卸载插件：  
前略，`Package Control: Remove Package`，后略。  

### Alignment
[![](https://img.shields.io/badge/Alignment-v2.1.0-blue)](https://packagecontrol.io/packages/Alignment)  
自动对齐等号 `=`。  
默认快捷键为（选中要处理的区域后）<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd>。  

### BeyondCompare
[![](https://img.shields.io/badge/BeyondCompare-v2.0.5-blue)](https://packagecontrol.io/packages/BeyondCompare)  
一键调起 Beyond Compare。  
需要提前安装好 Beyond Compare，并配置好路径：  
```JSON
{
    "beyond_compare_path": "D:/Program/Beyond Compare 4/BCompare.exe"
}
```
右键选择 BeyondCompare（默认快捷键 <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>D</kbd>）即可直接打开 Beyond Compare。  

#### 为什么要用 Beyond Compare
其实一般的文本比较可以使用轻度插件 [FileDiffs](https://packagecontrol.io/packages/FileDiffs)，或者别的桌面端生产力小工具，网页版也一搜一大堆，甚至 `git diff` 都行。  
但有些**大文件**就是要**频繁** **高强度**比较，就是要上 Beyond Compare，这个是刚需。  
此时本插件就派上用场了，免去了启动 Beyond Compare 后还要慢慢手动选定文件的麻烦。  

### BracketHighlighter
[![](https://img.shields.io/badge/BracketHighlighter-v2.29.2-blue)](https://packagecontrol.io/packages/BracketHighlighter)  
开闭符号（`[]`, `()`, `{}`, `""`, `''`, `<tag></tag>`）高亮匹配。  
如果你正在回调地狱饱受折磨，这个插件能在一定程度上救你一命。  

```JavaScript
fs.readFile('./sample.txt', 'utf-8', (err, content) => {
    let keyword = content.substring(0, 5);
    db.find(`select * from sample where kw = ${keyword}`, (err, res) => {
        get(`/sampleget?count=${res.length}`, data => {
           console.log(data);
        });
    });
});
```

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Balls</title>
  <style>
    .ball {
      width: 40px;
      height: 40px;
      margin-bottom: 5px;
      border-radius: 20px;
    }
    .ball1 {
      background: red;
    }
    .ball2 {
      background: blue;
    }
    .ball3 {
      background: yellow;
    }
  </style>
</head>
<body>
  <div class="ball ball1" style="margin-left: 0"></div>
  <div class="ball ball2" style="margin-left: 0"></div>
  <div class="ball ball3" style="margin-left: 0"></div>
  <script>
    let ball1 = document.querySelector(".ball1");
    let ball2 = document.querySelector(".ball2");
    let ball3 = document.querySelector(".ball3");
    function animate(ball, left, callback) {
      setTimeout(function () {
        let marginLeft = parseInt(ball.style.marginLeft, 10);
        if (marginLeft === left) {
          callback && callback();
        } else {
          if (marginLeft < left) {
            marginLeft += 2;
          } else {
            marginLeft -= 2;
          }
          ball.style.marginLeft = marginLeft + "px";
          animate(ball, left, callback);
        }
      }, 13);
    }
    animate(ball1, 100, function () {
      animate(ball2, 200, function () {
        animate(ball3, 300, function () {
          animate(ball1, 200, function () {
            animate(ball3, 200, function () {
              animate(ball2, 180, function () {
                animate(ball2, 220, function () {
                  animate(ball2, 200, function () {
                    console.log("over");
                  })
                })
              })
            })
          })
        })
      })
    });
  </script>
</body>
</html>
```

简单写个 vue：  
* `)`？`}`？`})`？`})})`？我要加一个可选参数，加在哪个括号后面？  
* 结尾用什么？加 `,`？还是加 `;`？  
* 什么时候可以加？什么时候可以不加？  
* 什么时候必须加？什么时候不能加？  

> ts 大法好，早转保平安。  

### DocBlockr
[![](https://img.shields.io/badge/DocBlockr-v2.14.1-blue)](https://packagecontrol.io/packages/DocBlockr)  
`/**` 自动生成函数注释。  

### Emmet
[![](https://img.shields.io/badge/Emmet-v2.3.3-blue)](https://packagecontrol.io/packages/Emmet)  
神仙插件，`ul#nav>li.item$*4>a{Item $}` 按下 <kbd>Tab</kbd> 见证奇迹。  
具体用法参看 [官方文档](https://docs.emmet.io/)。  

### MarkDownEditing
[![](https://img.shields.io/badge/MarkDownEditing-v2.2.10-blue)](https://packagecontrol.io/packages/MarkDownEditing)  
更好的 Markdown 显示。  

### TrailingSpaces
[![](https://img.shields.io/badge/TrailingSpaces-v1.3.5-blue)](https://packagecontrol.io/packages/TrailingSpaces)  
多余空格的**高亮显示**以及**更智能的自动清除**。  

> Q：你不会 `"trim_trailing_white_space_on_save": "not_on_caret"` 吗，一行代码就设置好的，还专门安个插件。  
> A：我确实不会，详见《<a href="/tech/write-do-not-trailing-spaces/" target="_blank">Sublime & VSCode 配置删除行尾空格</a>》。  

### ConvertToUTF8
[![](https://img.shields.io/badge/ConvertToUTF8-v1.2.14-blue)](https://packagecontrol.io/packages/ConvertToUTF8)  
自动文本编码转换为 UTF-8，支持汉语及汉语衍生语系：  
* 简体中文（GBK / GB18030 / GB2312）
* 繁體中文（BIG5）
* 日本語（Shift_JIS / EUC-JP / CP932）
* 한국어（EUC-KR）
* 以及其他所有 [Python 支持的编码](http://docs.python.org/library/codecs.html#standard-encodings)

### SFTP
[![](https://img.shields.io/badge/SFTP-v1.15.0-blue)](https://packagecontrol.io/packages/SFTP)  
顾名思义。  

#### 个人玩法
我的私人文档和本地版博客（以供开发调试）是跑在局域网下另一台树莓派上的。  
技术栈：Markdown 写，Git 做版本控制，Hugo 渲染。  
软件：正经写长文还是 Typora，小修小补 Sublime（Typora 的启动速度是真的慢得离谱）。  
配合本插件（SFTP）可以做到改完 <kbd>Ctrl</kbd> + <kbd>S</kbd> 都不用按直接切到浏览器，一秒内出效果\*。  

##### 原理
1. Sublime Text 设置「失焦时自动保存（`save_on_focus_lost`）」
2. SFTP 设置「保存时自动上传（`upload_on_save`）」
3. 修改后通过 SFTP 上传新文件覆盖树莓派上的旧版本
4. 树莓派的 Hugo 通过 `--watch` 参数（`hugo server` 默认启用）监听文件变动即时重载

到这里自动化程度已经非常高了，但仍然要 F5 刷新才能看到效果。  
因为已经打开的网页是下载到本地的，理论上已经加载**完毕**，服务器上再怎么变都和你（已经打开的网页）没关系了。  

通过常识我们得知，网页局部刷新（动态加载）当然是可以做到的：  
1. 要么加载完的网页无限轮询服务器接口，一旦查询到新数据就立刻下载并进行重新渲染。  
2. 要么加载完的网页直接与服务器建立长连接。  

巧了，Hugo 刚好内置了第二个黑科技。  
每个页面成功加载后都会和服务器建立 websocket 长连接。  
前面提到监听文件变动即时重载，一旦站点重新构建完成，它就会告诉浏览器上已经加载完成的 `http://192.168.x.x:[port]/livereload.js` 热重载。  

Hugo 真正牛批的地方在于它的构建速度，快到几乎无感，完全吊打 Hexo。  
就算不上 SFTP，`hugo server` 本地调试也能窥见一斑，双屏幕一边浏览器一边编辑器的话，不用离开编辑器，只要保存就可以看到另一边实时生效的效果。  
那叫一个丝滑，体验拉了同类竞品一大截。  

### 代码格式化
我是基本不用 Sublime 写业务的，哪怕是前端（VSCode Prettier 了解一下）。  
就跨语言看源码，或者小修小补才会用，只求快，要的就是一个速度。  
说白了就是我完全当成记事本在用。  
所以没有推荐类似插件，有需求请自行查找。  
