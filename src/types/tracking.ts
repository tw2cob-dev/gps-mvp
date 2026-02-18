export type TripStatus = "planned" | "active" | "delivered" | "cancelled";

export type ShareLinkStatus = "active" | "expired" | "revoked" | "not_found";

export type LastPosition = {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;
};

export type PublicTrip = {
  tripId: string;
  containerNo: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  status: TripStatus;
  lastPosition: LastPosition;
  expiresAt: string;
};

export type PublicTripResponse =
  | { status: "active"; data: PublicTrip }
  | { status: "expired" | "revoked" | "not_found"; message: string };
