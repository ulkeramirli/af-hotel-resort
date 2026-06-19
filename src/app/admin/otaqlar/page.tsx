"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, BedDouble, Loader2, Pencil, X, Check } from "lucide-react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/services/api";
import type { Room, RoomType } from "@/types/api";

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "standard", label: "Standart" },
  { value: "deluxe", label: "Deluxe" },
  { value: "cottage", label: "Kotec" },
];

const emptyForm = {
  name: "",
  type: "standard" as RoomType,
  description: "",
  price: 0,
  capacity: 2,
  amenities: "",
  isAvailable: true,
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;
    getRooms()
      .then((data) => { if (!cancelled) setRooms(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const refresh = () => getRooms().then(setRooms);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      alert("Bütün xanaları doldurun!");
      return;
    }
    await createRoom({
      name: form.name,
      type: form.type,
      description: form.description,
      price: Number(form.price),
      capacity: Number(form.capacity),
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    });
    setForm(emptyForm);
    refresh();
  };

  const handleUpdate = async (id: string) => {
    await updateRoom(id, {
      name: form.name,
      type: form.type,
      description: form.description,
      price: Number(form.price),
      capacity: Number(form.capacity),
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      isAvailable: form.isAvailable,
    });
    setEditId(null);
    setForm(emptyForm);
    refresh();
  };

  const startEdit = (room: Room) => {
    setEditId(room._id);
    setForm({
      name: room.name,
      type: room.type,
      description: room.description,
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities.join(", "),
      isAvailable: room.isAvailable,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu otağı silmək istədiyinizə əminsiniz?")) return;
    await deleteRoom(id);
    refresh();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "var(--color-hotel-blue)" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Otaqların İdarə Edilməsi</h2>
        <p className="text-xs text-stone-400 mt-1">Mock data — POST/PUT/DELETE /rooms</p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <h3 className="font-bold text-[#1e325c] text-sm mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
          {editId ? "Otağı Redaktə Et" : "Yeni Otaq Əlavə Et"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editId) void handleUpdate(editId);
            else void handleCreate(e);
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <input
            placeholder="Otaq adı"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as RoomType })}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
          >
            {ROOM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Qiymət (AZN)"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
          />
          <input
            type="number"
            placeholder="Tutum (nəfər)"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
          />
          <input
            placeholder="Amenities (vergüllə: Wi-Fi, Jakuzi)"
            value={form.amenities}
            onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-2 focus:outline-none focus:border-[#00b5d5]"
          />
          <textarea
            placeholder="Təsvir"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-3 h-20 resize-none focus:outline-none focus:border-[#00b5d5]"
          />
          {editId && (
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-600">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              />
              Mövcuddur (isAvailable)
            </label>
          )}
          <div className="flex gap-2 md:col-span-3">
            <button
              type="submit"
              className="px-5 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: "var(--color-hotel-blue)" }}
            >
              {editId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editId ? "Yadda Saxla" : "Otaq Yarat"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm(emptyForm);
                }}
                className="px-5 py-2.5 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Ləğv et
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <BedDouble
                  className="w-4 h-4"
                  style={{ color: "var(--color-hotel-gold)" }}
                />
                <h4 className="font-bold text-sm text-[#1e325c]">{room.name}</h4>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(room)}
                  className="p-1.5 text-stone-400 hover:text-[#1e325c] rounded-lg hover:bg-stone-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#00b5d5] mb-1">
              {room.type}
            </p>
            <p className="text-xs text-stone-500 line-clamp-2 mb-3">{room.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {room.amenities.map((a) => (
                <span
                  key={a}
                  className="text-[10px] px-2 py-0.5 bg-stone-50 border border-stone-100 rounded-full text-stone-500"
                >
                  {a}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span
                className="text-sm font-bold"
                style={{ color: "var(--color-hotel-blue)" }}
              >
                {room.price} AZN / gecə
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  room.isAvailable
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {room.isAvailable ? "Mövcud" : "Dolu"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}