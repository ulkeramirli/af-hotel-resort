const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
 
// ─── Types ───────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}
 
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}
 
export interface AuthData {
  user: User;
  token: string;
}
 
export interface Room {
  _id: string;
  name: string;
  type: "single" | "standard_double" | "standard_twin" | "apartment";
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  images?: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
 
export interface Review {
  id: string;
  userName: string;
  userImage: string;
  comment: string;
  rating: number;
  replyText?: string;
  userEmail: string;
}
 
// ─── API Error class ─────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isAuthError = false
  ) {
    super(message);
    this.name = "ApiError";
  }
}
 
// ─── Token helpers ───────────────────────────────────────────
// Token is stored after login. Replace with NextAuth session if integrated.
let _token: string | null = null;
 
export const setAuthToken = (token: string) => {
  _token = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("af_token", token);
  }
};
 
export const getAuthToken = (): string | null => {
  if (_token) return _token;
  if (typeof window !== "undefined") {
    _token = localStorage.getItem("af_token");
  }
  return _token;
};
 
export const clearAuthToken = () => {
  _token = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("af_token");
  }
};
 
// ─── Core fetch wrapper ──────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
 
  if (requiresAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new ApiError(401, "Zəhmət olmasa daxil olun", true);
    }
    headers["Authorization"] = `Bearer ${token}`;
  }
 
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
 
  // Handle non-JSON responses
  const contentType = res.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const body = isJson ? await res.json() : await res.text();
 
  if (!res.ok) {
    const message =
      (isJson && body?.message) ||
      getStatusMessage(res.status);
 
    throw new ApiError(
      res.status,
      message,
      res.status === 401 || res.status === 403
    );
  }
 
  return body as T;
}
 
// Human-readable fallback messages for HTTP status codes
function getStatusMessage(status: number): string {
  const messages: Record<number, string> = {
    400: "Məlumatlar yanlışdır",
    401: "İcazə yoxdur. Zəhmət olmasa daxil olun",
    403: "Bu əməliyyat üçün icazəniz yoxdur",
    404: "Məlumat tapılmadı",
    422: "Daxil edilən məlumatlar düzgün deyil",
    429: "Çox sayda sorğu. Bir az gözləyin",
    500: "Server xətası. Zəhmət olmasa bir az sonra yenidən cəhd edin",
    503: "Xidmət müvəqqəti əlçatmazdır",
  };
  return messages[status] || "Gözlənilməz xəta baş verdi";
}
 
// ─── AUTH ENDPOINTS ──────────────────────────────────────────
// POST /auth/register
export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthData> {
  const res = await request<{ success: boolean; data: AuthData }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(payload) }
  );
  if (res.data?.token) setAuthToken(res.data.token);
  return res.data!;
}
 
// POST /login
export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthData> {
  const res = await request<{ success: boolean; data: AuthData }>(
    "/login",
    { method: "POST", body: JSON.stringify(payload) }
  );
  if (res.data?.token) setAuthToken(res.data.token);
  return res.data!;
}
 
// GET /profile  ← requires Bearer token
export async function getProfile(): Promise<User> {
  const res = await request<{ success: boolean; data: User }>(
    "/profile",
    {},
    true // requiresAuth
  );
  return res.data!;
}
 
// ─── ROOMS ENDPOINTS ─────────────────────────────────────────
// GET /rooms — public
export async function getRooms(): Promise<Room[]> {
  const res = await request<{ success: boolean; rooms: Room[] }>("/rooms");
  return res.rooms;
}
 
// GET /rooms/:id — public
export async function getRoomById(id: string): Promise<Room> {
  const res = await request<{ success: boolean; room: Room }>(`/rooms/${id}`);
  return res.room;
}
 
// POST /rooms — Admin only
export async function createRoom(
  payload: Omit<Room, "_id" | "isAvailable" | "createdBy" | "createdAt" | "updatedAt">
): Promise<Room> {
  const res = await request<{ success: boolean; room: Room }>(
    "/rooms",
    { method: "POST", body: JSON.stringify(payload) },
    true
  );
  return res.room;
}
 
// PUT /rooms/:id — Admin only
export async function updateRoom(
  id: string,
  payload: Partial<Room>
): Promise<Room> {
  const res = await request<{ success: boolean; room: Room }>(
    `/rooms/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
    true
  );
  return res.room;
}
 
// DELETE /rooms/:id — Admin only
export async function deleteRoom(id: string): Promise<void> {
  await request(`/rooms/${id}`, { method: "DELETE" }, true);
}
 
// ─── REVIEWS ENDPOINTS ───────────────────────────────────────
// GET /reviews — public
export async function getReviews(): Promise<Review[]> {
  return request<Review[]>("/reviews");
}
 
// POST /reviews
export async function createReview(payload: {
  userName: string;
  userImage?: string;
  userEmail: string;
  rating: number;
  comment: string;
}): Promise<void> {
  await request("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
 
// PUT /admin/reviews/:id/reply — Admin only
export async function replyToReview(
  id: string,
  replyText: string
): Promise<void> {
  await request(
    `/admin/reviews/${id}/reply`,
    { method: "PUT", body: JSON.stringify({ replyText }) },
    true
  );
}
 
// ─── FUTURE ENDPOINTS (add when backend provides them) ───────
// TODO: Bookings - awaiting backend
// export async function createBooking(payload: BookingPayload): Promise<Booking> { ... }
// export async function getBookings(): Promise<Booking[]> { ... }
// export async function getMyBookings(): Promise<Booking[]> { ... }
 
// TODO: Messages/Contact - awaiting backend
// export async function sendContactMessage(payload: ContactPayload): Promise<void> { ... }