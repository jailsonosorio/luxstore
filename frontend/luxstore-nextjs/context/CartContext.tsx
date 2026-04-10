"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Product } from "../data/products";

type CartItem = Product & {
    quantity: number;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    cartCount: number;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "luxstore-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);

            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                setItems(Array.isArray(parsedCart) ? parsedCart : []);
            }
        } catch (error) {
            console.error("Erro ao carregar carrinho:", error);
            setItems([]);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Erro ao guardar carrinho:", error);
        }
    }, [items, mounted]);

    function addToCart(product: Product) {
        setItems((current) => {
            const existing = current.find((item) => item.id === product.id);

            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...current, { ...product, quantity: 1 }];
        });
    }

    function removeFromCart(productId: number) {
        setItems((current) => current.filter((item) => item.id !== productId));
    }

    function increaseQuantity(productId: number) {
        setItems((current) =>
            current.map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }

    function decreaseQuantity(productId: number) {
        setItems((current) =>
            current
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function clearCart() {
        setItems([]);
    }

    const cartCount = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items]
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                cartCount,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
}