---
title: "CentOS 7 修改 SSH 端口"
subTitle: "小记一次被攻击（未遂）"
date: 2018-12-22T19:25:25+08:00
tags: ["Linux", "运维", "CentOS", "SSH"]
series: ["运维"]
related: true
---

## 起因
2018 年 12 月 22 日，手里一个 VPS 被攻击了。  

> 1C1G5M CentOS 7.0 x86_64位 BGP多线  

<!--more-->

第一次碰到 DDOS 之外的直球攻击~~虽然很蠢~~，想想还有点小激动。  
`cat /var/log/secure` 查日志攻击时间是从 `12/21 23:47:11` 到 `12/22 18:39:46`。  

破解方式是直接暴力跑字典尝试 root 密码，一开始差点笑出声，后来想想室友的习惯，突然理解了攻击者。  
下水道摸多了再怎么瞎也碰得到死耗子的，没有安全审计的私人机器，加上零安全意识的学生之类的人还挺多的，什么 `abc123` 总是有的。  
退一步说，就算密码稍微复杂点，如果长时间没人管，大不了挂上十天半个月，总有一天试得出来。  
虽然他这效率属实有点低，我发现的时候
```shell
$ cat /var/log/secure | grep 'Failed password for root' | wc -l
```
共 11872 次，平均 5.72 秒一次……  

反正这个测试机也没有重要数据，改个端口意思一下就行了。  

## CentOS 7 修改 SSH 端口号
### 新增端口
`vim /etc/ssh/sshd_config` 可以看到：  
```
# 前略

#Port 22

# 后略
```

虽然**注释**掉了，但我这台机器 ssh 登录端口仍然是 `22`。  
这是因为如果**不特别指定**另外端口则**默认**使用端口 `22`。  

vim `yyp` 复制一行出来，把注释都去掉：  
```
Port 22
Port 12345
```

保留 `22` 是留一条后路，否则万一配置哪里出了问题 `22` 端口也登录不上了，那就就很尴尬了。  
最好挑 `10000 ~ 65535` 之间的高位端口，10000 以下容易跟其他各种乱七八糟常用不常用的进程占用的端口冲突。  

### 配置防火墙

1. `firewall-cmd --permanent --query-port=12345/tcp` 查看防火墙端口状态，如果回显`no` 说明 12345 端口没有放通，open it  
2. `firewall-cmd --permanent --add-port=12345/tcp` 应该回显`success`  
3. `firewall-cmd --reload` 重载防火墙策略  
4. `firewall-cmd --permanent --query-port=12345/tcp` 再看一次，这次应该回显`yes`了，防火墙配置完成  

### 重启使能修改
```shell
$ systemctl restart sshd # 重启 SSH 服务
$ systemctl restart firewalld.service # 重启防火墙服务
$ shutdown -r now # 最好服务器也重启一下
```

### 测试
* 直接尝试通过 12345 端口登录 ssh  
* 通过 22 端口成功登录后 `ssh root@localhost -p 12345` 测试 12345 端口
* `netstat -lnp|grep 12345` 查看端口占用，如果没有回显说明没有被占用

> 如果这里失败大概率是因为没有设置好 SELinux。  

### 设置 SELinux
**如果测试没问题可以跳过这一步**  

1. `sestatus` 检查 SELinux 状态  
2. 如果第一行不是 `SELinux status: enabled`，`vi /etc/selinux/config` 并设置`SELINUX=enforcing` 再重启服务器以启用 SELinux  
3. `semanage port -l | grep ssh` 查看 ssh 端口  
4. 没有安装 `semanage` 就 `yum install policycoreutils-python` 安装  
5. `semanage port -a -t ssh_port_t -p tcp 12345` 开放 12345 的 ssh 端口  

### 关闭默认端口
成功了就可以放心关闭 22 端口了，`vim /etc/ssh/sshd_config`：  
```
Port 22
Port 12345
```
注释掉 22：  
```
#Port 22
Port 12345
```
`systemctl restart sshd` 重启 ssh 服务即可。  


## 参考文档
《[CentOS7设置ssh服务以及端口修改](https://blog.csdn.net/ausboyue/article/details/53691953)》  