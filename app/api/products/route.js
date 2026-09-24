import { NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/db";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

// GET /api/products            -> all products
// GET /api/products?tag=Tops   -> filtered by tag
export async function GET(request) {
  const tag = request.nextUrl.searchParams.get("tag");
  const products = await listProducts(tag);
  return NextResponse.json({ products });
}

// POST /api/products -> create a product. Middleware already blocked this
// route for logged-out requests; we double-check here too since middleware
// only checks the cookie is *present*, not that it's valid.
export async function POST(request) {
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  if (!verifySessionToken(token)) {
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

  const product = await createProduct({ name, tag, price, images });
  return NextResponse.json({ product }, { status: 201 });
}
