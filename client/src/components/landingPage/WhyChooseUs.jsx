"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const featuresData = [
    {
        title: "Quality Ingredients",
        description: "We use only the finest ingredients to create our delicious sweets.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoIxa4LejExhVbQCSk3yoHr1-wzVt0lkbUW-r-_ctlA_aPUXvhhmkcGtVxklDVKmUJKbFKd13qfuD2yvmgWfMxmiQDogI0N7TcAKsl10LIwlUn77XZDU_JUGLfXdTo7haPfxV173W6_hgGBT1bRMS-BGFQTISMjZyDyj8aj3WYN2SgnglX45ui_iSJIrDjDfTw2liIiOLD2UMYGBuWF5VdXXQBqbsJmSw-Zw3-atu-Sltq_QPEJzzAXa0u43jdlHaVE1m24Lp6orc0"
    },
    {
        title: "Wide Selection",
        description: "Explore our extensive collection of candies, chocolates, and baked goods.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRSHiuqr2WI1KYqE2k-VjunUnagw0YF8xWNvMH_xkQfklBWmGeKyvln3rCxhDW3z20k26FBjOVUfmSwEGP8ps6gQYhYQqAu1VPavZeOBHnUkQyQ3uNyxRqpY9zjxSGVU7fUrBGfRSMhn8-u--MunSK2BsWHC3bYhp9XHPU4pSGgdxXHw6qswVuD7RVXZ5tgH3VJWYiB1a9XtovCza2n-61vBsHrmRJlEJPk8pIrxo0I46E4F80GRjOlgFC0g_GSerN3gIwCZWOHhJn"
    },
    {
        title: "Perfect for Any Occasion",
        description: "Our sweets are perfect for birthdays, holidays, or just a sweet treat.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD95LMxbXbK7kFiJbFRAR8JyuXArvgT_865o2xEE8f2r0S-PFxJJAx37BO0HMYcsH1IRfAP1RjNkQL9CS_KQWev51lfX2gGvNUsF9V7tQuA6f7JjYlcq5cXKtArE-8mQ4ATP0JTyxZ9HVmg0QHCHtqnjNbBWyaP7tfxkohqbgGn9W4fsrERWgQHTErdW2OoJm0XsD9YOT1T2HO_d02i_iKOpNG_d-bIOxJOJaK_Fe96a9UnGYL77pop0YS6jP8PjFYbMT7pgk8LHEFV"
    }
];

export default function WhyChooseUs() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 60, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <section id="about" className="py-16 lg:py-24 bg-surface-secondary dark:bg-primary/5">
            <div className="container mx-auto px-4 md:px-10 lg:px-20">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary mb-4"
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Why Choose Sweet Delights?
                    </motion.h2>
                    <motion.p
                        className="text-base md:text-lg text-text-secondary/80 dark:text-text-secondary/80 mb-12"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        We offer a wide variety of high-quality sweets, from classic favorites to unique creations. 
                        Our sweets are perfect for any occasion, whether you're looking for a gift or a treat for yourself.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {featuresData.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col gap-4 text-center group"
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.1 }}
                        >
                            <motion.div
                                className="relative w-full aspect-video rounded-xl overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover rounded-xl"
                                />
                            </motion.div>
                            <div>
                                <motion.h3
                                    className="text-xl font-bold text-text-primary dark:text-text-primary mb-2"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    {feature.title}
                                </motion.h3>
                                <motion.p
                                    className="text-text-secondary/70 dark:text-text-secondary/70"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    {feature.description}
                                </motion.p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
