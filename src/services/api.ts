 
import type {
  Room,
  RoomType,
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
} from "@/types/api";

const BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
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
    localStorage.setItem("af_token", data.data.token);
    localStorage.setItem("af_user", JSON.stringify(data.data.user));
  }
  return data;
}

export function logout() {
  localStorage.removeItem("af_token");
  localStorage.removeItem("af_user");
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
export async function loginWithGoogle(): Promise<any> {
  return { success: false, message: "Google ilə giriş hələ aktiv deyil" };
}

// ─── PUBLIC ROOM TYPES (for frontend pages) ───
export interface PublicRoom {
  id: string;
  category: string;
  title: { az: string; en: string; ru: string };
  desc: { az: string; en: string; ru: string };
  capacity: { az: string; en: string; ru: string };
  size: string;
  price: number;
  images: string[];
  includes: { az: string[]; en: string[]; ru: string[] };
}

export async function getPublicRooms(): Promise<PublicRoom[]> {
  try {
    const res = await fetch(`${BASE}/rooms`);
    const data = await res.json();
    if (!data.success) return [];
    const rooms: Room[] = data.rooms ?? [];
    return rooms.map((r): PublicRoom => ({
      id: r._id,
      category: typeof r.type === "object" && r.type !== null ? (r.type as any).name ?? "Standard" : String(r.type),
      title: { az: r.name, en: r.name, ru: r.name },
      desc: { az: r.description, en: r.description, ru: r.description },
      capacity: {
        az: `${r.capacity} nəfər`,
        en: `${r.capacity} persons`,
        ru: `${r.capacity} человек`,
      },
      size: "35 m²",
      price: r.price,
      images: r.images?.length ? r.images : ["/placeholder-room.jpg"],
      includes: {
        az: r.amenities ?? [],
        en: r.amenities ?? [],
        ru: r.amenities ?? [],
      },
    }));
  } catch {
    return [];
  }
}

export async function getPublicRoomById(id: string): Promise<PublicRoom | null> {
  try {
    const res = await fetch(`${BASE}/rooms/${id}`);
    const data = await res.json();
    if (!data.success || !data.room) return null;
    const r: Room = data.room;
    return {
      id: r._id,
      category: typeof r.type === "object" && r.type !== null ? (r.type as any).name ?? "Standard" : String(r.type),
      title: { az: r.name, en: r.name, ru: r.name },
      desc: { az: r.description, en: r.description, ru: r.description },
      capacity: {
        az: `${r.capacity} nəfər`,
        en: `${r.capacity} persons`,
        ru: `${r.capacity} человек`,
      },
      size: "35 m²",
      price: r.price,
      images: r.images?.length ? r.images : ["/placeholder-room.jpg"],
      includes: {
        az: r.amenities ?? [],
        en: r.amenities ?? [],
        ru: r.amenities ?? [],
      },
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
export async function createRoomType(name: string) {
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
export async function updateRoomType(id: string, name: string) {
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
export async function createActivityCategory(name: string) {
  const res = await fetch(`${BASE}/activity-categories`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Kateqoriya yaradılmadı");
  return data;
}

// PUT /api/activity-categories/[id]
export async function updateActivityCategory(id: string, name: string) {
  const res = await fetch(`${BASE}/activity-categories/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
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

// ─── BOOKINGS ───
// GET /api/bookings → { success, page, limit, total, totalPages, bookings[] }
export async function getBookings(): Promise<Booking[]> {
  const res = await fetch(`${BASE}/bookings?limit=100`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Bronlar yüklənmədi");
  return data.bookings ?? [];
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
  const res = await fetch(`${BASE}/settings`, { headers: authHeaders() });
  const data = await res.json();
  return data.settings ?? null;
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
  const res = await fetch(`${BASE}/about`, { headers: authHeaders() });
  const data = await res.json();
  return data.about ?? null;
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
  const res = await fetch(`${BASE}/dashboard`, { headers: authHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Dashboard məlumatı yüklənmədi");
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