import type { Provenance } from "@/lib/engine";

interface Props {
  source: Provenance;
  className?: string;
}

export function ProvenanceChip({ source, className = "" }: Props) {
  const configs: Record<Provenance, { label: string; bg: string; text: string; border: string }> = {
    verified: {
      label: "VERIFIED",
      bg: "bg-[#1F6B4F]/10",
      text: "text-[#1F6B4F]",
      border: "border-[#1F6B4F]/30",
    },
    source_claim: {
      label: "SOURCE CLAIM",
      bg: "bg-[#8A8576]/15",
      text: "text-[#1B1A17]",
      border: "border-[#8A8576]/40",
    },
    user_input: {
      label: "USER INPUT",
      bg: "bg-[#2540D9]/10",
      text: "text-[#2540D9]",
      border: "border-[#2540D9]/30",
    },
    ai_inference: {
      label: "AI INFERENCE",
      bg: "bg-[#F3C94B]/20",
      text: "text-[#1B1A17]",
      border: "border-[#F3C94B]/50",
    },
    assumption: {
      label: "ASSUMPTION",
      bg: "bg-[#F3C94B]/25",
      text: "text-[#1B1A17]",
      border: "border-[#1B1A17]/20",
    },
    unknown: {
      label: "UNKNOWN",
      bg: "bg-[#8A8576]/10",
      text: "text-[#8A8576]",
      border: "border-[#8A8576]/30",
    },
  };

  const c = configs[source] || configs.unknown;

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase border font-medium ${c.bg} ${c.text} ${c.border} ${className}`}
      title={`Provenance: ${source}`}
    >
      {c.label}
    </span>
  );
}
