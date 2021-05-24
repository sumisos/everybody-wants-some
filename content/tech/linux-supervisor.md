---
title: "Supervisor: 一个 screen 的强力竞品"
subTitle: "万物皆可后台运行"
date: 2021-05-22T19:02:41+08:00
tags: ["Linux", "运维", "Supervisor"]
series: ["运维"]
related: true
---

一个人膨胀只会害了自己，抱持既定成见故步自封不可取。  
我起初还看不上 Python 写的 Supervisor，沉迷 screen，甚至自己手写过服务\*。  

> \* 不是 `.service` 插进 `/etc/systemd/system/` 就叫服务（准确地说是 daemon 进程）。  
> 单脚本**无依赖**支持 `start` / `stop` / `restart` / `status` 才叫服务。  
> 支持开机自启 / 状态自检 / 自动重启当然要有，但那是「特性」，不是「依赖」。  

在前段时间为了 <a href="/tech/wsl-gui" target="_blank">WSLg</a> 重装 WSL 之前，我用 Hugo 跑的本地网页文档都还是手写的服务。  
舍不得换。刚写好的时候更是不得了，后来机缘巧合用上 Supervisor 才感觉自己像个沙口。  

![](https://i.loli.net/2021/05/24/cPM2wTXKrZm8DHR.gif)

## 安装
```bash
$ apt install -y supervisor
```

## 配置
### 主配置文件
从 [官方文档](http://supervisord.org/configuration.html) 可知配置文件的读取顺序：  
1. `../etc/supervisord.conf`  
2. `../supervisord.conf`  
3. `$CWD/supervisord.conf`  
4. `$CWD/etc/supervisord.conf`  
5. `/etc/supervisord.conf`  
6. `/etc/supervisor/supervisord.conf`（v3.3.0+）  

> 很多 Debian 和 Ubuntu 版本的 Supervisor 都把 `/etc/supervisor/supervisord.conf` 加入了搜索路径。但 PyPI 包只有 3.3.0 以上的版本才包括这个路径，用 pip 安装的话要注意。  

`vim /etc/supervisor/supervisord.conf` 编辑主配置文件：  
```bash
[unix_http_server]
file=/tmp/supervisor.sock     # UNIX的socket文件 supervisorctl会用XML-RPC连接到这个文件来和supervisord通信
;chmod=0700                   # socket文件的权限 默认为0700
;chown=root:root              # socket文件的owner 格式uid:gid

;[inet_http_server]           # 注意这一行也被注释掉了
;port=127.0.0.1:9001          # web管理后台运行的ip和端口 建议不要放给公网 一定要放的话注意安全
;username=user                # web管理后台的用户名
;password=123                 # web管理后台的密码

[supervisord]
logfile=/tmp/supervisord.log  # 主程序的日志文件 默认为$CWD/supervisord.log
logfile_maxbytes=50MB         # 单个日志文件大小 默认为50MB 0为不限制大小
logfile_backups=10            # 日志记录文件备份数量 默认为10份 0为不备份
loglevel=info                 # 日志级别 默认为info 可以为critical/error/warn/info/debug/trace/blather
umask=022                     # 主程序的umask 默认为022
pidfile=/tmp/supervisord.pid  # 记录pid的文件 默认为$CWD/supervisord.pid
nodaemon=false                # 是否在前台启动 默认为false(以daemon方式启动)
minfds=1024                   # 允许打开文件描述符的最小值 默认为1024
minprocs=200                  # 允许打开的进程数的最小值 默认为200

[supervisorctl]
serverurl=unix:///tmp/supervisor.sock  # 连接到supervisord的url
;serverurl=http://localhost:9001       # 通过http的方式连接supervisord
 
[include]
files=/etc/supervisor/conf.d/*.conf    # 其他配置文件路径
```

#### 示例
```bash
[unix_http_server]
file = /var/run/supervisor.sock
chmod = 0700
chown = root:users

[inet_http_server]
port = 127.0.0.1:9001
username = admin
password = 123456

[supervisord]
logfile = /var/log/supervisor/supervisord.log
logfile_maxbytes = 50MB
logfile_backups = 10
pidfile = /var/run/supervisord.pid
childlogdir = /var/log/supervisor

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]
serverurl = unix:///var/run/supervisor.sock

[include]
files = /root/app/supervisor/conf

[group:hugo]
programs = docs,blog
priority = 500
```

### 子程序配置文件
放在主程序配置文件 `[include]` 设置的路径下。  
比如 `vim /etc/supervisor/conf.d/test.conf`：  
```bash
[program:test]                   # 子程序的名字 supervisorctl管理的就是这个
user=test                        # 运行子程序的用户
directory=/tmp/                  # 子程序运行的工作目录
command=/bin/sleep 100           # 子程序运行的具体命令
autostart=true                   # 子程序是否跟随supervisor主程序一起启动 默认true
autorestart=unexpected           # false从不重启 true总是重启只要一退出就重启 unexpected仅抛出错误退出时重启
exitcodes=0,2                    # 定义[正常退出]的退出码 不在这个列表里的错误代码会触发unexpected的autorestart
startretries=3                   # 尝试重启的次数 3为3次以后仍未启动则不再重启并显示状态FATAL 默认3次
startsecs=1                      # 启动成功的判断时间 1为启动后1秒还在运行(没有抛出错误并退出)则视为启动成功 默认1秒
stdout_logfile=/tmp/test_sv.log  # 正常日志log输出文件路径
stdout_logfile_maxbytes=20MB     # stdout日志记录文件大小 默认50MB
stdout_logfile_backups=10        # stdout日志记录文件备份数量 默认10份
redirect_stderr=false            # 是否将error重定向至普通log 换句话说是否合并所有日志输出
stderr_logfile=/tmp/test_sv.err  # 错误日志error输出文件路径
stderr_logfile_maxbytes=20MB     # stderr日志记录文件大小 对应stdout
stderr_logfile_backups=10        # stderr日志记录文件备份数 对应stdout
priority=999                     # 优先级 值越小越优先 默认999
numprocs=1                       # 进程数量 >1表示多进程 产生的参数process_num是第几个启动的进程
process_name=%(program_name)s_%(process_num)02d  # 如果开启多进程 某个子进程的命名格式 形如test_00/test_01
```

#### 示例
```bash
[program:docs]
user=root
directory=/mnt/d/Workspace/Git/Repo/Blog/local-docs/
command=/root/app/hugo server -p 1314 --minify --theme book --watch -D -E -F
autostart=true
autorestart=true
startsecs=2
stdout_logfile=/tmp/log/supervisor/docs.out.log
stdout_logfile_maxbytes=2MB
stderr_logfile=/tmp/log/supervisor/docs.err.log
stderr_logfile_maxbytes=2MB
```

## 使用
```bash
$ supervisorctl help          # 查看用法
$ supervisorctl status        # 查看所有子程序的状态
$ supervisorctl stop hugo     # 停止名为 hugo 的子程序
$ supervisorctl clear api     # 清除名为 api 的子程序的输出日志
$ supervisorctl start test    # 启动名为 test 的子程序
$ supervisorctl restart all   # 重启所有子程序
$ supervisorctl update all    # 重载全部配置文件
$ supervisorctl reload        # 重启 supervisord 主程序
```

## 常见问题
### `unix:///var/run/supervisor.sock no such file`
你确定 Supervisor 真的**正在运行**中吗？  
重启服务器并**不代表**就会自动运行 Supervisor，它是值守其他程序的，不是值守它自己。  
`supervisord -c /etc/supervisord.conf` 手动启动 Supervisor。  

### `supervisorctl stop xxx` 关不掉 `xxx`
这种情况有可能是启动了多个 Supervisor，导致**同一时间**有多个 Supervisor 在一起管理。  

`ps -aux | grep supervisord | grep -v grep` 查看正在运行的 Supervisor 进程；  
如果有两个或以上，那就说明确实是这种情况。  
原因可能是 Supervisor 本来已经在运行了，结果又运行了一个新的。  

不是人家业务逻辑写得烂，Linux 程序还特意写单例的有心人真的不多。  
Windows 的应用程序动动鼠标就点开了，开个软件还要特意过一遍脑子才是奇葩。  
Linux 操作系统这么底层，启动程序的心智成本高也很合理，不然瞎玩玩坏了怎么办。  

可以运行：  
```bash
$ ps -aux | grep supervisord | grep -v grep | awk '{print $2}' | xargs kill -9
```

强制关闭正在运行的所有 Supervisor，然后重新运行：  
```bash
$ supervisord -c /etc/supervisor/supervisord.conf
```

启动唯一指定 Supervisor。  
