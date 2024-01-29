import barbaRouter from '@barba/router';
gsap.registerPlugin(ScrollTrigger, Observer);

const lenis = new Lenis();

// Use Gsap ScrollTrigger.update on Lenis scroll event
lenis.on('scroll', ScrollTrigger.update);

// Use Gsap ticker to call lenis.raf with smoothed time
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Set up lag smoothing for Gsap ticker
gsap.ticker.lagSmoothing(0);

// Start the animation loop using requestAnimationFrame

// const raf = (time) => {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// };
// requestAnimationFrame(raf);

const splitLines = (element) => {
  // Get the innerHTML of the element
  const html = element.innerHTML;
  element.style.overflow = 'hidden';
  // Split the html by spaces and line breaks
  const parts = html.split(/(<br>)/);

  // Map over the parts, wrapping words in spans but leaving line breaks as they are
  const result = parts
    .map((part) => (part === '<br>' ? null : `<span style="display: inline-block;">${part}</span>`))
    .join(' ');

  // Set the innerHTML of the element to the result
  element.innerHTML = result;
};

const splitWord = (element) => {
  if (!element) {
    return;
  }

  // element.style.whiteSpace = "pre-wrap";
  element.style.overflow = 'hidden';

  const splitText = element.innerText.split(' ');
  element.innerHTML = '';
  splitText.forEach((word) => {
    const span = document.createElement('span');
    span.innerText = word;
    span.style.display = 'inline-block';
    element.appendChild(span);
    element.innerHTML += ' ';
  });
  return element;
};

const splitText = (element) => {
  if (!element) {
    return;
  }

  element.style.whiteSpace = 'pre-wrap';
  element.style.overflow = 'hidden';

  // split each letter into a span
  const splitText = element.innerText.split('');
  element.innerHTML = '';
  splitText.forEach((letter) => {
    const span = document.createElement('span');
    span.innerText = letter;
    // span.style.display = "inline-block";
    element.appendChild(span);
  });

  return element;
};

class NavAnimations {
  constructor() {
    this.resize();
  }
  navHover() {
    if (this.navLinks) {
      this.navLinks.forEach((item) => {
        const { image } = item.dataset;
        if (image) {
          let timeout;
          item.addEventListener('mouseover', () => {
            clearTimeout(timeout);
            this.navImage.src = image;
            gsap.to([this.navImage, this.navOverlay], {
              opacity: 1,
              duration: 0.4,
            });
          });
          item.addEventListener('mouseout', () => {
            if (this.imageState) return;
            gsap.to([this.navImage, this.navOverlay], {
              opacity: 0,
              duration: 0.4,
            });
          });
        }
      });
    }
  }

