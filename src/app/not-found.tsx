import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <Compass className="size-7 text-[var(--accent)]" aria-hidden="true" />
      </span>
      <h1 className="font-mono text-5xl font-bold tracking-tight">404</h1>
      <h2 className="text-lg font-semibold">Tool not found.</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        The developer tool you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:brightness-110"
      >
        Back to Toolbox
      </Link>
    </div>
  );
}
