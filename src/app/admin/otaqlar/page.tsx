"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, BedDouble, Loader2, Pencil, X, Check, Tags } from "lucide-react";
import { 
  getRooms, createRoom, updateRoom, deleteRoom,
  getRoomTypes, createRoomType, updateRoomType, deleteRoomType,
  uploadImage
} from "@/services/api";
import type { Room, RoomType } from "@/types/api";

const emptyRoomForm = {
  name: "",
  type: "",
  description: "",
  price: 0,
  capacity: 2,
  amenities: "",
  isAvailable: true,
  images: [] as string[],
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"rooms" | "types">("rooms");

  // Room State
  const [editRoomId, setEditRoomId] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState(emptyRoomForm);

  // Room Type State
  const [editTypeId, setEditTypeId] = useState<string | null>(null);
  const [typeFormName, setTypeFormName] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [rData, tData] = await Promise.all([getRooms(), getRoomTypes()]);
      setRooms(rData);
      setRoomTypes(tData);
      if (tData.length > 0 && !roomForm.type) {
        setRoomForm(prev => ({ ...prev, type: tData[0]._id }));
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

  // ─── ROOM ACTIONS ───
  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.name || !roomForm.description || !roomForm.price || !roomForm.type) {
      alert("Bütün xanaları doldurun!");
      return;
    }
    
    const payload = {
      name: roomForm.name,
      type: roomForm.type,
      description: roomForm.description,
      price: Number(roomForm.price),
      capacity: Number(roomForm.capacity),
      amenities: roomForm.amenities.split(",").map((a) => a.trim()).filter(Boolean),
      isAvailable: roomForm.isAvailable,
      images: roomForm.images || []
    };

    try {
      if (editRoomId) {
        await updateRoom(editRoomId, payload);
      } else {
        await createRoom(payload);
      }
      setEditRoomId(null);
      setRoomForm({ ...emptyRoomForm, type: roomTypes[0]?._id || "" });
      loadData();
    } catch (err: any) {
      alert(err.message || "Otaq yadda saxlanılarkən xəta baş verdi");
    }
  };

  const startEditRoom = (room: Room) => {
    setEditRoomId(room._id);
    setRoomForm({
      name: room.name,
      type: room.type ? (typeof room.type === 'object' ? (room.type as any)._id : room.type) : "",
      description: room.description,
      price: room.price,
      capacity: room.capacity,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : "",
      isAvailable: room.isAvailable,
      images: room.images || [],
    });
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Bu otağı silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteRoom(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Silərkən xəta baş verdi");
    }
  };

  // ─── ROOM TYPE ACTIONS ───
  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeFormName) return;
    
    try {
      if (editTypeId) {
        await updateRoomType(editTypeId, typeFormName);
      } else {
        await createRoomType(typeFormName);
      }
      setEditTypeId(null);
      setTypeFormName("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Kateqoriya yadda saxlanılarkən xəta baş verdi");
    }
  };

  const startEditType = (type: RoomType) => {
    setEditTypeId(type._id);
    setTypeFormName(type.name);
  };

  const handleDeleteType = async (id: string) => {
    if (!confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteRoomType(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Silərkən xəta baş verdi");
    }
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1e325c]">Otaqların İdarə Edilməsi</h2>
          <p className="text-xs text-stone-400 mt-1">Otaqlar və Kateqoriyalar</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "rooms" ? "text-white" : "text-stone-500 hover:bg-stone-50"
            }`}
            style={activeTab === "rooms" ? { background: "var(--color-hotel-blue)" } : undefined}
          >
            <BedDouble className="w-4 h-4 inline-block mr-2" /> Otaqlar
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "types" ? "text-white" : "text-stone-500 hover:bg-stone-50"
            }`}
            style={activeTab === "types" ? { background: "var(--color-hotel-blue)" } : undefined}
          >
            <Tags className="w-4 h-4 inline-block mr-2" /> Kateqoriyalar
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl font-medium border border-rose-100">
          {error}
        </div>
      )}

      {activeTab === "rooms" && (
        <div className="space-y-6">
          {/* ROOM FORM */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="font-bold text-[#1e325c] text-sm mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
              {editRoomId ? "Otağı Redaktə Et" : "Yeni Otaq Əlavə Et"}
            </h3>
            {roomTypes.length === 0 ? (
              <p className="text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
                Əvvəlcə ən azı 1 "Kateqoriya" yaratmalısınız.
              </p>
            ) : (
              <form onSubmit={handleRoomSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  placeholder="Otaq adı"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <select
                  value={roomForm.type}
                  onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                >
                  {roomTypes.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qiymət (AZN)"
                  value={roomForm.price || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, price: Number(e.target.value) })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <input
                  type="number"
                  placeholder="Tutum (nəfər)"
                  value={roomForm.capacity}
                  onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <input
                  placeholder="Xidmətlər (vergüllə: Wi-Fi, Jakuzi)"
                  value={roomForm.amenities}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-2 focus:outline-none focus:border-[#00b5d5]"
                />
                <textarea
                  placeholder="Təsvir"
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-3 h-20 resize-none focus:outline-none focus:border-[#00b5d5]"
                />
                {editRoomId && (
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-600 md:col-span-3">
                    <input
                      type="checkbox"
                      checked={roomForm.isAvailable}
                      onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })}
                    />
                    Mövcuddur (Müştərilər bron edə bilər)
                  </label>
                )}
                <div className="md:col-span-3 flex flex-col gap-2">
                  <p className="text-xs font-bold text-[#1e325c]">Otaq Şəkilləri</p>
                  <div className="flex flex-wrap gap-2">
                    {roomForm.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 group rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setRoomForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="relative w-20 h-20 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-[#00b5d5] hover:border-[#00b5d5] hover:bg-[#00b5d5]/5 transition-all cursor-pointer bg-stone-50">
                      <Plus className="w-5 h-5 mb-1" />
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
                              setRoomForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
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
                <div className="flex gap-2 md:col-span-3 mt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-opacity hover:opacity-90"
                    style={{ background: "var(--color-hotel-blue)" }}
                  >
                    {editRoomId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editRoomId ? "Yadda Saxla" : "Otaq Yarat"}
                  </button>
                  {editRoomId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditRoomId(null);
                        setRoomForm({ ...emptyRoomForm, type: roomTypes[0]?._id || "" });
                      }}
                      className="px-5 py-2.5 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Ləğv et
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* ROOMS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.length === 0 ? (
               <div className="col-span-full py-10 text-center text-stone-400 text-sm">Otaq tapılmadı</div>
            ) : rooms.map((room) => (
              <div key={room._id} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                    <h4 className="font-bold text-sm text-[#1e325c]">{room.name}</h4>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEditRoom(room)} className="p-1.5 text-stone-400 hover:text-[#1e325c] rounded-lg hover:bg-stone-50">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteRoom(room._id)} className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00b5d5] mb-1">
                  {room.type ? (typeof room.type === 'object' ? (room.type as any).name : room.type) : "Kateqoriya silinib"}
                </p>
                <p className="text-xs text-stone-500 line-clamp-2 mb-3">{room.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {Array.isArray(room.amenities) && room.amenities.map((a, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-stone-50 border border-stone-100 rounded-full text-stone-500">
                      {a}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold" style={{ color: "var(--color-hotel-blue)" }}>{room.price} AZN / gecə</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${room.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {room.isAvailable ? "Mövcud" : "Dolu"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "types" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <h3 className="font-bold text-[#1e325c] text-sm mb-4">
                {editTypeId ? "Kateqoriyanı Redaktə Et" : "Yeni Kateqoriya"}
              </h3>
              <form onSubmit={handleTypeSubmit} className="space-y-4">
                <input
                  placeholder="Kateqoriya adı (məs: Deluxe)"
                  value={typeFormName}
                  onChange={(e) => setTypeFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90" style={{ background: "var(--color-hotel-blue)" }}>
                    {editTypeId ? "Yadda Saxla" : "Əlavə Et"}
                  </button>
                  {editTypeId && (
                    <button type="button" onClick={() => { setEditTypeId(null); setTypeFormName(""); }} className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl">
                      Ləğv
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-3">
             {roomTypes.length === 0 ? (
               <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">Kateqoriya tapılmadı</div>
             ) : roomTypes.map((type) => (
                <div key={type._id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#00b5d5]">
                      <Tags className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#1e325c]">{type.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditType(type)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteType(type._id)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}