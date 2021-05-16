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
在仓库根目录下建立 `./.github/workflows` 文件夹，这个文件夹里配置正确符合语法的脚本文件 `.yml` 会根据条件自动执行。  

因此我们在写作仓库建立如下结构：  
```
Blog Repo/                  写作仓库根目录
├── .github/
│ ├── workflows/            默认 Github Action 工作流 目录
│ │ └── build.yml           写作仓库的 Action 执行的工作流文件
│ └── second_action/
│   └── dist.yml            分发仓库的 Action 执行的工作流文件
└── ...
```

新建文件 `./data/meta/version.yaml`，输入内容：  
```yaml
hugo: v0.83.1%2fextended
theme:
  name: MemE
  version: v4.5.0
```

存储 Hugo 版本和主题版本等信息。  

`build.yml` 文件的内容为：
```yml
name: Hugo Blog CI

on:
  push:
    branches:
    - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: 1. Checkout Repo
      uses: actions/checkout@v2
      with:
          submodules: true
          fetch-depth: 0

    - name: 2. Read Hugo Verion
      id: hugo-version
      run: |
        HUGO_VERSION=$(cat "data/meta/version.yaml" | grep hugo | grep -v '#' | awk '{print $2}' | sed 's/%2f.*$//g' | sed 's/v//g')
        echo "::set-output name=HUGO_VERSION::${HUGO_VERSION}"

    - name: 3. Setup Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: '${{ steps.hugo-version.outputs.HUGO_VERSION }}'
        extended: true

    - name: 4. Set Timezone & Generate Public Files
      # 设置时区为 UTC+8 否则生成网站的时间可能是世界协调时
      run: |
        sudo timedatectl set-timezone Asia/Shanghai
        hugo --minify

    - name: 5. Copy Dist Github Action Workflow File
      run: |
        mkdir -p public/.github/workflows/
        cp .github/second_action/dist.yml public/.github/workflows/dist.yml
        ls -a public

    - name: 6. Distribution to Github Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
        external_repository: ${{ secrets.ACTIONS_DEPLOY_REPO }}
        publish_branch: main
        publish_dir: ./public
        exclude_assets: ''
        cname: ${{ secrets.ACTIONS_DEPLOY_CNAME }}
        commit_message: ${{ github.event.head_commit.message }}
        user_name: 'github-actions[bot]'
        user_email: 'github-actions[bot]@users.noreply.github.com'
```

> `${{ secrets.XXX }}` 在仓库的 `Settings` 页面中的 `Secrets` 项里设置。  
> 生成好密钥对，公钥放在 `分发仓库` 的 `Deploy keys` 项（记得勾上 `Allow write access` 不然虚拟机拿不到 push 权限），私钥放在 `写作仓库` 的 `Secrets` 项。  
> 如果还有更基础的用法不清楚如何使用请自行搜索，此处不再赘述。  

`dist.yml` 文件的内容为：  
```yml
name: Hugo Blog CD

on:
  push:
    branches:
    - main

jobs:
  distribute:
    runs-on: ubuntu-latest
    steps:
    - name: 1. Checkout Repo
      uses: actions/checkout@v2

    # 强烈建议使用 Cloudflare Pages 自动部署

    # - name: 2. Deploy to Server via Rsync
    #   uses: burnett01/rsync-deployments@4.1
    #   with:
    #     switches: -avzr --delete --exclude=".git" --exclude=".github" --exclude="CNAME" --exclude=".well-known"
    #     path: ./
    #     remote_path: ${{ secrets.DEPLOY_TARGET }}
    #     remote_host: ${{ secrets.DEPLOY_HOST }}
    #     remote_user: ${{ secrets.DEPLOY_USER }}
    #     remote_key: ${{ secrets.DEPLOY_KEY }}
```

如果博客托管的地方不是云服务器，而是存储桶或者别的什么对象存储服务的话，随便搜索一下一般都找得到对应的 Github Action Repo，按照正确语法自行替换即可。  

[^1]: 一系列补救工作：根据各种线索推理出更新出错部分的时间和标志，然后去写作仓库里翻找出需要的版本，回滚之后重新编译，把重新生成的静态文件上传，之后再把写作仓库回滚到最新版本。  