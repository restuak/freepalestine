"use client";

import { useEffect, useState, useMemo } from "react";

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
  emerald: "#00A050",
  gray: "#353535",
  maroon: "#910C1B",
  white: "#FFFFFF",
  black: "#000000",
};

const PAGE_SIZE = 25;

export default function AllNames() {
  const [data, setData] = useState<Victim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchPage(p: number) {
      try {
        setLoading(true);
        const res = await fetch(
          `https://data.techforpalestine.org/api/v2/killed-in-gaza/page-${p}.json`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Victim[];

        // batasi hanya 25 item per halaman
        const sliced = json.slice(0, PAGE_SIZE);

        if (sliced.length === 0) {
          setHasMore(false);
        } else {
          setData((prev) => [...prev, ...sliced]);
        }
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPage(page);
  }, [page]);

  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const needle = q.toLowerCase();
    return data.filter((v) =>
      [v.name, v.en_name]
        .filter(Boolean)
        .some((val) => val!.toLowerCase().includes(needle))
    );
  }, [data, q]);

  return (
    <main
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      style={{ color: COLORS.white }}
    >
      {/* Header sticky */}
      <div
        className="sticky top-0 z-10 py-4"
        style={{ backgroundColor: COLORS.black }}
      >
        <h1
          className="text-3xl font-bold text-center mb-4"
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
            Showing {filtered.length} of {data.length} names
          </p>
        </div>
      </div>

      {error && (
        <div
          className="p-4 rounded-xl text-center"
          style={{ color: COLORS.pink }}
        >
          Error: {error}
        </div>
      )}

      {/* List data */}
      <div className="grid gap-4 mt-4">
        {filtered.map((v, i) => (
          <div
            key={`${v.id ?? "noid"}-${i}`}
            className="p-4 rounded-xl border transition"
            style={{
              backgroundColor: COLORS.black,
              borderColor: COLORS.gray,
            }}
          >
            <p
              className="text-xl font-semibold flex items-center gap-2"
              style={{ color: COLORS.green }}
            >
              {v.en_name ?? v.name ?? "UNKNOWN"}
              <span>🌹</span>{" "}
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

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {hasMore && !loading && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 rounded-xl font-semibold"
            style={{
              backgroundColor: COLORS.green,
              color: COLORS.white,
            }}
          >
            Load More
          </button>
        )}
        {loading && (
          <p className="text-sm mt-2" style={{ color: COLORS.pink }}>
            Loading…
          </p>
        )}
      </div>
    </main>
  );
}
