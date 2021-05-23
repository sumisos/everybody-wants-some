---
title: "Sublime & VSCode 配置删除行尾空格"
subTitle: "不要乱动老子的空格"
date: 2021-05-23T14:08:11+08:00
tags: ["Markdown", "Sublime", "VSCode"]
series: ["Markdown"]
related: true
---

不管是程序员还是其他的文字工作者，大家都是 coder，叫一声码农没错吧。  
基本上所有码农，在~~码字~~ 文本编辑过程中都会遇到一个问题：空格。  
不管是轻量的编辑器，还是沉重的 IDE，空格总是无处不在，给排版工作带来巨大的负担。  
但我们没办法否定的是，空格同时也对排版起到了至关重要的作用。  
那么问题就变成了  

<h1>如何降服空格</h1>

我最喜欢的两个文本编辑器 Sublime Text / Visual Studio Code\* 都有这个功能，我相信大部分认真做的编辑器都会有这个功能的。  

> \* VSCode 当然是编辑器，VSCode 是 IDE 那 VS 是什么。  

## 自动去除行尾多余的空格
### Sublime Text 3
菜单栏：`Preferences` - `Settings`，在右边（自定义配置）新增一行：  
```json
{
    // 前略  理论上 JSON 是不能写注释的 知道这个意思就好
    "trim_trailing_white_space_on_save": true,
}
```

### Visual Studio Code
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>，输入 `Preferences: Open Settings (JSON)` 打开配置文件 `settings.json`：  
```json
{
    // 前略
    "files.trimTrailingWhitespace": true,
}
```

## 不要自动去除行尾多余的空格
配置好正常用起来当然是很爽的，然后开始写 Markdown，感受到绝望\*了吗。  

> \* Markdown 以行尾两个空格 `__` 作为换行符（软回车）。  
> 
> * 硬回车：换行并换段  
> * 软回车：只换行，**不换段**  

本来辛辛苦苦分好的段落，一保存文件全没了。  

怎么办呢，那当然也是有解决办法的。  

### Sublime Text 3
安装 [TrailingSpaces](https://github.com/SublimeText/TrailingSpaces) 插件，并把之前配置的 `trim_trailing_white_space_on_save` 删掉。  

菜单栏：`Preferences` - `Package Settings` - `Trailing Spaces` - `Settings`，  
在右边（自定义配置）新增一行：  
```json
{
    "trim_on_save": true,
}
```

保存文件时仍然会自动去除行尾空格，但 `.md` 格式的文件不会了。  

### Visual Studio Code
仍然打开配置文件 `settings.json`，改成：  
```json
{
    // 前略
    "files.trimTrailingWhitespace": true,
    "markdown.preview.breaks": true,
    "[markdown]": {
        "files.trimTrailingWhitespace": false
    },
}
```

舒服了。  
