/* eslint-disable no-unused-vars */
export async function POST(request: Request) {
  return Response.json(
    {
      message: 'Buộc đăng xuất thành công',
    },
    {
      status: 200,
      headers: {
        // Xóa cookie sessionToken
        'Set-Cookie': [
          'access_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
          'refresh_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
          'current_user=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
        ].join(', '),
      },
    },
  );
}
