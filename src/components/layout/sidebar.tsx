"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  FileText,
  Shield,
  Link as LinkIcon,
  Brain,
  Send,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubItem {
  label: string;
  href: string;
}

interface NavModule {
  label: string;
  icon: React.ElementType;
  href: string;
  subItems: SubItem[];
}

const navModules: NavModule[] = [
  {
    label: "Keyword Research",
    icon: Search,
    href: "/dashboard/keywords",
    subItems: [
      { label: "Clusters", href: "/dashboard/keywords/clusters" },
      { label: "Competitors", href: "/dashboard/keywords/competitors" },
    ],
  },
  {
    label: "Content Studio",
    icon: FileText,
    href: "/dashboard/content",
    subItems: [
      { label: "New Content", href: "/dashboard/content/new" },
      { label: "Calendar", href: "/dashboard/content/calendar" },
    ],
  },
  {
    label: "Technical Audit",
    icon: Shield,
    href: "/dashboard/audit",
    subItems: [
      { label: "Schema", href: "/dashboard/audit/schema" },
      { label: "Internal Links", href: "/dashboard/audit/links" },
      { label: "Web Vitals", href: "/dashboard/audit/vitals" },
    ],
  },
  {
    label: "Off-Page SEO",
    icon: LinkIcon,
    href: "/dashboard/backlinks",
    subItems: [
      { label: "Toxic Links", href: "/dashboard/backlinks/toxic" },
      { label: "Link Gap", href: "/dashboard/backlinks/gap" },
      { label: "Outreach", href: "/dashboard/backlinks/outreach" },
      { label: "Mentions", href: "/dashboard/backlinks/mentions" },
    ],
  },
  {
    label: "GEO Optimizer",
    icon: Brain,
    href: "/dashboard/geo",
    subItems: [
      { label: "Simulation", href: "/dashboard/geo/simulation" },
      { label: "AI Visibility", href: "/dashboard/geo/visibility" },
    ],
  },
  {
    label: "Publishing",
    icon: Send,
    href: "/dashboard/publishing",
    subItems: [
      { label: "Platforms", href: "/dashboard/publishing/platforms" },
      { label: "Indexing", href: "/dashboard/publishing/indexing" },
      { label: "Automation", href: "/dashboard/publishing/automation" },
    ],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    subItems: [
      { label: "ROI", href: "/dashboard/analytics/roi" },
      { label: "Reports", href: "/dashboard/analytics/reports" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    subItems: [
      { label: "Vietnamese NLP", href: "/dashboard/settings/vietnamese" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedModules, setExpandedModules] = useState<string[]>(() => {
    const active = navModules.find(
      (m) => pathname === m.href || pathname.startsWith(m.href + "/")
    );
    return active ? [active.href] : [];
  });

  const toggleModule = (href: string) => {
    setExpandedModules((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isModuleActive = (mod: NavModule) =>
    pathname === mod.href || pathname.startsWith(mod.href + "/");

  const isSubItemActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo / Title */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <Link
              href="/dashboard"
              className="text-lg font-bold text-foreground"
            >
              Orisoy SEO
            </Link>
          )}
          {collapsed && (
            <Link
              href="/dashboard"
              className="mx-auto text-lg font-bold text-foreground"
            >
              O
            </Link>
          )}
          <button
            onClick={onToggle}
            className={cn(
              "hidden rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-hover lg:block",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {navModules.map((mod) => {
              const Icon = mod.icon;
              const active = isModuleActive(mod);
              const expanded = expandedModules.includes(mod.href);

              return (
                <li key={mod.href}>
                  {/* Module button */}
                  <div className="flex items-center">
                    <Link
                      href={mod.href}
                      onClick={() => {
                        if (mobileOpen && collapsed) onMobileClose();
                      }}
                      className={cn(
                        "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-active text-sidebar-active-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-hover"
                      )}
                      title={collapsed ? mod.label : undefined}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <span className="truncate">{mod.label}</span>
                      )}
                    </Link>
                    {!collapsed && mod.subItems.length > 0 && (
                      <button
                        onClick={() => toggleModule(mod.href)}
                        className={cn(
                          "rounded-md p-1.5 transition-colors",
                          active
                            ? "text-sidebar-active-foreground/70 hover:text-sidebar-active-foreground"
                            : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
                        )}
                        aria-label={
                          expanded ? "Collapse section" : "Expand section"
                        }
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expanded && "rotate-180"
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {/* Sub-items */}
                  {!collapsed && expanded && mod.subItems.length > 0 && (
                    <ul className="ml-5 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                      {mod.subItems.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => {
                              if (mobileOpen) onMobileClose();
                            }}
                            className={cn(
                              "block rounded-md px-3 py-1.5 text-sm transition-colors",
                              isSubItemActive(sub.href)
                                ? "font-medium text-primary"
                                : "text-sidebar-foreground hover:bg-sidebar-hover"
                            )}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border p-4">
          {!collapsed && (
            <p className="text-xs text-muted-foreground">
              Orisoy SEO Suite v0.1
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
