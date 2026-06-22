/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect } from "react";
import { Star, Reply, Loader2, CheckCircle, Trash2, ShieldAlert } from "lucide-react";
import { getReviews, updateReviewStatus, deleteReview } from "@/services/api";
import type { Review } from "@/types/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateReviewStatus(id, status);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, status: status as any } : r));
    } catch (err: any) {
      alert(err.message || "Status dəyişilərkən xəta baş verdi");
    }
  };

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await updateReviewStatus(id, "approved", replyText);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, adminReply: replyText, status: "approved" } : r));
      setReplyId(null);
      setReplyText("");
    } catch (err: any) {
      alert(err.message || "Cavab göndərilərkən xəta baş verdi");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Rəyi silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err: any) {
      alert(err.message || "Silinərkən xəta baş verdi");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Müştəri Rəyləri</h2>
        <p className="text-xs text-stone-400">Rəyləri təsdiqlə və ya cavabla</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl font-medium border border-rose-100">
          <ShieldAlert className="inline-block w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {reviews.length === 0 ? (
           <div className="bg-white py-10 rounded-2xl border border-stone-100 shadow-sm text-center text-stone-400 text-sm">
             Rəy tapılmadı
           </div>
        ) : reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-3 relative"
          >
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <select
                value={review.status}
                onChange={(e) => handleStatusChange(review._id, e.target.value)}
                className={`text-xs font-bold px-2 py-1 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#00b5d5] ${
                  review.status === "approved"
                    ? "bg-emerald-50 text-emerald-600"
                    : review.status === "pending"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                <option value="pending">Gözləyir</option>
                <option value="approved">Təsdiqlənib</option>
                <option value="rejected">Rədd edilib</option>
              </select>
              <button onClick={() => handleDelete(review._id)} className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-[#1e325c] to-[#00b5d5]">
                {review.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1e325c]">{review.fullName}</h4>
                <p className="text-[10px] text-stone-400">{review.emailOrPhone}</p>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">{review.message}</p>
            
            {review.adminReply ? (
              <div
                className="border rounded-xl p-3 text-xs ml-4 flex gap-2"
                style={{
                  background: "rgba(0,181,213,0.08)",
                  borderColor: "rgba(0,181,213,0.2)",
                }}
              >
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#00b5d5" }} />
                <div>
                  <span className="font-bold" style={{ color: "#00b5d5" }}>
                    Otelin Cavabı:{" "}
                  </span>
                  <span className="text-stone-600">{review.adminReply}</span>
                </div>
              </div>
            ) : replyId === review._id ? (
              <div className="ml-4 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Cavabınızı yazın..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs h-20 resize-none focus:outline-none focus:border-[#00b5d5]"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setReplyId(null)}
                    className="px-3 py-1.5 bg-stone-100 text-stone-500 rounded-lg text-[10px] font-bold"
                  >
                    Ləğv et
                  </button>
                  <button
                    onClick={() => handleSendReply(review._id)}
                    className="px-3 py-1.5 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                    style={{ background: "var(--color-hotel-blue)" }}
                  >
                    <Reply className="w-3 h-3" /> Göndər
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setReplyId(review._id);
                  setReplyText("");
                }}
                className="ml-4 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg"
                style={{
                  color: "var(--color-hotel-blue)",
                  background: "rgba(0,70,147,0.08)",
                }}
              >
                <Reply className="w-3 h-3" /> Cavab yaz
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}