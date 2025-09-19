"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Package,
  Users,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import ProfilePopup from "./ProfilePopup";
import CartButton from "./CartButton";
import { AnimatedThemeToggler } from "../ui/theme-toggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();

  const { data: session } = useSession();
  console.log(session);

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="flex sticky top-0 z-50 items-center justify-between whitespace-nowrap border-b border-border px-6 py-4 bg-background/95 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 text-foreground">
        <div className="w-8 h-8" style={{ color: "#ee2b8c" }}>
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Sweet Delights</h2>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center gap-8 text-muted-foreground">
        <motion.a
          className="text-sm font-medium hover:text-foreground transition-colors cursor-pointer"
          href="/shop"
          whileHover={{ scale: 1.1 }}
        >
          Home
        </motion.a>
        <motion.a
          className="text-sm font-medium hover:text-foreground transition-colors cursor-pointer"
          href="/shop/orders"
          whileHover={{ scale: 1.1 }}
        >
          Orders
        </motion.a>
        {isAdmin && (
          <>
            <motion.a
              className="text-sm font-medium hover:text-foreground transition-colors cursor-pointer"
              href="/shop/inventory"
              whileHover={{ scale: 1.1 }}
            >
              Inventory
            </motion.a>
            <motion.a
              className="text-sm font-medium hover:text-foreground transition-colors cursor-pointer"
              href="/shop/customers"
              whileHover={{ scale: 1.1 }}
            >
              Customers
            </motion.a>
          </>
        )}
      </nav>

      <div className="hidden md:flex items-center gap-4">
        <AnimatedThemeToggler />
        <CartButton />
        {session && <ProfilePopup />}
      </div>

      <button
        className="md:hidden text-foreground"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-[64px] left-0 w-full bg-background shadow-lg border-b border-border flex flex-col items-center gap-6 py-6 md:hidden"
        >
          <div className="relative w-4/5">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#ee2b8c] focus:border-transparent"
            />
          </div>

          {/* Mobile Navigation Links */}
          <Link
            href="/shop"
            className="text-sm font-medium hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/shop/orders"
            className="text-sm font-medium hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/shop/inventory"
                className="text-sm font-medium hover:text-foreground transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Package size={16} />
                Inventory
              </Link>
              <Link
                href="/shop/customers"
                className="text-sm font-medium hover:text-foreground transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Users size={16} />
                Customers
              </Link>
            </>
          )}

          {/* Mobile Cart */}
          <Link
            href="/shop/cart"
            className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ee2b8c] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
            Cart ({totalItems})
          </Link>
          <AnimatedThemeToggler />
          {/* Mobile Logout */}
          {session && <ProfilePopup />}
        </motion.div>
      )}
    </header>
  );
}
