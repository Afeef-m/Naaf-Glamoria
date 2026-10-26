// Naaf-Glamoria\app\admin\dashboard\page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import adminApi from "@/lib/api/admin-client";
import {
  LayoutDashboard,
  Package,
  Shapes,
  LogOut,
  Menu,
  X,
  Star,
  ArrowRight,
  RefreshCw,
  Plus,
  Gem,
} from "lucide-react";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Product = {
  _id: string;
  name: { en: string; ar: string };
  slug: string;
  price: number;
  images?: string[];
  stock?: number;
  isFeatured?: boolean;
};

type Category = {
  _id: string;
  name: { en: string; ar: string };
  slug: string;
};

type ProductsResponse = {
  success: boolean;
  products?: Product[];
};

type CategoriesResponse = {
  success: boolean;
  categories?: Category[];
};

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Shapes,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setDataError("");

    try {
      const session = await adminApi.get("/auth/me");

      if (!session.data?.success || !session.data?.admin) {
        router.replace("/admin/login");
        return;
      }

      setAdmin(session.data.admin);

      const [productsResult, categoriesResult] = await Promise.allSettled([
        adminApi.get<ProductsResponse>("/products"),
        adminApi.get<CategoriesResponse>("/categories"),
      ]);

      if (productsResult.status === "fulfilled") {
        const data = productsResult.value.data;

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setDataError("Could not load product statistics.");
        }
      } else {
        setDataError("Some dashboard statistics could not be loaded.");
      }

      if (categoriesResult.status === "fulfilled") {
        const data = categoriesResult.value.data;

        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setDataError("Some dashboard statistics could not be loaded.");
        }
      } else {
        setDataError("Some dashboard statistics could not be loaded.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.replace("/admin/login");
        return;
      }

      setDataError("Unable to load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await adminApi.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  const featuredCount = products.filter((product) => product.isFeatured).length;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          <p className="mt-4 text-sm text-neutral-500">
            Preparing your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] p-6">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7">
          <h1 className="text-xl font-semibold text-neutral-900">
            Session unavailable
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Your admin profile could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-5 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-900">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[84px] items-center justify-between border-b border-neutral-100 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold tracking-wide text-white">
              NG
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">
                NAAF GLAMORIA
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">
                Store administration
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-neutral-900 font-medium text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <item.icon size={19} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-700 shadow-sm">
              <Star size={18} />
            </div>
            <p className="mt-3 text-sm font-semibold">Your jewellery store</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Keep your catalogue organized and up to date.
            </p>
            <Link
              href="/admin/products"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-neutral-900 hover:underline"
            >
              Manage catalogue
              <ArrowRight size={14} />
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <LogOut size={19} strokeWidth={1.8} />
            {loggingOut ? "Logging out..." : "Sign out"}
          </button>

          <p className="px-3 pt-3 text-[10px] text-neutral-400">
            NAAF GLAMORIA · ADMIN
          </p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-md sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {pathname === "/admin/products"
                  ? "Products"
                  : pathname === "/admin/categories"
                    ? "Categories"
                    : "Overview"}
              </p>
              <p className="mt-0.5 hidden text-xs text-neutral-400 sm:block">
                Naaf Glamoria / Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{admin.name}</p>
              <p className="mt-0.5 text-xs text-neutral-400">{admin.role}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-[#f2ece4] text-sm font-semibold text-neutral-800">
              {admin.name.trim().charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-9">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Store overview
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome back, {admin.name.split(" ")[0]}
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                Here&apos;s an overview of your jewellery catalogue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-neutral-50 sm:self-auto"
            >
              <RefreshCw size={16} />
              Refresh data
            </button>
          </div>

          {dataError && (
            <div
              role="alert"
              className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center"
            >
              <p>{dataError}</p>
              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="self-start font-semibold underline sm:self-auto"
              >
                Retry
              </button>
            </div>
          )}

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total products</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {products.length}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2ece4] text-neutral-800">
                  <Package size={21} />
                </div>
              </div>
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <Link
                  href="/admin/products"
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-950"
                >
                  View product catalogue →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Categories</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {categories.length}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf1e9] text-neutral-800">
                  <Shapes size={21} />
                </div>
              </div>
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <Link
                  href="/admin/categories"
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-950"
                >
                  Manage categories →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:col-span-2 sm:p-6 xl:col-span-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Featured products</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {featuredCount}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6eddc] text-neutral-800">
                  <Star size={21} />
                </div>
              </div>
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="text-xs text-neutral-500">
                  Mark products as featured in your catalogue.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
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

              {products.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
                    <Package size={23} />
                  </div>
                  <p className="mt-4 text-sm font-medium">
                    No products to display
                  </p>
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
              ) : (
                <div className="divide-y divide-neutral-100">
                  {products.slice(0, 5).map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 px-5 py-4 transition hover:bg-neutral-50 sm:gap-4 sm:px-6"
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
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
                        <p className="mt-1 truncate text-xs text-neutral-400">
                          {product.slug}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold">
                          {formatPrice(product.price)}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          Stock: {product.stock ?? 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
                <h2 className="font-semibold">Quick actions</h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Common store management tasks.
                </p>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/admin/products/new"
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400 hover:bg-neutral-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                      <Package size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Add a product</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Add a new jewellery item.
                      </p>
                    </div>
                    <span className="text-neutral-400">→</span>
                  </Link>

                  <Link
                    href="/admin/categories"
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400 hover:bg-neutral-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                      <Shapes size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Manage categories</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Organize your jewellery catalogue.
                      </p>
                    </div>
                    <span className="text-neutral-400">→</span>
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl bg-neutral-900 p-6 text-white">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                  Store administration
                </p>
                <h2 className="mt-3 text-xl font-semibold">
                  Keep your catalogue beautiful.
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Keep product details, prices, categories, and stock
                  information up to date.
                </p>
                <Link
                  href="/admin/products"
                  className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
                >
                  Open catalogue
                </Link>
              </div>
            </div>
          </section>

          <footer className="mt-8 border-t border-neutral-200 py-5 text-xs text-neutral-400">
            Naaf Glamoria Admin · Store management
          </footer>
        </main>
      </div>
    </div>
  );
}
