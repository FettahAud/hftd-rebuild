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
    cropInImage(img, trigger) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "center center",
          end: "bottom center",
          scrub: true,
          markers: false
        }
      });
      tl.fromTo(
        img,
        { borderRadius: "0rem", margin: "0" },
        { borderRadius: "3rem", margin: "8p 24px", duration: 1 }
      );
    }
    cropOutImage(img, trigger) {
      const style = {
        radius: parseInt(img?.computedStyleMap().get("border-radius")?.toString()),
        left: parseInt(img?.computedStyleMap().get("left")?.toString()),
        right: parseInt(img?.computedStyleMap().get("right")?.toString())
      };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top center",
          end: "center center",
          scrub: true,
          markers: true
        }
      });
      tl.fromTo(
        img,
        {
          borderRadius: style.radius,
          left: style.left,
          right: style.right
        },
        {
          borderRadius: 0,
          left: 0,
          right: 0,
          duration: 1
        }
      );
    }
    homeAnimations() {
      const heroBg = document.querySelector(".main-wrapper .hero .background-image-wrapper");
      const overlapBanner = document.querySelector(".overlap-banner .overlap-banner_component");
      const comingSectionBlocks = document.querySelectorAll(
        ".image-content_component:last-child .image-content_image-wrapper"
      );
      const partnersSection = document.querySelector(".partners-banner");
      const testimonialSection = document.querySelector(".testimonial-banner .testimonial_component");
      const testimonials = document.querySelectorAll(".testimonial_list .testimonial");
      const ctaBanner = document.querySelector(".cta-banner");
      if (heroBg) {
        heroBg.style.overflow = "hidden";
        this.cropInImage(heroBg, heroBg.parentElement);
      }
      if (null) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: overlapBanner,
            end: "+=100%",
            scrub: true,
            pin: true,
            markers: true
          }
        });
        tl.to(comingSectionBlocks, {
          top: "-100%"
        });
      }
      if (partnersSection) {
        const rows = partnersSection.querySelectorAll(".partners_row");
        const timelines = Array.from(rows).map((row, i) => {
          const tl = gsap.timeline({ paused: true });
          tl.to(row, { x: `${i % 2 === 0 ? "-" : "+"}200` });
          return tl;
        });
        ScrollTrigger.create({
          trigger: partnersSection,
          start: "top center",
          end: "bottom center",
          scrub: true,
          markers: false,
          onUpdate: (self) => {
            timelines.forEach((tl) => tl.progress(self.progress));
          }
        });
      }
      if (testimonials?.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: testimonialSection,
            start: "top center",
            end: "30% center",
            scrub: true,
            markers: false
          }
        });
        tl.set(testimonials[0], { zIndex: 1 });
        tl.set(testimonials[2], { zIndex: 2 });
        tl.add("start", 0).fromTo(
          testimonials[0],
          {
            transform: "rotate(7.85deg)"
          },
          {
            transform: "rotate(0deg)"
          },
          "start"
        ).fromTo(
          testimonials[1],
          {
            transform: "rotate(-7.12deg) translateX(-60px)"
          },
          {
            transform: "rotate(0deg) translateX(0px)"
          },
          "start"
        ).fromTo(
          testimonials[2],
          {
            transform: "rotate(-13deg) translate(80px, -230px)"
          },
          {
            transform: "rotate(0deg) translate(0px, 0px)"
          },
          "start"
        ).fromTo(
          testimonials[3],
          {
            transform: "rotate(7deg) translate(-110px, -220px)"
          },
          {
            transform: "rotate(0deg) translate(0px, 0px)"
          },
          "start"
        );
      }
      if (ctaBanner) {
        const imgWrapper = ctaBanner.querySelector(
          ".background-image-wrapper.is-curved"
        );
        this.cropOutImage(imgWrapper, ctaBanner);
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
