---
title: "Windows Subsystem for Linux 简单使用"
subTitle: "WSL 在 Windows 上使用 Ubuntu"
date: 2020-09-29T16:48:05+08:00
tags: ["WSL"]
series: ["WSL"]
related: true
---

前略，决定重装WSL。  

想了下没什么必要换发行版，还是选择 Ubuntu 20.04。  

## 准备工作

备份目前内容：  
```shell
$ cd
$ mkdir -r /mnt/d/temp/wsl_backup
$ ln -s /mnt/d/temp/wsl_backup ~/temp
$ cp -r ~/meta ~/temp/
$ cp -r ~/.* ~/temp/
```

（对我来说）更多的不管了，没必要费心思原封不动地备份，不如直接重新配置可能还快一点。  

> 因为很重要所以再说一遍，**我不管了是「我」不管了**。  
> 我已经慎重考虑过了得出的结论没必要才这样做，重装之前三思而后行。  
> **数据无价**，谨慎操作。  

## 重新开始

### 重装

> 右键菜单 - 更多 - 应用设置 - 重置  

重置后，规格项下的「数据」和「总使用量」都变成了 0。  
重新启动 Ubuntu，重新初始化。  

### 默认 root

2030 年了，现在基本没有共享 PC 的使用场景了吧。  
我觉得 Windows 的 Administrator 之外的用户真的没有存在必要了。  
更不用说 WSL 了，因为什么「安全隐患」不用 root 纯属给自己找不自在。  

当然，WSL 之外的，日常使用的，类 Unix 系统最好还是避免用 root，就算不扯安全审计，万一有误操作损失会少很多。  

```powershell
$ ubuntu2004 config --default-user root
```

### 设置镜像源
Ubuntu：  
```shell
$ mv /etc/apt/sources.list /etc/apt/sources.list.backup
$ vim /etc/apt/sources.list

# 清华源 (参考 https://mirror.tuna.tsinghua.edu.cn/help/ubuntu/)
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse

# 换源之后更新
$ apt-get update -y
$ apt-get upgrade -y
```

Python：（Ubuntu 20.04 自带 Python 3.8.2）  
```shell
$ python3 --version  # Python 3.8.2
$ mkdir ~/.pip
$ vim ~/.pip/pip.conf

# 豆瓣源
[global]
index-url = https://pypi.doubanio.com/simple

[install]
use-mirrors = true
mirrors = https://pypi.doubanio.com/simple/
```

> 吐槽一下，pip 豆瓣源，npm 淘宝源，老传统了，未必是最快的但用起来有种莫名的安心感，我也不知道为啥。  

### 终端
WSL Ubuntu 20.04 自带 screen，但 zsh 还是要自己装。  
```shell
$ echo $SHELL  # 默认是 /bin/shell
$ cat /etc/shells
$ apt-get install zsh -y
$ zsh --version  # zsh 5.4.2 (x86_64-ubuntu-linux-gnu)

# 安装 oh-my-zsh
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 或者
# sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# 网络问题自行解决

         __                                     __
  ____  / /_     ____ ___  __  __   ____  _____/ /_
 / __ \/ __ \   / __ `__ \/ / / /  /_  / / ___/ __ \
/ /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / /
\____/_/ /_/  /_/ /_/ /_/\__, /    /___/____/_/ /_/
                        /____/                       ....is now installed!

# 自动补全插件
$ git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
# 命令高亮插件
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
# 编辑配置文件
$ vim ~/.zshrc
# 启用插件
plugins=(
	git
	zsh-autosuggestions
	zsh-syntax-highlighting
)
# 配置命令别名
alias rzsh='source ~/.zshrc'
# 怎么舒服怎么来 比如
alias gowork='cd /mnt/d/Workspace/Git'

$ 重载配置使新的配置生效
```

### 编译安装 LNMP & Redis 环境
略

### 设置服务开机自启
```shell
$ vim /etc/init.wsl

#!/bin/sh
/etc/init.d/redis start
/etc/init.d/nginx start
/etc/init.d/mysqld start
/etc/init.d/php-fpm-74 start

$ chmod +x /etc/init.wsl
```

<kbd>Win</kbd>+<kbd>R</kbd> 输入 `shell:startup`，新建 `startservice.vbs`：  
```vb
Set ws = WScript.CreateObject("WScript.Shell")
ws.run "C:\Windows\System32\shell.exe -c '/etc/init.wsl'",0
```

### 安装 Node.js
参考[官方仓库](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)：  
```shell
$ curl -sL https://deb.nodesource.com/setup_14.x | shell -
$ apt-get install -y nodejs
$ node -v  # v14.12.0
```

node 没问题，npm 居然调用到了 win 下的，有 wsl 当然可以卸载了，不过那不是根治的方法。  
为了解决 wsl 和 win 的环境变量产生不必要的交叉的问题：  
```shell
$ echo "[interop]\nenabled=false\nappendWindowsPath=false" | tee /etc/wsl.conf
```

使用**管理员权限**的 powershell 重启 wsl：  
```powershell
$ net stop LxssManager
$ net start LxssManager
```

然后 npm 就正常了：
```shell
$ npm -v  # 6.14.8

# 配置淘宝源 参考https://developer.aliyun.com/mirror/NPM?from=tnpm
$ echo '\n#alias for cnpm\nalias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"' >> ~/.zshrc && source ~/.zshrc
```

## 结语

WSL 是真的香疯了，我不知道别人怎么吹的，对我来说就~~两~~点：  
* 不用额外配置网络，开箱即用，镜像源一换弹射起飞（可以忽略，真要配也没多麻烦）
* 自动挂载本地硬盘，开箱即用，文件 I/O 如同探囊取物
* 直接与 Windows 共享端口，开箱即用，无需任何映射

讲究一个**喂到嘴里**，体验吊打任何常规虚拟机，这个项目真的牛逼。  
那句话怎么说的来着，Windows 是最好的 Linux 发行版。  
