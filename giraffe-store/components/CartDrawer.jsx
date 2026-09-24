"use client";
import { useCart } from "@/lib/CartContext";

export default function CartDrawer() {
  const { list, subtotal, drawerOpen, setDrawerOpen, changeQty, removeItem, orderViaWhatsApp } = useCart();

  return (
    <>
      <div className={`overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside
        className={`drawer ${drawerOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!drawerOpen}
      >
        <div className="drawer-head">
          <h2>Your cart</h2>
          <button className="close-btn" onClick={() => setDrawerOpen(false)} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer-items">
          {list.length === 0 ? (
            <p className="empty-msg">Your cart is empty.<br />Add something you like.</p>
          ) : (
            list.map(({ product, qty }) => (
              <div className="line" key={product.id}>
                <img className="thumb" src={product.images[0]} alt={product.name} />
                <div className="line-info">
                  <h4>{product.name}</h4>
                  <span>${Number(product.price).toFixed(2)}</span>
                  <div className="qty-row">
                    <button onClick={() => changeQty(product.id, -1)} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button onClick={() => changeQty(product.id, 1)} aria-label="Increase quantity">+</button>
                    <button className="remove-btn" onClick={() => removeItem(product.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawer-foot">
          <div className="subtotal-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" disabled={list.length === 0} onClick={orderViaWhatsApp}>
            Order via WhatsApp
          </button>
        </div>
      </aside>
    </>
  );
}
