import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: "Giraffe — Rooted in Tradition",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Work+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Header />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
