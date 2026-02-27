import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { IndianRupee } from "lucide-react";

export default function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: "en" | "ar";
}) {
  return (
    
      <div className="group relative w-70">
        {/* Card Container */}
        <div
          className="relative rounded-3xl bg-white shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 overflow-hidden" >
          {/* IMAGE SECTION */}
          <div className="relative w-full aspect-square bg-[#f7f7f5] overflow-hidden">
            {/* SALE Badge */}
            <span
              className="absolute top-4 left-4 z-20 text-xs tracking-wide bg-[#9c7b52] text-white px-3 py-1 rounded-md">
              SALE
            </span>

            {/* Wishlist Icon */}
            <button
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md opacity-100 md:opacity-0 
              translate-y-0 md:translate-y-2 md:group-hover:opacity-100
              md:group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" >
              ♡
            </button>

            <Image
              src={product.image}
              alt={product.name[locale]}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            <div className=" absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 " />
          </div>

          {/* PRODUCT INFO */}
          <div className="p-5 space-y-2">
            {/* Category */}
            <p className="text-xs tracking-widest text-gray-400 uppercase">
              {product.category[locale]}
            </p>

            {/* Title */}
            <h3
              className="text-[17px] font-medium text-[#154415]">
              {product.name[locale]}
            </h3>

            {/* Rating Row */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex text-yellow-400">★★★★☆</div>
              <span>{product.reviewsCount ?? 0} reviews</span>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-3 pt-2">
              {/* Current Price */}
              <div className="flex items-center gap-1 text-lg font-semibold text-[#154415]">
                <IndianRupee className="w-4 h-4" />
                <span>{product.price}</span>
              </div>

              {/* Old Price */}
              {product.originalPrice && (
                <div className="flex items-center gap-1 text-sm text-gray-400 line-through">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{product.originalPrice}</span>
                </div>
              )}
            </div>
          </div>
          {/* QUICK VIEW SLIDE PANEL */}
          <Link href={`/${locale}/products/${product.slug}`}>
          <div
            className=" md:absolute md:bottom-0 md:left-0 md:w-full bg-[#2f2f2f] text-white text-center py-3  mt-4 md:mt-0    md:translate-y-full md:group-hover:translate-y-0 translate-y-0 
          transition-transform duration-400 ease-in-out">
            Quick view
          </div>
          </Link>
        </div>
      </div>
  );
}
