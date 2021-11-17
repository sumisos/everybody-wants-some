---
title: "《饥荒联机版》部署专有服务器"
date: 2020-10-05T08:49:32+08:00
tags: ["饥荒", "Klei"]
series: ["生存游戏"]
related: true
---

## 配置用户权限

> 你乐意直接 root 一把梭也行，可以跳过这一节。  

新建用户组和用户：  
```Bash
$ groupadd steam
$ useradd gm --groups steam
$ useradd dst --groups steam
$ useradd l4d2 --groups steam
```

准备好安装目录并修改权限：  
```Bash
$ mkdir /game
$ chmod -R 770 /game
$ chown -R gm /game
$ chgrp -R steam /game
```

设置 ACL（访问控制列表）：  
```Bash
$ apt install acl -y
$ setfacl -d --set g:steam:rwx /game
$ setfacl -R -m g:steam:rwx /game
$ chmod g+w /game
```

切换到对应用户：  
```Bash
$ password dst
$ su - dst
```

## 安装 SteamCMD

前往 V 社官方的 [SteamCMD Wiki](https://developer.valvesoftware.com/wiki/SteamCMD) 页面，根据目录找到安装方式。  
发现原来有官方包可以直接安装啊，我以前都是下载压缩包手动解压安装的。  

我是 **Ubuntu** 20.04 **64 位**，因此按照官方给出的指示操作：  
（权限问题自行解决，该加 `sudo` 就加）  
```Bash
$ add-apt-repository multiverse
$ dpkg --add-architecture i386
$ apt update
$ apt install lib32gcc1 steamcmd -y
```

然后就安装好了，尝试运行：  
```Bash
$ steamcmd
# 如果你是手动安装的，那么应该是
# ./steamcmd.sh

Redirecting stderr to '/home/gm/.steam/logs/stderr.txt'
[  0%] Checking for available updates...
[----] Verifying installation...
Steam Console Client (c) Valve Corporation
-- type 'quit' to exit --
Loading Steam API...OK

Steam>
```

成功，没啥问题，输入 `quit` 回车退出。  

> 如果提示：  
> `Warning: failed to init SDL thread priority manager: SDL not found`  
> 说明你服务器没装 SDL。  
> CentOS 运行 `yum install SDL2 -y` 安装。  
> Ubuntu / Debian 运行 `apt-get install libsdl2-2.0 libsdl2-dev -y` 安装。  
> 还是那句话，权限问题自行解决，该 `sudo` 就加。  
> 
> 或者**直接忽略也行**，这个其实无所谓。  
> SDL 是图形 / 声音 / IO 库，你的服务器又不 play 游戏，只是用来开服务端而已，不需要。  
> 只不过每次登录 SteamCMD 它都会警告你一遍，很烦人就是。  

Steam 平台搞定，开始安装饥荒服务端。  

## 安装 Don't Starve Together 服务端

SteamCMD 支持命令参数队列，因此一条命令解决问题：  
```Bash
$ steamcmd +login anonymous +force_install_dir /game/dst +app_update 343050 validate +quit
# 注意服务端强制安装到 /game/dst 目录，自行修改 ↑

[  0%] Checking for available updates...
[----] Verifying installation...
Steam Console Client (c) Valve Corporation
-- type 'quit' to exit --
Loading Steam API...OK

Connecting anonymously to Steam Public...OK
Waiting for client config...OK
Waiting for user info...OK
 Update state (0x5) verifying install, progress: 0.00 (0 / 2529116954)
 Update state (0x5) verifying install, progress: 8.12 (205436362 / 2529116954)
 Update state (0x5) verifying install, progress: 18.25 (461475494 / 2529116954)
 # 中略
 Update state (0x5) verifying install, progress: 94.07 (2379160642 / 2529116954)
Success! App '343050' fully installed.
```

安装成功。注意以后的**更新饥荒服务端游戏版本**也同样是这条命令。  

尝试运行饥荒服务端：  
```Bash
$ cd /game/dst && ls -l
total 30968
drwxrwx---+  4 dst steam     4096 Nov 12 20:37 bin
drwxrwx---+  4 dst steam     4096 Nov 12 20:37 bin64
drwxrwx---+ 11 dst steam     4096 Nov 12 20:37 data
-rwxrwx---+  1 dst steam   243381 Nov 12 20:37 dontstarve.xpm
drwxrwx---+  2 dst steam     4096 Nov 12 20:37 linux64
drwxrwx---+  2 dst steam     4096 Nov 12 20:37 mods
drwxrwx---+  5 dst steam     4096 Nov 12 21:24 steamapps
-rwxrwx---+  1 dst steam 31433351 Nov 12 20:32 steamclient.so
-rwxrwx---+  1 dst steam        7 Nov 12 20:37 version.txt

$ ./bin/dontstarve_dedicated_server_nullrenderer
./bin/dontstarve_dedicated_server_nullrenderer: error while loading shared libraries: libcurl-gnutls.so.4: cannot open shared object file: No such file or directory
```

失败，找不到 `libcurl-gnutls.so.4`。啊哈，老问题了，每次都是这招，能不能整点新活。  

你大概率是有这个库文件的，只是他这个笨比服务端找不到。  
```Bash
$ apt install mlocate -y && locate libcurl-gnutls.so.4

# 果不其然
/usr/lib/x86_64-linux-gnu/libcurl-gnutls.so.4
/usr/lib/x86_64-linux-gnu/libcurl-gnutls.so.4.6.0
```

手动建立软链接：  
```Bash
$ ln -s /usr/lib/x86_64-linux-gnu/libcurl-gnutls.so.4 /game/dst/bin/lib32/libcurl-gnutls.so.4
# 没有输出，说明成功了，linux 信奉「没有消息就是最好的消息」

# 再次尝试
$ ./bin/dontstarve_dedicated_server_nullrenderer
./bin/dontstarve_dedicated_server_nullrenderer: error while loading shared libraries: libcurl-gnutls.so.4: wrong ELF class: ELFCLASS64
```

库文件加载失败 `wrong ELF class: ELFCLASS64`，额，忘了我是 64 位。安装 32 位库：  
```Bash
$ apt install libcurl4-gnutls-dev:i386 -y
$ apt install libstdc++6:i386 -y
```

再次尝试：  
```Bash
$ ./bin/dontstarve_dedicated_server_nullrenderer
# 出来一大片报错，但这也是好消息
```

翻到最前面可以看到：  
```Bash
[00:00:00]: Starting Up
[00:00:00]: Version: [饥荒版本号]
[00:00:00]: Current time: [当前时间]

[00:00:00]: System Name: Linux
[00:00:00]: Host Name: [服务器主机名]
[00:00:00]: Release(Kernel) Version: 5.4.0-48-generic
[00:00:00]: Kernel Build Timestamp: [服务器内核的发布时间]
[00:00:00]: Machine Arch: x86_64
[00:00:00]: Don't Starve Together: [饥荒版本号] LINUX
[00:00:00]: Build Date: ****
[00:00:00]: Mode: 32-bit
[00:00:00]: Parsing command line
[00:00:00]: Command Line Arguments: 
[00:00:00]: Initializing distribution platform
[00:00:00]: ....Done
```

启动成功，最后中断了只是因为缺少配置文件。  
服务端没问题了，下面进入配置环节。  

## 服务端配置

### 写入

1. 打开 [Klei 官网](https://accounts.klei.com/account/game/servers?game=DontStarveTogether)（右上可以切中文）管理饥荒服务器。  
2. 输入「集群名」，「添加新服务器」。  
3. 拿到「<ruby><rb>服务器票据</rb><rp>（</rp><rt>Server Token</rt><rp>）</rp></ruby>」，记录下来。  

### 魔改官方脚本

```Bash
$ cd ~ && f="dst_server.sh" && touch "$f" && chmod +x "$f" && unset f
$ vim ~/dst_server.sh
```

修改自 [官方脚本](https://accounts.klei.com/assets/gamesetup/linux/run_dedicated_servers.sh)。  

```Shell
#!/bin/bash

#STEAMCMD_DIR="$HOME/steamcmd"
INSTALL_PATH="/game/dst"
CONFIG_PATH="$HOME/.klei/DoNotStarveTogether"
CLUSTER_NAME="MyDediServer"

function fail()
{
  echo Error: "$@" >&2
  exit 1
}

function check_for_file()
{
  if [ ! -e "$1" ]; then
    fail "Missing file: $1"
  fi
}

function print_help () {
  echo "$0 -h 查看帮助"
}

function init_config()
{
  if [ ! -e "$CONFIG_PATH/$CLUSTER_NAME" ]; then
    mkdir -p "$CONFIG_PATH/$CLUSTER_NAME/Master"
    mkdir "$CONFIG_PATH/$CLUSTER_NAME/Caves"
    touch "$CONFIG_PATH/$CLUSTER_NAME/cluster_token.txt"
    cat >"$CONFIG_PATH/$CLUSTER_NAME/cluster.ini" <<EOF

[GAMEPLAY]
game_mode = endless
max_players = 6
pvp = false
pause_when_empty = true

[NETWORK]
CLUSTER_NAME = [服务器名字]
cluster_description = [服务器描述]
cluster_intention = cooperative
cluster_language = zh
cluster_password = [服务器密码]

[MISC]
console_enabled = true

[SHARD]
shard_enabled = true
bind_ip = 0.0.0.0
master_ip = 127.0.0.1
master_port = 10889
cluster_key = supersecretkey

EOF
    cat >"$CONFIG_PATH/$CLUSTER_NAME/Master/server.ini" <<EOF

[NETWORK]
server_port = 11000

[SHARD]
is_master = true

[STEAM]
master_server_port = 27018
authentication_port = 8768

EOF
    cat >"$CONFIG_PATH/$CLUSTER_NAME/Caves/server.ini" <<EOF

[NETWORK]
server_port = 11001

[SHARD]
is_master = false
name = Caves

[STEAM]
master_server_port = 27019
authentication_port = 8769

EOF
    cat >"$CONFIG_PATH/$CLUSTER_NAME/Caves/worldgenoverride.lua" <<EOF
return {
    override_enabled = true,
    preset = "DST_CAVE",
}
EOF
  fi
  check_for_file "$CONFIG_PATH/$CLUSTER_NAME/cluster.ini"
  check_for_file "$CONFIG_PATH/$CLUSTER_NAME/cluster_token.txt"
  check_for_file "$CONFIG_PATH/$CLUSTER_NAME/Master/server.ini"
  check_for_file "$CONFIG_PATH/$CLUSTER_NAME/Caves/server.ini"
  check_for_file "$INSTALL_PATH/bin64"
}

function upgrade() {
  #cd "$STEAMCMD_DIR" || fail "Missing $STEAMCMD_DIR directory!"
  #check_for_file "steamcmd.sh"
  #./steamcmd.sh +force_install_dir "$INSTALL_PATH" +login anonymous +app_update 343050 validate +quit
  steamcmd +force_install_dir "$INSTALL_PATH" +login anonymous +app_update 343050 validate +quit
  #TODO 配置 mod
}

function test() {
  tmp="$INSTALL_PATH/mods/dedicated_server_mods_setup.lua" | sed -n '/^ServerModCollectionSetup/'
  echo $tmp
  echo "ServerModCollectionSetup("2048193561")" >> "$INSTALL_PATH/mods/dedicated_server_mods_setup.lua"
}

function run_server() {
  cd "$INSTALL_PATH/bin64" || fail

  run_shared=(./dontstarve_dedicated_server_nullrenderer_x64)
  run_shared+=(-console)
  run_shared+=(-cluster "$CLUSTER_NAME")
  run_shared+=(-monitor_parent_process $$)

  "${run_shared[@]}" -shard Caves  | sed 's/^/Caves:  /' &
  "${run_shared[@]}" -shard Master | sed 's/^/Master: /'
}

TEMP=$(
  getopt -o chmuv --long config,help,mod,update,upgrade,version -n "$0" -- "$@"
)
if [ $? != 0 ]; then
  print_help
  fail "Unverified Parameters"
  exit 1
fi
eval set -- "$TEMP"

while true; do
  case "$1" in
  -c | --config)
    test
    echo "[DEBUG] TODO: 修改配置文件"
    exit 0
    ;;
  -h | --help)
    echo -e "Usage: $0 [options]\n"
    echo -e "Options:\n  --help, -h:    显示帮助\n\n  --version, -v: 版本信息"
    exit 0
    ;;
  -m | --mod)
    echo "[DEBUG] TODO: 修改 mod 文件"
    echo "ls -l $INSTALL_PATH/mods"
    echo "cat $INSTALL_PATH/mods/dedicated_server_mods_setup.lua"
    echo "cat $CONFIG_PATH/$CLUSTER_NAME/Master/modoverrides.lua"
    exit 0
    ;;
  -u | --update | --upgrade)
    upgrade
    shift
    ;;
  -v | --version)
    echo "Don't Starve Together v$(cat $INSTALL_PATH/version.txt)"
    exit 0
    ;;
  --)
    shift
    break
    ;;
  *)
    fail "Uknown Fatal"
    ;;
  esac
done

function main() {
  init_config
  if [ $# -ne 0 ]; then
    print_help
    fail "Unverified Parameters"
  else
    run_server
  fi
}

main $*
```

> 这个脚本没写完，也就是刚好能用的水平，有空再完善，仅供参考。  

<img src="https://i.loli.net/2021/11/11/jFbUQz6hypDP2Lv.png" title="TODO" data-sticker />

## （IDC 提供商）安全组应该开放哪些端口

妈的几年了网上到现在都没个定论（~~害我抄不到作业~~）。  
服务端都搭好了，查个端口有那么难吗？  

运行的服务端进程叫 `dontstarve_dedicated_server_nullrenderer` 是吧。  
```Bash
$ netstat -anp | grep dontstarve
tcp       78      0 [服务器内网IP]:44514     13.213.127.91:443       CLOSE_WAIT  88282/./dontstarve_ 
tcp        0      0 [服务器内网IP]:43954     13.213.127.91:443       ESTABLISHED 88284/./dontstarve_ 
tcp        0      0 [服务器内网IP]:43729     101.226.183.185:443     ESTABLISHED 88282/./dontstarve_ 
tcp        0      0 [服务器内网IP]:43557     101.226.183.185:443     ESTABLISHED 88284/./dontstarve_ 
udp        0      0 0.0.0.0:43028           0.0.0.0:*                           88282/./dontstarve_ 
udp        0      0 0.0.0.0:39189           0.0.0.0:*                           88284/./dontstarve_ 
udp        0      0 0.0.0.0:53540           0.0.0.0:*                           88282/./dontstarve_ 
udp        0      0 0.0.0.0:27018           0.0.0.0:*                           88284/./dontstarve_ 
udp        0      0 0.0.0.0:27019           0.0.0.0:*                           88282/./dontstarve_ 
udp        0      0 0.0.0.0:10889           0.0.0.0:*                           88284/./dontstarve_ 
udp        0      0 0.0.0.0:11000           0.0.0.0:*                           88284/./dontstarve_ 
udp        0      0 0.0.0.0:11001           0.0.0.0:*                           88282/./dontstarve_ 
unix  3      [ ]         STREAM     CONNECTED     150724   88282/./dontstarve_  
unix  3      [ ]         STREAM     CONNECTED     150723   88282/./dontstarve_  
unix  3      [ ]         STREAM     CONNECTED     150228   88284/./dontstarve_  
unix  3      [ ]         STREAM     CONNECTED     150227   88284/./dontstarve_ 
```

以上是<ruby><rb>带进程信息的</rb><rp>（</rp><rt>`--programs`</rt><rp>）</rp></ruby><ruby><rb>全部</rb><rp>（</rp><rt>`--all`</rt><rp>）</rp></ruby>相关 socket 连接（尽量<ruby><rb>显示数字 IP</rb><rp>（</rp><rt>`--numeric`</rt><rp>）</rp></ruby>）：  
1. `tcp` 的几个连接：  
    - 我方是本服务器的内网 IP。盲猜是 NAT 转发导致的，不用管。  
    - 对方是 443 端口，HTTPS。`13.213.127.91` 查了是亚马逊的 EC2 服务器，显然是 Steam（或者 Klei）的 CDN。服务端在访问这几个网站，大概是 API 吧。  
2. `udp` + `0.0.0.0:*` 有什么好说的，我猜是监听服务。  
3. `unix` 显然是 IPC（进程间通信），盲猜是地面服务器与洞穴服务器之间的连接。  

故技重施：  
```Bash
$ netstat -lnp | grep dontstarve
udp        0      0 0.0.0.0:43028           0.0.0.0:*                           88282/./dontstarve_ 
udp        0      0 0.0.0.0:39189           0.0.0.0:*                           88284/./dontstarve_ 
udp        0      0 0.0.0.0:53540           0.0.0.0:*                           88282/./dontstarve_ 
udp        0      0 0.0.0.0:27018           0.0.0.0:*                           88284/./dontstarve_ 
udp        0      0 0.0.0.0:27019           0.0.0.0:*                           88282/./dontstarve_ 
udp        0      0 0.0.0.0:10889           0.0.0.0:*                           88284/./dontstarve_ 
udp        0      0 0.0.0.0:11000           0.0.0.0:*                           88284/./dontstarve_ 
udp        0      0 0.0.0.0:11001           0.0.0.0:*                           88282/./dontstarve_
```

以上是<ruby><rb>带进程信息的</rb><rp>（</rp><rt>`--programs`</rt><rp>）</rp></ruby><ruby><rb>**正在监听中的**</rb><rp>（</rp><rt>`--listening`</rt><rp>）</rp></ruby>相关 socket 连接（尽量<ruby><rb>显示数字 IP</rb><rp>（</rp><rt>`--numeric`</rt><rp>）</rp></ruby>）。  
结论很明显了，这几个端口就是服务端监听中（等待别人访问）的服务。  
`./dontstarve_*` 前的是 `pid`，`88282` 和 `88284` 一个是地面服务器，一个是洞穴服务器。  

`39189` / `43028` / `53540` 是随机的，我重启了服务端就变成了 `38354` / `48730` / `51428` / `53010`。  
没错，变成了四个，因为 `10889` 居然离奇失踪了，稳定不变的只有 Master/Caves `server.ini` 里的 `master_port` 和 `master_server_port` 两组端口。  

总之，这些端口对照配置文件可列出一个表：  
|策略|方向|端口|协议|作用|配置文件|配置项|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|||10889|UDP||`cluster.ini`|`master_port`|
|接受|入|11000|UDP|允许使用命令直连|`Master/server.ini`|`server_port`|
|接受|入|11001|UDP||`Caves/server.ini`|`server_port`|
|接受|入|27018|UDP|Ping 显示具体数值？|`Master/server.ini`|`master_server_port`|
|接受|入|27019|UDP||`Caves/server.ini`|`master_server_port`|

上表中并没有 Master/Caves `server.ini` 中 `[STEAM]` 设置项的 `authentication_port` 端口。  
看来验证（authenticate）这个过程是一次性（而不是持续监听）的。  

根据我的实测，只需要开启 `11000` 一个端口就能在服务器列表刷出来并进入。  
使用命令或启动参数连接到服务器也是用的这个端口。  
即搭好服务端之后，你只需要开启「**入方向**」上「**`Master/server.ini`** 的 **`server_port`** 设置的端口」就能愉快游玩了。对了，记得是 **UDP** 协议，上面表里写得很清楚了。  
