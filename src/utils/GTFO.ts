gsap.registerPlugin(ScrollTrigger);

class GTFO {
    device: string;

    constructor() {
      this.device = this.getDevice();
      this.init();
      this.setupResizeListener();
    }

  cropInImage(img: HTMLDivElement, trigger: HTMLElement | null) {
    img.style.overflow = 'hidden';
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
  cropOutImage(img: HTMLDivElement, trigger: HTMLDivElement) {
    const style = {
      radius: parseInt(img?.computedStyleMap().get('border-radius')?.toString()),
      left: parseInt(img?.computedStyleMap().get('left')?.toString()),
      right: parseInt(img?.computedStyleMap().get('right')?.toString()),
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top center',
        end: 'center center',
        scrub: true,
        markers: false,
      },
    });

    tl.fromTo(
      img,
      {
        borderRadius: style.radius,
        left: style.left,
        right: style.right,
      },
      {
        borderRadius: 0,
        left: 0,
        right: 0,
        duration: 1,
      }
    );
  }
  partnersRowsAnimation(partnersEl: HTMLDivElement) {
    // TODO: Add a bit of velocity
    const rows = partnersEl.querySelectorAll('.partners_row');
      const timelines = Array.from(rows).map((row, i) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(row, { x: `${i % 2 === 0 ? '-' : '+'}200` });
        return tl;
      });

      ScrollTrigger.create({
        trigger: partnersEl,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          timelines.forEach((tl) => tl.progress(self.progress));
        },
      });
  }
  testimonials(items: Element[], trigger: HTMLDivElement) {
    if(this.device === 'mobile') return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top center',
        end: '30% center',
        scrub: true,
        markers: false,
      },
    });
    tl.set(items[0], { zIndex: 1 });
    tl.set(items[2], { zIndex: 2 });
    tl.add('start', 0)
      .fromTo(
        items[0],
        {
          transform: 'rotate(7.85deg)',
        },
        {
          transform: 'rotate(0deg)',
        },
        'start'
      )
      .fromTo(
        items[1],
        {
          transform: 'rotate(-7.12deg) translateX(-60px)',
        },
        {
          transform: 'rotate(0deg) translateX(0px)',
        },
        'start'
      )
      .fromTo(
        items[2],
        {
          transform: 'rotate(-13deg) translate(80px, -230px)',
        },
        {
          transform: 'rotate(0deg) translate(0px, 0px)',
        },
        'start'
      )
      .fromTo(
        items[3],
        {
          transform: 'rotate(7deg) translate(-110px, -220px)',
        },
        {
          transform: 'rotate(0deg) translate(0px, 0px)',
        },
        'start'
      );
  }
  imageBannerAnimation(img: HTMLImageElement, trigger: HTMLElement) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top center',
        end: 'center center',
        scrub: true,
        markers: false,
      }
     })
      tl.fromTo(img, {x: '100%'}, {x: '0%'})
  }
  logoSpin(logo: SVGElement, trigger: HTMLElement) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        markers: false
      }
    });
    tl.to(logo, {rotate: 360})
  }

  homeAnimations() {
    const heroBg: HTMLDivElement = document.querySelector('.main-wrapper .hero .background-image-wrapper')!;
    const overlapBanner = document.querySelector('.overlap-banner .overlap-banner_component');
    const comingSectionBlocks = document.querySelectorAll(
      '.image-content_component:last-child .image-content_image-wrapper'
    );
    const partnersSection: HTMLDivElement = document.querySelector('.partners-banner')!;
    const testimonialSection: HTMLDivElement = document.querySelector('.testimonial-banner .testimonial_component')!;
    const testimonials: Element[] = [...document.querySelectorAll('.testimonial_list .testimonial')]!;
    const ctaBanner: HTMLDivElement = document.querySelector('.cta-banner')!;

    if (heroBg) {
      this.cropInImage(heroBg, heroBg.parentElement);
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
    // TODO: Add a bit of velocity
    if (partnersSection) {
      this.partnersRowsAnimation(partnersSection)
    }
    if (testimonials?.length > 0) {
      this.testimonials(testimonials, testimonialSection);
    }
    if (ctaBanner) {
      const imgWrapper: HTMLDivElement = ctaBanner.querySelector(
        '.background-image-wrapper.is-curved'
      )!;
      this.cropOutImage(imgWrapper, ctaBanner);
    }
  }
  expertiseAnimation() {
    const heroBg: HTMLDivElement = document.querySelector('.main-wrapper .hero .background-image-wrapper')!;
    const imageBannerWrapper: HTMLDivElement = document.querySelector('.image-banner')!;
    const imageBanner: NodeListOf<HTMLImageElement> = imageBannerWrapper?.querySelectorAll('.background-image')!;
    const logoWrapper: HTMLDivElement = document.querySelector('.text-banner')!;
    const logo: SVGElement = logoWrapper.querySelector('.svg-star')!;
    const testimonialSection: HTMLDivElement = document.querySelector('.testimonial-banner .testimonial_component')!;
    const testimonials: Element[] = [...document.querySelectorAll('.testimonial_list .testimonial')]!;
    const partnersSection: HTMLDivElement = document.querySelector('.partners-banner')!;
    
    if(heroBg) {
      this.cropInImage(heroBg, heroBg.parentElement);
    }
    if(imageBannerWrapper && imageBanner.length > 0) {
     this.imageBannerAnimation(imageBanner[1], imageBannerWrapper);
    }
    if(logo) {
      logoWrapper.style.overflow = 'hidden';
      logoWrapper.querySelector('.text-banner_component')!.style.overflow = 'hidden';
      this.logoSpin(logo, logoWrapper); 
    }
    if(testimonials?.length > 0) {
      this.testimonials(testimonials, testimonialSection);
    }
    if(partnersSection) {
      this.partnersRowsAnimation(partnersSection);
    }
  }
  checkPage() {
    const path = window.location.pathname;
    
    if (path === '/' || path === '') {
      return 'home';
    }
    if (path.includes('expertise')) {
      return 'expertise';
    }
    // if (path === 'contact.html') {
    //   return 'contact';
    // }
  }

  getDevice() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }
 
  setupResizeListener() {
    window.addEventListener('resize', () => {
      const newDevice = this.getDevice();
      if (newDevice !== this.device) {
        this.device = newDevice;
        this.init();
      }
    });
  }

  init() {
    const page = this.checkPage();
    if (page === 'home') {
      this.homeAnimations();
    } else if (page === 'expertise') {
      this.expertiseAnimation();
    }
  }
}

export default GTFO;
