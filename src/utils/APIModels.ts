import { ArrayType, ObjectType, Type, validateModel } from '@sergtyapkin/models-validator';
import { Category, Globals, Goods, Order } from '~/utils/models';

export const UserModel = {
  id: String,
  givenName: {
    type: String,
    from: 'givenname',
  },
  familyName: {
    type: String,
    from: 'familyname',
  },
  middleName: {
    type: String,
    from: 'middlename',
    optional: true,
  },
  avatarUrl: {
    type: String,
    from: 'avatarurl',
    optional: true,
  },
  tgUsername: {
    type: String,
    from: 'tgusername',
    optional: true,
  },
  tgId: {
    type: String,
    from: 'tgid',
    optional: true,
  },
  email: {
    type: String,
    optional: true,
  },
  tel: {
    type: String,
    optional: true,
  },
  joinedDate: {
    type: Date,
    from: 'joineddate',
  },
  isEmailNotificationsOn: {
    type: Boolean,
    from: 'isemailnotificationson',
  },
  referrerId: {
    type: String,
    from: 'referrerid',
    optional: true,
  },
  partnerStatus: {
    type: Boolean,
    from: 'partnerstatus',
    optional: true,
  },
  partnerBonuses: {
    type: Number,
    from: 'partnerbonuses',
  },
  canEditOrders: {
    type: Boolean,
    from: 'caneditorders',
  },
  canEditUsers: {
    type: Boolean,
    from: 'caneditusers',
  },
  canEditPartners: {
    type: Boolean,
    from: 'caneditpartners',
  },
  canEditGoods: {
    type: Boolean,
    from: 'caneditgoods',
  },
  canExecuteSQL: {
    type: Boolean,
    from: 'canexecutesql',
  },
  canEditGlobals: {
    type: Boolean,
    from: 'caneditglobals',
  },
};
export const UserOtherModel = {
  id: String,
  givenName: {
    type: String,
    from: 'givenname',
  },
  familyName: {
    type: String,
    from: 'familyname',
  },
  avatarUrl: {
    type: String,
    from: 'avatarurl',
    optional: true,
  },
  joinedDate: {
    type: Date,
    from: 'joineddate',
  },
};

export const UserModelMockData = validateModel(UserModel, {
  id: 'USER_ID',
  givenname: 'Сергей',
  familyname: 'Тяпкин',
  middlename: 'Сергеевич',
  email: 'Tyapkin2002@mail.ru',
  isemailnotificationson: false,
  partnerbonuses: 0,
  caneditorders: false,
  caneditusers: false,
  caneditgoods: false,
  caneditpartners: false,
  canexecutesql: false,
  caneditglobals: false,
  isadmin: false,
  joineddate: new Date('2023-04-04'),
});

export const UserOtherModelMockData = validateModel(UserOtherModel, {
  id: 'USER_ID',
  givenname: 'Сергей',
  familyname: 'Тяпкин',
  joineddate: new Date('2023-04-04'),
});


export const CategoryModel = {
  id: String,
  title: String,
  description: {
    type: String,
    optional: true,
  },
  previewUrl: {
    type: String,
    from: 'previewurl',
    optional: true,
  },
  goodsCount: {
    type: Number,
    from: 'goodscount',
    optional: true,
  },
};
export const CategoriesListModel = {
  categories: ArrayType(CategoryModel),
};
export const CategoryModelMockData = validateModel(CategoryModel, {
  id: 'CATEGORY_ID',
  title: 'Свежая рыба',
  // description: '',
  // previewurl: '',
  goodscount: 23,
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
  isOnSale: {
    type: Boolean,
    from: 'isonsale',
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
  isonsale: true,
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


export const AddressModel = {
  id: String,
  title: {
    type: String,
    optional: true,
  },
  createdDate: {
    type: Date,
    from: 'createddate',
  },
  city: Type(String, true),
  street: Type(String, true),
  house: Type(String, true),
  entrance: Type(String, true),
  floor: Type(String, true),
  apartment: Type(String, true),
  code: Type(String, true),
  comment: Type(String, true),
};
export const AddressListModel = {
  addresses: ArrayType(AddressModel),
};
export const AddressModelMockData = validateModel(AddressModel, {
  id: 'ADDRESS_ID',
  createddate: '2025-03-18',
  city: 'Москва',
  street: 'Солохова',
  house: '4к19',
  entrance: '2',
  floor: '9',
  apartment: '106',
  // code: '',
  comment: 'Позвоните',
});
export const AddressListModelMockData = {
  addresses: [
    Object.assign({}, AddressModelMockData, {id: 'ADDRESS_ID_1', title: 'Дом',  address: 'ул. Морская, д. 123, Москва, 123456'}),
    Object.assign({}, AddressModelMockData, {id: 'ADDRESS_ID_2', address: 'Бизнес-центр, офис 200, Санкт-Петербург, 654321'}),
  ],
};


export const OrderModel = {
  id: String,
  number: Number,
  secretCode: {
    type: String,
    from: 'secretcode',
  },
  goods: ArrayType(GoodsModel),
  createdDate: {
    type: Date,
    from: 'createddate',
  },
  updatedDate: {
    type: Date,
    from: 'updateddate',
  },
  status: new Set(['created', 'accepted', 'prepared', 'delivered', 'cancelled']),
  userId: {
    type: String,
    from: 'userid',
    optional: true,
  },
  address: ObjectType(AddressModel, true),
  addressTextCopy: {
    type: String,
    from: 'addresstextcopy',
  },
  commentTextCopy: {
    type: String,
    from: 'commenttextcopy',
    optional: true,
  },
};
export const OrderListModel = {
  orders: ArrayType(OrderModel),
};
export const OrderModelMockData = validateModel(OrderModel, {
  id: 'ORDER_ID',
  goods: [],
  createddate: '2025-03-18',
  updateddate: '2025-04-20',
  status: 'created',
  number: 123543,
  secretcode: 'OS8DS2X',
  userid: 'USER_ID_1',
  addresstextcopy: 'г. Москва, ул. Кировоградского, д. 7, эт. 9, кв. 150, Код: В123В12312',
  commenttextcopy: 'Ну наааадо, ну пожааалуйста!',
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


export const GlobalsModel = {
  isOnMaintenance: {
    type: Boolean,
    from: 'isonmaintenance',
  },
  goodsOnLanding: {
    type: Array,
    item: {
      type: Object,
      fields: GoodsModel,
    },
    from: 'goodsonlanding',
  },
  categories: ArrayType(CategoryModel),
};

export const GlobalsModelMockData = validateModel(GlobalsModel, {
  isonmaintenance: false,
  goodsonlanding: [],
  categories: [],
}) as Globals;
GlobalsModelMockData.goodsOnLanding = GoodsListModelMockData.goods as Goods[];
GlobalsModelMockData.categories = CategoriesListModelMockData.categories as Category[];
