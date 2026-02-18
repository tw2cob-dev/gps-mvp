import { PublicTrip } from "@/types/tracking";

type MockLink = {
  token: string;
  trip: PublicTrip;
  revokedAt?: string;
};

const now = Date.now();

const links: MockLink[] = [
  {
    token: "demo-active",
    trip: {
      tripId: "trip_001",
      containerNo: "MSCU1234567",
      driverName: "Carlos Perez",
      driverPhone: "+34 600 111 222",
      vehiclePlate: "1234-ABC",
      status: "active",
      lastPosition: {
        lat: 39.4636,
        lng: -0.3236,
        timestamp: new Date(now - 90_000).toISOString(),
        speed: 52,
      },
      expiresAt: new Date(now + 72 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    token: "demo-expired",
    trip: {
      tripId: "trip_002",
      containerNo: "OOLU7654321",
      driverName: "Miguel Ortega",
      driverPhone: "+34 600 333 444",
      vehiclePlate: "5678-DEF",
      status: "active",
      lastPosition: {
        lat: 39.4524,
        lng: -0.3317,
        timestamp: new Date(now - 30 * 60_000).toISOString(),
      },
      expiresAt: new Date(now - 60 * 60 * 1000).toISOString(),
    },
  },
  {
    token: "demo-revoked",
    trip: {
      tripId: "trip_003",
      containerNo: "TGHU9998887",
      driverName: "Ana Llopis",
      driverPhone: "+34 600 555 666",
      vehiclePlate: "9012-GHI",
      status: "cancelled",
      lastPosition: {
        lat: 39.4689,
        lng: -0.3763,
        timestamp: new Date(now - 8 * 60_000).toISOString(),
      },
      expiresAt: new Date(now + 48 * 60 * 60 * 1000).toISOString(),
    },
    revokedAt: new Date(now - 5 * 60_000).toISOString(),
  },
];

export function findMockLink(token: string): MockLink | undefined {
  return links.find((item) => item.token === token);
}
