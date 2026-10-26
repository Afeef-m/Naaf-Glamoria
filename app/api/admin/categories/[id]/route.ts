
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
  method: "PATCH" | "DELETE"
) {
  const backendUrl = process.env.BACKEND_API_URL?.replace(/\/+$/, "");

  if (!backendUrl) {
    return NextResponse.json(
      { success: false, message: "Backend URL is not configured." },
      { status: 500 }
    );
  }

  const { id } = await context.params;

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid category ID." },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("naaf_admin_access")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Please log in again." },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${backendUrl}/categories/${encodeURIComponent(id)}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(method === "PATCH"
            ? { "Content-Type": "application/json" }
            : {}),
        },
        ...(method === "PATCH"
          ? { body: await request.text() }
          : {}),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not connect to the backend." },
      { status: 502 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  return proxyRequest(request, context, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  return proxyRequest(request, context, "DELETE");
}
