"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, User, Loader2, AlertCircle } from "lucide-react";

interface Booking {
  id: number;
  guest: string;
  room: string;
  roomType: string;
  date: string;
  status: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Hamısı");
  const token = "af-hotel-super-secret-token";

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/admin/bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Məlumatlar bazasından cavab alınmadı");
        const data = await res.json();
        
        if (isMounted) {
          setBookings(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Bilinməyən xəta");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Переключение статуса бронирования по клику
  const handleToggleStatus = async (id: number, currentStatus: string) => {
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
      console.error("Status yenilənmədi:", err);
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
      {/* ЗАГОЛОВОК И ФИЛЬТРЫ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Rezervasiyaların idarə edilməsi</h2>
          <p className="text-xs text-gray-400 mt-1">Otelə gələn bütün bron müraciətlərinin siyahısı və statusları</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Qonaq adı və ya otaq axtar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00b4d8] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ТАБЫ ФИЛЬТРАЦИИ */}
      <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl self-start w-max">
        {["Hamısı", "Gözləyir", "Təsdiqlənib", "Ləğv edilib"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === tab ? "bg-[#00b4d8] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ТАБЛИЦА С БРОНЯМИ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" />
            <p className="text-xs font-medium">Rezervasiyalar bazadan yüklənir...</p>
          </div>
        ) : error ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-rose-500 bg-rose-50/50 rounded-xl p-4 border border-rose-100">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm font-bold">Xəta baş verdi</p>
            <p className="text-xs text-rose-400 text-center font-medium">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Qonaq</th>
                  <th className="pb-3 font-medium">Otaq nömrəsi</th>
                  <th className="pb-3 font-medium">Otaq Tipi</th>
                  <th className="pb-3 font-medium">Tarix aralığı</th>
                  <th className="pb-3 font-medium text-right">Status (Dəyişmək üçün kliklə)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-50">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-[#e0f7fa] group-hover:text-[#00b4d8] transition-colors">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-gray-800">{b.guest}</span>
                      </td>
                      <td className="py-4 text-gray-600">{b.room}</td>
                      <td className="py-4 text-xs font-semibold text-gray-400">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">{b.roomType}</span>
                      </td>
                      <td className="py-4 text-gray-500 text-xs flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{b.date}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleToggleStatus(b.id, b.status)}
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer select-none transition-all active:scale-95 ${
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
                    <td colSpan={5} className="py-12 text-center text-sm text-gray-400 font-medium">
                      Axtarışa uyğun rezervasiya tapılmadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}