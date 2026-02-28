/* PrismJS 简化版代码高亮 */
(function() {
    if (typeof self === 'undefined' || !self.Prism || !self.document) {
        return;
    }

    Prism.highlightAll = function() {
        const elements = document.querySelectorAll('pre code');
        elements.forEach(element => {
            const language = element.className.match(/language-(\w+)/);
            if (language) {
                highlightElement(element, language[1]);
            }
        });
    };

    function highlightElement(element, lang) {
        const code = element.textContent;
        let highlighted = code;

        // 简单的语法高亮规则
        const patterns = {
            comment: /\/\/.*|\/\*[\s\S]*?\*\//g,
            string: /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/g,
            keyword: /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|async|await|try|catch|new|this|super|extends)\b/g,
            number: /\b\d+\.?\d*\b/g,
            operator: /[+\-*/%=<>!&|]+/g,
            punctuation: /[{}[\]();,.:]/g
        };

        // 转义 HTML
        highlighted = highlighted.replace(/[<>&]/g, c => ({
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        }[c]));

        // 应用高亮
        highlighted = highlighted.replace(patterns.comment, '<span class="token comment">$&</span>');
        highlighted = highlighted.replace(patterns.string, '<span class="token string">$&</span>');
        highlighted = highlighted.replace(patterns.keyword, '<span class="token keyword">$&</span>');
        highlighted = highlighted.replace(patterns.number, '<span class="token number">$&</span>');

        element.innerHTML = highlighted;
    }

    // 自动执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', Prism.highlightAll);
    } else {
        Prism.highlightAll();
    }
})();

window.Prism = window.Prism || {};
Prism.manual = false;
