-- 由 scripts/migrate-articles.mjs 生成，迁移 34 篇文章到 D1 articles 表
-- 执行：wrangler d1 execute tstc-ba-website --remote --file=scripts/seed-articles.sql
BEGIN;
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-1-en', 'en', 'TSNU Bar 2025 Spring Semester Work Summary', '2025-07-02', 'Summary', 'TSNU Bar Mod Team', 'As this semester draws to a close, what has the Mod Team accomplished in content development, event organization, and community moderation? Here is our sincere semester report card.', '', '                <p>As the semester comes to a close, the Mod Team would like to offer a plain and honest summary to report our work to every bar member and hear your thoughts. The bar is no one''s "private plot"—it is our shared public space.</p>

                <h2>I. Content Development</h2>
                <p>This semester we kept curating campus news, exam schedules, and event previews, and tried to present them with clearer formatting. We also launched the "News &amp; Updates" section, gathering what used to be scattered announcements into a retrievable timeline.</p>
                <ul>
                    <li>Published several official announcements and friendly reminders;</li>
                    <li>Organized practical posts such as Freshman Guides and course-selection tips;</li>
                    <li>Pinned frequently asked questions to reduce duplicate inquiries.</li>
                </ul>

                <h2>II. Event Organization</h2>
                <p>In line with the school calendar, we organized online Q&amp;A sessions and experience sharing during events such as Freshman welcome and exam seasons. Although most were carried out quietly, every interaction brought us closer to our fellow students.</p>

                <h2>III. Community Moderation</h2>
                <p>This semester we handled several cases of violating content, mainly through reminders and post deletion, with bans as a supplementary measure. We have always upheld "education first, cautious punishment" and kept an appeal channel open.</p>
                <blockquote>The purpose of moderation is not control, but to let more people dare to—and enjoy—speaking up here.</blockquote>

                <h2>IV. Shortcomings &amp; Outlook</h2>
                <p>We are also aware that our response speed and content quality still have room for improvement; some features (such as on-site search and a submission portal) are not yet complete. Next semester we plan to:</p>
                <ol>
                    <li>Establish more transparent post-deletion and appeal guidelines;</li>
                    <li>Open submissions to bar members to enrich our content;</li>
                    <li>Optimize "News &amp; Updates" to support category-based search.</li>
                </ol>

                <p>Thank you for your company this semester. Next semester, we will continue to build the bar into a trustworthy corner of campus life.</p>
            ', 1791732251477, 1791732251477);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-1', 'zh', '唐山师范学院吧 2025 年上学期工作总结', '2025-07-02', '总结', '唐山师范学院吧务组', '回顾这一学期，吧务组在内容建设、活动组织与秩序维护上做了哪些事？一起看看这份真诚的学期答卷。', '', '                <p>学期走到尾声，吧务组想用一份朴实的总结，和每一位吧友汇报这段时间的所作所为，也听听你的想法。贴吧不是谁的「自留地」，而是我们共同的公共空间。</p>

                <h2>一、内容建设</h2>
                <p>本学期我们持续整理校园资讯、考试安排与活动预告，并尝试用更清晰的排版呈现。同时上线了「新闻动态」板块，把原本零散的通知汇聚成可回溯的时间线。</p>
                <ul>
                    <li>发布官方公告与温馨提示若干；</li>
                    <li>整理新生指南、选课经验等实用帖；</li>
                    <li>置顶高频问题，减少重复提问。</li>
                </ul>

                <h2>二、活动组织</h2>
                <p>我们配合学校节奏，在迎新、考试季等节点组织了线上答疑与经验分享。虽大多低调进行，但每一次互动都让我们更贴近同学。</p>

                <h2>三、秩序维护</h2>
                <p>本学期共处理违规内容若干起，以提醒、删帖为主，封禁为辅。我们始终坚持「教育优先、处罚审慎」，并保留申诉通道。</p>
                <blockquote>管理的目的不是管控，而是让更多人敢于、也乐于在这里好好说话。</blockquote>

                <h2>四、不足与展望</h2>
                <p>我们也清楚，响应速度、内容质量仍有提升空间；部分功能（如站内搜索、投稿入口）尚未完善。下学期我们计划：</p>
                <ol>
                    <li>建立更透明的删帖与申诉说明；</li>
                    <li>开放吧友投稿，让内容更丰富；</li>
                    <li>优化「新闻动态」，支持按分类检索。</li>
                </ol>

                <p>谢谢你这一学期的陪伴。下学期，我们继续把贴吧经营成值得信赖的校园角落。</p>
            ', 1791732251477, 1791732251477);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-10-en', 'en', 'Freshman Guide (5): Transportation & Travel', '2026-07-22', 'Guide', 'TSNU Bar Mod Team', 'TSNU transportation guide: routes from Tangshan Railway Station / North Station / West Station / airport to campus, commuting between the two campuses, nearby commercial areas, bus fares and payment methods, cycling reminders, and travel pitfalls to avoid — useful for both check-in and daily travel.', '', '                <p>Tangshan Normal University has two campuses — Daxuedao Campus and Xueyuan Road Campus — and daily commuting and shopping trips differ considerably between them. Tangshan has no metro yet, but the city bus network is extensive, and both campuses are well served by public buses, making travel fairly convenient.</p>
                <p>This article compiles routes from the stations to campus, travel between campuses, and trips to shopping areas. Read it together with the earlier dining and shopping guide to help Freshmen quickly get the hang of getting around.</p>

                <h2>I. Getting to Campus (for Freshman Check-in)</h2>
                <p>On check-in day Freshmen carry a lot of luggage. The routes below are organized by transportation hub; for bulky luggage we recommend taking a ride-hailing car first.</p>

                <h3>1. Tangshan Railway Station</h3>
                <ul>
                    <li><strong>To Daxuedao Campus (156 Jianshe North Road)</strong>: Take bus 22 or 26 to a stop near campus;</li>
                    <li><strong>To Xueyuan Road Campus</strong>: Take bus 55 directly to the surrounding area.</li>
                </ul>
                <p>For bulky luggage, we recommend taking a ride-hailing car first.</p>

                <h3>2. Tangshan North Station</h3>
                <ul>
                    <li><strong>To Daxuedao Campus</strong>: Take express bus D03, flat fare 5 yuan year-round;</li>
                    <li>With lots of luggage, prefer ride-hailing; regular bus routes take much longer.</li>
                </ul>

                <h3>3. Tangshan West Station</h3>
                <p>Take bus 97 directly to the area around Daxuedao Campus.</p>

                <h3>4. Tangshan Sannühe Airport</h3>
                <p>Take Airport Shuttle Line 2 to reach near Daxuedao Campus.</p>

                <h2>II. Commuting Between the Two Campuses</h2>
                <p>Daxuedao Campus ↔ Xueyuan Road Campus: bus 55 is the top choice, about 20 minutes one way in normal traffic.</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Tip:</strong> Students at the two campuses basically never take classes across campuses; most trips are for errands. Plan your time and leave a buffer before traveling to deal with unexpected traffic jams.</p>

                <h2>III. Travel Tips for Nearby Shopping Areas</h2>
                <ul>
                    <li><strong>Daxuedao Campus</strong>: Nearby are Renmin Shopping Plaza and Ocean City;</li>
                    <li><strong>Xueyuan Road Campus</strong>: Right next to Aegean Shopping Center.</li>
                </ul>
                <p>The shopping areas are close to the campuses and are basically reachable on foot, so no bus or bike ride is needed.</p>

                <h2>IV. Tangshan Bus Payment Methods and Fare Rules</h2>
                <p>Standard city routes: 1 yuan in the non-air-conditioned season, 2 yuan in the air-conditioned season.</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Note:</strong> Express buses like D03 and suburban routes have special fares — a flat 5 yuan for the whole trip.</p>
                <p>Available payment methods:</p>
                <ul>
                    <li><strong>Alipay Travel</strong>: Search "Tangshan Bus" to activate the e-ride QR code; after topping up the balance in the ride QR code you get a 10% discount;</li>
                    <li><strong>WeChat</strong>: Open the "City Pass" mini-program, set location to Tangshan, and activate the bus ride QR code;</li>
                    <li><strong>UnionPay Cloud Flash Pay</strong>: Use the ride QR code in the Travel section; the regular payment code also works directly for boarding;</li>
                    <li><strong>e-CNY App</strong>: Activate the Tangshan Bus ride QR code in the Life Services section;</li>
                    <li><strong>NFC</strong>: Any physical card or phone virtual card with the Transport Union logo can be tapped to ride;</li>
                    <li><strong>Cash (coin into the box)</strong>.</li></li>
                </ul>
                <p>Transfer discount: Alipay, WeChat, and UnionPay Cloud Flash Pay ride QR codes support unlimited free transfers within 90 minutes, as long as the transfer route fare is no higher than the first ride''s fare.</p>

                <h2>V. Important Reminders on Bikes</h2>
                <ul>
                    <li>Shared bikes are not allowed inside campus; outside campus you can normally use shared bikes and shared e-bikes;</li>
                    <li>Park only in officially designated areas; random parking incurs a rebalancing fee;</li>
                    <li>For shared e-bikes, watch the service area to avoid running out of power mid-trip.</li>
                </ul>

                <h2>VI. Travel Pitfalls to Avoid</h2>
                <ul>
                    <li>Prefer ride-hailing and avoid hailing street taxis directly — Tangshan local taxis are often known for overcharging;</li>
                    <li>Do not take private cars that solicit passengers at train or bus station exits — chaotic bargaining and no safety guarantee;</li>
                    <li>During holidays and the evening rush hour it is harder to get a car, so book in advance;</li>
                    <li>When going out alone at night, choose licensed ride-hailing or buses and avoid remote roads;</li>
                    <li>Most city buses have last departures between 21:30–22:00, so plan your return time wisely when out at night.</li>
                </ul>

                <h2>VII. Extra Tips</h2>
                <p>For daily shopping: Daxuedao Campus students prefer Ocean City and Renmin Shopping; Xueyuan Road Campus students go to Aegean nearby. Just plan your route using this transportation guide.</p>

                <p>TSNU Bar Mod Team<br>July 22, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ Freshman Group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ Freshman Group</figcaption>
                </figure>
            ', 1791732251477, 1791732251477);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-10', 'zh', '新生指南（五）-交通出行相关', '2026-07-22', '指南', '唐山师范学院吧务组', '唐山师范学院交通出行指南：整理唐山站/北站/西站/机场到校路线、两校区往返通勤、周边商圈、公交票价与支付方式、骑行提醒及出行避雷重点，新生报到与日常出行均可参考。', '', '                <p>唐山师范学院分为大学道校区、学院路校区，日常通勤、外出购物的出行差异较大。唐山暂无地铁，但市区公交线路十分发达，两所校区周边公交配套完善，出行较为便利。</p>
                <p>本篇整理车站到校、校区互访、前往商圈的路线，搭配前面的食堂商超攻略一起查看，方便新生快速摸清出行门路。</p>

                <h2>一、抵达学校交通（新生报到适用）</h2>
                <p>新生报到当天行李较多，下面按不同交通枢纽整理到校路线，大件行李建议优先网约车。</p>

                <h3>唐山站</h3>
                <ul>
                    <li><strong>前往大学道校区（建设北路156号）</strong>：乘 22路、26路公交可直达校区附近站点；</li>
                    <li><strong>前往学院路校区</strong>：乘 55路公交直达周边。</li>
                </ul>
                <p>携带大件行李建议优先选择网约车。</p>

                <h3>唐山北站</h3>
                <ul>
                    <li><strong>前往大学道校区</strong>：可乘 D03 路特快公交，全年一票制 5 元；</li>
                    <li>行李较多时优先网约车，普通公交线路耗时较长。</li>
                </ul>

                <h3>唐山西站</h3>
                <p>乘 97路公交可直达大学道校区周边。</p>

                <h3>唐山三女河机场</h3>
                <p>乘机场专线2路可抵达大学道校区附近。</p>

                <h2>二、两校区之间往返通勤</h2>
                <p>大学道校区 ↔ 学院路校区，首选 55路公交车，正常路况单程大约 20 分钟。</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>提示：</strong>两校区学生基本不存在跨校区上课的情况，往返大多为办理事务。出行前规划好时间、预留缓冲，以应对临时堵车。</p>

                <h2>三、校区周边商圈出行提示</h2>
                <ul>
                    <li><strong>大学道校区</strong>：附近有人民购物广场、远洋城；</li>
                    <li><strong>学院路校区</strong>：紧邻爱琴海购物中心。</li>
                </ul>
                <p>商圈距离校区都很近，基本可以步行抵达，无需乘坐公交或骑行。</p>

                <h2>四、唐山公交乘车支付方式与票价规则</h2>
                <p>常规市区线路票价：非空调期 1 元，空调期 2 元。</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>注意：</strong>D03 这类大站快车、远郊线路票价特殊，全程 5 元一票制。</p>
                <p>可用乘车方式：</p>
                <ul>
                    <li><strong>支付宝出行</strong>：搜索「唐山公交」开通电子乘车码；乘车码内余额充值后可享 9 折优惠；</li>
                    <li><strong>微信</strong>：打开「城市通」小程序，定位唐山，开通公交乘车码；</li>
                    <li><strong>云闪付</strong>：出行板块乘车码，普通付款码也可直接乘车；</li>
                    <li><strong>数字人民币 APP</strong>：生活服务板块开通唐山公交乘车码；</li>
                    <li><strong>NFC</strong>：所有带交通联合标识的实体卡、手机虚拟交通联合卡均可刷卡乘车；</li>
                    <li><strong>现金投币</strong>。</li>
                </ul>
                <p>换乘优惠：支付宝、微信、云闪付乘车码支持 90 分钟内无限次免费换乘，换乘线路票价不高于首乘票价即可享受。</p>

                <h2>五、骑行工具重要提醒</h2>
                <ul>
                    <li>校内禁止共享单车驶入；校外区域可正常使用共享单车、共享电动车；</li>
                    <li>停车留意官方划定停放区，随意停放会产生调度费；</li>
                    <li>共享电单车注意运营范围，防止半路断电。</li>
                </ul>

                <h2>六、出行避雷须知</h2>
                <ul>
                    <li>尽量优先使用网约车，不直接搭乘路边巡游出租车，唐山本地出租车宰客现象较多；</li>
                    <li>火车站、汽车站出口主动揽客的私家车不要乘坐，议价混乱、缺乏安全保障；</li>
                    <li>节假日、晚高峰打车难度上升，可提前预约车辆；</li>
                    <li>夜间独自外出尽量选择正规网约车、公交，避开偏僻路段；</li>
                    <li>市区公交末班车大多集中在 21:30–22:00，晚间外出合理规划返程时间。</li>
                </ul>

                <h2>补充小贴士</h2>
                <p>日常采购可参考：大学道校区学生优先选择远洋城、人民购物；学院路校区学生就近前往爱琴海。路线结合本篇交通指南安排即可。</p>

                <p>唐山师范学院吧务组<br>2026年7月22日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251478, 1791732251478);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-11-en', 'en', 'Freshman Guide (6): How to Pick Up Packages at Daxuedao Campus', '2026-07-23', 'Guide', 'TSNU Bar Mod Team', 'A complete guide to picking up packages at Tangshan Normal University''s Daxuedao Campus: the precise receiving address, off-campus station locations, the three stations (Cainiao, Tuxi, and SF Express) and their courier brands and pickup procedures, plus storage, shipping, and return instructions—helping Freshmen mail luggage easily before reporting in and collect packages quickly after arriving on campus.', '', '                <p>All packages at Daxuedao Campus are collected at off-campus stations. The three stations run independent systems with completely different pickup procedures. If Freshmen don''t sort this out in advance, it''s easy to end up in the awkward situation of "the package arrived but you don''t know how to get it." This guide lays out the receiving address, station locations, corresponding courier brands, and pickup procedures all at once—mail your bedding, clothing, and other bulky luggage before reporting in, and you can pick it up right after arriving on campus.</p>

                <h2>I. Precise Campus Receiving Address</h2>
                <p>Simply copy the address below—<strong>no need to fill in dorm building or class information</strong>:</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">Tangshan Normal University Daxuedao Campus, No. 156 Jianshe North Road, Lubei District, Tangshan City, Hebei Province</p>
                <p>As long as the campus name is correct, the package will be delivered normally. On the first day of school, the campus is chaotic—especially near the package points—and many people won''t be quite sure how to pick up packages, so pickup will be slow. If you need to mail items ahead of time, please consider this carefully. Also, the package points may close during winter and summer vacations when students leave campus, so if you really need to mail something, it''s fine to do it a few days before the semester starts.</p>

                <h2>II. Package Station Location</h2>
                <p>Daxuedao Campus <strong>has no on-campus package point</strong>; all packages are collected at the <strong>basement level of the Baiyulan Hotel courtyard</strong> next to the school. The basement houses three independently operated stations whose systems do not interconnect:</p>
                <ul>
                    <li><strong>Cainiao Station</strong>: YTO, STO, J&T, Yunda, and other standard couriers;</li>
                    <li><strong>Tuxi Station</strong>: exclusively for ZTO Express;</li>
                    <li><strong>SF Station</strong>: SF Express, SF Express Priority, SF Fresh.</li>
                </ul>
                <p>The three stations handle different courier brands and use different pickup methods, so be sure to go to the correct station as indicated by the SMS and do not mix them up.</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <figure class="text-center">
                        <div class="aspect-video rounded-lg shadow-sm" style="overflow:hidden">
                            <img src="../assets/images/post-11-map.jpg" alt="Baiyulan Hotel and station location map" class="w-full h-full object-cover" style="margin:0" loading="lazy">
                        </div>
                        <figcaption class="text-xs text-gray-500 mt-2">Baiyulan Hotel courtyard location map</figcaption>
                    </figure>
                    <figure class="text-center">
                        <div class="aspect-video rounded-lg shadow-sm" style="overflow:hidden">
                            <img src="../assets/images/post-11-entrance.jpg" alt="Station entrance photo" class="w-full h-full object-cover" style="margin:0" loading="lazy">
                        </div>
                        <figcaption class="text-xs text-gray-500 mt-2">Station entrance photo (the package station is on its basement level)</figcaption>
                    </figure>
                </div>

                <h2>III. Pickup Process at the Three Stations</h2>

                <h3>1. Cainiao Station</h3>
                <p><strong>Courier coverage:</strong> YTO, STO, J&T, Yunda, and other standard couriers (excluding ZTO), as well as Pinduoduo Grocery.</p>
                <p><strong>Pickup tool:</strong> Pinduoduo app.</p>
                <p><strong>Full process:</strong></p>
                <ol>
                    <li>After receiving the "package arrived" notification, open the Pinduoduo app;</li>
                    <li>Scan the station''s dedicated QR code to obtain your checkout identity code;</li>
                    <li>Find your package on the shelf using the pickup code from the SMS;</li>
                    <li>Scan both your Pinduoduo identity code and the package''s shipping-label barcode at the self-service checkout machine;</li>
                    <li>Once the machine shows "checkout successful," you may take the package.</li>
                </ol>

                <h3>2. Tuxi Station</h3>
                <p><strong>Courier coverage:</strong> all ZTO Express packages on campus (ZTO only).</p>
                <p><strong>Pickup tool:</strong> the WeChat "Tuxi Life" mini-program.</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Note for new students:</strong> The Tuxi Life mini-program is mainly used to generate your pickup identity code; it does not directly display or sync all package information in the station, so there is no need to repeatedly check logistics in the mini-program. For pickup, you only need the dedicated pickup code received from Taobao, JD, or SMS.</p>
                <p><strong>Full process:</strong></p>
                <ol>
                    <li>Search for and open the "Tuxi Life" mini-program in WeChat, and bind your phone number in advance;</li>
                    <li>Check your shopping app or SMS to get the pickup code for your ZTO package;</li>
                    <li>Generate your dedicated identity/verification code within the mini-program;</li>
                    <li>Go to the Tuxi Station self-service machine, show the mini-program verification code, and complete checkout together with your pickup code;</li>
                    <li>Once verified, you may take the package.</li>
                </ol>

                <figure class="text-center my-6">
                    <img src="../assets/images/post-11-tuxi.jpg" alt="Tuxi Life mini-program identity code entry" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Tuxi Life mini-program "Identity Code" entry</figcaption>
                </figure>

                <h3>3. SF Station</h3>
                <p><strong>Courier coverage:</strong> SF Express, SF Express Priority, SF Fresh.</p>
                <p><strong>Pickup method:</strong> manual code reporting—no self-service machine or mini-program needed.</p>
                <p>Go directly to the SF dedicated counter and tell the staff your SMS pickup code or the last four digits of your phone number; after verifying your information, the staff will manually locate and hand over your package.</p>

                <h2>IV. Package Storage Notes</h2>
                <p>The off-campus stations do not enforce a strict free storage period and generally will not charge fees or return packages for short overstays. However, because the stations see heavy foot traffic and fast shelf turnover, it is recommended to collect your package as soon as possible after it arrives to avoid mix-ups, loss, or mistaken pickup.</p>

                <h2>V. Mailing Notes</h2>
                <p>The package stations are off-campus premises and are not subject to the school''s on-campus mailing restrictions, so everyday items can be sent directly without worrying about being held or returned.</p>

                <h2>VI. Shipping and Returns</h2>
                <p>All three stations in the basement of the Baiyulan Hotel support everyday personal shipping, online-shopping returns, and large luggage consignment, so your shipping needs can be handled in one stop off-campus, which is quite convenient.</p>

                <h2>VII. Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Can packages be delivered to my dorm building?</strong> No. The whole school picks up uniformly at off-campus stations; door-to-door dorm delivery is not supported.</li>
                    <li><strong>Can the three stations'' pickup methods be mixed?</strong> No. The three systems are completely independent; you must follow the dedicated process for the corresponding brand, and mixing them will not allow checkout.</li>
                    <li><strong>Are there any prohibited items for mailing?</strong> The stations are off-campus and have no on-campus prohibited-mailing restrictions, so all everyday items may be mailed.</li>
                </ul>

                <p>TSNU Bar Mod Team<br>July 23, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ new-student group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ new-student group</figcaption>
                </figure>
            ', 1791732251478, 1791732251478);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-11', 'zh', '新生指南（六）-大学道校区如何取快递', '2026-07-23', '指南', '唐山师范学院吧务组', '唐山师范学院大学道校区快递取件完整攻略：精准收货地址、校外驿站位置、菜鸟/兔喜/顺丰三大驿站对应快递与取件流程、存放与寄件退货说明，帮助新生报到前轻松寄行李、到校后快速取件。', '', '                <p>大学道校区快递全部在校外驿站领取，三个站点系统互不通用、取件流程也完全不同。新生如果不提前分清，很容易出现「快递到了却不知道怎么拿」的尴尬。本篇把收货地址、驿站位置、对应快递品牌和取件流程一次性整理清楚，报到前把被褥、衣物等大件行李寄过来，到校就能直接取。</p>

                <h2>一、校区精准收货地址</h2>
                <p>直接复制以下地址即可，<strong>无需填写宿舍楼、班级信息</strong>：</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">河北省唐山市路北区建设北路156号唐山师范学院大学道校区</p>
                <p>只要校区名称填对，快递就会正常派送。开学当天，校内会比较杂乱，尤其是快递点附近，大家可能都不太清楚怎么取快递。所以取快递速度会很慢，如果需要提前邮寄物品，请酌情考虑，而且快递点在寒暑假期间，可能会因为学生离校而停业，所以建议如果真的要邮东西的话，开学前几天再邮也来得及。</p>

                <h2>二、快递站整体位置</h2>
                <p>大学道校区<strong>没有校内快递点</strong>，所有快递统一在学校旁边的<strong>白玉兰酒店院内的地下一层</strong>领取。地下一层共有三家独立运营的驿站，彼此系统不互通：</p>
                <ul>
                    <li><strong>菜鸟驿站</strong>：圆通、申通、极兔、韵达等普通快递；</li>
                    <li><strong>兔喜驿站</strong>：中通快递专用；</li>
                    <li><strong>顺丰驿站</strong>：顺丰速运、顺丰特快、顺丰生鲜。</li>
                </ul>
                <p>三个站点对应的快递品牌不同、取件方式也不同，务必按短信提示去对应站点，不要混用。</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <figure class="text-center">
                        <div class="aspect-video rounded-lg shadow-sm" style="overflow:hidden">
                            <img src="../assets/images/post-11-map.jpg" alt="白玉兰酒店及快递站位置示意" class="w-full h-full object-cover" style="margin:0" loading="lazy">
                        </div>
                        <figcaption class="text-xs text-gray-500 mt-2">白玉兰酒店院内位置示意</figcaption>
                    </figure>
                    <figure class="text-center">
                        <div class="aspect-video rounded-lg shadow-sm" style="overflow:hidden">
                            <img src="../assets/images/post-11-entrance.jpg" alt="快递站入口实景" class="w-full h-full object-cover" style="margin:0" loading="lazy">
                        </div>
                        <figcaption class="text-xs text-gray-500 mt-2">驿站入口实景（快递站位于其地下一层）</figcaption>
                    </figure>
                </div>

                <h2>三、三大驿站取件流程</h2>

                <h3>1. 菜鸟驿站</h3>
                <p><strong>覆盖快递：</strong>圆通、申通、极兔、韵达等普通快递（不含中通），以及多多买菜。</p>
                <p><strong>取件工具：</strong>拼多多 App。</p>
                <p><strong>完整流程：</strong></p>
                <ol>
                    <li>收到「快递已到站」通知后，打开拼多多 App；</li>
                    <li>扫描驿站内专属二维码，获取出库身份码；</li>
                    <li>根据短信里的取件码，在货架上找到自己的包裹；</li>
                    <li>将拼多多身份码与快递面单条码同时对准自助出库机扫描；</li>
                    <li>机器提示「出库成功」后即可取走。</li>
                </ol>

                <h3>2. 兔喜驿站</h3>
                <p><strong>覆盖快递：</strong>全校所有中通快递（仅中通）。</p>
                <p><strong>取件工具：</strong>微信「兔喜生活」小程序。</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>新生注意：</strong>兔喜生活小程序主要用于生成取件身份码，并不能直接显示或同步所有站内快递信息，不必在小程序里反复查物流。取件时只需要淘宝、京东或短信收到的专属取件码即可。</p>
                <p><strong>完整流程：</strong></p>
                <ol>
                    <li>微信搜索进入「兔喜生活」小程序，提前绑定手机号；</li>
                    <li>查看购物软件或短信，获取中通快递对应的取件码；</li>
                    <li>在小程序内生成专属身份码/核验码；</li>
                    <li>前往兔喜驿站的自助取件机，出示小程序核验码并配合取件码完成出库；</li>
                    <li>核验成功即可取走快递。</li>
                </ol>

                <figure class="text-center my-6">
                    <img src="../assets/images/post-11-tuxi.jpg" alt="兔喜生活小程序身份码入口" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">兔喜生活小程序「身份码」入口</figcaption>
                </figure>

                <h3>3. 顺丰驿站</h3>
                <p><strong>覆盖快递：</strong>顺丰速运、顺丰特快、顺丰生鲜。</p>
                <p><strong>取件方式：</strong>人工报码，无需自助机、无需小程序。</p>
                <p>直接前往顺丰专属工位，向工作人员报出短信取件码或手机号后四位，工作人员核对信息后会人工找件并交付。</p>

                <h2>四、快递存放说明</h2>
                <p>校外驿站没有严格的免费存放期限，一般不会因为短期超时收费或退回。但由于站点人流量大、货架周转快，快递到件后建议尽快领取，避免混淆、遗失或误拿。</p>

                <h2>五、邮寄说明</h2>
                <p>快递驿站属于校外场地，不受校内物品邮寄限制，正常生活用品可以直接寄送，无需担心被暂扣或退回。</p>

                <h2>六、寄件与退货</h2>
                <p>白玉兰酒店地下一层的三家驿站均支持日常个人寄件、网购退货和大件行李托运，寄件需求可以在校外一站式完成，比较方便。</p>

                <h2>七、常见问题答疑</h2>
                <ul>
                    <li><strong>快递能送到宿舍楼下吗？</strong>不能。全校统一在校外驿站自取，不支持宿舍上门派送。</li>
                    <li><strong>三个驿站能混用取件方式吗？</strong>不能。三家系统完全独立，必须按对应品牌的专属流程操作，混用无法出库。</li>
                    <li><strong>有没有禁止邮寄的物品？</strong>驿站在校外，没有校内违禁邮寄限制，正常生活用品均可邮寄。</li>
                </ul>

                <p>唐山师范学院吧务组<br>2026年7月23日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251479, 1791732251479);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-12-en', 'en', 'Freshman Guide (7): How to Find Classrooms at Daxuedao Campus', '2026-07-24', 'Guide', 'TSNU Bar Mod Team', 'A guide to finding classrooms at Tangshan Normal University''s Daxuedao Campus: the North and South Courtyard teaching buildings, each building''s function and corresponding majors, classroom numbering rules, and practical wayfinding tips—helping Freshmen locate their scheduled classrooms quickly after the semester starts and avoid getting lost or arriving late.', '', '                <p>Few things are more stressful on your first day of class than staring at a room number on your schedule and not knowing which building it''s in. Daxuedao Campus is split into a North Courtyard and a South Courtyard, each with its own teaching buildings and room-numbering rules. This guide organizes the main teaching buildings, numbering conventions, and practical wayfinding tips so you can check it anytime after the semester starts and avoid getting lost or arriving late.</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">All images in this article can be previewed or saved by long-pressing or right-clicking.</p>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-campus-map.jpg" alt="Daxuedao Campus north and south courtyard teaching building distribution map" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Daxuedao Campus north and south courtyard teaching building distribution map</figcaption>
                </figure>

                <h2>I. North Courtyard Teaching Buildings</h2>
                <p>The North Courtyard has three teaching buildings, and most humanities courses are scheduled in this area.</p>

                <h3>1. Humanities Complex (North Courtyard Main Building)</h3>
                <p>This is the core classroom building for humanities departments, with lecture halls on both sides. Room numbers throughout the building start with "Wen" (文). Example regular classroom: <strong>Wen 211</strong>; example lecture hall: <strong>Wen 8 Lecture Hall</strong>.</p>
                <p>The building has elevators, but waits can be long during class-change peaks. If your classroom is on a higher floor, leave early and consider taking the stairs to avoid being late.</p>
                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/beiyuan-wenke-staircase-floorplan.jpg" alt="North Courtyard Humanities Complex lecture hall floor plan" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">North Courtyard Humanities Complex lecture hall floor plan</figcaption>
                </figure>

                <h3>2. Laboratory Building</h3>
                <p>Houses experimental equipment and is reserved for science practical courses; regular theory classes are not held here.</p>

                <h3>3. Information Building</h3>
                <p>The main computer labs are concentrated here; computer fundamentals and software practice courses are held here.</p>

                <h2>II. South Courtyard Teaching Buildings</h2>
                <p>The South Courtyard has more teaching buildings and is the main area for science departments, including regular teaching buildings, arts-only buildings, and the Jingbo Building.</p>

                <h3>1. Buildings 2, 3, 4, and 5 (Regular Teaching Buildings)</h3>
                <p>Mainly used for science courses (Building 3 has microteaching classrooms for teacher-training students). Room numbers follow the pattern building number + floor + room, e.g. <strong>3101</strong> means Room 1 on the first floor of Building 3.</p>

                <h3>2. Building 6</h3>
                <p>The entire building consists of combined-class lecture halls used for large public courses and multi-class lectures. Rooms are named "Combined Classroom (number)," e.g. <strong>Combined Classroom (9)</strong>.</p>
                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/nanyuan-building6-staircase.jpg" alt="South Courtyard Building 6 lecture hall distribution" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">South Courtyard Building 6 lecture hall distribution</figcaption>
                </figure>

                <h3>3. Music Building</h3>
                <p>Dedicated to music majors, with practice rooms and rehearsal halls; non-arts majors generally have no classes here.</p>

                <h3>4. Fine Arts Building</h3>
                <p>Exclusive to the Fine Arts College, with professional studios and exhibition halls; only art-related courses are held here.</p>

                <h3>5. Jingbo Building</h3>
                <p>Contains computer labs, a teacher-skills training center, and a counseling room; the Putonghua (Mandarin) proficiency test is held here. Room numbers use the building name plus room number, e.g. <strong>Jingbo 302</strong>.</p>

                <h2>III. General Classroom-Finding Tips</h2>
                <ol>
                    <li><strong>Quickly tell north from south:</strong> Room numbers containing "Wen" belong to the Humanities Complex in the North Courtyard; pure numbers, "Combined Classroom," or "Jingbo" are all in the South Courtyard.</li>
                    <li><strong>Leave early for upper floors:</strong> Except for the Humanities Complex in the North Courtyard, other teaching buildings have no elevators, so leave early for higher-floor classrooms.</li>
                    <li><strong>Empty classrooms for self-study:</strong> Unoccupied classrooms are open for self-study. Main corridors are crowded between classes, so travel off-peak when possible.</li>
                    <li><strong>Scope:</strong> This guide covers Daxuedao Campus only; a separate guide for Xueyuan Road Campus buildings will be published later.</li>
                </ol>

                <p>TSNU Bar Mod Team<br>July 24, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ new-student group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ new-student group</figcaption>
                </figure>
            ', 1791732251480, 1791732251480);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-12', 'zh', '新生指南（七）-大学道校区如何找教室', '2026-07-24', '指南', '唐山师范学院吧务组', '唐山师范学院大学道校区教学楼宇与找课攻略：区分南北院主要教学楼、介绍各楼栋功能与对应专业、教室编号规则及通用找课技巧，帮助新生入学后快速定位课表教室，避免上课迷路。', '', '                <p>入学后第一次上课，最怕的就是按着课表上的教室编号却找不到楼。大学道校区南北院教学楼分布差异大，不同院系的课程集中在不同区域，教室编号规则也不尽相同。本篇把南北院主要教学楼宇、编号规则和找课技巧整理清楚，开学后随时翻阅，避免上课迷路迟到。</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">文章中所有图片均可以通过长按或右键的方式预览或保存。</p>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-campus-map.jpg" alt="大学道校区南北院教学楼整体分布地图" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">大学道校区南北院教学楼整体分布地图</figcaption>
                </figure>

                <h2>一、北院教学楼宇介绍</h2>
                <p>北院共有三栋教学楼宇，文科专业课程大多安排在此区域。</p>

                <h3>1. 文科综合楼（北院主楼）</h3>
                <p>文科各院系核心授课场地，楼栋左右两侧配套阶梯教室。整栋楼教室编号统一以“文”开头，常规教室举例：<strong>文211</strong>；阶梯教室举例：<strong>文8阶梯</strong>。</p>
                <p>楼栋配备电梯，但上下课高峰时段等候人群较多，容易排队。建议前往高层教室的同学提前出发，优先选择楼梯通行，避免等梯迟到。</p>
                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/beiyuan-wenke-staircase-floorplan.jpg" alt="北院文科综合楼阶梯教室楼层平面分布图" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">北院文科综合楼阶梯教室楼层平面分布图</figcaption>
                </figure>

                <h3>2. 实验楼</h3>
                <p>存放各类实验器材，理化类实操课程专属场地，不安排常规理论课。</p>

                <h3>3. 信息楼</h3>
                <p>校内主要机房集中于此，计算机基础、软件实操等上机课程统一在此授课。</p>

                <h2>二、南院教学楼宇介绍</h2>
                <p>南院教学楼数量更多，理科院系课程集中分布，包含通用教学楼、艺术类专属楼栋以及晶博楼。</p>

                <h3>1. 2、3、4、5号常规教学楼</h3>
                <p>主要开设理科课程（3号楼有师范生训练用的微格教室）。教室命名规则为楼号+楼层+房间号，示例：<strong>3101</strong>代表3号教学楼一层1号教室。</p>

                <h3>2. 6号教学楼</h3>
                <p>整栋楼全部为合班阶梯教室，用于大型公开课、多班级合堂授课。教室统一命名为合班教室（数字），示例：<strong>合班教室（9）</strong>。</p>
                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/nanyuan-building6-staircase.jpg" alt="南院6号楼阶梯教室分布图" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">南院6号楼阶梯教室分布图</figcaption>
                </figure>

                <h3>3. 音乐楼</h3>
                <p>音乐专业专用楼宇，内设琴房、排练厅，非艺术类专业基本无课程安排。</p>

                <h3>4. 美术楼</h3>
                <p>美术学院专属场地，配有专业画室、作品展厅，仅开设美术相关课程。</p>

                <h3>5. 晶博楼</h3>
                <p>楼内设有机房、教师技能实训中心、心理咨询室，普通话考试固定在此开展。教室命名格式为楼栋名称+房间号，示例：<strong>晶博楼302</strong>。</p>

                <h2>三、通用找课小贴士</h2>
                <ol>
                    <li><strong>快速分辨南北院：</strong>课表教室编号带“文”字的属于北院文科综合楼；纯数字编号、合班教室、晶博楼标识均归南院。</li>
                    <li><strong>高层早出发：</strong>除北院文科综合楼外，其余教学楼均无电梯，高层教室建议提早出行。</li>
                    <li><strong>空教室自习：</strong>无课程占用的空教室可自由进入自习，上下课主干道人流量大，尽量错峰通行。</li>
                    <li><strong>适用范围：</strong>本文仅覆盖大学道校区，学院路校区楼宇相关内容将单独推出攻略。</li>
                </ol>

                <p>唐山师范学院吧务组<br>2026年7月24日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251480, 1791732251480);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-13-en', 'en', 'Freshman Guide (8): Public Bathhouses and Campus Card', '2026-07-26', 'Guide', 'TSNU Bar Mod Team', 'A guide to public bathhouses and Campus Card use at Tangshan Normal University: locations and shower rules, pricing, and the full Campus Card recharge, loss reporting, and replacement process.', '', '                <p>Military training is physically intense and you will sweat a lot every day. Showering and using the Campus Card are two of the first practical problems Freshmen run into. This guide brings together the locations of all campus bathhouses, shower rules, and the full process for recharging, reporting the loss of, and replacing your Campus Card so you can avoid unnecessary trips.</p>

                <h2>I. Bathhouse Locations and Basic Information</h2>
                <p>All three campuses use the same shower pricing, and the equipment only accepts a physical Campus Card for payment. Mobile campus QR codes cannot be used for showering.</p>

                <h3>1. Daxuedao Campus</h3>
                <p><strong>North Courtyard Public Bathhouse</strong>: Located on the east side of the North Courtyard cafeteria, currently open. It is closer to North Courtyard dormitories; students from the South Courtyard should plan the walk in advance.</p>
                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-beiyuan-bathroom-map.jpg" alt="North Courtyard public bathhouse location map" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">North Courtyard public bathhouse location map</figcaption>
                </figure>

                <p><strong>South Courtyard Public Bathhouse</strong>: Located on the south side of the first cafeteria in the South Courtyard, near the Shiyuan Life Hall. It is currently under renovation and is expected to open in September when the semester starts. At the beginning of the semester, South Courtyard Freshmen should use the North Courtyard bathhouse.</p>
                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-nanyuan-bathroom-map.jpg" alt="South Courtyard public bathhouse location map" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">South Courtyard public bathhouse location map</figcaption>
                </figure>

                <h3>2. Xueyuan Road Campus</h3>
                <p>The public bathhouse is located on the east side of the Sports and Culture Hall, with the same pricing as Daxuedao Campus.</p>

                <h3>3. Shower Pricing</h3>
                <div class="overflow-x-auto my-4">
                    <table class="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border border-gray-300 px-3 py-2 text-left">Item</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">Target Group</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">Unit</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">Rate</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">Payment Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="border border-gray-300 px-3 py-2">Student Bathhouse</td>
                                <td class="border border-gray-300 px-3 py-2">Faculty and Students</td>
                                <td class="border border-gray-300 px-3 py-2">Yuan/minute</td>
                                <td class="border border-gray-300 px-3 py-2">0.12</td>
                                <td class="border border-gray-300 px-3 py-2">Campus Card</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="text-xs text-gray-500">Source: Shower Hot Water Pricing Public Notice (School Fee Verification [2025] No. 1)</p>

                <h2>II. Basic Shower Rules</h2>
                <h3>1. Required Credential: Physical Campus Card</h3>
                <p>The physical student card with your photo and student number is your credential for dorm access, cafeteria purchases, and the only way to start a shower. The showerhead only starts when the physical card is inserted. Mobile “Perfect Campus” QR codes cannot be used for showering; without the physical card you cannot shower.</p>

                <h3>2. Billing</h3>
                <p>All bathhouses charge by actual water usage time at a uniform rate of <strong>0.12 yuan/minute</strong>. Insert the card to start water and billing; remove the card to stop.</p>

                <h3>3. Facilities</h3>
                <p>Bathhouses provide public hair dryers; shower stalls have individual spray heads; lockers do not have built-in locks. Bring a small padlock for your phone, keys, and other valuables.</p>

                <h2>III. Practical Shower Tips During Military Training</h2>
                <ol>
                    <li><strong>Avoid peak times:</strong> Right after training ends is the busiest time, with crowds and unstable water pressure. Consider going earlier or later.</li>
                    <li><strong>Watch your step:</strong> Floors are constantly wet. Walk slowly to avoid slipping.</li>
                    <li><strong>Dry your hair before leaving:</strong> Day-night temperature differences are large in late summer and fall; dry your hair completely before going outside. Hair dryers may have long lines, so a quick-dry hair towel is recommended.</li>
                    <li><strong>Be considerate:</strong> Take your trash with you, do not occupy a shower stall or hair dryer for a long time, and queue politely.</li>
                </ol>

                <h3>What to Bring</h3>
                <ul>
                    <li><strong>Essentials:</strong> shampoo, body wash, towel, non-slip slippers, a complete change of clothes, waterproof toiletry bag, Campus Card</li>
                    <li><strong>Recommended:</strong> quick-dry hair towel, small padlock</li>
                </ul>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Note:</strong> do not bring large amounts of cash into the bathhouse</p>

                <h2>IV. Complete Campus Card Guide</h2>
                <h3>(1) Basic Campus Card Functions</h3>
                <p>The physical Campus Card is the core credential for daily life on campus. It covers showering, cafeteria and store purchases, school gate/library access, and dorm entry. The “Perfect Campus” app can only check balances, view transaction records, and scan QR codes for cafeteria/store purchases. It <strong>cannot recharge the card or be used for showering</strong>. Please keep the difference clear.</p>

                <h3>(2) Only Online Recharge Channel: ICBC Mobile App</h3>
                <p>“Perfect Campus” cannot recharge the Campus Card. Recharges must be made through the ICBC mobile app as follows:</p>
                <ol>
                    <li>Log in to the ICBC mobile app.</li>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/icbc-login.jpg" alt="ICBC app login screen" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">ICBC app login screen</figcaption>
                </figure>
                    <li>Tap “Life” at the bottom and switch the location to Tangshan.</li>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/icbc-life.jpg" alt="ICBC app Life tab, location set to Tangshan" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">ICBC app Life tab, location set to Tangshan</figcaption>
                </figure>
                    <li>Enter “Mini Apps” in the top search box, then select “Campus Card”.</li>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/icbc-microapp.jpg" alt="ICBC app Mini Apps, select Campus Card" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">ICBC app Mini Apps, select Campus Card</figcaption>
                </figure>
                    <li>Select Tangshan as the region and “Tangshan Normal University” as the billing unit. Enter your student number, check “Set as frequently used account”, and tap Next.</li>
                    <li>Choose a recharge amount (50/100/200/300/500/1000 yuan, or a custom amount) and complete payment.</li>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/icbc-amount.jpg" alt="ICBC app Campus Card recharge amount" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">ICBC app Campus Card recharge amount</figcaption>
                </figure>
                </ol>
                <div class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
                    <p class="mb-2"><strong>Important reminders:</strong></p>
                    <ul class="list-disc ml-5 mb-0">
                        <li>Recharge is unavailable from 23:00 to 01:00 due to system reconciliation.</li>
                        <li>Online recharge only updates the online account balance. You must tap the physical card on a shower reader, cafeteria POS machine, or use a transfer machine to sync the balance to the card. Otherwise the shower reader may show insufficient balance.</li>
                    </ul>
                </div>

                <h3>(3) “Perfect Campus” App Functions</h3>
                <p>After downloading and logging in, select “Tangshan Normal University” as your school and tap “Bind Campus Card” on the home page.</p>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/perfectcampus-bind.jpg" alt="Perfect Campus app bind Campus Card page" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Perfect Campus app bind Campus Card page</figcaption>
                </figure><p>Enter your name and student number; the default password is the last six digits of your ID number (replace a trailing “X” with “0”).</p>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/perfectcampus-info.jpg" alt="Perfect Campus app enter info to bind" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Perfect Campus app enter info to bind</figcaption>
                </figure>
                <p>After binding you can: check card balance, view transaction records, report the card lost online, change the payment password, and enable the campus QR code for cafeteria/store scanning.</p>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/perfectcampus-functions.jpg" alt="Perfect Campus app available functions page" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Perfect Campus app available functions page</figcaption>
                </figure>
                <p>The campus QR code activation page looks like this:</p>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/perfectcampus-code.jpg" alt="Perfect Campus app enable campus QR code page" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Perfect Campus app enable campus QR code page</figcaption>
                </figure><p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Limitations:</strong> You cannot recharge the Campus Card, and the campus QR code cannot be used in the bathhouse. Showering requires a physical card.</p>

                <h3>(4) Lost Card, Replacement, Reporting Loss, and Password Reset</h3>
                <p><strong>1. Self-service card replacement (recommended)</strong></p>
                <ul>
                    <li>Daxuedao Campus: self-service card machine at the south door on the first floor of the first cafeteria</li>
                    <li>Xueyuan Road Campus: self-service card machine at the south door of the cafeteria</li>
                </ul>
                <p>Process: enter student number and Campus Card password (default is the last 6 digits of your ID number; replace a trailing “X” with “0”) → place your second-generation ID card for verification → read the replacement notes → pay the 10-yuan replacement cost (automatically deducted from card balance; if balance is insufficient, recharge via the ICBC app first so the balance is at least 10 yuan) → complete replacement and card printing. The machine will automatically check for any unclaimed funds.</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Important:</strong> you must bring your second-generation ID card for self-service replacement.</p>

                <p><strong>2. Fund claim service</strong></p>
                <p>After reporting the card lost and replacing it, you must wait 24 hours from the time of loss before claiming funds. Place the card first, tap “Fund Claim Service”, and the machine will detect the card, show the claim screen, and display claimable amounts. Tap claim and collect each item until finished.</p>

                <p><strong>3. Self-service loss reporting</strong></p>
                <p>Tap “Report Loss”, enter your student number and Campus Card consumption password. The system will verify the information. If verification succeeds, loss reporting succeeds; otherwise the machine will show the corresponding result.</p>

                <p><strong>4. Change or reset password</strong></p>
                <p><strong>Change password:</strong> place the card on the reader, tap “Change Password”, enter the old and new passwords, and confirm. The system verifies the passwords and prompts success.</p>
                <p><strong>Reset password:</strong> if you forget the old password, you can directly enter a new password, tap “Reset”, and place your second-generation ID card for verification. After verification the password is reset.</p>

                <p><strong>5. Manual replacement (when self-service machine is out of cards or broken)</strong></p>
                <p>If the self-service machine is out of cards or malfunctioning, go to the Campus Card Service Center on the first floor of the North Courtyard main building during weekday working hours for manual replacement.</p>

                <h3>Contact Numbers</h3>
                <ul>
                    <li>Daxuedao Campus Card Center: 0315-3863030</li>
                    <li>Xueyuan Road Campus Card Center: 0315-2210423</li>
                    <li>Campus Card Equipment Service: 4000099095</li>
                </ul>

                <h2>V. Additional Important Reminders</h2>
                <ul>
                    <li>Self-service card machines only handle replacement, fund claim, loss reporting, and password change/reset. For transfer/recharge services, use a dedicated transfer machine.</li>
                    <li>Bathhouse opening hours are subject to posted notices on site; check the schedule before going.</li>
                    <li>Showering requirement: a physical Campus Card must be inserted; mobile QR codes are invalid. Do not forget your card after training.</li>
                    <li>After recharging, remember to tap the card on a reader to sync the balance, so you do not end up with a successful recharge but “insufficient balance” at the shower.</li>
                    <li>Return public hair dryers after use and do not take them away. Help keep bathhouse facilities in good condition.</li>
                    <li>Take good care of your physical Campus Card. Losing it will directly affect showering, access control, and dining.</li>
                </ul>

                <p>TSNU Bar Mod Team<br>July 26, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ new-student group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ new-student group</figcaption>
                </figure>
            ', 1791732251480, 1791732251480);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-13', 'zh', '新生指南（八）-公共浴室和校园一卡通', '2026-07-26', '指南', '唐山师范学院吧务组', '唐山师范学院新生指南第八篇：公共浴室位置与校园一卡通使用全攻略，涵盖洗浴规则、收费标准、一卡通充值/挂失/补办流程及军训洗浴注意事项。', '', '                <p>军训训练强度大，日常出汗多，洗澡和校园卡使用是新生最先遇到的实际问题。本篇把全校公共浴室位置、洗浴规则、校园一卡通充值、挂失与补办流程一次整理清楚，帮助大家少跑弯路。</p>

                <h2>一、全校浴室位置与基本情况</h2>
                <p>目前三个校区浴室收费标准完全一致，洗浴设备仅支持实体校园一卡通插卡计费，手机校园码无法用于洗浴。</p>

                <h3>1. 大学道校区</h3>
                <p><strong>北院公共浴室</strong>：位于北院食堂东侧，目前正常开放。北院宿舍距离较近，南院同学洗浴需提前规划路程。</p>
                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-beiyuan-bathroom-map.jpg" alt="大学道校区北院公共浴室位置示意图" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">大学道校区北院公共浴室位置示意图</figcaption>
                </figure>

                <p><strong>南院公共浴室</strong>：位于南院一食堂南侧（师院生活馆附近）。现阶段处于装修施工阶段，预计 9 月开学正式投入使用；开学初期南院新生优先前往北院浴室洗浴。</p>
                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-nanyuan-bathroom-map.jpg" alt="大学道校区南院公共浴室位置示意图" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">大学道校区南院公共浴室位置示意图</figcaption>
                </figure>

                <h3>2. 学院路校区</h3>
                <p>公共浴室位于文体馆东侧，收费标准与大学道校区一致。</p>

                <h3>3. 洗浴收费标准</h3>
                <div class="overflow-x-auto my-4">
                    <table class="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border border-gray-300 px-3 py-2 text-left">收费项目</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">收费类别</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">计量单位</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">收费标准</th>
                                <th class="border border-gray-300 px-3 py-2 text-left">收费方式</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="border border-gray-300 px-3 py-2">学生浴室</td>
                                <td class="border border-gray-300 px-3 py-2">校内师生</td>
                                <td class="border border-gray-300 px-3 py-2">元/分钟</td>
                                <td class="border border-gray-300 px-3 py-2">0.12</td>
                                <td class="border border-gray-300 px-3 py-2">校园一卡通</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="text-xs text-gray-500">来源：洗浴热水定价项目公示（校收费核〔2025〕1号）</p>

                <h2>二、洗浴基础规则</h2>
                <h3>1. 唯一凭证：实体校园一卡通</h3>
                <p>印有本人照片、学号的实体校园卡，既是门禁、食堂消费的凭证，也是洗浴的唯一启动方式。淋浴器只能插实体卡启动，手机“完美校园”校园码不能用于洗澡，无实体卡无法洗浴。</p>

                <h3>2. 计费说明</h3>
                <p>所有浴室统一按用水时长实时扣费，标准为 <strong>0.12 元/分钟</strong>。插卡即出水并开始计费，取卡即停水。</p>

                <h3>3. 浴室配套设施</h3>
                <p>浴室内配备公共吹风机；淋浴隔间为独立喷头；储物柜无自带锁，建议自备小锁存放手机、钥匙等贵重物品。</p>

                <h2>三、军训洗浴实用小贴士</h2>
                <ol>
                    <li><strong>错峰洗澡：</strong>军训结束后是洗浴高峰，人流量大、水压不稳，可适当延后或提前前往。</li>
                    <li><strong>地面防滑：</strong>浴室常年潮湿，行走慢行，避免滑倒受伤。</li>
                    <li><strong>头发吹干防感冒：</strong>夏秋昼夜温差大，洗完务必吹干头发再离开；高峰期吹风机排队紧张，建议自备干发帽快速吸干水分。</li>
                    <li><strong>文明洗浴：</strong>垃圾自行带走，不长期占用淋浴位和吹风机，有序排队、互相礼让。</li>
                </ol>

                <h3>物品准备清单</h3>
                <ul>
                    <li><strong>必备：</strong>洗发水、沐浴露、毛巾、防滑拖鞋、全套换洗衣物、防水洗漱收纳袋、校园一卡通</li>
                    <li><strong>推荐：</strong>干发帽、小挂锁</li>
                </ul>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>提醒：</strong>不要携带大量现金进入浴室</p>

                <h2>四、校园一卡通完整使用指南</h2>
                <h3>（一）一卡通基础功能</h3>
                <p>实体校园卡是在校生活的核心凭证，覆盖浴室插卡洗浴、食堂/超市刷卡消费、校门/图书馆门禁、宿舍通行等线下刷卡场景。“完美校园”APP 仅能查询余额、查看消费明细、扫码在食堂/超市消费，<strong>不能充值、不能洗澡</strong>，请务必分清功能区别。</p>

                <h3>（二）唯一线上充值渠道：工商银行 APP</h3>
                <p>“完美校园”APP 没有充值校园卡功能，充值只能通过工商银行手机银行完成，操作步骤如下：</p>
                <ol>
                    <li>登录工商银行 APP。</li>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/icbc-login.jpg" alt="工商银行 APP 登录界面" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">工商银行 APP 登录界面</figcaption>
                </figure>
                    <li>底部点击「生活」，将定位切换至唐山。</li>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/icbc-life.jpg" alt="工商银行 APP “生活”定位唐山" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">工商银行 APP “生活”定位至唐山</figcaption>
                </figure>
                    <li>顶部搜索框输入「微应用」，进入后选择「一卡通」。</li>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/icbc-microapp.jpg" alt="工商银行 APP 搜索“微应用”进入一卡通" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">工商银行 APP 搜索“微应用”进入一卡通</figcaption>
                </figure>
                    <li>地区选择唐山，收费单位勾选「唐山师范学院」；学生填写学号，勾选“设置为常用账户”，点击下一步。</li>
                    <li>选择充值金额（50/100/200/300/500/1000 元，也可自定义金额），完成支付。</li>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/icbc-amount.jpg" alt="工商银行 APP 一卡通充值金额选择" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">工商银行 APP 一卡通充值金额选择</figcaption>
                </figure>
                </ol>
                <div class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
                    <p class="mb-2"><strong>重要提醒：</strong></p>
                    <ul class="list-disc ml-5 mb-0">
                        <li>晚间 23:00—次日凌晨 1:00 为系统对账时间，无法充值。</li>
                        <li>线上充值仅同步线上账户余额，实体卡需要在浴室淋浴器、食堂刷卡机贴卡，或到圈存机办理“领款”，卡内余额才会更新。否则洗澡时会提示余额不足。</li>
                    </ul>
                </div>

                <h3>（三）“完美校园”APP 可用功能</h3>
                <p>下载登录后，院校选择「唐山师范学院」，首页点击「绑定校园卡」。</p>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/perfectcampus-bind.jpg" alt="完美校园 APP 绑定校园卡页面" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">完美校园 APP 绑定校园卡页面</figcaption>
                </figure>
                <p>填写姓名、学号，密码默认身份证后六位（末尾 “X” 替换为 “0”），完成绑定。</p>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/perfectcampus-info.jpg" alt="完美校园 APP 填写信息绑定" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">完美校园 APP 填写信息完成绑定</figcaption>
                </figure>
                <p>绑定后可用功能：查看卡余额、查询消费明细、线上挂失卡片、修改支付密码、开通校园码扫码在食堂/超市消费。</p>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/perfectcampus-functions.jpg" alt="完美校园 APP 可用功能页面" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">完美校园 APP 可用功能页面</figcaption>
                </figure>
                <p>开通校园码的操作页面示意如下：</p>
                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/perfectcampus-code.jpg" alt="完美校园 APP 开通校园码操作页面" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">完美校园 APP 开通校园码操作页面</figcaption>
                </figure><p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>限制功能：</strong>无法给校园卡充值；校园码不能在浴室使用，洗澡必须携带实体卡插卡。</p>

                <h3>（四）一卡通丢失、补办、挂失、密码修改流程</h3>
                <p><strong>1. 自助补卡（优先推荐）</strong></p>
                <ul>
                    <li>大学道校区：一食堂一层内南门自助补卡机</li>
                    <li>学院路校区：食堂南门自助补卡机</li>
                </ul>
                <p>操作流程：输入学号和校园卡密码（默认为身份证号后 6 位，末尾 “X” 用 “0” 代替）→ 放置二代身份证完成验证 → 阅读补卡注意事项 → 缴纳补卡成本 10 元（自动从卡余额扣除；如余额不足，请提前通过工行 APP 充值，保证余额 ≥ 10 元）→ 完成补卡并打印新卡。补卡完成后机器会自动检测可领款项。</p>
                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>重要提示：</strong>办理自助补卡必须携带二代身份证。</p>

                <p><strong>2. 领款服务</strong></p>
                <p>校园卡挂失补办后，卡余额需 24 小时后才能领款（自挂失时间起算）。领款服务必须首先放卡，点击“领款服务”，检测到卡片后进入领款查询界面并显示可领款项；点击领款后逐条领取未领款项，直至结束。</p>

                <p><strong>3. 自助挂失</strong></p>
                <p>点击“自助挂失”，输入学号和校园卡消费密码；系统验证信息，验证成功提示挂失成功，验证失败会反馈对应结果。</p>

                <p><strong>4. 修改、重置密码</strong></p>
                <p><strong>修改密码：</strong>将学生卡放在读卡区，点击“修改密码”，输入原密码和新密码，点击确认。系统验证通过后提示修改成功。</p>
                <p><strong>重置密码：</strong>如忘记原密码，可直接输入新密码，点击“重置”按钮并放置二代身份证验证，验证通过后密码即重置成功。</p>

                <p><strong>5. 人工补卡（自助机故障 / 缺卡时使用）</strong></p>
                <p>自助补卡机缺卡或设备故障无法使用时，可在工作日工作时间前往北院主楼 1 层财务处校园卡服务中心人工办理补卡。</p>

                <h3>联系电话</h3>
                <ul>
                    <li>大学道校区卡务中心：0315-3863030</li>
                    <li>学院路校区卡务中心：0315-2210423</li>
                    <li>校园卡设备服务电话：4000099095</li>
                </ul>

                <h2>五、补充重要提醒</h2>
                <ul>
                    <li>自助补卡机仅限办理补卡、领款、自助挂失、修改（重置）密码业务；如需圈存充值，请移步圈存机处办理。</li>
                    <li>各浴室开放时间以现场张贴通知为准，出行前留意时段。</li>
                    <li>洗浴硬性要求：必须携带实体校园一卡通插卡使用，手机校园码无效，军训结束后也别忘带卡。</li>
                    <li>充值后记得贴卡同步余额，避免出现“充值成功但洗澡刷卡无余额”的情况。</li>
                    <li>公共吹风机用完及时归位，不私自带走，共同维护浴室公共设施。</li>
                    <li>妥善保管实体一卡通，丢失会直接影响洗浴、门禁、就餐等全场景使用。</li>
                </ul>

                <p>唐山师范学院吧务组<br>2026年7月26日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251480, 1791732251480);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-14-en', 'en', 'Freshman Guide (9): Reporting Day', '2026-07-31', 'Guide', 'TSNU Bar Mod Team', 'The ninth part of the Tangshan Normal University Freshman Guide: a step-by-step walkthrough for reporting day, covering required documents, packing tips, check-in procedures, dorm move-in, plus North and South campus maps and on-site photos.', '', '<p>Your first day on campus is often the most hectic — unfamiliar surroundings, unclear procedures, and a lot of walking back and forth. To help you check in smoothly, we''ve put together this practical, TSNU-specific guide covering what to bring, how to get to your dorm, and what to watch out for. Just follow the steps below.</p>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/reporting-day-gate-aerial.jpg" alt="Aerial view of the North Campus main gate on reporting day" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Aerial view of the North Campus main gate during the 2025 welcome season</figcaption>
                </figure>

                <h2>I. Required Documents</h2>
                <p>Keep all of the following in one document pouch and carry it with you so you can hand it over whenever needed:</p>
                <ol>
                    <li><strong>ID card</strong> and a photocopy;</li>
                    <li>Original <strong>college entrance exam admission ticket</strong>;</li>
                    <li>Original <strong>TSNU admission letter</strong>;</li>
                    <li>Several recent bareheaded <strong>one-inch and two-inch color photos</strong> (red, blue, or white backgrounds are all acceptable; keep digital copies as well);</li>
                    <li><strong>Party or Youth League membership transfer</strong> documents (League members should bring their membership card and transfer letter);</li>
                    <li><strong>Personal academic record</strong> (if you are carrying it yourself, do not open the sealed envelope ahead of time);</li>
                    <li>Students who have applied for <strong>student loans</strong> should bring the relevant loan documents.</li>
                </ol>

                <h2>II. Packing Tips</h2>
                <p>You don''t need to bring everything at once. Bulky daily necessities can be bought after arrival, and shops near campus are convenient. One special reminder: <strong>there is no need to bring an entire case of bottled water</strong> — each dormitory floor has a public water dispenser, so just bring a water bottle. Reporting day is already tiring enough; lugging a case of water is unnecessary.</p>

                <h2>III. Complete Check-in Process</h2>
                <p>Before the semester starts, your college will arrange volunteers to contact you with arrangements. Please keep your phone available. On reporting day, the campus gate is open during the daytime; you may enter on your own or follow volunteer guides.</p>

                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Safety reminder:</strong> Reporting day brings a mixed crowd, so stay alert. Watch out for off-campus solicitors, scammers, and thieves. Do not trust anyone who knocks on your door to sell things — no matter how urgent or attractive it sounds (especially haircut cards, cheap pens, paid English corners, or paid English clubs).</p>

                <h3>Helpful Tips</h3>
                <ul>
                    <li>Traffic around campus is heavy on reporting day; public transportation is recommended.</li>
                    <li>If you or your family arrive early, plan accommodation and meals in advance by checking nearby transport, hotels, and shops.</li>
                </ul>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-north-campus-map.png" alt="Hand-drawn map of the North Campus with walking times" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">North Campus map with key locations and approximate walking times</figcaption>
                </figure>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-south-campus-map.png" alt="Hand-drawn map of the South Campus with walking times" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">South Campus map with key locations and approximate walking times</figcaption>
                </figure>

                <h3>Step-by-Step</h3>

                <p><strong>1. College Welcome Tent</strong></p>
                <p>After entering campus, find your college''s welcome tent, register, and collect your Campus Card. The card is activated automatically upon arrival. If you need a campus phone plan, you can inquire at the service counter in Canteen No. 1.</p>

                <figure class="text-center my-6 md:max-w-lg mx-auto">
                    <img src="../assets/images/welcome-tent-physics.jpg" alt="College welcome tent on reporting day" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">A typical college welcome tent — your first stop after entering campus</figcaption>
                </figure>

                <p><strong>2. Confirm Your Dormitory</strong></p>
                <p>During check-in, confirm your dormitory building and room number. Then go to the dorm management office with your documents to collect your room key.</p>

                <p><strong>3. Move In</strong></p>
                <p>Once inside your room, check the bed, windows, doors, and utilities right away. If anything is damaged, fill out a repair form at the management office; maintenance will handle it as soon as possible.</p>

                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">After completing these steps, you are all set to settle into your dormitory.</p>

                <h2>IV. Day-of Recommendations</h2>
                <h3>Join Group Chats Promptly</h3>
                <p>Class groups, dorm groups, and college announcement groups are essential. Military training schedules, class meetings, course selection, and other important notices will be posted there.</p>

                <h3>Get to Know the Area</h3>
                <p>Learn the dormitory entry rules and locate the nearest canteen, supermarket, and bathhouse early. Daily life will be much smoother once you have your bearings.</p>

                <figure class="text-center my-6 md:max-w-lg mx-auto">
                    <img src="../assets/images/canteen-shitaikang.jpg" alt="Interior of the campus canteen" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Campus canteen interior — a good place for your first meal after check-in</figcaption>
                </figure>

                <h3>Beware of Door-to-Door Sales</h3>
                <p>Reporting season sees a spike in door-to-door selling in dormitories. Do not buy anything from strangers; if you really need something, purchase it from a regular shop.</p>

                <h2>V. Parents on Campus</h2>
                <p>Parents are allowed to accompany you and help carry luggage. Vehicles must park as directed and <strong>cannot drive up to dormitory buildings</strong>. Once you are settled, we suggest parents leave early so you can start adapting, meet your roommates, and make room for other families.</p>

                <h2>Quick Summary</h2>
                <p><strong>Enter campus → Register at college tent and collect Campus Card → Collect dorm key at management office → Move in and inspect your room → Done</strong></p>

                <p>TSNU Bar Mod Team<br>July 31, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ welcome group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ welcome group</figcaption>
                </figure>
            ', 1791732251481, 1791732251481);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-14', 'zh', '新生指南（九）-报到当天', '2026-07-31', '指南', '唐山师范学院吧务组', '唐山师范学院新生指南第九篇：报到当天全流程攻略，从必备材料、行李建议到入校报到、入住宿舍，附南北院校区地图与现场照片，帮你从容完成开学第一步。', '', '<p>踏入校园的第一天，往往是新生最手忙脚乱的时候——环境陌生、流程不熟，容易跑冤枉路。为了让你报到更顺心、省力，我们整理了这份贴合本校实际的报到全流程和注意事项，照着走就行。</p>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/reporting-day-gate-aerial.jpg" alt="大学道校区北院正门迎新场景航拍" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">大学道校区北院正门迎新场景航拍</figcaption>
                </figure>

                <h2>一、报到必备材料</h2>
                <p>建议把下列材料全部装进一个文件袋，随身携带，报到时随时取用：</p>
                <ol>
                    <li><strong>身份证</strong>原件及复印件；</li>
                    <li><strong>高考准考证</strong>原件；</li>
                    <li>《<strong>唐山师范学院录取通知书</strong>》原件；</li>
                    <li>近期免冠<strong>一寸、二寸彩色照片</strong>数张（底色以红、蓝、白为主，建议留存好电子版）；</li>
                    <li><strong>党团组织关系</strong>证明材料（团员需带团员证、团组织关系介绍信等）；</li>
                    <li><strong>个人档案</strong>（自带档案的同学切勿提前拆封）；</li>
                    <li>已办理<strong>生源地助学贷款</strong>的同学，需携带相关贷款证明材料。</li>
                </ol>

                <h2>二、行李建议</h2>
                <p>生活用品不必一次性带齐，大件物品可到校后再慢慢添置，学校周边购买也很方便。特别提醒：<strong>无需自带整箱矿泉水</strong>——宿舍楼每层都配有公共饮水机，自备水杯即可。报到当天本就奔波，扛着一箱水既累赘又没必要。</p>

                <h2>三、完整报到流程</h2>
                <p>开学前，学院会安排志愿者提前联系你，同步相关安排，请保持手机畅通。报到当天，校门白天不设严格门禁，你可自行入校，也可跟随志愿者指引行进。</p>

                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>安全提醒：</strong>报到期间人员混杂，务必提高警惕，防范校外社会人员混入实施推销、诈骗、盗窃。凡上门推销者，无论说得多么紧急或诱人（尤其是理发卡、廉价笔、付费英语角/英语社团等），一概不要轻信。</p>

                <h3>温馨提示</h3>
                <ul>
                    <li>报到当天校园周边交通压力较大，建议尽量选择公共交通工具出行。</li>
                    <li>如需提前到校或家长陪同，请提前了解学校周边交通、住宿及生活配套，做好食宿安排。</li>
                </ul>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-north-campus-map.png" alt="大学道校区北院手绘地图及主要地点步行时间" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">大学道校区北院主要地点与步行时间参考</figcaption>
                </figure>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/daxuedao-south-campus-map.png" alt="大学道校区南院手绘地图及主要地点步行时间" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">大学道校区南院主要地点与步行时间参考</figcaption>
                </figure>

                <h3>具体步骤</h3>

                <p><strong>1. 学院帐篷报到</strong></p>
                <p>进入校园后，先找到自己所属学院的迎新帐篷，登记信息，领取校园一卡通。校园一卡通入校即自动激活；如需办理校园电话卡，可前往一食堂营业厅咨询办理。</p>

                <figure class="text-center my-6 md:max-w-lg mx-auto">
                    <img src="../assets/images/welcome-tent-physics.jpg" alt="物理科学与技术学院迎新工作站帐篷" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">往年学院迎新工作站帐篷，报到第一站</figcaption>
                </figure>

                <p><strong>2. 确认宿舍信息</strong></p>
                <p>报到时确认自己的宿舍楼栋和房间号，然后前往宿舍楼宿管室，凭相关证件领取宿舍钥匙。</p>

                <p><strong>3. 入住宿舍</strong></p>
                <p>进入宿舍放置行李后，第一时间检查床铺、门窗、水电设施是否完好。如发现设施损坏，直接到宿管室填写报修表格，学校会尽快安排维修。</p>

                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">完成以上流程后，你就可以直接入住宿舍，安顿下来了。</p>

                <h2>四、报到当天建议</h2>
                <h3>尽快加入各类通知群</h3>
                <p>班级群、宿舍群、学院通知群都要及时加入，后续军训安排、班会、选课等重要信息都会在群里发布。</p>

                <h3>抽空熟悉周边环境</h3>
                <p>提前了解宿舍楼门禁规则，认准附近食堂、超市、浴室的具体位置，日常生活会更顺畅。</p>

                <figure class="text-center my-6 md:max-w-lg mx-auto">
                    <img src="../assets/images/canteen-shitaikang.jpg" alt="大学道校区食堂内部环境" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">大学道校区食堂内部环境，报到后第一餐可以在这里解决</figcaption>
                </figure>

                <h3>警惕上门推销</h3>
                <p>报到季是推销高发期，宿舍楼内可能有人上门推销各类产品。一律不要轻易消费，确有需要请到正规商店购买。</p>

                <h2>五、家长入校说明</h2>
                <p>家长可以陪同入校，帮忙搬运行李。车辆请按照现场指引有序停放，<strong>不能开到宿舍楼下</strong>。安顿妥当后，建议家长尽早离校——这样既能帮助新生更快熟悉环境、认识室友，也能为后来的新生家庭让出空间，避免拥堵。</p>

                <h2>流程总结（照着走就行）</h2>
                <p><strong>入校 → 学院帐篷报到、领取校园卡 → 宿管室领取宿舍钥匙 → 入住宿舍、检查设施 → 报到完成</strong></p>

                <p>唐山师范学院吧务组<br>2026年7月31日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251481, 1791732251481);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-15-en', 'en', 'Freshman Guide (10): Library & Study Spaces', '2026-08-01', 'Guide', 'TSNU Bar Mod Team', 'The tenth part of the Tangshan Normal University Freshman Guide: a complete guide to the library floors, opening hours, entry methods, seat booking, borrowing books, plus rules for self-study classrooms and tips on choosing the right study spot.', '', '                <p>This guide covers everything you need to know about using the library and finding study spaces on campus. We will start with the library, then explain how to use empty classrooms and lecture halls, and finish with tips on choosing the right place for different study needs.</p>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/library-floor-plan.png" alt="Tangshan Normal University library floor plan" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Library floor plan</figcaption>
                </figure>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/library-collection-layout.png" alt="Tangshan Normal University library collection layout" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Library collection layout: different book categories are located on different floors</figcaption>
                </figure>

                <h2>I. Library Guide</h2>

                <h3>1. Floor guide</h3>
                <p>The library has a new building and an old building. Main services are concentrated on floors 2 to 5. After entering through the main entrance, use the floor guide below to find what you need:</p>
                <ul>
                    <li><strong>Floor 2 (main entrance):</strong> First and Second Book Lending Areas, Service Desk, Reading Pavilion, Smart Piano, Red Literature Reading Zone, Party Newspaper Reading Zone, Free Reading Area;</li>
                    <li><strong>Floor 3:</strong> Third and Fourth Book Lending Areas, Student Study Room;</li>
                    <li><strong>Floor 4:</strong> First and Second Sample Reading Rooms, Newspaper Archive, Academic Lecture Hall, Offices (Circulation & Reading Department, Special Collections Department, Readers Association Room);</li>
                    <li><strong>Floor 5:</strong> Periodical Reading Room, Cloud Desktop Reading Room, Electronic Reading Room, Audio-Visual Materials Library, Quiet Reading Zone (where quiet reading aloud is allowed);</li>
                    <li><strong>Dense Stack:</strong> Located on Floor 1 of the old building. Readers cannot enter directly; make an appointment at the Floor 2 Service Desk.</li>
                </ul>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/library-reading-area.png" alt="Library reading area" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Library reading area</figcaption>
                </figure>

                <h3>2. Opening hours</h3>
                <p>Except for the Electronic Reading Room and a few special zones, daily opening hours are consistent. Winter/summer vacations and holidays may have separate arrangements; check the library''s official notices for updates.</p>
                <table class="w-full border-collapse text-sm my-4">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 px-3 py-2 text-left">Area</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">Hours</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-gray-300 px-3 py-2">Floors 2–5 of new and old buildings</td>
                            <td class="border border-gray-300 px-3 py-2">Daily 7:00–22:00</td>
                            <td class="border border-gray-300 px-3 py-2">Open on Saturdays, Sundays, and holidays</td>
                        </tr>
                        <tr>
                            <td class="border border-gray-300 px-3 py-2">Electronic Reading Room (old building, Floor 5)</td>
                            <td class="border border-gray-300 px-3 py-2">Summer: 8:00–11:45, 14:30–18:00<br>Winter: 8:00–11:45, 14:00–17:30</td>
                            <td class="border border-gray-300 px-3 py-2">Open Monday–Friday only; closed Friday afternoon, weekends, and holidays</td>
                        </tr>
                        <tr>
                            <td class="border border-gray-300 px-3 py-2">Digital resources</td>
                            <td class="border border-gray-300 px-3 py-2">24/7 all year</td>
                            <td class="border border-gray-300 px-3 py-2">Available during vacations</td>
                        </tr>
                    </tbody>
                </table>

                <p>Note: when the Electronic Reading Room is closed, the ordinary reading and study areas on Floors 2–5 stay open. Do not assume the whole library is closed.</p>

                <h3>3. Entry methods</h3>
                <p>The library turnstiles support several verification methods. Entry is for the cardholder only; tailgating is not allowed. Please note: <strong>NFC, face recognition, and QR codes are for entry only. To borrow books you must bring your physical campus card.</strong></p>
                <ul>
                    <li><strong>Campus card:</strong> Tap your physical card on the turnstile reader;</li>
                    <li><strong>Face recognition:</strong> Look at the turnstile camera to enter;</li>
                    <li><strong>Phone NFC:</strong> Add your campus card to your phone wallet, then tap your phone on the NFC reader;</li>
                    <li><strong>Perfect Campus app QR code:</strong> Open the app, tap “Pay” on the home page to show the QR code, and scan it at the turnstile. No charge is made.</li>
                </ul>

                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/library-nfc-campus-card.png" alt="Adding campus card to phone NFC wallet" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Adding campus card to phone NFC wallet</figcaption>
                </figure>

                <figure class="text-center my-6 md:max-w-xs mx-auto">
                    <img src="../assets/images/library-perfect-campus-app.png" alt="Perfect Campus app" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Perfect Campus app: bind your campus card to use the entry QR code</figcaption>
                </figure>

                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Important:</strong> Phone NFC, face recognition, and the Perfect Campus QR code only allow you to enter the library for reading. They <strong>cannot be used to borrow books</strong>. Always bring your physical campus card when you want to check out books.</p>

                <h3>4. Seat booking system</h3>
                <p>Library seats must be reserved through a WeChat public account. Follow “唐山师范学院图书馆”, tap “微服务” → “座位预约”; you can also use the “我去图书馆” account. On first login, bind your phone number, set a password, and select “唐山师范学院主校区”.</p>

                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/library-seat-booking-app.png" alt="Library seat booking mini-program interface" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Library seat booking mini-program interface</figcaption>
                </figure>

                <p>The basic flow is: <strong>reserve online → check in on time → manually release the seat when finished</strong>. If you need to step away temporarily, use “暂离” (temporary leave) to hold your seat. You can check in by scanning a QR code, tapping the check-in screen on the Floor 2 seat-selection kiosk, or using Bluetooth.</p>

                <p><strong>Booking time rules</strong></p>
                <ul>
                    <li>System open: 4:30–22:00 daily; no new bookings in the last 10 minutes before closing;</li>
                    <li>Early booking (4:30–7:00): seat held until 7:30;</li>
                    <li>Real-time booking (7:00–21:50): check in within 30 minutes after selecting a seat;</li>
                    <li>Next-day booking: open 14:00–22:00 daily; check in before 7:30 the next day.</li>
                </ul>

                <p><strong>Temporary leave and release rules</strong></p>
                <ul>
                    <li>30-minute leave: for errands or looking up materials;</li>
                    <li>60-minute leave: for lunch/dinner (available 11:00–13:00 and 17:00–19:00 only);</li>
                    <li>Maximum 3 leaves within any 2-hour window; leave status ends automatically when time expires;</li>
                    <li>You must <strong>manually release</strong> your seat when done; after releasing, you must wait 1 minute before booking again.</li>
                </ul>

                <p><strong>Seat occupation reporting:</strong> If a seat is booked but unoccupied or occupied only by belongings, you can report it by uploading a photo. The reported user has 15 minutes to check in again; otherwise they receive 1 violation and the seat is released to you. Seats in “reserved” or “temporarily away” status cannot be reported; lounge chairs and sofas are not in the booking system. You can report up to 5 times per day; malicious reporting will get you blacklisted, and each successful report earns 15 points.</p>

                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>Violations and blacklist:</strong> 3 violations within 15 days (failure to check in, failure to release seat, or failure to re-check-in after a report) will automatically place you on the blacklist for 7 days. You earn points for daily check-in, temporary leaves, and reports, up to 40 points per day. Items in the points shop have different uses; an item that clears violation records does not remove a blacklist.</p>

                <p>Lounge chairs and sofas in the connecting corridor are not in the booking system and do not require a reservation. If the network is slow, you can also use the Floor 2 seat-selection kiosks to book or check in.</p>

                <h3>5. Quiet and reading-aloud zones</h3>
                <p>Reading areas must be kept quiet; do not read aloud or talk loudly. If you need to recite or read aloud, go to the Quiet Reading Zone on Floor 5. Only plain water or bottled water is allowed inside; meals, milk tea, and strong-smelling snacks are prohibited.</p>

                <h3>6. Borrowing password</h3>
                <p>The initial borrowing password for new students is the <strong>last six digits of your ID card number</strong>. If the last digit is the letter X, change the password as soon as possible. You can change it in two ways:</p>
                <ul>
                    <li>Go to the Service Desk on Floor 2 and ask staff to help;</li>
                    <li>Log in to the <a href="http://60.2.228.80:8080/dzjs/login_form.asp" target="_blank" class="text-secondary hover:text-primary">MiaoSi library system</a>, then click “密码修改” on the left side.</li>
                </ul>

                <h3>7. Borrowing and returning books</h3>
                <p>Before borrowing, check the library catalog for the book''s location and call number. You can search via the library WeChat account (“我的图书馆” → “馆藏查询”) or the “馆藏 OPAC” link on the library website.</p>

                <figure class="text-center my-6 md:max-w-lg mx-auto">
                    <img src="../assets/images/library-self-checkout-machine.png" alt="Self-service checkout machine" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Self-service checkout machine at a lending area</figcaption>
                </figure>

                <p>How to borrow and return:</p>
                <ol>
                    <li><strong>Find the book</strong> using its call number in the correct lending area;</li>
                    <li><strong>Borrow it</strong> at the self-service machine near that lending area with your campus card and the book;</li>
                    <li><strong>Return it on time</strong> to the same lending area where you borrowed it. Returns do not require a campus card, and you can ask someone else to return books for you;</li>
                    <li><strong>Dense-stack books</strong>: If the catalog location is “密集书库”, register at the Floor 2 Service Desk. Books are retrieved every Tuesday and Thursday afternoon.</li>
                </ol>
                <p>Keep the due date in mind. Lost or damaged books are handled according to the library''s official compensation rules.</p>

                <h3>8. Internet and help</h3>
                <p>The library provides free WiFi. While on campus you can access CNKI and other academic databases directly. For off-campus access, follow the remote access guide on the library website. If you have problems with seat booking, borrowing, passwords, or facilities, go to the Floor 2 Service Desk during staffed hours.</p>

                <h2>II. Using Empty Classrooms and Lecture Halls</h2>
                <p>Any teaching building or lecture hall that has no scheduled class and is powered can be used for self-study, with no restriction by grade or department. Please follow these rules:</p>
                <ol>
                    <li><strong>Keep quiet:</strong> No chatting or phone speakers. Set your phone to silent or vibrate, and step outside to take calls;</li>
                    <li><strong>Classes come first:</strong> Teaching activities have priority. If a teacher or class needs the room, pack up and leave promptly;</li>
                    <li><strong>Keep it clean:</strong> Take your trash with you, do not draw on desks, do not move furniture unnecessarily, and turn off lights and fans when you leave;</li>
                    <li><strong>Watch your belongings:</strong> Classrooms are unattended. Keep valuables with you, and do not leave books or items to reserve seats for long periods.</li>
                </ol>

                <h2>III. Choosing a Study Space</h2>
                <p>The library and empty classrooms each suit different situations:</p>
                <ul>
                    <li><strong>Short homework sessions, flexible schedules, free coming and going</strong> → choose empty classrooms or lecture halls;</li>
                    <li><strong>Long-term exam prep, reading professional books, needing a fixed quiet seat, or reading aloud</strong> → choose the library.</li>
                </ul>

                <p>TSNU Bar Mod Team<br>August 1, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ welcome group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ welcome group</figcaption>
                </figure>
                ', 1791732251481, 1791732251481);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-15', 'zh', '新生指南（十）- 图书馆与自习室入门', '2026-08-01', '指南', '唐山师范学院吧务组', '唐山师范学院新生指南第十篇：图书馆楼层分布、开放时间、入馆方式、座位预约、图书借还全攻略，以及校内空闲教室自习规则与场地选择建议，帮你快速找到最适合的自习去处。', '', '                <p>本篇把图书馆和校内自习场地的用法一次性整理清楚，配合前面几篇新生指南，帮你从“能进门”到“会用座、会借书、会选场地”。文章略长，但全是实用信息，建议收藏。</p>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/library-floor-plan.png" alt="唐山师范学院图书馆楼层总平面示意图" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">图书馆楼层总平面示意图</figcaption>
                </figure>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/library-collection-layout.png" alt="唐山师范学院图书馆馆藏布局表" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">图书馆馆藏布局表：不同类别的图书对应不同的借阅区与楼层</figcaption>
                </figure>

                <h2>一、图书馆使用细则</h2>

                <h3>1. 楼层功能分布</h3>
                <p>图书馆分为新馆和老馆，主要服务功能集中在二层至五层。进入主入口后，可按楼层快速定位所需区域：</p>
                <ul>
                    <li><strong>二层（主入口层）：</strong>第一图书借阅区、第二图书借阅区、总服务台、朗读亭、智能钢琴、红色文献阅读专区、党报党刊阅读专区、自由阅览区；</li>
                    <li><strong>三层：</strong>第三图书借阅区、第四图书借阅区、学生自习室；</li>
                    <li><strong>四层：</strong>第一样本阅览室、第二样本阅览室、过报室、学术报告厅、办公区（流通阅览部、特藏部、读者协会活动室）；</li>
                    <li><strong>五层：</strong>期刊阅览室、云桌面阅览室、电子阅览室、音像资料库、轻声阅读区（可出声背书）；</li>
                    <li><strong>密集书库：</strong>位于老馆一层，读者无法自行进入，需到二层总服务台预约。</li>
                </ul>

                <figure class="text-center my-6 md:max-w-xl mx-auto">
                    <img src="../assets/images/library-reading-area.png" alt="图书馆阅览区环境" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">图书馆阅览区环境</figcaption>
                </figure>

                <h3>2. 各区域开放时间</h3>
                <p>除电子阅览室和部分特殊区域外，图书馆日常开放时间较为统一。寒暑假及节假日会另行安排，请关注图书馆官方通知。</p>
                <table class="w-full border-collapse text-sm my-4">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 px-3 py-2 text-left">区域</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">开放时间</th>
                            <th class="border border-gray-300 px-3 py-2 text-left">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-gray-300 px-3 py-2">新、老馆二至五层阅览自习区</td>
                            <td class="border border-gray-300 px-3 py-2">每日 7:00—22:00</td>
                            <td class="border border-gray-300 px-3 py-2">周六、周日及节假日正常开放</td>
                        </tr>
                        <tr>
                            <td class="border border-gray-300 px-3 py-2">电子阅览室（老馆五层）</td>
                            <td class="border border-gray-300 px-3 py-2">夏季 8:00—11:45、14:30—18:00<br>冬季 8:00—11:45、14:00—17:30</td>
                            <td class="border border-gray-300 px-3 py-2">仅周一至周五开放；周五下午、周末及节假日闭馆</td>
                        </tr>
                        <tr>
                            <td class="border border-gray-300 px-3 py-2">数字资源</td>
                            <td class="border border-gray-300 px-3 py-2">全年 24 小时</td>
                            <td class="border border-gray-300 px-3 py-2">寒暑假线上资源照常访问</td>
                        </tr>
                    </tbody>
                </table>

                <p>注意：<strong>电子阅览室闭馆期间，普通阅览自习区照常开放</strong>，不要误以为整馆闭馆。</p>

                <h3>3. 入馆通行方式</h3>
                <p>图书馆闸机支持多种身份验证方式，入馆时仅限本人使用，禁止尾随闯闸。注意：<strong>NFC、刷脸、二维码仅用于入馆，借书必须携带实体校园一卡通。</strong></p>
                <ul>
                    <li><strong>校园一卡通：</strong>在闸机刷卡区刷实体卡入馆；</li>
                    <li><strong>人脸识别：</strong>面向闸机摄像头完成识别后入馆；</li>
                    <li><strong>手机 NFC：</strong>将校园卡录入手机钱包后，刷手机 NFC 感应区入馆；</li>
                    <li><strong>完美校园 APP 二维码：</strong>打开 APP 首页“去付款”调出二维码，对准闸机识别区扫码入馆，不产生扣费。</li>
                </ul>

                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/library-nfc-campus-card.png" alt="手机 NFC 模拟门禁卡示意" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">手机 NFC 模拟门禁卡示意</figcaption>
                </figure>

                <figure class="text-center my-6 md:max-w-xs mx-auto">
                    <img src="../assets/images/library-perfect-campus-app.png" alt="完美校园 APP 二维码入馆示意" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">完美校园 APP 绑定校园卡后可刷二维码入馆</figcaption>
                </figure>

                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>重要提醒：</strong>手机 NFC、人脸识别、完美校园二维码仅支持入馆阅览，<strong>无法办理图书外借</strong>。借书请务必携带实体校园一卡通。</p>

                <h3>4. 座位管理系统</h3>
                <p>图书馆座位需通过公众号预约使用。关注「唐山师范学院图书馆」微信公众号，点击菜单栏【微服务】→【座位预约】即可进入；也可使用「我去图书馆」公众号操作。首次登录需绑定手机号并设置密码，选择「唐山师范学院主校区」。</p>

                <figure class="text-center my-6 md:max-w-sm mx-auto">
                    <img src="../assets/images/library-seat-booking-app.png" alt="图书馆公众号座位预约界面" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">图书馆公众号座位预约界面</figcaption>
                </figure>

                <p>基本流程为：<strong>线上预约座位 → 按时到馆签到 → 学习结束主动退座</strong>；中途暂时离开请选择“暂离”保留座位。签到方式有三种：扫码器扫码、二楼大厅选座大屏机感应区签到、蓝牙签到。</p>

                <p><strong>预约时间规则</strong></p>
                <ul>
                    <li>系统开放时段：每日 4:30—22:00，闭馆前 10 分钟停止预约；</li>
                    <li>4:30—7:00 提前预约：座位保留至 7:30；</li>
                    <li>7:00—21:50 实时预约：选座成功后 30 分钟内签到；</li>
                    <li>明日预约：每日 14:00—22:00 开放，次日 7:30 前签到。</li>
                </ul>

                <p><strong>暂离与退座规则</strong></p>
                <ul>
                    <li>暂离 30 分钟：临时有事、查阅资料；</li>
                    <li>暂离 60 分钟：午餐、晚餐时段（11:00—13:00、17:00—19:00 可选）；</li>
                    <li>2 小时内最多暂离 3 次，时长结束自动解除暂离；</li>
                    <li>不再使用座位必须<strong>手动退座</strong>；退座成功 1 分钟后才可再次选座。</li>
                </ul>

                <p><strong>监督占座：</strong>发现系统显示有人而现场无人或用物品占座，可使用“监督占座”上传现场照片举证。被监督者需在 15 分钟内扫码回签，超时记违规 1 次，座位释放给监督者。座位处于“预约”“暂离”状态时无法监督；吊椅、沙发等未纳入选座系统的区域不支持监督。每人每日最多监督 5 次，恶意监督会被拉黑；成功监督一次奖励 15 积分。</p>

                <p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4"><strong>违规与黑名单：</strong>15 日内累计违规 3 次（超时未签到、离馆未退座、被监督未回签），自动进入黑名单，7 天内无法使用选座系统。每日签到、暂离、监督等可获得积分，上限 40 分/天。积分商城中的道具用途不同，清除违规记录的道具不能解除黑名单。</p>

                <p>连廊的休闲吊椅、沙发不纳入选座系统，无需预约；网络拥挤时也可前往二楼大厅选座大屏机现场选座、签到。</p>

                <h3>5. 静音与背书区域说明</h3>
                <p>阅览区域需保持安静，禁止随意朗读或大声交谈。如需出声背诵、朗读，请移步五层轻声阅读区。馆内仅允许携带白开水、纯净水，禁止带入正餐、奶茶及气味较大的零食。</p>

                <h3>6. 图书借阅密码</h3>
                <p>新生借阅证初始密码为<strong>身份证后六位</strong>。若身份证最后一位为字母 X，建议尽早修改密码。修改途径有两种：</p>
                <ul>
                    <li>前往图书馆二层大厅总服务台现场办理；</li>
                    <li>登录<a href="http://60.2.228.80:8080/dzjs/login_form.asp" target="_blank" class="text-secondary hover:text-primary">妙思文献管理集成系统</a>，点击左侧【密码修改】线上操作。</li>
                </ul>

                <h3>7. 图书借还完整指南</h3>
                <p>借书前建议先通过馆藏系统查询图书的馆藏地和索书号。查询渠道：图书馆微信公众号【我的图书馆】→【馆藏查询】，或图书馆官网首页右上方【馆藏 OPAC】。</p>

                <figure class="text-center my-6 md:max-w-lg mx-auto">
                    <img src="../assets/images/library-self-checkout-machine.png" alt="自助借还机实拍" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">借阅区门口的自助借还机</figcaption>
                </figure>

                <p>借还流程如下：</p>
                <ol>
                    <li><strong>找到目标图书</strong>：根据索书号到对应借阅区取书；</li>
                    <li><strong>自助借书</strong>：携带本人校园一卡通和图书，到对应借阅区门口的自助借还机按提示完成借书；</li>
                    <li><strong>按时归还</strong>：在哪一个借阅区借出的图书，需归还至同一借阅区；还书不需校园卡，也可委托他人代还；</li>
                    <li><strong>密集书库图书</strong>：检索到馆藏地为“密集书库”的图书，需到二层总服务台登记预约，每周二、周四下午统一调取。</li>
                </ol>
                <p>借阅图书请牢记归还期限，按时还书；图书丢失、破损按图书馆官方赔偿规定处理。</p>

                <h3>8. 网络与咨询渠道</h3>
                <p>馆内覆盖图书馆 WiFi，可免费连接；在校内网环境下可直接访问知网等学术数据库，离校后可通过图书馆官网远程访问教程使用电子资源。遇到选座故障、借阅问题、密码遗忘或设施损坏等情况，请前往二层大厅总服务台咨询值班馆员。</p>

                <h2>二、校内空闲教室、阶梯教室自习规则</h2>
                <p>校内教学楼和阶梯教室只要没有课程安排且正常通电，均可自由进入自习，无年级、院系限制。使用时请注意以下几点：</p>
                <ol>
                    <li><strong>保持安静：</strong>自习全程禁止闲聊、手机外放；手机调至静音或震动，接打电话请走出教室门外；</li>
                    <li><strong>教学优先：</strong>教室教学使用优先级高于自习，有课或班级活动时请主动腾出；</li>
                    <li><strong>维护环境：</strong>垃圾随身带走，不在桌面乱涂乱画，不随意挪动桌椅；离场时随手关闭电灯、风扇；</li>
                    <li><strong>物品安全：</strong>教室无专人看管，贵重物品务必随身携带；勿长期放置书本或物品占座。</li>
                </ol>

                <h2>三、自习场地选择建议</h2>
                <p>图书馆和空闲教室各有优势，按需选择能事半功倍：</p>
                <ul>
                    <li><strong>短时写作业、灵活学习、进出自由</strong> → 优先选择空闲教学楼、阶梯教室；</li>
                    <li><strong>长期沉浸式备考、查阅专业书籍、需要固定安静座位或出声背书</strong> → 优先选择图书馆。</li>
                </ul>

                <p>唐山师范学院吧务组<br>2026年8月1日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
                ', 1791732251481, 1791732251481);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-16-en', 'en', 'Freshman Guide (11) – Clubs &amp; Organizations from the Bar Owner', '2026-08-04', 'Guide', 'TSNU Bar Mod Team', 'The Bar Owner shares advice on clubs and organizations: Dao Meng Space credit rules, student organization roles, recruitment channels, and the complete official club directory to help freshmen decide what to join.', '', '<p>Besides adjusting to courses and dorm life, every freshman faces a common question: Should I join a club? How many? The student union or an interest club? This guide breaks down the logic behind choosing clubs and student organizations, the credit rules, and the actual joining process. Read it alongside the guides on Campus Card, Public Bathhouses, and the Library for a fuller picture of campus life.</p>

