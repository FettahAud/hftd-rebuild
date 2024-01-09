import { greetUser } from '$utils/greet';
import { Animations } from '$utils/still';

window.Webflow ||= [];
window.Webflow.push(() => {
  alert('Hi Stephen');
  const animations = new Animations();
  animations.init();
  animations.barbaInit();
});
