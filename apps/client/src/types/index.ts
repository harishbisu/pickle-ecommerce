export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  address?: string;
  phone?: string;
  createdAt?: string;
}

export interface Product {
  id: string; 
  slug: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  images: string[];
  specifications?: any;
  isFeatured?: boolean;
  discount?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: string;
  status: OrderStatus;
  paymentId: string;
  trackingId: string | null;
  createdAt: string;
  items?: OrderItem[];
}

export type OrderStatus = 
  | 'ACKNOWLEDGED' 
  | 'DISPATCHED' 
  | 'IN_TRANSIT' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
}

export interface AppSetting {
  id: string;
  settingKey: string;
  settingValue: string;
}