  hideMenuAnimation(item) {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', duration: 0.6 },
        onComplete: () => {
          resolve();
        },
      });
      this.imageState = true;
      this.navImage.src = item.dataset.image;
      this.navImage.style.opacity = 1;
      this.navOverlay.style.opacity = 1;
      tl.to(this.separators, {
        width: '0%',
      })
        .to(
          this.navLinks,
          {
            y: 100,
          },
          '-=0.5'
        )
        .to(
          [
            this.navRightMenu.navFooterLinks,
            this.navRightMenu.copyLeft,
            this.navRightMenu.copyRight,
          ],
          {
            y: 200,
            duration: 1.5,
          },
          '-=0.5'
        )
        .to(
          this.navRightMenu.separator,
          {
            width: 0,
            duration: 0.7,
          },
          '-=1.5'
        )
        .to(
          [
            this.navRightMenu.paragraph.querySelectorAll('span span'),
            this.navRightMenu.copyRight.querySelectorAll('span span'),
          ],
          {
            y: 300,
            duration: 1.5,
            stagger: 0.05,
          },
          '-=1.5'
        )
        .to(
          [this.navImageWrap, this.navHeader],
          {
            width: '100vw',
            ease: 'power4.out',
            duration: 1.2,
          },
          '-=.65'
        );
    });
  }

  setup() {
    this.imageState = false;
    this.navImage = document.querySelector('#nav-image');
    this.menuButton = document.querySelector('.nav_buttons .nav_btn');
    this.navOverlay = document.querySelector('.nav_grid .nav_image-overlay');
    this.navLinks = document.querySelectorAll('.nav_link');
    // We may need to add nav_footer-link to animate stuff
    this.separators = document.querySelectorAll('.horizontal-separator');
    this.header = document.querySelector('.header');
    this.navHeader = document.querySelector('.nav_header');
    this.navRightMenu = {
      paragraph: document.querySelector('.nav_footer-list .nav_footer-item .address p'),
      copyRight: document.querySelector('.nav_footer-copyright .copyright_right div'),
      copyLeft: document.querySelector('.nav_footer-copyright .copyright_left div'),
      separator: document.querySelector('.nav_grid .nav_footer .separator'),
      navFooterLinks: document.querySelectorAll(
        '.nav_footer-list .nav_footer-item .nav_footer-link'
      ),
    };
    this.navImageWrap = document.querySelector('.nav_image-wrap');
    this.device = window.innerWidth > 767 ? 'desktop' : 'mobile';
    splitLines(this.navRightMenu.paragraph);
    splitLines(this.navRightMenu.copyRight);
  }
  mobileMenuTL() {
    gsap
      .timeline({
        defaults: { ease: 'power2.inOut', duration: 0.6 },
      })
      .set(['.nav_list .nav_item .nav_link', '.nav_footer-list .nav_footer-item a'], {
        y: -100,
        // opacity: 0,
      })
      .to('.nav_list .nav_item .nav_link', {
        y: 0,
        stagger: 0.05,
        ease: 'power2.out',
      })
      .to(
        '.nav_footer-list .nav_footer-item a',
        {
          y: 0,
          stagger: 0.05,
          ease: 'power2.out',
        },
        '-=0.7'
      );
  }
  desktopMenuTL() {
    gsap
      .timeline({
        defaults: { ease: 'power2.inOut', duration: 0.6 },
      })
      .addLabel('start', 0.25)
      .fromTo(
        this.navLinks,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: 'power2.out',
        },
        'start'
      )
      .fromTo(
        this.separators,
        {
          width: 0,
          opacity: 0,
        },
        {
          opacity: 1,
          width: '100%',
        },
        'start+=0.2'
      )
      .fromTo(
        [this.navRightMenu.navFooterLinks, this.navRightMenu.copyLeft, this.navRightMenu.copyRight],
        {
          y: -200,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
        },
        'start'
      )
      .fromTo(
        this.navRightMenu.separator,
        {
          width: 0,
          opacity: 0,
        },
        {
          width: '100%',
          opacity: 1,
        },
        'start'
      )
      .fromTo(
        [
          this.navRightMenu.paragraph.querySelectorAll('span span'),
          this.navRightMenu.copyRight.querySelectorAll('span span'),
        ],
        {
          y: -300,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.75,
        },
        'start'
      );
  }

  openMenuAnimation() {
    if (this.device === 'desktop') {
      this.desktopMenuTL();
    } else if (this.device === 'mobile') {
      this.mobileMenuTL();
    }
  }

  resize() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767 && this.device === 'mobile') {
        this.device = 'desktop';
        this.init();
      } else if (window.innerWidth <= 767 && this.device === 'desktop') {
        this.device = 'mobile';
        this.init();
      }
    });
  }
  init() {
    this.setup();
    const navLinkFunction = (e, item) => {
      e.preventDefault();
      const getLanguage = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        // List of known language codes
        const languages = ['nl', 'de', 'en']; // Add more languages as needed
        // Check if the first part of the path is a known language code
        return languages.includes(parts[1]) ? parts[1] : '';
      };
      // Determine the base URL based on the current language
      const language = getLanguage();
      console.log(language);
      if (this.device === 'desktop') {
        this.hideMenuAnimation(item).then(() => {
          barba.go(`/${language}/${item.dataset.href}`, { trigger: 'nav-animation' });
        });
      } else {
        // we may need to add animation here
        barba.go(`/${language}/${item.dataset.href}`, { trigger: 'nav-animation' });
      }
    };
    this.navLinks.forEach((item) => {
      item.addEventListener('click', (e) => navLinkFunction(e, item));
      item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          console.log('enter');
          navLinkFunction(e, item);
        }
      });
    });
    if (this.device === 'desktop') {
      this.navHover();
    }
    this.menuButton.addEventListener('click', () => this.openMenuAnimation());
  }
}

class PageTransition {
  constructor() {
    this.footer = document.querySelector('.section_sticky-footer');
    this.ScrollTrigger = ScrollTrigger;
  }
  footerAnimation() {
    const tl = gsap.timeline();
    const movingText = this.footer.querySelectorAll('.text-mask-down');
    movingText.forEach((el) => {
      splitLines(el);
    });
    tl.to(this.footer, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      ease: 'expo.inOut',
      duration: 1,
      scrollTrigger: {
        trigger: this.footer,
        scrub: true,
        // start: "top 70%",
        // end: "50% 70%",
        pin: true,
        markers: false,
        pinSpacing: 'margin',
      },
    });
  }
  getScrollPosition(id) {
    this.ScrollTrigger.refresh();
    const st = this.ScrollTrigger.create({ trigger: id });
    const stEnd = st.end;
    console.log(st);
    st.kill();
    return stEnd;
  }
  moveText() {
    const textTl = gsap.timeline();
    const movingText = this.footer.querySelectorAll('.text-mask-down');
    textTl
      .to(movingText[0].querySelectorAll('span'), {
        duration: 0.5,
        stagger: 0.01,
        top: movingText[0].offsetHeight,
        ease: 'power2.inOut',
      })
      .to(
        [movingText[1].querySelectorAll('span'), this.footer.querySelector('.svg-mask-down')],
        {
          duration: 0.5,
          stagger: 0.01,
          top: movingText[1].offsetHeight,
          ease: 'power2.in',
          onComplete: () => {
            const path = this.footer.getAttribute('data-next');
            barba.go(path, {
              trigger: 'footer-animation',
            });
          },
        },
        '-=.35'
      );
  }
  init() {
    this.footer = document.querySelector('.section_sticky-footer');
    if (!this.footer) return;
    this.footerAnimation();
    const manager = new Hammer.Manager(this.footer);
    // Create a recognizer
    const Tap = new Hammer.Tap({
      taps: 1,
    });

    // Add the recognizer to the manager
    manager.add(Tap);

    // Subscribe to the desired event
    manager.on('tap', (e) => {
      //  if (this.lenis) {
      console.log('click');
      lenis.scrollTo(this.getScrollPosition(this.footer), {
        duration: 1,
        // lerp: 2,
        // lock: true,
        onComplete: () => {
          this.moveText();
        },
      });
    });
  }
}

