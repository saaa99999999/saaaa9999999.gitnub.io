// 文章数据（与 script.js 保持一致）
const posts = [];

// 从 URL 获取文章 ID
function getPostId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// 生成目录
function generateTOC() {
    const content = document.querySelector('.post-content');
    const headings = content.querySelectorAll('h2, h3');
    const tocNav = document.getElementById('toc-nav');
    
    if (headings.length === 0) {
        document.querySelector('.table-of-contents').style.display = 'none';
        return;
    }
    
    let tocHTML = '';
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;
        tocHTML += `<a href="#${id}" class="toc-${level}">${text}</a>`;
    });
    
    tocNav.innerHTML = tocHTML;
    
    // 目录高亮
    const tocLinks = tocNav.querySelectorAll('a');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tocLinks.forEach(link => link.classList.remove('active'));
                const activeLink = tocNav.querySelector(`a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-100px 0px -66%' });
    
    headings.forEach(heading => observer.observe(heading));
}

// 加载文章内容
async function loadPost() {
    const postId = getPostId();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        document.getElementById('post-detail').innerHTML = '<p>文章未找到</p>';
        document.querySelector('.table-of-contents').style.display = 'none';
        return;
    }
    
    try {
        const response = await fetch(post.content);
        const content = await response.text();
        
        document.getElementById('post-detail').innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-meta">
                <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${post.date}</span>
                ${post.readTime ? `<span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${post.readTime}</span>` : ''}
            </div>
            ${content}
        `;
        document.title = `${post.title} - sa9's Blog`;
        
        // 生成目录
        setTimeout(() => {
            generateTOC();
            if (window.Prism) {
                Prism.highlightAll();
            }
        }, 100);
    } catch (error) {
        document.getElementById('post-detail').innerHTML = '<p>加载文章失败</p>';
        document.querySelector('.table-of-contents').style.display = 'none';
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPost);
