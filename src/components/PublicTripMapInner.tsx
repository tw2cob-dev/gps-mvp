"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";

type PublicTripMapInnerProps = {
  lat: number;
  lng: number;
  heightClassName?: string;
};

export default function PublicTripMapInner({
  lat,
  lng,
  heightClassName = "h-[70vh]",
}: PublicTripMapInnerProps) {
  const center: [number, number] = [lat, lng];

  function ResizeFix() {
    const map = useMap();

    useEffect(() => {
      const refresh = () => map.invalidateSize();
      refresh();
      const t1 = window.setTimeout(refresh, 120);
      const t2 = window.setTimeout(refresh, 360);
      window.addEventListener("resize", refresh);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.removeEventListener("resize", refresh);
      };
    }, [map]);

    return null;
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      className={`w-full ${heightClassName}`}
    >
      <ResizeFix />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <CircleMarker center={center} radius={10}>
        <Popup>Ultima posicion registrada</Popup>
      </CircleMarker>
    </MapContainer>
  );
}