class Slideshow {
  DOM = {
    el: null, // Main slideshow container
    slides: null, // Individual slides
    slidesInner: null, // Inner content of slides (usually images)
    wrapper: null,
    footerList: null,
  };
  current = 0;
  slidesTotal = 0;
  isAnimating = false;

  NEXT = 1;
  PREV = -1;

  constructor(DOM_el) {
    // Initialize DOM elements
    this.DOM.wrapper = DOM_el;
    this.DOM.el = DOM_el.querySelector('.js_slider__inner_wrapper');
    this.DOM.slides = [...this.DOM.el.querySelectorAll('.js_slider_slide')];
    this.DOM.slidesInner = this.DOM.slides.map((item) => item.querySelector('.js_slide_img'));

    // Set initial slide as current
    this.DOM.slides[this.current].classList.add('js_slider_slide--current');
    this.DOM.footerList = DOM_el.querySelector('.slider_footer-list');

    // Count total slides
    this.slidesTotal = this.DOM.slides.length;
    this.device = window.innerWidth > 767 ? 'desktop' : 'mobile';
    if (this.DOM.footerList) {
      this.createDots();
    }
    this.enableSlider();
    this.resize();
  }

  createDots() {
    for (let i = 0; i < this.slidesTotal; i++) {
      const activeClass = i === this.current ? 'is-active' : '';
      this.DOM.footerList.innerHTML += `
        <li data-index="${i}" class="slider_footer-item">
          <div class="slide-dot ${activeClass}"></div>
        </li>
      `;
    }
    this.DOM.footerList.querySelectorAll('.slider_footer-item').forEach((el) => {
      el.addEventListener('click', () => {
        this.navigateTo(el.dataset.index);
      });
    });
  }

  updateActiveDot() {
    if (!this.DOM.footerList) return;
    // Remove the active class from all dots
    this.DOM.footerList.querySelectorAll('.slide-dot').forEach((dot) => {
      dot.classList.remove('is-active');
    });

    // Add the active class to the current dot
    const activeDot = this.DOM.footerList.children[this.current].querySelector('.slide-dot');
    if (activeDot) {
      activeDot.classList.add('is-active');
    }
  }

  disableSlider() {
    if (this.obs.isEnabled) {
      this.obs.disable();
      this.DOM.wrapper.classList.remove('js_slider');
      this.DOM.slides.forEach((slide) => {
        gsap.set(slide, { clearProps: 'all' });
        gsap.set(slide.querySelector('.tabs_body> p'), { clearProps: 'all' });
      });
      this.DOM.slidesInner.forEach((img) => {
        gsap.set(img, { clearProps: 'all' });
      });
    }
  }

  enableSlider() {
    if (!this.obs.isEnabled) {
      this.obs.enable();
    }
    this.DOM.wrapper.classList.add('js_slider');
  }
  obs = Observer.create({
    type: 'touch',
    onRight: () => this.prev(),
    onLeft: () => this.next(),
    tolerance: 120,
  });

  next() {
    this.navigate(this.NEXT);
  }
  prev() {
    this.navigate(this.PREV);
  }

