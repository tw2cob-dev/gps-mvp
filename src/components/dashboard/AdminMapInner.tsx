"use client";

import { FleetTruck, PortState } from "@/types/dashboard";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";

type AdminMapInnerProps = {
  trucks: FleetTruck[];
  selectedTruckId: string | null;
  onSelectTruck: (id: string) => void;
};

const center: [number, number] = [39.4699, -0.3763];

function getColorByPortState(state: PortState): string {
  if (state === "retirado") return "#21a366";
  if (state === "devuelto") return "#d04848";
  return "#e39b17";
}

function ResizeFix() {
  const map = useMap();

  useEffect(() => {
    const refresh = () => map.invalidateSize();
    refresh();

    const timeoutId = window.setTimeout(refresh, 120);
    const resizeId = window.setTimeout(refresh, 360);

    const observer = new ResizeObserver(() => refresh());
    observer.observe(map.getContainer());
    window.addEventListener("resize", refresh);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(resizeId);
      observer.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [map]);

  return null;
}

export default function AdminMapInner({
  trucks,
  selectedTruckId,
  onSelectTruck,
}: AdminMapInnerProps) {
  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom
      zoomControl
      style={{ height: "100%", width: "100%" }}
    >
      <ResizeFix />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {trucks.map((truck) => {
        const isSelected = selectedTruckId === truck.id;
        return (
          <CircleMarker
            key={truck.id}
            center={[truck.lat, truck.lng]}
            radius={isSelected ? 10 : 7}
            pathOptions={{
              color: getColorByPortState(truck.portState),
              fillColor: getColorByPortState(truck.portState),
              fillOpacity: 0.95,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onSelectTruck(truck.id),
            }}
          >
            <Popup>
              {truck.plate} - {truck.containerNo}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
