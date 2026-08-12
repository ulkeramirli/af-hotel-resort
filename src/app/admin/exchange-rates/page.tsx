// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { Banknote, RefreshCw } from "lucide-react";

export default function ExchangeRatesPage() {
  const [rates, setRates] = useState<{ usd: number; eur: number; lastUpdated: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/exchange-rates");
      const json = await res.json();
      if (json.success && json.data) {
        setRates(json.data);
      }
    } catch (err: any) {
      setError("Məzənnələr yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/exchange-rates", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setRates(json.data);
        setMessage("Məzənnələr CBAR-dan uğurla yeniləndi!");
      } else {
        setError(json.error || "Yenilənmə zamanı xəta baş verdi");
      }
    } catch (err: any) {
      setError("Xəta baş verdi");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-6">Yüklənir...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e325c]">Məzənnələr (Currency Rates)</h1>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${updating ? "animate-spin" : ""}`} />
          <span>CBAR-dan Yenilə</span>
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}
      {message && <div className="p-4 bg-green-50 text-green-600 rounded-xl">{message}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-lg font-bold text-green-600">
              $
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">USD (Dollar)</p>
              <p className="text-2xl font-bold text-[#1e325c]">{rates?.usd?.toFixed(4) || "1.7000"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-lg font-bold text-blue-600">
              €
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">EUR (Avro)</p>
              <p className="text-2xl font-bold text-[#1e325c]">{rates?.eur?.toFixed(4) || "1.8500"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-2 text-sm text-stone-500">
          <Banknote className="w-4 h-4" />
          <span>
            Son yenilənmə:{" "}
            <strong className="text-stone-700">
              {rates?.lastUpdated
                ? new Date(rates.lastUpdated).toLocaleString("az-AZ")
                : "Məlumat yoxdur"}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
