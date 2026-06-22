/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Pencil, Ticket as TicketIcon } from "lucide-react";
import { getTickets, createTicket, updateTicket, deleteTicket } from "@/services/api";
import type { Ticket } from "@/types/api";

const emptyTicketForm = {
  name: "",
  price: 0,
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTicketForm);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || "Biletlər yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price < 0) {
      alert("Ad və qiymət düzgün qeyd olunmalıdır!");
      return;
    }
    
    try {
      if (editId) {
        await updateTicket(editId, form);
      } else {
        await createTicket(form);
      }
      setEditId(null);
      setForm(emptyTicketForm);
      loadData();
    } catch (err: any) {
      alert(err.message || "Bilet yadda saxlanılarkən xəta baş verdi");
    }
  };

  const startEdit = (ticket: Ticket) => {
    setEditId(ticket._id);
    setForm({
      name: ticket.name,
      price: ticket.price,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu bileti silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteTicket(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Silərkən xəta baş verdi");
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Biletlərin İdarə Edilməsi</h2>
        <p className="text-xs text-stone-400 mt-1">Aquapark və digər giriş biletləri</p>
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
            <h3 className="font-bold text-[#1e325c] text-sm mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
              {editId ? "Bileti Redaktə Et" : "Yeni Bilet Əlavə Et"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Biletin Adı</label>
                <input
                  placeholder="Məs: Aquapark (Böyüklər üçün)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Qiymət (AZN)</label>
                <input
                  type="number"
                  placeholder="Məs: 20"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
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
                    onClick={() => { setEditId(null); setForm(emptyTicketForm); }}
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
          {tickets.length === 0 ? (
            <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">
              Bilet tapılmadı
            </div>
          ) : tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "var(--color-hotel-blue)" }}>
                  <TicketIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1e325c]">{ticket.name}</h4>
                  <p className="text-xs font-semibold text-stone-500 mt-1">
                    <span className="text-[#00b5d5]">{ticket.price} AZN</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(ticket)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ticket._id)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
