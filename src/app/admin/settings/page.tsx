"use client";

import React, { useState, useEffect } from "react";
import { Palette, Save, Loader2, CheckCircle2, Phone, Mail, Type } from "lucide-react";

export default function SuperAdminConfigPage() {
  const [form, setForm] = useState({
    hotelName: "",
    themeColor: "#00b4d8",
    backgroundColor: "#ffffff",
    heroTitle: "",
    heroSubtitle: "",
    contactPhone: "",
    contactEmail: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data) setForm(data);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-[#00b4d8]" />
        <p className="text-xs text-gray-400">Konstruktor yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-gray-800">No-Code Sayt Konstruktoru</h2>
        <p className="text-xs text-gray-400">VS Code açmadan saytın dizaynını, mətnlərini və əlaqə məlumatlarını idarə edin</p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-600 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Dizayn və mətnlər real vaxt rejimində yeniləndi!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Vizual Görünüş</h3>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Otel Adı</label>
            <input type="text" value={form.hotelName} onChange={e => setForm({...form, hotelName: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00b4d8]" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Əsas Rəng</label>
              <input type="color" value={form.themeColor} onChange={e => setForm({...form, themeColor: e.target.value})} className="w-full h-10 mt-1 rounded-xl cursor-pointer bg-transparent" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Fon Rəngi</label>
              <input type="color" value={form.backgroundColor} onChange={e => setForm({...form, backgroundColor: e.target.value})} className="w-full h-10 mt-1 rounded-xl cursor-pointer bg-transparent" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Başlıq mətnləri (Hero Section)</h3>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500">Əsas Böyük Başlıq</label>
            <input type="text" value={form.heroTitle} onChange={e => setForm({...form, heroTitle: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500">Alt Mətn (Subtitle)</label>
            <textarea value={form.heroSubtitle} onChange={e => setForm({...form, heroSubtitle: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none h-20 resize-none" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 md:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Əlaqə Məlumatları</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Telefon</label>
              <input type="text" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</label>
              <input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full mt-4 py-2.5 bg-[#00b4d8] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Dizaynı və Mətnləri Canlı Yenilə</span>
          </button>
        </div>
      </form>
    </div>
  );
}