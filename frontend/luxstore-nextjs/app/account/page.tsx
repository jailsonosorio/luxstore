"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Package, User, MapPin, ShoppingCart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function AccountPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin, loading, logout } = useAuth();
  const { items, cartCount } = useCart();

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    if (isAdmin) {
      router.push("/admin/orders");
    }
  }, [loading, isLoggedIn, isAdmin, router]);

  if (loading || !isLoggedIn || isAdmin) return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
              Minha conta
            </p>
            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
              Área do cliente
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
              Acompanhe os seus pedidos, dados pessoais, morada e carrinho.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-300 transition hover:border-red-500/60"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/account/orders"
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-amber-400/30"
          >
            <Package className="mb-4 text-amber-300" size={28} />
            <h2 className="text-xl font-semibold">Meus pedidos</h2>
            <p className="mt-2 text-sm text-white/60">
              Consulte o estado e histórico dos seus pedidos.
            </p>
          </Link>

          <Link
            href="/account/profile"
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-amber-400/30"
          >
            <User className="mb-4 text-amber-300" size={28} />
            <h2 className="text-xl font-semibold">Dados pessoais</h2>
            <p className="mt-2 text-sm text-white/60">
              Veja e atualize os seus dados de conta.
            </p>
          </Link>

          <Link
            href="/account/address"
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-amber-400/30"
          >
            <MapPin className="mb-4 text-amber-300" size={28} />
            <h2 className="text-xl font-semibold">Morada</h2>
            <p className="mt-2 text-sm text-white/60">
              Gerencie a morada usada para entrega.
            </p>
          </Link>

          <Link
            href="/cart"
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-amber-400/30"
          >
            <ShoppingCart className="mb-4 text-amber-300" size={28} />
            <h2 className="text-xl font-semibold">Carrinho</h2>
            <p className="mt-2 text-sm text-white/60">
              {cartCount > 0
                ? `${cartCount} produto(s) no carrinho.`
                : "O seu carrinho está vazio."}
            </p>
          </Link>
        </div>

        {items.length > 0 && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Carrinho atual</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl bg-neutral-900 p-4"
                >
                  <img
                    src={
                      item.image?.startsWith("/uploads")
                        ? `http://localhost:8080${item.image}`
                        : item.image
                    }
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-white/60">
                      Qtd: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-amber-300">
                      {Number(item.price).toLocaleString("pt-PT")} CVE
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/cart"
              className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 font-semibold text-black"
            >
              Ver carrinho completo
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}