# EUW 语言参考文档

EUW是一种融合 Markdown 和动态模板的轻量级标记语言，专为博客设计。其核心思想是在保持 Markdown 简洁性的同时，通过内联模板调用实现动态内容注入。

## 快速概览

- **文件扩展名**：`.euw`
- **语法超集**：完全兼容 Markdown 基础语法（标题、列表、强调、代码等）
- **独特能力**：花括号模板调用 `{template_name|param=value}`，可在浏览器客户端动态生成内容
- **编辑器支持**：提供补全、诊断、悬停预览、定义跳转（通过 Language Server）

```euw
# 欢迎使用 EUW

这是一个 {greeting|name="开发者", style="enthusiastic"} 的示例。

- 静态列表项
- {dynamic_list|source="recent_updates"}
```

## 基础 Markdown 语法

EUW 继承了 CommonMark 风格的基础语法，以下为支持的部分：

| 元素       | 语法示例                            |
|------------|-------------------------------------|
| 标题       | `# H1` 至 `###### H6`              |
| 无序列表   | `- 项目` 或 `* 项目` 或 `+ 项目`   |
| 有序列表   | `1. 项目`                          |
| 粗体       | `**粗体**` 或 `__粗体__`           |
| 斜体       | `*斜体*` 或 `_斜体_`               |
| 删除线     | `~~删除线~~`                       |
| 行内代码   | `` `code` ``                       |
| 代码块     | ` ```lang ` ... ` ``` `            |
| 分割线     | `---`                              |


> **注意**：在模板调用 `{...}` 内部不能使用 Markdown 语法，模板内容由后端渲染函数决定。

## 模板语法

模板调用是 EUW 的核心扩展，形式为：

```ebnf
{ <template-name> [ "|" <parameters> ] }
```

- `<template-name>`：字母、数字、下划线、连字符组成，以字母或下划线开头。
- `<parameters>`：由逗号分隔的键值对，格式 `key=value`。
  - `value` 可为双引号字符串、单引号字符串或无引号字面量。
  - 支持布尔值 `true`/`false` 和数字。
  - 字符串可以包含空格（若使用引号）。

**示例**：

```
{user_card|id=123, name="李明", active=true}
{datetime|format="YYYY-MM-DD HH:mm"}
```

在渲染时，模板名对应一个已注册的渲染函数，该函数接收参数对象并返回 HTML 字符串，最终嵌入文档输出中。

## 模板定义与配置

EUW 的模板定义在一个 JavaScript 模块中。


### 模板模块格式 (`euw.templates.js`)

```javascript
/**
 * EUW 模板定义文件
 * 
 * 每个模板是一个对象，包含：
 * - params: 参数定义，key 为参数名，value 为 { type, required?, default?, description? }
 * - render: 渲染函数，接收参数对象并返回 HTML 字符串，可以用module.exports.templates.模板名.render调用其他模板
 * - description?: 模板描述（可选）
 */
module.exports = {
  templates: {
    // 示例模板：按钮
    button: {
      params: {
        text: { type: 'string', required: true, description: '按钮文字' },
        type: { type: 'string', default: 'primary', description: '按钮类型：primary / secondary' },
        link: { type: 'string', description: '点击跳转的链接' }
      },
      description: '生成一个可点击的按钮',
      render: ({ text, type, link }) => {
        const hrefAttr = link ? `href="${link}"` : '';
        return `<a ${hrefAttr} class="btn btn-${type}">${text}</a>`;
      }
    }
  }
};
```


## 限制与注意事项

- **嵌套模板**：暂不支持模板调用内部再嵌套模板，但渲染函数可以调用其他模板的渲染函数。
- **代码块语言支持**：内置 JavaScript/TypeScript/CSS/HTML/JSON/Python 的高亮注入，其他语言显示为纯文本。

## 示例文档

以下是一个完整的 `.euw` 文件示例：

```euw
# 项目周报 {week|start="2026-04-07"}

> 生成时间：{datetime|format="YYYY年MM月DD日 HH:mm"}

## 进展摘要
{summary_card|progress=0.75, highlights=["功能A上线","Bug修复"]}

### 详细条目
- {task_item|name="重构 API 层", status="done"}
- {task_item|name="编写 EUW 文档", status="in_progress"}
- {task_item|name="性能测试", status="pending"}

## 备注
~~旧版报告模板已弃用~~，请使用最新 `weekly_report` 模板。
```

对应的模板定义（部分）：

```js
templates: {
  week: {
    params: { start: { type: 'string', required: true } },
    render: ({ start }) => `<span style="color: gray;">第 ${/* 计算周数 */} 周</span>`
  },
  task_item: {
    params: { 
      name: { type: 'string', required: true },
      status: { type: 'string', required: true }
    },
    render: ({ name, status }) => {
      const icons = { done: '✅', in_progress: '🔄', pending: '⏳' };
      return `${icons[status] || '❓'} ${name}`;
    }
  }
}
```
