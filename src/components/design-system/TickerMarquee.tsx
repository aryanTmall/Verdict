export function TickerMarquee() {
  const claims = [
    "No sponsored rankings",
    "Every number shows its source",
    "We say 'can't verify' when we can't",
    "Tested against 200+ verified owner reviews",
    "Deterministic engine, zero vibe math",
    "No purchases made automatically",
  ];

  return (
    <div className="w-full overflow-hidden bg-[#1B1A17] text-[#F2EBD8] py-2.5 border-y border-[#1B1A17] select-none">
      <div className="animate-ticker flex items-center space-x-8 font-mono text-xs uppercase tracking-wider font-medium">
        {/* Repeating twice for smooth infinite loop */}
        {[...claims, ...claims].map((claim, idx) => (
          <div key={idx} className="flex items-center space-x-6 whitespace-nowrap">
            <span>{claim}</span>
            <span className="text-[#F3C94B]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
