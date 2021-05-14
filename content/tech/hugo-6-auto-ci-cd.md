---
title: "Re:从零开始的博客生涯 #6 Auto CI/CD"
subTitle: "利用 Github Action 实现自动部署流程"
date: 2021-05-14T19:24:43+08:00
tags: ["Blog", "Hugo", "Github Action"]
series: ["ews.ink"]
related: true
mermaid: true
---

## 思路

废话不多说，直接简述工作流：  

<div class="mermaid" align="center">
graph TD
A(本地写作) -->|命令行运行 `git push`| B[git push 动作]
B --> |提交到 Github| C[Github Repo 写作仓库]
C --> |检测到 Repo 中 有 .github/ 目录 将执行其中的 workflow| D[Github Action]
B --> |触发 hook| D
D --> |自动申请虚拟机|E[Ubuntu 虚拟机]
E --> |运行 `hugo` 编译生成 public/ <br /> 这一步是在 .github/ 目录下的 workflow 中写好了的| F(静态网页文件)
</div>

稍微打断一下，按理说，以上就是利用 Github Action 云端编译静态文件的流程了，接下来的工作只剩下把生成的静态文件部署到你的服务器 / 对象存储上。  

但我要的不仅只是这些流程，我想要的是足够解耦但完整的从发布到部署的所有流程。所以我准备建立两个 Repo：  

* meta 的**写作仓库**：私有，我在本地写作完毕后 push 的就是这个仓库，记录了我编辑博客的一举一动。  
* dist 的**分发仓库**：公开，用以存放生成后的静态网页文件。这个仓库实现了对发布之后的网站进行完整的版本管理。  

乍一看好像没什么意义，感觉是为了折腾而折腾，其实不然。  
这种架构有几个好处：  

1. 比如某些草稿我暂时并不想发布，但同时又想对这些草稿做版本管理，使用私有的写作仓库就很好的解决了这种需求。不然我要如何管理不想公开的草稿呢？另建一个私有仓库手动管理吗？
2. 利用公开的分发仓库，我可以在任意时间任意地点轻易地将博客回滚到任意一个版本，而不必再去写作仓库翻找出某个版本然后重新编译。
3. 利用分发仓库的 Github Pages，不需要任何服务器成本，我就可以长期保持一个永远同步的热备份。（虽然 Github Pages 的访问速度不敢恭维）

