 
import type {
  Room,
  RoomType,
  RoomSettings,
  Review,
  Booking,
  User,
  Activity,
  ActivityCategory,
  Faq,
  Ticket,
  About,
  Settings,
  DashboardStats,
  Wonderland,
  Restaurant,
  MenuCategory,
  RestaurantSettings,
  ActivitySettings,
} from "@/types/api";

// Handle absolute URLs for Server-Side Rendering
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const BASE = typeof window === "undefined" ? `${API_URL}/api` : "/api";

function setToken(token: string, user: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem("af_token", token);
  localStorage.setItem("af_user", JSON.stringify(user));
  // Set cookie for 7 days
  document.cookie = `af_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  // Try cookie first
  const match = document.cookie.match(new RegExp("(^| )af_token=([^;]+)"));
  if (match) return match[2];
  // Fallback to localStorage
  const token = localStorage.getItem("af_token");
  if (!token || token === "null" || token === "undefined") return null;
  if (token.startsWith('"') && token.endsWith('"')) {
    return token.slice(1, -1);
  }
  return token;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── AUTH ───
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.success) {
    setToken(data.data.token, data.data.user);
  }
  return data;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("af_token");
  localStorage.removeItem("af_user");
  document.cookie = "af_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("af_user");
  return raw ? JSON.parse(raw) : null;
}

export function getRedirectAfterLogin(user: User) {
  return user.role === "admin" ? "/admin" : "/account";
}
export async function register(name: string, email: string, password: string): Promise<any> {
  try {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function forgotPassword(email: string): Promise<any> {
  try {
    const res = await fetch(`${BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<any> {
  try {
    const res = await fetch(`${BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateProfile(name: string, email: string): Promise<any> {
  try {
    const res = await fetch(`${BASE}/auth/profile`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (data.success && data.data && data.data.user) {
      localStorage.setItem("af_user", JSON.stringify(data.data.user));
    }
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function loginWithGoogle(name?: string, email?: string): Promise<any> {
  // Simulated Google login: if user exists → log in, else → register
  try {
    const res = await fetch(`${BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || "Google User",
        email: email || "google_demo_user@example.com",
        googleId: "123456789",
      }),
    });
    const data = await res.json();
    if (data.success) {
      setToken(data.data.token, data.data.user);
    }
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ─── PUBLIC ROOM TYPES (for frontend pages) ───
export interface PublicRoom {
  id: string;
  category: string; // The ID of the category
  categoryName: { az: string; en: string; ru: string };
  title: { az: string; en: string; ru: string };
  desc: { az: string; en: string; ru: string };
  capacity: { az: string; en: string; ru: string };
  rawCapacity: number;
  size: string;
  price: number;
  images: string[];
  includes: { az: string[]; en: string[]; ru: string[] };
  beds?: number;
  baths?: number;
  rulesCheckIn?: string;
  rulesCheckOut?: string;
}


// Validate image URL — reject single-segment hostnames like "image.jpg"
function isValidImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    // Hostname must contain at least one dot AND not just be a file extension pretending to be a host
    const host = u.hostname;
    if (!host.includes(".")) return false;
    // Reject hostnames that look like filenames (e.g. "image.jpg")
    if (/^[^.]+\.(jpg|jpeg|png|webp|gif|svg|bmp)$/i.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}

function sanitizeImages(images: string[] | undefined): string[] {
  if (!images?.length) return [];
  const valid = images.filter(isValidImageUrl);
  return valid;
}

export async function getPublicRooms(): Promise<PublicRoom[]> {
  try {
    const res = await fetch(`${BASE}/rooms`);
    const data = await res.json();
    if (!data.success) return [];
    const rooms: Room[] = data.rooms ?? [];
    return rooms.map((r): PublicRoom => ({
      id: r._id,
      category: typeof r.type === "object" && r.type !== null ? (r.type as any)._id : String(r.type),
      categoryName: typeof r.type === "object" && r.type !== null ? (r.type as any).name : { az: "Otaq", en: "Room", ru: "Номер" },
      title: (r.name as any) || { az: "", en: "", ru: "" },
      desc: (r.description as any) || { az: "", en: "", ru: "" },
      capacity: {
        az: `${r.capacity} nəfər`,
        en: `${r.capacity} persons`,
        ru: `${r.capacity} человек`,
      },
      rawCapacity: r.capacity || 2,
      size: r.sqft ? `${r.sqft} sqft` : "350 sqft",
      price: r.price,
      images: sanitizeImages(r.images),
      includes: {
        az: (r.amenities as any)?.map((a:any) => typeof a === 'object' ? a.az : a) || [],
        en: (r.amenities as any)?.map((a:any) => typeof a === 'object' ? a.en : a) || [],
        ru: (r.amenities as any)?.map((a:any) => typeof a === 'object' ? a.ru : a) || [],
      },
      beds: r.beds,
      baths: r.baths,
      rulesCheckIn: r.rulesCheckIn as any,
      rulesCheckOut: r.rulesCheckOut as any,
    }));
  } catch {
    return [];
  }
}

// GET /api/room-settings → { success, settings }
export async function getRoomSettings(): Promise<RoomSettings> {
  const res = await fetch(`${BASE}/room-settings`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Tənzimləmələr yüklənmədi");
  return data.settings;
}

// PATCH /api/room-settings → { success, settings }
export async function updateRoomSettings(payload: Partial<RoomSettings>): Promise<RoomSettings> {
  const res = await fetch(`${BASE}/room-settings`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Tənzimləmələr yenilənmədi");
  return data.settings;
}

export async function getPublicRoomById(id: string): Promise<PublicRoom | null> {
  try {
    const res = await fetch(`${BASE}/rooms/${id}`);
    const data = await res.json();
    if (!data.success || !data.room) return null;
    const r: Room = data.room;
    return {
      id: r._id,
      category: typeof r.type === "object" && r.type !== null ? (r.type as any)._id : String(r.type),
      categoryName: typeof r.type === "object" && r.type !== null ? (r.type as any).name : { az: "Otaq", en: "Room", ru: "Номер" },
      title: (r.name as any) || { az: "", en: "", ru: "" },
      desc: (r.description as any) || { az: "", en: "", ru: "" },
      capacity: {
        az: `${r.capacity} nəfər`,
        en: `${r.capacity} persons`,
        ru: `${r.capacity} человек`,
      },
      rawCapacity: r.capacity || 2,
      size: r.sqft ? `${r.sqft} sqft` : "350 sqft",
      price: r.price,
      images: sanitizeImages(r.images),
      includes: {
        az: (r.amenities as any)?.map((a:any) => typeof a === 'object' ? a.az : a) || [],
        en: (r.amenities as any)?.map((a:any) => typeof a === 'object' ? a.en : a) || [],
        ru: (r.amenities as any)?.map((a:any) => typeof a === 'object' ? a.ru : a) || [],
      },
      beds: r.beds,
      baths: r.baths,
      rulesCheckIn: r.rulesCheckIn as any,
      rulesCheckOut: r.rulesCheckOut as any,
    };
  } catch {
    return null;
  }
}

// ─── ROOMS ───
// GET /api/rooms → { success, rooms[] }
export async function getRooms(): Promise<Room[]> {
  const res = await fetch(`${BASE}/rooms`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Otaqlar yüklənmədi");
  return data.rooms ?? [];
}

// POST /api/rooms → { success, room }
export async function createRoom(payload: Partial<Room>) {
  const res = await fetch(`${BASE}/rooms`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Otaq yaradılmadı");
  return data;
}

// PUT /api/rooms/[id] → { success, room }
export async function updateRoom(id: string, payload: Partial<Room>) {
  const res = await fetch(`${BASE}/rooms/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Otaq yenilənmədi");
  return data;
}

// DELETE /api/rooms/[id] → { success, message }
export async function deleteRoom(id: string) {
  const res = await fetch(`${BASE}/rooms/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Otaq silinmədi");
  return data;
}

// ─── ROOM TYPES ───
// GET /api/room-types → { success, roomTypes[] }
export async function getRoomTypes(): Promise<RoomType[]> {
  const res = await fetch(`${BASE}/room-types`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriyalar yüklənmədi");
  return data.roomTypes ?? [];
}

// POST /api/room-types → { success, roomType }
export async function createRoomType(name: any) {
  const res = await fetch(`${BASE}/room-types`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriya yaradılmadı");
  return data;
}

// PUT /api/room-types/[id] → { success, roomType }
export async function updateRoomType(id: string, name: any) {
  const res = await fetch(`${BASE}/room-types/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriya yenilənmədi");
  return data;
}

// DELETE /api/room-types/[id]
export async function deleteRoomType(id: string) {
  const res = await fetch(`${BASE}/room-types/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriya silinmədi");
  return data;
}

// ─── ACTIVITIES ───
// GET /api/activities → { success, activities[] }
export async function getActivities(): Promise<Activity[]> {
  const res = await fetch(`${BASE}/activities`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Fəaliyyətlər yüklənmədi");
  return data.activities ?? [];
}

// POST /api/activities → { success, activity }
export async function createActivity(payload: Partial<Activity>) {
  const res = await fetch(`${BASE}/activities`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Fəaliyyət yaradılmadı");
  return data;
}

// PUT /api/activities/[id] → { success, activity }
export async function updateActivity(id: string, payload: Partial<Activity>) {
  const res = await fetch(`${BASE}/activities/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Fəaliyyət yenilənmədi");
  return data;
}

// DELETE /api/activities/[id]
export async function deleteActivity(id: string) {
  const res = await fetch(`${BASE}/activities/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Fəaliyyət silinmədi");
  return data;
}

// ─── ACTIVITY CATEGORIES ───
// GET /api/activity-categories → { success, categories[] }
export async function getActivityCategories(): Promise<ActivityCategory[]> {
  const res = await fetch(`${BASE}/activity-categories`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriyalar yüklənmədi");
  return data.categories ?? [];
}

// POST /api/activity-categories → { success, category }
export async function createActivityCategory(payload: Partial<ActivityCategory>) {
  const res = await fetch(`${BASE}/activity-categories`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriya yaradılmadı");
  return data;
}

// PUT /api/activity-categories/[id]
export async function updateActivityCategory(id: string, payload: Partial<ActivityCategory>) {
  const res = await fetch(`${BASE}/activity-categories/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriya yenilənmədi");
  return data;
}

// DELETE /api/activity-categories/[id]
export async function deleteActivityCategory(id: string) {
  const res = await fetch(`${BASE}/activity-categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriya silinmədi");
  return data;
}

// GET /api/activity-settings → { success, settings }
export async function getActivitySettings(): Promise<ActivitySettings> {
  const res = await fetch(`${BASE}/activity-settings`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Tənzimləmələr yüklənmədi");
  return data.settings;
}

// PATCH /api/activity-settings → { success, settings }
export async function updateActivitySettings(payload: Partial<ActivitySettings>): Promise<ActivitySettings> {
  const res = await fetch(`${BASE}/activity-settings`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Tənzimləmələr yenilənmədi");
  return data.settings;
}

// GET /api/bookings → { success, page, limit, total, totalPages, bookings[] }
export async function getBookings(): Promise<Booking[]> {
  const res = await fetch(`${BASE}/bookings?limit=100`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Bronlar yüklənmədi");
  return data.bookings ?? [];
}

export async function getBookedDates(roomId: string): Promise<{checkIn: string; checkOut: string}[]> {
  const res = await fetch(`${BASE}/bookings/dates?roomId=${roomId}`);
  const data = await res.json();
  return data.dates ?? [];
}

export async function createBooking(payload: any): Promise<any> {
  try {
    const res = await fetch(`${BASE}/bookings`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// PATCH /api/bookings/[id] → { success, message, booking }
export async function updateBooking(id: string, payload: unknown) {
  const res = await fetch(`${BASE}/bookings/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Bron yenilənmədi");
  return data;
}

// DELETE /api/bookings/[id]
export async function deleteBooking(id: string) {
  const res = await fetch(`${BASE}/bookings/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Bron silinmədi");
  return data;
}

// ─── REVIEWS ───
// GET /api/reviews → { success, totalReviews, review[] }  ← KEY IS "review" (singular)
export async function getReviews(): Promise<Review[]> {
  const res = await fetch(`${BASE}/reviews`, { headers: authHeaders() });
  const data = await res.json();
  // Backend returns key "review" (singular), not "reviews"
  return data.review ?? data.reviews ?? [];
}

// GET /api/admin/reviews → all reviews regardless of status (admin only)
export async function getAllReviews(): Promise<Review[]> {
  const res = await fetch(`${BASE}/admin/reviews`, { headers: authHeaders() });
  const data = await res.json();
  return data.reviews ?? data.review ?? [];
}

export async function createReview(payload: { fullName: string; emailOrPhone: string; message: string }) {
  const res = await fetch(`${BASE}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// PUT /api/reviews/[id] → { success, review }
export async function updateReviewStatus(id: string, status: string, adminReply?: string) {
  const payload: { status: string; adminReply?: string } = { status };
  if (adminReply !== undefined) payload.adminReply = adminReply;

  const res = await fetch(`${BASE}/reviews/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Rəy yenilənmədi");
  return data;
}

// DELETE /api/reviews/[id]
export async function deleteReview(id: string) {
  const res = await fetch(`${BASE}/reviews/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Rəy silinmədi");
  return data;
}

// ─── FAQS ───
// GET /api/faqs → { success, faq[] }  ← KEY IS "faq" (singular) 
export async function getFaqs(): Promise<Faq[]> {
  const res = await fetch(`${BASE}/faqs`, { headers: authHeaders() });
  const data = await res.json();
  // Backend returns key "faq" (singular), not "faqs"
  return data.faq ?? data.faqs ?? [];
}

// POST /api/faqs → { success, faq }
export async function createFaq(payload: Partial<Faq>) {
  const res = await fetch(`${BASE}/faqs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Sual yaradılmadı");
  return data;
}

// PUT /api/faqs/[id]
export async function updateFaq(id: string, payload: Partial<Faq>) {
  const res = await fetch(`${BASE}/faqs/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Sual yenilənmədi");
  return data;
}

// DELETE /api/faqs/[id]
export async function deleteFaq(id: string) {
  const res = await fetch(`${BASE}/faqs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Sual silinmədi");
  return data;
}

// ─── TICKETS ───
// GET /api/tickets → { success, tickets[] }
export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${BASE}/tickets`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Biletlər yüklənmədi");
  return data.tickets ?? [];
}

// POST /api/tickets → { success, ticket }
export async function createTicket(payload: Partial<Ticket>) {
  const res = await fetch(`${BASE}/tickets`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Bilet yaradılmadı");
  return data;
}

// PUT /api/tickets/[id]
export async function updateTicket(id: string, payload: Partial<Ticket>) {
  const res = await fetch(`${BASE}/tickets/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Bilet yenilənmədi");
  return data;
}

// DELETE /api/tickets/[id]
export async function deleteTicket(id: string) {
  const res = await fetch(`${BASE}/tickets/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Bilet silinmədi");
  return data;
}

// ─── SETTINGS ───
// GET /api/settings → { success, settings }
export async function getSettings(): Promise<Settings | null> {
  try {
    const res = await fetch(`${BASE}/settings`, { headers: authHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data.settings ?? null;
  } catch (error) {
    console.error("Failed to parse settings JSON:", error);
    return null;
  }
}

// PATCH /api/settings → { success, settings }
export async function updateSettings(payload: Partial<Settings>) {
  const res = await fetch(`${BASE}/settings`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Tənzimləmələr yadda saxlanılmadı");
  return data;
}

// ─── ABOUT ───
// GET /api/about → { success, about }
export async function getAbout(): Promise<About | null> {
  try {
    const res = await fetch(`${BASE}/about`, { headers: authHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data.about ?? null;
  } catch {
    return null;
  }
}

// PATCH /api/about → { success, about }
export async function updateAbout(payload: Partial<About>) {
  const res = await fetch(`${BASE}/about`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Haqqımızda yadda saxlanılmadı");
  return data;
}

// ─── DASHBOARD ───
// GET /api/dashboard → { success, stats, recentBookings[], topRooms[] }
// topRooms: [{ _id: { name, type, price }, bookings: count }]
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const res = await fetch(`${BASE}/dashboard`, { headers: authHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return {
      ...data.stats,
      recentBookings: data.recentBookings ?? [],
      topRooms: (data.topRooms ?? []).map((r: { _id?: { name?: string; type?: string; price?: number }; bookings?: number }) => ({
        name: r._id?.name ?? "Bilinmir",
        type: r._id?.type ?? "",
        price: r._id?.price ?? 0,
        count: r.bookings ?? 0,
      })),
    };
  } catch {
    return null;
  }
}

// ─── WONDERLAND ───
// GET /api/wonderland → { success, wonderland }
export async function getWonderland(): Promise<Wonderland | null> {
  try {
    const res = await fetch(`${BASE}/wonderland`, { headers: authHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return data.wonderland ?? null;
  } catch {
    return null;
  }
}

// PATCH /api/wonderland → { success, wonderland }
export async function updateWonderland(payload: Partial<Wonderland>) {
  const res = await fetch(`${BASE}/wonderland`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Wonderland yadda saxlanılmadı");
  return data;
}

// ─── RESTAURANTS ───
// GET /api/restaurants → { success, restaurants[] }
export async function getRestaurants(search?: string): Promise<Restaurant[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${BASE}/restaurants${query}`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Restoranlar yüklənmədi");
  return data.restaurants ?? [];
}

// GET /api/restaurants/[id] → { success, restaurant }
export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  const res = await fetch(`${BASE}/restaurants/${id}`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Restoran tapılmadı");
  return data.restaurant ?? null;
}

// POST /api/restaurants → { success, restaurant }
export async function createRestaurant(payload: Partial<Restaurant>) {
  const res = await fetch(`${BASE}/restaurants`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Restoran yaradılmadı");
  return data;
}

// PUT /api/restaurants/[id] → { success, restaurant }
export async function updateRestaurant(id: string, payload: Partial<Restaurant>) {
  const res = await fetch(`${BASE}/restaurants/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Restoran yenilənmədi");
  return data;
}

// DELETE /api/restaurants/[id]
export async function deleteRestaurant(id: string) {
  const res = await fetch(`${BASE}/restaurants/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Restoran silinmədi");
  return data;
}

// GET /api/restaurants/[id]/menu-search?q=query → { success, menu[] }
export async function searchRestaurantMenu(id: string, query: string): Promise<MenuCategory[]> {
  const res = await fetch(`${BASE}/restaurants/${id}/menu-search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Menyü axtarışı uğursuz oldu");
  return data.menu ?? [];
}

// GET /api/restaurant-settings → { success, settings }
export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  const res = await fetch(`${BASE}/restaurant-settings`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Tənzimləmələr yüklənmədi");
  return data.settings;
}

// PATCH /api/restaurant-settings → { success, settings }
export async function updateRestaurantSettings(payload: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
  const res = await fetch(`${BASE}/restaurant-settings`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Tənzimləmələr yenilənmədi");
  return data.settings;
}


// ─── UPLOAD ───
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();
  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  return res.json();
}