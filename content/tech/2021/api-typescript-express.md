---
title: "API 重建计划 #1 TypeScript Express"
subTitle: "TypeScript Express API Golenil"
date: 2021-05-17T01:06:38+08:00
tags: ["Node.js", "TypeScript", "Express", "API"]
series: ["API"]
related: true
---

<h3 align="center">🚀 Express RESTful API Using TypeScript</h3>

<span class="sticker">
    <a href="https://github.com/ljlm0402/typescript-express-starter" target="_blank"><img src="https://img.shields.io/badge/ljlm0402-typescript--express--starter-blue?logo=github" alt="npm Downloads" /></a>
    <a href="http://npm.im/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/v/typescript-express-starter" alt="npm Version" /></a>
    <a href="http://npm.im/typescript-express-starter" target="_blank"><img src="https://img.shields.io/npm/l/typescript-express-starter" alt="Package License" /></a>
    <a href="http://npm.im/typescript-express-starter" target="_blank"><img src="https://img.shields.io/github/v/release/ljlm0402/typescript-express-starter" alt="Release Version" /></a>
</span>

## 搭建脚手架
```shell
$ npm install -g typescript-express-starter
$ npx typescript-express-starter "project name"
```

然后 `npm run dev` 就可以跑了。  

## 新增依赖
```shell
$ npm install axios --save
$ npm install cheerio --save
```

根据需求编写代码。  

## 拉取仓库
```shell
$ ssh-keygen -C '记号' -f ~/.ssh/deploy_key
$ cat ~/.ssh/deploy_key.pub
# 将公钥写入仓库的 `Deploy keys`
```

`vim ~/.ssh/config`，输入内容：  
```
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/deploy_key
```

`ssh -T git@github.com` 测试连通性。  

```shell
$ git clone git@github.com:<USERNAME>/<REPONAME>.git
$ cd <REPONAME>
$ npm install
$ echo "PORT=3000" >> .env
```

## 正常运行
`npm run start` 然后挂起就行了。  