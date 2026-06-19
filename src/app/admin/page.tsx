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
import {
  getDashboardData,
  updateBookingStatus,
  markMessageRead,
} from "@/services/api";
import type { Booking } from "@/types/api";

interface DashBooking {
  id: string;
  guest: string;
  room: string;
  date: string;
  status: string;
}

interface DashRoom {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface DashMessage {
  id: string;
  name: string;
  text: string;
  time: string;
  initials: string;
  unread: boolean;
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<DashBooking[]>([]);
  const [rooms, setRooms] = useState<DashRoom[]>([]);
  const [messages, setMessages] = useState<DashMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("Hamısı");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    let cancelled = false;
    getDashboardData()
      .then((data) => {
        if (cancelled) return;
        setBookings(data.bookings ?? []);
        setRooms(data.rooms ?? []);
        setMessages(data.messages ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Xəta");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const tick = () =>
      setCurrentTime(
        new Date().toLocaleTimeString("az-AZ", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleBookingStatus = async (id: string, currentStatus: string) => {
    const statuses = ["Gözləyir", "Təsdiqlənib", "Ləğv edilib"] as const;
    const next = statuses[(statuses.indexOf(currentStatus as typeof statuses[number]) + 1) % statuses.length];
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: next } : b)));
    await updateBookingStatus(id, next as Booking["status"]);
  };

  const readMessage = async (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
    await markMessageRead(id);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchFilter = activeFilter === "Hamısı" || b.status === activeFilter;
    const matchSearch =
      b.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const confirmed = bookings.filter((b) => b.status === "Təsdiqlənib").length;
  const revenue = bookings
  .filter((b) => b.status === "Təsdiqlənib")
  .reduce((s) => s + 140, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e325c]">Dashboard</h1>
        <p className="text-xs text-stone-400 mt-1">AF Hotel & Aqua Park — idarə paneli</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-stone-100 shadow-sm gap-4">
        <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
          <Clock className="w-4 h-4" style={{ color: "var(--color-hotel-blue)" }} />
          <span>
            Canlı: <strong className="text-[#1e325c]">{currentTime || "..."}</strong>
          </span>
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
          { label: "Təsdiqlənmiş bronlar", value: loading ? "..." : confirmed, sub: "Bu ay", up: true },
          { label: "Boş otaqlar", value: loading ? "..." : rooms.filter((r) => r.status === "Boş").length, sub: `${rooms.length} otaqdan`, up: false },
          { label: "Dövriyyə", value: loading ? "..." : `${revenue} AZN`, sub: "Təsdiqlənmişlər", up: true },
          { label: "Oxunmamış", value: loading ? "..." : messages.filter((m) => m.unread).length, sub: "Mesajlar", up: false, danger: true },
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
              <div className="flex gap-1.5 bg-stone-50 p-1 rounded-xl">
                {["Hamısı", "Gözləyir", "Təsdiqlənib", "Ləğv edilib"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeFilter === tab ? "text-white" : "text-stone-500"
                    }`}
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
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 text-xs text-stone-400 uppercase">
                      <th className="pb-3">Qonaq</th>
                      <th className="pb-3">Otaq</th>
                      <th className="pb-3">Tarix</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/50">
                        <td className="py-3 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          {b.guest}
                        </td>
                        <td className="py-3 text-stone-500">{b.room}</td>
                        <td className="py-3 text-stone-500 text-xs">{b.date}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => toggleBookingStatus(b.id, b.status)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
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

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1e325c] mb-4">Son mesajlar</h3>
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => m.unread && readMessage(m.id)}
                  className={`flex gap-3 p-3 rounded-xl cursor-pointer ${
                    m.unread ? "bg-blue-50/60 border border-blue-100" : "hover:bg-stone-50"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: m.unread ? "var(--color-hotel-blue)" : "#a8a29e" }}
                  >
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1e325c]">{m.name}</p>
                    <p className="text-xs text-stone-500 truncate">{m.text}</p>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{m.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h3 className="font-bold text-[#1e325c] mb-4">Otaqlar</h3>
            <div className="grid grid-cols-2 gap-3">
              {rooms.map((r) => (
                <div key={r.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <h4 className="font-bold text-xs text-[#1e325c]">{r.name}</h4>
                  <p className="text-[10px] text-stone-400">{r.type}</p>
                  <span
                    className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.status === "Boş" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1e325c]">Həftəlik bronlar</h3>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-end justify-between h-24 gap-1">
              {[40, 70, 30, 85, 55].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-md transition-all"
                    style={{ height: `${h}%`, background: i === 4 ? "var(--color-hotel-blue)" : "rgba(0,70,147,0.25)" }}
                  />
                  <span className="text-[9px] text-stone-400">{["B", "Ç", "C", "C.a", "C"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}