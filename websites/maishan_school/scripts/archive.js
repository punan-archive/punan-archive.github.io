(() => {
  const root = document.querySelector('#archive-app');
  const params = new URLSearchParams(location.search);
  const page = params.get('page') || 'login';

  fetch('/websites/maishan_school/data/archive-records.json')
    .then((response) => response.json())
    .then((data) => render(data))
    .catch(() => { root.innerHTML = '<div class="empty">档案目录数据读取失败。</div>'; });

  function render(data) {
    document.title = page === 'login' ? '盟杉中学档案电子化管理系统' : '档案目录录入预览 - 盟杉中学';
    root.innerHTML = `${head()}<main class="archive-main">${renderPage(data)}</main>${foot()}`;
    bindSearch();
    bindLogin();
  }

  function bindLogin() {
    const button = root.querySelector('.login-button');
    if (!button) return;
    const inputs = root.querySelectorAll('.login-box input');
    const feedback = root.querySelector('.login-feedback');
    const rejectOfflineLogin = () => {
      feedback.hidden = false;
      feedback.textContent = '无法脱机完成此操作。请连接盟杉中学校园网后重试。';
    };
    button.addEventListener('click', rejectOfflineLogin);
    inputs.forEach((input) => input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        rejectOfflineLogin();
      }
    }));
  }

  function bindSearch() {
    root.querySelectorAll('form[data-punan-search]').forEach((form) => {
      const input = form.querySelector('input[name="keyword"]');
      const button = form.querySelector('button');
      const navigate = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const keyword = input?.value.trim() || '';
        if (!keyword) { input?.focus(); return; }
        const mode = form.dataset.searchMode === 'responsible' ? '&mode=responsible' : '';
        parent.postMessage({ source: 'punan-web', type: 'navigate', url: `http://www.ms-school.edu.cn/dangan/read/search.asp?keyword=${encodeURIComponent(keyword)}${mode}` }, '*');
      };
      form.addEventListener('submit', navigate);
      if (button) { button.type = 'button'; button.addEventListener('click', navigate); }
      input?.addEventListener('keydown', (event) => { if (event.key === 'Enter') navigate(event); });
    });
  }

  function renderPage(data) {
    if (page === 'login') return login();
    if (page === 'catalog') return catalog(data);
    if (page === 'record') return record(data);
    if (page === 'search') return search(data);
    return '<div class="empty">没有找到该页面。</div>';
  }

  function login() {
    return `<div class="login-wrap">
      <section class="login-box"><h2>工作人员登录</h2>
        <div class="login-row"><label>用户名</label><input aria-label="用户名"></div>
        <div class="login-row"><label>密　码</label><input type="password" aria-label="密码"></div>
        <button class="login-button" type="button">登　录</button>
        <p class="login-feedback" role="status" aria-live="polite" hidden></p>
        <p class="login-note">本入口供档案室工作人员维护目录。忘记密码请联系校信息技术组，不接受电话查询个人档案。</p>
        <div class="login-assist"><strong>录入辅助</strong><span>本批目录数据已提交核对。</span>${link('查看目录','http://www.ms-school.edu.cn/dangan/read/index.asp')}</div>
      </section>
    </div>`;
  }

  function catalog(data) {
    const year = params.get('year') || (!params.get('code') ? '2010' : '');
    const code = params.get('code');
    const rows = data.records.filter((item) => (!year || String(item.year) === year) && (!code || item.code === code));
    const title = year ? `${year}年度档案目录` : code ? `${code} ${data.categories[code]}目录` : '档案目录录入预览';
    return `${crumb('档案目录录入预览 &gt; 目录浏览')}<div class="catalog-layout">${filters(data, year, code)}
      <section class="catalog-panel"><div class="catalog-title">${escapeHtml(title)}</div><div class="catalog-summary">共 ${rows.length} 条。入口默认显示2010年度，较早档案请从左侧选择年份或使用目录检索。</div>
        <table class="catalog-table"><thead><tr><th>档号</th><th>年度</th><th>门类</th><th>题名</th><th>录入状态</th></tr></thead><tbody>
          ${rows.map((item) => `<tr><td class="no">${escapeHtml(item.no)}</td><td class="year">${item.year}</td><td class="code">${item.code}</td><td>${link(item.title,item.virtualUrl)}</td><td class="access">${escapeHtml(item.access)}</td></tr>`).join('')}
        </tbody></table>
      </section></div>`;
  }

  function record(data) {
    const item = data.records.find((entry) => entry.id === params.get('id'));
    if (!item) return '<div class="empty">没有找到该档案目录。</div>';
    return `${crumb(`档案目录录入预览 &gt; ${item.code} ${escapeHtml(data.categories[item.code])} &gt; 目录详情`)}
      <article class="record-card"><h1>${escapeHtml(item.title)}</h1>
        <table class="record-table"><tbody>
          <tr><th>档号</th><td>${escapeHtml(item.no)}</td><th>形成年度</th><td>${item.year}</td></tr>
          <tr><th>形成日期</th><td>${escapeHtml(item.date)}</td><th>责任部门</th><td>${escapeHtml(item.department)}</td></tr>
          <tr><th>门类</th><td>${item.code}　${escapeHtml(data.categories[item.code])}</td><th>保管期限</th><td>${escapeHtml(item.retention)}</td></tr>
          <tr><th>录入状态</th><td colspan="3">${escapeHtml(item.access)}</td></tr>
          ${item.responsible?.length ? `<tr><th>责任者</th><td colspan="3">${item.responsible.map(escapeHtml).join('；')}</td></tr>` : ''}
        </tbody></table>
        <div class="record-summary">${escapeHtml(item.summary)}</div>
        ${item.rows ? `<div class="scan-label">目录备注／录入字段</div>${renderRows(item.rows)}` : ''}
        ${item.preview?.type === 'graduation-layout' ? graduationPreview(item.preview) : ''}
        ${item.image ? recordImage(item.image) : ''}
        ${item.imageHeld ? '<div class="scan-label">图像文件</div><div class="image-unavailable">图像尚未录入，本批仅提供目录字段与原始编号。</div>' : ''}
        ${renderRelations(item.references, '引用档号')}
        ${renderRelations(item.citedBy, '被引用于')}
        <p>${link('返回预览目录','http://www.ms-school.edu.cn/dangan/read/index.asp')}</p>
      </article>`;
  }

  function search(data) {
    const keyword = (params.get('keyword') || '').trim();
    const mode = params.get('mode') === 'responsible' ? 'responsible' : 'all';
    const rows = keyword ? data.records
      .filter((item) => mode === 'responsible' ? responsibleText(item).includes(keyword) : searchableText(item).includes(keyword))
      .sort((a, b) => String(a.date).localeCompare(String(b.date), 'zh-CN') || a.no.localeCompare(b.no, 'zh-CN')) : [];
    return `${crumb('档案目录录入预览 &gt; 目录检索')}<div class="catalog-layout">${filters(data)}
      <section class="catalog-panel"><div class="catalog-title">${mode === 'responsible' ? '按责任者检索' : '目录检索'}：${escapeHtml(keyword)}</div><div class="catalog-summary">${keyword ? `共找到 ${rows.length} 条分散目录。系统不自动合并同名人物记录。` : '请输入检索内容。'}</div>
        <table class="catalog-table"><thead><tr><th>档号</th><th>年度</th><th>门类</th><th>题名</th><th>录入状态</th></tr></thead><tbody>
          ${rows.map((item) => `<tr><td class="no">${escapeHtml(item.no)}</td><td>${item.year}</td><td>${item.code}</td><td>${link(item.title,item.virtualUrl)}</td><td class="access">${escapeHtml(item.access)}</td></tr>`).join('')}
        </tbody></table>
      </section></div>`;
  }

  function filters(data, year = '', code = '') {
    const years = [2010,2009,2004,1994,1993,1992,1991,1990,1988];
    const codes = ['XZ','JX','XJ','ZS','RS','XC','ST','SC','XS'];
    return `<aside>
      <section class="filter-box"><h2>形成年度</h2>${years.map((value) => link(`${value}年度`,`http://www.ms-school.edu.cn/dangan/read/browse.asp?year=${value}`,year === String(value) ? 'active' : '')).join('')}</section>
      <section class="filter-box"><h2>档案门类</h2>${codes.map((value) => link(`${value}　${data.categories[value]}`,`http://www.ms-school.edu.cn/dangan/read/browse.asp?code=${value}`,code === value ? 'active' : '')).join('')}</section>
      <section class="filter-box"><h2>目录检索</h2><div class="query-box"><form data-punan-search="http://www.ms-school.edu.cn/dangan/read/search.asp"><input name="keyword"><button>检索</button></form></div><p>可输入题名、责任部门或人名。老档案题名尚未建立统一人物索引。</p></section>
      <section class="filter-box"><h2>按责任者检索</h2><div class="query-box"><form data-punan-search="http://www.ms-school.edu.cn/dangan/read/search.asp" data-search-mode="responsible"><input name="keyword"><button>检索</button></form></div><p>检索经办、负责人、摄影及材料形成部门等责任者字段。</p></section>
    </aside>`;
  }

  function renderRows(rows) {
    const headers = Object.keys(rows[0] || {});
    return `<table class="scan-table"><thead><tr>${headers.map((key) => `<th>${escapeHtml(key)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${headers.map((key) => `<td>${escapeHtml(row[key])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  function searchableText(item) {
    return [item.no, item.date, item.department, item.title, ...(!item.excludeSummaryFromSearch ? [item.summary] : []), ...responsibleValues(item), ...(!item.excludeRowsFromSearch && item.rows ? item.rows.flatMap((row) => Object.values(row)) : [])].filter(Boolean).join('\n');
  }

  function responsibleText(item) { return [item.department, ...responsibleValues(item)].filter(Boolean).join('\n'); }
  function responsibleValues(item) { return Array.isArray(item.responsible) ? item.responsible : []; }

  function renderRelations(entries, title) {
    if (!entries?.length) return '';
    return `<section class="record-relations"><strong>${escapeHtml(title)}</strong><div>${entries.map((entry) => {
      const url = entry.url || `http://www.ms-school.edu.cn/dangan/read/record.asp?id=${encodeURIComponent(entry.recordId || '')}`;
      return link(entry.label, url);
    }).join('')}</div></section>`;
  }

  function recordImage(image) {
    return `<div class="scan-label">照片预览</div><figure class="record-photo"><img src="${escapeAttr(image.src)}" alt="${escapeAttr(image.alt || '')}"><figcaption>${escapeHtml(image.caption || '')}</figcaption></figure>`;
  }

  function graduationPreview(preview) {
    const portraits = ['吴敏','罗海燕','钱澄','周立新','何青','叶帆'];
    return `<div class="scan-label">纪念图版低清校样</div><figure class="graduation-preview"><div class="graduation-preview__title">一九九三届高中毕业纪念</div><div class="graduation-preview__grid">${portraits.slice(0,3).map((name, index) => portraitTile(name,index)).join('')}<div class="graduation-preview__tile is-mixed"><span style="background-image:url('${escapeAttr(preview.source)}')"></span><small>林美心</small></div>${portraits.slice(3).map((name,index) => portraitTile(name,index+3)).join('')}</div><figcaption>录入用缩略校样。缺席及转出学生图像另行补配，来源见编制说明。</figcaption></figure>`;
  }

  function portraitTile(name, index) {
    return `<div class="graduation-preview__tile"><span class="portrait-placeholder p${index % 4}"></span><small>${escapeHtml(name)}</small></div>`;
  }

  function head() {
    return `<header class="archive-head"><h1>盟杉中学档案电子化管理系统</h1><p>目录管理 · 录入预览 · 电子文件登记</p></header>
      <nav class="archive-nav">${link('系统首页','http://www.ms-school.edu.cn/dangan/manage/login.asp',page === 'login' ? 'active' : '')}${link('目录录入预览','http://www.ms-school.edu.cn/dangan/read/index.asp',page !== 'login' ? 'active' : '')}${link('学校网站','http://www.ms-school.edu.cn/')}</nav>
      <div class="archive-status"><span>录入预览批次：2010-10</span>服务器时间：2010-11-12 23:48</div>`;
  }
  function foot() { return '<footer class="archive-foot">盟杉中学档案室　系统维护：校信息技术组<br>目录预览仅供核对</footer>'; }
  function crumb(text) { return `<div class="crumb">当前位置：${text}</div>`; }
  function link(label,url,className='') { return `<a class="${className}" href="#" data-punan-url="${escapeAttr(url)}">${escapeHtml(label)}</a>`; }
  function escapeHtml(value='') { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
  function escapeAttr(value='') { return escapeHtml(value).replaceAll("'",'&#039;'); }
})();
