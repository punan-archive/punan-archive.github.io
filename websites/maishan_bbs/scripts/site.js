(function () {
  "use strict";

  function virtualNavigate(url) {
    var link = document.createElement("a");
    link.href = "#";
    link.setAttribute("data-punan-url", url);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    window.setTimeout(function () { link.remove(); }, 0);
  }

  function stableNumber(text) {
    var hash = 2166136261;
    for (var i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return 7000 + ((hash >>> 0) % 2000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Older topic lists keep their original link behavior.
    document.querySelectorAll(".uncached-title").forEach(function (element) {
      var link = document.createElement("a");
      link.href = "#";
      link.setAttribute(
        "data-punan-url",
        "http://bbs.ms-school.edu.cn/thread.php?tid=" + stableNumber(element.textContent || "")
      );
      link.innerHTML = element.innerHTML;
      element.replaceWith(link);
    });

    document.querySelectorAll(".main-nav").forEach(function (nav) {
      if (nav.querySelector('[data-punan-url="http://bbs.ms-school.edu.cn/forum.php?fid=6"]')) { return; }
      var searchLink = nav.querySelector('[data-punan-url="http://bbs.ms-school.edu.cn/search.php"]');
      var gamesLink = document.createElement("a");
      gamesLink.href = "#";
      gamesLink.setAttribute("data-punan-url", "http://bbs.ms-school.edu.cn/forum.php?fid=6");
      gamesLink.textContent = "电脑游戏";
      nav.insertBefore(gamesLink, searchLink || null);
    });

    var search = document.querySelector("[data-forum-search]");
    if (search) {
      search.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = search.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        if (!query) {
          if (input) { input.focus(); }
          return;
        }
        virtualNavigate("http://bbs.ms-school.edu.cn/search.php?q=" + encodeURIComponent(query));
      });
    }

    document.querySelectorAll("[data-old-alert]").forEach(function (element) {
      element.addEventListener("click", function (event) {
        event.preventDefault();
        window.alert(element.getAttribute("data-old-alert"));
      });
    });
  });
}());
