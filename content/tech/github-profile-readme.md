---
title: "Github 用户资料页面玩法"
subTitle: "Github Profile Readme"
date: 2021-05-15T15:55:27+08:00
tags: ["Git", "Github", "Markdown"]
series: ["Github"]
related: true
---

## 开始
众所周知，创建一个和用户名相同的 Repo，这个 Repo 的 `README.md` 内容就会显示在用户资料主页面。  
所以在这个 markdown 文档里写什么，用户资料页就会显示什么，那么就可以开始玩了。  

```Markdown
## Hi there 👋

<!--
**[USERNAME]/[USERNAME]** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
```

## 动态渲染图片
类似早些年论坛的签名档，动态数据渲染那种效果。  
虽然自己写也花不了多久，不过还是现成的好吃。  

## GitHub 统计卡片
[GitHub Readme Stats](https://github.com/hokaso/github-readme-stats) 这个仓库就是专为 Github 的用户资料页开发的。  

```Markdown
[![Your Github Stats](https://github-readme-stats.vercel.app/api?username=[USERNAME])](https://github.com/[USERNAME])
```

[![Sumi's Github Stats](https://github-readme-stats.vercel.app/api?username=sumisos)](https://github.com/sumisos)

### 隐藏指定统计
> 加上 `&hide=stars,commits,prs,issues,contribs` 参数即可。  

```Markdown
[![Your Github Stats](https://github-readme-stats.vercel.app/api?username=[USERNAME]&hide=prs,contribs)](https://github.com/[USERNAME])
```

[![Sumi's Github Stats](https://github-readme-stats.vercel.app/api?username=sumisos&hide=prs,contribs)](https://github.com/sumisos)

### 将私人项目贡献添加到总提交计数中
> 加上 `&count_private=true` 参数即可。  

```Markdown
[![Your Github Stats](https://github-readme-stats.vercel.app/api?username=[USERNAME]&count_private=true)](https://github.com/[USERNAME])
```

[![Sumi's Github Stats](https://github-readme-stats.vercel.app/api?username=sumisos&count_private=true)](https://github.com/sumisos)

### 显示图标
> 加上 `&show_icons=true` 参数即可。  

```Markdown
[![Your Github Stats](https://github-readme-stats.vercel.app/api?username=[USERNAME]&show_icons=true)](https://github.com/[USERNAME])
```

[![Sumi's Github Stats](https://github-readme-stats.vercel.app/api?username=sumisos&show_icons=true)](https://github.com/sumisos)

### 预设主题
> 加上 `&theme=THEME_NAME` 参数即可。  
> 更多参考 [主题预览](https://github.com/hokaso/github-readme-stats/blob/master/themes/README.md) 及 [对应代码](https://github.com/hokaso/github-readme-stats/blob/master/themes/index.js)。  

```Markdown
[![Your Github Stats](https://github-readme-stats.vercel.app/api?username=[USERNAME]&theme=[THEME_NAME])](https://github.com/[USERNAME])
```

[![Sumi's Github Stats](https://github-readme-stats.vercel.app/api?username=sumisos&theme=vue)](https://github.com/sumisos)

### 自定义主题
> 可以使用更多参数来为卡片自定义样式。  

可定制选项：  
* `title_color` - 卡片标题颜色 _（十六进制色码）_
* `text_color` - 内容文本颜色 _（十六进制色码）_
* `icon_color` - 图标颜色（如果可用）_（十六进制色码）_
* `bg_color` - 卡片背景颜色 _（十六进制色码）_ **或者** 以 _angle,start,end_ 的形式渐变
* `hide_border` - 隐藏卡的边框 _(布尔值)_
* `theme` - 主题名称，从[所有可用主题](../themes/README.md)中选择
* `cache_seconds` - 手动设置缓存头 _（最小值: 1800，最大值: 86400）_
* `locale` - 在卡片中设置语言 _(例如 cn, de, es, 等等)_

#### 统计卡片专属选项
* `hide` - 隐藏特定统计信息 _(以逗号分隔)_
* `hide_title` - _(boolean)_
* `hide_rank` - _(boolean)_
* `hide_border` - _(boolean)_
* `show_icons` - _(boolean)_
* `include_all_commits` - 统计总提交次数而不是仅统计今年的提交次数 _(boolean)_
* `count_private` - 统计私人提交 _(boolean)_
* `line_height` - 设置文本之间的行高 _(number)_

#### Repo 卡片专属选项
* `show_owner` - 显示 Repo 的所有者名字 _(boolean)_

#### 语言卡片专属选项
* `hide` - 从卡片中隐藏指定语言 _(Comma seperated values)_
* `hide_title` - _(boolean)_
* `hide_border` - _(boolean)_
* `layout` - 在两个可用布局 `default` & `compact` 间切换
* `card_width` - 手动设置卡片的宽度 _(number)_

> ⚠️ **重要:**  
> 如 [Percent Encoding](https://en.wikipedia.org/wiki/Percent-encoding) 所指定，语言名称应使用 uri 转义。  
> (例: `c++` 应该是 `c%2B%2B`，`jupyter notebook` 应该是 `jupyter%20notebook`，诸如此类)  

## Wakatime
[Wakatime](https://wakatime.com/) 是一个统计开发用时的小工具，以插件的形式支持各种 IDE。  
注册后查看 [支持的 IDE 列表](https://wakatime.com/plugins) 安装插件，并输入 [API key](https://wakatime.com/settings/api-key) 即可开始记录搬砖时间。  
编辑 [用户资料](https://wakatime.com/settings/profile) 的 `Username`，然后就能用上 Wakatime 的统计卡片了。  

```Markdown
[![Wakatime Stats](https://github-readme-stats.vercel.app/api/wakatime?username=[USERNAME])](https://github.com/[USERNAME])
```

[![Wakatime Stats](https://github-readme-stats.vercel.app/api/wakatime?username=sumisos&show_icons=true&theme=great-gatsby)](https://github.com/sumisos)

## PV 统计
访问 [Badger](https://badges.toozhao.com/)，点击正中间的 `Create your badge` 按钮。  
复制粘贴生成的 Markdown 代码即可统计 `该页面访问总次数`。  