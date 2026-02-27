"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X, Globe } from "lucide-react";
import Link from "next/link";

export default function Navbar({
  dict,
  locale,
}: {
  dict: Record<string, string>;
  locale: "en" | "ar";
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full text-[#154415] bg-white">
      <div className="hidden md:flex flex-col w-full">
        <div className="relative flex justify-center items-center py-4 border-b border-[#154415]">
          <ul className="flex gap-x-8 text-xs font-medium font-montserrat tracking-widest">
            <li>
              <Link href="#" className="hover:text-[#154415] transition-colors">
                {dict.shop}
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#154415] transition-colors">
                {dict.collections}
              </Link>
            </li>
            <li>
              {/* Assuming 'OUR VALUES' is a page, using placeholder # for now */}
              <Link href="#" className="hover:text-[#154415] transition-colors">
                {dict.values}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/about`}
                className="hover:text-[#154415] transition-colors"
              >
                {dict.about}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/contact`}
                className="hover:text-[#154415] transition-colors"
              >
                {dict.contact}
              </Link>
            </li>
          </ul>

          {/* Language Selector (Desktop) */}
          <div className="absolute right-12 flex items-center gap-x-1 text-xs font-medium font-montserrat">
            <Globe className="w-3 h-3 mr-1" />

            <Link
              href="/en"
              className={
                locale === "en"
                  ? "font-bold underline"
                  : "text-gray-500 hover:text-[#154415]"
              }
            >
              EN
            </Link>

            <span className="text-gray-400">|</span>

            <Link
              href="/ar"
              className={
                locale === "ar"
                  ? "font-bold underline"
                  : "text-gray-500 hover:text-[#154415]"
              }
            >
              AR
            </Link>
          </div>
        </div>

        {/* Bottom Row: Search, Logo, Icons */}
        <div className="flex justify-between items-center px-12 py-10">
          {/* Left: Search */}
          <div className="flex items-center gap-x-2 relative">
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-x-2 hover:text-[#154415] transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="text-xs font-medium font-montserrat tracking-widest">
                  {dict.search}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-x-2 border-b border-[#154415]">
                <Search className="w-4 h-4 text-[#154415]" />
                <input
                  type="search"
                  autoFocus
                  placeholder={dict.search}
                  className="outline-none text-xs font-montserrat bg-transparent"
                />
                <button onClick={() => setIsSearchOpen(false)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Image
              src="/svgs/naaflogo.svg"
              alt="Naaf Glamoria Logo"
              width={160}
              height={60}
              className="object-contain"
            />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-x-6">
            <button
              aria-label="Wishlist"
              className="hover:text-[#154415] transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              aria-label="Profile"
              className="hover:text-[#154415] transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              aria-label="Cart"
              className="hover:text-[#154415] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* =======================
          MOBILE LAYOUT
          ======================= */}
      <div className="flex md:hidden justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
        {/* Left: Hamburger Menu */}
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu className="w-6 h-6 text-[#154415]" />
        </button>

        {/* Center: Logo */}
        <Image
          src="/svgs/naaflogo.svg"
          alt="Naaf Glamoria Logo"
          width={100}
          height={40}
          className="object-contain"
        />

        {/* Right: Shopping Bag */}
        <button className="hover:text-[#154415] transition-colors">
          <ShoppingBag className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* 2. Side Menu (Restricted width to 75%) */}
          <div className="fixed top-0 left-0 bottom-0 z-50 w-[60%] sm:w-[60%] bg-white flex flex-col p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Header with Close Button */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-medium font-montserrat text-[#154415]">
                {dict.menu}
              </span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-8 h-8 text-[#154415]" />
              </button>
            </div>

            {/* Navigation Links */}
            <ul className="flex flex-col space-y-6 text-lg font-medium font-montserrat  text-[#154415]">
              <li>
                <Link
                  href="#"
                  className="block hover:text-gray-600 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dict.shop}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block hover:text-gray-600 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dict.collections}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block hover:text-gray-600 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dict.values}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="block hover:text-gray-600 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dict.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="block hover:text-gray-600 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dict.contact}
                </Link>
              </li>
            </ul>

            {/* Secondary Actions (Mobile Menu) */}
            <div className="mt-auto flex flex-col space-y-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-x-3 text-[#154415]">
                <Search className="w-5 h-5" />
                <span className="text-sm font-medium font-montserrat tracking-widest">
                  {dict.search}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[#154415]">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium font-montserrat tracking-widest">
                  {dict.wishlist}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[#154415]">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium font-montserrat tracking-widest">
                  {dict.account}
                </span>
              </div>
              {/* Mobile Language Selector */}
              <div className="flex items-center space-x-3 text-[#154415] mt-4">
                <Globe className="w-5 h-5" />
                <div className="flex space-x-4">
                  <Link
                    href="/en"
                    className={
                      locale === "en" ? "font-bold underline" : "text-gray-500"
                    }
                  >
                    English
                  </Link>
                  <Link
                    href="/ar"
                    className={
                      locale === "ar" ? "font-bold underline" : "text-gray-500"
                    }
                  >
                    العربية
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
