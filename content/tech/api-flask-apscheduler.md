---
title: "Python 定时任务框架 APScheduler"
subTitle: "Flask-RESTful + APScheduler"
date: 2020-08-21T10:58:03+08:00
tags: ["Python", "Flask", "API", "APScheduler"]
series: ["API"]
related: true
---

Python 的定时任务调度，选择最成熟的 APScheduler，没什么问题。  

一开始尝试直接引入 apscheduler，用是蛮好用，不过卡在了启动上。  
当我都做好写个 wrapper 的心理准备的时候，留了个心眼搜了一下，发现已经有 Flask-APScheduler 这个现成库了。~~妈的智障~~  

入口文件 `web/api.py`：  
```Python
from flask import Flask
from flask_restful import Api, Resource
from flask_apscheduler import APScheduler
from task.watchdog import init_task


class StartTask(Resource):
    def get(self):
        return {'success': init_task() ? True : False}


def create_app():
    # 实例化 app
    app_instance = Flask(__name__)

    # 更新配置 启用 SCHEDULER_API_ENABLED 项
    app_instance.config.update({
        "SCHEDULER_API_ENABLED": True
    })

    # 启动 APScheduler 任务调度器
    scheduler = APScheduler()
    scheduler.init_app(app_instance)
    scheduler.start()

    # 注入 RESTful API 并添加路由资源
    api = Api(app_instance)
    api.add_resource(StartTask, '/start_task', strict_slashes=False)

    return app_instance


app = create_app()
if __name__ == "__main__":
    app.run(debug=True)
```

`task/watchdog.py`：  
```Python
import time
from flask import current_app


# @scheduler.scheduled_job('cron', second='*/30')
def example_job(args="this is a example job"):
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))}] [DEBUG] {args}")


def init_task():
    job = {
        'id': 'test-example-job',  # 任务的唯一ID，随便取，不要重复就是了
        'func': 'example_job',  # 执行任务的function名称
        'args': ['test'],  # 如果function需要参数，就在这里添加
    }
    result = current_app.apscheduler.add_job(id=job['id'], func=__name__ + ':' + job['func'], args=job['args'],
                                             trigger='interval', seconds=1)
    print(result)
    print("[DEBUG] init_task success")
    return True
```

然后随便加点细节（比如多任务 / 鉴权 / 锁止装置之类的）：  
![半成品](https://i.loli.net/2020/08/21/V2bUipsl5Z1e4Wk.png)

已经能用啦。  
