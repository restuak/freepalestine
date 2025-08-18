"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import L from "leaflet";

// Import leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamic import
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

interface Victim {
  name: string;
  age: number;
  date: string;
}

export default function Map() {
  const [victims, setVictims] = useState<Victim[]>([]);

  useEffect(() => {
    axios
      .get("https://data.techforpalestine.org/api/v2/killed-in-gaza.min.json")
      .then((res) => setVictims(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fix default marker icon (supaya muncul di Next.js)
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  return (
    <div className="h-[90vh] w-full">
      <MapContainer center={[31.5, 34.47]} zoom={11} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {victims.slice(0, 200).map((v, i) => {
          // Randomize di sekitar Gaza (supaya marker nggak numpuk di satu titik)
          const lat = 31.5 + (Math.random() - 0.5) * 0.2;
          const lng = 34.47 + (Math.random() - 0.5) * 0.2;
          return (
            <Marker key={i} position={[lat, lng]}>
              <Popup>
                <div>
                  <p>
                    <b>{v.name}</b>
                  </p>
                  <p>Age: {v.age || "?"}</p>
                  <p>Date: {v.date}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
