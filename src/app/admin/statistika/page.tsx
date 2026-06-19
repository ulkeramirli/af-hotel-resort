"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  Percent,
  CalendarCheck2,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { getStats } from "@/services/api";

interface StatsData {
  totalRevenue: number;
  occupancyRate: number;
  roomStats: { bos: number; dolu: number; temizlenir: number };
  popularTypes: Array<{ name: string; count: number }>;
  totalBookings: number;
  pendingBookings: number;
  totalMessages: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((data) => { if (!cancelled) setStats(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Xəta"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
        <p className="text-xs text-stone-400">Analitika hesablanır...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="py-12 text-center text-rose-500">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  const total = stats.roomStats.bos + stats.roomStats.dolu + stats.roomStats.temizlenir || 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Statistika</h2>
        <p className="text-xs text-stone-400 mt-1">Biznes analitika</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Ümumi Gəlir", value: `${stats.totalRevenue} AZN`, icon: DollarSign, color: "emerald" },
          { label: "Doluluq", value: `${stats.occupancyRate}%`, icon: Percent, color: "blue" },
          { label: "Rezervasiya", value: `${stats.totalBookings} ədəd`, icon: CalendarCheck2, color: "purple" },
          { label: "Gözləyən", value: `${stats.pendingBookings}`, icon: BarChart3, color: "amber" },
        ].map((m) => (
          <div key={m.label} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs text-stone-400 mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-[#1e325c]">{m.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${m.color}-50`}>
              <m.icon className="w-5 h-5" style={{ color: "var(--color-hotel-blue)" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#1e325c]">Otaq vəziyyəti</h3>
          {[
            { label: "Boş", count: stats.roomStats.bos, color: "bg-emerald-500" },
            { label: "Dolu", count: stats.roomStats.dolu, color: "bg-rose-500" },
            { label: "Təmizlənir", count: stats.roomStats.temizlenir, color: "bg-blue-500" },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{row.label} ({row.count})</span>
                <span>{Math.round((row.count / total) * 100)}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className={`${row.color} h-full`} style={{ width: `${(row.count / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <h3 className="font-bold text-sm text-[#1e325c] mb-4">Populyar kateqoriyalar</h3>
          {stats.popularTypes.length > 0 ? (
            stats.popularTypes.map((type, idx) => (
              <div key={type.name} className="flex justify-between items-center py-3 border-b border-stone-50 last:border-0">
                <span className="text-xs font-bold text-[#1e325c]">
                  {idx + 1}. {type.name}
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: "var(--color-hotel-blue)", background: "rgba(0,70,147,0.08)" }}>
                  {type.count} bron
                </span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-stone-400 text-xs">
              <MessageSquare className="w-6 h-6 mx-auto mb-2" />
              Məlumat yoxdur
            </div>
          )}
        </div>
      </div>
    </div>
  );
}