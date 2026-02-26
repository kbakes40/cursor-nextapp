import Link from "next/link";

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-[#d7ff3f] px-2 py-4 text-sm text-zinc-100 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[32px] bg-[#050505] p-4 md:p-6">
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Customers
            </p>
            <h1 className="text-xl font-semibold text-zinc-50 md:text-2xl">
              Customers & Orders
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/"
              className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-300 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
            >
              Dashboard
            </Link>
            <button className="rounded-full bg-[#d7ff3f] px-3 py-1.5 text-zinc-900">
              New Order
            </button>
          </div>
        </header>

        <section className="space-y-3 rounded-2xl bg-zinc-950/60 p-3 md:p-4">
          <div className="grid grid-cols-[2.2fr_1.6fr_0.8fr_0.9fr_0.9fr] items-center rounded-2xl bg-zinc-900/70 px-4 py-3 text-[11px] text-zinc-500">
            <div>Customer</div>
            <div>Location</div>
            <div className="text-right">Orders</div>
            <div className="text-right">Volume</div>
            <div className="text-right">Revenue</div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-900/80 bg-zinc-950/60 p-8 text-center text-sm text-zinc-400">
            <p>No customers yet.</p>
            <p className="text-[11px] text-zinc-500">
              When customers place orders, they will appear here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

