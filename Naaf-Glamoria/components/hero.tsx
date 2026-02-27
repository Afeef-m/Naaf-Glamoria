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
    <div className="relative min-h-screen w-full overflow-hidden font-librecaslon text-[#154415]">
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

      <div className="lg:hidden w-full">
        <Image
          src="/images/homePageImages/mobile.jpeg"
          alt="Naaf Glamoria Background"
          width={800}
          height={1000}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Content */}
      <main className="relative z-10 lg:min-h-screen lg:flex lg:items-center w-full pt-20">
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-12">
          <div className="hidden lg:block lg:col-span-6" />

          <div className="col-span-1 lg:col-span-6 h-full w-full">
            {/* Mobile Content */}
            <div className="flex lg:hidden flex-col justify-center items-center text-center px-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-3xl font-medium"
                >
                  {dict.comingSoon}
                </motion.h1>

                <div className="flex flex-col items-center gap-2">
                  <motion.p
                    variants={itemVariants}
                    className="text-lg font-bold"
                  >
                    {dict.stayGolden}
                  </motion.p>

                  <motion.p variants={itemVariants} className="text-lg">
                    {dict.brandName}
                  </motion.p>
                </div>

                <motion.div variants={itemVariants} className="pt-4">
                  <a
                    href="https://wa.me/918590715189?text=Hi%20Naaf%20Glamoria..."
                    target="_blank"
                    className="px-6 py-3 border border-[#154415] rounded-full text-[#154415] hover:bg-[#154415] hover:text-white transition"
                  >
                    {dict.contactUs}
                  </a>
                </motion.div>
              </motion.div>
            </div>

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
                    href="https://wa.me/918590715189?text=Hi%20Naaf%20Glamoria,%20I%E2%80%99m%20interested%20in%20your%20unique%20jewelry%20collection.%20Could%20you%20help%20me%20find%20the%20perfect%20piece?"
                    target="_blank"
                    className="flex items-center gap-3 px-8 py-3 border border-[#154415] rounded-full bg-transparent text-[#154415] hover:bg-[#154415] hover:text-white transition-colors duration-300"
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
