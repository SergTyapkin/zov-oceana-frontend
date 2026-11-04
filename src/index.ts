import { createApp } from 'vue';

import App from '~/App.vue';
import Store from '~/Store';
import createVueRouter from '~/Router';
import ScrollRestore from "@sergtyapkin/scroll-restore";

import '~/styles/fontsLoader.styl';
import '~/styles/global.styl';
const Router = createVueRouter(Store);
const application = createApp(App);
// Expose reactive store proxies before the first header/footer/page render.
Object.defineProperties(application.config.globalProperties, {
  $user: { configurable: true, get: () => Store.state.user },
  $globals: { configurable: true, get: () => Store.state.globals },
  $cart: { configurable: true, get: () => Store.state.cart },
  $referrerId: { configurable: true, get: () => Store.state.referrerId },
});
const app = application
  .use(Router)
  .use(ScrollRestore, Router, [], document.body)
  .use(Store)
  .mount('#app');
Store.$app = app;
