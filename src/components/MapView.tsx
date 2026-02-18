"use client";

import dynamic from "next/dynamic";

type MapViewProps = {
  heightClassName?: string;
};

export default function MapView({ heightClassName }: MapViewProps) {
  const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
    ssr: false,
    loading: () => <p className="text-sm text-zinc-500">Cargando mapa...</p>,
  });

  return <LeafletMap heightClassName={heightClassName} />;
}
