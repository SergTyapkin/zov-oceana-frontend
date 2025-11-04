import { createRouter, createWebHistory, Router, /* RouteLocationNormalized, */ NavigationGuardNext } from 'vue-router';
import { type Store } from '~/types/store';

// Components:
import Page404 from '~/views/Page404.vue';
import PageRegistration from '~/views/User/PageRegistration.vue';
import PageLogin from '~/views/User/PageLogin.vue';
import PageProfileInfo from '~/views/User/PageProfile/PageProfileInfo.vue';
import PageRestorePassword from '~/views/User/PageRestorePassword.vue';
import PageConfirmEmail from '~/views/User/PageConfirmEmail.vue';
import routes from '~/routes';
import { RouteRecordRaw } from 'vue-router';
import PageLanding from '~/views/PageLanding.vue';
import PageMarket from '~/views/PageMarket.vue';
import PageProfile from '~/views/User/PageProfile/PageProfile.vue';
import PageProfileOrders from '~/views/User/PageProfile/PageProfileOrders.vue';
import PageProfileAddresses from '~/views/User/PageProfile/PageProfileAddresses.vue';
import PageProfileSettings from '~/views/User/PageProfile/PageProfileSettings.vue';
import PageGoods from '~/views/PageGoods.vue';
import PageCart from '~/views/PageCart.vue';

type MyRoute = RouteRecordRaw & {
  path: keyof typeof routes,
  meta?: {
    noLoginRequired?: boolean
    loginRequired?: boolean
  }
}

export default function createVueRouter(Store: Store): Router {
  const routesList: MyRoute[] = [
    { path: '/', name: 'default', component: PageLanding },
    { path: '/market', name: 'market', component: PageMarket },
    { path: '/goods/:id', name: 'goods', component: PageGoods },
    { path: '/cart', name: 'cart', component: PageCart },

    { path: '/profile', component: PageProfile, meta: {loginRequired: true}, children: [
        { path: '/profile', name: 'profile', component: PageProfileInfo, meta: {loginRequired: true} },
        { path: '/profile/orders', name: 'profileOrders', component: PageProfileOrders, meta: {loginRequired: true} },
        { path: '/profile/addresses', name: 'profileAddresses', component: PageProfileAddresses, meta: {loginRequired: true} },
        { path: '/profile/settings', name: 'profileSettings', component: PageProfileSettings, meta: {loginRequired: true} },
      ],
    },
    { path: '/login', name: 'login', component: PageLogin, meta: {noLoginRequired: true} },
    { path: '/signup', name: 'signup', component: PageRegistration, meta: {loginRequired: true} },
    { path: '/password/restore', name: 'restorePassword', component: PageRestorePassword, meta: {loginRequired: true} },
    { path: '/email/confirm', name: 'confirmEmail', component: PageConfirmEmail, meta: {loginRequired: true} },

    { path: '/:pathMatch(.*)*', name: 'page404', component: Page404 },
  ];

  const Router = createRouter({
    history: createWebHistory(),
    routes: routesList,
  });

  let router_got_user = false;
  // Router.beforeEach(async (to: RouteLocationNormalized, _, next: NavigationGuardNext) => {
  Router.beforeEach(async (_, __, next: NavigationGuardNext) => {
    if (!router_got_user) {
      await Store.dispatch('GET_USER');
      router_got_user = true;
    }

    // const notLoginedRedirect = {
    //   name: 'login',
    // };
    // const loginedRedirect = {
    //   name: 'profile',
    // };

    // if (to.path === '/' || to.path === '') {
    //   if (Store.state.user.isSignedIn) {
    //     next(loginedRedirect);
    //     return;
    //   }
    //   next(notLoginedRedirect);
    //   return;
    // }

    // Login required redirects
    // if (to.matched.some(record => record.meta.loginRequired === true || record.meta.adminRequired === true)) {
    //   if (Store.state.user.isSignedIn) {
    //     next();
    //     return;
    //   }
    //   next(notLoginedRedirect);
    //   return;
    // } else if (to.matched.some(record => record.meta.noLoginRequired === true)) {
    //   if (!Store.state.user.isSignedIn) {
    //     next();
    //     return;
    //   }
    //   next(loginedRedirect);
    //   return;
    // }
    // if (to.matched.some(record => record.meta.adminRequired === true)) {
    //   if (Store.state.user.isAdmin) {
    //     next();
    //     return;
    //   }
    //   next(loginedRedirect);
    //   return;
    // }
    next();
  });

  Router.beforeResolve(async () => {
    if (window?.onbeforeunload) {
      if (confirm('Изменения не сохранены. Вы уверены, что хотите покинуть страницу?')) {
        window.onbeforeunload = null;
      } else {
        return false;
      }
    }
  });

  return Router;
}
