import { RefreshCw } from "lucide-react";

export function DashboardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
        <p className="mt-4 text-sm text-neutral-500">Preparing your dashboard...</p>
      </div>
    </main>
  );
}

export function SessionUnavailable({ onRetry }: { onRetry: () => void }) {
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
          onClick={onRetry}
          className="mt-5 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

export function DashboardHeader({
  firstName,
  onRefresh,
}: {
  firstName: string;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Store overview
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Here&apos;s an overview of your jewellery catalogue.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-neutral-50 sm:self-auto"
      >
        <RefreshCw size={16} />
        Refresh data
      </button>
    </div>
  );
}

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="self-start font-semibold underline sm:self-auto"
      >
        Retry
      </button>
    </div>
  );
}