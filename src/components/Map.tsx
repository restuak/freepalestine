"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LoadingPage from "./Loading";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface InfraData {
  report_date: string;
  civic_buildings: { ext_destroyed: number };
  educational_buildings: { ext_destroyed: number; ext_damaged: number };
  places_of_worship: {
    ext_mosques_destroyed: number;
    ext_mosques_damaged: number;
    ext_churches_destroyed: number;
  };
  residential: { ext_destroyed: number };
}

// ✅ Semua icon flat-style seragam
const categoryIcons: Record<string, string> = {
  residential: "https://cdn-icons-png.flaticon.com/512/69/69524.png",
  mosques_destroyed: "https://cdn-icons-png.flaticon.com/512/3176/3176381.png",
  mosques_damaged: "https://cdn-icons-png.flaticon.com/512/1998/1998611.png",
  churches_destroyed: "https://cdn-icons-png.flaticon.com/512/3176/3176366.png",
  educational_destroyed:
    "https://cdn-icons-png.flaticon.com/512/201/201614.png",
  educational_damaged:
    "https://cdn-icons-png.flaticon.com/512/1820/1820795.png",
  civic_destroyed: "https://cdn-icons-png.flaticon.com/512/2713/2713484.png",
};

export default function MapInfra() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<
    { key: string; label: string; total: number }[]
  >([]);

  useEffect(() => {
    async function fetchInfra() {
      try {
        const res = await fetch(
          "https://data.techforpalestine.org/api/v3/infrastructure-damaged.json"
        );
        const json: InfraData[] = await res.json();

        const latest = json[json.length - 1];

        const extracted = [
          {
            key: "residential",
            label: "Residential Destroyed",
            total: latest.residential.ext_destroyed,
          },
          {
            key: "mosques_destroyed",
            label: "Mosques Destroyed",
            total: latest.places_of_worship.ext_mosques_destroyed,
          },
          {
            key: "mosques_damaged",
            label: "Mosques Damaged",
            total: latest.places_of_worship.ext_mosques_damaged,
          },
          {
            key: "churches_destroyed",
            label: "Churches Destroyed",
            total: latest.places_of_worship.ext_churches_destroyed,
          },
          {
            key: "educational_destroyed",
            label: "Educational Destroyed",
            total: latest.educational_buildings.ext_destroyed,
          },
          {
            key: "educational_damaged",
            label: "Educational Damaged",
            total: latest.educational_buildings.ext_damaged,
          },
          {
            key: "civic_destroyed",
            label: "Civic Buildings Destroyed",
            total: latest.civic_buildings.ext_destroyed,
          },
        ];

        setCategories(extracted);

        // Pop up sederhana
        window.alert("Masih dibenerin ini, masih rusak pagenya, bantuin dong wkwkw. Sabar ye!");
      } catch (err) {
        console.error("Fetch infra failed", err);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    }
    fetchInfra();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="h-[90vh] w-full">
      <MapContainer
        center={[31.5, 34.47]} // Gaza
        zoom={11}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {categories.map((cat, i) => {
          if (!cat.total || cat.total === 0) return null;

          // 🔥 Random offset kecil biar marker ga numpuk di satu titik
          const lat = 31.5 + (Math.random() - 0.5) * 0.1;
          const lng = 34.47 + (Math.random() - 0.5) * 0.1;

          const icon = L.icon({
            iconUrl: categoryIcons[cat.key],
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          return (
            <Marker key={i} position={[lat, lng]} icon={icon}>
              <Popup>
                <b>{cat.label}</b>
                <p>Total: {cat.total}</p>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
