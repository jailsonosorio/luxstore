"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    VenusAndMars,
    BadgeCheck,
    Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {

    const router = useRouter();
    const { token, isLoggedIn } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);

    const [form, setForm] = useState({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        gender: "",
        birthDate: "",
        profileImage: "",
        memberId: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });

    useEffect(() => {

        if (!token) return;

        fetch("http://localhost:8080/api/user/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {

                setForm({
                    username: data.username || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    fullName: data.fullName || "",
                    email: data.email || "",
                    postalCode: data.postalCode || "",
                    gender: data.gender || "",
                    birthDate: data.birthDate || "",
                    profileImage: data.profileImage || "",
                    memberId: data.memberId || "",
                });
            })
            .finally(() => setLoading(false));

    }, [token]);

    async function handleSave() {

        setSaving(true);

        try {

            const res = await fetch(
                "http://localhost:8080/api/user/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );

            if (!res.ok) {
                throw new Error("Erro ao atualizar perfil");
            }

            alert("Perfil atualizado com sucesso!");

        } catch (err) {

            console.error(err);

        } finally {

            setSaving(false);
        }
    }

    async function handlePhotoUpload(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        const file = e.target.files?.[0];

        if (!file) return;

        setUploading(true);

        try {

            const formData = new FormData();

            formData.append("file", file);
            const res = await fetch(
                "http://localhost:8080/api/user/profile/upload-photo",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!res.ok) {
                throw new Error("Erro ao enviar foto");
            }

            const updatedUser = await res.json();

            setForm(prev => ({
                ...prev,
                profileImage: updatedUser.profileImage,
            }));
            alert("Foto atualizada com sucesso!");

        } catch (err) {

            console.error(err);

        } finally {

            setUploading(false);
        }
    }

    async function handleChangePassword() {

        try {

            const res = await fetch(
                "http://localhost:8080/api/user/profile/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(passwordForm),
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            alert("Password alterada com sucesso!");

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
            });

        } catch (err) {

            alert(err.message);
            console.error(err);
        }
    }

    if (loading) {

        return (
            <main className="min-h-screen bg-neutral-950 text-white p-10">
                A carregar perfil...
            </main>
        );
    }

    if (!isLoggedIn) {
        router.push("/auth/login");
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white px-5 py-6">

            <div className="mx-auto max-w-4xl">

                {/* HEADER */}
                <div className="mb-8">

                    <button
                        onClick={() => router.push("/account")}
                        className="mb-5 flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Voltar para área do cliente
                    </button>

                    <h1 className="text-4xl font-bold">
                        Meu Perfil
                    </h1>

                    <p className="mt-2 text-white/60">
                        Atualize os seus dados pessoais.
                    </p>
                </div>

                {/* PROFILE HEADER */}
                <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">

                    <div className="flex flex-col items-center gap-5 md:flex-row">

                        {/* FOTO */}
                        <div className="flex flex-col items-center gap-3">

                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/20">

                                {form.profileImage ? (

                                    <img
                                        src={`http://localhost:8080${form.profileImage}`}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />

                                ) : (

                                    <span className="text-3xl font-bold text-white/40">
                                        {form.username?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {editing && (

                                <label className="cursor-pointer rounded-full bg-white/10 px-4 py-2 text-xs hover:bg-white/20 transition">

                                    {uploading
                                        ? "Enviando..."
                                        : "Alterar foto"}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handlePhotoUpload}
                                    />
                                </label>
                            )}
                        </div>

                        {/* INFO */}
                        <div>

                            <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
                                <User size={25} />
                                {form.fullName || form.username}
                            </h1>

                            {/*<p className="mt-2 text-white/60">
                                Membro LuxStore
                            </p>*/}

                            <p className="mt-1 flex items-center gap-2 text-sm text-amber-300">
                                <BadgeCheck size={20} />
                                ID de Membro #{form.memberId || "não é membro"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CARD */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

                    <div className="space-y-6">

                        {/* USERNAME */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                    <User size={16} />
                                    Username
                                </label>

                                <input
                                    type="text"
                                    value={form.username}
                                    disabled
                                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white/40 outline-none"
                                />
                            </div>

                            {/* FULL NAME */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                    <User size={16} />
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            fullName: e.target.value,
                                        })
                                    }
                                    disabled={!editing}
                                    className={`w-full rounded-2xl border border-white/10 px-4 py-3 outline-none ${editing
                                        ? "bg-black/20"
                                        : "bg-white/5 text-white/50"
                                        }`}
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                    <Mail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    disabled={!editing}
                                    className={`w-full rounded-2xl border border-white/10 px-4 py-3 outline-none ${editing
                                        ? "bg-black/20"
                                        : "bg-white/5 text-white/50"
                                        }`}
                                />
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                    <MapPin size={16} />
                                    Morada
                                </label>

                                <textarea
                                    value={form.address}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            address: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    className={`w-full rounded-2xl border border-white/10 px-4 py-3 outline-none ${editing
                                        ? "bg-black/20"
                                        : "bg-white/5 text-white/50"
                                        }`}
                                />
                            </div>

                            {/*Gender*/}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                    <VenusAndMars size={16} />
                                    Gênero
                                </label>
                                <select
                                    value={form.gender}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            gender: e.target.value,
                                        })
                                    }
                                    disabled={!editing}
                                    className={`w-full rounded-2xl border border-white/10 px-4 py-3 outline-none ${editing
                                        ? "bg-black/20"
                                        : "bg-white/5 text-white/50"
                                        }`}
                                >
                                    <option value="">Selecione</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>

                            {/*Birth Date*/}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                    <Calendar size={16} />
                                    Data de Nascimento
                                </label>
                                <input
                                    type="date"
                                    value={form.birthDate}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            birthDate: e.target.value,
                                        })
                                    }
                                    disabled={!editing}
                                    className={`w-full rounded-2xl border border-white/10 px-4 py-3 outline-none ${editing
                                        ? "bg-black/20"
                                        : "bg-white/5 text-white/50"
                                        }`}
                                />
                            </div>

                            {/* PHONE */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                    <Phone size={16} />
                                    Telefone
                                </label>

                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value,
                                        })
                                    }
                                    disabled={!editing}
                                    className={`w-full rounded-2xl border border-white/10 px-4 py-3 outline-none ${editing
                                        ? "bg-black/20"
                                        : "bg-white/5 text-white/50"
                                        }`}
                                />
                            </div>

                            {/* POSTAL CODE */}
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                    <MapPin size={16} />
                                    Código Postal
                                </label>
                                <input
                                    type="text"
                                    value={form.postalCode}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            postalCode: e.target.value,
                                        })
                                    }
                                    disabled={!editing}
                                    className={`w-full rounded-2xl border border-white/10 px-4 py-3 outline-none ${editing
                                        ? "bg-black/20"
                                        : "bg-white/5 text-white/50"
                                        }`}
                                />
                            </div>
                        </div>

                        {/*MEMBER ID*/}
                        <div>
                            <label className="mb-2 mt-6 flex items-center gap-2 text-sm text-white/60">
                                <BadgeCheck size={16} />
                                ID de Membro
                            </label>
                            <input
                                type="text"
                                value={form.memberId || "não é membro"}
                                disabled
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/50 outline-none"
                            />
                        </div>

                        {/* BUTTON */}
                        <div className="mb-6 flex flex-wrap gap-3">

                            <button
                                onClick={() => setEditing(!editing)}
                                className="rounded-full bg-white/10 px-5 py-2 text-sm hover:bg-white/20 transition"
                            >
                                {editing
                                    ? "Cancelar edição"
                                    : "Editar dados"}
                            </button>

                            <button
                                onClick={() => setPasswordModalOpen(true)}
                                className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-300 transition"
                            >
                                Alterar password
                            </button>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300 transition"
                        >

                            <Save size={18} />

                            {saving
                                ? "Guardando..."
                                : "Guardar alterações"}
                        </button>
                    </div>
                </div>
            </div>
            {/* PASSWORD MODAL */}
            {passwordModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-950 p-8">

                        {/* HEADER */}
                        <div className="mb-6">

                            <h2 className="text-2xl font-bold">
                                Alterar Password
                            </h2>

                            <p className="mt-2 text-sm text-white/60">
                                Atualize sua password de acesso.
                            </p>
                        </div>

                        {/* FORM */}
                        <div className="space-y-5">

                            {/* PASSWORD ATUAL */}
                            <div>

                                <label className="mb-2 block text-sm text-white/60">
                                    Password atual
                                </label>

                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) =>
                                        setPasswordForm({
                                            ...passwordForm,
                                            currentPassword: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                                />
                            </div>

                            {/* NOVA PASSWORD */}
                            <div>

                                <label className="mb-2 block text-sm text-white/60">
                                    Nova password
                                </label>

                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) =>
                                        setPasswordForm({
                                            ...passwordForm,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                                />
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-3 pt-4">

                                <button
                                    onClick={() => setPasswordModalOpen(false)}
                                    className="flex-1 rounded-full bg-white/10 py-3 text-sm hover:bg-white/20 transition"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={async () => {

                                        await handleChangePassword();

                                        setPasswordModalOpen(false);
                                    }}
                                    className="flex-1 rounded-full bg-amber-400 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main >
    );
}