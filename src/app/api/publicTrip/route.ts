import { findMockLink } from "@/lib/mockPublicTrips";
import { mockFleet } from "@/lib/mockFleet";
import { PublicTripResponse } from "@/types/tracking";
import { NextRequest, NextResponse } from "next/server";

function fromTruck(plate: string) {
  const truck = mockFleet.find((item) => item.plate.toLowerCase() === plate.toLowerCase());
  if (!truck) return null;

  return {
    tripId: `mock_${truck.id}`,
    containerNo: truck.containerNo,
    driverName: truck.driverName,
    driverPhone: "+34 600 000 000",
    vehiclePlate: truck.plate,
    status: "active" as const,
    lastPosition: {
      lat: truck.lat,
      lng: truck.lng,
      timestamp: truck.updatedAt,
    },
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  };
}

function fromTokenFallback(token: string) {
  if (!mockFleet.length) return null;
  const hash = token.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const truck = mockFleet[hash % mockFleet.length];
  return {
    tripId: `mock_${token}`,
    containerNo: truck.containerNo,
    driverName: truck.driverName,
    driverPhone: "+34 600 000 000",
    vehiclePlate: truck.plate,
    status: "active" as const,
    lastPosition: {
      lat: truck.lat,
      lng: truck.lng,
      timestamp: truck.updatedAt,
    },
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const truckPlate = request.nextUrl.searchParams.get("truck")?.trim();

  if (!token) {
    const response: PublicTripResponse = {
      status: "not_found",
      message: "Token requerido.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const link = findMockLink(token);
  if (!link) {
    const fromTruckData = truckPlate ? fromTruck(truckPlate) : null;
    const fallback = fromTruckData ?? fromTokenFallback(token);

    if (!fallback) {
      const response: PublicTripResponse = {
        status: "not_found",
        message: "Link no valido.",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: PublicTripResponse = {
      status: "active",
      data: fallback,
    };
    return NextResponse.json(response, { status: 200 });
  }

  if (link.revokedAt) {
    const response: PublicTripResponse = {
      status: "revoked",
      message: "Este link fue revocado por el operador.",
    };
    return NextResponse.json(response, { status: 403 });
  }

  const isExpired = new Date(link.trip.expiresAt).getTime() <= Date.now();
  if (isExpired) {
    const response: PublicTripResponse = {
      status: "expired",
      message: "Este link ha caducado.",
    };
    return NextResponse.json(response, { status: 410 });
  }

  const response: PublicTripResponse = {
    status: "active",
    data: link.trip,
  };
  return NextResponse.json(response, { status: 200 });
}
