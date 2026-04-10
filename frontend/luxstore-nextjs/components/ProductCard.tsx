import Link from "next/link";
import { Product } from "../data/products";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/products/${product.id}`}
            className="group overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 transition hover:-translate-y-1 hover:border-amber-400/30"
        >
            <div className="relative h-72 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                        {product.badge}
                    </span>
                )}
            </div>

            <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                        {product.category}
                    </span>
                </div>

                <p className="line-clamp-2 text-sm leading-6 text-white/60">
                    {product.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-amber-300">
                        {product.price}
                    </span>
                    <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition group-hover:border-amber-400/40 group-hover:text-amber-300">
                        Ver produtos
                    </span>
                </div>
            </div>
        </Link>
    );
}