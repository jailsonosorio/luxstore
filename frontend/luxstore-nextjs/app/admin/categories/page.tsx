"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { SquarePlus, SquarePen, SquareX, Save, ShieldX  } from "lucide-react";

export default function AdminCategoriesPage() {
    const { isLoggedIn, isAdmin, loading, token } = useAuth();
    const router = useRouter();
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        image: "",
        code: "",
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
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Erro ao criar categoria");

            setShowModal(false);
            setForm({ name: "", description: "", image: "", code: "" });

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
                body: JSON.stringify(form),
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

    // VERIFICA SE O USUÁRIO ESTÁ LOGADO E É ADMIN, SE NÃO, REDIRECIONA PARA LOGIN
    useEffect(() => {
        if (loading) return;

        if (!isLoggedIn || !isAdmin) {
            router.push("/admin/login");
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
            <div className="mb-6">
                <button
                    onClick={() => setShowModal(true)}
                    className="flex bg-amber-400 text-black px-4 py-2 gap-2 rounded-lg font-semibold hover:scale-[1.02] transition"
                ><SquarePlus/>
                    Criar
                </button>
            </div>

            {/* LISTA */}
            {loadingCategories ? (
                <p className="text-white/60">A carregar categorias...</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                            <img
                                src={category.image}
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
                                        });
                                        setShowModal(true);
                                    }}
                                    className="text-xs px-3 py-1 bg-blue-500 rounded"
                                ><SquarePen size={15} />
                                </button>

                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="text-xs px-3 py-1 gap-1 bg-red-500 rounded"
                                ><SquareX size={15} />
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

                            <input
                                placeholder="URL da imagem"
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                                className="p-2 rounded bg-white/10 border border-white/10"
                            />

                            <input
                                placeholder="Código da categoria"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                                className="p-2 rounded bg-white/10 border border-white/10"
                            />

                        </div>

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-xs px-4 py-1 gap-1 bg-red-500 rounded">
                                <ShieldX size={16} />
                            </button>

                            <button
                                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                                className="bg-amber-400 text-black px-4 py-2 rounded"
                            >
                                {editingCategory ? <Save size={16} /> : <Save size={16} />}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}