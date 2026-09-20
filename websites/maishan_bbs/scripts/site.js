(function () {
  "use strict";

  var USERS_URL = "/websites/maishan_bbs/data/users.json";

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

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined && text !== null) { node.textContent = text; }
    return node;
  }

  function rankFor(posts, rules) {
    if (typeof posts !== "number") { return null; }
    for (var i = 0; i < rules.length; i += 1) {
      if (rules[i].maxPosts === undefined || posts <= rules[i].maxPosts) {
        return rules[i].label;
      }
    }
    return null;
  }

  function currentStateKey() {
    return document.querySelector(".utility[data-forum-state]")?.getAttribute("data-forum-state") || "2010-11-12";
  }

  function renderSession(data, stateKey) {
    var target = document.querySelector("[data-forum-session]");
    if (!target) { return; }
    var utility = target.closest(".utility");
    var session = data.sessions?.[stateKey] || data.sessions?.["2010-11-12"];
    if (!session) {
      target.textContent = "用户状态未读取";
      return;
    }
    var pmCount = Number(utility?.getAttribute("data-forum-pm") || session.pmCount || 0);
    target.replaceChildren();
    target.append(document.createTextNode("欢迎回来，" + session.displayName));
    target.append(element("span", "sep", "|"));
    var pm = element("a", "", "短消息(" + pmCount + ")");
    pm.href = "#";
    pm.setAttribute("data-punan-url", "http://bbs.ms-school.edu.cn/pm.php?action=view&pmid=512");
    target.append(pm);
    target.append(element("span", "sep", "|"));
    var logout = element("a", "", "退出");
    logout.href = "#";
    logout.setAttribute("data-old-alert", "网络连接中断，退出失败。");
    target.append(logout);
  }

  function renderForumUser(container, user, state, rules) {
    container.replaceChildren();
    var name = element("div", "name");
    if (user.profileUrl) {
      var link = element("a", "", user.nickname);
      link.href = "#";
      link.setAttribute("data-punan-url", user.profileUrl);
      name.append(link);
    } else {
      name.textContent = user.nickname;
    }
    container.append(name);
    container.append(element("div", "avatar", user.avatar || "用"));

    var lines = [];
    if (user.roleLabel) {
      lines.push("身份：" + user.roleLabel);
    } else {
      var rank = rankFor(state.posts, rules);
      if (rank) { lines.push("等级：" + rank); }
    }
    if (container.getAttribute("data-forum-view") !== "compact" && typeof state.posts === "number") {
      lines.push("帖子：" + state.posts);
    }
    if (container.getAttribute("data-forum-view") === "compact" && state.status) {
      lines.push("状态：" + state.status);
    }
    var stats = element("div", "user-stats");
    lines.forEach(function (line, index) {
      if (index) { stats.append(document.createElement("br")); }
      stats.append(document.createTextNode(line));
    });
    container.append(stats);

    var article = container.closest("article.post");
    var main = article?.querySelector(".post-main");
    if (main && user.signature && !main.querySelector(".post-signature")) {
      main.append(element("div", "post-signature", user.signature));
    }
  }

  function hydrateForumUsers(data) {
    var stateKey = currentStateKey();
    var states = data.states?.[stateKey] || data.states?.["2010-11-12"] || {};
    renderSession(data, stateKey);
    document.querySelectorAll("[data-forum-user]").forEach(function (container) {
      var id = container.getAttribute("data-forum-user");
      var user = data.users?.[id];
      if (!user) {
        container.textContent = "用户资料未读取";
        return;
      }
      renderForumUser(container, user, states[id] || {}, data.rankRules || []);
    });
    document.querySelectorAll("[data-forum-profile]").forEach(function (container) {
      var id = container.getAttribute("data-forum-profile");
      var user = data.users?.[id];
      var state = states[id] || {};
      if (!user) {
        container.textContent = "用户资料未读取";
        return;
      }
      container.replaceChildren();
      var name = element("div", "name");
      name.append(element("b", "", user.nickname));
      container.append(name);
      container.append(element("div", "avatar", user.avatar || "用"));
      container.append(element("p", "", "当前状态：" + (state.status || "离线")));
      var message = element("a", "old-button", "发送短消息");
      message.href = "#";
      message.setAttribute("data-old-alert", "网络连接中断，未能发送短消息。");
      container.append(message);
    });
    document.querySelectorAll("[data-forum-profile-details]").forEach(function (container) {
      var id = container.getAttribute("data-forum-profile-details");
      var user = data.users?.[id];
      var state = states[id] || {};
      if (!user) { return; }
      var list = document.createElement("dl");
      var rows = [
        ["用户编号", user.forumUid],
        ["用户组", rankFor(state.posts, data.rankRules || [])],
        ["注册时间", user.registered],
        ["最后访问", user.lastVisit],
        ["主题 / 帖子", typeof state.posts === "number" ? (user.topicCount || 0) + " / " + state.posts : null],
        ["个性签名", user.signature],
        ["个人说明", user.bio],
      ];
      rows.forEach(function (row) {
        if (row[1] === null || row[1] === undefined || row[1] === "") { return; }
        list.append(element("dt", "", row[0]));
        list.append(element("dd", "", String(row[1])));
      });
      container.querySelector("dl, .user-loading")?.remove();
      container.append(list);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch(USERS_URL, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) { throw new Error("forum users " + response.status); }
        return response.json();
      })
      .then(hydrateForumUsers)
      .catch(function () {
        document.querySelectorAll("[data-forum-user]").forEach(function (container) {
          container.textContent = "用户资料未读取";
        });
        document.querySelectorAll("[data-forum-profile], [data-forum-profile-details]").forEach(function (container) {
          container.textContent = "用户资料未读取";
        });
        var session = document.querySelector("[data-forum-session]");
        if (session) { session.textContent = "用户状态未读取"; }
      });

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

    document.addEventListener("click", function (event) {
      var alertLink = event.target.closest?.("[data-old-alert]");
      if (!alertLink) { return; }
      event.preventDefault();
      window.alert(alertLink.getAttribute("data-old-alert"));
    });
  });
}());
