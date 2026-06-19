import { mockStore, MOCK_ADMIN } from "@/data/mock/store";
import type { Room, Review, Booking, Message } from "@/types/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const BASE = "/api";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("af_token");
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
  if (USE_MOCK) {
    await delay();
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const user = { id: "admin001", name: "AF Admin", email, role: "admin" as const };
      localStorage.setItem("af_token", MOCK_ADMIN.token);
      localStorage.setItem("af_user", JSON.stringify(user));
      return { success: true, data: { user, token: MOCK_ADMIN.token } };
    }
    return { success: false, message: "Email və ya şifrə yanlışdır" };
  }
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

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("af_user");
  return raw ? JSON.parse(raw) : null;
}

// ─── ROOMS ───
export async function getRooms(): Promise<Room[]> {
  if (USE_MOCK) {
    await delay();
    return mockStore.getRooms();
  }
  const res = await fetch(`${BASE}/rooms`, { headers: authHeaders() });
  const data = await res.json();
  return data.rooms ?? [];
}

export async function createRoom(payload: {
  name: string;
  type: Room["type"];
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
}) {
  if (USE_MOCK) {
    await delay();
    return mockStore.createRoom({ ...payload, isAvailable: true });
  }
  const res = await fetch(`${BASE}/rooms`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.room;
}

export async function updateRoom(id: string, payload: Partial<Room>) {
  if (USE_MOCK) {
    await delay();
    return mockStore.updateRoom(id, payload);
  }
  const res = await fetch(`${BASE}/rooms/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.room;
}

export async function deleteRoom(id: string) {
  if (USE_MOCK) {
    await delay();
    mockStore.deleteRoom(id);
    return;
  }
  await fetch(`${BASE}/rooms/${id}`, { method: "DELETE", headers: authHeaders() });
}

// ─── REVIEWS ───
export async function getReviews(): Promise<Review[]> {
  if (USE_MOCK) {
    await delay();
    return mockStore.getReviews();
  }
  const res = await fetch(`${BASE}/reviews`);
  return res.json();
}

export async function replyToReview(id: string, replyText: string) {
  if (USE_MOCK) {
    await delay();
    return mockStore.replyReview(id, replyText);
  }
  const res = await fetch(`${BASE}/admin/reviews/${id}/reply`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ replyText }),
  });
  return res.json();
}

// ─── BOOKINGS ───
export async function getBookings(): Promise<Booking[]> {
  if (USE_MOCK) {
    await delay();
    return mockStore.getBookings();
  }
  const res = await fetch(`${BASE}/admin/bookings`, { headers: authHeaders() });
  return res.json();
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  if (USE_MOCK) {
    await delay();
    return mockStore.updateBookingStatus(id, status);
  }
  await fetch(`${BASE}/bookings`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ type: "BOOKING", id, newStatus: status }),
  });
}

// ─── MESSAGES ───
export async function getMessages(): Promise<Message[]> {
  if (USE_MOCK) {
    await delay();
    return mockStore.getMessages();
  }
  const res = await fetch(`${BASE}/admin/messages`, { headers: authHeaders() });
  return res.json();
}

export async function markMessageRead(id: string) {
  if (USE_MOCK) {
    mockStore.markMessageRead(id);
    return;
  }
  await fetch(`${BASE}/bookings`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ type: "MESSAGE", id }),
  });
}

// ─── STATS ───
export async function getStats() {
  if (USE_MOCK) {
    await delay();
    return mockStore.getStats();
  }
  const res = await fetch(`${BASE}/admin/stats`, { headers: authHeaders() });
  return res.json();
}

// ─── DASHBOARD ───
export async function getDashboardData() {
  if (USE_MOCK) {
    await delay();
    return {
      bookings: mockStore.getBookings().map((b) => ({
        id: b.id,
        guest: b.guest,
        room: b.room,
        date: `${b.checkIn} → ${b.checkOut}`,
        status: b.status,
      })),
      rooms: mockStore.getRooms().map((r) => ({
        id: r._id,
        name: r.name,
        type: r.type,
        status: r.isAvailable ? "Boş" : "Dolu",
      })),
      messages: mockStore.getMessages(),
    };
  }
  const res = await fetch(`${BASE}/bookings`, { headers: authHeaders() });
  return res.json();
}
// ─── PUBLIC ROOMS (для сайта) ───
export interface PublicRoom {
  id: string;
  category: string;
  title: { az: string; en: string; ru: string };
  price: string;
  size: string;
  capacity: { az: string; en: string; ru: string };
  images: string[];
  desc: { az: string; en: string; ru: string };
  includes: { az: string[]; en: string[]; ru: string[] };
}

const ROOM_IMAGES: Record<string, string[]> = {
  standard: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"],
  deluxe: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"],
  cottage: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
};

function mapRoomToPublic(r: Room): PublicRoom {
  const typeLabels = {
    standard: { az: "Standart", en: "Standard", ru: "Стандарт" },
    deluxe: { az: "Deluxe", en: "Deluxe", ru: "Делюкс" },
    cottage: { az: "Kotec", en: "Cottage", ru: "Коттедж" },
  };
  return {
    id: r._id,
    category: typeLabels[r.type][r.type === "standard" ? "az" : r.type === "deluxe" ? "az" : "az"],
    title: {
      az: r.name,
      en: r.name,
      ru: r.name,
    },
    price: `${r.price} AZN`,
    size: `${r.capacity * 12} m²`,
    capacity: {
      az: `${r.capacity} nəfər`,
      en: `${r.capacity} guests`,
      ru: `${r.capacity} гостей`,
    },
    images: ROOM_IMAGES[r.type] ?? ROOM_IMAGES.standard,
    desc: { az: r.description, en: r.description, ru: r.description },
    includes: {
      az: r.amenities,
      en: r.amenities,
      ru: r.amenities,
    },
  };
}

export async function getPublicRooms(category = "all"): Promise<PublicRoom[]> {
  const rooms = await getRooms();
  const mapped = rooms.map(mapRoomToPublic);
  if (category === "all") return mapped;
  return mapped.filter((r) => r.category.toLowerCase().includes(category) || 
    rooms.find(x => x._id === r.id)?.type === category);
}

export async function getPublicRoomById(id: string): Promise<PublicRoom | null> {
  const rooms = await getRooms();
  const room = rooms.find((r) => r._id === id);
  return room ? mapRoomToPublic(room) : null;
}

// ─── REGISTER + GOOGLE (mock) ───
export async function register(name: string, email: string, password: string) {
  if (USE_MOCK) {
    await delay();
    const user = { id: `user_${Date.now()}`, name, email, role: "user" as const };
    localStorage.setItem("af_token", `mock-token-${email}`);
    localStorage.setItem("af_user", JSON.stringify(user));
    return { success: true, data: { user, token: `mock-token-${email}` } };
  }
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("af_token", data.data.token);
    localStorage.setItem("af_user", JSON.stringify(data.data.user));
  }
  return data;
}

export async function loginWithGoogle(name: string, email: string) {
  if (USE_MOCK) {
    await delay();
    const isAdmin = email === MOCK_ADMIN.email;
    const user = {
      id: isAdmin ? "admin001" : `google_${Date.now()}`,
      name,
      email,
      role: isAdmin ? ("admin" as const) : ("user" as const),
    };
    localStorage.setItem("af_token", `google-mock-${email}`);
    localStorage.setItem("af_user", JSON.stringify(user));
    return { success: true, data: { user } };
  }
  return { success: false, message: "Google auth not configured" };
}

export function getRedirectAfterLogin(user: { role: string }) {
  return user.role === "admin" ? "/admin" : "/account";
}