"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/currency";

const CATS = ["All", "Tops", "Outerwear", "Collab"];

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const qs = cat === "All" ? "" : `?tag=${encodeURIComponent(cat)}`;
    fetch(`/api/products${qs}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [cat]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1600);
  }

  function handleAdd(e, product) {
    e.stopPropagation();
    addToCart(product);
    showToast("Added to cart");
  }

  function handleContactSubmit(e) {
    e.preventDefault();
    e.target.reset();
    showToast("Message sent — we'll reply soon (demo)");
  }

  return (
    <>
      <section className="hero">
        <img className="hero-logo" src="/logo.png" alt="Giraffe" />
        <p className="slogan">rooted in tradition</p>
        <button
          className="hero-cta"
          onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
        >
          Shop the collection
        </button>
      </section>

      <div className="filters">
        {CATS.map((c) => (
          <button
            key={c}
            className="filter-btn"
            data-active={c === cat}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <main className="grid" id="shop">
        {loading ? (
          <p>Loading…</p>
        ) : products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          products.map((p) => (
            <div className="card" key={p.id}>
              <img
                className="swatch"
                src={p.images[0]}
                alt={p.name}
                onClick={() => router.push(`/product/${p.id}`)}
              />
              <div className="card-body">
                <span className="tag">{p.tag}</span>
                <h3 onClick={() => router.push(`/product/${p.id}`)}>{p.name}</h3>
                <span className="price">{formatPrice(p.price)}</span>
                <button className="add-btn" onClick={(e) => handleAdd(e, p)}>Add to cart</button>
              </div>
            </div>
          ))
        )}
      </main>

      <section className="about" id="about">
        <div className="about-inner">
          <img className="about-swatch" src="/about.jpg" alt="Giraffe pieces" />
          <div>
            <h2>Our story</h2>
            <p>
              Giraffe started in Maseru with a simple idea: clothes that carry the patterns
              and colours of home into everyday wear. Every piece is embroidered, hand-dyed,
              or hand-painted in small batches — roses stitched onto tees, denim reworked
              into patchwork jackets, tie-dye done one shirt at a time.
            </p>
            <p>
              We work with local tailors and small print runs, so what you're wearing was
              made close by, by people who know the pattern by heart.
            </p>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <h2>Get in touch</h2>
        <p className="contact-lead">
          Questions about sizing, an order, or stocking Giraffe at your shop — send us a note.
        </p>
        <form onSubmit={handleContactSubmit}>
          <label>Name<input type="text" name="name" required /></label>
          <label>Email<input type="email" name="email" required /></label>
          <label>Message<textarea name="message" rows="4" required /></label>
          <button type="submit" className="hero-cta">Send message</button>
        </form>
        <p className="contact-details">Maseru, Lesotho · hello@giraffe.co.ls · +266 5000 0000</p>
      </section>

      <footer>© 2026 Giraffe Clothing Co. · Maseru, Lesotho</footer>

      <div role="status" className={toast ? "show" : ""}>{toast}</div>
    </>
  );
}
