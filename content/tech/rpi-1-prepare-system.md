---
title: "树莓派食用手册 #1 安装系统与存储卡技术漫谈"
date: 2018-11-25T19:11:00+08:00
tags: ["树莓派", "运维", "Linux", "Debian", "硬件"]
series: ["运维"]
related: true
---

## 前言
> 2020.3.23：这块 3B+ 还是当初做毕设的时候买的，答辩完之后就一直吃灰了。  
> 最近折腾了一顿 NanoPi Neo2 发现貌似还是树莓派玩起来舒服一些。  
> 于是决定重新捡起来。  

当初装的是官方 Raspbian 纯净版系统 `RASPBIAN STRETCH LITE`，里面不算轮子的话除了毕设项目就是几个网页，稍微花时间回忆并开机验证了下，确信没有什么值得留念的，直接重装了。  
毕业设计？根据傻逼速率[^1]，那早就是黑历史了，我巴不得消灭掉。  
小火汁摇了我吧，现在让我去改还不如直接重写，还省时省力一些。  

<!--more-->

## 选系统
~~据我所知目前的官方系统都是 32 位的。~~

> 2020.5 官方更新了 64 位的测试版系统：`Debian64` + `Pixel`……  

之前的型号不太了解，反正树莓派 3B+ 以上肯定是 64 位的 CPU。  

