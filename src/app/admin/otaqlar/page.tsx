/* eslint-disable @next/next/no-img-element, react-hooks/set-state-in-effect, react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";

import { Plus, Trash2, BedDouble, Loader2, Pencil, X, Check, Tags, Globe } from "lucide-react";
import { 
  getRooms, createRoom, updateRoom, deleteRoom,
  getRoomTypes, createRoomType, updateRoomType, deleteRoomType,
  uploadImage,
  getRoomSettings, updateRoomSettings
} from "@/services/api";

import type { Room, RoomType, RoomSettings } from "@/types/api";

const emptyRoomForm = {
  name: { az: "", en: "", ru: "" },
  type: "",
  description: { az: "", en: "", ru: "" },
  price: 0,
  capacity: 2,
  amenities: { az: "", en: "", ru: "" },
  beds: 1,
  baths: 1,
  sqft: 350,
  address: "AF Hotel & Aqua Park, Novkhani, Azerbaijan",
  rating: 4.9,
  reviewsCount: 245,
  rulesCheckIn: { az: "", en: "", ru: "" },
  rulesCheckOut: { az: "", en: "", ru: "" },
  isAvailable: true,
  images: [] as string[],
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

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editRoomId, setEditRoomId] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState({ ...emptyRoomForm });
  const [activeTab, setActiveTab] = useState<"rooms" | "types" | "settings">("rooms");

  const [formLang, setFormLang] = useState<"az" | "en" | "ru">("az");

  const loc = (obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj.az || obj.en || obj.ru || "";
  };

  // Room Type State
  const [editTypeId, setEditTypeId] = useState<string | null>(null);
  const [typeFormName, setTypeFormName] = useState({ az: "", en: "", ru: "" });

  // Room Settings State
  const [settingsForm, setSettingsForm] = useState<any>({ 
    tag: { az: "", en: "", ru: "" }, 
    title: { az: "", en: "", ru: "" }, 
    subtitle: { az: "", en: "", ru: "" } 
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rData, tData, sData] = await Promise.all([getRooms(), getRoomTypes(), getRoomSettings()]);
      setRooms(rData);
      setRoomTypes(tData);
      if (sData) {
        setSettingsForm({
          tag: typeof sData.tag === 'object' ? sData.tag : { az: sData.tag, en: sData.tag, ru: sData.tag },
          title: typeof sData.title === 'object' ? sData.title : { az: sData.title, en: sData.title, ru: sData.title },
          subtitle: typeof sData.subtitle === 'object' ? sData.subtitle : { az: sData.subtitle, en: sData.subtitle, ru: sData.subtitle }
        });
      }
      if (tData.length > 0) {
        setRoomForm(prev => prev.type ? prev : ({ ...prev, type: tData[0]._id }));
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
    if (!roomForm.name.az || !roomForm.description.az || !roomForm.price || !roomForm.type) {
      alert("Ən azı AZ dilində məlumatları və qiyməti daxil edin!");
      return;
    }
    
    const splitAmenities = (str: string) => (str||"").split(",").map((a) => a.trim()).filter(Boolean);
    const azArr = splitAmenities(roomForm.amenities.az);
    const enArr = splitAmenities(roomForm.amenities.en);
    const ruArr = splitAmenities(roomForm.amenities.ru);
    const maxLen = Math.max(azArr.length, enArr.length, ruArr.length);
    const mappedAmenities = [];
    for(let i=0; i<maxLen; i++) {
        if(azArr[i] || enArr[i] || ruArr[i]) {
            mappedAmenities.push({ az: azArr[i]||"", en: enArr[i]||"", ru: ruArr[i]||"" });
        }
    }

    const payload = {
      name: roomForm.name,
      type: roomForm.type,
      description: roomForm.description,
      price: Number(roomForm.price),
      capacity: Number(roomForm.capacity),
      amenities: mappedAmenities,
      isAvailable: roomForm.isAvailable,
      images: roomForm.images || [],
      beds: Number(roomForm.beds) || 1,
      baths: Number(roomForm.baths) || 1,
      sqft: Number(roomForm.sqft) || 350,
      rulesCheckIn: roomForm.rulesCheckIn,
      rulesCheckOut: roomForm.rulesCheckOut,
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
    let amAz = "", amEn = "", amRu = "";
    if (Array.isArray(room.amenities)) {
      amAz = room.amenities.map((a:any) => typeof a === 'object' ? a.az : a).filter(Boolean).join(", ");
      amEn = room.amenities.map((a:any) => typeof a === 'object' ? a.en : a).filter(Boolean).join(", ");
      amRu = room.amenities.map((a:any) => typeof a === 'object' ? a.ru : a).filter(Boolean).join(", ");
    }
    setRoomForm({
      ...emptyRoomForm,
      name: typeof room.name === 'object' ? room.name : { az: room.name, en: room.name, ru: room.name },
      type: room.type ? (typeof room.type === 'object' ? (room.type as any)._id : room.type) : "",
      description: typeof room.description === 'object' ? room.description : { az: room.description, en: room.description, ru: room.description },
      price: room.price,
      capacity: room.capacity,
      amenities: { az: amAz, en: amEn, ru: amRu },
      isAvailable: room.isAvailable,
      images: room.images || [],
      beds: room.beds || 1,
      baths: room.baths || 1,
      sqft: room.sqft || 350,
      rulesCheckIn: typeof room.rulesCheckIn === 'object' ? room.rulesCheckIn : { az: room.rulesCheckIn||"", en: room.rulesCheckIn||"", ru: room.rulesCheckIn||"" },
      rulesCheckOut: typeof room.rulesCheckOut === 'object' ? room.rulesCheckOut : { az: room.rulesCheckOut||"", en: room.rulesCheckOut||"", ru: room.rulesCheckOut||"" },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (!typeFormName.az) return;
    try {
      if (editTypeId) {
        await updateRoomType(editTypeId, typeFormName);
      } else {
        await createRoomType(typeFormName);
      }
      setEditTypeId(null);
      setTypeFormName({ az: "", en: "", ru: "" });
      loadData();
    } catch (err: any) {
      alert(err.message || "Kateqoriya yadda saxlanılarkən xəta baş verdi");
    }
  };

  const startEditType = (type: RoomType) => {
    setEditTypeId(type._id);
    setTypeFormName(typeof type.name === 'object' ? type.name : { az: type.name, en: type.name, ru: type.name } as any);
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

  // ─── SETTINGS ACTIONS ───
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await updateRoomSettings(settingsForm);
      alert("Tənzimləmələr uğurla yeniləndi");
      loadData();
    } catch (err: any) {
      alert(err.message || "Yadda saxlanılarkən xəta baş verdi");
    } finally {
      setSavingSettings(false);
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
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "settings" ? "text-white" : "text-stone-500 hover:bg-stone-50"
            }`}
            style={activeTab === "settings" ? { background: "var(--color-hotel-blue)" } : undefined}
          >
            <Check className="w-4 h-4 inline-block mr-2" /> Başlıqlar
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                {editRoomId ? "Otağı Redaktə Et" : "Yeni Otaq Əlavə Et"}
              </h3>
              <LangSwitcher lang={formLang} setLang={setFormLang} />
            </div>
            
            {roomTypes.length === 0 ? (
              <p className="text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
                Əvvəlcə ən azı 1 "Kateqoriya" yaratmalısınız.
              </p>
            ) : (
              <form onSubmit={handleRoomSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  placeholder={`Otaq adı (${formLang.toUpperCase()})`}
                  value={roomForm.name[formLang]}
                  onChange={(e) => setRoomForm({ ...roomForm, name: { ...roomForm.name, [formLang]: e.target.value } })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <select
                  value={roomForm.type}
                  onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                >
                  {roomTypes.map((t) => (
                    <option key={t._id} value={t._id}>{loc(t.name)}</option>
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
                  placeholder={`Xidmətlər (vergüllə: Wi-Fi, Jakuzi) (${formLang.toUpperCase()})`}
                  value={roomForm.amenities[formLang]}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: { ...roomForm.amenities, [formLang]: e.target.value } })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-2 focus:outline-none focus:border-[#00b5d5]"
                />
                <textarea
                  placeholder={`Təsvir (${formLang.toUpperCase()})`}
                  value={roomForm.description[formLang]}
                  onChange={(e) => setRoomForm({ ...roomForm, description: { ...roomForm.description, [formLang]: e.target.value } })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-3 h-20 resize-none focus:outline-none focus:border-[#00b5d5]"
                />
                <input
                  type="number"
                  placeholder="Yataq sayı"
                  value={roomForm.beds || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, beds: Number(e.target.value) })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <input
                  type="number"
                  placeholder="Hamam sayı"
                  value={roomForm.baths || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, baths: Number(e.target.value) })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <input
                  type="number"
                  placeholder="Sahə (sqft)"
                  value={roomForm.sqft || ""}
                  onChange={(e) => setRoomForm({ ...roomForm, sqft: Number(e.target.value) })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <textarea
                  placeholder={`Bron Qaydaları (Giriş) (${formLang.toUpperCase()})`}
                  value={roomForm.rulesCheckIn[formLang]}
                  onChange={(e) => setRoomForm({ ...roomForm, rulesCheckIn: { ...roomForm.rulesCheckIn, [formLang]: e.target.value } })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-3 h-16 resize-none focus:outline-none focus:border-[#00b5d5]"
                />
                <textarea
                  placeholder={`Bron Qaydaları (Çıxış) (${formLang.toUpperCase()})`}
                  value={roomForm.rulesCheckOut[formLang]}
                  onChange={(e) => setRoomForm({ ...roomForm, rulesCheckOut: { ...roomForm.rulesCheckOut, [formLang]: e.target.value } })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-3 h-16 resize-none focus:outline-none focus:border-[#00b5d5]"
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
                
                {/* Images remain the same */}
                <div className="md:col-span-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#1e325c]">Otaq Şəkilləri <span className="text-stone-400 font-normal">({roomForm.images.length} şəkil)</span></p>
                  </div>
                  {roomForm.images.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {roomForm.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square group rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setRoomForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                            className="absolute inset-0 bg-black/55 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center py-4 text-stone-400 hover:text-[#00b5d5] hover:border-[#00b5d5] hover:bg-[#00b5d5]/5 transition-all cursor-pointer bg-stone-50">
                    <span className="text-xs font-semibold">Şəkil seçin (birdən çox ola bilər)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        for (const file of files) {
                          try {
                            const data = await uploadImage(file);
                            if (data.success) {
                              setRoomForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
                            }
                          } catch {}
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>
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
              <div key={room._id} className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {room.images && room.images.length > 0 && (
                  <div className="relative h-36 w-full bg-stone-100">
                    <img src={room.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                    <h4 className="font-bold text-sm text-[#1e325c]">{loc(room.name)}</h4>
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
                  {room.type ? (typeof room.type === 'object' ? loc((room.type as any).name) : room.type) : "Kateqoriya silinib"}
                </p>
                <p className="text-xs text-stone-500 line-clamp-2 mb-3">{loc(room.description)}</p>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e325c] text-sm">
                  {editTypeId ? "Kateqoriyanı Redaktə Et" : "Yeni Kateqoriya"}
                </h3>
                <LangSwitcher lang={formLang} setLang={setFormLang} />
              </div>
              
              <form onSubmit={handleTypeSubmit} className="space-y-4">
                <input
                  placeholder={`Kateqoriya adı (${formLang.toUpperCase()})`}
                  value={(typeFormName as any)[formLang]}
                  onChange={(e) => setTypeFormName({ ...typeFormName, [formLang]: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90" style={{ background: "var(--color-hotel-blue)" }}>
                    {editTypeId ? "Yadda Saxla" : "Əlavə Et"}
                  </button>
                  {editTypeId && (
                    <button type="button" onClick={() => { setEditTypeId(null); setTypeFormName({az:"", en:"", ru:""}); }} className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl">
                      Ləğv
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-3">
             {roomTypes.map((type) => (
                <div key={type._id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#1e325c]">{loc(type.name)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditType(type)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteType(type._id)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1e325c]">Səhifə Başlıqları</h3>
            <LangSwitcher lang={formLang} setLang={setFormLang} />
          </div>
          
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Tag (Üst Başlıq) [{formLang.toUpperCase()}]</label>
              <input
                value={settingsForm.tag[formLang]}
                onChange={(e) => setSettingsForm({ ...settingsForm, tag: { ...settingsForm.tag, [formLang]: e.target.value } })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Əsas Başlıq [{formLang.toUpperCase()}]</label>
              <input
                value={settingsForm.title[formLang]}
                onChange={(e) => setSettingsForm({ ...settingsForm, title: { ...settingsForm.title, [formLang]: e.target.value } })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Alt Başlıq [{formLang.toUpperCase()}]</label>
              <textarea
                value={settingsForm.subtitle[formLang]}
                onChange={(e) => setSettingsForm({ ...settingsForm, subtitle: { ...settingsForm.subtitle, [formLang]: e.target.value } })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs h-24 resize-none focus:outline-none focus:border-[#00b5d5]"
              />
            </div>
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-2"
                style={{ background: "var(--color-hotel-blue)" }}
              >
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {savingSettings ? "Yadda saxlanılır..." : "Yadda Saxla"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}