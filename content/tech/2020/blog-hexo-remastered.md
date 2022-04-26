---
title: " 重建  NexT  主题  Hexo  博客"
subTitle: " 第  14000605  次重置博客"
date: 2020-03-01T22:35:00+08:00
tags: ["Blog", "Hexo", "NexT"]
series: ["ews.ink"]
related: true
---

##  前言
我真的希望这是最后一次了。  

> 2021.5.18 更新：确实。~~这之后我就换成 Hugo 了~~  
> 然后 Hugo 重置了好几次（换主题 / 删黑历史之类的），前几天是第 4 次。  

<!--more-->

我特别喜欢「清洗」乃至「切割后新生」这个概念。  
不知道算控制欲过强还是安全感太低，我把大部分自己无法掌握且没有足够了解的事物都视为污渍，肮脏的杂质。  
现实生活里我不得不在某种程度上屈服，否则连呼吸、喝水都有心理障碍，就没办法正常生活了。  
天之道，损有余而补不足。人之道，则不然，损不足以奉有余。老子说的[^1]。  
作为某种压抑后的释放，对于一些更为抽象的、更偏向概念性的东西，我这种偏执就会显现出来。  

>  有一句话我说过很多次：我可能不是真的洁癖，但我是真的矫情。  
>  2021.5.18 更新：这句话是真的，至今都是。  

比方说博客，如果我一个月没更新，博客里每个字看起来都变得陌生起来；任何一个我曾经亲手加上去的细节我都会思考如果重新开始能否重现。  
文法是否都好好校对过，能不能使用更合适的措辞？  
实现的方法是否足够优雅，是否有可耻的苟且妥协？  
我这个人很多时候想得多，很多时候又很懒；当不断堆积的质疑达到一个阈值，我会想「好烦，算了」。  
算了，想那么多干什么，全部推掉重来不就好了？我真是天才。  

为了避免下一次无谓的重置，这次记录尽量详尽一点。Let's go。  

##  设计
###  框架  /  主题
依旧选择  Hexo + NexT，首先是足够好用，其次我也习惯了。  
反正都重建了，顺便 `npm install -g hexo-cli` 更新到最新版本：「Hexo 4.2 / Hexo-cli 3.1 / NexT 7.7.1」（2020 年 2 月 26 日）。  

###  架构  /  部署
`hexo init`  初始化的时候可以看到：
```bash
$ hexo init new-blog

INFO  Cloning hexo-starter https://github.com/hexojs/hexo-starter.git
Cloning into 'D:\Workspace\Git\new-blog'...
remote: Enumerating objects: 30, done.
remote: Counting objects: 100% (30/30), done.
remote: Compressing objects: 100% (24/24), done.
Receiviremote: Total 161 (delta 12), reused 12 (delta 4), pack-reused 131
Receiving objects: 100% (161/161), 31.79 KiB | 4.54 MiB/s, done.
Resolving deltas: 100% (74/74), done.
Submodule 'themes/landscape' (https://github.com/hexojs/hexo-theme-landscape.git) registered for path 'themes/landscape'
Cloning into 'D:/Workspace/Git/new-blog/themes/landscape'...
remote: Enumerating objects: 9, done.
remote: Counting objects: 100% (9/9), done.
remote: Compressing objects: 100% (9/9), done.
remote: Total 1063 (delta 1), reused 1 (delta 0), pack-reused 1054
Receiving objects: 100% (1063/1063), 3.22 MiB | 2.16 MiB/s, done.
Resolving deltas: 100% (582/582), done.
Submodule path 'themes/landscape': checked out '73a23c51f8487cfcd7c6deec96ccc7543960d350'
```

官方自带的主题  `themes/landscape`  是作为  submodule  子模块  clone  到本地的。  
但  clone  下来只是作为文件（而不是  git  仓库）初始化框架。  
因此  `new-blog`（假如是用  `hexo init new-blog`  初始化）文件夹内是没有  git  仓库的，本地的  `/themes/landscape`  就是单纯的文件夹。  

