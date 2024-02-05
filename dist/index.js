"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/GTFO.ts
  gsap.registerPlugin(ScrollTrigger);
  var GTFO = class {
    constructor() {
      this.init();
    }
    homeAnimations() {
      const heroBg = document.querySelector(".main-wrapper .hero .background-image-wrapper");
      if (heroBg) {
        heroBg.style.overflow = "hidden";
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroBg?.parentElement,
            // start: 'top center',
            end: "+=100%",
            scrub: true,
            pin: true,
            markers: true
          }
        });
        tl.fromTo(
          heroBg,
          { borderRadius: "0rem", margin: "0" },
          { borderRadius: "3rem", margin: "0.5rem 2rem", duration: 1 }
        );
      }
    }
    checkPage() {
      const path = window.location.pathname;
      const page = path.split("/").pop();
      if (page === "index.html" || page === "") {
        return "home";
      }
      if (page === "about.html") {
        return "about";
      }
      if (page === "contact.html") {
        return "contact";
      }
    }
    init() {
      const page = this.checkPage();
      if (page === "home") {
        this.homeAnimations();
      } else if (page === "about") {
      } else if (page === "contact") {
      }
    }
  };
  var GTFO_default = GTFO;

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    new GTFO_default();
  });
})();
//# sourceMappingURL=index.js.map
