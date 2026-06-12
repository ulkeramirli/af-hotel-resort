"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Sparkles,
  Search,
  User,
  ShieldAlert,
  Loader2
} from "lucide-react";

interface Booking {
  id: number;
  guest: string;
  room: string;
  date: string;
  status: string;
}

interface Room {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface Message {
  id: number;
  name: string;
  text: string;
  time: string;
  initials: string;
  unread: boolean;
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState("Hamısı");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Загрузка данных из БД
  useEffect(() => {
    let isMounted = true;
    const token = "af-hotel-super-secret-token";

    const loadDashboardData = async () => {
      try {
        const res = await fetch("/api/bookings", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error("Məlumatlar bazadan gəlmədi.");
        const data = await res.json();
        
        if (isMounted) {
          setBookings(data.bookings || []);
          setRooms(data.rooms || []);
          setMessages(data.messages || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Xəta");
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Изменение статуса бронирования
  const toggleBookingStatus = async (id: number, currentStatus: string) => {
    const statuses = ["Gözləyir", "Təsdiqlənib", "Ləğv edilib"];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const newStatus = statuses[nextIndex];

    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

    try {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "BOOKING", id, newStatus })
      });
    } catch (err) {
      console.error("Бронь не обновилась в БД:", err);
    }
  };

  // Изменение статуса комнаты
  const toggleRoomStatus = async (id: number, currentStatus: string) => {
    const statuses = ["Boş", "Dolu", "Təmizlənir"];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const newStatus = statuses[nextIndex];

    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

    try {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ROOM", id, newStatus })
      });
    } catch (err) {
      console.error("Статус комнаты не обновился в БД:", err);
    }
  };

  // Отметка сообщения прочитанным
  const readMessage = async (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));

