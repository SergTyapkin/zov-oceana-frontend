export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';

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

