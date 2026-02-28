// 文章数据
const posts = [
    {
        id: 1,
        title: "欢迎来到我的博客",
        date: "2026-02-28",
        excerpt: "这是我的第一篇博客文章。在这里，我将分享关于技术、生活和学习的内容。",
        content: "posts/welcome.html"
    }
];

// 加载文章列表
function loadPosts() {
    const container = document.getElementById('posts-container');
    
    if (posts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #95a5a6;">暂无文章</p>';
        return;
    }
    
    posts.forEach(post => {
        const postCard = document.createElement('article');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
            <div class="post-meta">${post.date}</div>
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="post.html?id=${post.id}" class="read-more">阅读全文 →</a>
        `;
        container.appendChild(postCard);
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPosts);
