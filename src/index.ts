import Animations from '$utils/all';

window.Webflow ||= [];
window.Webflow.push(() => {
  const still = new Animations();
  still.init();
  still.barbaInit();
});
