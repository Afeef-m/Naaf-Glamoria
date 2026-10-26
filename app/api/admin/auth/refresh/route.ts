
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

type RefreshResponse = {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
};

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL;
  const refreshToken = request.cookies.get("naaf_admin_refresh")?.value;

  if (!backendUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication service is not configured",
      },
      { status: 500 }
    );
  }

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "Refresh token is missing" },
      { status: 401 }
    );
  }

  try {
    const { data } = await axios.post<RefreshResponse>(
      `${backendUrl}/auth/refresh`,
      { refreshToken },
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (
      !data.success ||
      typeof data.accessToken !== "string" ||
      typeof data.refreshToken !== "string"
    ) {
      throw new Error("Invalid refresh response");
    }

    const response = NextResponse.json(
      { success: true, message: "Session refreshed" },
      { status: 200 }
    );

    const secure = process.env.NODE_ENV === "production";

    response.cookies.set("naaf_admin_access", data.accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("naaf_admin_refresh", data.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error: unknown) {
    const status =
      axios.isAxiosError(error) && error.response?.status === 401
        ? 401
        : 502;

    const response = NextResponse.json(
      {
        success: false,
        message:
          status === 401
            ? "Your session has expired. Please log in again."
            : "Unable to refresh your admin session.",
      },
      { status }
    );

    // Clear invalid or unusable sessions.
    if (status === 401) {
      response.cookies.set("naaf_admin_access", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      response.cookies.set("naaf_admin_refresh", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }

    response.headers.set("Cache-Control", "no-store");

    return response;
  }
}
