/**
 * MFWA — Comportements de la page d'accueil
 * ---------------------------------------------------------------
 * Deux carrousels indépendants dans le hero, chacun avec sa propre
 * source de données côté API WordPress :
 *
 *  - hero__intro (initHeroCarousel) : les slides éditoriales
 *    (titre / accroche / CTA) — n'affecte pas hero__feature.
 *  - hero__feature > news__thumb (initArticleGallery) : les images
 *    intérieures de l'article en vogue (featured_article.gallery[]),
 *    défilement automatique, indépendant du carrousel ci-dessus.
 *
 * Dans les deux cas le script se contente de déplacer la classe
 * « is-active » ; le fondu et les transitions restent gérés en CSS.
 */

(function () {
  "use strict";

  const AUTOPLAY_DELAY = 7000; // ms — mettre 0 pour désactiver le défilement auto
  const SWIPE_THRESHOLD = 45;  // px — distance minimale d'un balayage tactile

  function initHeroCarousel() {
    const root = document.querySelector("[data-hero]");
    if (!root) return;

    const slides = Array.from(root.querySelectorAll("[data-hero-slides] .hero-slide"));
    if (slides.length < 2) return;

    const currentEl = root.querySelector("[data-hero-current]");
    const totalEl = root.querySelector("[data-hero-total]");
    const prevBtn = root.querySelector("[data-hero-prev]");
    const nextBtn = root.querySelector("[data-hero-next]");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let index = slides.findIndex(function (s) { return s.classList.contains("is-active"); });
    if (index < 0) index = 0;
    let timer = null;
    let pointerStartX = null;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    /* --- Affichage ---------------------------------------------- */
    function render() {
      slides.forEach(function (slide, i) {
        const active = i === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        // évite que le lien d'une diapositive masquée reste atteignable au clavier
        if (active) slide.removeAttribute("inert");
        else slide.setAttribute("inert", "");
      });

      if (currentEl) currentEl.textContent = pad(index + 1);
    }

    function goTo(target, fromUser) {
      index = (target + slides.length) % slides.length;
      render();
      if (fromUser) start(); // relance le compte à rebours après une action manuelle
    }

    function prev(fromUser) { goTo(index - 1, fromUser); }
    function next(fromUser) { goTo(index + 1, fromUser); }

    /* --- Défilement automatique --------------------------------- */
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (!AUTOPLAY_DELAY || reducedMotion.matches) return;
      timer = window.setInterval(function () { next(false); }, AUTOPLAY_DELAY);
    }

    /* --- Commandes ---------------------------------------------- */
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(true); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(true); });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { prev(true); }
      else if (e.key === "ArrowRight") { next(true); }
    });

    // Balayage tactile
    root.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      pointerStartX = e.clientX;
    }, { passive: true });

    root.addEventListener("pointerup", function (e) {
      if (pointerStartX === null) return;
      const dx = e.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      if (dx < 0) next(true); else prev(true);
    }, { passive: true });

    root.addEventListener("pointercancel", function () { pointerStartX = null; }, { passive: true });

    // Pause quand l'utilisateur survole, navigue au clavier ou quitte l'onglet
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) start();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", start);
    }

    /* --- Démarrage ---------------------------------------------- */
    if (totalEl) totalEl.textContent = pad(slides.length);
    render();
    start();
  }

  /**
   * Galerie interne de l'article en vogue (news__thumb) : défilement
   * automatique uniquement — pas de contrôles, pas de lien avec le
   * carrousel de hero__intro. Alimentée par featured_article.gallery[].
   */
  function initArticleGallery() {
    const gallery = document.querySelector("[data-article-gallery]");
    if (!gallery) return;

    const slides = Array.from(gallery.querySelectorAll(".news__thumb-slide"));
    if (slides.length < 2) return;

    const DELAY = 4500; // ms
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let index = Math.max(0, slides.findIndex(function (s) { return s.classList.contains("is-active"); }));
    let timer = null;

    function render() {
      slides.forEach(function (slide, i) {
        const active = i === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
    }

    function next() {
      index = (index + 1) % slides.length;
      render();
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (reducedMotion.matches) return;
      timer = window.setInterval(next, DELAY);
    }

    gallery.addEventListener("mouseenter", stop);
    gallery.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", start);
    }

    render();
    start();
  }

  /**
   * Bandeau de filtres au-dessus de « The latest from MFWA ».
   * Ne fait pour l'instant que déplacer l'état actif visuel : le
   * filtrage réel des articles arrivera avec les données WordPress
   * (taxonomie de catégories) une fois l'API branchée.
   */
  function initTopicsFilter() {
    const nav = document.querySelector("[data-topics]");
    if (!nav) return;

    const items = Array.from(nav.querySelectorAll(".topics__item"));

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        items.forEach(function (other) {
          const active = other === item;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-current", active ? "true" : "false");
        });
        // Point d'extension : item.dataset.topic → requête WP (category=…)
        // pour recharger .latest__grid avec les articles filtrés.
      });
    });
  }

  /**
   * Carte « Our reach » : survol/clic d'un pays met en avant la zone
   * correspondante ET la ligne de la liste (et inversement). Pour
   * l'instant purement visuel — point d'extension : data-country ->
   * lien vers la page pays (WordPress) une fois l'API branchée.
   */
  function initReachMap() {
    const map = document.querySelector("[data-reach-map]");
    if (!map) return;

    const hits = Array.from(map.querySelectorAll(".reach__hit"));
    const items = Array.from(document.querySelectorAll(".reach__col li"));
    if (!hits.length) return;

    function setActive(name) {
      hits.forEach(function (hit) {
        hit.classList.toggle("is-active", hit.dataset.country === name);
      });
      items.forEach(function (item) {
        item.classList.toggle("is-active", item.dataset.country === name);
      });
    }

    function clearActive() { setActive(null); }

    hits.forEach(function (hit) {
      const name = hit.dataset.country;
      hit.addEventListener("mouseenter", function () { setActive(name); });
      hit.addEventListener("focus", function () { setActive(name); });
      hit.addEventListener("click", function () {
        // Point d'extension : window.location.href = hit.dataset.countryUrl (WP)
        setActive(name);
      });
      hit.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          hit.dispatchEvent(new Event("click"));
        }
      });
    });

    items.forEach(function (item) {
      const name = item.dataset.country;
      item.addEventListener("mouseenter", function () { setActive(name); });
    });

    map.addEventListener("mouseleave", clearActive);
    document.querySelector(".reach__list").addEventListener("mouseleave", clearActive);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeroCarousel();
    initArticleGallery();
    initTopicsFilter();
    initReachMap();
  });
})();
