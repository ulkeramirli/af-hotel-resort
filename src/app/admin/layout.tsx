/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Star,
  Settings,
  LogOut,
  Hotel,
  HelpCircle,
  Ticket as TicketIcon,
  Palmtree,
  Info,
  Castle,
} from "lucide-react";
import { logout, getCurrentUser } from "@/services/api";

// Предполагаем интерфейс пользователя, адаптируйте под вашу схему типов
interface User {
  name: string;
  email: string;
  role?: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login");
    } else {
      setUser(currentUser);
    }
  }, [router]);


  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Otaqlar", href: "/admin/otaqlar", icon: BedDouble },
    { name: "Bronlar", href: "/admin/bronlar", icon: CalendarCheck },
    { name: "Fəaliyyətlər", href: "/admin/activities", icon: Palmtree },
    { name: "Wonderland", href: "/admin/wonderland", icon: Castle },
    { name: "Biletlər", href: "/admin/tickets", icon: TicketIcon },
    { name: "Rəylər", href: "/admin/reviews", icon: Star },
    { name: "Haqqımızda", href: "/admin/about", icon: Info },
    { name: "FAQ", href: "/admin/faqs", icon: HelpCircle },
    { name: "Tənzimləmələr", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-hotel-light)" }}>
      <aside className="w-64 bg-white border-r border-stone-100 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0 shadow-sm">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: "var(--color-hotel-blue)", color: "#fff" }}
            >
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide uppercase" style={{ color: "#1e325c" }}>
                AF Hotel
              </h1>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Resort & Aqua Park
              </p>
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
                      ? "text-white shadow-md"
                      : "text-stone-500 hover:text-[#1e325c] hover:bg-stone-50"
                  }`}
                  style={isActive ? { background: "var(--color-hotel-blue)" } : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-stone-100 pt-4 space-y-3">
          {user && (
            <div className="px-4 py-2 bg-stone-50 rounded-xl">
              <p className="text-xs font-bold text-[#1e325c]">{user.name}</p>
              <p className="text-[10px] text-stone-400">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
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