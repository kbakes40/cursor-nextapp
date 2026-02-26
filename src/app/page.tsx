"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  sku: string;
  name: string;
  category: string;
  brand: string;
  location: string;
  stock: number;
  reserved: number;
  price: number;
  status: "ok" | "low" | "out";
};

const products: Product[] = [
  {
    sku: "COCO-NARA-1KG",
    name: "Coco Nara Coconut Charcoal 1kg",
    category: "Charcoal",
    brand: "Coco Nara",
    location: "Charcoal Rack A1",
    stock: 120,
    reserved: 24,
    price: 11.5,
    status: "ok",
  },
  {
    sku: "COCO-NARA-BOX-72",
    name: "Coco Nara 27mm Cubes – 72pcs Box",
    category: "Charcoal",
    brand: "Coco Nara",
    location: "Charcoal Rack A1",
    stock: 64,
    reserved: 40,
    price: 9.25,
    status: "low",
  },
  {
    sku: "AEON-VULCAN-BLK",
    name: "AEON Phunnel Vulcan Bowl – Black",
    category: "Bowls",
    brand: "AEON",
    location: "Wall B2",
    stock: 32,
    reserved: 6,
    price: 39.0,
    status: "ok",
  },
  {
    sku: "KONG-GODZILLA",
    name: "Kong Godzilla Hookah Bowl",
    category: "Bowls",
    brand: "Kong",
    location: "Wall B3",
    stock: 14,
    reserved: 10,
    price: 34.5,
    status: "low",
  },
  {
    sku: "AR0-FOIL-50",
    name: "Aro Pre-Poked Hookah Foil – 50 Sheets",
    category: "Foil",
    brand: "Aro",
    location: "Accessories C1",
    stock: 210,
    reserved: 60,
    price: 6.5,
    status: "ok",
  },
  {
    sku: "STARB-F0IL-HEAVY",
    name: "Starbuzz Heavy Duty Hookah Foil",
    category: "Foil",
    brand: "Starbuzz",
    location: "Accessories C1",
    stock: 40,
    reserved: 30,
    price: 7.75,
    status: "low",
  },
  {
    sku: "SMOKE-ISLAND-DA-250",
    name: "Smoke Island Shisha 250g – Double Apple",
    category: "Flavours",
    brand: "Smoke Island",
    location: "Flavours D1",
    stock: 95,
    reserved: 12,
    price: 13.9,
    status: "ok",
  },
  {
    sku: "SMOKE-ISLAND-MINT-ICE",
    name: "Smoke Island Shisha 250g – Mint Ice",
    category: "Flavours",
    brand: "Smoke Island",
    location: "Flavours D1",
    stock: 18,
    reserved: 10,
    price: 13.9,
    status: "low",
  },
  {
    sku: "SMOKE-ISLAND-GRAPE-ICE",
    name: "Smoke Island Shisha 250g – Grape Ice",
    category: "Flavours",
    brand: "Smoke Island",
    location: "Flavours D2",
    stock: 0,
    reserved: 8,
    price: 13.9,
    status: "out",
  },
  {
    sku: "MOB-CLOUDKING-2KG",
    name: "MOB Cloud King Coconut Charcoal 2kg",
    category: "Charcoal",
    brand: "MOB",
    location: "Charcoal Rack A2",
    stock: 44,
    reserved: 6,
    price: 19.9,
    status: "ok",
  },
  {
    sku: "AURA-HOOKAH-COMPLETE",
    name: "Aura Premium Hookah – Complete Set",
    category: "Hookahs",
    brand: "Aura",
    location: "Showroom E1",
    stock: 8,
    reserved: 4,
    price: 229.0,
    status: "ok",
  },
  {
    sku: "BLADE-HOOKAH-X",
    name: "Blade Hookah X Series",
    category: "Hookahs",
    brand: "Blade",
    location: "Showroom E2",
    stock: 5,
    reserved: 4,
    price: 259.0,
    status: "low",
  },
  {
    sku: "VYRO-ONE-STEEL",
    name: "VYRO One Stainless Steel Hookah",
    category: "Hookahs",
    brand: "VYRO",
    location: "Showroom E3",
    stock: 3,
    reserved: 3,
    price: 199.0,
    status: "out",
  },
  {
    sku: "UNION-HOOKAH-COLOR",
    name: "Union Hookah – Color Edition",
    category: "Hookahs",
    brand: "Union",
    location: "Showroom E4",
    stock: 6,
    reserved: 1,
    price: 279.0,
    status: "ok",
  },
  {
    sku: "LED-RING-LIGHT",
    name: "Hookah LED Ring Light",
    category: "Accessories",
    brand: "Boss",
    location: "Accessories C3",
    stock: 52,
    reserved: 9,
    price: 14.5,
    status: "ok",
  },
];

