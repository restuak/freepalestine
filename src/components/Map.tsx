"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

type InfraData = {
  date: string;
  total: number;
  health: number;
  education: number;
  mosques: number;
  churches: number;
  bakeries: number;
  water_wells: number;
  universities: number;
  industrial: number;
  schools: number;
  other: number;
};

// icon kategori
const categoryIcons: Record<string, string> = {
  health: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",
  education: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
  mosques: "https://cdn-icons-png.flaticon.com/512/1998/1998615.png",
  churches: "https://cdn-icons-png.flaticon.com/512/1998/1998615.png",
  bakeries: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
  water_wells: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
  universities: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
  industrial: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
  schools: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
  other: "https://cdn-icons-png.flaticon.com/512/1828/1828911.png",
};

export default function Map() {
  const [categories, setCategories] = useState<
    { key: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);


  const L = typeof window !== "undefined" ? require("leaflet") : (null as any);
  const MapContainer =
    typeof window !== "undefined"
      ? require("react-leaflet").MapContainer
      : () => null;
  const TileLayer =
    typeof window !== "undefined"
      ? require("react-leaflet").TileLayer
      : () => null;
  const Marker =
    typeof window !== "undefined"
      ? require("react-leaflet").Marker
      : () => null;
  const Popup =
    typeof window !== "undefined" ? require("react-leaflet").Popup : () => null;

  useEffect(() => {
    async function fetchInfra() {
      try {
        const res = await fetch(
          "https://data.techforpalestine.org/api/v3/infrastructure-damaged.json"
        );
        const json: InfraData[] = await res.json();

        const latest = json[json.length - 1];

        const extracted = Object.entries(latest)
          .filter(([key]) => key !== "date" && key !== "total")
          .map(([key, value]) => ({
            key,
            value: Number(value),
          }));

        setCategories(extracted);

       
        if (typeof window !== "undefined") {
          window.alert("Masih dibenerin ini, masih rusak pagenya, sabar yaaaaa!");
        }
      } catch (err) {
        console.error("Fetch infra failed", err);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    }
    fetchInfra();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-screen rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={[31.5, 34.47]} // Gaza
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {categories.map((cat, idx) => (
          <Marker
            key={idx}
            position={[31.5 + Math.random() * 0.1, 34.47 + Math.random() * 0.1]}
            icon={L?.icon({
              iconUrl: categoryIcons[cat.key] || categoryIcons["other"],
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })}
          >
            <Popup>
              <div className="text-sm">
                <strong>{cat.key}</strong>
                <br />
                Jumlah: {cat.value}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
