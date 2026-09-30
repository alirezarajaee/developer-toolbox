import type { Metadata } from "next";
import { Github, Lock, Zap } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { APP_VERSION, REPO_URL, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: SITE_DESCRIPTION,
};

export default function AboutPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          About Developer Toolbox
        </h1>
        <p className="text-muted-foreground">
          A lightweight collection of practical tools for developers.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Lock className="size-4 text-[var(--accent)]" aria-hidden="true" /> Privacy first
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every tool runs entirely in your browser. There is no backend, no
          account system and no analytics. Your JSON, tokens, passwords and
          other inputs never leave your device, and only non-sensitive
          preferences (theme, favorites, recently used tool ids) are kept in
          localStorage.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Zap className="size-4 text-[var(--accent)]" aria-hidden="true" /> Technology stack
        </h2>
        <ul className="flex flex-wrap gap-2">
          {["Next.js (static export)", "React", "TypeScript", "Tailwind CSS", "Lucide"].map(
            (item) => (
              <li
                key={item}
                className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-medium"
              >
                {item}
              </li>
            ),
          )}
        </ul>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The site is a fully static export, so it can be hosted on GitHub
          Pages with no server runtime. Tools use native browser APIs — Web
          Crypto for hashing, crypto.randomUUID for identifiers, Intl for
          date formatting.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Github className="size-4 text-[var(--accent)]" aria-hidden="true" /> Open source
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Version {APP_VERSION} · MIT licensed.{" "}
          {REPO_URL ? (
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline underline-offset-2 hover:brightness-110"
            >
              View the source on GitHub
            </a>
          ) : (
            <span>Source code available in the project repository.</span>
          )}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Included tools</h2>
        <ul className="grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <li key={tool.id} className="flex items-center gap-2">
              <tool.icon className="size-3.5" style={{ color: tool.accent }} aria-hidden="true" />
              {tool.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
