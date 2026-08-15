"use client";
import { useCallback, useRef, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[100] mx-auto bg-stone-900/60 backdrop-blur-sm p-4 sm:p-10"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] bg-stone-50 rounded-2xl shadow-2xl overflow-y-auto"
      >
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white text-stone-600 rounded-full shadow-sm backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
