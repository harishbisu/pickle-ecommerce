export interface User {
  id: string; // Changed from number to string for custom IDs
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Product {
  id: string; // Changed from number to string
  name: string;
  description: string;
  price: string;
  stock: number;
  images: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string; // Changed from number to string
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface Order {
  id: string; // Changed from number to string
  userId: string; // Changed from number to string
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
  id: string; // Changed from number to string
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
