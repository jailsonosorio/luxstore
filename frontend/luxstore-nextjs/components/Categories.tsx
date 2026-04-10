const categories = ["Relógios", "Cabelos", "Joias", "Roupas & Acessórios"];

export default function Categories() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-bold mb-8">Categorias</h2>
            <div className="grid md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat}
                        className="h-40 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                    >
                        {cat}
                    </div>
                ))}
            </div>
        </section>
    );
}