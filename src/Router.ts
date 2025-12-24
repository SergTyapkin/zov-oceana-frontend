import {
  createRouter,
  createWebHistory,
  Router,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router';
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
import PageOrder from '~/views/PageOrder.vue';
import PagePartnership from '~/views/PagePartnership.vue';
import PageProfilePartnership from '~/views/User/PageProfile/PageProfilePartnership.vue';
import { QUERY_PARAM_REFERRER_ID } from '~/constants';
import PageAdmin from '~/views/Admin/PageAdmin.vue';
import PageAdminGoods from '~/views/Admin/PageAdminGoods.vue';
import PageAdminUsers from '~/views/Admin/PageAdminUsers.vue';
import PageAdminOrders from '~/views/Admin/PageAdminOrders.vue';
import PageAdminGlobals from '~/views/Admin/PageAdminGlobals.vue';
import PageAdminCategories from '~/views/Admin/PageAdminCategories.vue';
import PageAdminGoodsCreateEdit from '~/views/Admin/PageAdminGoodsCreateEdit.vue';
import PageAdminOrdersCreateEdit from '~/views/Admin/PageAdminOrdersCreateEdit.vue';

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
    { path: '/order/:id', name: 'order', component: PageOrder },
    { path: '/partnership', name: 'partnership', component: PagePartnership },

    { path: '/profile', component: PageProfile, meta: {loginRequired: true}, children: [
        { path: '/profile', name: 'profile', component: PageProfileInfo, meta: {loginRequired: true} },
        { path: '/profile/orders', name: 'profileOrders', component: PageProfileOrders, meta: {loginRequired: true} },
        { path: '/profile/addresses', name: 'profileAddresses', component: PageProfileAddresses, meta: {loginRequired: true} },
        { path: '/profile/settings', name: 'profileSettings', component: PageProfileSettings, meta: {loginRequired: true} },
        { path: '/profile/partnership', name: 'profilePartnership', component: PageProfilePartnership, meta: {loginRequired: true} },
      ],
    },
    { path: '/login', name: 'login', component: PageLogin, meta: {noLoginRequired: true} },
    { path: '/signup', name: 'signup', component: PageRegistration, meta: {loginRequired: true} },
    { path: '/password/restore', name: 'restorePassword', component: PageRestorePassword, meta: {loginRequired: true} },
    { path: '/email/confirm', name: 'confirmEmail', component: PageConfirmEmail, meta: {loginRequired: true} },

    { path: '/admin', component: PageAdmin, meta: {adminRequired: true}, children: [
        { path: '/admin', name: 'admin', component: PageAdminGoods, meta: {adminRequired: true} },
        { path: '/admin/categories', name: 'adminCategories', component: PageAdminCategories, meta: {adminRequired: true} },
        { path: '/admin/orders', name: 'adminOrders', component: PageAdminOrders, meta: {adminRequired: true} },
        { path: '/admin/users', name: 'adminUsers', component: PageAdminUsers, meta: {adminRequired: true} },
        { path: '/admin/globals', name: 'adminGlobals', component: PageAdminGlobals, meta: {adminRequired: true} },

        { path: '/admin/goods/create', name: 'adminGoodsCreate', component: PageAdminGoodsCreateEdit, meta: {adminRequired: true} },
        { path: '/admin/goods/:id/edit', name: 'adminGoodsEdit', component: PageAdminGoodsCreateEdit, meta: {adminRequired: true} },
        { path: '/admin/order/create', name: 'adminOrderCreate', component: PageAdminOrdersCreateEdit, meta: {adminRequired: true} },
        { path: '/admin/order/:id/edit', name: 'adminOrderEdit', component: PageAdminOrdersCreateEdit, meta: {adminRequired: true} },
      ],
    },

    { path: '/:pathMatch(.*)*', name: 'page404', component: Page404 },
  ];

  const Router = createRouter({
    history: createWebHistory(),
    routes: routesList,
  });

  let router_got_initials = false;
  Router.beforeEach(async (to: RouteLocationNormalized, _, next: NavigationGuardNext) => {
    if (!router_got_initials) {
      await Store.dispatch('GET_USER');
      await Store.dispatch('LOAD_CART');
      await Store.dispatch('GET_GLOBALS');
      await Store.dispatch('LOAD_REFERRER_ID');
      Store.$app.updateElements();
      router_got_initials = true;
    }
    const referrerIdQueryParam = to.query[QUERY_PARAM_REFERRER_ID];
    if (referrerIdQueryParam) {
      await Store.dispatch('SET_REFERRER_ID', referrerIdQueryParam);
    }

    const loginedRedirect = {
      name: 'profile',
    };
    const notLoginedRedirect = {
      name: 'default',
    };

    // Login required redirects
    if (to.matched.some(record => record.meta.loginRequired === true || record.meta.adminRequired === true)) {
      if (Store.state.user.isSignedIn) {
        next();
        return;
      }
      next(notLoginedRedirect);
      return;
    } else if (to.matched.some(record => record.meta.noLoginRequired === true)) {
      if (!Store.state.user.isSignedIn) {
        next();
        return;
      }
      next(loginedRedirect);
      return;
    }
    if (to.matched.some(record => record.meta.adminRequired === true)) {
      if (Store.state.user.hasSomeAdminRights) {
        next();
        return;
      }
      next(loginedRedirect);
      return;
    }
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
