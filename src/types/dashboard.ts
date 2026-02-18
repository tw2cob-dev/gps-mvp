export type PortState = "retirado" | "en_puerto" | "devuelto";
export type ShareState = "activo" | "inactivo";

export type FleetTruck = {
  id: string;
  plate: string;
  driverName: string;
  containerNo: string;
  lat: number;
  lng: number;
  updatedAt: string;
  portState: PortState;
  shareState: ShareState;
};
