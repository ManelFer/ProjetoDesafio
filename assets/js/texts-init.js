(function () {
  "use strict";

  var TEXTS = window.TEXTS || {};

  function applyTexts() {

    document.querySelectorAll("[data-text-key]").forEach(function (el) {
      var key = el.getAttribute("data-text-key");
      if (key && Object.prototype.hasOwnProperty.call(TEXTS, key)) {
        el.textContent = TEXTS[key];
      }
    });

 
    document
      .querySelectorAll("[data-placeholder-key]")
      .forEach(function (el) {
        var key = el.getAttribute("data-placeholder-key");
        if (key && Object.prototype.hasOwnProperty.call(TEXTS, key)) {
          el.setAttribute("placeholder", TEXTS[key]);
        }
      });


    document.querySelectorAll("[data-email-key]").forEach(function (el) {
      var key = el.getAttribute("data-email-key");
      if (key && Object.prototype.hasOwnProperty.call(TEXTS, key)) {
        var value = TEXTS[key];
        el.textContent = value;
        if (el.tagName.toLowerCase() === "a") {
          el.setAttribute("href", "mailto:" + value);
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyTexts);
  } else {
    applyTexts();
  }
})();

