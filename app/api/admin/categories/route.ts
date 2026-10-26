import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const getBackendUrl = () => process.env.BACKEND_API_URL?.replace(/\/+$/, "");

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

async function proxyRequest(request: NextRequest, method: "GET" | "POST") {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return NextResponse.json(
      { success: false, message: "Backend URL is not configured." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("naaf_admin_access")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Please log in again." },
      { status: 401 },
    );
  }

  try {
    const url = new URL(`${backendUrl}/categories`);

    if (method === "GET") {
      request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
      },
      ...(method === "POST" ? { body: await request.text() } : {}),
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not connect to the backend." },
      { status: 502 },
    );
  }
}
