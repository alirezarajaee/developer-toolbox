/**
 * Site-wide configuration.
 *
 * After creating the GitHub repository, set REPO_URL below (or leave it as
 * "" to hide the header GitHub link). Example:
 *   https://github.com/your-username/developer-toolbox
 *
 * The Pages URL is derived automatically from REPO_URL when present, which
 * keeps the README "Live Demo" instructions in one place.
 */
export const REPO_URL = "";

export const SITE_NAME = "Developer Toolbox";
export const SITE_TAGLINE = "Essential tools for developers, all in one place.";
export const SITE_DESCRIPTION =
  "A fast, privacy-friendly collection of essential tools for developers.";
export const APP_VERSION = "1.0.0";

export function getPagesUrl(): string | null {
  if (!REPO_URL) return null;
  try {
    const url = new URL(REPO_URL);
    const owner = url.pathname.split("/")[1];
    const repo = url.pathname.split("/")[2];
    if (!owner || !repo) return null;
    return `https://${owner}.github.io/${repo}/`;
  } catch {
    return null;
  }
}
