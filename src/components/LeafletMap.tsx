"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

const center: [number, number] = [40.4168, -3.7038];

type LeafletMapProps = {
  heightClassName?: string;
};

export default function LeafletMap({ heightClassName = "h-[70vh]" }: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      className={`w-full rounded-[20px] ${heightClassName}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker center={center} radius={10}>
        <Popup>Punto inicial del mapa</Popup>
      </CircleMarker>
    </MapContainer>
  );
}
