// 文章数据
const posts = [
    {
        id: 2,
        title: '星盟2026招新赛re部分wp',
        date: '2026-03-01',
        excerpt: '星盟2026招新赛逆向题目完整writeup，包含ez_uds、Illusion、hajimi、移动的秘密、Hulua、ezFinger、Disguise、ezLanguage等多道题目的详细解题过程。',
        tags: ['逆向工程', 'CTF', 'Writeup', '星盟2026'],
        readTime: '20 分钟阅读',
        url: 'posts/post-2.html'
    },
    {
        id: 1,
        title: '第一篇博客 记iot逆向入门',
        date: '2026-02-28',
        excerpt: '记录了两道 IoT 逆向题目的解题过程：路由器固件逆向和 RFID/NFC 通信分析。从 binwalk 固件提取到 Amiibo 卡片数据解密，涵盖了 IoT 安全的基础知识和工具使用。',
        tags: ['IoT', '逆向', 'RFID', 'NFC', 'CTF'],
        readTime: '8 分钟阅读',
        url: 'posts/post-1.html'
    }
];

console.log('文章数量:', posts.length);
console.log('文章数据:', posts);

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
            <h2><a href="${post.url}">${post.title}</a></h2>
            <div class="post-meta">
                <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${post.date}</span>
                <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${readTime}</span>
            </div>
            ${tagsHtml}
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="${post.url}" class="read-more">阅读全文</a>
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

// 确保视频自动播放
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero-video');
    if (video) {
        video.play().catch(err => {
            console.log('视频自动播放失败:', err);
        });
    }
});


// 更新侧边栏
function updateSidebar() {
    // 侧边栏已移除，保留函数以防其他地方调用
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
                        <h2><a href="${post.url}">${post.title}</a></h2>
                        <div class="post-meta">
                            <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${post.date}</span>
                            <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${readTime}</span>
                        </div>
                        ${tagsHtml}
                        <p class="post-excerpt">${post.excerpt}</p>
                        <a href="${post.url}" class="read-more">阅读全文</a>
                    `;
                    container.appendChild(postCard);
                });
                document.getElementById('pagination').innerHTML = '';
            }
        });
    }
    
    updateSidebar();
});
