import Vuex from 'vuex';
import { type State, type Store } from '~/types/store';
import { Globals, Goods, User } from '~/utils/models';
import { reverseValidateModel, validateModel } from '@sergtyapkin/models-validator';
import { GoodsListModel } from '~/utils/APIModels';

function saveCartToLocalStorage(cart: Goods[]) {
  cart = reverseValidateModel(GoodsListModel, { goods: cart }) as Goods[];
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage(): Goods[] {
  const loaded = localStorage.getItem('cart');
  if (!loaded) {
    return [];
  }
  try {
    const goodsListInCart = JSON.parse(loaded);
    return (validateModel(GoodsListModel, goodsListInCart) as { goods: Goods[] }).goods || [];
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
    globals: {} as Globals,
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
      state.user.partnerStatus = userData.partnerStatus;

      state.user.isEmailNotificationsOn = Boolean(userData.isEmailNotificationsOn);

      state.user.isSignedIn = true;
    },
    DELETE_USER(state: State) {
      state.user.isSignedIn = false;
    },

    SET_GLOBALS(state: State, globalsData: Globals) {
      state.globals.isOnMaintenance = globalsData.isOnMaintenance;
      state.globals.goodsOnLanding = globalsData.goodsOnLanding;
      state.globals.categories = globalsData.categories;
    },

    ADD_TO_CART(state: State, goods: Goods) {
      state.cart.push(goods);
      saveCartToLocalStorage(state.cart);
    },
    SET_CART(state: State, goodsInCart: Goods[]) {
      state.cart.length = 0;
      state.cart.push(...goodsInCart);
      saveCartToLocalStorage(state.cart);
    },
    REMOVE_FROM_CART(state: State, goods: Goods) {
      const idx = state.cart.findIndex(g => String(g.id) === String(goods.id));
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
    SET_CART_GOODS_AMOUNT(state: State, data: { goodsId: string; amount: number }) {
      const idx = state.cart.findIndex(g => String(g.id) === String(data.goodsId));
      if (idx === -1) {
        return;
      }
      state.cart[idx].amount = data.amount;
      saveCartToLocalStorage(state.cart);
    },
  },
  actions: {
    async GET_USER(this: Store, state: State) {
      await this.$app.$request(
        this.$app,
        this.$app.$api.getUser,
        [],
        undefined,
        (data: User) => {state.commit('SET_USER', data)},
        () => {state.commit('DELETE_USER')},
      );
    },

    DELETE_USER(this: Store, state: State) {
      state.commit('DELETE_USER');
    },

    async GET_GLOBALS(this: Store, state: State) {
      await this.$app.$request(
        this.$app,
        this.$app.$api.getGlobals,
        [],
        undefined,
        (data: Globals) => {state.commit('SET_GLOBALS', data)},
        () => {},
      );
    },

    async LOAD_CART(this: Store, state: State) {
      const goodsInCartInLocalStorage = loadCartFromLocalStorage();
      if (!this.state.user.isSignedIn) {
        state.commit('SET_CART', goodsInCartInLocalStorage);
        return;
      }

      const goodsInCartOnServer = (await this.$app.$request(
        this.$app,
        this.$app.$api.getUserCart,
        [this.state.user.id],
        'Не удалось получить товары в корзине',
        undefined,
        {goods: []},
      ) as {goods: Goods[]}).goods;
      let isNeedsToSaveCart = false;
      const actualGoods = goodsInCartOnServer.concat();
      goodsInCartInLocalStorage.forEach(goodsOneToCheck => {
        const goodsOneOnServer = goodsInCartOnServer.find(
          goodsOne => String(goodsOneToCheck.id) === String(goodsOne.id)
        );
        if (goodsOneOnServer) { // Товар уже есть в корзине
          const actualAmount = Math.max(goodsOneOnServer.amount || 0, goodsOneToCheck.amount || 0);
          isNeedsToSaveCart ||= (goodsOneOnServer.amount !== actualAmount);
          goodsOneOnServer.amount = actualAmount;
        } else { // Товара с сервера нет в корзине
          actualGoods.push(goodsOneToCheck);
          isNeedsToSaveCart = true;
        }
      });
      if (isNeedsToSaveCart) { // Перезаписать всю корзину на сервере
        await this.$app.$request(
          this.$app,
          this.$app.$api.setGoodsInCart,
          [this.state.user.id, actualGoods],
          'Не удалось пересохранить товары в корзине',
        );
      }
      state.commit('SET_CART', actualGoods);
    },
    async ADD_TO_CART(this: Store, state: State, data: { goods: Goods; amount: number }) {
      state.commit('ADD_TO_CART', Object.assign({}, data.goods, { amount: data.amount }));
      await this.$app.$api.addGoodsToCart(this.state.user.id, data.goods.id, data.amount);
    },
    async REMOVE_FROM_CART(this: Store, state: State, goods: Goods) {
      state.commit('REMOVE_FROM_CART', goods);
      await this.$app.$api.removeGoodsFromCart(this.state.user.id, goods.id);
    },
    CLEAR_CART(this: Store, state: State) {
      state.commit('CLEAR_CART');
    },
    SET_CART_GOODS_AMOUNT(this: Store, state: State, data: { goodsId: string; amount: number }) {
      state.commit('SET_CART_GOODS_AMOUNT', data);
    },
  },
});
