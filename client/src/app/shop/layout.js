"use client";

import Header from "@/components/shop/Navbar";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({ children }) {
    return (
        <CartProvider>
            <div>
                <Header />
                {children}
            </div>
        </CartProvider>
    );
}