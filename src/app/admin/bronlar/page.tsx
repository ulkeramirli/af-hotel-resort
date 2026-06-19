"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, User, Loader2, AlertCircle } from "lucide-react";
import { getBookings, updateBookingStatus } from "@/services/api";
import type { Booking } from "@/types/api";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Hamısı");

  useEffect(() => {
    let cancelled = false;
    getBookings()
      .then((data) => { if (!cancelled) setBookings(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Xəta"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const statuses = ["Gözləyir", "Təsdiqlənib", "Ləğv edilib"] as const;
    const next = statuses[(statuses.indexOf(currentStatus as typeof statuses[number]) + 1) % statuses.length];
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: next } : b)));
    await updateBookingStatus(id, next);
  };

  const filtered = bookings.filter((b) => {
    const matchFilter = activeFilter === "Hamısı" || b.status === activeFilter;
    const matchSearch =
      b.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Rezervasiyalar</h2>
        <p className="text-xs text-stone-400 mt-1">Bütün bron müraciətləri</p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Axtar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
        />
      </div>

      <div className="flex gap-1.5 bg-stone-100 p-1 rounded-xl w-max">
        {["Hamısı", "Gözləyir", "Təsdiqlənib", "Ləğv edilib"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg ${
              activeFilter === tab ? "text-white" : "text-stone-500"
            }`}
            style={activeFilter === tab ? { background: "var(--color-hotel-blue)" } : undefined}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-xs text-stone-400 uppercase">
                  <th className="pb-3">Qonaq</th>
                  <th className="pb-3">Otaq</th>
                  <th className="pb-3">Tip</th>
                  <th className="pb-3">Tarix</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/50">
                    <td className="py-4 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-semibold">{b.guest}</span>
                    </td>
                    <td className="py-4">{b.room}</td>
                    <td className="py-4">
                      <span className="bg-stone-100 px-2 py-0.5 rounded-md text-xs">{b.roomType}</span>
                    </td>
                    <td className="py-4 text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {b.checkIn} → {b.checkOut}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(b.id, b.status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                          b.status === "Təsdiqlənib"
                            ? "bg-emerald-50 text-emerald-600"
                            : b.status === "Gözləyir"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {b.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}