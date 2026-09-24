"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/currency";

const EMPTY_FORM = { id: null, name: "", tag: "Tops", price: "", images: [] };

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        urls.push(data.url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url) {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price || form.images.length === 0) {
      setError("Name, price, and at least one image are required.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      tag: form.tag,
      price: Number(form.price),
      images: form.images,
    };
    const url = form.id ? `/api/products/${form.id}` : "/api/products";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setForm(EMPTY_FORM);
      loadProducts();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
    }
  }

  function editProduct(p) {
    setForm({ id: p.id, name: p.name, tag: p.tag, price: p.price, images: p.images });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Giraffe — Product Admin</h1>
        <button onClick={logout} style={styles.logoutBtn}>Log out</button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.h2}>{form.id ? "Edit product" : "Add a product"}</h2>

        <label style={styles.label}>
          Name
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Category
          <select
            value={form.tag}
            onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
            style={styles.input}
          >
            <option>Tops</option>
            <option>Outerwear</option>
            <option>Collab</option>
          </select>
        </label>

        <label style={styles.label}>
          Price (USD)
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Photos (first one = thumbnail)
          <input type="file" accept="image/*" multiple onChange={handleFiles} />
        </label>

        {uploading && <p>Uploading…</p>}

        {form.images.length > 0 && (
          <div style={styles.thumbRow}>
            {form.images.map((url) => (
              <div key={url} style={styles.thumbWrap}>
                <img src={url} alt="" style={styles.thumb} />
                <button type="button" onClick={() => removeImage(url)} style={styles.thumbRemove}>✕</button>
              </div>
            ))}
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.formActions}>
          <button type="submit" disabled={saving || uploading} style={styles.button}>
            {saving ? "Saving…" : form.id ? "Update product" : "Add product"}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(EMPTY_FORM)} style={styles.cancelBtn}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <h2 style={styles.h2}>Products ({products.length})</h2>
      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            <img src={p.images[0]} alt={p.name} style={styles.cardImg} />
            <div style={styles.cardBody}>
              <strong>{p.name}</strong>
                  <span>{p.tag} · {formatPrice(p.price)}</span>
              <div style={styles.cardActions}>
                <button onClick={() => editProduct(p)} style={styles.smallBtn}>Edit</button>
                <button onClick={() => deleteProduct(p.id)} style={styles.smallBtnDanger}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "sans-serif", color: "#26211A" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  h1: { fontSize: 22, margin: 0 },
  h2: { fontSize: 18, marginTop: 32 },
  logoutBtn: { background: "none", border: "2px solid #26211A", borderRadius: 8, padding: "6px 14px", cursor: "pointer" },
  form: { background: "#FBF6EC", border: "3px solid #26211A", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12 },
  label: { display: "flex", flexDirection: "column", gap: 4, fontSize: 14, fontWeight: 600 },
  input: { padding: 9, borderRadius: 8, border: "2px solid #26211A", fontSize: 15, fontWeight: 400 },
  thumbRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  thumbWrap: { position: "relative" },
  thumb: { width: 70, height: 70, objectFit: "cover", borderRadius: 8, border: "2px solid #26211A" },
  thumbRemove: { position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", border: "none", background: "#B8502E", color: "#fff", cursor: "pointer", fontSize: 11 },
  error: { color: "#B8502E", margin: 0 },
  formActions: { display: "flex", gap: 10 },
  button: { padding: "11px 20px", borderRadius: 8, border: "none", background: "#3A6152", color: "#FBF6EC", fontWeight: 600, cursor: "pointer" },
  cancelBtn: { padding: "11px 20px", borderRadius: 8, border: "2px solid #26211A", background: "none", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 16 },
  card: { border: "2px solid #26211A", borderRadius: 12, overflow: "hidden", background: "#fff" },
  cardImg: { width: "100%", height: 160, objectFit: "cover", display: "block" },
  cardBody: { padding: 10, display: "flex", flexDirection: "column", gap: 6, fontSize: 14 },
  cardActions: { display: "flex", gap: 8, marginTop: 4 },
  smallBtn: { flex: 1, padding: 6, borderRadius: 6, border: "2px solid #26211A", background: "none", cursor: "pointer" },
  smallBtnDanger: { flex: 1, padding: 6, borderRadius: 6, border: "none", background: "#B8502E", color: "#fff", cursor: "pointer" },
};
