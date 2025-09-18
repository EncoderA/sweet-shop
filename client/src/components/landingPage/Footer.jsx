"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const socialLinks = [
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z" />
        </svg>
      )
    },
    {
      name: "Instagram", 
      href: "#",
      icon: (
        <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
        </svg>
      )
    },
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z" />
        </svg>
      )
    }
  ];

  const footerLinks = [
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" }
  ];

  return (
    <footer className="bg-surface-secondary dark:bg-primary/5 border-t border-primary/20 dark:border-primary/30">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-12">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-8"
        //   initial={{ y: 50, opacity: 0 }}
        //   whileInView={{ y: 0, opacity: 1 }}
        //   transition={{ duration: 0.1 }}
        //   viewport={{ once: true }}
        >
          {/* Footer Links */}
          <motion.div 
            className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-text-secondary/70 dark:text-text-secondary/70"
            // initial={{ x: -30, opacity: 0 }}
            // whileInView={{ x: 0, opacity: 1 }}
            // transition={{ duration: 0.3, delay: 0.2 }}
            // viewport={{ once: true }}
          >
            {footerLinks.map((link, index) => (
              <motion.a
                key={link.name}
                className="hover:text-primary transition-colors cursor-pointer"
                href={link.href}
                // whileHover={{ scale: 1.1 }}
                // initial={{ opacity: 0 }}
                // whileInView={{ opacity: 1 }}
                // transition={{ delay: 0.1 * index }}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>

          {/* Social Media Links */}
          <motion.div 
            className="flex gap-4"
            // initial={{ x: 30, opacity: 0 }}
            // whileInView={{ x: 0, opacity: 1 }}
            // transition={{ duration: 0.6, delay: 0.4 }}
            // viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                className="text-text-secondary/60 dark:text-text-secondary/60 hover:text-primary transition-colors"
                // href={social.href}
                // whileHover={{ 
                //   scale: 1.2,
                //   rotate: 5
                // }}
                // whileTap={{ scale: 0.9 }}
                // initial={{ y: 20, opacity: 0 }}
                // whileInView={{ y: 0, opacity: 1 }}
                // transition={{ delay: 0.1 * index }}
                // viewport={{ once: true }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Copyright */}
        <motion.div 
          className="mt-8 text-center text-sm text-text-secondary/60 dark:text-text-secondary/60"
        //   initial={{ opacity: 0 }}
        //   whileInView={{ opacity: 1 }}
        //   transition={{ duration: 0.6, delay: 0.6 }}
        //   viewport={{ once: true }}
        >
          <p>© 2024 Sweet Delights. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}