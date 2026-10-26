import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

type LoginResponse = {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL;

  if (!backendUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication service is not configured",
      },
      { status: 500 },
    );
  }

  let body: { email?: unknown; password?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  if (
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    !body.email.trim() ||
    !body.password
  ) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 },
    );
  }

  try {
    const { data } = await axios.post<LoginResponse>(
      `${backendUrl}/auth/login`,
      {
        email: body.email.trim(),
        password: body.password,
      },
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      },
    );

    if (
      !data.success ||
      typeof data.accessToken !== "string" ||
      typeof data.refreshToken !== "string" ||
      !data.admin
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid authentication response" },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      admin: data.admin,
    });

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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 },
        );
      }

      if (error.response) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication request failed",
          },
          { status: 502 },
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Unable to reach authentication service" },
      { status: 502 },
    );
  }
}
