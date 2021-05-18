---
title: "Python Web 框架 Django 的简单使用"
date: 2020-07-27T19:47:14+08:00
tags: ["Python", "Django", "API"]
series: ["API"]
related: true
---

> 本节内容大量参考《[Django REST Framework 官方文档](https://www.django-rest-framework.org/tutorial/quickstart/)》  

## 新建项目

> 当前（2020.7.27）使用的版本：  
> Python 3.8.2  
> pip 20.1.1  
> django 3.0.8 `python -m django --version`  
> djangorestframework 3.11.0  

创建项目目录，我将其命名为 `demo`：  
```bash
$ mkdir demo
$ cd demo
```

创建虚拟环境来隔离本地依赖：  
```bash
$ python -m venv env
$ source env/bin/activate    # Linux
$ .\env\Scripts\activate.bat # Windows
```

安装 Django 及相关依赖：  
```bash
$ pip install django
$ pip install djangorestframework
```

新建 Django 项目[^1]：  
```bash
$ django-admin startproject demo .
#                                ↑ 注意这个点 很关键
$ cd demo
$ django-admin startapp web
$ cd ..
```

执行数据库迁移（初始化数据库，默认为 `sqlite3`）并创建一个管理员用户：  
```bash
$ python manage.py migrate
$ python manage.py createsuperuser --email po@ews.ink --username admin
```

## 测试功能

接着是序列化类，新建 `./demo/web/serializers.py`：  
```Python
from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')
```

然后是视图 `./demo/web/views.py`：  
```Python
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from demo.web.serializers import UserSerializer, GroupSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    允许用户查看或编辑的API路径。
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    允许组查看或编辑的API路径。
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
```

最后是路由 `./demo/urls.py`：
```Python
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from rest_framework import routers
from demo.web import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework'))
]
```

## 全局配置

编辑 `./demo/settings.py` 以进行全局设置（比如打开分页或者只允许管理员访问）：  
```Python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # ...
    'rest_framework'
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAdminUser',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

运行临时服务以便测试：  
```bash
$ python manage.py runserver
```

尝试访问：  
```bash
$ curl -H 'Accept: application/json; indent=4' -u admin:password http://127.0.0.1:8000/users/
```

## 结论

整体流程跑通以后开始写业务，没写几行发现实在难受。  
编写过程和优雅两个字不沾边就算了。  
社区环境也差，差到令人难以置信这是 Python 最**流行**的 web 框架。  

总而言之言而总之，写网站这事——  
Python，不行。  
PHP / Go / Java，彳亍！  

与其用Python，我宁愿用 Java 写。  

至于 Flask，我以前也用过，确实比 Django **简洁**，但也比 Django **简陋**。  
等等，就目前来说，简陋好像算不上什么缺点。  
试试吧。  

[^1]: Django 中「项目」和「应用」的区别：分别由 `startproject` 和 `startapp` 创建，总体来说「项目 > 应用」。  
应用是一个专门做某件事的网络应用程序；项目则是一个网站使用的配置和应用的集合。项目可以包含很多个应用；应用可以被很多个项目使用。by [官方文档](https://docs.djangoproject.com/zh-hans/3.0/intro/tutorial01/#creating-the-polls-app)  
