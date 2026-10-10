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
  const uiText = {
    en: {
      sale: "SALE",
      reviews: "reviews",
      quickView: "Quick view",
    },
    ar: {
      sale: "تخفيض",
      reviews: "تقييم",
      quickView: "عرض سريع",
    },
  };

  const rating = Math.min(5, Math.max(0, product.rating ?? 0));
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="group relative w-full">
      {/* Card Container */}
      <div className="relative rounded-3xl bg-white shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 overflow-hidden">
        {/* IMAGE SECTION */}
        <div className="relative w-full aspect-square bg-[#f7f7f5] overflow-hidden">
          {/* SALE Badge */}
          {product.originalPrice && (
            <span className="absolute top-4 left-4 z-20 text-xs tracking-wide bg-[#9c7b52] text-white px-3 py-1 rounded-md">
              {uiText[locale].sale}
            </span>
          )}

          {/* Wishlist Icon */}
          <button
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md opacity-100 md:opacity-0 
              translate-y-0 md:translate-y-2 md:group-hover:opacity-100
              md:group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
          >
            ♡
          </button>

          <Image
            src={product.images[0] ?? "/images/products/p-placeholder.jpg"}
            alt={product.name[locale]}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className=" absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 " />
        </div>

        {/* PRODUCT INFO */}
        <div className="p-5 space-y-2">
          {/* Category */}
          <p className="text-xs tracking-widest text-gray-400 uppercase">
            {product.category?.name?.[locale]}
          </p>

          {/* Title */}
          <h3 className="text-[17px] font-medium text-[#154415]">
            {product.name[locale]}
          </h3>

          {/* Rating Row */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex text-yellow-400">
              {"★".repeat(fullStars)}
              {"☆".repeat(emptyStars)}
            </div>
            <span>
              {locale === "ar"
                ? `${uiText.ar.reviews} ${product.reviewsCount ?? 0}`
                : `${product.reviewsCount ?? 0} ${uiText.en.reviews}`}
            </span>
          </div>

          {/* Price Row */}
          <div className="flex items-center gap-3 pt-2">
            {/* Current Price */}
            <div className="flex items-center gap-1 text-lg font-semibold text-[#154415]">
              {locale === "ar" ? (
                <>
                  <span>{product.price}</span>
                  <IndianRupee className="w-4 h-4" />
                </>
              ) : (
                <>
                  <IndianRupee className="w-4 h-4" />
                  <span>{product.price}</span>
                </>
              )}
            </div>

            {/* Old Price */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center gap-1 text-sm text-gray-400 line-through">
                {locale === "ar" ? (
                  <>
                    <span>{product.originalPrice}</span>
                    <IndianRupee className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{product.originalPrice}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* QUICK VIEW SLIDE PANEL */}
        <Link href={`/${locale}/products/${product.slug}`}>
          <div
            className=" md:absolute md:bottom-0 md:left-0 md:w-full bg-[#2f2f2f] text-white text-center py-3  mt-4 md:mt-0    md:translate-y-full md:group-hover:translate-y-0 translate-y-0 
          transition-transform duration-400 ease-in-out"
          >
            <div>{uiText[locale].quickView}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
