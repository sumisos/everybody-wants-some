---
title: "Re:从零开始的博客生涯 #4 魔改 MemE"
subTitle: "改造 Hugo 主题 MemE"
date: 2021-05-14T15:56:52+08:00
tags: ["Blog", "Hugo"]
series: ["ews.ink"]
related: true
---

<a href="https://github.com/gohugoio/hugo/releases"><img src="https://img.shields.io/badge/hugo_version-v0.83.1%2fextended-blue.svg?logo=hugo&logoColor=fff" alt="Hugo Verion" data-sticker /></a> <a href="https://github.com/reuixiy/hugo-theme-meme"><img src="https://img.shields.io/badge/MemE-v4.5.0-blue.svg" alt="MemE Verion" data-sticker /></a>

## 魔改图片缩放
### 操作
新建文件 `./layouts/partials/third-party/medium-zoom.html`，输入内容：
```html
<script src="https://cdn.jsdelivr.net/npm/medium-zoom@latest/dist/medium-zoom.min.js"></script>

<script>
    mediumZoom(document.querySelectorAll('div.post-body img:not(img[data-no-zoom], img[data-sticker], img.no-zoom, img.sticker, span img)'), {
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

@mixin inline-image {
  // 禁用图片换行居中 便于直接在文中插入表情包
  // 已默认禁用图片点击缩放功能
  display: inline;
  margin: auto;
}

img.sticker {
  @include inline-image;
}

img[data-sticker] {
  @include inline-image;
}

span.sticker {
  display:block;
  text-align:center;
}

img {
  span.sticker & { @include inline-image; }
}
```

