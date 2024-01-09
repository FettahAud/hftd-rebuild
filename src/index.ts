import { Animations } from '$utils/still';

window.Webflow ||= [];
window.Webflow.push(() => {
  const animations = new Animations();
  animations.init();
  animations.barbaInit();
});
