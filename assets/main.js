/* ===========================================================
   唐山师范学院吧 · 共用脚本
   负责：导航滚动、移动端菜单、一言、二维码弹窗、
        意见反馈弹窗、平滑滚动、搜索、新闻卡片渲染、返回顶部
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 基础路径（区分首页与 news/ 子目录） ---------- */
    const basePath = (location.pathname.indexOf('/news/') !== -1) ? '../' : '';

    /* ---------- 当前语言 & 语言切换按钮 ----------
       注意：Cloudflare Pages 开启了「纯净 URL」，会把 /xxx-en.html 重定向到 /xxx-en
       （去掉 .html 后缀），所以 pathname 末尾可能没有 .html。
       这里统一按「去掉 .html 后的文件名」是否以 -en 结尾判断语言，兼容带/不带后缀两种访问方式。 */
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const currentBase = currentFile.replace(/\.html$/, '');
    const isEn = /-en$/.test(currentBase);
    const hasExt = /\.html$/.test(currentFile);
    const counterpart = isEn
        ? currentBase.replace(/-en$/, '') + (hasExt ? '.html' : '')
        : currentBase + '-en' + (hasExt ? '.html' : '');

    function addLangToggle() {
        const toggleText = isEn ? '中文' : 'English';
        const newsNavLink = document.querySelector('#mainNav [data-nav="news"]');
        if (newsNavLink && newsNavLink.parentElement) {
            const desktopLinks = newsNavLink.parentElement;
            const a = document.createElement('a');
            a.href = counterpart;
            a.textContent = toggleText;
            a.className = 'text-gray-700 hover:text-primary font-medium transition-colors';
            desktopLinks.appendChild(a);
        }
        const mobileMenuEl = document.getElementById('mobileMenu');
        if (mobileMenuEl) {
            const mobileContainer = mobileMenuEl.querySelector('.space-y-3') || mobileMenuEl;
            const ma = document.createElement('a');
            ma.href = counterpart;
            ma.textContent = toggleText;
            ma.className = 'block py-3 text-gray-700 hover:bg-gray-100 px-3 rounded-lg';
            mobileContainer.appendChild(ma);
        }
    }
    addLangToggle();

    /* ---------- 导航栏滚动阴影 ---------- */
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainNav.classList.add('nav-shadow');
            } else {
                mainNav.classList.remove('nav-shadow');
            }
        });
    }

    /* ---------- 移动端菜单 ---------- */
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuBtn.innerHTML = mobileMenu.classList.contains('hidden')
                ? '<i class="fa fa-bars text-xl"></i>'
                : '<i class="fa fa-times text-xl"></i>';
        });
        document.querySelectorAll('#mobileMenu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuBtn.innerHTML = '<i class="fa fa-bars text-xl"></i>';
            });
        });
    }

    /* ---------- 高亮当前导航（新闻相关页面） ---------- */
    const path = window.location.pathname;
    if (/(\/news(-en)?)(\.html)?$/.test(path) || path.includes('/news/')) {
        document.querySelectorAll('[data-nav="news"]').forEach(el => {
            el.classList.add('text-primary', 'font-semibold');
            el.classList.remove('text-gray-700');
        });
    }

    /* ---------- 一言功能 ---------- */
    const hitokotoEl = document.getElementById('hitokoto');
