
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL;
  const refreshToken = request.cookies.get("naaf_admin_refresh")?.value;

  let logoutFailed = false;

  if (backendUrl && refreshToken) {
    try {
      await axios.post(
        `${backendUrl}/auth/logout`,
        { refreshToken },
        { timeout: 10000 }
      );
    } catch {
      // Still clear local cookies if the backend is unavailable.
      logoutFailed = true;
    }
  }

  const response = NextResponse.json(
    {
      success: true,
      message: logoutFailed
        ? "Signed out on this device. Server session revocation could not be confirmed."
        : "Logged out successfully",
    },
    { status: 200 }
  );

  const secure = process.env.NODE_ENV === "production";

  for (const name of ["naaf_admin_access", "naaf_admin_refresh"]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  response.headers.set("Cache-Control", "no-store");

  return response;
}
