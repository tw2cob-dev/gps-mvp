"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();
  const trackingActive = pathname.startsWith("/t/");

  return (
    <header className="header-shell rounded-t-2xl border-b-0">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2 px-1">
          <span className="mac-traffic bg-[#ff5f57]" />
          <span className="mac-traffic bg-[#ffbd2f]" />
          <span className="mac-traffic bg-[#28c840]" />
        </div>

        <div className="flex items-center gap-2 pr-1">
          <span className="px-2 text-sm font-semibold tracking-tight text-[#1a1f2a]">
            IntiRoute
          </span>
          <div className="mac-segment flex overflow-hidden rounded-md">
            <Link
              href="/"
              className={`px-4 py-1 text-sm ${trackingActive ? "text-[#2e3543]" : "mac-segment-active"}`}
            >
              Mapa
            </Link>
            <Link
              href="/t/demo-active"
              className={`px-4 py-1 text-sm ${trackingActive ? "mac-segment-active" : "text-[#2e3543]"}`}
            >
              Tracking
            </Link>
          </div>
          <button className="menu-link rounded-md px-3 py-1 text-sm">Compartir</button>
        </div>
      </div>

      <div className="border-t border-[rgba(66,74,88,0.24)] bg-[linear-gradient(180deg,#f3f5f9_0%,#d8dde7_100%)] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="chip rounded-md px-3 py-1 text-xs">Vista</span>
          <span className="chip rounded-md px-3 py-1 text-xs">Vehiculos</span>
          <span className="chip rounded-md px-3 py-1 text-xs">Contenedores</span>
        </div>
      </div>
    </header>
  );
}
