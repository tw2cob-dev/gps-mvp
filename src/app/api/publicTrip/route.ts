import { findMockLink } from "@/lib/mockPublicTrips";
import { PublicTripResponse } from "@/types/tracking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    const response: PublicTripResponse = {
      status: "not_found",
      message: "Token requerido.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const link = findMockLink(token);
  if (!link) {
    const response: PublicTripResponse = {
      status: "not_found",
      message: "Link no valido.",
    };
    return NextResponse.json(response, { status: 404 });
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
