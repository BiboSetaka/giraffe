"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
export const WHATSAPP_NUMBER = "26660000000"; // replace with the real Giraffe WhatsApp line

export function CartProvider({ children }) {
  const [items, setItems] = useState({}); // { [productId]: { product, qty } }
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("giraffe_cart_v2");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("giraffe_cart_v2", JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  function addToCart(product) {
    setItems((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: { product, qty: (existing?.qty || 0) + 1 },
      };
    });
    setDrawerOpen(true);
  }

  function changeQty(id, delta) {
    setItems((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      const qty = existing.qty + delta;
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = { ...existing, qty };
      return next;
    });
  }

  function removeItem(id) {
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function clearCart() {
    setItems({});
  }

  const list = Object.values(items);
  const count = list.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = list.reduce((sum, i) => sum + i.qty * Number(i.product.price), 0);

  function orderViaWhatsApp() {
    const lines = list.map(
      (i) => `• ${i.product.name} x${i.qty} — $${(i.qty * Number(i.product.price)).toFixed(2)}`
    );
    const message = `Hi Giraffe! I'd like to order:\n${lines.join("\n")}\n\nTotal: $${subtotal.toFixed(2)}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clearCart();
    setDrawerOpen(false);
  }

  return (
    <CartContext.Provider
      value={{
        list,
        count,
        subtotal,
        drawerOpen,
        setDrawerOpen,
        addToCart,
        changeQty,
        removeItem,
        orderViaWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
