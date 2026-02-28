// 文章数据（与 script.js 保持一致）
const posts = [];

// 加载标签
function loadTags() {
    const container = document.getElementById('tags-container');
    
    // 统计标签
    const tagCount = {};
    posts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        }
    });
    
    const tags = Object.keys(tagCount);
    document.getElementById('tags-count').textContent = tags.length;
    
    if (tags.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏷️</div>
                <h3>暂无标签</h3>
                <p>敬请期待精彩内容...</p>
            </div>
        `;
        return;
    }
    
    // 按文章数量排序
    tags.sort((a, b) => tagCount[b] - tagCount[a]);
    
    let html = '<div class="tag-cloud" style="gap: 12px;">';
    tags.forEach(tag => {
        const count = tagCount[tag];
        const size = Math.min(1 + count * 0.1, 1.5);
        html += `<span class="tag" style="font-size: ${size}rem;">${tag} (${count})</span>`;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadTags);
