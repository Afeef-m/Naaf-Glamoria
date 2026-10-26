import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  className?: string;
  footer: { type: "link"; href: string; text: string } | { type: "text"; text: string };
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  className = "",
  footer,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-neutral-800 ${iconBg}`}
        >
          <Icon size={21} />
        </div>
      </div>
      <div className="mt-5 border-t border-neutral-100 pt-4">
        {footer.type === "link" ? (
          <Link
            href={footer.href}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-950"
          >
            {footer.text}
          </Link>
        ) : (
          <p className="text-xs text-neutral-500">{footer.text}</p>
        )}
      </div>
    </div>
  );
}