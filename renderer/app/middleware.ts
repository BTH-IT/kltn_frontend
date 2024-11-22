/* eslint-disable no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=10');

  return res;
}

export const config = {
  matcher: ['/api/:path*', '/pages/:path*', '/dynamic-route/:path*'],
};
