# 我的博客

一个简洁的静态博客模板，适用于 GitHub Pages。

## 文件结构

```
.
├── index.html          # 首页（文章列表）
├── post.html           # 文章详情页
├── style.css           # 首页样式
├── post-style.css      # 文章页样式
├── script.js           # 首页脚本
├── post-script.js      # 文章页脚本
├── posts/              # 文章内容目录
│   └── welcome.html    # 示例文章
└── README.md           # 说明文档
```

## 如何添加新文章

1. 在 `posts` 文件夹中创建新的 HTML 文件（例如：`my-new-post.html`）
2. 编辑 `script.js` 和 `post-script.js`，在 `posts` 数组中添加新文章信息：

```javascript
{
    id: 2,  // 唯一 ID
    title: "文章标题",
    date: "2026-03-01",
    excerpt: "文章摘要...",
    content: "posts/my-new-post.html"
}
```

3. 提交并推送到 GitHub

## 部署到 GitHub Pages

1. 将所有文件推送到你的 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源
4. 访问 `https://你的用户名.github.io/仓库名/`

## 自定义

- 修改 `index.html` 和 `post.html` 中的标题和副标题
- 调整 `style.css` 和 `post-style.css` 中的颜色和样式
- 在 `posts` 文件夹中添加你的文章内容

## 特点

- 响应式设计，支持移动端
- 无需构建工具，纯静态文件
- 简洁现代的界面
- 易于添加和管理文章
