"use client";

import AdminMap from "@/components/dashboard/AdminMap";
import { mockFleet } from "@/lib/mockFleet";
import { FleetTruck, PortState } from "@/types/dashboard";
import { useMemo, useState } from "react";

type Mode = "operaciones" | "activos";

const PORT_LABEL: Record<PortState, string> = {
  retirado: "Retirado de puerto",
  en_puerto: "En puerto",
  devuelto: "Devuelto",
};

function statusColor(state: PortState): string {
  if (state === "retirado") return "bg-[#2bb673]";
  if (state === "devuelto") return "bg-[#e05252]";
  return "bg-[#e5a227]";
}

function sharePillClass(active: boolean): string {
  return active
    ? "border-[#5a78e5] bg-[#e8edff] text-[#3658c8]"
    : "border-[#b5bdcc] bg-[#f2f4f8] text-[#667086]";
}

function nowIsoPlusHours(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function createToken() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getBaseUrl() {
  if (typeof window === "undefined") return "https://intiroute.app";
  return window.location.origin;
}

export default function TransportDashboard() {
  const [mode, setMode] = useState<Mode>("operaciones");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTruckId, setSelectedTruckId] = useState<string>(mockFleet[0].id);
  const [formOpen, setFormOpen] = useState(true);
  const [containerNo, setContainerNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [truckPlate, setTruckPlate] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const filteredTrucks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mockFleet;
    return mockFleet.filter(
      (truck) =>
        truck.plate.toLowerCase().includes(term) ||
        truck.containerNo.toLowerCase().includes(term) ||
        truck.driverName.toLowerCase().includes(term),
    );
  }, [search]);

  const selectedTruck: FleetTruck | undefined = useMemo(
    () =>
      filteredTrucks.find((item) => item.id === selectedTruckId) ??
      filteredTrucks[0] ??
      mockFleet.find((item) => item.id === selectedTruckId) ??
      mockFleet[0],
    [filteredTrucks, selectedTruckId],
  );

  function generateShareLink() {
    const token = createToken();
    const base = getBaseUrl();
    const normalizedPlate = truckPlate.trim();
    const link = normalizedPlate
      ? `${base}/t/${token}?truck=${encodeURIComponent(normalizedPlate)}`
      : `${base}/t/${token}`;
    setGeneratedLink(link);
  }

  async function copyLink() {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
    } catch {
      // no-op
    }
  }

  function generateShareForTruck(truck: FleetTruck) {
    const token = createToken();
    const base = getBaseUrl();
    setGeneratedLink(`${base}/t/${token}?truck=${encodeURIComponent(truck.plate)}`);
  }

  const cardTruck = selectedTruck ?? mockFleet[0];

  return (
    <main className={darkMode ? "app-shell theme-dark" : "app-shell"}>
      <div className="window-frame">
        <header className="window-toolbar">
          <div className="toolbar-left">
            <h1 className="toolbar-title">IntiRoute</h1>
          </div>

          <div className="toolbar-center">
            <div className="segment-control">
              <button
                className={mode === "operaciones" ? "seg active" : "seg"}
                onClick={() => setMode("operaciones")}
              >
                Operaciones
              </button>
              <button
                className={mode === "activos" ? "seg active" : "seg"}
                onClick={() => setMode("activos")}
              >
                Camiones activos
              </button>
            </div>
          </div>

          <div className="toolbar-actions">
            <button className="tool-btn" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? "Claro" : "Oscuro"}
            </button>
            <button className="tool-btn">Buscar</button>
            <button className="tool-btn">Exportar</button>
          </div>
        </header>

        <section className="window-content">
          <aside className="left-panel">
            <div className="panel-header">
              <h2>Transportes</h2>
              <p>Activos: {mockFleet.length}</p>
            </div>

            <div className="search-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar camion, contenedor o chofer..."
              />
            </div>

            {mode === "operaciones" ? (
              <section className="ops-block">
                <button
                  className="collapse-btn"
                  onClick={() => setFormOpen((prev) => !prev)}
                >
                  {formOpen ? "Ocultar formulario" : "Nuevo enlace de tracking"}
                </button>

                {formOpen ? (
                  <div className="ops-form">
                    <label>
                      Contenedor
                      <input
                        value={containerNo}
                        onChange={(event) => setContainerNo(event.target.value)}
                        placeholder="MSCU1234567"
                      />
                    </label>
                    <label>
                      Chofer
                      <input
                        value={driverName}
                        onChange={(event) => setDriverName(event.target.value)}
                        placeholder="Nombre chofer"
                      />
                    </label>
                    <label>
                      Matricula camion
                      <input
                        value={truckPlate}
                        onChange={(event) => setTruckPlate(event.target.value)}
                        placeholder="1234-ABC"
                      />
                    </label>
                    <label>
                      Email cliente
                      <input
                        value={customerEmail}
                        onChange={(event) => setCustomerEmail(event.target.value)}
                        placeholder="cliente@empresa.com"
                      />
                    </label>
                    <button className="primary-btn" onClick={generateShareLink}>
                      Generar link temporal
                    </button>
                    {generatedLink ? (
                      <div className="generated-link">
                        <p>{generatedLink}</p>
                        <button className="copy-btn" onClick={copyLink}>
                          Copiar
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>
            ) : (
              <section className="fleet-list">
                <ul>
                  {filteredTrucks.map((truck) => {
                    const active = selectedTruck?.id === truck.id;
                    return (
                      <li
                        key={truck.id}
                        className={active ? "fleet-item active" : "fleet-item"}
                        onClick={() => setSelectedTruckId(truck.id)}
                      >
                        <div className="row-a">
                          <span className={`status-pill ${statusColor(truck.portState)}`} />
                          <strong>{truck.plate}</strong>
                          <span className={`share-pill ${sharePillClass(truck.shareState === "activo")}`}>
                            Link {truck.shareState}
                          </span>
                        </div>
                        <p>{truck.containerNo}</p>
                        <p>{truck.driverName}</p>
                        <p>{PORT_LABEL[truck.portState]}</p>
                        <div className="row-b">
                          <small>{new Date(truck.updatedAt).toLocaleTimeString("es-ES")}</small>
                          <button
                            className="share-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              generateShareForTruck(truck);
                            }}
                          >
                            Compartir link
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {generatedLink ? (
                  <div className="share-result">
                    <p>{generatedLink}</p>
                    <button className="copy-btn" onClick={copyLink}>
                      Copiar
                    </button>
                  </div>
                ) : null}
              </section>
            )}
          </aside>

          <section className="map-stage">
            <AdminMap
              trucks={filteredTrucks}
              selectedTruckId={selectedTruck?.id ?? null}
              onSelectTruck={setSelectedTruckId}
            />

            {mode === "activos" ? (
              <aside className="trip-card">
                <h3>{cardTruck.containerNo}</h3>
                <p>Chofer: {cardTruck.driverName}</p>
                <p>Camion: {cardTruck.plate}</p>
                <p>Estado puerto: {PORT_LABEL[cardTruck.portState]}</p>
                <p>Salida puerto: {new Date(cardTruck.updatedAt).toLocaleString("es-ES")}</p>
                <p>Expira: {new Date(nowIsoPlusHours(72)).toLocaleString("es-ES")}</p>
              </aside>
            ) : null}

            <aside className="map-legend">
              <h4>Leyenda estado</h4>
              <p>
                <i className="dot green" />
                Retirado de puerto
              </p>
              <p>
                <i className="dot amber" />
                En puerto
              </p>
              <p>
                <i className="dot red" />
                Devuelto
              </p>
            </aside>
          </section>
        </section>
      </div>
    </main>
  );
}
