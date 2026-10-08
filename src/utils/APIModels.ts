import { ArrayType, ObjectType, Type, validateModel } from '@sergtyapkin/models-validator';
import { Category, Globals, Goods, Order } from '~/utils/models';
import { OrderStatuses, PaymentStatuses } from '~/constants';

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
  city: String,
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
  tel: String,
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
  isPartnershipRequested: {
    type: Boolean,
    from: 'ispartnershiprequested',
    optional: true,
  },
  isPartner: {
    type: Boolean,
    from: 'ispartner',
    optional: true,
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
  ordersCount: {
    type: Number,
    from: 'orderscount',
    optional: true,
  },
  totalOrdersCost: {
    type: Number,
    from: 'totalorderscost',
    optional: true,
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
export const UserPartnerModel = {
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
  city: String,
  joinedDate: {
    type: Date,
    from: 'joineddate',
  },
  totalValue: {
    type: Number,
    from: 'totalvalue',
  },
};

export const UserModelMockData = validateModel(UserModel, {
  id: 'USER_ID',
  givenname: 'Сергей',
  familyname: 'Тяпкин',
  middlename: 'Сергеевич',
  email: 'Tyapkin2002@mail.ru',
  city: 'Москва',
  tel: '+79160930930',
  isemailnotificationson: false,
  ispartnershiprequested: false,
  ispartner: true,
  caneditorders: true,
  caneditusers: true,
  caneditgoods: true,
  caneditpartners: true,
  canexecutesql: true,
  caneditglobals: true,
  joineddate: new Date('2023-04-04'),
});

export const UserOtherModelMockData = validateModel(UserOtherModel, {
  id: 'USER_ID',
  givenname: 'Сергей',
  familyname: 'Тяпкин',
  joineddate: new Date('2023-04-04'),
});
export const UserPartnerModelMockData = validateModel(UserPartnerModel, {
  id: 'USER_ID',
  givenname: 'Сергей',
  familyname: 'Тяпкин',
  city: 'Москва',
  joineddate: new Date('2023-04-04'),
  totalvalue: 515,
});
export const UsersListModel = {
  users: ArrayType(UserModel),
};
export const UsersListModelMockData = {
  users: [
    Object.assign({}, UserModelMockData, {id: 'USER_ID_1', familyName: 'Первый'}),
    Object.assign({}, UserModelMockData, {id: 'USER_ID_2', familyName: 'Второй'}),
    Object.assign({}, UserModelMockData, {id: 'USER_ID_3', familyName: 'Третий'}),
  ],
};
export const UsersOtherListModel = {
  users: ArrayType(UserOtherModel),
};
export const UsersOtherListModelMockData = {
  users: [
    Object.assign({}, UserOtherModelMockData, {id: 'USER_ID_1', familyName: 'Первый'}),
    Object.assign({}, UserOtherModelMockData, {id: 'USER_ID_2', familyName: 'Второй'}),
    Object.assign({}, UserOtherModelMockData, {id: 'USER_ID_3', familyName: 'Третий'}),
  ],
};
export const UserPartnerListModel = {
  partners: ArrayType(UserPartnerModel),
};
export const UserPartnerListModelMockData = {
  partners: [
    Object.assign({}, UserPartnerModelMockData, {id: 'USER_ID_1', familyName: 'Первый'}),
    Object.assign({}, UserPartnerModelMockData, {id: 'USER_ID_2', familyName: 'Второй'}),
    Object.assign({}, UserPartnerModelMockData, {id: 'USER_ID_3', familyName: 'Третий'}),
  ],
};

export const UserPartnerBonusHistoryModel = {
  id: String,
  userId: {
    type: String,
    from: 'userid',
  },
  avatarUrl: {
    type: String,
    from: 'avatarurl',
    optional: true,
  },
  givenName: {
    type: String,
    from: 'givenname',
    optional: true,
  },
  familyName: {
    type: String,
    from: 'familyname',
    optional: true,
  },
  fromUserId: {
    type: String,
    optional: true,
    from: 'fromuserid',
  },
  comment: {
    type: String,
    optional: true,
  },
  isGroup: {
    type: Boolean,
    from: 'isgroup',
  },
  value: Number,
  date: Date,
};
export const UserPartnerBonusesHistoryModel = {
  history: ArrayType(UserPartnerBonusHistoryModel),
};
export const UserPartnerBonusHistoryModelMockData = validateModel(UserPartnerBonusHistoryModel, {
  id: 1,
  userid: 1,
  avatarurl: null,
  givenname: null,
  familyname: null,
  fromuserid: null,
  comment: "Подарок приветственный",
  isgroup: false,
  value: 1500,
  date: "Sat, 03 Oct 2026 18:41:37 GMT",
});
export const UserPartnerBonusesHistoryModelMockData = {
  history: [
    Object.assign({}, UserPartnerBonusHistoryModelMockData, {id: '1'}),
    Object.assign({}, UserPartnerBonusHistoryModelMockData, {id: '2', comment: 'Списание', value: -100, isgroup: true}),
    Object.assign({}, UserPartnerBonusHistoryModelMockData, {id: '3', comment: null, value: 330}),
  ],
};


export const PartnerModel = {
  userId: {
    type: String,
    from: 'userid',
  },
  totalBonuses: {
    type: Number,
    from: 'totalbonuses',
  },
  personalBonuses: {
    type: Number,
    from: 'personalbonuses',
  },
  groupBonuses: {
    type: Number,
    from: 'groupbonuses',
  },
  branchTotalBonuses: {
    type: Number,
    from: 'branchtotalbonuses',
  },
  qualityId: {
    type: Number,
    from: 'qualityid',
    optional: true,
  },
  newbieBonusPeriodsLeft: {
    type: Number,
    from: 'newbiebonusperiodsleft',
  },
  blackPearlBonuses: {
    type: Number,
    from: 'blackpearlbonuses',
  },
  bonusBigTeamPeriods: {
    type: Number,
    from: 'bonusbigteamperiods',
  },
  activatedDate: {
    type: Date,
    from: 'activateddate',
  },
  isActive: {
    type: Boolean,
    from: 'isactive',
  },
  joinedDate: {
    type: Date,
    from: 'joineddate',
  },
};
export const PartnersModel = {
  partners: ArrayType(PartnerModel),
}
export const PartnerModelMockData = validateModel(PartnerModel, {
  userid: 'USER_ID_1',
  isconfirmed: true,
  totalbonuses: 1230,
  personalbonuses: 230,
  groupbonuses: 900,
  branchtotalbonuses: 420,
  qualityid: null,
  newbiebonusperiodsleft: 2,
  blackpearlbonuses: 511,
  bonusbigteamperiods: 1,
  activateddate: new Date('2025-05-04'),
  isactive: true,
  joineddate: new Date('2025-04-04'),
});
export const PartnersModelMockData = {
  partners: [
    Object.assign({}, PartnerModelMockData, {id: 'PARNTER_ID_1'}),
    Object.assign({}, PartnerModelMockData, {id: 'PARNTER_ID_2'}),
    Object.assign({}, PartnerModelMockData, {id: 'PARNTER_ID_3'}),
  ],
};


export const QualityModel = {
  id: String,
  title: String,
  branchDeepForQuality: {
    type: Number,
    from: 'branchdeepforquality',
  },
  percentForQuality: {
    type: Number,
    from: 'percentforquality',
  },
  activeCountRequirement: {
    type: Number,
    from: 'activecountrequirement',
    optional: true,
  },
  branchesCountRequirement: {
    type: Number,
    from: 'branchescountrequirement',
    optional: true,
  },
  branchesValuesRequirement: {
    type: Number,
    from: 'branchesvaluesrequirement',
    optional: true,
  },
  totalPersonalBonusesRequirement: {
    type: Number,
    from: 'totalpersonalbonusesrequirement',
    optional: true,
  },
  qualityBonusValue: {
    type: Number,
    from: 'qualitybonusvalue',
    optional: true,
  },
  qualityBonusMaxCount: {
    type: Number,
    from: 'qualitybonusmaxcount',
    optional: true,
  },
};
export const QualitiesListModel = {
  qualitys: ArrayType(QualityModel),
}
export const QualityModelMockData = validateModel(QualityModel, {
  id: 'QUALITY_ID',
  title: 'Рыбак 1',
  branchdeepforquality: 1,
  percentforquality: 25,
  activecountrequirement: 3,
  branchescountrequirement: 2,
  branchesvaluesrequirement: 450,
  totalpersonalbonusesrequirement: 220,
  qualitybonusvalue: 2000,
  qualitybonusmaxcount: 3,
});
export const QualitiesListModelMockData = {
  qualities: [
    Object.assign({}, QualityModelMockData, {id: 'QUALITY_ID_1'}),
    Object.assign({}, QualityModelMockData, {id: 'QUALITY_ID_2', title: 'Рыбак 2', qualityBonusValue: 100, qualityBonusMaxCount: 2}),
    Object.assign({}, QualityModelMockData, {id: 'QUALITY_ID_3', title: 'Капитан 1', qualityBonusValue: 1200, qualityBonusMaxCount: 1}),
    Object.assign({}, QualityModelMockData, {id: 'QUALITY_ID_4', title: 'Капитан 2'}),
  ],
};

export const CategoryModel = {
  id: String,
  title: String,
  description: {
    type: String,
    optional: true,
  },
  imagePath: {
    type: String,
    from: 'imagepath',
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
    sortingKey: {
      type: Number,
      from: 'sortingkey',
    },
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
  isDelicates: {
    type: Boolean,
    from: 'isdelicates',
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
  createdDate: {
    type: Date,
    from: 'createddate',
  },
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
  isdelicates: false,
  createddate: (new Date()).toDateString(),
  categories: [
    {
      id: 'CATEGORY_ID_2',
      title: 'Рыба',
    }
  ],
  characters: {
    'Вид': 'Красная рыба',
    'Рекомендуется': 'Супы, салаты',
  },
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
  status: new Set(Object.keys(OrderStatuses)),
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
  userGivenName: {
    type: String,
    from: 'givenname',
    optional: true,
  },
  userFamilyName: {
    type: String,
    from: 'familyname',
    optional: true,
  },
  trackingCode: {
    type: String,
    from: 'trackingcode',
    optional: true,
  },
  paymentId: {
    type: String,
    from: 'paymentid',
    optional: true,
  },
  paymentUrl: {
    type: String,
    from: 'paymenturl',
    optional: true,
  },
  paymentQrData: {
    type: String,
    from: 'paymentqrdata',
    optional: true,
  },
  paymentStatus: {
    type: new Set(Object.keys(PaymentStatuses)),
    from: 'paymentstatus',
    optional: true,
    default: 'new',
  },
  paymentCreatedDate: {
    type: Date,
    from: 'paymentcreateddate',
    optional: true,
  },
  paymentRoute: {
    type: String,
    from: 'paymentroute',
    optional: true,
  },
  paymentSource: {
    type: String,
    from: 'paymentsource',
    optional: true,
  },
};
export const OrderListModel = {
  orders: ArrayType(OrderModel),
};
export const OrderModelMockData = validateModel(OrderModel, {
  id: 'ORDER_ID',
  goods: [],
  createddate: '2028-03-18',
  updateddate: '2028-04-20',
  status: 'created',
  number: 123543,
  secretcode: 'OS8DS2X',
  userid: 'USER_ID_1',
  addresstextcopy: 'г. Москва, ул. Кировоградского, д. 7, эт. 9, кв. 150, Код: В123В12312',
  commenttextcopy: 'Ну наааадо, ну пожааалуйста!',
  paymentid: 'PAYMENT_ID_1',
  paymenturl: 'https://ya.ru/PAYMENT',
  paymentqrdata: 'https://ya.ru/SPB_CODE',
  paymentstatus: 'new',
  paymentcreateddate: '2028-04-20',
}) as Order;
OrderModelMockData.goods = GoodsListModelMockData.goods as Goods[];

export const OrderListModelMockData = {
  orders: [
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_1', status: 'created'}),
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_2', status: 'cancelled'}),
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_3', status: 'accepted'}),
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_4', status: 'prepared'}),
    Object.assign({}, OrderModelMockData, {id: 'ORDER_ID_5', status: 'delivered'}),
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
  moneyForBonuses: {
    type: Number,
    from: 'moneyforbonuses',
  },
  blackPearlCost: {
    type: Number,
    from: 'blackpearlcost',
  },
};

export const GlobalsModelMockData = validateModel(GlobalsModel, {
  isonmaintenance: false,
  goodsonlanding: [],
  moneyforbonuses: 55.7293,
  blackpearlcost: 120,
  categories: [],
}) as Globals;
GlobalsModelMockData.goodsOnLanding = GoodsListModelMockData.goods as Goods[];
GlobalsModelMockData.categories = CategoriesListModelMockData.categories as Category[];



export const SbpBankModel = {
  id: {
    type: String,
    from: 'MemberId',
  },
  title: {
    type: String,
    from: 'MemberName',
  },
  titleRus: {
    type: String,
    from: 'MemberNameRus',
  },
};
export const SbpBankModelMockData = validateModel(SbpBankModel, {
  MemberId: '10000023',
  MemberName: 'Some bank',
  MemberNameRus: 'ООО "Какой-то банк"',
}) as Globals;
export const SbpBankListModel = {
  banks: ArrayType(SbpBankModel),
};
export const SbpBankListModelMockData = {
  banks: [
    Object.assign({}, SbpBankModelMockData, {id: '10000025'}),
    Object.assign({}, SbpBankModelMockData, {id: '10000027', title: 'Any Other Bank', titleRus: 'БАНК РУС'}),
  ],
};