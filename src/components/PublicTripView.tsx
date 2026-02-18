"use client";

import PublicTripMap from "@/components/PublicTripMap";
import { PublicTripResponse } from "@/types/tracking";
import { useCallback, useEffect, useState } from "react";

type PublicTripViewProps = {
  token: string;
};

const POLL_INTERVAL_MS = 20_000;

export default function PublicTripView({ token }: PublicTripViewProps) {
  const [response, setResponse] = useState<PublicTripResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrip = useCallback(async () => {
    try {
      const res = await fetch(`/api/publicTrip?token=${encodeURIComponent(token)}`, {
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
  }, [token]);

  useEffect(() => {
    void loadTrip();
    const id = setInterval(() => {
      void loadTrip();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [loadTrip]);

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Cargando tracking...</p>;
  }

  if (!response || response.status !== "active") {
    const message =
      response?.message ?? "No se pudo validar el enlace de tracking.";
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Tracking no disponible</h2>
        <p className="mt-2 text-sm text-zinc-600">{message}</p>
      </section>
    );
  }

  const { data } = response;
  const updatedAt = new Date(data.lastPosition.timestamp).toLocaleString("es-ES");
  const expiresAt = new Date(data.expiresAt).toLocaleString("es-ES");

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Contenedor {data.containerNo}</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Camion: {data.vehiclePlate} | Chofer: {data.driverName} ({data.driverPhone})
        </p>
        <p className="mt-1 text-sm text-zinc-600">Ultima actualizacion: {updatedAt}</p>
        <p className="mt-1 text-sm text-zinc-600">Link valido hasta: {expiresAt}</p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <PublicTripMap lat={data.lastPosition.lat} lng={data.lastPosition.lng} />
      </section>
    </div>
  );
}
