"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Supabase config ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://fxctqikvhmiodcgcxijc.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Y3RxaWt2aG1pb2RjZ2N4aWpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg3NTA0NiwiZXhwIjoyMDg3NDUxMDQ2fQ.qUBEfaIsQ1umxagV_5zxBuESM2Nb4nip4yVXgJWxxos";

async function sbFetch(table: string, params = "") {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface BhProduct { id: string; name: string; category: string; price: number; stock: number; sku: string; created_at: string; }
interface BhOrder { id: string; customer_name: string; customer_email: string; total: number; status: string; created_at: string; }
interface BhCustomer { id: string; name: string; email: string; phone: string; total_spent: number; order_count: number; created_at: string; }
interface WkLead { id: string; name: string; email: string; phone: string; address: string; provider: string; plan: string; status: string; created_at: string; }
interface WkInstallation { id: string; customer_name: string; address: string; provider: string; scheduled_date: string; status: string; created_at: string; }
interface SapOrder { id: string; customer_name: string; customer_email: string; total: number; status: string; promo_code: string; created_at: string; }
interface SapProduct { id: string; name: string; category: string; price: number; stock: number; promo_price: number; created_at: string; }

// ─── Status badge (dark theme) ────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-900/60 text-yellow-300",
    completed: "bg-[#1f2619] text-[#d7ff3f]",
    cancelled: "bg-red-900/60 text-red-300",
    new: "bg-blue-900/60 text-blue-300",
    contacted: "bg-purple-900/60 text-purple-300",
    converted: "bg-[#1f2619] text-[#d7ff3f]",
    scheduled: "bg-indigo-900/60 text-indigo-300",
    installed: "bg-[#1f2619] text-[#d7ff3f]",
    processing: "bg-orange-900/60 text-orange-300",
    shipped: "bg-cyan-900/60 text-cyan-300",
    delivered: "bg-[#1f2619] text-[#d7ff3f]",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${map[status?.toLowerCase()] ?? "bg-zinc-800 text-zinc-400"}`}>
      {status}
    </span>
  );
}

// ─── Stat card (dark) ─────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl bg-zinc-950/70 p-4 border border-zinc-900/80">
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="text-2xl font-bold text-[#d7ff3f] mt-1">{value}</p>
      {sub && <p className="text-[11px] mt-0.5 text-zinc-500">{sub}</p>}
    </div>
  );
}

// ─── Empty state (dark) ───────────────────────────────────────────────────────
function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-zinc-600">
      <svg className="w-10 h-10 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-xs text-zinc-600">{msg}</p>
    </div>
  );
}

// ─── Pagination (dark) ────────────────────────────────────────────────────────
function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <span className="text-[11px] text-zinc-600">Page {page} of {pages} &middot; {total} records</span>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1}
          className="px-3 py-1 text-xs rounded-lg border border-zinc-800 text-zinc-400 disabled:opacity-30 hover:border-[#d7ff3f] hover:text-[#d7ff3f] transition-colors">‹</button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`px-3 py-1 text-xs rounded-lg border transition-colors ${p === page ? "bg-[#d7ff3f] text-zinc-900 border-[#d7ff3f] font-semibold" : "border-zinc-800 text-zinc-400 hover:border-[#d7ff3f] hover:text-[#d7ff3f]"}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === pages}
          className="px-3 py-1 text-xs rounded-lg border border-zinc-800 text-zinc-400 disabled:opacity-30 hover:border-[#d7ff3f] hover:text-[#d7ff3f] transition-colors">›</button>
      </div>
    </div>
  );
}

