"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { AnimatedThemeToggler } from "../ui/theme-toggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session } = useSession();
  console.log(session);
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
        {["Home", "Shop", "About", "Contact"].map((item) => (
          <motion.a
            key={item}
            className="text-sm font-medium hover:text-foreground transition-colors cursor-pointer"
            href={`#${item.toLowerCase()}`}
            whileHover={{ scale: 1.1 }}
          >
            {item}
          </motion.a>
        ))}
      </nav>

      {/* Auth Buttons - Desktop */}
      <div className="hidden md:flex items-center gap-2">
        <AnimatedThemeToggler />
        <Link href="/login" passHref>
          <motion.button
            className="flex min-w-[90px] items-center justify-center rounded-lg h-10 px-4 text-sm font-bold transition-colors"
            style={{
              backgroundColor: "rgba(238, 43, 140, 0.1)",
              color: "#ee2b8c",
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(238, 43, 140, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <span>Login</span>
          </motion.button>
        </Link>

        <Link href="/register" passHref>
          <motion.button
            className="flex min-w-[90px] items-center justify-center rounded-lg h-10 px-4 text-white text-sm font-bold transition-colors"
            style={{ backgroundColor: "#ee2b8c" }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(238, 43, 140, 0.9)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span>Sign Up</span>
          </motion.button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <AnimatedThemeToggler className={"md:hidden"} />
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-[64px] left-0 w-full bg-background shadow-lg border-b border-border flex flex-col items-center gap-6 py-6 md:hidden"
        >
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}

          <div className="flex flex-col gap-4 w-4/5">
            <Link href="/login" passHref>
              <motion.button
                className="w-full rounded-lg h-10 px-4 text-sm font-bold transition-colors"
                style={{
                  backgroundColor: "rgba(238, 43, 140, 0.1)",
                  color: "#ee2b8c",
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(238, 43, 140, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </Link>
            <Link href="/register" passHref>
              <motion.button
                className="w-full rounded-lg h-10 px-4 text-white text-sm font-bold transition-colors"
                style={{ backgroundColor: "#ee2b8c" }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(238, 43, 140, 0.9)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
