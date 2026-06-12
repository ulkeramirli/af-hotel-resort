"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, DollarSign, Percent, CalendarCheck2, Loader2, AlertCircle, MessageSquare } from "lucide-react";

interface StatsData {
  totalRevenue: number;
  occupancyRate: number;
  roomStats: {
    bos: number;
    dolu: number;
    temizlenir: number;
  };
  popularTypes: Array<{ name: string; count: number }>;
  totalBookings: number;
  pendingBookings: number;
  totalMessages: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = "af-hotel-super-secret-token";

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Statistika məlumatları bazadan yüklənmədi");
        const data = await res.json();
        
        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Xəta baş verdi");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" />
        <p className="text-xs text-gray-400 font-medium">Analitika hesablanır...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-2 text-rose-500 bg-rose-50/50 rounded-xl p-4 border border-rose-100">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm font-bold">Məlumat almaq mümkün olmadı</p>
        <p className="text-xs text-rose-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Biznes Analitika və Statistika</h2>
        <p className="text-xs text-gray-400 mt-1">Otelinizin gəlirləri, otaq doluluğu və real vaxt göstəriciləri</p>
      </div>

      {/* МЕТРИКИ КАРТОЧКИ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1">Ümumi Gəlir</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue} AZN</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1">Otaq Doluluğu</p>
            <p className="text-2xl font-bold text-gray-800">{stats.occupancyRate}%</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1">Ümumi Rezervasiya</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalBookings} ədəd</p>
          </div>
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1">Gözləyən Bronlar</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingBookings} müraciət</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ДИАГРАММА СОСТОЯНИЯ НОМЕРОВ */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-800">Otaqların cari vəziyyət diaqramı</h3>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-600">Boş və Hazır Otaqlar ({stats.roomStats.bos})</span>
                <span className="text-gray-500">{Math.round((stats.roomStats.bos / (stats.totalBookings || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(stats.roomStats.bos / (stats.roomStats.bos + stats.roomStats.dolu + stats.roomStats.temizlenir || 1)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-600">Dolu / Aktiv İstifadə olunanlar ({stats.roomStats.dolu})</span>
                <span className="text-gray-500">{stats.occupancyRate}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full transition-all" style={{ width: `${stats.occupancyRate}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-600">Təmizlənməkdə olanlar ({stats.roomStats.temizlenir})</span>
                <span className="text-gray-500">{Math.round((stats.roomStats.temizlenir / (stats.roomStats.bos + stats.roomStats.dolu + stats.roomStats.temizlenir || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all" style={{ width: `${(stats.roomStats.temizlenir / (stats.roomStats.bos + stats.roomStats.dolu + stats.roomStats.temizlenir || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ПОПУЛЯРНЫЕ КАТЕГОРИИ */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-800">Ən çox satılan otaq kateqoriyaları</h3>
          
          <div className="divide-y divide-gray-50 max-h-52 overflow-y-auto">
            {stats.popularTypes.length > 0 ? (
              stats.popularTypes.map((type, idx) => (
                <div key={type.name} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 w-5 h-5 rounded flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-700">{type.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#00b4d8] bg-cyan-50 px-2 py-1 rounded-lg">
                    {type.count} dəfə bronlanıb
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
                <MessageSquare className="w-6 h-6 text-gray-300" />
                <span>Hələ ki təsdiqlənmiş otaq satışı yoxdur.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}