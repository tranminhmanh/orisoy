"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, Send, Sparkles, Loader2 } from "lucide-react";

interface OutreachComposerProps {
  onGenerate: (params: any) => void;
  onSend: (email: any) => void;
  email?: { subject: string; body: string };
  isLoading?: boolean;
}

const campaignTypes = [
  "Guest Post",
  "Resource",
  "Broken Link",
  "Partnership",
] as const;

type CampaignType = (typeof campaignTypes)[number];

export function OutreachComposer({
  onGenerate,
  onSend,
  email,
  isLoading = false,
}: OutreachComposerProps) {
  const [campaignType, setCampaignType] = useState<CampaignType>("Guest Post");
  const [prospectDomain, setProspectDomain] = useState("");
  const [prospectEmail, setProspectEmail] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [subjectTouched, setSubjectTouched] = useState(false);
  const [bodyTouched, setBodyTouched] = useState(false);

  const displaySubject = subjectTouched ? editedSubject : (email?.subject ?? "");
  const displayBody = bodyTouched ? editedBody : (email?.body ?? "");

  const handleGenerate = () => {
    onGenerate({
      campaignType,
      prospectDomain,
      prospectEmail,
    });
    setSubjectTouched(false);
    setBodyTouched(false);
  };

  const handleSend = () => {
    onSend({
      to: prospectEmail,
      subject: displaySubject,
      body: displayBody,
      campaignType,
      prospectDomain,
    });
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-zinc-700">
          Outreach Composer
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Campaign Type
          </label>
          <select
            value={campaignType}
            onChange={(e) => setCampaignType(e.target.value as CampaignType)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {campaignTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Prospect Domain
          </label>
          <input
            type="text"
            value={prospectDomain}
            onChange={(e) => setProspectDomain(e.target.value)}
            placeholder="example.com"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Prospect Email
          </label>
          <input
            type="email"
            value={prospectEmail}
            onChange={(e) => setProspectEmail(e.target.value)}
            placeholder="contact@example.com"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !prospectDomain}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          isLoading || !prospectDomain
            ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        Generate Email
      </button>

      {email && (
        <div className="space-y-4 border-t border-zinc-100 pt-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              Subject
            </label>
            <textarea
              rows={2}
              value={displaySubject}
              onChange={(e) => {
                setEditedSubject(e.target.value);
                setSubjectTouched(true);
              }}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              Body
            </label>
            <textarea
              rows={10}
              value={displayBody}
              onChange={(e) => {
                setEditedBody(e.target.value);
                setBodyTouched(true);
              }}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!prospectEmail || !displaySubject || !displayBody}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              !prospectEmail || !displaySubject || !displayBody
                ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            <Send className="h-4 w-4" />
            Send Email
          </button>
        </div>
      )}
    </div>
  );
}
