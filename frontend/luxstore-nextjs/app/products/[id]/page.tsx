"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";
import { formatCategory } from "../../../utils/format";

export default function ProductDetailsPage() {
    const params = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const productId = Number(params.id);

    // 🔥 FETCH PRODUCT BY ID
    useEffect(() => {
        if (!productId) return;

        fetch(`http://localhost:8080/api/products/${productId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Produto não encontrado");
                return res.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                notFound();
            });
    }, [productId]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
                <p className="text-white/60">Carregando produto...</p>
            </main>
        );
    }

    if (!product) {
        return null;
    }

    const whatsappMessage = `Olá, tenho interesse no produto: ${product.name} - ${Number(product.price).toLocaleString("pt-PT")} CVE`;

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <section className="mx-auto max-w-7xl px-6 py-12">
                <Link
                    href="/products"
                    className="text-sm text-white/60 transition hover:text-amber-300"
                >
                    ← Voltar para catálogo
                </Link>

                <div className="mt-8 grid gap-10 md:grid-cols-2">
                    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900">
                        <div className="h-[500px] overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-amber-400/10 px-4 py-1 text-sm text-amber-300">
                                {formatCategory(product.category)}
                            </span>

                            {product.badge && (
                                <span className="rounded-full border border-white/10 px-4 py-1 text-sm text-white/70">
                                    {formatCategory(product.badge)}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl font-bold md:text-5xl">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-2xl font-bold text-amber-300">
                            {Number(product.price).toLocaleString("pt-PT")} CVE
                        </p>

                        <p className="mt-6 text-base leading-8 text-white/70">
                            {product.details}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={() => addToCart(product)}
                                className="rounded-full bg-white px-6 py-3 font-semibold text-neutral-950 transition hover:scale-[1.02]"
                            >
                                Adicionar ao carrinho
                            </button>

                            <a
                                href={`https://wa.me/2389192012?text=${encodeURIComponent(
                                    whatsappMessage
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-amber-400/40 hover:text-amber-300"
                            >
                                Pedir via WhatsApp
                            </a>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-sm font-semibold text-white">
                                    Entrega segura
                                </p>
                                <p className="mt-2 text-sm leading-6 text-white/60">
                                    Envio rápido e acompanhamento do pedido.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-sm font-semibold text-white">
                                    Atendimento direto
                                </p>
                                <p className="mt-2 text-sm leading-6 text-white/60">
                                    Suporte rápido por WhatsApp e redes sociais.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}