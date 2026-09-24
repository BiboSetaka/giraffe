import { neon } from "@neondatabase/serverless";

// Vercel's Postgres integration (provisioned via Neon in the Storage tab)
// injects DATABASE_URL automatically — no manual connection setup needed.
const sql = neon(process.env.DATABASE_URL);

export async function listProducts(tag) {
  const rows = tag && tag !== "All"
    ? await sql`SELECT * FROM products WHERE tag = ${tag} ORDER BY created_at DESC`
    : await sql`SELECT * FROM products ORDER BY created_at DESC`;
  return rows;
}

export async function getProduct(id) {
  const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
  return rows[0] || null;
}

export async function createProduct({ name, tag, price, images }) {
  const rows = await sql`
    INSERT INTO products (name, tag, price, images)
    VALUES (${name}, ${tag}, ${price}, ${images})
    RETURNING *
  `;
  return rows[0];
}

export async function updateProduct(id, { name, tag, price, images }) {
  const rows = await sql`
    UPDATE products
    SET name = ${name}, tag = ${tag}, price = ${price}, images = ${images}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] || null;
}

export async function deleteProduct(id) {
  await sql`DELETE FROM products WHERE id = ${id}`;
}
