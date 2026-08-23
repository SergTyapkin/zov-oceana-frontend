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
  UserOtherModel,
  UserOtherModelMockData,
  UsersListModelMockData,
  UsersListModel,
  UserPartnerListModel,
  UserPartnerListModelMockData,
} from '~/utils/APIModels';
import { Category, Goods, Order, User, Address, Globals, UserOther, OrderStatus, UserPartner } from '~/utils/models';
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
  getOtherUserAdmin = (id: string) =>
    this.#GET(`/user`, {id}, UserModel, Response200(UserModelMockData)) as MyResponse<User>;
  getAllUsersAdmin = () =>
    this.#GET(`/user/all`, {}, UsersListModel, Response200(UsersListModelMockData)) as MyResponse<{users: User[]}>;
  getOtherUser = (id: string) =>
    this.#GET(`/user`, {id}, UserOtherModel, Response200(UserOtherModelMockData)) as MyResponse<UserOther>;
    // this.#GET(`/user`, {}, UserModel) as MyResponse<User>;
  updateProfile = (id: string, profileData: { givenName?: string, familyName?: string, middleName?: string, email?: string, tel?: string, city?: string, password?: string, isEmailNotificationsOn?: boolean }) =>
    this.#PUT(`/user`, Object.assign({id}, profileData), UserModel) as MyResponse<User>;
  updateProfileAdmin = (id: string, givenName: string, familyName: string, middleName: string, email: string, avatarUrl: string, tel: string, city: string, partnerStatus: string, isEmailNotificationsOn: string, tgUsername: string, tgId: string, referrerId: string, canEditGoods: boolean,  canEditOrders: boolean,  canEditUsers: boolean,  canEditPartners: boolean,  canEditGlobals: boolean) =>
    this.#PUT(`/user`, {id, givenName, familyName, middleName, email, avatarUrl, tel, city, partnerStatus, isEmailNotificationsOn, tgUsername, tgId, referrerId, canEditGoods, canEditOrders, canEditUsers, canEditPartners, canEditGlobals}, UserModel) as MyResponse<User>;
  updateProfilePassword = (id: string, oldPassword: string, newPassword: string) =>
    this.#PUT(`/user/password`, {id, oldPassword, newPassword}) as MyResponse<unknown>;
  register = (
    givenName: string, middleName: string, familyName: string, email: string, tel: string, city: string, password: string,
    tgId: string, tgUsername: string, tgHash: string, tgAuthDate: string, tgPhotoUrl: string, tgFirstName: string, tgLastName: string,
    referrerId: string,
  ) =>
    this.#POST(`/user`, {
      givenName, middleName, familyName, email, tel, city, password,
      tgId, tgUsername, tgHash, tgAuthDate, tgPhotoUrl, tgFirstName, tgLastName,
      referrerId,
      clientBrowser: detectBrowser(), clientOS: detectOS(),
    }, UserModel) as MyResponse<User>;
  deleteProfile = () =>
    this.#DELETE(`/user`) as MyResponse<unknown>;
  login = (emailOrTel: string, password: string) =>
    this.#POST(`/user/auth`, { emailOrTel, password, clientBrowser: detectBrowser(), clientOS: detectOS() }, UserModel) as MyResponse<User>;
  loginWithTG = (tgId: string, tgUsername?: string, tgHash?: string, tgAuthDate?: number, tgPhotoUrl?: string, tgFirstName?: string, tgLastName?: string) =>
    this.#POST(`/user/auth/tg`, {
      tgId, tgUsername, tgHash, tgAuthDate, tgPhotoUrl, tgFirstName, tgLastName, clientBrowser: detectBrowser(), clientOS: detectOS(),
    }, UserModel) as MyResponse<User>;
  logout = () =>
    this.#DELETE(`/user/session`) as MyResponse<unknown>;
  sendPasswordRestorationLetter = () =>
    this.#POST(`/auth/password/restore`) as MyResponse<unknown>;
  restorePasswordByCode = (code: string, newPassword: string): MyResponse<unknown> =>
    this.#PUT(`/auth/password/restore`, { code, new_password: newPassword }) as MyResponse<unknown>;

  // Partnership
  sendPartnershipRequest = (id: string) =>
    this.#PUT(`/user`, {id, partnerStatus: null}, UserModel) as MyResponse<User>;
  getUserBonusesHistoryMonthly = (userId: string) =>
    this.#GET(`/partner/history/monthly`, {userId}) as MyResponse<unknown>;
  getAllPartnerUsers = (userId: string) =>
    this.#GET(`/partner/users/bonuses/monthly`, {userId}, UserPartnerListModel, Response200(UserPartnerListModelMockData)) as MyResponse<{users: UserPartner[]}>;
  createHistoryBonusesRecord = (userId: string, value: number, comment: string) =>
    this.#POST(`/partner/history`, {userId, value, comment}) as MyResponse<unknown>;

  // Globals
  getGlobals = () =>
    this.#GET(`/globals`, {}, GlobalsModel, Response200(GlobalsModelMockData)) as MyResponse<Globals>;
  updateGlobals = (isOnMaintenance: boolean, goodsIdsOnLanding: string[]) =>
    this.#PUT(`/globals`, {isOnMaintenance, goodsIdsOnLanding}) as MyResponse<unknown>;

  // Categories
  getCategories = () =>
    this.#GET(`/categories`, {}, CategoriesListModel, Response200(CategoriesListModelMockData)) as MyResponse<{categories: Category[]}>;
  createCategory = (title: string, description: string) =>
    this.#POST(`/categories`, {title, description}) as MyResponse<unknown>;
  deleteCategory = (id: string) =>
    this.#DELETE(`/categories`, {id}) as MyResponse<unknown>;
  updateCategory = (id: string, title: string, description: string) =>
    this.#PUT(`/categories`, {id, title, description}) as MyResponse<unknown>;

  // Goods
  getGoodsList = () =>
    this.#GET(`/goods/all`, {isOnSale: true}, GoodsListModel, Response200(GoodsListModelMockData)) as MyResponse<{goods: Goods[]}>;
  getAllAdminGoodsList = () =>
    this.#GET(`/goods/all`, {}, GoodsListModel, Response200(GoodsListModelMockData)) as MyResponse<{goods: Goods[]}>;
  getGoods = (id: string) =>
    this.#GET(`/goods?id=${id}`, {}, GoodsModel, Response200(GoodsModelMockData)) as MyResponse<Goods>;
  createGoods = (title: string, description: string, fromLocation: string, amountLeft: number, amountStep: number, amountMin: number, isWeighed: boolean, cost: number, isOnSale: boolean, isDelicates: boolean, characters: object) =>
    this.#POST(`/goods`, {title, description, fromLocation, amountLeft, amountStep, amountMin, isWeighed, cost, isOnSale, isDelicates, characters}) as MyResponse<unknown>;
  updateGoods = (id: string, title: string, description: string, fromLocation: string, amountLeft: number, amountStep: number, amountMin: number, isWeighed: boolean, cost: number, isOnSale: boolean, isDelicates: boolean, characters: object) =>
    this.#PUT(`/goods`, {id, title, description, fromLocation, amountLeft, amountStep, amountMin, isWeighed, cost, isOnSale, isDelicates, characters}) as MyResponse<unknown>;
  updateGoodsIsOnSale = (id: string, isOnSale: boolean) =>
    this.#PUT(`/goods`, {id, isOnSale}) as MyResponse<unknown>;
  deleteGoods = (id: string) =>
    this.#DELETE(`/goods`, {id}) as MyResponse<unknown>;

  // Orders
  getUserOrders = (userId: string) =>
    this.#GET(`/orders/user`, {userId}, OrderListModel, Response200(OrderListModelMockData)) as MyResponse<{orders: Order[]}>;
  getOrder = (orderId: string) =>
    this.#GET(`/orders`, {orderId}, OrderModel, Response200(OrderModelMockData)) as MyResponse<Order>;
  createOrder = (userId: string, addressId: string, goods: Goods[]) =>
    this.#POST(`/orders`, {userId, addressId, goods}, OrderModel, Response200(OrderModelMockData)) as MyResponse<{id: string}>;
  createOrderAdmin = (userId: string, goods: Goods[], status: OrderStatus, trackingCode: string, addressTextCopy: string, commentTextCopy: string) =>
    this.#POST(`/orders/admin`, {userId, goods, status, trackingCode, addressTextCopy, commentTextCopy}) as MyResponse<unknown>;
  deleteOrder = (id: string) =>
    this.#DELETE(`/orders`, {id}) as MyResponse<unknown>;
  updateOrder = (id: string, userId: string, number: number, addressTextCopy: string, commentTextCopy: string, status: OrderStatus, trackingCode: string, goods: Goods[]) =>
    this.#PUT(`/orders`, {id, userId, number, addressTextCopy, commentTextCopy, status, trackingCode, goods}) as MyResponse<unknown>;
  updateOrderStatus = (number: string, status: string) =>
    this.#PUT(`/orders`, {number, status}) as MyResponse<unknown>;
  getAllAdminOrdersList = () =>
    this.#GET(`/orders/all`, {}, OrderListModel, Response200(OrderListModelMockData)) as MyResponse<{orders: Order[]}>;

  // Payments
  createPayment = (orderId: string) =>
    this.#POST(`/payments`, {orderId}, {}, Response200({})) as MyResponse<unknown>;
  confirmPayment = (orderId: string) =>
    this.#POST(`/payments/confirm`, {orderId}, {}, Response200({})) as MyResponse<unknown>;
  cancelPayment = (orderId: string) =>
    this.#POST(`/payments/cancel`, {orderId}, {}, Response200({})) as MyResponse<unknown>;

  // Addresses
  getUserAddresses = (userId: string) =>
    this.#GET(`/addresses/user`, {userId}, AddressListModel, Response200(AddressListModelMockData)) as MyResponse<{addresses: Address[]}>;
  createAddress = (userId: string, title: string, city: string, street: string, house: string, entrance: string, floor: string, apartment: string, code: string, comment: string) =>
    this.#POST(`/addresses`, {userId, title, city, street, house, entrance, floor, apartment, code, comment}) as MyResponse<unknown>;
  updateAddress = (id: string, title: string, city: string, street: string, house: string, entrance: string, floor: string, apartment: string, code: string, comment: string) =>
    this.#PUT(`/addresses`, {id, title, city, street, house, entrance, floor, apartment, code, comment}) as MyResponse<unknown>;
  deleteAddress = (id: string) =>
    this.#DELETE(`/addresses`, {id}) as MyResponse<unknown>;

  // Cart
  getUserCart = (userId: string) =>
    this.#GET(`/cart`, {userId}, GoodsListModel, Response200(GoodsListModelMockData)) as MyResponse<{goods: Goods[]}>;
  addGoodsToCart = (userId: string, goodsId: string, amount: number) =>
    this.#POST(`/cart/goods`, {userId, goodsId, amount}) as MyResponse<unknown>;
  setGoodsInCart = (userId: string, goods: Goods[]) =>
    this.#POST(`/cart/goods/set`, {userId, goods}, {}, Response200({})) as MyResponse<unknown>;
  updateGoodsInCartAmount = (userId: string, goodsId: string, amount: number) =>
    this.#PUT(`/cart/goods`, {userId, goodsId, amount}, {}, Response200({})) as MyResponse<unknown>;
  removeGoodsFromCart = (userId: string, goodsId: string) =>
    this.#DELETE(`/cart/goods/many`, {userId, goodsIds: [goodsId]}, {}, Response200({})) as MyResponse<object>;

  // Images
  uploadGoodsImage = (goodsId: string, dataUrl: string) =>
    this.#POST(`/image`, {goodsId, dataUrl}) as MyResponse<unknown>;
  deleteImage = (id: string) =>
    this.#DELETE(`/image`, {id}) as MyResponse<unknown>;

  // Admin
  executeAdminSQL = (sql: string) =>
    this.#POST(`/sql`, {sql}) as MyResponse<unknown>;
}
