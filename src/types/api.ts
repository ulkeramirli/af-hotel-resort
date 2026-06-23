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
  beds?: number;
  baths?: number;
  sqft?: number;
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

export interface ActivityStat {
  value: string;
  label: string;
  sub: string;
}

export interface ActivitySettings {
  tag: string;
  title: string;
  subtitle: string;
  stats: ActivityStat[];
}

export interface ActivityCategory {
  _id: string;
  name: string;
  description?: string;
  emoji?: string;
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

export interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface MenuCategory {
  _id?: string;
  name: string;
  items: MenuItem[];
}

export interface RestaurantWorkingHours {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  image: string;
  description: string;
  workingHours: RestaurantWorkingHours;
  phone: string;
  menu: MenuCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantSettings {
  tag: string;
  title: string;
  subtitle: string;
}

export interface WonderlandGame {
  _id?: string;
  name: string;
  image: string;
  description: string;
}

export interface WonderlandBigAttraction {
  _id?: string;
  title: string;
  games: WonderlandGame[];
}

export interface WonderlandSmallAttraction {
  _id?: string;
  name: string;
  description: string;
  icon?: string;
}

export interface WonderlandTicket {
  _id?: string;
  name: string;
  price: string;
}

export interface Wonderland {
  _id?: string;
  title: string;
  tag: string;
  workingHours: string;
  description: string;
  discount: {
    enabled: boolean;
    percentage: number;
  };
  tickets: WonderlandTicket[];
  smallAttractions: WonderlandSmallAttraction[];
  bigAttractions: WonderlandBigAttraction[];
  createdAt?: string;
  updatedAt?: string;
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