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

    /* ---------- 全站唯一滚动监听（passive + rAF 节流） ----------
       原先「导航栏阴影」与「返回顶部」各挂一个 scroll 监听，每帧读两次 scrollY、
       各写一次 class，低端机上容易掉帧。这里合并为一个被动监听 + rAF 节流：
       一帧只采样一次、只广播一次。需要响应滚动的模块调用 onScroll(fn) 注册，
       不要再自行 addEventListener('scroll')。 */
    const scrollHandlers = [];
    const onScroll = (fn) => {
        scrollHandlers.push(fn);
        fn(window.scrollY || window.pageYOffset || 0);   // 立即跑一次，修正刷新后停在半页的状态
    };
    (function initScrollLoop() {
        let ticking = false;
        const flush = () => {
            ticking = false;
            // 菜单打开时 body 被 position:fixed 锁住，scrollY 会假性归零；
            // 这里直接跳过，否则打开菜单的瞬间顶栏阴影和返回顶部会闪一下。
            if (document.body.style.position === 'fixed') return;
            const y = window.scrollY || window.pageYOffset || 0;
            for (let i = 0; i < scrollHandlers.length; i++) {
                try { scrollHandlers[i](y); } catch (_) {}
            }
        };
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(flush);
        }, { passive: true });
    })();

    /* ---------- 导航栏滚动阴影 ---------- */
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        let shadowOn = null;
        onScroll((y) => {
            const next = y > 50;
            if (next === shadowOn) return;        // 状态未变就不碰 DOM
            shadowOn = next;
            mainNav.classList.toggle('nav-shadow', next);
        });
    }

    /* ---------- 移动端菜单：在顶栏内部展开的 iOS 抽屉 ----------
       设计约束（对应 CSS 的「位移守恒」原则）：
       · 菜单是 #mainNav 的子元素，展开靠 grid-template-rows 0fr→1fr 撑高，
         自身不做任何 transform 位移，所以不可能溢出去盖住顶栏。
       · 圆角 / 阴影 / 磨砂材质全部由 #mainNav.menu-open 承担，
         菜单本体透明，不会出现「子元素圆角露出父元素方角」。
       · 遮罩层级 900 低于顶栏 1000，因此圆角切出来的缺口露出的是遮罩，
         而不是页面内容。 */
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mainNav && mobileMenu) {
        // 汉堡 / 关闭双图标共存，靠 CSS 交叉淡入，避免 innerHTML 重建导致的闪烁
        if (!menuBtn.querySelector('.menu-icon')) {
            menuBtn.innerHTML =
                '<span class="menu-icon"><i class="fa fa-bars"></i><i class="fa fa-times"></i></span>';
        }
        menuBtn.setAttribute('aria-controls', 'mobileMenu');
        menuBtn.setAttribute('aria-expanded', 'false');
        if (!menuBtn.getAttribute('aria-label')) {
            menuBtn.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Menu' : '菜单');
        }

        let backdrop = document.getElementById('menuBackdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'menuBackdrop';
            backdrop.setAttribute('aria-hidden', 'true');
            document.body.appendChild(backdrop);
        }

        /* 背景滚动锁：用 position:fixed 而不是 overflow:hidden，
           因为 iOS Safari 会无视 body 的 overflow 继续橡皮筋滚动。
           关闭时把滚动位置精确还原（临时关掉 smooth，避免"弹回去"的动画）。 */
        let savedY = 0;
        let locked = false;
        const lockScroll = () => {
            if (locked) return;
            savedY = window.scrollY || window.pageYOffset || 0;
            locked = true;
            const b = document.body;
            b.style.position = 'fixed';
            b.style.top = -savedY + 'px';
            b.style.left = '0';
            b.style.right = '0';
            b.style.width = '100%';
        };
        const unlockScroll = () => {
            if (!locked) return;
            const b = document.body;
            b.style.position = '';
            b.style.top = '';
            b.style.left = '';
            b.style.right = '';
            b.style.width = '';
            const root = document.documentElement;
            const prev = root.style.scrollBehavior;
            root.style.scrollBehavior = 'auto';
            window.scrollTo(0, savedY);
            root.style.scrollBehavior = prev;
            locked = false;
        };

        let closeTimer = null;
        const isOpen = () => mainNav.classList.contains('menu-open');

        const openMenu = () => {
            if (isOpen()) return;
            clearTimeout(closeTimer);
            mobileMenu.classList.remove('hidden');
            void mobileMenu.offsetHeight;          // 先让 0fr 生效，再切 1fr 才有过渡
            mainNav.classList.add('menu-open');
            menuBtn.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
            backdrop.classList.add('show');
            lockScroll();
        };

        const closeMenu = () => {
            if (!isOpen()) return;
            mainNav.classList.remove('menu-open');
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            backdrop.classList.remove('show');
            unlockScroll();
            // 收起动画跑完再 display:none，否则会瞬间消失没有回收感
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                if (!isOpen()) mobileMenu.classList.add('hidden');
            }, 360);
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen() ? closeMenu() : openMenu();
        });
        backdrop.addEventListener('click', closeMenu);
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        // Esc 关闭（键盘用户）；仅在没有弹窗抢焦点时响应
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen()) closeMenu();
        });
        // 转横屏 / 拉宽到桌面断点：菜单必须收起，否则会残留一段空白
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && isOpen()) closeMenu();
        });
        // 浏览器前进后退（锚点跳转）时同样收起
        window.addEventListener('hashchange', closeMenu);
        window.addEventListener('pagehide', closeMenu);

        // 菜单打开时把 Tab 限制在「汉堡按钮 + 菜单内链接」之间
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !isOpen()) return;
            const nodes = [menuBtn].concat(
                Array.prototype.slice.call(mobileMenu.querySelectorAll('a[href]'))
            );
            if (nodes.length < 2) return;
            const first = nodes[0], last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });
    }

    /* ---------- 滚动渐入（默认可见，仅 JS 启用后渐入，不影响无 JS 环境） ---------- */
    (function () {
        let done = false;
        function init() {
            if (done) return;
            done = true;
            try {
                if (!('IntersectionObserver' in window)) return;
                const els = Array.from(document.querySelectorAll('main section, .news-card, .reveal'));
                if (!els.length) return;
                let revealed = 0;
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            e.target.classList.add('in-view');
                            revealed++;
                            // 入场动画播完后释放 transform，把 hover/按下 反馈交还给卡片自身
                            // （否则 .reveal-item.in-view 的 transform:none 会覆盖 .card-hover 的上浮/回弹）
                            setTimeout(() => e.target.classList.remove('reveal-item'), 1000);
                            io.unobserve(e.target);
                        }
                    });
                }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
                els.forEach(el => {
                    el.classList.add('reveal-item');
                    if (el.classList.contains('news-card')) {
                        const sibs = Array.from(el.parentNode.children).filter(c => c.classList.contains('news-card'));
                        el.style.transitionDelay = (sibs.indexOf(el) * 80) + 'ms';
                    }
                    io.observe(el);
                });
                document.body.classList.add('reveal-ready');
                // 兜底：若 1.5s 后仍未有任何元素被揭示（IO 异常或不支持），强制全部显示，
                // 避免整页内容停留在 opacity:0 而变成空白页。
                setTimeout(() => {
                    if (revealed === 0) els.forEach(el => el.classList.add('in-view'));
                }, 1500);
            } catch (err) {
                document.body.classList.remove('reveal-ready');
            }
        }
        // 新闻卡片由 JS 渲染，需等其注入完成后再绑定，否则选择器无法命中
        if (document.readyState === 'complete') init();
        else window.addEventListener('load', init);
        setTimeout(init, 0);
    })();

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
        modal.className = 'fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300';
        modal.innerHTML =
            '<div class="relative w-full origin-center overflow-hidden rounded-2xl bg-white/30 shadow-2xl ring-1 ring-black/5 backdrop-blur flex flex-col transition-all duration-200 animate-search-pop" style="max-width:42rem;max-height:84vh">' +
                '<div class="px-6 pt-6 pb-4">' +
                    '<div class="flex items-center justify-between">' +
                        '<div class="flex items-center gap-3">' +
                            '<span class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-md"><i class="fa fa-search"></i></span>' +
                            '<h3 class="text-lg font-bold text-gray-800">' + (isEn ? 'Site Search' : '全站搜索') + '</h3>' +
                        '</div>' +
                        '<button id="searchModalClose" aria-label="' + (isEn ? 'Close' : '关闭') + '" class="flex h-9 w-9 items-center justify-center rounded-full"><i class="fa fa-times"></i></button>' +
                    '</div>' +
                    '<div class="relative mt-4">' +
                        '<i class="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 search-modal-icon"></i>' +
                        '<input id="searchModalInput" type="text" placeholder="' + (isEn ? 'Search keywords...' : '输入关键词搜索...') + '" class="w-full rounded-xl border border-gray-200 bg-white/40 backdrop-blur-sm py-3 pl-11 pr-24 text-gray-700 placeholder-gray-400 outline-none transition focus:border-primary focus:bg-white/60 focus:ring-4 focus:ring-primary/10" />' +
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

    /* ---------- 更新日志弹窗 ---------- */
    // 完整更新日志 HTML（与 CHANGELOG.md 保持一致，按日期归档）
    // 完整更新日志（中英文各一份，按日期归档，与 CHANGELOG.md 保持一致）
    const CHANGELOG_DATA = [
        { d: '2026-08-05', zh: [
            '【新增】新生指南（十一）-吧主谈社团组织：重新排版、润色并配图（百团大战现场、到梦空间 APP 截图），含到梦空间学分模块表、院系/校级学生组织职能说明、招新流程及全校官方社团完整名录；社团评分外链采用 .glass-link 液态玻璃卡片，与指南系列风格统一'
        ], en: [
            '[New] Freshman Guide (11) – Clubs & Organizations from the Bar Owner: reformatted, polished, and illustrated with the club recruitment fair and Dao Meng Space app screenshots; includes a credit-module table, department/university-level organization roles, recruitment channels, and the complete official club directory; the rating link uses the .glass-link Liquid Glass card to match the guide series style'
        ]},
        { d: '2026-08-04', zh: [
            '【优化】液态玻璃质感全面加强：玻璃令牌整体提升（背景透明度、高光边框、内发光、阴影、模糊 / 饱和度），并为所有玻璃表面统一叠加左上镜面高光；已玻璃化的按钮 / 卡片 / 弹窗折射感更明显',
            '【优化】统一更多组件为液态玻璃风格：首页头部搜索框（.search-container）从纯白 pill 改为玻璃药丸，与顶栏 / 按钮风格一致；导航栏顶部增加玻璃高光边线，强化顶栏玻璃轮廓',
            '【优化】平台色按钮（微信 / 小红书 / QQ）在保留品牌色的基础上进一步提亮高光边框与内发光，玻璃感与品牌辨识度兼顾',
            '【优化】文章内提示框（tip / callout）与「关于我们」主内容卡原为实心底色，现统一为液态玻璃（保留左侧品牌色强调边），与全站玻璃语言一致',
            '【优化】顶栏通透度提升：导航栏背景透明度整体下调（日间 .72→.58、夜间 .72→.42），顶部高光边线同步减弱，顶栏更通透、更贴合液态玻璃的半透明质感（夜间模式尤其明显）',
            '【优化】首页搜索框升级为完整液态玻璃组合：玻璃容器保持折射模糊 + 高光边框，搜索按钮升级为带品牌色渐变、左上镜面高光与折射模糊的液态玻璃按钮；日夜结构统一，暗色下占位符颜色同步适配',
            '【优化】灯箱图片切换按钮液态玻璃化：灯箱内的左右切换箭头、关闭按钮、下载按钮统一改为 frosted 玻璃质感（折射模糊 + 白色高光边框 + 内发光），悬浮时放大 1.06',
            '【优化】灯箱新增图片描述卡片：灯箱右下角新增液态玻璃卡片，自动读取并展示当前图片在文章中的 alt 描述；无描述时自动隐藏，不遮挡图片主体',
            '【优化】夜间模式按钮边缘与光影柔化：导航工具按钮、主按钮 / 胶囊 CTA、幽灵按钮、平台色按钮与分享浮标（返回顶部 / 分享）统一降低背景不透明度、收窄边框、改用更柔和的内外阴影，边缘不再生硬，光影过渡更自然',
            '【优化】夜间模式顶栏圆型按钮质感统一为「选中态」：搜索按钮与汉堡按钮在夜间的默认背景从暗色渐变玻璃（rgba(30,34,44,.45)）改为平铺雾化白（rgba(255,255,255,.1)），与展开菜单时汉堡被选中后的干净 frosted 质感一致；悬停时稍亮（.16），整体更轻盈、边缘更柔和',
            '【优化】弹窗关闭按钮与顶栏圆型按钮统一为液态玻璃：搜索弹窗、更新日志弹窗、二维码弹窗、意见反馈弹窗的关闭按钮（圆型 ×）统一改为液态玻璃；日间为浅灰 frosted 玻璃，夜间为与顶栏一致的平铺雾化白 rgba(255,255,255,.1) + 折射模糊 + 高光边框 + 内发光',
            '【优化】夜间弹窗质感柔化、消除白色光圈割裂感：夜间弹窗面板背景改为 rgba(30,34,44,.72) 半透暗玻璃，边框从 rgba(255,255,255,.55) 降到 .12，顶部内发光从 .6 降到 .12，搜索弹窗输入框夜间改为 var(--surface-2) 暗色，消除白色方块与白色光圈的割裂',
            '【优化】灯箱按钮与夜间顶栏按钮质感统一、描述卡增强可读性：灯箱左右切换、关闭、下载按钮从高光渐变玻璃改为与夜间顶栏圆钮完全一致的平铺雾化白（rgba(255,255,255,.1) + rgba(255,255,255,.14) 边框 + 柔和内外阴影）；右下角图片描述卡片改为深色半透玻璃（rgba(14,16,21,.62)）并加 text-shadow，压在亮色图片上时文字仍可清晰阅读',
            '【修复】夜间分享浮标子按钮恢复透明度：修复夜间分享浮标展开后的子按钮因两条暗色不透明规则覆盖而变成实心底色的回归问题；子按钮现与分享主按钮 / 返回顶部统一使用夜间顶栏同款的平铺雾化白玻璃',
            '【优化】文章内评分链接卡统一为液态玻璃：新生指南系列中「学校食堂评分合集」「学校附近商场评分合集」「体育课评分合集」等外链卡，从原来的 bg-white 实心白卡改为 .glass-link 液态玻璃卡片，并新增 .glass-link-title 让标题颜色跟随主题变量，亮/暗色下都与全站玻璃设计语言一致'
        ], en: [
            '[Opt] Liquid Glass effect strengthened across the board: glass tokens tuned up (opacity, highlight border, inner glow, shadow, blur / saturation), and a uniform top-left specular highlight added to every glass surface; already-glassed buttons, cards and modals now look noticeably more refractive',
            '[Opt] More surfaces adopt Liquid Glass: the homepage hero search box (.search-container) is no longer a solid-white pill but a glass capsule matching the navbar and buttons; the navbar gains a top glass highlight edge to reinforce its glass outline',
            '[Opt] Colored platform buttons (WeChat / Xiaohongshu / QQ) keep their brand colors while further brightening highlight borders and inner glow, balancing glass feel with brand recognition',
            '[Opt] Article tip/callout boxes and the "About Us" main card were solid-colored; they now use Liquid Glass (keeping the left brand-color accent edge) to match the site-wide glass language',
            '[Opt] More transparent navbar: navbar background opacity lowered overall (day .72→.58, night .72→.42) and the top highlight edge softened in step, so the bar feels more see-through and closer to Liquid Glass — most visible in dark mode',
            '[Opt] Homepage hero search box upgraded to a full Liquid Glass combo: the glass container keeps its blur + highlight border, and the search button is now a Liquid Glass button with brand-color gradient, top-left specular highlight and refractive blur; day/night unified, dark-mode placeholder color adjusted for readability',
            '[Opt] Lightbox navigation controls adopt Liquid Glass: left/right arrows, close and download buttons all use a frosted glass look (refractive blur + white highlight border + inner glow) and scale 1.06 on hover',
            '[Opt] New lightbox image-description card: a Liquid Glass card in the bottom-right corner shows the current image\'s alt description from the article; it auto-hides when no description is present so it does not block the image',
            '[Opt] Softer night-mode button edges and lighting: navbar tools, primary/pill CTAs, ghost buttons, platform buttons and the share FAB (back-to-top / share) all lower their background opacity, thin their borders and use gentler inner/outer shadows, so edges are no longer harsh and the lighting transitions feel natural',
            '[Opt] Night-mode round navbar buttons now share the "selected" texture: search and hamburger buttons default to a flat frosted-white fill (rgba(255,255,255,.1)) instead of the dark-tinted glass gradient, matching the clean look the hamburger has when the menu is open; hover brightens slightly to .16 for a lighter, softer edge',
            '[Opt] Modal close buttons share the Liquid Glass look of the round navbar buttons: close buttons in the search, changelog, QR and feedback modals are now glass; a subtle gray frost in day mode and frosted-white rgba(255,255,255,.1) with blur + highlight border + inner glow at night to match the navbar',
            '[Opt] Night modal panels softened to remove the white halo split: panel background changed to rgba(30,34,44,.72) dark glass, border lowered from rgba(255,255,255,.55) to .12, top inset highlight lowered from .6 to .12, and the search modal input now uses var(--surface-2) dark background in night mode, eliminating the white box / white ring contrast',
            '[Opt] Lightbox controls share the exact night-navbar round-button texture: left/right arrows, close and download buttons switch from a glossy gradient to flat frosted-white rgba(255,255,255,.1) + rgba(255,255,255,.14) border + soft inner/outer shadows; the bottom-right caption card now uses a dark translucent scrim (rgba(14,16,21,.62)) plus text-shadow so it stays legible over light images',
            '[Fix] Share FAB sub-buttons regain transparency in dark mode: two opaque dark overrides were removed so the expanded sub-buttons share the same frosted-white glass as the share toggle and back-to-top button',
            '[Opt] Article scoring-link cards adopt Liquid Glass: the "Dining Hall / Nearby Mall / PE Course Ratings" external-link cards in the Freshman Guide series are no longer solid-white bg-white cards; they use a new .glass-link class and .glass-link-title for theme-aware color, unifying them with the site-wide glass language'
        ]},
        { d: '2026-08-03', zh: [
            '【重大】全站液态玻璃（Liquid Glass）设计上线：半透明表面 + 折射模糊（backdrop-filter: blur() saturate()）+ 白色高光边框 + 内发光，覆盖顶栏工具、主按钮 / 胶囊 CTA、返回顶部、分享浮标、幽灵按钮；分享主按钮与返回顶部进一步强化镜面高光，玻璃质感明显',
            '【优化】移动端顶栏修复：搜索按钮改 38×38 正圆、主题切换放大至 scale(.85)、站点标题完整显示（去省略号）、搜索 / 主题切换 / 汉堡三按钮以正常尺寸单行排列',
            '【优化】平台色二维码按钮保色 + 玻璃：微信绿 / 小红书红 / QQ 蓝 品牌色保留，叠加折射模糊与高光，白字保持可读',
            '【优化】弹窗格式统一：意见反馈弹窗与二维码弹窗同为居中、高不透明度玻璃面板，统一圆角 / 边框 / 阴影',
            '【优化】卡片液态玻璃化：首页快捷链接 / 吧务组公示 / 新闻卡片（含相关阅读）统一改为磨砂玻璃 —— 半透明 + 折射模糊 + 高光描边 + 内发光；并给页面加极淡渐变底色，让玻璃产生可见折射层次',
            '【修复】二维码按钮白底白字不可见（玻璃规则误判为幽灵按钮套上透明玻璃）；分享 / 返回顶部看不到玻璃变化（品牌蓝渐变掩盖玻璃）：均已修正，白玻璃 + 品牌色图标，变化一目了然'
        ], en: [
            '[Major] Site-wide Liquid Glass design: translucent surface + refractive blur (backdrop-filter: blur() saturate()) + white highlight border + inner glow, covering navbar tools, primary/pill CTAs, back-to-top, share FAB and ghost buttons; the share toggle and back-to-top gain an extra specular highlight for a clearly visible glass look',
            '[Opt] Mobile top bar fix: search button is now a 38×38 circle, theme toggle scaled to .85, site title shows in full (no ellipsis), and search / toggle / hamburger sit on one line at normal size',
            '[Opt] Colored QR buttons keep brand color + glass: WeChat green / Xiaohongshu red / QQ blue are preserved, with blur and highlight; white text stays readable',
            '[Opt] Unified modal styling: the feedback modal now shares the centered, high-opacity glass panel with the QR modal (matching radius / border / shadow)',
            '[Opt] Cards go Liquid Glass: homepage quick links, mod-team cards and news cards (incl. related reading) now use a frosted-glass look — translucent + refractive blur + highlight border + inner glow; a faint page gradient backdrop was added so the glass refraction is visible',
            '[Fix] QR buttons were invisible (white on transparent glass from a misapplied ghost rule); share/back-to-top glass was not visible (a brand-blue gradient covered it): both fixed with white glass + brand-color icons'
        ]},
        { d: '2026-08-02', zh: [
            '【新增】全站夜间模式：顶栏新增太阳/月亮切换按钮，配色与卡片、搜索框等组件平滑过渡（0.4s cubic-bezier）；未手动选择时自动跟随系统 prefers-color-scheme；在 <head> 最前面注入防闪烁脚本，刷新瞬间即可应用主题，避免暗色用户白屏闪烁',
            '【优化】夜间模式视觉调整：头图与页脚蓝色大幅降饱和，避免刺眼；切换按钮从移动端顶栏移除，改为桌面端导航末尾图标 + 移动端菜单底部分行标签；修复移动菜单展开时的顶部分隔白线；加深页面背景、提亮卡片表面与边框，使卡片轮廓更清晰',
            '【修复】夜间模式下文章内表格（表头使用 bg-gray-100 / 边框使用 border-gray-300）文字与背景对比不足：补全暗色映射，表头变为 surface-2、边框使用 --border，确保表头文字可读',
            '【优化】切换按钮升级为 SegmentFault「单标签日夜间切换」风格的太阳/月亮滑动开关（纯 CSS 伪元素实现，无内联图标）：68×32 胶囊轨道，点击后太阳西沉变月亮、云朵淡出、昼夜渐变背景滑动（0.5s 缓动）；桌面端保留在导航末尾，移动端改为置顶栏搜索按钮之前，与搜索/汉堡并排',
            '【优化】切换开关严格照搬 SegmentFault「单标签日夜间切换」原文：将 220×90 的全部数值统一乘缩放系数 0.309（宽度 220→68px、高度 90→28px），视觉比例与该文预览完全一致；太阳盘大小、云朵位置、滑动距离、悬停 scale(1.05)、过渡 .5s all 均按原样保留'
        ], en: [
            '[New] Site-wide dark mode: new sun/moon toggle in the navbar with silky color transitions across surfaces, cards, search box, etc. (0.4s cubic-bezier); auto-follows system prefers-color-scheme until an explicit choice is made; an anti-flash script is injected as the first child of <head> so the theme applies before first paint, preventing a white flash on reload for dark users',
            '[Opt] Dark mode visual polish: desaturated the hero and footer blues to reduce glare; moved the toggle out of the mobile top bar — now an icon at the end of the desktop nav and a labeled row at the bottom of the mobile menu; fixed the light separator line above the mobile menu; darkened page background and brightened card surfaces/borders so card outlines are clearer',
            '[Fix] Article tables in dark mode (headers using bg-gray-100 and borders using border-gray-300) had poor text/background contrast: added dark mappings so headers use surface-2 and borders use --border, making header text readable',
            '[Opt] Replaced the toggle with a SegmentFault "single-element day/night switch" sun/moon sliding pill (pure CSS pseudo-elements, no inline icons): a 68×32 capsule track where the sun sets into a moon, clouds fade out, and the day/night gradient slides (0.5s ease); the desktop toggle stays at the end of the nav while the mobile toggle now sits before the top-bar search button, alongside search and the hamburger',
            '[Opt] Rebuilt the toggle as a faithful copy of the SegmentFault "single-element day/night switch": every value from the original 220×90 demo is uniformly scaled by 0.309 (width 220→68px, height 90→28px) so the proportions exactly match the article preview; sun-disc size, cloud positions, slide distance, hover scale(1.05) and the .5s all transition are all kept as written'
        ]},
        { d: '2026-08-01', zh: [
            '【新增】新生指南（十）- 图书馆与自习室入门（中英双语，7 张配图：楼层导览图、馆藏布局表、阅览区环境、NFC 与完美校园入馆示意、座位预约界面、自助借还机）',
            '【新增】全站社交分享浮动按钮（微博 / QQ / X / Facebook / Telegram / 微信），并附带同尺寸同风格的「复制链接」按钮（中英文标签自适应，剪贴板复制带降级回退）',
            '【新增】社交分享卡片（Open Graph / Twitter Card）与站点地图 sitemap.xml、robots.txt，利于搜索引擎收录与社交平台预览',
            '【新增】弹窗键盘焦点陷阱（Tab 限制在弹窗内，无障碍优化）',
            '【优化】删除唐山大地震悼念置灰一次性死代码',
            '【修复】更新日志弹窗二次打开内容不显示（打开时重置遮罩状态）',
            '【修复】英文版页脚无「更新日志」入口（版权段落改为中英文通用匹配）；英文版更新日志内容未随语言切换（补全英文记录）',
            '【修复】分享按钮品牌图标不显示（补 fa-brands 类以使用 Brands 字体）；统一分享按钮与「回到顶部」按钮视觉风格',
            '【优化】重写 README，补充近期重大更新与功能说明',
            '【新增】灯箱（图片放大）新增「下载图片」按钮，可一键保存当前查看的图片',
            '【新增】灯箱支持左右切换文章内图片：左右箭头按钮、键盘 ←/→、移动端左右滑动三种方式，并带平滑滑入/滑出动画衔接；底部显示「当前 / 总数」计数',
            '【修复】灯箱切换图片时残留的入场弹入动画导致图片跳动（切换时移除弹入残留类，仅保留左右滑动）；左右箭头按钮改为与分享按钮一致的「放大缩小」悬停动画（幅度 1.06，0.15s），不再上下位移',
            '【修复】灯箱底部「当前 / 总数」计数器在切换图片瞬间被图片遮住（为遮罩控件提升层级，始终位于图片之上）',
            '【新增】社交分享面板新增「分享到百度贴吧」按钮（Font Awesome 无贴吧图标，以品牌蓝「吧」字呈现；调用贴吧官方转贴接口 openShareApi，自动带入链接、标题与封面）',
            '【修复】灯箱底部「当前 / 总数」计数器文字在半透明深色胶囊上偏暗，已改为白色，提升暗背景下的可读性',
            '【修复】分享到百度贴吧在部分页面（地震纪念页 / 404 页）提示「分享不合法」：这些页面未注入 og:image 导致分享封面为空，现已对封面图做兜底（默认吧徽）并统一转成绝对地址，贴吧可正常抓取；其余页面封面也由相对路径改为绝对地址，缩略图可正确加载',
            '【修复】分享到百度贴吧提示「分享URL不合法」的根因：分享链接为本地预览地址（localhost），贴吧服务端无法抓取该地址故判为不合法。已将 SITE_BASE 默认值设为本站正式域名 https://tstc.pp.ua，分享链接与封面图均改为公开绝对地址，即使在本地预览中点击分享也能被贴吧正常抓取（已用真实域名实测首页/文章/纪念/404 页均正常）；并额外将正式域名写死为兜底，即使构建未注入 __SITE_URL__（预览/旧构建），分享链接也一定是公网绝对地址',
            '【新增】贴吧分享改用百度 dwz.cn 短链：构建期自动为每个页面申请 dwz 短链并注入，点击「分享到百度贴吧」时改用该短链，以绕过 tstc.pp.ua 被百度贴吧屏蔽的「分享URL不合法」；未配置 DWZ_TOKEN 或短链生成失败时自动回退原长链接。短链映射缓存复用，重复构建不重复申请',
            '【调整】贴吧分享放弃 dwz 短链、改为去图分享：dwz.cn 接口要求企业实名认证（个人账号返回 -114，无法使用），故短链方案暂不可用；现改为贴吧分享只带标题+链接、去掉封面图参数，先实测能否绕过 tstc.pp.ua 域名屏蔽（dwz 短链逻辑保留，企业实名认证通过后可自动启用）',
            '【修复】贴吧分享链接规范化：自动去掉路径中的 index.html，避免贴吧抓取时遇到 308 跳转被间歇判为"URL 非法"。经实测线上服务器稳定（一致 200、无质询页），抖动来自贴吧对免费 .pp.ua 域名的实时抓取限速，根治需换可信域名（.com/.cn）',
            '【调整】社交分享面板精简：移除 X（Twitter）/ Facebook / Telegram 三个国外平台入口（国内用户使用率低），新增「分享到QQ空间」按钮（黄色四角星图标；Font Awesome 无 QZone 图标，故按官方设计内联 SVG 还原，调用 QQ空间一键分享接口，自动带入链接、标题、封面与摘要）。后续优化：去掉 SVG 白色背景矩形，使图标在暗色模式下不再出现突兀白底',
            '【优化】代码规范性审查与样式统一：将移动端长链接折行规则（word-break/overflow-wrap）回填到 Tailwind 源文件 tailwind-input.css（此前仅改在编译产物上，重建即丢失），修复单一源头原则；统一悬浮按钮（分享子按钮 / 回到顶部 / 灯箱箭头）悬停缩放为 1.06；主色渐变改用设计变量 var(--primary)/var(--secondary)；修复 build-critical-css.py 未将 :root 设计变量纳入首屏关键 CSS 的隐患（避免 var() 首屏解析失败）；修正一言代码块的缩进'
        ], en: [
            '[New] Freshman Guide (10) – Library & Study Spaces (bilingual, 7 illustrations: floor plan, collection layout, reading area, NFC and Perfect Campus entry guides, seat booking interface, self-checkout machine)',
            '[New] Site-wide social share floating button (Weibo / QQ / X / Facebook / Telegram / WeChat) plus a matching "Copy link" button (auto language labels, clipboard copy with fallback)',
            '[New] Social share cards (Open Graph / Twitter Card) and sitemap.xml / robots.txt for better SEO and link previews',
            '[New] Modal keyboard focus trap (Tab confined inside open modals) for accessibility',
            '[Opt] Removed the one-time Tangshan Earthquake memorial grayscale dead code',
            '[Fix] Changelog modal showed no content on second open (reset overlay state on open)',
            '[Fix] Missing "Changelog" entry in the English footer (now matches the copyright line in both languages); English changelog body was not localized (added English entries)',
            '[Fix] Social brand icons were invisible (added fa-brands class for the Brands font); unified the share button and back-to-top button styling',
            '[Opt] Rewrote README with recent updates and feature docs',
            '[New] Lightbox now supports left/right navigation between article images via arrow buttons, keyboard ←/→, and touch swipe on mobile, with smooth slide-in/out transitions; a "current / total" counter is shown at the bottom',
            '[Fix] Lightbox image no longer re-triggers the entrance pop animation when switching (which caused a jump); the prev/next arrow buttons now use the same scale hover animation as the share button (1.06, 0.15s) instead of moving up/down',
            '[Fix] Lightbox "current / total" counter was briefly covered by the image while switching (overlay controls now sit above the image via z-index)',
            '[New] Social share panel now includes a "Share to Baidu Tieba" button (brand-blue "吧" glyph); it calls Tieba\'s official repost API (openShareApi) with the link, title and cover prefilled',
            '[Fix] Lightbox "current / total" counter text was too dark on the semi-transparent pill; changed to white for better readability on dark backgrounds',
            '[Fix] "Share to Baidu Tieba" showed "分享不合法" (invalid share) on some pages (earthquake memorial / 404) because those pages had no og:image, leaving the cover empty; now falls back to the default bar logo and always uses an absolute URL so Tieba can fetch it; other pages also send an absolute cover so the thumbnail loads correctly',
            '[Fix] The real cause of "分享URL不合法" (invalid URL) for Tieba: the shared link was a local preview address (localhost) that Tieba\'s server cannot fetch, so it is rejected. SITE_BASE now defaults to the official domain https://tstc.pp.ua, so both the share link and cover image are absolute public URLs and Tieba can fetch them even from local preview (verified on home/article/memorial/404 pages with the real domain — all load fine). The official domain is also hardcoded as a fallback, so even if __SITE_URL__ is not injected (preview/stale build), the share link is always a public absolute URL.',
            '[New] Tieba sharing now routes through a Baidu dwz.cn short link: at build time each page gets a dwz short link injected; the "Share to Baidu Tieba" button uses it to bypass Tieba\'s block of the tstc.pp.ua domain ("分享URL不合法"). Falls back to the long URL when DWZ_TOKEN is unset or generation fails. The short-link mapping is cached and reused across builds.',
            '[Adj] Tieba sharing drops dwz short link, now sends title+link only: dwz.cn API requires enterprise real-name verification (personal accounts get -114, unusable), so the short-link path is paused; Tieba share now omits the cover-image param to test whether removing the pic domain bypasses the tstc.pp.ua block. The dwz short-link logic is retained and will auto-enable after enterprise verification.',
            '[Fix] Tieba share URL normalized: index.html is stripped from the path to avoid a 308 redirect that Tieba intermittently rejects as "URL 非法". Live server is stable (consistent 200, no challenge), so the flakiness comes from Tieba throttling real-time fetches of the free .pp.ua domain; a trusted domain (.com/.cn) is the real fix.',
            '[Adj] Social share panel trimmed: removed the three overseas entries X (Twitter) / Facebook / Telegram (low usage among domestic users) and added a "Share to QZone" button (the official Tencent glyph — yellow rounded square with a white four-point star; Font Awesome has no QZone icon, so it is recreated as an inline SVG matching the official design — calling QZone\'s one-click share API with link, title, cover and summary prefilled).',
            '[Opt] Code standardization & style unification: moved the mobile long-link line-break rule (word-break/overflow-wrap) back into the Tailwind source (tailwind-input.css) — it was previously patched only in the compiled output and lost on rebuild — restoring the single-source-of-truth; unified the hover scale of all floating buttons (share items / back-to-top / lightbox arrows) to 1.06; switched primary gradients to design tokens var(--primary)/var(--secondary); fixed build-critical-css.py so :root design tokens are included in the first-screen critical CSS (preventing unresolved var() on first paint); fixed a code-indentation glitch in the hitokoto block'
        ]},
        { d: '2026-07-31', zh: [
            '【新增】新生指南（九）-报到当天（中英双语，5 张配图）',
            '【新增】文章阅读时长；新闻列表分类筛选标签',
            '【新增】图片灯箱（打开上浮淡入、关闭反向弹出）；文章面包屑(首页›新闻›标题) + 相关阅读',
            '【修复】英文版相关阅读误列当前文章；移动端排版与封面路径；英文面包屑跳转；指南九地图改 PNG 显示'
        ], en: [
            '[New] Freshman Guide (9) – Reporting Day (bilingual, 5 illustrations)',
            '[New] Article reading time; category filter tabs on the news list',
            '[New] Image lightbox (fade-in on open, reverse pop on close); article breadcrumb (Home › News › Title) + Related Reading',
            '[Fix] English Related Reading listed the current article; mobile layout & cover paths; English breadcrumb links; Guide 9 maps switched to PNG'
        ]},
        { d: '2026-07-30', zh: [
            '【修复】文章详情页关闭滚动渐入，避免慢网环境长时间空白',
            '【修复】移动端菜单改为自顶栏下沿展开并去除模糊，解决遮挡顶栏与卡顿'
        ], en: [
            '[Fix] Disabled scroll reveal on article pages to avoid long blank screens on slow networks',
            '[Fix] Mobile menu now drops down from the top bar without blur, fixing top-bar overlap and lag'
        ]},
        { d: '2026-07-29', zh: [
            '【新增/优化】滚动渐入、移动端菜单下滑淡入动画',
            '【优化】二维码/反馈/搜索弹窗风格统一；搜索弹窗重设计与动画；标题命中高亮',
            '【优化】新闻卡片封面自动取正文首图（排除二维码/品牌图）'
        ], en: [
            '[New/Opt] Scroll reveal animation; mobile menu slide-down fade-in animation',
            '[Opt] Unified QR / feedback / search modal styling; redesigned search modal with animation; highlighted matched keywords in titles',
            '[Opt] News card covers now auto-pick the first in-article image (excluding QR / brand images)'
        ]},
        { d: '2026-07-28', zh: [
            '【新增】唐山大地震五十周年悼念置灰（7/28 00:00–7/29 00:00 自动恢复）',
            '【新增】顶栏与标题间增加悼念标语（7/29 00:00 自动消失）',
            '【优化】合规审查：图片懒加载、英文分类图标、新增文章指引'
        ], en: [
            '[New] Tangshan Earthquake 50th memorial grayscale (auto-restored 7/28 00:00–7/29 00:00)',
            '[New] Memorial banner between the top bar and title (auto-hidden 7/29 00:00)',
            '[Opt] Compliance review: lazy-loaded images, English category icons, new-article guidance'
        ]},
        { d: '2026-07-27', zh: [
            '【新增】新生指南（八）-公共浴室和校园一卡通（中英双语，8 张流程截图）',
            '【重大】新增站内搜索引擎：构建期生成索引，标题+全文检索，结果弹层可跳转；顶栏加入搜索入口',
            '【优化】全站英文专有名词统一、地址笔误修正、校园电话卡与校园一卡通区分；统一「特别提醒」为浅蓝模块'
        ], en: [
            '[New] Freshman Guide (8) – Public Bathrooms & Campus Card (bilingual, 8 walkthrough screenshots)',
            '[Major] On-site search engine: build-time index, title + full-text search, clickable result panel; search entry added to top bar',
            '[Opt] Unified English proper nouns, fixed address typos, distinguished campus phone card from campus card; standardized "Special Notice" as a light-blue module'
        ]},
        { d: '2026-07-24', zh: [
            '【新增】新生指南（七）-大学道校区如何找教室（中英文）',
            '【优化】统一英文版标题层级、品牌名、导航翻译（News / Mod Team）；修复配图裁剪与桌面端限宽'
        ], en: [
            '[New] Freshman Guide (7) – Finding Classrooms on Daxuedao Campus (bilingual)',
            '[Opt] Unified English heading hierarchy, brand name, navigation translations (News / Mod Team); fixed image cropping and desktop max-width'
        ]},
        { d: '2026-07-23', zh: [
            '【重大】全站英文版上线（English 切换 + 翻译全部页面）',
            '【新增】新生指南（六）-大学道校区如何取快递',
            '【优化】图标本地化；统一并列图片高度；构建脚本整理至 build/ 目录'
        ], en: [
            '[Major] Full English site launched (English toggle + all pages translated)',
            '[New] Freshman Guide (6) – Picking Up Packages on Daxuedao Campus',
            '[Opt] Localized icons; unified side-by-side image heights; moved build scripts into build/ directory'
        ]},
        { d: '2026-07-22', zh: [
            '【新增】新生指南（五）-交通出行相关（post-10）',
            '【优化】吧徽与背景图本地化，全站图床图片改为本地资源',
            '【修复】404 页资源改根绝对路径，修复二级子路径下素材失效'
        ], en: [
            '[New] Freshman Guide (5) – Transportation & Travel (post-10)',
            '[Opt] Localized mod crest and background images; replaced all external image-host images with local assets',
            '[Fix] 404 page assets switched to root-absolute paths; fixed broken assets under second-level subpaths'
        ]},
        { d: '2026-07-21', zh: [
            '【优化】新生指南(3/6/7/8/9) 文末统一添加 QQ 迎新群二维码；电脑端图片限宽',
            '【优化】首页联系我们二维码全部本地化（QQ/微信/小红书）'
        ], en: [
            '[Opt] Added QQ new-student-group QR codes to the end of Guides (3/6/7/8/9); capped image width on desktop',
            '[Opt] Localized all "Contact Us" QR codes on the homepage (QQ / WeChat / Xiaohongshu)'
        ]},
        { d: '2026-07-20', zh: [
            '【新增】新生指南（四）-宿舍生活相关（post-9）',
            '【优化】全站注入 favicon（吧徽图标，浏览器标签页显示）'
        ], en: [
            '[New] Freshman Guide (4) – Dorm Life (post-9)',
            '[Opt] Injected favicon site-wide (mod crest icon shown in browser tabs)'
        ]},
        { d: '2026-07-19', zh: [
            '【优化】重新编号文章(post-1~post-12)；上/下一篇导航扩展到全部文章按日期倒序串联',
            '【新增】新生指南（三）-体育课选课；post-7/8 增加食堂/商场、体育课评分卡片'
        ], en: [
            '[Opt] Renumbered articles (post-1~post-12); expanded Prev/Next navigation to chain all articles by date descending',
            '[New] Freshman Guide (3) – PE Course Selection; added cafeteria/mall and PE scoring cards to post-7/8'
        ]},
        { d: '2026-07-18', zh: [
            '【性能】内联文章数据到页面 HTML，去掉额外清单请求，列表刷新秒开',
            '【性能】移除阻塞渲染的外部 CDN，改本地预编译 CSS + 自托管 Font Awesome；内联首屏关键 CSS',
            '【修复】预编译 CSS 缺失工具类(safelist)；style.css/fa.min.css 加内容哈希版本号；main.js 加 defer 消除卡顿',
            '【新增】新生指南（二）-食堂购物攻略(post-7)；构建按日期倒序自动生成上/下一篇导航'
        ], en: [
            '[Perf] Inlined article data into page HTML, removing the extra manifest request for instant list refresh',
            '[Perf] Removed render-blocking external CDNs; switched to locally precompiled CSS + self-hosted Font Awesome; inlined critical above-the-fold CSS',
            '[Fix] Missing utility classes in precompiled CSS (safelist); added content-hash versioning to style.css/fa.min.css; added defer to main.js to eliminate jank',
            '[New] Freshman Guide (2) – Canteen & Shopping Guide (post-7); build auto-generates Prev/Next navigation by date descending'
        ]},
        { d: '2026-07-17', zh: [
            '【彩蛋】新增 /cmf 生日快乐子页面（吧主专属，后下线）'
        ], en: [
            '[Egg] Added /cmf birthday subpage (mod-owner exclusive, later taken down)'
        ]},
        { d: '2026-07-16', zh: [
            '【新增】测试文章《校园卡是否值得办》(post-6，分类：指南)'
        ], en: [
            '[New] Test article "Is the Campus Card Worth Getting?" (post-6, category: Guide)'
        ]},
        { d: '2026-07-15', zh: [
            '【新增】全网反诈防骗公告(post-5)；「关于我们」页面；自定义 404 页面（Cloudflare 内置兜底）',
            '【优化】自动扫描 news/ 生成清单，首页/列表零配置自动同步'
        ], en: [
            '[New] Site-wide anti-fraud alert (post-5); "About Us" page; custom 404 page (Cloudflare built-in fallback)',
            '[Opt] Auto-scan news/ to generate the manifest; zero-config sync for homepage/list'
        ]},
        { d: '2026-07-14', zh: [
            '【站点】唐山师范学院吧官网正式上线，含新闻动态模块，可部署至 Cloudflare Pages',
            '【优化】首页新闻预览按日期倒序取最新 3 条；首页/列表直接读取 #articleMeta 单一数据源'
        ], en: [
            '[Site] TSNU Bar official website launched with a News module, deployable to Cloudflare Pages',
            '[Opt] Homepage news preview shows the latest 3 by date descending; homepage/list read directly from the single #articleMeta source'
        ]}
    ];
    function buildChangelog() {
        return CHANGELOG_DATA.map(function (g) {
            const items = isEn ? g.en : g.zh;
            return '<div class="mb-6">' +
                '<h3 class="mb-2 text-base font-bold text-primary">' + g.d + '</h3>' +
                '<ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600">' +
                items.map(function (it) { return '<li>' + it + '</li>'; }).join('') +
                '</ul></div>';
        }).join('');
    }
    const CHANGELOG_HTML = buildChangelog();

    function initChangelog() {
        // 1) 在页脚版权声明一句后注入入口（中英文页通用：匹配 © / 版权所有 / All Rights Reserved）
        let copyP = null;
        const isCopy = function (t) {
            return t.indexOf('©') !== -1 || t.indexOf('版权所有') !== -1 ||
                /all rights reserved/i.test(t);
        };
        document.querySelectorAll('footer p').forEach(function (p) {
            if (isCopy(p.textContent)) copyP = p;
        });
        if (!copyP) return;
        const sep = document.createElement('span');
        sep.className = 'mx-2 text-white/40';
        sep.textContent = '·';
        const link = document.createElement('a');
        link.href = 'javascript:void(0)';
        link.id = 'changelogOpen';
        link.className = 'underline hover:text-white transition-colors';
        link.textContent = isEn ? 'Changelog' : '更新日志';
        copyP.appendChild(sep);
        copyP.appendChild(link);

        // 2) 懒创建弹层
        function ensureModal() {
            let modal = document.getElementById('changelogModal');
            if (modal) return modal;
            modal = document.createElement('div');
            modal.id = 'changelogModal';
            modal.className = 'fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300';
            modal.innerHTML =
                '<div class="relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 flex flex-col transition-all duration-200 animate-search-pop" style="max-width:44rem;max-height:86vh">' +
                    '<div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">' +
                        '<div class="flex items-center gap-3">' +
                            '<span class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-md"><i class="fa fa-list-alt"></i></span>' +
                            '<h3 class="text-lg font-bold text-gray-800">' + (isEn ? 'Changelog' : '更新日志') + '</h3>' +
                        '</div>' +
                        '<button id="changelogClose" aria-label="' + (isEn ? 'Close' : '关闭') + '" class="flex h-9 w-9 items-center justify-center rounded-full"><i class="fa fa-times"></i></button>' +
                    '</div>' +
                    '<div id="changelogBody" class="px-6 py-5" style="overflow-y:auto">' + CHANGELOG_HTML + '</div>' +
                '</div>';
            document.body.appendChild(modal);
            modal.addEventListener('click', function (e) { if (e.target === modal) closeChangelogModal(); });
            document.getElementById('changelogClose').addEventListener('click', closeChangelogModal);
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    const m = document.getElementById('changelogModal');
                    if (m && !m.classList.contains('hidden')) closeChangelogModal();
                }
            });
            return modal;
        }
        function openChangelogModal() {
            const modal = ensureModal();
            modal.classList.remove('hidden');
            const closeBtn = document.getElementById('changelogClose');
            if (closeBtn) closeBtn.focus();
            const box = modal.querySelector('div');
            box.classList.remove('opacity-0', 'scale-95');
            box.classList.remove('animate-search-pop');
            void box.offsetWidth;
            setTimeout(function () {
                modal.classList.remove('opacity-0');
                box.classList.add('animate-search-pop');
            }, 10);
            const body = document.getElementById('changelogBody');
            if (body) body.scrollTop = 0;
        }
        function closeChangelogModal() {
            const modal = document.getElementById('changelogModal');
            if (!modal) return;
            modal.classList.add('opacity-0');
            const box = modal.querySelector('div');
            box.classList.add('opacity-0', 'scale-95');
            setTimeout(function () { modal.classList.add('hidden'); }, 300);
        }
        link.addEventListener('click', function (e) { e.preventDefault(); openChangelogModal(); });
    }

    // 社交分享浮动按钮（全站通用）+ 复制链接
    function initShareWidget() {
        // 自包含样式，避免被 Tailwind 清除；所有按钮统一圆角、同尺寸、同风格
        if (!document.getElementById('shareWidgetStyle')) {
            const css = document.createElement('style');
            css.id = 'shareWidgetStyle';
            css.textContent =
                '#shareFab{position:fixed;left:16px;bottom:16px;z-index:var(--z-fab);display:flex;flex-direction:column;align-items:center;gap:10px}' +
                '#shareFab .share-toggle{width:48px;height:48px;border-radius:50%;background:linear-gradient(150deg,rgba(255,255,255,.85) 0%,rgba(255,255,255,.28) 40%,rgba(255,255,255,0) 66%),rgba(255,255,255,.50);-webkit-backdrop-filter:blur(22px) saturate(180%);backdrop-filter:blur(22px) saturate(180%);border:1px solid rgba(255,255,255,.6);color:var(--tint);display:flex;align-items:center;justify-content:center;font-size:19px;box-shadow:0 10px 26px rgba(0,0,0,.18),inset 0 1.5px 2px rgba(255,255,255,.9),inset 0 -2px 5px rgba(0,0,0,.08);cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}' +
                '#shareFab .share-toggle:hover{transform:scale(1.06);box-shadow:0 8px 22px rgba(0,0,0,.24)}' +
                '#shareFab .share-panel{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:2px;transform-origin:bottom center}' +
                '#shareFab .share-panel.hidden{display:none}' +
                '#shareFab .share-panel:not(.hidden){animation:sharePop .18s ease}' +
                '@keyframes sharePop{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}' +
                '#shareFab .share-btn{width:44px;height:44px;border-radius:50%;background:linear-gradient(150deg,rgba(255,255,255,.85) 0%,rgba(255,255,255,.28) 40%,rgba(255,255,255,0) 66%),rgba(255,255,255,.50);-webkit-backdrop-filter:blur(22px) saturate(180%);backdrop-filter:blur(22px) saturate(180%);border:1px solid rgba(255,255,255,.6);color:#555;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 10px 26px rgba(0,0,0,.18),inset 0 1.5px 2px rgba(255,255,255,.9),inset 0 -2px 5px rgba(0,0,0,.08);cursor:pointer;transition:transform .15s ease,box-shadow .15s ease;text-decoration:none}' +
                '#shareFab .share-btn:hover{transform:scale(1.06);box-shadow:0 6px 16px rgba(0,0,0,.2)}' +
                '#shareToast{position:fixed;left:50%;bottom:32px;transform:translateX(-50%);background:rgba(0,0,0,.82);color:#fff;font-size:14px;padding:9px 16px;border-radius:999px;z-index:var(--z-toast);opacity:0;transition:opacity .2s ease;pointer-events:none}' +
                '#shareToast.show{opacity:1}';
            document.head.appendChild(css);
        }

        // 已开放 Web 分享接口的入口；微信无网页分享接口，移动端走系统分享、桌面端退化为复制链接
        const SHARE_CFG = [
            { key: 'weibo', label: isEn ? 'Share to Weibo' : '分享到微博', icon: 'fa-brands fa-weibo', color: '#e6162d',
              url: function (u, t) { return 'https://service.weibo.com/share/share.php?url=' + enc(u) + '&title=' + enc(t); } },
            { key: 'qq', label: isEn ? 'Share to QQ' : '分享到 QQ', icon: 'fa-brands fa-qq', color: '#12b7f5',
              url: function (u, t, p, d) { return 'https://connect.qq.com/widget/shareqq/index.html?url=' + enc(u) + '&title=' + enc(t) + '&pics=' + enc(p) + '&summary=' + enc(d); } },
            { key: 'qzone', label: isEn ? 'Share to QZone' : '分享到QQ空间', color: '#ffce00', svg: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path fill="#FECE00" fill-rule="evenodd" d="M23.9868 9.2012c-.032-.099-.127-.223-.334-.258-.207-.036-7.352-1.4063-7.352-1.4063s-.105-.022-.198-.07c-.092-.047-.127-.167-.127-.167S12.4472.954 12.3491.7679c-.099-.187-.245-.238-.349-.238-.104 0-.251.051-.349.238C11.5531.954 8.0245 7.3 8.0245 7.3s-.035.12-.128.167c-.092.047-.197.07-.197.07S.5546 8.9071.3466 8.9421c-.208.036-.302.16-.333.258a.477.477 0 00.125.4491L5.5013 15.14s.072.08.119.172c.016.104.005.21.005.21s-1.1891 7.243-1.2201 7.451c-.031.208.075.369.159.4301.083.062.233.106.421.013.189-.093 6.813-3.2614 6.813-3.2614s.098-.044.201-.061c.103-.017.201.061.201.061s6.624 3.1684 6.813 3.2614c.188.094.338.049.421-.013a.463.463 0 00.159-.43c-.021-.14-.93-5.6778-.93-5.6778.876-.5401 1.4251-1.0392 1.8492-1.7473-2.5944.9692-6.0069 1.7173-9.4163 1.8663-.9152.041-2.4104.097-3.4735-.015-.6781-.071-1.1702-.144-1.2432-.438-.053-.2151.054-.4601.5451-.8312a2640.8625 2640.8625 0 012.8614-2.1553c1.2852-.9681 3.5595-2.4703 3.5595-2.7314 0-.285-2.1443-.781-4.0376-.781-1.9452 0-2.2753.132-2.8114.168-.488.034-.769.005-.804-.138-.06-.2481.183-.3891.588-.5682.7091-.314 1.8603-.594 1.9843-.626.194-.052 3.0824-.8051 5.6188-.5351 1.3181.14 3.2444.668 3.2444 1.2762 0 .342-1.7212 1.4942-3.2254 2.5973-1.1492.8431-2.2173 1.5612-2.2173 1.6883 0 .342 3.5334 1.2411 6.6899 1.01l.003-.022c.048-.092.119-.172.119-.172l5.3627-5.4907a.477.477 0 00.127-.449z"/></svg>',
              url: function (u, t, p, d) { return 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + enc(u) + '&title=' + enc(t) + '&pics=' + enc(p) + '&summary=' + enc(d); } },
            { key: 'wechat', label: isEn ? 'Share via WeChat' : '微信分享', icon: 'fa-brands fa-weixin', color: '#07c160', native: true },
            { key: 'tieba', label: isEn ? 'Share to Baidu Tieba' : '分享到百度贴吧', text: '吧', color: '#2932e1',
              url: function (u, t, p) {
                // 贴吧分享仅带标题+链接，去掉封面图参数：排查 tstc.pp.ua 域名（含封面图域名）被贴吧判为"分享URL不合法"的问题。
                // dwz.cn 短链因需企业实名认证（个人账号返回 -114）不可用，故先实测去图方案；短链逻辑保留，企业实名后可自动启用。
                const target = (window.__SHARE_SHORT_URL__ && /^https?:\/\//i.test(window.__SHARE_SHORT_URL__)) ? window.__SHARE_SHORT_URL__ : u;
                return 'https://tieba.baidu.com/f/commit/share/openShareApi?url=' + enc(target) + '&text=' + enc(t);
              } }
        ];

        function enc(s) { return encodeURIComponent(s || ''); }
        // 分享链接优先使用站点公开地址（构建时由 SITE_BASE 注入的 window.__SITE_URL__），
        // 这样即使在本机预览（location.href 为 localhost）也能分享出可被贴吧等平台抓取的公开地址。
        function pageUrl() {
            // 兜底写死正式公网域名：即使构建未注入 __SITE_URL__（如预览/旧构建），
            // 分享链接也一定是公网绝对地址，避免 localhost 被贴吧判为不合法。
            const base = (window.__SITE_URL__ || 'https://tstc.pp.ua').replace(/\/+$/, '');
            if (/^https?:\/\//i.test(base)) {
                // 规范化路径：去掉 index.html，避免贴吧抓取时遇到 308 跳转而被间歇判为"URL 非法"
                const p = (location.pathname || '/').replace(/\/index\.html$/, '/');
                return base + p + location.search;
            }
            return location.href;
        }
        function pageTitle() { return document.title || ''; }
        function pageDesc() { const m = document.querySelector('meta[name="description"]'); return m ? m.getAttribute('content') : ''; }
        // 封面图：贴吧「转贴」接口要求 pic 非空且可被抓取，故缺失时回退到默认封面，
        // 并统一转成绝对地址（相对路径在第三方域名下无法被正确抓取）。
        function pagePic() {
            const m = document.querySelector('meta[property="og:image"]');
            let p = m ? (m.getAttribute('content') || '') : '';
            if (!p) p = '/assets/images/bar-logo.jpg'; // 兜底默认封面（错误页 / 纪念页未注入 og:image）
            // 相对路径统一解析为绝对地址：优先用站点公开地址（window.__SITE_URL__，兜底正式域名），确保预览/第三方也能正确抓取
            if (p && !/^https?:\/\//i.test(p)) {
                const base = (window.__SITE_URL__ || 'https://tstc.pp.ua').replace(/\/+$/, '');
                p = base + (p.charAt(0) === '/' ? '' : '/') + p;
            }
            return p;
        }

        const fab = document.createElement('div');
        fab.id = 'shareFab';
        const panel = document.createElement('div');
        panel.id = 'sharePanel';
        panel.className = 'share-panel hidden';

        function makeBtn(cfg) {
            const b = document.createElement('button');
            b.className = 'share-btn';
            b.setAttribute('aria-label', cfg.label);
            b.title = cfg.label;
            b.style.color = cfg.color;
            if (cfg.svg) {
                b.innerHTML = cfg.svg;
            } else if (cfg.text) {
                b.innerHTML = '<span style="font-weight:700">' + cfg.text + '</span>';
            } else {
                b.innerHTML = '<i class="fa ' + cfg.icon + '"></i>';
            }
            b.addEventListener('click', function (e) {
                e.stopPropagation();
                const u = pageUrl(), t = pageTitle(), p = pagePic(), d = pageDesc();
                if (cfg.native && navigator.share) {
                    navigator.share({ title: t, text: t, url: u }).catch(function () {});
                    return;
                }
                if (cfg.key === 'wechat') {
                    copyLink(isEn ? 'Link copied — paste it into WeChat' : '链接已复制，可粘贴到微信分享');
                    return;
                }
                window.open(cfg.url(u, t, p, d), '_blank', 'noopener,noreferrer');
            });
            return b;
        }
        SHARE_CFG.forEach(function (c) { panel.appendChild(makeBtn(c)); });

        // 复制链接按钮（与分享按钮同尺寸、同风格）
        const copyBtn = document.createElement('button');
        copyBtn.className = 'share-btn';
        copyBtn.setAttribute('aria-label', isEn ? 'Copy link' : '复制链接');
        copyBtn.title = isEn ? 'Copy link' : '复制链接';
        copyBtn.style.color = '#6b7280';
        copyBtn.innerHTML = '<i class="fa fa-link"></i>';
        copyBtn.addEventListener('click', function (e) { e.stopPropagation(); copyLink(); });
        panel.appendChild(copyBtn);

        const toggle = document.createElement('button');
        toggle.className = 'share-toggle';
        toggle.id = 'shareToggle';
        toggle.setAttribute('aria-label', isEn ? 'Share' : '分享');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fa fa-share"></i>';
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const hidden = panel.classList.contains('hidden');
            panel.classList.toggle('hidden');
            toggle.setAttribute('aria-expanded', String(!hidden));
        });

        fab.appendChild(panel);
        fab.appendChild(toggle);
        document.body.appendChild(fab);

        // 点击空白处关闭分享面板
        document.addEventListener('click', function (e) {
            if (!fab.contains(e.target)) {
                panel.classList.add('hidden');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        function copyLink(msg) {
            const u = pageUrl();
            const done = function () { showToast(msg || (isEn ? 'Link copied' : '链接已复制')); };
            const fail = function () { fallbackCopy(u, msg); };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(u).then(done, fail);
            } else { fail(); }
        }
        function fallbackCopy(u, msg) {
            try {
                const ta = document.createElement('textarea');
                ta.value = u; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                showToast(msg || (isEn ? 'Link copied' : '链接已复制'));
            } catch (err) { showToast(isEn ? 'Copy failed' : '复制失败'); }
        }
        let toastTimer = null;
        function showToast(msg) {
            let toast = document.getElementById('shareToast');
            if (!toast) { toast = document.createElement('div'); toast.id = 'shareToast'; document.body.appendChild(toast); }
            toast.textContent = msg; toast.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
        }
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
            return '<a href="' + url + '" class="group mb-3 flex items-start gap-3 rounded-xl border border-white/60 bg-white/15 backdrop-blur-sm p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg animate-result-in search-result-item" style="animation-delay:' + (i * 45) + 'ms">' +
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
    try { initTheme(isEn); } catch (e) { console.error('initTheme failed:', e); }

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
            '<a href="news/' + item.slug + '.html" class="news-card bg-white rounded-xl shadow-md overflow-hidden card-hover flex flex-col">' +
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
    // 新闻列表渲染，支持分页（pageSize>0 时分页）与数量限制（limit>0，用于首页预览）
    function renderNewsFromManifest(containerId, opts) {
        if (typeof opts === 'number') opts = { limit: opts };
        opts = opts || {};
        var pageSize = opts.pageSize || 0;
        var page = opts.page || 1;
        var filterCat = opts.filterCat || '';
        var container = document.getElementById(containerId);
        if (!container) return;

        var currentData = []; // 当前过滤后的全量数据，缓存用于分页切换

        function buildValid(items) {
            var valid = (items || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
            if (filterCat) valid = valid.filter(function (x) { return x.category === filterCat; });
            return valid;
        }

        function paintPager(curPage, totalPages) {
            var parent = container.parentNode;
            var old = parent.querySelector('.news-pager');
            if (old) old.remove();
            if (pageSize <= 0 || totalPages <= 1) return;
            var pager = document.createElement('div');
            pager.className = 'news-pager flex items-center justify-center gap-2 mt-10 flex-wrap';
            var baseCls = 'h-10 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer';
            function addBtn(label, target, active, disabled, extra) {
                var b = document.createElement('button');
                b.type = 'button';
                b.innerHTML = label;
                var cls = baseCls + (extra ? ' ' + extra : '');
                if (active) cls += ' is-active';
                else if (!disabled) cls += ' hover:border-primary hover:text-primary';
                if (disabled) cls += ' is-disabled';
                b.className = cls;
                if (disabled) { b.disabled = true; }
                else { b.addEventListener('click', function () { goToPage(target); }); }
                pager.appendChild(b);
            }
            var prevLabel = isEn ? '&laquo; Prev' : '&laquo; 上一页';
            var nextLabel = isEn ? 'Next &raquo;' : '下一页 &raquo;';
            addBtn(prevLabel, curPage - 1, false, curPage <= 1);
            for (var i = 1; i <= totalPages; i++) {
                addBtn(String(i), i, i === curPage, false, 'w-10');
            }
            addBtn(nextLabel, curPage + 1, false, curPage >= totalPages);
            parent.appendChild(pager);
        }

        function paintPage(curPage) {
            var total = currentData.length;
            var totalPages = Math.max(1, Math.ceil(total / pageSize));
            curPage = Math.min(Math.max(1, curPage), totalPages);
            var shown;
            if (pageSize > 0) {
                shown = currentData.slice((curPage - 1) * pageSize, curPage * pageSize);
            } else if (opts.limit > 0) {
                shown = currentData.slice(0, opts.limit);
            } else {
                shown = currentData;
            }
            if (!shown.length) {
                container.innerHTML = '<p class="col-span-full text-center text-gray-500 py-12">' +
                    (isEn ? 'No articles in this category yet.' : '该分类下暂无文章') + '</p>';
                paintPager(1, 1);
                return;
            }
            container.innerHTML = shown.map(buildNewsCard).join('');
            paintPager(curPage, totalPages);
        }

        function goToPage(target) {
            paintPage(target);
            if (typeof window.requestAnimationFrame === 'function') {
                window.requestAnimationFrame(function () {
                    var y = container.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                });
            }
        }

        var data = isEn ? (window.__NEWS_EN__ || []) : (window.__NEWS__ || []);
        if (data && data.length) { currentData = buildValid(data); paintPage(page); return; }
        // 兜底：本地未生成内联数据时，回退到对应语言清单地址
        var url = isEn ? 'news-manifest-en.json' : (window.NEWS_MANIFEST_URL || 'news-manifest.json');
        fetch(url).then(function (r) { return r.json(); }).then(function (items) {
            currentData = buildValid(items);
            paintPage(page);
        }).catch(function () {
            container.innerHTML = '<p class="text-gray-500 col-span-full">本地预览请先运行：node generate-manifest.js</p>';
        });
    }

    // 新闻列表页：根据清单中的分类，自动生成筛选标签（中/英自适应）
    function addNewsFilters() {
        var grid = document.getElementById('newsGrid');
        if (!grid) return;
        var data = isEn ? (window.__NEWS_EN__ || []) : (window.__NEWS__ || []);
        var order = isEn
            ? ['Announcement', 'Notice', 'Guide', 'Summary', 'Activity']
            : ['公告', '通知', '指南', '总结', '活动'];
        var cats = [];
        data.forEach(function (x) { if (cats.indexOf(x.category) === -1) cats.push(x.category); });
        cats.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
        var allLabel = isEn ? 'All' : '全部';
        var baseCls = 'px-4 py-2 rounded-full text-sm font-medium border transition-colors';
        var offCls = baseCls + ' bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary';
        var onCls = baseCls + ' bg-primary text-white border-primary';
        var wrap = document.createElement('div');
        wrap.className = 'flex flex-wrap gap-2 mb-8';
        function makeChip(label, cat, active) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = label;
            b.className = active ? onCls : offCls;
            b.addEventListener('click', function () {
                wrap.querySelectorAll('button').forEach(function (x) { x.className = offCls; });
                b.className = onCls;
                renderNewsFromManifest('newsGrid', { pageSize: 6, page: 1, filterCat: cat });
            });
            return b;
        }
        wrap.appendChild(makeChip(allLabel, '', true));
        cats.forEach(function (c) { wrap.appendChild(makeChip(c, c, false)); });
        grid.parentNode.insertBefore(wrap, grid);
    }

    // 列表页：全部文章；首页预览：最新 3 条（按日期自动取最新）
    renderNewsFromManifest('newsGrid', { pageSize: 6, page: 1 });
    renderNewsFromManifest('newsPreview', 3);
    addNewsFilters();

    /* ---------- 文章详情页增强：面包屑标题 / 阅读时长 / 图片灯箱 / 相关阅读 ---------- */
    (function enhanceArticle() {
        var metaEl = document.getElementById('articleMeta');
        if (!metaEl) return;
        var meta = {};
        try { meta = JSON.parse(metaEl.textContent); } catch (e) { /* 忽略解析错误 */ }

        // 1) 面包屑：首页 › 新闻动态 › 标题（英文页跳转英文对应页）
        var crumb = document.querySelector('header nav[aria-label="breadcrumb"]');
        if (crumb && meta.title) {
            var home = isEn ? 'Home' : '首页';
            var news = isEn ? 'News' : '新闻动态';
            var homeLink = basePath + (isEn ? 'index-en.html' : 'index.html');
            var newsLink = basePath + (isEn ? 'news-en.html' : 'news.html');
            crumb.innerHTML =
                '<a href="' + homeLink + '" class="hover:underline">' + home + '</a>' +
                '<span class="mx-2">/</span>' +
                '<a href="' + newsLink + '" class="hover:underline">' + news + '</a>' +
                '<span class="mx-2">/</span>' +
                '<span>' + escapeHtml(meta.title) + '</span>';
        }

        // 2) 预计阅读时长
        var content = document.querySelector('.article-content');
        if (content) {
            var raw = content.innerText || content.textContent || '';
            var mins = 1;
            if (isEn) {
                var words = (raw.trim().match(/\S+/g) || []).length;
                mins = Math.max(1, Math.round(words / 200));
            } else {
                mins = Math.max(1, Math.ceil(raw.replace(/\s/g, '').length / 400));
            }
            var userIcon = document.querySelector('header .fa-user');
            if (userIcon) {
                var metaDiv = userIcon.closest('.flex.items-center');
                if (metaDiv) {
                    metaDiv.classList.add('flex-wrap', 'gap-y-2');
                    var rt = document.createElement('span');
                    rt.className = 'ml-3';
                    rt.innerHTML = '<i class="fa fa-clock mr-1"></i>' +
                        (isEn ? (mins + ' min read') : ('约 ' + mins + ' 分钟阅读'));
                    metaDiv.appendChild(rt);
                }
            }
        }

        // 3) 图片点击放大（灯箱）
        initLightbox(content);

        // 4) 相关阅读
        buildRelated(meta);
    })();

    // 灯箱：点击文章内图片查看大图，支持左右切换（按钮 / 键盘 / 滑动）与动画衔接
    function initLightbox(scope) {
        if (!scope) return;
        var imgs = Array.prototype.slice.call(scope.querySelectorAll('img'));
        if (!imgs.length) return;
        function filenameFrom(src) {
            try {
                var name = String(src).split('/').pop().split('?')[0];
                return decodeURIComponent(name) || 'image.jpg';
            } catch (e) { return 'image.jpg'; }
        }
        // 注入灯箱切换 / 动画样式（自包含，不依赖构建链路）
        if (!document.getElementById('lightboxNavStyle')) {
            var st = document.createElement('style');
            st.id = 'lightboxNavStyle';
            st.textContent =
                /* 与夜间顶栏圆钮同一质感：平铺雾化白 .1 + 细高光边 + 柔和投影 */
                '#lightbox .lb-nav,#lightbox .lb-ctrl{background:rgba(255,255,255,.1);-webkit-backdrop-filter:blur(22px) saturate(190%);backdrop-filter:blur(22px) saturate(190%);border:1px solid rgba(255,255,255,.14);box-shadow:0 3px 12px rgba(0,0,0,.30),inset 0 1px 1px rgba(255,255,255,.18),inset 0 -1px 1px rgba(0,0,0,.15);background-clip:padding-box;color:#fff;}' +
                '#lightbox .lb-nav{position:absolute;top:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:9999px;transform:translateY(-50%) scale(1);transition:transform .15s ease,background .15s ease,border-color .15s ease;}' +
                '#lightbox .lb-ctrl{display:flex;align-items:center;justify-content:center;border-radius:9999px;transition:background .15s ease,transform .15s ease,border-color .15s ease;}' +
                '#lightbox .lb-nav:hover,#lightbox .lb-ctrl:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.18);}' +
                '#lightbox .lb-nav:hover{transform:translateY(-50%) scale(1.06);}' +
                '#lightbox .lb-ctrl:hover{transform:scale(1.06);}' +
                '#lightbox .lb-nav:active{transform:translateY(-50%) scale(.94);}' +
                '#lightbox .lb-ctrl:active{transform:scale(.94);}' +
                '#lightbox .lb-nav.lb-hide{display:none!important;}' +
                /* 计数器与描述卡：同族玻璃，但底部压一层深色浮层，保证压在亮图上时文字仍可读 */
                '#lightbox .lb-counter{background:linear-gradient(rgba(255,255,255,.1),rgba(255,255,255,.1)),rgba(14,16,21,.62);-webkit-backdrop-filter:blur(22px) saturate(190%);backdrop-filter:blur(22px) saturate(190%);border:1px solid rgba(255,255,255,.14);box-shadow:0 3px 12px rgba(0,0,0,.30),inset 0 1px 1px rgba(255,255,255,.16);background-clip:padding-box;color:#fff;padding:4px 14px;border-radius:9999px;font-size:13px;letter-spacing:.04em;text-shadow:0 1px 2px rgba(0,0,0,.55);}' +
                '#lightbox .lb-counter.lb-hide{display:none!important;}' +
                '#lightbox .lb-caption{position:absolute;right:16px;bottom:16px;max-width:min(64vw,340px);padding:10px 14px;border-radius:14px;background:linear-gradient(rgba(255,255,255,.1),rgba(255,255,255,.1)),rgba(14,16,21,.62);-webkit-backdrop-filter:blur(22px) saturate(190%);backdrop-filter:blur(22px) saturate(190%);border:1px solid rgba(255,255,255,.14);box-shadow:0 8px 24px rgba(0,0,0,.42),inset 0 1px 1px rgba(255,255,255,.16),inset 0 -1px 1px rgba(0,0,0,.18);background-clip:padding-box;color:#fff;font-size:13px;line-height:1.5;letter-spacing:.02em;text-shadow:0 1px 2px rgba(0,0,0,.6);}' +
                '#lightbox .lb-caption.lb-hide{display:none!important;}' +
                '#lightbox [data-close],#lightbox [data-download],#lightbox .lb-nav,#lightbox .lb-counter,#lightbox .lb-caption{z-index:10;}' +
                '#lightbox img{z-index:1;position:relative;}' +
                '@keyframes lbSlideInRight{from{opacity:0;transform:translateX(48px);}to{opacity:1;transform:translateX(0);}}' +
                '@keyframes lbSlideInLeft{from{opacity:0;transform:translateX(-48px);}to{opacity:1;transform:translateX(0);}}' +
                '@keyframes lbSlideOutRight{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(48px);}}' +
                '@keyframes lbSlideOutLeft{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(-48px);}}' +
                '.lb-slide-in-right{animation:lbSlideInRight .26s cubic-bezier(.22,.61,.36,1) both;}' +
                '.lb-slide-in-left{animation:lbSlideInLeft .26s cubic-bezier(.22,.61,.36,1) both;}' +
                '.lb-slide-out-right{animation:lbSlideOutRight .16s ease-in both;}' +
                '.lb-slide-out-left{animation:lbSlideOutLeft .16s ease-in both;}' +
                '@media (prefers-reduced-motion:reduce){.lb-slide-in-right,.lb-slide-in-left,.lb-slide-out-right,.lb-slide-out-left{animation:none!important;}}';
            document.head.appendChild(st);
        }
        var list = imgs.map(function (im) { return { src: im.currentSrc || im.src, alt: im.alt || '' }; });
        var currentIndex = 0, animating = false;
        function updateDownload(src) {
            var dl = box.querySelector('[data-download]');
            if (dl) { dl.href = src; dl.setAttribute('download', filenameFrom(src)); }
        }
        function updateCounter() {
            var c = box.querySelector('[data-counter]');
            if (c) c.textContent = (currentIndex + 1) + ' / ' + list.length;
        }
        function updateCaption() {
            var c = box.querySelector('[data-caption]');
            if (!c) return;
            var alt = (list[currentIndex] && list[currentIndex].alt) || '';
            if (alt) { c.textContent = alt; c.classList.remove('lb-hide'); }
            else { c.classList.add('lb-hide'); }
        }
        function showImage(newIndex, dir) {
            if (newIndex === currentIndex || animating || list.length < 2) return;
            var next = list[newIndex];
            var pre = new Image();
            pre.onload = pre.onerror = function () {
                animating = true;
                var outCls = dir > 0 ? 'lb-slide-out-left' : 'lb-slide-out-right';
                var inCls = dir > 0 ? 'lb-slide-in-right' : 'lb-slide-in-left';
                boxImg.classList.remove('animate-search-pop', 'animate-search-pop-out', 'lb-slide-in-left', 'lb-slide-in-right', 'lb-slide-out-left', 'lb-slide-out-right');
                boxImg.classList.add(outCls);
                setTimeout(function () {
                    boxImg.src = next.src;
                    boxImg.alt = next.alt;
                    updateDownload(next.src);
                    currentIndex = newIndex;
                    updateCounter();
                    updateCaption();
                    boxImg.classList.remove(outCls);
                    void boxImg.offsetWidth;
                    boxImg.classList.add(inCls);
                    setTimeout(function () {
                        boxImg.classList.remove(inCls);
                        animating = false;
                    }, 280);
                }, 160);
            };
            pre.src = next.src;
        }
        function navigate(dir) {
            if (list.length < 2) return;
            showImage((currentIndex + dir + list.length) % list.length, dir);
        }
        function close() {
            if (box.classList.contains('hidden')) return;
            boxImg.classList.remove('animate-search-pop');
            boxImg.classList.add('animate-search-pop-out');
            box.classList.add('opacity-0');
            setTimeout(function () {
                box.classList.add('hidden');
                box.classList.remove('flex');
                boxImg.classList.remove('animate-search-pop-out');
            }, 240);
        }
        var box = document.getElementById('lightbox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'lightbox';
            box.className = 'fixed inset-0 hidden items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-zoom-out transition-opacity duration-200 opacity-0';
            box.innerHTML =
                '<button data-close class="lb-ctrl absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-white" aria-label="' + (isEn ? 'Close' : '关闭') + '"><i class="fa fa-times text-xl"></i></button>' +
                '<a data-download="1" class="lb-ctrl absolute right-20 top-4 flex h-11 w-11 items-center justify-center rounded-full text-white" aria-label="' + (isEn ? 'Download image' : '下载图片') + '" title="' + (isEn ? 'Download image' : '下载图片') + '" download><i class="fa fa-download text-xl"></i></a>' +
                '<button data-nav="prev" class="lb-nav absolute left-4 top-1/2" aria-label="' + (isEn ? 'Previous image' : '上一张') + '"><i class="fa fa-chevron-left text-2xl"></i></button>' +
                '<button data-nav="next" class="lb-nav absolute right-4 top-1/2" aria-label="' + (isEn ? 'Next image' : '下一张') + '"><i class="fa fa-chevron-right text-2xl"></i></button>' +
                '<div data-counter class="lb-counter absolute bottom-4 left-4"></div>' +
                '<div data-caption class="lb-caption absolute bottom-4 right-4 lb-hide"></div>' +
                '<img class="max-h-[90vh] max-w-[94vw] rounded-lg shadow-2xl cursor-auto" alt="">';
            document.body.appendChild(box);
            box.querySelector('[data-close]').addEventListener('click', function (e) { e.stopPropagation(); close(); });
            box.querySelector('[data-download]').addEventListener('click', function (e) { e.stopPropagation(); });
            box.querySelector('[data-nav="prev"]').addEventListener('click', function (e) { e.stopPropagation(); navigate(-1); });
            box.querySelector('[data-nav="next"]').addEventListener('click', function (e) { e.stopPropagation(); navigate(1); });
            // 仅点击背景（遮罩）关闭
            box.addEventListener('click', function (e) { if (e.target === box) close(); });
            // 键盘：Esc 关闭，左右方向键切换
            document.addEventListener('keydown', function (e) {
                if (box.classList.contains('hidden')) return;
                if (e.key === 'Escape') close();
                else if (e.key === 'ArrowLeft') navigate(-1);
                else if (e.key === 'ArrowRight') navigate(1);
            });
            // 触摸滑动切换（移动端）：横向滑动超过阈值即切换，并阻止页面横向滚动
            var boxImg = box.querySelector('img');
            var tsx = 0, tsy = 0, tracking = false;
            boxImg.addEventListener('touchstart', function (e) {
                if (e.touches.length === 1) { tsx = e.touches[0].clientX; tsy = e.touches[0].clientY; tracking = true; }
            }, { passive: true });
            boxImg.addEventListener('touchmove', function (e) {
                if (!tracking) return;
                var dx = e.touches[0].clientX - tsx, dy = e.touches[0].clientY - tsy;
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) e.preventDefault();
            }, { passive: false });
            boxImg.addEventListener('touchend', function (e) {
                if (!tracking) return; tracking = false;
                var t = e.changedTouches[0], dx = t.clientX - tsx, dy = t.clientY - tsy;
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1);
            }, { passive: true });
        }
        var boxImg = box.querySelector('img');
        imgs.forEach(function (img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function (e) {
                e.preventDefault();
                var idx = imgs.indexOf(img);
                currentIndex = idx < 0 ? 0 : idx;
                boxImg.src = list[currentIndex].src;
                boxImg.alt = list[currentIndex].alt;
                updateDownload(list[currentIndex].src);
                updateCounter();
                updateCaption();
                var single = list.length < 2;
                box.querySelector('[data-nav="prev"]').classList.toggle('lb-hide', single);
                box.querySelector('[data-nav="next"]').classList.toggle('lb-hide', single);
                box.querySelector('[data-counter]').classList.toggle('lb-hide', single);
                box.classList.remove('hidden');
                box.classList.add('flex');
                void box.offsetWidth; // 重排，确保从 opacity:0 起始淡入
                box.classList.remove('opacity-0');
                // 入场弹入（与首页弹窗同一套动画）
                boxImg.classList.remove('animate-search-pop', 'animate-search-pop-out', 'lb-slide-in-left', 'lb-slide-in-right', 'lb-slide-out-left', 'lb-slide-out-right');
                void boxImg.offsetWidth;
                boxImg.classList.add('animate-search-pop');
            });
        });
    }

    // 相关阅读：同分类优先，不足 3 篇则用最新文章补齐
    function buildRelated(meta) {
        var article = document.querySelector('main article');
        if (!article) return;
        // 归一化 slug：中英文章统一去掉 -en 后缀再比较，确保英文版也能正确排除当前文章
        function normSlug(s) { return (s || '').replace(/-en$/, ''); }
        var current = normSlug(meta.slug) ||
            normSlug(window.location.pathname.split('/').pop().replace(/\.html$/, ''));
        function render(items) {
            if (!items || !items.length) return;
            var sorted = items.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
            var same = sorted.filter(function (x) { return x.category === meta.category && normSlug(x.slug) !== current; });
            var pool = same;
            if (pool.length < 3) {
                var others = sorted.filter(function (x) { return x.category !== meta.category && normSlug(x.slug) !== current; });
                pool = same.concat(others);
            }
            var related = pool.slice(0, 3);
            if (!related.length) return;
            var wrap = document.createElement('div');
            wrap.className = 'mt-12 pt-8 border-t border-gray-200';
            var h = document.createElement('h2');
            h.className = 'text-xl font-bold text-primary mb-6';
            h.textContent = isEn ? 'Related Reading' : '相关阅读';
            wrap.appendChild(h);
            var grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 sm:grid-cols-3 gap-4';
            related.forEach(function (item) {
                var icon = CATEGORY_ICON[item.category] || 'fa-newspaper';
                // 文章页位于 news/ 子目录，封面路径需加上 ../ 才能正确指向根目录 assets/
                var coverPath = item.cover ? (basePath + item.cover) : '';
                var cover = coverPath
                    ? '<img src="' + coverPath + '" alt="" loading="lazy" class="w-full h-32 object-cover">'
                    : '<div class="w-full h-32 bg-gradient-primary flex items-center justify-center"><i class="fa ' + icon + ' text-white/80 text-3xl"></i></div>';
                var card = document.createElement('a');
                card.href = item.slug + '.html';
                card.className = 'group block bg-white rounded-xl shadow-md overflow-hidden card-hover';
                card.innerHTML = cover +
                    '<div class="p-4">' +
                        '<div class="flex items-center text-xs text-gray-500 mb-2"><span class="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">' + escapeHtml(item.category) + '</span><span class="ml-2"><i class="fa fa-calendar mr-1"></i>' + item.date + '</span></div>' +
                        '<h3 class="text-base font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">' + escapeHtml(item.title) + '</h3>' +
                    '</div>';
                grid.appendChild(card);
            });
            wrap.appendChild(grid);
            article.appendChild(wrap);
        }
        var data = isEn ? (window.__NEWS_EN__ || []) : (window.__NEWS__ || []);
        if (data && data.length) { render(data); return; }
        var url = basePath + (isEn ? 'news-manifest-en.json' : 'news-manifest.json');
        fetch(url).then(function (r) { return r.json(); }).then(render).catch(function () {});
    }

    /* ---------- 返回顶部 ---------- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        let shown = null;
        onScroll((y) => {
            const next = y > 400;
            if (next === shown) return;
            shown = next;
            backToTop.classList.toggle('show', next);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 弹窗键盘焦点陷阱：任一弹窗打开时，Tab / Shift+Tab 被限制在弹窗内，避免焦点落到背后页面
    (function installFocusTrap() {
        const MODAL_IDS = ['searchModal', 'changelogModal', 'qrModal', 'lightbox'];
        const SEL = 'a[href],button:not([disabled]),textarea,input:not([disabled]),select,[tabindex]:not([tabindex="-1"])';
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Tab') return;
            let open = null;
            for (const id of MODAL_IDS) {
                const m = document.getElementById(id);
                if (m && !m.classList.contains('hidden')) { open = m; break; }
            }
            if (!open) return;
            const nodes = Array.prototype.filter.call(open.querySelectorAll(SEL), function (el) {
                return el.offsetParent !== null;
            });
            if (!nodes.length) return;
            const first = nodes[0], last = nodes[nodes.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first || !open.contains(document.activeElement)) {
                    e.preventDefault(); last.focus();
                }
            } else {
                if (document.activeElement === last || !open.contains(document.activeElement)) {
                    e.preventDefault(); first.focus();
                }
            }
        });
    })();

    // 更新日志：页脚入口 + 弹窗
    initChangelog();
    // 全站社交分享浮动按钮 + 复制链接
    initShareWidget();
});

/* ===========================================================
   暗色模式（Night Mode）
   机制：<html data-theme="dark"> + CSS 变量。首屏前由
   build/inject-theme.js 注入的防闪烁脚本设置 data-theme；
   这里只负责注入切换按钮、绑定点击，并在「无显式选择时」跟随系统。
   切换动画由 CSS 完成（配色 0.4s 缓动 + 太阳/月亮交叉淡入旋转），
   不依赖任何 transform 动画，故不会与 hover 缩放 / 滚动渐入打架。
   =========================================================== */
