"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-black/70 border-b border-white/20 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + Flag */}
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 40"
            className="w-8 h-6"
          >
            {/* Black stripe */}
            <rect width="60" height="13.33" y="0" fill="black" />
            {/* White stripe */}
            <rect width="60" height="13.33" y="13.33" fill="white" />
            {/* Green stripe */}
            <rect width="60" height="13.33" y="26.66" fill="green" />
            {/* Red triangle */}
            <polygon points="0,0 0,40 20,20" fill="red" />
          </svg>

          <h1 className="text-lg font-bold text-[#910C1B]">
            <Link href="/" className="hover:text-[#00A050]">
              FREE PALESTINE!
            </Link>
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center uppercase">
          <li>
            <Link href="/memorial" className="hover:text-green-500">
              Memorial
            </Link>
          </li>

          <li>
            <Link href="/press" className="hover:text-green-500">
              Press
            </Link>
          </li>
          <li>
            <Link href="/ripflowers" className="hover:text-green-500">
              RIPFlowers
            </Link>
          </li>

          <li>
            <Link href="/map" className="hover:text-green-500">
              Map
            </Link>
          </li>
          
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <ul className="flex flex-col space-y-2 px-6 py-4 uppercase">
            <li>
              <Link
                href="/memorial"
                className="hover:text-green-500"
                onClick={() => setIsOpen(false)}
              >
                Memorial
              </Link>
            </li>

            <li>
              <Link
                href="/press"
                className="block hover:text-green-500"
                onClick={() => setIsOpen(false)}
              >
                Press
              </Link>
            </li>
            <li>
              <Link
                href="/ripflowers"
                className="hover:text-green-500"
                onClick={() => setIsOpen(false)}
              >
                RIPFlowers
              </Link>
            </li>
            <li>
              <Link
                href="/map"
                className="block hover:text-green-500"
                onClick={() => setIsOpen(false)}
              >
                Map
              </Link>
            </li>          
          </ul>
        </div>
      )}
    </header>
  );
}
