"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:8080/api/products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
  if (loading) return;

  if (!isLoggedIn || !isAdmin) {
    router.push("/admin/login");
    return;
  }

  fetchProducts();
}, [loading, isLoggedIn, isAdmin]);

  if (!isLoggedIn || !isAdmin) return null;

  if (loading) return null;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Produtos</h1>

      {/* BOTÃO CRIAR */}
      <div className="mb-6">
        <button className="bg-amber-400 text-black px-4 py-2 rounded-lg font-semibold hover:scale-[1.02] transition">
          + Criar Produto
        </button>
      </div>

      {/* LISTA */}
      {loadingOrders ? (
        <p className="text-white/60">A carregar produtos...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover rounded-lg mb-3"
              />

              <h3 className="font-semibold">{product.name}</h3>

              <p className="text-sm text-white/60">
                {product.category}
              </p>

              <p className="text-amber-300 font-bold mt-2">
                {Number(product.price).toLocaleString("pt-PT")} CVE
              </p>

              <div className="mt-4 flex gap-2">
                <button className="text-xs px-3 py-1 bg-blue-500 rounded">
                  Editar
                </button>

                <button className="text-xs px-3 py-1 bg-red-500 rounded">
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}