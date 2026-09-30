"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";
import { TOOLS, TOOL_CATEGORIES, type Tool } from "@/lib/tools";

const SECTION_LABELS: Record<string, string> = {
  Data: "Data",
  Security: "Security",
  Testing: "Testing",
  Utilities: "Utilities",
};

function NavLink({
  href,
  icon,
  label,
  active,
  onNavigate,
}: {
  href: string;
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
        active
          ? "bg-[var(--muted)] font-medium text-foreground"
          : "text-muted-foreground hover:bg-[var(--muted)] hover:text-foreground"
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const clean = href.replace(/\/$/, "") || "/";
    const current = pathname.replace(/\/$/, "") || "/";
    return clean === "/" ? current === "/" : current === clean;
  };

  return (
    <nav aria-label="Tools" className="flex flex-col gap-5">
      <section>
        <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Overview
        </div>
        <div className="flex flex-col gap-0.5">
          <NavLink
            href="/"
            label="Dashboard"
            active={isActive("/")}
            onNavigate={onNavigate}
          />
        </div>
      </section>

      {TOOL_CATEGORIES.map((category) => (
        <section key={category}>
          <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {SECTION_LABELS[category]}
          </div>
          <div className="flex flex-col gap-0.5">
            {TOOLS.filter((tool) => tool.category === category).map((tool: Tool) => (
              <NavLink
                key={tool.id}
                href={`/tools/${tool.id}/`}
                icon={<tool.icon className="size-4" aria-hidden="true" />}
                label={tool.name.replace(/ Generator$| Encoder \/ Decoder$| Converter$| Checker$| Tester$| Decoder$/, "")}
                active={isActive(`/tools/${tool.id}/`)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      ))}

      <section>
        <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Other
        </div>
        <div className="flex flex-col gap-0.5">
          <NavLink
            href="/favorites/"
            label="Favorites"
            icon={<Star className="size-4" aria-hidden="true" />}
            active={isActive("/favorites/")}
            onNavigate={onNavigate}
          />
          <NavLink
            href="/about/"
            label="About"
            active={isActive("/about/")}
            onNavigate={onNavigate}
          />
        </div>
      </section>
    </nav>
  );
}
