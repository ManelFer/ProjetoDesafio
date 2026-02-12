
(function () {
  "use strict";

  function criarItemFAQ(item) {
    var faqItem = document.createElement("div");
    faqItem.className = "faq-item";

    var header = document.createElement("button");
    header.className = "faq-header";
    header.type = "button";

    var titleWrap = document.createElement("div");
    titleWrap.className = "faq-title";
    var h3 = document.createElement("h3");
    h3.textContent = item.titulo;
    titleWrap.appendChild(h3);

    var icon = document.createElement("span");
    icon.className = "faq-icon";
    icon.setAttribute("aria-hidden", "true");

    header.appendChild(titleWrap);
    header.appendChild(icon);

    var body = document.createElement("div");
    body.className = "faq-body";
    var p = document.createElement("p");
    p.textContent = item.paragrafo;
    body.appendChild(p);

    faqItem.appendChild(header);
    faqItem.appendChild(body);

    return faqItem;
  }

  function initAcordeao(container) {
    var faqItems = container.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {
      var header = item.querySelector(".faq-header");
      var body = item.querySelector(".faq-body");

      header.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove("is-open");
            var otherBody = otherItem.querySelector(".faq-body");
            if (otherBody) {
              otherBody.style.maxHeight = null;
            }
          }
        });

        if (isOpen) {
          item.classList.remove("is-open");
          body.style.maxHeight = null;
        } else {
          item.classList.add("is-open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  }

  function init() {
    var grid = document.querySelector(".duvidas .faq-grid");
    var data = window.FAQ_DATA;

    if (!grid || !data || !Array.isArray(data)) {
      return;
    }

    grid.innerHTML = "";
    data.forEach(function (item) {
      grid.appendChild(criarItemFAQ(item));
    });

    initAcordeao(grid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