function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    if (next === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');   // 亮色用默认 :root，移除属性即可
    try { localStorage.setItem('theme', next); } catch (_) {}
    // 一旦用户显式选择，就不再跟随系统主题（移除 matchMedia 监听）
    if (themeSysListener) {
        const mq = themeSysListener.mq, fn = themeSysListener.fn;
        if (mq.removeEventListener) mq.removeEventListener('change', fn);
        else if (mq.removeListener) mq.removeListener(fn);
        themeSysListener = null;
    }
}

function createThemeToggle(isEnPage) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', isEnPage ? 'Toggle dark mode' : '切换夜间模式');
    btn.setAttribute('title', isEnPage ? 'Dark mode' : '夜间模式');
    // 太阳/月亮由 CSS 伪元素（::before/::after）依据 html[data-theme] 渲染，无需内联图标
    btn.addEventListener('click', toggleTheme);
    return btn;
}

let themeSysListener = null;   // 仅在「用户未显式选择」时跟随系统，显式选择后清空

function initTheme(isEnPage) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 桌面端：放到导航链接容器末尾（搜索按钮之后，成为最右侧工具图标）
    const desktopContainer = document.querySelector('#mainNav .hidden.md\\:flex');
    if (desktopContainer) desktopContainer.appendChild(createThemeToggle(isEnPage));

    // 移动端：放到顶栏搜索按钮前面（#mobileTopSearchBtn 之前），与搜索/汉堡并排
    const mobileSearchBtn = document.getElementById('mobileTopSearchBtn');
    if (mobileSearchBtn && mobileSearchBtn.parentElement) {
        mobileSearchBtn.parentElement.insertBefore(createThemeToggle(isEnPage), mobileSearchBtn);
    }

    // 跟随系统：仅当用户尚未显式选择（localStorage 无 light/dark）时挂载监听
    let stored = null;
    try { stored = localStorage.getItem('theme'); } catch (_) {}
    if (stored !== 'light' && stored !== 'dark' && window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const fn = (e) => {
            if (e.matches) document.documentElement.setAttribute('data-theme', 'dark');
            else document.documentElement.removeAttribute('data-theme');
            // 按钮图标由 CSS 伪元素依据 html[data-theme] 自动切换，无需在 JS 里改文案
        };
        if (mq.addEventListener) mq.addEventListener('change', fn);
        else if (mq.addListener) mq.addListener(fn);
        themeSysListener = { mq: mq, fn: fn };
    }
}

