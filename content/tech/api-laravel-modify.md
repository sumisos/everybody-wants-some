---
title: "改造原生 Laravel 框架"
subTitle: "魔改 Laravel 并配置 DevOps Workflow"
date: 2020-09-07T17:20:26+08:00
tags: ["PHP", "Laravel", "DevOps"]
series: ["API"]
mermaid: true
related: true
---

> 2020.9.8 更新：注意 Laravel 更新了 8.1.0，而本文内容基于 7.x，仅供参考。  
> 但其实大体来说区别不大，有些许出入自行替换即可。  

> **需要特别注意**的是**路由写法**有较大变化（详见[相关文档](https://learnku.com/docs/laravel/8.x/routing/9365)）：  
> 
> 8.x 的路由需要明确指出控制器类来源：  
> `use App\Http\Controllers\DevController;`  
> `Route::get('/', [DevController::class, 'index']);`  
> 
> 不像 7.x `Route::get('/', 'DevController@index');` 写个字符串就行。  
> 
> 如果升级到 8.x 还是用后面一种写法会报错：  
> `Illuminate\Contracts\Container\BindingResolutionException`  
> `Target class [DevController] does not exist.`  
> 
> 如果项目控制器很多的话，确实现在写路由变得繁琐了。  
> 但我喜欢这种繁琐，更严谨更标准更有安全感。  
> 就算不扯那些，至少现在写路由 <kbd>CTRL</kbd>+<kbd>Click</kbd> 可以直达控制器，主观感受开发体验爽了不止一点半点。  

## 对 Laravel 原生框架进行改造
### 配置路由
这个项目是不带前端的纯后端 API，路由当然还是写在 `routes/api.php` 里，但访问时不需要加 `/api` 的 url 后缀了，因此直接在主域名引入即可。  

编辑 `app/Providers/RouteServiceProvider.php` 文件：  
```PHP
<?php
    // ......

    protected function mapApiRoutes()
    {
        Route::
            //prefix('api')->middleware('api')
            middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }

    // ......
```

这样在 `routes/api.php` 里写的路由就能直接访问了。  

### 仓库模式
想了下仓库模式还是要的，别的就算了。比方说你原来是写 Java Web 的，习惯了 AOP。反正有现成的成熟方案，好，切个服务层出来。  
我一个自用的个人项目，用 Laravel 都是为了快速开发，搞这么多不是撑得慌。  
**我确定仓库模式已经完全足够满足我的需求了。**  
如果我有无法满足的需求，局限性多半在框架，甚至语言问题上，那就不是项目架构分几层能解决的问题了。  
比如我要写爬虫（以前用 Laravel 的任务调度写过爬虫，岂是蛋疼二字能形容），我直接换语言了。  

> 之前用 Flask 写的第二个 API 就是用来干这个的。  

本节内容参考《[在 Laravel 5.8 中正确地应用 Repository 设计模式
](https://learnku.com/laravel/t/31798#3e0c15)》。  

首先构建如下文件结构：  
```
Laravel Project/
  ├── app/
  │ ├── Repositories/
  │ │ ├── DevRepository.php
  │ │ └── Interfaces/
  │ │   └── DevRepositoryInterface.php
  │ └── ...
  └── ...
```

编辑 `DevRepositoryInterface.php` 内容：  
```PHP
<?php

namespace App\Repositories\Interfaces;

interface DevRepositoryInterface
{
    public function test();

    public function getData(String $data);
}
```

编辑 `DevRepository.php` 内容：  
```PHP
<?php

namespace App\Repositories;

use App\Repositories\Interfaces\DevRepositoryInterface;

class DevRepository implements DevRepositoryInterface
{
    public function test()
    {
        return ['code' => 0, 'msg' => 'test pass'];
    }

    public function getData(String $data)
    {
        return ['code' => 0, 'data' => $data, 'msg' => 'get data success'];
    }
}
```

新建 `app/Http/Controllers/DevController` 文件：  
```PHP
<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\DevRepositoryInterface;

class DevController extends Controller
{
    private $devRepository;

    public function __construct(DevRepositoryInterface $devRepository)
    {
        $this->devRepository = $devRepository;
    }

    public function index()
    {
        return $this->devRepository->test();
    }

    public function getData(String $data)
    {
        return $this->devRepository->getData($data);
    }
}
```

注入服务容器：  
```PowerShell
$ php artisan make:provider RepositoryServiceProvider
Provider created successfully.
```

编辑 `app/Providers/RepositoryServiceProvider.php` 文件：  
```PHP
<?php

namespace App\Providers;

use App\Repositories\DevRepository;
use App\Repositories\Interfaces\DevRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            DevRepositoryInterface::class,
            DevRepository::class
        );
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
```

编辑 `config/app.php` 文件：  
```PHP
<?php
    // ......
    'providers' => [
        // ......

        /*
         * Application Service Providers...
         */
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        // App\Providers\BroadcastServiceProvider::class,
        App\Providers\EventServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
        // 加上下面这行
        App\Providers\RepositoryServiceProvider::class,  // 仓库模式

    ],
    // ......
```

最后清空缓存即可：  
```PowerShell
$ php artisan config:clear
Configuration cache cleared!
```

仓库模式已经实现了。  

测试一下，编辑 `routes/api.php` 路由文件：  
```PHP
<?php
// ......

Route::prefix('v1')->group(function () {
    Route::get('/test', 'DevController@index');
    Route::get('/test/{data}', 'DevController@getData');
});
```

访问 `http://localhost:8000/v1/test` 响应：  
（已经配置过路由了，否则要用 `http://localhost:8000/api/v1/test`）  
```JSON
{"code":0,"msg":"test pass"}
```

访问 `http://localhost:8000/v1/test/something` 响应：  
```JSON
{"code":0,"data":"something","msg":"get data success"}
```

### 全局公共函数
首先构建如下文件结构：  
```
Laravel Project/
  ├── app/
  │ ├── Helper/
  │ │ ├── BasicHelper.php
  │ │ └── StringHelper.php
  │ └── ...
  └── ...
```

编辑 `BasicHelper.php` 文件：  
```PHP
<?php
/* 全局公共函数 */

/* 字符串相关 */
require_once('StringHelper.php');
```

编辑 `StringHelper.php` 文件：  
```PHP
<?php

/**
 * 字符串两次md5加密
 * @param string 要加密的字符串
 * @return string 加密后字符串
 */
function double_md5($str)
{
    return md5(md5(trim($str)));
}
```

编辑 `composer.json` 文件：  
```PHP
    "autoload": {
        "psr-4": {
            "App\\": "app/"
        },
        "classmap": [
            "database/seeds",
            "database/factories"
        ],
        "files": [
            "app/Helper/BasicHelper.php"
        ]
    },
```

最后重载：  
```PowerShell
$ composer dumpautoload
Generating optimized autoload files
> Illuminate\Foundation\ComposerScripts::postAutoloadDump
> @php artisan package:discover --ansi
Discovered Package: facade/ignition
Discovered Package: fideloper/proxy
Discovered Package: fruitcake/laravel-cors
Discovered Package: laravel/tinker
Discovered Package: nesbot/carbon
Discovered Package: nunomaduro/collision
Package manifest generated successfully.
Generated optimized autoload files containing 4421 classes
```

全局公共函数配置完成，以后写在 helper 里的函数就可以直接用了，测试一下。  

路由：  
```PHP
Route::get('/test/md5/{data}', 'DevController@md5');
```

控制器：  
```PHP
public function md5(String $data)
{
    return ['code' => 0, 'data' => double_md5($data)];
}
```

访问 `http://localhost:8000/v1/test/md5/something` 响应：  
```JSON
{"code":0,"data":"653844a830d8604918fa4452fc54af17"}
```

### 跨域限制
人都是利己的，爬人家接口的时候当然想方设法**反**反爬。  
轮到自己写接口了，肯定想法设法**搞**反爬。  
至少最简单的规范做一下吧。  

以前 Laravel cors 还要自行引入第三方包的，我用的 [`fruitcake/laravel-cors`](https://github.com/fruitcake/laravel-cors)，结果 Laravel 7 开始（我记得是）官方直接招安了。  

编辑 `config/cors.php` 文件：  
```PHP
<?php
    // ......

    'allowed_origins' => [
        //'*'
        'http://localhost:8000'  // 方便本地调试
    ],

    'allowed_origins_patterns' => [
        '/^http(s)?:\/\/([\w\-_]+\.)?your\.site(\/.*)?$/i',
    ],

    // ......
```

正则随便写的，有优化欢迎交流。  
测试一下。

路由：  
```PHP
Route::get('/test/cors', 'DevController@cors');
```

控制器：  
```PHP
<?php

public function cors(Request $request)
{
    // 组装标准响应结果
    function get_resp($data = null, String $msg = null, Int $code = 0)
    {
        $resp = ['code' => $code];
        if ($data) $resp['data'] = $data;
        if ($msg) $resp['msg'] = $msg;
        return $resp;
    }

    $cors_option = config('cors');  // 读取 config/cors.php
    $origin = $request->header('Origin');  // 读取当前请求来源

    // 模拟 vendor/asm89/stack-cors/src/CorsService.php -> isOriginAllowed() 验证 cors
    if (is_null($origin)) return get_resp(null, 'No Origin', -1);
    if (in_array($origin, $cors_option['allowed_origins'])) {
        return get_resp($origin, 'Pass by match');
    }
    foreach ($cors_option['allowed_origins_patterns'] as $pattern) {
        if (preg_match($pattern, $origin)) return get_resp($origin, 'Pass by pattern');
    }
    return get_resp($origin, 'NOT Pass', -1);
}
```

测试常见的合法域名：  
```JSON
{
    "code": 0,
    "data": "http://localhost:8000",
    "msg": "Pass by match"
}
{
    "code": 0,
    "data": "http://www.your.site",
    "msg": "Pass by pattern"
}
{
    "code": 0,
    "data": "http://this.is-sub_domain.your.site",
    "msg": "Pass by pattern"
}
{
    "code": 0,
    "data": "http://cdn.your.site/something/!@$%^&*what-ever",
    "msg": "Pass by pattern"
}
{
    "code": 0,
    "data": "https://your.site",
    "msg": "Pass by pattern"
}
{
    "code": 0,
    "data": "https://api.your.site/v1/test",
    "msg": "Pass by pattern"
}
```

测试常见的伪装的非法域名：  
```JSON
{
    "code": -1,
    "data": "http://ayour.site",
    "msg": "NOT Pass"
}
{
    "code": -1,
    "data": "http://your.site.faker.com",
    "msg": "NOT Pass"
}
{
    "code": -1,
    "data": "https://faker.com/your.site",
    "msg": "NOT Pass"
}
{
    "code": -1,
    "data": "https://faker.com?fake=your.site",
    "msg": "NOT Pass"
}
{
    "code": -1,
    "data": "https://faker.com#your.site",
    "msg": "NOT Pass"
}
```

做完这几步就可以开始写业务了。  

## DevOps 工作流

虽然已经可以开始干活了，不过一个成熟的项目当然少不了版本管理和自动部署。  

<div class="mermaid" align="center">
graph TD
Start(源码<br />Source Repo) -->|dev 分支| a1[开发环境]
Start -->|test 分支| b1[测试环境]
Start -->|master 分支| c1[生产环境]
a1 --> |本地命令行调用<br />`php artisan serve`| a2[本机]
b1 --> |PhpStorm 自动部署<br />Tools/Deployment<br />Automatic Upload| b2[树莓派]
c1 --> |push hook<br />Github Action| c2[生产机服务器]
a2 --> |PHP CLI| a3[localhost]
b2 --> |内网穿透|b3[test.api.com]
c2 --> |线上| c3[api.com]
</div>

* `localhost` 本地开发支持热重载，追求一个（无其他任何依赖的）即时可见  
* `test.api.com` 由 IDE 全自动同步到树莓派，树莓派再通过内网穿透以及基本相似的服务器架构映射到外网上，形成与真实生产环境无限接近（但控制权完全在我，我伸手就能拔线）的测试环境
* `api.com` 平时在 dev 分支上开发，当测试完毕 push 之后 merge 到 master 分支，然后通过钩子触发 Github Action 自动部署到生产环境

乍一看可能有点繁琐，但还是那句话，这是几乎**一劳永逸**的事：  
* 我只需要本地改代码，改完**即刻**就能看到效果（`localhost`）  
* 稍等数秒，访问 `test.api.com` 就能看到放测试环境（几乎与生成环境相同）上有没有新问题，而不需要任何额外操作  
  （上传到内网是监控文件改动并自动同步的，甚至 Ctrl+S 都不用按，切窗口都自动保存自动上传）  
* 写完正常 push 就是，dev 分支对生产环境没有任何影响  
* 测完没问题直接 merge，等待几十秒后，生产环境 `api.com` 已经上线了  
  （甚至切到 master merge 完再切回来我也写了脚本代劳，一行代码搞定）

爽到飞起。  

## （附录）更新树莓派里的虚拟机里的环境

更新 Composer：  
```bash
$ /usr/bin/composer self-update
```

更换阿里云镜像源：  
```bash
$ composer config -g repo.packagist composer https://mirrors.aliyun.com/composer
```
该取消禁用的 PHP 函数请取消。  

报错内存不足：  
```
mmap() failed: [12] Cannot allocate memory
PHP Fatal error:  Out of memory (allocated 767565824) (tried to allocate 16777216 bytes) in phar:///usr/bin/composer/src/Composer/DependencyResolver/Solver.php on line 223
```

如果内存不足，扩展虚拟内存：  
```bash
$ free -m
# Swap 大概率是 0

$ dd if=/dev/zero of=/swapfile bs=1M count=1024
$ chmod 600 /swapfile
$ mkswap /swapfile
$ swapon /swapfile
$ free -m
```

两层 nginx 只需要里面一层做伪静态即可实现[优雅链接](https://learnku.com/docs/laravel/8.x/installation/9354#web-server-configuration)：  
```
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

外面一层仅做反向代理，所谓反向代理，就是用户无感知的代理。  

> 最后弄完算了一下我放在树莓派上的测试环境套了一层又一层：lnmp 的虚拟机端口映射到内网的 80，接着内网穿透到公网服务器某端口，外网又套了一层 nginx 反向代理内网穿透出来的某端口。  
> `公网服务器 -> 套nginx -> 套内网穿透 -> 套树莓派 -> 套虚拟机 -> 套nginx`  
> 感觉也只能用来测试了，真要当生产力的话，多一层套娃等于砍一截瓶颈。  
> 不过好玩确实挺好玩的。  