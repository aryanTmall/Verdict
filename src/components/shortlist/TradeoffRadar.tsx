"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { Evaluation } from "@/lib/engine";
import { CRITERIA } from "@/lib/engine";

interface TradeoffRadarProps {
  evals: Evaluation[]; // top 3
}

export function TradeoffRadar({ evals }: TradeoffRadarProps) {
  if (evals.length < 2) return null;

  const topThree = evals.slice(0, 3);

  // Format data for Recharts Radar
  const data = CRITERIA.map((criterion) => {
    const entry: Record<string, any> = {
      criterion: criterion.toUpperCase(),
    };

    topThree.forEach((ev, i) => {
      const key = `exhibit_${i}`;
      entry[key] = Math.round(ev.breakdown[criterion]?.score ?? 50);
    });

    return entry;
  });

  const colors = [
    { stroke: "#2540D9", fill: "#2540D9", name: `Exhibit A: ${topThree[0]?.product.brand}` },
    { stroke: "#D8381C", fill: "#D8381C", name: `Exhibit B: ${topThree[1]?.product.brand}` },
    { stroke: "#1F6B4F", fill: "#1F6B4F", name: `Exhibit C: ${topThree[2]?.product.brand}` },
  ];

  return (
    <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-5 paper-shadow font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#1B1A17]/20">
        <span className="font-bold uppercase tracking-wider text-[#1B1A17]">
          TRADE-OFF RADAR (EXHIBITS A / B / C)
        </span>
        <div className="flex items-center space-x-3 text-[10px]">
          {topThree.map((ev, i) => (
            <div key={i} className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: colors[i].stroke }} />
              <span className="font-semibold text-[#1B1A17]">
                Ex {String.fromCharCode(65 + i)}: {ev.product.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1B1A17" strokeOpacity={0.15} />
            <PolarAngleAxis
              dataKey="criterion"
              tick={{ fill: "#1B1A17", fontSize: 10, fontFamily: "var(--font-ibm-plex-mono)" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#8A8576"
              tick={{ fontSize: 9, fill: "#8A8576" }}
            />
            {topThree.map((_, i) => (
              <Radar
                key={i}
                name={colors[i].name}
                dataKey={`exhibit_${i}`}
                stroke={colors[i].stroke}
                fill={colors[i].fill}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
