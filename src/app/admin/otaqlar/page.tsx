"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Pencil,
  X,
  Check,
  MapPin,
} from "lucide-react";
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
  beds: 1,
  baths: 1,
  sqft: 350,
  address: "AF Hotel & Aqua Park, Novkhani, Azerbaijan",
  rating: 4.9,
  reviewsCount: 245,
  images: "",
  rulesCheckIn: "",
  rulesCheckOut: "",
  isAvailable: true,
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;
    getRooms()
      .then((data) => {
        if (!cancelled) setRooms(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    const data = await getRooms();
    setRooms(data);
  };

  // Сборка и парсинг объекта перед отправкой на бэкенд
  const prepareRoomData = () => {
    return {
      name: form.name,
      type: form.type,
      description: form.description,
      price: Number(form.price),
      capacity: Number(form.capacity),
      beds: Number(form.beds),
      baths: Number(form.baths),
      sqft: Number(form.sqft),
      address: form.address,
      rating: Number(form.rating),
      reviewsCount: Number(form.reviewsCount),
      isAvailable: form.isAvailable,
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      images: form.images
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      rulesCheckIn: form.rulesCheckIn
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      rulesCheckOut: form.rulesCheckOut
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
    };
  };

  const handleCreate = async () => {
    if (!form.name || !form.description || !form.price) {
      alert("Bütün xanaları doldurun!");
      return;
    }

    try {
      setSubmitting(true);
      const newRoomData = prepareRoomData();
      await createRoom(newRoomData);
      setForm(emptyForm);
      await refresh();
    } catch (error) {
      console.error(error);
      alert("Xəta baş verdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!form.name || !form.description || !form.price) {
      alert("Bütün xanaları doldurun!");
      return;
    }

    try {
      setSubmitting(true);
      const updatedRoomData = prepareRoomData() as Partial<Room>;
      await updateRoom(id, updatedRoomData);
      setEditId(null);
      setForm(emptyForm);
      await refresh();
    } catch (error) {
      console.error(error);
      alert("Xəta baş verdi");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (room: Room) => {
    const roomWithExtras = room as Room & {
      beds?: number;
      baths?: number;
      sqft?: number;
      amenities?: string[];
      address?: string;
      images?: string[];
      rulesCheckIn?: string[];
      rulesCheckOut?: string[];
      rating?: number;
      reviewsCount?: number;
    };

    setEditId(room._id);
    setForm({
      name: roomWithExtras.name,
      type: roomWithExtras.type,
      description: roomWithExtras.description,
      price: roomWithExtras.price,
      capacity: roomWithExtras.capacity,
      amenities: roomWithExtras.amenities?.join(", ") || "",
      beds: roomWithExtras.beds ?? 1,
      baths: roomWithExtras.baths ?? 1,
      sqft: roomWithExtras.sqft ?? 350,
      address: roomWithExtras.address || "",
      rating: roomWithExtras.rating || 4.9,
      reviewsCount: roomWithExtras.reviewsCount || 0,
      images: roomWithExtras.images?.join(", ") || "",
      rulesCheckIn: roomWithExtras.rulesCheckIn?.join(", ") || "",
      rulesCheckOut: roomWithExtras.rulesCheckOut?.join(", ") || "",
      isAvailable: roomWithExtras.isAvailable !== undefined ? roomWithExtras.isAvailable : true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu otağı silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteRoom(id);
      await refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      void handleUpdate(editId);
    } else {
      void handleCreate();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b5d5]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">
          Otaqların İdarə Edilməsi
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Premium Kart xüsusiyyətləri ilə birgə sinxronizasiya (Spesifikasiyalar, Qaydalar, Foto)
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <h3 className="font-bold text-[#1e325c] text-sm mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#00b5d5]" />
          {editId ? "Otağı Redaktə Et" : "Yeni Premium Otaq Əlavə Et"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Otaq Adı
            </label>
            <input
              placeholder="Otaq adı (örn: Standard Rooms)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Tipi
            </label>
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
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Qiymət (AZN)
            </label>
            <input
              type="number"
              placeholder="Qiymət (AZN)"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Yataq Sayı (Beds)
            </label>
            <input
              type="number"
              placeholder="Yataq sayı (Beds)"
              value={form.beds}
              onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Hamam Sayı (Baths)
            </label>
            <input
              type="number"
              placeholder="Hamam sayısı (Baths)"
              value={form.baths}
              onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Sahə (Sqft)
            </label>
            <input
              type="number"
              placeholder="Sahə (Sqft)"
              value={form.sqft}
              onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Reytinq
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Reytinq (örn: 4.9)"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Rəy Sayı
            </label>
            <input
              type="number"
              placeholder="Rəy sayı (Reviews Count)"
              value={form.reviewsCount}
              onChange={(e) => setForm({ ...form, reviewsCount: Number(e.target.value) })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Maksimum Nəfər (Capacity)
            </label>
            <input
              type="number"
              placeholder="Maksimum tutum (Nəfər)"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          {/* Исправлен col-span под сетку grid-cols-3 */}
          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Ünvan / Yerləşmə
            </label>
            <input
              placeholder="Ünvan (Address)"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Üstünlüklər (vergüllə)
            </label>
            <input
              placeholder="Amenities (vergüllə: Air Conditioning, Flat-Screen TV, High-Speed Wi-Fi)"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Şəkil linkləri (vergüllə)
            </label>
            <input
              placeholder="Şəkillər (vergüllə URL: /room1.jpg, /room2.jpg)"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          {/* Вместо md:col-span-1.5 применены корректные классы колонок */}
          <div className="flex flex-col gap-1 md:col-span-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Check-In Qaydaları
            </label>
            <input
              placeholder="Check-In Qaydaları (vergüllə: Örnək 1, Örnək 2)"
              value={form.rulesCheckIn}
              onChange={(e) => setForm({ ...form, rulesCheckIn: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Check-Out Qaydaları
            </label>
            <input
              placeholder="Check-Out Qaydaları (vergüllə: Örnək 1, Örnək 2)"
              value={form.rulesCheckOut}
              onChange={(e) => setForm({ ...form, rulesCheckOut: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase pl-1">
              Geniş Təsvir (Overview)
            </label>
            <textarea
              placeholder="Geniş təsvir (Overview)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs h-20 resize-none focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 md:col-span-2 lg:col-span-3 py-1">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              className="w-4 h-4 accent-[#00b5d5]"
            />
            <span>Mövcuddur (isAvailable)</span>
          </div>

          <div className="flex gap-2 md:col-span-2 lg:col-span-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-2 bg-[#1e325c] hover:opacity-95 cursor-pointer transition-opacity disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editId ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {editId ? "Yadda Saxla" : "Otaq Yarat"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm(emptyForm);
                }}
                className="px-5 py-2.5 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors hover:bg-stone-200"
              >
                <X className="w-4 h-4" /> Ləğv et
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Список комнат */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm text-[#1e325c]">{room.name}</h4>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(room)}
                  className="p-1 text-stone-400 hover:text-[#1e325c] rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => void handleDelete(room._id)}
                  className="p-1 text-stone-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-500 line-clamp-1 mb-2">
              {room.description}
            </p>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs font-bold text-[#00b5d5]">
                {room.price} AZN / gecə
              </div>
              <div className="text-[10px] text-stone-400 font-medium bg-stone-50 px-2 py-0.5 rounded-md border border-stone-100">
                {room.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}