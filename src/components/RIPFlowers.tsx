"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import LoadingPage from "./Loading";

interface Victim {
  name: string;
  en_name: string;
}

export default function RIPFlowers() {
  const [flowers, setFlowers] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [victims, setVictims] = useState<Victim[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    function calcRows() {
      const screenHeight = window.innerHeight;
      const lineHeight = 40;
      setRowCount(Math.floor(screenHeight / lineHeight));
    }

    calcRows();
    window.addEventListener("resize", calcRows);
    return () => window.removeEventListener("resize", calcRows);
  }, []);


  useEffect(() => {
    const fetchVictims = async () => {
      try {
        const res = await axios.get(
          "https://data.techforpalestine.org/api/v2/killed-in-gaza/page-1.json"
        );

        if (res.data?.results) {
          setVictims(
            res.data.results.map((v: any) => ({
              name: v.name || "",
              en_name: v.en_name || "",
            }))
          );
        } else if (Array.isArray(res.data)) {
          setVictims(
            res.data.map((v: any) => ({
              name: v.name || "",
              en_name: v.en_name || "",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching victims:", err);
      }
    };

    fetchVictims();
  }, []);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; 
    }
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="relative flex flex-col items-center pt-8 pb-16 bg-gray-900 min-h-screen text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 opacity-25 text-sm sm:text-base font-semibold pointer-events-none z-0">
        {victims.length > 0 ? (
          [...Array(rowCount)].map((_, row) => (
            <div
              key={row}
              className={`whitespace-nowrap animate-marquee`}
              style={{
                animationDuration: `${1000 + row * 5}s`,
                animationDirection: row % 2 === 0 ? "normal" : "reverse",
              }}
            >
              {victims.concat(victims).map((v, i) => (
                <span key={i} className="mx-6 inline-block">
                  {v.name} {v.en_name && `(${v.en_name})`} •
                </span>
              ))}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            Al Fatihah...
          </div>
        )}
      </div>

      {/* Tombol Flower */}
      <button
        className="bg-[#910C1B] text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-[#E2707D] transition relative z-10"
        onClick={() => setFlowers([...flowers, flowers.length + 1])}
      >
        Place a Flower 🌹
      </button>

      {/* Flower Grid */}
      <div className="grid grid-cols-10 gap-2 mt-6 text-2xl relative z-10">
        {flowers.map((_, i) => (
          <span key={i} className="animate-bounce">
            🌹
          </span>
        ))}
      </div>

      {/* Audio Background */}
      <audio ref={audioRef} src="/audio.mp3" autoPlay loop />

      {/* Tombol Mute/Unmute */}
      <div className="fixed bottom-4 w-full flex justify-center z-10">
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
          className="bg-[#910C1B] text-white px-4 py-2 rounded-xl cursor-pointer shadow hover:bg-[#E2707D] transition"
        >
          {isMuted ? "Unmute Music" : "Mute Music"}
        </button>
      </div>

      {/* Animasi marquee horizontal */}
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee linear infinite;
          margin: 15px 15px 15px 15px;
        }
        @keyframes marquee {
          0% {
            transform: translateX(-30%);
          }
          100% {
            transform: translateX(-70%);
          }
        }
      `}</style>
    </div>
  );
}
