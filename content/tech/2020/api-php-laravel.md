---
title: "PHP Web 框架 Laravel 的简单使用"
subTitle: "API 最后的技术选型"
date: 2020-09-07T15:29:44+08:00
tags: ["PHP", "Laravel", "API"]
series: ["API"]
related: true
toc: false
---

其实没什么好选的，我估摸着这个项目最终并发不太可能高到「不得不换 Java 或者 Go」的情况。  
所以在「满足作为一个 API 基本的要求」的情况下最优先的就是「快速开发」，那肯定是我~~朋友~~第一喜欢的 PHP了。  

## 准备开发环境
开发机是 Windows，从来没考虑过 VIM 写 PHP 是什么体验 ~~也不想尝试~~。  

新机器需要重新搭建开发环境，我不想用 WAMP 或者 PHPStudy 之类的。  
以前都用过，WAMP 实在臃肿，PHPStudy 还曝出过后门（虽然不是官方的，但不禁让人对官方的能力产生质疑）。  
至于 Win 版宝塔，不是没用过，体验真的不行。  

而且也完全没有必要，说白了我开发机上只要一个 PHP 和 Composer 而已，敲完代码直接丢内网树莓派上跑，设置好 PhpStorm 的自动部署就能做到随改随测。  

## 开始安装
安好 [PHP](https://windows.php.net/downloads/releases/) 和 [Composer](https://getcomposer.org/Composer-Setup.exe)。  

**PHP 选「线程安全」还是「非线程安全 (NTS = Non-Thread Safe)」无所谓。**  
Stack Overflow 上有两个相关问题：  

1. **[PHP 里的线程安全和非线程安全到底是啥玩意？](https://stackoverflow.com/questions/1623914/what-is-thread-safe-or-non-thread-safe-in-php)**  
如果只是把 PHP 当作 CGI 二进制程序/命令行/或者单线程（多进程）的其他环境，应该使用非线程安全（以提高运行效率）版本。  

2. **[Windows 上用 PHP 选线程安全还是非线程安全？](https://stackoverflow.com/questions/7204758/php-thread-safe-and-non-thread-safe-for-windows)**  
    * `Apache` + `LoadModule`: Thread Safe
    * `Apache` + `FastCGI`: Non-Thread Safe
    * `IIS`: Thread Safe
    * `IIS` + `FastCGI`: Non-Thread Safe
    > 我加一个 `Nginx`: Non-Thread Safe

总结一下：  
Linux 直接选「非线程安全」即可。  
Win 就更不用说了，开发环境而已，跑得动就行，出问题再解决。[^1]  

<blockquote>
  <p><b>What does thread safety mean when downloading PHP?</b></p>
  <p>Thread Safety means that binary can work in a multithreaded webserver context, such as Apache 2 on Windows. Thread Safety works by creating a local storage copy in each thread, so that the data won't collide with another thread.</p>
  <p>So what do I choose? <b>If you choose to run PHP as a CGI binary, then you won't need thread safety</b>, because the binary is invoked at each request. For multithreaded webservers, such as IIS5 and IIS6, you should use the threaded version of PHP.</p>
  <cite>——《<a href="https://www.php.net/manual/en/faq.obtaining.php">PHP 官方手册</a>》</cite>
</blockquote>

最终结论：无脑上「非线程安全」就完了。  

确定自己已经安好 PHP 和 Composer：  
```powerShell
$ php -v
PHP 7.4.10 (cli) (built: Sep  1 2020 16:52:39) ( ZTS Visual C++ 2017 x64 )
Copyright (c) The PHP Group
Zend Engine v3.4.0, Copyright (c) Zend Technologies

$ composer -V
Composer version 1.10.10 2020-08-03 11:35:19
```

创建 Laravel 项目：  
```PowerShell
$ composer create-project --prefer-dist laravel/laravel API

$ php artisan -V
Laravel Framework 7.27.0
```

> 2020.9.8 更新：Laravel 更了 v8.1.0，我已经升级了。  
> Laravel 这是想追上 PHP 版本号啊。~~不对已经追上了~~  

尝试在 `http://localhost:8000` 启动开发服务器：  
```PowerShell
$ php artisan serve
```

齐活。  

[^1]: （很久以前）Win 上 IIS 以 CGI 方式运行 PHP 会非常慢，因为是 CGI 模式是建立在**多进程**的基础上的，每个请求都需要重新加载和卸载整个 PHP 环境，消耗巨大。  
当时的解决方案是把 PHP 配置成 ISAPI（**多线程**），但这样做的话万一用到以 Linux 的**多进程**思想开发的 PHP 扩展，还是会搞崩 IIS。  
后来，为了解决这个问题，微软给出了兼顾效率和安全的 FastCGI 方案，即允许 PHP 进程的并发以及重复利用。这种方案解决了以前 CGI 无限开进程消耗过大的问题，同时利用了「CGI 不存在线程安全问题」的优势。  
脱离具体应用跨系统讨论进程和线程是一个很玄学的东西，如果不是立志于深耕操作系统方向的话不必深究。  
