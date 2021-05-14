---
title: "Git Commit Message 规范"
subTitle: "Conventional Commits"
date: 2020-10-28T19:10:36+08:00
tags: ["Git", "Github"]
series: ["Git"]
related: true
---

# Commit Message 规范
规范这种事一般是赢家通吃的，也没什么好标新立异的，好用就行了。   
基本上唯一的选择，约定式提交（Conventional Commits）规范。   
（本文写就时）最新的[文档](https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4/)。  

## 标准格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

## 类型 \<type\>
1. 当一个提交为实现了新特性时，必须使用 `feat` 类型。
2. 当一个提交为修复了 bug 时，必须使用 `fix` 类型。

### 原文
Select the type of change that you're committing:  

* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `perf`: A code change that improves performance
* `test`: Adding missing tests or correcting existing tests
* `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
* `chore`: Other changes that don't modify src or test files
* `revert`: Reverts a previous commit

### 翻译
本次修改是一个什么类型的 commit：  

* `feat`: 增加新功能
* `fix`: 修复 bug

上面这两种标签是固定的，以下都是根据 [Angular 约定](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) 推荐使用的标签：  

* `docs`: 文档改动
* `style`: 代码风格上的修改（对代码含义没有任何影响那种，比如空格、缩进、分号等）
* `refactor`: 重构（代码内容变了，但既没有新增功能也没有修 bug）
* `perf`: 性能优化
* `test`: 测试相关
* `build`: 构造工具以及外部依赖相关（比如 gulp, broccoli, npm）
* `ci`: CI 相关配置文件及脚本（比如 Travis, Circle, BrowserStack, SauceLabs）

其他常用的标签：  

* `improvement`: 对当前实现进行改进而没有新增功能或修复 bug 的提交
* `chore`: 其他没有提到的不会动源代码或者测试文件的改动
* `revert`: 撤销之前的 commit

## 作用域 \<scope\>
可选项。  
必须是名词。  
描述改动的范围，想了下如果涉及多个模块还是分多次提交比较好，方便代码版本追踪和维护。  

## 简述 \<subject\>
一句话，说重点。  
范式：  
* 动词开头，而且是第一人称一般现在时，`change` YES，`changed`/`changes` NO
* 首字母小写
* 结尾不用标点

总之就是把它当短语。  

## 正文 \<body\>
可选项。  
本次改动的详细描述，可以写：  
* 改动之前的情况
* 改动之后的效果
* 修改动机

## 脚注 \<footer\>
可选项。  
一般放的两类信息：  
* 如果是破坏性变更（break changes）要以 `BREAKING CHANGE` 开头然后指明弃置的内容
* 影响 issues

如果有破坏性变更，第一行 `:` 之前**可以**接上 `!` 提醒注意；但如果加了 `!`，`<body>` 或者 `<footer>` 内**必须**包含 `BREAKING CHANGE: description`。  

## 总结
以上范式不是定着好玩或者仅仅只是为了满足强迫症看着爽的。  
Conventional Commits 定出来除了约定俗成一看就懂以外，它真正 convenient 的地方在于如果坚持使用规范的话，可以直接根据 commit message 记录生成 changelog。  

## 相关工具
[Commitizen](https://github.com/commitizen/cz-cli)  
[PHP 版 Commitizen](https://github.com/damianopetrungaro/php-commitizen)  
[检查提交信息是否符合规范的工具](https://github.com/commitsar-app/commitsar) 用 Go 写的，支持在 CI 的 Docker 镜像中使用  