> 吐槽一下，自从微软接手 Github 之后，[在线率](https://www.githubstatus.com/) 实在堪忧，以前基本全绿的。

搞清楚需求和实现方案之后很容易就能写出接下来的流程：

<div class="mermaid" align="center">
graph TD
Start(接上) --> A
A[写作仓库的 Github Action] --> |自动申请虚拟机|B[Ubuntu 虚拟机 #1]
B --> |运行 `hugo` 编译生成 public/ <br /> 这一步是在 .github/ 目录下的 workflow 中写好了的| C[静态网页文件]
B --> D[将生成的静态文件 push 到分发仓库]
C --> D
D -->|虚拟机 #1 运行 `git push`| E[第二次 git push 动作]
E --> |提交到 Github| F[Github Repo 分发仓库]
F --> |检测到 Repo 中 有 .github/ 目录 将执行其中的 workflow| G[分发仓库的 Github Action]
E --> |触发 hook| G
G --> |自动申请虚拟机|H[Ubuntu 虚拟机 #2]
H --> |将整个分发仓库同步到你的服务器 / 对象存储| I(博客更新)
</div>

以上流程看起来繁琐，实际上完成之后是一劳永逸的事情。  
虽然麻烦一些，前期工作完成之后基本就是纯粹的享受写作了——  
* 我在本地写作完毕，只需要 push 一下，其他什么都不用管，几分钟后在线版本就自动更新了。里面的自动化工作流再复杂我也感知不到，反正不需要我人工完成。  
* 在更新博客的过程中，我可以随时随地以轻松自在的心态记录一些临时的笔记，或者完成度过低难以发布的草稿，并且对其进行版本管理。  
* 我发现博客内容有某个部分出现重大纰漏，不需要暂时下线博客，也不需要心忙意乱地完成一系列补救工作[^1]。我只需要在分发仓库找到对应版本，回滚，重新 push，剩下的工作全部都会自动完成。在这之后继续更新博客也不需要额外措施，直接照常 push 写作仓库就是。  

## 操作

再复述一下 Github Action 如何使用：  
在仓库根目录下建立 `.github/workflows` 文件夹，这个文件夹里配置正确符合语法的脚本文件 `.yml` 会根据条件自动执行。  

因此我们在写作仓库建立如下结构：  
```
Blog Repo/                  写作仓库根目录
├── .github/
│ ├── workflows/            默认 Github Action 工作流 目录
│ │ └── build.yml           写作仓库的 Action 执行的工作流文件
│ └── second_action/
│   └── sync.yml            分发仓库的 Action 执行的工作流文件
└── ...
```

`build.yml` 文件的内容为：
```yml
name: Hugo Blog CI # 本workflow名字 随便取

on: # hook 触发器
  push: # 每次push时触发钩子
    branches:
    - master
    # 每当master分支有push动作时 运行此workflow

jobs: # 具体有哪些任务
  build: # 任务名 随便取
    runs-on: ubuntu-latest # 申请何种系统的虚拟机
    steps: # 本任务具体有哪些步骤
    - name: 1. Checkout Repo
      # 第1步 clone本仓库到虚拟机上
      uses: actions/checkout@v2
      with:
          submodules: true # Fetch Hugo themes
          fetch-depth: 0 # Fetch all history for .GitInfo and .Lastmod

    - name: 2. Setup Hugo
      # 第2步 在虚拟机上安装Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: '0.73.0' # Hugo 版本
        extended: true # 是否安装扩展 视你的主题而定 一般来说true没问题

    - name: 3. Generate Public Files
      # 第3步 编译生成静态文件
      run: |
        hugo --minify

    - name: 4. Copy Dist Github Action Workflow File
      # 重点 第4步 将准备好的分发仓库的workflow文件复制到public/目录下一起push
      run: |
        mkdir -p public/.github/workflows/
        cp .github/second_action/sync.yml public/.github/workflows/sync.yml
        ls -a public

    # 如果要使用 peaceiris/actions-gh-pages@v3 携带分发仓库的workflow一起push的方法就不能用了
    # 取消此步骤的注释 以直接在写作仓库的workflow中同步到生产环境
    # - name: 4.5. Deploy to Server via Rsync
    #   uses: burnett01/rsync-deployments@4.1
    #   with:
    #     switches: -avzr --delete --exclude=".git" --exclude=".github" --exclude=.well-known
    #     path: ./
    #     remote_path: ${{ secrets.DEPLOY_TARGET }}
    #     remote_host: ${{ secrets.DEPLOY_HOST }}
    #     remote_user: ${{ secrets.DEPLOY_USER }}
    #     remote_key: ${{ secrets.DEPLOY_KEY }}

    - name: 5. Distribution
    # 第5步 将生成的静态文件push到分发仓库
    # 2020.7.2 若使用 peaceiris/actions-gh-pages@v3 将无法push名为".github"的文件夹
    # 因此继续沿用 v2.5.1 版本
      uses: peaceiris/actions-gh-pages@v2.5.1
      with:
        deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
        external_repository: 你的Github用户名/分发仓库名字
        publish_branch: master
        publish_dir: ./public
      env: # v2.5.1版本特有的环境变量 v3版本中改为上面的with携带并重新命名
        ACTIONS_DEPLOY_KEY: ${{ secrets.ACTIONS_DEPLOY_KEY }}
        EXTERNAL_REPOSITORY: 你的Github用户名/分发仓库名字
        PUBLISH_BRANCH: master
        PUBLISH_DIR: ./public
```

差不多逐行注释了，如有不理解的地方对照注释即可。  

> `${{ secrets.XXX }}` 在仓库的 `Settings` 页面中的 `Secrets` 项里设置。  
> 生成好密钥对，公钥放在 `分发仓库` 的 `Deploy keys` 项（记得勾上 `Allow write access` 不然虚拟机拿不到 push 权限），私钥放在 `写作仓库` 的 `Secrets` 项。  
> 如果还有更基础的用法不清楚如何使用请自行搜索，此处不再赘述。  

`sync.yml` 文件的内容为：  
```yml
name: Hugo Blog CD

on:
  push:
    branches:
    - master

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
    - name: 1. Checkout Repo
      uses: actions/checkout@v2

    - name: 2. Deploy to Server via Rsync
      uses: burnett01/rsync-deployments@4.1
      with:
        switches: -avzr --delete --exclude=".git" --exclude=".github" --exclude=.well-known
        path: ./
        # 绝对路径 比如/usr/www/wwwroot/blog
        remote_path: ${{ secrets.DEPLOY_TARGET }}
        # 主机地址 域名和IP都支持
        # 注意如果使用了CDN的话必须填IP 否则按照域名解析不到真实服务器IP
        remote_host: ${{ secrets.DEPLOY_HOST }}
        # 用户名 建议不要使用root
        remote_user: ${{ secrets.DEPLOY_USER }}
        # 上面的用户SSH登录的私钥
        remote_key: ${{ secrets.DEPLOY_KEY }}
```
其实就是 `build.yml` 中的第 4.5 步。  

如果博客托管的地方不是云服务器，而是存储桶或者别的什么对象存储服务的话，随便搜索一下一般都找得到对应的 Github Action Repo，按照正确语法自行替换即可。  

[^1]: 一系列补救工作：根据各种线索推理出更新出错部分的时间和标志，然后去写作仓库里翻找出需要的版本，回滚之后重新编译，把重新生成的静态文件上传，之后再把写作仓库回滚到最新版本。  