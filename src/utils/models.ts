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

export interface Globals {
  isOnMaintenance: boolean;
  goodsOnLanding: Goods[];
  categories: Category[];
}

export interface Goods {
  id: string;
  title: string;
  description?: string;
  fromLocation?: string;
  amountLeft?: number;
  amount?: number;
  amountStep: number;
  amountMin: number;
  cost: number;
  isOnSale: boolean;
  isWeighed: boolean;
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
  createdDate: Date;
  city?: string;
  street?: string;
  house?: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  code?: string;
  comment?: string;
}

export type OrderStatus = 'created' | 'paid' | 'prepared' | 'delivered' | 'cancelled';
export interface Order {
  id: string;
  goods: Goods[];
  createdDate: Date;
  updatedDate: Date;
  status: OrderStatus;
  number: number;
  secretCode: string;
  userId?: string;
  address?: Address;
  addressTextCopy: string;
  commentTextCopy?: string;
}

