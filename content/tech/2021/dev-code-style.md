---
title: "个人偏好的代码范式"
date: 2021-05-15T14:39:07+08:00
tags: ["开发", "Code"]
series: ["范式"]
related: true
draft: true
---

## 总则
~~《[如何编写无法维护的代码](https://coderlmn.github.io/frontEndCourse/unmaintainable.html)》~~  

```
#include　《studio.h》

mian viod（）
{printf“how to drive people mad./n"；
 　 retrun o;
   }
```

## 后端
### PHP
《[PHP 之道](http://laravel-china.github.io/php-the-right-way/#code_style_guide)》《[PSR 规范](https://learnku.com/docs/psr)》 [idea 插件](https://github.com/kalessil/phpinspectionsea)  
```php
<?php
namespace Vendor\Package;

use FooInterface;
use BarClass as Bar;
use OtherVendor\OtherPackage\BazClass;

class Foo extends Bar implements FooInterface
{
    public function sampleMethod($a, $b = null)
    {
        if ($a === $b) {
            bar();
        } elseif ($a > $b) {
            $foo->bar($arg1);
        } else {
            BazClass::bar($arg2, $arg3);
        }
    }

    final public static function bar()
    {
        // 方法体
    }
}
```

## 前端
《[基于Vue的前端架构，我做了这15点](https://juejin.cn/post/6901466994478940168)》  
《[京东凹凸实验室前端代码规范](https://guide.aotu.io/)》
《[腾讯 TGideas 文档库](https://tgideas.qq.com/doc)》
《[百度 JavaScript编码规范](https://github.com/ecomfe/spec/blob/master/javascript-style-guide.md)》
《[JavaScript Standard Style](https://github.com/standard/standard)》
《[Vue 官方风格指南](https://cn.vuejs.org/v2/style-guide/)》
《[阮一峰 ES6 编程风格](http:/es6.ruanyifeng.com/#docs/style)》
《代码整洁之道 Clean Code》
《[ES lint](https://eslint.bootcss.com/)》
《Pettier》

### JavaScript
《[Airbnb JavaScript 代码范式](https://airbnb.io/javascript)》[Github](https://github.com/airbnb/javascript)  
