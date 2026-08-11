import React, { useState } from "react";
import { CURATED_ICONS } from "@/lib/icons";
import { Search, X, Smile } from "lucide-react";
import DynamicIcon from "./DynamicIcon";

interface IconPickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export default function IconPicker({ value, onChange, label = "İkon" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const iconNames = Object.keys(CURATED_ICONS).filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <label className="text-xs font-semibold text-stone-500 mb-1 block">{label}</label>
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs flex items-center justify-between cursor-pointer hover:border-[#00b5d5] transition-colors"
      >
        <div className="flex items-center gap-2">
          {value ? (
            <div className="w-6 h-6 rounded bg-[#00b5d5]/10 text-[#00b5d5] flex items-center justify-center">
              <DynamicIcon name={value} className="w-4 h-4" />
            </div>
          ) : (
            <Smile className="w-5 h-5 text-stone-400" />
          )}
          <span className={value ? "text-[#1e325c] font-bold" : "text-stone-400"}>
            {value || "İkon seçin (və ya emoji daxil edin)"}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 w-full sm:w-[320px] bg-white rounded-2xl shadow-xl border border-stone-100 p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1e325c]">İkon Kitabxanası</span>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-stone-100 rounded-lg text-stone-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İkon axtar..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>

          <div className="h-[200px] overflow-y-auto">
            <div className="grid grid-cols-5 gap-2 pr-1">
              {iconNames.map(name => {
                const isSelected = value === name;
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    title={name}
                    className={`aspect-square flex items-center justify-center rounded-xl transition-all ${
                      isSelected 
                        ? "bg-[#00b5d5] text-white shadow-md scale-105" 
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-[#1e325c]"
                    }`}
                  >
                    <DynamicIcon name={name} className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <p className="text-[10px] text-stone-400 mb-2">Və ya ənənəvi emoji daxil edin:</p>
            <input 
              value={!Object.keys(CURATED_ICONS).includes(value) ? value : ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Emoji (məs: 🌊)"
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#00b5d5]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
