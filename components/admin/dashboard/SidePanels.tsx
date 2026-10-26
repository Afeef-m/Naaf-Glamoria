import Link from "next/link";
import { Package, Shapes, type LucideIcon } from "lucide-react";

const quickActions: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/admin/products/new",
    title: "Add a product",
    description: "Add a new jewellery item.",
    icon: Package,
  },
  {
    href: "/admin/categories",
    title: "Manage categories",
    description: "Organize your jewellery catalogue.",
    icon: Shapes,
  },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
      <h2 className="font-semibold">Quick actions</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Common store management tasks.
      </p>

      <div className="mt-5 space-y-3">
        {quickActions.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400 hover:bg-neutral-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
              <Icon size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-1 text-xs text-neutral-500">{description}</p>
            </div>
            <span className="text-neutral-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CatalogueCta() {
  return (
    <div className="rounded-2xl bg-neutral-900 p-6 text-white">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
        Store administration
      </p>
      <h2 className="mt-3 text-xl font-semibold">Keep your catalogue beautiful.</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-400">
        Keep product details, prices, categories, and stock information up to
        date.
      </p>
      <Link
        href="/admin/products"
        className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
      >
        Open catalogue
      </Link>
    </div>
  );
}