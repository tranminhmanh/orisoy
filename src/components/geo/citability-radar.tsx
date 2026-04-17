"use client";

import { cn, getScoreColor } from "@/lib/utils";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface CitabilityScore {
  total: number;
  factDensity: number;
  directAnswer: number;
  sourceAuthority: number;
  structuralClarity: number;
  entityDensity: number;
  semanticUniqueness: number;
  crossPlatform: number;
}

interface CitabilityRadarProps {
  score: CitabilityScore;
}

export function CitabilityRadar({ score }: CitabilityRadarProps) {
  const data = [
    { axis: "Fact Density", value: score.factDensity },
    { axis: "Direct Answer", value: score.directAnswer },
    { axis: "Source Authority", value: score.sourceAuthority },
    { axis: "Structural Clarity", value: score.structuralClarity },
    { axis: "Entity Density", value: score.entityDensity },
    { axis: "Semantic Uniqueness", value: score.semanticUniqueness },
    { axis: "Cross-Platform", value: score.crossPlatform },
  ];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 space-y-4">
      <div className="text-center">
        <span
          className={cn("text-4xl font-bold", getScoreColor(score.total))}
        >
          {score.total}
        </span>
        <p className="text-xs text-zinc-400 mt-1">Citability Score</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e4e4e7" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 11, fill: "#71717a" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2">
        {data.map((d) => (
          <div
            key={d.axis}
            className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-1.5"
          >
            <span className="text-xs text-zinc-600">{d.axis}</span>
            <span
              className={cn("text-xs font-bold", getScoreColor(d.value))}
            >
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
