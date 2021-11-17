---
title: "RedMi AC2100 刷写 OpenWrt"
subTitle: "谨以此纪念寿终正寝的 K2P"
date: 2021-07-08T10:03:34+08:00
tags: ["Wi-Fi", "Router", "OpenWrt"]
series: ["Wi-Fi"]
related: true
---

按理应该趁机换 Wi-Fi 6，但目前确实没有那么急迫的需求。  
等我真的上到千兆网说不定 Wi-Fi 7 都成熟了呢，提前这么久留升级空间不如到时候一步到位。  
我**目前**最**核心**的上网需求仍是「能用就行」，所以选择性价比神机 AC2100。  

本文大部分内容来自《[红米AC2100&小米AC2100一键SSH刷Breed和任意固件教程](http://openwrt.ink:88/archives/s-breed)》。  

> 警告：本文操作全程使用网线连接 PC 和路由器（AC2100）。  
> 我第一次由于操作不当变砖了，还好小米官方售后没有不多 BB 直接换新了。  

## 获取 SSH 权限
1. 正常将路由器通电启动，并连上网络，假设内网 IP 为 `192.168.31.1`（如有不同注意替换）。  
2. 浏览器访问 [192.168.31.1](http://192.168.31.1) 并登录到路由器管理后台。  
3. 点击右上角的「系统升级」->「手动升级」，升级到漏洞版本（[红米 AC2100 v2.0.7 固件](http://openwrt.ink:8666/%E5%AE%98%E6%96%B9%E5%B7%A5%E5%85%B7%E5%8C%85/%E7%BA%A2%E7%B1%B3AC2100/%E5%AE%98%E6%96%B9%E5%9B%BA%E4%BB%B6/miwifi_rm2100_firmware_d6234_2.0.7.bin)）。  
4. 升级完成后重启路由器，登录到管理后台，记录下当前地址为 `http://[注意替换IP]/cgi-bin/luci/;stok=[注意记录stok]/web/home`。  
5. 访问如下网址，以打开 SSH：  
    ```
    http://[注意替换IP]/cgi-bin/luci/;stok=[注意替换stok]/api/misystem/set_config_iotdev?bssid=Xiaomi&user_id=longdike&ssid=-h%3B%20nvram%20set%20ssh_en%3D1%3B%20nvram%20commit%3B%20sed%20-i%20's%2Fchannel%3D.*%2Fchannel%3D%5C%22debug%5C%22%2Fg'%20%2Fetc%2Finit.d%2Fdropbear%3B%20%2Fetc%2Finit.d%2Fdropbear%20start%3B
    ```
    每个路由器 `stok` 这个值都不同，注意替换成你自己的。响应 `{"code":0}` 成功。  
6. 访问如下网址，将 root 的密码修改为 `admin`：  
    ```
    http://[注意替换IP]/cgi-bin/luci/;stok=[注意替换stok]/api/misystem/set_config_iotdev?bssid=Xiaomi&user_id=longdike&ssid=-h%3B%20echo%20-e%20'admin%5Cnadmin'%20%7C%20passwd%20root%3B
    ```
    响应 `{"code":0}` 修改密码成功。  

## 刷写 Breed
### SSH 连接
SSH 连接到 `192.168.31.1`（如果不是注意替换）：  

```Bash
$ ssh root@192.168.31.1
# 输入密码 admin 登录

BusyBox v1.25.1 (2020-08-28 12:02:06 UTC) built-in shell (ash)

 -----------------------------------------------------
       Welcome to XiaoQiang!
 -----------------------------------------------------
  $$$$$$\  $$$$$$$\  $$$$$$$$\      $$\      $$\        $$$$$$\  $$\   $$\
 $$  __$$\ $$  __$$\ $$  _____|     $$ |     $$ |      $$  __$$\ $$ | $$  |
 $$ /  $$ |$$ |  $$ |$$ |           $$ |     $$ |      $$ /  $$ |$$ |$$  /
 $$$$$$$$ |$$$$$$$  |$$$$$\         $$ |     $$ |      $$ |  $$ |$$$$$  /
 $$  __$$ |$$  __$$< $$  __|        $$ |     $$ |      $$ |  $$ |$$  $$<
 $$ |  $$ |$$ |  $$ |$$ |           $$ |     $$ |      $$ |  $$ |$$ |\$$\
 $$ |  $$ |$$ |  $$ |$$$$$$$$\       $$$$$$$$$  |       $$$$$$  |$$ | \$$\
 \__|  \__|\__|  \__|\________|      \_________/        \______/ \__|  \__|

root@XiaoQiang:~#
```

### 下载并刷写
```Bash
$ cd /tmp && wget http://openwrt.ink:8666/Breed/breed-mt7621-xiaomi-r3g.bin && mtd -r write breed-mt7621-xiaomi-r3g.bin Bootloader

Connecting to openwrt.ink:8666 (120.245.111.66:8666)
breed-mt7621-xiaomi- 100% |**********************************************************************************************************|   103k  0:00:00 ETA
Unlocking Bootloader ...

Writing from breed-mt7621-xiaomi-r3g.bin to Bootloader ...     
Rebooting ...
```

一分钟内路由器的 System 灯会由蓝变橘，最后再变蓝，代表 Breed 刷写成功。  
此时正常地自动重启后还是 2.0.7 的官方固件。  

## 进入 Breed
1. 将路由器断电。  
2. 按住路由器背板上的 <kbd>Reset</kbd> 键不放，并通电开机。  
3. System 灯先是变蓝（正常开机），然后变橙闪烁（系统升级中），然后变蓝闪烁（Breed）。  

## 修改环境变量
2. 浏览器访问 [192.168.1.1](http://192.168.1.1) 进入 Breed。  
3. 点击「环境变量编辑」->「添加」->「字段 `xiaomi.r3g.bootfw`」->「值为 `2`」。  

> 参考资料：  
> 《[\[AC2100(RM2100)\] 红米(小米)AC2100无需Telnet刷入Breed和Padavan固件教程](https://www.right.com.cn/forum/forum.php?mod=viewthread&tid=4054150)》  
> 《[[AC2100(RM2100)] 小米 红米【AC2100】一键刷BREED【30秒刷完】小白脑残专用 无需工具TELNET + 检查坏块](https://www.right.com.cn/forum/forum.php?mod=viewthread&tid=4066963)》  

## 然后刷写对应固件即可
自由发挥。  

### OpenWrt
> OpenWrt 才需要中间过度包，Padavan 直接在 Breed 下刷固件即可。  

1. 进入 Breed。  
2. 点击「固件更新」->「固件 选择文件」->「`AC2100-Breed-MiddleRom.bin`」。  

#### 更新确认
更新确认
文件已上传，请确认下方列出的信息
|类型|固件|
|:-:|:-:|
|文件名|AC2100-Breed-MiddleRom.bin|
|大小|5.74MB (6021640B)|
|MD5 校验|e4ee40826da31af4e93eb8b8c4e37dd7|

#### 更新完成
1. 路由器自动重启进入管理后台 [192.168.1.1](http://192.168.1.1/)。  
2. 默认没有设置密码，直接点击 <kbd>Login</kbd> 即可。  
3. 「菜单栏 `System`」->「Backup / Flash Firmware」->「Flash new firmware image」。  
4. 选择 `03.10-openwrt-ramips-mt7621-redmi-ac2100-squashfs-sysupgrade.bin`，上传并刷写。  

```
Flash image?
The flash image was uploaded. Below is the checksum and file size listed, compare them with the original file to ensure data integrity.
Click "Proceed" below to start the flash procedure.

Size: 23.73 MB
MD5: 0cbffbc04522af4bb263552839cb437d
SHA256: edc362f4fa256e773d3726f5d700c6ac3404fd3cb5bcbd68ebe74f575bfe6620
```
