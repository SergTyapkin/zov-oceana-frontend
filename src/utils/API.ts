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
} from '~/utils/APIModels';
import { Category, Goods, Order, User, Address } from '~/utils/models';
import { detectBrowser, detectOS } from '~/utils/utils';

type RequestFunc = (url: string, data?: object) => Promise<{ data: object; status: number; ok: boolean }>;
type MyResponse<T> = Promise<{ data: T; status: number; ok: boolean }> | { data: T; status: number; ok: boolean };

const Response200 = (data: any) => ({
  status: 200,
  ok: true,
  data: data,
});

export default class API extends REST_API {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  async modelParsedRequest(
    requestFunc: RequestFunc,
    path: string,
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
  #POST(path: string, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.post, path, data, model, mockData);
  }
  #GET(path: string, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.get, path, data, model, mockData);
  }
  #PUT(path: string, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.put, path, data, model, mockData);
  }
  #DELETE(path: string, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.delete, path, data, model, mockData);
  }

  // Api configuration
  // User
  getUser = () =>
    this.#GET(`/user`, {}, UserModel, Response200(UserModelMockData)) as MyResponse<User>;
    // this.#GET(`/user`, {}, UserModel) as MyResponse<User>;
  updateProfile = (id: string, profileData: { givenName?: string, familyName?: string, middleName?: string, email?: string, tel?: string, password?: string, isEmailNotificationsOn?: boolean }) =>
    this.#PUT(`/user`, Object.assign({id}, profileData), UserModel) as MyResponse<User>;
  updateProfilePassword = (id: string, profileData: { oldPassword?: string, newPassword?: string }) =>
    this.#PUT(`/user`, Object.assign({id}, profileData), UserModel) as MyResponse<User>;
  register = (givenName: string, middleName: string, familyName: string, email: string, tel: string, password: string) =>
    this.#POST(`/user`, { givenName, middleName, familyName, email, tel, password, clientBrowser: detectBrowser(), clientOS: detectOS()}, UserModel) as MyResponse<User>;
  deleteProfile = () =>
    this.#DELETE(`/user`) as MyResponse<unknown>;
  login = (emailOrTel: string, password: string) =>
    this.#POST(`/user/auth`, { emailOrTel, password, clientBrowser: detectBrowser(), clientOS: detectOS() }, UserModel) as MyResponse<User>;
  logout = () =>
    this.#DELETE(`/user/session`) as MyResponse<unknown>;
  sendPasswordRestorationLetter = () =>
    this.#POST(`/auth/password/restore`) as MyResponse<unknown>;
  restorePasswordByCode = (code: string, newPassword: string): MyResponse<unknown> =>
    this.#PUT(`/auth/password/restore`, { code, new_password: newPassword }) as MyResponse<unknown>;

  // Categories
  getCategories = () =>
    this.#GET(`/categories`, {}, CategoriesListModel, Response200(CategoriesListModelMockData)) as MyResponse<{categories: Category[]}>;

  // Goods
  getGoodsList = () =>
    this.#GET(`/goods/all`, {}, GoodsListModel, Response200(GoodsListModelMockData)) as MyResponse<{goods: Goods[]}>;
  getGoods = (id: string) =>
    this.#GET(`/goods?id=${id}`, {}, GoodsModel, Response200(GoodsModelMockData)) as MyResponse<Goods>;

  // Orders
  getUserOrders = (userId: string) =>
    this.#GET(`/orders/user`, {userId}, OrderListModel, Response200(OrderListModelMockData)) as MyResponse<{orders: Order[]}>;

  // Addresses
  getUserAddresses = (userId: string) =>
    this.#GET(`/addresses/user`, {userId}, AddressListModel, Response200(AddressListModelMockData)) as MyResponse<{addresses: Address[]}>;

  // Cart
  getUserCart = (userId: string) =>
    this.#GET(`/cart`, {userId}, GoodsListModel, Response200(GoodsListModelMockData)) as MyResponse<{goods: Goods[]}>;
  addGoodsToCart = (userId: string, goodsId: string, amount: number) =>
    this.#POST(`/cart/goods`, {userId, goodsId, amount}, GoodsListModel, Response200(GoodsListModelMockData)) as MyResponse<{goods: Goods[]}>;
  removeGoodsFromCart = (userId: string, goodsId: string) =>
    this.#DELETE(`/cart/goods/many`, {userId, goodsIds: [goodsId]}, {}, Response200({})) as MyResponse<object>;
}
