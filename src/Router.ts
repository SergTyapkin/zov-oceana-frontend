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
import PageAdminGoodsCreateEdit from '~/views/Admin/PageAdminGoodsCreateEdit.vue';
import PageAdminOrderCreateEdit from '~/views/Admin/PageAdminOrderCreateEdit.vue';
import PageAdminUserEdit from '~/views/Admin/PageAdminUserEdit.vue';
import PageAdminExecuteSQL from '~/views/Admin/PageAdminExecuteSQL.vue';
import PageDocs from '~/views/Docs/PageDocs.vue';
import PageDocsOffer from '~/views/Docs/PageDocsOffer.vue';
import PageDocsPolitics from '~/views/Docs/PageDocsPolitics.vue';
import PageDocsContacts from '~/views/Docs/PageDocsContacts.vue';
import PageDocsRefund from '~/views/Docs/PageDocsRefund.vue';
import PageDocsDelivery from '~/views/Docs/PageDocsDelivery.vue';
import PagePaymentOrder from '~/views/Payment/PagePaymentOrder.vue';
import PagePaymentSuccess from './views/Payment/PagePaymentSuccess.vue';
import PagePaymentFail from './views/Payment/PagePaymentFail.vue';

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

    { path: '/payment/order/:id', name: 'paymentOrder', component: PagePaymentOrder, meta: { loginRequired: true } },
    { path: '/payment/success', name: 'paymentSuccess', component: PagePaymentSuccess },
    { path: '/payment/fail', name: 'paymentFail', component: PagePaymentFail },
    { path: '/payment/takeout', name: 'paymentTakeout', component: PagePaymentOrder, meta: { loginRequired: true } },

    {
      path: '/profile', component: PageProfile, redirect: {name: 'profile'}, meta: { loginRequired: true }, children: [
        { path: '/profile', name: 'profile', component: PageProfileInfo, meta: { loginRequired: true } },
        { path: '/profile/orders', name: 'profileOrders', component: PageProfileOrders, meta: { loginRequired: true } },
        { path: '/profile/addresses', name: 'profileAddresses', component: PageProfileAddresses, meta: { loginRequired: true } },
        { path: '/profile/settings', name: 'profileSettings', component: PageProfileSettings, meta: { loginRequired: true } },
        { path: '/profile/partnership', name: 'profilePartnership', component: PageProfilePartnership, meta: { loginRequired: true } },
      ],
    },
    { path: '/login', name: 'login', component: PageLogin, meta: { noLoginRequired: true } },
    { path: '/signup', name: 'signup', component: PageRegistration, meta: { loginRequired: true } },
    { path: '/password/restore', name: 'restorePassword', component: PageRestorePassword, meta: { loginRequired: true } },
    { path: '/email/confirm', name: 'confirmEmail', component: PageConfirmEmail, meta: { loginRequired: true } },

    {
      path: '/admin', name: 'admin', component: PageAdmin, redirect: {name: 'adminGoods'}, meta: { adminRequired: true }, children: [
        { path: '/admin/goods', name: 'adminGoods', component: PageAdminGoods, meta: { adminRequired: true } },
        { path: '/admin/orders', name: 'adminOrders', component: PageAdminOrders, meta: { adminRequired: true } },
        { path: '/admin/users', name: 'adminUsers', component: PageAdminUsers, meta: { adminRequired: true } },
        { path: '/admin/globals', name: 'adminGlobals', component: PageAdminGlobals, meta: { adminRequired: true } },
        { path: '/admin/sql', name: 'adminSQL', component: PageAdminExecuteSQL, meta: { adminRequired: true } },

        { path: '/admin/goods/create', name: 'adminGoodsCreate', component: PageAdminGoodsCreateEdit, meta: { adminRequired: true } },
        { path: '/admin/goods/:id/edit', name: 'adminGoodsEdit', component: PageAdminGoodsCreateEdit, meta: { adminRequired: true } },
        { path: '/admin/order/create', name: 'adminOrderCreate', component: PageAdminOrderCreateEdit, meta: { adminRequired: true } },
        { path: '/admin/order/:id/edit', name: 'adminOrderEdit', component: PageAdminOrderCreateEdit, meta: { adminRequired: true } },
        { path: '/admin/user/:id/edit', name: 'adminUserEdit', component: PageAdminUserEdit, meta: { adminRequired: true } },
      ],
    },

    {
      path: '/documents', component: PageDocs, redirect: { name: 'docsPolitics' }, children: [
        { path: '/documents/politics', name: 'politics', component: PageDocsPolitics },
        { path: '/documents/offer', name: 'offer', component: PageDocsOffer },

        { path: '/documents/contacts', name: 'contacts', component: PageDocsContacts },
        { path: '/documents/delivery', name: 'delivery', component: PageDocsDelivery },
        { path: '/documents/refund', name: 'refund', component: PageDocsRefund },
      ]
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
