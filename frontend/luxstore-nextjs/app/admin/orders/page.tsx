"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function AdminOrdersPage() {
    const { token, isLoggedIn, isAdmin } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("TODOS");

    async function fetchOrders() {

        setLoading(true);

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
            setLoading(false);
        }
    }

    useEffect(() => {
        // Proteção da rota
        if (!isLoggedIn || !isAdmin) {
            router.push("/admin/login");
            return;
        }

        // Fetch só se estiver autorizado
        fetchOrders();

    }, [isLoggedIn, isAdmin, token, router]);

    if (!isLoggedIn || !isAdmin) {
        return null;
    }

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

    const filteredOrders =
        statusFilter === "TODOS"
            ? orders
            : orders.filter((order) => order.status === statusFilter);
    
    // ESTATÍSTICAS SIMPLES
    const totalOrders = filteredOrders .length;
    const pendingOrders = filteredOrders .filter(o => o.status === "PENDENTE").length;
    const confirmedOrders = filteredOrders .filter(o => o.status === "CONFIRMADO").length;
    const deliveredOrders = filteredOrders .filter(o => o.status === "ENTREGUE").length;
    const closedOrders = filteredOrders .filter(o => o.status === "FECHADO").length;
    const totalRevenue = filteredOrders .reduce((sum, o) => sum + (o.total || 0), 0);

    return (
        <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold">Pedidos</h1>

                <div className="mt-6 flex flex-wrap gap-3">
                    {["TODOS", "PENDENTE", "CONFIRMADO", "ENTREGUE", "FECHADO", "CANCELADO"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-full px-4 py-2 text-sm border transition ${statusFilter === status
                                ? "bg-amber-400 text-black border-amber-400"
                                : "border-white/15 text-white/70 hover:border-white/40"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-6 mt-6 mb-6">

                    <div className="rounded-2xl bg-white/5 p-4 border border-white/10 ">
                        <p className="text-sm text-white/60">Total Pedidos</p>
                        <h3 className="text-2xl font-bold">{totalOrders}</h3>
                    </div>

                    <div className="rounded-2xl bg-yellow-500/10 p-4 border border-yellow-500/20">
                        <p className="text-sm text-yellow-300">Pendentes</p>
                        <h3 className="text-2xl font-bold">{pendingOrders}</h3>
                    </div>

                    <div className="rounded-2xl bg-blue-500/10 p-4 border border-blue-500/20">
                        <p className="text-sm text-blue-300">Confirmados</p>
                        <h3 className="text-2xl font-bold">{confirmedOrders}</h3>
                    </div>

                    <div className="rounded-2xl bg-green-500/10 p-4 border border-green-500/20">
                        <p className="text-sm text-green-300">Entregues</p>
                        <h3 className="text-2xl font-bold">{deliveredOrders}</h3>
                    </div>

                    <div className="rounded-2xl bg-gray-500/10 p-4 border border-gray-500/20">
                        <p className="text-sm text-gray-300">Fechados</p>
                        <h3 className="text-2xl font-bold">{closedOrders}</h3>
                    </div>

                    <div className="rounded-2xl bg-green-500/10 p-4 border border-green-500/20">
                        <p className="text-sm text-green-300">Faturação</p>
                        <h3 className="text-2xl font-bold">
                            {totalRevenue.toLocaleString("pt-PT")} CVE
                        </h3>
                    </div>

                </div>

                {loading ? (
                    <p className="mt-6 text-white/60">A carregar pedidos...</p>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6 h-[370px] flex flex-col"
                            >
                                {/* HEADER */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">Pedido #{order.id}</p>
                                        <p className="text-sm text-white/60">{order.customerName}</p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
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
    );
}