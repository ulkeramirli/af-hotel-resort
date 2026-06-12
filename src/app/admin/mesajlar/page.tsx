"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Reply, Loader2, CheckCircle } from "lucide-react";

interface ReviewData {
  id: number;
  userName: string;
  userImage: string;
  comment: string;
  rating: number;
  replyText: string | null;
}

export default function AdminReviewsManager() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const loadReviews = () => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      });
  };

  useEffect(() => { loadReviews(); }, []);

  const handleSendReply = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText })
      });
      if (res.ok) {
        setReplyId(null);
        setReplyText("");
        loadReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#00b4d8]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Müştəri Rəyləri və Cavablar</h2>
        <p className="text-xs text-gray-400">Qonaqların Google vasitəsilə yazdığı rəyləri oxuyun və rəsmi cavab yazın</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Image 
                  src={review.userImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} 
                  className="w-9 h-9 rounded-full border border-gray-100 object-cover" 
                  alt="Reviewer"
                  width={36}
                  height={36}
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{review.userName}</h4>
                  <div className="flex gap-0.5 text-amber-400 mt-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-3 rounded-xl">{review.comment}</p>

            {review.replyText ? (
              <div className="bg-cyan-50/50 border border-cyan-100/50 p-3 rounded-xl text-xs ml-6 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#00b4d8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#00b4d8]">Otelin Cavabı: </span>
                  <span className="text-gray-600 font-medium">{review.replyText}</span>
                </div>
              </div>
            ) : (
              <div className="ml-6">
                {replyId === review.id ? (
                  <div className="space-y-2">
                    <textarea 
                      value={replyText} 
                      onChange={e => setReplyText(e.target.value)} 
                      placeholder="Cavabınızı yazın..." 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white h-16 resize-none" 
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setReplyId(null)} className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold cursor-pointer">Ləğv et</button>
                      <button onClick={() => handleSendReply(review.id)} className="px-3 py-1.5 bg-[#00b4d8] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"><Reply className="w-3 h-3" /> Göndər</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setReplyId(review.id); setReplyText(""); }} className="flex items-center gap-1 text-[10px] font-bold text-[#00b4d8] bg-cyan-50/50 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-cyan-50">
                    <Reply className="w-3 h-3" /> Cavab yaz
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}