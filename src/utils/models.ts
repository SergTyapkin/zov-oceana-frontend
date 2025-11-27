export interface User {
  id: string;
  tgUsername?: string;
  tgId?: string;
  givenName: string;
  familyName: string;
  middleName?: string;
  avatarUrl?: string;
  email?: string;
  tel?: string;
  joinedDate: Date;

  isEmailNotificationsOn: boolean;

  canEditOrders: boolean;
  canEditUsers: boolean;
  canEditGoods: boolean;
  canExecuteSQL: boolean;
  canEditGlobals: boolean;

  isSignedIn: boolean;
}

export interface Goods {
  id: string;
  title: string;
  description?: string;
  fromLocation?: string;
  amountLeft?: number;
  amount?: number;
  amountStep: number;
  cost: number;
  images: {id: string, path: string}[];
  categories: {id: string, title: string}[];
  characters?: Record<PropertyKey, string | number>;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  previewUrl?: string;
  goodsCount?: number;
}

export interface Address {
  id: string;
  title?: string;
  address: string;
}

export type OrderStatus = 'created' | 'paid' | 'prepared' | 'delivered' | 'cancelled';
export interface Order {
  id: string;
  goods: Goods[];
  createdDate: Date;
  updatedDate: Date;
  cost: number;
  status: OrderStatus;
  userId?: string;
  userGivenName?: string;
  userFamilyName?: string;
}

