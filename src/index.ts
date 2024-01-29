import Animations from './utils/all';

window.Webflow ||= [];
window.Webflow.push(() => {
  const animations = new Animations();
  animations.init();
  animations.barbaInit();
});
