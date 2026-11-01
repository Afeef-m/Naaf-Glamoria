
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL;
  const accessToken = request.cookies.get("naaf_admin_access")?.value;

  if (!backendUrl) {
    return NextResponse.json(
      { success: false, message: "Backend is not configured" },
      { status: 500 }
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { data } = await axios.post(
      `${backendUrl}/products/upload-signature`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      }
    );

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data,
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the backend",
      },
      { status: 502 }
    );
  }
}
