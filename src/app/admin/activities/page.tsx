"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Pencil, X, Check, Tags, Palmtree } from "lucide-react";
import { 
  getActivities, createActivity, updateActivity, deleteActivity,
  getActivityCategories, createActivityCategory, updateActivityCategory, deleteActivityCategory,
  uploadImage
} from "@/services/api";
import type { Activity, ActivityCategory } from "@/types/api";

const emptyActivityForm = {
  title: "",
  category: "",
  description: "",
  image: "",
};

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"activities" | "categories">("activities");

  // Activity State
  const [editActivityId, setEditActivityId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState(emptyActivityForm);

  // Category State
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [categoryFormName, setCategoryFormName] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [aData, cData] = await Promise.all([getActivities(), getActivityCategories()]);
      setActivities(aData);
      setCategories(cData);
      if (cData.length > 0 && !activityForm.category) {
        setActivityForm(prev => ({ ...prev, category: cData[0]._id }));
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

  // ─── ACTIVITY ACTIONS ───
  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title || !activityForm.description || !activityForm.category) {
      alert("Başlıq, Kateqoriya və Təsvir mütləq doldurulmalıdır!");
      return;
    }
    
    try {
      if (editActivityId) {
        await updateActivity(editActivityId, activityForm);
      } else {
        await createActivity(activityForm);
      }
      setEditActivityId(null);
      setActivityForm({ ...emptyActivityForm, category: categories[0]?._id || "" });
      loadData();
    } catch (err: any) {
      alert(err.message || "Yadda saxlanılarkən xəta baş verdi");
    }
  };

  const startEditActivity = (activity: Activity) => {
    setEditActivityId(activity._id);
    setActivityForm({
      title: activity.title,
      category: typeof activity.category === 'object' ? (activity.category as any)._id : activity.category,
      description: activity.description,
      image: activity.image || "",
    });
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteActivity(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Silərkən xəta baş verdi");
    }
  };

  // ─── CATEGORY ACTIONS ───
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormName) return;
    
    try {
      if (editCategoryId) {
        await updateActivityCategory(editCategoryId, categoryFormName);
      } else {
        await createActivityCategory(categoryFormName);
      }
      setEditCategoryId(null);
      setCategoryFormName("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Kateqoriya yadda saxlanılarkən xəta baş verdi");
    }
  };

  const startEditCategory = (cat: ActivityCategory) => {
    setEditCategoryId(cat._id);
    setCategoryFormName(cat.name);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteActivityCategory(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Silərkən xəta baş verdi");
    }
  };

  if (loading && activities.length === 0) {
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
          <h2 className="text-xl font-bold text-[#1e325c]">Fəaliyyətlərin İdarə Edilməsi</h2>
          <p className="text-xs text-stone-400 mt-1">Əyləncə, Aqua Park və digər xidmətlər</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab("activities")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "activities" ? "text-white" : "text-stone-500 hover:bg-stone-50"
            }`}
            style={activeTab === "activities" ? { background: "var(--color-hotel-blue)" } : undefined}
          >
            <Palmtree className="w-4 h-4 inline-block mr-2" /> Fəaliyyətlər
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "categories" ? "text-white" : "text-stone-500 hover:bg-stone-50"
            }`}
            style={activeTab === "categories" ? { background: "var(--color-hotel-blue)" } : undefined}
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

      {activeTab === "activities" && (
        <div className="space-y-6">
          {/* ACTIVITY FORM */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="font-bold text-[#1e325c] text-sm mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
              {editActivityId ? "Fəaliyyəti Redaktə Et" : "Yeni Fəaliyyət Əlavə Et"}
            </h3>
            {categories.length === 0 ? (
              <p className="text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
                Əvvəlcə ən azı 1 "Kateqoriya" yaratmalısınız.
              </p>
            ) : (
              <form onSubmit={handleActivitySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Başlıq (məs: Hovuz partisi)"
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <select
                  value={activityForm.category}
                  onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <div className="md:col-span-2 flex items-center gap-4">
                  <input
                    placeholder="Şəkil URL (və ya kompüterdən seçin)"
                    value={activityForm.image}
                    onChange={(e) => setActivityForm({ ...activityForm, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const data = await uploadImage(file);
                          if (data.success) {
                            setActivityForm(prev => ({ ...prev, image: data.url }));
                          } else {
                            alert(data.message || "Xəta baş verdi");
                          }
                        } catch (err: any) {
                          alert("Şəkil yüklənərkən xəta: " + err.message);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button type="button" className="px-4 py-2 bg-stone-100 text-[#1e325c] hover:bg-stone-200 text-xs font-bold rounded-xl whitespace-nowrap transition-colors flex items-center gap-2">
                      <Palmtree className="w-4 h-4" /> Şəkil Seç
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Təsvir"
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:col-span-2 h-20 resize-none focus:outline-none focus:border-[#00b5d5]"
                />
                
                <div className="flex gap-2 md:col-span-2 mt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-opacity hover:opacity-90"
                    style={{ background: "var(--color-hotel-blue)" }}
                  >
                    {editActivityId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editActivityId ? "Yadda Saxla" : "Əlavə Et"}
                  </button>
                  {editActivityId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditActivityId(null);
                        setActivityForm({ ...emptyActivityForm, category: categories[0]?._id || "" });
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

          {/* ACTIVITIES LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.length === 0 ? (
               <div className="col-span-full py-10 text-center text-stone-400 text-sm">Fəaliyyət tapılmadı</div>
            ) : activities.map((act) => (
              <div key={act._id} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                {act.image && (
                  <img src={act.image} alt={act.title} className="w-full h-32 object-cover rounded-xl mb-3" />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-[#1e325c]">{act.title}</h4>
                  <div className="flex gap-1">
                    <button onClick={() => startEditActivity(act)} className="p-1.5 text-stone-400 hover:text-[#1e325c] rounded-lg hover:bg-stone-50">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteActivity(act._id)} className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00b5d5] mb-2">{typeof act.category === 'object' ? (act.category as any).name : act.category}</p>
                <p className="text-xs text-stone-500 line-clamp-3">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <h3 className="font-bold text-[#1e325c] text-sm mb-4">
                {editCategoryId ? "Kateqoriyanı Redaktə Et" : "Yeni Kateqoriya"}
              </h3>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <input
                  placeholder="Kateqoriya adı (məs: Uşaqlar üçün)"
                  value={categoryFormName}
                  onChange={(e) => setCategoryFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90" style={{ background: "var(--color-hotel-blue)" }}>
                    {editCategoryId ? "Yadda Saxla" : "Əlavə Et"}
                  </button>
                  {editCategoryId && (
                    <button type="button" onClick={() => { setEditCategoryId(null); setCategoryFormName(""); }} className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl">
                      Ləğv
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-3">
             {categories.length === 0 ? (
               <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">Kateqoriya tapılmadı</div>
             ) : categories.map((cat) => (
                <div key={cat._id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#00b5d5]">
                      <Tags className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#1e325c]">{cat.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditCategory(cat)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 bg-stone-50 text-stone-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
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
