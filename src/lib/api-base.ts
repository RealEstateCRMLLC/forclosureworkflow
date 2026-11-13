/**
 * API base resolution for Foreclosure Workflow.
 *
 * Why: in production this app is mounted under a path prefix (/foreclosure/
 * via the nginx reverse proxy, with Next basePath set to match). Root-absolute
 * fetch('/api/...') calls resolve to the DOMAIN root — which is the main CRM,
 * not this app — so client-side API calls 404 in production. apiUrl() prefixes
 * our mount path at runtime (derived from window.location) so fetches reach
 * OUR routes. Local dev (app at /) resolves to plain /api/... as before.
 * Mirrors apps/leadg/src/lib/api-base.ts.
 */

const APP_PREFIXES = ['/leadg', '/foreclosure', '/contentplanner', '/media-workflow', '/legacyleads'];

function detectBase(): string {
  if (typeof window === 'undefined') return '';
  const m = APP_PREFIXES.find((p) => window.location.pathname === p || window.location.pathname.startsWith(p + '/'));
  return m || '';
}

/** Build a fetch URL for one of our API routes, prefix-aware in production. */
export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${detectBase()}${p}`;
}
