"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import router from "next/router";
import { useAuth } from "@/context/AuthContext";
import {
    MapPin,
    Pencil,
    Plus,
    Star,
} from "lucide-react";

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


export default function CheckoutPage() {
    const { token, isLoggedIn, isAdmin } = useAuth();
    const { items, clearCart } = useCart();
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const total = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    const whatsappLink = `https://wa.me/2389200910?text=${generateWhatsAppMessage()}`;

    // CARREGAR MORADAS DO UTILIZADOR AUTENTICADO
    async function loadAddresses() {
        if (!token) {
            setLoadingAddresses(false);
            return;
        }

        try {
            setLoadingAddresses(true);

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

            const data: Address[] = await response.json();

            setAddresses(data);

            const defaultAddress = data.find(
                (item) => item.default === true
            );

            if (defaultAddress) {
                selectAddress(defaultAddress);
            }
        } catch (error) {
            console.error(error);
            setError("Não foi possível carregar as suas moradas.");
        } finally {
            setLoadingAddresses(false);
        }
    }

    // Função para selecionar uma morada
    function selectAddress(addressData: Address) {
        setSelectedAddress(addressData);

        setName(addressData.recipientName || "");
        setPhone(addressData.recipientPhone || "");

        const fullAddress = [
            addressData.address,
            addressData.city,
            addressData.postalCode,
            addressData.country,
        ]
            .filter(Boolean)
            .join(", ");

        setAddress(fullAddress);
    }

    // ENVIAR PEDIDO PARA BACKEND
    async function handleSubmitOrder() {

        if (!validateForm()) return;

        setLoading(true);

        try {
            const orderData = {
                customerName: name,
                phone,
                address,
                total,
                items: items.map((item) => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            };

            const res = await fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!res.ok) throw new Error("Erro ao criar pedido");

            clearCart();
            clearForm();
            setSuccess(true);

            alert("Pedido realizado com sucesso! 🎉");

        } catch (error) {
            console.error(error);
            setError("Erro ao enviar pedido");
        } finally {
            setLoading(false);
        }
    }

    // Função para gerar a mensagem do WhatsApp
    function generateWhatsAppMessage() {
        const productsText = items
            .map(
                (item) =>
                    `- ${item.name} | Qtd: ${item.quantity} | ${item.price}`
            )
            .join("\n");

        return `Olá, quero fazer um pedido:%0A%0A
        Nome: ${name}%0A
        Telefone: ${phone}%0A
        Morada: ${address}%0A%0A
        Produtos:%0A${productsText}%0A%0A
        Total: ${total.toLocaleString("pt-PT")} CVE`;
    }

    // CARREGAR MORADAS QUANDO O TOKEN MUDAR
    useEffect(() => {
        loadAddresses();
    }, [token]);


    return (
        <main className="min-h-screen bg-neutral-950 text-white">

            <section className="mx-auto max-w-7xl px-6 py-12">
                <Link
                    href="/cart"
                    className="text-sm text-white/60 hover:text-amber-300"
                >
                    ← Voltar ao carrinho
                </Link>

                <div className="mt-6">
                    <h1 className="text-4xl font-bold">Finalizar pedido</h1>
                    <p className="text-white/60 mt-2">
                        Confirme os dados de entrega e os artigos da sua encomenda.
                    </p>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-2">
                    {/* FORMULÁRIO */}
                    <div className="space-y-6">
                        {loadingAddresses ? (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                <p className="text-sm text-white/50">
                                    A carregar a sua morada...
                                </p>
                            </div>
                        ) : selectedAddress ? (
                            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Dados de entrega
                                    </h2>

                                    <p className="mt-1 text-sm text-white/50">
                                        A morada utilizada para esta encomenda.
                                    </p>
                                </div>
                                <div className="flex items-start justify-between gap-4 mt-6 border-t border-white/10 pt-4 flex justify-between font-bold">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                                            <MapPin size={21} />
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-white">
                                                    {selectedAddress.recipientName}
                                                </p>

                                                {selectedAddress.default && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300">
                                                        <Star size={12} />
                                                        Principal
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-3 space-y-1 text-sm text-white/65">
                                                <p className="font-medium text-white/90">
                                                    {selectedAddress.address}
                                                </p>

                                                <p>
                                                    {[
                                                        selectedAddress.city,
                                                        selectedAddress.postalCode,
                                                        selectedAddress.country,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>

                                                <p>
                                                    {selectedAddress.recipientPhone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {addresses.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAddressModal(true)}
                                            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                        >
                                            <Pencil size={15} />
                                            Alterar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : addresses.length > 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/50">
                                        <MapPin size={21} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Escolha uma morada de entrega
                                        </h3>

                                        <p className="mt-1 text-sm text-white/50">
                                            Tem moradas guardadas, mas nenhuma está definida
                                            como principal.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
                                    >
                                        <MapPin size={16} />
                                        Escolher morada
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/50">
                                        <MapPin size={21} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Ainda não tem uma morada
                                        </h3>

                                        <p className="mt-1 text-sm text-white/50">
                                            Adicione uma morada de entrega para continuar
                                            com a sua encomenda.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/account/addresses/new"
                                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
                                >
                                    <Plus size={17} />
                                    Adicionar morada
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RESUMO */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-2xl font-bold">Resumo do pedido</h2>

                        <div className="mt-6 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {item.name} x{item.quantity}
                                    </span>
                                    <span>{item.price.toLocaleString()} CVE</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 border-t border-white/10 pt-4 flex justify-between font-bold">
                            <span>Total</span>
                            <span>{total.toLocaleString("pt-PT")} CVE</span>
                        </div>
                        {error && (
                            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}
                        <div className="mt-10 flex gap-4 flex-col sm:flex-row">
                            {/* NOVO BOTÃO BACKEND */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={loading}
                                className={`w-full rounded-full px-6 py-3 font-semibold transition ${loading
                                    ? "bg-gray-400 text-black cursor-not-allowed"
                                    : "bg-amber-400 text-black hover:scale-[1.02]"
                                    }`}
                            >
                                {loading ? "A processar..." : "Finalizar Pedido"}
                            </button>

                            <button
                                onClick={() => {
                                    if (!validateForm()) return;

                                    setLoading(true);

                                    setTimeout(() => {
                                        window.open(whatsappLink, "_blank");
                                        setLoading(false);
                                        setSuccess(true);
                                        clearForm();
                                    }, 800);
                                }}
                                disabled={loading}
                                className={`w-full rounded-full px-6 py-3 font-semibold transition ${loading
                                    ? "bg-gray-400 text-black cursor-not-allowed"
                                    : "bg-green-500 text-black hover:scale-[1.02]"
                                    }`}
                            >
                                {loading ? "A processar..." : "Finalizar via WhatsApp"}
                            </button>
                        </div>

                        {success && (
                            <div className="mt-4 text-green-400 text-sm">
                                Pedido pronto! 👌
                            </div>
                        )}

                    </div>
                </div>
            </section>
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-neutral-900 p-6 shadow-2xl">

                        {/* HEADER DO MODAL */}
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Escolher morada
                                </h2>

                                <p className="mt-1 text-sm text-white/50">
                                    Selecione a morada que pretende utilizar nesta encomenda.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddressModal(false)}
                                className="rounded-full p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* LISTA DE MORADAS */}
                        <div className="mt-6 space-y-3">
                            {addresses.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        selectAddress(item);
                                        setShowAddressModal(false);
                                    }}
                                    className={`w-full rounded-2xl border p-4 text-left transition ${selectedAddress?.id === item.id
                                            ? "border-amber-400/40 bg-amber-400/[0.06]"
                                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        
                                        {/* ÍCONE DE LOCALIZAÇÃO */}
                                        <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                            selectedAddress
                                                ? "bg-amber-400/10 text-amber-300"
                                                : "bg-white/5 text-white/50"
                                        }`}
                                    >
                                        <MapPin size={20} />
                                    </div>

                                        {/* DETALHES DA MORADA */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-white">
                                                    {item.recipientName}
                                                </p>

                                                {item.default && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-300">
                                                        <Star size={11} />
                                                        Principal
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 text-sm text-white/70">
                                                {item.address}
                                            </p>

                                            <p className="mt-1 text-sm text-white/50">
                                                {[
                                                    item.city,
                                                    item.postalCode,
                                                    item.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>

                                            <p className="mt-1 text-sm text-white/50">
                                                {item.recipientPhone}
                                            </p>
                                        </div>

                                        {/* SELECIONADA*/}
                                        {selectedAddress?.id === item.id && (
                                            <div className="text-amber-300">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* BOTÃO PARA ADICIONAR NOVA MORADA */}
                        <div className="mt-6 border-t border-white/10 pt-5">
                            <Link
                                href="/account/addresses/new"
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                            >
                                <Plus size={17} />
                                Adicionar nova morada
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );

    function validateForm() {
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (items.length === 0) {
            setError("O carrinho está vazio.");
            return false;
        }

        if (!selectedAddress) {
            setError("Selecione uma morada de entrega para continuar.");
            return false;
        }

        if (!name.trim()) {
            setError("A morada de entrega não tem um nome de destinatário.");
            return false;
        }

        if (!phone.trim()) {
            setError("A morada de entrega não tem um telefone.");
            return false;
        }

        if (phone.length < 7) {
            setError("Número de telefone inválido.");
            return false;
        }

        if (!address.trim()) {
            setError("A morada de entrega está incompleta.");
            return false;
        }

        setError("");
        return true;
    }

    function clearForm() {
        setError("");
    }
}