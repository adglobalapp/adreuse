// Vékony kliens a Laravel API-hoz (backend/routes/api.php).

import type { Condition } from './content';

export type User = { id: number; name: string; email: string; is_admin: boolean };

export type Category = { id: number; slug: string; name: string; position?: number; listings_count?: number };

export type Listing = {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: Condition;
  location: string | null;
  status: 'active' | 'sold';
  image_url: string | null;
  category: Category;
  seller: { id: number; name: string; email: string | null };
  is_owner: boolean;
  /** A tulajdonos vagy egy admin szerkesztheti / törölheti. */
  can_manage: boolean;
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; total: number; per_page: number };
};

export type ListingFilters = {
  q?: string;
  category?: string;
  condition?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
  page?: string;
  per_page?: string;
};

export type AdminStats = {
  users: number;
  listings_active: number;
  listings_sold: number;
  listings_last_7_days: number;
  categories: number;
  messages_unread: number;
};

export type AdminUser = User & { listings_count: number; created_at: string };

export type ContactMessage = {
  id: number;
  site: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '') + '/api';
const TOKEN_KEY = 'adreuse-token';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage nem elérhető – a token csak a munkamenetre él
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(BASE_URL + path, { ...init, headers });
  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.message ?? res.statusText, body.errors);
  return body as T;
}

const json = (data: unknown) => JSON.stringify(data);

function query(filters: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    request<{ token: string; user: User }>('/register', { method: 'POST', body: json(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/login', { method: 'POST', body: json(data) }),
  logout: () => request<void>('/logout', { method: 'POST' }),
  me: () => request<{ data: User }>('/me').then((r) => r.data),

  categories: () => request<{ data: Category[] }>('/categories').then((r) => r.data),
  /** Kapcsolati / érdeklődő üzenet (backend: POST /api/contact, az admin felület Üzenetek fülén jelenik meg). */
  contact: (data: { name: string; email: string; message: string; website?: string; 'cf-turnstile-response'?: string }) =>
    request<void>('/contact', { method: 'POST', body: json({ ...data, site: 'adreuse' }) }),

  listings: (filters: ListingFilters = {}) => request<Paginated<Listing>>(`/listings${query(filters)}`),
  myListings: () => request<Paginated<Listing>>('/my/listings'),
  listing: (id: string | number) => request<{ data: Listing }>(`/listings/${id}`).then((r) => r.data),
  createListing: (form: FormData) =>
    request<{ data: Listing }>('/listings', { method: 'POST', body: form }).then((r) => r.data),
  /** Multipart PATCH-et a PHP nem olvas be, ezért POST + _method=PATCH. */
  updateListing: (id: number, form: FormData) => {
    form.set('_method', 'PATCH');
    return request<{ data: Listing }>(`/listings/${id}`, { method: 'POST', body: form }).then((r) => r.data);
  },
  setStatus: (id: number, status: Listing['status']) =>
    request<{ data: Listing }>(`/listings/${id}`, { method: 'PATCH', body: json({ status }) }).then((r) => r.data),
  deleteListing: (id: number) => request<void>(`/listings/${id}`, { method: 'DELETE' }),

  admin: {
    stats: () => request<{ data: AdminStats }>('/admin/stats').then((r) => r.data),
    listings: (filters: { q?: string; status?: string; page?: string } = {}) =>
      request<Paginated<Listing>>(`/admin/listings${query(filters)}`),
    categories: () => request<{ data: Category[] }>('/admin/categories').then((r) => r.data),
    createCategory: (data: { name: string }) =>
      request<{ data: Category }>('/admin/categories', { method: 'POST', body: json(data) }).then((r) => r.data),
    updateCategory: (id: number, data: { name?: string; position?: number }) =>
      request<{ data: Category }>(`/admin/categories/${id}`, { method: 'PATCH', body: json(data) }).then((r) => r.data),
    deleteCategory: (id: number) => request<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
    users: (filters: { q?: string; page?: string } = {}) => request<Paginated<AdminUser>>(`/admin/users${query(filters)}`),
    setAdmin: (id: number, is_admin: boolean) =>
      request<{ data: AdminUser }>(`/admin/users/${id}`, { method: 'PATCH', body: json({ is_admin }) }).then((r) => r.data),
    messages: (filters: { site?: string; unread?: string; page?: string } = {}) =>
      request<Paginated<ContactMessage> & { meta: { unread: number } }>(`/admin/messages${query(filters)}`),
    setRead: (id: number, read: boolean) =>
      request<{ data: ContactMessage }>(`/admin/messages/${id}`, { method: 'PATCH', body: json({ read }) }).then((r) => r.data),
    deleteMessage: (id: number) => request<void>(`/admin/messages/${id}`, { method: 'DELETE' }),
  },
};
