import React from "react";

interface WindowChromeProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function WindowChrome({
  title,
  badge,
  children,
  className = "",
  onClose,
}: WindowChromeProps) {
  return (
    <div
      className={`bg-[#FBF7EA] border border-[#1B1A17] rounded-[10px] overflow-hidden paper-shadow ${className}`}
    >
      {/* Title bar */}
      <div className="bg-[#1B1A17] text-[#FBF7EA] px-3.5 py-2 flex items-center justify-between select-none border-b border-[#1B1A17]">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs tracking-tight text-[#F2EBD8]/90 font-medium">
            case_file://{title}
          </span>
          {badge && (
            <span className="bg-[#2540D9] text-white text-[9px] font-mono px-1.5 py-0.2 rounded uppercase">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#8A8576]/60 border border-[#FBF7EA]/30" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F3C94B] border border-[#1B1A17]/30" />
          {onClose ? (
            <button
              onClick={onClose}
              className="inline-block w-2.5 h-2.5 rounded-full bg-[#D8381C] hover:opacity-80 transition cursor-pointer"
              title="Close panel"
              aria-label="Close panel"
            />
          ) : (
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D8381C] border border-[#1B1A17]/30" />
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}
