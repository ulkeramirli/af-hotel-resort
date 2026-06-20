export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface About {
  _id?: string;
  title: string;
  description: string;
  images: string[];
}

export interface RoomType {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  _id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdBy?: { _id: string; name: string; email: string };
  createdAt?: string;
  updatedAt?: string;
}

// Booking model fields match exactly what the Mongoose schema has:
// guestName, email, phone (NOT fullName/emailOrPhone)
export interface Booking {
  _id: string;
  room?: Room;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Review model: fullName, emailOrPhone, message, adminReply, status
export interface Review {
  _id: string;
  fullName: string;
  emailOrPhone: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  adminReply?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ticket {
  _id: string;
  name: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityCategory {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  _id?: string;
  hotelName: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  googleMapsLink: string;
  reception: string;
  aquapark: string;
  dining: string;
}

export interface DashboardStats {
  totalRooms: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  occupancyRate: number;
  totalRevenue: number;
  totalReviews: number;
  monthlyBookings: number;
  recentBookings?: Booking[];
  topRooms?: Array<{ name: string; type: string; price: number; count: number }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}