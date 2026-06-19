export type RoomType = "standard" | "deluxe" | "cottage";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Room {
  _id: string;
  name: string;
  type: RoomType;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userName: string;
  userImage: string;
  userEmail: string;
  comment: string;
  rating: number;
  replyText: string | null;
}

export interface Booking {
  id: string;
  guest: string;
  guestEmail: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: "Gözləyir" | "Təsdiqlənib" | "Ləğv edilib";
  totalPrice: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  text: string;
  time: string;
  initials: string;
  unread: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}