// Vékony kliens a Laravel API-hoz (backend/routes/api.php).

import type { Condition } from './content';

export type User = { id: number; name: string; email: string };

export type Category = { id: number; slug: string; name: string; listings_count?: number };

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

function query(filters: ListingFilters): string {
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
};
