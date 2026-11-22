"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
  MessageCircle,
  Star,
  ArrowUpRight,
} from "lucide-react";

type Product = {
  _id: string;
  slug: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  price: number;
  originalPrice?: number;
  images?: string[];
  category?: {
    name: { en: string; ar: string };
  };
  includedItems?: {
    en: string;
    ar: string;
  }[];
  rating?: number;
  reviewsCount?: number;
};

type Props = {
  product: Product;
  locale: "en" | "ar";
  relatedProducts?: Product[];
};

export default function ProductDetailClient({
  product,
  locale,
  relatedProducts = [],
}: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [boxOpen, setBoxOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const name = product.name[locale];
  const description = product.description[locale];
  const category = product.category?.name?.[locale] ?? "Jewellery";

  const images = product.images?.filter(Boolean).length
    ? product.images.filter(Boolean)
    : ["/images/products/p-placeholder.jpg"];

  const validRelatedProducts = relatedProducts
    .filter((item) => item._id !== product._id)
    .slice(0, 4);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const whatsappNumber = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
  ).replace(/\D/g, "");

  // Share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          text: `Discover ${name} at Naaf Glamoria`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Product link copied!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error(error);
      }
    }
  };

  // Wishlist
  const handleWishlist = () => {
    try {
      const key = "naaf-wishlist";
      const saved: string[] = JSON.parse(localStorage.getItem(key) || "[]");

      const alreadySaved = saved.includes(product._id);

      const updated = alreadySaved
        ? saved.filter((id) => id !== product._id)
        : [...saved, product._id];

      localStorage.setItem(key, JSON.stringify(updated));
      setWishlisted(!alreadySaved);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  // WhatsApp
  const openWhatsApp = (message: string) => {
    if (!whatsappNumber) {
      alert("WhatsApp number is not configured.");
      return;
    }

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleBuyNow = () => {
    openWhatsApp(
      [
        "Hello Naaf Glamoria!",
        "",
        "I am interested in this product:",
        `Product: ${name}`,
        `Price: ${formatPrice(product.price)}`,
        `Product URL: ${window.location.href}`,
      ].join("\n"),
    );
  };

  const handleReview = () => {
    openWhatsApp(
      `Hello Naaf Glamoria! I would like to share my experience about ${name}.`,
    );
  };

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen overflow-x-clip bg-[#FAF9F6] text-[#24271F]"
    >
      <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <section className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-12">
          <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[76px_minmax(0,1fr)]">
            <div className="relative order-1 aspect-4/5 min-w-0 w-full max-w-125 overflow-hidden bg-[#F0EEE9] lg:col-start-2 lg:row-start-1">
              <Image
                src={images[activeImage]}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-5 sm:p-10"
              />

              {discount > 0 && (
                <span className="absolute left-4 top-4 z-10 bg-[#BD985D] px-4 py-2 text-xs font-semibold tracking-wider text-white">
                  -{discount}% OFF
                </span>
              )}

              <button
                onClick={() => setZoomOpen(true)}
                className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-[#24271F] shadow-sm transition hover:bg-[#F8F4EC]"
              >
                <ZoomIn size={15} />
                Hover to zoom
              </button>

              <button
                onClick={() => setZoomOpen(true)}
                aria-label="View full image"
                className="absolute bottom-4 right-4 z-10 rounded-full bg-[#24271F] p-3 text-white transition hover:bg-[#154415]"
              >
                <ZoomIn size={17} />
              </button>
            </div>

            <div className="order-2 flex min-w-0 gap-3 overflow-x-auto lg:col-start-1 lg:row-start-1 lg:flex-col lg:overflow-visible">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`relative aspect-square w-17 shrink-0 overflow-hidden border-2 bg-[#F0EEE9] transition sm:w-19 ${
                    activeImage === index
                      ? "border-[#BD985D]"
                      : "border-transparent hover:border-[#D5C9AE]"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${name} view ${index + 1}`}
                    fill
                    sizes="76px"
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 w-full pt-10 sm:pt-12 lg:pt-16">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#BD985D]">
                {category}
              </p>

              <button
                onClick={handleShare}
                className="flex shrink-0 items-center gap-2 rounded-full border border-[#E9E5DC] px-4 py-2 text-xs transition hover:border-[#BD985D]"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>

            {/* TITLE */}

            <h1 className="text-3xl font-light leading-tight tracking-wide sm:text-4xl">
              {name}
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#77776F]">
              {description.length > 150
                ? `${description.slice(0, 150)}...`
                : description}
            </p>

            {/* RATING */}

            {product.reviewsCount && product.reviewsCount > 0 ? (
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <div className="flex text-[#BD985D]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      fill={
                        index < Math.round(product.rating ?? 0)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                <span className="font-medium">
                  {product.rating?.toFixed(1) ?? "N/A"}
                </span>

                <span className="text-[#999]">
                  · {product.reviewsCount} reviews
                </span>
              </div>
            ) : (
              <button
                onClick={handleReview}
                className="mt-5 text-sm text-[#999] transition hover:text-[#BD985D]"
              >
                Be the first to review this product
              </button>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3 border-b border-[#E9E5DC] pb-7">
              <span className="text-3xl font-medium">
                {formatPrice(product.price)}
              </span>

              {discount > 0 && (
                <>
                  <span className="text-base text-[#999] line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>

                  <span className="text-sm font-semibold text-[#BD985D]">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-[#487D58]">
              <span className="h-2 w-2 rounded-full bg-[#4C9B62]" />
              Contact us for product availability
            </div>

            <button
              onClick={handleWishlist}
              className={`mt-8 flex w-full items-center justify-center gap-3 border py-4 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                wishlisted
                  ? "border-[#BD985D] bg-[#BD985D] text-white"
                  : "border-[#BD985D] text-[#98723E] hover:bg-[#BD985D] hover:text-white"
              }`}
            >
              <Heart size={17} fill={wishlisted ? "currentColor" : "none"} />

              {wishlisted ? "Saved to wishlist" : "Save to wishlist"}
            </button>

            {/* WHATSAPP ORDER */}

            <button
              onClick={handleBuyNow}
              className="mt-3 flex w-full items-center justify-center gap-3 bg-[#BD985D] px-4 py-5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#A9844A]"
            >
              <MessageCircle size={18} />
              Enquire & Order on WhatsApp
            </button>

            <div className="mt-6 space-y-4 border border-[#E9E5DC] p-5">
              <div className="flex items-start gap-3 text-sm leading-6 text-[#77776F]">
                <Truck size={18} className="mt-0.5 shrink-0 text-[#BD985D]" />
                Contact us for delivery information
              </div>

              <div className="flex items-start gap-3 text-sm leading-6 text-[#77776F]">
                <RotateCcw
                  size={18}
                  className="mt-0.5 shrink-0 text-[#BD985D]"
                />
                Ask about exchange and return policies
              </div>

              <div className="flex items-start gap-3 text-sm leading-6 text-[#77776F]">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-[#BD985D]"
                />
                Product authenticity information
              </div>
            </div>

            <div className="mt-8 border-t border-[#E9E5DC]">
              <button
                onClick={() => setDescriptionOpen(!descriptionOpen)}
                className="flex w-full items-center justify-between py-5 text-xs font-semibold uppercase tracking-wider"
              >
                Product Description
                {descriptionOpen ? (
                  <ChevronUp size={17} />
                ) : (
                  <ChevronDown size={17} />
                )}
              </button>

              {descriptionOpen && (
                <p className="pb-6 text-sm leading-7 text-[#77776F]">
                  {description}
                </p>
              )}
            </div>

            {product.includedItems && product.includedItems.length > 0 && (
              <div className="border-t border-[#E9E5DC]">
                <button
                  onClick={() => setBoxOpen(!boxOpen)}
                  className="flex w-full items-center justify-between py-5 text-xs font-semibold uppercase tracking-wider"
                >
                  {"What's in the box?"}

                  {boxOpen ? (
                    <ChevronUp size={17} />
                  ) : (
                    <ChevronDown size={17} />
                  )}
                </button>

                {boxOpen && (
                  <ul className="space-y-3 pb-6 text-sm text-[#77776F]">
                    {product.includedItems.map((item, index) => {
                      const itemName = item[locale];

                      return itemName ? (
                        <li key={index} className="flex items-center gap-3">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#BD985D]" />
                          {itemName}
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="mt-16 border-t border-[#E9E5DC] pt-12 sm:mt-20">
          {/* REVIEW HEADING */}

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#BD985D]">
                Authentic Client Testimonials
              </p>

              <h2 className="mt-3 text-3xl font-light uppercase tracking-wide">
                Reviews & Ratings
              </h2>

              <p className="mt-2 text-sm text-[#77776F]">
                Real experiences from customers of Naaf Glamoria.
              </p>
            </div>

            <button
              onClick={handleReview}
              className="w-fit bg-[#BD985D] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#A9844A]"
            >
              Share Your Experience
            </button>
          </div>

          <div className="mt-10 grid gap-10 border-y border-[#E9E5DC] py-10 md:grid-cols-[300px_minmax(0,1fr)]">
            {/* LEFT RATING SUMMARY */}

            <div className="md:border-r md:border-[#E9E5DC] md:pr-10">
              {product.reviewsCount && product.reviewsCount > 0 ? (
                <>
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-light">
                      {product.rating?.toFixed(1) ?? "—"}
                    </span>

                    <span className="mb-2 text-sm text-[#999]">/ 5.0</span>
                  </div>

                  <div className="mt-3 flex gap-1 text-[#BD985D]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={21}
                        fill={
                          index < Math.round(product.rating ?? 0)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-sm text-[#77776F]">
                    Based on {product.reviewsCount} reviews
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl font-light">—</div>

                  <p className="mt-3 text-sm font-medium">No ratings yet</p>

                  <p className="mt-2 max-w-57.5 text-sm leading-6 text-[#77776F]">
                    Be among the first to share your experience.
                  </p>
                </>
              )}

              <div className="mt-6 inline-flex items-center gap-2 border border-[#E9E5DC] px-4 py-3 text-xs text-[#98723E]">
                <ShieldCheck size={16} />
                Customer feedback
              </div>
            </div>

            <div className="flex min-w-0 flex-col items-center justify-center py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0EEE9] text-[#BD985D]">
                <MessageCircle size={23} />
              </div>

              <h3 className="mt-5 text-lg font-medium uppercase tracking-wide">
                {product.reviewsCount && product.reviewsCount > 0
                  ? "Thank You for Your Feedback"
                  : "Be the First to Review"}
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77776F]">
                {product.reviewsCount && product.reviewsCount > 0
                  ? `This product has ${product.reviewsCount} customer reviews.`
                  : "No reviews recorded yet for this product. Share your experience and help others discover Naaf Glamoria."}
              </p>

              <button
                onClick={handleReview}
                className="mt-6 bg-[#BD985D] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#A9844A]"
              >
                {product.reviewsCount && product.reviewsCount > 0
                  ? "Share Your Experience"
                  : "Write the First Review"}
              </button>
            </div>
          </div>
        </section>

        {validRelatedProducts.length > 0 && (
          <section className="mt-16 border-t border-[#E9E5DC] pt-12 sm:mt-20">
            <div className="mb-9">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#BD985D]">
                Complete the Look
              </p>

              <h2 className="mt-3 text-3xl font-light uppercase tracking-wide">
                You May Also Admire
              </h2>

              <p className="mt-2 text-sm text-[#77776F]">
                Discover more pieces selected for you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {validRelatedProducts.map((item) => {
                const itemDiscount =
                  item.originalPrice && item.originalPrice > item.price
                    ? Math.round(
                        ((item.originalPrice - item.price) /
                          item.originalPrice) *
                          100,
                      )
                    : 0;

                return (
                  <Link
                    key={item._id}
                    href={`/${locale}/products/${item.slug}`}
                    className="group min-w-0"
                  >
                    <div className="relative aspect-4/5 overflow-hidden bg-[#F0EEE9]">
                      <Image
                        src={
                          item.images?.[0] ??
                          "/images/products/p-placeholder.jpg"
                        }
                        alt={item.name[locale]}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                      />

                      {itemDiscount > 0 && (
                        <span className="absolute left-3 top-3 bg-[#BD985D] px-2 py-1 text-[10px] font-semibold text-white">
                          -{itemDiscount}%
                        </span>
                      )}
                    </div>

                    <div className="pt-4">
                      <h3 className="text-sm font-medium transition-colors group-hover:text-[#BD985D]">
                        {item.name[locale]}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">
                          {formatPrice(item.price)}
                        </span>

                        {itemDiscount > 0 && (
                          <span className="text-xs text-[#999] line-through">
                            {formatPrice(item.originalPrice!)}
                          </span>
                        )}
                      </div>

                      <span className="mt-3 inline-flex items-center gap-1 text-xs text-[#98723E] opacity-0 transition group-hover:opacity-100">
                        Discover more
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {zoomOpen && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            onClick={() => setZoomOpen(false)}
            aria-label="Close image"
            className="absolute right-6 top-6 z-10 text-white transition hover:text-[#BD985D]"
          >
            <X size={28} />
          </button>

          <div
            className="relative h-[85dvh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[activeImage]}
              alt={name}
              fill
              sizes="95vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
