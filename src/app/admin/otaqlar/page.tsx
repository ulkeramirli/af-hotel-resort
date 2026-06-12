"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, BedDouble, Loader2 } from "lucide-react";

interface Room {
  id: number;
  name: string;
  type: string;
  status: string;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Поля формы для создания новой комнаты
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");

  // Чистый useEffect: вся логика фетча изолирована внутри, чтобы ESLint не ругался
  useEffect(() => {
    let isMounted = true;

    async function startFetching() {
      try {
        const res = await fetch("/api/bookings", {
          headers: { "Authorization": "Bearer af-hotel-super-secret-token" }
        });
        const data = await res.json();
        
        if (isMounted) {
          setRooms(data.rooms || []);
        }
      } catch (err) {
        console.error("Otaqlar yüklənmədi:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    startFetching();

    return () => {
      isMounted = false;
    };
  }, []); // Пустой массив зависимостей — сработает один раз при старте

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !roomName || !roomType) return alert("Bütün xanaları doldurun!");

    const newRoom = {
      id: Number(roomId),
      name: roomName,
      type: roomType,
      status: "Boş"
    };

    // Оптимистичное обновление для мгновенного рендера на экране
    setRooms(prev => [...prev, newRoom]);

    try {
      await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom)
      });
      
      setRoomId("");
      setRoomName("");
      setRoomType("");
    } catch (err) {
      console.error("Otaq yaradıla bilmədi:", err);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm("Bu otağı silmək istədiyinizə əminsiniz?")) return;

    setRooms(prev => prev.filter(r => r.id !== id));

    try {
      await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Otaq silinmədi:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ФОРМА ДОБАВЛЕНИЯ НОВОЙ КОМНАТЫ */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#00b4d8]" /> Yeni Otaq Əlavə Et
        </h3>
        <form onSubmit={handleCreateRoom} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Otaq Nömrəsi</label>
            <input 
              type="number" 
              placeholder="Məsələn: 305" 
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00b4d8] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Otağın Adı</label>
            <input 
              type="text" 
              placeholder="Məsələn: Premium Suite 305" 
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00b4d8] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Təsvir və Qiymət</label>
            <input 
              type="text" 
              placeholder="Məsələn: 3 nəfər · 160 AZN/gecə" 
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#00b4d8] focus:bg-white transition-all"
            />
          </div>
          <button type="submit" className="bg-[#00b4d8] hover:bg-[#0077b6] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
            Baza Yadda Saxla
          </button>
        </form>
      </div>

      {/* СПИСОК ВСЕХ КОМНАТ */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 text-base mb-4">Sistemdə olan otaqlar ({rooms.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map(room => (
            <div key={room.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-start group hover:bg-white hover:border-gray-200 transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-gray-400 group-hover:text-[#00b4d8]" />
                  <h4 className="font-bold text-sm text-gray-800">{room.name}</h4>
                </div>
                <p className="text-xs text-gray-400 font-medium">{room.type}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-2 ${
                  room.status === "Boş" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}>{room.status}</span>
              </div>
              <button 
                onClick={() => handleDeleteRoom(room.id)}
                className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}