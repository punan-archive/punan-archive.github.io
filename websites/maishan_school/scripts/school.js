(function () {
  "use strict";

  function showLegacyMessage(message) {
    window.alert(message);
  }

  document.addEventListener("click", function (event) {
    var action = event.target.closest("[data-school-action]");
    if (!action) return;

    var type = action.getAttribute("data-school-action");
    if (type === "favorite") {
      event.preventDefault();
      showLegacyMessage("请按 Ctrl+D 将“盟杉中学”加入收藏夹。");
    }
    if (type === "homepage") {
      event.preventDefault();
      showLegacyMessage("您的浏览器不支持自动设置首页，请在浏览器选项中手动设置。");
    }
    if (type === "print") {
      event.preventDefault();
      window.print();
    }
  });
}());