### 效果
普通 Markdown 格式 `![](图片链接)` 的图片：![](https://i.loli.net/2021/05/14/Ukg8ri6woS9sJzl.gif)  

不换行 / 居中 <img src="https://i.loli.net/2021/05/14/C1xNr9DX32uhaJv.gif" data-sticker /> 也没有点击缩放的图片  

## 魔改博客首页
### 操作
编辑配置文件 `config.toml` 中的 `homeLayout = "page"` 项，将「首页布局」设置为「一般页面」。  

新建文件 `./layouts/index.html`，输入内容：  
```html
{{ define "main" }}
    <!-- Layout Poetry -->
    {{ if eq .Site.Params.homeLayout "poetry" }}
        {{ partial "pages/home-poetry.html" . }}
    {{ end }}
    <!-- Layout Footage -->
    {{ if eq .Site.Params.homeLayout "footage" }}
        {{ partial "pages/home-footage.html" . }}
    {{ end }}
    <!-- Layout Posts -->
    {{ if eq .Site.Params.homeLayout "posts" }}
        {{ partial "pages/home-posts.html" . }}
    {{ end }}
    <!-- Layout Page -->
    {{ if eq .Site.Params.homeLayout "page" }}
        {{ partial "pages/homepage.html" . }}
    {{ end }}
{{ end }}
```
在这个文件中我们把首页模版设置成了 `pages/homepage.html`。所以新建文件 `./layouts/partials/pages/homepage.html`，输入内容：  
```html
<main class="main single" id="main">
    <div class="main-inner">

        {{ $attrs := partial "utils/data-attributes.html" . }}

        <article class="content post h-entry"
        {{- if $attrs.smallCaps }} data-small-caps="true"{{ end }}
        {{- with $attrs.align }} data-align="{{ . }}"{{ end }}
        {{- with $attrs.type }} data-type="{{ . }}"{{ end }}
        {{- with $attrs.layout }} data-layout="{{ . }}"{{ end }}
        {{- if $attrs.indent }} data-indent="true"{{ end }}
        {{- if $attrs.tocNum }} data-toc-num="true"{{ end }}>

            <h1 class="post-title p-name">{{ (partial "utils/title.html" (dict "$" $ "title" $.Title)).htmlTitle }}</h1>

            {{ with .Params.subtitle }}
                {{- $raw := . -}}
                <div class="post-subtitle p-name">{{ partial "utils/markdownify.html" (dict "$" $ "raw" $raw "isContent" false) }}</div>
            {{ end }}

            {{ if .Site.Params.displayPostDescription }}
                {{ with .Params.description }}
                    {{- $raw := . -}}
                    <div class="post-description p-summary">{{ partial "utils/markdownify.html" (dict "$" $ "raw" $raw "isContent" false) }}</div>
                {{ end }}
            {{ end }}

            {{ if .Params.meta | default .Site.Params.enablePostMeta }}
                {{ partial "components/post-meta.html" (dict "$" . "isHome" false) }}
            {{ end }}

            {{ $enableTOC := .Params.toc | default .Site.Params.enableTOC -}}
            {{- if $enableTOC -}}
                {{- partial "utils/toc.html" . -}}
            {{- end -}}

            <div class="post-body e-content">
              {{ partial "meta/shields.html" . }}
              {{ partial "utils/content.html" . }}
            </div>

            {{ partial "components/post-copyright.html" . }}

        </article>

        {{ if and .Site.Params.enableGoogleAdUnits (eq hugo.Environment "production") -}}
            {{ partial "third-party/google-adsense-unit.html" . }}
        {{- end }}

        {{ partial "components/post-updated-badge.html" . }}

        {{ partial "components/post-gitinfo.html" . }}

        {{ partial "components/post-share.html" . }}

        {{ partial "components/related-posts.html" . }}

        {{ partial "components/post-tags.html" . }}

        {{ partial "components/minimal-footer.html" . }}

        {{ partial "components/minimal-footer-about.html" . }}

        {{ partial "components/post-nav.html" . }}

        {{ partial "components/comments.html" . }}

    </div>
</main>
```

在这个文件中我们新增了 `meta/shields.html` 这个模版，其他都和原来的模版 `./themes/meme/layouts/partials/pages/homepage.html` 相同。所以新建文件 `./layouts/partials/meta/shields.html`，输入内容：  
```html
{{ $version := $.Site.Data.meta.version }}

<span class="sticker">
    {{ range $.Site.Data.meta.shields.blog }}
        {{if .href}} <a href="{{ .href }}"> {{end}}
        <img src="{{ .src }}" />
        {{if .href}} </a> {{end}}
    {{ end }}
    <a href="https://github.com/gohugoio/hugo"><img src="https://img.shields.io/badge/hugo-{{- $version.hugo -}}-blue.svg?logo=hugo&logoColor=fff" /></a>
    <a href="https://github.com/reuixiy/hugo-theme-meme"><img src="https://img.shields.io/badge/{{- $version.theme.name -}}-{{- $version.theme.version -}}-blue.svg" /></a>
</span>

{{ range $.Site.Data.meta.shields.other }}
    <span class="sticker">
        {{if .title}} <h4>{{- .title -}}</h4> {{end}}
        {{ range .links }}
            {{if .href}} <a href="{{ .href }}"> {{end}}
            <img src="{{ .src }}" />
            {{if .href}} </a> {{end}}
        {{ end }}
    </span>
{{ end }}
```

这个模版读取了站点数据 `$.Site.Data` 的 `meta` 目录下的 `shields` 文件中的 `info`项（即数据文件 `./data/meta/shields.yaml`）。所以新建文件 `./data/meta/shields.yaml`，输入内容：  
```yaml
blog:
  -
    href: https://github.com/gohugoio/hugo
    src: https://img.shields.io/badge/hugo-v0.83.1%2fextended-blue.svg?logo=hugo&logoColor=fff
  -
    href: https://github.com/reuixiy/hugo-theme-meme
    src: https://img.shields.io/badge/MemE-v4.5.0-blue.svg
other:
  -
    type: server1
    title: Demo
    links:
      -
        href: https://github.com/python/cpython
        src: https://img.shields.io/badge/Python-v3.8.2-blue?logo=python&logoColor=white
      -
        href: https://github.com/tiangolo/fastapi
        src: https://img.shields.io/badge/FastAPI-v0.61.1-blue?logo=fastapi&logoColor=white
  -
    type: server2
    title: Project
    links:
      -
        href: https://github.com/php/php-src
        src: https://img.shields.io/badge/PHP-v7.4.10-blue?logo=php&logoColor=white
      -
        href: https://github.com/laravel/laravel
        src: https://img.shields.io/badge/Laravel-v8.1.0-blue?logo=laravel&logoColor=white
```

> 不会 `yaml` 也没关系，`yaml/toml` 都是某种格式的数据文件，可类比 `json/xml`，或者上古配置文件格式 `ini`，自行搜索资料一看就懂，上面写的就是几个嵌套数组而已。  

从数据文件读取到预设格式的数据，遍历其中的数组之后，根据模版依次渲染。  
数据文件 `shields.yaml` 中的格式并不固定，我随便设计的，可以根据个人喜好配合渲染模版 `shields.html` 任意改动。  

### 效果
完成就是 [首页](/) 展示的效果了。  

即一排排徽章：  
<img src="https://img.shields.io/badge/Git-v2.31.1-blue.svg?logo=git&logoColor=fff" alt="Git Verion" data-sticker /> <img src="https://img.shields.io/badge/Hugo-v0.83.1%2fextended-blue.svg?logo=hugo&logoColor=fff" alt="Hugo Verion" data-sticker /> <img src="https://img.shields.io/badge/MemE-v4.5.0-blue.svg" alt="MemE Verion" data-sticker />