"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { SquarePen, SquarePlus, SquareX, Save, ShieldX   } from "lucide-react";

export default function AdminProductsPage() {
  const { isLoggedIn, isAdmin, loading, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
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
      <div className="mb-6">
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
          className="flex bg-amber-400 text-black px-4 py-2 gap-2 rounded-lg font-semibold"
        ><SquarePlus/>
          Criar
        </button>
      </div>

      {/* LISTA */}
      {loadingOrders ? (
        <p className="text-white/60">A carregar produtos...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover rounded-lg mb-3"
              />

              <h3 className="font-semibold">{product.name}</h3>

              <p className="text-sm text-white/60">
                <p>{product.category?.name}</p>
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

              <input
                placeholder="Imagem (URL)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="p-2 rounded bg-white/10"
              />

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

            </div>

            <div className="flex justify-end gap-3 mt-6 ">
              <button onClick={() => setShowModal(false)}
                className="text-xs px-4 py-1 gap-1 bg-red-500 rounded">
                <ShieldX size={16} />
              </button>

              <button
                onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                className="bg-amber-400 text-black px-4 py-2 rounded"
              >
                {editingProduct ? <Save size={16} /> : <Save size={16} />}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>

  );
}