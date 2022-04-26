---
title: "Markdown 语法简单指北"
date: 2020-07-29T15:23:06+08:00
tags: ["Markdown"]
toc: false
dropCap: true
smallCaps: true
---

> [灵感来源](https://themes.gohugo.io//theme/hugo-theme-meme/post/markdown-syntax/)

本篇文章提供了一些能在 Hugo 的 content 文件中使用的基本 Markdown 语法的简单示例，同时也展示了基础 HTML 元素在<ruby><rb>本 Hugo 主题</rb><rp>（</rp><rt>MemE</rt><rp>）</rp></ruby>中用 CSS 绘制后是什么效果。  

## 标题（←双关）

以下的 HTML `<h1>`—`<h6>` 元素表示六个级别的分节标题。  
`<h1>` 表示最顶级的标题，而 `<h6>` 表示最细分的一级。  

在 Markdown 语法中：  
标题一般简写为 `#`，比如 `# 这是一个完整的 Markdown 标题 #`。  
并且位于右边的关闭标签可以省略，比如 `# 这是一个简写的 Markdown 标题`。  

<h1>H1</h1>

```Markdown
<h1>H1</h1>
# H1 #
# H1
```

<h2>H2</h2>

```Markdown
<h2>H2</h2>
# H2 #
# H2
之后以此类推
```

<h3>H3</h3>

<h4>H4</h4>

<h5>H5</h5>

<h6>H6</h6>

## 段落
这种事情见得多了，我只想说懂得都懂，不懂的我也不多解释，毕竟自己知道就好，细细品吧。你们也别来问我怎么了，利益牵扯太大，说了对你我都没好处，当不知道就行了，其余的我只能说这里面水很深，牵扯到很多东西。详细情况你们自己是很难找的，网上大部分已经删除干净了，所以我只能说懂得都懂。懂的人已经基本都获利上岸什么的了，不懂的人永远不懂，关键懂的人都是自己悟的，你也不知道谁是懂的人也没法请教，大家都藏着掖着生怕别人知道自己懂事，懂了就能收割不懂的，你甚至都不知道自己不懂。只是在有些时候，某些人对某些事情不懂装懂，还以为别人不懂。其实自己才是不懂的，别人懂的够多了，不仅懂，还懂的超越了这个范围，但是某些不懂的人让这个懂的人完全教不懂，所以不懂的人永远不懂，只能不懂装懂，别人说懂的都懂，只要点点头就行了，懂了吗？

~~懂你吗呢~~谜语人必被我成都百特曼亲手杀害。

## 引用块

引用块元素表示从其他来源引用的内容，可以选择使用包含在 `footer` 或 `cite` 元素里的引文出处，还可以选择在行内使用复杂格式（比如注释或者缩写等等）。

### 不带出处的的引用块

> 人类的悲欢并不相通，我只觉得他们吵闹。  
> **注意** 你可以在引用块内使用 *Markdown 语法*。  

```Markdown
> 人类的悲欢并不相通，我只觉得他们吵闹。
> **注意** 你可以在引用块内使用 *Markdown 语法*。
```

### 带有出处的引用块

> 还是拉倒吧。  
> <cite>—— 鲁迅</cite>[^1]  

```Markdown
<blockquote>
  <p>还是拉倒吧。</p>
  <cite>—— 鲁迅</cite>
</blockquote>
```

## 表格

表格不是 Markdown 核心规范的一部分，但是 Hugo 支持开箱即用。

|Name|Gender|Age|
|-:|:-:|:-|
|Bob|male|27|
|Alice|female|23|

```Markdown
|Name|Gender|Age|
|-:|:-:|:-|
|Bob|male|27|
|Alice|female|23|
```

> 注意使用 `:` 标注**对齐**的话也会对**表头**生效。  

### 行内含有 Markdown 格式的表格

|Italics (表头默认居中)|Bold (表头被强制左对齐)|Code|
|-|:-|:-:|
|*Italics* (内容默认左对齐)|**Bold**|`Code`|

```Markdown
|Italics|Bold|Code|
|-|:-|:-:|
|*Italics*|**Bold**|`Code`|
```

## 代码块

### 带有行号和高亮的代码块

```HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```

### 啥都没有的代码块

```
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```

## 列表

### 有序列表

1. First Blood
2. First Blood 2
3. First Blood 3
4. First Blood 4
5. Rampage

```Markdown
1. First Blood
2. First Blood 2
3. First Blood 3
4. First Blood 4
5. Rampage
```

### 无序列表

* 闪烁匕首
* Eul 的神圣法杖
* 原力法杖

```Markdown
* 闪烁匕首
- Eul 的神圣法杖
+ 原力法杖
这三种格式都可以，但注意不能同时混用，如果混用算作不同的列表。
```

### 多级列表

* 物品法球
  - 支配头盔
  - 斯嘉蒂之眼
  - 漩涡
  - 黯灭
* 英雄法球
  + 冥界亚龙 - 毒性攻击
  + 沉默术士 - 智慧之刃
  + 敌法师 - 法力损毁

```Markdown
* 物品法球
  - 支配头盔
  - 斯嘉蒂之眼
  - 漩涡
  - 黯灭
* 英雄法球
  + 冥界亚龙 - 毒性攻击
  + 沉默术士 - 智慧之刃
  + 敌法师 - 法力损毁
```

## 其他元素 — abbr, sub, sup, kbd, mark, ruby

<abbr title="有一说一">u1s1</abbr> 是一种批话缩写。

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

按下 <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd> 呼出安全选项菜单，按下 <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>ESC</kbd> 直接打开任务管理器。

—— <mark>芷若</mark>，我对你一向敬重爱慕、心存感激，对<mark>殷家表妹</mark>是可怜她的遭遇、同情她的痴情，对<mark>小昭</mark>是意存怜惜、情不自禁的爱护，但对<mark>赵姑娘</mark>却是……却是铭心刻骨的相爱。

![敏敏](https://i.loli.net/2020/07/29/2JOETdDLhHcpNrI.png)

—— <ruby><rb>张无忌</rb><rp>（</rp><rt>tiě zhā nán</rt><rp>）</rp></ruby>，<ruby><rb>我爱你</rb><rp>（</rp><rt>c n m</rt><rp>）</rp></ruby>。

```Markdown
<abbr title="有一说一">u1s1</abbr> 是一种批话缩写。

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

按下 <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd> 呼出安全选项菜单，按下 <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>ESC</kbd> 直接打开任务管理器。

—— <mark>芷若</mark>，我对你一向敬重爱慕、心存感激，对<mark>殷家表妹</mark>是可怜她的遭遇、同情她的痴情，对<mark>小昭</mark>是意存怜惜、情不自禁的爱护，但对<mark>赵姑娘</mark>却是……却是铭心刻骨的相爱。

![敏敏](https://i.loli.net/2020/07/29/2JOETdDLhHcpNrI.png)

—— <ruby><rb>张无忌</rb><rp>（</rp><rt>tiě zhā nán</rt><rp>）</rp></ruby>，<ruby><rb>我爱你</rb><rp>（</rp><rt>c n m</rt><rp>）</rp></ruby>。
```

[^1]: 鲁迅《致杨霁云》 1934.12.13