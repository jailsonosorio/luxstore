"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    PackageCheck,
    Truck,
    MapPin,
    CreditCard,
} from "lucide-react";

export default function OrderDetailsPage() {

    const { id } = useParams();
    const router = useRouter();
    const { token, isLoggedIn } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [productImages, setProductImages] = useState<any>({});

    useEffect(() => {

        fetch(`http://localhost:8080/api/user/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {

                if (!res.ok) {
                    throw new Error("Erro ao buscar pedido");
                }

                return res.json();
            })
            .then(async (data) => {

                setOrder(data);

                // carregar imagens
                const images: any = {};

                for (const item of data.items) {

                    try {

                        const res = await fetch(
                            `http://localhost:8080/api/products/${item.productId}`
                        );

                        const product = await res.json();

                        images[item.productId] = product.image;

                    } catch (err) {
                        console.error(err);
                    }
                }

                setProductImages(images);
            })
            .catch(console.error)
            .finally(() => setLoading(false));

    }, [id]);

    const STATUS_FLOW = [
        "PENDENTE",
        "CONFIRMADO",
        "ENTREGUE",
        "FECHADO",
    ];

    function getImageUrl(image?: string) {

        if (!image) return "";

        return `http://localhost:8080${image}`;
    }

    function getStatusColor(status: string) {

        switch (status) {

            case "PENDENTE":
                return "bg-yellow-500/20 text-yellow-300";

            case "CONFIRMADO":
                return "bg-blue-500/20 text-blue-300";

            case "ENTREGUE":
                return "bg-green-500/20 text-green-300";

            case "FECHADO":
                return "bg-gray-500/20 text-gray-300";

            default:
                return "bg-white/10 text-white";
        }
    }

    if (loading) {

        return (
            <main className="min-h-screen bg-neutral-950 text-white p-10">
                A carregar pedido...
            </main>
        );
    }

    if (!isLoggedIn) {
        router.push("/auth/login");
        return null;
    }

    if (!order) {

        return (
            <main className="min-h-screen bg-neutral-950 text-white p-10">
                Pedido não encontrado.
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white px-5 py-6">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8">

                    <button
                        onClick={() => router.push("/account/orders")}
                        className="mb-5 flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Voltar para pedidos
                    </button>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <h1 className="text-4xl font-bold">
                                Pedido #{order.id}
                            </h1>

                            <p className="mt-2 text-white/50">
                                Realizado em{" "}
                                {new Date(order.createdAt).toLocaleDateString("pt-PT")}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">

                            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>

                            <span className="text-2xl font-bold text-amber-300">
                                {Number(order.total).toLocaleString("pt-PT")} CVE
                            </span>
                        </div>
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                    <div className="flex items-center justify-between">

                        {STATUS_FLOW.map((step, index) => {

                            const currentIndex =
                                STATUS_FLOW.indexOf(order.status);

                            const isActive =
                                index <= currentIndex;

                            return (

                                <div
                                    key={step}
                                    className="flex flex-1 items-center"
                                >

                                    <div className="flex flex-col items-center">

                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-full ${isActive
                                                    ? "bg-amber-400 text-black"
                                                    : "bg-white/10 text-white/40"
                                                }`}
                                        >

                                            {index === 0 && <Clock size={18} />}
                                            {index === 1 && <PackageCheck size={18} />}
                                            {index === 2 && <Truck size={18} />}
                                            {index === 3 && <CheckCircle2 size={18} />}
                                        </div>

                                        <p className="mt-3 text-xs text-white/60">
                                            {step}
                                        </p>
                                    </div>

                                    {index < STATUS_FLOW.length - 1 && (
                                        <div
                                            className={`mx-4 h-[2px] flex-1 ${index < currentIndex
                                                    ? "bg-amber-400"
                                                    : "bg-white/10"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">

                    {/* PRODUTOS */}
                    <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">

                        <h2 className="text-2xl font-bold">
                            Produtos
                        </h2>

                        <div className="mt-6 space-y-4">

                            {order.items?.map((item: any) => (

                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-2xl bg-white/5 p-4"
                                >

                                    <div className="flex items-center gap-4">

                                        <img
                                            src={getImageUrl(productImages[item.productId])}
                                            alt={item.name}
                                            className="h-20 w-20 rounded-2xl object-cover border border-white/10"
                                        />

                                        <div>

                                            <p className="font-semibold">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-sm text-white/50">
                                                Quantidade: {item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="font-bold text-amber-300">
                                        {Number(item.price).toLocaleString("pt-PT")} CVE
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">

                        {/* ENTREGA */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                            <div className="flex items-center gap-2">

                                <MapPin size={18} />

                                <h3 className="text-xl font-bold">
                                    Entrega
                                </h3>
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-white/70">

                                <p>{order.customerName}</p>

                                <p>{order.phone}</p>

                                <p>{order.address}</p>
                            </div>
                        </div>

                        {/* PAGAMENTO */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                            <div className="flex items-center gap-2">

                                <CreditCard size={18} />

                                <h3 className="text-xl font-bold">
                                    Pagamento
                                </h3>
                            </div>

                            <div className="mt-5 space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-white/60">
                                        Subtotal
                                    </span>

                                    <span>
                                        {Number(order.total).toLocaleString("pt-PT")} CVE
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-white/60">
                                        Entrega
                                    </span>

                                    <span>Grátis</span>
                                </div>

                                <div className="border-t border-white/10 pt-3 flex justify-between font-bold">

                                    <span>Total</span>

                                    <span className="text-amber-300">
                                        {Number(order.total).toLocaleString("pt-PT")} CVE
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* AÇÕES */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                            <div className="space-y-3">

                                <button
                                    className="w-full rounded-full bg-white/10 py-3 text-sm hover:bg-white/20 transition"
                                >
                                    Rastrear pedido
                                </button>

                                <button
                                    className="w-full rounded-full bg-amber-400 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
                                >
                                    Descarregar fatura
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}