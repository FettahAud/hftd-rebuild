gsap.registerPlugin(ScrollTrigger);

class GTFO {
  constructor() {
    this.init();
  }

  cropImage(img: HTMLDivElement, trigger: HTMLDivElement) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'center center',
        end: 'bottom center',
        scrub: true,
        markers: false,
      },
    });
    tl.fromTo(
      img,
      { borderRadius: '0rem', margin: '0' },
      { borderRadius: '3rem', margin: '8p 24px', duration: 1 }
    );
  }

  homeAnimations() {
    const heroBg = document.querySelector('.main-wrapper .hero .background-image-wrapper');
    const overlapBanner = document.querySelector('.overlap-banner .overlap-banner_component');
    const comingSectionBlocks = document.querySelectorAll(
      '.image-content_component:last-child .image-content_image-wrapper'
    );
    const partnersSection = document.querySelector('.partners-banner');

    if (heroBg) {
      heroBg.style.overflow = 'hidden';
      this.cropImage(heroBg, heroBg.parentElement);
    }
    if (null) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: overlapBanner,
          end: '+=100%',
          scrub: true,
          pin: true,
          markers: true,
        },
      });
      tl.to(comingSectionBlocks, {
        top: '-100%',
      });
    }
    if (partnersSection) {
      const rows = partnersSection.querySelectorAll('.partners_row');

      // Create an array to store the timelines
      const timelines = Array.from(rows).map((row, i) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(row, { x: `${i % 2 === 0 ? '-' : '+'}${200}` });
        return tl;
      });

      ScrollTrigger.create({
        trigger: partnersSection,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          timelines.forEach((tl) => tl.progress(self.progress));
        },
      });
    }
  }

  checkPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    if (page === 'index.html' || page === '') {
      return 'home';
    }
    if (page === 'about.html') {
      return 'about';
    }
    if (page === 'contact.html') {
      return 'contact';
    }
  }

  init() {
    const page = this.checkPage();
    if (page === 'home') {
      this.homeAnimations();
    } else if (page === 'about') {
      // aboutAnimations();
    } else if (page === 'contact') {
      // contactAnimations();
    }
  }
}

export default GTFO;
