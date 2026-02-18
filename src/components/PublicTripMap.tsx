"use client";

import dynamic from "next/dynamic";

type PublicTripMapProps = {
  lat: number;
  lng: number;
  heightClassName?: string;
};

const PublicTripMapInner = dynamic(() => import("@/components/PublicTripMapInner"), {
  ssr: false,
  loading: () => <p className="text-sm text-zinc-500">Cargando mapa...</p>,
});

export default function PublicTripMap({ lat, lng, heightClassName }: PublicTripMapProps) {
  return <PublicTripMapInner lat={lat} lng={lng} heightClassName={heightClassName} />;
}
