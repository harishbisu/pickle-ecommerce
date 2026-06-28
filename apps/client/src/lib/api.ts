const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pickle_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Request failed");
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ─── Auth API ───────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string }>("/auth/login", { email, password }),
  register: (email: string, password: string) =>
    api.post<{ id: number; email: string; role: string }>("/auth/register", {
      email,
      password,
    }),
  profile: () =>
    api.get<{
      id: string;
      email: string;
      role: string;
      name?: string;
      phone?: string;
      address?: string;
      state?: string;
    }>("/auth/profile"),
};

// ─── Analytics API ──────────────────────────────────────────────────────────────
export const analyticsApi = {
  dashboardData: () =>
    api.get<{ totalUsers: number; totalOrders: number; totalRevenue: number }>(
      "/analytics/dashboard",
    ),
};

// ─── Users API ──────────────────────────────────────────────────────────────
export const usersApi = {
  updateProfile: (data: {
    name?: string;
    address?: string;
    state?: string;
    phone?: string;
  }) => api.patch<{ id: string; email: string }>("/users/profile", data),
  list: () => api.get<User[]>("/users"),
};

// ─── Products API ────────────────────────────────────────────────────────────
export const productsApi = {
  list: () => api.get<Product[]>("/products"),
  get: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: {
    name: string;
    description: string;
    price: number;
    stock?: number;
    images?: string[];
  }) => api.post<Product>("/products", data),
  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      images?: string[];
    },
  ) => api.patch<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete<void>(`/products/${id}`),
};

// ─── Orders API ──────────────────────────────────────────────────────────────
export const ordersApi = {
  checkout: (
    items: CartItem[],
    shippingDetails?: {
      shippingName: string;
      shippingAddress: string;
      shippingState: string;
      shippingPhone: string;
    },
  ) =>
    api.post<{
      id: string;
      razorpayOrderId: string;
      razorpayKeyId: string;
      totalAmount: string;
    }>("/orders/checkout", { items, ...shippingDetails }),
  verifyPayment: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    api.post<{ success: boolean; orderId: string; orderNumber: string }>(
      "/orders/verify-payment",
      data,
    ),
  track: (id: string) => api.get<Order>(`/orders/track/${id}`),
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.status) query.append("status", params.status);
    if (params?.date) query.append("date", params.date);
    return api.get<{
      data: Order[];
      total: number;
      hasMore: boolean;
      page: number;
      limit: number;
    }>(`/orders?${query.toString()}`);
  },
  updateStatus: (id: string, status: string) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),
  userOrders: () => api.get<Order[]>("/orders/user/my-orders"),
};

// ─── Settings API ─────────────────────────────────────────────────────────────
export const settingsApi = {
  getAll: () => api.get<AppSetting[]>("/settings"),
  get: (key: string) =>
    api.get<{ key: string; value: string }>(`/settings/${key}`),
  set: (key: string, value: string) =>
    api.post<AppSetting>("/settings", { key, value }),
};

// ─── Promotions API ───────────────────────────────────────────────────────────
export const promotionsApi = {
  list: () => api.get<Promotion[]>("/promotions"),
  create: (data: { utmSource: string }) =>
    api.post<Promotion>("/promotions", data),
  track: (utmSource: string) =>
    api.post<{ success: boolean }>("/promotions/track", { utmSource }),
};

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Product {
  slug: string;
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  images: string[];
  createdAt: string;
  discount?: string;
  specifications?: Record<string, string>;
  isFeatured?: boolean;
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
  status: string;
  paymentId: string;
  trackingId: string | null;
  createdAt: string;
  shippingName?: string;
  shippingAddress?: string;
  shippingState?: string;
  shippingPhone?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  productName?: string;
}

export interface AppSetting {
  id: string;
  settingKey: string;
  settingValue: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  utmSource: string;
  visitCount: number;
  createdAt: string;
}
