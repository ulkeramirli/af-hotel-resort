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
    <div className={`flex flex-nowrap overflow-x-auto items-center gap-2 sm:gap-3 justify-start lg:justify-center w-full pb-3 -mb-3 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${className}`}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-300 border ${
            activeId === cat.id
              ? "bg-[#00b5d5] text-white border-[#00b5d5] shadow-md shadow-[#00b5d5]/20 scale-105"
              : "bg-white text-stone-500 border-stone-200 hover:border-[#00b5d5]/40 hover:text-[#00b5d5] hover:bg-[#00b5d5]/5"
          }`}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            {cat.icon && <span className="w-3.5 h-3.5">{cat.icon}</span>}
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
}
