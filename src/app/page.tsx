"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Site definitions ─────────────────────────────────────────── */
type SiteStatus = "live" | "preview" | "offline";

type Site = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  status: SiteStatus;
  badge?: string;
  lastDeployed: string;
  pages?: string[];
};

const sites: Site[] = [
  {
    id: "bosshookah-main",
    name: "Boss Hookah Wholesale",
    description: "Main storefront — premium shisha, hookahs, vapes & accessories",
    url: "https://bosshookah.site",
    category: "Storefront",
    status: "live",
    badge: "Primary",
    lastDeployed: "Active",
    pages: ["Home", "Hookahs", "Shisha", "Charcoal", "Vapes", "Accessories", "Bundles", "Deals", "Wholesale"],
  },
  {
    id: "bosshookah-v0",
    name: "Boss Hookah Wholesale (v0)",
    description: "v0-built wholesale site with featured collections & newsletter",
    url: "https://v0-the-hookah-shop.vercel.app",
    category: "Storefront",
    status: "live",
    badge: "v0",
    lastDeployed: "Vercel",
    pages: ["Home", "Products", "Hookahs", "Tobacco", "Accessories", "Vapes", "About", "Contact"],
  },
  {
    id: "bosshookah-clone",
    name: "5-Star Hookah Clone",
    description: "Shopify-style clone site with full product catalogue",
    url: "https://5star-hookah-clone-qtxw.vercel.app",
    category: "Storefront",
    status: "live",
    lastDeployed: "Vercel",
    pages: ["Home", "Hookahs", "Shisha", "Charcoal", "Vapes", "Accessories", "Bowls", "Bundles"],
  },
  {
    id: "nextgen-fiber",
    name: "NextGen Fiber",
    description: "Customer & installation management portal for fiber services",
    url: "https://nextgen-fiber.vercel.app",
    category: "Admin Portal",
    status: "live",
    lastDeployed: "Vercel",
    pages: ["Dashboard", "Customers", "Installations", "Notifications"],
  },
  {
    id: "inventory",
    name: "Inventory Dashboard",
    description: "This dashboard — inventory, customers, analytics & order management",
    url: "https://cursor-nextapp.vercel.app",
    category: "Dashboard",
    status: "live",
    badge: "Here",
    lastDeployed: "Vercel",
    pages: ["Inventory", "Customers", "Analytics"],
  },
  {
    id: "davinci",
    name: "Da Vinci Dynamics",
    description: "AI-powered business website for Da Vinci Dynamics",
    url: "https://v0-da-vinci-dynamics-website.vercel.app",
    category: "Business Site",
    status: "live",
    lastDeployed: "Vercel",
    pages: ["Home", "Services", "About", "Contact"],
  },
  {
    id: "magic-portfolio",
    name: "Magic Portfolio",
    description: "Personal portfolio site",
    url: "https://magic-portfolio-puce.vercel.app",
    category: "Portfolio",
    status: "live",
    lastDeployed: "Vercel",
    pages: ["Home", "Work", "About"],
  },
];

const categories = ["All", "Storefront", "Dashboard", "Admin Portal", "Business Site", "Portfolio"];

const statusColors: Record<SiteStatus, string> = {
  live: "bg-[#1f2619] text-[#d7ff3f]",
  preview: "bg-[#1c1c2e] text-[#818cf8]",
  offline: "bg-[#3b1f1f] text-[#fb7185]",
};

const statusDot: Record<SiteStatus, string> = {
  live: "bg-[#d7ff3f]",
  preview: "bg-[#818cf8]",
  offline: "bg-[#fb7185]",
};

