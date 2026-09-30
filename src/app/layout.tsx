import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: {
    default: "Developer Toolbox — Essential Developer Tools",
    template: "%s — Developer Toolbox",
  },
  description:
    "A fast, privacy-friendly collection of essential tools for developers.",
  keywords: [
    "developer tools",
    "json formatter",
    "base64",
    "jwt decoder",
    "regex tester",
    "uuid generator",
    "hash generator",
    "color converter",
  ],
  openGraph: {
    title: "Developer Toolbox — Essential Developer Tools",
    description:
      "A fast, privacy-friendly collection of essential tools for developers.",
    type: "website",
    siteName: "Developer Toolbox",
  },
  twitter: {
    card: "summary",
    title: "Developer Toolbox — Essential Developer Tools",
    description:
      "A fast, privacy-friendly collection of essential tools for developers.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0e14" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
  ],
};

// Applies the persisted theme (dark | light | system) before first paint so
// the correct palette is on screen immediately, with no hydration mismatch.
const themeScript = `(function(){try{var t=localStorage.getItem("toolbox-theme")||"dark";if(t!=="dark"&&t!=="light"&&t!=="system")t="dark";var dark=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var el=document.documentElement;el.classList.remove("dark","light");el.classList.add(dark?"dark":"light");el.dataset.theme=t;}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