  navigateTo(index) {
    if (this.isAnimating || index === this.current) return false;
    this.isAnimating = true;
    if (index < 0 || index >= this.slidesTotal) {
      return;
    }
    const direction = index > this.current ? 1 : -1;
    const text = this.DOM.slides[this.current].querySelectorAll('.slider_text-fade');
    const previous = this.current;
    this.current = index;

    const currentSlide = this.DOM.slides[previous];
    const currentInner = this.DOM.slidesInner[previous];
    const upcomingSlide = this.DOM.slides[this.current];
    const upcomingInner = this.DOM.slidesInner[this.current];
    let animationDelay = 0;

    const nextText = this.DOM.slides[this.current].querySelectorAll('.slider_text-fade');

    text.length > 0 ? (animationDelay = 0.8) : (animationDelay = 0);

    this.updateActiveDot();
    // Remove the current class from the current slide
    gsap
      .timeline({
        defaults: {
          duration: 1.6,
          ease: 'power3.inOut',
        },
        onStart: () => {
          // Add class to the upcoming slide to mark it as current
          this.DOM.slides[this.current].classList.add('js_slider_slide--current');
        },
        onComplete: () => {
          // Remove class from the previous slide to unmark it as current
          this.DOM.slides[previous].classList.remove('js_slider_slide--current');
          // Reset animation flag
          this.isAnimating = false;
        },
      })
      .addLabel('text-fade', 0)
      .addLabel('start', animationDelay)
      .set(nextText, {
        opacity: 0,
      })
      .to(
        text,
        {
          opacity: 0,
          duration: 1,
        },
        'text-fade'
      )
      .to(
        currentSlide,
        {
          xPercent: -direction * 100,
        },
        'start'
      )
      .to(
        currentInner,
        {
          startAt: {
            transformOrigin: direction === this.NEXT ? '100% 50%' : '0% 50%',
          },
          scaleX: 4,
        },
        'start'
      )
      .fromTo(
        upcomingSlide,
        {
          xPercent: direction * 100,
        },
        {
          xPercent: 0,
        },
        'start'
      )
      .fromTo(
        upcomingInner,
        {
          transformOrigin: direction === this.NEXT ? '0% 50%' : '100% 50%',
          xPercent: -direction * 100,
          scaleX: 4,
        },
        {
          xPercent: 0,
          scaleX: 1,
        },
        'start'
      )
      .to(
        nextText,
        {
          opacity: 1,
          duration: 1,
        },
        'start'
      );
  }
  navigate(direction) {
    // Check if animation is already running
    if (this.isAnimating) return false;
    this.isAnimating = true;
    const text = this.DOM.slides[this.current].querySelectorAll('.slider_text-fade');

    // Update the current slide index based on direction
    const previous = this.current;
    this.current =
      direction === 1
        ? this.current < this.slidesTotal - 1
          ? ++this.current
          : 0
        : this.current > 0
          ? --this.current
          : this.slidesTotal - 1;

    this.updateActiveDot();

    // Get the current and upcoming slides and their inner elements
    const currentSlide = this.DOM.slides[previous];
    const currentInner = this.DOM.slidesInner[previous];
    const upcomingSlide = this.DOM.slides[this.current];
    const upcomingInner = this.DOM.slidesInner[this.current];

    let animationDelay = 0;

    const nextText = this.DOM.slides[this.current].querySelectorAll('.slider_text-fade');

    text.length > 0 ? (animationDelay = 0.8) : (animationDelay = 0);

    // Animation sequence using GSAP
    gsap
      .timeline({
        defaults: {
          duration: 1.6,
          ease: 'power3.inOut',
        },
        onStart: () => {
          // Add class to the upcoming slide to mark it as current
          this.DOM.slides[this.current].classList.add('js_slider_slide--current');
        },
        onComplete: () => {
          // Remove class from the previous slide to unmark it as current
          this.DOM.slides[previous].classList.remove('js_slider_slide--current');
          // Reset animation flag
          this.isAnimating = false;
        },
      })
      // Defining animation steps
      .addLabel('text-fade', 0)
      .addLabel('start', animationDelay)
      .set(nextText, {
        opacity: 0,
      })
      .to(
        text,
        {
          opacity: 0,
          duration: 1,
        },
        'text-fade'
      )
      .to(
        currentSlide,
        {
          xPercent: -direction * 100,
        },
        'start'
      )
      .to(
        currentInner,
        {
          startAt: {
            transformOrigin: direction === this.NEXT ? '100% 50%' : '0% 50%',
          },
          scaleX: 4,
        },
        'start'
      )
      .fromTo(
        upcomingSlide,
        {
          xPercent: direction * 100,
        },
        {
          xPercent: 0,
        },
        'start'
      )
      .fromTo(
        upcomingInner,
        {
          transformOrigin: direction === this.NEXT ? '0% 50%' : '100% 50%',
          xPercent: -direction * 100,
          scaleX: 4,
        },
        {
          xPercent: 0,
          scaleX: 1,
        },
        'start'
      )
      .to(nextText, {
        opacity: 1,
        duration: 1,
      });
  }

  afterResize() {
    if (this.device === 'desktop') {
      if (this.DOM.wrapper.classList.contains('js_mobile_slider')) {
        this.disableSlider();
      } else {
        this.enableSlider();
      }
    } else if (this.device === 'mobile') {
      if (this.DOM.wrapper.classList.contains('no-slider-mobile')) {
        this.disableSlider();
      } else {
        this.enableSlider();
        // Find out which one has data-slider and make it the current slider
        this.DOM.slides[this.current].classList.remove('js_slider_slide--current');
        // taking the middle el
        this.current =
          this.DOM.slides.findIndex((el) => el.dataset.slider) !== -1
            ? this.DOM.slides.findIndex((el) => el.dataset.slider)
            : 0;
        this.DOM.slides[this.current].classList.add('js_slider_slide--current');
      }
    }
  }

