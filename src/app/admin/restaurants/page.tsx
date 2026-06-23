/* eslint-disable @next/next/no-img-element, react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Pencil,
  X,
  UtensilsCrossed,
  Clock,
  Phone,
  ChevronDown,
  ChevronUp,
  Search,
  ImagePlus,
  FolderPlus,
  ShoppingBag,
  ArrowLeft,
  Settings,
} from "lucide-react";
import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  uploadImage,
  getRestaurantSettings,
  updateRestaurantSettings,
} from "@/services/api";
import type {
  Restaurant,
  MenuCategory,
  MenuItem,
  RestaurantWorkingHours,
  RestaurantSettings,
} from "@/types/api";

// ─── EMPTY FORMS ───
const emptyWorkingHours: RestaurantWorkingHours = { breakfast: "", lunch: "", dinner: "" };

const emptyRestaurantForm = {
  name: "",
  image: "",
  description: "",
  workingHours: { ...emptyWorkingHours },
  phone: "",
};

type ViewMode = "list" | "edit";

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── View mode ───
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  // ─── Restaurant form ───
  const [restForm, setRestForm] = useState(emptyRestaurantForm);
  const [restFormImage, setRestFormImage] = useState("");
  const [saving, setSaving] = useState(false);

  // ─── Menu editing (inside restaurant edit view) ───
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);

  // Category form
  const [catForm, setCatForm] = useState({ name: "" });
  const [editCatIdx, setEditCatIdx] = useState<number | null>(null);

  // Item form
  const [itemForm, setItemForm] = useState({ name: "", description: "", price: 0, image: "" });
  const [editItemIdx, setEditItemIdx] = useState<number | null>(null);
  const [activeItemCatIdx, setActiveItemCatIdx] = useState<number | null>(null);

  // ─── Search ───
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Settings ───
  const [settingsForm, setSettingsForm] = useState<RestaurantSettings>({ tag: "", title: "", subtitle: "" });
  const [savingSettings, setSavingSettings] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, settingsData] = await Promise.all([
        getRestaurants(),
        getRestaurantSettings(),
      ]);
      setRestaurants(data);
      setSettingsForm(settingsData);
    } catch (err: any) {
      setError(err.message || "Məlumatlar yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      await updateRestaurantSettings(settingsForm);
      alert("Tənzimləmələr uğurla yadda saxlanıldı!");
    } catch (err: any) {
      alert(err.message || "Tənzimləmələr yadda saxlanılarkən xəta baş verdi");
    } finally {
      setSavingSettings(false);
    }
  };

  // ─── RESTAURANT CRUD ───
  const handleCreateRestaurant = async () => {
    if (!restForm.name) {
      alert("Restoran adı daxil edilməlidir!");
      return;
    }
    try {
      setSaving(true);
      await createRestaurant({
        ...restForm,
        image: restFormImage,
        menu: [],
      });
      setRestForm(emptyRestaurantForm);
      setRestFormImage("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Restoran yaradılarkən xəta");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (!confirm("Bu restoranı silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteRestaurant(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Silərkən xəta baş verdi");
    }
  };

  const openEditRestaurant = (rest: Restaurant) => {
    setEditingRestaurant(rest);
    setRestForm({
      name: rest.name,
      image: rest.image,
      description: rest.description,
      workingHours: rest.workingHours || { ...emptyWorkingHours },
      phone: rest.phone || "",
    });
    setRestFormImage(rest.image || "");
    setMenuCategories(rest.menu || []);
    setViewMode("edit");
    setExpandedCat(null);
    setEditCatIdx(null);
    setEditItemIdx(null);
    setActiveItemCatIdx(null);
  };

  const handleSaveRestaurant = async () => {
    if (!editingRestaurant) return;
    try {
      setSaving(true);
      await updateRestaurant(editingRestaurant._id, {
        name: restForm.name,
        image: restFormImage,
        description: restForm.description,
        workingHours: restForm.workingHours,
        phone: restForm.phone,
        menu: menuCategories,
      });
      alert("Restoran uğurla yeniləndi!");
      setViewMode("list");
      setEditingRestaurant(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Yadda saxlanılarkən xəta");
    } finally {
      setSaving(false);
    }
  };

  const goBackToList = () => {
    setViewMode("list");
    setEditingRestaurant(null);
    setRestForm(emptyRestaurantForm);
    setRestFormImage("");
    setMenuCategories([]);
  };

  // ─── MENU CATEGORY HELPERS ───
  const addOrUpdateCategory = () => {
    if (!catForm.name) {
      alert("Kateqoriya adı daxil edilməlidir!");
      return;
    }
    const updated = [...menuCategories];
    if (editCatIdx !== null) {
      updated[editCatIdx] = { ...updated[editCatIdx], name: catForm.name };
      setEditCatIdx(null);
    } else {
      updated.push({ name: catForm.name, items: [] });
    }
    setMenuCategories(updated);
    setCatForm({ name: "" });
  };

  const deleteCategory = (idx: number) => {
    if (!confirm("Bu kateqoriyanı və içindəki bütün məhsulları silmək istəyirsiniz?")) return;
    setMenuCategories(menuCategories.filter((_, i) => i !== idx));
    if (expandedCat === idx) setExpandedCat(null);
  };

  const startEditCategory = (idx: number) => {
    setCatForm({ name: menuCategories[idx].name });
    setEditCatIdx(idx);
  };

  // ─── MENU ITEM HELPERS ───
  const addOrUpdateItem = (catIdx: number) => {
    if (!itemForm.name || itemForm.price <= 0) {
      alert("Məhsul adı və qiyməti daxil edilməlidir!");
      return;
    }
    const updated = [...menuCategories];
    const items = [...updated[catIdx].items];
    if (editItemIdx !== null && activeItemCatIdx === catIdx) {
      items[editItemIdx] = { ...items[editItemIdx], ...itemForm };
      setEditItemIdx(null);
    } else {
      items.push({ ...itemForm });
    }
    updated[catIdx] = { ...updated[catIdx], items };
    setMenuCategories(updated);
    setItemForm({ name: "", description: "", price: 0, image: "" });
    setActiveItemCatIdx(null);
  };

  const deleteItem = (catIdx: number, itemIdx: number) => {
    const updated = [...menuCategories];
    updated[catIdx] = {
      ...updated[catIdx],
      items: updated[catIdx].items.filter((_, i) => i !== itemIdx),
    };
    setMenuCategories(updated);
  };

  const startEditItem = (catIdx: number, itemIdx: number) => {
    const item = menuCategories[catIdx].items[itemIdx];
    setItemForm({ name: item.name, description: item.description, price: item.price, image: item.image });
    setEditItemIdx(itemIdx);
    setActiveItemCatIdx(catIdx);
  };

  // ─── Filter restaurants ───
  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && restaurants.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  // ════════════════════════════════════════
  //  EDIT VIEW — single restaurant editing
  // ════════════════════════════════════════
  if (viewMode === "edit" && editingRestaurant) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBackToList}
              className="p-2 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-[#1e325c]">{restForm.name || "Restoran Redaktə"}</h2>
              <p className="text-xs text-stone-400 mt-0.5">Restoran məlumatlarını və menyusunu redaktə edin</p>
            </div>
          </div>
          <button
            onClick={handleSaveRestaurant}
            disabled={saving}
            className="px-6 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-md"
            style={{ background: "var(--color-hotel-blue)" }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "Saxlanılır..." : "Hamısını Yadda Saxla"}
          </button>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-5">
          <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
            Ümumi Məlumat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Restoran Adı</label>
              <input
                placeholder="Məs: Caspian Breeze"
                value={restForm.name}
                onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Əlaqə Nömrəsi
              </label>
              <input
                placeholder="+994 12 448 00 00"
                value={restForm.phone}
                onChange={(e) => setRestForm({ ...restForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Açıqlama</label>
            <textarea
              placeholder="Restoran haqqında geniş məlumat..."
              value={restForm.description}
              onChange={(e) => setRestForm({ ...restForm, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs h-24 resize-none focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-2">Şəkil</label>
            <div className="flex items-center gap-4">
              {restFormImage && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 group shrink-0">
                  <img src={restFormImage} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setRestFormImage("")}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border border-dashed border-stone-300 rounded-xl text-xs text-stone-400 hover:text-[#00b5d5] hover:border-[#00b5d5] transition-colors cursor-pointer">
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
                      if (data.success) setRestFormImage(data.url);
                      else alert(data.message || "Xəta");
                    } catch (err: any) { alert("Şəkil xətası: " + err.message); }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="border-t border-stone-100 pt-5">
            <h4 className="font-bold text-[#1e325c] text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00b5d5]" />
              İş Saatları
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Səhər Yeməyi</label>
                <input
                  placeholder="07:00 – 11:00"
                  value={restForm.workingHours.breakfast}
                  onChange={(e) => setRestForm({ ...restForm, workingHours: { ...restForm.workingHours, breakfast: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Nahar</label>
                <input
                  placeholder="12:00 – 15:00"
                  value={restForm.workingHours.lunch}
                  onChange={(e) => setRestForm({ ...restForm, workingHours: { ...restForm.workingHours, lunch: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Şam Yeməyi</label>
                <input
                  placeholder="18:00 – 23:00"
                  value={restForm.workingHours.dinner}
                  onChange={(e) => setRestForm({ ...restForm, workingHours: { ...restForm.workingHours, dinner: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ════════ MENU MANAGEMENT ════════ */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-[#1e325c] text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" style={{ color: "var(--color-hotel-gold)" }} />
              Menyu İdarəsi
            </h3>
          </div>

          {/* Add Category Form */}
          <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
            <h4 className="font-bold text-[#1e325c] text-sm mb-3 flex items-center gap-2">
              <FolderPlus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
              {editCatIdx !== null ? "Kateqoriyanı Redaktə Et" : "Yeni Menyu Kateqoriyası"}
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Məs: Səhər Yeməkləri, Desertlər, Bar Menyusu..."
                value={catForm.name}
                onChange={(e) => setCatForm({ name: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
              />
              <div className="flex gap-2">
                <button
                  onClick={addOrUpdateCategory}
                  className="px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: "var(--color-hotel-blue)" }}
                >
                  {editCatIdx !== null ? "Yadda Saxla" : "Əlavə Et"}
                </button>
                {editCatIdx !== null && (
                  <button
                    onClick={() => { setEditCatIdx(null); setCatForm({ name: "" }); }}
                    className="px-4 py-2.5 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl"
                  >
                    Ləğv
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Categories List */}
          {menuCategories.length === 0 ? (
            <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">
              Hələ menyu kateqoriyası yoxdur. Yuxarıdan əlavə edin.
            </div>
          ) : menuCategories.map((cat, catIdx) => (
            <div key={catIdx} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              {/* Category Header */}
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-stone-50/50 transition-colors"
                onClick={() => setExpandedCat(expandedCat === catIdx ? null : catIdx)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ background: "linear-gradient(135deg, #1e325c, #00b5d5)" }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e325c]">{cat.name}</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">{cat.items.length} məhsul</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEditCategory(catIdx); }}
                    className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCategory(catIdx); }}
                    className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedCat === catIdx ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                </div>
              </div>

              {/* Items (expanded) */}
              {expandedCat === catIdx && (
                <div className="border-t border-stone-100 p-5 space-y-4 bg-stone-50/30">
                  {/* Add Item Form */}
                  <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                    <h5 className="text-xs font-bold text-[#1e325c] mb-3 flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5" style={{ color: "var(--color-hotel-gold)" }} />
                      {editItemIdx !== null && activeItemCatIdx === catIdx ? "Məhsulu Redaktə Et" : "Yeni Məhsul Əlavə Et"}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Məhsul Adı</label>
                        <input
                          placeholder="Məs: Şah Plov"
                          value={activeItemCatIdx === catIdx || editItemIdx === null ? itemForm.name : ""}
                          onChange={(e) => { setActiveItemCatIdx(catIdx); setItemForm({ ...itemForm, name: e.target.value }); }}
                          onFocus={() => { if (activeItemCatIdx !== catIdx) { setItemForm({ name: "", description: "", price: 0, image: "" }); setEditItemIdx(null); setActiveItemCatIdx(catIdx); }}}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#00b5d5]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Qiymət (AZN)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={activeItemCatIdx === catIdx || editItemIdx === null ? itemForm.price || "" : ""}
                          onChange={(e) => { setActiveItemCatIdx(catIdx); setItemForm({ ...itemForm, price: Number(e.target.value) }); }}
                          onFocus={() => { if (activeItemCatIdx !== catIdx) { setItemForm({ name: "", description: "", price: 0, image: "" }); setEditItemIdx(null); setActiveItemCatIdx(catIdx); }}}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#00b5d5]"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Açıqlama</label>
                      <input
                        placeholder="Qısa təsvir..."
                        value={activeItemCatIdx === catIdx || editItemIdx === null ? itemForm.description : ""}
                        onChange={(e) => { setActiveItemCatIdx(catIdx); setItemForm({ ...itemForm, description: e.target.value }); }}
                        onFocus={() => { if (activeItemCatIdx !== catIdx) { setItemForm({ name: "", description: "", price: 0, image: "" }); setEditItemIdx(null); setActiveItemCatIdx(catIdx); }}}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#00b5d5]"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="text-[10px] font-semibold text-stone-500 mb-1 block">Şəkil</label>
                      <div className="flex items-center gap-3">
                        {itemForm.image && activeItemCatIdx === catIdx && (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                            <img src={itemForm.image} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => setItemForm({ ...itemForm, image: "" })}
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
                                  setActiveItemCatIdx(catIdx);
                                  setItemForm((prev) => ({ ...prev, image: data.url }));
                                } else alert(data.message || "Xəta");
                              } catch (err: any) { alert("Şəkil xətası: " + err.message); }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => addOrUpdateItem(catIdx)}
                        className="px-4 py-2 text-white text-xs font-bold rounded-lg transition-opacity hover:opacity-90"
                        style={{ background: "var(--color-hotel-blue)" }}
                      >
                        {editItemIdx !== null && activeItemCatIdx === catIdx ? "Yadda Saxla" : "Məhsul Əlavə Et"}
                      </button>
                      {editItemIdx !== null && activeItemCatIdx === catIdx && (
                        <button
                          onClick={() => { setEditItemIdx(null); setItemForm({ name: "", description: "", price: 0, image: "" }); setActiveItemCatIdx(null); }}
                          className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-lg"
                        >
                          Ləğv
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  {cat.items.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-4">Bu kateqoriyada hələ məhsul yoxdur</p>
                  ) : (
                    <div className="space-y-2">
                      {cat.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex justify-between items-center gap-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {item.image && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-stone-100">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-xs text-[#1e325c] truncate">{item.name}</h5>
                                <span className="text-xs font-bold text-[#00b5d5] whitespace-nowrap">{item.price} AZN</span>
                              </div>
                              {item.description && (
                                <p className="text-[10px] text-stone-400 mt-0.5 truncate">{item.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEditItem(catIdx, itemIdx)}
                              className="p-1.5 bg-stone-50 text-stone-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteItem(catIdx, itemIdx)}
                              className="p-1.5 bg-stone-50 text-stone-400 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

        {/* Save reminder */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            Dəyişiklikləri saxlamaq üçün yuxarıdakı <strong>&quot;Hamısını Yadda Saxla&quot;</strong> düyməsinə basın.
          </p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════
  //  LIST VIEW — all restaurants
  // ════════════════════════════════════════
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1e325c] flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" style={{ color: "var(--color-hotel-gold)" }} />
            Restoranların İdarə Edilməsi
          </h2>
          <p className="text-xs text-stone-400 mt-1">Otel restoranlarını, menyularını, iş saatlarını və səhifə başlıqlarını idarə edin</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl font-medium border border-rose-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* SETTINGS FORM */}
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#00b5d5]" />
            Səhifə Başlıqları
          </h3>
          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            style={{ background: "var(--color-hotel-blue)" }}
          >
            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {savingSettings ? "Saxlanılır..." : "Yadda Saxla"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">Tag (məs: RESTORANLARIMIZ & BAR)</label>
            <input
              placeholder="Tag..."
              value={settingsForm.tag}
              onChange={(e) => setSettingsForm({ ...settingsForm, tag: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">Başlıq (məs: Unudulmaz Qastrofəza Səyahəti)</label>
            <input
              placeholder="Başlıq..."
              value={settingsForm.title}
              onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-stone-500 mb-1 block">Açıqlama</label>
            <textarea
              placeholder="Səhifənin alt başlığı/açıqlaması..."
              value={settingsForm.subtitle}
              onChange={(e) => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs h-16 resize-none focus:outline-none focus:border-[#00b5d5]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CREATE FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="font-bold text-[#1e325c] text-sm mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
              Yeni Restoran Yarat
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Restoran Adı</label>
                <input
                  placeholder="Məs: Caspian Breeze"
                  value={restForm.name}
                  onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Açıqlama</label>
                <textarea
                  placeholder="Qısa təsvir..."
                  value={restForm.description}
                  onChange={(e) => setRestForm({ ...restForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs h-16 resize-none focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Əlaqə Nömrəsi</label>
                <input
                  placeholder="+994 12 448 00 00"
                  value={restForm.phone}
                  onChange={(e) => setRestForm({ ...restForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
              {/* Image upload */}
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Şəkil</label>
                <div className="flex items-center gap-3">
                  {restFormImage && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 group shrink-0">
                      <img src={restFormImage} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setRestFormImage("")}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="relative flex-1">
                    <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-dashed border-stone-300 rounded-xl text-xs text-stone-400 hover:text-[#00b5d5] hover:border-[#00b5d5] transition-colors cursor-pointer">
                      <ImagePlus className="w-4 h-4" />
                      <span>Yüklə</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const data = await uploadImage(file);
                          if (data.success) setRestFormImage(data.url);
                          else alert(data.message || "Xəta");
                        } catch (err: any) { alert("Şəkil xətası: " + err.message); }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleCreateRestaurant}
                disabled={saving}
                className="w-full px-4 py-2.5 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "var(--color-hotel-blue)" }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? "Yaradılır..." : "Restoran Yarat"}
              </button>
            </div>
          </div>
        </div>

        {/* RESTAURANTS LIST */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Restoran axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">
              {restaurants.length === 0 ? "Hələ restoran yaradılmayıb. Sol tərəfdən yeni restoran əlavə edin." : "Axtarışa uyğun restoran tapılmadı."}
            </div>
          ) : filteredRestaurants.map((rest) => (
            <div key={rest._id} className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                {rest.image ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-100">
                    <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl shrink-0 flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1e325c, #00b5d5)" }}>
                    <UtensilsCrossed className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-[#1e325c]">{rest.name}</h4>
                      {rest.phone && (
                        <p className="text-[10px] text-[#00b5d5] font-semibold mt-0.5">{rest.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <button
                        onClick={() => openEditRestaurant(rest)}
                        className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Redaktə et"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRestaurant(rest._id)}
                        className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {rest.description && (
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">{rest.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {rest.menu?.length || 0} kateqoriya
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                      {rest.menu?.reduce((sum, c) => sum + (c.items?.length || 0), 0) || 0} məhsul
                    </span>
                    {rest.workingHours?.breakfast && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                        ☀ {rest.workingHours.breakfast}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-t border-stone-100 px-4 py-2.5 bg-stone-50/50">
                <button
                  onClick={() => openEditRestaurant(rest)}
                  className="text-xs font-bold text-[#00b5d5] hover:text-[#1e325c] transition-colors flex items-center gap-1.5"
                >
                  <Pencil className="w-3 h-3" />
                  Redaktə et və menyu idarə et →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
