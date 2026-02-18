"use client";

import dynamic from "next/dynamic";

export default function MapView() {
  const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
    ssr: false,
    loading: () => <p className="text-sm text-zinc-500">Cargando mapa...</p>,
  });

  return (
    <LeafletMap />
  );
}