如果我们在使用  NexT  主题的同时还要对框架本身做版本管理，就会出现一个问题：如何处理主题目录  `/themes/next`？  
如果  `git clone https://github.com/theme-next/hexo-theme-next themes/next`  按照标准流程安装主题，`themes/next`  本身就是一个  git  仓库，不能直接  add  到主仓库里。  
如果  `git submodule add https://github.com/theme-next/hexo-theme-next themes/next`  也不行，子模块  commit  到主仓库只是一个指向原主题仓库的指针，如果本地对主题仓库的内容有修改，是没办法直接  push  到主仓库的。  

显然不可能原封不动的直接引用源仓库，就算不做任何二次开发，最少也要修改其中的  `/themes/next/_config.yml`（主题配置文件）。  

如果一定要用  submodule  这种方案，当然也有解决办法，可以  fork  一个主题仓库进行二次开发，然后主仓库引用自己  fork  的版本。这样如果要更新，拉取新版本后本地合并代码就行了。（[参考](https://segmentfault.com/a/1190000009928515)）

我本来准备这样做，中途突然发现一个问题：我现在真的不是为了折腾而折腾吗？  
我费时费力费心这样做能得到什么？  
更方便地使用  github action  自动部署？  
hexo  没有自带  [git  部署](https://hexo.io/zh-cn/docs/one-command-deployment#Git)？  
本地环境  hexo-cli  编译不动？我馋  github action  提供的虚拟机？  
何必呢？解耦开发版本和生产版本，建两个仓库，一个写作一个展示不好吗？  
写作仓库部署到展示仓库，展示仓库就算不用  github pages  也可以再用  github action  部署到 vps/oss，还实现了对  public  单独的版本控制。  

至于主题目录  `/themes/next`  我用了一个不算优雅但足够实用的方法，新建一个  `/themes/next/.meta/`  文件夹，把  `/themes/next/.git`  和  `/themes/next/.github`  放到里面，接着在  `/.gitignore`  里面排除掉  `.meta`，之后就能在主仓库里管理主题目录了。  

没个十年半载的我也想不起要更新主题，等下次要更新的时候把  `.git`  和  `.github`  从  `.meta`  里拉出来，拉取合并完再放回  `.meta`  就行。  

> 2021.5.18 更新：这段真是绝了。原来我喜欢源码和编译成品分开做版本控制的思路是从这里开始的，还有那个时候 Hexo 也太难用了吧。  

##  构建
###  准备好环境
* [Node.js](http://nodejs.org/) (next  主题需要最低  10.9.0)
* [Git](http://git-scm.com/)

###  安装  hexo-cli
```bash
$ npm install -g hexo-cli
```

###  初始化项目
```bash
$ hexo init <folder>
$ cd <folder>
$ npm install
```

###  安装  NexT  主题
```bash
$ git clone https://github.com/theme-next/hexo-theme-next themes/next
```

###  配置站点
分别编辑根目录和  NexT  目录下的  `_config.yml`  文件，详情参考官方文档「[Hexo](https://hexo.io/zh-cn/docs/)」「[NexT](https://theme-next.org/docs/theme-settings/)」。  

###  使用  Github Action  自动部署
实现「结构  /  部署」一章中的设计：
1.  分别建立「写作」和「展示」两个仓库，本地只对「写作仓库」进行操作
2. 「写作仓库」每次  push  触发第一轮  `Github Action`  自动使用  `hexo generate`  编译准备好的  `source`（博客内容）和  `themes`（博客主题)，并将编译出来的  `public`（博客静态文件) push  到「展示仓库」
3. 「展示仓库」每次  push  触发第二轮  `Github Action`  将静态文件自动部署到  vps（我博客放在国内  vps  上）或者  oos

如果是用  `Github pages`  来展示博客则不需要第三步，第二步把编译好的  `public`（静态网页文件) push  到  `Github pages`  所在仓库就已经完成部署了。  

这种方案第一次配置固然繁琐，但配置好之后就是纯粹的享受了，本地只需要专注于写作（校对可以使用  hexo-admin，产出内容过程建议还是放在本地，不然万一编译出错心态会崩的，我崩过，大家随意）和测试（`hexo server`  预览效果)，更新博客只需要  push  一次，后续的部署工作会全自动完成。  

同时两个仓库实现了「写作仓库（博文  /  主题修改）」和「展示仓库（静态网页文件）」相互独立的版本控制：  
* 「写作仓库」记录了每次博文和主题的更新，方便回溯和比较每次细微的修改。  
* 「展示仓库」记录了每次编译好的静态网页的更新，可以把博客恢复到任何一个（自动部署完成的）版本。  

####  建立写作仓库
结构如下
```yaml
Blog-Repo-Writing/
 ├── .git/             # git 仓库元信息
 ├── .github/
 │ ├── workflows/      # 此目录下所有 workflow 文件（*.yml）都会被 Github Action 检测到并自动执行
 │ │ └── build.yml     # 第一轮 Github Action workflow(自动部署)文件 在 Writing 仓库执行 编译 public 并提交到 Display 仓库
 │ └── second_action/  # 文件夹叫什么无所谓 甚至 sync.yml 放在别的地方都可以 只要能被 git 管理到
 │   └── sync.yml      # 第二轮 Github Action workflow(自动部署)文件 在 Display 仓库执行 将 public 同步到其他位置
 ├── scaffolds/        # Hexo 页面模版
 ├── source/           # Hexo 博客内容
 ├── themes/           # Hexo 主题
 ├── .gitignore        # git 版本管理排除列表
 ├── _config.yml       # Hexo 项目配置文件
 ├── package.json      # Node.js 模块(Hexo)依赖包等元信息
 └── package-lock.json # Node.js 模块元信息 - 依赖包锁定版本
```

####  建立展示仓库
```
Blog-Repo-Display/
 └── ... # 每次第一轮部署完成后 public 里有什么这里就有什么
```

####  使用  Github Action
>  注意：Github Action 要的脚本文件（`*.yml`）只要放在 `/.github/workflows/` 目录下就会被检测到并自动执行，因此第二轮部署需要的文件应该放在别的位置。   
>  这里我在并列的位置建了一个 `/.github/second_action/` 文件夹来放，也可以放其他任何能被 git 管理到的位置。   

试图像「Github Pages 的 `CNAME` 文件」那样，  
直接把 `.github/workflows/sync.yml` 放在 `source` 内一起提交是不行的！  

确实可以提交到仓库，但之后 Github Action 执行 `hexo generate` 的时候会忽略 `.` 开头的隐藏文件 / 文件夹。  

Github Action 的具体用法此处不再赘述，需要进一步了解的话自行查阅资料。  

在写作仓库执行第一轮自动部署：编译 public 并 push 到展示仓库。  
`build.yml` 内容：  
```yaml
name: Hexo CI - Build

# 每次 master 分支有 push 操作就执行下列任务
on:
  push:
    branches:
    - master

jobs:
  build:
    # 申请 linux 虚拟机
    runs-on: ubuntu-latest
    steps:
    # 下载仓库（这里是写作仓库）内容到虚拟机
    - name: 1. Checkout Repo
      uses: actions/checkout@v2
    # 安装 Node.js
    - name: 2. Setup Node.js
      uses: actions/setup-node@v1
    # 安装 Hexo 及相关依赖包
    - name: 3. Install Hexo
      run: |
        npm install hexo-cli -g
        npm install
    # 生成 public 静态网页文件
    - name: 4. Generate Public Files
      run: |
        hexo clean
        hexo generate
    # 将准备好的第二轮自动部署文件复制到 public 内一起提交
    - name: 5. Copy Github Action Workflow File
      run: |
        mkdir -p public/.github/workflows/
        cp .github/second_action/sync.yml public/.github/workflows/sync.yml
    # 将 public 文件夹 push 到展示仓库
    - name: 6. Push Changes
      uses: peaceiris/actions-gh-pages@v2.5.1
      env:
        ACTIONS_DEPLOY_KEY: ${{ secrets.REPO_TOKEN }} # 你的展示仓库的部署私钥 记得添加密钥对的时候要勾 write 权限 否则 push 不上去
        EXTERNAL_REPOSITORY: Cyanashi/Rakuyo-Blog-Display # 你的展示仓库
        PUBLISH_BRANCH: master
        PUBLISH_DIR: ./public
```

在写作仓库执行第一轮自动部署：将本仓库内容（即  public）同步到其他位置。  
`sync.yml`  内容：  
```yaml
name: Hexo CI - Sync

on:
  push:
    branches:
    - master

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    # 用 rsync 将本仓库同步到 vps
    # oss 用不着我再说了 网上一堆教程教「github action 部署 oss」
    - name: Deploy via Rsync
      uses: burnett01/rsync-deployments@4.0
      with:
        # 仓库和 vps 只有一方有 而且不想每次同步时自动删除的文件/文件夹（比如网站图标/伪静态配置/SSL证书验证文件）应该在这里排除掉
        switches: -avzr --delete --exclude=.git --exclude=.github --exclude=.well-known
        path: ./
        # vps 的位置 比如 /www/wwwroot/thisisablog
        remote_path: ${{ secrets.DEPLOY_TARGET }}
        # vps 的地址建议使用域名  更换 ip 可以重新解析不用再来仓库修改 注意不要加 http/https 的协议前缀就行
        remote_host: ${{ secrets.DEPLOY_HOST }}
        # 用户名  此处不再赘述如何新建 git 用户 / 给予指定目录权限 / 建立 ssh 登录密钥对 懒得折腾直接用 root 好了
        remote_user: ${{ secrets.DEPLOY_USER }}
        # ssh key 私钥  公钥在你的 vps 上
        remote_key: ${{ secrets.DEPLOY_KEY }}
```

###  在  VPS  自建  Git  仓库利用  hooks  自动部署
拿到  Github Action  测试资格后就不再用这种憨憨方式了，但用肯定是还能用的。  

```bash
$ adduser git # 新建 git 用户
$ mkdir -vp /home/git/.ssh # 新建 .ssh 文件夹
#「~/.ssh/id_rsa.pub」->「/home/git/.ssh/authorized_keys」把本地的公钥复制到服务器上

# **很！重！要！**  注意这里是个大坑
$ cd /home/git && chown -R git:git .ssh
# 把 .ssh 文件夹的拥有者改为 git 用户 否则会有权限问题

$ vim /etc/ssh/sshd_config #编辑 sshd 配置文件使能公钥授权登录

RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# (可选)保险起见 `systemctl restart sshd` 或者直接 `reboot` 重载 sshd

$ mkdir -vp /var/repo && cd /var/repo # 建立仓库存放目录并切换到此目录
$ git init --bare blog.git # 初始化裸仓库
$ chown -R git:git blog.git # 把仓库的拥有者改为 git 用户
$ vim /etc/passwd # 编辑 git 权限

# 把
git:x:1003:1003::/home/git:/bin/bash
# 改成
git:x:1003:1003::/home/git:/usr/bin/git-shell

$ mkdir -vp /var/repo/blog.git/hooks # 建立钩子存放目录
$ vim /var/repo/blog.git/hooks/post-receive # 编辑钩子

#!/bin/sh
git --work-tree=/www/wwwroot/blog --git-dir=/var/repo/blog.git checkout -f

# 保存并退出 vim

$ chmod +x /var/repo/blog.git/hooks/post-receive # 设置钩子执行权限
```

编辑本地 hexo 项目的 `_config.yml` 文件末尾的 `deploy` 条目：  
```yaml
# Deployment
## Docs: https://hexo.io/zh-cn/docs/one-command-deployment
deploy:
  type: git
  repo: git@yourserver.com:/var/repo/blog.git
  branch: master
```

###  安装管理后台
```bash
$ npm install --save hexo-admin
```

###  本地调试
```bash
$ hexo server --debug
# 浏览器打开  http://localhost:4000  预览
# 浏览器打开  http://localhost:4000/admin  进入后台界面
```

###  在线部署
```bash
$ hexo clean && hexo generate --deploy
```

> 再重复一遍：  
> 使用 Github Action 就不用上面这种方式了，每次 push 都会自动部署。  

[^1]: 出自<s>《九阴真经》</s>《道德经》第七十七章。  