<p class="text-sm text-gray-500 italic">Disclaimer: This guide is based on the Bar Owner''s personal experience plus official name lists. It is for reference only and does not represent the university''s official position. Corrections and additions are welcome in the comments.</p>

<figure class="text-center my-6 md:max-w-xl mx-auto">
    <img src="../assets/images/clubs-baituan.jpg" alt="Club recruitment fair on campus" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">The "Hundred Clubs Battle" recruitment fair (official WeChat account)</figcaption>
</figure>

<h2>I. Bar Owner''s Advice: One Club or Organization Is Enough for Freshman Year</h2>
<p>Whether it is a student organization or a club, there is routine work, fixed tasks, event shifts, and paperwork that will keep eating into your spare time. Freshman year is already the busiest and most adjustment-heavy period of college: you need to adapt to a new campus rhythm, keep up with coursework, get used to dorm life, and attend frequent orientation lectures, class meetings, and freshman education sessions.</p>
<p>Signing up for too many clubs or organizations usually leaves almost no downtime in freshman year and can easily lead to burnout.</p>

<h3>1. General Promotion Path</h3>
<p>The promotion ladder is roughly the same across student organizations and clubs:</p>
<ul>
    <li><strong>Freshman year:</strong> ordinary member/干事, mainly executing tasks and taking part in activities;</li>
    <li><strong>Sophomore year:</strong> middle-level officer, e.g., department head;</li>
    <li><strong>Junior year:</strong> senior officer, e.g., chair, club president, or team leader.</li>
