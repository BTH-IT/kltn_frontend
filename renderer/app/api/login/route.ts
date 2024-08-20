export async function POST(request: Request) {
  const body = await request.json();
  const sessionToken = body.token as string;
  const refreshToken = body.refreshToken as string;
  const expiresAt = body.expiresAt as string;
  const refreshExpiresDate = body.expiresAt as string;
  const user = body.user as any;

  const userSerialized = encodeURIComponent(JSON.stringify(user));
  if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được access token' },
      {
        status: 400,
      },
    );
  }
  const expiresDate = new Date(expiresAt).toUTCString();
  return Response.json(body, {
    status: 200,
    headers: {
      'Set-Cookie': [
        `access_token=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`,
        `refresh_token=${refreshToken}; Path=/; HttpOnly; Expires=${refreshExpiresDate}; SameSite=Lax; Secure`,
        `current_user=${userSerialized}; Path=/; HttpOnly; Expires=${refreshExpiresDate}; SameSite=Lax; Secure`,
      ].join(', '),
    },
  });
}
