"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, User, Loader2, AlertCircle, Eye, Trash2, Pencil, X, Check } from "lucide-react";
import { getBookings, updateBooking, getRooms } from "@/services/api";
import type { Booking, Room } from "@/types/api";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Hamısı");

  // Edit Modal State
  const [editBookingId, setEditBookingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, roomsData] = await Promise.all([
        getBookings(),
        getRooms()
      ]);
      setBookings(bookingsData);
      setRooms(roomsData);
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const statuses = ["pending", "confirmed", "cancelled"] as const;
    const next = statuses[(statuses.indexOf(currentStatus as any) + 1) % statuses.length];
    
    // Optimistic update
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: next } : b)));
    
    try {
      await updateBooking(id, { status: next });
      loadData();
    } catch (err: any) {
      alert(err.message || "Status yenilənərkən xəta baş verdi");
      loadData();
    }
  };

  const handleEditNotes = async (id: string, currentNotes: string, status: string) => {
    const newNotes = prompt("Qeydi daxil edin:", currentNotes || "");
    if (newNotes !== null && newNotes !== currentNotes) {
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, notes: newNotes } : b)));
      try {
        await updateBooking(id, { status, notes: newNotes });
      } catch (err: any) {
        alert(err.message || "Qeyd yenilənərkən xəta baş verdi");
        loadData();
      }
    }
  };

  const startEditBooking = (booking: Booking) => {
    setEditBookingId(booking._id);
    setEditForm({
      guestName: booking.guestName,
      email: booking.email,
      phone: booking.phone,
      room: booking.room ? (typeof booking.room === 'object' ? (booking.room as any)._id : booking.room) : "",
      checkIn: booking.checkIn ? new Date(booking.checkIn).toISOString().split('T')[0] as any : "",
      checkOut: booking.checkOut ? new Date(booking.checkOut).toISOString().split('T')[0] as any : "",
      notes: booking.notes,
      status: booking.status,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBookingId) return;
    try {
      setLoading(true);
      await updateBooking(editBookingId, editForm);
      setEditBookingId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Bron yenilənərkən xəta baş verdi");
      setLoading(false);
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

  const filtered = bookings.filter((b) => {
    const statusMap: Record<string, string> = {
      "Gözləyir": "pending",
      "Təsdiqlənib": "confirmed",
      "Ləğv edilib": "cancelled",
    };
    const matchFilter = activeFilter === "Hamısı" || b.status === statusMap[activeFilter];
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      (b.guestName || "").toLowerCase().includes(searchLower) ||
      (b.room?.name || "").toLowerCase().includes(searchLower) ||
      (b.email || "").toLowerCase().includes(searchLower) ||
      (b.phone || "").toLowerCase().includes(searchLower);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Rezervasiyalar</h2>
        <p className="text-xs text-stone-400 mt-1">Bütün bron müraciətləri və tənzimləmələri</p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Qonaq, nömrə və ya otaq axtar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
        />
      </div>

      <div className="flex gap-1.5 bg-stone-100 p-1 rounded-xl w-max overflow-x-auto whitespace-nowrap">
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
        {loading && !editBookingId ? (
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
            <table className="w-full text-left text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-stone-100 text-xs text-stone-400 uppercase">
                  <th className="pb-3">Qonaq</th>
                  <th className="pb-3">Əlaqə</th>
                  <th className="pb-3">Otaq</th>
                  <th className="pb-3">Qeyd</th>
                  <th className="pb-3">Tarix</th>
                  <th className="pb-3 text-right">Status & Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.length === 0 ? (
                  <tr>
                     <td colSpan={6} className="py-10 text-center text-stone-400">Bron tapılmadı.</td>
                  </tr>
                ) : filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50/50">
                    <td className="py-4 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-semibold">{b.guestName}</span>
                    </td>
                    <td className="py-4 text-xs text-stone-500">
                      {b.email}<br />
                      <span className="text-[10px] text-stone-400">{b.phone}</span>
                    </td>
                    <td className="py-4">
                      {b.room ? (
                        <div>
                          <p className="font-medium text-[#1e325c]">{b.room.name}</p>
                          <p className="text-[10px] text-stone-400">{typeof b.room.type === 'object' ? (b.room.type as any).name : b.room.type}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">Silinmiş otaq</span>
                      )}
                    </td>
                    <td className="py-4 text-xs text-stone-500 group">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[120px]" title={b.notes}>{b.notes || "-"}</span>
                        <button 
                          onClick={() => handleEditNotes(b._id, b.notes || "", b.status)}
                          className="p-1.5 text-stone-400 hover:text-[#00b5d5] bg-stone-100 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="Qeydi sürətli redaktə et"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(b.checkIn).toLocaleDateString("az-AZ")} → {new Date(b.checkOut).toLocaleDateString("az-AZ")}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(b._id, b.status)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                            b.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              : b.status === "pending"
                              ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          }`}
                        >
                          {getStatusLabel(b.status)}
                        </button>
                        <button 
                          onClick={() => startEditBooking(b)}
                          className="p-1.5 text-stone-400 hover:text-[#00b5d5] bg-stone-50 hover:bg-blue-50 rounded-lg transition-all"
                          title="Tam Redaktə Et"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editBookingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="font-bold text-[#1e325c]">Bronu Redaktə Et</h3>
              <button 
                onClick={() => setEditBookingId(null)}
                className="text-stone-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Qonaq Adı</label>
                  <input
                    required
                    value={editForm.guestName || ""}
                    onChange={(e) => setEditForm({...editForm, guestName: e.target.value})}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Otaq Seçimi</label>
                  <select
                    required
                    value={editForm.room as string || ""}
                    onChange={(e) => setEditForm({...editForm, room: e.target.value})}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5]"
                  >
                    <option value="" disabled>Otaq seçin...</option>
                    {rooms.map((r) => (
                      <option key={r._id} value={r._id}>{r.name} - {r.price} AZN</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Email</label>
                  <input
                    required type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Telefon</label>
                  <input
                    required
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Giriş Tarixi (Check-in)</label>
                  <input
                    required type="date"
                    value={editForm.checkIn as any || ""}
                    onChange={(e) => setEditForm({...editForm, checkIn: e.target.value as any})}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Çıxış Tarixi (Check-out)</label>
                  <input
                    required type="date"
                    value={editForm.checkOut as any || ""}
                    onChange={(e) => setEditForm({...editForm, checkOut: e.target.value as any})}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 mb-1">Qeydlər</label>
                  <textarea
                    value={editForm.notes || ""}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm h-20 resize-none focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditBookingId(null)}
                  className="px-4 py-2 text-stone-500 bg-stone-100 hover:bg-stone-200 text-sm font-bold rounded-xl transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--color-hotel-blue)" }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}