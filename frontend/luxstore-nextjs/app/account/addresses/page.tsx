"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    Pencil,
    Plus,
    Star,
    Trash,
    X,
    Save,
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
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);

    // Função para carregar as moradas do utilizador
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

            setAddresses(sortAddresses(data));
        } catch (error) {
            console.error(error);
            setMessage("Não foi possível carregar as moradas.");
        } finally {
            setLoading(false);
        }
    }

    // Função para eliminar uma morada
    async function deleteAddress(id: number) {
        if (!token) {
            setMessage("Precisas de iniciar sessão para eliminar a morada.");
            return;
        }

        const confirmed = window.confirm(
            "Tem a certeza que deseja eliminar esta morada?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setMessage("");

            const response = await fetch(
                `http://localhost:8080/api/account/address/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Não foi possível eliminar a morada.");
            }

            setAddresses((current) =>
                current.filter((address) => address.id !== id)
            );

            alert("Morada eliminada com sucesso.");
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    }

    // Função para definir uma morada como principal
    async function setDefaultAddress(id: number) {
        if (!token) {
            setMessage("Precisas de iniciar sessão para definir a morada principal.");
            return;
        }

        try {
            setMessage("");

            const response = await fetch(
                `http://localhost:8080/api/account/address/${id}/default`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Não foi possível definir a morada como principal."
                );
            }

            const updatedAddress = await response.json();

            setAddresses((current) =>
                sortAddresses(
                    current.map((address) => ({
                        ...address,
                        default: address.id === updatedAddress.id,
                    }))
                )
            );

            alert("Morada principal atualizada com sucesso.");
        } catch (error) {
            console.error(error);
            setMessage(
                "Não foi possível definir a morada como principal."
            );
        }
    }

    // Função para salvar a morada editada
    async function saveEditedAddress(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!token || !editingAddress) {
            return;
        }

        try {
            setSavingEdit(true);
            setMessage("");

            const response = await fetch(
                `http://localhost:8080/api/account/address/${editingAddress.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingAddress),
                }
            );

            if (!response.ok) {
                throw new Error("Não foi possível atualizar a morada.");
            }

            const updatedAddress = await response.json();

            setAddresses((current) =>
                sortAddresses(
                    current.map((address) =>
                        address.id === updatedAddress.id
                            ? updatedAddress
                            : address
                    )
                )
            );

            setEditingAddress(null);
            alert("Morada atualizada com sucesso.");

        } catch (error) {
            console.error(error);
            alert("Não foi possível atualizar a morada.");
        } finally {
            setSavingEdit(false);
        }
    }

    // Função para ordenar as moradas, colocando a principal primeiro
    function sortAddresses(addresses: Address[]) {
        return [...addresses].sort((a, b) => {
            // A principal fica sempre primeiro
            if (a.default && !b.default) return -1;
            if (!a.default && b.default) return 1;

            // Depois mantém a ordem original da tabela
            return a.id - b.id;
        });
    }

    // Carregar as moradas quando o componente é montado ou quando o token muda
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
                            href="/account/addresses/new"
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
                                    <button
                                        type="button"
                                        onClick={() => setEditingAddress(address)}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                    >
                                        <Pencil size={15} />
                                        Editar
                                    </button>

                                    {/* ELIMINAR */}
                                    <button
                                        onClick={() => deleteAddress(address.id)}
                                        disabled={deletingId === address.id}
                                        className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-400/10"
                                    >
                                        <Trash size={15} />
                                        {deletingId === address.id
                                            ? "A eliminar..."
                                            : "Eliminar"}
                                    </button>

                                    {/* DEFINIR COMO PRINCIPAL */}
                                    {!address.default && (
                                        <button
                                            type="button"
                                            onClick={() => setDefaultAddress(address.id)}
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

                {/* MODAL EDITAR MORADA */}
                {editingAddress && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 py-8 backdrop-blur-sm"
                        onMouseDown={(e) => {
                            if (e.target === e.currentTarget) {
                                setEditingAddress(null);
                            }
                        }}
                    >
                        <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 shadow-2xl">

                            {/* CABEÇALHO DO MODAL */}
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        Editar morada
                                    </h2>

                                    <p className="mt-1 text-sm text-white/50">
                                        Atualize os dados do destinatário e da entrega.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setEditingAddress(null)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* FORMULÁRIO */}
                            <form
                                onSubmit={saveEditedAddress}
                                className="max-h-[75vh] overflow-y-auto p-6"
                            >
                                <div className="space-y-6">

                                    {/* DESTINATÁRIO */}
                                    <div>
                                        <p className="mb-4 text-sm font-semibold text-white">
                                            Dados do destinatário
                                        </p>

                                        <div className="grid gap-5 md:grid-cols-2">

                                            {/* NOME */}
                                            <div className="md:col-span-2">
                                                <label
                                                    htmlFor="edit-recipientName"
                                                    className="mb-2 block text-sm font-medium text-white/80"
                                                >
                                                    Nome completo
                                                </label>

                                                <input
                                                    id="edit-recipientName"
                                                    type="text"
                                                    value={editingAddress.recipientName}
                                                    onChange={(e) =>
                                                        setEditingAddress({
                                                            ...editingAddress,
                                                            recipientName: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Ex.: Maria Silva"
                                                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                                />
                                            </div>

                                            {/* TELEFONE */}
                                            <div className="md:col-span-2">
                                                <label
                                                    htmlFor="edit-recipientPhone"
                                                    className="mb-2 block text-sm font-medium text-white/80"
                                                >
                                                    Telemóvel
                                                </label>

                                                <input
                                                    id="edit-recipientPhone"
                                                    type="tel"
                                                    value={editingAddress.recipientPhone}
                                                    onChange={(e) =>
                                                        setEditingAddress({
                                                            ...editingAddress,
                                                            recipientPhone: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Ex.: 991 22 33"
                                                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ENDEREÇO */}
                                    <div>
                                        <p className="mb-4 text-sm font-semibold text-white">
                                            Dados da entrega
                                        </p>

                                        <div className="space-y-5">

                                            {/* MORADA */}
                                            <div>
                                                <label
                                                    htmlFor="edit-address"
                                                    className="mb-2 block text-sm font-medium text-white/80"
                                                >
                                                    Morada
                                                </label>

                                                <input
                                                    id="edit-address"
                                                    type="text"
                                                    value={editingAddress.address}
                                                    onChange={(e) =>
                                                        setEditingAddress({
                                                            ...editingAddress,
                                                            address: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Ex.: Achada Santo António, Rua 10"
                                                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                                />
                                            </div>

                                            {/* CIDADE + CÓDIGO POSTAL */}
                                            <div className="grid gap-5 md:grid-cols-2">

                                                <div>
                                                    <label
                                                        htmlFor="edit-city"
                                                        className="mb-2 block text-sm font-medium text-white/80"
                                                    >
                                                        Cidade
                                                    </label>

                                                    <input
                                                        id="edit-city"
                                                        type="text"
                                                        value={editingAddress.city}
                                                        onChange={(e) =>
                                                            setEditingAddress({
                                                                ...editingAddress,
                                                                city: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Ex.: Praia"
                                                        className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="edit-postalCode"
                                                        className="mb-2 block text-sm font-medium text-white/80"
                                                    >
                                                        Código Postal
                                                    </label>

                                                    <input
                                                        id="edit-postalCode"
                                                        type="text"
                                                        value={editingAddress.postalCode}
                                                        onChange={(e) =>
                                                            setEditingAddress({
                                                                ...editingAddress,
                                                                postalCode: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Ex.: 7600"
                                                        className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                                    />
                                                </div>

                                            </div>

                                            {/* PAÍS */}
                                            <div>
                                                <label
                                                    htmlFor="edit-country"
                                                    className="mb-2 block text-sm font-medium text-white/80"
                                                >
                                                    País
                                                </label>

                                                <input
                                                    id="edit-country"
                                                    type="text"
                                                    value={editingAddress.country}
                                                    onChange={(e) =>
                                                        setEditingAddress({
                                                            ...editingAddress,
                                                            country: e.target.value,
                                                        })
                                                    }
                                                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/50"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* AÇÕES */}
                                <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-5">

                                    <button
                                        type="button"
                                        onClick={() => setEditingAddress(null)}
                                        disabled={savingEdit}
                                        className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={savingEdit}
                                        className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Save size={17} />

                                        {savingEdit
                                            ? "A guardar..."
                                            : "Guardar alterações"}
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}