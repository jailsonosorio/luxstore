"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, LayoutGrid, LockKeyhole, LogOut, MonitorCog, ShoppingCart, User } from "lucide-react";

export default function Header() {
    const { cartCount } = useCart();
    const { isLoggedIn, isAdmin, logout } = useAuth();

function handleLogout() {
    logout();
    window.location.href = "/";
}
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div>
                    <Link href="/" className="text-lg font-bold tracking-[0.25em] text-amber-400">
                        Moreno Store
                    </Link>
                    <p className="text-xs text-white/50">
                        Moda, brilho e elegância online
                    </p>
                </div>


                <nav className="hidden gap-6 text-sm text-white/75 md:flex ">
                    <Link href="/" className="transition hover:text-white ">
                        Início
                    </Link>
                    <a href="#categorias" className="transition hover:text-white">
                        Categorias
                    </a>
                    <a href="#produtos" className="transition hover:text-white">
                        Produtos
                    </a>
                    <a href="#sobre" className="transition hover:text-white">
                        Sobre
                    </a>
                </nav>


                <div className="flex items-center gap-3">
                    <Link
                        href="/cart"
                        className="flex rounded-full gap-1 border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
                    ><ShoppingCart  size={18} />({cartCount})                        
                    </Link>
                    {!isLoggedIn && (
                     <>
                    <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white">
                        <User />
                    </button>
                    <button className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:scale-[1.02]">
                        <Link
                        href="/auth/login"
                        className="text-sm text-white/70 hover:text-amber-300"
                        >
                        <LockKeyhole />
                        </Link>
                    </button>
                    </>
                    )}
                    {isLoggedIn && isAdmin && (
                    <>
                        <Link 
                            href="/admin/orders"
                            className="flex rounded-full gap-3 border border-white/15 px-4 py-2 text-sm text-white/80 hover:text-white"
                        ><LayoutDashboard size={18} />
                        </Link>

                        <button 
                            onClick={handleLogout}
                            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:scale-[1.02]"
                        ><LogOut size={18} />
                        </button>
                    </>
                    )}
                </div>
            </div>
        </header>
    );
}