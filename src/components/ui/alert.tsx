import { AlertTriangle, CheckCircle2, Info, XCircle, type LucideIcon } from "lucide-react";

export type AlertVariant = "info" | "warning" | "error" | "success";

const ICONS: Record<AlertVariant, LucideIcon> = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle2,
};

const STYLES: Record<AlertVariant, { box: string; icon: string }> = {
  info: { box: "border-[var(--border)] bg-[var(--muted)]", icon: "text-[var(--accent)]" },
  warning: { box: "border-[var(--warning)]/40 bg-[var(--warning)]/10", icon: "text-[var(--warning)]" },
  error: { box: "border-[var(--danger)]/40 bg-[var(--danger)]/10", icon: "text-[var(--danger)]" },
  success: { box: "border-[var(--success)]/40 bg-[var(--success)]/10", icon: "text-[var(--success)]" },
};

export function Alert({
  variant = "info",
  title,
  children,
}: {
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
}) {
  const Icon = ICONS[variant];
  const style = STYLES[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex gap-2.5 rounded-lg border p-3 text-sm ${style.box}`}
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${style.icon}`} aria-hidden="true" />
      <div className="min-w-0">
        {title ? <div className="font-medium">{title}</div> : null}
        {children ? <div className="text-muted-foreground [&_code]:rounded [&_code]:bg-[var(--input)] [&_code]:px-1 [&_code]:py-px">{children}</div> : null}
      </div>
    </div>
  );
}
