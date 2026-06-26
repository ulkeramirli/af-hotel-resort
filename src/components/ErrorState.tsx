"use client";
 
import { AlertCircle, RefreshCw, Wifi, Lock, ServerCrash } from "lucide-react";
import { ApiError } from "@/lib/apiClient";
 
interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}
 
export function ErrorState({ error, onRetry, className = "" }: ErrorStateProps) {
  const { icon: Icon, title, message, canRetry } = getErrorInfo(error);
 
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6">{message}</p>
      {canRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                     bg-[#00b5d5] text-white hover:bg-[#009bbf] transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Yenidən cəhd et
        </button>
      )}
    </div>
  );
}
 
function getErrorInfo(error: unknown) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      return {
        icon: Lock,
        title: "İcazə tələb olunur",
        message: error.message,
        canRetry: false,
      };
    }
    if (error.statusCode === 404) {
      return {
        icon: AlertCircle,
        title: "Tapılmadı",
        message: error.message,
        canRetry: false,
      };
    }
    if (error.statusCode >= 500) {
      return {
        icon: ServerCrash,
        title: "Server xətası",
        message: error.message,
        canRetry: true,
      };
    }
  }
 
  // Network error
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      icon: Wifi,
      title: "Bağlantı xətası",
      message: "İnternet bağlantınızı yoxlayın və yenidən cəhd edin",
      canRetry: true,
    };
  }
 
  return {
    icon: AlertCircle,
    title: "Xəta baş verdi",
    message: error instanceof Error ? error.message : "Gözlənilməz xəta",
    canRetry: true,
  };
}
 
// ─── Skeleton loader ──────────────────────────────────────────
export function RoomCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
      <div className="h-56 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
        <div className="flex justify-between mt-4">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-8 bg-slate-200 rounded-full w-1/3" />
        </div>
      </div>
    </div>
  );
}
 
export function RoomDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[60vh] bg-slate-200 rounded-2xl mb-8" />
      <div className="max-w-4xl mx-auto space-y-4 px-4">
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </div>
    </div>
  );
}