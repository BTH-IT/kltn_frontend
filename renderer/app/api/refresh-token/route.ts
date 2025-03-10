import { NextRequest, NextResponse } from 'next/server';

import { KEY_LOCALSTORAGE } from '@/utils';

export async function POST(request: NextRequest) {
  const { refreshToken, token } = await request.json();

  const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/refresh-token`, {
    method: 'POST',
    body: JSON.stringify({ token, refreshToken }),
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
    // Log status and response text for debugging
    console.error('Token refresh failed with status:', refreshResponse.status);
    console.error('Error response:', await refreshResponse.text());

    const response = NextResponse.json({ success: false }, { status: 401 });
    response.cookies.set(KEY_LOCALSTORAGE.ACCESS_TOKEN, '', {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });

    response.cookies.set(KEY_LOCALSTORAGE.REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });

    response.cookies.set(KEY_LOCALSTORAGE.CURRENT_USER, '', {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });

    response.cookies.set(KEY_LOCALSTORAGE.CURRENT_ROLE, '', {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });

    return response;
  }
}
