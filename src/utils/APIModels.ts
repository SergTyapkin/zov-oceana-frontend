import { ArrayType, Type, validateModel } from '@sergtyapkin/models-validator';
import { Goods, Order } from '~/utils/models';

export const UserModel = {
  id: String,
  givenName: String,
  familyName: String,
  middleName: Type(String, true),
  avatarUrl: Type(String, true),
  tgUsername: Type(String, true),
  tgId: Type(String, true),
  email: Type(String, true),
  tel: Type(String, true),
  joinedDate: Date,
  isEmailNotificationsOn: Boolean,
  canEditOrders: Boolean,
  canEditUsers: Boolean,
  canEditGoods: Boolean,
  canExecuteSQL: Boolean,
  canEditGlobals: Boolean,
};

export const UserModelMockData = validateModel(UserModel, {
  id: 'USER_ID',
  givenName: 'Сергей',
  familyName: 'Тяпкин',
  middleName: 'Сергеевич',
  email: 'Tyapkin2002@mail.ru',
  isEmailNotificationsOn: false,
  canEditOrders: false,
  canEditUsers: false,
  canEditGoods: false,
  canExecuteSQL: false,
  canEditGlobals: false,
  isAdmin: false,
  joinedDate: new Date('2023-04-04'),
});

export const CategoryModel = {
  id: String,
  title: String,
  description: Type(String, true),
  previewUrl: Type(String, true),
  goodsCount: Type(Number, true),
};
export const CategoriesListModel = {
  categories: ArrayType(CategoryModel),
};
export const CategoryModelMockData = validateModel(CategoryModel, {
  id: 'CATEGORY_ID',
  title: 'Свежая рыба',
  // description: '',
  // previewUrl: '',
  goodsCount: 23,
});
export const CategoriesListModelMockData = {
  categories: [
    Object.assign({}, CategoryModelMockData, {id: 'CATEGORY_ID_1', title: 'Свежая рыба'}),
    Object.assign({}, CategoryModelMockData, {id: 'CATEGORY_ID_2', title: 'Моллюски'}),
    Object.assign({}, CategoryModelMockData, {id: 'CATEGORY_ID_3', title: 'Премиум'}),
    Object.assign({}, CategoryModelMockData, {id: 'CATEGORY_ID_4', title: 'Замороженные'}),
  ],
};


export const GoodsModel = {
  id: String,
  title: String,
  description: {
    type: String,
    optional: true,
  },
  images: ArrayType({
    id: String,
    path: String,
  }, true, []),
  fromLocation: {
    type: String,
    optional: true,
    from: 'fromlocation',
  },
  amountLeft: {
    type: Number,
    optional: true,
    from: 'amountleft',
  },
  amount: {
    type: Number,
    optional: true,
  },
  amountStep: {
    type: Number,
    from: 'amountstep',
  },
  amountMin: {
    type: Number,
    from: 'amountmin',
  },
  isWeighed: {
    type: Boolean,
    from: 'isweighed',
    default: false,
  },
  cost: {
    type: Number,
    optional: true,
  },
  categories: ArrayType({
    id: String,
    title: String,
  }, true, []),
  characters: Type(Object, true, {}),
};
export const GoodsListModel = {
  goods: ArrayType(GoodsModel),
};
export const GoodsModelMockData = validateModel(GoodsModel, {
  id: 'GOODS_ID',
  title: 'Атлантический лосось',
  images: [],
  fromlocation: 'Норвегия',
  amountleft: 32,
  amountstep: 0.25,
  amountmin: 0.5,
  isweighed: false,
  cost: 2430,
  categories: [
    {
      id: 'CATEGORY_ID_2',
      title: 'Рыба',
    }
  ],
});
export const GoodsListModelMockData = {
  goods: [
    Object.assign({}, GoodsModelMockData, {id: 'GOODS_ID_1', title: 'Атлантический лосось', cost: 1400}),
    Object.assign({}, GoodsModelMockData, {id: 'GOODS_ID_2', title: 'Омар из Мэна', cost: 4500}),
    Object.assign({}, GoodsModelMockData, {id: 'GOODS_ID_3', title: 'Гребешки'}),
  ],
};


export const OrderModel = {
  id: String,
  goods: ArrayType(GoodsModel),
  createdDate: Date,
  updatedDate: Date,
  cost: Number,
  status: new Set(['created', 'accepted', 'prepared', 'delivered', 'cancelled']),
  userId: Type(String, true),
  userGivenName: Type(String, true),
  userFamilyName: Type(String, true),
};
export const OrderListModel = {
  orders: ArrayType(OrderModel),
};
export const OrderModelMockData = validateModel(OrderModel, {
  id: 'ORDER_ID',
  goods: [],
  createdDate: '2025-03-18',
  updatedDate: '2025-04-20',
  cost: 1250,
  status: 'created',
  userId: 'USER_ID_1',
  userGivenName: 'Петр',
  userFamilyName: 'Иванов',
}) as Order;
OrderModelMockData.goods = GoodsListModelMockData.goods as Goods[];

export const OrderListModelMockData = {
  orders: [
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_1', cost: 1400, status: 'created'}),
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_2', cost: 4500, status: 'cancelled'}),
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_3', cost: 1250, status: 'paid'}),
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_4', cost: 3502, status: 'prepared'}),
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_5', cost: 2400, status: 'delivered'}),
  ],
};


export const AddressModel = {
  id: String,
  title: Type(String, true),
  address: String,
};
export const AddressListModel = {
  addresses: ArrayType(AddressModel),
};
export const AddressModelMockData = validateModel(AddressModel, {
  id: 'ADDRESS_ID',
  address: 'Бизнес-центр, офис 200, Санкт-Петербург, 654321',
});
export const AddressListModelMockData = {
  addresses: [
    Object.assign({}, AddressModelMockData, {id: 'ADDRESS_ID_1', title: 'Дом',  address: 'ул. Морская, д. 123, Москва, 123456'}),
    Object.assign({}, AddressModelMockData, {id: 'ADDRESS_ID_2', address: 'Бизнес-центр, офис 200, Санкт-Петербург, 654321'}),
  ],
};
