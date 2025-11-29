import Vuex from 'vuex';
import { type State, type Store } from '~/types/store';
import { Category, Goods, User } from '~/utils/models';
import { validateModel } from '@sergtyapkin/models-validator';
import { GoodsListModel } from '~/utils/APIModels';

function saveCartToLocalStorage(cart: Goods[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage(): Goods[] {
  const loaded = localStorage.getItem('cart');
  if (!loaded) {
    return [];
  }
  try {
    const cart = JSON.parse(loaded) as Goods[];
    return (validateModel(GoodsListModel, {goods: cart}) as {goods: Goods[]}).goods || [];
  } catch {
    return [];
  }
}

function removeCartFromLocalStorage() {
  localStorage.removeItem('cart');
}


export default new Vuex.Store({
  state: {
    user: {} as User,
    cart: [] as Goods[],
    categories: [] as Category[],
  },
  mutations: {
    SET_USER(state: State, userData: User) {
      state.user.id = String(userData.id);
      state.user.familyName = userData.familyName;
      state.user.givenName = userData.givenName;
      state.user.middleName = userData.middleName;
      state.user.email = userData.email;
      state.user.tel = userData.tel;
      state.user.tgUsername = userData.tgUsername;
      state.user.tgId = userData.tgId;
      state.user.avatarUrl = userData.avatarUrl;
      state.user.joinedDate = new Date(userData.joinedDate);

      state.user.isEmailNotificationsOn = Boolean(userData.isEmailNotificationsOn);

      state.user.isSignedIn = true;
    },
    DELETE_USER(state: State) {
      state.user.isSignedIn = false;
    },

    SET_CATEGORIES(state: State, categories: Category[]) {
      state.categories.length = 0;
      state.categories.push(...categories);
    },
    CLEAR_CATEGORIES(state: State) {
      state.categories.length = 0;
    },

    ADD_TO_CART(state: State, goods: Goods) {
      state.cart.push(goods);
      saveCartToLocalStorage(state.cart);
    },
    LOAD_CART(state: State) {
      const cart = loadCartFromLocalStorage();
      state.cart.length = 0;
      state.cart.push(...cart);
    },
    REMOVE_FROM_CART(state: State, goods: Goods) {
      const idx = state.cart.findIndex(g => g.id === goods.id);
      if (idx === -1) {
        return;
      }
      state.cart.splice(idx, 1);
      saveCartToLocalStorage(state.cart);
    },
    CLEAR_CART(state: State) {
      state.cart.length = 0;
      removeCartFromLocalStorage();
    },
    SET_CART_GOODS_AMOUNT(state: State, data: {goodsId: string, amount: number}) {
      const idx = state.cart.findIndex(g => g.id === data.goodsId);
      if (idx === -1) {
        return;
      }
      state.cart[idx].amount = data.amount;
      saveCartToLocalStorage(state.cart);
    },
  },
  actions: {
    async GET_USER(this: Store, state: State) {
      const { data, ok }: { data: any; ok: boolean } = await this.$app.$api.getUser();
      if (!ok) {
        state.commit('DELETE_USER');
        return;
      }
      state.commit('SET_USER', data);
    },
    async GET_CATEGORIES(this: Store, state: State) {
      const { data, ok }: { data: any; ok: boolean } = await this.$app.$api.getCategories();
      if (!ok) {
        state.commit('CLEAR_CATEGORIES');
        return;
      }
      state.commit('SET_CATEGORIES', data.categories);
      this.$app.updateElements();
    },
    DELETE_USER(this: Store, state: State) {
      state.commit('DELETE_USER');
    },

    LOAD_CART(this: Store, state: State) {
      state.commit('LOAD_CART');
    },
    async ADD_TO_CART(this: Store, state: State, data: {goods: Goods, amount: number}) {
      state.commit('ADD_TO_CART', Object.assign({}, data.goods, {amount: data.amount}));
      await this.$app.$api.addGoodsToCart(this.state.user.id, data.goods.id, data.amount);
    },
    async REMOVE_FROM_CART(this: Store, state: State, goods: Goods) {
      state.commit('REMOVE_FROM_CART', goods);
      await this.$app.$api.removeGoodsFromCart(this.state.user.id, goods.id);
    },
    CLEAR_CART(this: Store, state: State) {
      state.commit('CLEAR_CART');
    },
    SET_CART_GOODS_AMOUNT(this: Store, state: State, data: {goodsId: string, amount: number}) {
      state.commit('SET_CART_GOODS_AMOUNT', data);
    },
  },
});
