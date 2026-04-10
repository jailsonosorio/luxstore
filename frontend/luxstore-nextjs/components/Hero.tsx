export default function Hero() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-10">
            <div>
                <h1 className="text-5xl font-bold leading-tight">
                    Venda com estilo e profissionalismo
                </h1>
                <p className="mt-6 text-white/70">
                    Relógios, cabelos humanos, joias e muito mais — agora numa loja moderna.
                </p>
                <button className="mt-8 bg-white text-black px-6 py-3 rounded-full font-semibold">
                    Ver produtos
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-white/10 rounded-2xl" />
                <div className="h-40 bg-white/10 rounded-2xl" />
                <div className="h-40 bg-white/10 rounded-2xl" />
                <div className="h-40 bg-white/10 rounded-2xl" />
            </div>
        </section>
    );
}