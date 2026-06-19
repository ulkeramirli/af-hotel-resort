"use client";
import React, { useState, useEffect } from "react";
import { MessageSquare, Mail, Loader2 } from "lucide-react";
import { getMessages, markMessageRead } from "@/services/api";
import type { Message } from "@/types/api";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMessages()
      .then((data) => { if (!cancelled) setMessages(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleRead = async (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
    await markMessageRead(id);
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
        <h2 className="text-xl font-bold text-[#1e325c]">Mesajlar</h2>
        <p className="text-xs text-stone-400">Saytdan gələn müraciətlər</p>
      </div>
      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() => m.unread && handleRead(m.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              m.unread
                ? "bg-white border-[#00b5d5]/30 shadow-sm"
                : "bg-stone-50/50 border-stone-100 opacity-80"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white"
                style={{ background: m.unread ? "var(--color-hotel-blue)" : "#a8a29e" }}
              >
                {m.initials}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#1e325c]">{m.name}</h4>
                  <span className="text-[10px] text-stone-400">{m.time}</span>
                </div>
                <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" /> {m.email}
                </p>
                <p className="text-xs text-stone-600 mt-2">{m.text}</p>
              </div>
              {m.unread && (
                <span
                  className="w-2 h-2 rounded-full shrink-0 mt-2"
                  style={{ background: "var(--color-hotel-gold)" }}
                />
              )}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-stone-400 text-xs flex flex-col items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Mesaj yoxdur
          </div>
        )}
      </div>
    </div>
  );
}