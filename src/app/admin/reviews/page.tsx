"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Reply, Loader2, CheckCircle } from "lucide-react";
import { getReviews, replyToReview } from "@/services/api";
import type { Review } from "@/types/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    let cancelled = false;
    getReviews()
      .then((data) => { if (!cancelled) setReviews(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return;
    const updated = await replyToReview(id, replyText);
    if (updated) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, replyText: replyText } : r))
      );
    }
    setReplyId(null);
    setReplyText("");
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-hotel-blue)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e325c]">Müştəri Rəyləri</h2>
        <p className="text-xs text-stone-400">PUT /admin/reviews/{"{id}"}/reply</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src={review.userImage}
                alt={review.userName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h4 className="text-sm font-bold text-[#1e325c]">{review.userName}</h4>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">{review.comment}</p>
            {review.replyText ? (
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
                  <span className="text-stone-600">{review.replyText}</span>
                </div>
              </div>
            ) : replyId === review.id ? (
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
                    onClick={() => handleSendReply(review.id)}
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
                  setReplyId(review.id);
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