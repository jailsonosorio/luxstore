"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    Pencil,
    Plus,
    Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Address = {
    id: number;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    default: boolean;
    recipientName: string;
    recipientPhone: string;
};

export default function AddressPage() {
    const { token } = useAuth();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    async function loadAddresses() {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                "http://localhost:8080/api/account/address",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Não foi possível carregar as moradas.");
            }

            const data = await response.json();

            setAddresses(data);
        } catch (error) {
            console.error(error);
            setMessage("Não foi possível carregar as moradas.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAddresses();
    }, [token]);

    return (
        <main className="min-h-screen bg-neutral-950 px-5 py-6 text-white">
            <div className="mx-auto max-w-5xl">

                {/* CABEÇALHO */}
                <div className="mb-8">
                    <Link
                        href="/account"
                        className="mb-5 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Voltar para área do cliente
                    </Link>

                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                <MapPin
                                    className="text-amber-300"
                                    size={28}
                                />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold">
                                    Minhas moradas
                                </h1>

                                <p className="mt-1 text-sm text-white/60">
                                    Gerencie as moradas utilizadas para as suas entregas.
                                </p>
                            </div>
                        </div>

                        {/* NOVA MORADA */}
                        <Link
                            href="/account/addresses/new"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:scale-[1.02] hover:bg-amber-300"
                        >
                            <Plus size={18} />
                            Adicionar nova morada
                        </Link>
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
                        <p className="text-sm text-white/50">
                            A carregar moradas...
                        </p>
                    </div>
                )}

                {/* ERRO */}
                {!loading && message && (
                    <div className="rounded-[2rem] border border-red-400/20 bg-red-400/5 p-6 text-sm text-red-300">
                        {message}
                    </div>
                )}

                {/* SEM MORADAS */}
                {!loading && !message && addresses.length === 0 && (
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                            <MapPin
                                size={28}
                                className="text-white/40"
                            />
                        </div>

                        <h2 className="text-xl font-semibold">
                            Ainda não tem nenhuma morada
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
                            Adicione uma morada para tornar o processo de entrega
                            mais rápido e simples.
                        </p>

                        <Link
                            href="/account/address/new"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
                        >
                            <Plus size={18} />
                            Adicionar morada
                        </Link>
                    </div>
                )}

                {/* LISTA DE MORADAS */}
                {!loading && addresses.length > 0 && (
                    <div className="grid gap-5">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`relative rounded-[2rem] border p-6 transition ${address.default
                                        ? "border-amber-400/30 bg-amber-400/[0.04]"
                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                            >
                                {/* TOPO DO CARD */}
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${address.default
                                                ? "bg-amber-400/10 text-amber-300"
                                                : "bg-white/5 text-white/50"
                                                }`}
                                        >
                                            <MapPin size={21} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {address.recipientName}
                                            </p>

                                            {address.default && (
                                                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-300">
                                                    <Star size={12} />
                                                    Principal
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* DADOS DA MORADA */}
                                <div className="space-y-1.5 text-sm text-white/65">
                                    <p className="font-medium text-white">
                                        {address.address}
                                    </p>

                                    <p>
                                        {[
                                            address.city,
                                            address.postalCode,
                                            address.country,
                                            address.recipientPhone,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>

                                </div>

                                {/* AÇÕES */}
                                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">

                                    {/* EDITAR */}
                                    <Link
                                        href={`/account/address/${address.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                    >
                                        <Pencil size={15} />
                                        Editar
                                    </Link>

                                    {/* DEFINIR COMO PRINCIPAL */}
                                    {!address.default && (
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-400/10"
                                        >
                                            <Star size={15} />
                                            Definir como principal
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}