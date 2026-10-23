/**
 * Failure details are stored as human-readable strings coming from the backend:
 *  - YT→SP: "Title: X\nChannel: Y\nDuration: Z\n"
 *  - SP→YT: "Track N: title" / "Track: title (failed to add ...)"
 *  - Fallback: any other string, collapsed to a single line
 *
 * Extracted into its own module so it can be unit-tested without importing
 * the full Next.js page component (see __tests__/app/parseDetail.test.ts).
 */
export function parseDetail(detail: string): { title: string; artist: string } {
  const titleMatch = detail.match(/^Title:\s*(.+)$/m);
  const channelMatch = detail.match(/^Channel:\s*(.+)$/m);
  if (titleMatch) {
    return {
      title: titleMatch[1].trim(),
      artist: channelMatch?.[1]?.trim() ?? "",
    };
  }
  const trackMatch = detail.match(/^Track(?:\s*\d+)?:\s*(.+)$/m);
  if (trackMatch) {
    return { title: trackMatch[1].trim(), artist: "" };
  }
  return { title: detail.replace(/\s+/g, " ").trim(), artist: "" };
}
