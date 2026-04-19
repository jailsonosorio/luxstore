"use client";

import { formatCategory } from "@/utils/format";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const whatsappMessage = `Olá, tenho interesse em fazer compras na loja:`;
  const [categories, setCategories] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();
  const [search, setSearch] = useState("");

  const newProducts = products
    .filter((p) => p.badge === "NOVO")
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const benefits = [
    "Entrega rápida e segura",
    "Atendimento via WhatsApp e Facebook",
    "Produtos selecionados com qualidade",
    "Compra simples e prática",
  ];

  function handleSearch() {
    const term = search.trim();

    if (!term) return;

    router.push(`/products?search=${encodeURIComponent(term)}`);
  }

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/products/best-sellers")
      .then(res => res.json())
      .then(setBestSellers)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (bestSellers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bestSellers.length);
    }, 3000); // 3 segundos

    return () => clearInterval(interval);
  }, [bestSellers]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      });
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section
        id="inicio"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_25%),radial-gradient(circle_at_left,rgba(255,255,255,0.06),transparent_20%)]" />
       <section className="relative min-h-[20vh] flex justify-center pt-10 pb-0">

          {/* SEARCH */}
          <div className="w-full px-6">
            <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md focus:border-amber-400/40"
              />

              <button
                onClick={handleSearch}
                className="rounded-full bg-amber-400 px-6 py-4 text-sm font-semibold text-neutral-950 transition hover:scale-[1.03]"
              >
                Search
              </button>

            </div>
          </div>

        </section>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:pt-4 pb-16">
          <div className="flex flex-col justify-center">
            <span className="mb-4 w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
              Loja online premium
            </span>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
              Compre os teus produtos com uma presença moderna e irresistível.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 md:text-lg">
              Uma area pensada para destacar relógios, cabelos humanos,
              joias, roupas e acessórios com confiança, elegância e foco em
              conversão.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-white px-6 py-3 font-semibold text-neutral-950 transition hover:scale-[1.02]">
                <Link
                  href="/products"
                  className="rounded-full bg-white px-6 py-3 font-semibold text-neutral-950 transition hover:scale-[1.02]"
                >
                  Ver catálogo
                </Link>
              </button>
              <a
                href={`https://wa.me/2389200910?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-amber-400/40 hover:text-amber-300"
              >Falar no WhatsApp</a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[400px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30">

            {bestSellers.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <div className="relative h-full w-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                    Destaques
                  </span>
                </div>

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-lg font-semibold text-white">
                    {product.name}
                  </h3>

                  <p className="text-sm text-white/70">
                    {product.description || "Destaque da semana"}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-amber-300">
                      {Number(product.price).toLocaleString("pt-PT")} CVE
                    </span>
                    <button className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white/40">
                      Ver mais
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center gap-2 items-center gap-3 pb-2">
                    {bestSellers.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 w-2 rounded-full transition-all ${index === currentIndex
                          ? "bg-amber-400 w-4"
                          : "bg-white/30"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categorias" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
              Categorias principais
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Organiza a tua loja por secções que realmente vendem.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-white/60">
            Cada categoria pode abrir uma página própria com filtros, promoções
            e produtos em destaque.
          </p>
        </div>
        {/*Categorias dinâmicas*/}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="space-y-3 p-5">
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="text-sm leading-6 text-white/65">
                  {category.desc}
                </p>
                <button className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-amber-400/40 hover:text-amber-300">

                  <Link
                    href={`/products?category=${encodeURIComponent(formatCategory(category.code))}`}
                  >
                    Explorar
                  </Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="produtos" className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
                Produtos em destaque
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Uma apresentação pensada para converter visitas em vendas.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-950">
                Novidades
              </button>
              <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/75">
                Mais vendidos
              </button>
              <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/75">
                Promoções
              </button>
            </div>
          </div>
          {/* Destaques dinâmicos */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
            {newProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 flex flex-col h-full"
              >
                {/* IMAGEM */}
                <div className="h-72 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                {/* CONTEÚDO */}
                <div className="flex flex-col flex-1 space-y-3 p-5">

                  {/* TOPO */}
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">{product.name}</h3>

                    <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-300">
                      {product.badge}
                    </span>
                  </div>

                  {/* DESCRIÇÃO */}
                  <p className="text-sm text-white/60">
                    {product.description || "Novo na loja"}
                  </p>

                  {/* EMPURRA O RESTO PARA BAIXO */}
                  <div className="flex-1" />

                  {/* BASE FIXA */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-lg font-bold text-white">
                      {Number(product.price).toLocaleString("pt-PT")} CVE
                    </span>

                    <button className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950">
                      Adicionar
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
              Sobre a loja
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Um visual pensado para transmitir confiança e valor.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-white/70 md:text-base">
              <p>
                Esta homepage já serve como base forte para um e-commerce
                moderno. O próximo passo é criar páginas internas, catálogo
                dinâmico, detalhe do produto e carrinho.
              </p>
              <p>
                Também podemos ligar tudo depois a uma API em Spring Boot com
                produtos reais, pedidos, stock e gestão administrativa.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
              Próximas páginas
            </p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-white/80">
              <p>• Catálogo completo</p>
              <p>• Página de detalhe do produto</p>
              <p>• Carrinho de compras</p>
              <p>• Checkout simples</p>
              <p>• Área admin</p>
              <p>• Integração com backend</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 MorenoStore. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              Facebook
            </a>
            <a href="#" className="hover:text-white">
              Instagram
            </a>
            <a href="#" className="hover:text-white">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}