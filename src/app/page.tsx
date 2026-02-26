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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800", completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800", new: "bg-blue-100 text-blue-800",
    contacted: "bg-purple-100 text-purple-800", converted: "bg-green-100 text-green-800",
    scheduled: "bg-indigo-100 text-indigo-800", installed: "bg-green-100 text-green-800",
    processing: "bg-orange-100 text-orange-800", shipped: "bg-cyan-100 text-cyan-800",
    delivered: "bg-green-100 text-green-800",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`rounded-xl p-5 ${color} text-white shadow`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-70">{sub}</p>}
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-sm">{msg}</p>
    </div>
  );
}

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <span className="text-xs text-gray-500">Page {page} of {pages} ({total} records)</span>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="px-3 py-1 text-sm rounded border disabled:opacity-30 hover:bg-gray-50">‹</button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 text-sm rounded border ${p === page ? "bg-lime-500 text-white border-lime-500" : "hover:bg-gray-50"}`}>{p}</button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === pages} className="px-3 py-1 text-sm rounded border disabled:opacity-30 hover:bg-gray-50">›</button>
      </div>
    </div>
  );
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

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading Boss Hookah data…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">B</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Boss Hookah</h2>
            <a href="https://bosshookah.site" target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">bosshookah.site ↗</a>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["overview", "products", "orders", "customers"] as const).map(s => (
            <button key={s} onClick={() => setSection(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${section === s ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
      </div>

      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Products" value={products.length} sub="in catalog" color="bg-gradient-to-br from-orange-400 to-orange-600" />
            <StatCard label="Orders" value={orders.length} sub={`${pendingOrders} pending`} color="bg-gradient-to-br from-red-400 to-red-600" />
            <StatCard label="Revenue" value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="all time" color="bg-gradient-to-br from-amber-400 to-amber-600" />
            <StatCard label="Customers" value={customers.length} sub={`${lowStock} low stock`} color="bg-gradient-to-br from-yellow-400 to-yellow-600" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Orders</h3>
              <button onClick={() => setSection("orders")} className="text-xs text-orange-500 hover:underline">View all</button>
            </div>
            {orders.length === 0 ? <EmptyState msg="No orders yet. Orders will appear here once customers start purchasing." /> : (
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3 text-left">Total</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Date</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{orders.slice(0, 5).map(o => (<tr key={o.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{o.customer_name || "—"}</td><td className="px-5 py-3">${(o.total || 0).toFixed(2)}</td><td className="px-5 py-3"><StatusBadge status={o.status} /></td><td className="px-5 py-3 text-gray-400">{new Date(o.created_at).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
            )}
          </div>
        </>
      )}

      {section === "products" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Products ({products.length})</h3></div>
          {products.length === 0 ? <EmptyState msg="No products yet." /> : (
            <>
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Name</th><th className="px-5 py-3 text-left">Category</th><th className="px-5 py-3 text-left">Price</th><th className="px-5 py-3 text-left">Stock</th><th className="px-5 py-3 text-left">SKU</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{prodSlice.map(p => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{p.name}</td><td className="px-5 py-3 text-gray-500">{p.category || "—"}</td><td className="px-5 py-3">${(p.price || 0).toFixed(2)}</td><td className="px-5 py-3"><span className={p.stock < 5 ? "text-red-500 font-medium" : ""}>{p.stock}</span></td><td className="px-5 py-3 text-gray-400">{p.sku || "—"}</td></tr>))}</tbody>
              </table>
              <div className="px-5 pb-4"><Pagination page={prodPage} total={products.length} perPage={PER} onChange={setProdPage} /></div>
            </>
          )}
        </div>
      )}

      {section === "orders" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">All Orders ({orders.length})</h3></div>
          {orders.length === 0 ? <EmptyState msg="No orders yet." /> : (
            <>
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3 text-left">Email</th><th className="px-5 py-3 text-left">Total</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Date</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{ordSlice.map(o => (<tr key={o.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{o.customer_name || "—"}</td><td className="px-5 py-3 text-gray-500">{o.customer_email || "—"}</td><td className="px-5 py-3">${(o.total || 0).toFixed(2)}</td><td className="px-5 py-3"><StatusBadge status={o.status} /></td><td className="px-5 py-3 text-gray-400">{new Date(o.created_at).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
              <div className="px-5 pb-4"><Pagination page={ordPage} total={orders.length} perPage={PER} onChange={setOrdPage} /></div>
            </>
          )}
        </div>
      )}

      {section === "customers" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Customers ({customers.length})</h3></div>
          {customers.length === 0 ? <EmptyState msg="No customers yet." /> : (
            <>
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Name</th><th className="px-5 py-3 text-left">Email</th><th className="px-5 py-3 text-left">Phone</th><th className="px-5 py-3 text-left">Orders</th><th className="px-5 py-3 text-left">Total Spent</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{custSlice.map(c => (<tr key={c.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{c.name || "—"}</td><td className="px-5 py-3 text-gray-500">{c.email || "—"}</td><td className="px-5 py-3 text-gray-500">{c.phone || "—"}</td><td className="px-5 py-3">{c.order_count}</td><td className="px-5 py-3">${(c.total_spent || 0).toFixed(2)}</td></tr>))}</tbody>
              </table>
              <div className="px-5 pb-4"><Pagination page={custPage} total={customers.length} perPage={PER} onChange={setCustPage} /></div>
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

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading Wifi Kings data…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">W</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Wifi Kings</h2>
            <a href="https://wifi-kings.com" target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">wifi-kings.com ↗</a>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["overview", "leads", "installations"] as const).map(s => (
            <button key={s} onClick={() => setSection(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${section === s ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
      </div>

      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Leads" value={leads.length} sub={`${newLeads} new`} color="bg-gradient-to-br from-blue-400 to-blue-600" />
            <StatCard label="Converted" value={converted} sub={`${leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0}% rate`} color="bg-gradient-to-br from-cyan-400 to-cyan-600" />
            <StatCard label="Installations" value={installations.length} sub={`${scheduled} scheduled`} color="bg-gradient-to-br from-indigo-400 to-indigo-600" />
            <StatCard label="Providers" value={[...new Set(leads.map(l => l.provider).filter(Boolean))].length} sub="active" color="bg-gradient-to-br from-sky-400 to-sky-600" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Leads</h3>
              <button onClick={() => setSection("leads")} className="text-xs text-blue-500 hover:underline">View all</button>
            </div>
            {leads.length === 0 ? <EmptyState msg="No leads yet. Leads will appear here when customers check availability on wifi-kings.com." /> : (
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Name</th><th className="px-5 py-3 text-left">Provider</th><th className="px-5 py-3 text-left">Plan</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Date</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{leads.slice(0, 5).map(l => (<tr key={l.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{l.name || "—"}</td><td className="px-5 py-3">{l.provider || "—"}</td><td className="px-5 py-3 text-gray-500">{l.plan || "—"}</td><td className="px-5 py-3"><StatusBadge status={l.status} /></td><td className="px-5 py-3 text-gray-400">{new Date(l.created_at).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
            )}
          </div>
        </>
      )}

      {section === "leads" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">All Leads ({leads.length})</h3></div>
          {leads.length === 0 ? <EmptyState msg="No leads yet." /> : (
            <>
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Name</th><th className="px-5 py-3 text-left">Email</th><th className="px-5 py-3 text-left">Phone</th><th className="px-5 py-3 text-left">Provider</th><th className="px-5 py-3 text-left">Plan</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Date</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{leadSlice.map(l => (<tr key={l.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{l.name || "—"}</td><td className="px-5 py-3 text-gray-500">{l.email || "—"}</td><td className="px-5 py-3 text-gray-500">{l.phone || "—"}</td><td className="px-5 py-3">{l.provider || "—"}</td><td className="px-5 py-3 text-gray-500">{l.plan || "—"}</td><td className="px-5 py-3"><StatusBadge status={l.status} /></td><td className="px-5 py-3 text-gray-400">{new Date(l.created_at).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
              <div className="px-5 pb-4"><Pagination page={leadPage} total={leads.length} perPage={PER} onChange={setLeadPage} /></div>
            </>
          )}
        </div>
      )}

      {section === "installations" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Installations ({installations.length})</h3></div>
          {installations.length === 0 ? <EmptyState msg="No installations scheduled yet." /> : (
            <>
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3 text-left">Address</th><th className="px-5 py-3 text-left">Provider</th><th className="px-5 py-3 text-left">Scheduled</th><th className="px-5 py-3 text-left">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{instSlice.map(i => (<tr key={i.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{i.customer_name || "—"}</td><td className="px-5 py-3 text-gray-500">{i.address || "—"}</td><td className="px-5 py-3">{i.provider || "—"}</td><td className="px-5 py-3 text-gray-400">{i.scheduled_date ? new Date(i.scheduled_date).toLocaleDateString() : "—"}</td><td className="px-5 py-3"><StatusBadge status={i.status} /></td></tr>))}</tbody>
              </table>
              <div className="px-5 pb-4"><Pagination page={instPage} total={installations.length} perPage={PER} onChange={setInstPage} /></div>
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

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading Shop ATT Promos data…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">S</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Shop ATT Promos</h2>
            <span className="text-xs text-gray-400">shopattpromos.com</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["overview", "products", "orders"] as const).map(s => (
            <button key={s} onClick={() => setSection(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${section === s ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
      </div>

      {section === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Products" value={products.length} sub={`${onSale} on promo`} color="bg-gradient-to-br from-purple-400 to-purple-600" />
            <StatCard label="Orders" value={orders.length} sub={`${pendingOrders} pending`} color="bg-gradient-to-br from-pink-400 to-pink-600" />
            <StatCard label="Revenue" value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="all time" color="bg-gradient-to-br from-fuchsia-400 to-fuchsia-600" />
            <StatCard label="Promo Orders" value={promoOrders} sub={`${orders.length > 0 ? Math.round((promoOrders / orders.length) * 100) : 0}% used promos`} color="bg-gradient-to-br from-violet-400 to-violet-600" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Orders</h3>
              <button onClick={() => setSection("orders")} className="text-xs text-purple-500 hover:underline">View all</button>
            </div>
            {orders.length === 0 ? <EmptyState msg="No orders yet. Orders will appear here once customers purchase from shopattpromos.com." /> : (
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3 text-left">Total</th><th className="px-5 py-3 text-left">Promo</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Date</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{orders.slice(0, 5).map(o => (<tr key={o.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{o.customer_name || "—"}</td><td className="px-5 py-3">${(o.total || 0).toFixed(2)}</td><td className="px-5 py-3 text-gray-500">{o.promo_code || "—"}</td><td className="px-5 py-3"><StatusBadge status={o.status} /></td><td className="px-5 py-3 text-gray-400">{new Date(o.created_at).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
            )}
          </div>
        </>
      )}

      {section === "products" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">Products ({products.length})</h3></div>
          {products.length === 0 ? <EmptyState msg="No products yet." /> : (
            <>
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Name</th><th className="px-5 py-3 text-left">Category</th><th className="px-5 py-3 text-left">Price</th><th className="px-5 py-3 text-left">Promo Price</th><th className="px-5 py-3 text-left">Stock</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{prodSlice.map(p => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{p.name}</td><td className="px-5 py-3 text-gray-500">{p.category || "—"}</td><td className="px-5 py-3">${(p.price || 0).toFixed(2)}</td><td className="px-5 py-3">{p.promo_price ? <span className="text-green-600 font-medium">${p.promo_price.toFixed(2)}</span> : "—"}</td><td className="px-5 py-3"><span className={p.stock < 5 ? "text-red-500 font-medium" : ""}>{p.stock}</span></td></tr>))}</tbody>
              </table>
              <div className="px-5 pb-4"><Pagination page={prodPage} total={products.length} perPage={PER} onChange={setProdPage} /></div>
            </>
          )}
        </div>
      )}

      {section === "orders" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">All Orders ({orders.length})</h3></div>
          {orders.length === 0 ? <EmptyState msg="No orders yet." /> : (
            <>
              <table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3 text-left">Email</th><th className="px-5 py-3 text-left">Total</th><th className="px-5 py-3 text-left">Promo</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-left">Date</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{ordSlice.map(o => (<tr key={o.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium">{o.customer_name || "—"}</td><td className="px-5 py-3 text-gray-500">{o.customer_email || "—"}</td><td className="px-5 py-3">${(o.total || 0).toFixed(2)}</td><td className="px-5 py-3 text-gray-500">{o.promo_code || "—"}</td><td className="px-5 py-3"><StatusBadge status={o.status} /></td><td className="px-5 py-3 text-gray-400">{new Date(o.created_at).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
              <div className="px-5 pb-4"><Pagination page={ordPage} total={orders.length} perPage={PER} onChange={setOrdPage} /></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "bosshookah", label: "Boss Hookah", icon: "🪝", accentClass: "bg-orange-500" },
  { id: "wifikings", label: "Wifi Kings", icon: "📡", accentClass: "bg-blue-500" },
  { id: "shopattpromos", label: "Shop ATT Promos", icon: "🛍️", accentClass: "bg-purple-500" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("bosshookah");
  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-xs font-bold">HQ</div>
            <div>
              <span className="font-bold text-gray-900 text-base">Bakerhub Dashboard</span>
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Multi-Site Command Center</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden md:block">{now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <Link href="/analytics" className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Analytics</Link>
            <Link href="/customers" className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">CRM</Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white text-xs font-bold">K</div>
          </div>
        </div>
      </header>

      {/* Site tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 pt-2">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all ${activeTab === tab.id ? "border-gray-900 text-gray-900 bg-gray-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && <span className={`w-2 h-2 rounded-full ${tab.accentClass}`} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "bosshookah" && <BossHookahTab />}
        {activeTab === "wifikings" && <WifiKingsTab />}
        {activeTab === "shopattpromos" && <ShopAttPromosTab />}
      </main>

      <footer className="max-w-7xl mx-auto px-6 pb-8 text-center text-xs text-gray-400">
        Bakerhub Dashboard · Connected to Supabase · {now.getFullYear()}
      </footer>
    </div>
  );
}
