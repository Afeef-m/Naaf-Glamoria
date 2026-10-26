"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import adminApi from "@/lib/api/admin-client";
import type {
  Admin,
  CategoriesResponse,
  Category,
  Product,
  ProductsResponse,
} from "@/types/admin";

const PARTIAL_ERROR = "Some dashboard statistics could not be loaded.";

export function useAdminDashboard() {
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

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

      let nextError = "";

      if (productsResult.status === "fulfilled") {
        const { success, products } = productsResult.value.data;
        if (success && Array.isArray(products)) setProducts(products);
        else nextError = "Could not load product statistics.";
      } else {
        nextError = PARTIAL_ERROR;
      }

      if (categoriesResult.status === "fulfilled") {
        const { success, categories } = categoriesResult.value.data;
        if (success && Array.isArray(categories)) setCategories(categories);
        else nextError = PARTIAL_ERROR;
      } else {
        nextError = PARTIAL_ERROR;
      }

      setError(nextError);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setError("Unable to load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const logout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await adminApi.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }, [router]);

  return {
    admin,
    products,
    categories,
    loading,
    error,
    loggingOut,
    reload: load,
    logout,
  };
}