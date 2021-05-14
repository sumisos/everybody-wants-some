---
title: "博客从零开始 #3 Hugo Theme"
subTitle: "使用 Hugo 主题"
date: 2021-05-14T15:56:51+08:00
tags: ["blog", "hugo"]
series: ["ews.ink"]
related: true
---

[![](https://img.shields.io/badge/hugo_version-v0.83.1%2fextended-blue.svg?logo=hugo&logoColor=fff)](https://github.com/gohugoio/hugo/releases) [![](https://img.shields.io/badge/MemE-v4.5.0-blue.svg)](https://github.com/reuixiy/hugo-theme-meme)

## 准备主题
### 添加 MemE 主题
```Powershell
$ git submodule add --depth 1 https://github.com/reuixiy/hugo-theme-meme.git themes/meme
```

### 升级 MemE 主题
```Powershell
$ git submodule update --rebase --remote
```

### 使用主题
```Powershell
$ rm config.toml && cp themes/meme/config-examples/zh-cn/config.toml config.toml
# 进行写作
$ hugo server -D
```

## 改造主题
新建文件 `./layouts/partials/third-party/medium-zoom.html`，输入内容：
```html
<script src="https://cdn.jsdelivr.net/npm/medium-zoom@latest/dist/medium-zoom.min.js"></script>

<script>
    mediumZoom(document.querySelectorAll('div.post-body img:not([data-no-zoom],[data-sticker],.no-zoom,.sticker)'), {
        background: 'hsla(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l), 0.95)'
    })
</script>
```

新建文件 `./assets/scss/custom/_custom.scss`，输入内容：
```scss
/* 自定义样式文件
 * 本文件为优先级最高 会覆盖掉主题的样式
 * 这样的注释会留到编译后 */

// 这样的注释编译时会忽略掉

nav.nav {
  // 设置导航栏字体大小 默认的 80% 实在太小了
  font-size: 1em;
}

img.no-zoom {
  // 禁用图片点击缩放
  // 需要配合[自定义主题第三方插件功能] ./layouts/partials/third-party/medium-zoom.html 一起食用
  // 感谢 MemE 主题使用的图片缩放库 medium-zoom.js 支持 CSS 选择器
  // 详见 https://github.com/francoischalifour/medium-zoom#selectors
}

img.sticker {
  // 禁用图片换行居中 便于直接在文中插入表情包
  // 已默认禁用图片点击缩放功能
  display: inline;
  margin: auto;
}

img[data-sticker] {
  // 同上 实际中的另一种用法
  // class="sticker" => data-sticker
  @extend img.sticker;
}
```