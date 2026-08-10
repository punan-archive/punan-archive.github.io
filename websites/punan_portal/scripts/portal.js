(() => {
  const root = document.querySelector('#portal-app');
  const params = new URLSearchParams(location.search);
  const page = params.get('page') || 'home';

  fetch('/websites/punan_portal/data/articles.json')
    .then((response) => response.json())
    .then((data) => render(data))
    .catch(() => { root.innerHTML = '<div class="empty">页面数据读取失败。</div>'; });

  function render(data) {
    document.title = pageTitle(page);
    root.innerHTML = `${header(activeNavigation(data))}<main class="content">${renderPage(data)}</main>${footer()}`;
    bindSearch();
    bindReplyBoxes();
  }

  function activeNavigation(data) {
    if (page !== 'article') return page;
    const item = data.articles.find((record) => record.id === params.get('id'));
    if (item && isCommunity(item)) return 'community';
    if (item?.source === '政务公开' || /工作组|工作办公室|管理所|居委会/.test(item?.source || '')) return 'government';
    return 'article';
  }

  function bindSearch() {
    const form = root.querySelector('form[data-punan-search]');
    if (!form) return;
    const input = form.querySelector('input[name="keyword"]');
    const button = form.querySelector('button');
    const navigate = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const keyword = input?.value.trim() || '';
      if (!keyword) { input?.focus(); return; }
      parent.postMessage({ source: 'punan-web', type: 'navigate', url: `http://www.punan.net/search.asp?keyword=${encodeURIComponent(keyword)}` }, '*');
    };
    form.addEventListener('submit', navigate);
    if (button) { button.type = 'button'; button.addEventListener('click', navigate); }
    input?.addEventListener('keydown', (event) => { if (event.key === 'Enter') navigate(event); });
  }

  function bindReplyBoxes() {
    root.querySelectorAll('form[data-offline-reply]').forEach((form) => {
      const feedback = form.querySelector('.reply-feedback');
      const button = form.querySelector('button');
      const rejectReply = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = '回复未能发送：当前打开的是离线页面。';
        }
      };
      form.addEventListener('submit', rejectReply);
      if (button) {
        button.type = 'button';
        button.addEventListener('click', rejectReply);
      }
    });
  }

  function renderPage(data) {
    if (page === 'home') return renderHome(data);
    if (page === 'news') return renderNews(data);
    if (page === 'article') return renderArticle(data);
    if (page === 'culture') return renderCulture(data);
    if (page === 'services') return renderServices(data);
    if (page === 'community') return renderCommunity(data);
    if (page === 'bus') return renderBus();
    if (page === 'library') return renderLibrary(data);
    if (page === 'government') return renderGovernment(data);
    if (page === 'search') return renderSearch(data);
    return '<div class="empty">没有找到该栏目。</div>';
  }

  function renderHome(data) {
    const current = data.articles.filter((item) => item.year === 2010 && item.id !== 'PN-007' && isNews(item)).slice(0, 8);
    const oldIds = ['PN-089', 'PN-090', 'PN-091', 'PN-092', 'PN-093', 'PN-094', 'PN-095'];
    const old = oldIds.map((id) => data.articles.find((item) => item.id === id)).filter(Boolean);
    const services = data.articles.filter(isService).slice(0, 4);
    const community = data.articles.filter(isCommunity).slice(0, 4);
    return `
      <div class="portal-ticker"><strong>本站快讯：</strong><span>北部旧区评估复核结果开始送达</span><span>周末流感接种窗口增开</span><span>纬零路夜间施工已经结束</span></div>
      <div class="home-grid">
        <div class="home-main">
          <section class="feature">
            <div class="feature-label">今日浦南</div>
            <div class="feature-inner">
              <img src="/websites/punan_portal/assets/hospital-waiting.png" alt="中心医院门诊候诊区" width="196" height="112">
              <div><h2>${link('中心医院周末增开流感接种窗口', 'http://www.punan.net/view.asp?id=PN-007')}</h2>
              <p>11月13日、14日上午增开接种窗口。居民请携带医保卡或身份证明，儿童及慢性病患者先接受医生询问。</p></div>
            </div>
          </section>
          <section class="panel">
            <div class="panel-title red"><span>浦南要闻</span>${link('更多新闻&gt;&gt;', 'http://www.punan.net/news/index.html')}</div>
            <div class="panel-body"><ul class="headline-list">${current.map(newsLine).join('')}</ul></div>
          </section>
        </div>
        <div class="home-middle">
          <section class="panel">
            <div class="panel-title"><span>旧闻与地方资料</span>${link('按年份查看', 'http://www.punan.net/news/index.html')}</div>
            <div class="panel-body"><ul class="headline-list">${old.map(newsLine).join('')}</ul></div>
          </section>
          <section class="panel">
            <div class="panel-title green"><span>文化与教育</span></div>
            <div class="panel-body"><ul class="link-list">
              <li>${link('工人文化宫与少年宫活动资料', 'http://www.punan.net/culture/index.html')}</li>
              <li>${link('盟杉中学', 'http://www.ms-school.edu.cn/')}</li>
              <li>${link('浦南区图书馆地方文献', 'http://www.punan.net/library/index.html')}</li>
            </ul></div>
          </section>
        </div>
        <aside class="home-side">
          <section class="panel quick-panel">
            <div class="panel-title ochre"><span>便民入口</span></div>
            <div class="panel-body quick-grid">
              ${link('公交出行', 'http://www.punan.net/bus/index.html')}
              ${link('生活黄页', 'http://www.punan.net/service/index.html')}
              ${link('社区问答', 'http://www.punan.net/community/index.html')}
              ${link('旧闻资料', 'http://www.punan.net/news/index.html')}
            </div>
          </section>
          <section class="panel">
            <div class="panel-title"><span>生活服务</span></div>
            <div class="panel-body"><ul class="link-list">${services.map((item) => `<li>${link(item.title, item.virtualUrl)}</li>`).join('')}</ul></div>
          </section>
          <section class="panel">
            <div class="panel-title green"><span>社区热帖</span></div>
            <div class="panel-body"><ul class="link-list">${community.map((item) => `<li>${link(item.title, item.virtualUrl)}</li>`).join('')}</ul></div>
          </section>
        </aside>
      </div>`;
  }

  function renderNews(data) {
    const rows = data.articles.filter(isNews).sort((a, b) => b.date.localeCompare(a.date));
    return `${crumb('浦南新闻 &gt; 新闻归档')}
      <div class="two-column">
        ${sideNav()}
        <section class="article">
          <h1>浦南信息港新闻归档</h1>
          <div class="article-meta">当前共收录 ${rows.length} 条新闻与政务信息　更新时间：2010-11-12</div>
          <table class="archive-table"><thead><tr><th>日期</th><th>栏目</th><th>标题</th><th>来源</th></tr></thead><tbody>
            ${rows.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.section)}</td><td>${link(item.title, item.virtualUrl)}</td><td>${escapeHtml(item.source)}</td></tr>`).join('')}
          </tbody></table>
        </section>
      </div>`;
  }

  function renderArticle(data) {
    const item = data.articles.find((record) => record.id === params.get('id'));
    if (!item) return '<div class="empty">没有找到该新闻。</div>';
    const oldRecord = item.year < 2010;
    const dateMeta = oldRecord ? `资料形成日期：${escapeHtml(item.date)}　数字化录入：2010年` : `发布时间：${escapeHtml(item.date)}`;
    const channel = isCommunity(item) ? '浦南社区' : '浦南新闻';
    return `${crumb(`${channel} &gt; ${escapeHtml(item.section)} &gt; 正文`)}
      <div class="two-column">
        ${sideNav()}
        <article class="article">
          <h1>${escapeHtml(item.title)}</h1>
          <div class="article-meta">${dateMeta}　来源：${escapeHtml(item.source)}　${oldRecord ? '资料整理' : metaLabel(item)}：${escapeHtml(item.editor || '信息港编辑部')}</div>
          ${item.image ? photo(item) : ''}
          ${item.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
          ${item.links?.length ? `<div class="article-links"><strong>相关地址：</strong>${item.links.map((entry) => link(entry.label, entry.url)).join('')}</div>` : ''}
          ${isCommunity(item) ? discussion(item) : ''}
        </article>
      </div>`;
  }

  function renderCulture(data) {
    const culture = data.articles.filter((item) => item.section === '文化教育' || item.section === '地方影像');
    return `${crumb('文化教育 &gt; 文化宫与少年宫')}
      <div class="two-column">
        ${sideNav()}
        <section class="article">
          <h1>浦南文化活动资料</h1>
          <div class="article-meta">工人文化宫、少年宫及社区活动公开资料选编</div>
          <table class="course-table"><thead><tr><th>时间</th><th>活动／课程</th><th>地点</th><th>指导或供稿</th></tr></thead><tbody>
            ${data.courses.map((row) => `<tr><td>${escapeHtml(row.term)}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.place)}</td><td>${escapeHtml(row.teacher)}</td></tr>`).join('')}
          </tbody></table>
          <h2>相关旧闻</h2>
          <ul class="headline-list">${culture.map(newsLine).join('')}</ul>
        </section>
      </div>`;
  }

  function renderServices(data) {
    const rows = data.articles.filter(isService).sort((a, b) => b.date.localeCompare(a.date));
    return directoryPage('生活服务', '便民黄页、医疗、商业及社区服务信息', rows);
  }

  function renderCommunity(data) {
    const rows = data.articles.filter(isCommunity).sort((a, b) => b.date.localeCompare(a.date));
    return `${crumb('浦南社区')}<div class="two-column">${sideNav()}<section class="article community-directory">
      <h1>浦南社区</h1><div class="article-meta">居民来帖与生活问答　共 ${rows.length} 条</div>
      <table class="archive-table"><thead><tr><th>日期</th><th>分类</th><th>主题</th><th>发布者</th><th>回复</th></tr></thead><tbody>
      ${rows.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.section)}</td><td>${link(item.title, item.virtualUrl)}</td><td>${escapeHtml(displayUser(item.editor))}</td><td class="reply-count">${item.replies?.length ?? '摘录'}</td></tr>`).join('')}
      </tbody></table></section></div>`;
  }

  function renderGovernment(data) {
    const rows = data.articles.filter((item) => item.source === '政务公开' || /工作组|工作办公室|管理所|居委会/.test(item.source)).sort((a, b) => b.date.localeCompare(a.date));
    return directoryPage('政务公开', '通知公告、办事提示与部门动态', rows);
  }

  function renderBus() {
    return `${crumb('生活服务 &gt; 公交出行')}<div class="two-column">${sideNav()}<section class="article">
      <h1>浦南公交出行参考</h1><div class="article-meta">资料更新至2010年10月　具体线路、站序和首末班以站牌通知为准</div>
      <table class="course-table"><thead><tr><th>常用方向</th><th>大致通达区域</th><th>乘车提示</th></tr></thead><tbody>
      <tr><td>纬零路换班方向</td><td>生活区、中心医院附近与西侧工业区</td><td>换班时段有区间车</td></tr>
      <tr><td>北部生活方向</td><td>北部旧区、盟杉中学附近与生活区中心</td><td>部分班次间隔较长</td></tr>
      <tr><td>海堤休闲方向</td><td>工人俱乐部附近与海堤公园一带</td><td>周末客流较多</td></tr>
      </tbody></table><p>自行车请停放在站点划线区域，不得倚靠候车护栏。</p>
    </section></div>`;
  }

  function renderLibrary(data) {
    const rows = data.articles.filter((item) => item.title.includes('图书馆')).filter((item) => !/委托培养|预录/.test(item.title));
    return `${crumb('文化教育 &gt; 区图书馆')}<div class="two-column">${sideNav()}<section class="article">
      <h1>浦南区图书馆</h1><div class="article-meta">位于生活区文化设施集中区域　咨询电话：021-5793 5216</div>
      <p>成人借阅室、少儿阅览室和报刊室对外开放。地方文献室工作日接受目录查询，旧报刊缩微资料需提前登记。</p>
      <h2>开放与活动信息</h2><ul class="headline-list">${rows.slice(0, 12).map(newsLine).join('')}</ul>
      <p>地方文献卡片目录正在分批录入，尚未录入的题名请到二楼服务台查询。</p>
    </section></div>`;
  }

  function directoryPage(title, note, rows) {
    return `${crumb(escapeHtml(title))}<div class="two-column">${sideNav()}<section class="article">
      <h1>${escapeHtml(title)}</h1><div class="article-meta">${escapeHtml(note)}　共 ${rows.length} 条</div>
      <table class="archive-table"><thead><tr><th>日期</th><th>栏目</th><th>标题</th><th>来源</th></tr></thead><tbody>
      ${rows.map((item) => `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.section)}</td><td>${link(item.title, item.virtualUrl)}</td><td>${escapeHtml(item.source)}</td></tr>`).join('')}
      </tbody></table></section></div>`;
  }

  function renderSearch(data) {
    const keyword = (params.get('keyword') || '').trim();
    const hits = keyword ? data.articles.filter((item) => searchableText(item).includes(keyword)) : [];
    return `${crumb('站内检索')}
      <section class="article">
        <h1>站内检索</h1>
        <div class="article-meta">关键词：${escapeHtml(keyword)}　共找到 ${hits.length} 条结果</div>
        ${keyword ? (hits.length ? `<ul class="search-result">${hits.map((item) => `<li><h3>${link(item.title, item.virtualUrl)}</h3><p>${escapeHtml(item.date)}　${escapeHtml(item.section)}　${escapeHtml(item.source)}</p></li>`).join('')}</ul>` : '<div class="empty">没有找到相关内容。</div>') : '<div class="empty">请输入检索词。</div>'}
      </section>`;
  }

  function photo(item) {
    const missing = item.image.status === 'missing';
    const image = missing
      ? '<div class="legacy-photo__placeholder" role="img" aria-label="图片未缓存"><span>□</span><strong>图片未缓存</strong><small>仅保存图注</small></div>'
      : `<img src="${escapeAttr(item.image.src)}" alt="${escapeAttr(item.image.alt || '')}" width="560" height="244">`;
    return `<figure class="legacy-photo">
      ${image}
      <figcaption>${escapeHtml(item.image.caption)}<span class="credit">${escapeHtml(item.image.credit)}</span></figcaption>
    </figure>`;
  }

  function discussion(item) {
    const replies = item.replies || [];
    const replyList = replies.length
      ? `<div class="reply-list">${replies.map((reply, index) => `<div class="reply-item">
          <div class="reply-head"><strong>${escapeHtml(reply.author)}</strong><span>${index + 1}楼　${escapeHtml(reply.time)}</span></div>
          <div class="reply-body">${escapeHtml(reply.body)}</div>
        </div>`).join('')}</div>`
      : '<div class="reply-excerpt-note">本页只保存了主题与回帖摘录，楼层记录不完整。</div>';
    return `<section class="discussion">
      <h2>网友回复 <small>${replies.length ? `共 ${replies.length} 条` : '旧页摘录'}</small></h2>
      ${replyList}
      <form class="reply-box" data-offline-reply>
        <div class="reply-box-title">发表回复</div>
        <label>昵称：<input name="nickname" value="游客"></label>
        <label class="reply-message-label">内容：<textarea name="message" rows="4"></textarea></label>
        <div class="reply-actions"><button type="submit">提交回复</button><span class="reply-feedback" hidden></span></div>
      </form>
    </section>`;
  }

  function newsLine(item) {
    return `<li>${link(item.title, item.virtualUrl)}<time>${escapeHtml(item.date.slice(5))}</time></li>`;
  }

  function searchableText(item) {
    const replies = (item.replies || []).flatMap((reply) => [reply.author, reply.body]);
    const linked = (item.links || []).flatMap((entry) => [entry.label, entry.url]);
    return [item.title, item.date, item.section, item.source, item.editor, ...(item.body || []), ...replies, ...linked, item.image?.caption, item.image?.credit].filter(Boolean).join('\n');
  }

  function displayUser(editor = '') { return String(editor).replace(/^用户[“"]|[”"]$/g, ''); }

  function isCommunity(item) { return item.source === '社区论坛'; }
  function isService(item) { return item.source === '黄页' || ['餐饮早点', '搬运服务', '家电维修', '打字复印', '五金劳保', '上网服务', '摄影冲印', '钟表通信', '百货服装'].includes(item.section); }
  function isPhoto(item) { return item.source === '照片页' || ['地方影像', '网友摄影'].includes(item.section); }
  function isNews(item) { return !isCommunity(item) && !isService(item) && !isPhoto(item); }
  function metaLabel(item) {
    if (isCommunity(item)) return '发布者';
    if (isService(item)) return '信息提供';
    if (item.source === '政务公开') return '发布单位';
    return '责任编辑';
  }

  function header(active) {
    return `<div class="utility"><span>2010年11月12日　星期五　浦南：多云 9℃—16℃</span><span class="utility-links">${link('免费邮箱', 'http://www.punan.net/service/index.html')}${link('设为首页', 'http://www.punan.net/')}${link('加入收藏', 'http://www.punan.net/')}</span></div>
      <header class="masthead">
        <div class="brand"><strong>浦南信息港</strong><small>PUNAN INFORMATION PORT</small><em>立足浦南　服务生活　连接你我</em></div>
        <figure class="masthead-banner"><img src="/websites/punan_portal/assets/punan-masthead-panorama-v1.jpg" alt="秋日浦南生活区与远处工业区" width="600" height="84"><figcaption>秋日浦南　生活区远眺西侧工业区</figcaption></figure>
      </header>
      <nav class="main-nav">
        ${navLink('首页', 'http://www.punan.net/', active === 'home')}${navLink('浦南新闻', 'http://www.punan.net/news/index.html', active === 'news' || active === 'article')}
        ${navLink('社区', 'http://www.punan.net/community/index.html', active === 'community')}${navLink('生活服务', 'http://www.punan.net/service/index.html', active === 'services')}
        ${navLink('公交出行', 'http://www.punan.net/bus/index.html', active === 'bus')}${navLink('文化教育', 'http://www.punan.net/culture/index.html', active === 'culture')}
        ${navLink('政务公开', 'http://www.punan.net/gov/index.html', active === 'government')}${navLink('区图书馆', 'http://www.punan.net/library/index.html', active === 'library')}
      </nav>
      <nav class="sub-nav"><strong>地方导航</strong>${link('公交时刻','http://www.punan.net/bus/index.html')}${link('便民黄页','http://www.punan.net/service/index.html')}${link('二手交换','http://www.punan.net/community/index.html')}${link('房屋信息','http://www.punan.net/community/index.html')}${link('文化活动','http://www.punan.net/culture/index.html')}${link('地方旧闻','http://www.punan.net/news/index.html')}${link('盟杉中学','http://www.ms-school.edu.cn/')}</nav>
      <div class="search-strip"><strong>站内检索</strong><form data-punan-search="http://www.punan.net/search.asp"><input name="keyword"><button>搜索</button></form><span class="hotwords">热门：${link('世博总结','http://www.punan.net/search.asp?keyword=%E4%B8%96%E5%8D%9A')}${link('公交','http://www.punan.net/search.asp?keyword=%E5%85%AC%E4%BA%A4')}${link('流感接种','http://www.punan.net/search.asp?keyword=%E6%B5%81%E6%84%9F%E6%8E%A5%E7%A7%8D')}</span></div>`;
  }

  function footer() {
    return `<div class="friend-links"><strong>友情链接：</strong>${link('盟杉中学','http://www.ms-school.edu.cn/')}${link('浦南政务公开','http://www.punan.net/gov/index.html')}${link('浦南文化活动','http://www.punan.net/culture/index.html')}</div>
      <footer class="footer">浦南信息港 版权所有　主办：浦南信息港编辑部　新闻热线：021-5793 2041<br>建议使用 IE6.0 以上浏览器　1024×768 分辨率　页面更新：2010-11-12</footer>`;
  }

  function sideNav() {
    return `<aside class="portal-sidebar">
      <section class="side-box"><h2>便民导航</h2>${link('浦南新闻','http://www.punan.net/news/index.html')}${link('生活服务','http://www.punan.net/service/index.html')}${link('社区讨论','http://www.punan.net/community/index.html')}${link('公交出行','http://www.punan.net/bus/index.html')}${link('文化教育','http://www.punan.net/culture/index.html')}${link('政务公开','http://www.punan.net/gov/index.html')}</section>
      <section class="side-box side-info"><h2>常用电话</h2><p>新闻热线<br><strong>021-5793 2041</strong></p><p>图书馆咨询<br><strong>021-5793 5216</strong></p><p>紧急情况请拨110、119或120</p></section>
      <section class="side-box side-info"><h2>今日提示</h2><p>北部旧区咨询点晚间接待至20时；周末中心医院增开流感接种窗口。</p></section>
    </aside>`;
  }

  function crumb(text) { return `<div class="crumb">当前位置：${text}</div>`; }
  function navLink(label, url, active) { return `<a class="${active ? 'active' : ''}" href="#" data-punan-url="${escapeAttr(url)}">${escapeHtml(label)}</a>`; }
  function link(label, url) { return `<a href="#" data-punan-url="${escapeAttr(url)}">${label}</a>`; }
  function pageTitle(name) {
    const labels = { culture: '文化教育', search: '站内检索', services: '生活服务', community: '浦南社区', bus: '公交出行', library: '区图书馆', government: '政务公开', news: '浦南新闻', article: '浦南信息港' };
    return name === 'home' ? '浦南信息港' : `${labels[name] || '浦南信息港'} - 浦南信息港`;
  }
  function escapeHtml(value = '') { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
  function escapeAttr(value = '') { return escapeHtml(value).replaceAll("'",'&#039;'); }
})();
