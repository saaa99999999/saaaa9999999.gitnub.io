// 文章数据（与 script.js 保持一致）
const posts = [];

// 按年份分组文章
function groupByYear() {
    const grouped = {};
    posts.forEach(post => {
        const year = post.date.substring(0, 4);
        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push(post);
    });
    return grouped;
}

// 加载归档
function loadArchive() {
    const container = document.getElementById('archive-container');
    document.getElementById('archive-count').textContent = posts.length;
    
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
    
    const grouped = groupByYear();
    const years = Object.keys(grouped).sort((a, b) => b - a);
    
    let html = '<div class="archive-list">';
    years.forEach(year => {
        html += `
            <div class="archive-year">
                <h2 class="year-title">${year} 年 <span class="year-count">(${grouped[year].length})</span></h2>
                <div class="archive-posts">
        `;
        grouped[year].forEach(post => {
            html += `
                <div class="archive-item">
                    <span class="archive-date">${post.date}</span>
                    <a href="post.html?id=${post.id}" class="archive-title">${post.title}</a>
                </div>
            `;
        });
        html += '</div></div>';
    });
    html += '</div>';
    
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadArchive);
