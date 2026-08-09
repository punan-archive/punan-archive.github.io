(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  var query = (params.get("q") || params.get("keyword") || "").trim();
  var input = document.querySelector("[data-forum-search] input[name='q']");
  var root = document.querySelector("#forum-search-results");
  if (input) { input.value = query; }

  fetch("/websites/maishan_bbs/data/search-index.json")
    .then(function (response) { return response.json(); })
    .then(function (data) { render(data.items || []); })
    .catch(function () { root.innerHTML = '<div class="result">搜索索引读取失败。</div>'; });

  function render(items) {
    var words = query.split(/\s+/).filter(Boolean);
    var hits = words.length ? items.map(function (item) {
      var haystack = [item.title, item.excerpt, item.author, item.board].join("\n");
      var score = words.reduce(function (total, word) { return total + (haystack.indexOf(word) >= 0 ? 1 : 0); }, 0);
      return { item: item, score: score };
    }).filter(function (entry) { return entry.score > 0; }).sort(function (a, b) {
      return b.score - a.score || b.item.date.localeCompare(a.item.date);
    }) : [];

    document.title = "搜索：" + (query || "") + " - 盟杉中学校园论坛";
    if (!hits.length) {
      root.innerHTML = '<div class="box-title">没有找到匹配结果</div><div class="result"><p>没有找到包含“<span class="hit">' + escapeHtml(query) + '</span>”的主题。</p><div class="result-meta">请尝试缩短关键词，或使用含义相近的词重新搜索。</div></div>';
      return;
    }
    root.innerHTML = '<div class="box-title">搜索“' + escapeHtml(query) + '”　找到 ' + hits.length + ' 个主题</div>' + hits.map(function (entry) {
      var item = entry.item;
      var title = item.url ? '<a href="#" data-punan-url="' + escapeAttr(item.url) + '">' + highlight(item.title, words) + '</a>' : '<span class="uncached-title">' + highlight(item.title, words) + '</span>';
      return '<div class="result"><h3>' + title + '</h3><p>' + highlight(item.excerpt, words) + '</p><div class="result-meta">' + escapeHtml(item.board) + '　' + escapeHtml(item.author || '') + '　' + escapeHtml(item.date) + '</div></div>';
    }).join("");
  }

  function highlight(value, words) {
    var output = escapeHtml(value || "");
    words.forEach(function (word) {
      var escaped = escapeHtml(word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      output = output.replace(new RegExp(escaped, "g"), '<span class="hit">$&</span>');
    });
    return output;
  }
  function escapeHtml(value) { return String(value || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function escapeAttr(value) { return escapeHtml(value).replace(/'/g,"&#039;"); }
}());
