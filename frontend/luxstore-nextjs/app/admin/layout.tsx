"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Package, LayoutGrid } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFilter = searchParams.get("status") || "TODOS";
  const categoryFilter = searchParams.get("categoryId") || "TODOS";
  const activeFilter = searchParams.get("active") || "TODOS";
  const badgeFilter = searchParams.get("badge") || "TODOS";
  const bestSellerFilter = searchParams.get("bestSeller") || "TODOS";

  const filter = searchParams.get("filter") || "TODOS";

  function setFilter(value: string) {
    router.push(`${pathname}?filter=${value}`);
  }

  /*function handleStatusFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (status === "TODOS") {
      params.delete("status");
    } else {
      params.set("status", status);
    }

    if (pathname === "/admin/orders") {
      router.push(`/admin/orders?${params.toString()}`);
    } else {
      router.push(`/admin/orders?${params.toString()}`);
    }
  }*/

  function updateQueryParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "TODOS") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 p-4">

        <div className="mt-3">
          <h1 className="text-lg text-6x2 font-bold text-white/80 mb-3 tracking-wide">
            Menu
          </h1>

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
        <div className="mt-8">
          {/*<p className="mb-1 text-lg font-bold tracking-wide text-white/80">
              Filtrar por Status
            </p>

           <div className="mt-6 flex flex-col gap-1">
              {["TODOS", "PENDENTE", "CONFIRMADO", "ENTREGUE", "FECHADO", "CANCELADO"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status, "status")}
                  className={`rounded-full border px-4 py-2 text-left text-sm transition ${
                    statusFilter === status
                      ? "bg-amber-400 font-semibold text-black"
                      : "border-white/15 text-white/70 hover:border-white/40"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>*/}
          {/* FILTROS DINÂMICOS */}
          <div className="mt-8 border-t border-white/10 pt-6">
            {pathname === "/admin/orders" && (
              <>
                <p className="mb-3 text-lg font-bold tracking-wide text-white/80">
                  Filtrar por Status
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {["TODOS", "PENDENTE", "CONFIRMADO", "ENTREGUE", "FECHADO", "CANCELADO"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateQueryParam("status", status)}
                      className={`rounded-full border px-4 py-2 text-left text-sm transition ${statusFilter === status
                        ? "bg-amber-400 font-semibold text-black"
                        : "border-white/15 text-white/70 hover:border-white/40"
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}

            {pathname === "/admin/products" && (
              <>
                <p className="mb-3 text-lg font-bold tracking-wide text-white/80">
                  Filtros de Produtos
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {["TODOS", "NOVO", "POPULAR", "BEST_SELLER"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`rounded-full border px-4 py-2 text-left text-sm ${filter === f
                        ? "bg-amber-400 text-black font-semibold"
                        : "border-white/15 text-white/70"
                        }`}
                    >
                      {f === "BEST_SELLER" ? "MAIS VENDIDOS" : f}
                    </button>
                  ))}
                </div>
              </>
            )}

            {pathname === "/admin/categories" && (
              <>
                <p className="mb-3 text-lg font-bold tracking-wide text-white/80">
                  Filtros de Categorias
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {["TODOS", "DESTAQUE", "SEM_DESTAQUE"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`rounded-full border px-4 py-2 text-left text-sm ${filter === f
                          ? "bg-amber-400 text-black font-semibold"
                          : "border-white/15 text-white/70"
                        }`}
                    >
                      {f === "SEM_DESTAQUE" ? "SEM DESTAQUE" : f}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>


      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>

    </div>
  );
}