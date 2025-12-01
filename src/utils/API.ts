import REST_API from '@sergtyapkin/rest-api';
import { validateModel, type Model } from '@sergtyapkin/models-validator';
import {
  CategoriesListModel,
  CategoriesListModelMockData,
  GoodsListModel,
  GoodsListModelMockData,
  OrderListModel,
  OrderListModelMockData,
  UserModel,
  AddressListModel,
  AddressListModelMockData,
  GoodsModel,
  GoodsModelMockData,
  UserModelMockData,
  GlobalsModelMockData,
  GlobalsModel,
  OrderModel,
  OrderModelMockData,
} from '~/utils/APIModels';
import { Category, Goods, Order, User, Address } from '~/utils/models';
import { detectBrowser, detectOS } from '~/utils/utils';

type RequestFunc = (url, data?: object) => Promise<{ data: object; status: number; ok: boolean }>;
type MyResponse<T> = Promise<{ data: T; status: number; ok: boolean }> | { data: T; status: number; ok: boolean };

const Response200 = (data: any) => ({
  status: 200,
  ok: true,
  data: data,
});

export default class API extends REST_API {
  constructor(baseUrl?) {
    super(baseUrl);
  }

  async modelParsedRequest(
    requestFunc: RequestFunc,
    path,
    data = {},
    model?: Model,
    mockData?: MyResponse<object>,
  ): Promise<{ ok: boolean; data: object; status: number }> {
    if (mockData && import.meta.env.MODE !== 'production') {
    // if (mockData) {
      console.info(`Request mocked: ${requestFunc.name}, ${path},`, mockData);
      return mockData;
    }

    data = Object.assign({}, data);
    const { ok, data: dataRes, status } = await requestFunc.bind(this)(path, data);
    if (!ok) {
      return { ok, data: dataRes as object, status };
    }

    if (!model) {
      return { ok, data: dataRes, status };
    }
    return { ok, data: validateModel(model, dataRes), status };
  }
  #POST(path, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.post, path, data, model, mockData);
  }
  #GET(path, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.get, path, data, model, mockData);
  }
  #PUT(path, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.put, path, data, model, mockData);
  }
  #DELETE(path, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.delete, path, data, model, mockData);
  }

  // Api configuration
  // User
  getUser = () =>
    this.#GET(`/user`, {}, UserModel, Response200(UserModelMockData)) as MyResponse<User>;
    // this.#GET(`/user`, {}, UserModel) as MyResponse<User>;
  updateProfile = (id, profileData: { givenName?, familyName?, middleName?, email?, tel?, password?, isEmailNotificationsOn?: boolean }) =>
    this.#PUT(`/user`, Object.assign({id}, profileData), UserModel) as MyResponse<User>;
  updateProfilePassword = (id, oldPassword, newPassword) =>
    this.#PUT(`/user/password`, {id, oldPassword, newPassword}) as MyResponse<unknown>;
  register = (givenName, middleName, familyName, email, tel, password) =>
    this.#POST(`/user`, { givenName, middleName, familyName, email, tel, password, clientBrowser: detectBrowser(), clientOS: detectOS()}, UserModel) as MyResponse<User>;
  deleteProfile = () =>
    this.#DELETE(`/user`) as MyResponse<unknown>;
  login = (emailOrTel, password) =>
    this.#POST(`/user/auth`, { emailOrTel, password, clientBrowser: detectBrowser(), clientOS: detectOS() }, UserModel) as MyResponse<User>;
  logout = () =>
    this.#DELETE(`/user/session`) as MyResponse<unknown>;
  sendPasswordRestorationLetter = () =>
    this.#POST(`/auth/password/restore`) as MyResponse<unknown>;
  restorePasswordByCode = (code, newPassword): MyResponse<unknown> =>
    this.#PUT(`/auth/password/restore`, { code, new_password: newPassword }) as MyResponse<unknown>;

  // Globals
  getGlobals = () =>
    this.#GET(`/globals`, {}, GlobalsModel, Response200(GlobalsModelMockData)) as MyResponse<Globals>;

  // Categories
  getCategories = () =>
    this.#GET(`/categories`, {}, CategoriesListModel, Response200(CategoriesListModelMockData)) as MyResponse<{categories: Category[]}>;

  // Goods
  getGoodsList = () =>
    this.#GET(`/goods/all`, {}, GoodsListModel, Response200(GoodsListModelMockData)) as MyResponse<{goods: Goods[]}>;
  getGoods = (id) =>
    this.#GET(`/goods?id=${id}`, {}, GoodsModel, Response200(GoodsModelMockData)) as MyResponse<Goods>;

  // Orders
  getUserOrders = (userId) =>
    this.#GET(`/orders/user`, {userId}, OrderListModel, Response200(OrderListModelMockData)) as MyResponse<{orders: Order[]}>;
  getOrder = (orderId) =>
    this.#GET(`/orders`, {orderId}, OrderModel, Response200(OrderModelMockData)) as MyResponse<Order>;
  createOrder = (userId, addressId, goods) =>
    this.#POST(`/orders`, {userId, addressId, goods}) as MyResponse<unknown>;

  // Addresses
  getUserAddresses = (userId) =>
    this.#GET(`/addresses/user`, {userId}, AddressListModel, Response200(AddressListModelMockData)) as MyResponse<{addresses: Address[]}>;
  createAddress = (userId, title, city, street, house, entrance, floor, apartment, code, comment) =>
    this.#POST(`/addresses`, {userId, title, city, street, house, entrance, floor, apartment, code, comment}) as MyResponse<unknown>;
  updateAddress = (id, title, city, street, house, entrance, floor, apartment, code, comment) =>
    this.#PUT(`/addresses`, {id, title, city, street, house, entrance, floor, apartment, code, comment}) as MyResponse<unknown>;
  deleteAddress = (id) =>
    this.#DELETE(`/addresses`, {id}) as MyResponse<unknown>;

  // Cart
  getUserCart = (userId) =>
    this.#GET(`/cart`, {userId}, GoodsListModel, Response200(GoodsListModelMockData)) as MyResponse<{goods: Goods[]}>;
  addGoodsToCart = (userId, goodsId, amount) =>
    this.#POST(`/cart/goods`, {userId, goodsId, amount}) as MyResponse<unknown>;
  setGoodsInCart = (userId, goods: Goods[]) =>
    this.#POST(`/cart/goods/set`, {userId, goods}, {}, Response200({})) as MyResponse<unknown>;
  updateGoodsInCartAmount = (userId, goodsId, amount) =>
    this.#PUT(`/cart/goods`, {userId, goodsId, amount}, {}, Response200({})) as MyResponse<unknown>;
  removeGoodsFromCart = (userId, goodsId) =>
    this.#DELETE(`/cart/goods/many`, {userId, goodsIds: [goodsId]}, {}, Response200({})) as MyResponse<object>;
}
