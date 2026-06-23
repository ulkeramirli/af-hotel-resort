"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBookings, updateProfile, getPublicRooms } from "@/services/api";
import type { PublicRoom } from "@/services/api";
import { getFavorites, syncFavorites } from "@/lib/favorites";
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
  Edit2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Users,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    editProfile: "Profili Redaktə Et",
    save: "Yadda saxla",
    cancel: "Ləğv et",
    updating: "Yenilənir...",
    updateSuccess: "Profil uğurla yeniləndi!",
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
    editProfile: "Редактировать профиль",
    save: "Сохранить",
    cancel: "Отмена",
    updating: "Обновление...",
    updateSuccess: "Профиль успешно обновлен!",
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
    editProfile: "Edit Profile",
    save: "Save",
    cancel: "Cancel",
    updating: "Updating...",
    updateSuccess: "Profile updated successfully!",
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
  const [roomsMap, setRoomsMap] = useState<Record<string, PublicRoom>>({});
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const [showMobileMenu, setShowMobileMenu] = useState(true);

  useEffect(() => {
    const p = searchParams.get("tab") as Tab;
    if (p && ["profile", "bookings", "favorites"].includes(p)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab(p);
      setShowMobileMenu(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    // Load bookings immediately so count shows correctly in sidebar
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingBookings(true);
    getBookings()
      .then((data) => setBookings(data))
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false));
    
    if (!editName && !editEmail) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load favorites from localStorage on mount and listen for updates
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(getFavorites());
    const onUpdate = () => setFavorites(getFavorites());
    window.addEventListener("favoritesUpdated", onUpdate);
    return () => window.removeEventListener("favoritesUpdated", onUpdate);
  }, []);

  // Load rooms map always (needed for count + favorites tab)
  useEffect(() => {
    getPublicRooms().then(rooms => {
      const map: Record<string, PublicRoom> = {};
      const allIds: string[] = [];
      rooms.forEach(r => { 
        map[r.id] = r; 
        allIds.push(r.id);
      });
      setRoomsMap(map);
      syncFavorites(allIds);
      setFavorites(getFavorites());
    }).catch(() => {});
  }, []);

  if (!user && tab !== "favorites") {
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
  const validFavoritesCount = Object.keys(roomsMap).length > 0
    ? favorites.filter(id => !!roomsMap[id]).length
    : favorites.length; // fallback while loading

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    ...(user ? [
      { key: "profile" as Tab, label: tx.profile, icon: <User className="w-4 h-4" /> },
      { key: "bookings" as Tab, label: tx.bookings, icon: <BookOpen className="w-4 h-4" /> },
    ] : []),
    { key: "favorites" as Tab, label: tx.favorites, icon: <Heart className="w-4 h-4" /> },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    const res = await updateProfile(editName, editEmail);
    if (res.success) {
      setEditSuccess(tx.updateSuccess);
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setEditError(res.message || "Error");
    }
    setEditLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-72 shrink-0 space-y-4 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
            {/* Back button - mobile: go to menu, desktop: go to home */}
            <button 
              onClick={() => router.push("/")} 
              className="flex items-center gap-2 text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full font-medium text-sm transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>

            {/* User card */}
            {user && (
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
            )}

            {/* Stats */}
            {user && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: tx.totalBookings, value: bookings.length || "—" },
                  { label: tx.activeBookings, value: activeCount || "—" },
                  { label: tx.favoriteRooms, value: validFavoritesCount || "—" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-xl font-bold text-[#00406a]">{s.value}</div>
                    <div className="text-[9px] text-stone-400 font-medium uppercase tracking-wide mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Nav tabs */}
            <nav className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              {tabs.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => { setTab(key); setShowMobileMenu(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all text-left border-none cursor-pointer
                    ${tab === key
                      ? "bg-[#00b5d5]/5 text-[#00406a] border-l-2 border-l-[#00b5d5]"
                      : "text-stone-600 hover:bg-stone-50 border-l-2 border-l-transparent"
                    }`}
                >
                  <span className={tab === key ? "text-[#00b5d5]" : "text-stone-400"}>{icon}</span>
                  {label}
                  {key === "favorites" && validFavoritesCount > 0 && (
                    <span className="ml-auto text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-bold">{validFavoritesCount}</span>
                  )}
                  {key === "bookings" && bookings.length > 0 && (
                    <span className="ml-auto text-[10px] bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded-full font-bold">{bookings.length}</span>
                  )}
                  <ChevronRight className={`w-4 h-4 ml-auto text-stone-300 ${tab === key ? "text-[#00b5d5]" : ""}`} />
                </button>
              ))}
              {user && (
                <div className="border-t border-stone-100">
                  <button
                    onClick={() => { signOut(); router.push("/"); }}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all text-left border-none bg-transparent cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    {tx.logout}
                  </button>
                </div>
              )}
            </nav>
          </aside>

          {/* Main Content */}
          <main className={`flex-1 min-w-0 ${!showMobileMenu ? 'block' : 'hidden lg:block'}`}>
            <AnimatePresence mode="wait">
            {/* PROFILE TAB */}
            {tab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8 space-y-6">
                
                <button 
                  onClick={() => setShowMobileMenu(true)} 
                  className="lg:hidden flex items-center gap-2 text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full font-medium text-sm transition-colors mb-4 w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
                
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-stone-900">{tx.profile}</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#00b5d5] bg-[#00b5d5]/10 rounded-lg hover:bg-[#00b5d5]/20 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      {tx.editProfile}
                    </button>
                  )}
                </div>

                {editError && (
                  <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-700 font-medium">{editError}</p>
                  </div>
                )}
                {editSuccess && (
                  <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-700 font-medium">{editSuccess}</p>
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{tx.name}</label>
                        <input
                          type="text" required value={editName} onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{tx.email}</label>
                        <input
                          type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit" disabled={editLoading}
                        className="px-6 py-2 bg-[#00b5d5] text-white font-bold rounded-xl hover:bg-[#0092ac] transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {tx.save}
                      </button>
                      <button
                        type="button" onClick={() => { setIsEditing(false); setEditName(user?.name || ""); setEditEmail(user?.email || ""); }}
                        className="px-6 py-2 bg-stone-100 text-stone-600 font-bold rounded-xl hover:bg-stone-200 transition-colors"
                      >
                        {tx.cancel}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { label: tx.name, value: user?.name, icon: <User className="w-4 h-4 text-[#00b5d5]" /> },
                        { label: tx.email, value: user?.email, icon: <Mail className="w-4 h-4 text-[#00b5d5]" /> },
                        { label: tx.role, value: user?.role === "admin" ? tx.admin : tx.user, icon: <Shield className="w-4 h-4 text-[#00b5d5]" /> },
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
                  </>
                )}
              </motion.div>
            )}

            {/* BOOKINGS TAB */}
            {tab === "bookings" && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8 space-y-5">
                <button 
                  onClick={() => setShowMobileMenu(true)} 
                  className="lg:hidden flex items-center gap-2 text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full font-medium text-sm transition-colors mb-4 w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
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
              </motion.div>
            )}

            {/* FAVORITES TAB */}
            {tab === "favorites" && (
              <motion.div key="favorites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8 space-y-5">
                <button 
                  onClick={() => setShowMobileMenu(true)} 
                  className="lg:hidden flex items-center gap-2 text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full font-medium text-sm transition-colors mb-4 w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
                <h2 className="text-lg font-bold text-stone-900">{tx.favorites}</h2>

                {(validFavoritesCount === 0 && Object.keys(roomsMap).length > 0) ? (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {favorites
                      .filter(id => !!roomsMap[id])
                      .map((id) => {
                        const room = roomsMap[id];
                        return (
                          <div key={id} className="group bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                            {/* Image */}
                            <div className="relative aspect-[16/11] overflow-hidden bg-stone-100 border-b border-stone-100">
                              {room.images?.[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={room.images[0]}
                                  alt={room.title[l]}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                                  <BedDouble className="w-8 h-8 text-stone-300" />
                                </div>
                              )}
                              <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-stone-800 rounded-md shadow-sm border border-stone-100 z-10">
                                {room.category}
                              </span>
                              <button
                                onClick={() => {
                                  const newFavs = getFavorites().filter(fid => fid !== id);
                                  localStorage.setItem("af_favorites", JSON.stringify(newFavs));
                                  window.dispatchEvent(new Event("favoritesUpdated"));
                                }}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer z-20"
                                title="Remove from favorites"
                              >
                                <Heart className="w-4 h-4" style={{ fill: "#e11d48", color: "#e11d48" }} />
                              </button>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 space-y-3 flex flex-col flex-1 justify-between">
                              <div className="space-y-1.5">
                                <h3 className="font-bold text-stone-900 text-base tracking-tight group-hover:text-stone-700 transition-colors">
                                  {room.title[l]}
                                </h3>
                                <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
                                  {room.desc[l]}
                                </p>
                                <div className="flex items-center gap-4 text-[11px] font-medium text-stone-400 pt-1">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-stone-300" />
                                    {room.capacity[l]}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Maximize2 className="w-3.5 h-3.5 text-stone-300" />
                                    {room.size || "350 sqft"}
                                  </span>
                                </div>
                              </div>

                              {/* Bottom: price + buttons */}
                              <div className="flex flex-col gap-2 pt-3 border-t border-stone-100 mt-auto">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-lg font-bold text-stone-900">${room.price}</span>
                                    <span className="text-[11px] text-stone-400 font-light ml-1">
                                      / {l === "az" ? "gecə" : l === "ru" ? "ночь" : "night"}
                                    </span>
                                  </div>
                                  <a
                                    href={`/rooms/${room.id}`}
                                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#00b5d5] hover:bg-[#06a1bc] text-white text-xs font-semibold rounded-xl transition-colors"
                                  >
                                    <span>{l === "az" ? "Ətraflı" : l === "ru" ? "Подробнее" : "Details"}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                                <button
                                  onClick={() => router.push(`/?roomId=${room.id}#booking`)}
                                  className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                                  style={{ background: "linear-gradient(135deg, #ff8c00, #ff5f00)" }}
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{l === "az" ? "İndi Rezerv Et" : l === "ru" ? "Забронировать" : "Book Now"}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </motion.div>
            )}
            </AnimatePresence>
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