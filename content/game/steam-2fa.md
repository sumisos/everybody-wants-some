---
title: "Steam 模拟手机令牌二步验证"
subTitle: "Time-based One-time Password"
date: 2021-05-15T18:42:20+08:00
tags: ["Steam", "TOTP"]
series: ["Steam"]
related: true
---

## 第三方 Steam 工具
> 第三方工具安全性各有不同，风险自负。  

* [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm)  
* [Steam++](https://steampp.net) <a href="https://github.com/SteamTools-Team/SteamTools"><img src="https://img.shields.io/github/stars/rmbadmin/SteamTools.svg?style=social" data-sticker /></a>  
* [WinAuth](https://github.com/winauth/winauth)  
* [Steam Desktop Authenticator](https://github.com/Jessecar96/SteamDesktopAuthenticator)  

以上工具都支持**第三方**的 Steam 二步验证。  

虽然 Steam 的字母数字混合五位验证码看起来和别的 OTP Authenticator 高贵，其实都是一种东西。  
即基于 Time-based One-time Password 算法的一次性密码生成器，又称：  
* 两步验证
* 二步验证
* 双重验证
* 双因素验证
* 多因素验证
* 虚拟 MFA（我只看到过阿里这么叫）
* 动态令牌
* 2FA
* Two-Factor Authentication
* Multi-Factor Authentication
* OTP(One Time Password)

花名很多嘛。  

## Steam++
它家只要有 `shared_secret` 和 `identity_secret` 就允许导入。  
也就是说，最少：  
```JSON
{
  "shared_secret": "[key_secret_1]",
  "identity_secret": "[key_secret_2]"
}
```

就可以正常运作了。  
但这样的话，比较关键的 `恢复代码` 以及 `设备 ID` 等额外信息都没有。  

所以还是推荐该有的都加上，新建文本文档，命名为 `min.example.maFile`：  
```JSON
{
  "account_name": "[your_steam_username]",
  "revocation_code": "[revocation_code]",
  "device_id": "android:[phone_uuid]",
  "uri": "otpauth://totp/Steam:[your_steam_username]?secret=[totp_secret]&issuer=Steam",
  "shared_secret": "[key_secret_1]",
  "identity_secret": "[key_secret_2]",
  "steamid": "[your_steam_64bit_id]"
}
```

> 除了最关键的两个密钥之外比较关键的是：`revocation_code` - 恢复代码。  
> 其次是 `uri` 里面有 `[totp_secret]`，别的都是锦上添花的东西。  

## WinAuth
导出的格式类似 `WinAuth.example.maFile`：  
```JSON
{
  "account_name": "[your_steam_username]",
  "revocation_code": "[revocation_code]",
  "device_id": "android:[phone_uuid]",
  "uri": "otpauth://totp/Steam:[your_steam_username]?secret=[totp_secret]&issuer=Steam",
  "shared_secret": "[key_secret_1]",
  "identity_secret": "[key_secret_2]",
  "serial_number": "[serial_number]",
  "server_time": "[server_time]",
  "token_gid": "[token_gid]",
  "secret_1": "[secret_1]",
  "status": 1,
  "steamguard_scheme": "2",
  "steamid": "[your_steam_64bit_id]"
}
```

## Steam Desktop Authenticator
导出的格式类似 `SDA.example.maFile`：  
```JSON
{
  "account_name": "[your_steam_username]",
  "revocation_code": "[revocation_code]",
  "device_id": "android:[phone_uuid]",
  "uri": "otpauth://totp/Steam:[your_steam_username]?secret=[totp_secret]&issuer=Steam",
  "shared_secret": "[key_secret_1]",
  "identity_secret": "[key_secret_2]",
  "serial_number": "[serial_number]",
  "server_time": "[server_time]",
  "token_gid": "[token_gid]",
  "secret_1": "[secret_1]",
  "status": 1,
  "fully_enrolled": true,
  "Session": {
    "SessionID": "[string]",
    "SteamLogin": "[string]",
    "SteamLoginSecure": "[string]",
    "WebCookie": "[string]",
    "OAuthToken": "[string]",
    "SteamID": "[string]"
  }
}
```

## KeePass
我是 [KeePass](https://keepass.info) 用户，TOTP 插件还蛮多的，我用的 [KeeTrayTOTP](https://keepass.info/plugins.html#keetraytotp)。  
用上面的软件绑定手机令牌后导出，用文本编辑器打开 `.maFile` 文件，会有 `uri` 项：  
```
"uri": "otpauth://totp/Steam:[your_steam_username]?secret=[totp_secret]&issuer=Steam",
```

记录下 `[totp_secret]`，这个就是 Steam 令牌作为 TOTP 工具时的序列号。  