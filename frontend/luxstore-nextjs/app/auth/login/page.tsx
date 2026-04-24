"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function AdminLoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) throw new Error("Credenciais inválidas");

            const data = await res.json();

            login(data.token, data.role);

            // REDIRECIONAMENTO INTELIGENTE
            if (data.role === "ADMIN") {
                router.push("/admin/orders"); //area do admin
            } else {
                router.push("/account"); //área do cliente
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="mt-2 text-white/60">Aceda à sua conta.</p>

                <div className="mt-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Utilizador"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Palavra-passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                    />

                    {error && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-black"
                    >
                        {loading ? "A entrar..." : "Entrar"}
                    </button>
                    <p className="mt-6 text-sm text-white/60 text-center">
                        Não tens conta?{" "}
                        <span
                            onClick={() => router.push("/auth/register")}
                            className="text-amber-400 cursor-pointer"
                        >
                            Criar conta
                        </span>
                    </p>
                </div>
            </div>
        </main>
    );
}