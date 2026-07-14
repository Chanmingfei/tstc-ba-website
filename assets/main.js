/* ===========================================================
   唐山师范学院吧 · 共用脚本
   负责：导航滚动、移动端菜单、一言、二维码弹窗、
        意见反馈弹窗、平滑滚动、搜索、新闻卡片渲染、返回顶部
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {

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
    if (path.includes('/news/') || path.endsWith('/news.html')) {
        document.querySelectorAll('[data-nav="news"]').forEach(el => {
            el.classList.add('text-primary', 'font-semibold');
            el.classList.remove('text-gray-700');
        });
    }

    /* ---------- 一言功能 ---------- */
    const hitokotoEl = document.getElementById('hitokoto');
    if (hitokotoEl) {
        fetch('https://v1.hitokoto.cn/?c=d')
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
            });
    }

    /* ---------- 二维码弹窗 ---------- */
    const qrModal = document.getElementById('qrModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const qrImage = document.getElementById('qrImage');
    const qrDesc = document.getElementById('qrDesc');
    const saveQrBtn = document.getElementById('saveQrBtn');

    const socialMedia = {
        wechat: {
            title: '微信公众号',
            image: 'https://s1.imagehub.cc/images/2025/06/20/ef716bfeb41938fafd3995220fd9cb8d.jpg',
            desc: '扫码关注唐山师范学院吧微信公众号'
        },
        xiaohongshu: {
            title: '小红书',
            image: 'https://s1.imagehub.cc/images/2025/06/20/90c6c918f3e512ae3d838c9ce3e6afc6.md.jpg',
            desc: '扫码关注唐山师范学院吧小红书账号'
        },
        qq: {
            title: 'QQ迎新群',
            image: 'https://s1.imagehub.cc/images/2025/06/20/9893542468a9a508411ae5056c56143d.md.jpg',
            desc: '扫码加入唐山师范学院吧QQ群'
        }
    };

    function openQrModal(type) {
        const data = socialMedia[type];
        if (!data || !qrModal) return;
        modalTitle.textContent = data.title;
        qrImage.src = data.image;
        qrDesc.textContent = data.desc;
        qrModal.classList.remove('hidden');
        setTimeout(() => {
            qrModal.classList.remove('opacity-0');
            const box = qrModal.querySelector('div');
            box.classList.remove('scale-95');
            box.classList.add('scale-100');
        }, 10);
    }

    function closeQrModal() {
        if (!qrModal) return;
        qrModal.classList.add('opacity-0');
        const box = qrModal.querySelector('div');
        box.classList.remove('scale-100');
        box.classList.add('scale-95');
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
        setTimeout(() => {
            feedbackModal.classList.remove('opacity-0');
            const box = feedbackModal.querySelector('div');
            box.classList.remove('scale-95');
            box.classList.add('scale-100');
        }, 10);
    }

    function closeFeedbackModalFunc() {
        if (!feedbackModal) return;
        feedbackModal.classList.add('opacity-0');
        const box = feedbackModal.querySelector('div');
        box.classList.remove('scale-100');
        box.classList.add('scale-95');
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

    /* ---------- 搜索功能 ---------- */
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    function performSearch() {
        const query = searchInput ? searchInput.value.trim() : '';
        if (query) {
            window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(query), '_blank');
        }
    }
    if (searchButton) searchButton.addEventListener('click', performSearch);
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') performSearch(); });
    }

    /* ---------- 新闻卡片渲染 ---------- */
    const CATEGORY_ICON = {
        '公告': 'fa-bullhorn',
        '通知': 'fa-bell',
        '指南': 'fa-compass',
        '总结': 'fa-chart-line',
        '活动': 'fa-calendar-days'
    };

    function buildNewsCard(item) {
        const icon = CATEGORY_ICON[item.category] || 'fa-newspaper';
        const coverHtml = item.cover
            ? '<img src="' + item.cover + '" alt="" class="w-full h-44 object-cover">'
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
                    '<span class="text-secondary text-sm font-medium mt-4">阅读全文 <i class="fa fa-arrow-right"></i></span>' +
                '</div>' +
            '</a>';
    }

    // 从每篇文章页直接读取元信息（单一数据源：文章本身）
    // 这样改文章标题/日期/摘要，首页与列表页会自动同步，无需维护额外数据文件
    function getArticleMeta(slug) {
        return fetch('news/' + slug + '.html')
            .then(function (r) { return r.text(); })
            .then(function (html) {
                var m = html.match(/<script id="articleMeta" type="application\/json">([\s\S]*?)<\/script>/);
                if (!m) return null;
                try { return JSON.parse(m[1]); } catch (e) { return null; }
            })
            .then(function (meta) {
                return meta ? Object.assign({ slug: slug }, meta) : null;
            });
    }

    function renderNewsFromArticles(containerId, limit) {
        var box = document.getElementById(containerId);
        if (!box || !window.NEWS_LIST) return;
        Promise.all(window.NEWS_LIST.map(getArticleMeta))
            .then(function (items) {
                var valid = items.filter(Boolean)
                    .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
                var shown = (limit && limit > 0) ? valid.slice(0, limit) : valid;
                box.innerHTML = shown.map(buildNewsCard).join('');
            })
            .catch(function () {
                // 本地直接双击打开（file://）时 fetch 不可用，退化为显示可点击链接
                box.innerHTML = window.NEWS_LIST.map(function (slug) {
                    return '<a href="news/' + slug + '.html" class="bg-white rounded-xl shadow-md p-6 card-hover">' +
                        '<h3 class="text-lg font-semibold text-primary">' + slug + '</h3>' +
                        '<p class="text-gray-500 text-sm mt-2">阅读全文 <i class="fa fa-arrow-right"></i></p></a>';
                }).join('');
            });
    }

    // 列表页：全部文章；首页预览：最新 3 条（按日期自动取最新，改文章即更新）
    renderNewsFromArticles('newsGrid', 0);
    renderNewsFromArticles('newsPreview', 3);

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
});
