import Vuex from 'vuex';
import { type State, type Store } from '~/types/store';
import { Goods, User } from '~/utils/models';

export default new Vuex.Store({
  state: {
    user: {} as User,
    cart: [] as Goods[],
  },
  mutations: {
    SET_USER(state: State, userData: User) {
      state.user.id = String(userData.id);
      state.user.familyName = String(userData.familyName);
      state.user.givenName = String(userData.givenName);
      state.user.middleName = userData.middleName;
      state.user.email = userData.email;
      state.user.tel = userData.tel;
      state.user.isAdmin = Boolean(userData.isAdmin);

      state.user.isSignedIn = true;
    },
    DELETE_USER(state: State) {
      state.user.isSignedIn = false;
    },

    ADD_TO_CART(state: State, goods: Goods) {
      state.cart.push(goods);
    },
    DELETE_FROM_CART(state: State, goods: Goods) {
      const idx = state.cart.findIndex(g => g.id === goods.id);
      if (idx === -1) {
        return;
      }
      state.cart.splice(idx, 1);
    },
    CLEAR_CART(state: State) {
      state.cart.length = 0;
    },
    SET_CART_GOODS_AMOUNT(state: State, data: {goodsId: string, amount: number}) {
      const idx = state.cart.findIndex(g => g.id === data.goodsId);
      if (idx === -1) {
        return;
      }
      state.cart[idx].amount = data.amount;
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
    DELETE_USER(state: State) {
      state.commit('DELETE_USER');
    },

    ADD_TO_CART(state: State, data: {goods: Goods, amount: number}) {
      state.commit('ADD_TO_CART', Object.assign({}, data.goods, {amount: data.amount}));
    },
    DELETE_FROM_CART(state: State, goods: Goods) {
      state.commit('DELETE_FROM_CART', goods);
    },
    CLEAR_CART(state: State) {
      state.commit('CLEAR_CART');
    },
    SET_CART_GOODS_AMOUNT(state: State, data: {goodsId: string, amount: number}) {
      state.commit('SET_CART_GOODS_AMOUNT', data);
    },
  },
});
