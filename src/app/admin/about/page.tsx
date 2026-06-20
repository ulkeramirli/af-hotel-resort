"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Check, AlertCircle, Info, Plus, X } from "lucide-react";
import { getAbout, updateAbout, uploadImage } from "@/services/api";
import type { About } from "@/types/api";

const emptyAboutForm: About = {
  title: "",
  description: "",
  images: [],
};

export default function AdminAboutPage() {
  const [form, setForm] = useState<About>(emptyAboutForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAbout();
      if (data) {
        setForm({
          title: data.title || "",
          description: data.description || "",
          images: data.images || [],
        });
      }
    } catch (err: any) {
      setError(err.message || "Məlumat yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateAbout(form);
      alert("Haqqımızda bölməsi uğurla yeniləndi");
      loadData();
    } catch (err: any) {
      alert(err.message || "Yadda saxlanılarkən xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Haqqımızda (About)</h2>
        <p className="text-xs text-stone-400 mt-1">Saytın Haqqımızda bölməsini idarə edin</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl font-medium border border-rose-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <h3 className="font-bold text-[#1e325c] text-sm mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
          Məlumatları Redaktə Et
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Başlıq</label>
            <input
              placeholder="Məsələn: AF Hotel Resort haqqında"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Təsvir (Mətn)</label>
            <textarea
              placeholder="Geniş mətn daxil edin..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs h-40 resize-none focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-2">Qalereya Şəkilləri</label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 group rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ))}
              <div className="relative w-24 h-24 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-[#00b5d5] hover:border-[#00b5d5] hover:bg-[#00b5d5]/5 transition-all cursor-pointer bg-stone-50">
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-semibold text-center leading-tight">Şəkil<br/>Yüklə</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const data = await uploadImage(file);
                      if (data.success) {
                        setForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
                      } else {
                        alert(data.message || "Xəta baş verdi");
                      }
                    } catch (err: any) {
                      alert("Şəkil yüklənərkən xəta: " + err.message);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--color-hotel-blue)" }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? "Yadda saxlanılır..." : "Yadda Saxla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