// ─── Section nav pills ────────────────────────────────────────────────────────
function SectionNav<T extends string>({ sections, active, onChange }: { sections: T[]; active: T; onChange: (s: T) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {sections.map(s => (
        <button key={s} onClick={() => onChange(s)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${active === s ? "bg-[#d7ff3f] text-zinc-900" : "bg-zinc-900 text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:text-zinc-200"}`}>
          {s}
        </button>
      ))}
    </div>
  );
}

// ─── Table wrapper ────────────────────────────────────────────────────────────
function DarkTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-900/80 bg-zinc-950/60">
      <table className="w-full text-xs">{children}</table>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.14em] text-zinc-600 bg-zinc-950/80 font-medium">{children}</th>;
}
function Td({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return <td className={`px-4 py-3 ${muted ? "text-zinc-500" : "text-zinc-200"}`}>{children}</td>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 — Boss Hookah
// ═══════════════════════════════════════════════════════════════════════════════
function BossHookahTab() {
  const [products, setProducts] = useState<BhProduct[]>([]);
  const [orders, setOrders] = useState<BhOrder[]>([]);
  const [customers, setCustomers] = useState<BhCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"overview" | "products" | "orders" | "customers">("overview");
  const [prodPage, setProdPage] = useState(1);
  const [ordPage, setOrdPage] = useState(1);
  const [custPage, setCustPage] = useState(1);
  const PER = 8;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      sbFetch("bh_products", "select=*&order=created_at.desc"),
      sbFetch("bh_orders", "select=*&order=created_at.desc"),
      sbFetch("bh_customers", "select=*&order=created_at.desc"),
    ]).then(([p, o, c]) => { setProducts(p); setOrders(o); setCustomers(c); setLoading(false); });
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const lowStock = products.filter(p => p.stock < 5).length;
  const prodSlice = products.slice((prodPage - 1) * PER, prodPage * PER);
  const ordSlice = orders.slice((ordPage - 1) * PER, ordPage * PER);
  const custSlice = customers.slice((custPage - 1) * PER, custPage * PER);

  if (loading) return <div className="flex items-center justify-center h-48 text-zinc-600 text-xs">Loading Boss Hookah data…</div>;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Site 01</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-lg font-semibold text-zinc-50">Boss Hookah</h2>
            <span className="rounded-full bg-[#1c2711] px-2 py-0.5 text-[10px] font-semibold text-[#d7ff3f]">Live</span>
          </div>
          <a href="https://bosshookah.site" target="_blank" rel="noreferrer" className="text-[11px] text-[#d7ff3f] hover:underline">bosshookah.site ↗</a>
        </div>
        <SectionNav sections={["overview", "products", "orders", "customers"] as const} active={section} onChange={setSection} />
      </div>

      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Products" value={products.length} sub="in catalog" />
            <StatCard label="Orders" value={orders.length} sub={`${pendingOrders} pending`} />
            <StatCard label="Revenue" value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="all time" />
            <StatCard label="Customers" value={customers.length} sub={`${lowStock} low stock`} />
          </div>
          <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-900/80 flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-300">Recent Orders</p>
              <button onClick={() => setSection("orders")} className="text-[11px] text-[#d7ff3f] hover:underline">View all</button>
            </div>
            {orders.length === 0 ? <EmptyState msg="No orders yet." /> : (
              <DarkTable>
                <thead><tr><Th>Customer</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{o.customer_name || "—"}</Td>
                      <Td>${(o.total || 0).toFixed(2)}</Td>
                      <Td><StatusBadge status={o.status} /></Td>
                      <Td muted>{new Date(o.created_at).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
            )}
          </div>
        </>
      )}

      {section === "products" && (
        <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/80">
            <p className="text-xs font-medium text-zinc-300">Products <span className="text-zinc-600">({products.length})</span></p>
          </div>
          {products.length === 0 ? <EmptyState msg="No products yet." /> : (
            <>
              <DarkTable>
                <thead><tr><Th>Name</Th><Th>Category</Th><Th>Price</Th><Th>Stock</Th><Th>SKU</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {prodSlice.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{p.name}</Td>
                      <Td muted>{p.category || "—"}</Td>
                      <Td>${(p.price || 0).toFixed(2)}</Td>
                      <Td><span className={p.stock < 5 ? "text-red-400 font-medium" : "text-zinc-200"}>{p.stock}</span></Td>
                      <Td muted>{p.sku || "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
              <div className="px-4 pb-4"><Pagination page={prodPage} total={products.length} perPage={PER} onChange={setProdPage} /></div>
            </>
          )}
        </div>
      )}

      {section === "orders" && (
        <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/80">
            <p className="text-xs font-medium text-zinc-300">All Orders <span className="text-zinc-600">({orders.length})</span></p>
          </div>
          {orders.length === 0 ? <EmptyState msg="No orders yet." /> : (
            <>
              <DarkTable>
                <thead><tr><Th>Customer</Th><Th>Email</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {ordSlice.map(o => (
                    <tr key={o.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{o.customer_name || "—"}</Td>
                      <Td muted>{o.customer_email || "—"}</Td>
                      <Td>${(o.total || 0).toFixed(2)}</Td>
                      <Td><StatusBadge status={o.status} /></Td>
                      <Td muted>{new Date(o.created_at).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
              <div className="px-4 pb-4"><Pagination page={ordPage} total={orders.length} perPage={PER} onChange={setOrdPage} /></div>
            </>
          )}
        </div>
      )}

      {section === "customers" && (
        <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/80">
            <p className="text-xs font-medium text-zinc-300">Customers <span className="text-zinc-600">({customers.length})</span></p>
          </div>
          {customers.length === 0 ? <EmptyState msg="No customers yet." /> : (
            <>
              <DarkTable>
                <thead><tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Orders</Th><Th>Total Spent</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {custSlice.map(c => (
                    <tr key={c.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{c.name || "—"}</Td>
                      <Td muted>{c.email || "—"}</Td>
                      <Td muted>{c.phone || "—"}</Td>
                      <Td>{c.order_count}</Td>
                      <Td>${(c.total_spent || 0).toFixed(2)}</Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
              <div className="px-4 pb-4"><Pagination page={custPage} total={customers.length} perPage={PER} onChange={setCustPage} /></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2 — Wifi Kings
// ═══════════════════════════════════════════════════════════════════════════════
function WifiKingsTab() {
  const [leads, setLeads] = useState<WkLead[]>([]);
  const [installations, setInstallations] = useState<WkInstallation[]>([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"overview" | "leads" | "installations">("overview");
  const [leadPage, setLeadPage] = useState(1);
  const [instPage, setInstPage] = useState(1);
  const PER = 8;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      sbFetch("wk_leads", "select=*&order=created_at.desc"),
      sbFetch("wk_installations", "select=*&order=created_at.desc"),
    ]).then(([l, i]) => { setLeads(l); setInstallations(i); setLoading(false); });
  }, []);

  const newLeads = leads.filter(l => l.status === "new").length;
  const converted = leads.filter(l => l.status === "converted").length;
  const scheduled = installations.filter(i => i.status === "scheduled").length;
  const leadSlice = leads.slice((leadPage - 1) * PER, leadPage * PER);
  const instSlice = installations.slice((instPage - 1) * PER, instPage * PER);

  if (loading) return <div className="flex items-center justify-center h-48 text-zinc-600 text-xs">Loading Wifi Kings data…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Site 02</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-lg font-semibold text-zinc-50">Wifi Kings</h2>
            <span className="rounded-full bg-[#1c2711] px-2 py-0.5 text-[10px] font-semibold text-[#d7ff3f]">Live</span>
          </div>
          <a href="https://wifi-kings.com" target="_blank" rel="noreferrer" className="text-[11px] text-[#d7ff3f] hover:underline">wifi-kings.com ↗</a>
        </div>
        <SectionNav sections={["overview", "leads", "installations"] as const} active={section} onChange={setSection} />
      </div>

      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Leads" value={leads.length} sub={`${newLeads} new`} />
            <StatCard label="Converted" value={converted} sub={`${leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0}% rate`} />
            <StatCard label="Installations" value={installations.length} sub={`${scheduled} scheduled`} />
            <StatCard label="Providers" value={[...new Set(leads.map(l => l.provider).filter(Boolean))].length} sub="active" />
          </div>
          <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-900/80 flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-300">Recent Leads</p>
              <button onClick={() => setSection("leads")} className="text-[11px] text-[#d7ff3f] hover:underline">View all</button>
            </div>
            {leads.length === 0 ? <EmptyState msg="No leads yet. Leads will appear here when customers check availability on wifi-kings.com." /> : (
              <DarkTable>
                <thead><tr><Th>Name</Th><Th>Provider</Th><Th>Plan</Th><Th>Status</Th><Th>Date</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {leads.slice(0, 5).map(l => (
                    <tr key={l.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{l.name || "—"}</Td>
                      <Td>{l.provider || "—"}</Td>
                      <Td muted>{l.plan || "—"}</Td>
                      <Td><StatusBadge status={l.status} /></Td>
                      <Td muted>{new Date(l.created_at).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
            )}
          </div>
        </>
      )}

      {section === "leads" && (
        <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/80">
            <p className="text-xs font-medium text-zinc-300">All Leads <span className="text-zinc-600">({leads.length})</span></p>
          </div>
          {leads.length === 0 ? <EmptyState msg="No leads yet." /> : (
            <>
              <DarkTable>
                <thead><tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Provider</Th><Th>Plan</Th><Th>Status</Th><Th>Date</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {leadSlice.map(l => (
                    <tr key={l.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{l.name || "—"}</Td>
                      <Td muted>{l.email || "—"}</Td>
                      <Td muted>{l.phone || "—"}</Td>
                      <Td>{l.provider || "—"}</Td>
                      <Td muted>{l.plan || "—"}</Td>
                      <Td><StatusBadge status={l.status} /></Td>
                      <Td muted>{new Date(l.created_at).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
              <div className="px-4 pb-4"><Pagination page={leadPage} total={leads.length} perPage={PER} onChange={setLeadPage} /></div>
            </>
          )}
        </div>
      )}

      {section === "installations" && (
        <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/80">
            <p className="text-xs font-medium text-zinc-300">Installations <span className="text-zinc-600">({installations.length})</span></p>
          </div>
          {installations.length === 0 ? <EmptyState msg="No installations scheduled yet." /> : (
            <>
              <DarkTable>
                <thead><tr><Th>Customer</Th><Th>Address</Th><Th>Provider</Th><Th>Scheduled</Th><Th>Status</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {instSlice.map(i => (
                    <tr key={i.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{i.customer_name || "—"}</Td>
                      <Td muted>{i.address || "—"}</Td>
                      <Td>{i.provider || "—"}</Td>
                      <Td muted>{i.scheduled_date ? new Date(i.scheduled_date).toLocaleDateString() : "—"}</Td>
                      <Td><StatusBadge status={i.status} /></Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
              <div className="px-4 pb-4"><Pagination page={instPage} total={installations.length} perPage={PER} onChange={setInstPage} /></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3 — Shop ATT Promos
// ═══════════════════════════════════════════════════════════════════════════════
function ShopAttPromosTab() {
  const [orders, setOrders] = useState<SapOrder[]>([]);
  const [products, setProducts] = useState<SapProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"overview" | "products" | "orders">("overview");
  const [prodPage, setProdPage] = useState(1);
  const [ordPage, setOrdPage] = useState(1);
  const PER = 8;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      sbFetch("sap_orders", "select=*&order=created_at.desc"),
      sbFetch("sap_products", "select=*&order=created_at.desc"),
    ]).then(([o, p]) => { setOrders(o); setProducts(p); setLoading(false); });
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const promoOrders = orders.filter(o => o.promo_code).length;
  const onSale = products.filter(p => p.promo_price && p.promo_price < p.price).length;
  const prodSlice = products.slice((prodPage - 1) * PER, prodPage * PER);
  const ordSlice = orders.slice((ordPage - 1) * PER, ordPage * PER);

  if (loading) return <div className="flex items-center justify-center h-48 text-zinc-600 text-xs">Loading Shop ATT Promos data…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Site 03</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-lg font-semibold text-zinc-50">Shop ATT Promos</h2>
            <span className="rounded-full bg-[#1c2711] px-2 py-0.5 text-[10px] font-semibold text-[#d7ff3f]">Live</span>
          </div>
          <span className="text-[11px] text-zinc-500">shopattpromos.com</span>
        </div>
        <SectionNav sections={["overview", "products", "orders"] as const} active={section} onChange={setSection} />
      </div>

      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Products" value={products.length} sub={`${onSale} on promo`} />
            <StatCard label="Orders" value={orders.length} sub={`${pendingOrders} pending`} />
            <StatCard label="Revenue" value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="all time" />
            <StatCard label="Promo Orders" value={promoOrders} sub={`${orders.length > 0 ? Math.round((promoOrders / orders.length) * 100) : 0}% used promos`} />
          </div>
          <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-900/80 flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-300">Recent Orders</p>
              <button onClick={() => setSection("orders")} className="text-[11px] text-[#d7ff3f] hover:underline">View all</button>
            </div>
            {orders.length === 0 ? <EmptyState msg="No orders yet." /> : (
              <DarkTable>
                <thead><tr><Th>Customer</Th><Th>Total</Th><Th>Promo</Th><Th>Status</Th><Th>Date</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{o.customer_name || "—"}</Td>
                      <Td>${(o.total || 0).toFixed(2)}</Td>
                      <Td muted>{o.promo_code || "—"}</Td>
                      <Td><StatusBadge status={o.status} /></Td>
                      <Td muted>{new Date(o.created_at).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
            )}
          </div>
        </>
      )}

      {section === "products" && (
        <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/80">
            <p className="text-xs font-medium text-zinc-300">Products <span className="text-zinc-600">({products.length})</span></p>
          </div>
          {products.length === 0 ? <EmptyState msg="No products yet." /> : (
            <>
              <DarkTable>
                <thead><tr><Th>Name</Th><Th>Category</Th><Th>Price</Th><Th>Promo Price</Th><Th>Stock</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {prodSlice.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{p.name}</Td>
                      <Td muted>{p.category || "—"}</Td>
                      <Td>${(p.price || 0).toFixed(2)}</Td>
                      <Td>{p.promo_price ? <span className="text-[#d7ff3f] font-medium">${p.promo_price.toFixed(2)}</span> : <span className="text-zinc-600">—</span>}</Td>
                      <Td><span className={p.stock < 5 ? "text-red-400 font-medium" : "text-zinc-200"}>{p.stock}</span></Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
              <div className="px-4 pb-4"><Pagination page={prodPage} total={products.length} perPage={PER} onChange={setProdPage} /></div>
            </>
          )}
        </div>
      )}

      {section === "orders" && (
        <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/80">
            <p className="text-xs font-medium text-zinc-300">All Orders <span className="text-zinc-600">({orders.length})</span></p>
          </div>
          {orders.length === 0 ? <EmptyState msg="No orders yet." /> : (
            <>
              <DarkTable>
                <thead><tr><Th>Customer</Th><Th>Email</Th><Th>Total</Th><Th>Promo</Th><Th>Status</Th><Th>Date</Th></tr></thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {ordSlice.map(o => (
                    <tr key={o.id} className="hover:bg-zinc-900/30 transition-colors">
                      <Td>{o.customer_name || "—"}</Td>
                      <Td muted>{o.customer_email || "—"}</Td>
                      <Td>${(o.total || 0).toFixed(2)}</Td>
                      <Td muted>{o.promo_code || "—"}</Td>
                      <Td><StatusBadge status={o.status} /></Td>
                      <Td muted>{new Date(o.created_at).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </DarkTable>
              <div className="px-4 pb-4"><Pagination page={ordPage} total={orders.length} perPage={PER} onChange={setOrdPage} /></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD — original dark theme wrapper
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "bosshookah", label: "Boss Hookah", num: 1 },
  { id: "wifikings", label: "Wifi Kings", num: 2 },
  { id: "shopattpromos", label: "Shop ATT Promos", num: 3 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("bosshookah");
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

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
                <Link key={num} href={href} title={label}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700/60 text-[10px] text-zinc-400 hover:border-[#d7ff3f] hover:text-[#d7ff3f] ${isActive ? "border-[#d7ff3f] bg-zinc-900/80 text-[#d7ff3f]" : ""}`}>
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
        <div className="flex-1 space-y-4 min-w-0">

          {/* Header */}
          <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Today, {formattedDate}</p>
              <h1 className="text-xl font-semibold text-zinc-50 md:text-2xl">Bakerhub</h1>
              <p className="mt-0.5 text-xs text-zinc-500">Multi-site command center</p>
            </div>
            <div className="rounded-full bg-[#1b1b1f] px-3 py-1.5 text-[11px] text-zinc-300 self-start md:self-auto">
              {formattedTime}
            </div>
          </header>

          {/* Site tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${activeTab === tab.id ? "bg-[#d7ff3f] text-zinc-900 font-semibold" : "bg-zinc-900 text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:text-zinc-200"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${activeTab === tab.id ? "bg-zinc-900" : "bg-zinc-700"}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active tab content */}
          <div className="rounded-2xl bg-[#0b0b0b] p-4 md:p-5">
            {activeTab === "bosshookah" && <BossHookahTab />}
            {activeTab === "wifikings" && <WifiKingsTab />}
            {activeTab === "shopattpromos" && <ShopAttPromosTab />}
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-zinc-700">
            Bakerhub · Connected to Supabase · {now.getFullYear()}
          </p>
        </div>
      </div>
    </main>
  );
}