export default function Home() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedSite, setExpandedSite] = useState<string | null>(null);

  const filtered =
    activeCategory === "All" ? sites : sites.filter((s) => s.category === activeCategory);

  const liveSites = sites.filter((s) => s.status === "live").length;
  const totalPages = sites.reduce((sum, s) => sum + (s.pages?.length ?? 0), 0);

  return (
    <main className="min-h-screen bg-[#d7ff3f] px-2 py-4 text-sm text-zinc-100 md:px-6">
      <div className="mx-auto flex max-w-6xl gap-4 rounded-[32px] bg-[#050505] p-3 md:p-5">

        {/* Left sidebar */}
        <aside className="flex w-12 flex-col items-center justify-between rounded-2xl bg-[#0b0b0b] py-4 md:w-14">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-2xl bg-[#d7ff3f]" />
            <div className="h-[1px] w-6 bg-zinc-700/60" />
            {[
              { num: 1, href: "/", label: "Hub" },
              { num: 2, href: "/customers", label: "CRM" },
              { num: 3, href: "/analytics", label: "Stats" },
            ].map(({ num, href, label }) => {
              const isActive = num === 1;
              return (
                <Link
                  key={num}
                  href={href}
                  title={label}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700/60 text-[10px] text-zinc-400 hover:border-[#d7ff3f] hover:text-[#d7ff3f] ${
                    isActive ? "border-[#d7ff3f] bg-zinc-900/80 text-[#d7ff3f]" : ""
                  }`}
                >
                  {num}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-zinc-900/80" />
            <div className="h-7 w-7 rounded-full border border-zinc-600/70" />
          </div>
        </aside>

        {/* Main content */}
        <section className="flex flex-1 flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">

            {/* Header */}
            <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Today, {formattedDate}
                </p>
                <h1 className="text-xl font-semibold text-zinc-50 md:text-2xl">
                  Site Hub
                </h1>
                <p className="mt-0.5 text-xs text-zinc-500">
                  All your Boss Hookah properties in one place
                </p>
              </div>
              {/* Category filters */}
              <div className="flex flex-wrap justify-center gap-2 text-xs md:justify-end">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full px-3 py-1.5 transition-colors ${
                        isActive
                          ? "bg-[#d7ff3f] font-semibold text-zinc-900"
                          : "bg-zinc-900 text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:text-zinc-200"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* Site cards grid */}
            <div className="space-y-2">
              {filtered.map((site) => {
                const isExpanded = expandedSite === site.id;
                return (
                  <div
                    key={site.id}
                    className="overflow-hidden rounded-2xl border border-zinc-900/80 bg-zinc-950/60 transition-all"
                  >
                    {/* Card header row */}
                    <div
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-zinc-900/40"
                      onClick={() =>
                        setExpandedSite(isExpanded ? null : site.id)
                      }
                    >
                      {/* Status dot */}
                      <span
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${statusDot[site.status]}`}
                      />

                      {/* Name + description */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-zinc-100">{site.name}</p>
                          {site.badge && (
                            <span className="rounded-full bg-[#1c2711] px-2 py-0.5 text-[10px] font-semibold text-[#d7ff3f]">
                              {site.badge}
                            </span>
                          )}
                          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-500">
                            {site.category}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                          {site.description}
                        </p>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`hidden flex-shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold md:inline-flex ${statusColors[site.status]}`}
                      >
                        {site.status === "live"
                          ? "Live"
                          : site.status === "preview"
                          ? "Preview"
                          : "Offline"}
                      </span>

                      {/* Open link */}
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-shrink-0 rounded-full bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 transition-colors hover:bg-[#d7ff3f] hover:text-zinc-900"
                      >
                        Open ↗
                      </a>

                      {/* Expand chevron */}
                      <span
                        className={`flex-shrink-0 text-zinc-600 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </div>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <div className="border-t border-zinc-900/80 bg-zinc-950/80 px-4 py-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          {/* URL */}
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                              URL
                            </p>
                            <a
                              href={site.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#d7ff3f] hover:underline"
                            >
                              {site.url}
                            </a>
                          </div>
                          {/* Deployed via */}
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                              Hosted via
                            </p>
                            <p className="text-xs text-zinc-300">{site.lastDeployed}</p>
                          </div>
                          {/* Status */}
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                              Status
                            </p>
                            <p className="text-xs text-zinc-300 capitalize">{site.status}</p>
                          </div>
                        </div>

                        {/* Pages list */}
                        {site.pages && site.pages.length > 0 && (
                          <div className="mt-3">
                            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                              Pages
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {site.pages.map((page) => (
                                <span
                                  key={page}
                                  className="rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400"
                                >
                                  {page}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="flex w-full flex-col gap-3 md:w-72">

            {/* Overview card */}
            <div className="space-y-3 rounded-2xl bg-gradient-to-br from-[#14111c] via-[#050408] to-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Network overview
                  </p>
                  <p className="text-xs text-zinc-400">Boss Hookah properties</p>
                </div>
                <div className="rounded-full bg-[#1b1b1f] px-3 py-1 text-[11px] text-zinc-300">
                  {formattedTime}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-zinc-950/70 p-3 text-center">
                  <p className="text-2xl font-bold text-[#d7ff3f]">{sites.length}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    Total Sites
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-950/70 p-3 text-center">
                  <p className="text-2xl font-bold text-[#d7ff3f]">{liveSites}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    Live
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-950/70 p-3 text-center">
                  <p className="text-2xl font-bold text-zinc-100">{totalPages}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    Total Pages
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-950/70 p-3 text-center">
                  <p className="text-2xl font-bold text-zinc-100">
                    {categories.length - 1}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    Categories
                  </p>
                </div>
              </div>
            </div>

            {/* Quick links card */}
            <div className="space-y-2 rounded-2xl bg-zinc-950/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Quick launch
              </p>
              {sites
                .filter((s) => s.status === "live")
                .slice(0, 5)
                .map((site) => (
                  <a
                    key={site.id}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-3 py-2 text-xs transition-colors hover:bg-zinc-800/80"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d7ff3f]" />
                      <span className="truncate text-zinc-200">{site.name}</span>
                    </div>
                    <span className="flex-shrink-0 text-zinc-600">↗</span>
                  </a>
                ))}
            </div>

            {/* Internal nav card */}
            <div className="space-y-2 rounded-2xl bg-zinc-950/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Dashboard pages
              </p>
              {[
                { href: "/", label: "Site Hub", active: true },
                { href: "/customers", label: "Customers & Orders", active: false },
                { href: "/analytics", label: "Analytics", active: false },
              ].map(({ href, label, active }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                    active
                      ? "bg-[#1c2711] text-[#d7ff3f]"
                      : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
                  }`}
                >
                  <span>{label}</span>
                  {active && <span className="text-[10px]">●</span>}
                </Link>
              ))}
            </div>

          </aside>
        </section>
      </div>
    </main>
  );
}
