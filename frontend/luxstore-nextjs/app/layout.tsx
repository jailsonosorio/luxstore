import "./globals.css";
import Header from "../components/Header";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "MorenoStore",
  description: "Loja online moderna",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <CartProvider><Header />{children}</CartProvider>
      </body>
    </html>
  );
}