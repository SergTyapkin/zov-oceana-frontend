import { OrderStatuses } from '~/constants';

export interface User {
  id: string;
  tgUsername?: string;
  tgId?: string;
  givenName: string;
  familyName: string;
  middleName?: string;
  avatarUrl?: string;
  city: string;
  email?: string;
  tel: string;
  joinedDate: Date;
  referrerId?: string;
  partnerStatus?: boolean;
  partnerBonuses: number;

  isEmailNotificationsOn: boolean;

  canEditOrders: boolean;
  canEditUsers: boolean;
  canEditPartners: boolean;
  canEditGoods: boolean;
  canExecuteSQL: boolean;
  canEditGlobals: boolean;

  hasSomeAdminRights: boolean;

  ordersCount?: number;
  totalOrdersCost?: number;

  isSignedIn: boolean;
}
export interface UserOther {
  id: string;
  givenName: string;
  familyName: string;
  avatarUrl?: string;
  joinedDate: Date;
}
export interface UserPartner {
  id: string;
  givenName: string;
  familyName: string;
  avatarUrl?: string;
  city: string;
  joinedDate: Date;
  totalValue: number;
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
  createdDate: Date;
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

export type OrderStatus = keyof typeof OrderStatuses;
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
  userGivenName?: string;
  userFamilyName?: string;
  trackingCode?: string;
}

export interface PartnerHistoryTransaction {
  id: string;
  userid: string;
  avatarurl?: string;
  givenname?: string;
  familyname?: string;
  fromuserid?: string;
  comment?: string;
  value: number;
  date: Date;
}

