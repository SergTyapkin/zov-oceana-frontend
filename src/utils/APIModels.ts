import { ArrayType, Type, validateModel } from '@sergtyapkin/models-validator';


export const UserModel = {
  id: String,
  givenName: String,
  familyName: String,
  middleName: Type(String, true),
  email: String,
  emailNotifications: Boolean,
  tel: Type(String, true),
  isAdmin: Boolean,
};

export const UserModelMockData = validateModel(UserModel, {
  id: 'USER_ID',
  givenName: 'Сергей',
  familyName: 'Тяпкин',
  middleName: 'Сергеевич',
  email: 'Tyapkin2002@mail.ru',
  emailNotifications: false,
  isAdmin: false,
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
  description: Type(String, true),
  previewUrl: Type(String, true),
  fromLocation: Type(String, true),
  amountLeft: Type(Number, true),
  cost: Type(Number, true),
  categoryId: Type(String, true),
};
export const GoodsListModel = {
  goods: ArrayType(GoodsModel),
};
export const GoodsModelMockData = validateModel(GoodsModel, {
  id: 'GOODS_ID',
  title: 'Атлантический лосось',
  // description: '',
  // previewUrl: '',
  fromLocation: 'Норвегия',
  amountLeft: 32,
  cost: 2430,
  categoryId: 'CATEGORY_ID_2',
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
  goods: GoodsListModelMockData.goods,
  createdDate: '2025-03-18',
  updatedDate: '2025-04-20',
  cost: 1250,
  status: 'created',
  userId: 'USER_ID_1',
  userGivenName: 'Петр',
  userFamilyName: 'Иванов',
});
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
