---
title: "Notion API 简单上手"
date: 2021-05-16T14:07:10+08:00
tags: ["笔记", "Notion"]
series: ["Notion"]
related: true
toc: false
---

<span class="sticker">[![](https://img.shields.io/badge/官方-API-info)](https://github.com/makenotion/notion-sdk-js) [![](https://img.shields.io/badge/非官方-API-info)](https://github.com/dragonman225/notionapi-agent) [![](https://img.shields.io/badge/Telegram%20Bot-Help-info)](https://github.com/reycn/notion-help-bot/)</span>

Notion 出了 API，惊了。不过暂时还没想好做什么。  
大概书评一类的？官方 demo 里维护 Github Issue 的思路也不错。  

## 可用性测试
1. 强烈建议 [新建一个 workspace](https://www.notion.so/notion/Create-join-switch-workspaces-3b9be78982a940a7a27ce712ca6bdcf5#9332861c775543d0965f918924448a6d) 专门用于构建 API，以免误操作致使隐私泄露。  
2. 前往 [My integrations](https://www.notion.com/my-integrations) 页面新建一个 `Integration` 绑定（associate）想要刚刚创建好的 workspace。  
3. 记录下刚刚创建好的 `Integration` 的 `Internal Integration Token`（形如 `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）。  
4. 来到刚刚创建好的 workspace，新建一个 table page，观察浏览器地址栏 `https://www.notion.so/<workspace_domain>/<database_id>?v=......`，获得 `database_id`。  
5. **关键**：点击右上角的 `Share` -> `Invite`，邀请刚刚建好的 `Integration`。  

一定要邀请对应的 `Integration`，否则一直会报错 `Could not find database with ID: ......`。  

```shell
$ npm install @notionhq/client
```

```JavaScript
const { Client } = require("@notionhq/client");
const config = require("./config.json");

const notion = new Client({ auth: config.NOTION_API_KEY });

const database_id = config.DATABASE[0].DATABASE_ID;

async function search(filter) {
  const response = await notion.databases.retrieve({
    database_id: database_id,
    filter: filter,
  });
  console.log(response);
}

async function select(filter) {
  const response = await notion.databases.query({
    database_id: database_id,
    filter: filter,
  });
  //console.log(response);
  let data = response.results[0].properties;
  console.log(data.Name.title[0].plain_text);
  console.log(data.Tags.multi_select);
}

async function insert(data) {
  const response = await notion.pages.create({
    parent: {
      database_id: database_id,
    },
    properties: data,
  });
  console.log(response);
}

let newItem = {
  Name: {
    type: "title",
    title: [
      {
        type: "text",
        text: {
          content: "Apple",
        },
      }
    ],
  },
  /*
  Price: {
    type: "number",
    number: 1.49,
  },
  "Last ordered": {
    type: "date",
    date: {
      start: "2021-05-11",
    },
  },
  */
};

let timeFilter = {
  property: "Last ordered",
  date: {
    past_week: {},
  },
};

let filter = {
  property: "Name",
  text: {
    contains: "pp",
  },
};

//insert(newItem);
select(filter);
```

到这里写入读取都跑通了，剩下的就是结合实际需求开发了。  
