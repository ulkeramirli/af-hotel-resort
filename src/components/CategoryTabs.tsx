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
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 w-full pb-3 ${className || 'justify-center'}`}>
      {categories.map((cat) => {
        const isActive = activeId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`relative px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-[13px] font-bold transition-colors duration-300 outline-none select-none ${
              isActive
                ? "text-white"
                : "text-stone-500 hover:text-[#00b5d5] hover:bg-stone-50"
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryTab"
                className="absolute inset-0 bg-linear-to-r from-[#00b5d5] to-[#0096b1] rounded-full shadow-lg shadow-[#00b5d5]/25"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 tracking-wide">
              {cat.icon && <span className="w-4 h-4">{cat.icon}</span>}
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
