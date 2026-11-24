"use client";

import { useState } from "react";
import { Sparkles, Check, X, ShieldAlert } from "lucide-react";
import type { MemoryItem } from "@/lib/memory/types";

interface MemorySuggestionPillProps {
  proposedMemories: MemoryItem[];
  onConfirm: (memoryId: string) => Promise<void>;
  onReject: (memoryId: string) => Promise<void>;
  className?: string;
}

export function MemorySuggestionPill({
  proposedMemories,
  onConfirm,
  onReject,
  className = "",
}: MemorySuggestionPillProps) {
  const [activeItems, setActiveItems] = useState<MemoryItem[]>(proposedMemories);

  if (!activeItems || activeItems.length === 0) return null;

  const handleAction = async (id: string, action: "confirm" | "reject") => {
    if (action === "confirm") {
      await onConfirm(id);
    } else {
      await onReject(id);
    }
    setActiveItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={`space-y-2 font-mono text-xs ${className}`}>
      {activeItems.map((item) => (
        <div
          key={item.id}
          className="border-2 border-[#2540D9] bg-[#FBF7EA] p-3 rounded shadow-sm flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-1 rounded bg-[#2540D9]/10 text-[#2540D9] shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[#1B1A17] uppercase text-[10px] tracking-wider">
                  Discovered {item.category.replace("_", " ")} pattern:
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#2540D9]/10 text-[#2540D9] rounded font-semibold">
                  {Math.round(item.confidence * 100)}% confidence
                </span>
              </div>
              <p className="text-xs text-[#1B1A17] truncate font-medium mt-0.5">
                {typeof item.value === "string" ? item.value : JSON.stringify(item.value)}
              </p>
              {item.evidenceQuote && (
                <p className="text-[10px] text-[#8A8576] italic truncate">
                  &ldquo;{item.evidenceQuote}&rdquo;
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleAction(item.id, "confirm")}
              className="px-2.5 py-1 bg-[#1F6B4F] text-white rounded font-bold hover:bg-[#18533E] flex items-center gap-1 transition-colors cursor-pointer"
              title="Save to My DNA"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Remember</span>
            </button>
            <button
              onClick={() => handleAction(item.id, "reject")}
              className="p-1 border border-[#1B1A17]/20 rounded text-[#8A8576] hover:text-[#D8381C] hover:border-[#D8381C] transition-colors cursor-pointer"
              title="Do not store"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
