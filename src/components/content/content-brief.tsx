"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Hash, Globe, Users, Target } from "lucide-react";

interface BriefData {
  outline: Array<{ level: string; text: string }>;
  nlpRequired: string[];
  geoRequirements: Record<string, string>;
  competitorInsights: string[];
  targetWordCount: number;
}

interface ContentBriefProps {
  brief: BriefData;
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg border border-zinc-200">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 p-3 text-left hover:bg-zinc-50">
        {open ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronRight className="h-4 w-4 text-zinc-400" />}
        <Icon className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">{title}</span>
      </button>
      {open && <div className="border-t border-zinc-100 p-3">{children}</div>}
    </div>
  );
}

export function ContentBrief({ brief }: ContentBriefProps) {
  return (
    <div className="space-y-3">
      <Section title="Outline" icon={FileText}>
        <div className="space-y-1">
          {brief.outline.map((item, i) => (
            <div key={i} className={`text-sm ${item.level === "h3" ? "ml-6 text-zinc-500" : "font-medium text-zinc-800"}`}>
              {item.level === "h2" ? "## " : "### "}{item.text}
            </div>
          ))}
        </div>
      </Section>
      <Section title="NLP Entities Required" icon={Hash}>
        <div className="flex flex-wrap gap-1.5">
          {brief.nlpRequired.map((e, i) => (
            <span key={i} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{e}</span>
          ))}
        </div>
      </Section>
      <Section title="GEO Requirements" icon={Globe}>
        <ul className="space-y-1 text-sm text-zinc-600">
          {Object.entries(brief.geoRequirements).map(([k, v]) => (
            <li key={k}><span className="font-medium">{k}:</span> {v}</li>
          ))}
        </ul>
      </Section>
      <Section title="Competitor Insights" icon={Users}>
        <ul className="space-y-1 text-sm text-zinc-600">
          {brief.competitorInsights.map((c, i) => <li key={i}>• {c}</li>)}
        </ul>
      </Section>
      <Section title="Target Word Count" icon={Target}>
        <p className="text-2xl font-bold text-zinc-900">{brief.targetWordCount.toLocaleString()} words</p>
      </Section>
    </div>
  );
}
