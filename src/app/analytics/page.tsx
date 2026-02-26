import Link from "next/link";

export default function AnalyticsPage() {
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
              const isActive = num === 3;
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

        {/* Analytics content */}
        <section className="flex flex-1 flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">
            <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Overview
                </p>
                <h1 className="text-xl font-semibold text-zinc-50 md:text-2xl">
                  Analytics
                </h1>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                  Last 7 days
                </button>
                <button className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                  Last 30 days
                </button>
              </div>
            </header>

            {/* Top metrics */}
            <div className="grid gap-3 rounded-2xl bg-zinc-950/60 p-3 md:grid-cols-3 md:p-4">
              <div className="space-y-2 rounded-2xl border border-zinc-900/80 bg-zinc-950/80 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Total revenue
                </p>
                <p className="text-lg font-semibold text-zinc-50">$0</p>
                <span className="inline-flex rounded-full bg-[#1c2711] px-2 py-0.5 text-[10px] font-medium text-[#d7ff3f]">
                  —
                </span>
              </div>
              <div className="space-y-2 rounded-2xl border border-zinc-900/80 bg-zinc-950/80 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Avg. order value
                </p>
                <p className="text-lg font-semibold text-zinc-50">$0</p>
                <span className="inline-flex rounded-full bg-[#1c2711] px-2 py-0.5 text-[10px] font-medium text-[#d7ff3f]">
                  —
                </span>
              </div>
              <div className="space-y-2 rounded-2xl border border-zinc-900/80 bg-zinc-950/80 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Orders this week
                </p>
                <p className="text-lg font-semibold text-zinc-50">0</p>
                <span className="inline-flex rounded-full bg-[#1c2711] px-2 py-0.5 text-[10px] font-medium text-[#d7ff3f]">
                  —
                </span>
              </div>
            </div>

            {/* Revenue chart */}
            <div className="space-y-3 rounded-2xl bg-zinc-950/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Revenue trend
                  </p>
                  <p className="text-xs text-zinc-400">Last 14 days</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#1c2711] px-2 py-1 text-[10px] font-medium text-[#d7ff3f]">
                  <span>—</span>
                </div>
              </div>
              <div className="mt-1 rounded-xl bg-gradient-to-t from-[#151515] to-[#111827] px-3 py-6 text-center text-xs text-zinc-400">
                No revenue data yet. Connect your analytics data source to see
                trends here.
              </div>
            </div>
          </div>

          {/* Side cards */}
          <aside className="flex w-full flex-col gap-3 md:w-72">
            <div className="space-y-3 rounded-2xl bg-gradient-to-br from-[#14111c] via-[#050408] to-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Top customer
                  </p>
                  <p className="text-xs text-zinc-400">This week</p>
                </div>
                <div className="rounded-full bg-[#1b1b1f] px-3 py-1 text-[11px] text-zinc-300">
                  $0
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-zinc-100">No top customer yet</p>
                <p className="text-zinc-400">
                  Once customers begin ordering, they&apos;ll appear here.
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-zinc-950/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Fulfillment
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span>On-time deliveries</span>
                <span className="font-medium text-zinc-50">—</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-[0%] rounded-full bg-[#d7ff3f]" />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span>Average route time</span>
                <span>—</span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

