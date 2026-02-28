// 文章数据
const posts = [];

// 每页显示的文章数
const postsPerPage = 5;
let currentPage = 1;

// 加载文章列表
function loadPosts() {
    const container = document.getElementById('posts-container');
    const paginationContainer = document.getElementById('pagination');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>暂无文章</h3>
                <p>敬请期待精彩内容...</p>
            </div>
        `;
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }
    
    // 计算分页
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);
    
    // 清空容器
    container.innerHTML = '';
    
    // 渲染当前页文章
    currentPosts.forEach((post, index) => {
        const postCard = document.createElement('article');
        postCard.className = 'post-card';
        postCard.style.animationDelay = `${index * 0.1}s`;
        
        const tagsHtml = post.tags ? 
            `<div class="post-tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';
        
        const readTime = post.readTime || '5 分钟阅读';
        
        postCard.innerHTML = `
            <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
            <div class="post-meta">
                <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${post.date}</span>
                <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${readTime}</span>
            </div>
            ${tagsHtml}
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="post.html?id=${post.id}" class="read-more">阅读全文</a>
        `;
        container.appendChild(postCard);
    });
    
    // 渲染分页
    if (totalPages > 1 && paginationContainer) {
        renderPagination(totalPages);
    } else if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }
}

// 渲染分页
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    let paginationHTML = '<div class="pagination">';
    
    // 上一页
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage - 1})">上一页</button>`;
    }
    
    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="page-btn active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="page-btn" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
    }
    
    // 下一页
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage + 1})">下一页</button>`;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

// 切换页面
function changePage(page) {
    currentPage = page;
    loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPosts);


// 更新侧边栏
function updateSidebar() {
    // 更新标签云
    const allTags = new Set();
    posts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    const tagCloud = document.getElementById('tag-cloud');
    if (tagCloud && allTags.size > 0) {
        tagCloud.innerHTML = Array.from(allTags).map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
    }
    
    // 更新最近文章
    const recentPosts = document.getElementById('recent-posts');
    if (recentPosts) {
        const recent = posts.slice(0, 5);
        if (recent.length > 0) {
            recentPosts.innerHTML = recent.map(post => `
                <div class="recent-post-item">
                    <span class="recent-post-date">${post.date.substring(5)}</span>
                    <a href="post.html?id=${post.id}" class="recent-post-title">${post.title}</a>
                </div>
            `).join('');
        } else {
            recentPosts.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.875rem;">暂无文章</p>';
        }
    }
    
    // 更新统计信息
    document.getElementById('total-posts').textContent = posts.length;
    document.getElementById('total-tags').textContent = allTags.size;
    
    // 计算运行天数
    const startDate = new Date('2026-02-28');
    const today = new Date();
    const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    document.getElementById('running-days').textContent = days;
}

// 搜索功能
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length === 0) {
                loadPosts();
                return;
            }
            
            const filtered = posts.filter(post => 
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
            );
            
            const container = document.getElementById('posts-container');
            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🔍</div>
                        <h3>未找到相关文章</h3>
                        <p>试试其他关键词吧</p>
                    </div>
                `;
                document.getElementById('pagination').innerHTML = '';
            } else {
                container.innerHTML = '';
                filtered.forEach((post, index) => {
                    const postCard = document.createElement('article');
                    postCard.className = 'post-card';
                    postCard.style.animationDelay = `${index * 0.1}s`;
                    
                    const tagsHtml = post.tags ? 
                        `<div class="post-tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';
                    
                    const readTime = post.readTime || '5 分钟阅读';
                    
                    postCard.innerHTML = `
                        <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
                        <div class="post-meta">
                            <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${post.date}</span>
                            <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${readTime}</span>
                        </div>
                        ${tagsHtml}
                        <p class="post-excerpt">${post.excerpt}</p>
                        <a href="post.html?id=${post.id}" class="read-more">阅读全文</a>
                    `;
                    container.appendChild(postCard);
                });
                document.getElementById('pagination').innerHTML = '';
            }
        });
    }
    
    updateSidebar();
});
