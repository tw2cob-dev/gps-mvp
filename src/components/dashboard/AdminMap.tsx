"use client";

import { FleetTruck } from "@/types/dashboard";
import dynamic from "next/dynamic";

type AdminMapProps = {
  trucks: FleetTruck[];
  selectedTruckId: string | null;
  onSelectTruck: (id: string) => void;
};

const AdminMapInner = dynamic(() => import("@/components/dashboard/AdminMapInner"), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-[#5f6878]">Cargando mapa...</p>,
});

export default function AdminMap({
  trucks,
  selectedTruckId,
  onSelectTruck,
}: AdminMapProps) {
  return (
    <AdminMapInner
      trucks={trucks}
      selectedTruckId={selectedTruckId}
      onSelectTruck={onSelectTruck}
    />
  );
}