    try {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "MESSAGE", id })
      });
    } catch (err) {
      console.error("Сообщение не прочитано в БД:", err);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = activeFilter === "Hamısı" || b.status === activeFilter;
    const matchesSearch = b.guest.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ВЕРХНЯЯ ПАНЕЛЬ АХТАРЫШ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Clock className="w-4 h-4 text-[#00b4d8]" />
          <span>Canlı rejim: <span className="font-bold text-gray-800">{currentTime || "Yüklənir..."}</span></span>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Qonaq və ya otaq axtar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00b4d8] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ДИНАМИЧЕСКАЯ СТАТИСТИКА */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-1">Bu ay bronlar</p>
          <p className="text-3xl font-bold text-gray-800">
            {loading ? "..." : bookings.filter(b => b.status === "Təsdiqlənib").length}
          </p>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Sistemdəki aktiv təsdiqlənmişlər</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-1">Boş otaqlar</p>
          <p className="text-3xl font-bold text-gray-800">
            {loading ? "..." : rooms.filter(r => r.status === "Boş").length}
          </p>
          <div className="flex items-center gap-1 text-gray-500 text-xs font-medium mt-2">
            <span>↘ {rooms.length} otaqdan hazırda boşdur</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-1">Ümumi dövriyyə</p>
          <p className="text-3xl font-bold text-gray-800">
            {loading ? "..." : bookings.filter(b => b.status === "Təsdiqlənib").length * 140} AZN
          </p>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Ortalama 140 AZN-dən hesablanıb</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-1">Oxunmamış mesajlar</p>
          <p className="text-3xl font-bold text-rose-600">
            {loading ? "..." : messages.filter(m => m.unread).length}
          </p>
          <div className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-2">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Cavab gözləyən müraciətlər</span>
          </div>
        </div>
      </div>

      {/* ОСНОВНОЙ БЛОК */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* ТАБЛИЦА БРОНЕЙ */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-base text-gray-800">Son bronlar</h3>
                <p className="text-xs text-gray-400 mt-0.5">Məlumatlar PostgreSQL bazasından gəlir</p>
              </div>
              
              <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl self-start">
                {["Hamısı", "Gözləyir", "Təsdiqlənib", "Ləğv edilib"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeFilter === tab ? "bg-[#00b4d8] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" />
                <p className="text-xs font-medium">Bulut bazası ilə əlaqə yaradılır...</p>
              </div>
            ) : error ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-rose-500 bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                <ShieldAlert className="w-8 h-8" />
                <p className="text-sm font-bold">Təhlükəsizlik xətası!</p>
                <p className="text-xs text-rose-400 text-center font-medium">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 font-medium">Qonaq</th>
                      <th className="pb-3 font-medium">Otaq</th>
                      <th className="pb-3 font-medium">Tarix</th>
                      <th className="pb-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-50">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-3.5 flex items-center gap-2">
                            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-[#e0f7fa] group-hover:text-[#00b4d8] transition-colors">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span>{b.guest}</span>
                          </td>
                          <td className="py-3.5 text-gray-500">{b.room}</td>
                          <td className="py-3.5 text-gray-500">{b.date}</td>
                          <td className="py-3.5 text-right">
                            <button 
                              onClick={() => toggleBookingStatus(b.id, b.status)}
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer select-none transition-all active:scale-95 ${
                                b.status === "Təsdiqlənib" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" :
                                b.status === "Gözləyir" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" :
                                "bg-rose-50 text-rose-600 hover:bg-rose-100"
                              }`}
                            >
                              {b.status}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-sm text-gray-400 font-medium">
                          Heç bir bron tapılmadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* МЕССЕДЖИ */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-gray-800">Son mesajlar</h3>
              {messages.some(m => m.unread) && (
                <span className="bg-[#ff9f43] text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">Yeni mesaj</span>
              )}
            </div>
            <div className="space-y-3">
              {loading ? (
                <p className="text-xs text-gray-400 text-center py-4">Mesajlar yüklənir...</p>
              ) : messages.length > 0 ? (
                messages.map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => m.unread && readMessage(m.id)}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      m.unread ? "bg-blue-50/60 border border-blue-100/50 shadow-sm" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        m.unread ? "bg-[#00b4d8] text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {m.initials || "M"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-800">{m.name}</h4>
                          {m.unread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                        </div>
                        <p className={`text-xs mt-0.5 line-clamp-1 ${m.unread ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                          {m.text}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400 shrink-0">{m.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Mesaj tapılmadı.</p>
              )}
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (ОТАГЛАР) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-base text-gray-800 mb-4">Otaqların vəziyyəti</h3>
            <div className="grid grid-cols-2 gap-3">
              {loading ? (
                <p className="text-xs text-gray-400 text-center col-span-2 py-6">Otaqlar yüklənir...</p>
              ) : rooms.length > 0 ? (
                rooms.map((r) => (
                  <div 
                    key={r.id}
                    onClick={() => toggleRoomStatus(r.id, r.status)}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-white cursor-pointer select-none transition-all active:scale-95 group"
                  >
                    <h4 className="font-bold text-sm text-gray-800 group-hover:text-[#00b4d8] transition-colors">{r.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-tight">{r.type}</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      <span className={`w-2 h-2 rounded-full ${
                        r.status === "Boş" ? "bg-emerald-500" : r.status === "Dolu" ? "bg-rose-500" : "bg-blue-500"
                      }`}></span>
                      <span className="text-xs font-semibold text-gray-700">{r.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center col-span-2 py-6">Otaq tapılmadı.</p>
              )}
            </div>
          </div>

          {/* ГРАФИК ХЕФТЕЛИНГ БРОНЛАР */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base text-gray-800">Həftəlik bronlar</h3>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                <Sparkles className="w-3 h-3" />
                <span>Uğurlu həftə</span>
              </div>
            </div>
            <div className="flex items-end justify-between h-28 pt-2 px-2">
              <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-7 bg-[#00b4d8]/30 group-hover:bg-[#00b4d8] h-12 rounded-md transition-all"></div>
                <span className="text-[11px] font-semibold text-gray-400">B.e</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-7 bg-[#00b4d8]/30 group-hover:bg-[#00b4d8] h-20 rounded-md transition-all"></div>
                <span className="text-[11px] font-semibold text-gray-400">Ç.a</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-7 bg-[#00b4d8]/30 group-hover:bg-[#00b4d8] h-10 rounded-md transition-all"></div>
                <span className="text-[11px] font-semibold text-gray-400">Ç.</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-7 bg-[#00b4d8]/30 group-hover:bg-[#00b4d8] h-24 rounded-md transition-all"></div>
                <span className="text-[11px] font-semibold text-gray-400">C.a</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-7 bg-[#00b4d8] h-16 rounded-md transition-all"></div>
                <span className="text-[11px] font-semibold text-gray-800">C.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}