  resize() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767 && this.device === 'mobile') {
        this.device = 'desktop';
        this.afterResize();
      } else if (window.innerWidth <= 767 && this.device === 'desktop') {
        this.device = 'mobile';
        this.afterResize();
      }
    });
    this.afterResize();
  }
}

class Animations {
  constructor() {
    this.navAnimation = new NavAnimations();
    this.pageTransition = null;
    this.footerTransitionPage = false;
    // this.sliders = [];
  }

  sliders() {
    this.slidersElements = document.querySelectorAll('.js_slider');
    if (!this.slidersElements) return;
    this.slidersElements.forEach((sliderEl) => {
      if (sliderEl.classList.contains('fullscreen_slider')) {
        const slider = new Slideshow(sliderEl);
        sliderEl.querySelectorAll('.slide_navigation--next').forEach((el) => {
          el.addEventListener('click', () => slider.next());
        });
        if (sliderEl.querySelector('.slide_navigation--prev')) {
          sliderEl.querySelectorAll('.slide_navigation--prev').forEach((el) => {
            el.addEventListener('click', () => slider.prev());
          });
        }
      }
      if (sliderEl.classList.contains('tabs_slider')) {
        const slider = new Slideshow(sliderEl);
        sliderEl.querySelectorAll('.tabs_navigation-link').forEach((el, i) => {
          el.setAttribute('data-index', i);
          el.addEventListener('click', () => {
            slider.navigateTo(el.getAttribute('data-index'));
          });
        });
      }
    });
    this.mobileSliders = document.querySelectorAll('.js_mobile_slider');
    if (this.mobileSliders === 0) return;
    this.mobileSliders.forEach((sliderEl) => {
      const slider = new Slideshow(sliderEl);
    });
  }

  createIntroDom() {
    const introWrapper = document.createElement('div');
    introWrapper.className = 'intro-wrapper';

    const logos = document.createElement('div');
    logos.className = 'logos';

    const word = document.createElement('div');
    word.className = 'word';
    word.style.width = '250px';

    const wordImg = document.createElement('img');
    wordImg.src =
      'https://uploads-ssl.webflow.com/6526def143070dfe0ce407e1/657bfded1c2da95ba7959e01_stil-wordmark.svg';

    word.appendChild(wordImg);

    const date = document.createElement('div');
    date.className = 'date';
    date.style.width = '100px';

    const dateImg = document.createElement('img');
    dateImg.src =
      'https://uploads-ssl.webflow.com/6526def143070dfe0ce407e1/657bfded1f95ed6de733731b_stil-date.svg';

    date.appendChild(dateImg);

    logos.appendChild(word);
    logos.appendChild(date);

    introWrapper.appendChild(logos);

    document.body.appendChild(introWrapper);
  }

