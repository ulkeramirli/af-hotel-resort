"use client";

import { motion } from "framer-motion";

interface Category {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export default function CategoryTabs({
  categories,
  activeId,
  onSelect,
  className = "",
}: CategoryTabsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden ${
            activeId === cat.id
              ? "text-white shadow-md"
              : "text-stone-500 bg-stone-100 hover:bg-stone-200"
          }`}
          style={activeId === cat.id ? { background: "var(--color-hotel-blue, #00b5d5)" } : undefined}
        >
          {activeId === cat.id && (
            <motion.div
              layoutId="activeTabBackground"
              className="absolute inset-0 bg-[#00b5d5]"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {cat.icon && <span className="w-3.5 h-3.5">{cat.icon}</span>}
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
}
