"use client";

import PublicTripMap from "@/components/PublicTripMap";
import { PublicTripResponse } from "@/types/tracking";
import { useCallback, useEffect, useState } from "react";

type PublicTripViewProps = {
  token: string;
  truckPlate?: string;
};

const POLL_INTERVAL_MS = 20_000;

export default function PublicTripView({ token, truckPlate }: PublicTripViewProps) {
  const [response, setResponse] = useState<PublicTripResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrip = useCallback(async () => {
    try {
      const params = new URLSearchParams({ token });
      if (truckPlate) params.set("truck", truckPlate);

      const res = await fetch(`/api/publicTrip?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = (await res.json()) as PublicTripResponse;
      setResponse(data);
    } catch {
      setResponse({
        status: "not_found",
        message: "No se pudo cargar el tracking en este momento.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, truckPlate]);

  useEffect(() => {
    void loadTrip();
    const id = setInterval(() => {
      void loadTrip();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [loadTrip]);

  if (isLoading) {
    return <p className="p-4 text-sm text-[#4f5867]">Cargando tracking...</p>;
  }

  if (!response || response.status !== "active") {
    const message =
      response?.message ?? "No se pudo validar el enlace de tracking.";
    return (
      <section className="p-6">
        <h2 className="text-xl font-semibold text-[#111722]">Tracking no disponible</h2>
        <p className="mt-2 text-sm text-[#4f5867]">{message}</p>
      </section>
    );
  }

  const { data } = response;
  const updatedAt = new Date(data.lastPosition.timestamp).toLocaleString("es-ES");
  const expiresAt = new Date(data.expiresAt).toLocaleString("es-ES");

  return (
    <div className="h-full">
      <section className="relative h-full overflow-hidden">
        <PublicTripMap
          lat={data.lastPosition.lat}
          lng={data.lastPosition.lng}
          heightClassName="h-full min-h-0"
        />
        <aside className="absolute right-4 top-4 z-[4000] w-[340px] rounded-xl border border-[#bec6d4] bg-[rgba(246,249,253,0.96)] p-4 shadow-[0_8px_24px_rgba(32,42,58,0.18)]">
          <h2 className="text-xl font-semibold text-[#111722]">Contenedor {data.containerNo}</h2>
          <p className="mt-2 text-sm text-[#4f5867]">
            Camion: {data.vehiclePlate} | Chofer: {data.driverName} ({data.driverPhone})
          </p>
          <p className="mt-1 text-sm text-[#4f5867]">Ultima actualizacion: {updatedAt}</p>
          <p className="mt-1 text-sm text-[#4f5867]">Salida puerto: {updatedAt}</p>
          <p className="mt-1 text-sm text-[#4f5867]">Link valido hasta: {expiresAt}</p>
        </aside>
      </section>
    </div>
  );
}