if (hitokotoEl) {
    if (isEn) {
        // 英文版：一言接口返回的是中文语录，改为一句固定的英文名言
        hitokotoEl.textContent = 'Education is the kindling of a flame, not the filling of a vessel.';
    } else {
        // 页面一执行就显示加载文字
        hitokotoEl.textContent = '勤思笃学，修身律己';
        // 带超时的请求：外部接口慢或被墙时，3 秒内自动回退到本地名言，避免一直转圈
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);
        fetch('https://v1.hitokoto.cn/?c=d', { signal: controller.signal })
            .then(response => response.json())
            .then(data => { hitokotoEl.textContent = data.hitokoto; })
            .catch(() => {
                const quotes = [
                    '勤思笃学 修身律己',
                    '学而不思则罔，思而不学则殆',
                    '三人行，必有我师焉',
                    '敏而好学，不耻下问',
                    '学而不厌，诲人不倦'
                ];
                hitokotoEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
            })
            .finally(() => clearTimeout(timer));
    }
}


    /* ---------- 二维码弹窗 ---------- */
    const qrModal = document.getElementById('qrModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const qrImage = document.getElementById('qrImage');
    const qrDesc = document.getElementById('qrDesc');
    const saveQrBtn = document.getElementById('saveQrBtn');

    const socialMediaZh = {
        wechat: {
            title: '微信公众号',
            image: basePath + 'assets/images/qr-wechat.jpg',
            desc: '扫码关注唐山师范学院吧微信公众号'
        },
        xiaohongshu: {
            title: '小红书',
            image: basePath + 'assets/images/qr-xiaohongshu.jpg',
            desc: '扫码关注唐山师范学院吧务组小红书账号（5973380211）'
        },
        qq: {
            title: 'QQ迎新群',
            image: basePath + 'assets/images/qq-group-qr.jpg',
            desc: '扫码加入唐山师范学院吧QQ迎新群（1046185965）'
        }
    };
    const socialMediaEn = {
        wechat: {
            title: 'WeChat Official Account',
            image: basePath + 'assets/images/qr-wechat.jpg',
            desc: 'Scan to follow the Tangshan Normal University Bar WeChat Official Account.'
        },
        xiaohongshu: {
            title: 'Xiaohongshu',
            image: basePath + 'assets/images/qr-xiaohongshu.jpg',
            desc: 'Scan to follow the TSNU Bar Mod Team Xiaohongshu account (5973380211).'
        },
        qq: {
            title: 'QQ New Student Group',
            image: basePath + 'assets/images/qq-group-qr.jpg',
            desc: 'Scan to join the TSNU Bar QQ New Student Group (1046185965).'
        }
    };
    const socialMedia = isEn ? socialMediaEn : socialMediaZh;

    function openQrModal(type) {
        const data = socialMedia[type];
        if (!data || !qrModal) return;
        modalTitle.textContent = data.title;
        qrImage.src = data.image;
        qrDesc.textContent = data.desc;
        qrModal.classList.remove('hidden');
        const box = qrModal.querySelector('div');
        box.classList.remove('opacity-0', 'scale-95');
        box.classList.remove('animate-search-pop');
        void box.offsetWidth;
        setTimeout(() => {
            qrModal.classList.remove('opacity-0');
            box.classList.add('animate-search-pop');
        }, 10);
    }

    function closeQrModal() {
        if (!qrModal) return;
        qrModal.classList.add('opacity-0');
        const box = qrModal.querySelector('div');
        box.classList.add('opacity-0', 'scale-95');
        setTimeout(() => qrModal.classList.add('hidden'), 300);
    }

    const wechatBtn = document.getElementById('wechatBtn');
    const xiaohongshuBtn = document.getElementById('xiaohongshuBtn');
    const qqBtn = document.getElementById('qqBtn');
    if (wechatBtn) wechatBtn.addEventListener('click', () => openQrModal('wechat'));
    if (xiaohongshuBtn) xiaohongshuBtn.addEventListener('click', () => openQrModal('xiaohongshu'));
    if (qqBtn) qqBtn.addEventListener('click', () => openQrModal('qq'));
    if (closeModal) closeModal.addEventListener('click', closeQrModal);
    if (qrModal) {
        qrModal.addEventListener('click', (e) => { if (e.target === qrModal) closeQrModal(); });
        if (saveQrBtn) {
            saveQrBtn.addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = qrImage.src;
                link.download = modalTitle.textContent + '二维码.png';
                link.click();
            });
        }
    }

    /* ---------- 意见反馈弹窗 ---------- */
    const feedbackBtn = document.getElementById('feedbackBtn');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeFeedbackModal = document.getElementById('closeFeedbackModal');

    function openFeedbackModal() {
        if (!feedbackModal) return;
        feedbackModal.classList.remove('hidden');
        const box = feedbackModal.querySelector('div');
        box.classList.remove('opacity-0', 'scale-95');
        box.classList.remove('animate-search-pop');
        void box.offsetWidth;
        setTimeout(() => {
            feedbackModal.classList.remove('opacity-0');
            box.classList.add('animate-search-pop');
        }, 10);
    }

    function closeFeedbackModalFunc() {
        if (!feedbackModal) return;
        feedbackModal.classList.add('opacity-0');
        const box = feedbackModal.querySelector('div');
        box.classList.add('opacity-0', 'scale-95');
        setTimeout(() => feedbackModal.classList.add('hidden'), 300);
    }

    if (feedbackBtn) feedbackBtn.addEventListener('click', openFeedbackModal);
    if (closeFeedbackModal) closeFeedbackModal.addEventListener('click', closeFeedbackModalFunc);
    if (feedbackModal) {
        feedbackModal.addEventListener('click', (e) => {
            if (e.target === feedbackModal) closeFeedbackModalFunc();
        });
    }

    /* ---------- 平滑滚动（锚点） ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target === '#' || !document.querySelector(target)) return;
            e.preventDefault();
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ---------- 站内搜索功能 ---------- */
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // 搜索索引只抓取一次并缓存（由构建期 generate-manifest.js 生成，按语言拆分为 zh / en）
    let searchIndexCache = null;
    function loadSearchIndex() {
        if (searchIndexCache) return Promise.resolve(searchIndexCache);
        const url = window.__SEARCH_INDEX_URL__ || '/assets/search-index.json';
        return fetch(url)
            .then(r => r.json())
            .then(d => { searchIndexCache = d; return d; });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    // 高亮任意文本中的命中词
    function highlightHtml(text, query) {
        const safeQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp('(' + safeQ + ')', 'gi');
        return escapeHtml(text).replace(re,
            '<mark style="background:#fde68a;color:inherit;padding:0 2px;border-radius:3px">$1</mark>');
    }

    // 生成带高亮的片段：命中词前后各取 radius 个字符；若正文未命中则取前 140 字作为摘要
    function buildSnippet(text, query, radius) {
        const q = query.toLowerCase();
        const lower = text.toLowerCase();
        let idx = lower.indexOf(q);
        if (idx === -1) {
            const snippet = text.slice(0, 140);
            return escapeHtml(snippet) + (text.length > 140 ? '…' : '');
        }
        const start = Math.max(0, idx - radius);
        const end = Math.min(text.length, idx + query.length + radius);
        let snippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
        return highlightHtml(snippet, query);
    }

    // 懒创建搜索结果弹层（重新设计：渐变图标 + 圆角输入框 + 结果卡片 + 入场动画）
    function ensureSearchModal() {
        let modal = document.getElementById('searchModal');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'searchModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300';
        modal.style.zIndex = '60';
        modal.innerHTML =
            '<div class="relative w-full origin-center overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 flex flex-col transition-all duration-200 animate-search-pop" style="max-width:42rem;max-height:84vh">' +
                '<div class="px-6 pt-6 pb-4">' +
                    '<div class="flex items-center justify-between">' +
                        '<div class="flex items-center gap-3">' +
                            '<span class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-md"><i class="fa fa-search"></i></span>' +
                            '<h3 class="text-lg font-bold text-gray-800">' + (isEn ? 'Site Search' : '全站搜索') + '</h3>' +
                        '</div>' +
                        '<button id="searchModalClose" aria-label="' + (isEn ? 'Close' : '关闭') + '" class="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"><i class="fa fa-times"></i></button>' +
                    '</div>' +
                    '<div class="relative mt-4">' +
                        '<i class="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>' +
                        '<input id="searchModalInput" type="text" placeholder="' + (isEn ? 'Search keywords...' : '输入关键词搜索...') + '" class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-24 text-gray-700 placeholder-gray-400 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />' +
                        '<button id="searchModalBtn" class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-secondary">' + (isEn ? 'Search' : '搜索') + '</button>' +
                    '</div>' +
                '</div>' +
                '<div id="searchModalBody" class="px-6 pb-6 pt-1" style="overflow-y:auto"></div>' +
            '</div>';
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeSearchModal(); });
        document.getElementById('searchModalClose').addEventListener('click', closeSearchModal);
        const input = document.getElementById('searchModalInput');
        const runFromModal = () => openSearch(input.value);
        document.getElementById('searchModalBtn').addEventListener('click', runFromModal);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') runFromModal(); });
        return modal;
    }

    function openSearchModal() {
        const modal = ensureSearchModal();
        modal.classList.remove('hidden');
        const box = modal.querySelector('div');
        box.classList.remove('opacity-0', 'scale-95');
        box.classList.remove('animate-search-pop');
        void box.offsetWidth; // 触发重排以重放入场动画
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            box.classList.add('animate-search-pop');
        }, 10);
    }

    function closeSearchModal() {
        const modal = document.getElementById('searchModal');
        if (!modal) return;
        modal.classList.add('opacity-0');
        const box = modal.querySelector('div');
        box.classList.add('opacity-0', 'scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    // 三种占位：空状态 / 加载中 / 使用提示
    function searchEmpty() {
        return '<div class="flex flex-col items-center justify-center py-12 text-center">' +
            '<span class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400"><i class="fa fa-search-minus text-xl"></i></span>' +
            '<p class="text-gray-500">' + (isEn ? 'No matching pages found.' : '未找到相关页面') + '</p>' +
            '<p class="mt-1 text-xs text-gray-400">' + (isEn ? 'Try different keywords.' : '换个关键词试试吧') + '</p>' +
        '</div>';
    }
    function searchLoading() {
        return '<div class="flex items-center justify-center py-12 text-gray-400"><i class="fa fa-spinner fa-spin text-2xl"></i></div>';
    }
    function searchHint() {
        return '<div class="flex flex-col items-center justify-center py-10 text-center">' +
            '<span class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-primary"><i class="fa fa-compass text-xl"></i></span>' +
            '<p class="text-gray-500">' + (isEn ? 'Type to search the whole site' : '输入关键词，跨全站搜索标题与正文') + '</p>' +
            '<p class="mt-3 text-xs text-gray-400"><kbd class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5">Enter</kbd> ' + (isEn ? 'to search' : '搜索') + ' · <kbd class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5">Esc</kbd> ' + (isEn ? 'to close' : '关闭') + '</p>' +
        '</div>';
    }

    function showResults(query, results) {
        const body = document.getElementById('searchModalBody');
        if (!results.length) {
            body.innerHTML = searchEmpty();
            openSearchModal();
            return;
        }
        const header = '<p class="mb-4 text-sm text-gray-400">' +
            (isEn ? 'Found ' : '共找到 ') + results.length +
            (isEn ? ' pages' : ' 个相关页面') + '</p>';
        const itemsHtml = results.map((r, i) => {
            const item = r.item;
            const url = '/' + item.url.replace(/^\/+/, ''); // 绝对路径，任意层级页面均可跳转
            const ql = query.toLowerCase();
            const inText = (item.text || '').toLowerCase().indexOf(ql) !== -1;
            return '<a href="' + url + '" class="group mb-3 flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg animate-result-in" style="animation-delay:' + (i * 45) + 'ms">' +
                '<span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><i class="fa fa-file-lines"></i></span>' +
                '<div class="min-w-0 flex-1">' +
                    '<div class="flex items-center gap-2 min-w-0">' +
                        '<div class="truncate text-[15px] font-semibold text-gray-800 transition-colors group-hover:text-primary">' + highlightHtml(item.title, query) + '</div>' +
                        (inText ? '' : '<span class="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">' + (isEn ? 'Title' : '标题') + '</span>') +
                    '</div>' +
                    '<div class="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500">' + buildSnippet(item.text, query, 70) + '</div>' +
                    '<div class="mt-1.5 text-xs text-secondary">' + escapeHtml(url) + '</div>' +
                '</div>' +
                '<i class="fa fa-arrow-right self-center text-gray-300 transition group-hover:translate-x-1 group-hover:text-primary"></i>' +
            '</a>';
        }).join('');
        body.innerHTML = header + itemsHtml;
        body.scrollTop = 0;
        openSearchModal();
    }

    function runSearch(query) {
        const q = (query || '').trim();
        if (!q) return;
        const body = document.getElementById('searchModalBody');
        body.innerHTML = searchLoading();
        loadSearchIndex().then(data => {
            const list = isEn ? (data.en || []) : (data.zh || []);
            const ql = q.toLowerCase();
            const results = [];
            for (const item of list) {
                const inTitle = (item.title || '').toLowerCase().indexOf(ql) !== -1;
                const inText = (item.text || '').toLowerCase().indexOf(ql) !== -1;
                if (inTitle || inText) {
                    results.push({ item: item, score: inTitle ? 2 : 1 });
                }
            }
            results.sort((a, b) => b.score - a.score);
            showResults(query, results);
        }).catch(() => {
            const b = document.getElementById('searchModalBody');
            if (b) b.innerHTML = '<div class="py-12 text-center text-gray-500">' +
                (isEn ? 'Search index failed to load. Please refresh and try again.' :
                        '搜索索引加载失败，请刷新后重试。') + '</div>';
            openSearchModal();
        });
    }

    // 打开搜索弹层：可预填关键词并立即检索；为空则展示使用提示
    function openSearch(prefill) {
        const modal = ensureSearchModal();
        const input = document.getElementById('searchModalInput');
        if (prefill != null) input.value = prefill;
        if (!(prefill || '').trim()) {
            document.getElementById('searchModalBody').innerHTML = searchHint();
        }
        openSearchModal();
        setTimeout(() => input.focus(), 50);
        if ((prefill || '').trim()) runSearch(prefill);
    }

    // 顶栏注入搜索入口：桌面端导航末尾 + 移动端顶栏（汉堡菜单左侧）
    function addSearchButtons() {
        const desktopLinks = document.querySelector('#mainNav .hidden.md\\:flex');
        if (desktopLinks && !document.getElementById('navSearchBtn')) {
            const btn = document.createElement('button');
            btn.id = 'navSearchBtn';
            btn.className = 'text-gray-700 hover:text-primary transition-colors p-1';
            btn.innerHTML = '<i class="fa fa-search text-lg"></i>';
            btn.title = isEn ? 'Search' : '搜索';
            desktopLinks.appendChild(btn);
            btn.addEventListener('click', () => openSearch(''));
        }
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn && menuBtn.parentElement && !document.getElementById('mobileTopSearchBtn')) {
            const container = menuBtn.parentElement;
            container.classList.add('flex', 'items-center');
            const topSearchBtn = document.createElement('button');
            topSearchBtn.id = 'mobileTopSearchBtn';
            topSearchBtn.className = 'text-gray-700 hover:text-primary transition-colors mr-4';
            topSearchBtn.innerHTML = '<i class="fa fa-search text-lg"></i>';
            topSearchBtn.title = isEn ? 'Search' : '搜索';
            topSearchBtn.setAttribute('aria-label', isEn ? 'Search' : '搜索');
            container.insertBefore(topSearchBtn, menuBtn);
            topSearchBtn.addEventListener('click', () => openSearch(''));
        }
    }
    addSearchButtons();

    // 首页头部搜索框：输入并回车/点击 → 打开弹层并检索
    if (searchButton) searchButton.addEventListener('click', () => openSearch(searchInput.value));
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') openSearch(searchInput.value); });
    }
    // ESC 关闭搜索结果弹层
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearchModal();
    });

    /* ---------- 新闻卡片渲染 ---------- */
    // 中英文分类统一映射到 Font Awesome 图标（新增文章请保持分类名与此一致）
    const CATEGORY_ICON = {
        '公告': 'fa-bullhorn',
        '通知': 'fa-bell',
        '指南': 'fa-compass',
        '总结': 'fa-chart-line',
        '活动': 'fa-calendar-days',
        'Announcement': 'fa-bullhorn',
        'Notice': 'fa-bell',
        'Guide': 'fa-compass',
        'Summary': 'fa-chart-line',
        'Activity': 'fa-calendar-days'
    };

    function buildNewsCard(item) {
        const icon = CATEGORY_ICON[item.category] || 'fa-newspaper';
        const readMore = isEn ? 'Read More' : '阅读全文';
        const coverHtml = item.cover
            ? '<img src="' + item.cover + '" alt="" loading="lazy" class="w-full h-44 object-cover">'
            : '<div class="w-full h-44 bg-gradient-primary flex items-center justify-center">' +
                '<i class="fa ' + icon + ' text-white/80 text-4xl"></i></div>';
        return '' +
            '<a href="news/' + item.slug + '.html" class="bg-white rounded-xl shadow-md overflow-hidden card-hover flex flex-col">' +
                coverHtml +
                '<div class="p-6 flex-1 flex flex-col">' +
                    '<div class="flex items-center text-xs text-gray-500 mb-3">' +
                        '<span class="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-medium">' + item.category + '</span>' +
                        '<span class="ml-3"><i class="fa fa-calendar mr-1"></i>' + item.date + '</span>' +
                    '</div>' +
                    '<h3 class="text-lg font-semibold text-primary mb-2 leading-snug">' + item.title + '</h3>' +
                    '<p class="text-gray-600 text-sm flex-1 line-clamp-2">' + item.excerpt + '</p>' +
                    '<span class="text-secondary text-sm font-medium mt-4">' + readMore + ' <i class="fa fa-arrow-right"></i></span>' +
                '</div>' +
            '</a>';
    }

    // 读取构建时自动生成的 news-manifest.json / news-manifest-en.json
    // （由 generate-manifest.js 扫描 news/ 生成，英文页使用 __NEWS_EN__）
    // 因此只需新建/修改文章 HTML（含 #articleMeta），部署即自动同步，无需手动维护列表
    function renderNewsFromManifest(containerId, limit) {
        var box = document.getElementById(containerId);
        if (!box) return;
        var data = isEn ? (window.__NEWS_EN__ || []) : (window.__NEWS__ || []);
        if (data && data.length) {
            var valid = data.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
            var shown = (limit && limit > 0) ? valid.slice(0, limit) : valid;
            box.innerHTML = shown.map(buildNewsCard).join('');
            return;
        }
        // 兜底：本地未生成内联数据时，回退到对应语言清单地址
        var url = isEn ? 'news-manifest-en.json' : (window.NEWS_MANIFEST_URL || 'news-manifest.json');
        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (items) {
                var valid2 = (items || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
                var shown = (limit && limit > 0) ? valid2.slice(0, limit) : valid2;
                box.innerHTML = shown.map(buildNewsCard).join('');
            })
            .catch(function () {
                box.innerHTML = '<p class="text-gray-500 col-span-full">本地预览请先运行：node generate-manifest.js</p>';
            });
    }

    // 列表页：全部文章；首页预览：最新 3 条（按日期自动取最新）
    renderNewsFromManifest('newsGrid', 0);
    renderNewsFromManifest('newsPreview', 3);

    /* ---------- 返回顶部 ---------- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- 唐山大地震五十周年悼念标语 ---------- */
    // 7月28日 00:00 至 7月29日 00:00（北京时间）在顶栏与标题之间显示，届时自动消失。
    (function insertMemorialBanner() {
        try {
            const start = new Date('2026-07-28T00:00:00+08:00').getTime();
            const end = new Date('2026-07-29T00:00:00+08:00').getTime();
            if (Date.now() < start || Date.now() >= end) return;
            const header = document.querySelector('body > header');
            const container = header && header.querySelector('.container');
            if (!header || !container) return;
            const text = isEn ? 'We will never forget the victims of the Tangshan Earthquake.' : '唐山大地震罹难同胞永垂不朽！';
            const banner = document.createElement('div');
            banner.className = 'relative z-10 text-center text-[clamp(1rem,2vw,1.2rem)] font-bold text-white animate-fade-in pt-4 pb-2';
            banner.textContent = text;
            header.insertBefore(banner, container);
        } catch (e) { /* 忽略，不影响正常浏览 */ }
    })();
});

/* ---------- 唐山大地震五十周年悼念置灰 ---------- */
// 7月28日 00:00 至 7月29日 00:00（北京时间）全站置灰以志哀，届时自动恢复，无需重新部署。
// 采用 backdrop-filter 遮罩：只对背景内容去色，不影响固定导航 / 弹窗的定位与点击。
(function applyMourningGray() {
    try {
        const start = new Date('2026-07-28T00:00:00+08:00').getTime();
        const end = new Date('2026-07-29T00:00:00+08:00').getTime();
        const now = Date.now();
        if (now < start || now >= end) return;
        const overlay = document.createElement('div');
        overlay.id = 'mourningGray';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.style.cssText =
            'position:fixed;inset:0;z-index:9999;pointer-events:none;' +
            'background:rgba(110,110,110,0.06);' +
            'backdrop-filter:grayscale(1);-webkit-backdrop-filter:grayscale(1);';
        document.body.appendChild(overlay);
    } catch (e) { /* 出错也不阻断正常浏览 */ }
})();
