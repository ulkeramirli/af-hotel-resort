"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBookings } from "@/services/api";
import { getFavorites } from "@/lib/favorites";
import type { Booking } from "@/types/api";
import {
  User,
  BookOpen,
  Heart,
  LogOut,
  Calendar,
  Mail,
  Shield,
  Loader2,
  BedDouble,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
} from "lucide-react";

type LangType = "az" | "en" | "ru";

const t = {
  az: {
    welcome: "Xoş gəldiniz",
    profile: "Profil",
    bookings: "Bronlarım",
    favorites: "Sevimlilər",
    logout: "Çıxış",
    name: "Ad Soyad",
    email: "Email",
    role: "Rol",
    user: "İstifadəçi",
    admin: "Admin",
    noBookings: "Hələ bron etməmisiniz.",
    noFavorites: "Sevimli otaq yoxdur.",
    bookNow: "Otaqları gör",
    checkIn: "Giriş",
    checkOut: "Çıxış",
    status: "Status",
    room: "Otaq",
    pending: "Gözləyir",
    confirmed: "Təsdiqləndi",
    cancelled: "Ləğv edildi",
    loadingBookings: "Bronlar yüklənir...",
    loginRequired: "Hesaba daxil olun",
    loginDesc: "Bu səhifəni görmək üçün daxil olun.",
    signIn: "Daxil ol",
    guest: "Qonaq",
    totalBookings: "Ümumi bron",
    activeBookings: "Aktiv bron",
    favoriteRooms: "Sevimli otaq",
    memberSince: "Üzv olub",
  },
  ru: {
    welcome: "Добро пожаловать",
    profile: "Профиль",
    bookings: "Мои брони",
    favorites: "Избранное",
    logout: "Выйти",
    name: "Имя Фамилия",
    email: "Email",
    role: "Роль",
    user: "Пользователь",
    admin: "Администратор",
    noBookings: "У вас пока нет бронирований.",
    noFavorites: "Нет избранных номеров.",
    bookNow: "Посмотреть номера",
    checkIn: "Заезд",
    checkOut: "Выезд",
    status: "Статус",
    room: "Номер",
    pending: "Ожидает",
    confirmed: "Подтверждено",
    cancelled: "Отменено",
    loadingBookings: "Загрузка броней...",
    loginRequired: "Войдите в аккаунт",
    loginDesc: "Войдите, чтобы просмотреть эту страницу.",
    signIn: "Войти",
    guest: "Гость",
    totalBookings: "Всего броней",
    activeBookings: "Активных броней",
    favoriteRooms: "Избранных номеров",
    memberSince: "Участник с",
  },
  en: {
    welcome: "Welcome",
    profile: "Profile",
    bookings: "My Bookings",
    favorites: "Favorites",
    logout: "Sign Out",
    name: "Full Name",
    email: "Email",
    role: "Role",
    user: "User",
    admin: "Admin",
    noBookings: "You have no bookings yet.",
    noFavorites: "No favorite rooms yet.",
    bookNow: "Browse Rooms",
    checkIn: "Check-In",
    checkOut: "Check-Out",
    status: "Status",
    room: "Room",
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    loadingBookings: "Loading bookings...",
    loginRequired: "Sign in to your account",
    loginDesc: "Please sign in to view this page.",
    signIn: "Sign In",
    guest: "Guest",
    totalBookings: "Total Bookings",
    activeBookings: "Active Bookings",
    favoriteRooms: "Favorite Rooms",
    memberSince: "Member since",
  },
};

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function StatusBadge({ status, tx }: { status: string; tx: typeof t.az }) {
  const map: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-3 h-3" />,
      label: tx.pending,
    },
    confirmed: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="w-3 h-3" />,
      label: tx.confirmed,
    },
    cancelled: {
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircle className="w-3 h-3" />,
      label: tx.cancelled,
    },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${s.color}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

type Tab = "profile" | "bookings" | "favorites";

