"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 lg:py-24 bg-background dark:bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
        {/* Section Heading */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary mb-3 sm:mb-4">
            Get in Touch
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary/80 dark:text-text-secondary/80">
            Have questions about our sweets? Want to place a custom order? We'd
            love to hear from you!
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-6 sm:mb-10"
          >
          </motion.div>
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Address */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-5 sm:p-6 bg-card-background dark:bg-card-background rounded-xl shadow-lg"
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-text-primary dark:text-text-primary text-base sm:text-lg mb-1">
                Address
              </h4>
              <p className="text-xs sm:text-sm text-text-muted dark:text-text-muted">
                123 Sweet Street
                <br />
                Candy City, CC 12345
              </p>
            </motion.div>

            {/* Phone */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-5 sm:p-6 bg-card-background dark:bg-card-background rounded-xl shadow-lg"
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-text-primary dark:text-text-primary text-base sm:text-lg mb-1">
                Phone
              </h4>
              <p className="text-xs sm:text-sm text-text-muted dark:text-text-muted">
                +1 (555) 123-4567
              </p>
            </motion.div>

            {/* Email */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-5 sm:p-6 bg-card-background dark:bg-card-background rounded-xl shadow-lg"
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-text-primary dark:text-text-primary text-base sm:text-lg mb-1">
                Email
              </h4>
              <p className="text-xs sm:text-sm text-text-muted dark:text-text-muted">
                hello@sweetdelights.com
              </p>
            </motion.div>

            {/* Hours */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-5 sm:p-6 bg-card-background dark:bg-card-background rounded-xl shadow-lg"
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-text-primary dark:text-text-primary text-base sm:text-lg mb-1">
                Hours
              </h4>
              <p className="text-xs sm:text-sm text-text-muted dark:text-text-muted">
                Mon-Sat: 9AM-8PM
                <br />
                Sun: 10AM-6PM
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
