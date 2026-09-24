import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

// POST /api/upload  (multipart/form-data, field name "file")
// Admin-only — protected by middleware AND re-checked here.
export async function POST(request) {
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
  }

  const filename = `products/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;

  const blob = await put(filename, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
