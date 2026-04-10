const products = [
    { name: "Relógio Lux", price: "32.000 CVE" },
    { name: "Cabelo Premium", price: "28.000 CVE" },
    { name: "Joia Gold", price: "18.000 CVE" },
    { name: "Bolsa Chic", price: "12.000 CVE" },
];

export default function Products() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-bold mb-8">Produtos</h2>
            <div className="grid md:grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p.name} className="border border-white/10 rounded-2xl p-4">
                        <div className="h-40 bg-white/10 rounded-xl mb-4" />
                        <h3>{p.name}</h3>
                        <p className="text-amber-400">{p.price}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}