"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Package, Clock, MailCheck, LayoutGrid, CheckCircle2, PackageCheck, XCircle, DollarSign } from "lucide-react";
import { normalizeText } from "@/utils/search";
import { text } from "stream/consumers";

export default function AdminOrdersPage() {
    const { token, isLoggedIn, isAdmin, loading } = useAuth();
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get("status") || "TODOS";
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [search, setSearch] = useState("");
    //const [statusFilter, setStatusFilter] = useState("TODOS");
    const pathname = usePathname();

    //timeline de status
    const STATUS_FLOW = [
        "PENDENTE",
        "CONFIRMADO",
        "ENTREGUE",
        "FECHADO",
    ];

    // Fetch orders with auth
    async function fetchOrders() {
        setLoadingOrders(true);
        try {
            const res = await fetch("http://localhost:8080/api/admin/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401 || res.status === 403) {
                router.push("/admin/login");
                return;
            }

            const data = await res.json();
            setOrders(data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingOrders(false);
        }
    }

    // Verifica autenticação e autorização, e busca pedidos
    useEffect(() => {
        if (loading) return;

        if (!isLoggedIn || !isAdmin) {
            router.push("/admin/login");
            return;
        }

        // Fetch só se estiver autorizado
        fetchOrders();

    }, [loading, isLoggedIn, isAdmin, token, router]);

    if (!isLoggedIn || !isAdmin) {
        return null;
    }

    if (loading) return null;

    // Função para mapear status para cores
    function getStatusColor(status: string) {
        switch (status) {
            case "PENDENTE":
                return "bg-yellow-500/20 text-yellow-300";
            case "CONFIRMADO":
                return "bg-blue-500/20 text-blue-300";
            case "ENTREGUE":
                return "bg-green-500/20 text-green-300";
            case "CANCELADO":
                return "bg-red-500/20 text-red-300";
            default:
                return "bg-white/10 text-white";
        }
    }

    // Handle status update
    async function updateStatus(orderId: number, status: string) {

        try {
            const res = await fetch(
                `http://localhost:8080/api/admin/orders/${orderId}/status?status=${status}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("STATUS RESPONSE:", res.status);

            if (!res.ok) {
                throw new Error("Erro ao atualizar status");
            }

            // IMPORTANTE: aguardar atualização
            await fetchOrders();

            alert("Status atualizado com sucesso ✅"); // feedback

        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar status");
        }
    }

    // Filtra ações disponíveis com base no status atual
    function getAvailableActions(status: string) {
        switch (status) {
            case "PENDENTE":
                return ["CONFIRMADO", "CANCELADO"];

            case "CONFIRMADO":
                return ["ENTREGUE", "CANCELADO"];

            case "ENTREGUE":
                return ["FECHADO"];

            default:
                return [];
        }
    }

    // Atualiza query params para filtros
    const sortedOrders = [...orders].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // FILTRO COMBINADO (status + pesquisa)
    const filteredOrders = sortedOrders.filter((order) => {
        const matchStatus =
            statusFilter === "TODOS"
                ? true
                : order.status === statusFilter;

        const normalizedSearch = normalizeText(search);

        const matchSearch =
            normalizeText(order.customerName || "").includes(normalizedSearch) ||
            normalizeText(order.address || "").includes(normalizedSearch) ||
            normalizeText(order.status || "").includes(normalizedSearch);
        //normalizeText(String(order.phone) || "").includes(normalizedSearch )
        const matchPhone = String(order.phone || "").includes(search.trim());

        return matchStatus && matchSearch && matchPhone;
    });

    // ESTATÍSTICAS SIMPLES
    const totalOrders = filteredOrders.length;
    const pendingOrders = filteredOrders.filter(o => o.status === "PENDENTE").length;
    const confirmedOrders = filteredOrders.filter(o => o.status === "CONFIRMADO").length;
    const deliveredOrders = filteredOrders.filter(o => o.status === "ENTREGUE").length;
    const closedOrders = filteredOrders.filter(o => o.status === "FECHADO").length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Atualiza query params para filtros
    return (
        <div className="flex min-h-screen bg-neutral-950 text-white">
            {/* CONTEÚDO */}
            <main className="flex-1 px-5 py-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-4xl font-bold">Pedidos</h1>

                        {/* PESQUISA */}
                        <div className="relative w-full lg:w-[400px] shadow-lg shadow-black/20 rounded-full">
                            <input
                                type="text"
                                placeholder="Pesquisar pedidos..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-10 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-amber-400/40 focus:bg-white/15 transition"
                            />
                            <span className="absolute left-3 top-2.5 text-white/40">
                                🔍
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-6 mt-4 mb-6">

                        <div className="rounded-2xl bg-white/5 p-4 border border-white/10 ">
                            <p className="flex items-center gap-1 text-sm text-white/60"><Package/>Total Pedidos</p>
                            <h3 className="text-2xl font-bold">{totalOrders}</h3>
                        </div>

                        <div className="rounded-2xl bg-yellow-500/10 p-4 border border-yellow-500/20">
                            <p className="flex items-center gap-1 text-sm text-yellow-300"><Clock/>Pendentes</p>
                            <h3 className="text-2xl font-bold">{pendingOrders}</h3>
                        </div>

                        <div className="rounded-2xl bg-blue-500/10 p-4 border border-blue-500/20">
                            <p className="flex items-center gap-1 text-sm text-blue-300"><CheckCircle2/>Confirmados</p>
                            <h3 className="text-2xl font-bold">{confirmedOrders}</h3>
                        </div>

                        <div className="rounded-2xl bg-green-500/10 p-4 border border-green-500/20">
                            <p className="flex items-center gap-1 text-sm text-green-300"><PackageCheck/>Entregues</p>
                            <h3 className="text-2xl font-bold">{deliveredOrders}</h3>
                        </div>

                        <div className="rounded-2xl bg-gray-500/10 p-4 border border-gray-500/20">
                            <p className="flex items-center gap-1 text-sm text-gray-300"><XCircle/>Fechados</p>
                            <h3 className="text-2xl font-bold">{closedOrders}</h3>
                        </div>

                        <div className="rounded-2xl bg-green-50/10 p-4 border border-green-500/20">
                            <p className="flex items-center gap-1 text-sm text-green-300"><DollarSign/>Faturação</p>
                            <h3 className="text-2xl font-bold">
                                {totalRevenue.toLocaleString("pt-PT")} CVE
                            </h3>
                        </div>

                    </div>

                    {loadingOrders ? (
                        <p className="mt-6 text-white/60">A carregar pedidos...</p>
                    ) : (
                        <div className="mt-4 grid gap-3 md:grid-cols-3">{/*alterando o numero de colunas das cards */}
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-6 h-[370px] flex flex-col"
                                >
                                    {/* HEADER */}
                                    <div className="flex items-center gap-2 mt-2">
                                        {STATUS_FLOW.map((step, index) => {
                                            const currentIndex = STATUS_FLOW.indexOf(order.status);

                                            const isActive = index <= currentIndex;

                                            return (
                                                <div key={step} className="flex items-center gap-2">
                                                    {/* CÍRCULO */}
                                                    <div
                                                        className={`h-3 w-3 rounded-full ${isActive ? "bg-amber-400" : "bg-white/20"
                                                            }`}
                                                    />

                                                    {/* LINHA */}
                                                    {index < STATUS_FLOW.length - 1 && (
                                                        <div
                                                            className={`h-[2px] w-6 ${index < currentIndex ? "bg-amber-400" : "bg-white/20"
                                                                }`}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex mt-4 justify-between items-center">
                                        <div>
                                            <p className="font-semibold">Pedido #{order.id}</p>
                                            <p className="text-sm text-white/60">{order.customerName}</p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            <div className="text-xs text-white/60 mt-1">
                                                {order.status}
                                            </div>
                                        </span>
                                    </div>

                                    {/* INFO */}
                                    <div className="mt-4 text-sm text-white/70">
                                        <p>{order.phone}</p>
                                        <p>{order.address}</p>
                                    </div>

                                    {/* ITENS */}
                                    <div className="mt-4 flex-1 overflow-y-auto pr-2 space-y-2">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>
                                                    {item.name} x{item.quantity}
                                                </span>
                                                <span>{Number(item.price).toLocaleString("pt-PT")} CVE</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* RODAPÉ FIXO */}
                                    <div className="mt-4 border-t border-white/10 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-white/60">Total</span>
                                            <span className="font-bold text-amber-300">
                                                {Number(order.total).toLocaleString("pt-PT")} CVE
                                            </span>
                                        </div>

                                        <div className="mt-4 flex gap-2 flex-wrap">
                                            {getAvailableActions(order.status).map((action) => (
                                                <button
                                                    key={action}
                                                    onClick={() => updateStatus(order.id, action)}
                                                    className={`text-xs px-2 py-1 rounded ${action === "CONFIRMADO"
                                                        ? "bg-blue-500"
                                                        : action === "ENTREGUE"
                                                            ? "bg-green-500"
                                                            : action === "CANCELADO"
                                                                ? "bg-red-500"
                                                                : "bg-gray-500"
                                                        }`}
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}