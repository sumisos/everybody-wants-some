---
title: "Python Web 框架 Flask 的简单使用"
subTitle: "其实是 Flask 它儿子 Flask-RESTful"
date: 2020-07-28T15:14:47+08:00
tags: ["Python", "Flask", "API"]
series: ["API"]
related: true
---

> 本节内容大量参考《[Flask-RESTful 官方文档](https://flask-restful.readthedocs.io/en/latest/)》  

> 当前（2020.7.28）使用的版本：  
> Python 3.7.8（因为目前的 Flask-RESTful [说只支持3.7](https://flask-restful.readthedocs.io/en/latest/installation.html)）  
> pip 20.1.1  
> Flask 1.1.2  
> Flask-RESTful 0.3.8  

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

安装 Flask 及相关依赖：  
```bash
$ pip install flask
$ pip install flask_restful
```

构建如下文件结构：  
```
demo/                     项目根目录
├── env/                  虚拟环境
├── web/                  网站服务
│ ├── __init__.py
│ └── api.py              flask 入口
└── ...
```

编辑 `api.py` 文件：  
```Python
from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)
```

然后就可以用 `python web/api.py` 启动了。  
当然更优雅的方式是：  
```cmd
$ set FLASK_APP=web.api
$ set FLASK_ENV=development
$ flask run
```

实话说，Flask 的文档写得也不怎么样。但胜在简洁，感觉不错。  
