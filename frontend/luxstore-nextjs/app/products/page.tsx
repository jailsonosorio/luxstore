"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatCategory } from "../../utils/format";
import { normalizeText } from "@/utils/search";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryId = searchParams.get("categoryId");
    const selectedBadge = searchParams.get("badge");
    const initialSearch = searchParams.get("search") || "";
    const [search, setSearch] = useState(initialSearch);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const selectedCategoryId = categoryId ? Number(categoryId) : null;


    // FETCH API
    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao buscar produtos:", err);
                setLoading(false);
            });
    }, []);

    // categorias únicas
    const categories = Array.from(
        new Map(products.map(p => [p.category?.id, p.category])).values()
    ).filter(Boolean);

    // badges únicos
    const badges = Array.from(
        new Set(products.map((p) => formatCategory(p.badge)).filter(Boolean))
    );

    // atualizar filtros na URL
    function updateFilter(type: "categoryId" | "badge", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(type) === value) {
        params.delete(type);
    } else {
        params.set(type, value);
    }

    router.push(`/products?${params.toString()}`);
    }

    // FILTRO + PESQUISA
    const filteredProducts = products.filter((product) => {
        const matchCategory = selectedCategoryId
            ? product.category?.id === selectedCategoryId
            : true;

        const matchBadge = selectedBadge
            ? formatCategory(product.badge) === selectedBadge
            : true;

        // NORMALIZAÇÃO
        const normalizedSearch = normalizeText(search);

        const matchSearch =
            normalizeText(product.name).includes(normalizedSearch) ||
            normalizeText(product.description).includes(normalizedSearch) ||
            normalizeText(product.category?.name).includes(normalizedSearch);

        return matchCategory && matchBadge && matchSearch;
    });

    console.log("Produtos filtrados:", filteredProducts);
    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <section className="mx-auto max-w-7xl px-6 py-12">
                <Link
                    href="/"
                    className="text-sm text-white/60 transition hover:text-amber-300"
                >
                    ← Voltar para home
                </Link>

                <div className="mt-6">
                    <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
                        Catálogo
                    </p>
                    <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                        Os nossos produtos
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                        Explora os produtos por categoria, tendência ou destaque.
                    </p>
                </div>

                <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* FILTROS */}
                    <div className="flex flex-col gap-4">

                        {/* Categorias */}
                        <div>
                            <p className="mb-2 text-sm text-white/60">Categorias</p>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => updateFilter("categoryId", String(cat.id))}
                                        className={`rounded-full px-4 py-2 text-sm transition ${selectedCategoryId === cat.id
                                            ? "bg-amber-400 text-black"
                                            : "border border-white/10 text-white/70 hover:border-white/30"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Badges */}
                        <div>
                            <p className="mb-2 text-sm text-white/60">Destaques</p>
                            <div className="flex flex-wrap gap-3">
                                {badges.map((badge) => (
                                    <button
                                        key={badge}
                                        onClick={() => updateFilter("badge", badge!)}
                                        className={`rounded-full px-4 py-2 text-sm transition ${selectedBadge === badge
                                            ? "bg-amber-400 text-black"
                                            : "border border-white/10 text-white/70 hover:border-white/30"
                                            }`}
                                    >
                                        {badge}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PESQUISA */}
                    <div className="relative w-full lg:w-[400px] shadow-lg shadow-black/20">
                        <input
                            type="text"
                            placeholder="Procurar produtos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-10 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-amber-400/40 focus:bg-white/15 transition"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 ">
                            🔍
                        </span>

                    </div>
                </div>

                {/* RESULTADOS */}
                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {loading ? (
                        <div className="col-span-full text-center text-white/60">
                            Carregando produtos...
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center text-white/60">
                            Nenhum produto encontrado com estes filtros.
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 transition hover:-translate-y-1 hover:border-amber-400/30"
                            >
                                <div className="relative h-72 overflow-hidden">
                                    <img
                                        src={`http://localhost:8080${product.image}`}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    {product.badge && (
                                        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                                            {formatCategory(product.badge)}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3 p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-lg font-semibold">
                                            {product.name}
                                        </h3>

                                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                                            {product.category?.name}
                                        </span>
                                    </div>

                                    <p className="text-sm text-white/60">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-lg font-bold text-amber-300">
                                            {Number(product.price).toLocaleString("pt-PT")} CVE
                                        </span>

                                        <span className="rounded-full border border-white/15 px-4 py-2 text-sm transition group-hover:border-amber-400/40 group-hover:text-amber-300">
                                            Ver produto
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}