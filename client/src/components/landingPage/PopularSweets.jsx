"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const sweetsData = [
  {
    name: "Chocolate Truffles",
    description: "Rich and creamy chocolate truffles",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsTc-hDqiGuYtq4lzbILynS3cZM6bArOiupMDnlKMfbFq4BEA3ce_JwBJZbTbB3MxCaJuo2hBfNvKgrXRmkV2l63MALEbBmmAq_0SvVPkYxcGpgZuK0EvIpAS1e5hdPyp5-O07L2HlVng7oVR8xJDXbLEgnLLhBWzxWhOusiZXoq5k5gOWowBQ_IgzT9G9gC1Vax41aejmqk-eqrWUzKbY1xJX-lQEATv6aOXceNq8n9zuR_gvPe1Z3r6YzWDvYgH1o8MLMWXAgd-j",
  },
  {
    name: "Gummy Bears",
    description: "Chewy and fruity gummy bears",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZpxU4fOugR3hidLYs5uKrC3NFffzdT4nKpEL_gYOvJSNiKGhy2dRUjpeb0o7hmx2jEVT-jPkTxKqXgYJLQy8OakWWr0oNKclz7uuN15lHjQsxKA3oZ9wks7qPUNbKeKiaabEh1NRSjkhGCJTV8EQ-h-PKORpwC8rKEANuvFIH8qkoh-ZgMGKkYO5v73_7fVPR9VITnX2fOhGzCSaFj6Q5xnOd19itqRHvvo1G0acGQPtAKcJLKojnXrxZKqAzqdiZ4YWjXmvPeHaE",
  },
  {
    name: "Gourmet Cupcakes",
    description: "Delicious cupcakes with a variety of flavors",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIveqcUO81j9qdZud3DJtnVVNTXCjIXGFI1lQcHvfJ3oEOoFRMHSBoKk0XTHRFJl6urbLNdeb-IQlbXKqeCiMeZL1JCNOimz9UeYpFW_QSnkBxPfXIrq1PXjq1V-J2zJITfGiC3M8wmUyuEel4DNz57KMCVO319ViyPeUutVcxKZ2VgBOajEx1Py6wj0AKn1xOkerHx430e2rOFoM7CEcebJRGv47AvpyujNjlKFwjupA_9gMUt70RyJkskZqH4Sn03YKolZA95fbj",
  },
  {
    name: "Assorted Lollipops",
    description: "Classic lollipops in fun shapes and colors",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkSISYPF5TwgNyWSL9uvCdVvXSkMfQL9pTOxXjp3HWRYncWTMD97QHuFZDGYyQEO27O669OyElr1RMCOfbJkQbRUJf8DUZy7WGHNqyfw-86Bx9tkIo4PE_T9SdSm8POlMT2_l77M0kdYac8umIcgIxZa9ZzqLi63H7Zxj3AGkmCbBFnHBOlMfT-__a2JzOGKKC5WkxiXYW1QGAYNCCIp4uCC6tR76t7QMeBs8Ju-A1nOG20ixRSwI9QoMjJqcPLPZUCZ4QKg8eHhn-",
  },
];

export default function PopularSweets() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="shop" className="py-12 sm:py-16 lg:py-24 bg-surface dark:bg-surface">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-text-primary dark:text-text-primary mb-8 sm:mb-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Popular Sweets
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          {sweetsData.map((sweet, index) => (
            <motion.div
              key={index}
              className="group flex flex-col gap-3 sm:gap-4 rounded-lg cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {/* Image wrapper */}
              <motion.div
                className="w-full aspect-square rounded-xl overflow-hidden relative shadow-md group-hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={sweet.image}
                  alt={sweet.name}
                  fill
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 1024px) 50vw,
                         (max-width: 1280px) 33vw,
                         25vw"
                  className="object-cover"
                />
              </motion.div>

              {/* Text */}
              <div>
                <motion.h3
                  className="text-base sm:text-lg font-semibold text-text-primary dark:text-text-primary"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {sweet.name}
                </motion.h3>
                <motion.p
                  className="text-xs sm:text-sm text-text-muted dark:text-text-muted"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {sweet.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
