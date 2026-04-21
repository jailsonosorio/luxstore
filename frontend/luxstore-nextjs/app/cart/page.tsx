"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Trash } from "lucide-react";


export default function CartPage() {
    const {
        items,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
    } = useCart();

    const total = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    const whatsappText =
        items.length === 0
            ? ""
            : `Olá, quero finalizar este pedido:%0A${items
                .map(
                    (item) =>
                        `- ${item.name} | Qtd: ${item.quantity} | Preço: ${item.price}`
                )
                .join("%0A")}%0A%0ATotal: ${total.toLocaleString("pt-PT")} CVE`;

console.log("Items in cart:", items);
    return (
        <main className="min-h-screen bg-neutral-950 text-white">

            <section className="mx-auto max-w-7xl px-6 py-12">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
                            Carrinho
                        </p>
                        <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                            Os teus produtos
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                            Revê os produtos selecionados antes de finalizar o pedido.
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="text-sm text-white/60 transition hover:text-amber-300"
                    >
                        ← Continuar a comprar
                    </Link>
                </div>

                {items.length === 0 ? (
                    <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
                        <p className="text-lg font-semibold">O carrinho está vazio.</p>
                        <p className="mt-2 text-white/60">
                            Adiciona alguns produtos e volta aqui.
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-neutral-900 p-4 md:flex-row"
                                >
                                    <div className="h-40 w-full overflow-hidden rounded-2xl md:w-44">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-xl font-semibold">{item.name}</h2>
                                                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                                                    {item.category?.name}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm leading-6 text-white/60">
                                                {item.description}
                                            </p>

                                            <p className="mt-3 text-lg font-bold text-amber-300">
                                                {item.price.toLocaleString()} CVE
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    className="h-10 w-10 rounded-full border border-white/15 text-lg"
                                                >
                                                    -
                                                </button>
                                                <span className="min-w-8 text-center text-lg font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => increaseQuantity(item.id)}
                                                    className="h-10 w-10 rounded-full border border-white/15 text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300 transition hover:border-red-500/60"
                                            ><Trash size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-fit rounded-[2rem] border border-white/10 bg-white/5 p-6">
                            <h2 className="text-2xl font-bold">Resumo</h2>

                            <div className="mt-6 space-y-3 text-sm text-white/70">
                                <div className="flex items-center justify-between">
                                    <span>Itens</span>
                                    <span>{items.length}</span>
                                </div>

                                <div className="flex items-center justify-between text-base font-semibold text-white">
                                    <span>Total</span>
                                    <span>{total.toLocaleString("pt-PT")} CVE</span>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">                                
                                    <Link
                                        href="/checkout"
                                        className="rounded-full bg-amber-400 px-5 py-3 text-center font-semibold text-neutral-950"
                                    >
                                        Ir para checkout
                                    </Link>

                                <button
                                    onClick={clearCart}
                                    className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white"
                                >
                                    Limpar carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}