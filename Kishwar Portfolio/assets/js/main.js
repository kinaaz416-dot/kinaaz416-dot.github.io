(function () {
  var body = document.body;

  function setTheme(theme) {
    body.setAttribute("data-theme", theme);
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    }
  }

  function initThemeToggle() {
    var toggle = document.getElementById("theme-toggle");
    var storageKey = "kishwar-theme";
    var savedTheme = window.localStorage.getItem(storageKey);
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
    if (!toggle) {
      return;
    }
    toggle.addEventListener("click", function () {
      var next = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
      window.localStorage.setItem(storageKey, next);
    });
  }

  function initMobileMenu() {
    var menuBtn = document.getElementById("menu-toggle");
    var nav = document.getElementById("site-nav");
    if (!menuBtn || !nav) {
      return;
    }
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initActiveNav() {
    var page = body.getAttribute("data-page");
    if (!page) {
      return;
    }
    var links = document.querySelectorAll("#site-nav a");
    var targetMap = {
      home: "index.html",
      expertise: "expertise.html",
      experience: "experience.html",
      projects: "projects.html",
      education: "education.html",
      contact: "contact.html"
    };
    var target = targetMap[page];
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href === target) {
        link.classList.add("active");
      }
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) {
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.14 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  function initCounters() {
    var counters = document.querySelectorAll(".count");
    if (!counters.length) {
      return;
    }
    counters.forEach(function (counter) {
      var goal = Number(counter.getAttribute("data-count") || "0");
      var value = 0;
      var step = Math.max(1, Math.ceil(goal / 40));
      var timer = setInterval(function () {
        value += step;
        if (value >= goal) {
          value = goal;
          clearInterval(timer);
        }
        counter.textContent = String(value);
      }, 30);
    });
  }

  function initTypingText() {
    var el = document.querySelector(".typing-text");
    if (!el) {
      return;
    }
    var words = (el.getAttribute("data-words") || "").split(",").filter(Boolean);
    if (!words.length) {
      return;
    }
    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;
    function tick() {
      var word = words[wordIndex];
      if (deleting) {
        charIndex -= 1;
      } else {
        charIndex += 1;
      }
      el.textContent = word.slice(0, charIndex);
      var speed = deleting ? 45 : 75;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        speed = 1100;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 250;
      }
      window.setTimeout(tick, speed);
    }
    tick();
  }

  function initFilters() {
    var filterRows = document.querySelectorAll(".filter-row");
    if (!filterRows.length) {
      return;
    }
    filterRows.forEach(function (row) {
      var grid = row.parentElement.querySelector(".filter-grid");
      if (!grid) {
        return;
      }
      var buttons = row.querySelectorAll(".filter-btn");
      var cards = grid.children;
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (x) {
            x.classList.remove("active");
          });
          btn.classList.add("active");
          var key = btn.getAttribute("data-filter") || "all";
          Array.prototype.forEach.call(cards, function (card) {
            var bag = card.getAttribute("data-category") || "";
            var show = key === "all" || bag.indexOf(key) !== -1;
            card.hidden = !show;
          });
        });
      });
    });
  }

  function initAccordion() {
    var triggers = document.querySelectorAll(".accordion-trigger");
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".accordion-item");
        if (item) {
          item.classList.toggle("open");
        }
      });
    });
    if (triggers.length > 0) {
      var firstItem = triggers[0].closest(".accordion-item");
      if (firstItem) {
        firstItem.classList.add("open");
      }
    }
  }

  function initTiltCards() {
    var cards = document.querySelectorAll(".tilt-card");
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rx = ((y / rect.height) - 0.5) * -6;
        var ry = ((x / rect.width) - 0.5) * 6;
        card.style.transform = "perspective(800px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  function initScrollUi() {
    var progress = document.getElementById("scroll-progress");
    var backTop = document.getElementById("back-to-top");
    function onScroll() {
      var top = window.scrollY || document.documentElement.scrollTop;
      var full = document.documentElement.scrollHeight - window.innerHeight;
      var width = full > 0 ? (top / full) * 100 : 0;
      if (progress) {
        progress.style.width = width.toFixed(2) + "%";
      }
      if (backTop) {
        if (top > 280) {
          backTop.classList.add("visible");
        } else {
          backTop.classList.remove("visible");
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (backTop) {
      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) {
      return;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name");
      var email = document.getElementById("email");
      var message = document.getElementById("message");
      var subject = encodeURIComponent("Portfolio Inquiry from " + (name ? name.value : ""));
      var bodyText = "Name: " + (name ? name.value : "") + "\nEmail: " + (email ? email.value : "") + "\n\nMessage:\n" + (message ? message.value : "");
      var body = encodeURIComponent(bodyText);
      window.location.href = "mailto:kinaaz416@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  initThemeToggle();
  initMobileMenu();
  initActiveNav();
  initReveal();
  initCounters();
  initTypingText();
  initFilters();
  initAccordion();
  initTiltCards();
  initScrollUi();
  initContactForm();
})();
