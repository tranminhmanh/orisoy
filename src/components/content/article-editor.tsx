"use client";

import { useState } from "react";
import { Bold, Italic, Heading2, Heading3, Link, ImageIcon, List, Eye, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function ArticleEditor({ content, onChange }: ArticleEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");

  const insert = (before: string, after = "") => {
    const el = document.querySelector<HTMLTextAreaElement>("#article-editor");
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    onChange(newContent);
  };

  const toolbar = [
    { icon: Bold, action: () => insert("**", "**"), label: "Bold" },
    { icon: Italic, action: () => insert("*", "*"), label: "Italic" },
    { icon: Heading2, action: () => insert("\n## "), label: "H2" },
    { icon: Heading3, action: () => insert("\n### "), label: "H3" },
    { icon: Link, action: () => insert("[", "](url)"), label: "Link" },
    { icon: ImageIcon, action: () => insert("![alt](", ")"), label: "Image" },
    { icon: List, action: () => insert("\n- "), label: "List" },
  ];

  const renderPreview = (md: string) => {
    return md
      .replace(/### (.+)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/## (.+)/g, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
      .replace(/^- (.+)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2">
        <div className="flex gap-1">
          {toolbar.map((t) => (
            <button key={t.label} onClick={t.action} title={t.label} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700">
              <t.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <div className="flex rounded-lg bg-zinc-100 p-0.5">
          <button onClick={() => setMode("write")} className={cn("flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium", mode === "write" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500")}>
            <Edit3 className="h-3 w-3" /> Write
          </button>
          <button onClick={() => setMode("preview")} className={cn("flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium", mode === "preview" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500")}>
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
      </div>
      {mode === "write" ? (
        <textarea
          id="article-editor"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[500px] w-full resize-y p-4 font-mono text-sm focus:outline-none"
          placeholder="Write your article in Markdown..."
        />
      ) : (
        <div className="prose max-w-none p-4 text-sm" dangerouslySetInnerHTML={{ __html: renderPreview(content) }} />
      )}
    </div>
  );
}
