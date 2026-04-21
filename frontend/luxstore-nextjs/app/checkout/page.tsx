"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import router from "next/router";


export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const total = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    const whatsappLink = `https://wa.me/2389200910?text=${generateWhatsAppMessage()}`;

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
                        Preencha os seus dados para concluir a compra.
                    </p>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-2">
                    {/* FORMULÁRIO */}
                    <div className="space-y-6">
                        <div>
                            <input
                                id="name"
                                type="text"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`mt-2 w-full rounded-xl px-4 py-3 bg-white/5 border ${error && !name ? "border-red-500" : "border-white/10"
                                    }`}
                            />
                        </div>

                        <div>
                            <input
                                id="phone"
                                type="text"
                                placeholder="Telefone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={`mt-2 w-full rounded-xl px-4 py-3 bg-white/5 border ${error && !phone ? "border-red-500" : "border-white/10"
                                    }`}
                            />
                        </div>

                        <div>
                            <textarea
                                id="address"
                                placeholder="Morada"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={`mt-2 w-full rounded-xl px-4 py-3 bg-white/5 border ${error && !address ? "border-red-500" : "border-white/10"
                                    }`}
                            />
                        </div>
                    </div>

                    {/* 🛒 RESUMO */}
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
                            className={`w-full rounded-full px-6 py-3 font-semibold transition ${
                                loading
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
                            className={`w-full rounded-full px-6 py-3 font-semibold transition ${
                                loading
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
        </main>
    );

    function validateForm() {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (items.length === 0) {
            setError("O carrinho está vazio.");
            return false;
        }

        if (!name.trim()) {
            setError("Informe o seu nome.");
            document.getElementById("name")?.focus();
            return false;
        }

        if (!phone.trim()) {
            setError("Informe o seu telefone.");
            document.getElementById("phone")?.focus();
            return false;
        }

        if (phone.length < 7) {
            setError("Número de telefone inválido.");
            document.getElementById("phone")?.focus();
            return false;
        }

        if (!address.trim()) {
            setError("Informe a sua morada.");
            document.getElementById("address")?.focus();
            return false;
        }

        setError("");
        return true;
    }

    function clearForm() {
        setName("");
        setPhone("");
        setAddress("");
        setError("");
    }
}