  onceAnimation(next) {
    const tl = gsap.timeline();
    let animateHeader = true;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 767px)', () => {
      animateHeader = true;
    }).add('(max-width: 767px)', () => {
      animateHeader = false;
    });
    this.createIntroDom();

    next.querySelectorAll('.header .nav_buttons .nav_btn-text').forEach((el) => {
      splitText(el);
    });
    splitWord(next.querySelector('.section_hero .hero_header h1'));
    tl.from('.intro-wrapper .word img', {
      duration: 0.75,
      y: -200,
      ease: 'power4.out',
      delay: 0.5,
    })
      .from('.intro-wrapper .date img', {
        duration: 0.75,
        y: -40,
        ease: 'power4.out',
        delay: 0.3,
      })
      .to('.intro-wrapper', {
        opacity: 0,
        onComplete: () => {
          document.querySelector('.intro-wrapper').remove();
          console.log('should be removed');
        },
      })
      .fromTo(
        animateHeader &&
          gsap.utils.toArray(
            next.querySelectorAll([
              '.header .language_list .language_item',
              '.header .language_list .language_item a',
              '.header .logo',
              '.header .nav_buttons .nav_btn-text span',
              '.header .vertical-separator',
              '.header .nav-btn',
            ])
          ),
        {
          y: -50,
          duration: 1,
          opacity: 0,
          ease: 'power2.inOut',
          // clearProps: "all",
        },
        {
          y: 0,
          stagger: 0.05,
          opacity: 1,
        }
      )
      .fromTo(
        gsap.utils.toArray(
          next.querySelectorAll([
            '.hero_component .hero_header h1 span',
            '.section_hero .hero_header h1 span',
            '.hero_footer .button_line-2',
            '.hero_footer .button_text',
          ])
        ),
        {
          y: 50,
          opacity: 0,
          duration: 1,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
        },
        '-=1'
      );
    return tl;
  }

  animationLeave(current) {
    const tl = gsap.timeline();
    tl.to(
      gsap.utils.toArray(
        current.querySelectorAll([
          '.hero_component .hero_header h1 span',
          '.hero_component .hero_footer a',
          '.section_hero .hero_header h1 span',
        ])
      ),
      {
        y: -50,
        duration: 1,
        ease: 'power2.inOut',
        opacity: 0,
        // clearProps: "all",
      }
    );
    return tl;
  }

  animationEnter(next) {
    const tl = gsap.timeline();
    next.querySelectorAll('.header .nav_buttons .nav_btn-text').forEach((el) => {
      splitText(el);
    });
    splitWord(next.querySelector('.section_hero .hero_header h1'));

    tl.fromTo(
      gsap.utils.toArray(
        next.querySelectorAll([
          '.hero_component .hero_header h1 span',
          '.hero_component .hero_footer a',
          '.section_hero .hero_header h1 span',
          '.hero_component .hero_footer a',
        ])
      ),
      {
        y: 50,
        opacity: 0,
        duration: 1,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
      }
    );
    return tl;
  }

  barbaInit() {
    barba.hooks.after(({ trigger }) => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      Webflow.ready();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.refresh();
      this.init();
    });
    barba.init({
      transitions: [
        {
          name: 'nav-transition',
          leave: ({ current }) => {
            return this.animationLeave(current.container);
          },
          once: ({ next }) => {
            return this.onceAnimation(next.container);
          },
          enter: ({ next }) => {
            // if (this.device === "mobile") return;
            this.animationEnter(next.container);
          },
        },
        {
          name: 'page-transition',
          from: {
            namespace: ['room'],
          },
          to: {
            namespace: ['room'],
          },
          custom: ({ current, next, trigger }) => {
            if (trigger.trigger === 'footer-animation') {
              return true;
            }
            return false;
          },
          once: ({ next }) => {
            this.onceAnimation(next.container);
          },
          leave: ({ current }) => {
            return this.animationLeave(current.container);
          },
          enter: ({ next }) => {
            this.animationEnter(next.container);
          },
        },
      ],
    });
    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', function (e) {
        console.log('clicked on 1073');
        e.preventDefault();
        barba.go(this.getAttribute('href'));
      });
    });
  }

  footerPageTransition() {
    this.footer = document.querySelector('.section_sticky-footer');
    if (this.footer) {
      this.pageTransition = new PageTransition(this.footer);
      this.pageTransition.init();
    }
  }

  mobileSliderAnimations() {
    let swiperInstances = []; // Array to store Swiper instances
    let isResizing = false; // Variable to track resizing status
    let resizeTimeout; // Variable to store the timeout ID
    let setExtraSlides = true; // Variable to check if extra slides should be created

    function initializeSwiper() {
      const sliders = document.querySelectorAll('.swiper_slider');
      if (sliders) {
        sliders.forEach((slider) => {
          const mobileOffsetSlider = slider.querySelector('.swiper.offset');
          const mobileManipulationSlider = slider.querySelector('.swiper.manipulate');

          if (mobileOffsetSlider) {
            const swiper = new Swiper(mobileOffsetSlider, {
              speed: 1000,
              loop: true,
              initialSlide: 3,
              slidesPerView: 1.5,
              centeredSlides: true,
              spaceBetween: 16,
            });

            swiperInstances.push(swiper);
          }

          if (mobileManipulationSlider) {
            const swiperManipulate = new Swiper(mobileManipulationSlider, {
              speed: 1000,
              slidesPerView: 1.1,
              spaceBetween: 16,
              freeMode: {
                enabled: true,
                sticky: true,
              },
            });
            if (setExtraSlides) {
              swiperManipulate.appendSlide(
                '<div role="group" class="swiper-slide height-auto show-mobile-landscape w-dyn-item"><article class="slide-card_item relative slide-card_item--cta"><a href="/experiences" class="slide-card_item-content flex items-center justify-center w-inline-block"><h3 class="heading-style-h2 text-style-allcaps text-color-off-white">Discover All</h3></a></article></div>'
              );

              setExtraSlides = false;
            }

            swiperInstances.push(swiperManipulate);
          }
        });
      }
    }
    function destroySwipers() {
      if (swiperInstances.length === 0) return;
      swiperInstances.forEach((swiper) => {
        if (swiper) {
          swiper.destroy(true, true);
        }
      });

      swiperInstances = []; // Clear the array
    }
    let animationsTriggered = false;

    function handleResize() {
      if (!isResizing) {
        isResizing = true;

        if (window.innerWidth <= 767 && !animationsTriggered) {
          initializeSwiper();
          animationsTriggered = true;
        } else if (window.innerWidth > 767 && animationsTriggered) {
          destroySwipers();
          animationsTriggered = false;
        }

        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          isResizing = false;
        }, 200);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
  }
  desktopSliderAnimations() {
    const sliders = document.querySelectorAll('.swiper_slider');
    const hiddenSlides = document.querySelectorAll(
      '.room_slider-item.swiper-slide.w-condition-invisible'
    );

    // fix rooms slide bug
    hiddenSlides.forEach((slide) => {
      slide.remove();
    });

    if (sliders) {
      sliders.forEach((slider) => {
        const standardSlider = slider.querySelector('.swiper.standard');
        const parallaxSlider = slider.querySelector('.swiper.parallax');

        if (standardSlider) {
          const swiper = new Swiper(standardSlider, {
            speed: 1000,
            loop: true,
            delay: 3000,
            autoplay: true,
            pagination: {
              el: '.swiper-pagination',
              type: 'bullets',
              clickable: 'true',
            },
          });
        }

        if (parallaxSlider) {
          const swiper = new Swiper(parallaxSlider, {
            speed: 1000,
            parallax: true,
            loop: true,
            initialSlide: 3,
            slidesPerView: 1.15,
            centeredSlides: true,
            spaceBetween: 32,
            freeMode: {
              enabled: true,
              sticky: true,
            },
          });
        }
      });
    }
  }

  stephenCustomCode() {
    // Here is where you can add your custom code for this page.
    // don't forgot to add conditions because this is running on all pages
    const sliders = document.querySelectorAll('.swiper_slider');
    const navBtn = document.querySelectorAll('.nav_btn.nav-toggle');
    const navMenu = document.querySelector('.nav-wrapper');
    const header = document.querySelector('.header');
    const modalOpenBtn = document.querySelector('[data-open-modal]');
    const modalCloseBtn = document.querySelector('[data-close-modal]');
    const modal = document.querySelector('[data-modal]');
    const imageList = document.querySelector('.hero-slider_list');
    const imageListCount = document.querySelectorAll('.image_count-number');
    const navLinks = document.querySelectorAll('.nav_link');
    const navLinksLines = document.querySelectorAll('.horizontal-separator.is-nav');
    const tabLinks = document.querySelectorAll('.tabs_navigation-link');

    if (sliders) {
      sliders.forEach((slider) => {
        const freeFormSlider = slider.querySelector('.swiper.freeform');
        const swiper = new Swiper(freeFormSlider, {
          speed: 1000,
          //parallax: true,

          freeMode: {
            enabled: true,
            sticky: true,
          },

          //loop: true,
          slidesPerView: 1,
          spaceBetween: 10,

          breakpoints: {
            // when window width is >= 480px
            480: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            // when window width is >= 640px
            767: {
              slidesPerView: 5,
              spaceBetween: 40,
            },
          },
        });
      });
    }

    if (header) {
      let ariaExpanded = true;
      let ariaLabel = 'Close Menu';

      navBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('is-active');
          navMenu.classList.toggle('is-active');
          header.classList.toggle('is-active');
          btn.setAttribute('aria-expanded', ariaExpanded);
          btn.setAttribute('aria-label', ariaLabel);

          ariaExpanded = !ariaExpanded;

          if (ariaExpanded) {
            ariaLabel = 'Close Menu';
          } else {
            ariaLabel = 'Open Menu';
          }
        });
      });
    }

    if (document.querySelector('.slide-in')) {
      gsap.set('.slide-in', { y: 25, opacity: 0 });
      ScrollTrigger.batch('.slide-in', {
        start: 'top bottom-=100px',
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1 }),
      });
    }

    if (modal) {
      modalOpenBtn.addEventListener('click', showModal);
      modalCloseBtn.addEventListener('click', hideModal);

      function showModal() {
        modal.classList.add('modal-is-active');
        modal.setAttribute('aria-hidden', 'false');
      }

      function hideModal() {
        modal.classList.remove('modal-is-active');
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    if (imageList) {
      const imageListLength = imageList.childNodes.length;
      imageListCount.forEach((count) => {
        count.innerText = `(${imageListLength})`;
      });
    }

    if (navLinks) {
      navLinks.forEach((link) => {
        link.addEventListener('mouseover', () => {
          navLinks.forEach((navLink) => {
            navLink.classList.add('is-hover');
          });

          navLinksLines.forEach((line) => {
            line.classList.add('is-hover');
          });
        });

        link.addEventListener('mouseout', () => {
          navLinks.forEach((navLink) => {
            navLink.classList.remove('is-hover');
          });

          navLinksLines.forEach((line) => {
            line.classList.remove('is-hover');
          });
        });
      });
    }

    if (tabLinks) {
      tabLinks.forEach((link, index) => {
        if (index === 0) {
          link.classList.add('is-active');
        }

        const tagetTabs = document.querySelectorAll('.tabs_navigation-link');

        link.addEventListener('click', () => {
          if (link.classList.contains('is-active')) return;
          tagetTabs.forEach((tab) => {
            tab.classList.remove('is-active');
          });
          link.classList.add('is-active');
        });
      });
    }

    const accordionTrigger = document.querySelectorAll('.faq_question');

    if (accordionTrigger) {
      accordionTrigger.forEach((item) => {
        const ariaExpanded = false;

        item.addEventListener('click', () => {
          toggleAccordion(item, ariaExpanded);
        });

        item.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            toggleAccordion(item, ariaExpanded);
          }
        });
      });
    }

    function toggleAccordion(item, ariaExpanded) {
      ariaExpanded = !ariaExpanded;
      item.setAttribute('aria-expanded', ariaExpanded);
      item.classList.toggle('is-active');
      const text = item.nextElementSibling;
      text.classList.toggle('is-active');
    }

    this.mobileSliderAnimations();
    this.desktopSliderAnimations();
  }

  sectionCutIn() {
    const section = document.querySelector('.cut-in-section');

    if (!section) return;

    const mm = gsap.matchMedia();
    const tl = gsap.timeline();

    mm.add('(min-width: 1200px)', () => {
      tl.to(section, {
        clipPath: 'polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)',
      });
    }).add('(max-width: 1199px)', () => {
      tl.to(section, {
        clipPath: 'polygon(5% 10%, 95% 10%, 95% 90%, 5% 90%)',
      });
    });
    ScrollTrigger.create({
      trigger: section,
      scrub: true,
      markers: false,
      pin: true,
      animation: tl,
    });
  }

  scaleIn() {
    const gridComponent = document.querySelector('.scale-grid_component');
    const wrapper = document.querySelector('.scale-grid_wrapper');
    if (!gridComponent || !wrapper) return;

    const tl = gsap.timeline();

    let maxWidth = gridComponent.querySelector('.scale-grid_item').clientWidth,
      scale,
      width = window.innerWidth;

    scale = width / maxWidth;
    // outer.style.transform = isMax?'':'scale(' + scale + ')';
    tl.add('start')
      .to(
        gridComponent,
        {
          scale: scale,
        },
        'start'
      )
      .to(
        '.scale-grid_item img',
        {
          scale: 1,
          yPercent: '50',
        },
        'start'
      )
      .to(
        '.scale-grid_item:not(.scale-grid_item-middle)',
        {
          opacity: 0.3,
        },
        'start'
      )
      .to(
        '.scale-grid_item._1',
        {
          x: -50,
        },
        'start'
      )
      .to(
        '.scale-grid_item._3',
        {
          x: 50,
        },
        'start'
      )
      .to(
        '.scale-grid_item._4',
        {
          y: 50,
        },
        'start'
      );

    ScrollTrigger.create({
      trigger: wrapper,
      markers: false,
      pin: true,
      end: '+=1000',
      scrub: true,
      animation: tl,
    });
  }
  parallaxImages() {
    if (!document.querySelector('.three-col_component')) return;
    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: 'screen and (max-width: 767px)',
        isDesktop: 'screen and (min-width: 768px)',
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions;
        if (isDesktop) {
          const threeImageTl = gsap.timeline({
            scrollTrigger: {
              start: 'center center',
              end: 'bottom center',
              trigger: '.three-col_image-wrap.second',
              scrub: 1.5,
              invalidateOnRefresh: true,
              //markers: true,
              pin: '.three-col_component',
            },
          });

          threeImageTl.to('.three-col_image-wrap.first', {
            translateY: 0,
            duration: 1,
          });

          threeImageTl.to(
            '.three-col_image-wrap.third',
            {
              translateY: 0,
              duration: 1,
            },
            '<'
          );
        }

        if (isMobile) {
          const tlImageFirst = gsap.timeline({ paused: true });
          if (tlImageFirst) {
            tlImageFirst.to('.three-col_image-wrap.first', {
              translateY: 0,
              duration: 1,
            });
          }

          const tlImageThird = gsap.timeline({ paused: true });
          if (tlImageThird) {
            tlImageThird.to('.three-col_image-wrap.third', {
              translateY: 0,
              duration: 1,
            });
          }

          function timelinePlayAnimations() {
            if (tlImageThird) {
              tlImageThird.play(0);
            }
            if (tlImageFirst) {
              tlImageFirst.play(0);
            }
          }

          function timelineResetAnimations() {
            if (tlImageThird) {
              tlImageThird.reverse();
            }
            if (tlImageFirst) {
              tlImageFirst.reverse();
            }
          }

          const threeImageTl = gsap.timeline({
            scrollTrigger: {
              start: 'center center',
              end: 'bottom center',
              trigger: '.three-col_image-wrap.second',
              scrub: 1.5,
              invalidateOnRefresh: true,
              onEnter: () => timelinePlayAnimations(),
              onLeaveBack: () => timelineResetAnimations(),
            },
          });
        }
      }
    );
  }
  amenitiesAnimation() {
    this.sectionCutIn();
    this.scaleIn();
    this.parallaxImages();
  }
  init() {
    this.stephenCustomCode();
    this.navAnimation.init();
    this.sliders();
    this.amenitiesAnimation();
    this.footerPageTransition();
    console.log(gsap.matchMedia());
  }
}

export default Animations;
