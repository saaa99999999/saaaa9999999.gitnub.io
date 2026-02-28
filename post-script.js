// 文章数据（与 script.js 保持一致）
const posts = [
    {
        id: 1,
        title: "欢迎来到我的博客",
        date: "2026-02-28",
        excerpt: "这是我的第一篇博客文章。在这里，我将分享关于技术、生活和学习的内容。",
        content: "posts/welcome.html"
    }
];

// 从 URL 获取文章 ID
function getPostId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// 加载文章内容
async function loadPost() {
    const postId = getPostId();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        document.getElementById('post-detail').innerHTML = '<p>文章未找到</p>';
        return;
    }
    
    try {
        const response = await fetch(post.content);
        const content = await response.text();
        
        document.getElementById('post-detail').innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-meta">${post.date}</div>
            ${content}
        `;
        document.title = `${post.title} - saaa999 的博客`;
    } catch (error) {
        document.getElementById('post-detail').innerHTML = '<p>加载文章失败</p>';
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPost);
