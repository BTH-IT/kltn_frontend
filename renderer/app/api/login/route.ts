import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const sessionToken = body.token as string;
  const refreshToken = body.refreshToken as string;
  const refreshExpiresAt = body.refreshTokenExpiresAt as string;
  const user = body.user as any;
  const role = body.role as string;

  const userSerialized = JSON.stringify(user);

  if (!sessionToken) {
    return NextResponse.json({ message: 'Không nhận được access token' }, { status: 400 });
  }

  const refreshExpiresDate = new Date(refreshExpiresAt);

  const response = NextResponse.json(body, { status: 200 });

  response.cookies.set('access_token', sessionToken, {
    path: '/',
    httpOnly: true,
    expires: refreshExpiresDate,
    sameSite: 'lax',
    secure: false, // Đặt là false khi không có HTTPS
  });

  response.cookies.set('refresh_token', refreshToken, {
    path: '/',
    httpOnly: true,
    expires: refreshExpiresDate,
    sameSite: 'lax',
    secure: false, // Đặt là false khi không có HTTPS
  });

  response.cookies.set('current_role', role, {
    path: '/',
    httpOnly: true,
    expires: refreshExpiresDate,
    sameSite: 'lax',
    secure: false, // Đặt là false khi không có HTTPS
  });

  response.cookies.set('current_user', userSerialized, {
    path: '/',
    httpOnly: true,
    expires: refreshExpiresDate,
    sameSite: 'lax',
    secure: false, // Đặt là false khi không có HTTPS
  });

  return response;
}
