import { FleetTruck } from "@/types/dashboard";

const seedFleet: FleetTruck[] = [
  {
    id: "vh-001",
    plate: "ON-4729YZ",
    driverName: "Carlos Mena",
    containerNo: "MSCU1234567",
    lat: 39.4702,
    lng: -0.3768,
    updatedAt: "2026-02-19T00:35:00.000Z",
    portState: "retirado",
    shareState: "activo",
  },
  {
    id: "vh-002",
    plate: "CA-8293JH",
    driverName: "Luis Perez",
    containerNo: "OOLU7654321",
    lat: 39.4455,
    lng: -0.3371,
    updatedAt: "2026-02-19T00:27:00.000Z",
    portState: "en_puerto",
    shareState: "inactivo",
  },
  {
    id: "vh-003",
    plate: "TX-3142AM",
    driverName: "Nora Ruiz",
    containerNo: "TGHU9988776",
    lat: 39.4588,
    lng: -0.3159,
    updatedAt: "2026-02-19T00:18:00.000Z",
    portState: "devuelto",
    shareState: "inactivo",
  },
  {
    id: "vh-004",
    plate: "QC-5284TW",
    driverName: "Victor Alarcon",
    containerNo: "FSCU1122334",
    lat: 39.487,
    lng: -0.4024,
    updatedAt: "2026-02-19T00:31:00.000Z",
    portState: "retirado",
    shareState: "activo",
  },
  {
    id: "vh-005",
    plate: "FL-9876KD",
    driverName: "Ana Llopis",
    containerNo: "CAIU4455667",
    lat: 39.4345,
    lng: -0.3968,
    updatedAt: "2026-02-19T00:12:00.000Z",
    portState: "en_puerto",
    shareState: "activo",
  },
];

const extraFleet: FleetTruck[] = Array.from({ length: 18 }, (_, index) => {
  const i = index + 6;
  const latOffset = (index % 6) * 0.018 - 0.045;
  const lngOffset = Math.floor(index / 6) * 0.022 - 0.035;
  const portState = (["retirado", "en_puerto", "devuelto"] as const)[index % 3];
  const shareState = index % 2 === 0 ? "activo" : "inactivo";

  return {
    id: `vh-${String(i).padStart(3, "0")}`,
    plate: `VR-${2000 + i}K${String.fromCharCode(65 + (index % 26))}`,
    driverName: `Chofer ${i}`,
    containerNo: `INTI${String(700000 + i).padStart(7, "0")}`,
    lat: 39.4699 + latOffset,
    lng: -0.3763 + lngOffset,
    updatedAt: `2026-02-19T00:${String((10 + index) % 60).padStart(2, "0")}:00.000Z`,
    portState,
    shareState,
  };
});

export const mockFleet: FleetTruck[] = [...seedFleet, ...extraFleet];
