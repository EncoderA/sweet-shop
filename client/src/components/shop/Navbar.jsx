"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart, Search, Package, Users, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import ProfilePopup from "./ProfilePopup";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session } = useSession();
  console.log(session);

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="flex sticky top-0 z-50 items-center justify-between whitespace-nowrap border-b border-border px-6 py-4 bg-background/95 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 text-foreground">
        <div className="w-8 h-8" style={{ color: "#ee2b8c" }}>
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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
          href="/orders"
          whileHover={{ scale: 1.1 }}
        >
          Orders
        </motion.a>
        {isAdmin && (
          <>
            <motion.a
              className="text-sm font-medium hover:text-foreground transition-colors cursor-pointer"
              href="/inventory"
              whileHover={{ scale: 1.1 }}
            >
              Inventory
            </motion.a>
            <motion.a
              className="text-sm font-medium hover:text-foreground transition-colors cursor-pointer"
              href="/customers"
              whileHover={{ scale: 1.1 }}
            >
              Customers
            </motion.a>
          </>
        )}
      </nav>

      {/* Search, Cart, and Logout - Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#ee2b8c] focus:border-transparent"
          />
        </div>

        {/* Cart Icon */}
        <Link href="/cart">
          <motion.button
            className="relative p-2 text-foreground hover:text-[#ee2b8c] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-[#ee2b8c] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </motion.button>
        </Link>

        {/* Logout Button (only when logged in) */}
        {session && (
          <ProfilePopup />
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-foreground"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-[64px] left-0 w-full bg-background shadow-lg border-b border-border flex flex-col items-center gap-6 py-6 md:hidden"
        >
          {/* Mobile Search */}
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
            href="/orders"
            className="text-sm font-medium hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/inventory"
                className="text-sm font-medium hover:text-foreground transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Package size={16} />
                Inventory
              </Link>
              <Link
                href="/customers"
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
            href="/cart"
            className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-[#ee2b8c] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </div>
            Cart
          </Link>

          {/* Mobile Logout */}
          {session && (
            <ProfilePopup />
          )}
        </motion.div>
      )}
    </header>
  );
}
