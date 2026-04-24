"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleRegister() {
    setError("");

    // VALIDAÇÕES
    if (!form.username || !form.password) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("As palavras-passe não coincidem");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          phone: form.phone,
          address: form.address,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Erro ao registar");
      }

      alert("Conta criada com sucesso ✅");

      // redireciona para login
      router.push("/auth/login");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">

        <h1 className="text-3xl font-bold">Criar Conta</h1>
        <p className="mt-2 text-white/60">
          Registe-se para acompanhar os seus pedidos.
        </p>

        <div className="mt-8 space-y-4">

          <input
            name="username"
            type="text"
            placeholder="Nome de utilizador"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Palavra-passe"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar palavra-passe"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            name="phone"
            type="text"
            placeholder="Telefone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          <input
            name="address"
            type="text"
            placeholder="Morada"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-black"
          >
            {loading ? "A criar..." : "Criar Conta"}
          </button>

          {/* LOGIN LINK */}
          <p className="text-sm text-white/60 text-center mt-4">
            Já tens conta?{" "}
            <span
              onClick={() => router.push("/auth/login")}
              className="text-amber-400 cursor-pointer"
            >
              Entrar
            </span>
          </p>

        </div>
      </div>
    </main>
  );
}