export default function Home() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Charcoal", "Hookahs", "Bowls", "Flavours", "Accessories", "Foil"];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const totalSkus = filteredProducts.length;
  const totalUnits = filteredProducts.reduce(
    (sum, product) => sum + product.stock,
    0
  );
  const lowOrOut = filteredProducts.filter(
    (product) => product.status === "low" || product.status === "out"
  ).length;
  return (
    <main className="min-h-screen bg-[#d7ff3f] px-2 py-4 text-sm text-zinc-100 md:px-6">
      <div className="mx-auto flex max-w-6xl gap-4 rounded-[32px] bg-[#050505] p-3 md:p-5">
        {/* Left sidebar */}
        <aside className="flex w-12 flex-col items-center justify-between rounded-2xl bg-[#0b0b0b] py-4 md:w-14">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-2xl bg-[#d7ff3f]" />
            <div className="h-[1px] w-6 bg-zinc-700/60" />
            {[1, 2, 3, 4, 5].map((num) => {
              const href =
                num === 1
                  ? "/"
                  : num === 2
                  ? "/customers"
                  : num === 3
                  ? "/analytics"
                  : "/";
              const isActive = num === 1;
              return (
                <Link
                  key={num}
                  href={href}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700/60 text-[10px] text-zinc-400 hover:border-[#d7ff3f] hover:text-[#d7ff3f] ${
                    isActive ? "bg-zinc-900/80" : ""
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

        {/* Main content + right column */}
        <section className="flex flex-1 flex-col gap-4 md:flex-row">
          {/* Center content */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Today, {formattedDate}
                </p>
                <h1 className="text-xl font-semibold text-zinc-50 md:text-2xl">
                  Inventory management
                </h1>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {categories.map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-3 py-1.5 transition-colors ${
                        isActive
                          ? "bg-[#d7ff3f] text-zinc-900"
                          : "bg-zinc-900 text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:text-zinc-200"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* Table header */}
            <div className="hidden grid-cols-[1.5fr_3fr_1.3fr_1.3fr_1.6fr_0.9fr_0.9fr] items-center rounded-2xl bg-zinc-900/70 px-4 py-3 text-[11px] text-zinc-500 md:grid">
              <div>SKU</div>
              <div>Product</div>
              <div>Category</div>
              <div>Brand</div>
              <div className="text-right">Location</div>
              <div className="text-right">In stock</div>
              <div className="text-right">Price</div>
            </div>

            {/* Inventory list */}
            <div className="space-y-3 rounded-2xl bg-zinc-950/40 p-2 md:p-3">
              <div className="flex items-center justify-between px-2 text-[11px] text-zinc-500">
                <span>{totalSkus} SKUs • {totalUnits} units in stock</span>
                <span>
                  {lowOrOut} low / out-of-stock items
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-zinc-900/80 bg-zinc-950/60">
                {filteredProducts.map((product, index) => {
                  const isLast = index === filteredProducts.length - 1;
                  const statusColor =
                    product.status === "ok"
                      ? "bg-[#1f2619] text-[#d7ff3f]"
                      : product.status === "low"
                      ? "bg-[#332a14] text-[#facc15]"
                      : "bg-[#3b1f1f] text-[#fb7185]";
                  const available = product.stock - product.reserved;
                  return (
                    <div
                      key={product.sku}
                      className={[
                        "grid grid-cols-1 gap-2 px-3 py-3 text-xs text-zinc-200 transition-colors md:grid-cols-[1.5fr_3fr_1.3fr_1.3fr_1.6fr_0.9fr_0.9fr] md:items-center",
                        !isLast ? "border-b border-zinc-900/80" : "",
                        "hover:bg-zinc-900/60",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d7ff3f]" />
                        <div>
                          <p className="font-medium text-zinc-100">
                            {product.sku}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {available > 0 ? "Available" : "Out of stock"}
                          </p>
                        </div>
                      </div>
                      <div className="text-zinc-200">{product.name}</div>
                      <p className="text-zinc-400">{product.category}</p>
                      <p className="text-zinc-400">{product.brand}</p>
                      <p className="text-right text-zinc-300 md:text-left">
                        {product.location}
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-zinc-200">
                          {product.stock}
                          <span className="text-[10px] text-zinc-500">
                            {" "}
                            ({available} free)
                          </span>
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusColor}`}
                        >
                          {product.status === "ok"
                            ? "OK"
                            : product.status === "low"
                            ? "Low"
                            : "Out"}
                        </span>
                      </div>
                      <p className="text-right font-medium text-zinc-50">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="flex w-full flex-col gap-3 md:w-72">
            {/* Selected route */}
            <div className="space-y-3 rounded-2xl bg-gradient-to-br from-[#14111c] via-[#050408] to-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Selected route
                  </p>
                  <p className="text-xs text-zinc-400">
                    {lowOrOut} items need attention
                  </p>
                </div>
                <div className="rounded-full bg-[#1b1b1f] px-3 py-1 text-[11px] text-zinc-300">
                  {formattedTime}
                </div>
              </div>
              <div className="space-y-2 rounded-xl bg-zinc-950/70 p-3 text-xs">
                <div className="flex items-center justify-between text-zinc-300">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                      Time
                    </p>
                    <p>{formattedTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                      Distance
                    </p>
                    <p>{totalSkus} SKUs</p>
                  </div>
                </div>
                <div className="mt-2 space-y-2 rounded-lg bg-zinc-900/60 p-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-200">
                    <div>
                      <p className="font-medium">Main warehouse</p>
                      <p className="text-[10px] text-zinc-500">
                        Live inventory snapshot
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-zinc-400">
                      <p>In stock: {totalUnits}</p>
                      <p>Low / out: {lowOrOut}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-200">
                    <div>
                      <p className="font-medium">Next replenishment</p>
                      <p className="text-[10px] text-zinc-500">
                        Configure supplier feed
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-zinc-400">
                      <p>Auto-order: off</p>
                      <p>Threshold: 10 units</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <button className="flex-1 rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-100">
                  Save
                </button>
                <button className="flex-1 rounded-full bg-[#d7ff3f] px-3 py-1.5 text-zinc-900">
                  All Recommendations
                </button>
              </div>
            </div>

            {/* Revenue card */}
            <div className="space-y-3 rounded-2xl bg-zinc-950/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Revenue
                  </p>
                  <p className="text-xs text-zinc-400">1 h 32 m</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#1c2711] px-2 py-1 text-[10px] font-medium text-[#d7ff3f]">
                  <span>↑ 2.6%</span>
                </div>
              </div>
              <div className="mt-1 h-20 rounded-xl bg-gradient-to-t from-[#151515] to-[#111827] px-2 pt-3">
                <div className="flex h-full items-end justify-between gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-[#1f2937]"
                      style={{ height: `${20 + (i % 5) * 12}%` }}
                    />
                  ))}
                  <div className="flex-1 rounded-full bg-[#d7ff3f]" />
                </div>
              </div>
            </div>

            {/* Weight / Volume */}
            <div className="flex gap-3">
              <div className="flex-1 space-y-2 rounded-2xl bg-zinc-950/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Weight
                </p>
                <div className="relative flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full border-4 border-zinc-800" />
                  <div className="absolute h-20 w-20 rounded-full border-4 border-[#d7ff3f] border-t-transparent border-l-transparent rotate-45" />
                  <div className="absolute text-center text-xs">
                    <p className="text-lg font-semibold text-zinc-50">542 t</p>
                    <p className="text-[10px] text-zinc-500">/ 681 t</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2 rounded-2xl bg-zinc-950/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Vol
                </p>
                <div className="flex h-20 flex-col items-start justify-between">
                  <div className="rounded-full bg-[#111827] px-3 py-1 text-xs text-zinc-300">
                    2.1 gb
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-[#d7ff3f]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d7ff3f]" />
                    </span>
                    <span>Optimal volume load</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
