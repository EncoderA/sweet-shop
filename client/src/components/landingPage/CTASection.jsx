"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-surface dark:bg-surface">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.1 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Satisfy Your Sweet Tooth?
          </motion.h2>

          <motion.p
            className="mt-4 text-base md:text-lg text-text-secondary/80 dark:text-text-secondary/80"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Create an account to start browsing our full selection of sweets and
            receive exclusive offers.
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/register" passHref>
              <motion.button
                className="h-12 px-8 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(238, 43, 140, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="relative z-10"
                  initial={{ y: 0 }}
                  whileHover={{ y: -2 }}
                >
                  Sign Up Now
                </motion.span>

                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.1 }}
                />
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating elements for visual appeal */}
          <motion.div
            className="absolute -z-10 w-20 h-20 bg-primary/10 rounded-full"
            style={{ top: "10%", left: "10%" }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute -z-10 w-16 h-16 bg-accent-blue/10 rounded-full"
            style={{ top: "20%", right: "15%" }}
            animate={{
              y: [0, 15, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute -z-10 w-12 h-12 bg-primary/5 rounded-full"
            style={{ bottom: "10%", left: "20%" }}
            animate={{
              y: [0, -10, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
