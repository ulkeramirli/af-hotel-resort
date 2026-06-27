"use client";
import React, { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2, Phone, Mail, MapPin, Link as LinkIcon, Globe } from "lucide-react";
import { getSettings, updateSettings } from "@/services/api";
import type { FormEvent,ChangeEvent } from "react";

const defaultSettings: any = {
  hotelName: { az: "", en: "", ru: "" },
  phone: "",
  email: "",
  address: { az: "", en: "", ru: "" },
  instagram: "",
  facebook: "",
  tiktok: "",
  googleMapsLink: "",
  reception: "",
  aquapark: "",
  dining: ""
};

const LangSwitcher = ({ lang, setLang }: { lang: "az" | "en" | "ru"; setLang: (l: "az" | "en" | "ru") => void }) => (
  <div className="flex gap-1 bg-stone-100 p-1 rounded-lg w-max mb-4">
    {(["az", "en", "ru"] as const).map((l) => (
      <button
        key={l}
        type="button"
        onClick={() => setLang(l)}
        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
          lang === l ? "bg-white text-[#1e325c] shadow-sm" : "text-stone-400 hover:text-stone-600"
        }`}
      >
        <Globe className="w-3 h-3" /> {l}
      </button>
    ))}
  </div>
);

export default function AdminSettingsPage() {
  const [form, setForm] = useState<any>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formLang, setFormLang] = useState<"az" | "en" | "ru">("az");

  const parseLoc = (val: any) => typeof val === 'object' ? val : { az: val||"", en: val||"", ru: val||"" };

  useEffect(() => {
    getSettings()
      .then(data => {
        if (data) {
          setForm({
            ...data,
            hotelName: parseLoc(data.hotelName),
            address: parseLoc(data.address),
          });
        }
      })
      .catch(err => setError(err.message || "Tənzimləmələr yüklənərkən xəta baş verdi"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateSettings(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Yadda saxlanılarkən xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
        <p className="text-xs text-stone-400">Tənzimləmələr yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1e325c]">Tənzimləmələr</h2>
          <p className="text-xs text-stone-400 mt-1">Otel məlumatları, əlaqə və sosial şəbəkələr</p>
        </div>
        <LangSwitcher lang={formLang} setLang={setFormLang} />
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-600 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Məlumatlar uğurla yeniləndi!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ümumi Məlumatlar */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Ümumi Məlumatlar</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Otel Adı [{formLang.toUpperCase()}]</label>
            <input 
              type="text" 
              value={form.hotelName[formLang]} 
              onChange={(e) => setForm({ ...form, hotelName: { ...form.hotelName, [formLang]: e.target.value } })} 
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Əsas Telefon</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Ünvan [{formLang.toUpperCase()}]</label>
            <input 
              type="text" 
              value={form.address[formLang]} 
              onChange={(e) => setForm({ ...form, address: { ...form.address, [formLang]: e.target.value } })} 
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Google Maps Linki</label>
            <input type="text" name="googleMapsLink" value={form.googleMapsLink} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
          </div>
        </div>

        {/* Daxili Nömrələr */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Daxili Nömrələr</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Resepşn</label>
            <input type="text" name="reception" value={form.reception} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Aquapark</label>
            <input type="text" name="aquapark" value={form.aquapark} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500">Restoran & Şadlıq Sarayı</label>
            <input type="text" name="dining" value={form.dining} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
          </div>
        </div>

        {/* Sosial Şəbəkələr */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4 md:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Sosial Şəbəkələr</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> Instagram</label>
              <input type="text" name="instagram" value={form.instagram} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> Facebook</label>
              <input type="text" name="facebook" value={form.facebook} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> TikTok</label>
              <input type="text" name="tiktok" value={form.tiktok} onChange={handleChange} className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]" />
            </div>
          </div>
          
          <button type="submit" disabled={saving} className="w-full mt-6 py-3 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: "var(--color-hotel-blue)" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Yadda Saxla</span>
          </button>
        </div>
      </form>
    </div>
  );
}