---
title: "Mastodon 的安装与部署"
date: 2020-05-05T17:59:54+08:00
tags: ["Linux", "运维", "CentOS", "Mastodon"]
series: ["运维"]
related: true
---

前略，总之决定自建一个 SNS，了解相关知识之后决定使用 Mastodon。  

<!-- More -->

##  前置工作
网上很多文档提到的——直接指向[官方文档仓库](https://github.com/tootsuite/documentation/tree/master/content/en)的链接——都已经失效了，现在这个仓库是[文档页面](https://docs.joinmastodon.org)的静态文件。  
彳亍口巴，看看[dockerfile](https://hub.docker.com/r/tootsuite/mastodon/dockerfile)，发现也是用的「ubuntu:18.04」，但我想装在 centos 上，只能摸着石头过河。  
众所周知，搜索引擎的正确用法是输入关键词空格关键词，不是输入问题。（它只是个搜索引擎，不是什么超智能  AI)
用「centos」「mastodon」搜索发现 Vultr 的文档站居然有一篇名为《[Installing Mastodon on CentOS 7](https://www.vultr.com/docs/installing-mastodon-on-centos-7)》的部署教程。  
虽然名字看起来很美好，但它是 2017 年底写就的，时效性堪忧，不过至少可以尝试照猫画虎了。  

>  根据最新（2020.5.5）dockerfile 得知依赖为：
> * [Node](https://nodejs.org/download/release/) 12.16.1
> * [Ruby](https://cache.ruby-lang.org/pub/ruby/) 2.6.6
>  由于准备安装最新版的 Mastodon（v3.1.3），依赖包版本尽量对齐标准。  

###  尝试使用  CentOS
经过一晚上+一上午的尝试最后被 Nginx 配置劝退了，我 Nginx 还有其他生产环境，实在不能乱搞。  
简单说下踩的坑：
####  安装 Ruby
   由于《[Installing Mastodon on CentOS 7](https://www.vultr.com/docs/installing-mastodon-on-centos-7)》这篇文档里的安装方式过于奇怪……  
   我换了种简单明了的方式安装并升级到 2.6，但升级后的版本也只有 2.6.2。  
   为了避免兼容问题，我按照官方文档的安装方式重装了一次。  
   即  `git clone` [rbenv](https://github.com/rbenv/rbenv) & [ruby-build](https://github.com/rbenv/ruby-build)  后运行`RUBY_CONFIGURE_OPTS=--with-jemalloc rbenv install 2.6.6`安装。  

####  安装  PostgreSQL
PostgreSQL  所需的**全部依赖包**应该是：
```bash
$ yum -y install postgresql96-server postgresql96-contrib libpqxx-devel protobuf-devel \
  postgresql-libs postgresql-devel
```
注意`postgresql-libs`和`postgresql-devel`这两个包一定要安装（文档里没有），否则之后配置的时候会报错找不到`pg`。  
总之之后配置的时候应该运行的是：
```bash
$ gem install pg -v '1.2.3' --source 'https://rubygems.org/' #  本来没有这一行   报错提示要先安装 pg
$ bundle config build.pg --with-pg-config=/usr/pgsql-9.6/bin/pg_config
$ bundle config deployment 'true'
$ bundle config without 'development test'
$ bundle install -j$(getconf _NPROCESSORS_ONLN)
```

####  生成密钥
`RAILS_ENV=production bundle exec rake secret`运行两次就够了。  
最新的版本配置文件里已经没有`PAPERCLIP_SECRET`这一项了。  

####  数据库迁移
由于文档太旧并没有提到这个问题，现在直接运行`RAILS_ENV=production bundle exec rails db:setup`应该会报错：
```bash
Execute strong_migrations:safety_assured
rails aborted!
Set SAFETY_ASSURED=1 to run this task in production
```
修复：
```bash
$ vim .env.production #  当前位于  Mastodon  项目目录下
#  加上  SAFETY_ASSURED=1  这一行
#  保存并退出
```
切换到`postgres`用户：
```bash
$ su - postgres
```
运行`psql`进入数据库命令行终端，再继续执行
```PostgreSQL
postgres=# DROP DATABASE mastodon;
postgres=# \q
```
来删除之前「已新建数据库，但继续执行后续的迁移任务时，抛出错误并终止」所产生的`mastodon`数据库。  

>  注意如果没报错就不用删库重建了。~~有兴趣尝试的应该都是运维老鸟，大概也用不着我再多嘴提醒。~~

以上内容基于  2020.5.6  在  CentOS 7.3.1611  上的尝试，我放弃了。  
另外搞一台 Ubuntu 用 docker 装岂不美哉。  

##  正式开始
###  准备工作
#### SMTP 邮件服务
一定要准备好，即使你准备单人用，用一般方式注册管理员也要通过邮箱验证。  

> $TODO  暂时直接使用第三方 SMTP 服务   后续使用自己的域名自行搭建邮箱服务器

Mastodon  官方推荐  SMTP  服务使用  Mailgun  或者  SparkPost，简单评价一下。  

Mailgun  已经没有每月  10k  封的免费额度了，现在（2020.5.7）填完信用卡可以**试用三个月**，每月  5k  封。  
超过额度以后价格是  $0.8 / 1k  封。~~感觉这个价格定得很微妙~~

![](https://i.loli.net/2020/05/07/IRfU4dNaHx6keGz.jpg)

SparkPost  不支持大陆的  IP  注册，我是换成香港  IP  注册成功的。  
免费额度是每月共  500  封，每天最多不超过  100  封。  
最便宜的套餐是  $20 /  月，每月  50k  封，算下来平均  $0.4 / 1k  封，比  Mailgun  便宜一倍。  
但他是包月套餐，就是说买完不管你用不用一个月都会花  $20，Mailgun  胜在灵活。~~我又不买搁这算锤子呢~~

如果没有特殊需求可以直接用  outlook：
```
服务器名称 : smtp.office365.com
端口 : 587
加密方法 : STARTTLS
```
缺点是后缀是普通的  `@outlook.com`  或者  `@hotmail.com`，直观的可信程度比较低。  
而且微软不让使用  `noreply`  之类的关键词，建议直接使用根域名当作用户名，比如  `ews.ink@outlook.com`。  

>  至于垃圾邮件的问题，据相关从业人员称（[来源](https://www.v2ex.com/t/664875)）：
> *  很多服务商根本不看  mail-tester  那一套。每家都有自己的标准，这个标准有的公开，有的不公开。进不进垃圾邮件这个规律，外人也基本摸不到，因为线上的  antispam  规则是训练出来的，且每日更新。  
> *  进不进垃圾邮件这个规律，除了几条死规则，甚至内部人员也基本摸不到。毕竟很难用常规逻辑去理解深度模型。  
> 
>  要我说，垃圾邮件就垃圾邮件吧，提醒一下用户就行了，不必过于在意，反正也强求不来。  

####  扩展内存
如果  VPS  内存不到  2G，请查看  swap  虚拟内存。  
```bash
$ free -m
```
如果  free Swap （剩余交换区大小）不到  1G，就给它加  1G：
```bash
$ swapoff -a
$ dd if=/dev/zero of=/swapfile bs=1M count=1024
$ mkswap /swapfile
$ swapon /swapfile
```
设置开机自动启动，运行  `vim /etc/fstab`，配置为：
```bash
/swapfile swap swap defaults 0 0
```

`reboot`重启服务器之后  `free -m`  查看是否生效。  

####  其他
安装  docker CE  以及  docker-compose，略。  

###  新建用户
```bash
$ adduser --disabled-login mastodon  #  新建  Mastodon  专属用户
$ usermod -aG docker mastodon  #  将  mastodon  用户加入  docker  组
```

###  下载主程序
```bash
$ su - mastodon  #  切换到  mastodon  用户
$ pwd  #  应该在  /home/mastodon
$ git clone https://github.com/tootsuite/mastodon.git
$ cd mastodon
$ cp .env.production.sample .env.production
```

###  构建  docker  镜像
```bash
$ docker-compose build
```
耐心等待，中途报错不用管（也管不了），经过漫长的等待之后终于成功了：
```bash
Successfully built <docker image id>
Successfully tagged tootsuite/mastodon:latest
```
运行  `docker images`  就可以看到构建好的镜像了。  

###  编辑配置
运行交互式安装向导：
```bash
$ docker-compose run --rm web bundle exec rake mastodon:setup
```

执行以下命令**两次**，并分别**记录**好回显的密钥：
```bash
$ docker-compose run --rm web bundle exec rake secret
```
然后  `vim .env.production`  把密钥分别填入  `SECRET_KEY_BASE`  和  `OTP_SECRET`。  

或者**换种方式（和上面的方式二选一）**直接用  `sed`  完成：
```bash
$ SECRET_KEY_BASE=$(docker-compose run --rm web bundle exec rake secret)
$ sed -i -e "s/SECRET_KEY_BASE=/&${SECRET_KEY_BASE}/" .env.production

$ OTP_SECRET=$(docker-compose run --rm web bundle exec rake secret)
$ sed -i -e "s/OTP_SECRET=/&${OTP_SECRET}/" .env.production
```

继续生成  `Web Push VAPID`  所需的密钥对：
```bash
$ docker-compose run --rm web bundle exec rake mastodon:webpush:generate_vapid_key
```
**记录好**生成的  `VAPID_PRIVATE_KEY`  和  `VAPID_PUBLIC_KEY`，并运行  `vim .env.production`  把密钥分别填入对应位置。  
```
VAPID_PRIVATE_KEY=
VAPID_PUBLIC_KEY=
```

顺便把  `LOCAL_DOMAIN`  默认的  `example.com`  修改为要使用的域名。  
此外记得配置好  SMTP，否则没办法用正常方式注册。  

配置结束之后重新构建镜像：
```bash
$ docker-compose build
```
又是漫长的等待。  

###  运行容器
```bash
$ docker-compose up -d
```
运行  `docker ps`  就可以看到正在运行的  docker  容器了。  

Nginx  配置和申请  SSL  证书，略。  

##  官方文档
本节内容翻译自「[官方文档  -  安装](https://docs.joinmastodon.org/admin/install/)」（2020.5.6）。  

###  安装依赖
#### Node.js
```bash
$ curl -sL https://deb.nodesource.com/setup_12.x | bash -
```
#### Yarn
```bash
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
$ apt-get update
```

####  系统 lib 库
```bash

$ apt-get install -y \
  imagemagick ffmpeg libpq-dev libxml2-dev libxslt1-dev file git-core \
  g++ libprotobuf-dev protobuf-compiler pkg-config nodejs gcc autoconf \
  bison build-essential libssl-dev libyaml-dev libreadline6-dev \
  zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev \
  nginx redis-server redis-tools postgresql postgresql-contrib \
  certbot python-certbot-nginx yarn libidn11-dev libicu-dev libjemalloc-dev
```

###  安装  Ruby
我们应该安装  `rbenv`  来管理  Ruby  版本，因为这样可以非常方便地获取指定版本，更新的时候升级到最新版本也很简单。  

`rbenv`  是和  Linux  用户绑定的，因此，首先我们需要新建一个用户来专门运行  Mastodon：
```bash
$ adduser --disabled-login mastodon
```
然后切换到这个用户：
```bash
$ su - mastodon
```

利用  Git  下载  `rbenv`  和  `rbenv-build`：
```bash
$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
$ cd ~/.rbenv && src/configure && make -C src
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
$ exec bash
$ git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
```

Clone  下来之后，我们就可以安装指定版本的  Ruby  了：
```bash
$ RUBY_CONFIGURE_OPTS=--with-jemalloc rbenv install 2.6.6  #  安装  2.6.6
$ rbenv global 2.6.6  #  应用到全局
```

我们还需要安装  `bundler`（Ruby  的包管理器，类似  Node  的  npm）：
```bash
$ gem install bundler --no-document
```

全部安装完成之后，退出  mastodon  用户：
```bash
$ exit
```

###  配置  PostgreSQL
####  进阶设置（可选）
可以使用  [pgTune](https://pgtune.leopard.in.ua/#/)  生成合适的配置，编辑  `/etc/postgresql/9.6/main/postgresql.conf`  里面想要自定义的设置项，然后运行  `systemctl restart postgresql`  重启  PostgreSQL。  

####  新建用户
你还需要一个  PostgreSQL  数据库用户来给  Mastodon  使用。  
最基础的账户配置是简单地使用  `ident`  鉴权，即**PostgreSQL  用户不设置单独的密码，可以直接被同名的  Linux  用户使用**。  
（用人话说，默认选项不做额外配置，Linux `adduser`  的  mastodon  用户直接被**视为**同名的  PostgreSQL  的  mastodon  用户）

打开  PostgreSQL  的命令行终端：
```bash
$ sudo -u postgres psql
```
运行以下命令：
```PostgreSQL
postgres=# CREATE USER mastodon CREATEDB;
postgres=# \q
```
搞定。  

###  安装并配置  Mastodon
首先切换到  mastodon  用户：
```bash
$ su - mastodon
```

####  下载  Mastodon  主程序
从  Github clone  最新的稳定版本（截至  2020.5.6  为  [v3.1.3](https://github.com/tootsuite/mastodon/releases/tag/v3.1.3)）：
```bash
$ git clone https://github.com/tootsuite/mastodon.git live && cd live
$ git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)
```

####  安装必要依赖
现在安装的是  Ruby  和  JavaScript  的依赖：
```bash
$ bundle config deployment 'true'  #  第一次运行需要配置
$ bundle config without 'development test'  #  第一次运行需要配置
#  上面两行只有全新安装时需要配置，升级或者重装都不需要再配置
$ bundle install -j$(getconf _NPROCESSORS_ONLN)
$ yarn install --pure-lockfile
```

####  生成配置文件
运行交互式安装向导：
```bash
$ RAILS_ENV=production bundle exec rake mastodon:setup
```
这一步将：
*  创建新的配置文件
*  预编译前端资源
*  执行数据库迁移（用人话说，初始化数据库）

生成的配置文件名为  `.env.production`，你~~可以~~  必须按照你的实际情况编辑配置文件，详情可以参考《[官方文档  -  配置](https://docs.joinmastodon.org/admin/config/)》。  
（截至  2020.5.6，这个页面基本只把所有设置项列出来了，几乎没有参考价值，`This page is under construction.`）

配置完之后，从  mastodon  退回到  root  用户：
```bash
$ exit
```

####  配置  Nginx
把模版配置文件复制到  Nginx  的工作目录下：
```bash
$ cp /home/mastodon/live/dist/nginx.conf /etc/nginx/sites-available/mastodon
$ ln -s /etc/nginx/sites-available/mastodon /etc/nginx/sites-enabled/mastodon
```
编辑配置文件：
```bash
$ vim /etc/nginx/sites-available/mastodon
```
把  `example.com`  替换为你的域名，其他细节视具体情况灵活变动。  

重载  Nginx  来让新配置生效。  

申请  SSL  证书，略。  

###  注册系统服务
把  Mastodon  提前写好的系统服务模版文件复制到正确的路径：
```bash
$ cp /home/mastodon/live/dist/mastodon-*.service /etc/systemd/system/
```

然后**根据实际情况**确定里面写的「用户名」「文件路径」等配置都没有问题：
* `vim /etc/systemd/system/mastodon-web.service`
* `vim /etc/systemd/system/mastodon-sidekiq.service`
* `vim /etc/systemd/system/mastodon-streaming.service`

最后，启动并使能这三个新的系统服务：
```bash
$ systemctl daemon-reload
$ systemctl start mastodon-web mastodon-sidekiq mastodon-streaming
$ systemctl enable mastodon-*
```
注册为系统服务后，每次重启服务器都会自动启动  Mastodon  了。  

官方文档全部配置完成，访问你的域名，你也有自己的长毛象实例啦。  

###  获取管理员
成功注册账户之后回到服务器：
```bash
$ RAILS_ENV=production bin/tootctl accounts modify [你的账号名] --role admin
```

##  更新版本

```bash
$ cd <你的 Mastodon 项目路径>
$ git fetch && git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)

#  获取新版本有很多方法，比如还可以
$ git describe --tags `git rev-list --tags --max-count=1`
#  不一定非得用某种方法，总之能得出最新版本号并  git checkout  切换过去就行

$ docker-compose build #  重建  Image
$ docker-compose up -d #  重启  Container
```