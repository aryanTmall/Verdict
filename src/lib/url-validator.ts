/**
 * Validates against SSRF (Server-Side Request Forgery)
 * Blocks private IP ranges, localhost, and cloud metadata endpoints.
 */
export function isSafeUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const host = parsed.hostname.toLowerCase();

    // Block localhost and loopback
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "::1") {
      return false;
    }

    // Block AWS / GCP / Azure metadata endpoint
    if (host === "169.254.169.254" || host.startsWith("metadata.")) {
      return false;
    }

    // Block private RFC1918 IP addresses
    if (
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      host.endsWith(".local") ||
      host.endsWith(".internal")
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
