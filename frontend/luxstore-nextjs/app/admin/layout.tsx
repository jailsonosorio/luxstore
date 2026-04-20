"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Package, LayoutGrid } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [statusFilter, setStatusFilter] = useState("TODOS");

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 p-4">

        <div className="mt-3">
          <p className="text-lg font-bold text-white/80 mb-3 tracking-wide">
            Filtrar por Status
          </p>

          <div className="mt-6 flex flex-col gap-1">
            {["TODOS", "PENDENTE", "CONFIRMADO", "ENTREGUE", "FECHADO", "CANCELADO"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full text-left px-4 py-2 text-sm border transition ${statusFilter === status
                  ? "bg-amber-400 text-black font-semibold"
                  : "border-white/15 text-white/70 hover:border-white/40"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">

          <p className="text-lg font-bold text-white/80 mb-3 tracking-wide">
            Menu
          </p>

          <div className="flex flex-col gap-2 mt-6">

            <Link
              href="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === "/admin/orders"
                  ? "bg-amber-400 text-black"
                  : "text-white/80 hover:bg-white/10"
                }`}
            >
              <ShoppingCart size={18} />
                Pedidos
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === "/admin/products"
                  ? "bg-amber-400 text-black"
                  : "text-white/80 hover:bg-white/10"
                }`}
            >
              <Package size={18} />
              Produtos
            </Link>

            <Link
              href="/admin/categories"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === "/admin/categories"
                  ? "bg-amber-400 text-black"
                  : "text-white/80 hover:bg-white/10"
                }`}
            >
              <LayoutGrid size={18} />
              Categorias
            </Link>

          </div>
        </div>

      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}