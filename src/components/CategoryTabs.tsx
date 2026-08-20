"use client";

import { motion } from "framer-motion";
import { useId } from "react";

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
  layoutIdPrefix?: string;
}

export default function CategoryTabs({
  categories,
  activeId,
  onSelect,
  className = "",
  layoutIdPrefix,
}: CategoryTabsProps) {
  const generatedId = useId();
  const idPrefix = layoutIdPrefix || generatedId;

  if (!categories || categories.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 w-full pb-3 ${className || 'justify-center'}`}>
      {categories.map((cat) => {
        const isActive = activeId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`relative px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-300 outline-none select-none border ${
              isActive
                ? "text-white border-transparent"
                : "text-stone-500 border-stone-200 hover:border-[#00b5d5]/40 hover:text-[#00b5d5] hover:bg-stone-50"
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isActive && (
              <motion.div
                layoutId={`activeCategoryTab-${idPrefix}`}
                className="absolute inset-0 bg-linear-to-r from-[#00b5d5] to-[#0096b1] rounded-xl shadow-lg shadow-[#00b5d5]/25"
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
