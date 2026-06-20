// @ts-nocheck
import type { Room, Review, Booking } from "@/types/api";

const STORAGE_KEY = "af_hotel_mock_v1";

interface MockStore {
  rooms: Room[];
  reviews: Review[];
  bookings: Booking[];
  messages: Message[];
}

const ADMIN_USER = {
  _id: "admin001",
  name: "AF Admin",
  email: "admin@afhotel.az",
};

const now = () => new Date().toISOString();

const defaultStore: MockStore = {
  rooms: [
    {
      _id: "room001",
      name: "Standart Otaq 101",
      type: "standard",
      description: "Dəniz mənzərəli rahat otaq, 2 nəfərlik",
      price: 120,
      capacity: 2,
      amenities: ["Wi-Fi", "Kondisioner", "Mini bar"],
      isAvailable: true,
      createdBy: { ...ADMIN_USER, email: "admin@afhotel.az" },
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "room002",
      name: "Deluxe Suite 305",
      type: "deluxe",
      description: "Geniş suite, jakuzi və balkon",
      price: 220,
      capacity: 3,
      amenities: ["Wi-Fi", "Jakuzi", "Balkon", "Smart TV"],
      isAvailable: true,
      createdBy: { ...ADMIN_USER, email: "admin@afhotel.az" },
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "room003",
      name: "Ailə Koteci",
      type: "cottage",
      description: "Ailələr üçün 2 otaqlı kotec, hovuz yaxınlığında",
      price: 350,
      capacity: 6,
      amenities: ["Mətbəx", "Terras", "Parking", "Wi-Fi"],
      isAvailable: false,
      createdBy: { ...ADMIN_USER, email: "admin@afhotel.az" },
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  reviews: [
    {
      id: "rev001",
      userName: "Aynur Həsənova",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
      userEmail: "aynur@mail.az",
      comment: "Əla istirahət! Akvapark uşaqlar üçün mükəmməldir.",
      rating: 5,
      replyText: "Hörmətli Aynur xanım, rəyiniz üçün çox sağ olun!",
    },
    {
      id: "rev002",
      userName: "Дмитрий Соколов",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
      userEmail: "dmitry@mail.ru",
      comment: "Прекрасный отель у моря. Персонал очень внимательный.",
      rating: 5,
      replyText: null,
    },
    {
      id: "rev003",
      userName: "Sarah Johnson",
      userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
      userEmail: "sarah@gmail.com",
      comment: "Amazing beach resort! Will definitely return!",
      rating: 5,
      replyText: "Dear Sarah, thank you so much!",
    },
  ],
  bookings: [
    {
      id: "bk001",
      guest: "Rəşad Məmmədov",
      guestEmail: "rashad@mail.az",
      room: "101",
      roomType: "Standart",
      checkIn: "2026-06-20",
      checkOut: "2026-06-25",
      status: "Gözləyir",
      totalPrice: 600,
    },
    {
      id: "bk002",
      guest: "Leyla Quliyeva",
      guestEmail: "leyla@mail.az",
      room: "305",
      roomType: "Deluxe",
      checkIn: "2026-06-18",
      checkOut: "2026-06-22",
      status: "Təsdiqlənib",
      totalPrice: 880,
    },
    {
      id: "bk003",
      guest: "John Smith",
      guestEmail: "john@gmail.com",
      room: "Kotec 1",
      roomType: "Kotec",
      checkIn: "2026-07-01",
      checkOut: "2026-07-07",
      status: "Ləğv edilib",
      totalPrice: 2100,
    },
  ],
  messages: [
    {
      id: "msg001",
      name: "Elvin Həsənov",
      email: "elvin@mail.az",
      text: "Toy münasibəti ilə 50 nəfərlik zal bron etmək istəyirik.",
      time: "10:30",
      initials: "EH",
      unread: true,
    },
    {
      id: "msg002",
      name: "Maria Garcia",
      email: "maria@gmail.com",
      text: "Do you have airport transfer service?",
      time: "09:15",
      initials: "MG",
      unread: true,
    },
    {
      id: "msg003",
      name: "Kamran Əliyev",
      email: "kamran@mail.az",
      text: "Akvapark saatları haqqında məlumat verin.",
      time: "Dünən",
      initials: "KƏ",
      unread: false,
    },
  ],
};

function readStore(): MockStore {
  if (typeof window === "undefined") return structuredClone(defaultStore);
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
    return structuredClone(defaultStore);
  }
  return JSON.parse(raw) as MockStore;
}

function writeStore(store: MockStore) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

export const mockStore = {
  getRooms: () => readStore().rooms,
  getRoom: (id: string) => readStore().rooms.find((r) => r._id === id),
  createRoom: (data: Omit<Room, "_id" | "createdAt" | "updatedAt" | "createdBy">) => {
    const store = readStore();
    const room: Room = {
      ...data,
      _id: `room_${Date.now()}`,
      createdBy: { ...ADMIN_USER, email: "admin@afhotel.az" },
      createdAt: now(),
      updatedAt: now(),
    };
    store.rooms.push(room);
    writeStore(store);
    return room;
  },
  updateRoom: (id: string, data: Partial<Room>) => {
    const store = readStore();
    const idx = store.rooms.findIndex((r) => r._id === id);
    if (idx === -1) return null;
    store.rooms[idx] = { ...store.rooms[idx], ...data, updatedAt: now() };
    writeStore(store);
    return store.rooms[idx];
  },
  deleteRoom: (id: string) => {
    const store = readStore();
    store.rooms = store.rooms.filter((r) => r._id !== id);
    writeStore(store);
  },
  getReviews: () => readStore().reviews,
  replyReview: (id: string, replyText: string) => {
    const store = readStore();
    const review = store.reviews.find((r) => r.id === id);
    if (review) review.replyText = replyText;
    writeStore(store);
    return review;
  },
  getBookings: () => readStore().bookings,
  updateBookingStatus: (id: string, status: Booking["status"]) => {
    const store = readStore();
    const b = store.bookings.find((x) => x.id === id);
    if (b) b.status = status;
    writeStore(store);
    return b;
  },
  getMessages: () => readStore().messages,
  markMessageRead: (id: string) => {
    const store = readStore();
    const m = store.messages.find((x) => x.id === id);
    if (m) m.unread = false;
    writeStore(store);
  },
  getStats: () => {
    const store = readStore();
    const confirmed = store.bookings.filter((b) => b.status === "Təsdiqlənib");
    const totalRevenue = confirmed.reduce((s, b) => s + b.totalPrice, 0);
    const available = store.rooms.filter((r) => r.isAvailable).length;
    const occupied = store.rooms.length - available;
    return {
      totalRevenue,
      occupancyRate: store.rooms.length
        ? Math.round((occupied / store.rooms.length) * 100)
        : 0,
      roomStats: { bos: available, dolu: occupied, temizlenir: 1 },
      popularTypes: [
        { name: "Standart", count: 12 },
        { name: "Deluxe", count: 8 },
        { name: "Kotec", count: 4 },
      ],
      totalBookings: store.bookings.length,
      pendingBookings: store.bookings.filter((b) => b.status === "Gözləyir").length,
      totalMessages: store.messages.filter((m) => m.unread).length,
    };
  },
};

export const MOCK_ADMIN = {
  email: "admin@afhotel.az",
  password: "admin123",
  token: "mock-jwt-token-af-hotel-admin",
};