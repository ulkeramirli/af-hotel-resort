/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Pencil, HelpCircle, Globe } from "lucide-react";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "@/services/api";

const emptyFaqForm = {
  question: { az: "", en: "", ru: "" },
  answer: { az: "", en: "", ru: "" },
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

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formLang, setFormLang] = useState<"az" | "en" | "ru">("az");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyFaqForm);

  const parseLoc = (val: any) => typeof val === 'object' ? val : { az: val||"", en: val||"", ru: val||"" };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getFaqs();
      setFaqs(data);
    } catch (err: any) {
      setError(err.message || "FAQ yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.az || !form.answer.az) {
      alert("Sual və cavab AZ dilində mütləq doldurulmalıdır!");
      return;
    }
    
    try {
      if (editId) {
        await updateFaq(editId, form);
      } else {
        await createFaq(form);
      }
      setEditId(null);
      setForm(emptyFaqForm);
      loadData();
    } catch (err: any) {
      alert(err.message || "Yadda saxlanılarkən xəta baş verdi");
    }
  };

  const startEdit = (faq: any) => {
    setEditId(faq._id);
    setForm({
      question: parseLoc(faq.question),
      answer: parseLoc(faq.answer),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu sualı silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteFaq(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Silərkən xəta baş verdi");
    }
  };

  if (loading && faqs.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Tez-tez Verilən Suallar (FAQ)</h2>
        <p className="text-xs text-stone-400 mt-1">Sual-cavab bölməsi</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl font-medium border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                {editId ? "Sualı Redaktə Et" : "Yeni Sual Əlavə Et"}
              </h3>
              <LangSwitcher lang={formLang} setLang={setFormLang} />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Sual [{formLang.toUpperCase()}]</label>
                <textarea
                  placeholder="Məs: Otelə giriş saat neçədədir?"
                  value={form.question[formLang]}
                  onChange={(e) => setForm({ ...form, question: { ...form.question, [formLang]: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5] h-20 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Cavab [{formLang.toUpperCase()}]</label>
                <textarea
                  placeholder="Məs: Giriş (Check-in) 14:00, çıxış (Check-out) 12:00-dadır."
                  value={form.answer[formLang]}
                  onChange={(e) => setForm({ ...form, answer: { ...form.answer, [formLang]: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5] h-24 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: "var(--color-hotel-blue)" }}
                >
                  {editId ? "Yadda Saxla" : "Əlavə Et"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => { setEditId(null); setForm(emptyFaqForm); }}
                    className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl"
                  >
                    Ləğv
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 space-y-3">
          {faqs.length === 0 ? (
            <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">
              Sual tapılmadı
            </div>
          ) : faqs.map((faq) => (
            <div key={faq._id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-amber-500 bg-amber-50">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e325c] mb-1">{(faq.question as any)?.az || faq.question}</h4>
                    <p className="text-xs text-stone-500 line-clamp-3">{(faq.answer as any)?.az || faq.answer}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(faq)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(faq._id)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
