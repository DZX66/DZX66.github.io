import { decrypt } from './components/euw-crypto.js';

(function () {
    "use strict";

    // ---------- 路径规范化（去除 public/ 或 public\ 前缀，统一为正斜杠）----------
    function normalizePath(path) {
        // 1. 将反斜杠全部转为正斜杠（URL 标准）
        let normalized = path.replace(/\\/g, '/');
        // 2. 去除开头的 public/（可选前导斜杠）
        normalized = normalized.replace(/^\/?public\//, '');
        return normalized;
    }

    // ---------- Cookie 工具 ----------
    function setCookie(name, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }

    function getCookie(name) {
        const key = encodeURIComponent(name) + '=';
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
            c = c.trim();
            if (c.indexOf(key) === 0) return decodeURIComponent(c.substring(key.length));
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // 生成基于密码提示的 Cookie 键名（Base64 编码以避免特殊字符）
    function getCookieKeyFromHint(hint) {
        // 将提示文本转为 UTF-8 字节后再 Base64，确保跨浏览器一致性
        const utf8Bytes = new TextEncoder().encode(hint);
        return btoa(String.fromCharCode(...utf8Bytes));
    }


    // ---------- 全局配置 ----------
    const PAGES_INDEX_URL = '/pages.json';
    const TEMPLATES_URL = '/js/euw.templates.js';

    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('id');

    const contentEl = document.getElementById('pageContent');
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    let templates = {};
    let pageMeta = null;

    // ---------- 侧边栏 DOM 元素 ----------
    const sidebar = document.getElementById('pageSidebar');
    const tocContainer = document.getElementById('tableOfContents');
    const fab = document.getElementById('tocFab');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('closeSidebarBtn');

    const githubLink = document.getElementById('githubSourceLink');
    const sourceLink = document.getElementById('sourceCodeLink');
    const historyLink = document.getElementById('historyLink');

    // ---------- 富文本悬浮提示 ----------
    let tooltipEl = null;
    let hideTimer = null;
    let currentRefSup = null;

    function createTooltip() {
        if (tooltipEl) return;
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'ref-tooltip';
        tooltipEl.style.cssText = `
            position: absolute;
            background: #fff;
            border: 1px solid var(--border-light, #ddd);
            border-radius: 8px;
            padding: 10px 14px;
            max-width: 400px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            font-size: 0.9rem;
            line-height: 1.5;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.2s;
            color: #333;
            pointer-events: none;
        `;
        document.body.appendChild(tooltipEl);
        tooltipEl.addEventListener('mouseenter', () => clearHideTimer());
        tooltipEl.addEventListener('mouseleave', () => scheduleHide());
    }

    function clearHideTimer() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    function scheduleHide() {
        clearHideTimer();
        hideTimer = setTimeout(() => hideTooltip(), 150);
    }

    function showTooltip(contentHtml, targetElement) {
        createTooltip();
        clearHideTimer();
        tooltipEl.innerHTML = contentHtml;
        tooltipEl.style.opacity = '1';
        tooltipEl.style.pointerEvents = 'auto';
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const tooltipHeight = tooltipEl.offsetHeight || 60;
        let top = rect.top + scrollTop - tooltipHeight - 8;
        let left = rect.left + scrollLeft + rect.width / 2;
        if (top < scrollTop + 10) {
            top = rect.bottom + scrollTop + 8;
            tooltipEl.classList.add('tooltip-below');
        } else {
            tooltipEl.classList.remove('tooltip-below');
        }
        tooltipEl.style.top = `${top}px`;
        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.transform = 'translateX(-50%)';
        const tooltipRect = tooltipEl.getBoundingClientRect();
        if (left - tooltipRect.width / 2 < 10) {
            tooltipEl.style.left = `${10 + tooltipRect.width / 2}px`;
        } else if (left + tooltipRect.width / 2 > window.innerWidth - 10) {
            tooltipEl.style.left = `${window.innerWidth - 10 - tooltipRect.width / 2}px`;
        }
    }

    function hideTooltip() {
        if (tooltipEl) {
            tooltipEl.style.opacity = '0';
            tooltipEl.style.pointerEvents = 'none';
        }
        currentRefSup = null;
        clearHideTimer();
    }

    function initTooltipEvents() {
        document.addEventListener('mouseenter', (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            const sup = target.closest('.ref-sup');
            if (!sup) return;

            const refHtml = sup.getAttribute('data-ref-html');
            if (refHtml) {
                clearHideTimer();
                if (currentRefSup !== sup) {
                    currentRefSup = sup;
                    showTooltip(refHtml, sup);
                }
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            const sup = target.closest('.ref-sup');
            if (sup && sup === currentRefSup) {
                scheduleHide();
            }
        }, true);

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (target.closest('.ref-sup a')) {
                hideTooltip();
            }
        });
    }

    // ---------- 工具函数：加载模板 ----------
    async function loadTemplates() {
        try {
            const response = await fetch(TEMPLATES_URL);
            let scriptText = await response.text();
            const module = { exports: {} };
            const exports = module.exports;
            const func = new Function('module', 'exports', scriptText);
            func(module, exports);
            templates = module.exports.templates || {};
            console.log('✅ 模板加载成功', Object.keys(templates));
        } catch (err) {
            console.error('❌ 模板加载失败:', err);
            throw new Error('无法加载模板定义文件');
        }
    }

    async function loadPageIndex() {
        const res = await fetch(PAGES_INDEX_URL);
        if (!res.ok) throw new Error(`无法加载页面索引 (${res.status})`);
        return await res.json();
    }

    async function loadMeta(metaPath) {
        // metaPath 来自 pages.json 中的值，同样需要规范化
        const normalized = normalizePath(metaPath);
        const res = await fetch('/' + normalized);
        if (!res.ok) throw new Error(`元数据加载失败 (${res.status})`);
        return await res.json();
    }

    async function loadEuwSource(filePath) {
        const normalized = normalizePath(filePath);
        const res = await fetch('/' + normalized);
        if (!res.ok) throw new Error(`EUW 文件加载失败 (${res.status})`);
        return await res.text();
    }

    // ---------- 处理 <refer> 标签 ----------
    function processRefers(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        const refers = div.querySelectorAll('refer');
        const refItems = [];
        if (refers.length === 0) {
            return { processedHtml: htmlString, refItems };
        }
        refers.forEach((refer, index) => {
            const idx = index + 1;
            const contentHtml = refer.innerHTML;
            const sup = document.createElement('sup');
            sup.className = 'ref-sup';
            sup.id = `ref-src-${idx}`;
            sup.setAttribute('data-ref-index', idx);
            sup.setAttribute('data-ref-html', contentHtml);
            const link = document.createElement('a');
            link.href = `#ref-note-${idx}`;
            link.textContent = `[${idx}]`;
            sup.appendChild(link);
            refer.parentNode.replaceChild(sup, refer);
            refItems.push({ id: idx, content: contentHtml });
        });
        return { processedHtml: div.innerHTML, refItems };
    }

    // ---------- 移除注释 ----------
    function removeComments(text) {
        const protectedBlocks = [];
        let counter = 0;
        const placeholder = () => `__PROTECTED_${counter++}__`;
        text = text.replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g, (match) => {
            const ph = placeholder();
            protectedBlocks.push({ ph, content: match });
            return ph;
        });
        text = text.replace(/`[^`]*`/g, (match) => {
            const ph = placeholder();
            protectedBlocks.push({ ph, content: match });
            return ph;
        });
        text = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
            const ph = placeholder();
            protectedBlocks.push({ ph, content: match });
            return ph;
        });
        text = text.replace(/<!--[\s\S]*?-->/g, '');
        text = text.replace(/(^|\s)\/\/.*$/gm, '$1');
        protectedBlocks.forEach(({ ph, content }) => {
            text = text.replace(ph, content);
        });
        return text;
    }

    // ---------- EUW 解析器 ----------
    // ---------- 保护代码块（多行和行内）----------
    function protectCodeBlocks(text) {
        const blocks = [];
        let counter = 0;
        const placeholder = () => `__CODE_BLOCK_${counter++}__`;

        // 1. 保护多行代码块（``` 或 ~~~）
        text = text.replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g, (match) => {
            const ph = placeholder();
            blocks.push({ ph, content: match });
            return ph;
        });

        // 2. 保护行内代码块（`...`），注意转义反引号情况较少，简单处理
        text = text.replace(/`[^`]*`/g, (match) => {
            const ph = placeholder();
            blocks.push({ ph, content: match });
            return ph;
        });

        return { protectedText: text, blocks };
    }

    function restoreCodeBlocks(text, blocks) {
        let result = text;
        blocks.forEach(({ ph, content }) => {
            // 使用全局替换以确保所有出现的地方都被恢复（通常占位符唯一）
            result = result.split(ph).join(content);
        });
        return result;
    }

    // ---------- EUW 解析器----------
    function parseEuw(euwText) {
        // 第一步：保护代码块，避免内部被模板引擎解析
        const { protectedText, blocks } = protectCodeBlocks(euwText);

        // 第二步：移除注释（在受保护的文本上操作）
        let parsed = removeComments(protectedText);

        // 第三步：执行模板替换
        const templateRegex = /\{([a-zA-Z_][a-zA-Z0-9_-]*)(?:\|([^}]*))?\}/g;
        let match;
        while ((match = templateRegex.exec(protectedText)) !== null) {
            const [fullMatch, templateName, paramString] = match;
            if (!templates[templateName]) {
                console.warn(`<i class="fas fa-exclamation-triangle"></i> 未知模板: ${templateName}`);
                parsed = parsed.replace(fullMatch, `<span style="color:red;">[未知模板: ${templateName}]</span>`);
                continue;
            }

            const templateDef = templates[templateName];
            const params = {};
            if (paramString) {
                const paramRegex = /([a-zA-Z_][a-zA-Z0-9_-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^,}\s]+))/g;
                let pmatch;
                while ((pmatch = paramRegex.exec(paramString)) !== null) {
                    const key = pmatch[1];
                    let value;
                    let isQuoted = false;

                    if (pmatch[2] !== undefined) {
                        value = pmatch[2];
                        isQuoted = true;
                    } else if (pmatch[3] !== undefined) {
                        value = pmatch[3];
                        isQuoted = true;
                    } else {
                        value = pmatch[4];
                        isQuoted = false;
                    }

                    if (!isQuoted) {
                        // 只有无引号值才进行类型推断
                        if (value === 'true') params[key] = true;
                        else if (value === 'false') params[key] = false;
                        else if (!isNaN(value) && value.trim() !== '') params[key] = Number(value);
                        else params[key] = value;
                    } else {
                        // 带引号值强制为字符串
                        params[key] = value;
                    }
                }
            }

            if (templateDef.params) {
                Object.entries(templateDef.params).forEach(([key, spec]) => {
                    if (params[key] === undefined && spec.default !== undefined) {
                        params[key] = spec.default;
                    }
                });
            }

            try {
                const html = templateDef.render(params);
                parsed = parsed.replace(fullMatch, html);
            } catch (err) {
                console.error(`<i class="fas fa-times-circle"></i> 模板 ${templateName} 渲染出错:`, err);
                parsed = parsed.replace(fullMatch, `<span style="color:red;">[模板渲染错误: ${templateName}]</span>`);
            }
        }

        // 第四步：恢复被保护的代码块
        parsed = restoreCodeBlocks(parsed, blocks);

        // 第五步：Markdown 解析
        marked.setOptions({ breaks: true, gfm: true, headerIds: true, mangle: false });
        return marked.parse(parsed);
    }

    // ---------- 生成目录 ----------
    function generateTOC() {
        if (!tocContainer) return;
        const contentArea = document.querySelector('.euw-content');
        if (!contentArea) {
            tocContainer.innerHTML = '<div class="toc-empty">暂无目录</div>';
            return;
        }
        const headings = contentArea.querySelectorAll('h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            tocContainer.innerHTML = '<div class="toc-empty">暂无标题</div>';
            return;
        }

        const toc = document.createElement('ul');
        toc.className = 'toc-list';
        const stack = [{ level: 1, ul: toc }];
        // 计数器数组，索引对应标题级别
        const counter = [0, 0, 0, 0, 0, 0, 0]; // 忽略索引0，使用 1-6

        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent;
            if (!heading.id) {
                heading.id = 'heading-' + Math.random().toString(36).substr(2, 8);
            }
            const id = heading.id;

            // 更新计数器
            counter[level]++;
            // 重置所有更深级别的计数器
            for (let i = level + 1; i <= 6; i++) counter[i] = 0;

            // 生成序号字符串
            let numbering = '';
            for (let i = 2; i <= level; i++) {
                if (counter[i] > 0) {
                    numbering += counter[i] + '.';
                }
            }
            // 对于 H2 直接显示 "1." 格式，从 H3 开始显示 "1.1." 等
            if (level === 2) {
                numbering = counter[2] + '. ';
            } else {
                numbering = '';
                for (let i = 2; i <= level; i++) {
                    numbering += counter[i] + '.';
                }
                numbering += ' ';
            }

            const displayText = numbering + text;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = displayText;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                if (window.innerWidth <= 768) closeSidebar();
            });
            li.appendChild(a);

            // 寻找合适的父级 ul
            while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                stack.pop();
            }
            if (stack.length === 0) stack.push({ level: 1, ul: toc });

            const parent = stack[stack.length - 1];
            if (level > parent.level) {
                const newUl = document.createElement('ul');
                li.appendChild(newUl);
                parent.ul.appendChild(li);
                stack.push({ level: level, ul: newUl });
            } else {
                parent.ul.appendChild(li);
            }
        });

        tocContainer.innerHTML = '';
        tocContainer.appendChild(toc);
    }

    // ---------- 更新侧边栏外部链接 ----------
    function updateSidebarLinks() {
        if (!pageMeta) return;
        const base = 'https://github.com/DZX66/DZX66.github.io/';
        const pagePath = pageMeta.file || pageId;
        if (githubLink) githubLink.href = `${base}blob/main/${pagePath}`;
        if (sourceLink) sourceLink.href = `/source?id=${pageId}`;
        if (historyLink) historyLink.href = `${base}commits/main/${pagePath}`;
    }

    // ---------- 侧边栏控制（移动端） ----------
    function closeSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function initSidebarEvents() {
        fab?.addEventListener('click', openSidebar);
        closeBtn?.addEventListener('click', closeSidebar);
        overlay?.addEventListener('click', closeSidebar);
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeSidebar();
        });
    }

    function applyPrism() {
        if (!Prism) { console.error("无法加载prism库！"); return; }
        document.querySelectorAll("pre > code").forEach((element) => { element.classList.add("line-numbers") });
        document.querySelectorAll("code").forEach((element) => {
            if (element.classList.toString().includes("language")) { return; }
            element.classList.add("language-none");
        });
        Prism.highlightAll();
    }

    // ---------- TOC 滚动高亮 ----------
    let tocScrollInitialized = false;

    function updateActiveTocItem() {
        const contentArea = document.querySelector('.euw-content');
        if (!contentArea) return;
        const headings = contentArea.querySelectorAll('h2, h3, h4, h5, h6');
        if (headings.length === 0) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let activeHeading = null;
        for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            const offsetTop = heading.offsetTop;
            if (offsetTop <= scrollTop + 100) {
                activeHeading = heading;
            } else {
                break;
            }
        }
        if (!activeHeading && headings.length > 0) {
            activeHeading = headings[0];
        }
        if (!activeHeading) return;

        const activeId = activeHeading.id;
        const allTocLinks = document.querySelectorAll('.toc-list a');
        let activeLink = null;
        allTocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                activeLink = link;
            }
        });
        if (activeLink) activeLink.classList.add('active');
    }

    function handleScrollAndResize() {
        if (window.requestAnimationFrame) {
            requestAnimationFrame(updateActiveTocItem);
        } else {
            updateActiveTocItem();
        }
    }

    function initTocScroll() {
        if (tocScrollInitialized) return;
        tocScrollInitialized = true;
        window.addEventListener('scroll', handleScrollAndResize);
        window.addEventListener('resize', handleScrollAndResize);
        handleScrollAndResize();
    }

    // ---------- 渲染页面 ----------
    function renderPage(euwHtml) {
        if (!pageMeta) return;

        const { processedHtml, refItems } = processRefers(euwHtml);
        document.title = `${pageMeta.title} · 柳下回声`;

        const createdDate = pageMeta.created ? new Date(pageMeta.created).toLocaleString('zh-CN') : '未知';
        const modifiedDate = pageMeta.modified ? new Date(pageMeta.modified).toLocaleString('zh-CN') : createdDate;
        let tagsHtml = '';
        if (pageMeta.tags && pageMeta.tags.length > 0) {
            tagsHtml = pageMeta.tags.map(t => `<span class="tag-indicator">#${t}</span>`).join('');
        }

        const metaBar = `
            <div class="page-meta">
                <div class="date-info">
                    <span><i class="fas fa-calendar-alt"></i> 创建: ${createdDate}</span>
                    <span><i class="fas fa-sync-alt"></i> 更新: ${modifiedDate}</span>
                </div>
                ${tagsHtml ? `<div class="tags-info"><i class="fas fa-tags"></i> ${tagsHtml}</div>` : ''}
            </div>
        `;

        let referencesHtml = '';
        if (refItems.length > 0) {
            referencesHtml = `<h2 id="page-references">注释及外部链接</h2><div class="references-list"><ol>`;
            refItems.forEach(item => {
                referencesHtml += `
                    <li id="ref-note-${item.id}" class="ref-item">
                        <a href="#ref-src-${item.id}" class="ref-backlink" title="返回正文">↑</a>
                        <span class="ref-content">${item.content}</span>
                    </li>
                `;
            });
            referencesHtml += `</ol></div>`;
        }

        contentEl.innerHTML = `
            <h1 style="font-size:2.2rem; margin-top:0; margin-bottom:0.5rem; color:var(--accent-deep);">${pageMeta.title}</h1>
            ${metaBar}
            <div class="euw-content">
                ${processedHtml}
                ${referencesHtml}
            </div>
        `;

        if (typeof window.play_music === 'undefined') {
            window.play_music = () => alert('音频播放功能需配合完整播放器脚本');
            window.pause_music = () => { };
        }

        // 处理 iframe 懒加载（数量超过阈值时）
        const iframes = contentEl.querySelectorAll('.euw-content iframe');
        const IFRAME_THRESHOLD = 5;
        if (iframes.length > IFRAME_THRESHOLD) {
            iframes.forEach(iframe => lazyReplaceIframe(iframe));
        }

        generateTOC();
        updateSidebarLinks();
        applyPrism();
        initTocScroll();
    }

    function lazyReplaceIframe(iframe) {
        const src = iframe.getAttribute('src');
        if (!src) return; // 无 src 的 iframe 不处理（或保留原样）

        // 保存原始属性
        const attributes = {};
        for (const attr of iframe.attributes) {
            attributes[attr.name] = attr.value;
        }

        // 创建占位元素
        const placeholder = document.createElement('div');
        placeholder.className = 'iframe-placeholder';
        placeholder.setAttribute('data-iframe-src', src);
        // 将属性存储为 data-* 以便恢复
        Object.entries(attributes).forEach(([key, value]) => {
            if (key !== 'src') {
                placeholder.dataset[`iframe${key.charAt(0).toUpperCase() + key.slice(1)}`] = value;
            }
        });

        // 提取域名用于显示
        let domain = '';
        try {
            domain = new URL(src, window.location.origin).hostname;
        } catch {
            domain = src;
        }

        placeholder.innerHTML = `
        <div class="placeholder-content">
            <span class="placeholder-icon"><i class="fas fa-tv"></i></span>
            <p>点击加载嵌入内容</p>
            <p class="placeholder-src">${domain}</p>
        </div>
    `;

        // 继承原 iframe 的宽高样式（如果有）
        if (attributes.width) placeholder.style.width = attributes.width;
        if (attributes.height) placeholder.style.height = attributes.height;
        if (iframe.style.cssText) placeholder.style.cssText = iframe.style.cssText;

        // 绑定点击事件
        placeholder.addEventListener('click', function onClick() {
            const newIframe = document.createElement('iframe');
            // 恢复 src
            newIframe.src = this.dataset.iframeSrc;
            // 恢复其他属性
            Object.keys(this.dataset).forEach(key => {
                if (key.startsWith('iframe')) {
                    const attrName = key.replace(/^iframe/, '').toLowerCase();
                    newIframe.setAttribute(attrName, this.dataset[key]);
                }
            });
            // 继承样式
            newIframe.style.cssText = this.style.cssText;
            // 替换占位符
            this.replaceWith(newIframe);
        }, { once: true });

        iframe.replaceWith(placeholder);
    }

    // ---------- 显示错误 ----------
    function showError(title, message) {
        document.title = `${title} · 柳下回声`;
        contentEl.innerHTML = `
            <h1 style="color:var(--accent-deep);">${title}</h1>
            <div class="error-message">
                <strong><i class="fas fa-exclamation-triangle"></i> 出错了</strong><br>
                ${message}
            </div>
            <p style="margin-top:1.5rem;"><a href="/" class="back-link">← 返回主页</a></p>
        `;
        if (tocContainer) tocContainer.innerHTML = '<div class="toc-empty">—</div>';
    }

    // ---------- 加密处理 ----------
    async function handleEncrypted(euwFilePath) {
        return new Promise(async (resolve, reject) => {
            // 1. 加载加密 JSON 数据
            let encryptedJson;
            try {
                const normalizedPath = normalizePath(euwFilePath);
                const res = await fetch('/' + normalizedPath);
                if (!res.ok) throw new Error(`无法加载加密文件 (${res.status})`);
                encryptedJson = await res.text();
            } catch (err) {
                reject(err);
                return;
            }

            const hint = pageMeta.passwordHint || '无提示';
            const cookieKey = getCookieKeyFromHint(hint);

            // 2. 尝试使用 Cookie 中的密码自动解密
            const savedPassword = getCookie(cookieKey);
            if (savedPassword) {
                try {
                    const plaintext = await decrypt(encryptedJson, savedPassword);
                    // 自动解密成功，直接返回内容，不显示密码界面
                    resolve(plaintext);
                    return;
                } catch (e) {
                    // 密码错误，删除无效 Cookie
                    deleteCookie(cookieKey);
                    console.warn('自动解密失败，已清除无效密码 Cookie');
                    // 继续显示密码输入界面
                }
            }

            // 3. 显示密码输入界面
            contentEl.innerHTML = `
            <h1><i class="fas fa-lock"></i> 此页面已加密</h1>
            <div class="password-panel">
                <p><strong>请输入访问密码</strong></p>
                <p style="font-size:0.9rem; margin-bottom:1rem;">密码提示：${hint}</p>
                <input type="password" id="passwordInput" placeholder="密码" autocomplete="off"
                       style="padding:0.5rem; width:200px; border-radius:6px; border:1px solid var(--border-light);">
                <button id="submitPassword" style="margin-left:0.5rem; padding:0.5rem 1.2rem; background:var(--accent-soft); color:white; border:none; border-radius:6px; cursor:pointer;">验证</button>
                <p id="passwordError" style="color:#c00; margin-top:0.5rem;"></p>
            </div>
            <p><a href="/" class="back-link">← 返回主页</a></p>
        `;

            const input = document.getElementById('passwordInput');
            const btn = document.getElementById('submitPassword');
            const errEl = document.getElementById('passwordError');

            const tryDecrypt = async () => {
                const pwd = input.value.trim();
                if (!pwd) {
                    errEl.textContent = '请输入密码';
                    return;
                }
                btn.disabled = true;
                btn.textContent = '解密中...';
                errEl.textContent = '';
                try {
                    const plaintext = await decrypt(encryptedJson, pwd);
                    // 解密成功：保存密码到 Cookie（有效期 7 天）
                    setCookie(cookieKey, pwd, 7);
                    resolve(plaintext);
                } catch (e) {
                    errEl.textContent = e.message;
                    btn.disabled = false;
                    btn.textContent = '验证';
                }
            };

            btn.addEventListener('click', tryDecrypt);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') tryDecrypt();
            });
            input.focus();
        });
    }
    // ---------- 主流程 ----------
    async function init() {
        if (!pageId) {
            showError('页面未指定', '请通过 ?id=页面标识 访问具体页面。');
            return;
        }

        try {
            const startTime = performance.now();

            await loadTemplates();
            console.log(`模板加载完成: ${performance.now() - startTime}ms`);

            const indexStart = performance.now();
            const index = await loadPageIndex();
            console.log(`页面索引加载: ${performance.now() - indexStart}ms`);

            const metaPath = index[pageId];
            if (!metaPath) throw new Error(`未找到页面 "${pageId}" 的索引记录`);

            const metaStart = performance.now();
            pageMeta = await loadMeta(metaPath);
            console.log(`元数据加载: ${performance.now() - metaStart}ms`);

            let euwSource;
            const sourceStart = performance.now();
            if (pageMeta.encrypted) {
                euwSource = await handleEncrypted(pageMeta.file);
            } else {
                euwSource = await loadEuwSource(pageMeta.file);
            }
            console.log(`内容源加载: ${performance.now() - sourceStart}ms`);

            const parseStart = performance.now();
            const euwHtml = parseEuw(euwSource);
            console.log(`内容解析: ${performance.now() - parseStart}ms`);

            const renderStart = performance.now();
            renderPage(euwHtml);
            console.log(`页面渲染: ${performance.now() - renderStart}ms`);

            const eventsStart = performance.now();
            initTooltipEvents();
            initSidebarEvents();
            console.log(`事件初始化: ${performance.now() - eventsStart}ms`);

            const totalTime = performance.now() - startTime;
            console.log(`页面加载总耗时: ${totalTime}ms`);

        } catch (error) {
            console.error('页面初始化失败:', error);
            showError('页面加载失败', error.message);
        }
    }

    init();
})();