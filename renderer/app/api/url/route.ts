/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { NextRequest, NextResponse } from 'next/server';
import urlMetadata from 'url-metadata';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const metadata = await urlMetadata(url);

    const { title, description, image, 'og:image': og, 'og:image:secure_url': ogUrl } = metadata;

    return new NextResponse(JSON.stringify({ title, description, image: image || og || ogUrl, url }));
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Failed to fetch URL' }), {
      status: 500,
    });
  }
}
