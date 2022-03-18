---
title: "Re:从零开始的博客生涯 #2 Git"
subTitle: "引入 Git 版本管理"
date: 2021-05-14T15:56:50+08:00
tags: ["Blog", "Hugo", "Git"]
series: ["ews.ink"]
related: true
mermaid: true
---

<a href="https://git-scm.com/downloads"><img src="https://img.shields.io/badge/git_version-v2.31.1-blue.svg?logo=git&logoColor=fff" alt="Git Verion" data-sticker /></a>

## 准备 Git
### 配置 Git 代理
```PowerShell
$ git config --global http.proxy 'socks5://127.0.0.1:10808'
```

### 升级 Git
```PowerShell
$ git update-git-for-windows
```

### 配置别名

```PowerShell
$ git config --global alias.st status
$ git config --global alias.co checkout
$ git config --global alias.ci commit
$ git config --global alias.br branch
$ git config --global alias.unstage 'reset HEAD'
$ git config --global alias.last 'log -1'
$ git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

## 关联本地和远程的仓库
> 本地已经准备好一个 Hugo 项目。

Github 新建仓库，本地进入项目目录：  

```PowerShell
$ git init
$ git add .
$ git commit -m "build: Initialize Hugo project"
$ git branch -M main
$ git remote add origin git@github.com:[username]/[reponame].git
$ git push -u origin main
```

> 注意自行替换 Github 用户名 `username` 及 仓库名 `reponame`。  

## 分支管理
### 使用分支
```PowerShell
$ git checkout -b writing
# 进行写作
$ git add .
$ git commit -m "..."
$ git push -u origin writing
```

> 如果有新手看的话，commit 提交的 message 格式建议参考我另一篇博文《[Git Commit Message 规范](/tech/git-commit-message)》。好习惯要从娃娃抓起。  

### 合并分支（Merge Branch）

<div class="mermaid" align="center">
gitGraph:
options
{
    "nodeSpacing": 110,
    "nodeRadius": 9
}
end
commit
commit
branch newbranch
checkout newbranch
commit
checkout master
commit
checkout newbranch
commit
checkout master
merge newbranch
</div>

> [mermaid](https://mermaid-js.github.io/mermaid/#/) 的 Git 分支树还在实验阶段，没什么可玩的，只能图一乐。  

一般使用分支的情况：  
```shell
$ git checkout -b feature
```

```
            D -- E -- F  feature
           /
A -- B -- C  main
```

`feature` 开发完成，我想合并到 `main` 怎么办？  

#### 普通 Merge（默认使用 Fast forward）
```shell
$ git checkout main
$ git merge feature
```

```
            D -- E -- F  feature
           /             main
A -- B -- C
```

```shell
$ git log --graph --pretty=oneline --abbrev-commit
# main: A -> B -> C -> D -> E -> F
# feature: D -> E -> F
```

#### 禁用 Fast forward 的 Merge
```shell
$ git checkout main
$ git merge feature --no-ff
```

```
            D -- E -- F  feature
           /           \
A -- B -- C ----------- G  main
```

> 注意：`G` 是一个船新版本（merge 时单独创建一个版本再合并）。  

```shell
$ git log --graph --pretty=oneline --abbrev-commit
# main: A -> B -> C -> G  注意结合上一节观察区别
# feature: D -> E -> F
```

#### 总结
这样就很好理解了吧，实际使用中最显著的区别就是如果是**禁用** `Fast forward` 的 merge，`main` 分支回滚上一个版本会回到 `C` 而不是 `E`。  

也就是说 `--no-ff` 可以**隐藏被合并分支中的提交历史**，如果不想让开发 `被合并分支` 时产生的细碎 commit 扰乱 `主分支` 的提交历史就可以用。  
但如果想在主分支上管理**每一个** commit，直接 merge 就好了。  

另外，如果想忽略**任何**细碎的提交历史，即专注于主分支，直接根本完全 totally 不 care 其他分支，就要用到神奇的变基（`rebase`）[^1]了，懂的都懂这里就不 [细说](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA) 了。  

## 扩展阅读
《[Pro Git 中文版（第二版）](https://www.progit.cn/)》《[Git 官方文档](https://git-scm.com/book/zh/v2/)》  
《[菜鸟教程](https://www.runoob.com/git/git-tutorial.html)》  
《[阮一峰的 Wiki](https://www.liaoxuefeng.com/wiki/896043488029600)》  

[^1]: 「<ruby><rb>变基</rb><rp>（</rp><rt>rebase</rt><rp>）</rp></ruby>」这个词就是字面意思（改**变基**底），但不是那种字面意思（**变**成**基**\*），望周知。  

