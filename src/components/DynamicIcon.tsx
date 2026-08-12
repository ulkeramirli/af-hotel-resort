import React from "react";
import { CURATED_ICONS } from "@/lib/icons";

export default function DynamicIcon({ name, className = "" }: { name?: string, className?: string }) {
  if (!name) return null;
  
  // If it's an actual emoji (contains non-ascii or is very short and no standard English letters)
  const isEmoji = name.length > 0 && name.length <= 4 && !/[a-zA-Z]/.test(name);
  if (isEmoji) {
    return <span className={className}>{name}</span>;
  }

  const IconComponent = CURATED_ICONS[name];
  if (!IconComponent) return <span className={className}>{name}</span>;

  return <IconComponent className={className} />;
}
