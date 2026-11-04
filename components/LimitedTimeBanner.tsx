"use client";

import { useEffect, useState } from "react";

interface CounterResponse {
  claimed: number;
  total: number;
}

export default function LimitedTimeBanner() {
  const [claimed, setClaimed] = useState<number>(0);
  const [total] = useState<number>(1000);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      try {
        const res = await fetch("/api/spots", { cache: "no-store" });
        if (!res.ok) throw new Error("count fetch failed");
        const data: CounterResponse = await res.json();
        if (!cancelled) {
          setClaimed(data.claimed);
          setLoaded(true);
        }
      } catch {
        // Graceful degrade: show 0/1000 if API not yet wired.
        if (!cancelled) setLoaded(true);
      }
    }

    fetchCount();
    // Refresh every 30s so urgency stays live without spamming the API.
    const id = setInterval(fetchCount, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const remaining = Math.max(0, total - claimed);
  const pct = Math.min(100, Math.round((claimed / total) * 100));

  return (
    <div className="rounded-xl bg-gold-shine ring-2 ring-gold-500/70 p-4 shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🔥</span>
          <p className="text-sm font-bold text-gold-800 leading-tight">
            Limited Time Offer
          </p>
        </div>
        <span
          className={`rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-gold-800 ${
            loaded ? "pulse-soft" : "opacity-60"
          }`}
        >
          {loaded ? `${claimed.toLocaleString()} / ${total.toLocaleString()} claimed` : "Loading..."}
        </span>
      </div>

      <p className="mt-1.5 text-sm text-gold-800/90">
        First <span className="font-bold">1,000 members</span> lock in{" "}
        <span className="font-bold">50% off for life</span>.{" "}
        <span className="font-semibold">{remaining.toLocaleString()} spots left.</span>
      </p>

      {/* Progress bar */}
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-700 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
