import React from "react";

interface RubberStampProps {
  verdict: "buy" | "wait" | "avoid" | "alternative";
  caution?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RubberStamp({
  verdict,
  caution = false,
  className = "",
  size = "md",
}: RubberStampProps) {
  const configs = {
    buy: {
      text: caution ? "BUY WITH CAUTION" : "VERDICT: BUY",
      color: caution ? "text-[#D8381C] border-[#D8381C]" : "text-[#1F6B4F] border-[#1F6B4F]",
      rotation: "-rotate-2",
    },
    wait: {
      text: "VERDICT: WAIT",
      color: "text-[#D8381C] border-[#D8381C]",
      rotation: "rotate-2",
    },
    avoid: {
      text: "VERDICT: AVOID",
      color: "text-[#D8381C] border-[#D8381C]",
      rotation: "-rotate-3",
    },
    alternative: {
      text: "CHOOSE ALTERNATIVE",
      color: "text-[#2540D9] border-[#2540D9]",
      rotation: "rotate-1",
    },
  };

  const current = configs[verdict] || configs.buy;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs border-2 tracking-widest",
    md: "px-4 py-2 text-base md:text-lg border-[3px] tracking-[0.2em]",
    lg: "px-6 py-3 text-2xl md:text-3xl border-[4px] tracking-[0.25em]",
  };

  return (
    <div
      className={`inline-block font-mono font-bold uppercase select-none transition-transform duration-200 mix-blend-multiply ${current.color} ${current.rotation} ${sizeClasses[size]} ${className}`}
      style={{
        filter: "url(#stamp-filter)",
      }}
    >
      <div className="border border-current p-0.5">
        <span className="block px-2 py-0.5 border border-dashed border-current">
          {current.text}
        </span>
      </div>
    </div>
  );
}