/* ===========================================================
   A1 · 跨页视图过渡（View Transitions API）—— 渐进增强
   -----------------------------------------------------------
   · Chrome 126+ 原生支持 MPA 过渡（pageswap / pagereveal），
     由 CSS 的 @view-transition { navigation: auto } 自动处理，
     这里无需做任何 DOM 操作，整页脚本会照常在新页面重新执行。
   · 本模块只为「支持 startViewTransition 但不支持 MPA 自动过渡」
     的浏览器（如 Chrome 111–125）提供优雅回退：拦截站内链接点击，
     用 startViewTransition 做一帧淡出后再整页跳转，避免硬切。
   · 不支持 startViewTransition 的浏览器：直接放行，普通跳转。
   · 始终尊重 prefers-reduced-motion：减少动态时完全不拦截。
   · 任何异常都回退为默认导航，绝不阻断用户到达目标页。
   =========================================================== */
(function initCrossPageTransition() {
    'use strict';
    const doc = document;

    // 1) 已支持 MPA 自动过渡的浏览器：CSS 已接管，无需 JS 介入
    if ('pageswap' in window || 'pagereveal' in window) return;

    // 2) 完全不支持 View Transitions：放行，普通整页跳转
    if (typeof doc.startViewTransition !== 'function') return;

    // 3) 用户要求减少动态：不拦截，避免任何额外动画
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SAME_ORIGIN = location.origin;

    function isInternalNav(a, href) {
        if (!a || !href) return false;
        if (a.target === '_blank' || a.hasAttribute('download')) return false;
        if (a.hasAttribute('data-no-transition')) return false;
        let url;
        try { url = new URL(href, SAME_ORIGIN); } catch (_) { return false; }
        if (url.origin !== SAME_ORIGIN) return false;            // 外链
        if (url.pathname === location.pathname && (url.hash || href.startsWith('#'))) return false; // 同页锚点
        return true;
    }

    doc.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 ||
            e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest('a[href]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!isInternalNav(a, href)) return;

        e.preventDefault();
        let target;
        try { target = new URL(href, SAME_ORIGIN).href; } catch (_) { target = href; }

        const navigate = () => { window.location.href = target; };
        try {
            doc.startViewTransition
                ? doc.startViewTransition(navigate)
                : navigate();
        } catch (_) {
            navigate(); // 任何异常都回退为普通跳转，绝不阻断
        }
    }, true); // 捕获阶段：确保在其它处理器之前决定是否拦截
})();
