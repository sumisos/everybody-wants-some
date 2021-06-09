---
title: "API 重建计划 #3 Golang Beego"
subTitle: "Golang Beego API Safound"
date: 2021-06-08T21:12:44+08:00
tags: ["Golang", "Beego", "API"]
series: ["API"]
related: true
---

## 业务自己写
此处略过，重点讲部署。  

## 服务器安装 Go
```bash
$ wget https://golang.org/dl/go1.16.5.linux-amd64.tar.gz
$ sha256sum go1.16.5.linux-amd64.tar.gz

# 确认和 https://golang.org/dl/ 列出的 SHA256 Checksum 一致
b12c23023b68de22f74c0524f10b753e7b08b1504cb7e417eccebdd3fae49061

$ tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz
$ echo "export PATH=$PATH:/usr/local/go/bin" >> /etc/profile
$ source /etc/profile
$ go version

go version go1.16.5 linux/amd64

$ go env -w GOPROXY=https://goproxy.cn,https://goproxy.io,direct
```

## 给 Repo 写 workflow
先要把 webhook 回调地址添加到仓库 Secrets。  

```yaml
name: Deploy

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

    - name: 2. Copy app.conf
      run: |
        cp conf/app.conf.example conf/app.conf
        cp conf/prod.conf.example conf/prod.conf

    - name: 3. Setup Go
      uses: actions/setup-go@v2
      with:
        go-version: '^1.16.4'
    - run: go version

    - name: 4. Build
      run: |
        go get .
        go build .

    - name: 5. Test
      run: "echo 'TODO: Test'"

    - name: 6. Deploy
      uses: joelwmale/webhook-action@master
      with:
        url: ${{ secrets.WEBHOOK_URL }}
        headers: '{"repository": "[USERNAME]/[REPONAME]"}'
        body: '{"event": "deployment", "repository": "[USERNAME]/[REPONAME]"}'
```

## 服务器配置 supervisor
```
[program:api]
user=root
directory=/root/app/api_beego
command=/root/app/api_beego/server
autostart=true
autorestart=true
startsecs=2
stdout_logfile=/tmp/log/supervisor/api_beego.out.log
stdout_logfile_maxbytes=2MB
stderr_logfile=/tmp/log/supervisor/api_beego.err.log
stderr_logfile_maxbytes=2MB
```

需要注意的是这里 `go run main.go` 是不行的，无限 `BACKOFF` 然后 `FATAL`，原因未知，很怪。  
我是直接 `go build -o server` 编译成二进制文件再 `./server` 运行解决的。  

## 服务器设置 webhook
细节略。总之就是：  
1. 开发环境 `git push origin main` 提交变动  
2. Github Action 触发 webhook  
3. webhook 回调服务器触发更新脚本  
4. 脚本执行 `git pull` 并编译二进制文件  
5. 控制 supervisor 重启进程  

### 总结
起初考虑过 Github Action 编译成二进制文件，然后直接上传到服务器就完事了。  
不过不太好传，硬要传当然可以，大不了 root rsync，再说现在 action 也有 sftp 的脚本了。  
直接用 root 不行也可以新建一个 deploy 用户，权限问题配合 webhook 解决起来也很轻松。  
考虑到安全性和稳定性等各方面原因，上带鉴权的对象存储其实是最稳的，但是有成本问题。  
综合下来还是直接拉仓库最舒服。  
