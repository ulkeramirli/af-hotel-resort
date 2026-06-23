/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Pencil, X, Check, Tags, Palmtree, Globe } from "lucide-react";
import { 
  getActivities, createActivity, updateActivity, deleteActivity,
  getActivityCategories, createActivityCategory, updateActivityCategory, deleteActivityCategory,
  getActivitySettings, updateActivitySettings,
  uploadImage
} from "@/services/api";
import type { Activity, ActivityCategory, ActivitySettings } from "@/types/api";

const emptyActivityForm = {
  title: { az: "", en: "", ru: "" },
  category: "",
  description: { az: "", en: "", ru: "" },
  image: "",
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

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"activities" | "categories">("activities");
  const [formLang, setFormLang] = useState<"az" | "en" | "ru">("az");

  // Activity State
  const [editActivityId, setEditActivityId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState(emptyActivityForm);

  // Category State
  const emptyCategoryForm = { 
    name: { az: "", en: "", ru: "" }, 
    description: { az: "", en: "", ru: "" }, 
    emoji: "" 
  };
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);

  // Settings State
  const emptySettings = {
    tag: { az: "", en: "", ru: "" },
    title: { az: "", en: "", ru: "" },
    subtitle: { az: "", en: "", ru: "" },
    stats: [
      { value: "", label: { az: "", en: "", ru: "" }, sub: { az: "", en: "", ru: "" } },
      { value: "", label: { az: "", en: "", ru: "" }, sub: { az: "", en: "", ru: "" } },
      { value: "", label: { az: "", en: "", ru: "" }, sub: { az: "", en: "", ru: "" } },
      { value: "", label: { az: "", en: "", ru: "" }, sub: { az: "", en: "", ru: "" } },
    ]
  };
  const [settingsForm, setSettingsForm] = useState<any>(emptySettings);
  const [savingSettings, setSavingSettings] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aData, cData, sData] = await Promise.all([getActivities(), getActivityCategories(), getActivitySettings()]);
      setActivities(aData);
      setCategories(cData);
      if (sData) {
        const parseLoc = (val: any) => typeof val === 'object' ? val : { az: val||"", en: val||"", ru: val||"" };
        setSettingsForm({
          tag: parseLoc(sData.tag),
          title: parseLoc(sData.title),
          subtitle: parseLoc(sData.subtitle),
          stats: (sData.stats || emptySettings.stats).map((s: any) => ({
            value: s.value || "",
            label: parseLoc(s.label),
            sub: parseLoc(s.sub)
          }))
        });
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── SETTINGS ACTIONS ───
  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      await updateActivitySettings(settingsForm);
      alert("Tənzimləmələr yadda saxlanıldı!");
    } catch (err: any) {
      alert(err.message || "Xəta baş verdi");
    } finally {
      setSavingSettings(false);
    }
  };

  // ─── ACTIVITY ACTIONS ───
  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title.az || !activityForm.description.az || !activityForm.category) {
      alert("Ən azı AZ dilində Başlıq və Təsvir, və Kateqoriya mütləq doldurulmalıdır!");
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
    const parseLoc = (val: any) => typeof val === 'object' ? val : { az: val||"", en: val||"", ru: val||"" };
    setActivityForm({
      title: parseLoc(activity.title),
      category: typeof activity.category === 'object' ? (activity.category as any)._id : activity.category,
      description: parseLoc(activity.description),
      image: activity.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (!categoryForm.name.az) {
      alert("Kateqoriya adı ən azı AZ dilində daxil edilməlidir!");
      return;
    }
    
    try {
      if (editCategoryId) {
        await updateActivityCategory(editCategoryId, categoryForm);
      } else {
        await createActivityCategory(categoryForm);
      }
      setEditCategoryId(null);
      setCategoryForm(emptyCategoryForm);
      loadData();
    } catch (err: any) {
      alert(err.message || "Kateqoriya yadda saxlanılarkən xəta baş verdi");
    }
  };

  const startEditCategory = (cat: ActivityCategory) => {
    setEditCategoryId(cat._id);
    const parseLoc = (val: any) => typeof val === 'object' ? val : { az: val||"", en: val||"", ru: val||"" };
    setCategoryForm({
      name: parseLoc(cat.name),
      description: parseLoc(cat.description),
      emoji: cat.emoji || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          {/* SETTINGS FORM */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
                <Tags className="w-4 h-4 text-[#00b5d5]" />
                Səhifə Başlıqları və Statistikalar
              </h3>
              <div className="flex items-center gap-4">
                <LangSwitcher lang={formLang} setLang={setFormLang} />
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="px-4 py-2 mb-4 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  style={{ background: "var(--color-hotel-blue)" }}
                >
                  {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Yadda Saxla
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Tag (məs: AQUA & BEACH RESORT) [{formLang.toUpperCase()}]</label>
                <input
                  placeholder="Tag..."
                  value={settingsForm.tag[formLang]}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tag: { ...settingsForm.tag, [formLang]: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Başlıq (məs: Eksklüziv Su Dünyası) [{formLang.toUpperCase()}]</label>
                <input
                  placeholder="Başlıq..."
                  value={settingsForm.title[formLang]}
                  onChange={(e) => setSettingsForm({ ...settingsForm, title: { ...settingsForm.title, [formLang]: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-stone-500 mb-1 block">Açıqlama [{formLang.toUpperCase()}]</label>
                <textarea
                  placeholder="Səhifənin alt başlığı..."
                  value={settingsForm.subtitle[formLang]}
                  onChange={(e) => setSettingsForm({ ...settingsForm, subtitle: { ...settingsForm.subtitle, [formLang]: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs h-12 resize-none focus:outline-none focus:border-[#00b5d5]"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-stone-100">
              <label className="text-xs font-semibold text-stone-500 mb-2 block">4 Dinamik Statistika (İkonlar sabitdir) [{formLang.toUpperCase()}]</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {settingsForm.stats?.map((stat: any, i: number) => (
                  <div key={i} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <input
                      placeholder="Dəyər (Bütün dillər üçün ortaq)"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...settingsForm.stats];
                        newStats[i].value = e.target.value;
                        setSettingsForm({ ...settingsForm, stats: newStats });
                      }}
                      className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold focus:outline-none focus:border-[#00b5d5]"
                    />
                    <input
                      placeholder="Başlıq (məs: Su Əyləncəsi)"
                      value={stat.label[formLang]}
                      onChange={(e) => {
                        const newStats = [...settingsForm.stats];
                        newStats[i].label[formLang] = e.target.value;
                        setSettingsForm({ ...settingsForm, stats: newStats });
                      }}
                      className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#00b5d5]"
                    />
                    <input
                      placeholder="Alt başlıq (məs: Mövsüm)"
                      value={stat.sub[formLang]}
                      onChange={(e) => {
                        const newStats = [...settingsForm.stats];
                        newStats[i].sub[formLang] = e.target.value;
                        setSettingsForm({ ...settingsForm, stats: newStats });
                      }}
                      className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] focus:outline-none focus:border-[#00b5d5]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIVITY FORM */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1e325c] text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" style={{ color: "var(--color-hotel-gold)" }} />
                {editActivityId ? "Fəaliyyəti Redaktə Et" : "Yeni Fəaliyyət Əlavə Et"}
              </h3>
              <LangSwitcher lang={formLang} setLang={setFormLang} />
            </div>
            
            {categories.length === 0 ? (
              <p className="text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
                Əvvəlcə ən azı 1 "Kateqoriya" yaratmalısınız.
              </p>
            ) : (
              <form onSubmit={handleActivitySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder={`Başlıq (${formLang.toUpperCase()})`}
                  value={activityForm.title[formLang]}
                  onChange={(e) => setActivityForm({ ...activityForm, title: { ...activityForm.title, [formLang]: e.target.value } })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <select
                  value={activityForm.category}
                  onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{(c.name as any)?.az || c.name}</option>
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
                  placeholder={`Təsvir (${formLang.toUpperCase()})`}
                  value={activityForm.description[formLang]}
                  onChange={(e) => setActivityForm({ ...activityForm, description: { ...activityForm.description, [formLang]: e.target.value } })}
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
                  <img src={act.image} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-[#1e325c]">{(act.title as any)?.az || act.title}</h4>
                  <div className="flex gap-1">
                    <button onClick={() => startEditActivity(act)} className="p-1.5 text-stone-400 hover:text-[#1e325c] rounded-lg hover:bg-stone-50">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteActivity(act._id)} className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00b5d5] mb-2">
                  {typeof act.category === 'object' ? ((act.category as any).name?.az || (act.category as any).name) : act.category}
                </p>
                <p className="text-xs text-stone-500 line-clamp-3">{(act.description as any)?.az || act.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e325c] text-sm">
                  {editCategoryId ? "Kateqoriyanı Redaktə Et" : "Yeni Kateqoriya"}
                </h3>
                <LangSwitcher lang={formLang} setLang={setFormLang} />
              </div>
              
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <input
                  placeholder={`Kateqoriya adı (${formLang.toUpperCase()})`}
                  value={categoryForm.name[formLang]}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: { ...categoryForm.name, [formLang]: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <input
                  placeholder="Emoji (məs: 🌊)"
                  value={categoryForm.emoji}
                  onChange={(e) => setCategoryForm({ ...categoryForm, emoji: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
                />
                <textarea
                  placeholder={`Açıqlama (${formLang.toUpperCase()})`}
                  value={categoryForm.description[formLang]}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: { ...categoryForm.description, [formLang]: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs h-16 resize-none focus:outline-none focus:border-[#00b5d5]"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 px-4 py-2 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90" style={{ background: "var(--color-hotel-blue)" }}>
                    {editCategoryId ? "Yadda Saxla" : "Əlavə Et"}
                  </button>
                  {editCategoryId && (
                    <button type="button" onClick={() => { setEditCategoryId(null); setCategoryForm(emptyCategoryForm); }} className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl">
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
                <div key={cat._id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">
                      {cat.emoji || <Tags className="w-5 h-5 text-[#00b5d5]" />}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#1e325c] block">{(cat.name as any)?.az || cat.name}</span>
                      {(cat.description as any)?.az && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{(cat.description as any).az}</p>
                      )}
                    </div>
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
