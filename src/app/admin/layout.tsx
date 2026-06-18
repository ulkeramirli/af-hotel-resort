"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  MessageSquare,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Hotel,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Otaqlar", href: "/admin/otaqlar", icon: BedDouble },
    { name: "Bronlar", href: "/admin/bronlar", icon: CalendarCheck },
    { name: "Rəylər", href: "/admin/reviews", icon: Star },
    { name: "Mesajlar", href: "/admin/mesajlar", icon: MessageSquare },
    { name: "Statistika", href: "/admin/statistika", icon: BarChart3 },
    { name: "Sayt Tənzimləmələri", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      {/* БОКОВАЯ ПАНЕЛЬ */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        <div className="space-y-8">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 bg-cyan-50 text-[#00b4d8] rounded-xl flex items-center justify-center shadow-sm">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-gray-800 uppercase">AF Hotel</h1>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Resort & Spa</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? "bg-[#00b4d8] text-white shadow-sm shadow-cyan-100"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-50 pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer group active:scale-98"
          >
            <LogOut className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
            <span>Sistemdən Çıxış</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}