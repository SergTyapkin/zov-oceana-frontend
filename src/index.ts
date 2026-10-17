import { createApp } from 'vue';

import App from '~/App.vue';
import Store from '~/Store';
import createVueRouter from '~/Router';
import ScrollRestore from "@sergtyapkin/scroll-restore";

import '~/styles/fontsLoader.styl';
import '~/styles/global.styl';
import swAPI from '~/serviceWorker/swAPI';

await swAPI.register();

const Router = createVueRouter(Store);
const app = createApp(App)
  .use(Router)
  .use(ScrollRestore, Router, [], document.body)
  .use(Store)
  .mount('#app');
Store.$app = app;