我选择「[Debian Pi Aarch64](https://github.com/openfans-community-offical/Debian-Pi-Aarch64)」，民间树莓派爱好者发行的树莓派 64 位 Debian。  

为什么一定要上 64 位？
简单来说 32 位系统是无法完全发挥 64 位板子的性能的，具体有兴趣了解可以自行查询各种资料和评测结果（举个 [栗子](https://github.com/openfans-community-offical/Debian-Pi-Aarch64/blob/master/README.md#1-4-some-system-performance-testing-results)），此处不再赘述。  

其实网上流传的树莓派 64 位系统方案还是挺多的，我选择 `Debian Pi Aarch64` 的原因是他们文档写得比较详细 + 开源 + 中文友好 + 测试数据详实。  

## 烧录系统
如果把树莓派视为一台 PC，它的硬盘就是 `Micro SD Card`，即 `Trans-flash Card`，俗称「TF 卡 / （迷你）SD 卡」。   
之所以说 mini 是因为正常 SD 卡本来应该是大一号的版本，生活中经常看到给相机用的那种。  
详见《<a href="/tech/storage-sd-card" target="_blank">存储卡相关知识简单科普</a>》一文，看完应该对如何选存储卡没有疑问了。  

以下内容基于我们已经选好 TF 卡的前提下。  

### 装机
> 裸板可以跳过这一小节。  

哎，树莓派是不是机器，是吧，我装树莓派也是装机，没毛病。  
不过这里要注意一点：  

如果你是第一次玩树莓派，如果你给板子买了壳，那么——  
不管这个壳看起来插口留了多大，**一定要装完壳再装TF卡**。  

我当初大力出奇迹怼坏了一张 64G，一张 32G，纯憨批，没什么好说的。  

### 正式烧录系统
众所周知，PC 装系统 = 板子烧录 img 到TF卡。如果是刚买的「Micro SD Card *崭新出厂*」，建议用「[SD Memory Card Formatter](https://www.sdcard.org/downloads/formatter_4/eula_windows/index.html)」格式化一次。  

准备好系统镜像，现在的[官方系统](https://www.raspberrypi.org/downloads/raspbian/)有三个版本：  
* 「[Raspbian Buster with desktop and recommended software](https://downloads.raspberrypi.org/raspbian_full_latest)」桌面版带推荐软件
* 「[Raspbian Buster with desktop](https://downloads.raspberrypi.org/raspbian_latest)」桌面版
* 「[Raspbian Buster Lite](https://downloads.raspberrypi.org/raspbian_lite_latest)」无桌面版

小孩子才做选择，我全都不要。  

前文说了，我选择使用「[Debian Pi Aarch64](https://github.com/openfans-community-offical/Debian-Pi-Aarch64/blob/master/README.md#6-download-links)」，民间编译的 64 位 Debian。  

确定下好的系统镜像是 `.img` 格式，如果是其他格式（包括但不限于 `.zip`/`.tar`/`.xz` 等等），请把压缩包里的 `.img` 系统镜像文件解压出来。  
友情提醒：「[7-Zip](http://www.7-zip.org/download.html)」可以解压大部分压缩包格式。  
打个比方，在 Windows 上面解压 `.xz` 属于基本操作。  

确认过 TF 卡读写没问题就可以开始烧录了。  
我喜欢用「[Etcher](https://www.balena.io/etcher/)」（支持全平台 Windows / Mac / Linux，就一个字，专业），当然你更喜欢轻便小巧的「[Win32 Disk Imager](https://sourceforge.net/projects/win32diskimager/)」（Windows 特供）也行。  

注意烧录系统完成后，Windows 会重新读取TF卡，一般会发现两个盘。  
有一个是 Windows 能读写的是可以提前放配置文件进去的启动盘。  
另一个盘 Windows 无法识别，提醒你是否格式化，**绝对不要点格式化**，Linux 系统的文件系统 Windows 读不出来怎么想都很合理吧。  

> 如果你烧录的是官方镜像，请注意以下内容：  
> 最好去 Windows 可以读的那个（大概只有几十 MB？）boot 盘的**根目录**下新建一个文件，**命名为 `ssh`（没有后缀名）**。  
> 这是因为某次更新后 raspbian 为了安全起见默认禁用 ssh，但可以用这种方式手动打开。  
> 系统初始化的时候检测到根目录下有名为 `ssh` 文件会删除此文件并启用 ssh。  
> 以前（18年）是这样，不太清楚现在还是不是，是多此一举也不会有问题。  

本文之后的内容都以默认使用 Debian Pi Aarch64 为准，官方系统仅供参考。  

## SSH 连接
准备好 SSH 连接软件，「[Xshell](https://www.netsarang.com/zh/Xshell/)」都不惜违反广告法自称「业界最强大的 SSH 客户机」了，不过如果你依然愿意使用「[PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)」的话也没有问题。  

![查看网络属性](https://i.loli.net/2020/03/23/Zf3Q7xOAuhkc8MG.png)

首先使用 PC 查看 `网络属性`，记住名为 `以太网` 的项，有多个以太网选 `描述` 是网卡型号那个，截张图不费事吧。  
<kbd>Win</kbd> + <kbd>X</kbd> 打开 PowerShell 运行 `ipconfig`，如果是连的 Wi-Fi，以太网一项的 `媒体状态` 应该是 `媒体已断开连接`。  
把 TF 卡插入树莓派（卡槽在板子背面），**用网线连接 PC 和树莓派**，接通树莓派电源，再运行`ipconfig`，以太网有了吧，有了就对了。  
PowerShell 运行 `arp -a`，应该会有一个 MAC 地址 `b8` 开头的动态 IP，那个就是树莓派的 IP。  

如果这个 IP 用 22 端口连不进去——  
什么叫连不进去，用 SSH 软件连接这个 IP 无法打开，或者 `telnet [IP] 22` 提示「无法打开到主机的连接」，就叫连不进去  
——那么就用路由器的 DHCP 给它分配一个 IP。  

如何用 PC 把 Wi-Fi 分享给树莓派呢？  

![共享网络](https://i.loli.net/2020/03/23/b5aSFV2mD8jzo9k.png)

打开 `控制面板` - `网络和共享中心`，点击 `WLAN` - `属性`，切到 `共享` 标签卡，勾选 `允许其他网络用户通过此计算机的 Internet 连接来连接`，如果下面的让你填 `家庭网络连接` 就填树莓派的网络连接，一般就是 `以太网`。  

打开路由器后台管理页面，新增一个 MAC 地址 `b8` 开头的 IP，那个 IP 就是路由器分给（通过 PC 共享了网络的）树莓派的 IP。  
用 SSH 软件连接树莓派，初始账户 `pi` / `raspberry`，如果登录成功就大功告成了。  
在树莓派的终端运行 `ifconfig wlan0` 可以看到树莓派当前IP。  

> 推荐用路由器给树莓派分配一个内网固定 IP，DHCP 每次自动分配的 IP 是随机的，只要不是太古早的路由器应该都有这个功能。  
> 给树莓派 MAC 绑定固定 IP 方便以后直接使用，你不想每次连接都要这样折腾一遍吧。  

## 默认root
1. `sudo -i` 将当前用户从 pi 切换到 root  
2. `cd ~` 进入 `/root` 工作目录  
3. （可选）最好 `sudo passwd root` 设置 root 密码并**牢记**，忘记密码自行解决  
4. `ssh-keygen` 生成密钥对  
5. `cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys` 把刚刚生成的密钥对存进白名单  
6. `chmod -R 700 ~/.ssh` 确保 SSH 配置目录权限正确  
7. `chmod 600 ~/.ssh/authorized_keys` 确保白名单文件权限正确  
8. `vim /etc/ssh/sshd_config` 编辑 SSH 配置文件（`:eq` 保存文件内容并退出 vim）：  

```
## 允许使用ssh-key验证并登录 ##
RSAAuthentication yes
PubkeyAuthentication yes

#PermitRootLogin prohibit-password
## 上面这行的意思是允许登录root 但禁止直接登录root 即只能用别的账户登录成功后 sudo -i 切换到root ##
## 不用动它 新增下面这行就行 ##
PermitRootLogin yes # 允许root直接登录
```

9. 把 `~/.ssh/id_rsa`（私钥文件）下载到本地 PC，直接打开复制粘贴也好，用 [WinSCP](https://winscp.net/eng/download.php) 下载也罢，总之把私钥保存到本地就行  
10. `systemctl restart sshd` / `service sshd restart` / `/etc/init.d/ssh restart` 重启 SSH  
11. 回到 Xshell，打开 `工具` 菜单中的 `用户密钥管理者` - `导入`，把私钥导入 Xshell 然后登录会话的时候选 `Public Key` 就 OK 了  

（可选）配置完成后，为了提高安全性直接禁止密码登录：  
`vim /etc/ssh/sshd_config` 打开配置文件，修改为 `PasswordAuthentication no` 保存后重启 SSH 即可。  
此外还可以把默认的 22 端口修改为其他端口进一步提高安全性。  

## 修改主机名
自己的树莓派当然有特别的称呼。  
如果都叫 `raspbian` 那跟别人家的妖艳贱货有什么区别，对吧。  

1. `vim /etc/hostname` 把 `raspbian` 修改新的名字。  
2. 如果想把 `localhost` 的别名也改了，可以 `vim /etc/hosts` 把 `raspbian` 修改新的名字。  
3. `reboot` 重启后生效。  

[^1]: 桥水基金的<ruby><rb>雷</rb><rp>（</rp><rt>Raymond</rt><rp>）</rp></ruby>·<ruby><rb>达里奥</rb><rp>（</rp><rt>Dalio</rt><rp>）</rp></ruby>的名言：「如果你现在不觉得一年前的自己是个傻逼，说明你这一年没学到什么东西」。  
