"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LoadingPage from "./Loading";

interface Victim {
  id?: string;
  name?: string;
  en_name?: string;
  sex?: string;
  age?: number;
}

const COLORS = {
  green: "#339564",
  pink: "#E2707D",
  gray: "#353535",
  maroon: "#910C1B",
  white: "#FFFFFF",
  black: "#000000",
};

const PAGE_SIZE = 25;

export default function AllNames() {
  const [items, setItems] = useState<Victim[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [initialLoading, setInitialLoading] = useState(true);
  const [inlineLoading, setInlineLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const nextPageRef = useRef(2);
  const reachedEndRef = useRef(false);

  async function fetchPage(page: number) {
    const url = `https://data.techforpalestine.org/api/v2/killed-in-gaza/page-${page}.json`;
    console.log("[fetch] start:", url);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for page-${page}`);
    const json = (await res.json()) as Victim[];
    console.log("[fetch] done:", url, "count:", json.length);
    return json;
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const first = await fetchPage(1);
        if (cancelled) return;
        setItems(first);
        setVisibleCount(PAGE_SIZE);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Fetch failed");
      } finally {
        if (!cancelled) {
          // ⏳ Tambahin delay 3 detik sebelum loading selesai
          setTimeout(() => {
            setInitialLoading(false);
          }, 3000);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Prefetch halaman berikutnya di background
  useEffect(() => {
    if (initialLoading) return; // jangan jalan sebelum initial loading selesai
    let cancelled = false;

    async function prefetchLoop() {
      while (!cancelled && !reachedEndRef.current) {
        const p = nextPageRef.current;
        try {
          const data = await fetchPage(p);
          if (cancelled) return;
          if (data.length === 0) {
            reachedEndRef.current = true;
            break;
          }
          setItems((prev) => [...prev, ...data]);
          nextPageRef.current = p + 1;
        } catch {
          break;
        }
      }
    }

    prefetchLoop();
    return () => {
      cancelled = true;
    };
  }, [initialLoading]);

  async function handleLoadMore() {
    const need = visibleCount + PAGE_SIZE;
    if (items.length >= need || reachedEndRef.current) {
      setVisibleCount((c) => c + PAGE_SIZE);
      return;
    }

    setInlineLoading(true);
    const pageToFetch = nextPageRef.current;

    try {
      const data = await fetchPage(pageToFetch);
      if (data.length === 0) {
        reachedEndRef.current = true;
      } else {
        setItems((prev) => [...prev, ...data]);
        nextPageRef.current = pageToFetch + 1;
      }
    } finally {
      setInlineLoading(false);
      setVisibleCount((c) => c + PAGE_SIZE);
    }
  }

  const displayList = useMemo(() => {
    const base = q.trim()
      ? items.filter((v) =>
          [v.name, v.en_name]
            .filter(Boolean)
            .some((t) => (t as string).toLowerCase().includes(q.toLowerCase()))
        )
      : items;
    return base.slice(0, visibleCount);
  }, [items, q, visibleCount]);

  // 👉 LoadingPage hanya tampil saat pertama kali fetch page-1 + delay 3 detik
  if (initialLoading) {
    return <LoadingPage />;
  }

  return (
    <main
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      style={{ color: COLORS.white }}
    >
      <div
        className="sticky top-0 z-10 py-4"
        style={{ backgroundColor: COLORS.black }}
      >
        <h1
          className="text-3xl font-bold text-center mb-4 uppercase"
          style={{ color: COLORS.maroon }}
        >
          Memorial for All Martyrs
        </h1>

        <div>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Arabic or English name…"
            className="w-full rounded-xl px-4 py-2 outline-none"
            style={{
              backgroundColor: COLORS.gray,
              border: `1px solid ${COLORS.green}`,
              color: COLORS.white,
            }}
          />
          <p className="text-xs mt-1" style={{ color: COLORS.pink }}>
            Showing {displayList.length} of {items.length} names
          </p>
        </div>
      </div>

      {error && (
        <div
          className="p-4 rounded-xl text-center mt-4"
          style={{ color: COLORS.pink }}
        >
          Error: {error}
        </div>
      )}

      <div className="grid gap-4 mt-4">
        {displayList.map((v, i) => (
          <div
            key={`${v.id ?? "noid"}-${i}`}
            className="p-4 rounded-xl border transition"
            style={{ backgroundColor: COLORS.black, borderColor: COLORS.gray }}
          >
            <p
              className="text-xl font-semibold flex items-center gap-2"
              style={{ color: COLORS.green }}
            >
              {v.en_name ?? v.name ?? "UNKNOWN"} 🌹
            </p>
            {v.name && (
              <p className="text-sm" style={{ color: COLORS.white }}>
                {v.name}
              </p>
            )}
            <div
              className="mt-2 text-sm space-y-1"
              style={{ color: COLORS.pink }}
            >
              {v.age !== undefined && <p>Age: {v.age}</p>}
              {v.sex && (
                <p>
                  Sex:{" "}
                  {v.sex === "m" ? "Male" : v.sex === "f" ? "Female" : v.sex}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 mt-6">
        {visibleCount < items.length && (
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 rounded-xl font-semibold disabled:opacity-60"
            disabled={inlineLoading}
            style={{ backgroundColor: COLORS.green, color: COLORS.white }}
          >
            {inlineLoading ? "Loading…" : "Load More"}
          </button>
        )}
        {visibleCount >= items.length && (
          <p className="text-sm" style={{ color: COLORS.pink }}>
            No more names.
          </p>
        )}
      </div>
    </main>
  );
}
