"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Clock,
    PackageCheck,
    Truck,
    CheckCircle2,
    Search,
    Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OrdersPage() {

    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("TODOS");
    const [search, setSearch] = useState("");
    const { token, isLoggedIn, isAdmin, } = useAuth();
    const normalizedSearch = search.toLowerCase();
    const [productImages, setProductImages] = useState<any>({});
    const [trackingOpen, setTrackingOpen] = useState<number | null>(null);


    useEffect(() => {

        fetch("http://localhost:8080/api/user/orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {

                if (!res.ok) {
                    throw new Error("Erro ao buscar pedidos");
                }

                const text = await res.text();
                return text ? JSON.parse(text) : [];

            })
            //.then(data => setOrders(data))
            .then(async (data) => {

                setOrders(data);

                // buscar imagens dos produtos
                const images: any = {};

                for (const order of data) {

                    for (const item of order.items) {

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
                }

                setProductImages(images);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, []);

    function getImageUrl(imageUrl?: string) {
        if (!imageUrl) {
            return "";
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `http://localhost:8080${imageUrl}`;
    }

    const STATUS_FLOW = [
        "PENDENTE",
        "CONFIRMADO",
        "ENTREGUE",
        "FECHADO",
    ];

    const filteredOrders = orders.filter(order => {

        const matchFilter =
            filter === "TODOS"
                ? true
                : order.status === filter;

        const matchSearch =
            order.id.toString().includes(normalizedSearch) ||

            order.status?.toLowerCase().includes(normalizedSearch) ||

            order.items?.some((item: any) =>
                item.name?.toLowerCase().includes(normalizedSearch)
            );

        return matchFilter && matchSearch;
    });

    const pending = orders.filter(o => o.status === "PENDENTE").length;
    const confirmed = orders.filter(o => o.status === "CONFIRMADO").length;
    const delivered = orders.filter(o => o.status === "ENTREGUE").length;
    const closed = orders.filter(o => o.status === "FECHADO").length;

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

    if (loading) return null;

    if (!isLoggedIn) {
        router.push("/auth/login");
        return null;
    }

    async function confirmOrder(orderId: number) {

        try {

            const res = await fetch(
                `http://localhost:8080/api/user/orders/${orderId}/confirm`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Erro ao confirmar entrega");
            }

            // Atualiza lista
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, status: "FECHADO" }
                        : order
                )
            );

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white px-5 py-6">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <button
                            onClick={() => router.push("/account")}
                            className="mb-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
                        >
                            <ArrowLeft size={18} />
                            Voltar para área do cliente
                        </button>

                        <h1 className="text-4xl font-bold">
                            Meus Pedidos
                        </h1>

                        <p className="mt-2 text-white/60">
                            Consulte o estado e acompanhe as suas encomendas.
                        </p>
                    </div>

                    {/* PESQUISA */}
                    <div className="relative w-full lg:w-[350px]">
                        <Search
                            className="absolute left-3 top-3 text-white/40"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Pesquisar pedido..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full border border-white/10 bg-white/10 px-10 py-3 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* CARDS TOPO */}
                <div className="mt-8 grid gap-3 md:grid-cols-5">

                    <button
                        onClick={() => setFilter("TODOS")}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
                    >
                        <p className="flex items-center gap-2 text-sm text-white/60">
                            <Package size={16} />
                            Todos
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {orders.length}
                        </h3>
                    </button>

                    <button
                        onClick={() => setFilter("PENDENTE")}
                        className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-left"
                    >
                        <p className="flex items-center gap-2 text-sm text-yellow-300">
                            <Clock size={16} />
                            Por pagar
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {pending}
                        </h3>
                    </button>

                    <button
                        onClick={() => setFilter("CONFIRMADO")}
                        className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-left"
                    >
                        <p className="flex items-center gap-2 text-sm text-blue-300">
                            <PackageCheck size={16} />
                            Processando
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {confirmed}
                        </h3>
                    </button>

                    <button
                        onClick={() => setFilter("ENTREGUE")}
                        className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-left"
                    >
                        <p className="flex items-center gap-2 text-sm text-green-300">
                            <Truck size={16} />
                            Enviados
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {delivered}
                        </h3>
                    </button>

                    <button
                        onClick={() => setFilter("FECHADO")}
                        className="rounded-2xl border border-gray-500/20 bg-gray-500/10 p-4 text-left"
                    >
                        <p className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle2 size={16} />
                            Finalizados
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            {closed}
                        </h3>
                    </button>
                </div>

                {/* LISTA */}
                <div className="mt-8 space-y-4">

                    {loading ? (

                        <p className="text-white/60">
                            A carregar pedidos...
                        </p>

                    ) : filteredOrders.length === 0 ? (

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
                            Nenhum pedido encontrado.
                        </div>

                    ) : (

                        filteredOrders.map((order) => (

                            <div
                                key={order.id}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6"
                            >

                                {/* TOPO */}
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                    <div>
                                        <p className="text-lg font-semibold">
                                            Pedido #{order.id}
                                        </p>

                                        <p className="mt-1 text-sm text-white/50">
                                            {new Date(order.createdAt).toLocaleDateString("pt-PT")}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">

                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>

                                        <span className="text-lg font-bold text-amber-300">
                                            {Number(order.total).toLocaleString("pt-PT")} CVE
                                        </span>

                                    </div>
                                </div>

                                {/* TIMELINE */}
                                <div className="mt-6 flex items-center gap-2">

                                    {STATUS_FLOW.map((step, index) => {

                                        const currentIndex =
                                            STATUS_FLOW.indexOf(order.status);

                                        const isActive =
                                            index <= currentIndex;

                                        return (
                                            <div key={step} className="flex items-center gap-2">

                                                <div
                                                    className={`h-3 w-3 rounded-full ${isActive
                                                        ? "bg-amber-400"
                                                        : "bg-white/20"
                                                        }`}
                                                />

                                                {index < STATUS_FLOW.length - 1 && (
                                                    <div
                                                        className={`h-[2px] w-10 ${index < currentIndex
                                                            ? "bg-amber-400"
                                                            : "bg-white/20"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* PRODUTOS */}
                                <div className="mt-6 space-y-3">

                                    {order.items?.map((item: any) => {

                                        console.log("ITEM:", item);
                                        console.log("PRODUCT:", productImages);

                                        return (

                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                                            >

                                                <div className="flex items-center gap-3">

                                                    {productImages[item.productId] ? (
                                                        <img
                                                            src={getImageUrl(productImages[item.productId])}
                                                            alt={item.name}
                                                            className="h-14 w-14 rounded-xl object-cover border border-white/10"
                                                        />
                                                    ) : (
                                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-xs text-white/40">
                                                            sem img
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-medium">
                                                            {item.name}
                                                        </p>

                                                        <p className="text-sm text-white/50">
                                                            Quantidade: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="font-semibold">
                                                    {Number(item.price).toLocaleString("pt-PT")} CVE
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* AÇÕES */}
                                <div className="mt-6 flex flex-wrap gap-3">

                                    <button
                                        onClick={() =>
                                            setTrackingOpen(
                                                trackingOpen === order.id ? null : order.id
                                            )
                                        }
                                        className="rounded-full bg-white/10 px-5 py-2 text-sm hover:bg-white/20 transition"
                                    >
                                        Rastrear pedido
                                    </button>

                                    {order.status === "ENTREGUE" && (

                                        <button
                                            onClick={() => confirmOrder(order.id)}
                                            className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-300 transition"
                                        >
                                            Confirmar receção
                                        </button>
                                    )}

                                    <button
                                        onClick={() => router.push(`/account/orders/${order.id}`)}
                                        className="rounded-full bg-white/10 px-5 py-2 text-sm hover:bg-white/20 transition"
                                    >
                                        Ver detalhes
                                    </button>
                                </div>
                                {/* 🔥 TIMELINE EXPANDIDA AQUI */}
                                {trackingOpen === order.id && (

                                    <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20 p-5">

                                        <h3 className="mb-5 text-lg font-semibold">
                                            Tracking do Pedido
                                        </h3>

                                        <div className="space-y-5">

                                            {STATUS_FLOW.map((step, index) => {

                                                const currentIndex =
                                                    STATUS_FLOW.indexOf(order.status);

                                                const isActive =
                                                    index <= currentIndex;

                                                return (

                                                    <div
                                                        key={step}
                                                        className="flex gap-4"
                                                    >

                                                        {/* TIMELINE */}
                                                        <div className="flex flex-col items-center">

                                                            <div
                                                                className={`h-4 w-4 rounded-full ${isActive
                                                                        ? "bg-amber-400"
                                                                        : "bg-white/20"
                                                                    }`}
                                                            />

                                                            {index < STATUS_FLOW.length - 1 && (
                                                                <div
                                                                    className={`mt-1 h-12 w-[2px] ${index < currentIndex
                                                                            ? "bg-amber-400"
                                                                            : "bg-white/10"
                                                                        }`}
                                                                />
                                                            )}
                                                        </div>

                                                        {/* TEXTO */}
                                                        <div>

                                                            <p
                                                                className={`font-medium ${isActive
                                                                        ? "text-white"
                                                                        : "text-white/40"
                                                                    }`}
                                                            >
                                                                {step}
                                                            </p>

                                                            <p className="mt-1 text-sm text-white/50">

                                                                {step === "PENDENTE" &&
                                                                    "Pedido recebido e aguardando confirmação."}

                                                                {step === "CONFIRMADO" &&
                                                                    "Pagamento confirmado e preparação iniciada."}

                                                                {step === "ENTREGUE" &&
                                                                    "Pedido enviado para entrega."}

                                                                {step === "FECHADO" &&
                                                                    "Pedido entregue com sucesso."}

                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}