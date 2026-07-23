/* ===========================================================
   唐山师范学院吧 · 共用脚本
   负责：导航滚动、移动端菜单、一言、二维码弹窗、
        意见反馈弹窗、平滑滚动、搜索、新闻卡片渲染、返回顶部
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 基础路径（区分首页与 news/ 子目录） ---------- */
    const basePath = (location.pathname.indexOf('/news/') !== -1) ? '../' : '';

    /* ---------- 当前语言 & 语言切换按钮 ---------- */
    const isEn = /\-en\.html$/.test(window.location.pathname);
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const counterpart = isEn
        ? currentFile.replace(/-en\.html$/, '.html')
        : currentFile.replace(/\.html$/, '-en.html');

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
    if (path.includes('/news/') || path.endsWith('/news.html')) {
        document.querySelectorAll('[data-nav="news"]').forEach(el => {
            el.classList.add('text-primary', 'font-semibold');
            el.classList.remove('text-gray-700');
        });
    }

    /* ---------- 一言功能 ---------- */
 const hitokotoEl = document.getElementById('hitokoto');
if (hitokotoEl) {
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
        const suffix = isEn ? '-en' : '';
        const coverHtml = item.cover
            ? '<img src="' + item.cover + '" alt="" class="w-full h-44 object-cover">'
            : '<div class="w-full h-44 bg-gradient-primary flex items-center justify-center">' +
                '<i class="fa ' + icon + ' text-white/80 text-4xl"></i></div>';
        return '' +
            '<a href="news/' + item.slug + suffix + '.html" class="bg-white rounded-xl shadow-md overflow-hidden card-hover flex flex-col">' +
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
});
