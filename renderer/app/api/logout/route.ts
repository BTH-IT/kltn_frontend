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
        'Set-Cookie': 'sessionToken=; Path=/; HttpOnly; Max-Age=0',
      },
    },
  );
}
