"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero({
  dict,
  locale,
}: {
  dict: Record<string, string>;
  locale: "en" | "ar";
}) {
  const isArabic = locale === "ar";

  return (
    <div className="relative h-screen w-full overflow-hidden font-librecaslon text-[#154415]">
      {/* Background */}
      <div className="absolute hidden lg:block inset-0 z-0">
        <Image
          src={
            isArabic
              ? "/images/homePageImages/dESKTOPArabic.png"
              : "/images/homePageImages/dESKTOP2.png"
          }
          alt="Naaf Glamoria Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute lg:hidden inset-0 z-0">
        <Image
          src="/images/homePageImages/mobile.jpeg"
          alt="Naaf Glamoria Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <main className="relative z-10 h-screen w-full pt-20">
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-12">
          <div className="hidden lg:block lg:col-span-6" />

          <div className="col-span-1 lg:col-span-6 h-full w-full">
            <div className="hidden lg:flex h-full flex-col justify-center items-center pr-32 xl:pr-48 text-center">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-7xl xl:text-8xl font-medium"
                >
                  {dict.comingSoon}
                </motion.h1>

                <div className="flex flex-col items-center gap-3">
                  <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-3xl font-bold"
                  >
                    {dict.stayGolden}
                  </motion.p>

                  <motion.p
                    variants={itemVariants}
                    className="font-caslon text-xl md:text-2xl"
                  >
                    {dict.brandName}
                  </motion.p>
                </div>

                <motion.div variants={itemVariants} className="pt-4">
                  <a
                    href="https://wa.me/918590715189"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-8 py-3 border border-[#154415] rounded-full hover:bg-[#154415] hover:text-white transition-all duration-300"
                  >
                    <span>{dict.contactUs}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}