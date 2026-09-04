"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, MapPin, Save } from "lucide-react";

export default function AddressPage() {
    const { token } = useAuth();

    const [form, setForm] = useState({
        address: "",
        city: "",
        postalCode: "",
        country: "",
        recipientName: "",
        recipientPhone: "",
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!token) {
            setMessage("Precisas de iniciar sessão para guardar a morada.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
             const response = await fetch(
                "http://localhost:8080/api/account/address",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...form,
                        default: true,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Não foi possível guardar a morada.");
            }

            await response.json();

            setMessage("Morada guardada com sucesso.");

        } catch (error) {
            console.error(error);
            setMessage("Ocorreu um erro ao guardar a morada.");
        } finally {
            setSaving(false);
        }

        console.log("Morada:", form);

    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white px-5 py-6">
            <div className="mx-auto max-w-4xl">

                {/* CABEÇALHO */}
                <div className="mb-8">
                    <Link
                        href="/account"
                        className="mb-5 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Voltar para área do cliente
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <MapPin
                                className="text-amber-300"
                                size={28}
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold">
                                Morada
                            </h1>

                            <p className="mt-1 text-sm text-white/60">
                                Gerencie a morada usada para entrega.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FORMULÁRIO */}
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">

                    <form
                        onSubmit={handleSave}
                        className="space-y-6"
                    >

                        {/* MORADA */}
                        <div>
                            <label
                                htmlFor="address"
                                className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                            >
                                <MapPin size={16} />
                                Morada
                            </label>

                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Ex.: Achada Santo António, Rua 10"
                                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                            />
                        </div>

                        {/* NOME + TELEFONE */}
                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="recipientName"
                                    className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                                >
                                    <MapPin size={16} />
                                    Nome do Recipiente
                                </label>

                                <input
                                    id="recipientName"
                                    name="recipientName"
                                    type="text"
                                    value={form.recipientName}
                                    onChange={handleChange}
                                    placeholder="Ex.: Pedro Silva"
                                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="recipientPhone"
                                    className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                                >
                                    <MapPin size={16} />
                                    Telefone do Recipiente
                                </label>

                                <input
                                    id="recipientPhone"
                                    name="recipientPhone"
                                    type="text"
                                    value={form.recipientPhone}
                                    onChange={handleChange}
                                    placeholder="Ex.: 912 345 6"
                                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                />
                            </div>

                            {/* CIDADE + CÓDIGO POSTAL */}
                            <div>
                                <label
                                    htmlFor="city"
                                    className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                                >
                                    <MapPin size={16} />
                                    Cidade
                                </label>

                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Ex.: Praia"
                                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="postalCode"
                                    className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                                >
                                    <MapPin size={16} />
                                    Código Postal
                                </label>

                                <input
                                    id="postalCode"
                                    name="postalCode"
                                    type="text"
                                    value={form.postalCode}
                                    onChange={handleChange}
                                    placeholder="Ex.: 7600"
                                    className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-amber-400/50"
                                />
                            </div>

                        </div>

                        {/* PAÍS */}
                        <div>
                            <label
                                htmlFor="country"
                                className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                            >
                                <MapPin size={16} />
                                País
                            </label>

                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={form.country}
                                onChange={handleChange}
                                placeholder="Ex.: Cabo Verde"
                                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/50"
                            />
                        </div>

                        {message && (
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                                {message}
                            </div>
                        )}

                        {/* BOTÃO */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={17} />

                                {saving
                                    ? "A guardar..."
                                    : "Guardar morada"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}