</ul>

<h2>II. Why Do Most People Join Clubs or Organizations?</h2>
<p>Many freshmen wonder: if it is tiring and involves work, why join at all? There are two practical reasons:</p>

<h3>1. "Dao Meng Space" Credits (Required for Graduation)</h3>
<p>At our university, second-classroom credits are recorded and certified in the <strong>Dao Meng Space</strong> app. You earn credits by signing up for activities, and <strong>not meeting the credit requirement can affect graduation</strong>.</p>

<figure class="text-center my-6 md:max-w-sm mx-auto">
    <img src="../assets/images/daomeng-space.png" alt="Dao Meng Space app points and certificates screen" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">Dao Meng Space app: points and certificates</figcaption>
</figure>

<p>Credit requirements by module:</p>
<div class="overflow-x-auto my-4">
    <table class="w-full text-sm border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-100">
                <th class="border border-gray-300 px-3 py-2 text-left">Module</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Points</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Main Content</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="border border-gray-300 px-3 py-2">Ideological Growth</td>
                <td class="border border-gray-300 px-3 py-2">30</td>
                <td class="border border-gray-300 px-3 py-2">Lectures, moral forums, scholarship salons, themed class meetings, youth league/Party school training, youth Marxist programs, advanced class/youth league branch honors, civilized dormitories, reading and competitions, scholarship honors, etc.</td>
            </tr>
            <tr>
                <td class="border border-gray-300 px-3 py-2">Volunteering &amp; Public Service</td>
                <td class="border border-gray-300 px-3 py-2">30</td>
                <td class="border border-gray-300 px-3 py-2">Regular volunteer activities, blood donation, volunteer honors, Western Plan volunteers, volunteer competitions, campus order and environment beautification, poverty alleviation, community service, volunteer hours, labor week, etc.</td>
            </tr>
            <tr>
                <td class="border border-gray-300 px-3 py-2">Practice &amp; Internship</td>
                <td class="border border-gray-300 px-3 py-2">30</td>
                <td class="border border-gray-300 px-3 py-2">Summer "Three Rural" social practice, study tours, internships, professional practice, industry internships, daily practice activities, etc.</td>
            </tr>
            <tr>
                <td class="border border-gray-300 px-3 py-2">Culture &amp; Sports / Innovation &amp; Entrepreneurship / Work Experience / Skills</td>
                <td class="border border-gray-300 px-3 py-2">60</td>
                <td class="border border-gray-300 px-3 py-2">Cultural and sports activities, innovation and entrepreneurship, work履历, skills and specialties</td>
            </tr>
            <tr class="bg-gray-50">
                <td class="border border-gray-300 px-3 py-2 font-semibold">Total</td>
                <td class="border border-gray-300 px-3 py-2 font-semibold">150</td>
                <td class="border border-gray-300 px-3 py-2">—</td>
            </tr>
        </tbody>
    </table>
