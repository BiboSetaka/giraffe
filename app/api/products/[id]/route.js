import { NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "@/lib/db";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

function requireAdmin() {
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  return verifySessionToken(token);
}

export async function GET(_request, { params }) {
  const product = await getProduct(Number(params.id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request, { params }) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, tag, price, images } = body;

  if (!name || !tag || price == null || !Array.isArray(images) || images.length === 0) {
    return NextResponse.json(
      { error: "name, tag, price and at least one image are required" },
      { status: 400 }
    );
  }

  const product = await updateProduct(Number(params.id), { name, tag, price, images });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_request, { params }) {
  if (!requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteProduct(Number(params.id));
  return NextResponse.json({ ok: true });
}
