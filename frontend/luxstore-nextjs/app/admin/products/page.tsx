"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { SquarePen, SquarePlus, SquareX, Save, Trash } from "lucide-react";
import { normalizeText } from "@/utils/search";

export default function AdminProductsPage() {
  const { isLoggedIn, isAdmin, loading, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
  });

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const text = normalizeText(search);

    return (
      normalizeText(product.name).includes(text) ||
      normalizeText(product.description || "").includes(text) ||
      normalizeText(product.category?.name || "").includes(text)
    );
  });

  // Fetch categories for the dropdown
  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:8080/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch products
  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:8080/api/products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }

  // Handle create product
  async function handleCreateProduct() {
    console.log("clicou criar"); // 👈 adiciona isto
    console.log("TOKEN:", token);
    await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        image: form.image,
        category: { id: Number(form.categoryId) }, // 🔥 AQUI
      }),
    });

    setShowModal(false);
    setForm({ name: "", description: "", price: "", image: "", categoryId: "" });
    fetchProducts();
  }

  // Handle update product
  async function handleUpdateProduct() {
    await fetch(`http://localhost:8080/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        image: form.image,
        category: { id: form.categoryId },
      }),
    });

    setShowModal(false);
    setEditingProduct(null);
    fetchProducts();
  }

  // Handle delete product
  async function handleDeleteProduct(id: number) {
    if (!confirm("Tens certeza que queres apagar este produto?")) return;

    await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  }

  // Handle image upload
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

  // Check auth and fetch products on mount
  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn || !isAdmin) {
      router.push("/admin/login");
      return;
    }

    fetchProducts();
    fetchCategories();
  }, [loading, isLoggedIn, isAdmin]);

  if (!isLoggedIn || !isAdmin) return null;

  if (loading) return null;

  // Render admin products page
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Produtos</h1>

      {/* BOTÃO CRIAR */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button
          onClick={() => {
            setEditingProduct(null);
            setForm({
              name: "",
              description: "",
              price: "",
              image: "",
              categoryId: "",
            });
            setShowModal(true);
          }}
          className="flex bg-amber-400 text-black px-2 py-2 gap-1 rounded-lg font-semibold"
        ><SquarePlus />
          Criar
        </button>

        {/* PESQUISA */}
        <div className="relative w-full lg:w-[400px] shadow-lg shadow-black/20 rounded-full">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-10 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-amber-400/40 focus:bg-white/15 transition"
          />
          <span className="absolute left-3 top-2.5 text-white/40">
            🔍
          </span>
        </div>
      </div>

      {/* LISTA */}
      {loadingOrders ? (
        <p className="text-white/60">A carregar produtos...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <img
                src={`http://localhost:8080${product.image}`}
                alt={product.name}
                className="h-40 w-full object-cover rounded-lg mb-3"
              />

              <h3 className="font-semibold">{product.name}</h3>

              <p className="text-sm text-white/60">
                {product.category?.name}
              </p>

              <p className="text-amber-300 font-bold mt-2">
                {Number(product.price).toLocaleString("pt-PT")} CVE
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setForm({
                      name: product.name,
                      description: product.description,
                      price: product.price.toString(),
                      image: product.image,
                      categoryId: product.category?.id.toString() || "",
                    });
                    setShowModal(true);
                  }}
                  className="text-xs px-3 py-1 gap-1 bg-blue-500 rounded"
                ><SquarePen size={15} />
                </button>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
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

            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>

            <div className="flex flex-col gap-3">

              <input
                placeholder="Nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-2 rounded bg-white/10"
              />

              <input
                placeholder="Descrição"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="p-2 rounded bg-white/10"
              />

              <input
                placeholder="Preço"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="p-2 rounded bg-white/10"
              />

              {/*<input
                placeholder="Imagem (URL)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="p-2 rounded bg-white/10"
              />*/}

              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="p-2 rounded bg-white/10"
              >
                <option value="">Selecionar categoria</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

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
            <div className="flex justify-end gap-3 mt-6 ">
              <button onClick={() => setShowModal(false)}
                className="text-xs px-4 py-1 gap-1 bg-red-500 rounded">
                <SquareX size={16} />
              </button>

              <button
                onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
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