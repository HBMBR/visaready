// Best-effort in-memory rate limiter.
// Per-instance only: fine for a single server / warm lambda, NOT a hard
// guarantee on multi-instance serverless — put a shared limiter (Upstash,
// Vercel firewall rule) in front if that matters.

const hits = new Map<string, number[]>();

/** Records a hit for `key`; returns true if it is over `max` hits within `windowMs`. */
export function throttled(key: string, max: number, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) {
    // crude cap so the map can't grow unbounded
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return false;
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") ?? "unknown";
}
