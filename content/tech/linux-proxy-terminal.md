---
title: "使用 proxychain4 安装 zsh"
date: 2021-05-23T12:21:40+08:00
tags: ["Linux", "运维", "zsh", "proxychains"]
series: ["运维"]
related: true
---

## proxychain-ng
[proxychains ng](https://github.com/rofl0r/proxychains-ng) 的 ng 是 new generation 的意思，其实就是 proxychains4。  
**首先**本地开启 socks5 代理（端口有了），然后继续：  

### 安装 proxychain4
```bash
$ apt install proxychains4
```

### 配置 proxychain4
```bash
$ vim /etc/proxychains.conf
```

> 网上有些博文写的 proxychains**4** 用 `/etc/proxychains4.conf`。  
> 当然是可以的，但就直接 `/etc/proxychains.conf` 也会生效。  
> 甚至两个文件都存在的时候 `proxychains.conf` 的优先级比 `proxychains4.conf` 高。  

中间都不用管，拉到最后：  
```
[ProxyList]
# add proxy here ...
# meanwile
# defaults set to "tor"
#socks4         127.0.0.1 9050
socks5         [子网IP] [socket端口]
```

**注意**：如果是 WSL2 的话，IP 应该是  
```bash
$ cat /etc/resolv.conf | grep nameserver | awk '{print $2}'
```

### 测试
```bash
$ curl www.httpbin.org/ip
$ proxychains4 curl www.httpbin.org/ip
```

接口返回的两个本机 IP 不一致，说明开启代理成功了。  

## zsh
大多数 Linux 系统默认终端是 `/bin/bash`：  
```bash
$ echo $0          # 当前shell 也就是shell脚本开头#!/bin/bash声明的东西
$ echo $SHELL      # 默认shell
$ cat /etc/shells  # 所有shell
```

### 安装 zsh
```bash
$ apt-get install zsh -y
$ zsh --version

zsh 5.8 (x86_64-ubuntu-linux-gnu)
```

### 安装 oh-my-zsh
```bash
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 或者
$ sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 取决你用哪个客户端 curl还是wget
```

此处大概率会出现网络问题，我以前 WSL 1 问题不大，升成 WSL 2 全局也救不了。  

这时就该前面装好的 proxychains4 出场了，注意 proxychains 的用法。  
它**不是**新建一个虚拟网络环境，然后在虚拟环境里运行所有命令，哪有这么炫酷。  
它能代理的只有紧接在后面的命令，比如上面安装 zsh 那条：  
```bash
$ proxychains4 sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 这是错误用法 代理sh是想干嘛

$ sh -c "$(proxychains4 wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 这是正确姿势 用proxychains4代理wget
```

```
         __                                     __
  ____  / /_     ____ ___  __  __   ____  _____/ /_
 / __ \/ __ \   / __ `__ \/ / / /  /_  / / ___/ __ \
/ /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / /
\____/_/ /_/  /_/ /_/ /_/\__, /    /___/____/_/ /_/
                        /____/                       ....is now installed!
```

### 下载自动补全插件
老规矩，网络问题 proxychains4 解决。  
```bash
$ git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
```

### 下载命令高亮插件
```bash
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
```

### 配置 oh-my-zsh
```bash
$ vim ~/.zshrc
```

#### 更换主题
我最喜欢 [*agnoster*](https://github.com/agnoster/agnoster-zsh-theme)，就一个字，精致。  
用不同前景色背景色配合做出来的箭头形分隔符真的很有创意，设计感拉满。  
```bash
ZSH_THEME="agnoster"
```

其实默认的 *robbyrussell* 就很棒，简洁大方。  

另外推荐 [*pure*](https://github.com/sindresorhus/pure)，清爽到性冷淡。  

> 如果想用 [*更多主题*](https://github.com/ohmyzsh/ohmyzsh/wiki/themes) 要 `ls ~/.oh-my-zsh/themes | grep [主题名字]` 看看本地有没有。  
> 有的话可以直接修改配置启用。没有的话就要另行下载（`git clone`）了。  

#### 启用插件
```bash
plugins=(
	git
	zsh-autosuggestions
	zsh-syntax-highlighting
)
```

#### 配置命令别名
```bash
alias rzsh="source ~/.zshrc"

# cnpm
alias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"

# 怎么舒服怎么来 比如 WSL 快速到达外面路径的快捷方式
alias gowork="cd /mnt/d/Workspace/Git"

# 再比如之前装好的 proxychains4
alias px="proxychains4"

# 如果装了 supervisorctl
alias sv="supervisorctl"
alias svcfg="vim /etc/supervisor/supervisord.conf"
alias svr="supervisorctl update && supervisorctl reload"

# 对了 thefuck 也要特别为 zsh 配置
eval $(thefuck --alias fuck)

# 等等
```

> 不过不推荐在这里配置 git 别名，git alias 还是老实写在 `~/.gitconfig` 里吧。  

### 重载配置使新的配置生效
```bash
$ source ~/.zshrc
```
