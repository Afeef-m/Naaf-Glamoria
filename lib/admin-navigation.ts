import { LayoutDashboard, Package, Shapes } from "lucide-react";

export const adminNavigation = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Shapes },
] as const;

export function getPageTitle(pathname: string) {
  const match = adminNavigation.find(
    (item) =>
      item.href !== "/admin/dashboard" &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
  return match?.label ?? "Overview";
}