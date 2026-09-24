"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [slide, setSlide] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => setProduct(data.product))
      .catch(() => setNotFound(true));
  }, [id]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1600);
  }

  function handleAdd() {
    addToCart(product);
    showToast("Added to cart");
  }

  if (notFound) {
    return (
      <main className="product-page">
        <p>Product not found.</p>
        <button className="back-link" onClick={() => router.push("/")}>← Back to shop</button>
      </main>
    );
  }

  if (!product) {
    return <main className="product-page">Loading…</main>;
  }

  return (
    <main className="product-page">
      <button className="back-link" onClick={() => router.push("/")}>← Back to shop</button>

      <div className="pv-gallery">
        <div className="pv-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {product.images.map((src, i) => (
            <img key={i} src={src} alt={product.name} />
          ))}
        </div>
        {product.images.length > 1 && (
          <>
            <button
              className="pnav prev"
              onClick={() => setSlide((s) => (s - 1 + product.images.length) % product.images.length)}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="pnav next"
              onClick={() => setSlide((s) => (s + 1) % product.images.length)}
              aria-label="Next image"
            >
              ›
            </button>
            <div className="pdots">
              {product.images.map((_, i) => (
                <span
                  key={i}
                  className={i === slide ? "active" : ""}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pv-info">
        <span className="tag">{product.tag}</span>
        <h1>{product.name}</h1>
        <span className="price">${Number(product.price).toFixed(2)}</span>
        <button className="add-btn" onClick={handleAdd}>Add to cart</button>
      </div>

      <div role="status" className={toast ? "show" : ""}>{toast}</div>
    </main>
  );
}
