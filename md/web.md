# EchoUnerWillow 项目说明

EchoUnerWillow 是一个基于 Vite 构建的静态网站项目，采用模块化架构设计，支持自定义页面模板和动态内容加载。

## 项目目录结构

```
EchoUnerWillow/
├── index.html                 # 主页入口
├── pages.html                 # 所有页面索引入口
├── page.html                  # 单个页面渲染入口（通过 JS 动态加载 .euw）
├── 404.html                   # 404页面
│
├── css/                       # 样式文件目录
│   ├── components/            # 组件样式
│   │   ├── card.css
│   │   └── header.css
│   ├── layouts/               # 布局样式
│   │   └── grid.css
│   ├── base.css               # 基础样式
│   └── pages.css              # pages.html页面样式
│   └── index.css              # index.html页面样式
│
├── js/                        # JavaScript 逻辑目录
│   ├── components/            # 组件模块
│   │   ├── announcements.js   # 公告组件
│   │   └── recentUpdates.js   # 最近更新组件
│   ├── services/              # 服务模块
│   │   └── pageService.js     # 页面服务
│   ├── utils/                 # 工具模块
│   │   ├── dateUtils.js       # 日期工具
│   │   └── pathUtils.js       # 路径工具
│   ├── euw.templates.js       # EUW 模板定义
│   ├── index.js               # 主页逻辑
│   └── pages.js               # 页面管理逻辑
│
├── md/                        # Markdown 文档目录
│   ├── euw.md                 # EUW 格式说明
│   └── web.md                 # 项目说明文档
│
├── public/                    # 静态资源目录（原样复制到 dist）
│   ├── pages/                 # 存放 .euw 页面文件
│   │   └── xxx.euw
│   ├── pages_meta/            # 存放页面的元数据 JSON
│   │   └── xxx.json
│   └── pages.json             # 全局页面索引
│
├── vite.config.js             # Vite 构建配置
├── .euwconfig.json            # EUW 插件配置文件
├── package.json               # 项目依赖与脚本
├── package-lock.json          # 依赖锁定文件
└── node_modules/              # 依赖包目录
```


### 说明

- `public/` 目录下的所有文件在开发和生产环境均可通过绝对路径（如 `/pages/home.euw`）直接访问。  
- `.euw` 文件为自定义md+模板语法，由 `js/euw.templates.js` 在浏览器客户端进行解析渲染。 


## 元数据

EUW页面的元数据(json)包含以下字段：

- id: 页面标识符
- title: 页面标题
- file: 页面文件路径
- modified: 最后修改时间（ISO格式）
- created: 创建时间
- tags: 标签数组
- encrypted: 是否加密
- passwordHint: 密码提示