/**
 * URL-safe Base64 (RFC 4648 §5) helpers used by the JWT decoder.
 * Handles the missing "=" padding some producers emit.
 */
export function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}
