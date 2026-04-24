"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SquarePlus, SquarePen, SquareX, Save, Trash } from "lucide-react";
import { normalizeText } from "@/utils/search";

export default function AdminCategoriesPage() {
    const { isLoggedIn, isAdmin, loading, token } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        image: "",
        code: "",
        active: true,
        destaque: false,
    });

    const filter = searchParams.get("filter") || "TODOS";
    const normalizedSearch = normalizeText(search.trim());

    const filteredCategories = categories.filter((category) => {

        // 🔥 FILTRO DESTAQUE
        let matchFilter = true;

        if (filter === "DESTAQUE") {
            matchFilter = category.destaque === true;
        } else if (filter === "SEM_DESTAQUE") {
            matchFilter = category.destaque === false;
        }

        // 🔥 PESQUISA
        const matchSearch =
            normalizeText(category.name || "").includes(normalizedSearch) ||
            normalizeText(category.description || "").includes(normalizedSearch)
            normalizeText(category.code || "").includes(normalizedSearch);

        // 🔥 RESULTADO FINAL
        return matchFilter && matchSearch;
    });

    const filteredCategories2 = categories.filter((category) => {
        const text = normalizeText(search);

        return (
            normalizeText(category.name).includes(text) ||
            normalizeText(category.description || "").includes(text) ||
            normalizeText(category.code || "").includes(text)
        );
    });

    // FUNÇÃO PARA CRIAR CATEGORIA
    async function handleCreateCategory() {
        console.log("clicou criar"); // 👈 adiciona isto
        try {
            const res = await fetch("http://localhost:8080/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...form, image: form.image }),
            });

            if (!res.ok) throw new Error("Erro ao criar categoria");

            setShowModal(false);
            setForm({ name: "", description: "", image: "", code: "", active: true, destaque: false });

            fetchCategories(); // atualiza lista
        } catch (err) {
            console.error(err);
        }
    }
    // FUNÇÃO PARA APAGAR CATEGORIA
    async function handleDeleteCategory(id: number) {
        if (!confirm("Tens certeza que queres apagar esta categoria?")) return;

        try {
            await fetch(`http://localhost:8080/api/categories/${id}`, {
                method: "DELETE",
            });

            fetchCategories(); // atualiza lista
        } catch (err) {
            console.error(err);
        }
    }

    // FUNÇÃO PARA ATUALIZAR CATEGORIA
    async function handleUpdateCategory() {
        try {
            await fetch(`http://localhost:8080/api/categories/${editingCategory.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...form, image: form.image }),
            });

            setShowModal(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    }

    // FUNÇÃO PARA BUSCAR CATEGORIAS
    async function fetchCategories() {
        try {
            const res = await fetch("http://localhost:8080/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCategories(false);
        }
    }

    // FUNÇÃO PARA UPLOAD DE IMAGEM
    async function handleUpload(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8080/api/upload", {
            method: "POST",
            body: formData,
        });

        const url = await res.text();

        setForm((prev) => ({
            ...prev,
            image: url,
        }));
    }

    // VERIFICA SE O USUÁRIO ESTÁ LOGADO E É ADMIN, SE NÃO, REDIRECIONA PARA LOGIN
    useEffect(() => {
        if (loading) return;

        if (!isLoggedIn || !isAdmin) {
            router.push("/auth/login");
            return;
        }

        fetchCategories();
    }, [loading, isLoggedIn, isAdmin]);

    if (loading) return null;

    // SE O USUÁRIO NÃO ESTIVER LOGADO OU NÃO FOR ADMIN, NÃO MOSTRA NADA
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Categorias</h1>

            {/* BOTÃO CRIAR */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                    onClick={() => setShowModal(true)}
                    className="flex bg-amber-400 text-black px-2 py-2 gap-1 rounded-lg font-semibold hover:scale-[1.02] transition"
                ><SquarePlus />
                    Criar
                </button>
                {/* PESQUISA */}
                <div className="relative w-full lg:w-[400px] shadow-lg shadow-black/20 rounded-full">
                    <input
                        type="text"
                        placeholder="Pesquisar categorias..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-10 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-amber-400/40 focus:bg-white/15 transition"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 ">
                        🔍
                    </span>
                </div>
            </div>

            {/* LISTA */}
            {loadingCategories ? (
                <p className="text-white/60">A carregar categorias...</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                            <img
                                src={`http://localhost:8080${category.image}`}
                                alt={category.name}
                                className="h-40 w-full object-cover rounded-lg mb-3"
                            />

                            <h3 className="font-semibold text-lg">{category.name}</h3>

                            <p className="text-sm text-white/60 mt-1">
                                {category.description}
                            </p>

                            {/*<p className="text-amber-300 font-bold mt-2">
                                {category.code}
                            </p>*/}



                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditingCategory(category);
                                        setForm({
                                            name: category.name,
                                            description: category.description,
                                            image: category.image,
                                            code: category.code,
                                            active: category.active,
                                            destaque: category.destaque,
                                        });
                                        setShowModal(true);
                                    }}
                                    className="text-xs px-3 py-1 bg-blue-500 rounded"
                                ><SquarePen size={15} />
                                </button>

                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="text-xs px-3 py-1 gap-1 bg-red-500 rounded"
                                ><Trash size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-md">

                        <h2 className="text-xl font-bold mb-4">Nova Categoria</h2>

                        <div className="flex flex-col gap-3">

                            <input
                                placeholder="Nome"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="p-2 rounded bg-white/10 border border-white/10"
                            />

                            <input
                                placeholder="Descrição"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="p-2 rounded bg-white/10 border border-white/10"
                            />

                            {/*<input
                                placeholder="URL da imagem"
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                                className="p-2 rounded bg-white/10 border border-white/10"
                            />*/}

                            <input
                                placeholder="Código da categoria"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                                className="p-2 rounded bg-white/10 border border-white/10"
                            />
                            <div className="flex items-center gap-8 border-t border-white/10 pt-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.active}
                                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                    />
                                    Ativo
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.destaque}
                                        onChange={(e) =>
                                            setForm({ ...form, destaque: e.target.checked })
                                        }
                                    />
                                    Mais vendido
                                </label>
                            </div>

                            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                                {/*<label className="mb-2 block text-sm text-white/70">
                                    Imagem do produto
                                </label>*/}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleUpload(file);
                                        }
                                    }}
                                    className="block w-full text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:opacity-90"
                                />

                                {uploading && (
                                    <p className="mt-2 text-sm text-white/60">A fazer upload...</p>
                                )}

                                {form.image && (
                                    <div className="mt-3">
                                        <p className="mb-2 text-sm text-white/60">Pré-visualização</p>
                                        <img
                                            src={`http://localhost:8080${form.image}`}
                                            alt="Preview"
                                            className="h-32 w-full rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-xs px-4 py-1 gap-1 bg-red-500 rounded">
                                <SquareX size={16} />
                            </button>

                            <button
                                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                                className="bg-amber-400 text-black px-4 py-2 rounded"
                            >
                                {<Save size={16} />}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}