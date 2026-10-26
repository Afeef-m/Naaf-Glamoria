"use client";

import { Package, Shapes, Star } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
  DashboardHeader,
  DashboardLoading,
  ErrorBanner,
  SessionUnavailable,
} from "@/components/admin/dashboard/DashboardStates";
import ProductPreview from "@/components/admin/dashboard/ProductPreview";
import {
  CatalogueCta,
  QuickActions,
} from "@/components/admin/dashboard/SidePanels";
import StatCard from "@/components/admin/dashboard/StatCard";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

export default function AdminDashboardPage() {
  const {
    admin,
    products,
    categories,
    loading,
    error,
    loggingOut,
    reload,
    logout,
  } = useAdminDashboard();

  if (loading) return <DashboardLoading />;
  if (!admin) return <SessionUnavailable onRetry={() => void reload()} />;

  const featuredCount = products.filter((p) => p.isFeatured).length;

  return (
    <AdminShell
      admin={admin}
      loggingOut={loggingOut}
      onLogout={() => void logout()}
    >
      <DashboardHeader
        firstName={admin.name.split(" ")[0]}
        onRefresh={() => void reload()}
      />

      {error && <ErrorBanner message={error} onRetry={() => void reload()} />}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total products"
          value={products.length}
          icon={Package}
          iconBg="bg-[#f2ece4]"
          footer={{
            type: "link",
            href: "/admin/products",
            text: "View product catalogue →",
          }}
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon={Shapes}
          iconBg="bg-[#eaf1e9]"
          footer={{
            type: "link",
            href: "/admin/categories",
            text: "Manage categories →",
          }}
        />
        <StatCard
          label="Featured products"
          value={featuredCount}
          icon={Star}
          iconBg="bg-[#f6eddc]"
          className="sm:col-span-2 xl:col-span-1"
          footer={{
            type: "text",
            text: "Mark products as featured in your catalogue.",
          }}
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <ProductPreview products={products} />
        <div className="space-y-6">
          <QuickActions />
          <CatalogueCta />
        </div>
      </section>
    </AdminShell>
  );
}