</div>
<p class="text-xs text-gray-500">Note: Specific point values and certification rules are subject to the latest university announcement.</p>

<p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
    <strong>Tips:</strong> In junior year the university usually releases a large number of make-up activities for students short on credits, but that is a passive, rushed fix. Earning credits steadily and early is the least stressful approach. One advantage of joining a club or organization is that internal activities are often announced to members first and have more slots, making it easier to accumulate Dao Meng Space credits consistently.
</p>

<h3>2. End-of-Term Comprehensive Assessment Bonus</h3>
<p>Simply participating in a club or organization normally adds a small bonus to your end-of-term comprehensive assessment, which helps with scholarships and honors.</p>

<h2>III. Honest Advice on Picking a Role</h2>
<p>If you do not have a clear goal of climbing the student-union ladder or pursuing student-work experience:</p>
<p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
    <strong>We do not recommend</strong> signing up for purely functional, high-workload student organizations.
</p>
<p>For most freshmen, the best choice is to <strong>pick a club you are genuinely interested in</strong>. That way you can earn your credits, get the assessment bonus, meet like-minded people, and enrich your free time.</p>
<p class="text-sm text-gray-600">(Every club has basic duties; there is no such thing as a completely "retirement" club where you do nothing. Please be realistic.)</p>

<h2>IV. What Each Department Student Organization Does</h2>
<p>Each department typically has six standard student organizations with clear roles:</p>
<ul>
    <li><strong>Department Student Union:</strong> organizes cultural and sports activities and handles daily student affairs;</li>
    <li><strong>Department Youth League Branch:</strong> manages league classes, themed league-day activities, member information, and youth ideological education;</li>
    <li><strong>Department Self-Discipline Committee:</strong> supervises discipline, classroom attendance, dorm hygiene checks, and evening roll calls;</li>
    <li><strong>Department Youth Volunteer Association:</strong> coordinates volunteer activities and records volunteer hours;</li>
    <li><strong>Department New Media:</strong> runs the department''s official publicity platforms, taking photos, writing posts, and handling daily publicity;</li>
    <li><strong>Department YiBan Workstation:</strong> operates the YiBan platform, focusing on publicity, check-ins, and activity tasks, often reminding classes to submit screenshots.</li>
