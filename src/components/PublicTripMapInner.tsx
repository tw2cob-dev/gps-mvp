"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

type PublicTripMapInnerProps = {
  lat: number;
  lng: number;
};

export default function PublicTripMapInner({ lat, lng }: PublicTripMapInnerProps) {
  const center: [number, number] = [lat, lng];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      style={{ height: "420px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker center={center} radius={10}>
        <Popup>Ultima posicion registrada</Popup>
      </CircleMarker>
    </MapContainer>
  );
}
