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
  Loader2,
} from "lucide-react";
import { getDashboardStats, updateBooking } from "@/services/api";
import type { DashboardStats, Booking } from "@/types/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("Hamısı");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const tick = () =>
      setCurrentTime(new Date().toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleBookingStatus = async (id: string, currentStatus: string) => {
    const statuses = ["pending", "confirmed", "cancelled"] as const;
    const next = statuses[(statuses.indexOf(currentStatus as any) + 1) % statuses.length];
    setStats((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        recentBookings: prev.recentBookings?.map((b) =>
          b._id === id ? { ...b, status: next } : b
        ),
      };
    });
    try {
      await updateBooking(id, { status: next });
      loadData();
    } catch (err: any) {
      loadData();
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Gözləyir";
      case "confirmed": return "Təsdiqlənib";
      case "cancelled": return "Ləğv edilib";
      default: return status;
    }
  };

  const statusMap: Record<string, string> = {
    "Gözləyir": "pending",
    "Təsdiqlənib": "confirmed",
    "Ləğv edilib": "cancelled",
  };

  const filteredBookings = (stats?.recentBookings || []).filter((b) => {
    const matchFilter = activeFilter === "Hamısı" || b.status === statusMap[activeFilter];
    const matchSearch =
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.room?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e325c]">Dashboard</h1>
        <p className="text-xs text-stone-400 mt-1">AF Hotel & Aqua Park — idarə paneli</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-stone-100 shadow-sm gap-4">
        <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
          <Clock className="w-4 h-4" style={{ color: "var(--color-hotel-blue)" }} />
          <span>Canlı: <strong className="text-[#1e325c]">{currentTime || "..."}</strong></span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Qonaq və ya otaq axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Təsdiqlənmiş bronlar", value: loading ? "..." : stats?.confirmedBookings ?? 0, sub: "Ümumi", up: true },
          { label: "Gözləyən bronlar", value: loading ? "..." : stats?.pendingBookings ?? 0, sub: "Təsdiq gözləyən", up: false, danger: (stats?.pendingBookings ?? 0) > 0 },
          { label: "Otaq Doluluğu", value: loading ? "..." : `${stats?.occupancyRate ?? 0}%`, sub: `${stats?.totalRooms ?? 0} otaqdan`, up: true },
          { label: "Dövriyyə", value: loading ? "..." : `${stats?.totalRevenue ?? 0} AZN`, sub: "Təsdiqlənmişlər", up: true },
        ].map((card) => (
          <div key={card.label} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
            <p className="text-xs font-semibold text-stone-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.danger ? "text-rose-600" : "text-[#1e325c]"}`}>{card.value}</p>
            <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${card.up ? "text-emerald-600" : "text-stone-500"}`}>
              {card.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="font-bold text-[#1e325c]">Son bronlar</h3>
              <div className="flex gap-1.5 bg-stone-50 p-1 rounded-xl overflow-x-auto whitespace-nowrap">
                {["Hamısı", "Gözləyir", "Təsdiqlənib", "Ləğv edilib"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeFilter === tab ? "text-white" : "text-stone-500"}`}
                    style={activeFilter === tab ? { background: "var(--color-hotel-blue)" } : undefined}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-rose-500">
                <ShieldAlert className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-stone-100 text-xs text-stone-400 uppercase">
                      <th className="pb-3">Qonaq</th>
                      <th className="pb-3">Otaq</th>
                      <th className="pb-3">Tarix</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-stone-50/50">
                          <td className="py-3 flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            {b.guestName}
                          </td>
                          <td className="py-3 text-stone-500">{b.room?.name || "Bilinmir"}</td>
                          <td className="py-3 text-stone-500 text-xs">
                            {new Date(b.checkIn).toLocaleDateString("az-AZ")} → {new Date(b.checkOut).toLocaleDateString("az-AZ")}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => toggleBookingStatus(b._id, b.status)}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                                b.status === "confirmed" ? "bg-emerald-50 text-emerald-600" :
                                b.status === "pending" ? "bg-amber-50 text-amber-600" :
                                "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {getStatusLabel(b.status)}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-stone-400 text-sm">Bron tapılmadı</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1e325c] mb-4">Ən Populyar Otaqlar</h3>
            <div className="space-y-3">
              {stats?.topRooms && stats.topRooms.length > 0 ? (
                stats.topRooms.map((r, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <div>
                      <h4 className="font-bold text-xs text-[#1e325c]">{r.name}</h4>
                      <p className="text-[10px] text-stone-400">{r.type}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {r.count} bron
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 text-center py-4">Kifayət qədər məlumat yoxdur</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1e325c]">Statistika Xülasəsi</h3>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-stone-50 pb-2">
                <span className="text-sm text-stone-500">Ümumi Rəylər</span>
                <span className="font-bold text-[#1e325c]">{stats?.totalReviews ?? 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-50 pb-2">
                <span className="text-sm text-stone-500">Bu Ay Bronlar</span>
                <span className="font-bold text-[#1e325c]">{stats?.monthlyBookings ?? 0}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-stone-500">Ləğv Edilmişlər</span>
                <span className="font-bold text-[#1e325c]">{stats?.cancelledBookings ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}