</ul>
<p>Note: University-level counterparts have basically the same functions, but they can assign tasks to department-level organizations and coordinate campus-wide work.</p>

<h2>V. How Clubs &amp; Organizations Recruit and How to Join</h2>

<h3>1. Clubs</h3>
<p>All clubs are run by their respective departments and are open to all students across campus. Recruitment happens through two channels:</p>
<ul>
    <li>Targeted publicity within the department;</li>
    <li>The unified "Hundred Clubs Battle" recruitment fair at the start of the semester.</li>
</ul>

<h3>2. University-Level Student Organizations</h3>
<p>They recruit only at the Hundred Clubs Battle fair. There is no separate departmental roadshow or private recruitment.</p>

<h3>3. Department-Level Student Organizations</h3>
<p>Limited to students of that department, publicized only inside the department, and do not participate in the Hundred Clubs Battle.</p>

<h3>4. General Application Process</h3>
<ol>
    <li>Fill out a paper application at the recruitment site;</li>
    <li>Wait for an interview notice;</li>
    <li>Attend the interview;</li>
    <li>Check the admission results announcement.</li>
</ol>

<a href="https://tieba.baidu.com/p/9846388661" target="_blank" rel="noopener noreferrer" class="glass-link mt-5 no-underline" style="text-decoration:none">
    <div class="flex items-center">
        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
            <i class="fa fa-star"></i>
        </div>
        <div class="flex-1 min-w-0">
            <span class="glass-link-title font-semibold underline">Club &amp; Organization Ratings</span>
            <p class="text-xs text-gray-500 mt-0.5 leading-snug">The Mod Team collected honest feedback from seniors; data is limited and subjective, for reference only</p>
            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">View Ratings <i class="fa fa-angle-right"></i></span>
        </div>
    </div>
</a>
<p class="text-sm text-gray-600 mt-2">Note: The ratings above were compiled by the Mod Team from senior feedback. The data source is limited and subjective, so please consider your own interests and treat this as reference only.</p>

<h2>VI. Complete Directory of Official Organizations and Clubs</h2>

<h3>1. Nine University-Level Organizations Under the University Youth League Committee</h3>
<ol>
    <li>University Student Union</li>
    <li>Grassroots League Affairs Management Center</li>
    <li>Youth Volunteer Association</li>
    <li>New Youth Media Center (Tangshi New Youth)</li>
    <li>University Art Troupe</li>
    <li>Science &amp; Innovation Competition Service Center</li>
    <li>Club Management Center (oversees all registered clubs)</li>
    <li>Second Classroom Management Center</li>
    <li>Flag Guard Team</li>
</ol>

<h3>2. Department-Level Student Organizations</h3>
<ul>
    <li>Department Student Union</li>
    <li>Department Youth League Branch</li>
    <li>Department Self-Discipline Committee</li>
    <li>Department Youth Volunteer Association</li>
    <li>Department New Media</li>
    <li>Department YiBan Workstation</li>
</ul>

<h3>3. Officially Registered Campus Clubs (by Category)</h3>
<p>The list below is organized by the university''s official categories. Joining these generally counts toward Dao Meng Space credits:</p>

<p><strong>Culture &amp; Sports</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>Horticulture Club</li>
    <li>Xinyu Secretary Club</li>
    <li>Xinyin Recitation Club</li>
    <li>Fengshang Calligraphy Association</li>
    <li>DIY Creative Handicraft Association</li>
    <li>Sports Competition Club</li>
    <li>Tang Xiaoshi New Youth Rule of Law Club</li>
    <li>Jin Koucai Debate &amp; Speech Association</li>
    <li>Xinlv Drama Club</li>
    <li>University Jin Koucai Association</li>
    <li>Lingdong Fengyu Club</li>
    <li>Xinyun Guqin Club</li>
    <li>Wencheng Paper Art Club</li>
    <li>Fengyun Ocarina Club</li>
    <li>University Photography Association</li>
    <li>Yeshu Literature Club</li>
    <li>Guande Archery Club</li>
    <li>Qiyue Drama Club</li>
    <li>Xinhua Calligraphy Club</li>
    <li>Tianyi Guitar Club</li>
    <li>Zhuoyue Travel Enthusiasts Association</li>
    <li>University Pingju Opera Troupe</li>
    <li>Xinquan Literature Club</li>
    <li>Tea Art Club</li>
    <li>Yiting Chess Club</li>
    <li>Love Speech Foreign Language Club</li>
    <li>Changxiang Performing Arts Association</li>
    <li>TSNU English Association</li>
    <li>Hanjiang Qiuyue Culture Club</li>
    <li>Opera Culture &amp; Art Association</li>
    <li>Industrial Culture Research Club</li>
</ul>

<p><strong>Volunteering &amp; Public Service</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>Love Legacy Safety Education Association</li>
    <li>Animal &amp; Plant Protection Association</li>
    <li>Student Readers Association</li>
    <li>Moyan Sign Language Club</li>
    <li>Environmental Protection Association</li>
    <li>Juguang Love Association</li>
</ul>

<p><strong>Ideological &amp; Political</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>Political Research Association</li>
    <li>Youth Lecture Group</li>
    <li>Anti-Earthquake Spirit Research Club</li>
    <li>Jidong Red Culture Research Association</li>
    <li>Yan''an Spirit Research Club</li>
    <li>University History Culture Research Society</li>
    <li>Youth Integrity Club</li>
    <li>Dazhao Spirit Research Club</li>
    <li>Socialism with Chinese Characteristics Theory Club</li>
    <li>Xibaipo Spirit Research Club</li>
</ul>

<p><strong>Academic &amp; Technology</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>Liaoyuan Technology Club</li>
    <li>Humanities Planning Society</li>
    <li>GIS Association</li>
    <li> Boyun Geographic Surveying Association</li>
    <li>Stargazers Association</li>
    <li>Hanhai Nature Association</li>
</ul>

<p><strong>Innovation &amp; Entrepreneurship</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>Computer Association</li>
    <li>Innovation Competition Club</li>
    <li>Miracle Vision Studio</li>
</ul>

<p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
    <strong>Reminder:</strong> The university also has some student-run "informal clubs" that do not qualify for Dao Meng Space credits but also have less routine work. They are mainly groups of students with shared hobbies, such as the Anime Club (recruitment group: <strong>1064414084</strong>).
</p>

<p>Hope everyone finds the club or organization that suits them best!</p>

<p>TSNU Bar Mod Team<br>August 4, 2026</p>

<figure class="text-center my-6">
    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ New Student Group QR Code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ new-student group</figcaption>
</figure>

            ', 1791732251482, 1791732251482);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-16', 'zh', '新生指南（十一）-吧主谈社团组织', '2026-08-04', '指南', '唐山师范学院吧务组', '吧主谈社团组织：从到梦空间学分规则、学生组织职能、招新加入方式到全校官方社团名录，帮新生理清要不要加社团、加几个、怎么选。', '', '<p>大一除了适应课程和宿舍生活，还要面对一个「必答题」：到底要不要加社团？加几个？选学生会还是兴趣社？本篇把社团/学生组织的选择逻辑、学分规则和实际加入流程一次性整理清楚。建议配合《校园卡》《公共浴室》《图书馆》等指南一起阅读，更快摸清校园生活全貌。</p>

<p class="text-sm text-gray-500 italic">声明：本指南为吧主个人经验总结 + 官方名单整理，仅供新生参考，不代表学校官方立场。如有不准确之处，欢迎在评论区纠正、补充。</p>

<figure class="text-center my-6 md:max-w-xl mx-auto">
    <img src="../assets/images/clubs-baituan.jpg" alt="百团大战现场，社团招新摊位" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">百团大战现场（学校公众号图）</figcaption>
</figure>

<h2>一、吧主建议：大一只加一个社团/组织就够了</h2>
<p>不管是学生组织还是社团，都有常态化日常工作、固定任务、活动值班、文案整理等事务，会持续占用课余精力。大一本身是大学里最忙碌、最需要适应的阶段：要适应全新的校园节奏、跟上课程进度、处理宿舍集体生活，同时还要参加学校频繁安排的新生教育、讲座和班会。</p>
<p>如果社团/组织报太多，大一基本没有放松时间，极易疲惫内耗。</p>

<h3>1. 通用晋升机制</h3>
<p>全校学生组织和社团的晋升路径大致相同：</p>
<ul>
    <li><strong>大一：</strong>普通干事/成员，以执行工作、参与活动为主；</li>
    <li><strong>大二：</strong>留任中层，可担任部长等职务；</li>
    <li><strong>大三：</strong>留任高层，可担任主席、社长、团长等负责人。</li>
</ul>

<h2>二、为什么大部分人都会加入社团/组织？</h2>
<p>很多新生会疑惑：既然累、还要干活，为什么还要参加？主要是两个现实原因：</p>

<h3>1. 到梦空间学分（直接关联毕业）</h3>
<p>我校第二课堂学分统一在「到梦空间」APP 记录、认定，报名参加活动可获得学分，<strong>学分不达标无法正常毕业</strong>。</p>

<figure class="text-center my-6 md:max-w-sm mx-auto">
    <img src="../assets/images/daomeng-space.png" alt="到梦空间 APP 个人积分页面截图" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">到梦空间 APP 积分与证书页面</figcaption>
</figure>

<p>到梦空间学分各模块要求如下：</p>
<div class="overflow-x-auto my-4">
    <table class="w-full text-sm border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-100">
                <th class="border border-gray-300 px-3 py-2 text-left">模块</th>
                <th class="border border-gray-300 px-3 py-2 text-left">分值</th>
                <th class="border border-gray-300 px-3 py-2 text-left">主要内容</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="border border-gray-300 px-3 py-2">思想成长</td>
                <td class="border border-gray-300 px-3 py-2">30 分</td>
                <td class="border border-gray-300 px-3 py-2">青春大讲堂、道德讲堂、国奖沙龙、主题班会、团校/党校培训、青马工程、先进班团支部/班集体、校/系文明宿舍、思想成长类阅读与比赛、奖学金及先进集体荣誉等</td>
            </tr>
            <tr>
                <td class="border border-gray-300 px-3 py-2">志愿公益</td>
                <td class="border border-gray-300 px-3 py-2">30 分</td>
                <td class="border border-gray-300 px-3 py-2">日常志愿服务活动、义务献血、志愿公益荣誉称号、西部计划志愿者、志愿公益类比赛、校园秩序与环境美化、扶贫助困、社区治理、志愿劳动小时等</td>
            </tr>
            <tr>
                <td class="border border-gray-300 px-3 py-2">实践实习</td>
                <td class="border border-gray-300 px-3 py-2">30 分</td>
                <td class="border border-gray-300 px-3 py-2">暑期“三下乡”社会实践、境内外交流学习、见习、专业实习、行业实习、日常实践活动等</td>
            </tr>
            <tr>
                <td class="border border-gray-300 px-3 py-2">文体活动 / 创新创业 / 工作履历 / 技能特长</td>
                <td class="border border-gray-300 px-3 py-2">60 分</td>
                <td class="border border-gray-300 px-3 py-2">文体活动类、创新创业类、工作履历类、技能特长类</td>
            </tr>
            <tr class="bg-gray-50">
                <td class="border border-gray-300 px-3 py-2 font-semibold">合计</td>
                <td class="border border-gray-300 px-3 py-2 font-semibold">150 分</td>
                <td class="border border-gray-300 px-3 py-2">—</td>
            </tr>
        </tbody>
    </table>
</div>
<p class="text-xs text-gray-500">注：具体分值与认定规则以学校最新公告为准。</p>

<p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
    <strong>小提示：</strong>虽然大三学校会统一放出大量补录活动给学分不足的同学兜底补分，但属于被动补救，体验差、非常仓促。尽早、慢慢攒够学分，是最省心的选择。加入社团/学生组织的优势之一，就是内部活动优先对内招募、名额更多，更容易稳定攒够到梦空间学分。
</p>

<h3>2. 期末综测加分</h3>
<p>正常参与社团、组织工作，每年期末综测可获得少量加分，对评奖评优有一定帮助。</p>

<h2>三、吧主选岗真心话</h2>
<p>如果你没有明确意愿冲学生会干部、走学生工作路线：</p>
<p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
    <strong>不建议</strong>报纯干活、事务密集的功能性学生组织。
</p>
<p>对大多数新生来说，最优选择是<strong>挑一个自己真正感兴趣的社团</strong>。既能完成到梦空间学分、拿综测加分，又能结识同好、丰富课余生活。</p>
<p class="text-sm text-gray-600">（所有社团都有基础工作，不存在纯养老、完全不用做事的社团，请理性看待。）</p>

<h2>四、院系学生组织职能介绍</h2>
<p>校内各院系一般标配以下六类学生组织，分工清晰：</p>
<ul>
    <li><strong>院系学生会：</strong>负责各类文体活动、学生日常事务、活动统筹执行；</li>
    <li><strong>院系团总支：</strong>主管团务工作，包括团课、团日活动、团员信息管理、青年思想教育等；</li>
    <li><strong>院系自律委员会：</strong>负责纪律监督、教室考勤、宿舍卫生检查、晚查寝等常规检查；</li>
    <li><strong>院系青年志愿者协会：</strong>统筹院系志愿活动，统计、上报志愿时长；</li>
    <li><strong>院系新媒体：</strong>运营院系官方宣传平台，负责活动拍照、推文撰写、日常宣传；</li>
    <li><strong>院系易班工作站：</strong>运营易班平台，偏宣传、打卡、活跃度任务，常需督促班级完成各类截图打卡。</li>
</ul>
<p>补充：校级对应组织职能和院系基本一致，区别是校级组织可对下级院系组织下发工作任务、统筹全校工作。</p>

<h2>五、社团 & 组织招新、加入方式</h2>

<h3>1. 社团</h3>
<p>所有社团均由对应院系开办，面向全校所有学生开放报名。宣传招新分为两种渠道：</p>
<ul>
    <li>院内针对性宣传；</li>
    <li>统一参加开学「百团大战」集中招新。</li>
</ul>

<h3>2. 校级学生组织</h3>
<p>只在百团大战统一招新，无单独院内宣讲、不私下招人。</p>

<h3>3. 院系学生组织</h3>
<p>仅限本院系学生报名，仅在本院系内部宣传，不参与百团大战。</p>

<h3>4. 通用报名流程</h3>
<ol>
    <li>招新现场填写纸质报名表；</li>
    <li>等待面试通知；</li>
    <li>参加面试；</li>
    <li>公示录取结果。</li>
</ol>

<a href="https://tieba.baidu.com/p/9846388661" target="_blank" rel="noopener noreferrer" class="glass-link mt-5 no-underline" style="text-decoration:none">
    <div class="flex items-center">
        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
            <i class="fa fa-star"></i>
        </div>
        <div class="flex-1 min-w-0">
            <span class="glass-link-title font-semibold underline">社团组织评分合集</span>
            <p class="text-xs text-gray-500 mt-0.5 leading-snug">吧务组收集部分学长学姐对社团/组织的真实反馈，数据不全、主观性强，仅供参考</p>
            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">查看评分 <i class="fa fa-angle-right"></i></span>
        </div>
    </div>
</a>
<p class="text-sm text-gray-600 mt-2">说明：以上评分由吧务组根据学长学姐反馈整理，数据来源有限且主观性较强，建议结合自身兴趣综合判断，仅供参考。</p>

<h2>六、全校官方组织 + 社团完整名录</h2>

<h3>1. 校团委直属九大校级学生组织</h3>
<ol>
    <li>校学生会</li>
    <li>基层团务管理中心</li>
    <li>青年志愿者协会</li>
    <li>新青年媒体中心（唐师新青年）</li>
    <li>大学生艺术团</li>
    <li>科创赛事服务中心</li>
    <li>社团管理中心（管辖全校所有注册社团）</li>
    <li>第二课堂管理中心</li>
    <li>国旗护卫队</li>
</ol>

<h3>2. 各院系常设学生组织</h3>
<ul>
    <li>院系学生会</li>
    <li>院系团总支</li>
    <li>院系自律委员会</li>
    <li>院系青年志愿者协会</li>
    <li>院系新媒体</li>
    <li>院系易班工作站</li>
</ul>

<h3>3. 全校正式注册社团（官方分类）</h3>
<p>以下名单按学校官方分类整理，加入后一般可获得到梦空间学分认定：</p>

<p><strong>文化体育类</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>园艺社</li>
    <li>心语秘书社</li>
    <li>心音朗诵社</li>
    <li>风赏书法协会</li>
    <li>DIY 创意手工协会</li>
    <li>体育竞技社</li>
    <li>唐小狮新青年法治社</li>
    <li>金口才辩论与演讲协会</li>
    <li>心侣剧社</li>
    <li>大学生金口才协会</li>
    <li>灵动风域社团</li>
    <li>心韵古琴社</li>
    <li>文成纸艺社</li>
    <li>风韵陶笛社</li>
    <li>大学生摄影协会</li>
    <li>野树文学社</li>
    <li>观德射艺</li>
    <li>齐跃剧社</li>
    <li>心画书法社</li>
    <li>天意吉他社</li>
    <li>卓越旅游爱好者协会</li>
    <li>大学生评剧团</li>
    <li>心泉文学社</li>
    <li>茶艺社</li>
    <li>弈亭棋社</li>
    <li>爱言外语演说社</li>
    <li>畅想演艺协会</li>
    <li>唐山师范学院英语协会</li>
    <li>汉江秋月文化社</li>
    <li>院戏曲文化艺术协会</li>
    <li>工业文化研究社</li>
</ul>

<p><strong>志愿公益类</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>爱传承安全教育宣讲协会</li>
    <li>动植物保护协会</li>
    <li>学生读者协会</li>
    <li>默言手语社</li>
    <li>环境保护协会</li>
    <li>聚光爱心协会</li>
</ul>

<p><strong>思想政治类</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>政治研究协会</li>
    <li>青春宣讲团</li>
    <li>抗震精神研究社</li>
    <li>冀东红色文化研究会</li>
    <li>延安精神研究社</li>
    <li>大学生校史文化研究学会</li>
    <li>大学生青春倡廉社</li>
    <li>大钊精神研究社</li>
    <li>中国特色社会主义理论社团</li>
    <li>西柏坡精神研究社</li>
</ul>

<p><strong>学术科技类</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>燎原科技社</li>
    <li>人文规划学社</li>
    <li>GIS 协会</li>
    <li>博云地理测量协会</li>
    <li>星空爱好者协会</li>
    <li>瀚海自然协会</li>
</ul>

<p><strong>创新创业类</strong></p>
<ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
    <li>计算机协会</li>
    <li>创新竞赛俱乐部</li>
    <li>奇迹视界工作室</li>
</ul>

<p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
    <strong>提醒：</strong>学校还有一部分学生自行组织的“民办社团”，没有到梦空间加分资格，但日常工作也更少，更多是有共同爱好的同学一起玩，比如动漫社（纳新群号：<strong>1064414084</strong>）。
</p>

<p>祝大家选到适合自己的社团组织！</p>

<p>唐山师范学院吧务组<br>2026年8月4日</p>

<figure class="text-center my-6">
    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
</figure>

            ', 1791732251482, 1791732251482);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-17-en', 'en', 'Freshman Guide (12) – Essential Software Collection', '2026-08-05', 'Guide', 'TSNU Bar Mod Team', 'Just starting college and wondering which apps to install? From class study tools, college English, campus credits, and official utilities to AI aids and daily-life apps — here''s the complete practical list in one place.', '', '<p>In high school, bringing a phone onto campus usually meant getting caught red-handed by the dean. But in college? Try getting through a single day without one — it''s basically impossible.</p>

<p>So what must-have apps should you install on your phone before freshman year even starts? We''ve rounded up the complete practical list for you!</p>

<figure class="text-center my-6 md:max-w-xl mx-auto">
    <img src="../assets/images/freshman-software-icons.jpg" alt="Icons of common campus apps" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">A quick look at common campus apps</figcaption>
</figure>

<h2>I. Must-Have Apps for Classes &amp; Studying</h2>

<h3>1. Xuexitong (学习通)</h3>
<p>The most versatile — and most tormenting — study app in college! The vast majority of homework, in-class quizzes, and online exams live here. Fancy university-wide check-ins — hand gestures, QR scans, photo check-ins, location check-ins — all originate here. Skipping class? Nowhere to hide.</p>

<h3>2. Changjiang Rain Classroom / Rain Classroom (WeChat mini-program)</h3>
<p>Heavy overlap with Xuexitong — also handles homework, in-class responses, and online quizzes. Many major-course teachers prefer it for lectures; consider it your second-classroom tool that''s permanently on duty.</p>

<h3>3. WakeUp Timetable</h3>
<p>Still memorizing your schedule by heart and hunting for classrooms? This app is the cure for getting lost on the way to class or showing up at the wrong time! Log into the academic system and import your full timetable with one tap; it supports odd/even week detection and adds a home-screen widget, so your schedule is always at a glance — no more panicking before 8 a.m. lectures.</p>

<figure class="text-center my-6 md:max-w-xl mx-auto">
    <img src="../assets/images/campus-students.jpg" alt="U-Campus quiz" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">U-Campus quiz</figcaption>
</figure>

<h2>II. The English Trio (Required for College English)</h2>

<h3>4. U-Campus / U-Campus AI</h3>
<p>The dedicated app for university public English. Daily English homework, class check-ins, and unit tests basically all run through it — you won''t escape it for four years.</p>

<h3>5. UTalk</h3>
<p>Specifically built to torment you with spoken-English assignments! It ships with an absurdly strict voice-scoring system — so strict that playing the original audio back might still earn you a low score. A love-hate exclusive torment app.</p>

<h3>6. iTEST</h3>
<p>The official university English exam platform. Final English exams in the first few semesters are proctored in the computer lab, but you still need to register your account and reset your password here ahead of time — and it really comes in handy at the crucial moment.</p>

<h2>III. Campus Credits &amp; On-Campus Tasks</h2>

<h3>7. Yiban (易班)</h3>
<p>Its uses differ from school to school; at ours it''s more like a souped-up campus official account. To boost engagement, the school regularly assigns check-in and screenshot tasks — making it a "mandatory must-install" app you can''t really avoid.</p>

<h3>8. Dao Meng Space (到梦空间)</h3>
<p>The one and only official platform for the entire school''s second classroom! Lectures, volunteer work, and club activities are all signed up for and checked into here. Second-classroom credits affect graduation, so keep browsing for activities and stack up those credits.</p>

<h2>IV. Campus Tools &amp; Official Must-Haves</h2>

<h3>9. EasyConnect</h3>
<p>The school''s exclusive VPN magic! Even off campus you can connect to the internal network with one tap — checking papers, entering the academic system, and browsing campus resources all rely on it. Essential when writing your thesis.</p>

<a href="https://mp.weixin.qq.com/s/fkdqNH6gQF2d9sbFDBoo4g" target="_blank" rel="noopener noreferrer" class="glass-link mt-5 no-underline" style="text-decoration:none">
    <div class="flex items-center">
        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
            <i class="fa fa-book"></i>
        </div>
        <div class="flex-1 min-w-0">
            <span class="glass-link-title font-semibold underline">EasyConnect Tutorial</span>
            <p class="text-xs text-gray-500 mt-0.5 leading-snug">The school library''s official account has published a detailed connection guide — click to view.</p>
            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">View tutorial <i class="fa fa-angle-right"></i></span>
        </div>
    </div>
</a>
<p class="text-sm text-gray-600 mt-2">Note: The school library''s official account has already compiled the EasyConnect connection steps; we recommend jumping straight to the illustrated guide.</p>

<h3>10. CHSI (学信网)</h3>
<p>The Ministry of Education''s official student-status platform! You can view your electronic student archive here. Forgot your student ID card on a trip? Just show your CHSI info to buy a student-discount ticket — if you love to travel, this saves you a ton of money.</p>

<h3>11. ICBC App (工商银行APP)</h3>
<p>The only official top-up channel for our campus card and meal card! Topping up the meal card, paying campus water/electricity fees, and all kinds of on-campus payments depend on it — a four-year campus essential.</p>

<h2>V. AI Study Aids</h2>

<h3>12. Doubao, DeepSeek, Kimi and other AI apps</h3>
<p>The savior of modern college homework 😋<br>The birthplace of academic inspiration, the terminus of tricky assignments (the birthplace of academic misconduct)</p>

<h2>VI. Daily Life &amp; Entertainment Must-Haves</h2>

<h3>13. Meituan / Pinhao Fan (拼好饭)</h3>
<p>Full coverage of on-campus canteen delivery! Often cheaper than eating in the canteen. Canteen takeout is delivered to the foot of your dorm building; off-campus takeout is uniformly dropped at the dorm fence — a blessing for the lazy.</p>

<blockquote class="border-l-4 border-primary pl-4 italic text-gray-600 my-4">
Most college students love to eat and have hearty appetites; any spare money goes straight to food. — Wang Zengqi
</blockquote>

