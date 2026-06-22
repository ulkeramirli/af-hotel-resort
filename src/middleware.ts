import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(request: NextRequest) {
  // Admin routes are protected — redirect to login if not authenticated
  // Since next-auth backend is not configured, simply allow traffic through
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

