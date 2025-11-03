export interface User {
  id: string;
  givenName: string;
  familyName: string;
  middleName?: string;
  email: string;
  tel?: string;

  isAdmin: boolean;

  isSignedIn: boolean;
}

export interface Goods {
  id: string;
  title: string;
  description?: string;
  previewUrl?: string;
  fromLocation?: string;
  amountLeft?: number;
  cost?: number;
  categoryId?: string;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  previewUrl?: string;
  goodsCount?: number;
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

