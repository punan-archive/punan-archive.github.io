(() => {
  fetch('/websites/maishan_school/data/school-news.json')
    .then((response) => response.json())
    .then((data) => {
      renderList(data.items);
      renderDetail(data.items);
    });

  function renderList(items) {
    const body = document.querySelector('#school-news-list');
    if (!body) return;
    body.innerHTML = items.slice().sort((a, b) => b.date.localeCompare(a.date)).map((item) => `<tr><td>${link(item.title, item.virtualUrl)}</td><td class="source">${escapeHtml(item.source)}</td><td class="date">${escapeHtml(item.date)}</td></tr>`).join('');
    const counter = document.querySelector('#school-news-count');
    if (counter) counter.textContent = `本页 ${items.length} 条　资料更新至2010-11-12`;
  }

  function renderDetail(items) {
    const root = document.querySelector('#school-news-detail');
    if (!root) return;
    const item = items.find((entry) => entry.id === new URLSearchParams(location.search).get('id'));
    if (!item) { root.innerHTML = '<p>没有找到该新闻。</p>'; return; }
    document.title = `${item.title} - 盟杉中学`;
    root.innerHTML = `<h1>${escapeHtml(item.title)}</h1><div class="article-meta">发布时间：${escapeHtml(item.date)}　供稿：${escapeHtml(item.source)}</div>${item.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}`;
  }

  function link(label, url) { return `<a href="#" data-punan-url="${escapeAttr(url)}">${escapeHtml(label)}</a>`; }
  function escapeHtml(value='') { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
  function escapeAttr(value='') { return escapeHtml(value).replaceAll("'",'&#039;'); }
})();
