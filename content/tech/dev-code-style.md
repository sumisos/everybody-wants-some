---
title: "个人偏好的代码范式"
date: 2021-05-15T14:39:07+08:00
tags: ["开发", "Code"]
series: ["范式"]
related: true
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

### JavaScript
《[Airbnb JavaScript 代码范式](https://airbnb.io/javascript)》[Github](https://github.com/airbnb/javascript)  
