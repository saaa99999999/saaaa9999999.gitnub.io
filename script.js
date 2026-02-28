// 文章数据
const posts = [];

// 加载文章列表
function loadPosts() {
    const container = document.getElementById('posts-container');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>暂无文章</h3>
                <p>敬请期待精彩内容...</p>
            </div>
        `;
        return;
    }
    
    posts.forEach((post, index) => {
        const postCard = document.createElement('article');
        postCard.className = 'post-card';
        postCard.style.animationDelay = `${index * 0.1}s`;
        
        const tagsHtml = post.tags ? 
            `<div class="post-tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';
        
        postCard.innerHTML = `
            <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
            <div class="post-meta">${post.date}</div>
            ${tagsHtml}
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="post.html?id=${post.id}" class="read-more">阅读全文</a>
        `;
        container.appendChild(postCard);
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPosts);