<figure class="text-center my-6 md:max-w-xl mx-auto">
    <img src="../assets/images/food-delivery.jpg" alt="Meituan''s low prices during the takeout price war" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">Meituan''s low prices during the takeout price war</figcaption>
</figure>

<h3>14. Taobao, Pinduoduo</h3>
<p>The dedicated spending apps for college living expenses! Everyday shopping and stocking up on daily essentials all rely on them, and Pinduoduo even shows your Cainiao Station pickup code directly — super convenient for collecting packages.</p>

<p>That''s the complete must-have software list for freshmen. Download what you need and plan it out sensibly — wishing everyone a smooth start to the semester!</p>

<p>Tangshan Normal University Bar Mod Team<br>August 5, 2026</p>

<figure class="text-center my-6">
    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ freshman-group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ freshman group</figcaption>
</figure>
            ', 1791732251483, 1791732251483);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-17', 'zh', '新生指南（十二）-新生必备软件合集', '2026-08-05', '指南', '唐山师范学院吧务组', '刚踏入大学生活，手机里到底要提前装哪些刚需软件？从上课学习、英语作业、校园学分、官方工具到 AI 辅助与生活娱乐，全套实用清单一次性整理清楚。', '', '<p>高中带手机进校园，大概率会被主任当场逮住；但上了大学，没有手机真的寸步难行。</p>

<p>刚踏入大学生活，手机里到底要提前装哪些刚需软件？给大家整理好了全套实用清单！</p>

<figure class="text-center my-6 md:max-w-xl mx-auto">
    <img src="../assets/images/freshman-software-icons.jpg" alt="部分校园常用软件图标展示" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">部分校园常用软件图标一览</figcaption>
</figure>

<h2>一、上课学习刚需类</h2>

<h3>1. 学习通</h3>
<p>大学最万能、也最折磨人的学习软件！绝大多数课程的作业、随堂测验、线上考试都在这里完成。全网花式大学签到——手势、扫码、拍照、定位签到，全部出自这里，逃课基本无处可藏。</p>

<h3>2. 长江雨课堂 / 雨课堂（微信小程序）</h3>
<p>功能和学习通高度重合，同样负责布置作业、随堂答题、线上测验。很多专业课老师偏爱用它上课，属于常年在线打工的第二课堂工具。</p>

<h3>3. WakeUp课程表</h3>
<p>还在死记硬背课表、找教室？这款软件专治上课迷路、记错时间！登录教务系统即可一键导入完整课表，支持单双周识别，还能添加桌面小组件，课表随时看，告别早八慌张。</p>

<figure class="text-center my-6 md:max-w-xl mx-auto">
    <img src="../assets/images/campus-students.jpg" alt="U校园上的小测" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">U校园上的小测</figcaption>
</figure>

<h2>二、英语专属三件套（大英必用）</h2>

<h3>4. U校园 / U校园AI版</h3>
<p>大学公共英语专属软件，平时英语作业、课堂签到、单元测试基本都靠它，四年逃不掉。</p>

<h3>5. UTalk</h3>
<p>专治大学英语口语作业！自带极度严格的语音评分系统，离谱到播放原音频都可能给你判低分，属于让人又爱又恨的专属折磨软件。</p>

<h3>6. iTEST</h3>
<p>大学英语官方考试平台。虽然前几学期期末英语是机房统考，但需要在这里提前注册账号、重置密码，关键时刻挺管用。</p>

<h2>三、校园学分&amp;校内任务类</h2>

<h3>7. 易班</h3>
<p>不同学校用处不一样，在本校更像一个加强版校园公众号。学校为了刷活跃度，会经常安排打卡、截图任务，属于不得不装的“硬性必备APP”。</p>

<h3>8. 到梦空间</h3>
<p>全校第二课堂唯一官方平台！讲座、志愿、社团活动全部在这里报名签到，二课学分关乎毕业，一定要经常刷活动攒学分。</p>

<h2>四、校园工具&amp;官方刚需</h2>

<h3>9. EasyConnect</h3>
<p>学校专属VPN神器！不在学校也能一键连上校内内网，查文献、进教务系统、浏览校内资源全靠它，写论文刚需。</p>

<a href="https://mp.weixin.qq.com/s/fkdqNH6gQF2d9sbFDBoo4g" target="_blank" rel="noopener noreferrer" class="glass-link mt-5 no-underline" style="text-decoration:none">
    <div class="flex items-center">
        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
            <i class="fa fa-book"></i>
        </div>
        <div class="flex-1 min-w-0">
            <span class="glass-link-title font-semibold underline">EasyConnect 使用教程</span>
            <p class="text-xs text-gray-500 mt-0.5 leading-snug">学校图书馆公众号已发布详细连接教程，点击查看</p>
            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">查看教程 <i class="fa fa-angle-right"></i></span>
        </div>
    </div>
</a>
<p class="text-sm text-gray-600 mt-2">说明：学校图书馆官方公众号已整理 EasyConnect 的连接步骤，建议直接跳转查看图文教程。</p>

<h3>10. 学信网</h3>
<p>教育部官方学籍平台！可以查看自己的电子学籍档案。出门旅游忘带学生证，直接出示学信网信息就能买学生票，爱出去玩的同学真的能省超多钱。</p>

<h3>11. 工商银行APP</h3>
<p>本校校园卡、饭卡唯一官方充值渠道！充值饭卡、缴纳校园水电费、校内各类缴费全部依赖它，在校四年刚需必备。</p>

<h2>五、学习辅助AI工具</h2>

<h3>12. 豆包、DeepSeek、Kimi等AI软件</h3>
<p>当代大学生作业救星😋<br>学术灵感发源地，疑难作业终结地（学术不端发源地）</p>

<h2>六、生活娱乐刚需类</h2>

<h3>13. 美团 / 拼好饭</h3>
<p>校园食堂外卖全覆盖！很多时候点外卖比去食堂堂食还划算。食堂外卖可送到宿舍楼下，校外外卖统一送到宿舍楼围栏处，懒人福音。</p>

<blockquote class="border-l-4 border-primary pl-4 italic text-gray-600 my-4">
大学生大都爱吃，食欲很旺，有两个钱都吃掉了。——汪曾祺
</blockquote>

<figure class="text-center my-6 md:max-w-xl mx-auto">
    <img src="../assets/images/food-delivery.jpg" alt="外卖大战时美团上低廉的物价" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">外卖大战时美团上低廉的物价</figcaption>
</figure>

<h3>14. 淘宝、拼多多</h3>
<p>大学生生活费专属消费软件！日常购物、囤生活用品全靠它，同时拼多多可直接查看菜鸟驿站取件码，取快递超方便。</p>

<p>以上就是给新生的必备软件清单，按需下载、合理安排，祝大家开学顺利！</p>

<p>唐山师范学院吧务组<br>2026年8月5日</p>

<figure class="text-center my-6">
    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
