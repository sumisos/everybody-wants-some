---
title: "宝塔面板 Cheat Sheet"
subTitle: "宝塔 Linux 面板命令大全"
date: 2021-05-17T10:50:51+08:00
tags: ["Linux", "运维", "JavaScript", "bt.cn"]
series: ["运维"]
related: true
---

<span class="sticker">[![](https://img.shields.io/badge/来源-官方文档-info)](https://www.bt.cn/btcode.html) ![](https://img.shields.io/badge/最后更新于-2021--05--17-blue)</span>

手动抄了十分钟才发现这也太长了，要抄到猴年马月去啊，蠢死了。  
还是简单写个爬虫吧：  

```JavaScript
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let spider = (url) => {
  axios
    .get(url)
    .then((response) => {
      let $ = cheerio.load(response.data);
      let content = $("div.bt_code_all").first();

      let titles = [];
      content.find("h2.th2").each(function (i, elem) {
        titles[i] = $(this).text();
      });

      let chapters = [];
      content.find("div.btcode").each(function (i, elem) {
        chapters[i] = [];
        $(this)
          .find("span")
          .not(".info")
          .each(function (j, elem) {
            chapters[i][j] = {};
            chapters[i][j].section = $(this).text();
          });
        $(this)
          .find("pre")
          .each(function (j, elem) {
            chapters[i][j].text = $(this).text();
          });
      });

      let data = { titles: titles, chapters: chapters };

      let markdown = "";
      for (let i = 0; i < data.titles.length; i++) {
        markdown += "## " + data.titles[i] + "\n";
        for (let j = 0; j < data.chapters[i].length; j++) {
          markdown += "### " + data.chapters[i][j].section + "\n";
          markdown += "```\n" + data.chapters[i][j].text + "\n```\n\n";
        }
      }

      fs.writeFile("output.md", markdown.trim(), "utf8", (err) => {
        if (err) {
          console.log("写入文件失败! 错误信息: " + err);
        } else {
          console.log("已将爬取结果保存到 output.md");
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

spider("https://www.bt.cn/btcode.html");
```

## 安装宝塔
### Centos 安装脚本
```
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

### Ubuntu/Deepin 安装脚本
```
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh
```

### Debian 安装脚本
```
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && bash install.sh
```

### Fedora 安装脚本
```
wget -O install.sh http://download.bt.cn/install/install_6.0.sh && bash install.sh
```

## 管理宝塔
### 宝塔工具箱
```
bt
```

### 停止面板
```
/etc/init.d/bt stop
```

### 启动面板
```
/etc/init.d/bt start
```

### 重启面板
```
/etc/init.d/bt restart
```

### 卸载面板
```
/etc/init.d/bt stop && chkconfig --del bt && rm -f /etc/init.d/bt && rm -rf /www/server/panel
```

### 查看当前面板端口
```
cat /www/server/panel/data/port.pl
```

### 修改面板端口，如要改成 8881（CentOS 6）
```
echo '8881' > /www/server/panel/data/port.pl && /etc/init.d/bt restart
iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 8881 -j ACCEPT
service iptables save
service iptables restart
```

### 修改面板端口，如要改成 8881（CentOS 7）
```
echo '8881' > /www/server/panel/data/port.pl && /etc/init.d/bt restart
firewall-cmd --permanent --zone=public --add-port=8881/tcp
firewall-cmd --reload
```

> 多行代码块 `<pre>` 官网只显示一行，真 nm 绝了，排版鬼才。  

### 强制修改 MySQL 管理密码，如要改成 123456
```
cd /www/server/panel && python tools.py root 123456
```

### 修改面板密码，如要改成 123456
```
cd /www/server/panel && python tools.py panel 123456
```

### 查看宝塔日志
```
cat /tmp/panelBoot.pl
```

### 查看软件安装日志
```
cat /tmp/panelExec.log
```

### 站点配置文件位置
```
/www/server/panel/vhost
```

### 删除域名绑定面板
```
rm -f /www/server/panel/data/domain.conf
```

### 清理登陆限制
```
rm -f /www/server/panel/data/*.login
```

### 查看面板授权 IP
```
cat /www/server/panel/data/limitip.conf
```

### 关闭访问限制
```
rm -f /www/server/panel/data/limitip.conf
```

### 查看许可域名
```
cat /www/server/panel/data/domain.conf
```

### 关闭面板 SSL
```
rm -f /www/server/panel/data/ssl.pl && /etc/init.d/bt restart
```

### 查看面板错误日志
```
cat /tmp/panelBoot
```

### 查看数据库错误日志
```
cat /www/server/data/*.err
```

### 站点配置文件目录（Nginx）
```
/www/server/panel/vhost/nginx
```

### 站点配置文件目录（Apache）
```
/www/server/panel/vhost/apache
```

### 站点默认目录
```
/www/wwwroot
```

### 数据库备份目录
```
/www/backup/database
```

### 站点备份目录
```
/www/backup/site
```

### 站点日志
```
/www/wwwlogs
```

## Nginx 服务管理
### Nginx 安装目录
```
/www/server/nginx
```

### 启动 Nginx
```
/etc/init.d/nginx start
```

### 停止 Nginx
```
/etc/init.d/nginx stop
```

### 重启 Nginx
```
/etc/init.d/nginx restart
```

### 重载 Nginx 配置
```
/etc/init.d/nginx reload
```

### Nginx 配置文件位置
```
/www/server/nginx/conf/nginx.conf
```

## Apache 服务管理
### Apache 安装目录
```
/www/server/httpd
```

### 启动 Apache
```
/etc/init.d/httpd start
```

### 停止 Apache
```
/etc/init.d/httpd stop
```

### 重启 Apache
```
/etc/init.d/httpd restart
```

### 重载 Apache 配置
```
/etc/init.d/httpd reload
```

### Apache 配置文件位置
```
/www/server/apache/conf/httpd.conf
```

## MySQL 服务管理
### MySQL 安装目录
```
/www/server/mysql
```

### phpMyAdmin 安装目录
```
/www/server/phpmyadmin
```

### 数据存储目录
```
/www/server/data
```

### 启动 MySQL
```
/etc/init.d/mysqld start
```

### 停止 MySQL
```
/etc/init.d/mysqld stop
```

### 重启 MySQL
```
/etc/init.d/mysqld restart
```

### 重载 MySQL 配置
```
/etc/init.d/mysqld reload
```

### MySQL 配置文件位置
```
/etc/my.cnf
```

## FTP 服务管理
### FTP 安装目录
```
/www/server/pure-ftpd
```

### 启动 FTP
```
/etc/init.d/pure-ftpd start
```

### 停止 FTP
```
/etc/init.d/pure-ftpd stop
```

### 重启 FTP
```
/etc/init.d/pure-ftpd restart
```

### FTP 配置文件位置
```
/www/server/pure-ftpd/etc/pure-ftpd.conf
```

## PHP 服务管理
### PHP 安装目录
```
/www/server/php
```

### 启动 PHP
```
/etc/init.d/php-fpm-{52|53|54|55|56|70|71|72|73|74} start
```

### 停止 PHP
```
/etc/init.d/php-fpm-{52|53|54|55|56|70|71|72|73|74} stop
```

### 重启 PHP
```
/etc/init.d/php-fpm-{52|53|54|55|56|70|71|72|73|74} restart
```

### 重载 PHP 配置
```
/etc/init.d/php-fpm-{52|53|54|55|56|70|71|72|73|74} reload
```

###  PHP 配置文件位置
```
/www/server/php/{52|53|54|55|56|70|71|72|73|74}/etc/php.ini
```

## Redis 服务管理
### Redis 安装目录
```
/www/server/redis
```

### 启动 Redis
```
/etc/init.d/redis start
```

### 停止 Redis
```
/etc/init.d/redis stop
```

### Redis 配置文件位置
```
/www/server/redis/redis.conf
```

## Memcached 服务管理
### Memcached 安装目录
```
/usr/local/memcached
```

### 启动 Memcached
```
/etc/init.d/memcached start
```

### 停止 Memcached
```
/etc/init.d/memcached stop
```

### 重启 Memcached
```
/etc/init.d/memcached restart
```

### 重载 Memcached 配置
```
/etc/init.d/memcached reload
```
