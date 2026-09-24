"use client";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function Header() {
  const { count, setDrawerOpen } = useCart();

  return (
    <header>
      <Link href="/" className="logo">
        <img src="/logo.png" alt="Giraffe" />
      </Link>
      <nav className="main-nav">
        <Link href="/">Shop</Link>
        <Link href="/#about">About</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <button className="cart-btn" onClick={() => setDrawerOpen(true)}>
        Cart
        {count > 0 && <span className="badge">{count}</span>}
      </button>
    </header>
  );
}
