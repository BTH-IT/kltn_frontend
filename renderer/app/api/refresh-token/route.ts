import { NextRequest, NextResponse } from 'next/server';

import { KEY_LOCALSTORAGE } from '@/utils';

export async function POST(request: NextRequest) {
  const { refreshToken } = await request.json();

  const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/refresh-token`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (refreshResponse.ok) {
    const { token: newAccessToken } = await refreshResponse.json();

    const response = NextResponse.json({ success: true });
    response.cookies.set(KEY_LOCALSTORAGE.ACCESS_TOKEN, newAccessToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } else {
    const response = NextResponse.json({ success: false }, { status: 401 });
    response.cookies.set(KEY_LOCALSTORAGE.ACCESS_TOKEN, '', {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 0, // To delete the cookie
    });

    response.cookies.set(KEY_LOCALSTORAGE.REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 0, // To delete the cookie
    });

    return response;
  }
}
