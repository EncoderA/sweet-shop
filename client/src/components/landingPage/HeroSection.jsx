"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="home" className="px-4 md:px-10 lg:px-20 py-16 lg:py-24">
      <div className="container mx-auto">
        <motion.div
          className="relative rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center p-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd6IL5MCi_u4Z_urYZgyneA-cyBSmLh9yM2MDaPj4KAlA03Xo_wnqDK1nBSJfxhcZM-S5pCZIcW5J5KuGRhnPQuimLGIxTdIg_VYBDCL5P7GSNLvzp9GEgZYjNnocmVkAruECEZo7C6fFva50L_Pl8WsaMFJNn74OlRGY8INhJ4AyvHGeic0MArMfj5ykQkRe31hHWWZbXsPrFdECNV43T6n9X5_ZllHHNRWg4qWcNCzWxE0QKEAZd8NqqLrNKpHJ2u_R6tvfxQh7Z"
              alt="Sweet shop hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(34,16,25,0.5)] to-[rgba(34,16,25,0.7)]" />
          </div>

          {/* Content */}
          <div className="relative flex flex-col gap-6 max-w-2xl text-white z-10">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold leading-tight"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Indulge in Sweet Delights
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-white/90"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Explore our wide selection of candies, chocolates, and baked goods.
              Perfect for any occasion or just a sweet treat.
            </motion.p>

            <motion.div
              className="mt-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button
                className="h-12 px-6 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors hover:shadow-md"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Browse Sweets
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
