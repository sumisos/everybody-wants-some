---
title: "shields.io Badges 用法"
date: 2021-05-16T09:09:30+08:00
tags: ["shields.io", "Badges", "Markdown"]
series: ["Markdown"]
related: true
---

<span class="sticker">[![](https://img.shields.io/badge/shields.io-官网-info)](https://shields.io/)</span>  

> 如 [Percent Encoding](https://en.wikipedia.org/wiki/Percent-encoding) 所指定，本文所有 URL 路径应使用 uri 转义。  
> （例：`c++` 应该是 `c%2B%2B`，`let's go` 应该是 `let%27s%20go`，诸如此类）  

## 静态 Static
* 短横线 dash `-` => 分隔符  
* 双短横线 `--`	=>  短横线 `-`  
* 双下划线 `__` => 下划线 `_`  
* `_` 或 ` `(转义后为 `%20`) => 空格 ` `  

```
https://img.shields.io/badge/<LABEL>-<MESSAGE>-<COLOR>

https://img.shields.io/static/v1?label=<LABEL>&message=<MESSAGE>&color=<COLOR>
```

## 颜色 Colors
<span class="sticker">![](https://img.shields.io/badge/-brightgreen-brightgreen)
![](https://img.shields.io/badge/-green-green)
![](https://img.shields.io/badge/-yellowgreen-yellowgreen)
![](https://img.shields.io/badge/-yellow-yellow)
![](https://img.shields.io/badge/-orange-orange)
![](https://img.shields.io/badge/-red-red)
![](https://img.shields.io/badge/-blue-blue)
![](https://img.shields.io/badge/-lightgrey-lightgrey)</span>

<span class="sticker">![](https://img.shields.io/badge/-success-success)
![](https://img.shields.io/badge/-important-important)
![](https://img.shields.io/badge/-critical-critical)
![](https://img.shields.io/badge/-infomational-infomational)
![](https://img.shields.io/badge/-inactive-inactive)</span>

<span class="sticker">![](https://img.shields.io/badge/-blueviolet-blueviolet)
![](https://img.shields.io/badge/-ff69b4-ff69b4)
![](https://img.shields.io/badge/-9cf-9cf)</span>

## 节点 Endpoint
[官网详细介绍](https://shields.io/endpoint)  

```
https://img.shields.io/endpoint?url=<URL>
```

其他参数同静态标签，一样可以生效，如覆写 `style`、`label`、`message`、`color`、`logoColor` 等。  

`<URL>` 返回的响应应该是如下格式的 `json`：  
```JSON
{
  "schemaVersion": 1,
  "label": "is it monday",
  "message": "no",
  "color": "orange"
}
```

举例：`https://shields.redsparr0w.com/2473/monday` ![](https://img.shields.io/endpoint?url=https://shields.redsparr0w.com/2473/monday)  

## 动态 Dynamic
访问接口获取响应后按照写好的路径读取数据，不如 `endpoint` 用法省心，但胜在灵活，不必专门写固定格式的接口。  
[JSON 路径验证](https://jsonpath.com/)  

`json`、`xml`、`yaml` 依次为：  
```
https://img.shields.io/badge/dynamic/json?url=<URL>&label=<LABEL>&query=<$.DATA.SUBDATA>&color=<COLOR>&prefix=<PREFIX>&suffix=<SUFFIX>
https://img.shields.io/badge/dynamic/xml?url=<URL>&label=<LABEL>&query=<//data/subdata>&color=<COLOR>&prefix=<PREFIX>&suffix=<SUFFIX>
https://img.shields.io/badge/dynamic/yaml?url=<URL>&label=<LABEL>&query=<$.DATA.SUBDATA>&color=<COLOR>&prefix=<PREFIX>&suffix=<SUFFIX>
```

## 样式 Styles

|Parameters|Styles|
|:-:|:-:|
|`?style=plastic&logo=appveyor`|![](https://img.shields.io/badge/style-plastic-infomational?style=plastic&logo=appveyor)|
|`?style=flat&logo=appveyor`|![](https://img.shields.io/badge/style-flat-infomational?style=flat&logo=appveyor)|
|`?style=flat-square&logo=appveyor`|![](https://img.shields.io/badge/style-flat--square-infomational?style=flat-square&logo=appveyor)|
|`?style=for-the-badge&logo=appveyor`|![](https://img.shields.io/badge/style-for--the--badge-infomational?style=for-the-badge&logo=appveyor)|
|`?style=social&logo=appveyor`|![](https://img.shields.io/badge/style-social-infomational?style=social&logo=appveyor)|

## 其他参数
|Parameters|Styles|Description|
|:-:|:-:|:-:|
|`?label=healthinesses`|![](https://img.shields.io/badge/style-healthinesses-infomational?label=healthinesses)|覆写左边的文本 注意转义[URL-Encoding](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding)|
|`?logo=appveyor`|![](https://img.shields.io/badge/style-logo-infomational?logo=appveyor)|添加 LOGO 支持列表参考[simple-icons](https://simpleicons.org/)|
|`?logo=data:image/png;base64,…`|![](https://img.shields.io/badge/style-base64--logo-infomational?logo=data:image/png;base64,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)|图片需要高大于 14 像素并小于 8192 bytes|
|`?logoColor=violet`|![](https://img.shields.io/badge/style-desc-infomational?logo=appveyor&logoColor=violet)|自定义 LOGO 的颜色（支持 `hex`/`rgb`/`rgba`/`hsl`/`hsla`/`css` 格式）|
|`?logoWidth=40`|![](https://img.shields.io/badge/style-desc-infomational?logo=appveyor&logoWidth=40)|自定义 LOGO 区域宽度|
|`?link=http://left&link=http://right`|<object data="https://img.shields.io/badge/style-link-infomational?link=http://left&link=http://right" />|自定义左右标签不同链接 注意需要在 `<object>` 标签中才生效 `<img>` 不行|
|`?labelColor=abcdef`|![](https://img.shields.io/badge/style-desc-infomational?labelColor=abcdef)|自定义**左边**标签的背景色|
|`?color=fedcba`|![](https://img.shields.io/badge/style-desc-infomational?color=fedcba)|自定义**右边**标签的背景色|
|`?cacheSeconds=3600`|![](https://img.shields.io/badge/style-desc-infomational?cacheSeconds=3600)|自定义缓存时间 最小 300 更小会被忽略|