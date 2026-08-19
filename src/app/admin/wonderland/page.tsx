// @ts-nocheck
/* eslint-disable @next/next/no-img-element, react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2, Check, AlertCircle, Castle, Plus, Trash2, Pencil, X,
  Ticket, Sparkles, Star, Gamepad2, ChevronDown, ChevronUp, Percent,
  Clock, Tag, ImagePlus, Globe, ArrowUp, ArrowDown
} from "lucide-react";
import { getWonderland, updateWonderland, uploadImage } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import DynamicIcon from "@/components/DynamicIcon";
import IconPicker from "@/components/IconPicker";
import type { Wonderland } from "@/types/api";
import RichTextEditor from "@/components/RichTextEditor";

type TabKey = "general" | "tickets" | "small" | "big";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "general", label: "Ümumi Məlumat", icon: Castle },
  { key: "tickets", label: "Biletlər", icon: Ticket },
  { key: "small", label: "Kiçik Attraksionlar", icon: Star },
  { key: "big", label: "Böyük Attraksionlar", icon: Gamepad2 },
];

const emptyForm: any = {
  title: { az: "", en: "", ru: "" },
  tag: { az: "", en: "", ru: "" },
  workingHours: "",
  description: { az: "", en: "", ru: "" },
  discount: { enabled: false, percentage: 0 },
  tickets: [],
  smallAttractions: [],
  bigAttractions: [],
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

export default function AdminWonderlandPage() {
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  
  const [formLang, setFormLang] = useState<"az" | "en" | "ru">("az");

  // Ticket editing
  const [ticketForm, setTicketForm] = useState<{ name: any; price: string }>({ name: { az: "", en: "", ru: "" }, price: "" });
  const [editTicketIdx, setEditTicketIdx] = useState<number | null>(null);

  // Small attraction editing
  const [smallForm, setSmallForm] = useState<{ name: any; description: any; icon: string }>({ name: { az: "", en: "", ru: "" }, description: { az: "", en: "", ru: "" }, icon: "" });
  const [editSmallIdx, setEditSmallIdx] = useState<number | null>(null);

  // Big attraction editing
  const [bigForm, setBigForm] = useState<{ title: any }>({ title: { az: "", en: "", ru: "" } });
  const [editBigIdx, setEditBigIdx] = useState<number | null>(null);
  const [expandedBig, setExpandedBig] = useState<number | null>(null);

  // Game editing (within big attraction)
  const [gameForm, setGameForm] = useState<{ name: any; image: string; description: any }>({ name: { az: "", en: "", ru: "" }, image: "", description: { az: "", en: "", ru: "" } });
  const [editGameIdx, setEditGameIdx] = useState<number | null>(null);
  const [activeGameBigIdx, setActiveGameBigIdx] = useState<number | null>(null);

  const parseLoc = (val: any) => typeof val === 'object' && val !== null ? val : { az: val||"", en: val||"", ru: val||"" };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWonderland();
      if (data) {
        setForm({
          title: parseLoc(data.title),
          tag: parseLoc(data.tag),
          workingHours: data.workingHours || "",
          description: parseLoc(data.description),
          discount: data.discount || { enabled: false, percentage: 0 },
          tickets: (data.tickets || []).map(t => ({ name: parseLoc(t.name), price: t.price })),
          smallAttractions: (data.smallAttractions || []).map(s => ({
            name: parseLoc(s.name),
            description: parseLoc(s.description),
            icon: s.icon
          })),
          bigAttractions: (data.bigAttractions || []).map(b => ({
            title: parseLoc(b.title),
            games: (b.games || []).map(g => ({
              name: parseLoc(g.name),
              description: parseLoc(g.description),
              image: g.image
            }))
          })),
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

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWonderland(form);
      alert("AF Park uğurla yeniləndi!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Yadda saxlanılarkən xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  // ─── TICKET HELPERS ───
  const addOrUpdateTicket = async () => {
    if (!ticketForm.name.az || !ticketForm.price) {
      alert("Biletin adı AZ dilində və qiyməti daxil edilməlidir!");
      return;
    }
    const updated = [...form.tickets];
    if (editTicketIdx !== null) {
      updated[editTicketIdx] = { ...updated[editTicketIdx], ...ticketForm };
      setEditTicketIdx(null);
    } else {
      updated.push(ticketForm);
    }
    const newForm = { ...form, tickets: updated };
    setForm(newForm);
    setTicketForm({ name: { az: "", en: "", ru: "" }, price: "" });
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const deleteTicket = async (idx: number) => {
    const updated = form.tickets.filter((_: any, i: number) => i !== idx);
    const newForm = { ...form, tickets: updated };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const startEditTicket = (idx: number) => {
    const t = form.tickets[idx];
    setTicketForm({ name: parseLoc(t.name), price: t.price });
    setEditTicketIdx(idx);
  };

  const moveTicketUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...form.tickets];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    const newForm = { ...form, tickets: updated };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const moveTicketDown = async (idx: number) => {
    if (idx === form.tickets.length - 1) return;
    const updated = [...form.tickets];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    const newForm = { ...form, tickets: updated };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  // ─── SMALL ATTRACTION HELPERS ───
  const addOrUpdateSmall = async () => {
    if (!smallForm.name.az || !smallForm.description.az) {
      alert("Ad və təsvir AZ dilində daxil edilməlidir!");
      return;
    }
    const updated = [...form.smallAttractions];
    if (editSmallIdx !== null) {
      updated[editSmallIdx] = { ...updated[editSmallIdx], ...smallForm };
      setEditSmallIdx(null);
    } else {
      updated.push(smallForm);
    }
    const newForm = { ...form, smallAttractions: updated };
    setForm(newForm);
    setSmallForm({ name: { az: "", en: "", ru: "" }, description: { az: "", en: "", ru: "" }, icon: "" });
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const deleteSmall = async (idx: number) => {
    const updated = form.smallAttractions.filter((_: any, i: number) => i !== idx);
    const newForm = { ...form, smallAttractions: updated };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const startEditSmall = (idx: number) => {
    const s = form.smallAttractions[idx];
    setSmallForm({ name: parseLoc(s.name), description: parseLoc(s.description), icon: s.icon || "" });
    setEditSmallIdx(idx);
  };

  const moveSmallUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...form.smallAttractions];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    const newForm = { ...form, smallAttractions: updated };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const moveSmallDown = async (idx: number) => {
    if (idx === form.smallAttractions.length - 1) return;
    const updated = [...form.smallAttractions];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    const newForm = { ...form, smallAttractions: updated };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  // ─── BIG ATTRACTION HELPERS ───
  const addOrUpdateBig = async () => {
    if (!bigForm.title.az) {
      alert("Attraksion başlığı AZ dilində daxil edilməlidir!");
      return;
    }
    const updated = [...form.bigAttractions];
    if (editBigIdx !== null) {
      updated[editBigIdx] = { ...updated[editBigIdx], title: bigForm.title };
      setEditBigIdx(null);
    } else {
      updated.push({ title: bigForm.title, games: [] });
    }
    const newForm = { ...form, bigAttractions: updated };
    setForm(newForm);
    setBigForm({ title: { az: "", en: "", ru: "" } });
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const deleteBig = async (idx: number) => {
    const updated = form.bigAttractions.filter((_: any, i: number) => i !== idx);
    const newForm = { ...form, bigAttractions: updated };
    setForm(newForm);
    if (expandedBig === idx) setExpandedBig(null);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const startEditBig = (idx: number) => {
    const b = form.bigAttractions[idx];
    setBigForm({ title: parseLoc(b.title) });
    setEditBigIdx(idx);
  };

  const moveBigUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...form.bigAttractions];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    const newForm = { ...form, bigAttractions: updated };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const moveBigDown = async (idx: number) => {
    if (idx === form.bigAttractions.length - 1) return;
    const updated = [...form.bigAttractions];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    const newForm = { ...form, bigAttractions: updated };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  // ─── GAME HELPERS (within big attraction) ───
  const addOrUpdateGame = async (bigIdx: number) => {
    if (!gameForm.name.az || !gameForm.description.az) {
      alert("Şəkil/Oyun adı və təsviri AZ dilində daxil edilməlidir!");
      return;
    }
    if (!gameForm.image) {
      alert("Zəhmət olmasa şəkil yükləyin!");
      return;
    }
    const updatedBig = [...form.bigAttractions];
    const games = [...updatedBig[bigIdx].games];
    if (editGameIdx !== null) {
      games[editGameIdx] = { ...games[editGameIdx], ...gameForm };
      setEditGameIdx(null);
    } else {
      games.push(gameForm);
    }
    updatedBig[bigIdx] = { ...updatedBig[bigIdx], games };
    const newForm = { ...form, bigAttractions: updatedBig };
    setForm(newForm);
    setGameForm({ name: { az: "", en: "", ru: "" }, image: "", description: { az: "", en: "", ru: "" } });
    setActiveGameBigIdx(null);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const deleteGame = async (bigIdx: number, gameIdx: number) => {
    const updatedBig = [...form.bigAttractions];
    const games = updatedBig[bigIdx].games.filter((_: any, i: number) => i !== gameIdx);
    updatedBig[bigIdx] = { ...updatedBig[bigIdx], games };
    const newForm = { ...form, bigAttractions: updatedBig };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const startEditGame = (bigIdx: number, gameIdx: number) => {
    const g = form.bigAttractions[bigIdx].games[gameIdx];
    setGameForm({ name: parseLoc(g.name), image: g.image || "", description: parseLoc(g.description) });
    setEditGameIdx(gameIdx);
    setActiveGameBigIdx(bigIdx);
  };

  const moveGameUp = async (bigIdx: number, gameIdx: number) => {
    if (gameIdx === 0) return;
    const updatedBig = [...form.bigAttractions];
    const games = [...updatedBig[bigIdx].games];
    const temp = games[gameIdx];
    games[gameIdx] = games[gameIdx - 1];
    games[gameIdx - 1] = temp;
    updatedBig[bigIdx] = { ...updatedBig[bigIdx], games };
    const newForm = { ...form, bigAttractions: updatedBig };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  const moveGameDown = async (bigIdx: number, gameIdx: number) => {
    if (gameIdx === form.bigAttractions[bigIdx].games.length - 1) return;
    const updatedBig = [...form.bigAttractions];
    const games = [...updatedBig[bigIdx].games];
    const temp = games[gameIdx];
    games[gameIdx] = games[gameIdx + 1];
    games[gameIdx + 1] = temp;
    updatedBig[bigIdx] = { ...updatedBig[bigIdx], games };
    const newForm = { ...form, bigAttractions: updatedBig };
    setForm(newForm);
    try { await updateWonderland(newForm); } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1e325c] flex items-center gap-2">
            <Castle className="w-5 h-5" style={{ color: "var(--color-hotel-gold)" }} />
            AF Park İdarə
          </h2>
          <p className="text-xs text-stone-400 mt-1">AF Park attraksion parkının bütün məlumatlarını idarə edin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-md hover:shadow-lg"
          style={{ background: "var(--color-hotel-blue)" }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {saving ? "Yadda saxlanılır..." : "Hamısını Yadda Saxla"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl font-medium border border-rose-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-stone-100 shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                isActive ? "text-white shadow-md" : "text-stone-500 hover:text-[#1e325c] hover:bg-stone-50"
              }`}
              style={isActive ? { background: "var(--color-hotel-blue)" } : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════ GENERAL TAB ═══════ */}
      {activeTab === "general" && (
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
              <Castle className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
              Ümumi Məlumat
            </h3>
            <LangSwitcher lang={formLang} setLang={setFormLang} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Başlıq [{formLang.toUpperCase()}]</label>
              <input
                placeholder="AF Park"
                value={form.title[formLang]}
                onChange={(e) => setForm({ ...form, title: { ...form.title, [formLang]: e.target.value } })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
              />
            </div>
            <div>
              <label className="flex text-xs font-bold text-stone-600 mb-1 items-center gap-1">
                <Tag className="w-3 h-3" /> Teq [{formLang.toUpperCase()}]
              </label>
              <input
                placeholder="aquapark"
                value={form.tag[formLang]}
                onChange={(e) => setForm({ ...form, tag: { ...form.tag, [formLang]: e.target.value } })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
              />
            </div>
          </div>

          <div>
            <label className="flex text-xs font-bold text-stone-600 mb-1 items-center gap-1">
              <Clock className="w-3 h-3" /> İş Saatları (Ümumi)
            </label>
            <input
              placeholder="09:00 - 21:00"
              value={form.workingHours}
              onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Təsvir [{formLang.toUpperCase()}]</label>
            <RichTextEditor
              key={`desc-${formLang}`}
              placeholder="AF Park haqqında geniş məlumat daxil edin..."
              value={form.description[formLang]}
              onChange={(val) => setForm((prev: any) => ({ ...prev, description: { ...prev.description, [formLang]: val } }))}
            />
          </div>

          {/* Discount Section */}
          <div className="border-t border-stone-100 pt-5">
            <h4 className="font-bold text-[#1e325c] text-sm mb-3 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-500" />
              Endirim
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{ background: form.discount.enabled ? "var(--color-hotel-blue)" : "#d6d3d1" }}
                  onClick={() => setForm({ ...form, discount: { ...form.discount, enabled: !form.discount.enabled } })}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform"
                    style={{ left: form.discount.enabled ? "22px" : "2px" }}
                  />
                </div>
                <span className="text-xs font-semibold text-stone-600">
                  {form.discount.enabled ? "Endirim Aktiv" : "Endirim Deaktiv"}
                </span>
              </label>
              {form.discount.enabled && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0"
                    value={form.discount.percentage || ""}
                    onChange={(e) => setForm({ ...form, discount: { ...form.discount, percentage: Number(e.target.value) } })}
                    className="w-24 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                  />
                  <span className="text-xs font-bold text-stone-500">%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ TICKETS TAB ═══════ */}
      {activeTab === "tickets" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                  {editTicketIdx !== null ? "Bileti Redaktə Et" : "Yeni Bilet Əlavə Et"}
                </h3>
                <LangSwitcher lang={formLang} setLang={setFormLang} />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-500 mb-1 block">Biletin Adı [{formLang}]</label>
                  <input
                    placeholder="Məs: Böyüklər üçün bilet"
                    value={ticketForm.name[formLang]}
                    onChange={(e) => setTicketForm({ ...ticketForm, name: { ...ticketForm.name, [formLang]: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 mb-1 block">Qiymət</label>
                  <input
                    placeholder="Məs: 20 AZN"
                    value={ticketForm.price}
                    onChange={(e) => setTicketForm({ ...ticketForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={addOrUpdateTicket}
                    className="flex-1 px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90"
                    style={{ background: "var(--color-hotel-blue)" }}
                  >
                    {editTicketIdx !== null ? "Yadda Saxla" : "Əlavə Et"}
                  </button>
                  {editTicketIdx !== null && (
                    <button
                      onClick={() => { setEditTicketIdx(null); setTicketForm({ name: {az:"", en:"", ru:""}, price: "" }); }}
                      className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl"
                    >
                      Ləğv
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="lg:col-span-2 space-y-3">
            {form.tickets.length === 0 ? (
              <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">
                Bilet tapılmadı. Sol tərəfdən yeni bilet əlavə edin.
              </div>
            ) : form.tickets.map((ticket: any, idx: number) => (
              <div key={`ticket-${idx}-${ticket.name?.az || ticket.name}`} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "var(--color-hotel-blue)" }}>
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e325c]">{typeof ticket.name === 'object' ? ((ticket.name as any)?.az || "") : ticket.name}</h4>
                    <p className="text-xs font-semibold text-stone-500 mt-0.5">
                      <span className="text-[#00b5d5]">{ticket.price}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => moveTicketUp(idx)} disabled={idx === 0} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveTicketDown(idx)} disabled={idx === form.tickets.length - 1} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => startEditTicket(idx)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTicket(idx)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ SMALL ATTRACTIONS TAB ═══════ */}
      {activeTab === "small" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                  {editSmallIdx !== null ? "Redaktə Et" : "Yeni Əlavə Et"}
                </h3>
                <LangSwitcher lang={formLang} setLang={setFormLang} />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-500 mb-1 block">Ad [{formLang}]</label>
                  <input
                    placeholder="Məs: Mini Golf"
                    value={smallForm.name[formLang]}
                    onChange={(e) => setSmallForm({ ...smallForm, name: { ...smallForm.name, [formLang]: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 mb-1 block">Təsvir [{formLang}]</label>
                  <RichTextEditor
                    key={`small-desc-${formLang}`}
                    placeholder="Attraksion haqqında qısa məlumat..."
                    value={smallForm.description[formLang]}
                    onChange={(val) => setSmallForm((prev: any) => ({ ...prev, description: { ...prev.description, [formLang]: val } }))}
                  />
                </div>
                <IconPicker
                  value={smallForm.icon}
                  onChange={(val) => setSmallForm({ ...smallForm, icon: val })}
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={addOrUpdateSmall}
                    className="flex-1 px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90"
                    style={{ background: "var(--color-hotel-blue)" }}
                  >
                    {editSmallIdx !== null ? "Yadda Saxla" : "Əlavə Et"}
                  </button>
                  {editSmallIdx !== null && (
                    <button
                      onClick={() => { setEditSmallIdx(null); setSmallForm({ name: {az:"", en:"", ru:""}, description: {az:"", en:"", ru:""}, icon: "" }); }}
                      className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl"
                    >
                      Ləğv
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="lg:col-span-2 space-y-3">
            {form.smallAttractions.length === 0 ? (
              <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">
                Kiçik attraksion tapılmadı.
              </div>
            ) : form.smallAttractions.map((sa: any, idx: number) => (
              <div key={`sa-${idx}-${sa.name?.az || sa.name}`} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "linear-gradient(135deg, #00b5d5, #1e325c)" }}>
                    {sa.icon ? <DynamicIcon name={sa.icon} className="w-5 h-5 text-white" /> : <Star className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e325c]">{typeof sa.name === 'object' ? ((sa.name as any)?.az || "") : sa.name}</h4>
                    <div className="text-xs text-stone-400 mt-0.5 line-clamp-1" dangerouslySetInnerHTML={{ __html: typeof sa.description === 'object' ? ((sa.description as any)?.az || "") : sa.description }} />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => moveSmallUp(idx)} disabled={idx === 0} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveSmallDown(idx)} disabled={idx === form.smallAttractions.length - 1} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => startEditSmall(idx)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteSmall(idx)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ BIG ATTRACTIONS TAB ═══════ */}
      {activeTab === "big" && (
        <div className="space-y-6">
          {/* Add Big Attraction Form */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                {editBigIdx !== null ? "Attraksiyonu Redaktə Et" : "Yeni Böyük Attraksion"}
              </h3>
              <LangSwitcher lang={formLang} setLang={setFormLang} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder={`Məs: Su sürüşmələri (${formLang})`}
                value={bigForm.title[formLang]}
                onChange={(e) => setBigForm({ title: { ...bigForm.title, [formLang]: e.target.value } })}
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
              />
              <div className="flex gap-2">
                <button
                  onClick={addOrUpdateBig}
                  className="px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: "var(--color-hotel-blue)" }}
                >
                  {editBigIdx !== null ? "Yadda Saxla" : "Əlavə Et"}
                </button>
                {editBigIdx !== null && (
                  <button
                    onClick={() => { setEditBigIdx(null); setBigForm({ title: {az:"", en:"", ru:""} }); }}
                    className="px-4 py-2.5 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl"
                  >
                    Ləğv
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Big Attractions List */}
          {form.bigAttractions.length === 0 ? (
            <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">
              Böyük attraksion tapılmadı.
            </div>
          ) : form.bigAttractions.map((ba: any, bigIdx: number) => (
            <div key={`big-${bigIdx}-${ba.title?.az || ba.title}`} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              {/* Big Attraction Header */}
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-stone-50/50 transition-colors"
                onClick={() => setExpandedBig(expandedBig === bigIdx ? null : bigIdx)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ background: "linear-gradient(135deg, #1e325c, #00b5d5)" }}>
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e325c]">{typeof ba.title === 'object' ? ((ba.title as any)?.az || "") : ba.title}</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">{ba.games.length} şəkil / oyun</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveBigUp(bigIdx); }}
                    disabled={bigIdx === 0}
                    className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveBigDown(bigIdx); }}
                    disabled={bigIdx === form.bigAttractions.length - 1}
                    className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); startEditBig(bigIdx); }}
                    className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteBig(bigIdx); }}
                    className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedBig === bigIdx ? (
                    <ChevronUp className="w-5 h-5 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400" />
                  )}
                </div>
              </div>

              {/* Games (expanded) */}
              {expandedBig === bigIdx && (
                <div className="border-t border-stone-100 p-5 space-y-4 bg-stone-50/30">
                  {/* Add Game Form */}
                  <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-md font-bold text-[#1e325c] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {editGameIdx !== null && activeGameBigIdx === bigIdx ? "Şəkil/Oyunu Redaktə Et" : "Yeni Şəkil/Oyun Əlavə Et"}
                      </h5>
                      <LangSwitcher lang={formLang} setLang={setFormLang} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Şəkil/Oyun Adı [{formLang}]</label>
                        <input
                          placeholder="Məs: Tornado"
                          value={activeGameBigIdx === bigIdx || editGameIdx === null ? gameForm.name[formLang] : ""}
                          onChange={(e) => { setActiveGameBigIdx(bigIdx); setGameForm({ ...gameForm, name: { ...gameForm.name, [formLang]: e.target.value } }); }}
                          onFocus={() => { if (activeGameBigIdx !== bigIdx) { setGameForm({ name: {az:"",en:"",ru:""}, image: "", description: {az:"",en:"",ru:""} }); setEditGameIdx(null); setActiveGameBigIdx(bigIdx); } }}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#00b5d5]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Təsvir [{formLang}]</label>
                        <input
                          placeholder="Qısa təsvir..."
                          value={activeGameBigIdx === bigIdx || editGameIdx === null ? gameForm.description[formLang] : ""}
                          onChange={(e) => { setActiveGameBigIdx(bigIdx); setGameForm({ ...gameForm, description: { ...gameForm.description, [formLang]: e.target.value } }); }}
                          onFocus={() => { if (activeGameBigIdx !== bigIdx) { setGameForm({ name: {az:"",en:"",ru:""}, image: "", description: {az:"",en:"",ru:""} }); setEditGameIdx(null); setActiveGameBigIdx(bigIdx); } }}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#00b5d5]"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Şəkil</label>
                      <div className="flex items-center gap-3">
                        {gameForm.image && activeGameBigIdx === bigIdx && (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                            <img src={gameForm.image} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => setGameForm({ ...gameForm, image: "" })}
                              className="absolute inset-0 bg-black/40 text-white opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="relative flex-1">
                          <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-dashed border-stone-300 rounded-lg text-xs text-stone-400 hover:text-[#00b5d5] hover:border-[#00b5d5] transition-colors cursor-pointer">
                            <ImagePlus className="w-4 h-4" />
                            <span>Şəkil yüklə</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const data = await uploadImage(file);
                                if (data.success) {
                                  setActiveGameBigIdx(bigIdx);
                                  setGameForm((prev) => ({ ...prev, image: data.url }));
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
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => addOrUpdateGame(bigIdx)}
                        className="px-4 py-2 text-white text-xs font-bold rounded-lg transition-opacity hover:opacity-90"
                        style={{ background: "var(--color-hotel-blue)" }}
                      >
                        {editGameIdx !== null && activeGameBigIdx === bigIdx ? "Yadda Saxla" : "Əlavə Et"}
                      </button>
                      {editGameIdx !== null && activeGameBigIdx === bigIdx && (
                        <button
                          onClick={() => { setEditGameIdx(null); setGameForm({ name: {az:"",en:"",ru:""}, image: "", description: {az:"",en:"",ru:""} }); setActiveGameBigIdx(null); }}
                          className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-lg"
                        >
                          Ləğv
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Games List */}
                  {ba.games.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-4">Bu attraksiyonda hələ şəkil / oyun yoxdur</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ba.games.map((game: any, gameIdx: number) => (
                        <div key={`game-${gameIdx}-${game.name?.az || game.name}`} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                          {game.image && (
                            <div className="h-32 overflow-hidden">
                              <img src={game.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                          )}
                          <div className="p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-xs text-[#1e325c] truncate">{typeof game.name === 'object' ? ((game.name as any)?.az || "") : game.name}</h5>
                                <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-2">{typeof game.description === 'object' ? ((game.description as any)?.az || "") : game.description}</p>
                              </div>
                              <div className="flex gap-1 ml-2 shrink-0">
                                <button
                                  onClick={() => moveGameUp(bigIdx, gameIdx)}
                                  disabled={gameIdx === 0}
                                  className="p-1.5 bg-stone-50 text-stone-400 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => moveGameDown(bigIdx, gameIdx)}
                                  disabled={gameIdx === ba.games.length - 1}
                                  className="p-1.5 bg-stone-50 text-stone-400 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => startEditGame(bigIdx, gameIdx)}
                                  className="p-1.5 bg-stone-50 text-stone-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteGame(bigIdx, gameIdx)}
                                  className="p-1.5 bg-stone-50 text-stone-400 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FLOATING SAVE REMINDER */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-700 font-medium">
          Dəyişiklikləri saxlamaq üçün yuxarıdakı <strong>&quot;Hamısını Yadda Saxla&quot;</strong> düyməsinə basın. Saxlamadan çıxsanız dəyişikliklər itəcək.
        </p>
      </div>
    </div>
  );
}
