
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL;
  const accessToken = request.cookies.get("naaf_admin_access")?.value;

  if (!backendUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication service is not configured",
      },
      { status: 500 }
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const { data } = await axios.get(`${backendUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        return NextResponse.json(
          { success: false, message: "Not authenticated" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Unable to verify admin session" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Unable to reach authentication service" },
      { status: 502 }
    );
  }
}
