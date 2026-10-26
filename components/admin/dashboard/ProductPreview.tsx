import Link from "next/link";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/types/admin";

const PREVIEW_LIMIT = 5;

export default function ProductPreview({ products }: { products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="font-semibold">Product catalogue</h2>
          <p className="mt-1 text-xs text-neutral-500">
            A preview of your available products.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="shrink-0 text-xs font-semibold text-neutral-700 hover:text-black"
        >
          View all →
        </Link>
      </div>

      {products.length === 0 ? <EmptyState /> : (
        <div className="divide-y divide-neutral-100">
          {products.slice(0, PREVIEW_LIMIT).map((product) => (
            <ProductRow key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const image = product.images?.[0];

  return (
    <div className="flex items-center gap-3 px-5 py-4 transition hover:bg-neutral-50 sm:gap-4 sm:px-6">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={product.name.en}
          className="h-12 w-12 shrink-0 rounded-xl border border-neutral-100 object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f3efe9] text-neutral-500">
          <Package size={20} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-900">
          {product.name.en}
        </p>
        <p className="mt-1 truncate text-xs text-neutral-400">{product.slug}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
        <p className="mt-1 text-xs text-neutral-400">
          Stock: {product.stock ?? 0}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
        <Package size={23} />
      </div>
      <p className="mt-4 text-sm font-medium">No products to display</p>
      <p className="mt-1 text-xs text-neutral-500">
        Add your first jewellery product to get started.
      </p>
      <Link
        href="/admin/products/new"
        className="mt-5 inline-flex rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
      >
        + Add product
      </Link>
    </div>
  );
}