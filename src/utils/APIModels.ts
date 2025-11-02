import { ArrayType, Type, validateModel } from '@sergtyapkin/models-validator';

export const UserModel = {
  id: String,
  givenName: String,
  familyName: String,
  middleName: Type(String, true),
  email: String,
  tel: Type(String, true),
  isAdmin: Boolean,
};

export const UserModelMockData = validateModel(UserModel, {
  id: 'USER_ID',
  givenName: 'Сергей',
  familyName: 'Тяпкин',
  middleName: 'Сергеевич',
  email: 'Tyapkin2002@mail.ru',
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