function AccountContent() {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const l = (language as LangType) || "az";
  const tx = t[l];

  const initialTab = (searchParams.get("tab") as Tab) || "profile";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const p = searchParams.get("tab") as Tab;
    if (p && ["profile", "bookings", "favorites"].includes(p)) setTab(p);
  }, [searchParams]);

  useEffect(() => {
    if (tab === "bookings" && user) {
      setLoadingBookings(true);
      getBookings()
        .then((data) => setBookings(data))
        .catch(() => setBookings([]))
        .finally(() => setLoadingBookings(false));
    }
  }, [tab, user]);

  useEffect(() => {
    setFavorites(getFavorites());
    const onUpdate = () => setFavorites(getFavorites());
    window.addEventListener("favoritesUpdated", onUpdate);
    return () => window.removeEventListener("favoritesUpdated", onUpdate);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center space-y-5">
          <div className="w-16 h-16 bg-[#00b5d5]/10 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-[#00b5d5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">{tx.loginRequired}</h2>
            <p className="text-sm text-stone-500 mt-2">{tx.loginDesc}</p>
          </div>
          <button
            onClick={() => router.push("/auth/sign-in")}
            className="w-full py-3 text-white font-bold rounded-xl hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
          >
            {tx.signIn}
          </button>
        </div>
      </div>
    );
  }

  const activeCount = bookings.filter((b) => b.status === "confirmed").length;
  const memberDate = new Date().toLocaleDateString("az-AZ", { month: "long", year: "numeric" });

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: tx.profile, icon: <User className="w-4 h-4" /> },
    { key: "bookings", label: tx.bookings, icon: <BookOpen className="w-4 h-4" /> },
    { key: "favorites", label: tx.favorites, icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-4">
            {/* User card */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="h-16 w-full" style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }} />
              <div className="px-6 pb-6 -mt-8">
                <div className="w-16 h-16 rounded-xl bg-white border-2 border-white shadow-md flex items-center justify-center text-[#00406a] font-bold text-2xl mb-3">
                  {user.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <p className="font-bold text-stone-900 text-base">{user.name}</p>
                <p className="text-xs text-stone-400 mt-0.5 break-all">{user.email}</p>
                <span className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${user.role === "admin" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                  <Shield className="w-3 h-3" />
                  {user.role === "admin" ? tx.admin : tx.user}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 grid grid-cols-3 gap-3 text-center">
              {[
                { label: tx.totalBookings, value: bookings.length || "—" },
                { label: tx.activeBookings, value: activeCount || "—" },
                { label: tx.favoriteRooms, value: favorites.length || "—" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-[#00406a]">{s.value}</div>
                  <div className="text-[9px] text-stone-400 font-medium uppercase tracking-wide mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Nav tabs */}
            <nav className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              {tabs.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all text-left border-none cursor-pointer
                    ${tab === key
                      ? "bg-[#00b5d5]/5 text-[#00406a] border-l-2 border-l-[#00b5d5]"
                      : "text-stone-600 hover:bg-stone-50 border-l-2 border-l-transparent"
                    }`}
                >
                  <span className={tab === key ? "text-[#00b5d5]" : "text-stone-400"}>{icon}</span>
                  {label}
                  {key === "favorites" && favorites.length > 0 && (
                    <span className="ml-auto text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-bold">{favorites.length}</span>
                  )}
                  {key === "bookings" && bookings.length > 0 && (
                    <span className="ml-auto text-[10px] bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded-full font-bold">{bookings.length}</span>
                  )}
                  <ChevronRight className={`w-4 h-4 ml-auto text-stone-300 ${tab === key ? "text-[#00b5d5]" : ""}`} />
                </button>
              ))}
              <div className="border-t border-stone-100">
                <button
                  onClick={() => { signOut(); router.push("/"); }}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all text-left border-none bg-transparent cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  {tx.logout}
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8 space-y-6">
                <h2 className="text-lg font-bold text-stone-900">{tx.profile}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: tx.name, value: user.name, icon: <User className="w-4 h-4 text-stone-300" /> },
                    { label: tx.email, value: user.email, icon: <Mail className="w-4 h-4 text-stone-300" /> },
                    { label: tx.role, value: user.role === "admin" ? tx.admin : tx.user, icon: <Shield className="w-4 h-4 text-stone-300" /> },
                    { label: tx.memberSince, value: memberDate, icon: <Calendar className="w-4 h-4 text-stone-300" /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="mt-0.5">{icon}</div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-semibold text-stone-800 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-400">
                    {tx.memberSince}: <span className="font-semibold text-stone-600">{memberDate}</span>
                  </p>
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {tab === "bookings" && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8 space-y-5">
                <h2 className="text-lg font-bold text-stone-900">{tx.bookings}</h2>

                {loadingBookings ? (
                  <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">{tx.loadingBookings}</span>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center">
                      <BedDouble className="w-7 h-7 text-stone-300" />
                    </div>
                    <p className="text-sm text-stone-400">{tx.noBookings}</p>
                    <button
                      onClick={() => router.push("/#rooms")}
                      className="text-sm font-bold text-[#00b5d5] hover:underline"
                    >
                      {tx.bookNow}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <div key={b._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-stone-200 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#00b5d5]/10 rounded-xl flex items-center justify-center shrink-0">
                            <BedDouble className="w-5 h-5 text-[#00b5d5]" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-800 text-sm">
                              {typeof b.room === "object" && b.room !== null ? (b.room as any).name : tx.room}
                            </p>
                            <p className="text-xs text-stone-400 mt-0.5">
                              {b.guestName} · {b.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1.5">
                          <StatusBadge status={b.status} tx={tx} />
                          <p className="text-xs text-stone-400">
                            {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAVORITES TAB */}
            {tab === "favorites" && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8 space-y-5">
                <h2 className="text-lg font-bold text-stone-900">{tx.favorites}</h2>

                {favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-7 h-7 text-stone-300" />
                    </div>
                    <p className="text-sm text-stone-400">{tx.noFavorites}</p>
                    <button
                      onClick={() => router.push("/#rooms")}
                      className="text-sm font-bold text-[#00b5d5] hover:underline"
                    >
                      {tx.bookNow}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((id) => (
                      <div key={id} className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100 hover:border-rose-200 transition-all group">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-stone-700 text-sm truncate">Room #{id.slice(-6).toUpperCase()}</p>
                          <p className="text-[11px] text-stone-400">ID: {id}</p>
                        </div>
                        <a
                          href={`/rooms/${id}`}
                          className="text-xs font-bold text-[#00b5d5] hover:underline shrink-0"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b5d5]" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}