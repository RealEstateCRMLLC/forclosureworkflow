import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth protection for all Foreclosure CRM pages + API routes.
 *
 * Replaces next-auth's withAuth wrapper, which never intercepted requests in
 * this stack (Next 16 standalone + basePath): every page rendered publicly
 * and most API routes have no route-level session check, so the public shell
 * was one working DB connection away from exposing lead data. This mirrors
 * the main CRM's hand-written middleware (proven live): valid session token
 * passes; API calls get a JSON 401; pages redirect to /login.
 *
 * Public by design (own auth / signatures): /api/auth, /api/intake,
 * /api/sequences/execute (cron), webhook receivers (ghl, voice, export),
 * /login, Next statics.
 */
export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'default_dev_secret_change_me_in_prod',
  });
  if (token) return NextResponse.next();

  if (pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const signInUrl = new URL('/login', req.url);
  signInUrl.searchParams.set('callbackUrl', pathname + search);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    '/',
    '/((?!api/auth|api/intake|api/sequences/execute|api/integrations/ghl/webhook|api/communications/voice/webhook|api/export/webhook|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