</figure>
            ', 1791732251483, 1791732251483);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-2-en', 'en', 'Bar Mod Team 2026 Recruitment Announcement', '2026-07-13', 'Announcement', 'TSNU Bar Mod Team', 'To better serve our fellow bar members and maintain order in the bar, the TSNU Bar Mod Team is now publicly recruiting from across the school. We welcome enthusiastic, responsible, and dedicated students to join us.', '', '                <p>Hello everyone! The TSNU Bar serves as an online space for students across the school to connect and help one another, and we are committed to providing timely, useful campus information and a warm community atmosphere. To better serve our fellow bar members and maintain order in the bar, the Mod Team is now publicly recruiting from across the school. We welcome enthusiastic, responsible, and dedicated students to join us.</p>

                <h2>I. Open Positions</h2>
                <p>This recruitment primarily targets the following positions. You may choose based on your interests and availability:</p>
                <ul>
                    <li><strong>Junior Bar Moderator</strong>: Assist with daily content management, maintain posting order, and answer questions from bar members;</li>
                </ul>

                <h2>II. Who We''re Looking For</h2>
                <ul>
                    <li>Share the Mod Team''s original goal of "serving students and building the community together";</li>
                    <li>Be responsible, manage your time well, and maintain a basic level of online presence;</li>
                    <li>Communicate well and be willing to proactively collaborate when facing difficulties;</li>
                    <li>Those with skills in design, copywriting, video editing, etc. will be given priority, but it is by no means required.</li>
                </ul>

                <h2>III. How to Apply</h2>
                <p>Please submit your application through any of the following methods:</p>
                <ol>
                    <li>Send an email to the Bar Owner Mailbox at <a href="mailto:bazhu@tstc.pp.ua">bazhu@tstc.pp.ua</a>, with the subject line "Recruitment Application + Name + Preferred Position";</li>
                    <li>Scan the QR code on the homepage, join the QQ welcome group, then message an admin privately;</li>
                    <li>In the bar, @ any on-duty Junior Moderator and state your intention to apply.</li>
                </ol>

                <blockquote>Application period: From now until September 5, 2026. We will notify you of the interview arrangement via email or group message within one week after the application deadline.</blockquote>

                <h2>IV. What You''ll Gain</h2>
                <p>Joining the Mod Team is more than just taking on a "role"—it''s gaining a group of like-minded friends and a campus experience of being needed and trusted. We provide official proof of work, regular skills training, and countless nights spent making the bar better together.</p>

                <p>If you also want to leave a little light in the campus that belongs to you, then come join us. We''re at the TSNU Bar, waiting for you.</p>
            ', 1791732251483, 1791732251483);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-2', 'zh', '吧务组 2026 年招新公告', '2026-07-13', '公告', '唐山师范学院吧务组', '为更好地服务广大吧友、维护贴吧秩序，唐山师范学院吧务组现面向全校同学公开招新，欢迎热心、负责的你加入我们。', '', '                <p>各位同学，大家好！唐山师范学院吧作为全校同学交流互助的网络空间，一直致力于为大家提供及时、有用的校园信息与温暖的社区氛围。为更好地服务广大吧友、维护贴吧秩序，吧务组现面向全校同学公开招新，欢迎热心、负责、乐于奉献的你加入我们。</p>

                <h2>一、招新岗位</h2>
                <p>本次招新主要面向以下岗位，你可以根据兴趣与时间选择：</p>
                <ul>
                    <li><strong>小吧主</strong>：协助处理贴吧日常内容，维护发言秩序，解答吧友疑问；</li>
                </ul>

                <h2>二、我们期待这样的你</h2>
                <ul>
                    <li>认同吧务组「服务同学、共建社区」的初衷；</li>
                    <li>有责任感，能合理安排时间，保证基本在线时长；</li>
                    <li>善于沟通，遇到困难愿意主动协作解决；</li>
                    <li>有设计、文案、剪辑等特长者优先，但绝不是必须。</li>
                </ul>

                <h2>三、报名方式</h2>
                <p>请通过以下任意方式提交报名：</p>
                <ol>
                    <li>发送邮件至吧主信箱 <a href="mailto:bazhu@tstc.pp.ua">bazhu@tstc.pp.ua</a>，标题注明「招新报名 + 姓名 + 意向岗位」；</li>
                    <li>扫描首页二维码，加入 QQ 迎新群后私聊管理员；</li>
                    <li>在贴吧内 @ 任一在岗小吧主，说明报名意向。</li>
                </ol>

                <blockquote>报名时间：即日起至 2026 年 9 月 5 日。我们将在报名截止后一周内通过邮件或群消息通知面试安排。</blockquote>

                <h2>四、你能收获什么</h2>
                <p>加入吧务组，不只是多了一份「职务」，更是收获一群志同道合的朋友、一段被需要与被信任的校园经历。我们提供官方工作证明、定期的技能培训，以及无数个一起把贴吧变得更好的夜晚。</p>

                <p>如果你也想在属于自己的校园里留下一点光，那就来吧。我们在唐山师范学院吧，等你。</p>
            ', 1791732251483, 1791732251483);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-3-en', 'en', 'Welcome Season: A Campus Life Guide Every Freshman Must Read', '2026-07-14', 'Guide', 'TSNU Bar Mod Team', 'For the incoming Class of 2026! From check-in procedures to dorm life, from dining options to getting around campus, this one guide eases all your back-to-school anxiety.', '', '                <p>Class of 2026, welcome to Tangshan Normal University! Moving from high school to university, it is perfectly normal to feel both nervous and excited when facing an unfamiliar campus, dorm, and classmates. This guide bundles the most useful things for the start of term into one article—save it first and read it slowly on check-in day.</p>

                <h2>I. How to Get Around on Check-in Day</h2>
                <ul>
                    <li>Confirm your <strong>college, major, and check-in location</strong> in the official school notice beforehand to avoid going to the wrong campus;</li>
                    <li>Bring all original documents—admission letter, ID card, file, and ID photos—in one document folder;</li>
                    <li>Park parent vehicles as directed; there are usually volunteers at the gate to guide you—ask any student in a vest if you get lost;</li>
                    <li>First complete registration at your college''s reception point, then pick up your dorm key.</li>
                </ul>

                <h2>II. Dorm Life Tips</h2>
                <p>Your dorm is your "second home" for the next few years. We suggest agreeing with your roommates early on a schedule, cleaning rotation, and visitor rules—most conflicts build up from small things. High-power appliances and open flames are strictly forbidden, for everyone''s safety.</p>
                <blockquote>A good first relationship with your roommates often starts with cleaning together.</blockquote>

                <h2>III. The Big Deal: Food</h2>
                <p>The school cafeteria usually has several floors with different options for breakfast, lunch, and dinner; there are also snack streets and affordable restaurants nearby. It is normal for your appetite to need adjusting at the start—remember to eat three regular meals, stay up less, and drink more water.</p>

                <h2>IV. Getting Around and Packages</h2>
                <ul>
                    <li>Getting around campus is mostly on foot; for distant teaching buildings, note the classroom numbers on your schedule;</li>
                    <li>Package pickup points are usually in fixed areas—bring your phone and pickup code when collecting;</li>
                    <li>For trips off campus, use licensed ride-hailing or public transit, and save your frequent addresses in your phone.</li>
                </ul>

                <h2>V. Don''t Forget Us</h2>
                <p>When in doubt, feel free to post your questions on TSNU Bar, or @ the mod team in the bar. Scan the QR code on the homepage to join the QQ welcome group, where helpful seniors will answer online. University is long—don''t be afraid to speak up.</p>

                <p>May you meet the self you love at Tangshan Normal University.</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="Tangshan Normal University Bar QQ New Student Group QR Code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ Welcome Group</figcaption>
                </figure>
            ', 1791732251484, 1791732251484);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-3', 'zh', '迎新季：新生必看的校园生活指南', '2026-07-14', '指南', '唐山师范学院吧务组', '即将步入校园的 2026 级新生看过来！从报到流程到宿舍生活，从食堂美食到周边出行，一篇搞定你的开学焦虑。', '', '                <p>2026 级的学弟学妹们，欢迎来到唐山师范学院！从高中走进大学，面对陌生的校园、宿舍和同窗，紧张和期待都再正常不过。这份指南把开学最常用的事揉进了一篇里，建议先收藏，报到当天慢慢看。</p>

                <h2>一、报到当天怎么走</h2>
                <ul>
                    <li>提前在学校官方通知里确认<strong>学院、专业与报到地点</strong>，避免跑错校区；</li>
                    <li>带齐录取通知书、身份证、档案、一寸照片等原件，装在一个文件袋里；</li>
                    <li>家长车辆按指引停放，校门口通常有志愿者引导，找不到路就问穿马甲的同学；</li>
                    <li>先到学院接待点完成注册，再去宿舍领取钥匙。</li>
                </ul>

                <h2>二、宿舍生活小锦囊</h2>
                <p>宿舍是未来几年的「第二个家」。建议和室友尽早约定好作息、卫生轮值与访客规则，很多矛盾都是从小事积累起来的。大功率电器、明火一律禁用，既为安全，也为大家。</p>
                <blockquote>和室友的第一次好好相处，往往从一次共同的打扫开始。</blockquote>

                <h2>三、吃饭这件大事</h2>
                <p>学校食堂一般有多个楼层，早中晚风味不同；校园周边也有小吃街与平价餐馆。刚开学胃口不适应很正常，记得规律三餐，少熬夜、多喝水。</p>

                <h2>四、出行与快递</h2>
                <ul>
                    <li>校内出行以步行为主，远一点的教学楼留意课表上的教室编号；</li>
                    <li>快递点通常集中在固定区域，取件记得带手机和取件码；</li>
                    <li>外出建议使用正规打车或公交，把常用地址存进手机。</li>
                </ul>

                <h2>五、别忘了我们</h2>
                <p>遇到拿不准的事，欢迎来唐山师范学院吧发帖提问，或在贴吧里 @ 吧务组。扫描首页二维码加入 QQ 迎新群，会有热心的学长学姐在线答疑。大学很长，别怕开口。</p>

                <p>祝你在唐师，遇见喜欢的自己。</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251484, 1791732251484);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-4-en', 'en', 'A Friendly Reminder on Posting Etiquette in the Bar', '2026-07-14', 'Notice', 'TSNU Bar Mod Team', 'To foster a civilized and friendly environment for communication, please observe the basic rules of the Bar and help us protect our shared online campus home.', '', '                <p>Dear fellow bar members, the TSNU Bar is our shared online space. So that every student can communicate here with peace of mind and speak freely, the Mod Team has put together a small reminder about posting etiquette. We kindly ask that you keep it in mind when posting and commenting.</p>

                <h2>I. Be Gentle with One Another</h2>
                <p>On the other end of the network are real people. We encourage the clash of ideas, but we reject unfriendly speech such as personal attacks, regional discrimination, and gender antagonism. A word of "I understand how you feel" is often more powerful than a rebuttal. For suggestions regarding the school''s work, we recommend first giving feedback to your counselor or department leadership; the Mod Team members are fellow students who can relate to your concerns—please do not post dangerous remarks in the Bar that could bring trouble upon yourself, as rational feedback is more likely to resolve issues.</p>

                <h2>II. Please Do Not Post This Information</h2>
                <ul>
                    <li>Others'' real names, phone numbers, home addresses, and other personal privacy;</li>
                    <li>Unverified rumors and misinformation;</li>
                    <li>Advertising, click-farming, part-time job solicitation, and other marketing content;</li>
                    <li>Images or text that violate laws, regulations, or platform rules.</li>
                </ul>

                <h2>III. What to Do When You Encounter Violations</h2>
                <p>If you come across inappropriate content, there is no need to argue in person—you can click "Report" at the bottom right of the post, or directly @ the on-duty junior moderator. We will handle it as soon as possible and protect the privacy of the reporter.</p>

                <blockquote>Civil posting begins with three seconds of thought before every "Send". Thank you for making this Bar feel more like a home.</blockquote>

                <h2>IV. On Post Deletion and Appeals</h2>
                <p>All actions by the Mod Team follow the principles of transparency and prudence. If you believe a post was deleted by mistake, you are welcome to explain the situation through the "Feedback" section on the homepage or via the moderator mailbox, and we will carefully review and respond.</p>

                <p>May our Bar remain bright, warm, and trustworthy.</p>
            ', 1791732251484, 1791732251484);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-4', 'zh', '关于规范贴吧发言秩序的温馨提示', '2026-07-14', '通知', '唐山师范学院吧务组', '为营造文明、友善的交流环境，请各位吧友遵守贴吧基本规范，共同维护属于我们的校园网络家园。', '', '                <p>亲爱的吧友们，唐山师范学院吧是我们共同的网络空间。为了让每一位同学都能在这里安心交流、畅所欲言，吧务组整理了一份发言秩序的小提醒，恳请大家在发帖、评论时多多留意。</p>

                <h2>一、请对彼此温柔一点</h2>
                <p>网络另一头也是真实的人。我们鼓励观点碰撞，但拒绝人身攻击、地域黑、性别对立等不友善言论。一句「我理解你的感受」，往往比一句反驳更有力量。对学校工作的意见建议，建议优先向辅导员、院系领导反馈；吧务组成员同为学生，能体谅大家的诉求，切勿在贴吧发布危险言论引火上身，理性反馈更易解决问题。</p>

                <h2>二、这些信息请不要发</h2>
                <ul>
                    <li>他人的真实姓名、电话、住址等个人隐私；</li>
                    <li>未经核实的谣言与不实信息；</li>
                    <li>广告、刷单、兼职引流等营销内容；</li>
                    <li>违反法律法规或平台规则的图文。</li>
                </ul>

                <h2>三、遇到违规内容怎么办</h2>
                <p>如果你看到了不合适的内容，不必亲自下场争论，可以点击帖子右下角的「举报」，或直接 @ 在岗小吧主。我们会尽快处理，也保护举报人的隐私。</p>

                <blockquote>文明发言，从每一次「发送」前的三秒思考开始。感谢你，让这个贴吧更像一个家。</blockquote>

                <h2>四、关于删帖与申诉</h2>
                <p>吧务组的操作都遵循公开、审慎的原则。如果你认为某条内容被误删，欢迎通过首页「意见反馈」或吧主信箱说明情况，我们会认真复核并回复。</p>

                <p>愿我们的贴吧，始终明亮、温暖、值得信赖。</p>
            ', 1791732251484, 1791732251484);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-5-en', 'en', 'TSNU Bar Network-Wide Anti-Fraud Alert', '2026-07-15', 'Announcement', 'TSNU Bar Mod Team', 'During the admissions season, scams surge. The Mod Team issues a network-wide anti-fraud alert, outlining common scam tactics, official statements, and penalty rules. All members are urged to read carefully and share with others.', '', '                <p>To all TSNU students, incoming Class of 2026, and parents,</p>
                <p>We are now at a critical stage of admissions inquiries and new-student preparation, when all kinds of campus and admissions scams surge. Recently, this bar has repeatedly found unfamiliar out-of-province IP accounts impersonating our senior students and current students, using the pretext of campus Q&amp;A and enrollment guidance to privately sell goods or charge fees for proxy services. Such fraud seriously disrupts the order of the bar and harms students'' property safety and legitimate rights.</p>
                <p>To eliminate these fraudulent practices and protect the personal, property, and information security of all members, and to maintain a pure, legitimate, and safe communication environment on the TSNU Bar, the Mod Team hereby issues this network-wide anti-fraud alert, clarifying common scam tactics, prevention rules, and platform management regulations. Please read it carefully, share it with others, and strictly comply.</p>

                <h2>I. High-Risk Scam Tactics (Everyone Must Guard Against)</h2>

                <h3>1. Out-of-Province IPs Impersonating Seniors</h3>
                <p>Numerous unfamiliar out-of-province IP accounts, not based in Tangshan, disguise themselves as our senior students, student leaders, or campus volunteers, and proactively message Freshmen and lower-grade students, gaining trust through claims of "one-on-one enrollment guidance," "internal campus info," or "sharing experience from those who''ve been there." These accounts have no verified school identity and no real campus activity; their sole purpose is traffic, profit, and fraud. They are the epicenter of recent campus scams—highly covert and with a very high victim rate.</p>

                <h3>2. Selling Counterfeit Goods Under the Guise of Seniors</h3>
                <p>Relying on their fake identities, scammers use bait like "campus-exclusive discounts," "must-have Freshman supplies," or "group-buy deals" to privately peddle military-training uniforms, bedding and mattresses, campus phone cards, study materials, storage items, CET-4/6 materials, and postgraduate entrance exam papers. The goods sold are mostly low-quality, unbranded, or pirated, with no after-sales service or guarantee; once paid, the sellers block and ghost you. This is a typical campus scam.</p>

                <h3>3. Fake Admissions Consulting and Paid Proxy Services</h3>
                <p>All unofficial accounts, under the name of the school or posing as seniors, falsely claim they can handle enrollment procedures, dorm reassignments, major consultations, course selection guidance, or club pre-arrangements, luring private transfers under names like "service fee," "expedite fee," "proxy fee," or "deposit." We solemnly state: all school processes—admissions, registration, dorm assignment, and major transfer—have no private proxy services and no extra charges whatsoever.</p>

                <h3>4. Fake Freshman Group Recruitment Scams</h3>
                <p>Scammers privately create various unofficial "TSNU Freshman groups, Q&amp;A groups, benefit groups," impersonate administrators to post false notices and fake benefits, promote products in the groups, drive traffic for profit, and harvest Freshmen''s private information such as names, phone numbers, admission details, and family information—later committing targeted fraud or illegally reselling data.</p>

                <h2>II. Official Solemn Statements</h2>

                <h3>1. The School Has No Private Admissions Agents</h3>
                <p>The TSNU Admissions Office and all departments have never authorized any off-campus personnel, current students, online influencers, or bar users to conduct admissions consulting, paid proxy services, or goods sales. All fee-based services in a private name are fraud.</p>

                <h3>2. School Students Do Not Coerce Sales</h3>
                <p>Legitimate enrolled students will not, through unfamiliar private messages or out-of-province IP accounts, privately coerce or induce Freshmen to buy supplies or sign up for paid services. All private transactions are unofficial.</p>

                <h3>3. The Only Official Information Channels</h3>
                <p>All authoritative information—admissions policies, enrollment guidelines, registration procedures, dorm arrangements, and fee standards—is released only through the TSNU official website, the official admissions WeChat account, and notices from the school Admissions Office. This bar is merely a communication platform; all unofficial statements are for reference only. Do not trust and transfer money based on them.</p>

                <h2>III. Bar Management Penalty Rules</h2>

                <p>To root out fraud, the Mod Team will launch a comprehensive anti-fraud rectification campaign and deal strictly with violating accounts:</p>

                <h3>1. Strict Crackdown on Impersonation Accounts</h3>
                <p>We will strictly investigate out-of-province IPs impersonating our seniors and fake Q&amp;A/traffic-driving accounts. Once verified, they will be permanently banned and blocked, and their posts deleted.</p>

                <h3>2. Private Sales and Promotion Strictly Prohibited</h3>
                <p>All private accounts are strictly prohibited from selling campus supplies, promoting phone cards, peddling materials, or offering paid proxy services within this bar or via private messages. Violators will be permanently muted and banned.</p>

                <h3>3. Unauthorized Traffic Redirection Strictly Prohibited</h3>
                <p>Publicly posting unofficial Freshman groups, traffic-driving QR codes, or private contact info is strictly prohibited, to eliminate all scam-traffic behavior.</p>

                <h3>4. Illegal Acts Referred to Authorities</h3>
                <p>For accounts that spread rumors, run fake admissions schemes, induce transfers, or defraud others of property, the Mod Team will, in addition to platform bans, preserve evidence and, when necessary, refer the case to the school security office and public security authorities.</p>

                <h2>IV. Anti-Fraud Precautions for Everyone</h2>

                <h3>1. Refuse Private Transactions</h3>
                <p>Do not add strangers who message you privately, and do not believe in "senior-exclusive deals." For all daily and study supplies, prefer official platforms and on-campus stores. Firmly reject private transfers and offline private deals.</p>

                <h3>2. Verify Account Identity</h3>
                <p>When encountering "seniors" who proactively offer guidance or push products, be sure to verify their real identity. Out-of-province unfamiliar IPs, accounts with no campus activity, and newly registered small accounts should all be treated as high-risk scam accounts—block and report them immediately.</p>

                <h3>3. Protect Personal Privacy</h3>
                <p>Never disclose admission details, ID numbers, phone numbers, home addresses, bank card information, or any verification codes to strangers, to prevent information leaks that lead to secondary fraud.</p>

                <h3>4. Verify Through Multiple Channels</h3>
                <p>For any questions involving payments, proxy services, or enrollment policies, first check the school''s official channels or consult your counselor or official teachers. Do not trust strangers online.</p>

                <h3>5. Report Promptly</h3>
                <p>If you encounter scam-traffic, fake sales, or identity impersonation, take screenshots as evidence promptly and report them via private message to the Mod Team, so we can work together to combat fraud.</p>

                <p>Anti-fraud is everyone''s responsibility! We hope all TSNU students stay vigilant, keep your eyes open, abandon any fluke mentality, and stay away from all campus cyber scams. Let us jointly maintain a safe, civilized, and clean campus online environment!</p>

                <p><strong>TSNU Bar Mod Team</strong><br>Published: July 15, 2026</p>
            ', 1791732251484, 1791732251484);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-5', 'zh', '唐山师范学院吧全网反诈防骗公告', '2026-07-15', '公告', '唐山师范学院吧务组', '招生季诈骗高发，吧务组发布全网反诈防骗公告，梳理常见诈骗套路、官方声明与处罚规定，请全体吧友认真阅读、相互转告。', '', '                <p>各位唐师学子、2026级新生及各位家长：</p>
                <p>当前正值招生咨询、新生入学筹备关键阶段，各类校园网络诈骗、招生诈骗进入高发期。近期本吧多次发现外省陌生IP用户冒充本校学长学姐、在校生，假借校园答疑、入学指导名义，私下开展物品售卖、收费代办等诈骗行为，严重扰乱贴吧秩序，侵害同学们的财产安全与合法权益。</p>
                <p>为杜绝各类诈骗乱象，守护全体吧友人身、财产及信息安全，维护唐山师范学院贴吧纯净、正规、安全的交流环境，吧务组特此发布全网反诈防骗公告，明确诈骗套路、防范细则及平台管理规定，请全体人员认真阅读、相互转告、严格遵守。</p>

                <h2>一、重点高发诈骗套路（全员重点防范）</h2>

                <h3>1. 外省IP冒充学长学姐精准诈骗</h3>
                <p>大量非唐山本地、外省陌生IP账号，伪装本校高年级学长学姐、学生干部、校园志愿者，主动私信新生、低年级学生，以"一对一入学答疑""校内内部资讯""过来人经验分享"博取信任。此类账号无本校真实身份认证，无校园生活动态，仅以引流、牟利、诈骗为目的，是近期校园诈骗重灾区，隐蔽性极强、受骗率极高。</p>

                <h3>2. 假借学长学姐身份售卖伪劣物品诈骗</h3>
                <p>诈骗分子依托伪装身份，以"校园专属优惠""新生必备物资""团购特价"为噱头，私下兜售军训服、被褥床垫、校园电话卡、学习资料、收纳用品、四六级资料、考研真题等各类物品。所售商品多为劣质三无产品、盗版资料，无售后、无保障，收款后直接拉黑失联，属于典型校园套路诈骗。</p>

                <h3>3. 虚假招生咨询、收费代办诈骗</h3>
                <p>所有非官方账号，假借学校名义、学长学姐身份，谎称可代办入学手续、宿舍调剂、专业咨询、选课指导、社团内定等服务，以"服务费、加急费、代办费、押金"等名目诱导私下转账。郑重说明：学校招生录取、入学报到、宿舍分配、专业调剂等所有流程无任何私人代办、无任何额外收费。</p>

                <h3>4. 虚假新生群引流诈骗</h3>
                <p>诈骗分子私自搭建各类非官方"唐师新生群、答疑群、福利群"，冒充管理人员发布不实通知、虚假福利，在群内推销产品、引流牟利、套取新生姓名、手机号、录取信息、家庭信息等隐私资料，后续实施精准诈骗、信息倒卖等违规违法行为。</p>

                <h2>二、官方郑重声明</h2>

                <h3>1. 学校无任何私人招生代办</h3>
                <p>唐山师范学院招生办、各院系从未授权任何校外人员、在校生、网络博主、贴吧用户开展招生咨询、收费代办、物资售卖等相关工作，所有私人名义的收费服务均为诈骗。</p>

                <h3>2. 本校学生无强制售卖行为</h3>
                <p>本校正规在校生不会通过陌生私信、外省IP账号，私下强制或诱导新生购买各类物资、办理各类付费业务，一切私下交易均非官方行为。</p>

                <h3>3. 唯一官方信息渠道</h3>
                <p>学校招生政策、入学须知、报到流程、宿舍安排、收费标准等所有权威信息，仅以唐山师范学院官方网站、官方招生公众号、学校招生办通知为准，本吧仅作交流平台，所有非官方言论仅供参考，切勿轻信转账。</p>

                <h2>三、贴吧管理处罚规定</h2>

                <p>为根治诈骗乱象，吧务组将开展全面反诈整治行动，对违规账号从严处理：</p>

                <h3>1. 严查冒充账号</h3>
                <p>严查外省IP冒充本校学长学姐、虚假答疑引流账号，一经核实，直接永久封禁、删帖拉黑。</p>

                <h3>2. 严禁私人售卖推广</h3>
                <p>严禁一切私人账号在本吧及私信售卖校园物资、推广电话卡、兜售资料、有偿代办，违者永久禁言、封禁处理。</p>

                <h3>3. 严禁私自引流</h3>
                <p>严禁私自发布非官方新生群、引流二维码、私人联系方式，杜绝各类诈骗引流行为。</p>

                <h3>4. 违法移交处理</h3>
                <p>对于造谣传谣、虚假招生、诱导转账、骗取他人财物的账号，除平台封禁外，吧务组将留存证据，必要时移交学校保卫处及公安机关处理。</p>

                <h2>四、全员反诈防骗须知</h2>

                <h3>1. 拒绝私下交易</h3>
                <p>不添加陌生私信好友、不相信"学长学姐专属优惠"，所有生活用品、学习物资优先选择正规平台、校园商超购买，坚决杜绝私人转账、线下私下交易。</p>

                <h3>2. 核验账号身份</h3>
                <p>遇到主动答疑、推销物品的"学长学姐"，务必核验真实身份，外省陌生IP、无校园动态、新注册小号一律视为诈骗高危账号，直接拉黑举报。</p>

                <h3>3. 保护个人隐私</h3>
                <p>绝不向陌生人泄露录取信息、身份证号、手机号、家庭住址、银行卡信息及各类验证码，谨防信息泄露引发次生诈骗。</p>

                <h3>4. 遇事多方核实</h3>
                <p>任何涉及缴费、代办、入学政策的问题，第一时间查询学校官方渠道，或咨询辅导员、官方老师，不轻信网络陌生人。</p>

                <h3>5. 及时举报维权</h3>
                <p>如遇诈骗引流、虚假售卖、冒充身份等违规行为，及时截图留存证据，私信吧务组举报，全力配合整治反诈乱象。</p>

                <p>反诈防骗，人人有责！希望全体唐师学子提高警惕、擦亮双眼，摒弃侥幸心理，远离各类校园网络诈骗。共同维护安全、文明、纯净的校园网络环境！</p>

                <p><strong>唐山师范学院贴吧吧务组</strong><br>发布日期：2026年7月15日</p>
            ', 1791732251485, 1791732251485);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-6-en', 'en', 'Freshman Guide (1) — Is the Campus Phone Card Worth Getting?', '2026-07-16', 'Guide', 'TSNU Bar Mod Team', 'New students are often promoted campus phone cards before and after enrollment. This article objectively explains the official on-campus channels for the campus phone card, the real Unicom card pricing, and dorm WiFi access, and clarifies that the claim ''you can''t access on-campus resources without a card'' is false. Getting a card is entirely voluntary — choose as needed.', '', '                <p>Dear new students:</p>
                <p>Around enrollment, many people promote campus phone cards. Quite a few new students cannot tell official channels from scams, and are unsure whether getting one is necessary. This article objectively and comprehensively explains all the facts about the campus Unicom card. The school does not require anyone to get a card, so you can decide for yourself based on your situation.</p>

                <h2>I. Use the Only Official Channel and Beware of Sales Scams</h2>

                <h3>1. Official Authorized Outlets</h3>
                <p>Only the on-campus Unicom service hall is the official partner outlet that can issue the campus phone card enabling dormitory-exclusive WiFi. Plan contracts and pricing rules are fully transparent, and you can review all terms on the spot.</p>

                <h3>2. Watch Out for Scammers Posing as Senior Students</h3>
                <p>Recently, scams have been frequent in the Tieba forum and new-student groups: accounts from other provinces with unfamiliar IPs, off-campus people pretending to be seniors or orientation volunteers, contacting students via private messages or going door-to-door in dormitories to sell phone cards.</p>
                <ul>
                    <li>These people have no real affiliation with the school; their plans hide misleading fine print, overstate data allowances, and offer no after-sales support.</li>
                    <li>Phone cards sold privately (not at the service hall) cannot activate the dormitory WiFi, and after you pay you can easily be blocked and left unable to reach the seller.</li>
                    <li>Any promotion that is not handled on-site at the on-campus Unicom service hall and instead asks you to transfer money privately online is suspicious fraud — do not trust it.</li>
                </ul>

                <h2>II. Full Details on the Campus Unicom Card''s Real Pricing and Network Access</h2>

                <h3>1. Fixed Pricing</h3>
                <p>The Unicom campus phone card here has a flat rate of 39 yuan/month, with no gimmicks such as long-term discounts or hidden offers. Each month includes 20GB of nationwide data and 260GB of in-province data; if unused, up to 20GB of nationwide data and 140GB of in-province data can roll over to the next month. That is indeed a large amount, roughly equivalent to unlimited data, but to be objective: this monthly fee is not cheap among student data plans.</p>

                <h3>2. Dormitory WiFi Usage Rules</h3>
                <p>The campus has exclusive Unicom WiFi in the teaching buildings, library, and dormitory areas; access to this WiFi is tied to the campus Unicom card:</p>
                <ul>
                    <li>When the card is properly activated and not in arrears, you can connect directly to the dormitory WiFi with a stable connection.</li>
                    <li>Without a campus phone card, or if the card is suspended for non-payment, you cannot connect to the dormitory’s exclusive WiFi.</li>
                </ul>

                <h3>3. Supplementary Note on Accessing On-Campus Learning Resources (Key Fact)</h3>
                <p>Many people mislead Freshmen by claiming ''you can''t access on-campus resources without a campus phone card'' — this is false: the school provides a free official VPN service to all enrolled students. You can log in with your student ID and unified identity account. Whether or not you have a Unicom campus phone card, as long as your phone or computer has any other internet connection, you can connect to the school''s free VPN and normally access all internal resources such as the library databases and the academic affairs system, with no resource restrictions.</p>

                <h2>III. Reference Advice on Getting a Campus Phone Card: Entirely Voluntary, Choose as Needed</h2>
                <p>The school and individual colleges will not force any student to get a campus phone card; simply decide based on your current phone plan and internet needs:</p>

                <h3>1. When Getting a Campus Phone Card Is Recommended</h3>
                <ol>
                    <li>You spend long hours online in the dorm watching shows, attending online classes, or downloading files, and need stable dorm WiFi.</li>
                    <li>Your current plan costs more than 39 yuan/month with little data, and no better-value option is available.</li>
                    <li>You would rather not log into the VPN manually every time you look up papers or use the academic system, and prefer the convenience of one-tap direct WiFi access.</li>
                </ol>

                <h3>2. When Getting a Campus Phone Card Is Not Recommended</h3>
                <ol>
                    <li>You already have a cheaper plan with plenty of data and only use the internet lightly.</li>
                    <li>Your dorm internet needs are minimal, and you are willing to use the school’s free VPN to access on-campus resources.</li>
                    <li>You do not want the fixed 39 yuan/month cost long-term and have a limited budget.</li>
                </ol>

                <h2>IV. Pitfall Summary for New Students Getting a Card</h2>
                <ol>
                    <li>Only go to the on-campus Unicom service hall to get a card; reject door-to-door dorm visits and online promotions from out-of-province accounts.</li>
                    <li>The 39 yuan/month plan is not competitively priced — don’t follow the crowd and sign up blindly.</li>
                    <li>Distinguish the two types of network access: dorm WiFi requires the campus phone card, but on-campus learning resources can be reached via the free VPN whether or not you have a card — don’t be misled by false claims.</li>
                    <li>Any claim that "you can''t look up papers or use the academic system without a campus phone card" is false advertising. If you encounter a suspicious promoter, promptly notify your counselor, the dorm manager, or the campus security office.</li>
                    <li>If you fall victim to a sales scam, keep screenshots of the chats and transfers, and contact the Tieba moderators or the school’s network information center to report it.</li>
                </ol>

                <p>TSNU Bar Mod Team<br>July 16, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="Tangshan Normal University Bar QQ new-student group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the Tangshan Normal University Bar QQ new-student group</figcaption>
                </figure>
            ', 1791732251485, 1791732251485);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-6', 'zh', '新生指南（一）-校园卡是否值得办', '2026-07-16', '指南', '唐山师范学院吧务组', '新生入学前后常被推销校园电话卡，本文客观说明校内正规办卡渠道、联通卡真实资费与宿舍WiFi权限，并澄清『不办卡不能访问校内资源』为不实宣传，办卡完全自愿、按需选择。', '', '                <p>各位新同学：</p>
                <p>入学前后大量人员会推销校园电话卡，不少新生分不清正规渠道与诈骗套路，同时纠结是否有办理必要。本文客观、完整说明校园联通卡相关全部事实，学校无强制办卡要求，大家可结合自身情况自主选择。</p>

                <h2>一、认准唯一正规办卡渠道，警惕各类推销诈骗</h2>

                <h3>1. 官方正规办理点位</h3>
                <p>可开通校内宿舍专属WiFi的校园卡，仅校内联通线下营业厅为官方合作办理点，套餐合约、资费规则全部公开透明，可现场核对全部条款。</p>

                <h3>2. 重点防范冒充学长学姐的诈骗行为</h3>
                <p>近期贴吧、新生群高发诈骗：外省陌生IP账号、校外人员伪装学长、迎新志愿者，线上私信、宿舍上门推销电话卡。</p>
                <ul>
                    <li>此类人员无本校真实身份，套餐暗藏文字陷阱，流量虚标、售后无保障；</li>
                    <li>私下售卖的非营业厅电话卡无法开通校内宿舍WiFi，缴费后极易被对方拉黑失联；</li>
                    <li>只要不是在校内联通营业厅现场办理、需要线上私下转账办卡的推销，全部属于可疑诈骗，切勿轻信。</li>
                </ul>

                <h2>二、校园联通卡真实资费、网络权限完整说明</h2>

                <h3>1. 固定资费标准</h3>
                <p>本校联通校园卡月租统一39元/月，无长期低价减免、隐藏优惠等噱头。每月有20GB全国通用流量和260GB省内流量，如未用完，最多可以有20GB全国通用流量和140GB省内流量转结至下个月，流量确实不少，可以约等于不限量流量，但客观说明：该月租在学生流量套餐里并不便宜。</p>

                <h3>2. 校内宿舍WiFi使用规则</h3>
                <p>教学楼、图书馆、宿舍区有校内专属联通WiFi，该WiFi权限与校园联通卡绑定：</p>
                <ul>
                    <li>正常办理、无欠费状态下，可直接连接宿舍校内WiFi，网速稳定；</li>
                    <li>未办理校园卡、校园卡停机欠费，无法连接宿舍专属校内WiFi。</li>
                </ul>

                <h3>3. 校内学习资源访问补充说明（关键事实）</h3>
                <p>很多人会误导新生“不办校园卡就看不了校内资源”，此说法不实：学校为全体在校生免费提供官方VPN服务，使用学号、统一身份认证账号即可登录，无论是否办理联通校园卡，只要手机/电脑有其他流量网络，连接学校免费VPN，就能正常访问图书馆数据库、教务系统等全部校内内网资源，不存在资源限制。</p>

                <h2>三、办理校园卡参考建议：完全自愿，按需选择</h2>
                <p>学校、各学院不会强制任何学生办理校园卡，大家根据自身现有手机卡、上网需求判断即可：</p>

                <h3>推荐办理校园卡的情况</h3>
                <ol>
                    <li>日常长时间在宿舍上网追剧、上网课、下载文件，对宿舍稳定WiFi需求高；</li>
                    <li>目前在用手机卡月租高于39元，流量少，没有更划算的流量套餐；</li>
                    <li>不希望每次查文献、登教务系统都手动登录VPN，追求一键直连内网WiFi的便捷性。</li>
                </ol>

                <h3>不建议办理校园卡的情况</h3>
                <ol>
                    <li>已有月租更低、流量充足的手机卡，日常仅少量上网；</li>
                    <li>宿舍上网需求很低，查校内资源时愿意使用学校免费VPN访问；</li>
                    <li>不想长期承担39元每月固定话费，预算有限。</li>
                </ol>

                <h2>四、新生办卡避坑总结</h2>
                <ol>
                    <li>办卡仅前往校内联通营业厅，拒绝宿舍上门、外省IP私信线上推销；</li>
                    <li>39元月租套餐价格不占优势，不要跟风盲目办理；</li>
                    <li>区分两大网络权限：宿舍WiFi需要校园卡，校内学习资源有无校园卡都能通过免费VPN访问，不要被虚假话术误导；</li>
                    <li>凡是声称“不办校园卡不能查论文、不能登教务系统”均为虚假宣传，遇到可疑推销人员可及时告知辅导员、宿管或学校保卫处；</li>
                    <li>若不慎遭遇推销诈骗，保留聊天、转账截图，可联系贴吧吧务或学校网信中心反馈。</li>
                </ol>

                <p>唐山师范学院吧务组<br>2026年7月16日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251485, 1791732251485);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-7-en', 'en', 'Freshman Guide (2) – Campus Dining Halls & Shopping', '2026-07-18', 'Guide', 'TSNU Bar Mod Team', 'An on-the-ground overview of dining halls, on-campus stores, and nearby malls across TSNU''s two campuses: three dining halls at Daxuedao plus Tangbai and Zhengzhaofeng bulk supermarkets, the Xueyuan Road dining hall and Hema Fresh at Aegean Shopping Park, plus general campus living tips.', '', '                <p>The university has two main campuses—Daxuedao and Xueyuan Road—and they differ significantly in dining hall distribution, on-campus stores, and nearby large shopping malls.</p>
                <p>All information here is based on real on-campus observations. Dining and shopping are covered in one place; for a fuller picture, read it together with the previous article, "Is the Campus Phone Card Worth Getting?"</p>

                <h2>I. Daxuedao Campus (156 Jianshe North Road) Dining Guide</h2>
                <p>The campus is divided into two areas, South Yard and North Yard, with three dining halls in total. The three halls are fairly similar in menu and pricing, and all accept the campus one-card for payment.</p>

                <h3>1. North Yard New Dining Hall</h3>
                <p>This hall is relatively new and clean inside, but it sits near only a couple of North Yard dorm buildings, so most students have a long walk to and from meals.</p>

                <h3>2. South Yard First Dining Hall &amp; Campus Life Hall</h3>
                <p>These two are the closest dining spots to the dorms on the whole campus, and the vast majority of South and North Yard students choose them daily.</p>
                <ul>
                    <li>First Dining Hall: right next to the teaching buildings, convenient for a meal on the way to and from class; it has self-service campus-card machines for top-ups, loss reporting, and card replacement, plus a separate ethnic-minority dining area on the south side.</li>
                    <li>Campus Life Hall: a mixed dining area with various food stalls and a small on-campus supermarket inside. But this store has limited selection and low value for money, so it is only good for grabbing small emergency items—not recommended for bulk stocking, fresh produce, or large household goods.</li>
                </ul>

                <h3>3. Two Major Supermarkets Near Daxuedao Campus (Top Pick for Bulk Shopping)</h3>
                <p>Besides the on-campus dining halls, there are two well-regarded local supermarkets near Daxuedao, ideal for one-stop bulk shopping.</p>
                <ul>
                    <li><strong>Tangbai Supermarket (Basement 1, Renmin Shopping Plaza)</strong>: a few hundred meters from campus, within walking distance. A long-established local Tangshan chain with a full range of grains, toiletries, snacks, and frozen fresh food at stable prices—great for one-time dorm stock-ups.</li>
                    <li><strong>Zhengzhaofeng Fresh Supermarket (Basement 1, Yuanyangcheng Shopping Center)</strong>: an extremely well-reviewed local fresh-food supermarket about 1 km from campus. It offers abundant fresh produce, prepared dishes, and daily goods; Yuanyangcheng is a full shopping mall where you can shop, watch movies, and dine after—a popular weekend destination.</li>
                </ul>

                <h2>II. Xueyuan Road Campus (41 Xueyuan North Road) Dining &amp; Commercial District Guide</h2>
                <h3>1. On-Campus Dining Overview</h3>
                <p>Xueyuan Road is the older campus with generally dated facilities; its dining hall is small and offers a limited variety of dishes.</p>

                <h3>2. Extra Dining Option: Nearby Merchant Meal-Order Groups</h3>
                <p>Merchants near campus run exclusive budget bento delivery groups—affordable and delivered right to campus, a handy backup when the dining hall gets repetitive.</p>

                <h3>3. Nearby Core Commercial District: Aegean Shopping Park</h3>
                <p>The campus sits in a bustling central district of Tangshan; a short walk reaches Aegean Shopping Park, whose basement houses the first Hema Fresh store in Hebei Province.</p>
                <p>Hema features premium live seafood, same-day fresh produce, and prepared dishes, with fast online delivery to campus; the mall covers dining, clothing, and entertainment for one-stop shopping and strolling—the top choice for Xueyuan Road students to buy fresh food and unwind on weekends.</p>

                <h2>III. General Campus Living Tips (Linked to the Campus Phone Card Guide)</h2>
                <ol>
                    <li>All on-campus dining halls accept only the Campus Card; no campus WiFi is needed to use them;</li>
                    <li>Library, academic affairs system, and other on-campus network resources: accessible whether or not you get the Unicom campus phone card. Without the card you can use the school free VPN; the campus phone card is optional—beware of scams where people posing as seniors push data or campus phone cards;</li>
                    <li>Shopping plan: for emergency small items, go to the Campus Life Hall mini-supermarket; for bulk daily goods and fresh stock, Daxuedao students choose Renmin Tangbai or Yuanyangcheng Zhengzhaofeng Fresh, while Xueyuan Road students head straight to Aegean Hema Fresh;</li>
                    <li>Dining route reference: after class, pick the nearest First Dining Hall/Life Hall; the few North Yard dorm students can use the North Yard New Dining Hall; Xueyuan Road on-campus hall is limited, so join a nearby delivery group for more variety.</li>
                </ol>

                <a href="https://tieba.baidu.com/p/9742158220" target="_blank" rel="noopener noreferrer" class="glass-link mt-2 no-underline" style="text-decoration:none">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
                            <i class="fa fa-star"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <span class="glass-link-title font-semibold underline">Campus Dining Hall Ratings Collection</span>
                            <p class="text-xs text-gray-500 mt-0.5 leading-snug">The Mod Team organized seniors to rate every dining hall stall on campus</p>
                            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">View Ratings <i class="fa fa-angle-right"></i></span>
                        </div>
                    </div>
                </a>
                <a href="https://tieba.baidu.com/p/9774588530" target="_blank" rel="noopener noreferrer" class="glass-link mt-4 no-underline" style="text-decoration:none">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
                            <i class="fa fa-star"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <span class="glass-link-title font-semibold underline">Nearby Mall Ratings Collection</span>
                            <p class="text-xs text-gray-500 mt-0.5 leading-snug">The Mod Team organized seniors to rate the malls around campus</p>
                            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">View Ratings <i class="fa fa-angle-right"></i></span>
                        </div>
                    </div>
                </a>

                <p>TSNU Bar Mod Team<br>July 18, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ new-student group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ new-student group</figcaption>
                </figure>
            ', 1791732251485, 1791732251485);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-7', 'zh', '新生指南（二）-学校食堂、购物相关', '2026-07-18', '指南', '唐山师范学院吧务组', '唐山师范学院两大校区食堂、校内商超与周边商场实地整理：大学道校区三处食堂与唐百、郑兆丰两大囤货商超，学院路校区食堂与爱琴海盒马鲜生，并附全校区通用生活小贴士。', '', '                <p>学校分为大学道校区、学院路校区两大校区，食堂分布、校内商超、周边大型商场差别较大。</p>
                <p>本篇全部是在校实测真实信息，就餐、采购一站式整理完毕，搭配上篇《校园卡是否值得办》阅读更全面。</p>

                <h2>一、大学道校区（建设北路156号）食堂指南</h2>
                <p>校区划分南苑、北苑两大片区，校内共有三处食堂。三处食堂餐品、定价整体差距不大，全部支持校园一卡通刷卡就餐。</p>

                <h3>1. 北苑新食堂</h3>
                <p>食堂建成时间较新，内部环境干净崭新，但仅靠近北苑少数两三栋宿舍楼，大部分同学就餐往返路程较远。</p>

                <h3>2. 南苑一食堂 &amp; 师院生活馆</h3>
                <p>这两处是整个校区距离宿舍区最近的就餐点，绝大多数南苑、北苑学生日常优先选择。</p>
                <ul>
                    <li>一食堂：紧邻教学楼，上下课顺路就餐；食堂内设有校园卡自助机，可自助充值、挂失、补办饭卡，南侧单独设立民族食堂。</li>
                    <li>师院生活馆：复合型就餐区域，除各类餐饮档口外，馆内附带一间校内小型超市。但这家校内超市商品种类有限，性价比偏低，仅适合临时应急购买小件物品，不建议大批量囤货、采购生鲜或大件生活用品。</li>
                </ul>

                <h3>大学道校区周边两大商超（日常囤货首选）</h3>
                <p>除校内食堂外，大学道校区周边有两处本地口碑商超，适合一次性囤货采购。</p>
                <ul>
                    <li><strong>唐百超市（人民购物广场地下一层）</strong>：距校区几百米，步行可达。唐山本土老牌连锁商超，粮油、洗护、零食、冷冻生鲜品类齐全，价格稳定，适合一次性采购宿舍长期生活用品。</li>
                    <li><strong>郑兆丰生鲜超市（远洋城购物中心地下一层）</strong>：本地口碑极佳的生鲜商超，距离校区约1公里。生鲜果蔬、预制菜、日用百货新鲜丰富；远洋城是综合商场，采购完可逛街、观影、聚餐，是周末出行热门地点。</li>
                </ul>

                <h2>二、学院路校区（学院北路41号）食堂+商圈攻略</h2>
                <h3>校内食堂概况</h3>
                <p>学院路校区建校时间久，校园整体设施偏老旧，校内食堂面积偏小，可选择的餐品种类较少。</p>

                <h3>额外就餐渠道：周边商户订餐群</h3>
                <p>校区周边商家组建专属平价盒饭外卖群，价格实惠，支持送餐到校，校内食堂吃腻了可以作为备选。</p>

                <h3>周边核心商圈：爱琴海购物中心</h3>
                <p>校区坐落于唐山市中心繁华地段，步行短距离就能抵达爱琴海购物公园。商场地下一层设有河北省首家盒马鲜生。</p>
                <p>盒马主打高品质鲜活水产、当日新鲜蔬果、半成品预制菜，支持线上快速配送到校；商场涵盖餐饮、服饰、休闲娱乐，采购、逛街一站式搞定，是学院路同学购置生鲜、周末放松的首选。</p>

                <h2>三、全校区通用生活小贴士（联动校园卡指南）</h2>
                <ol>
                    <li>所有校内食堂仅支持校园卡支付，使用食堂无需连接校内WiFi；</li>
                    <li>图书馆、教务系统等校内网络资源：无论是否办理联通校园卡都能正常访问。未办卡可登录学校免费VPN使用，校园卡自愿办理，警惕冒充学长学姐推销流量卡、校园卡的各类诈骗；</li>
                    <li>采购规划：应急小件去师院生活馆小超市；大批量日用品、生鲜囤货，大学道校区选人民购物唐百、远洋城郑兆丰生鲜；学院路同学直接前往爱琴海盒马鲜生；</li>
                    <li>就餐路线参考：日常下课就近选择一食堂/生活馆；北苑少数宿舍楼学生可选北苑新食堂；学院路校内食堂品类有限，可加入周边订餐群丰富就餐选择。</li>
                </ol>

                <a href="https://tieba.baidu.com/p/9742158220" target="_blank" rel="noopener noreferrer" class="glass-link mt-2 no-underline" style="text-decoration:none">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
                            <i class="fa fa-star"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <span class="glass-link-title font-semibold underline">学校食堂评分合集</span>
                            <p class="text-xs text-gray-500 mt-0.5 leading-snug">吧务组组织学长学姐对学校各食堂档口真实评分</p>
                            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">查看评分 <i class="fa fa-angle-right"></i></span>
                        </div>
                    </div>
                </a>
                <a href="https://tieba.baidu.com/p/9774588530" target="_blank" rel="noopener noreferrer" class="glass-link mt-4 no-underline" style="text-decoration:none">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
                            <i class="fa fa-star"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <span class="glass-link-title font-semibold underline">学校附近商场评分合集</span>
                            <p class="text-xs text-gray-500 mt-0.5 leading-snug">吧务组组织学长学姐对学校周边商场真实评分</p>
                            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">查看评分 <i class="fa fa-angle-right"></i></span>
                        </div>
                    </div>
                </a>

                <p>唐山师范学院吧务组<br>2026年7月18日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251486, 1791732251486);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-8-en', 'en', 'Freshman Guide (3) - What PE Courses Are Available and How to Choose', '2026-07-19', 'Guide', 'TSNU Bar Mod Team', 'TSNU PE course selection works in two modes — offline on-field selection at the playground and online selection via the academic affairs system: a complete guide to the selection process, course venues (underground all-weather gym, open outdoor areas, etc.), and practical tips for choosing courses based on venue conditions and difficulty.', '', '                <p>PE course selection at the start of the semester is one of the things Freshmen care about most. Our school offers two selection modes — offline on-site selection and online system selection — each with its own special rules and procedures.</p>
                <p>Based on real on-campus experience, below is the complete selection process, course venues, and practical advice to help you prepare in advance.</p>

                <h2>I. Two PE Course Selection Modes</h2>
                <p>After enrollment, PE course selection goes through two stages: offline selection before your information is entered into the academic system, and online system selection after it is entered.</p>

                <h3>1. Offline On-Field Selection</h3>
                <p>When Freshmen first arrive and their personal information has not yet been entered into the academic system, the school uses offline selection uniformly.</p>
                <ul>
                    <li>All classes scheduled at the same time gather together at the playground, where the supervising teacher arranges the groups and announces each PE teacher''s assigned spot;</li>
                    <li>After the teacher gives the signal, all students run simultaneously to their preferred teacher''s position;</li>
                    <li>Each teacher creates a course group on the spot, and spots are filled by joining the group — once the group is full, the course is full.</li>
                </ul>
                <p>This method mainly tests your running speed and how fast you join the group. If you are slow, you may miss your preferred course, so decide your target in advance and take a favorable position.</p>

                <h3>2. Online Selection via the Academic System</h3>
                <p>Once enrollment information is entered, PE selection switches entirely to online self-service selection.</p>
                <p>Log into the school''s academic system, go to the course selection section, and choose "Self-Service Selection." During the open window, grab a spot relying on your connection speed and quick hands — popular courses fill up almost instantly, so log in early and act right on time.</p>

                <h2>II. Summary of PE Courses Offered</h2>
                <p>The school regularly offers a full range of PE courses, including football, volleyball, badminton, table tennis, martial arts, shuttlecock, aerobics, and Tai Chi softball, which you can choose freely based on your interests and the difficulty level.</p>

                <h2>III. Course Venues Explained</h2>
                <p>Most PE courses are held outdoors, while a few are indoors, and the venue conditions vary significantly.</p>
                <ul>
                    <li><strong>Shuttlecock, Table Tennis</strong>: Fully indoor courses held in the school''s underground all-weather gym. The venue stays warm in winter and cool in summer; the only downside is the poor signal in the underground space;</li>
                    <li><strong>Aerobics</strong>: Also an indoor course;</li>
                    <li><strong>Tai Chi Softball, Martial Arts</strong>: Low-intensity movement. Although taught outdoors, they are mostly held in the shaded area of the playground with little direct sun, making for a relatively comfortable environment;</li>
                    <li><strong>Football, Volleyball, Badminton</strong>: Taught in the open outdoors and heavily affected by weather — summer sun and winter wind make them tough; but these are more mainstream sports and quicker to pick up.</li>
                </ul>

                <a href="https://tieba.baidu.com/p/9746903863" target="_blank" rel="noopener noreferrer" class="glass-link mt-5 no-underline" style="text-decoration:none">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
                            <i class="fa fa-star"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <span class="glass-link-title font-semibold underline">PE Course Ratings</span>
                            <p class="text-xs text-gray-500 mt-0.5 leading-snug">The Mod Team organized senior students to provide honest ratings for each PE course</p>
                            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">View Ratings <i class="fa fa-angle-right"></i></span>
                        </div>
                    </div>
                </a>
                <p class="text-sm text-gray-600 mt-2">Note: The ratings above were compiled by previous students based on their real class experience. Experiences may differ across teachers and semesters, so consider your own situation and treat this as reference only.</p>

                <h2>IV. Practical Selection Tips</h2>
                <ul>
                    <li>If you want easy, comfortable classes, prioritize shuttlecock, table tennis, and aerobics — good venues and low overall pressure;</li>
                    <li>If you want outdoor courses with a milder environment and smaller movements, choose Tai Chi softball or martial arts;</li>
                    <li>Football, volleyball, and badminton involve more exercise, are taught outdoors year-round, and have higher training and assessment requirements — suited to those who love sports and are physically fit.</li>
                </ul>

                <h2>V. Selection Summary</h2>
                <p>Early in the semester, selection is likely offline, so prepare in advance for easier courses; later selections are all online via the academic system and require acting right on time.</p>
                <p>Prioritize courses that suit you based on venue and difficulty, and do not blindly follow popular trends.</p>

                <p>TSNU Bar Mod Team<br>July 19, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ New Student Group QR Code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ new-student group</figcaption>
                </figure>
            ', 1791732251486, 1791732251486);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-8', 'zh', '新生指南（三）-体育课有哪些、怎么选', '2026-07-19', '指南', '唐山师范学院吧务组', '唐山师范学院体育选课分为线下操场抢课与教务系统线上抢课两种模式：整理最全选课流程、各课程上课场地（地下风雨操场、露天室外等）与按场地环境、课程难度选课的实用建议。', '', '                <p>开学体育选课是新生最关心的环节之一。本校体育选课分为线下抢课、线上系统抢课两种模式，规则和流程都比较特殊。</p>
                <p>下面结合在校真实情况，给大家整理最全的选课流程、上课场地和选课建议，方便提前做好准备。</p>

                <h2>一、体育课两种选课模式</h2>
                <p>新生入学后，体育选课会经历两个阶段：信息未录入教务系统前的线下抢课，以及信息录入完成后的线上系统抢课。</p>

                <h3>1. 线下操场抢课</h3>
                <p>新生刚入学、个人信息尚未录入教务系统时，学校会统一采用线下方式选课。</p>
                <ul>
                    <li>同一时段上课的所有班级统一在操场集合，由负责老师现场安排，逐一告知各专项体育老师的具体站位；</li>
                    <li>老师统一口令后，全体同学同时跑向自己心仪的任课老师位置；</li>
                    <li>每位老师现场面对面建课程群，名额以进群为准，群满即代表课程选满。</li>
                </ul>
                <p>这种方式主要比拼跑动速度和进群速度，动作慢很容易选不到心仪的课程，建议提前想好目标、占好有利位置。</p>

                <h3>2. 教务系统线上抢课</h3>
                <p>开学信息录入完成后，体育选课统一改为线上自主选课。</p>
                <p>登录学校教务系统，进入选课板块选择「自主选课」即可。在规定开放时间内依靠网速和手速抢选，热门课程名额十分紧张，基本都是秒空，建议提前登录、准点下手。</p>

                <h2>二、学校开设体育课程汇总</h2>
                <p>学校常规开设的体育课程种类齐全，包含足球、排球、羽毛球、乒乓球、武术、毽球、健美操、太极柔力球等项目，大家可以根据个人兴趣和课程难易程度自由选择。</p>

                <h2>三、各课程上课场地说明</h2>
                <p>大部分体育课程都在室外场地开展，少数课程在室内，场地条件差异明显。</p>
                <ul>
                    <li><strong>毽球、乒乓球</strong>：纯室内课程，上课地点在学校地下风雨操场。场地冬暖夏凉，唯一缺点是地下空间信号较差；</li>
                    <li><strong>健美操</strong>：同样为室内课程；</li>
                    <li><strong>太极柔力球、武术</strong>：运动幅度较小，虽为室外授课，但多在操场树荫区域，暴晒程度低，上课环境相对舒适；</li>
                    <li><strong>足球、排球、羽毛球</strong>：露天室外上课，受天气影响大，夏季日晒、冬季吹风比较辛苦；但项目更大众化，上手相对更快。</li>
                </ul>

                <a href="https://tieba.baidu.com/p/9746903863" target="_blank" rel="noopener noreferrer" class="glass-link mt-5 no-underline" style="text-decoration:none">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base mr-3">
                            <i class="fa fa-star"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <span class="glass-link-title font-semibold underline">体育课评分合集</span>
                            <p class="text-xs text-gray-500 mt-0.5 leading-snug">吧务组组织学长学姐对各体育课程真实评分</p>
                            <span class="float-right -mt-[18px] text-secondary font-medium text-xs whitespace-nowrap ml-2">查看评分 <i class="fa fa-angle-right"></i></span>
                        </div>
                    </div>
                </a>
                <p class="text-sm text-gray-600 mt-2">说明：以上评分由往届学长学姐根据真实上课体验整理，不同老师、不同学期感受会有差异，建议结合自身情况综合判断，仅供参考。</p>

                <h2>四、选课实用建议</h2>
                <ul>
                    <li>追求上课轻松、环境舒适的同学，优先选择毽球、乒乓球、健美操，场地条件好，整体学习压力小；</li>
                    <li>想要室外课程、环境相对温和、运动幅度较小的同学，可以选择太极柔力球、武术；</li>
                    <li>足球、排球、羽毛球运动量偏大，常年露天上课，训练和考核要求更高，适合本身热爱运动、体能较好的同学。</li>
                </ul>

                <h2>五、选课总结</h2>
                <p>开学初期大概率为线下抢课，想要轻松的课程需要提前做好准备；后续选课均为教务系统线上抢课，需要准时卡点下手。</p>
                <p>优先结合场地环境、课程难度选择适合自己的项目，不必盲目跟风热门课程。</p>

                <p>唐山师范学院吧务组<br>2026年7月19日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251486, 1791732251486);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-9-en', 'en', 'Freshman Guide (4) - Dormitory Life Information', '2026-07-20', 'Guide', 'TSNU Bar Mod Team', 'TSNU dormitory life guide: a roundup of power supply and access control across both campuses, bed-curtain usage, floor public facilities, the official repair hotline, on-campus bathhouse locations, parcel pickup points, and key warnings about door-to-door sales scams at the start of term—all verified through on-campus research.', '', '                <p>The dormitory is the primary living space throughout your four years of university. This article compiles the real rules on electricity use, access control, facilities, repairs, and bathhouses across both campuses, along with key warnings about the common sales scams that spike at the start of term.</p>
                <p>Everything here is based on verified on-campus research. Read together with the earlier Freshman Guides, it should help you quickly adapt to dormitory life on campus.</p>

                <h2>I. Dormitory Power Supply and Electricity Rules</h2>
                <p>Dormitory power is supplied on a fixed schedule from <strong>6:30 a.m. to 11:30 p.m.</strong></p>
                <p>The university prohibits all <strong>high-power appliances and electric heating devices</strong>. Although there are no routine inspections or confiscations of prohibited items, using them will trip the dormitory power directly. Once tripped, power cannot be restored on your own—you must contact the dorm supervisor, which is a hassle, so we don''t recommend taking the risk.</p>

                <h2>II. Dormitory Access Control</h2>
                <p>The dormitory evening access-control curfew is at <strong>11:00 p.m.</strong></p>
                <p>Returning after 11:00 p.m. counts as a late return and requires you to proactively register your information with the dorm supervisor. Try to return on time to avoid frequent late-return registrations.</p>

                <h2>III. Bed-Curtain Usage</h2>
                <p>The university nominally prohibits hanging bed curtains in dormitories.</p>
                <p>During your Freshman year there are regular dormitory inspections with relatively strict control; after sophomore year inspections essentially stop and restrictions loosen, so students who want to install bed curtains can set them up later.</p>

                <h2>IV. Floor Public Facilities</h2>
                <p>Both sides of every dormitory floor are equipped with public water dispensers and public washing machines.</p>
                <ul>
                    <li><strong>Water dispenser</strong>: supports both QR-code scanning and facial-recognition for water access;</li>
                    <li><strong>Washing machine</strong>: usable by QR-code scan, meeting daily drinking-water and laundry needs.</li>
                </ul>

                <h2>V. Dormitory Repair Channels</h2>
                <p>For damaged dormitory facilities such as lights, door locks, faucets, or sockets, there are two ways to report a repair:</p>
                <ul>
                    <li>Go to the <strong>dorm supervisor''s office</strong> downstairs to register a repair request;</li>
                    <li>Call the university''s official repair hotline directly: <strong>0315-3863211</strong>.</li>
                </ul>

                <h2>VI. On-Campus Bathhouse Locations</h2>
                <p>None of the dormitory buildings have <strong>private bathrooms</strong>; you must go to the on-campus public bathhouse to shower.</p>
                <ul>
                    <li><strong>Daxuedao Campus</strong>: currently only the public bathhouse east of the North Courtyard cafeteria is open; the South Courtyard public bathhouse is under renovation and is expected to open after the start of the fall 2026 semester;</li>
                    <li><strong>Xueyuan Road Campus</strong>: the public bathhouse is located near the sports and arts center.</li>
                </ul>

                <h2>VII. Dormitory Shopping and Parcel Delivery</h2>
                <ul>
                    <li><strong>Shopping</strong>: the on-campus mini-mart has limited selection; we don''t recommend buying bulky daily necessities on campus—you can shop at off-campus supermarkets or order online in advance;</li>
                    <li><strong>Parcels (Daxuedao Campus)</strong>: there is no on-campus parcel station; all parcels are picked up at the parcel point on the lower level of the Yulania Hotel, west of the North Courtyard.</li>
                </ul>

                <h2>VIII. Key Warning for Freshmen: Start-of-Term Door-to-Door Sales Scams</h2>
                <p>The days just before the semester starts are a peak period for dormitory sales scams. At this time, Freshmen''s access-control information has not yet been fully entered into the system, so campus access control is looser, and many off-campus people take the chance to slip into dormitory buildings to peddle door to door.</p>
                <p>Whether the other party is selling courses, books, haircut cards, or daily necessities, <strong>do not trust them and do not buy anything</strong>.</p>
                <blockquote>Key warning: anyone who claims to be from "this school''s Marketing program" and comes to your dorm selling pens is an off-campus fraudster. Our school has no Marketing program; their stationery is wildly overpriced and of terrible quality—a common scam targeting new students. Just refuse directly.</blockquote>

                <h2>IX. General Life Tips</h2>
                <ul>
                    <li>Keep your dormitory clean and tidy daily; the school conducts regular hygiene inspections;</li>
                    <li>Try to be tolerant of roommates'' schedules to maintain a good dormitory atmosphere;</li>
                    <li>For rules on the campus phone card and on-campus network resources, refer to the first Freshman Guide in this series.</li>
                </ul>

                <p>TSNU Bar Mod Team<br>July 20, 2026</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="TSNU Bar QQ welcome group QR code" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">Scan to join the TSNU Bar QQ welcome group</figcaption>
                </figure>
            ', 1791732251487, 1791732251487);
INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES ('post-9', 'zh', '新生指南（四）-宿舍生活相关信息', '2026-07-20', '指南', '唐山师范学院吧务组', '唐山师范学院宿舍生活指南：整理两校区供电门禁、床帘使用、楼层公共设施、官方报修电话、校内浴室分布、快递取件点，以及开学季上门推销骗局避雷重点，全部为在校实测干货。', '', '                <p>宿舍是大学四年最主要的生活区域。本篇整理两校区宿舍真实用电、门禁、设施、报修、浴室等规则，以及开学季高发的推销骗局避雷重点。</p>
                <p>全部为在校实测干货，配合前面几篇新生指南一起看，基本能帮你快速适应校园住宿生活。</p>

                <h2>一、宿舍供电与用电规则</h2>
                <p>宿舍固定供电时间为<strong>早六点半至晚间十一点半</strong>。</p>
                <p>学校禁止使用一切<strong>大功率电器、电发热类电器</strong>。日常虽不会专门巡查、没收违规电器，但一旦使用会直接导致宿舍跳闸断电。跳闸后无法自行恢复，必须联系宿管老师处理，流程麻烦，不建议抱有侥幸心理。</p>

                <h2>二、宿舍门禁管理</h2>
                <p>宿舍晚间门禁时间为<strong>晚上十一点</strong>。</p>
                <p>十一点之后归寝属于晚归，需要主动找宿管老师登记信息。建议尽量按时回寝，避免频繁晚归登记。</p>

                <h2>三、床帘使用说明</h2>
                <p>学校名义上禁止宿舍悬挂床帘。</p>
                <p>大一期间会有定期宿舍巡查，管控相对严格；大二之后基本不再检查、管控宽松，想安装床帘的同学可以后期自行布置。</p>

                <h2>四、楼层公共设施</h2>
                <p>每一层宿舍楼的两侧，均配备公共饮水机与公共洗衣机。</p>
                <ul>
                    <li><strong>饮水机</strong>：支持扫码、扫脸两种取水方式；</li>
                    <li><strong>洗衣机</strong>：支持扫码使用，满足日常饮水、洗衣需求。</li>
                </ul>

                <h2>五、宿舍报修渠道</h2>
                <p>宿舍灯具、门锁、水龙头、插座等设施损坏，有两种报修方式：</p>
                <ul>
                    <li>前往楼下<strong>宿管值班室</strong>登记报修；</li>
                    <li>直接拨打学校官方报修电话：<strong>0315-3863211</strong>。</li>
                </ul>

                <h2>六、校内浴室分布</h2>
                <p>所有宿舍楼内均<strong>无独立浴室</strong>，洗澡需前往校内公共浴室。</p>
                <ul>
                    <li><strong>大学道校区</strong>：目前仅北院食堂东侧公共浴室正常开放；南院公共浴室处于装修状态，预计 2026 年 9 月开学后投入使用；</li>
                    <li><strong>学院路校区</strong>：公共浴室位于文体馆附近。</li>
                </ul>

                <h2>七、宿舍采购与快递说明</h2>
                <ul>
                    <li><strong>采购</strong>：校内生活馆小超市品类有限，大件生活用品不建议在校内购买，可前往校外商超集中采购或提前网购；</li>
                    <li><strong>快递（大学道校区）</strong>：校内无快递驿站，所有快递统一取件位置为北苑西侧白玉兰酒店负一层快递点。</li>
                </ul>

                <h2>八、新生重点避雷：开学上门推销骗局</h2>
                <p>开学前几天是宿舍推销诈骗高发期。此时新生门禁信息尚未完全录入系统，校园门禁管理较宽松，大量校外人员会借机混入宿舍楼上门推销。</p>
                <p>无论对方推销课程、书籍、理发卡还是生活用品，一律<strong>不要相信、不要购买</strong>。</p>
                <blockquote>重点避雷：遇到自称「本校市场营销专业」、上门推销售卖笔的人员，全部是校外骗子。本校没有市场营销专业，对方文具价格虚高、质量极差，属老生常见骗局，直接拒绝即可。</blockquote>

                <h2>九、通用生活小贴士</h2>
                <ul>
                    <li>日常保持宿舍卫生整洁，学校会定期进行宿舍卫生检查；</li>
                    <li>室友之间尽量保持作息包容，维护良好宿舍氛围；</li>
                    <li>校园卡、校内网络资源使用规则，可参考本系列第一篇新生指南。</li>
                </ul>

                <p>唐山师范学院吧务组<br>2026年7月20日</p>

                <figure class="text-center my-6">
                    <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码" class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
                    <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
                </figure>
            ', 1791732251487, 1791732251487);
COMMIT;
